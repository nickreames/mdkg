#!/usr/bin/env node

const crypto = require("node:crypto");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const repoRoot = path.resolve(__dirname, "..");
const packageVersion = JSON.parse(fs.readFileSync(path.join(repoRoot, "package.json"), "utf8")).version;
const tempBase = fs.existsSync("/private/tmp") ? "/private/tmp" : os.tmpdir();
const NPM_CMD = process.env.npm_execpath || "npm";
const GIT_CMD = process.env.GIT || "git";

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
      `${command} ${args.join(" ")} failed with ${result.status}\nSTDOUT:\n${result.stdout}\nSTDERR:\n${result.stderr}`
    );
  }
  return {
    stdout: result.stdout.trim(),
    stderr: result.stderr.trim(),
    combined: `${result.stdout}${result.stderr}`,
  };
}

function runExpectFailure(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd || repoRoot,
    env: commandEnv(options.env || {}),
    encoding: "utf8",
    stdio: "pipe",
  });
  if (result.status === 0) {
    throw new Error(`${command} ${args.join(" ")} unexpectedly succeeded`);
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

function assertNotExists(filePath) {
  if (fs.existsSync(filePath)) {
    throw new Error(`unexpected path exists: ${filePath}`);
  }
}

function assertIncludes(value, expected, label) {
  if (!value.includes(expected)) {
    throw new Error(`${label} missing ${expected}`);
  }
}

function assertNotIncludes(value, expected, label) {
  if (value.includes(expected)) {
    throw new Error(`${label} unexpectedly included ${expected}`);
  }
}

function sha256(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function initGit(root) {
  fs.mkdirSync(root, { recursive: true });
  run(GIT_CMD, ["init", "-q"], { cwd: root });
}

function mdkg(binPath, args, cwd) {
  return run(binPath, args, { cwd });
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

  const binPath = process.platform === "win32" ? path.join(prefix, "mdkg.cmd") : path.join(prefix, "bin", "mdkg");
  assertExists(binPath);
  return binPath;
}

function assertManifestMatches(root) {
  const manifestPath = path.join(root, ".mdkg", "init-manifest.json");
  assertExists(manifestPath);
  const manifest = parseJson(fs.readFileSync(manifestPath, "utf8"));
  for (const file of manifest.files) {
    const absolute = path.join(root, file.path);
    assertExists(absolute);
    if (sha256(absolute) !== file.sha256) {
      throw new Error(`manifest hash mismatch for ${file.path}`);
    }
  }
  return manifest;
}

function assertNoImmediateUpgrade(binPath, root) {
  const receipt = parseJson(mdkg(binPath, ["upgrade", "--dry-run", "--json"], root).stdout);
  if (receipt.changes.length !== 0) {
    throw new Error(`fresh workspace should not need immediate upgrade: ${JSON.stringify(receipt, null, 2)}`);
  }
}

function assertNoRemovedInitGuidance(root) {
  for (const relativePath of [
    "AGENT_START.md",
    "AGENTS.md",
    "CLAUDE.md",
    "CLI_COMMAND_MATRIX.md",
    ".mdkg/README.md",
  ]) {
    const absolute = path.join(root, relativePath);
    if (!fs.existsSync(absolute)) {
      continue;
    }
    const content = fs.readFileSync(absolute, "utf8");
    assertNotIncludes(content, "mdkg init --llm", relativePath);
    assertNotIncludes(content, "--llm --agent", relativePath);
  }
}

function exerciseRemovedFlags(binPath, tempRoot) {
  for (const removedFlag of ["--llm", "--agents", "--claude", "--omni"]) {
    const root = path.join(tempRoot, `removed-${removedFlag.slice(2)}`);
    initGit(root);
    const result = runExpectFailure(binPath, ["init", removedFlag], { cwd: root });
    assertIncludes(result.stderr, "use `mdkg init --agent`", `init ${removedFlag}`);
    assertNotExists(path.join(root, ".mdkg"));
    assertNotExists(path.join(root, "AGENT_START.md"));
  }
}

function exerciseMirrorCollision(binPath, tempRoot) {
  const root = path.join(tempRoot, "mirror-collision");
  initGit(root);
  const collisionDir = path.join(root, ".agents", "skills", "select-work-and-ground-context");
  fs.mkdirSync(collisionDir, { recursive: true });
  fs.writeFileSync(path.join(collisionDir, "SKILL.md"), "# unmanaged\n", "utf8");

  const result = runExpectFailure(binPath, ["init", "--agent"], { cwd: root });
  assertIncludes(result.stderr, "already exists and is not mdkg-managed", "mirror collision");
  assertNotExists(path.join(root, ".mdkg"));
  assertNotExists(path.join(root, "AGENT_START.md"));
}

function exerciseBaseInit(binPath, tempRoot) {
  const root = path.join(tempRoot, "base-init");
  initGit(root);
  const init = mdkg(binPath, ["init"], root);
  assertIncludes(init.stdout, "managed manifest:", "base init output");
  assertExists(path.join(root, ".mdkg", "config.json"));
  assertExists(path.join(root, ".mdkg", "README.md"));
  assertNotExists(path.join(root, "AGENT_START.md"));
  assertNotExists(path.join(root, "AGENTS.md"));
  assertNotExists(path.join(root, ".mdkg", "skills"));

  const manifest = assertManifestMatches(root);
  if (manifest.files.some((file) => ["agent_doc", "startup_doc", "default_skill"].includes(file.category))) {
    throw new Error("base init manifest should not claim agent docs, startup docs, or default skills");
  }
  mdkg(binPath, ["doctor"], root);
  mdkg(binPath, ["validate"], root);
  assertNoImmediateUpgrade(binPath, root);

  const task = parseJson(mdkg(binPath, ["new", "task", "Base Init Task", "--status", "todo", "--priority", "1", "--json"], root).stdout).node;
  mdkg(binPath, ["pack", task.id, "--dry-run"], root);
}

function exerciseAgentInit(binPath, tempRoot) {
  const root = path.join(tempRoot, "agent-init");
  initGit(root);
  const init = mdkg(binPath, ["init", "--agent"], root);
  assertIncludes(init.stdout, "agent bootstrap:", "agent init output");
  assertIncludes(init.stdout, "skill mirrors:", "agent init output");
  for (const relativePath of [
    "AGENT_START.md",
    "AGENTS.md",
    "CLAUDE.md",
    "llms.txt",
    "CLI_COMMAND_MATRIX.md",
    ".mdkg/skills/select-work-and-ground-context/SKILL.md",
    ".mdkg/skills/build-pack-and-execute-task/SKILL.md",
    ".mdkg/skills/verify-close-and-checkpoint/SKILL.md",
    ".agents/skills/select-work-and-ground-context/SKILL.md",
    ".claude/skills/select-work-and-ground-context/SKILL.md",
    ".mdkg/work/events/events.jsonl",
  ]) {
    assertExists(path.join(root, relativePath));
  }
  assertNoRemovedInitGuidance(root);
  assertIncludes(fs.readFileSync(path.join(root, ".gitignore"), "utf8"), ".mdkg/archive/**/source/", ".gitignore");
  assertIncludes(
    fs.readFileSync(path.join(root, ".mdkg/skills/verify-close-and-checkpoint/SKILL.md"), "utf8"),
    "mdkg archive compress --all",
    "seeded verify-close-and-checkpoint skill"
  );
  assertIncludes(
    fs.readFileSync(path.join(root, ".agents/skills/verify-close-and-checkpoint/SKILL.md"), "utf8"),
    "mdkg bundle create --profile private",
    "mirrored verify-close-and-checkpoint skill"
  );
  assertIncludes(
    fs.readFileSync(path.join(root, "AGENT_START.md"), "utf8"),
    "mdkg subgraph add/list/verify",
    "seeded AGENT_START subgraph guidance"
  );
  assertIncludes(
    fs.readFileSync(path.join(root, ".mdkg", "README.md"), "utf8"),
    "mdkg subgraph add",
    "seeded .mdkg README subgraph guidance"
  );

  const manifest = assertManifestMatches(root);
  for (const category of ["agent_doc", "startup_doc", "default_skill"]) {
    if (!manifest.files.some((file) => file.category === category)) {
      throw new Error(`agent init manifest missing ${category}`);
    }
  }
  mdkg(binPath, ["doctor"], root);
  mdkg(binPath, ["validate"], root);
  assertNoImmediateUpgrade(binPath, root);

  const repeat = mdkg(binPath, ["init", "--agent"], root);
  assertIncludes(repeat.stdout, "skipped", "repeat init output");
  assertNoImmediateUpgrade(binPath, root);

  const task = parseJson(mdkg(binPath, ["new", "task", "Agent Init Task", "--status", "todo", "--priority", "1", "--json"], root).stdout).node;
  mdkg(binPath, ["pack", task.id], root);
}

function runSmoke() {
  let tempRoot;
  try {
    tempRoot = fs.mkdtempSync(path.join(tempBase, "mdkg-init-smoke-"));
    const binPath = packAndInstall(tempRoot);
    const version = mdkg(binPath, ["--version"], tempRoot).stdout;
    if (version !== packageVersion) {
      throw new Error(`expected mdkg version ${packageVersion}, got ${version}`);
    }
    exerciseRemovedFlags(binPath, tempRoot);
    exerciseMirrorCollision(binPath, tempRoot);
    exerciseBaseInit(binPath, tempRoot);
    exerciseAgentInit(binPath, tempRoot);
    console.log("init smoke passed");
    console.log(`version=${version}`);
  } finally {
    if (tempRoot && process.env.MDKG_KEEP_SMOKE_TMP !== "1") {
      fs.rmSync(tempRoot, { recursive: true, force: true });
    }
  }
}

runSmoke();
