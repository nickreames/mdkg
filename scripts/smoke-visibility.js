#!/usr/bin/env node

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const repoRoot = path.resolve(__dirname, "..");
const packageVersion = JSON.parse(fs.readFileSync(path.join(repoRoot, "package.json"), "utf8")).version;
const tempBase = fs.existsSync("/private/tmp") ? "/private/tmp" : os.tmpdir();
const NPM_CMD = process.env.npm_execpath || (process.platform === "win32" ? "npm.cmd" : "npm");

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
  return { stdout: result.stdout.trim(), stderr: result.stderr.trim(), combined: `${result.stdout}${result.stderr}`.trim() };
}

function runFailure(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd || repoRoot,
    env: commandEnv(options.env || {}),
    encoding: "utf8",
    stdio: "pipe",
  });
  if (result.status === 0) {
    throw new Error(`command unexpectedly succeeded: ${command} ${args.join(" ")}`);
  }
  return { status: result.status, stdout: result.stdout.trim(), stderr: result.stderr.trim() };
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

function mdkgFailure(binPath, args, cwd) {
  return runFailure(binPath, args, { cwd });
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
  assert(install.combined.includes(`mdkg ${packageVersion} installed.`), "postinstall output missing version");

  const binPath = process.platform === "win32" ? path.join(prefix, "mdkg.cmd") : path.join(prefix, "bin", "mdkg");
  assertExists(binPath);
  return { binPath, tarballPath };
}

function updateConfig(root, mutate) {
  const configPath = path.join(root, ".mdkg", "config.json");
  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  mutate(config);
  fs.writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`, "utf8");
}

function replaceInFile(filePath, from, to) {
  const content = fs.readFileSync(filePath, "utf8");
  fs.writeFileSync(filePath, content.replace(from, to), "utf8");
}

function createChildBundle(binPath, root, name, profile) {
  const child = path.join(root, name);
  fs.mkdirSync(child, { recursive: true });
  mdkg(binPath, ["init", "--agent"], child);
  if (profile === "public") {
    updateConfig(child, (config) => {
      config.workspaces.root.visibility = "public";
    });
  }
  const task = parseJson(
    mdkg(binPath, ["new", "task", `${name} Task`, "--status", "todo", "--priority", "1", "--json"], child).stdout
  ).node;
  const bundle = parseJson(mdkg(binPath, ["bundle", "create", "--profile", profile, "--json"], child).stdout);
  return { bundlePath: path.join(name, bundle.path), taskId: task.id };
}

function exerciseVisibility(binPath, tempRoot) {
  const root = path.join(tempRoot, "root-repo");
  fs.mkdirSync(root, { recursive: true });
  mdkg(binPath, ["init", "--agent"], root);
  updateConfig(root, (config) => {
    config.workspaces.root.visibility = "public";
  });

  fs.mkdirSync(path.join(root, "inputs"), { recursive: true });
  fs.writeFileSync(path.join(root, "inputs", "private.txt"), "private input\n", "utf8");
  fs.writeFileSync(path.join(root, "inputs", "public.txt"), "public input\n", "utf8");
  const privateArchive = parseJson(
    mdkg(
      binPath,
      ["archive", "add", "inputs/private.txt", "--id", "archive.private-input", "--visibility", "private", "--json"],
      root
    ).stdout
  ).archive;
  const publicArchive = parseJson(
    mdkg(
      binPath,
      ["archive", "add", "inputs/public.txt", "--id", "archive.public-input", "--visibility", "public", "--json"],
      root
    ).stdout
  ).archive;
  assert(privateArchive.visibility === "private", "private archive receipt missing visibility");
  assert(publicArchive.visibility === "public", "public archive receipt missing visibility");

  const archiveList = parseJson(mdkg(binPath, ["archive", "list", "--visibility", "public", "--json"], root).stdout);
  assert(archiveList.count === 1 && archiveList.items[0].id === "archive.public-input", "archive visibility list failed");

  const task = parseJson(
    mdkg(
      binPath,
      [
        "new",
        "task",
        "Public Visibility Task",
        "--status",
        "todo",
        "--priority",
        "1",
        "--artifacts",
        "archive://archive.private-input",
        "--json",
      ],
      root
    ).stdout
  ).node;
  const privatePack = mdkgFailure(binPath, ["pack", task.id, "--visibility", "public", "--dry-run"], root);
  assert(privatePack.status === 2, "public pack with private archive did not fail as validation");
  assert(privatePack.stderr.includes("public pack contains less-visible references"), "public pack failure missing visibility message");

  replaceInFile(path.join(root, task.path), "archive://archive.private-input", "archive://archive.public-input");
  const publicPack = mdkg(binPath, ["pack", task.id, "--visibility", "public", "--format", "json", "--out", ".mdkg/pack/public.json"], root);
  assert(publicPack.stdout.includes("pack written:"), "public pack was not written");
  const packed = parseJson(fs.readFileSync(path.join(root, ".mdkg", "pack", "public.json"), "utf8"));
  assert(packed.meta.visibility === "public", "public pack metadata missing visibility");
  assert(!JSON.stringify(packed).includes("archive.private-input"), "public pack leaked private archive id");

  const publicChild = createChildBundle(binPath, root, "child-public", "public");
  mdkg(
    binPath,
    [
      "subgraph",
      "add",
      "child_public",
      publicChild.bundlePath,
      "--visibility",
      "public",
      "--profile",
      "public",
      "--json",
    ],
    root
  );
  const subgraphTask = parseJson(
    mdkg(
      binPath,
      [
        "new",
        "task",
        "Public Subgraph Task",
        "--status",
        "todo",
        "--priority",
        "1",
        "--relates",
        `child_public:${publicChild.taskId}`,
        "--json",
      ],
      root
    ).stdout
  ).node;
  mdkg(binPath, ["pack", subgraphTask.id, "--visibility", "public", "--dry-run"], root);

  const privateChild = createChildBundle(binPath, root, "child-private", "private");
  const rejectedSubgraph = mdkgFailure(
    binPath,
    [
      "subgraph",
      "add",
      "child_bad",
      privateChild.bundlePath,
      "--visibility",
      "public",
      "--profile",
      "private",
      "--json",
    ],
    root
  );
  assert(rejectedSubgraph.status === 1, "public subgraph over private profile should be usage failure");

  mdkg(binPath, ["subgraph", "add", "child_private", privateChild.bundlePath, "--json"], root);
  const privateSubgraphTask = parseJson(
    mdkg(
      binPath,
      [
        "new",
        "task",
        "Private Subgraph Ref",
        "--status",
        "todo",
        "--priority",
        "1",
        "--relates",
        `child_private:${privateChild.taskId}`,
        "--json",
      ],
      root
    ).stdout
  ).node;
  const privateSubgraphPack = mdkgFailure(binPath, ["pack", privateSubgraphTask.id, "--visibility", "public", "--dry-run"], root);
  assert(privateSubgraphPack.status === 2, "public pack with private subgraph did not fail");
  const publicBundle = mdkgFailure(binPath, ["bundle", "create", "--profile", "public", "--json"], root);
  assert(publicBundle.status === 2, "public bundle with private subgraph ref did not fail");
}

function runSmoke() {
  let tempRoot;
  try {
    tempRoot = fs.mkdtempSync(path.join(tempBase, "mdkg-visibility-"));
    const { binPath, tarballPath } = packAndInstall(tempRoot);
    const version = mdkg(binPath, ["--version"], tempRoot).stdout;
    if (version !== packageVersion) {
      throw new Error(`expected mdkg version ${packageVersion}, got ${version}`);
    }
    exerciseVisibility(binPath, tempRoot);
    console.log("visibility smoke passed");
    console.log(`version=${version}`);
    console.log(`tarball=${path.basename(tarballPath)}`);
  } finally {
    if (tempRoot && process.env.MDKG_KEEP_SMOKE_TMP !== "1") {
      fs.rmSync(tempRoot, { recursive: true, force: true });
    }
  }
}

try {
  runSmoke();
} catch (err) {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
}
