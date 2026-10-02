#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const { runInstalledSmoke } = require("./qualification-smoke");
const { runTransportStateFixtures } = require("../tests/fixtures/transport-state.cjs");
let readZipEntries;

const repoRoot = path.resolve(__dirname, "..");
const packageVersion = JSON.parse(fs.readFileSync(path.join(repoRoot, "package.json"), "utf8")).version;

let commands;

function run(binPath, args, options = {}) {
  const result = commands.node(binPath, args, options.cwd, options);
  return { status: result.status, stdout: result.stdout.trim(), stderr: result.stderr.trim(),
    combined: `${result.stdout}${result.stderr}` };
}

function runFailure(binPath, args, options = {}) {
  const result = run(binPath, args, { ...options, allowFailure: true });
  if (result.status === 0) throw new Error(`command unexpectedly succeeded: ${binPath} ${args.join(" ")}`);
  return result;
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
  commands.git(["init", "-q"], root);
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
  if (!tarballName) {
    throw new Error("unable to determine npm pack output tarball");
  }
  const tarballPath = path.join(packDir, path.basename(tarballName));
  assertExists(tarballPath);

  return { tarballPath, install() {
    const install = commands.npm(["install", "-g", tarballPath, "--prefix", prefix, "--foreground-scripts", "--offline"], {
      cwd: tempRoot,
      env: { npm_config_prefix: prefix },
    });
    assertIncludes(`${install.stdout}${install.stderr}`, `mdkg ${packageVersion} installed.`, "postinstall");

    const binPath = process.platform === "win32" ? path.join(prefix, "mdkg.cmd") : path.join(prefix, "bin", "mdkg");
    assertExists(binPath);
    const packageRoot = [path.join(prefix, "lib/node_modules/mdkg"), path.join(prefix, "node_modules/mdkg")].find(fs.existsSync);
    assert(packageRoot, "installed mdkg package is missing");
    return { binPath, tarballPath, packageRoot };
  } };
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
  // This is a parent-owned workspace, not an independently executed graph.
  // Keep the former graph-only setup explicit now that init defaults to agents;
  // an independent graph's root-scoped event history must not be relabeled.
  mdkg(binPath, ["init", "--graph-only"], child);
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
  const receipt = runInstalledSmoke({
    prefix: "mdkg-bundle-",
    prepare(tempRoot, ownedCommands) { commands = ownedCommands; return prepareInstall(tempRoot); },
    exercise(tempRoot, { binPath, tarballPath, packageRoot }) {
    ({ readZipEntries } = require(path.join(packageRoot, "dist/util/zip.js")));
    const version = mdkg(binPath, ["--version"], tempRoot).stdout;
    if (version !== packageVersion) throw new Error(`expected mdkg version ${packageVersion}, got ${version}`);
    exerciseBundles(binPath, tempRoot);
    const transport = runTransportStateFixtures({ packageRoot, root: path.join(tempRoot, "transport-state"), commands });
    return { ok: true, smoke: "bundle", version, transport_state: transport };
    },
  });
  console.log(JSON.stringify(receipt));
}

if (require.main === module) {
  try { runSmoke(); }
  catch (error) { console.error(error instanceof Error ? error.message : String(error)); process.exitCode = 1; }
}
