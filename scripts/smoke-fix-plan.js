#!/usr/bin/env node

const crypto = require("node:crypto");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const repoRoot = path.resolve(__dirname, "..");
const tempBase = fs.existsSync("/private/tmp") ? "/private/tmp" : os.tmpdir();
const NPM_CMD = process.env.npm_execpath || (process.platform === "win32" ? "npm.cmd" : "npm");
const GIT_CMD = process.env.GIT || (process.platform === "win32" ? "git.exe" : "git");

function commandEnv(extra = {}) {
  const npmCache = process.env.NPM_CONFIG_CACHE || path.join(tempBase, "mdkg-npm-cache");
  fs.mkdirSync(npmCache, { recursive: true });
  return {
    ...process.env,
    NPM_CONFIG_CACHE: npmCache,
    npm_config_cache: npmCache,
    NPM_CONFIG_DRY_RUN: "false",
    npm_config_dry_run: "false",
    ...extra,
  };
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd || repoRoot,
    env: commandEnv(options.env || {}),
    encoding: "utf8",
    stdio: "pipe",
  });
  if (result.status !== 0) {
    throw new Error(
      [
        `command failed: ${command} ${args.join(" ")}`,
        `cwd: ${options.cwd || repoRoot}`,
        `exit: ${result.status}`,
        `stdout:\n${result.stdout}`,
        `stderr:\n${result.stderr}`,
      ].join("\n")
    );
  }
  return result.stdout.trim();
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function assertExists(filePath) {
  assert(fs.existsSync(filePath), `expected path to exist: ${filePath}`);
}

function parseJson(output) {
  return JSON.parse(output);
}

function mdkg(binPath, args, cwd) {
  return run(binPath, args, { cwd });
}

function packAndInstall(tempRoot) {
  const packDir = path.join(tempRoot, "pack");
  const prefix = path.join(tempRoot, "prefix");
  fs.mkdirSync(packDir, { recursive: true });
  fs.mkdirSync(prefix, { recursive: true });

  const packOutput = run(NPM_CMD, ["pack", "--silent", "--dry-run=false", "--pack-destination", packDir]);
  const tarball = packOutput
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .pop();
  assert(tarball, "npm pack did not return a tarball");
  const tarballPath = path.join(packDir, path.basename(tarball));
  assertExists(tarballPath);

  run(NPM_CMD, ["install", "-g", tarballPath, "--prefix", prefix, "--foreground-scripts"], {
    cwd: tempRoot,
    env: { npm_config_prefix: prefix },
  });
  const binPath = process.platform === "win32" ? path.join(prefix, "mdkg.cmd") : path.join(prefix, "bin", "mdkg");
  const packageRoot = path.join(prefix, "lib", "node_modules", "mdkg");
  assertExists(binPath);
  assertExists(path.join(packageRoot, "README.md"));
  return { binPath, packageRoot, tarballPath };
}

function writeFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, "utf8");
}

function fileSnapshot(root) {
  const entries = {};
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name === ".git") {
        continue;
      }
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
        continue;
      }
      if (entry.isFile()) {
        const relativePath = path.relative(root, fullPath).split(path.sep).join("/");
        entries[relativePath] = crypto.createHash("sha256").update(fs.readFileSync(fullPath)).digest("hex");
      }
    }
  };
  walk(root);
  return entries;
}

function assertNoMutation(root, before, label) {
  const after = fileSnapshot(root);
  assert(JSON.stringify(after) === JSON.stringify(before), `${label} mutated files`);
}

function taskDoc(id, title, extra = {}) {
  return [
    "---",
    `id: ${id}`,
    "type: task",
    `title: ${title}`,
    "status: todo",
    "priority: 1",
    "tags: []",
    "owners: []",
    "links: []",
    "artifacts: []",
    "relates: []",
    `blocked_by: ${extra.blockedBy ?? "[]"}`,
    "blocks: []",
    "refs: []",
    "aliases: []",
    "created: 2026-06-09",
    "updated: 2026-06-09",
    "---",
    "",
    `# ${title}`,
  ].join("\n");
}

function assertHelpAndDocs(packageRoot, binPath, root) {
  const readme = fs.readFileSync(path.join(packageRoot, "README.md"), "utf8");
  const matrix = fs.readFileSync(path.join(packageRoot, "CLI_COMMAND_MATRIX.md"), "utf8");
  const seededReadme = fs.readFileSync(path.join(packageRoot, "dist", "init", "README.md"), "utf8");
  const seededMatrix = fs.readFileSync(path.join(packageRoot, "dist", "init", "CLI_COMMAND_MATRIX.md"), "utf8");
  for (const [label, content] of [
    ["README", readme],
    ["CLI matrix", matrix],
    ["seeded README", seededReadme],
    ["seeded CLI matrix", seededMatrix],
  ]) {
    assert(content.includes("mdkg fix plan"), `${label} is missing mdkg fix plan`);
    assert(content.includes("fix apply") || content.includes("apply behavior"), `${label} is missing apply deferral guidance`);
  }
  const fixHelp = mdkg(binPath, ["help", "fix"], root);
  assert(fixHelp.includes("mdkg fix plan"), "fix help missing usage");
  assert(fixHelp.includes("dry-run only and writes nothing"), "fix help missing dry-run boundary");
  const planHelp = mdkg(binPath, ["help", "fix", "plan"], root);
  assert(planHelp.includes("read-only repair planning"), "fix plan help missing read-only boundary");
  assert(planHelp.includes("receipt-shaped JSON plan"), "fix plan help missing receipt guidance");
  assert(planHelp.includes("fix apply"), "fix plan help missing apply deferral");
}

function main() {
  const tempRoot = fs.mkdtempSync(path.join(tempBase, "mdkg-fix-plan."));
  const { binPath, packageRoot, tarballPath } = packAndInstall(tempRoot);
  const root = path.join(tempRoot, "repo");
  fs.mkdirSync(root, { recursive: true });
  run(GIT_CMD, ["init", "-q"], { cwd: root });

  mdkg(binPath, ["init", "--agent"], root);
  mdkg(binPath, ["index"], root);
  assertHelpAndDocs(packageRoot, binPath, root);
  const initialValidate = parseJson(mdkg(binPath, ["validate", "--json"], root));
  assert(initialValidate.ok === true, "initial validate should be ok");

  fs.rmSync(path.join(root, ".mdkg", "index", "global.json"));
  let before = fileSnapshot(root);
  const missingIndex = parseJson(mdkg(binPath, ["fix", "plan", "--family", "index", "--json"], root));
  assert(missingIndex.proposed_changes.some((change) => change.reason === "generated_cache_missing"), "missing index cache was not planned");
  assertNoMutation(root, before, "missing index fix plan");

  mdkg(binPath, ["index"], root);
  writeFile(path.join(root, ".mdkg", "work", "task-1.md"), taskDoc("task-1", "base task"));
  mdkg(binPath, ["index"], root);
  writeFile(path.join(root, ".mdkg", "work", "task-2.md"), taskDoc("task-2", "missing ref task", { blockedBy: "[task-999]" }));
  writeFile(path.join(root, ".mdkg", "work", "task-3.md"), taskDoc("task-1", "duplicate id task"));

  before = fileSnapshot(root);
  const allPlan = parseJson(mdkg(binPath, ["fix", "plan", "--family", "all", "--json"], root));
  assert(allPlan.action === "fix.plan", "fix plan action mismatch");
  assert(allPlan.summary.apply_supported === true, "duplicate-id findings should support apply");
  assert(allPlan.summary.apply_deferred === true, "index/ref findings should still defer apply");
  const reasons = allPlan.proposed_changes.map((change) => change.reason);
  assert(reasons.includes("generated_cache_stale"), "stale generated cache was not planned");
  assert(reasons.includes("graph_ref_missing"), "missing graph ref was not planned");
  assert(reasons.includes("duplicate_id"), "duplicate id was not planned");
  assert(
    allPlan.proposed_changes.some((change) => change.reason === "duplicate_id" && change.apply_supported === true),
    "duplicate id finding should be apply supported"
  );
  assert(
    allPlan.proposed_changes.some((change) => change.reason === "graph_ref_missing" && change.apply_supported === false),
    "graph ref finding should remain review-only"
  );
  assert(allPlan.risk_counts.low >= 1, "expected low-risk index finding");
  assert(allPlan.risk_counts.medium >= 1, "expected medium-risk refs finding");
  assert(allPlan.risk_counts.high >= 1, "expected high-risk ids finding");
  assertNoMutation(root, before, "all-family fix plan");

  const targetRefs = parseJson(mdkg(binPath, ["fix", "plan", "--family", "refs", "--target", "task-2", "--json"], root));
  assert(targetRefs.proposed_changes.length === 1, "refs target should return one finding");
  assert(targetRefs.proposed_changes[0].reason === "graph_ref_missing", "refs target finding mismatch");
  assertNoMutation(root, before, "targeted refs fix plan");

  const targetIds = parseJson(mdkg(binPath, ["fix", "plan", "--family", "ids", "--target", "task-1", "--json"], root));
  assert(targetIds.proposed_changes.length === 1, "ids target should return one finding");
  assert(targetIds.proposed_changes[0].after.candidate_id === "task-3", "duplicate id candidate mismatch");
  assertNoMutation(root, before, "targeted ids fix plan");

  console.log(
    JSON.stringify(
      {
        action: "smoke-fix-plan",
        ok: true,
        temp_root: tempRoot,
        tarball: tarballPath,
      },
      null,
      2
    )
  );
}

main();
