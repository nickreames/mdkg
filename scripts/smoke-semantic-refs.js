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

function assertExists(filePath) {
  assert(fs.existsSync(filePath), `expected path to exist: ${filePath}`);
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
  assertExists(tarballPath);

  const install = run(NPM_CMD, ["install", "-g", tarballPath, "--prefix", prefix, "--foreground-scripts"], {
    cwd: tempRoot,
    env: { npm_config_prefix: prefix },
  });
  assert(install.combined.includes(`mdkg ${packageVersion} installed.`), "postinstall output missing package version");

  const binPath = process.platform === "win32" ? path.join(prefix, "mdkg.cmd") : path.join(prefix, "bin", "mdkg");
  assertExists(binPath);
  return { binPath, tarballPath };
}

function mdkg(binPath, args, cwd) {
  return run(binPath, args, { cwd });
}

function git(cwd, args) {
  return run(GIT_CMD, args, { cwd });
}

function replaceInFile(filePath, from, to) {
  const content = fs.readFileSync(filePath, "utf8");
  assert(content.includes(from), `expected ${filePath} to contain ${from}`);
  fs.writeFileSync(filePath, content.replace(from, to), "utf8");
}

function createChildGraph(binPath, root) {
  const child = path.join(root, "projects", "semantic_child");
  fs.mkdirSync(child, { recursive: true });
  git(child, ["init", "-q"]);
  git(child, ["config", "user.email", "mdkg@example.test"]);
  git(child, ["config", "user.name", "mdkg smoke"]);
  mdkg(binPath, ["init", "--agent"], child);
  const task = parseJson(
    mdkg(binPath, ["new", "task", "semantic child context", "--status", "todo", "--priority", "1", "--json"], child).stdout
  ).node;
  git(child, ["add", "."]);
  git(child, ["commit", "-m", "initial child graph"]);

  const bundlePath = ".mdkg/bundles/private/subgraphs/semantic_child.mdkg.zip";
  const bundleAbs = path.join(root, bundlePath);
  mdkg(binPath, ["bundle", "create", "--profile", "private", "--output", bundleAbs, "--json"], child);
  return { child, task, bundlePath };
}

function main() {
  const tempRoot = fs.mkdtempSync(path.join(tempBase, "mdkg-semantic-refs-smoke-"));
  const { binPath, tarballPath } = packAndInstall(tempRoot);
  const root = path.join(tempRoot, "repo");
  fs.mkdirSync(root, { recursive: true });
  git(root, ["init", "-q"]);
  git(root, ["config", "user.email", "mdkg@example.test"]);
  git(root, ["config", "user.name", "mdkg smoke"]);

  mdkg(binPath, ["init", "--agent"], root);
  const rootTask = parseJson(
    mdkg(binPath, ["new", "task", "semantic refs root task", "--status", "todo", "--priority", "1", "--json"], root).stdout
  ).node;
  const localContext = parseJson(
    mdkg(binPath, ["new", "task", "semantic refs local context", "--status", "todo", "--priority", "2", "--json"], root).stdout
  ).node;
  const localEvidence = parseJson(
    mdkg(binPath, ["new", "task", "semantic refs local evidence", "--status", "done", "--priority", "3", "--json"], root).stdout
  ).node;
  const child = createChildGraph(binPath, root);
  mdkg(
    binPath,
    [
      "subgraph",
      "add",
      "semantic_child",
      child.bundlePath,
      "--source-path",
      "projects/semantic_child",
      "--json",
    ],
    root
  );

  const rootTaskPath = path.join(root, rootTask.path);
  replaceInFile(
    rootTaskPath,
    "context_refs: []",
    `context_refs: [${localContext.id}, semantic_child:${child.task.id}, https://example.invalid/context]`
  );
  replaceInFile(
    rootTaskPath,
    "evidence_refs: []",
    `evidence_refs: [${localEvidence.id}, proof://semantic-refs/evidence]`
  );

  mdkg(binPath, ["index"], root);
  const validate = parseJson(mdkg(binPath, ["validate", "--json"], root).stdout);
  assert(validate.ok === true, "semantic refs graph did not validate");

  const rootTaskQid = `root:${rootTask.id}`;
  const shown = parseJson(mdkg(binPath, ["show", rootTaskQid, "--json"], root).stdout).item;
  assert(shown.edges.context_refs.includes(`root:${localContext.id}`), "show JSON missing local context ref");
  assert(shown.edges.context_refs.includes(`semantic_child:${child.task.id}`), "show JSON missing subgraph context ref");
  assert(shown.edges.context_refs.includes("https://example.invalid/context"), "show JSON missing URI context ref");
  assert(shown.edges.evidence_refs.includes(`root:${localEvidence.id}`), "show JSON missing local evidence ref");
  assert(shown.edges.evidence_refs.includes("proof://semantic-refs/evidence"), "show JSON missing URI evidence ref");

  const packPath = ".mdkg/pack/semantic-refs.json";
  mdkg(
    binPath,
    ["pack", rootTaskQid, "--format", "json", "--edges", "context_refs,evidence_refs", "--depth", "1", "--out", packPath],
    root
  );
  const packed = JSON.parse(fs.readFileSync(path.join(root, packPath), "utf8"));
  const packedQids = packed.nodes.map((node) => node.qid);
  assert(packedQids.includes(rootTaskQid), "pack missing root task");
  assert(packedQids.includes(`root:${localContext.id}`), "pack missing local context task");
  assert(packedQids.includes(`root:${localEvidence.id}`), "pack missing local evidence task");
  assert(packedQids.includes(`semantic_child:${child.task.id}`), "pack missing subgraph context task");
  const packedRoot = packed.nodes.find((node) => node.qid === rootTaskQid);
  assert(packedRoot.frontmatter.context_refs.includes(`semantic_child:${child.task.id}`), "pack frontmatter missing subgraph context ref");
  assert(packedRoot.frontmatter.evidence_refs.includes("proof://semantic-refs/evidence"), "pack frontmatter missing URI evidence ref");

  const search = parseJson(mdkg(binPath, ["search", "semantic refs", "--json"], root).stdout);
  assert(search.items.some((item) => item.id === rootTask.id), "search missed semantic refs root task");

  console.log(
    JSON.stringify(
      {
        smoke: "semantic-refs",
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
