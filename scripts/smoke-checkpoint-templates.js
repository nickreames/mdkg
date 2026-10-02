#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const { runInstalledSmoke } = require("./qualification-smoke");

const repoRoot = path.resolve(__dirname, "..");
const packageVersion = JSON.parse(fs.readFileSync(path.join(repoRoot, "package.json"), "utf8")).version;

let commands;

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function parseJson(output) {
  return JSON.parse(output);
}

function prepareInstall(tempRoot) {
  const packDir = path.join(tempRoot, "pack");
  const prefix = path.join(tempRoot, "npm-prefix");
  fs.mkdirSync(packDir, { recursive: true });
  fs.mkdirSync(prefix, { recursive: true });

  const packOutput = commands.npm(["pack", repoRoot, "--silent", "--dry-run=false", "--pack-destination", packDir], {
    cwd: tempRoot,
  }).stdout;
  const tarballName = packOutput
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .pop();
  assert(tarballName, "unable to determine npm pack output tarball");
  const tarballPath = path.join(packDir, path.basename(tarballName));
  assert(fs.existsSync(tarballPath), `expected tarball: ${tarballPath}`);

  return { tarballPath, install() {
    const install = commands.npm(["install", "-g", tarballPath, "--prefix", prefix, "--foreground-scripts", "--offline"], {
      cwd: tempRoot,
      env: { npm_config_prefix: prefix },
    });
    assert(`${install.stdout}${install.stderr}`.includes(`mdkg ${packageVersion} installed.`), "postinstall output missing package version");

    const binPath = process.platform === "win32" ? path.join(prefix, "mdkg.cmd") : path.join(prefix, "bin", "mdkg");
    assert(fs.existsSync(binPath), `expected mdkg bin: ${binPath}`);
    return { binPath, tarballPath };
  } };
}

function mdkg(binPath, args, cwd) {
  const result = commands.node(binPath, args, cwd);
  return { stdout: result.stdout.trim(), stderr: result.stderr.trim(), combined: `${result.stdout}${result.stderr}` };
}

function git(cwd, args) {
  return commands.git(args, cwd);
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

function exerciseSmoke(tempRoot, installed) {
  const { binPath, tarballPath } = installed;
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

  return {
    smoke: "checkpoint-templates",
    ok: true,
    packageVersion,
    tempRoot,
    tarballPath,
    root,
  };
}

function main() {
  const receipt = runInstalledSmoke({
    prefix: "mdkg-checkpoint-templates-smoke-",
    prepare: (root, ownedCommands) => { commands = ownedCommands; return prepareInstall(root); },
    exercise: exerciseSmoke,
  });
  console.log(JSON.stringify(receipt, null, 2));
}

if (require.main === module) {
  try { main(); } catch (error) { console.error(error); process.exitCode = 1; }
}
