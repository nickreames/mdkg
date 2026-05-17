#!/usr/bin/env node

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { readZipEntries } = require("../dist/util/zip.js");

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
  return {
    stdout: result.stdout.trim(),
    stderr: result.stderr.trim(),
    combined: `${result.stdout}${result.stderr}`.trim(),
  };
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
  return {
    status: result.status,
    stdout: result.stdout.trim(),
    stderr: result.stderr.trim(),
  };
}

function assertExists(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`expected path to exist: ${filePath}`);
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function assertIncludes(value, expected, label) {
  if (!value.includes(expected)) {
    throw new Error(`${label} missing expected text: ${expected}`);
  }
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

function initGit(root) {
  fs.mkdirSync(root, { recursive: true });
  run(GIT_CMD, ["init", "-q"], { cwd: root });
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
  return { binPath, tarballPath };
}

function bundleEntries(bundlePath) {
  return new Map(readZipEntries(fs.readFileSync(bundlePath)).map((entry) => [entry.name, entry.data]));
}

function makeArchivePublic(sidecarPath) {
  const content = fs.readFileSync(sidecarPath, "utf8");
  fs.writeFileSync(sidecarPath, content.replace("visibility: private", "visibility: public"), "utf8");
}

function exerciseBundles(binPath, tempRoot) {
  const root = path.join(tempRoot, "bundle-root");
  const child = path.join(root, "child-repo");
  initGit(root);
  fs.mkdirSync(child, { recursive: true });

  mdkg(binPath, ["init", "--agent"], root);
  mdkg(binPath, ["init"], child);
  mdkg(binPath, ["workspace", "add", "child", "child-repo", "--visibility", "public", "--json"], root);

  const childInputs = path.join(child, "inputs");
  fs.mkdirSync(childInputs, { recursive: true });
  fs.writeFileSync(path.join(childInputs, "public_source.txt"), "public bundle source\n", "utf8");
  mdkg(
    binPath,
    [
      "archive",
      "add",
      "child-repo/inputs/public_source.txt",
      "--ws",
      "child",
      "--id",
      "archive.child-public-source",
      "--kind",
      "source",
      "--json",
    ],
    root
  );
  makeArchivePublic(path.join(child, ".mdkg", "archive", "archive.child-public-source", "public_source.txt.md"));

  mdkg(binPath, ["new", "spec", "Child Worker", "--id", "agent.child-worker", "--ws", "child", "--json"], root);
  mdkg(binPath, ["new", "work", "Child Work", "--id", "work.child-work", "--ws", "child", "--json"], root);
  mdkg(
    binPath,
    [
      "new",
      "task",
      "Child Public Task",
      "--ws",
      "child",
      "--status",
      "todo",
      "--priority",
      "1",
      "--artifacts",
      "archive://archive.child-public-source",
      "--json",
    ],
    root
  );

  mdkg(binPath, ["validate"], root);
  mdkg(binPath, ["index"], root);

  const privateFirst = parseJson(mdkg(binPath, ["bundle", "create", "--profile", "private", "--json"], root).stdout);
  const privateSecond = parseJson(mdkg(binPath, ["bundle", "create", "--profile", "private", "--json"], root).stdout);
  assert(privateFirst.zip_sha256 === privateSecond.zip_sha256, "private bundle hash changed across identical creates");
  mdkg(binPath, ["bundle", "verify", privateFirst.path, "--json"], root);

  const privateEntries = bundleEntries(path.join(root, privateFirst.path));
  assert(privateEntries.has("manifest.json"), "private bundle missing manifest");
  assert(privateEntries.has(".mdkg/index/global.json"), "private bundle missing global index");
  assert(privateEntries.has(".mdkg/index/skills.json"), "private bundle missing skills index");
  assert(privateEntries.has(".mdkg/index/capabilities.json"), "private bundle missing capabilities index");
  assert(!privateEntries.has(".mdkg/bundles/private/all.mdkg.zip"), "private bundle nested itself");
  assert(!privateEntries.has("child-repo/.mdkg/archive/archive.child-public-source/source/public_source.txt"), "private bundle included raw archive source");

  const publicBundle = parseJson(mdkg(binPath, ["bundle", "create", "--profile", "public", "--json"], root).stdout);
  mdkg(binPath, ["bundle", "verify", publicBundle.path, "--json"], root);
  const publicEntries = bundleEntries(path.join(root, publicBundle.path));
  assert(!publicEntries.has(".mdkg/README.md"), "public bundle included private root workspace");
  assert(publicEntries.has("child-repo/.mdkg/README.md"), "public bundle missing public child README");
  assert(publicEntries.has("child-repo/.mdkg/archive/archive.child-public-source/public_source.txt.md"), "public bundle missing public archive sidecar");
  assert(publicEntries.has("child-repo/.mdkg/archive/archive.child-public-source/public_source.txt.zip"), "public bundle missing public archive zip");

  parseJson(mdkg(binPath, ["bundle", "show", publicBundle.path, "--json"], root).stdout);
  const listed = parseJson(mdkg(binPath, ["bundle", "list", "--json"], root).stdout);
  assert(listed.count >= 2, "bundle list did not include private and public bundles");

  fs.appendFileSync(path.join(child, ".mdkg", "README.md"), "\nstale mutation\n", "utf8");
  const stale = mdkgFailure(binPath, ["bundle", "verify", publicBundle.path, "--json"], root);
  assert(stale.status === 2, "stale bundle verify should exit with validation status");
  const staleReceipt = parseJson(stale.stdout);
  assert(staleReceipt.stale === true, "stale bundle verify did not report stale=true");
  assert(staleReceipt.stale_paths.includes("child-repo/.mdkg/README.md"), "stale bundle did not report child README");
}

function runSmoke() {
  let tempRoot;
  try {
    tempRoot = fs.mkdtempSync(path.join(tempBase, "mdkg-bundle-"));
    const { binPath, tarballPath } = packAndInstall(tempRoot);
    const version = mdkg(binPath, ["--version"], tempRoot).stdout;
    if (version !== packageVersion) {
      throw new Error(`expected mdkg version ${packageVersion}, got ${version}`);
    }
    exerciseBundles(binPath, tempRoot);
    console.log("bundle smoke passed");
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
  const message = err instanceof Error ? err.message : String(err);
  console.error(message);
  process.exit(1);
}
