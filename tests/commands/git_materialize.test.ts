import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { spawn, spawnSync, SpawnSyncReturns } from "node:child_process";
import { makeTempDir, writeFile } from "../helpers/fs";
import { writeRootConfig } from "../helpers/config";
import { writeDefaultTemplates } from "../helpers/templates";

const cliPath = path.resolve(__dirname, "..", "..", "cli.js");
const realGit = spawnSync("git", ["--exec-path"], { encoding: "utf8" }).status === 0
  ? (spawnSync("which", ["git"], { encoding: "utf8" }).stdout.trim() || "git")
  : "git";

type SourceFixture = {
  root: string;
  repositoryRef: string;
  commit: string;
  tree: string;
  objectFormat: "sha1" | "sha256";
};

type MaterializeReceipt = {
  schema: string;
  action: string;
  ok: boolean;
  reason_code: string;
  request_hash: string | null;
  repository: { transport: string | null; label: string | null; ref_hash: string | null };
  source_ref: string | null;
  access_ref: string | null;
  correlation_ref: string | null;
  evidence_refs: string[];
  target_ref: string | null;
  observed_revision: { commit: string | null; tree: string | null; object_format: string | null };
  policies: {
    auth: {
      capability: string | null;
      available: boolean;
      status: string;
      reason_code: string;
    };
    depth: "full" | number | null;
    submodules: {
      policy: string | null;
      gitmodules_present: boolean;
      gitlink_count: number;
      gitlink_hash: string | null;
      initialized: boolean;
    };
    project_memory: {
      policy: string | null;
      present: boolean;
      valid: boolean | null;
      error_count: number;
    };
  };
  destination: { path: string | null; state: string; published: boolean };
  cleanup: { state: string; temporary_paths_remaining: number };
  warnings: string[];
};

function runCli(
  root: string,
  args: string[],
  options: { input?: string; env?: NodeJS.ProcessEnv } = {}
): SpawnSyncReturns<string> {
  return spawnSync(process.execPath, [cliPath, ...args], {
    cwd: root,
    encoding: "utf8",
    input: options.input,
    env: options.env ?? process.env,
  });
}

function runCliOk(root: string, args: string[], options: { input?: string; env?: NodeJS.ProcessEnv } = {}): SpawnSyncReturns<string> {
  const result = runCli(root, args, options);
  assert.equal(result.status, 0, `${args.join(" ")}\n${result.stdout}\n${result.stderr}`);
  return result;
}

function gitResult(root: string, args: string[], env: NodeJS.ProcessEnv = process.env): SpawnSyncReturns<string> {
  return spawnSync(realGit, args, { cwd: root, encoding: "utf8", env });
}

function git(root: string, args: string[], env: NodeJS.ProcessEnv = process.env): string {
  const result = gitResult(root, args, env);
  assert.equal(result.status, 0, `git ${args.join(" ")}\n${result.stdout}\n${result.stderr}`);
  return result.stdout.trim();
}

function makeConsumerRoot(prefix: string): string {
  const root = makeTempDir(prefix);
  writeRootConfig(root);
  writeDefaultTemplates(root);
  return root;
}

function configureGitIdentity(root: string): void {
  git(root, ["config", "user.email", "materialize@example.test"]);
  git(root, ["config", "user.name", "materialize test"]);
}

function makeSource(prefix: string, objectFormat: "sha1" | "sha256" = "sha1"): SourceFixture | null {
  const root = makeTempDir(prefix);
  const initArgs = ["init", "-q", "-b", "main"];
  if (objectFormat === "sha256") initArgs.splice(1, 0, "--object-format=sha256");
  const initialized = gitResult(root, initArgs);
  if (initialized.status !== 0) return null;
  configureGitIdentity(root);
  writeFile(path.join(root, "README.md"), "neutral materialization fixture\n");
  git(root, ["add", "README.md"]);
  git(root, ["commit", "-q", "-m", "fixture"]);
  return {
    root,
    repositoryRef: pathToFileURL(root).href,
    commit: git(root, ["rev-parse", "HEAD"]),
    tree: git(root, ["rev-parse", "HEAD^{tree}"]),
    objectFormat,
  };
}

function makeMdkgSource(prefix: string): SourceFixture {
  const root = makeConsumerRoot(prefix);
  runCliOk(root, ["index"]);
  git(root, ["init", "-q", "-b", "main"]);
  configureGitIdentity(root);
  git(root, ["add", "-A"]);
  git(root, ["commit", "-q", "-m", "mdkg fixture"]);
  return {
    root,
    repositoryRef: pathToFileURL(root).href,
    commit: git(root, ["rev-parse", "HEAD"]),
    tree: git(root, ["rev-parse", "HEAD^{tree}"]),
    objectFormat: "sha1",
  };
}

function requestFor(source: SourceFixture, destination: string, overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    schema: "mdkg.git.materialize.request.v1",
    source_ref: "source://neutral/materialization-fixture",
    repository_ref: source.repositoryRef,
    access_ref: "auth://external/unauthenticated",
    auth_capability: "unauthenticated",
    target_ref: "refs/heads/main",
    expected_commit: source.commit,
    expected_tree: source.tree,
    destination,
    depth: "full",
    submodule_policy: "deny",
    project_memory_policy: "optional",
    correlation_ref: "correlation://materialization/test",
    evidence_refs: ["evidence://fixture/commit"],
    ...overrides,
  };
}

function writeRequest(root: string, value: unknown, name = "request.json"): string {
  const requestPath = path.join(root, ".requests", name);
  writeFile(requestPath, typeof value === "string" ? value : `${JSON.stringify(value, null, 2)}\n`);
  return requestPath;
}

function materialize(
  root: string,
  request: unknown,
  options: { env?: NodeJS.ProcessEnv; stdin?: boolean; name?: string } = {}
): { result: SpawnSyncReturns<string>; receipt: MaterializeReceipt } {
  const raw = typeof request === "string" ? request : `${JSON.stringify(request, null, 2)}\n`;
  const requestPath = options.stdin ? "-" : writeRequest(root, raw, options.name);
  const result = runCli(root, ["git", "materialize", "--request", requestPath, "--json"], {
    input: options.stdin ? raw : undefined,
    env: options.env,
  });
  let receipt: MaterializeReceipt;
  try {
    receipt = JSON.parse(result.stdout) as MaterializeReceipt;
  } catch {
    assert.fail(`materialize did not emit JSON\nstdout: ${result.stdout}\nstderr: ${result.stderr}`);
  }
  return { result, receipt };
}

function assertNoTemporaryMaterializationPaths(root: string, destination: string): void {
  const parent = path.dirname(path.join(root, destination));
  if (!fs.existsSync(parent)) return;
  const prefix = `.${path.basename(destination)}.mdkg-`;
  assert.equal(fs.readdirSync(parent).some((entry) => entry.startsWith(prefix)), false);
}

function installGitWrapper(root: string, body: string): { bin: string; log: string } {
  const bin = path.join(root, "git-bin");
  const log = path.join(root, "git-invocations.log");
  fs.mkdirSync(bin, { recursive: true });
  const wrapper = path.join(bin, "git");
  writeFile(
    wrapper,
    [
      "#!/bin/sh",
      'printf "%s\\n" "$*" >> "$MDKG_TEST_GIT_LOG"',
      body,
      'exec "$MDKG_TEST_REAL_GIT" "$@"',
      "",
    ].join("\n")
  );
  fs.chmodSync(wrapper, 0o755);
  return { bin, log };
}

function wrapperEnv(wrapper: { bin: string; log: string }, extra: NodeJS.ProcessEnv = {}): NodeJS.ProcessEnv {
  return {
    ...process.env,
    PATH: `${wrapper.bin}${path.delimiter}${process.env.PATH ?? ""}`,
    MDKG_TEST_REAL_GIT: realGit,
    MDKG_TEST_GIT_LOG: wrapper.log,
    ...extra,
  };
}

test("git materialize accepts equivalent file and stdin requests with stable bounded receipts", () => {
  const source = makeSource("mdkg-materialize-source-");
  assert.ok(source);
  const fileRoot = makeConsumerRoot("mdkg-materialize-file-");
  const stdinRoot = makeConsumerRoot("mdkg-materialize-stdin-");
  const request = requestFor(source, "sources/accepted");

  const fromFile = materialize(fileRoot, request);
  const fromStdin = materialize(stdinRoot, request, { stdin: true });
  for (const { result, receipt } of [fromFile, fromStdin]) {
    assert.equal(result.status, 0, result.stderr);
    assert.equal(receipt.schema, "mdkg.git.materialize.receipt.v1");
    assert.equal(receipt.action, "git.materialize");
    assert.equal(receipt.ok, true);
    assert.equal(receipt.reason_code, "accepted");
    assert.equal(receipt.observed_revision.commit, source.commit);
    assert.equal(receipt.observed_revision.tree, source.tree);
    assert.equal(receipt.observed_revision.object_format, "sha1");
    assert.equal(receipt.destination.state, "accepted");
    assert.equal(receipt.cleanup.state, "complete");
    assert.equal(receipt.cleanup.temporary_paths_remaining, 0);
    assert.equal(receipt.repository.transport, "file");
    assert.match(receipt.repository.label ?? "", /^file:/);
    assert.match(receipt.repository.ref_hash ?? "", /^sha256:[0-9a-f]{64}$/);
    assert.doesNotMatch(result.stdout, new RegExp(source.root.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    assert.ok(Buffer.byteLength(result.stdout) < 8 * 1024);
    assert.equal(result.stderr, "");
  }
  assert.equal(fromFile.receipt.request_hash, fromStdin.receipt.request_hash);
  assert.equal(fromFile.receipt.source_ref, request.source_ref);
  assert.equal(fromFile.receipt.access_ref, request.access_ref);
  assert.equal(fromFile.receipt.correlation_ref, request.correlation_ref);
  assert.deepEqual(fromFile.receipt.evidence_refs, request.evidence_refs);
  assert.equal(fs.readFileSync(path.join(fileRoot, "sources", "accepted", "README.md"), "utf8"), "neutral materialization fixture\n");
  assert.equal(git(path.join(fileRoot, "sources", "accepted"), ["status", "--porcelain=v1", "--untracked-files=all"]), "");
});

test("git materialize rejects oversized stdin before EOF without invoking Git", async () => {
  const root = makeConsumerRoot("mdkg-materialize-stdin-limit-");
  const wrapper = installGitWrapper(root, "");
  const child = spawn(process.execPath, [cliPath, "git", "materialize", "--request", "-", "--json"], {
    cwd: root,
    env: wrapperEnv(wrapper),
    stdio: ["pipe", "pipe", "pipe"],
  });
  let stdout = "";
  let stderr = "";
  child.stdout.setEncoding("utf8");
  child.stderr.setEncoding("utf8");
  child.stdout.on("data", (chunk: string) => { stdout += chunk; });
  child.stderr.on("data", (chunk: string) => { stderr += chunk; });

  child.stdin.write(Buffer.alloc(64 * 1024 + 1, 0x20));
  const status = await Promise.race([
    new Promise<number | null>((resolve) => child.on("close", resolve)),
    new Promise<never>((_, reject) => setTimeout(() => reject(new Error("oversized stdin was not rejected before EOF")), 5_000)),
  ]);
  child.stdin.destroy();

  assert.equal(status, 2, stderr);
  const receipt = JSON.parse(stdout) as MaterializeReceipt;
  assert.equal(receipt.reason_code, "invalid_request");
  assert.equal(receipt.request_hash, null);
  assert.equal(receipt.destination.published, false);
  assert.equal(fs.existsSync(wrapper.log), false, "oversized stdin invoked Git before rejection");
});

test("git materialize accepts a valid stdin request at the exact byte limit", () => {
  const source = makeSource("mdkg-materialize-stdin-exact-source-");
  assert.ok(source);
  const root = makeConsumerRoot("mdkg-materialize-stdin-exact-");
  const request = JSON.stringify(requestFor(source, "sources/exact-limit"));
  const paddingLength = 64 * 1024 - Buffer.byteLength(request);
  assert.ok(paddingLength > 0);
  const exactRequest = `${request}${" ".repeat(paddingLength)}`;
  assert.equal(Buffer.byteLength(exactRequest), 64 * 1024);

  const accepted = materialize(root, exactRequest, { stdin: true });
  assert.equal(accepted.result.status, 0, accepted.result.stderr);
  assert.equal(accepted.receipt.reason_code, "accepted");
});

test("git materialize rejects malformed strict requests before Git executes", () => {
  const source = makeSource("mdkg-materialize-invalid-source-");
  assert.ok(source);
  const cases: Array<{ name: string; value: string | Record<string, unknown> }> = [
    { name: "yaml", value: "schema: mdkg.git.materialize.request.v1\n" },
    { name: "duplicate", value: `{"schema":"mdkg.git.materialize.request.v1","schema":"duplicate"}` },
    { name: "missing", value: requestFor(source, "out-missing", { access_ref: undefined }) },
    { name: "wrong-type", value: requestFor(source, "out-wrong-type", { source_ref: 42 }) },
    { name: "control", value: requestFor(source, "out-control", { source_ref: "source://bad\nref" }) },
    { name: "unknown", value: requestFor(source, "out-unknown", { extra: true }) },
    { name: "credential", value: requestFor(source, "out-credential", { repository_ref: "https://user:secret@example.test/repo.git" }) },
    { name: "query-secret", value: requestFor(source, "out-query", { repository_ref: "https://example.test/repo.git?token=secret" }) },
    { name: "protocol", value: requestFor(source, "out-protocol", { repository_ref: "ext::sh -c bad" }) },
    { name: "option", value: requestFor(source, "out-option", { repository_ref: "--upload-pack=bad" }) },
    { name: "target", value: requestFor(source, "out-target", { target_ref: "main" }) },
    { name: "object", value: requestFor(source, "out-object", { expected_commit: source.commit.slice(0, 12) }) },
    { name: "depth", value: requestFor(source, "out-depth", { depth: 0 }) },
    { name: "submodule", value: requestFor(source, "out-submodule", { submodule_policy: "recurse" }) },
    { name: "memory", value: requestFor(source, "out-memory", { project_memory_policy: "execute" }) },
    { name: "destination-parent", value: requestFor(source, "../outside") },
    { name: "destination-absolute", value: requestFor(source, path.join(source.root, "outside")) },
    { name: "destination-option", value: requestFor(source, "--outside") },
  ];

  for (const entry of cases) {
    const root = makeConsumerRoot(`mdkg-materialize-invalid-${entry.name}-`);
    const wrapper = installGitWrapper(root, "");
    const { result, receipt } = materialize(root, entry.value, {
      env: wrapperEnv(wrapper),
      name: `${entry.name}.json`,
    });
    assert.equal(result.status, 2, entry.name);
    assert.equal(receipt.ok, false, entry.name);
    assert.equal(receipt.reason_code, "invalid_request", entry.name);
    assert.equal(receipt.destination.published, false, entry.name);
    assert.equal(fs.existsSync(wrapper.log), false, `${entry.name} invoked Git before request validation`);
    assert.doesNotMatch(`${result.stdout}\n${result.stderr}`, /user:secret|token=secret/);
  }
});

test("git materialize rejects credential-shaped receipt refs before Git without echoing them", () => {
  const source = makeSource("mdkg-materialize-secret-ref-source-");
  assert.ok(source);
  const inertMarkers = [
    ["ghp", "A".repeat(36)].join("_"),
    ["github", "pat", "11", "B".repeat(32)].join("_"),
    ["sk", "proj", "C".repeat(32)].join("-"),
    ["xoxb", "D".repeat(24)].join("-"),
    ["AKIA", "E".repeat(16)].join(""),
    ["eyJheader", "eyJpayload", "signaturevalue"].join("."),
    ["token", "inert-value"].join("="),
    ["private-key", "inert"].join(":"),
  ];
  const fields = ["source_ref", "access_ref", "correlation_ref", "evidence_refs"] as const;

  for (const field of fields) {
    for (const marker of inertMarkers) {
      const root = makeConsumerRoot(`mdkg-materialize-secret-ref-${field}-`);
      const wrapper = installGitWrapper(root, "");
      const override = field === "evidence_refs" ? { evidence_refs: [marker] } : { [field]: marker };
      const rejected = materialize(root, requestFor(source, `sources/${field}`, override), {
        env: wrapperEnv(wrapper),
      });
      assert.equal(rejected.result.status, 2, `${field} accepted a credential-shaped ref`);
      assert.equal(rejected.receipt.reason_code, "invalid_request");
      assert.equal(fs.existsSync(wrapper.log), false, `${field} invoked Git before ref rejection`);
      assert.equal(`${rejected.result.stdout}\n${rejected.result.stderr}`.includes(marker), false);
    }
  }
});

test("git materialize preserves documented opaque receipt refs exactly", () => {
  const source = makeSource("mdkg-materialize-opaque-ref-source-");
  assert.ok(source);
  const root = makeConsumerRoot("mdkg-materialize-opaque-ref-");
  const request = requestFor(source, "sources/opaque-refs", {
    source_ref: "catalog://org/source-v1",
    access_ref: "policy://git/public-read",
    correlation_ref: "run://materialization/42",
    evidence_refs: ["evidence://approval/17", "root:chk-530"],
  });
  const accepted = materialize(root, request);
  assert.equal(accepted.result.status, 0, accepted.result.stderr);
  assert.equal(accepted.receipt.source_ref, request.source_ref);
  assert.equal(accepted.receipt.access_ref, request.access_ref);
  assert.equal(accepted.receipt.correlation_ref, request.correlation_ref);
  assert.deepEqual(accepted.receipt.evidence_refs, request.evidence_refs);
});

test("git materialize accepts the Git transport form as a valid credential-free repository ref", () => {
  const source = makeSource("mdkg-materialize-git-transport-source-");
  assert.ok(source);
  const root = makeConsumerRoot("mdkg-materialize-git-transport-");
  const wrapper = installGitWrapper(root, 'case " $* " in *" clone "*) exit 7;; esac');
  const attempted = materialize(root, requestFor(source, "sources/git-transport", {
    repository_ref: "git://example.test/neutral/repository.git",
  }), { env: wrapperEnv(wrapper) });
  assert.equal(attempted.result.status, 2);
  assert.equal(attempted.receipt.reason_code, "remote_unavailable");
  assert.match(fs.readFileSync(wrapper.log, "utf8"), /git:\/\/example\.test/);
});

test("git materialize represents an absolute local repository path only by bounded label and hash", () => {
  const source = makeSource("mdkg-materialize-local-path-source-");
  assert.ok(source);
  const root = makeConsumerRoot("mdkg-materialize-local-path-");
  const local = materialize(root, requestFor(source, "sources/local", {
    repository_ref: source.root,
  }));
  assert.equal(local.result.status, 0, local.result.stderr);
  assert.equal(local.receipt.repository.transport, "local");
  assert.match(local.receipt.repository.label ?? "", /^local:/);
  assert.match(local.receipt.repository.ref_hash ?? "", /^sha256:[0-9a-f]{64}$/);
  assert.doesNotMatch(local.result.stdout, new RegExp(source.root.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
});

test("git materialize closes missing moved commit and tree mismatches without publishing", () => {
  const source = makeSource("mdkg-materialize-identity-source-");
  assert.ok(source);
  const failures = [
    {
      name: "missing-ref",
      override: { target_ref: "refs/heads/missing" },
      reason: "target_ref_missing",
    },
    {
      name: "commit-mismatch",
      override: { expected_commit: "0".repeat(source.commit.length) },
      reason: "commit_mismatch",
    },
    {
      name: "tree-mismatch",
      override: { expected_tree: "0".repeat(source.tree.length) },
      reason: "tree_mismatch",
    },
  ];
  for (const item of failures) {
    const root = makeConsumerRoot(`mdkg-materialize-${item.name}-`);
    const destination = `sources/${item.name}`;
    const { result, receipt } = materialize(root, requestFor(source, destination, item.override));
    assert.equal(result.status, 2);
    assert.equal(receipt.reason_code, item.reason);
    assert.equal(receipt.destination.state, "absent");
    assert.equal(receipt.cleanup.state, "complete");
    assert.equal(fs.existsSync(path.join(root, destination)), false);
    assertNoTemporaryMaterializationPaths(root, destination);
  }

  const oldCommit = source.commit;
  writeFile(path.join(source.root, "README.md"), "moved ref\n");
  git(source.root, ["add", "README.md"]);
  git(source.root, ["commit", "-q", "-m", "move ref"]);
  const movedRoot = makeConsumerRoot("mdkg-materialize-moved-ref-");
  const moved = materialize(movedRoot, requestFor(source, "sources/moved", {
    expected_commit: oldCommit,
    expected_tree: undefined,
  }));
  assert.equal(moved.result.status, 2);
  assert.equal(moved.receipt.reason_code, "commit_mismatch");
});

test("git materialize resolves an annotated full tag ref to its accepted commit", () => {
  const source = makeSource("mdkg-materialize-tag-source-");
  assert.ok(source);
  git(source.root, ["tag", "-a", "accepted-v1", "-m", "accepted tag"]);
  const root = makeConsumerRoot("mdkg-materialize-tag-");
  const tagged = materialize(root, requestFor(source, "sources/tagged", {
    target_ref: "refs/tags/accepted-v1",
  }));
  assert.equal(tagged.result.status, 0, tagged.result.stderr);
  assert.equal(tagged.receipt.observed_revision.commit, source.commit);
  assert.equal(tagged.receipt.observed_revision.tree, source.tree);
});

test("git materialize enforces existing and linked destination containment", (t) => {
  const source = makeSource("mdkg-materialize-containment-source-");
  assert.ok(source);
  const existingRoot = makeConsumerRoot("mdkg-materialize-existing-");
  fs.mkdirSync(path.join(existingRoot, "sources", "existing"), { recursive: true });
  const existing = materialize(existingRoot, requestFor(source, "sources/existing"));
  assert.equal(existing.result.status, 2);
  assert.equal(existing.receipt.reason_code, "destination_exists");
  assert.deepEqual(fs.readdirSync(path.join(existingRoot, "sources", "existing")), []);

  const linkedRoot = makeConsumerRoot("mdkg-materialize-linked-");
  const outside = makeTempDir("mdkg-materialize-outside-");
  try {
    fs.symlinkSync(outside, path.join(linkedRoot, "sources"), "dir");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "EPERM") {
      t.skip("symbolic links unavailable");
      return;
    }
    throw error;
  }
  const linked = materialize(linkedRoot, requestFor(source, "sources/linked"));
  assert.equal(linked.result.status, 2);
  assert.equal(linked.receipt.reason_code, "invalid_request");
  assert.deepEqual(fs.readdirSync(outside), []);
});

test("git materialize enforces declared auth availability without exposing environment values", () => {
  const source = makeSource("mdkg-materialize-auth-source-");
  assert.ok(source);

  const unavailableRoot = makeConsumerRoot("mdkg-materialize-auth-unavailable-");
  const unavailableEnv = { ...process.env };
  delete unavailableEnv.SSH_AUTH_SOCK;
  const unavailable = materialize(unavailableRoot, requestFor(source, "sources/ssh", {
    auth_capability: "ssh-agent",
    access_ref: "auth://external/ssh-agent",
  }), { env: unavailableEnv });
  assert.equal(unavailable.result.status, 2);
  assert.equal(unavailable.receipt.reason_code, "auth_unavailable");
  assert.equal(unavailable.receipt.policies.auth.available, false);
  assert.equal(unavailable.receipt.policies.auth.status, "unavailable");
  assert.equal(unavailable.receipt.policies.auth.reason_code, "ssh_agent_unavailable");

  const sshRoot = makeConsumerRoot("mdkg-materialize-auth-ssh-");
  const ssh = materialize(sshRoot, requestFor(source, "sources/ssh-available", {
    auth_capability: "ssh-agent",
    access_ref: "auth://external/ssh-agent",
  }), { env: { ...process.env, SSH_AUTH_SOCK: "/private/tmp/DO_NOT_RECORD_SSH_SOCKET" } });
  assert.equal(ssh.result.status, 0, ssh.result.stderr);
  assert.equal(ssh.receipt.policies.auth.reason_code, "ssh_agent_available");
  assert.doesNotMatch(ssh.result.stdout, /DO_NOT_RECORD_SSH_SOCKET/);

  const envRoot = makeConsumerRoot("mdkg-materialize-auth-env-");
  const environment = materialize(envRoot, requestFor(source, "sources/environment", {
    auth_capability: "git-environment",
    access_ref: "auth://external/git-environment",
  }), { env: { ...process.env, GIT_SSH_COMMAND: "DO_NOT_RECORD_ENV_VALUE" } });
  assert.equal(environment.result.status, 0, environment.result.stderr);
  assert.equal(environment.receipt.policies.auth.available, true);
  assert.doesNotMatch(environment.result.stdout, /DO_NOT_RECORD_ENV_VALUE/);

  const helperRoot = makeConsumerRoot("mdkg-materialize-auth-helper-");
  const helper = materialize(helperRoot, requestFor(source, "sources/helper", {
    auth_capability: "credential-helper",
    access_ref: "auth://external/credential-helper",
  }), {
    env: {
      ...process.env,
      GIT_CONFIG_COUNT: "1",
      GIT_CONFIG_KEY_0: "credential.helper",
      GIT_CONFIG_VALUE_0: "store",
    },
  });
  assert.equal(helper.result.status, 0, helper.result.stderr);
  assert.equal(helper.receipt.policies.auth.available, true);
  assert.doesNotMatch(helper.result.stdout, /credential\.helper|store/);

  const ghRoot = makeConsumerRoot("mdkg-materialize-auth-gh-");
  const ghWrapper = installGitWrapper(ghRoot, "");
  const ghPath = path.join(ghWrapper.bin, "gh");
  writeFile(ghPath, "#!/bin/sh\nprintf 'DO_NOT_RECORD_GH_OUTPUT\\n'\nexit 0\n");
  fs.chmodSync(ghPath, 0o755);
  const gh = materialize(ghRoot, requestFor(source, "sources/gh", {
    auth_capability: "gh",
    access_ref: "auth://external/gh",
  }), { env: wrapperEnv(ghWrapper) });
  assert.equal(gh.result.status, 0, gh.result.stderr);
  assert.equal(gh.receipt.policies.auth.reason_code, "gh_authenticated");
  assert.doesNotMatch(gh.result.stdout, /DO_NOT_RECORD_GH_OUTPUT/);
});

test("git materialize supports positive depth and SHA-256 object identity when Git supports it", (t) => {
  const source = makeSource("mdkg-materialize-depth-source-");
  assert.ok(source);
  const root = makeConsumerRoot("mdkg-materialize-depth-");
  const wrapper = installGitWrapper(root, "");
  const depth = materialize(root, requestFor(source, "sources/depth", { depth: 1 }), {
    env: wrapperEnv(wrapper),
  });
  assert.equal(depth.result.status, 0, depth.result.stderr);
  assert.equal(depth.receipt.policies.depth, 1);
  assert.equal(depth.receipt.observed_revision.commit, source.commit);
  const depthInvocations = fs.readFileSync(wrapper.log, "utf8").split(/\r?\n/).filter(Boolean);
  assert.equal(depthInvocations.filter((line) => line.includes("--depth=1")).length, 2);
  assert.equal(
    depthInvocations.some((line) => line.includes(`fetch ${source.commit}`) || line.includes(`fetch origin ${source.commit}`)),
    false
  );

  const sha256 = makeSource("mdkg-materialize-sha256-source-", "sha256");
  if (!sha256) {
    t.skip("system Git does not support SHA-256 repositories");
    return;
  }
  const shaRoot = makeConsumerRoot("mdkg-materialize-sha256-");
  const result = materialize(shaRoot, requestFor(sha256, "sources/sha256"));
  assert.equal(result.result.status, 0, result.result.stderr);
  assert.equal(result.receipt.observed_revision.object_format, "sha256");
  assert.equal(result.receipt.observed_revision.commit?.length, 64);
  assert.equal(result.receipt.observed_revision.tree?.length, 64);
});

test("git materialize denies or ignores submodules without recursive initialization", () => {
  const child = makeSource("mdkg-materialize-submodule-child-");
  const source = makeSource("mdkg-materialize-submodule-source-");
  assert.ok(child);
  assert.ok(source);
  git(source.root, ["-c", "protocol.file.allow=always", "submodule", "add", "-q", child.root, "vendor/child"]);
  git(source.root, ["commit", "-q", "-am", "add submodule"]);
  source.commit = git(source.root, ["rev-parse", "HEAD"]);
  source.tree = git(source.root, ["rev-parse", "HEAD^{tree}"]);

  const denyRoot = makeConsumerRoot("mdkg-materialize-submodule-deny-");
  const denied = materialize(denyRoot, requestFor(source, "sources/denied"));
  assert.equal(denied.result.status, 2);
  assert.equal(denied.receipt.reason_code, "submodules_denied");
  assert.equal(denied.receipt.policies.submodules.gitmodules_present, true);
  assert.equal(denied.receipt.policies.submodules.gitlink_count, 1);
  assert.match(denied.receipt.policies.submodules.gitlink_hash ?? "", /^sha256:[0-9a-f]{64}$/);

  const ignoreRoot = makeConsumerRoot("mdkg-materialize-submodule-ignore-");
  const ignored = materialize(ignoreRoot, requestFor(source, "sources/ignored", {
    submodule_policy: "ignore",
  }));
  assert.equal(ignored.result.status, 0, ignored.result.stderr);
  assert.equal(ignored.receipt.policies.submodules.initialized, false);
  assert.equal(ignored.receipt.policies.submodules.gitlink_count, 1);
  assert.equal(ignored.receipt.policies.submodules.gitlink_hash, denied.receipt.policies.submodules.gitlink_hash);
  assert.match(ignored.receipt.warnings.join("\n"), /uninitialized/);
  assert.deepEqual(fs.readdirSync(path.join(ignoreRoot, "sources", "ignored", "vendor", "child")), []);
});

test("git materialize enforces required optional and forbidden project-memory policies without mutation", () => {
  const ordinary = makeSource("mdkg-materialize-memory-ordinary-");
  assert.ok(ordinary);
  const optionalRoot = makeConsumerRoot("mdkg-materialize-memory-optional-");
  const optional = materialize(optionalRoot, requestFor(ordinary, "sources/optional"));
  assert.equal(optional.result.status, 0, optional.result.stderr);
  assert.equal(optional.receipt.policies.project_memory.present, false);
  assert.equal(optional.receipt.policies.project_memory.valid, null);

  const requiredAbsentRoot = makeConsumerRoot("mdkg-materialize-memory-required-absent-");
  const requiredAbsent = materialize(requiredAbsentRoot, requestFor(ordinary, "sources/required", {
    project_memory_policy: "required",
  }));
  assert.equal(requiredAbsent.result.status, 2);
  assert.equal(requiredAbsent.receipt.reason_code, "project_memory_required");
  assert.equal(requiredAbsent.receipt.policies.project_memory.valid, false);

  const malformed = makeSource("mdkg-materialize-memory-malformed-source-");
  assert.ok(malformed);
  writeFile(path.join(malformed.root, ".mdkg", "config.json"), "{not-json\n");
  git(malformed.root, ["add", ".mdkg/config.json"]);
  git(malformed.root, ["commit", "-q", "-m", "malformed memory"]);
  malformed.commit = git(malformed.root, ["rev-parse", "HEAD"]);
  malformed.tree = git(malformed.root, ["rev-parse", "HEAD^{tree}"]);
  const malformedRoot = makeConsumerRoot("mdkg-materialize-memory-malformed-");
  const malformedResult = materialize(malformedRoot, requestFor(malformed, "sources/malformed"));
  assert.equal(malformedResult.result.status, 2);
  assert.equal(malformedResult.receipt.reason_code, "project_memory_invalid");
  assert.equal(malformedResult.receipt.policies.project_memory.present, true);
  assert.equal(malformedResult.receipt.policies.project_memory.valid, false);
  assert.equal(malformedResult.receipt.policies.project_memory.error_count, 1);

  const mdkgSource = makeMdkgSource("mdkg-materialize-memory-source-");
  const requiredRoot = makeConsumerRoot("mdkg-materialize-memory-required-");
  const executionMarker = path.join(requiredRoot, "REPOSITORY_SCRIPT_EXECUTED");
  writeFile(
    path.join(mdkgSource.root, "package.json"),
    `${JSON.stringify({ scripts: { test: `printf executed > ${executionMarker}` } }, null, 2)}\n`
  );
  writeFile(path.join(mdkgSource.root, "scripts", "run-me.sh"), `#!/bin/sh\nprintf executed > ${executionMarker}\n`);
  fs.chmodSync(path.join(mdkgSource.root, "scripts", "run-me.sh"), 0o755);
  git(mdkgSource.root, ["add", "package.json", "scripts/run-me.sh"]);
  git(mdkgSource.root, ["commit", "-q", "-m", "add inert repository scripts"]);
  mdkgSource.commit = git(mdkgSource.root, ["rev-parse", "HEAD"]);
  mdkgSource.tree = git(mdkgSource.root, ["rev-parse", "HEAD^{tree}"]);
  const required = materialize(requiredRoot, requestFor(mdkgSource, "sources/required", {
    project_memory_policy: "required",
  }));
  assert.equal(required.result.status, 0, required.result.stderr);
  assert.equal(required.receipt.policies.project_memory.present, true);
  assert.equal(required.receipt.policies.project_memory.valid, true);
  assert.equal(fs.existsSync(executionMarker), false);
  assert.equal(git(path.join(requiredRoot, "sources", "required"), ["status", "--porcelain=v1", "--untracked-files=all"]), "");
  assert.equal(
    git(path.join(requiredRoot, "sources", "required"), ["ls-files", "--others", "--ignored", "--exclude-standard"]),
    ""
  );

  const forbiddenRoot = makeConsumerRoot("mdkg-materialize-memory-forbidden-");
  const forbidden = materialize(forbiddenRoot, requestFor(mdkgSource, "sources/forbidden", {
    project_memory_policy: "forbidden",
  }));
  assert.equal(forbidden.result.status, 2);
  assert.equal(forbidden.receipt.reason_code, "project_memory_forbidden");
  assert.equal(forbidden.receipt.policies.project_memory.present, true);
});

test("git materialize disables repository hooks, never pushes or recurses, and discards raw Git output", () => {
  const source = makeSource("mdkg-materialize-boundary-source-");
  assert.ok(source);
  const root = makeConsumerRoot("mdkg-materialize-boundary-");
  const marker = path.join(root, "HOOK_EXECUTED");
  const template = path.join(root, "git-template", "hooks");
  fs.mkdirSync(template, { recursive: true });
  const hook = path.join(template, "post-checkout");
  writeFile(hook, `#!/bin/sh\nprintf executed > ${JSON.stringify(marker)}\n`);
  fs.chmodSync(hook, 0o755);
  const wrapper = installGitWrapper(root, "");
  const accepted = materialize(root, requestFor(source, "sources/boundary"), {
    env: wrapperEnv(wrapper, { GIT_TEMPLATE_DIR: path.dirname(template) }),
  });
  assert.equal(accepted.result.status, 0, accepted.result.stderr);
  assert.equal(fs.existsSync(marker), false);
  const invocations = fs.readFileSync(wrapper.log, "utf8").split(/\r?\n/).filter(Boolean);
  const tokens = invocations.flatMap((line) => line.split(/\s+/));
  assert.equal(tokens.includes("push"), false);
  assert.equal(tokens.includes("--recurse-submodules"), false);
  assert.equal(tokens.includes("submodule"), false);

  const failureRoot = makeConsumerRoot("mdkg-materialize-output-redaction-");
  const failingWrapper = installGitWrapper(
    failureRoot,
    'case " $* " in *" clone "*) printf "DO_NOT_LEAK_RAW_GIT_SECRET\\n" >&2; exit 7;; esac'
  );
  const failed = materialize(failureRoot, requestFor(source, "sources/failure"), {
    env: wrapperEnv(failingWrapper),
  });
  assert.equal(failed.result.status, 2);
  assert.equal(failed.receipt.reason_code, "remote_unavailable");
  assert.doesNotMatch(`${failed.result.stdout}\n${failed.result.stderr}`, /DO_NOT_LEAK_RAW_GIT_SECRET/);
});

test("git materialize cancellation terminates Git and removes bounded temporary state", async (t) => {
  if (process.platform === "win32") {
    t.skip("POSIX process-group cancellation contract");
    return;
  }
  const source = makeSource("mdkg-materialize-cancel-source-");
  assert.ok(source);
  const root = makeConsumerRoot("mdkg-materialize-cancel-");
  const requestPath = writeRequest(root, requestFor(source, "sources/cancelled"));
  const wrapper = installGitWrapper(root, 'case " $* " in *" clone "*) sleep 30;; esac');
  const env = wrapperEnv(wrapper);

  const child = spawn(process.execPath, [cliPath, "git", "materialize", "--request", requestPath, "--json"], {
    cwd: root,
    env,
    stdio: ["ignore", "pipe", "pipe"],
  });
  let stdout = "";
  let stderr = "";
  child.stdout.setEncoding("utf8");
  child.stderr.setEncoding("utf8");
  child.stdout.on("data", (chunk: string) => { stdout += chunk; });
  child.stderr.on("data", (chunk: string) => { stderr += chunk; });

  const deadline = Date.now() + 5_000;
  while ((!fs.existsSync(wrapper.log) || !fs.readFileSync(wrapper.log, "utf8").includes(" clone ")) && Date.now() < deadline) {
    await new Promise((resolve) => setTimeout(resolve, 25));
  }
  assert.equal(fs.existsSync(wrapper.log), true, "Git clone did not start before cancellation deadline");
  child.kill("SIGTERM");
  const status = await new Promise<number | null>((resolve) => child.on("close", resolve));
  assert.equal(status, 2, stderr);
  const receipt = JSON.parse(stdout) as MaterializeReceipt;
  assert.equal(receipt.reason_code, "cancelled");
  assert.equal(receipt.destination.state, "absent");
  assert.equal(receipt.cleanup.state, "complete");
  assert.equal(fs.existsSync(path.join(root, "sources", "cancelled")), false);
  assertNoTemporaryMaterializationPaths(root, "sources/cancelled");
});
