import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import { spawnSync } from "node:child_process";
import { makeTempDir, writeFile } from "../helpers/fs";
import { writeRootConfig } from "../helpers/config";
import { writeDefaultTemplates } from "../helpers/templates";
const cli = path.resolve(__dirname, "../../cli.js");
const { readVerboseCoreList } = require("../../pack/verbose_core");
const sentinel = "external_discovery_secret_19";

function fixture(t: { after(fn: () => void): void }) {
  const owner = makeTempDir("mdkg-discovery-containment-");
  t.after(() => fs.rmSync(owner, { recursive: true, force: true }));
  const root = path.join(owner, "repo"), outside = path.join(owner, "outside");
  fs.mkdirSync(root); fs.mkdirSync(outside);
  writeRootConfig(root); writeDefaultTemplates(root);
  writeFile(path.join(root, ".mdkg/core/core.md"), "# Core\n");
  const run = (args: string[]) => spawnSync(process.execPath, [cli, ...args], { cwd: root, encoding: "utf8", timeout: 3000, maxBuffer: 12 * 1024 * 1024 });
  return { root, outside, run };
}

function linkOrSkip(t: { skip(message?: string): void }, target: string, link: string, type: "dir" | "file"): boolean {
  try { fs.symlinkSync(target, link, type); return true; }
  catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "EPERM") throw error;
    t.skip("symbolic links unavailable"); return false;
  }
}

for (const placement of ["leaf", "parent", "inward", "dangling"]) {
  test(`guide rejects ${placement} link without exposing external content`, (t) => {
    const f = fixture(t);
    const external = path.join(f.outside, "guide.md");
    if (placement !== "dangling") writeFile(external, `${sentinel}\n`);
    if (placement === "parent") {
      fs.rmSync(path.join(f.root, ".mdkg/core"), { recursive: true });
      if (!linkOrSkip(t, f.outside, path.join(f.root, ".mdkg/core"), "dir")) return;
    } else {
      let source = external;
      if (placement === "inward") { source = path.join(f.root, "private-guide.txt"); writeFile(source, sentinel); }
      if (!linkOrSkip(t, source, path.join(f.root, ".mdkg/core/guide.md"), "file")) return;
    }
    const result = f.run(["guide"]);
    assert.notEqual(result.status, 0);
    assert.match(result.stdout + result.stderr, /symbolic link|linked ancestor/);
    assert.equal((result.stdout + result.stderr).includes(sentinel), false);
  });
}

for (const placement of ["leaf", "parent"]) {
  for (const flags of [["--verbose"], ["-v", "--dry-run"], ["--verbose", "--profile", "standard"], ["--verbose", "--pack-profile", "standard"]]) {
    test(`verbose pack ${flags.join(" ")} rejects ${placement} core-list link before output`, (t) => {
      const f = fixture(t);
      const created = f.run(["new", "task", "Local", "--json"]);
      assert.equal(created.status, 0, created.stderr);
      const qid = JSON.parse(created.stdout).node.qid;
      writeFile(path.join(f.outside, "core.txt"), `${sentinel}\n`);
      const configured = "discovery/core.txt";
      if (placement === "parent") {
        if (!linkOrSkip(t, f.outside, path.join(f.root, "discovery"), "dir")) return;
      } else {
        fs.mkdirSync(path.join(f.root, "discovery"));
        if (!linkOrSkip(t, path.join(f.outside, "core.txt"), path.join(f.root, configured), "file")) return;
      }
      const configPath = path.join(f.root, ".mdkg/config.json");
      const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
      config.pack.verbose_core_list_path = configured;
      writeFile(configPath, JSON.stringify(config));
      const result = f.run(["pack", qid, ...flags, "--out", "rejected-pack.md"]);
      assert.notEqual(result.status, 0);
      assert.match(result.stdout + result.stderr, /symbolic link|linked ancestor/);
      assert.equal((result.stdout + result.stderr).includes(sentinel), false);
      assert.equal(fs.existsSync(path.join(f.root, "rejected-pack.md")), false);
      assert.equal(fs.readFileSync(path.join(f.outside, "core.txt"), "utf8"), `${sentinel}\n`);
      const normal = f.run(["pack", qid, "--out", "normal-pack.md"]);
      assert.equal(normal.status, 0, normal.stderr);
      assert.equal(fs.existsSync(path.join(f.root, "normal-pack.md")), true);
    });
  }
}

test("guide rejects oversized regular content before emitting any bytes", (t) => {
  const f = fixture(t);
  writeFile(path.join(f.root, ".mdkg/core/guide.md"), "x".repeat(8 * 1024 * 1024 + 1));
  const result = f.run(["guide"]);
  assert.notEqual(result.status, 0);
  assert.equal(result.stdout, "");
  assert.match(result.stderr, /byte limit/);
});

test("core-list reader preserves native path and line parsing with explicit byte bounds", (t) => {
  const f = fixture(t);
  const name = process.platform === "win32" ? "nested/core.txt" : "..context\\literal/core.txt";
  const file = path.join(f.root, name);
  const content = "# heading\r\n \r\n ROOT:TASK-1 \r\nTASK-2\n";
  writeFile(file, content);
  assert.deepEqual(readVerboseCoreList(f.root, path.join(f.root, ".", name), Buffer.byteLength(content)), ["root:task-1", "task-2"]);
  assert.throws(() => readVerboseCoreList(f.root, file, Buffer.byteLength(content) - 1), /byte limit/);
  assert.throws(() => readVerboseCoreList(f.root, path.join(f.root, "missing")), /verbose core list not found/);
  assert.throws(() => readVerboseCoreList(f.root, f.outside), /parent|outside|root/);
  assert.throws(() => readVerboseCoreList(f.root, path.dirname(file)), /must be a file/);
});

test("guide retains Unicode text and exact trimEnd behavior", (t) => {
  const f = fixture(t);
  writeFile(path.join(f.root, ".mdkg/core/guide.md"), "# Guide\nCafé ☀\n  \n");
  const result = f.run(["guide"]);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout, "# Guide\nCafé ☀\n");
});
