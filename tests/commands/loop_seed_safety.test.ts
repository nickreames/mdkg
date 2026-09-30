import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { spawnSync } from "node:child_process";
import { initializeTestGitIndex, makeTempDir, writeFile } from "../helpers/fs";
import { writeRootConfig } from "../helpers/config";
import { writeDefaultTemplates } from "../helpers/templates";

const cli = process.env.MDKG_TEST_PACKAGE
  ? path.join(process.env.MDKG_TEST_PACKAGE, "dist/cli.js") : path.resolve(__dirname, "../../cli.js");
const { createGraphFormat } = require(path.join(path.dirname(cli), "graph/identity"));
const seed = "---\nid: loop-1\ntype: loop\ntitle: Local seed\n---\n# Local guidance\n";
const sentinel = "EXTERNAL_PRIVATE_SENTINEL";
function run(root: string, args: string[]) {
  const trap = path.join(path.dirname(root), "read-trap.cjs");
  return spawnSync(process.execPath, [...(fs.existsSync(trap) ? ["--require", trap] : []), cli, ...args], { cwd: root, encoding: "utf8", timeout: 5000 });
}
function inventory(root: string): Record<string, string> {
  const result: Record<string, string> = {};
  function visit(dir: string) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const file = path.join(dir, entry.name), relative = path.relative(root, file);
      if (entry.isDirectory()) visit(file);
      else if (entry.isSymbolicLink()) result[relative] = `link:${fs.readlinkSync(file)}`;
      else if (entry.isFile()) result[relative] = crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
      else result[relative] = "special";
    }
  }
  visit(root); return result;
}
function fixture(backend: string, v2: boolean) {
  const owner = makeTempDir("mdkg-loop-seeds-"), root = path.join(owner, "repo");
  writeRootConfig(root); writeDefaultTemplates(root);
  const configPath = path.join(root, ".mdkg/config.json");
  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  config.index.backend = backend; fs.writeFileSync(configPath, JSON.stringify(config));
  writeFile(path.join(root, ".mdkg/core/core.md"), "# Core\n");
  const gitIndex = initializeTestGitIndex(root);
  writeFile(path.join(root, ".mdkg/state/selected-goal.json"), "{}\n");
  writeFile(path.join(root, ".mdkg/db/runtime/preserved"), "runtime sentinel");
  if (v2) writeFile(path.join(root, ".mdkg/graph.json"), JSON.stringify(createGraphFormat()));
  assert.equal(run(root, ["index"]).status, 0);
  const dir = path.join(root, ".mdkg/templates/loops"); fs.mkdirSync(dir, { recursive: true });
  return { owner, root, dir, gitIndex };
}
for (const backend of ["json", "sqlite"]) for (const v2 of [false, true]) {
  for (const shape of ["file-link", "directory-link", "ancestor-link", "dangling-link", "fifo", "linked-fifo", "directory-seed", "malformed"]) {
    test(`new loop ${backend} v${v2 ? 2 : 1} refuses ${shape} before effects`, () => {
      const { owner, root, dir } = fixture(backend, v2);
      try {
        const external = path.join(owner, "external"); fs.mkdirSync(external);
        const outside = path.join(external, "unsafe.loop.md");
        writeFile(outside, seed.replace("Local seed", sentinel));
        const target = path.join(dir, "unsafe.loop.md");
        // Prove refusal before the external open, not just absence from output.
        const marker = path.join(owner, "external-read-attempt");
        writeFile(path.join(owner, "read-trap.cjs"), `
          const fs = require('fs'), path = require('path'); const open = fs.openSync;
          fs.openSync = function(file, ...args) {
            let actual; try { actual = fs.realpathSync(file); } catch {}
            if (actual && (actual === ${JSON.stringify(external)} || actual.startsWith(${JSON.stringify(external + path.sep)}))) {
              fs.writeFileSync(${JSON.stringify(marker)}, 'read attempted'); throw Error('external open attempted');
            }
            return open.call(this, file, ...args);
          };
        `);
        if (shape === "file-link") fs.symlinkSync(outside, target);
        if (shape === "directory-link") { fs.rmdirSync(dir); fs.symlinkSync(external, dir); }
        if (shape === "ancestor-link") {
          const templates = path.dirname(dir), moved = path.join(owner, "templates");
          fs.renameSync(templates, moved); fs.symlinkSync(moved, templates);
        }
        if (shape === "dangling-link") fs.symlinkSync(path.join(external, "missing"), target);
        if (shape === "fifo" || shape === "linked-fifo") {
          const fifo = shape === "fifo" ? target : path.join(external, "pipe");
          assert.equal(spawnSync("mkfifo", [fifo]).status, 0);
          if (shape === "linked-fifo") fs.symlinkSync(fifo, target);
        }
        if (shape === "directory-seed") fs.mkdirSync(target);
        if (shape === "malformed") writeFile(target, "---\ntitle: [unterminated\n---\n");
        const before = inventory(root), externalBefore = inventory(external);
        const result = run(root, ["new", "loop", "Safe creation", "--json"]);
        assert.equal(result.error, undefined, String(result.error));
        assert.notEqual(result.status, 0, result.stdout);
        assert.doesNotMatch(result.stdout + result.stderr, new RegExp(sentinel));
        assert.equal(fs.existsSync(marker), false, "external file was opened");
        assert.deepEqual(inventory(root), before);
        assert.deepEqual(inventory(external), externalBefore);
        assert.equal(fs.existsSync(path.join(root, ".mdkg/index/write.lock")), false);
      } finally { fs.rmSync(owner, { recursive: true, force: true }); }
    });
  }
  for (const mode of ["valid", "absent", "legacy-title-only", "no-reindex"]) {
    test(`new loop ${backend} v${v2 ? 2 : 1} preserves ${mode} suggestions`, () => {
      const { owner, root, dir, gitIndex } = fixture(backend, v2);
      try {
        if (mode === "absent") fs.rmdirSync(dir);
        else {
          writeFile(path.join(dir, "b.loop.md"), mode === "legacy-title-only" ? "---\ntitle: Local seed\n---\n" : seed);
          writeFile(path.join(dir, "a.loop.md"), seed.replace("Local seed", "First seed"));
          writeFile(path.join(dir, "README.md"), "Unrelated documentation");
        }
        const result = run(root, ["new", "loop", "Safe creation", "--json", ...(mode === "no-reindex" ? ["--no-reindex"] : [])]);
        assert.equal(result.status, 0, result.stderr);
        const receipt = JSON.parse(result.stdout);
        assert.equal(receipt.action, "created");
        assert.equal(fs.existsSync(path.join(root, receipt.node.path)), true);
        assert.deepEqual(receipt.suggested_templates.map((item: { title: string }) => item.title), mode === "absent" ? [] : ["First seed", "Local seed"]);
        assert.deepEqual(fs.readFileSync(path.join(root, ".git/index")), gitIndex);
        assert.equal(fs.readFileSync(path.join(root, ".mdkg/db/runtime/preserved"), "utf8"), "runtime sentinel");
      } finally { fs.rmSync(owner, { recursive: true, force: true }); }
    });
  }
}

for (const command of [["loop", "list", "--json"], ["loop", "show", "unsafe", "--json"], ["loop", "fork", "unsafe", "--scope", "repo", "--dry-run", "--json"]]) {
  for (const shape of ["file-link", "directory-link", "fifo"]) {
    test(`${command.slice(0, 2).join(" ")} refuses ${shape} with no authored effects`, () => {
      const { owner, root, dir } = fixture("json", false);
      try {
        const outside = path.join(owner, "outside"); fs.mkdirSync(outside);
        writeFile(path.join(outside, "unsafe.loop.md"), seed);
        const target = path.join(dir, "unsafe.loop.md");
        if (shape === "file-link") fs.symlinkSync(path.join(outside, "unsafe.loop.md"), target);
        if (shape === "directory-link") { fs.rmdirSync(dir); fs.symlinkSync(outside, dir); }
        if (shape === "fifo") assert.equal(spawnSync("mkfifo", [target]).status, 0);
        const before = inventory(root), result = run(root, command);
        assert.equal(result.error, undefined);
        assert.notEqual(result.status, 0);
        assert.match(result.stderr, /symbolic|symlink|contained|must be a file/i);
        assert.deepEqual(inventory(root), before);
      } finally { fs.rmSync(owner, { recursive: true, force: true }); }
    });
  }
}

test("direct seed selection does not parse unrelated malformed seeds; catalog does", () => {
  const { owner, root, dir } = fixture("json", false);
  try {
    writeFile(path.join(dir, "safe.loop.md"), seed);
    writeFile(path.join(dir, "unrelated.loop.md"), "---\ntitle: [unterminated\n---\n");
    assert.equal(run(root, ["loop", "show", "safe", "--json"]).status, 0);
    assert.notEqual(run(root, ["loop", "list", "--json"]).status, 0);
    const text = run(root, ["new", "task", "Not a loop"]);
    assert.equal(text.status, 0, text.stderr);
  } finally { fs.rmSync(owner, { recursive: true, force: true }); }
});

for (const limit of ["file", "total", "count", "entries", "depth"]) {
  test(`shared seed catalog enforces ${limit} budget without writes`, () => {
    const { owner, root, dir } = fixture("json", false);
    try {
      const runtime = path.dirname(cli);
      const { loadConfig } = require(path.join(runtime, "core/config"));
      const { loadLoopSeedCatalog, loadLoopSeed } = require(path.join(runtime, "templates/loop_seeds"));
      const config = loadConfig(root);
      writeFile(path.join(dir, "a.loop.md"), seed);
      if (limit === "file") config.index.limits.max_file_bytes = seed.length - 1;
      if (limit === "total") {
        config.index.limits.max_total_bytes = seed.length * 2 - 1;
        writeFile(path.join(dir, "b.loop.md"), seed);
      }
      if (limit === "count") {
        config.index.limits.max_files = 1;
        writeFile(path.join(dir, "b.loop.md"), seed);
      }
      if (limit === "entries") {
        config.index.limits.max_files = 1;
        for (let i = 0; i < 10; i++) writeFile(path.join(dir, `unrelated-${i}`), "");
      }
      if (limit === "depth") {
        config.index.limits.max_depth = 1;
        fs.mkdirSync(path.join(dir, "one/two"), { recursive: true });
      }
      const before = inventory(root);
      assert.throws(() => loadLoopSeedCatalog(root, config), /byte limit|template count|entry budget|directory depth/);
      if (limit === "file") assert.throws(() => loadLoopSeed(root, config, "a"), /byte limit/);
      assert.deepEqual(inventory(root), before);
    } finally { fs.rmSync(owner, { recursive: true, force: true }); }
  });
}
