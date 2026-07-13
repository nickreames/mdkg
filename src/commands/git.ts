import crypto from "crypto";
import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { loadConfig } from "../core/config";
import {
  atomicReplaceContainedFile,
  ensureContainedDirectory,
  withContainedPathSink,
} from "../core/filesystem_authority";
import { resolveConfiguredProjectDbLayout } from "../core/project_db";
import {
  dumpProjectDbSnapshot,
  ProjectDbSnapshotDumpReceipt,
  ProjectDbSnapshotQueuePolicy,
  ProjectDbSnapshotSealReceipt,
  ProjectDbSnapshotStatusReceipt,
  projectDbSnapshotStatus,
  sealProjectDbSnapshot,
} from "../core/project_db_snapshot";
import { collectValidateReceipt, ValidateReceipt } from "./validate";
import { withMutationLock } from "../util/lock";
import { UsageError, ValidationError } from "../util/errors";

type GitRunResult = {
  status: number | null;
  stdout: string;
  stderr: string;
};

type GitRemoteSummary = {
  name: string;
  fetch_url: string;
  push_url: string;
};

type GitStatusEntry = {
  index: string;
  worktree: string;
  path: string;
};

type GitSourceDescriptor = {
  kind: "git";
  repository_ref: string | null;
  remote: string | null;
  branch: string | null;
  access_ref: "external-git-auth";
};

type GitAcceptedRevision = {
  commit_sha: string | null;
  tree_hash: string | null;
  branch: string | null;
};

type GitInspectReceipt = {
  action: "git.inspect";
  ok: true;
  root: string;
  inside_work_tree: boolean;
  branch: string | null;
  head_sha: string | null;
  tree_hash: string | null;
  remotes: GitRemoteSummary[];
  status: {
    clean: boolean;
    entry_count: number;
    entries: GitStatusEntry[];
  };
  source_descriptor: GitSourceDescriptor;
  accepted_revision: GitAcceptedRevision;
  warnings: string[];
};

type GitCloneReceipt = {
  action: "git.clone";
  ok: true;
  repository_ref: string;
  target: string;
  branch: string | null;
  source_descriptor: GitSourceDescriptor;
  accepted_revision: GitAcceptedRevision;
  inspect: GitInspectReceipt;
  warnings: string[];
};

type GitFetchReceipt = {
  action: "git.fetch";
  ok: true;
  remote: string;
  branch: string | null;
  fetch_output: string[];
  inspect: GitInspectReceipt;
  warnings: string[];
};

type GitCloseoutReceipt = {
  action: "git.closeout";
  ok: true;
  root: string;
  output_dir: string;
  generated_at: string;
  git: GitInspectReceipt;
  validation: ValidateReceipt;
  db_participated: boolean;
  db_snapshot_status: ProjectDbSnapshotStatusReceipt | null;
  db_snapshot_seal: ProjectDbSnapshotSealReceipt | null;
  db_snapshot_dump: (Omit<ProjectDbSnapshotDumpReceipt, "dump"> & { dump_sha256: string }) | null;
  static_receipts: {
    json: string;
    markdown: string;
  };
  warnings: string[];
};

type GitPushReadyCheck = {
  name: string;
  ok: boolean;
  level: "ok" | "warn" | "fail";
  detail: string;
  errors: string[];
  warnings: string[];
};

type GitPushReadyReceipt = {
  action: "git.push_ready";
  ok: boolean;
  root: string;
  remote: string;
  branch: string;
  remote_url: string | null;
  git: GitInspectReceipt;
  validation: ValidateReceipt;
  db_snapshot_status: ProjectDbSnapshotStatusReceipt | null;
  checks: GitPushReadyCheck[];
  warning_count: number;
  failure_count: number;
  warnings: string[];
  errors: string[];
};

type GitPushReceipt = {
  action: "git.push";
  ok: true;
  remote: string;
  branch: string;
  head_sha: string | null;
  pushed_ref: string;
  stage_all: boolean;
  closeout: GitCloseoutReceipt | null;
  commit: {
    created: boolean;
    message: string | null;
    sha: string | null;
  };
  push_ready: GitPushReadyReceipt;
  push_output: string[];
  warnings: string[];
};

export type GitInspectCommandOptions = {
  root: string;
  json?: boolean;
};

export type GitCloneCommandOptions = {
  root: string;
  repository: string;
  target: string;
  branch?: string;
  json?: boolean;
};

export type GitFetchCommandOptions = {
  root: string;
  remote?: string;
  branch?: string;
  json?: boolean;
};

export type GitCloseoutCommandOptions = {
  root: string;
  queuePolicy?: ProjectDbSnapshotQueuePolicy;
  output?: string;
  json?: boolean;
};

export type GitPushReadyCommandOptions = {
  root: string;
  remote?: string;
  branch?: string;
  json?: boolean;
};

export type GitPushCommandOptions = {
  root: string;
  remote?: string;
  branch?: string;
  message?: string;
  stageAll?: boolean;
  queuePolicy?: ProjectDbSnapshotQueuePolicy;
  json?: boolean;
};

function toPosix(value: string): string {
  return value.split(path.sep).join("/");
}

function rel(root: string, filePath: string): string {
  return toPosix(path.relative(root, filePath));
}

function stableJson(value: unknown): string {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function sha256Buffer(value: string | Buffer): string {
  return `sha256:${crypto.createHash("sha256").update(value).digest("hex")}`;
}

function isInside(root: string, target: string): boolean {
  const relative = path.relative(root, target);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

function containedPath(root: string, rawPath: string, label: string): string {
  if (rawPath.trim().length === 0) {
    throw new UsageError(`${label} requires a non-empty path`);
  }
  const resolved = path.resolve(root, rawPath);
  if (!isInside(root, resolved)) {
    throw new UsageError(`${label} must stay inside the repo`);
  }
  return resolved;
}

function redactEmbeddedUrlUserinfo(value: string): string {
  return value.replace(/\b([a-z][a-z0-9+.-]*:\/\/)([^@\s/]+(?::[^@\s/]*)?@)/gi, "$1<redacted>@");
}

function redactRemoteRef(value: string): string {
  try {
    const parsed = new URL(value);
    if (parsed.username || parsed.password) {
      return `${parsed.protocol}//<redacted>@${parsed.host}${parsed.pathname}${parsed.search}${parsed.hash}`;
    }
  } catch {
    // Non-URL Git remotes such as git@github.com:org/repo.git are normal and safe to leave.
  }
  return redactEmbeddedUrlUserinfo(value);
}

function hasEmbeddedUrlCredentials(value: string): boolean {
  try {
    const parsed = new URL(value);
    return Boolean(parsed.username || parsed.password);
  } catch {
    return false;
  }
}

function assertNoEmbeddedCredentials(label: string, value: string): void {
  if (hasEmbeddedUrlCredentials(value)) {
    throw new UsageError(`${label} must not contain embedded credentials; use SSH, credential helpers, gh auth, CI env, or shell-managed Git auth`);
  }
}

function assertGitOperand(label: string, value: string): void {
  if (value.length === 0 || value !== value.trim() || value.startsWith("-") || /[\0\r\n\t ]/.test(value)) {
    throw new UsageError(`${label} must be a non-option Git operand without whitespace or control characters`);
  }
}

function assertGitBranch(root: string, branch: string): void {
  assertGitOperand("--branch", branch);
  const result = spawnSync("git", ["check-ref-format", "--branch", branch], {
    cwd: root,
    encoding: "utf8",
    stdio: "pipe",
  });
  if (result.status !== 0) {
    throw new UsageError(`--branch is not a valid Git branch name: ${branch}`);
  }
}

function sanitizeOutput(value: string): string {
  return value
    .split(/\r?\n/)
    .map((line) => redactRemoteRef(line).trimEnd())
    .filter((line) => line.length > 0)
    .join("\n");
}

function git(cwd: string, args: string[], allowFailure = false): GitRunResult {
  const result = spawnSync("git", args, { cwd, encoding: "utf8", stdio: "pipe" });
  const payload: GitRunResult = {
    status: result.status,
    stdout: sanitizeOutput(result.stdout ?? ""),
    stderr: sanitizeOutput(result.stderr ?? ""),
  };
  if (!allowFailure && result.status !== 0) {
    const detail = payload.stderr || payload.stdout || `git ${args[0] ?? ""} failed`;
    throw new ValidationError(detail);
  }
  return payload;
}

function gitOptional(cwd: string, args: string[]): string | null {
  const result = git(cwd, args, true);
  if (result.status !== 0) {
    return null;
  }
  const output = result.stdout.trim();
  return output.length > 0 ? output : null;
}

function requireGitWorkTree(root: string): void {
  const inside = gitOptional(root, ["rev-parse", "--is-inside-work-tree"]);
  if (inside !== "true") {
    throw new ValidationError("mdkg git requires a Git work tree");
  }
}

function parseStatusEntries(raw: string | null): GitStatusEntry[] {
  if (!raw) {
    return [];
  }
  return raw
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => ({
      index: line.slice(0, 1),
      worktree: line.slice(1, 2),
      path: line.slice(3).replace(/^"|"$/g, ""),
    }));
}

function currentBranch(root: string): string | null {
  return gitOptional(root, ["branch", "--show-current"]);
}

function currentHead(root: string): string | null {
  return gitOptional(root, ["rev-parse", "HEAD"]);
}

function currentTree(root: string): string | null {
  return gitOptional(root, ["rev-parse", "HEAD^{tree}"]);
}

function remoteUrl(root: string, remote: string): string | null {
  const value = gitOptional(root, ["remote", "get-url", remote]);
  return value ? redactRemoteRef(value) : null;
}

function rawRemoteUrl(root: string, remote: string): string | null {
  return gitOptional(root, ["remote", "get-url", remote]);
}

function listRemotes(root: string): GitRemoteSummary[] {
  const output = gitOptional(root, ["remote"]);
  if (!output) {
    return [];
  }
  return output
    .split(/\r?\n/)
    .filter(Boolean)
    .sort()
    .map((name) => ({
      name,
      fetch_url: remoteUrl(root, name) ?? "",
      push_url: redactRemoteRef(gitOptional(root, ["remote", "get-url", "--push", name]) ?? ""),
    }));
}

function defaultRepositoryRef(inspect: GitInspectReceipt): string | null {
  const origin = inspect.remotes.find((remote) => remote.name === "origin");
  return origin?.fetch_url ?? inspect.remotes[0]?.fetch_url ?? null;
}

function buildSourceDescriptor(inspect: GitInspectReceipt, remoteName: string | null = "origin"): GitSourceDescriptor {
  return {
    kind: "git",
    repository_ref: defaultRepositoryRef(inspect),
    remote: remoteName,
    branch: inspect.branch,
    access_ref: "external-git-auth",
  };
}

function buildAcceptedRevision(inspect: GitInspectReceipt): GitAcceptedRevision {
  return {
    commit_sha: inspect.head_sha,
    tree_hash: inspect.tree_hash,
    branch: inspect.branch,
  };
}

function collectInspectReceipt(root: string): GitInspectReceipt {
  const inside = gitOptional(root, ["rev-parse", "--is-inside-work-tree"]) === "true";
  const statusEntries = inside ? parseStatusEntries(gitOptional(root, ["status", "--porcelain=v1"])) : [];
  const receipt: GitInspectReceipt = {
    action: "git.inspect",
    ok: true,
    root,
    inside_work_tree: inside,
    branch: inside ? currentBranch(root) : null,
    head_sha: inside ? currentHead(root) : null,
    tree_hash: inside ? currentTree(root) : null,
    remotes: inside ? listRemotes(root) : [],
    status: {
      clean: statusEntries.length === 0,
      entry_count: statusEntries.length,
      entries: statusEntries,
    },
    source_descriptor: {
      kind: "git",
      repository_ref: null,
      remote: "origin",
      branch: null,
      access_ref: "external-git-auth",
    },
    accepted_revision: {
      commit_sha: null,
      tree_hash: null,
      branch: null,
    },
    warnings: [],
  };
  receipt.source_descriptor = buildSourceDescriptor(receipt);
  receipt.accepted_revision = buildAcceptedRevision(receipt);
  if (!inside) {
    receipt.warnings.push("not inside a Git work tree");
  }
  return receipt;
}

function printJson(value: unknown): void {
  console.log(JSON.stringify(value, null, 2));
}

function printInspect(receipt: GitInspectReceipt): void {
  console.log(`git work tree: ${receipt.inside_work_tree ? "yes" : "no"}`);
  console.log(`branch: ${receipt.branch ?? "(detached or unknown)"}`);
  console.log(`head: ${receipt.head_sha ?? "(none)"}`);
  console.log(`tree: ${receipt.tree_hash ?? "(none)"}`);
  console.log(`status: ${receipt.status.clean ? "clean" : `${receipt.status.entry_count} change(s)`}`);
  for (const remote of receipt.remotes) {
    console.log(`remote ${remote.name}: ${remote.fetch_url}`);
  }
}

export function runGitInspectCommand(options: GitInspectCommandOptions): void {
  const receipt = collectInspectReceipt(options.root);
  if (options.json) {
    printJson(receipt);
    return;
  }
  printInspect(receipt);
}

export function runGitCloneCommand(options: GitCloneCommandOptions): void {
  assertNoEmbeddedCredentials("repository", options.repository);
  assertGitOperand("repository", options.repository);
  if (options.branch) {
    assertGitBranch(options.root, options.branch);
  }
  const target = containedPath(options.root, options.target, "--target");
  const targetRelative = rel(options.root, target);
  withContainedPathSink(
    { root: options.root, relativePath: targetRelative, operation: "create" },
    ({ absolutePath }) => {
      if (fs.existsSync(absolutePath) && fs.readdirSync(absolutePath).length > 0) {
        throw new UsageError("--target must be empty or absent");
      }
    }
  );
  const args = ["clone"];
  if (options.branch) {
    args.push("--branch", options.branch);
  }
  args.push("--", options.repository, target);
  git(options.root, args);
  const inspect = collectInspectReceipt(target);
  const receipt: GitCloneReceipt = {
    action: "git.clone",
    ok: true,
    repository_ref: redactRemoteRef(options.repository),
    target: rel(options.root, target),
    branch: options.branch ?? inspect.branch,
    source_descriptor: {
      kind: "git",
      repository_ref: redactRemoteRef(options.repository),
      remote: "origin",
      branch: options.branch ?? inspect.branch,
      access_ref: "external-git-auth",
    },
    accepted_revision: buildAcceptedRevision(inspect),
    inspect,
    warnings: [],
  };
  if (options.json) {
    printJson(receipt);
    return;
  }
  console.log("git clone complete");
  console.log(`target: ${receipt.target}`);
  console.log(`head: ${receipt.accepted_revision.commit_sha ?? "(none)"}`);
}

export function runGitFetchCommand(options: GitFetchCommandOptions): void {
  requireGitWorkTree(options.root);
  const remote = options.remote ?? "origin";
  assertGitOperand("--remote", remote);
  if (options.branch) {
    assertGitBranch(options.root, options.branch);
  }
  assertNoEmbeddedCredentials("--remote", remote);
  const configuredRemoteUrl = rawRemoteUrl(options.root, remote);
  if (configuredRemoteUrl && hasEmbeddedUrlCredentials(configuredRemoteUrl)) {
    throw new UsageError(`remote ${remote} must not contain embedded credentials; use external Git auth`);
  }
  const args = ["fetch", "--", remote];
  if (options.branch) {
    args.push(options.branch);
  }
  const result = git(options.root, args);
  const inspect = collectInspectReceipt(options.root);
  const receipt: GitFetchReceipt = {
    action: "git.fetch",
    ok: true,
    remote,
    branch: options.branch ?? null,
    fetch_output: [...result.stdout.split(/\r?\n/), ...result.stderr.split(/\r?\n/)].filter(Boolean),
    inspect,
    warnings: [],
  };
  if (options.json) {
    printJson(receipt);
    return;
  }
  console.log("git fetch complete");
  console.log(`remote: ${remote}`);
  console.log(`head: ${inspect.head_sha ?? "(none)"}`);
}

function validateForCloseout(root: string): ValidateReceipt {
  const validation = collectValidateReceipt({ root, json: true });
  if (!validation.ok) {
    throw new ValidationError(`closeout requires mdkg validation to pass; found ${validation.error_count} error(s)`);
  }
  return validation;
}

function dbRuntimeParticipated(root: string): boolean {
  const config = loadConfig(root);
  if (!config.db.enabled) {
    return false;
  }
  const layout = resolveConfiguredProjectDbLayout(root, config.db);
  return fs.existsSync(layout.runtimeFile);
}

function closeoutOutputDir(root: string, output?: string): string {
  if (output) {
    return containedPath(root, output, "--output");
  }
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  return path.join(root, ".mdkg", "git", "closeouts", stamp);
}

function closeoutMarkdown(receipt: Omit<GitCloseoutReceipt, "static_receipts">): string {
  const lines = [
    "# mdkg git closeout",
    "",
    `generated_at: ${receipt.generated_at}`,
    `root: ${receipt.root}`,
    `git_head: ${receipt.git.head_sha ?? "(none)"}`,
    `git_tree: ${receipt.git.tree_hash ?? "(none)"}`,
    `git_branch: ${receipt.git.branch ?? "(detached or unknown)"}`,
    `validation_ok: ${receipt.validation.ok}`,
    `validation_errors: ${receipt.validation.error_count}`,
    `validation_warnings: ${receipt.validation.warning_count}`,
    `db_participated: ${receipt.db_participated}`,
  ];
  if (receipt.db_snapshot_seal) {
    lines.push(`db_snapshot: ${receipt.db_snapshot_seal.snapshot}`);
    lines.push(`db_snapshot_sha256: ${receipt.db_snapshot_seal.new_snapshot_sha256}`);
  }
  if (receipt.db_snapshot_dump) {
    lines.push(`db_dump: ${receipt.db_snapshot_dump.output ?? "(stdout)"}`);
    lines.push(`db_dump_sha256: ${receipt.db_snapshot_dump.sha256}`);
  }
  if (receipt.warnings.length > 0) {
    lines.push("", "## Warnings", "");
    for (const warning of receipt.warnings) {
      lines.push(`- ${warning}`);
    }
  }
  lines.push("", "## Boundary", "");
  lines.push("- Git authentication is external; no credentials are recorded.");
  lines.push("- Remote push still requires an explicit mdkg git push command with remote and branch.");
  return `${lines.join("\n")}\n`;
}

function collectCloseoutReceipt(options: GitCloseoutCommandOptions): GitCloseoutReceipt {
  requireGitWorkTree(options.root);
  const config = loadConfig(options.root);
  const validation = validateForCloseout(options.root);
  const inspect = collectInspectReceipt(options.root);
  const outputDir = closeoutOutputDir(options.root, options.output);
  const outputRel = rel(options.root, outputDir);
  const participated = dbRuntimeParticipated(options.root);
  const warnings: string[] = [];
  let dbSnapshotStatus: ProjectDbSnapshotStatusReceipt | null = null;
  let dbSnapshotSeal: ProjectDbSnapshotSealReceipt | null = null;
  let dbSnapshotDump: (Omit<ProjectDbSnapshotDumpReceipt, "dump"> & { dump_sha256: string }) | null = null;

  if (participated) {
    dbSnapshotSeal = sealProjectDbSnapshot(options.root, config, options.queuePolicy ?? "drain");
    const dumpPath = toPosix(path.join(outputRel, "project-db.dump.md"));
    const dumpResult = dumpProjectDbSnapshot(options.root, config, undefined, dumpPath);
    const { dump, ...dumpReceipt } = dumpResult;
    dbSnapshotDump = { ...dumpReceipt, dump_sha256: sha256Buffer(dump) };
    dbSnapshotStatus = projectDbSnapshotStatus(options.root, config);
    if (!dbSnapshotStatus.ok || dbSnapshotStatus.status !== "valid") {
      throw new ValidationError(`db snapshot status must be valid after closeout; got ${dbSnapshotStatus.status}`);
    }
  } else {
    warnings.push("project DB did not participate in this closeout; no DB snapshot was sealed");
  }

  ensureContainedDirectory({ root: options.root, relativePath: outputRel });
  const baseReceipt: Omit<GitCloseoutReceipt, "static_receipts"> = {
    action: "git.closeout",
    ok: true,
    root: options.root,
    output_dir: outputRel,
    generated_at: new Date().toISOString(),
    git: inspect,
    validation,
    db_participated: participated,
    db_snapshot_status: dbSnapshotStatus,
    db_snapshot_seal: dbSnapshotSeal,
    db_snapshot_dump: dbSnapshotDump,
    warnings,
  };
  const jsonPath = path.join(outputDir, "closeout.json");
  const markdownPath = path.join(outputDir, "closeout.md");
  const receipt: GitCloseoutReceipt = {
    ...baseReceipt,
    static_receipts: {
      json: rel(options.root, jsonPath),
      markdown: rel(options.root, markdownPath),
    },
  };
  atomicReplaceContainedFile({ root: options.root, relativePath: rel(options.root, jsonPath) }, stableJson(receipt));
  atomicReplaceContainedFile(
    { root: options.root, relativePath: rel(options.root, markdownPath) },
    closeoutMarkdown(baseReceipt)
  );
  return receipt;
}

export function runGitCloseoutCommand(options: GitCloseoutCommandOptions): void {
  const config = loadConfig(options.root);
  const receipt = withMutationLock(options.root, config.index.lock_timeout_ms, () =>
    collectCloseoutReceipt(options)
  );
  if (options.json) {
    printJson(receipt);
    return;
  }
  console.log("git closeout written");
  console.log(`json: ${receipt.static_receipts.json}`);
  console.log(`markdown: ${receipt.static_receipts.markdown}`);
  if (receipt.db_snapshot_seal) {
    console.log(`db snapshot: ${receipt.db_snapshot_seal.snapshot}`);
  }
}

function check(name: string, ok: boolean, detail: string, error: string | null = null, warning: string | null = null): GitPushReadyCheck {
  return {
    name,
    ok,
    level: ok ? (warning ? "warn" : "ok") : "fail",
    detail,
    errors: ok || !error ? [] : [error],
    warnings: warning ? [warning] : [],
  };
}

function collectPushReadyReceipt(options: GitPushReadyCommandOptions): GitPushReadyReceipt {
  const remote = options.remote;
  const branch = options.branch;
  if (!remote) {
    throw new UsageError("mdkg git push-ready requires --remote <name>");
  }
  if (!branch) {
    throw new UsageError("mdkg git push-ready requires --branch <name>");
  }
  assertGitOperand("--remote", remote);
  assertGitBranch(options.root, branch);
  assertNoEmbeddedCredentials("--remote", remote);
  requireGitWorkTree(options.root);

  const config = loadConfig(options.root);
  const inspect = collectInspectReceipt(options.root);
  const validation = collectValidateReceipt({ root: options.root, json: true });
  const rawUrl = rawRemoteUrl(options.root, remote);
  const redactedRemoteUrl = rawUrl ? redactRemoteRef(rawUrl) : null;
  const checks: GitPushReadyCheck[] = [];

  checks.push(check("remote-explicit", true, `remote target is ${remote}`));
  checks.push(check("branch-explicit", true, `branch target is ${branch}`));
  checks.push(
    check(
      "remote-exists",
      rawUrl !== null,
      rawUrl ? `remote ${remote} exists` : `remote ${remote} missing`,
      `remote ${remote} is not configured`
    )
  );
  if (rawUrl) {
    checks.push(
      check(
        "remote-credential-boundary",
        !hasEmbeddedUrlCredentials(rawUrl),
        "remote URL does not embed credentials",
        "remote URL contains embedded credentials; use external Git auth"
      )
    );
  }
  checks.push(
    check(
      "worktree-clean",
      inspect.status.clean,
      inspect.status.clean ? "working tree is clean" : `${inspect.status.entry_count} changed path(s) present`,
      "working tree must be clean before push-ready"
    )
  );
  checks.push(
    check(
      "validation",
      validation.ok,
      validation.ok ? "mdkg validate passes" : `mdkg validate has ${validation.error_count} error(s)`,
      "mdkg validation must pass before push"
    )
  );

  let snapshotStatus: ProjectDbSnapshotStatusReceipt | null = null;
  if (config.db.enabled) {
    const layout = resolveConfiguredProjectDbLayout(options.root, config.db);
    if (fs.existsSync(layout.runtimeFile)) {
      snapshotStatus = projectDbSnapshotStatus(options.root, config);
      checks.push(
        check(
          "db-snapshot",
          snapshotStatus.ok && snapshotStatus.status === "valid",
          `db snapshot status is ${snapshotStatus.status}`,
          "project DB participated; seal a valid snapshot before push"
        )
      );
    } else {
      checks.push(check("db-snapshot", true, "project DB is enabled but runtime DB is absent", null, "no runtime DB participated in this push"));
    }
  } else {
    checks.push(check("db-snapshot", true, "project DB disabled; no DB closeout required"));
  }

  const errors = checks.flatMap((item) => item.errors.map((error) => `${item.name}: ${error}`));
  const warnings = checks.flatMap((item) => item.warnings.map((warning) => `${item.name}: ${warning}`));
  return {
    action: "git.push_ready",
    ok: errors.length === 0,
    root: options.root,
    remote,
    branch,
    remote_url: redactedRemoteUrl,
    git: inspect,
    validation,
    db_snapshot_status: snapshotStatus,
    checks,
    warning_count: warnings.length,
    failure_count: errors.length,
    warnings,
    errors,
  };
}

export function runGitPushReadyCommand(options: GitPushReadyCommandOptions): void {
  const receipt = collectPushReadyReceipt(options);
  if (options.json) {
    printJson(receipt);
  } else {
    for (const item of receipt.checks) {
      console.log(`${item.level}: ${item.name} - ${item.detail}`);
    }
  }
  if (!receipt.ok) {
    throw new ValidationError(`git push-ready failed with ${receipt.failure_count} issue(s)`);
  }
  if (!options.json) {
    console.log("git push-ready ok");
  }
}

function hasStagedChanges(root: string): boolean {
  const result = git(root, ["diff", "--cached", "--quiet"], true);
  return result.status !== 0;
}

function ensureGitIdentity(root: string): void {
  const email = gitOptional(root, ["config", "user.email"]);
  const name = gitOptional(root, ["config", "user.name"]);
  if (!email || !name) {
    throw new ValidationError("git commit requires user.name and user.email to be configured");
  }
}

function collectPushReceipt(options: GitPushCommandOptions): GitPushReceipt {
  const remote = options.remote;
  const branch = options.branch;
  if (!remote) {
    throw new UsageError("mdkg git push requires --remote <name>");
  }
  if (!branch) {
    throw new UsageError("mdkg git push requires --branch <name>");
  }
  assertGitOperand("--remote", remote);
  assertGitBranch(options.root, branch);
  assertNoEmbeddedCredentials("--remote", remote);
  requireGitWorkTree(options.root);

  let closeout: GitCloseoutReceipt | null = null;
  let commitCreated = false;
  let commitMessage: string | null = null;
  if (options.stageAll) {
    if (!options.message) {
      throw new UsageError("mdkg git push --stage-all requires --message <text>");
    }
    ensureGitIdentity(options.root);
    const config = loadConfig(options.root);
    closeout = withMutationLock(options.root, config.index.lock_timeout_ms, () =>
      collectCloseoutReceipt({
        root: options.root,
        queuePolicy: options.queuePolicy,
        json: true,
      })
    );
    git(options.root, ["add", "-A"]);
    if (hasStagedChanges(options.root)) {
      git(options.root, ["commit", "-m", options.message]);
      commitCreated = true;
      commitMessage = options.message;
    }
  }

  const pushReady = collectPushReadyReceipt({ root: options.root, remote, branch, json: true });
  if (!pushReady.ok) {
    throw new ValidationError(`git push-ready failed with ${pushReady.failure_count} issue(s)`);
  }
  const push = git(options.root, ["push", "--", remote, `HEAD:refs/heads/${branch}`]);
  const inspect = collectInspectReceipt(options.root);
  return {
    action: "git.push",
    ok: true,
    remote,
    branch,
    head_sha: inspect.head_sha,
    pushed_ref: `refs/heads/${branch}`,
    stage_all: Boolean(options.stageAll),
    closeout,
    commit: {
      created: commitCreated,
      message: commitMessage,
      sha: commitCreated ? inspect.head_sha : null,
    },
    push_ready: pushReady,
    push_output: [...push.stdout.split(/\r?\n/), ...push.stderr.split(/\r?\n/)].filter(Boolean),
    warnings: [],
  };
}

export function runGitPushCommand(options: GitPushCommandOptions): void {
  const receipt = collectPushReceipt(options);
  if (options.json) {
    printJson(receipt);
    return;
  }
  console.log("git push complete");
  console.log(`remote: ${receipt.remote}`);
  console.log(`branch: ${receipt.branch}`);
  console.log(`head: ${receipt.head_sha ?? "(none)"}`);
  if (receipt.commit.created) {
    console.log(`commit: ${receipt.commit.sha}`);
  }
}
