import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";
import { TextDecoder } from "util";
import { ValidationError } from "../util/errors";

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
  original_path?: string;
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

export type GitInspectCommandOptions = {
  root: string;
  json?: boolean;
};

function redactRemoteRef(value: string): string {
  // These are display descriptors, never transport-ready authentication data.
  // Preserve normal local/SCP syntax; opaque helpers and malformed URL-like
  // values cannot be safely interpreted as URLs, so do not echo their payload.
  if (/[\x00-\x1f\x7f]/.test(value)) return "<redacted remote descriptor>";
  if (/^[a-z]:[\\/]/i.test(value) || value.startsWith("\\\\")) return value;
  if (/^[^/\\:]+::/.test(value)) return "<redacted remote helper descriptor>";
  if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(value)) {
    return value.includes("://") ? "<redacted remote descriptor>" : value;
  }
  try {
    const parsed = new URL(value);
    if (!parsed.host && parsed.protocol !== "file:") return "<redacted remote descriptor>";
    // Do not use a list of secret parameter names: omit the entire URL query
    // and fragment. Encoded delimiters in the path are ordinary path bytes.
    return value.split(/[?#]/, 1)[0].replace(/^([a-z][a-z0-9+.-]*:\/\/)[^/]*@/i, "$1<redacted>@");
  } catch {
    return "<redacted remote descriptor>";
  }
}

function observationError(command: string): ValidationError {
  return new ValidationError(`Git ${command} observation failed; no inspection receipt emitted`);
}

function git(cwd: string, args: string[], allowedFailures: number[] = [], input?: string): GitRunResult {
  const result = spawnSync("git", ["-c", "core.fsmonitor=false", ...args], {
    cwd, input, stdio: "pipe", env: { ...process.env, GIT_OPTIONAL_LOCKS: "0", LC_ALL: "C" },
  });
  // Retain the subprocess buffer ceiling, but never turn failure, truncation,
  // or undecodable path bytes into a successful partial/clean observation.
  if (result.error || result.signal || result.status === null) throw observationError(args[0]);
  if (result.status !== 0 && !allowedFailures.includes(result.status)) throw observationError(args[0]);
  const payload: GitRunResult = {
    status: result.status,
    stdout: "",
    stderr: "",
  };
  try {
    const decoder = new TextDecoder("utf-8", { fatal: true, ignoreBOM: true });
    payload.stdout = decoder.decode(result.stdout);
    payload.stderr = decoder.decode(result.stderr);
  } catch {
    throw observationError(args[0]);
  }
  return payload;
}

function gitLine(cwd: string, args: string[]): string {
  // Remove only Git's output terminator, not whitespace from authored values.
  return git(cwd, args).stdout.replace(/\r?\n$/, "");
}

function parseStatusEntries(raw: string): GitStatusEntry[] {
  if (!raw) return [];
  if (!raw.endsWith("\0")) throw observationError("status");
  const records = raw.slice(0, -1).split("\0");
  const entries: GitStatusEntry[] = [];
  for (let i = 0; i < records.length; i++) {
    const record = records[i];
    const code = record.slice(0, 2);
    if (record.length < 4 || record[2] !== " " || !/^[ MADRCUT?!]{2}$/.test(code) || code === "  " ||
        (/[?!]/.test(code) && code !== "??" && code !== "!!")) throw observationError("status");
    const entry: GitStatusEntry = { index: code[0], worktree: code[1], path: record.slice(3) };
    // Porcelain v1 -z emits destination first, then a separate source record.
    if (/[RC]/.test(code)) {
      if (!records[i + 1]) throw observationError("status");
      entry.original_path = records[++i];
    }
    entries.push(entry);
  }
  return entries;
}

function currentBranch(root: string): string | null {
  return gitLine(root, ["branch", "--show-current"]) || null;
}

function currentHead(root: string): string | null {
  const result = git(root, ["rev-parse", "--verify", "--quiet", "HEAD"], [1]);
  if (result.status === 1) return null;
  return objectId(result.stdout);
}

function objectId(raw: string): string {
  const value = raw.replace(/\r?\n$/, "");
  if (!/^(?:[0-9a-f]{40}|[0-9a-f]{64})$/.test(value)) throw observationError("rev-parse");
  return value;
}

function currentTree(root: string, head: string): string {
  return objectId(git(root, ["rev-parse", "--verify", `${head}^{tree}`]).stdout);
}

function insideWorkTree(root: string): boolean {
  const result = git(root, ["rev-parse", "--is-inside-work-tree"], [128]);
  if (result.status === 128 && result.stderr.startsWith("fatal: not a git repository")) return false;
  if (result.status !== 0 || !/^(true|false)\r?\n$/.test(result.stdout)) throw observationError("rev-parse");
  return result.stdout.startsWith("true");
}

function nulRecords(raw: string, command: string): string[] {
  if (!raw) return [];
  if (!raw.endsWith("\0")) throw observationError(command);
  return raw.slice(0, -1).split("\0");
}

function assertNoContentFilterExecution(root: string, visited = new Set<string>()): void {
  // Native status can run clean/process filters while refreshing tracked paths,
  // including inside initialized submodules. Such a result cannot be both
  // faithful and helper-free: refuse it, rather than disable normalization and
  // misreport clean files as changed. Configuration values are never emitted.
  const realRoot = fs.realpathSync(root);
  if (visited.has(realRoot)) throw observationError("status");
  visited.add(realRoot);
  const configured = git(root, ["config", "--null", "--get-regexp", "^filter\\..*\\.(clean|process)$"], [1]);
  const settings = new Map<string, string>();
  for (const record of nulRecords(configured.stdout, "config")) {
    const separator = record.indexOf("\n");
    if (separator < 0) throw observationError("config");
    settings.set(record.slice(0, separator), record.slice(separator + 1));
  }
  const drivers = new Set<string>();
  for (const [key, value] of settings) {
    const match = /^filter\.(.*)\.(clean|process)$/.exec(key);
    if (!match) throw observationError("config");
    if (value) drivers.add(match[1]);
  }
  const tracked = new Set<string>();
  const submodules = new Set<string>();
  for (const record of nulRecords(git(root, ["ls-files", "--stage", "-z"]).stdout, "ls-files")) {
    const match = /^([0-7]{6}) (?:[0-9a-f]{40}|[0-9a-f]{64}) [0-3]\t([\s\S]+)$/.exec(record);
    if (!match) throw observationError("ls-files");
    if (match[1] === "160000") submodules.add(match[2]);
    else tracked.add(match[2]);
  }
  if (drivers.size && tracked.size) {
    const attrs = nulRecords(git(root, ["check-attr", "-z", "--stdin", "filter"], [], [...tracked].join("\0") + "\0").stdout, "check-attr");
    if (attrs.length !== tracked.size * 3) throw observationError("check-attr");
    for (let i = 0; i < attrs.length; i += 3) {
      if (!tracked.has(attrs[i]) || attrs[i + 1] !== "filter") throw observationError("check-attr");
      if (drivers.has(attrs[i + 2])) {
        throw new ValidationError("Git status observation requires a configured content filter; inspection refuses helper execution. Use native Git only after reviewing that filter.");
      }
    }
  }
  for (const relative of submodules) {
    const child = path.resolve(realRoot, relative);
    const contained = path.relative(realRoot, child);
    if (!contained || contained.startsWith(".." + path.sep) || contained === ".." || path.isAbsolute(contained)) throw observationError("ls-files");
    // Uninitialized submodules have no working-tree filter to execute.
    if (!fs.existsSync(path.join(child, ".git"))) continue;
    const realChild = fs.realpathSync(child);
    if (realChild !== child) throw observationError("status");
    assertNoContentFilterExecution(child, visited);
  }
}

function listRemotes(root: string): GitRemoteSummary[] {
  const output = gitLine(root, ["remote"]);
  if (!output) {
    return [];
  }
  return output
    .split(/\r?\n/)
    .filter(Boolean)
    .sort()
    .map((name) => ({
      name,
      fetch_url: redactRemoteRef(gitLine(root, ["remote", "get-url", "--", name])),
      push_url: redactRemoteRef(gitLine(root, ["remote", "get-url", "--push", "--", name])),
    }));
}

function buildSourceDescriptor(inspect: GitInspectReceipt): GitSourceDescriptor {
  const remote = inspect.remotes.find((item) => item.name === "origin") ?? inspect.remotes[0];
  return {
    kind: "git",
    repository_ref: remote?.fetch_url ?? null,
    remote: remote?.name ?? null,
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
  const inside = insideWorkTree(root);
  if (inside) assertNoContentFilterExecution(root);
  const statusEntries = inside ? parseStatusEntries(git(root, ["status", "--porcelain=v1", "-z", "--untracked-files=all"]).stdout) : [];
  const head = inside ? currentHead(root) : null;
  const receipt: GitInspectReceipt = {
    action: "git.inspect",
    ok: true,
    root,
    inside_work_tree: inside,
    branch: inside ? currentBranch(root) : null,
    head_sha: head,
    tree_hash: head ? currentTree(root, head) : null,
    remotes: inside ? listRemotes(root) : [],
    status: {
      clean: inside && statusEntries.length === 0,
      entry_count: statusEntries.length,
      entries: statusEntries,
    },
    source_descriptor: {
      kind: "git",
      repository_ref: null,
      remote: null,
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
