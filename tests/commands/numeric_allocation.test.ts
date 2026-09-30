import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import { spawnSync } from "node:child_process";
import crypto from "node:crypto";
import { initializeTestGitIndex, makeTempDir, writeFile } from "../helpers/fs";
import { writeRootConfig } from "../helpers/config";
import { writeDefaultTemplates } from "../helpers/templates";

const cli = process.env.MDKG_TEST_PACKAGE
  ? path.join(process.env.MDKG_TEST_PACKAGE, "dist/cli.js") : path.resolve(__dirname, "../../cli.js");
const runtime = path.dirname(cli);
const { createGraphFormat } = require(path.join(runtime, "graph/identity"));
const { loadConfig } = require(path.join(runtime, "core/config"));
const { planNumericId, reservePlannedNumericIds } = require(path.join(runtime, "graph/sqlite_index"));
const graphId = "11111111-1111-4111-8111-111111111111";
function run(root: string, args: string[]) {
  return spawnSync(process.execPath, [cli, ...args], { cwd: root, encoding: "utf8", timeout: 5000 });
}
function node(id: string, type = "task", v2 = false) {
  return `---\nid: ${id}\n${v2 ? `graph_id: ${graphId}\nnode_id: ${crypto.randomUUID()}\n` : ""}type: ${type}\ntitle: allocation fixture\nstatus: todo\npriority: 1\ntags: []\nowners: []\nlinks: []\nartifacts: []\nrelates: []\nblocked_by: []\nblocks: []\nrefs: []\naliases: []\ncreated: 2026-09-21\nupdated: 2026-09-21\n---\n# Fixture\n`;
}
function fixture(backend = "json", v2 = false) {
  const root = makeTempDir("mdkg-numeric-");
  writeRootConfig(root); writeDefaultTemplates(root);
  const configPath = path.join(root, ".mdkg/config.json");
  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  config.index.backend = backend;
  fs.writeFileSync(configPath, JSON.stringify(config));
  writeFile(path.join(root, ".mdkg/core/core.md"), "# Core\n");
  if (v2) writeFile(path.join(root, ".mdkg/graph.json"), JSON.stringify({ ...createGraphFormat(), graph_id: graphId }));
  initializeTestGitIndex(root);
  return root;
}
function authored(root: string): Record<string, string> {
  const result: Record<string, string> = {};
  function walk(dir: string) {
    if (!fs.existsSync(dir)) return;
    for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
      const file = path.join(dir, item.name);
      if (item.isDirectory()) walk(file);
      else result[path.relative(root, file)] = fs.readFileSync(file).toString("base64");
    }
  }
  walk(path.join(root, ".mdkg/work")); walk(path.join(root, ".mdkg/events"));
  walk(path.join(root, ".git"));
  return result;
}
for (const v2 of [false, true]) for (const backend of ["json", "sqlite"]) {
  for (const decimal of ["9007199254740991", "9007199254740992", "0009007199254740993", "1000000000000000000000", "9".repeat(310)]) {
    for (const kind of ["new", "checkpoint", "task-done"]) {
      test(`v${v2 ? 2 : 1} ${backend} ${kind} refuses unsafe or exhausted ${decimal.slice(0, 25)} before authored effects`, () => {
        const root = fixture(backend, v2);
        try {
          writeFile(path.join(root, ".mdkg/work/task-1.md"), node("task-1", "task", v2));
          const prefix = kind === "new" ? "task" : "chk";
          writeFile(path.join(root, ".mdkg/work/large.md"), node(`${prefix}-${decimal}`, prefix === "chk" ? "checkpoint" : "task", v2));
          const indexed = run(root, ["index"]); assert.equal(indexed.status, 0, indexed.stderr);
          const before = authored(root);
          const dbPath = path.join(root, ".mdkg/index/mdkg.sqlite");
          const dbBefore = fs.existsSync(dbPath) ? fs.readFileSync(dbPath) : undefined;
          const args = kind === "new" ? ["new", "task", "new allocation"] : kind === "checkpoint"
            ? ["checkpoint", "new", "new allocation"] : ["task", "done", "task-1", "--checkpoint", "new allocation", "--json"];
          const result = run(root, args);
          assert.equal(result.error, undefined, String(result.error));
          assert.notEqual(result.status, 0, result.stdout);
          assert.match(result.stderr, /numeric|safe integer|exhausted/i);
          assert.deepEqual(authored(root), before);
          assert.deepEqual(fs.existsSync(dbPath) ? fs.readFileSync(dbPath) : undefined, dbBefore);
          assert.equal(fs.existsSync(path.join(root, ".mdkg/index/write.lock")), false);
        } finally { fs.rmSync(root, { recursive: true, force: true }); }
      });
    }
  }
}
test("duplicate repair preview terminates on unsafe aliases", () => {
  const root = fixture();
  try {
    writeFile(path.join(root, ".mdkg/work/one.md"), node("task-9007199254740992"));
    writeFile(path.join(root, ".mdkg/work/two.md"), node("task-9007199254740992"));
    const before = authored(root);
    const result = run(root, ["fix", "ids", "--json"]);
    assert.equal(result.error, undefined, String(result.error));
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /numeric|safe integer|exhausted/i);
    assert.deepEqual(authored(root), before);
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});

for (const backend of ["json", "sqlite"]) test(`${backend} last safe alias is exact and the following allocation refuses`, () => {
  const root = fixture(backend);
  try {
    writeFile(path.join(root, ".mdkg/work/large.md"), node("task-9007199254740990"));
    const result = run(root, ["new", "task", "last safe alias", "--json"]);
    assert.equal(result.status, 0, result.stderr); assert.match(result.stdout, /task-9007199254740991/);
    const before = authored(root);
    const refused = run(root, ["new", "task", "exhausted", "--json"]);
    assert.notEqual(refused.status, 0); assert.match(refused.stderr, /exhausted/);
    assert.deepEqual(authored(root), before);
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});

for (const value of [9007199254740992n, -1, 1.5, "garbage"]) test(`SQLite refuses invalid/exhausted stored counter ${value}`, () => {
  const root = fixture("sqlite");
  try {
    const { DatabaseSync } = require("node:sqlite");
    const dbPath = path.join(root, ".mdkg/index/mdkg.sqlite");
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    const db = new DatabaseSync(dbPath);
    db.exec("CREATE TABLE id_allocations (ws TEXT, prefix TEXT, next_value INTEGER, PRIMARY KEY (ws, prefix))");
    db.prepare("INSERT INTO id_allocations VALUES ('root', 'task', ?)").run(value); db.close();
    const before = fs.readFileSync(dbPath), config = loadConfig(root);
    assert.throws(() => planNumericId({ root, config, ws: "root", prefix: "task", currentMax: 0 }), /numeric/);
    assert.deepEqual(fs.readFileSync(dbPath), before);
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});

test("SQLite batch rejects a stale later reservation without partial counter writes", () => {
  const root = fixture("sqlite"), config = loadConfig(root);
  try {
    const requests = [{ ws: "root", prefix: "task", currentMax: 0, id: "task-1" }, { ws: "root", prefix: "chk", currentMax: 0, id: "chk-1" }];
    reservePlannedNumericIds({ root, config, reservations: [requests[1]] });
    const dbPath = path.join(root, ".mdkg/index/mdkg.sqlite"), before = fs.readFileSync(dbPath);
    assert.throws(() => reservePlannedNumericIds({ root, config, reservations: requests }), /stale/);
    assert.deepEqual(fs.readFileSync(dbPath), before);
    assert.equal(planNumericId({ root, config, ws: "root", prefix: "task", currentMax: 0 }), "task-1");
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});

for (const v2 of [false, true]) for (const backend of ["json", "sqlite"]) {
  test(`v${v2 ? 2 : 1} ${backend} loop preflights every child before reservations`, () => {
    const root = fixture(backend, v2);
    try {
      writeFile(path.join(root, ".mdkg/work/large.md"), node("task-1000000000000000000000", "task", v2));
      const seed = node("loop-1", "loop").replace("status: todo", "status: todo\nloop_mode: readonly\nloop_role: template\nscope_refs: []\nmaterialization_mode: default_children\ndefinition_of_done: Review complete\nblocker_policy: spike_proposal_recommendation_continue");
      writeFile(path.join(root, ".mdkg/templates/loops/allocation.loop.md"), seed);
      const indexed = run(root, ["index"]); assert.equal(indexed.status, 0, indexed.stderr);
      const before = authored(root), dbPath = path.join(root, ".mdkg/index/mdkg.sqlite");
      const dbBefore = fs.existsSync(dbPath) ? fs.readFileSync(dbPath) : undefined;
      for (const flags of [["--dry-run"], []]) {
        const result = run(root, ["loop", "fork", "allocation", "--scope", "repository", "--json", ...flags]);
        assert.equal(result.error, undefined); assert.notEqual(result.status, 0);
        assert.match(result.stderr, /numeric/); assert.deepEqual(authored(root), before);
        assert.deepEqual(fs.existsSync(dbPath) ? fs.readFileSync(dbPath) : undefined, dbBefore);
        assert.equal(fs.existsSync(path.join(root, ".mdkg/index/write.lock")), false);
      }
    } finally { fs.rmSync(root, { recursive: true, force: true }); }
  });
}
for (const backend of ["json", "sqlite"]) test(`${backend} safe leading-zero aliases allocate an unused decimal successor`, () => {
  const root = fixture(backend);
  try {
    writeFile(path.join(root, ".mdkg/work/task-0007.md"), node("task-0007"));
    const result = run(root, ["new", "task", "control", "--json"]);
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /task-8/);
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});

for (const backend of ["json", "sqlite"]) test(`${backend} allocation ignores stale numeric maxima when cache refresh is disabled`, () => {
  const root = fixture(backend);
  try {
    writeFile(path.join(root, ".mdkg/work/first.md"), node("task-1"));
    assert.equal(run(root, ["index"]).status, 0);
    writeFile(path.join(root, ".mdkg/work/incoming.md"), node("task-2"));
    const created = run(root, ["new", "task", "fresh source", "--no-reindex", "--json"]);
    assert.equal(created.status, 0, created.stderr); assert.match(created.stdout, /task-3/);
    writeFile(path.join(root, ".mdkg/work/unsafe.md"), node("task-9007199254740992"));
    const before = authored(root), refused = run(root, ["new", "task", "unsafe", "--no-reindex"]);
    assert.notEqual(refused.status, 0); assert.match(refused.stderr, /numeric/);
    assert.deepEqual(authored(root), before);
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});

test("task done preflights the actual oversized checkpoint body before completion", () => {
  const root = fixture();
  try {
    writeFile(path.join(root, ".mdkg/work/task-1.md"), node("task-1"));
    const configPath = path.join(root, ".mdkg/config.json"), config = JSON.parse(fs.readFileSync(configPath, "utf8"));
    config.index.limits = { max_files: 1000, max_file_bytes: 8000, max_total_bytes: 1000000, max_depth: 20 };
    fs.writeFileSync(configPath, JSON.stringify(config));
    assert.equal(run(root, ["index"]).status, 0);
    const before = authored(root);
    const result = run(root, ["task", "done", "task-1", "--checkpoint", "oversized", "--note", "x".repeat(10000)]);
    assert.notEqual(result.status, 0); assert.match(result.stderr, /max_file_bytes/);
    assert.deepEqual(authored(root), before);
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});

for (const kind of ["new", "checkpoint"]) test(`${kind} prospective count limit refuses before writing`, () => {
  const root = fixture("sqlite");
  try {
    writeFile(path.join(root, ".mdkg/work/task-1.md"), node("task-1"));
    const configPath = path.join(root, ".mdkg/config.json"), config = JSON.parse(fs.readFileSync(configPath, "utf8"));
    // Template discovery shares these limits; keep its inventory comfortably below this bound.
    config.index.limits = { max_files: 50, max_file_bytes: 8000, max_total_bytes: 1000000, max_depth: 20 };
    fs.writeFileSync(configPath, JSON.stringify(config));
    for (let i = 2; i < 50; i++) writeFile(path.join(root, `.mdkg/work/task-${i}.md`), node(`task-${i}`));
    const indexed = run(root, ["index"]); assert.equal(indexed.status, 0, indexed.stderr);
    const before = authored(root), dbPath = path.join(root, ".mdkg/index/mdkg.sqlite"), dbBefore = fs.readFileSync(dbPath);
    const result = run(root, kind === "new" ? ["new", "task", "capacity"] : ["checkpoint", "new", "capacity"]);
    assert.notEqual(result.status, 0); assert.match(result.stderr, /max_files/);
    assert.deepEqual(authored(root), before); assert.deepEqual(fs.readFileSync(dbPath), dbBefore);
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});

for (const decimal of ["9007199254740991", "9007199254740992", "0009007199254740993"]) test(`repair apply refuses ${decimal} and releases its lock without staging`, () => {
  const root = fixture();
  try {
    writeFile(path.join(root, ".mdkg/work/one.md"), node(`task-${decimal}`));
    writeFile(path.join(root, ".mdkg/work/two.md"), node(`task-${decimal}`));
    const before = authored(root), result = run(root, ["fix", "ids", "--apply", "--json"]);
    assert.equal(result.error, undefined); assert.notEqual(result.status, 0); assert.match(result.stderr, /numeric/);
    assert.deepEqual(authored(root), before); assert.equal(fs.existsSync(path.join(root, ".mdkg/index/write.lock")), false);
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});

test("Git-stage unsafe add/add repair refuses without changing the unmerged index", () => {
  const root = fixture();
  const git = (args: string[]) => spawnSync("git", ["-c", "user.name=mdkg fixture", "-c", "user.email=fixture@example.invalid", ...args], { cwd: root, encoding: "utf8", timeout: 5000 });
  const ok = (args: string[]) => { const result = git(args); assert.equal(result.status, 0, result.stderr); return result.stdout.trim(); };
  try {
    ok(["add", ".mdkg/config.json"]); ok(["commit", "-qm", "base"]);
    const base = ok(["rev-parse", "HEAD"]), file = ".mdkg/work/collision.md";
    for (const branch of ["left", "right"]) {
      ok(["checkout", "-qb", branch, base]);
      writeFile(path.join(root, file), node("task-9007199254740992").replace("allocation fixture", branch));
      ok(["add", file]); ok(["commit", "-qm", branch]);
    }
    ok(["checkout", "-q", "left"]); assert.notEqual(git(["merge", "--no-edit", "right"]).status, 0);
    assert.match(ok(["ls-files", "-u"]), /collision.md/);
    const before = authored(root);
    for (const flags of [[], ["--apply"]]) {
      const result = run(root, ["fix", "ids", "--target", "task-9007199254740992", "--json", ...flags]);
      assert.equal(result.error, undefined);
      if (flags.length) assert.notEqual(result.status, 0);
      else {
        assert.equal(result.status, 0, result.stderr);
        const receipt = JSON.parse(result.stdout);
        assert.equal(receipt.proposed_changes.length, 0);
        assert.equal(receipt.summary.apply_supported, false);
        assert.match(result.stdout, /numeric/);
      }
      assert.deepEqual(authored(root), before); assert.equal(fs.existsSync(path.join(root, ".mdkg/index/write.lock")), false);
    }
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});

test("duplicate repair skips occupied safe successors and refuses exhaustion", () => {
  const { nextUnusedNumericAlias } = require(path.join(runtime, "util/id"));
  const occupied = new Set(["task-7", "task-8", "task-9"]);
  assert.equal(nextUnusedNumericAlias("task-0007", occupied), "task-10");
  assert.ok(occupied.has("task-10"));
  assert.throws(() => nextUnusedNumericAlias("task-9007199254740990", new Set(["task-9007199254740991"])), /exhausted/);
});

test("invalid rendered node syntax cannot reserve a SQLite alias", () => {
  const root = fixture("sqlite");
  try {
    const templatePath = path.join(root, ".mdkg/templates/default/task.md");
    fs.writeFileSync(templatePath, fs.readFileSync(templatePath, "utf8").replace("tags: []", "tags: malformed-string"));
    const config = loadConfig(root), before = authored(root);
    const result = run(root, ["new", "task", "invalid template"]);
    assert.notEqual(result.status, 0); assert.match(result.stderr, /tags/);
    assert.deepEqual(authored(root), before);
    assert.equal(planNumericId({ root, config, ws: "root", prefix: "task", currentMax: 0 }), "task-1");
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});

test("prospective admission retains bundled manifest fallback", () => {
  const root = fixture("sqlite");
  try {
    fs.unlinkSync(path.join(root, ".mdkg/templates/default/manifest.md"));
    const result = run(root, ["new", "manifest", "fallback control", "--json"]);
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /manifest-1/);
    assert.match(result.stderr, /bundled template fallback/);
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});
