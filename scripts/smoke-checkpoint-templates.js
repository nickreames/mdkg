#!/usr/bin/env node

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const repoRoot = path.resolve(__dirname, "..");
const packageVersion = JSON.parse(fs.readFileSync(path.join(repoRoot, "package.json"), "utf8")).version;
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
  return { stdout: result.stdout.trim(), stderr: result.stderr.trim(), combined: `${result.stdout}${result.stderr}` };
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function parseJson(output) {
  return JSON.parse(output);
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
  assert(tarballName, "unable to determine npm pack output tarball");
  const tarballPath = path.join(packDir, path.basename(tarballName));
  assert(fs.existsSync(tarballPath), `expected tarball: ${tarballPath}`);

  const install = run(NPM_CMD, ["install", "-g", tarballPath, "--prefix", prefix, "--foreground-scripts"], {
    cwd: tempRoot,
    env: { npm_config_prefix: prefix },
  });
  assert(install.combined.includes(`mdkg ${packageVersion} installed.`), "postinstall output missing package version");

  const binPath = process.platform === "win32" ? path.join(prefix, "mdkg.cmd") : path.join(prefix, "bin", "mdkg");
  assert(fs.existsSync(binPath), `expected mdkg bin: ${binPath}`);
  return { binPath, tarballPath };
}

function mdkg(binPath, args, cwd) {
  return run(binPath, args, { cwd });
}

function git(cwd, args) {
  return run(GIT_CMD, args, { cwd });
}

function assertCheckpointBody(root, receipt, kind) {
  assert(receipt.checkpoint.kind === kind, `expected checkpoint kind ${kind}`);
  const filePath = path.join(root, receipt.checkpoint.path);
  assert(fs.existsSync(filePath), `expected checkpoint file ${filePath}`);
  const content = fs.readFileSync(filePath, "utf8");
  assert(content.includes(`checkpoint_kind: ${kind}`), `checkpoint missing kind ${kind}`);
  for (const heading of [
    "## Command Evidence",
    "## Pass / Fail Status",
    "## Known Warnings",
    "## Changed Surfaces",
    "## Boundaries",
    "## Follow-up Refs",
  ]) {
    assert(content.includes(heading), `checkpoint ${kind} missing ${heading}`);
  }
  return filePath;
}

function main() {
  const tempRoot = fs.mkdtempSync(path.join(tempBase, "mdkg-checkpoint-templates-smoke-"));
  const { binPath, tarballPath } = packAndInstall(tempRoot);
  const root = path.join(tempRoot, "repo");
  fs.mkdirSync(root, { recursive: true });
  git(root, ["init", "-q"]);

  mdkg(binPath, ["init", "--agent"], root);
  const task = parseJson(
    mdkg(binPath, ["new", "task", "checkpoint smoke task", "--status", "todo", "--priority", "1", "--json"], root).stdout
  ).node;

  const kinds = ["implementation", "test-proof", "goal-closeout", "audit", "handoff"];
  for (const kind of kinds) {
    const receipt = parseJson(
      mdkg(
        binPath,
        [
          "checkpoint",
          "new",
          `${kind} checkpoint`,
          "--kind",
          kind,
          "--relates",
          task.id,
          "--scope",
          task.id,
          "--json",
        ],
        root
      ).stdout
    );
    assertCheckpointBody(root, receipt, kind);
  }

  const doneTask = parseJson(
    mdkg(binPath, ["new", "task", "checkpoint done task", "--status", "todo", "--priority", "1", "--json"], root).stdout
  ).node;
  const doneReceipt = parseJson(
    mdkg(
      binPath,
      [
        "task",
        "done",
        doneTask.id,
        "--checkpoint",
        "task done handoff",
        "--checkpoint-kind",
        "handoff",
        "--json",
      ],
      root
    ).stdout
  );
  assertCheckpointBody(root, doneReceipt, "handoff");

  const rawPath = assertCheckpointBody(
    root,
    parseJson(mdkg(binPath, ["checkpoint", "new", "raw marker audit", "--kind", "audit", "--json"], root).stdout),
    "audit"
  );
  fs.appendFileSync(rawPath, "\nRAW_PAYLOAD_MARKER\n", "utf8");
  const validateWithWarning = parseJson(mdkg(binPath, ["validate", "--json"], root).stdout);
  assert(validateWithWarning.ok === true, "raw marker warning should not fail validation");
  assert(
    validateWithWarning.warnings.some((warning) => warning.includes("raw-content.raw_payload warning")),
    "missing raw payload warning"
  );
  fs.writeFileSync(rawPath, fs.readFileSync(rawPath, "utf8").replace("\nRAW_PAYLOAD_MARKER\n", "\n"), "utf8");

  mdkg(binPath, ["index"], root);
  const validate = parseJson(mdkg(binPath, ["validate", "--json"], root).stdout);
  assert(validate.ok === true, "checkpoint template repo did not validate");
  assert(validate.warning_count === 0, `expected zero warnings, got ${validate.warning_count}`);

  console.log(
    JSON.stringify(
      {
        smoke: "checkpoint-templates",
        ok: true,
        packageVersion,
        tempRoot,
        tarballPath,
        root,
      },
      null,
      2
    )
  );
}

main();
