#!/usr/bin/env node

const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const packageVersion = JSON.parse(fs.readFileSync(path.join(repoRoot, "package.json"), "utf8")).version;
const tempBase = process.env.MDKG_SMOKE_TMPDIR || os.tmpdir();
const NPM_CMD = process.env.npm_execpath || "npm";
const GIT_CMD = process.env.GIT || "git";

function commandEnv(extra = {}) {
  return {
    ...process.env,
    NPM_CONFIG_CACHE: process.env.NPM_CONFIG_CACHE || "/private/tmp/mdkg-npm-cache",
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
      `${command} ${args.join(" ")} failed with ${result.status}\nSTDOUT:\n${result.stdout}\nSTDERR:\n${result.stderr}`
    );
  }
  return {
    stdout: result.stdout.trim(),
    stderr: result.stderr.trim(),
    combined: `${result.stdout}${result.stderr}`,
  };
}

function assertExists(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`expected path to exist: ${filePath}`);
  }
}

function assertIncludes(value, expected, label) {
  if (!value.includes(expected)) {
    throw new Error(`${label} missing ${expected}`);
  }
}

function initGit(root) {
  fs.mkdirSync(root, { recursive: true });
  run(GIT_CMD, ["init", "-q"], { cwd: root });
}

function mdkg(binPath, args, cwd) {
  return run(binPath, args, { cwd });
}

function packAndInstall(tempRoot) {
  const packDir = path.join(tempRoot, "pack");
  const prefix = path.join(tempRoot, "npm-prefix");
  fs.mkdirSync(packDir, { recursive: true });
  fs.mkdirSync(prefix, { recursive: true });

  const packOutput = run(NPM_CMD, ["pack", "--silent", "--dry-run=false", "--pack-destination", packDir], {
    cwd: repoRoot,
  }).stdout;
  const tarballName = packOutput
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .pop();
  if (!tarballName) {
    throw new Error("unable to determine npm pack output tarball");
  }
  const tarballPath = path.join(packDir, path.basename(tarballName));
  assertExists(tarballPath);

  const install = run(NPM_CMD, ["install", "-g", tarballPath, "--prefix", prefix, "--foreground-scripts"], {
    cwd: tempRoot,
    env: { npm_config_prefix: prefix },
  });
  assertIncludes(install.combined, `mdkg ${packageVersion} installed.`, "postinstall");

  const binPath = process.platform === "win32"
    ? path.join(prefix, "mdkg.cmd")
    : path.join(prefix, "bin", "mdkg");
  assertExists(binPath);
  return binPath;
}

function parseJson(output) {
  return JSON.parse(output);
}

function assertNoPendingUpgrade(binPath, root) {
  const receipt = parseJson(mdkg(binPath, ["upgrade", "--json"], root).stdout);
  if (!receipt.dry_run || receipt.changes.length !== 0) {
    throw new Error(`expected no pending upgrade changes, got ${JSON.stringify(receipt, null, 2)}`);
  }
}

function exerciseUpgrade(binPath, tempRoot) {
  const root = path.join(tempRoot, "legacy-style-workspace");
  initGit(root);
  mdkg(binPath, ["init", "--agent"], root);
  fs.rmSync(path.join(root, ".mdkg", "init-manifest.json"), { force: true });

  const dryRun = parseJson(mdkg(binPath, ["upgrade", "--dry-run", "--json"], root).stdout);
  if (!dryRun.dry_run) {
    throw new Error("upgrade --dry-run did not report dry_run=true");
  }
  if (dryRun.safe_to_apply !== true) {
    throw new Error("upgrade dry-run did not report safe_to_apply=true for safe managed changes");
  }
  if (!dryRun.changes.some((change) => change.action === "create" && change.path === "AGENTS.md")) {
    throw new Error("upgrade dry-run did not plan missing AGENTS.md creation");
  }
  if (!dryRun.will_write_paths.includes(".mdkg/init-manifest.json")) {
    throw new Error("upgrade dry-run did not expose init manifest apply side effect");
  }

  const apply = parseJson(mdkg(binPath, ["upgrade", "--apply", "--json"], root).stdout);
  if (apply.dry_run) {
    throw new Error("upgrade --apply reported dry_run=true");
  }
  if (!apply.apply_side_effects.some((change) => change.category === "init_manifest")) {
    throw new Error("upgrade --apply did not report init manifest side effect");
  }
  assertExists(path.join(root, "AGENTS.md"));
  assertExists(path.join(root, "CLAUDE.md"));
  assertExists(path.join(root, ".mdkg", "init-manifest.json"));
  mdkg(binPath, ["validate"], root);
  assertNoPendingUpgrade(binPath, root);

  const customRoot = path.join(tempRoot, "custom-workspace");
  initGit(customRoot);
  mdkg(binPath, ["init", "--agent"], customRoot);
  const customContent = "# Custom agent start\n";
  fs.writeFileSync(path.join(customRoot, "AGENT_START.md"), customContent, "utf8");
  const customReceipt = parseJson(mdkg(binPath, ["upgrade", "--apply", "--json"], customRoot).stdout);
  if (customReceipt.safe_to_apply !== true) {
    throw new Error("custom upgrade with preserved files should be safe to apply");
  }
  if (!customReceipt.changes.some((change) => change.action === "conflict" && change.path === "AGENT_START.md")) {
    throw new Error("custom AGENT_START.md was not reported as a conflict");
  }
  if (!customReceipt.preserved_customizations.some((change) => change.path === "AGENT_START.md")) {
    throw new Error("custom AGENT_START.md was not reported as a preserved customization");
  }
  if (fs.readFileSync(path.join(customRoot, "AGENT_START.md"), "utf8") !== customContent) {
    throw new Error("custom AGENT_START.md was overwritten");
  }

  const oldTemplateRoot = path.join(tempRoot, "old-template-workspace");
  initGit(oldTemplateRoot);
  mdkg(binPath, ["init"], oldTemplateRoot);
  mdkg(binPath, ["new", "task", "Old Template Workspace", "--status", "todo", "--priority", "1"], oldTemplateRoot);
  for (const name of ["spec", "work", "work_order", "receipt", "feedback", "dispute", "proposal"]) {
    fs.rmSync(path.join(oldTemplateRoot, ".mdkg", "templates", "default", `${name}.md`), { force: true });
  }
  const doctor = mdkg(binPath, ["doctor"], oldTemplateRoot).stdout;
  assertIncludes(doctor, "warn: local-templates", "old-template doctor");
  const validate = mdkg(binPath, ["validate"], oldTemplateRoot).combined;
  assertIncludes(validate, "bundled template schema fallback", "old-template validate");
  mdkg(binPath, ["show", "task-1", "--meta"], oldTemplateRoot);
  const oldTemplateDryRun = parseJson(mdkg(binPath, ["upgrade", "--dry-run", "--json"], oldTemplateRoot).stdout);
  if (!oldTemplateDryRun.will_write_paths.includes(".mdkg/templates/default/spec.md")) {
    throw new Error("old-template upgrade did not plan to vendor missing agent workflow templates");
  }

  const ignoredEventsRoot = path.join(tempRoot, "ignored-events-workspace");
  initGit(ignoredEventsRoot);
  mdkg(binPath, ["init", "--agent"], ignoredEventsRoot);
  fs.rmSync(path.join(ignoredEventsRoot, ".mdkg", "work", "events", "events.jsonl"), { force: true });
  fs.writeFileSync(path.join(ignoredEventsRoot, ".gitignore"), ".mdkg/work/events/\n", "utf8");
  const ignoredEventsDryRun = parseJson(mdkg(binPath, ["upgrade", "--dry-run", "--json"], ignoredEventsRoot).stdout);
  if (
    !ignoredEventsDryRun.changes.some(
      (change) => change.action === "skip" && change.path === ".mdkg/work/events/events.jsonl"
    )
  ) {
    throw new Error("ignored event log was not reported as skipped");
  }
  if (ignoredEventsDryRun.will_write_paths.includes(".mdkg/work/events/events.jsonl")) {
    throw new Error("ignored event log should not be in will_write_paths");
  }
}

function runSmoke() {
  let tempRoot;
  try {
    tempRoot = fs.mkdtempSync(path.join(tempBase, "mdkg-upgrade-smoke-"));
    const binPath = packAndInstall(tempRoot);
    const version = mdkg(binPath, ["--version"], tempRoot).stdout;
    if (version !== packageVersion) {
      throw new Error(`expected mdkg version ${packageVersion}, got ${version}`);
    }
    exerciseUpgrade(binPath, tempRoot);
    console.log("upgrade smoke passed");
    console.log(`version=${version}`);
  } finally {
    if (tempRoot && process.env.MDKG_KEEP_SMOKE_TMP !== "1") {
      fs.rmSync(tempRoot, { recursive: true, force: true });
    }
  }
}

runSmoke();
