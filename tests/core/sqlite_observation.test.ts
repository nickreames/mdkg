import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import { makeTempDir } from "../helpers/fs";
const runtime = process.env.MDKG_TEST_PACKAGE ? path.join(process.env.MDKG_TEST_PACKAGE, "dist") : path.resolve(__dirname, "../..");
const cli = path.join(runtime, "cli.js");
const { DatabaseSync } = require("node:sqlite");
function command(root: string, args: string[]) {
  return spawnSync(process.execPath, [cli, ...args], { cwd: root, encoding: "utf8", timeout: 20000 });
}
function fixture(t: any) {
  const root = makeTempDir("mdkg-sqlite-observation-"), cleanup: (() => void)[] = [];
  t.after(() => { for (const release of cleanup.reverse()) release(); fs.rmSync(root, { recursive: true, force: true }); });
  for (const args of [["init", "--graph-only"], ["db", "init"], ["db", "migrate"], ["db", "snapshot", "seal"]]) {
    const r = command(root, args); assert.equal(r.status, 0, r.stdout + r.stderr);
  }
  const file = path.join(root, ".mdkg/config.json"), config = JSON.parse(fs.readFileSync(file, "utf8"));
  config.index.backend = "sqlite"; fs.writeFileSync(file, JSON.stringify(config));
  const r = command(root, ["index"]); assert.equal(r.status, 0, r.stdout + r.stderr);
  return { root, cleanup, index: path.join(root, ".mdkg/index/mdkg.sqlite"), db: path.join(root, ".mdkg/db/runtime/project.sqlite"), snapshot: path.join(root, ".mdkg/db/state/project.sqlite") };
}
function inventory(root: string): Record<string, string> {
  const entries: Record<string, string> = {};
  function walk(dir: string) { for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, e.name), key = path.relative(root, file), stat = fs.lstatSync(file);
    if (e.isDirectory()) { entries[key] = `directory:${stat.mode}`; walk(file); }
    else if (e.isSymbolicLink()) entries[key] = `link:${fs.readlinkSync(file)}`;
    else if (e.isFile()) entries[key] = `${stat.mode}:${crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex")}`;
    else entries[key] = `special:${stat.mode}`;
  } } walk(root); return entries;
}
const calls: Record<string, [string, string, string]> = {
  meta: ["graph/sqlite_index", "readSqliteIndexMeta(root, config)", "index"],
  health: ["graph/sqlite_index", "sqliteHealth(root, config)", "index"],
  numeric: ["graph/sqlite_index", "planNumericId({root,config,ws:'root',prefix:'task',currentMax:0})", "index"],
  verify: ["core/project_db_migrations", "verifyProjectDb(root, config)", "db"],
  stats: ["core/project_db_migrations", "projectDbStats(root, config)", "db"],
  queueStats: ["core/project_db_queue", "readProjectQueueStats(file)", "db"],
  queueSummary: ["core/project_db_queue", "readProjectQueueSnapshotSummary(file)", "db"],
  queues: ["core/project_db_queue", "listProjectQueues(file)", "db"],
  queue: ["core/project_db_queue", "readProjectQueue(file,'fixture')", "db"],
  messages: ["core/project_db_queue", "listProjectQueueMessages(file,{queue_name:'fixture'})", "db"],
  message: ["core/project_db_queue", "readProjectQueueMessage(file,'fixture','one')", "db"],
  leases: ["core/project_db_events", "readProjectWriterLeaseStats(file)", "db"],
  materializer: ["core/project_db_materializer", "readProjectDbMaterializerStats(file)", "db"],
  snapshot: ["core/project_db_snapshot", "verifyProjectDbSnapshot(root,config)", "snapshot"],
  snapshotDump: ["core/project_db_snapshot", "dumpProjectDbSnapshot(root,config)", "snapshot"],
  snapshotDiff: ["core/project_db_snapshot", "diffProjectDbSnapshots(root,file,file)", "snapshot"],
  verifyCannotDowngrade: ["core/project_db_migrations", "verifyProjectDb(root,config,{readOnly:false})", "db"],
  summaryCannotDowngrade: ["core/project_db_queue", "readProjectQueueSnapshotSummary(file,{readOnly:false})", "db"],
};
function read(f: any, name: string, requireReadOnly = false) {
  const [module, call, key] = calls[name];
  const script = `const root=${JSON.stringify(f.root)},file=${JSON.stringify(f[key])};
    const sqlite=require('node:sqlite'),Ctor=sqlite.DatabaseSync;let opens=0;
    if(${requireReadOnly})sqlite.DatabaseSync=function(file,options){if(options?.readOnly!==true)throw Error('WRITE_CAPABLE_OPEN');opens++;return new Ctor(file,options)};
    const config=require(${JSON.stringify(path.join(runtime, "core/config"))}).loadConfig(root);
    const api=require(${JSON.stringify(path.join(runtime, module))});
    try{const result=api.${call};const text=JSON.stringify(result);if(text?.includes('WRITE_CAPABLE_OPEN'))throw Error(text);console.log(JSON.stringify({result,opens}));}catch(error){console.error(error.message);process.exitCode=1}`;
  return spawnSync(process.execPath, ["-e", script], { cwd: f.root, encoding: "utf8", timeout: 10000 });
}
for (const name of Object.keys(calls)) {
  test(`${name} observation uses an explicit read-only native connection`, t => {
    const f = fixture(t), before = inventory(f.root), r = read(f, name, true);
    assert.equal(r.status, 0, r.stdout + r.stderr); assert.ok(JSON.parse(r.stdout).opens > 0); assert.deepEqual(inventory(f.root), before);
  });
  test(`${name} observation preserves closed WAL state without creating sidecars`, t => {
    const f = fixture(t), file = (f as any)[calls[name][2]], db = new DatabaseSync(file);
    db.exec("PRAGMA journal_mode=WAL"); db.close();
    const before = inventory(f.root), r = read(f, name);
    assert.equal(r.signal, null, r.stderr); assert.deepEqual(inventory(f.root), before);
    assert.match(r.stdout + r.stderr, /WAL|observ|sidecar|transient|invalid/i);
  });
}
for (const name of ["meta", "queueStats", "queueSummary", "leases"]) {
  test(`${name} missing observation never creates a database`, t => {
    const f = fixture(t); fs.unlinkSync((f as any)[calls[name][2]]);
    const before = inventory(f.root), r = read(f, name);
    assert.notEqual(r.status, 0); assert.deepEqual(inventory(f.root), before);
  });
}

test("a journal-mode transition after admission must not let an observation create sidecars", t => {
  const f = fixture(t);
  const script = `const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
    const sqlite=require('node:sqlite'),Native=sqlite.DatabaseSync,file=${JSON.stringify(f.index)};
    function inventory(){return Object.fromEntries(fs.readdirSync(path.dirname(file)).sort().map(name=>[name,crypto.createHash('sha256').update(fs.readFileSync(path.join(path.dirname(file),name))).digest('hex')]))}
    let before,options;
    sqlite.DatabaseSync=function(selected,input){if(!/^\\/(?:dev|proc\\/self)\\/fd\\/\\d+$/.test(selected)||input?.readOnly!==true)throw Error('unexpected observation open');
      const writer=new Native(file);writer.exec('PRAGMA journal_mode=WAL');writer.close();
      before=inventory();options=input;return new Native(selected,input)};
    const config=require(${JSON.stringify(path.join(runtime, "core/config"))}).loadConfig(${JSON.stringify(f.root)});
    let result,error;try{result=require(${JSON.stringify(path.join(runtime, "graph/sqlite_index"))}).readSqliteIndexMeta(${JSON.stringify(f.root)},config)}catch(e){error=String(e)}
    console.log(JSON.stringify({before,after:inventory(),options,result,error}));`;
  const r = spawnSync(process.execPath, ["-e", script], { cwd: f.root, encoding: "utf8", timeout: 10000 });
  assert.equal(r.status, 0, r.stderr);
  const result = JSON.parse(r.stdout);
  assert.deepEqual(result.options, { readOnly: true });
  assert.ok(result.before, "interleaving reached the boundary after admission");
  assert.deepEqual(result.after, result.before, "the observational connection changed the post-writer baseline");
});

test("a valid database replacing the pathname during observation is rejected", t => {
  const f = fixture(t);
  const script = `const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
    const sqlite=require('node:sqlite'),Native=sqlite.DatabaseSync,file=${JSON.stringify(f.index)};
    function inventory(){return Object.fromEntries(fs.readdirSync(path.dirname(file)).sort().map(name=>[name,crypto.createHash('sha256').update(fs.readFileSync(path.join(path.dirname(file),name))).digest('hex')]))}
    let atReplacement,options;
    sqlite.DatabaseSync=function(selected,input){if(!/^\\/(?:dev|proc\\/self)\\/fd\\/\\d+$/.test(selected)||input?.readOnly!==true)throw Error('unexpected observation open');
      const replacement=file+'.replacement';fs.copyFileSync(file,replacement);fs.renameSync(replacement,file);
      atReplacement=inventory();options=input;return new Native(selected,input)};
    const config=require(${JSON.stringify(path.join(runtime, "core/config"))}).loadConfig(${JSON.stringify(f.root)});
    let result,error;try{result=require(${JSON.stringify(path.join(runtime, "graph/sqlite_index"))}).readSqliteIndexMeta(${JSON.stringify(f.root)},config)}catch(e){error=String(e)}
    console.log(JSON.stringify({atReplacement,after:inventory(),options,result,error}));`;
  const r = spawnSync(process.execPath, ["-e", script], { cwd: f.root, encoding: "utf8", timeout: 10000 });
  assert.equal(r.status, 0, r.stderr);
  const result = JSON.parse(r.stdout);
  assert.deepEqual(result.options, { readOnly: true });
  assert.ok(result.atReplacement, "interleaving replaced the pathname after descriptor admission");
  assert.match(result.error, /SQLite database path was replaced during observation/);
  assert.equal(result.result, undefined);
  assert.deepEqual(result.after, result.atReplacement, "the observation changed the replacement database or created sidecars");
});

for (const mode of ["closed-wal", "live-wal"]) {
  test(`explicit snapshot sealing remains functional for ${mode}`, t => {
    const f = fixture(t), db = new DatabaseSync(f.db); db.exec("PRAGMA journal_mode=WAL");
    if (mode === "closed-wal") db.close(); else f.cleanup.push(() => db.close());
    const r = command(f.root, ["db", "snapshot", "seal", "--json"]); assert.equal(r.status, 0, r.stdout + r.stderr);
    const verified = command(f.root, ["db", "snapshot", "verify", "--json"]); assert.equal(verified.status, 0, verified.stdout + verified.stderr);
  });
  test(`explicit queue mutations remain functional for ${mode}`, t => {
    const f = fixture(t), db = new DatabaseSync(f.db); db.exec("PRAGMA journal_mode=WAL");
    if (mode === "closed-wal") db.close(); else f.cleanup.push(() => db.close());
    for (const args of [["db", "queue", "create", "fixture"], ["db", "queue", "enqueue", "fixture", "one", "--payload-json", '{"synthetic":true}']]) {
      const r = command(f.root, args); assert.equal(r.status, 0, r.stdout + r.stderr);
    }
  });
  test(`explicit work trigger enqueue remains functional for ${mode}`, t => {
    const f = fixture(t);
    for (const args of [
      ["new", "manifest", "Fixture worker", "--id", "agent.fixture"],
      ["work", "contract", "new", "Fixture work", "--id", "work.fixture", "--agent-id", "agent.fixture", "--kind", "fixture", "--inputs", "request:text:required", "--outputs", "result:text:required"],
      ["db", "queue", "create", "fixture"],
    ]) { const r = command(f.root, args); assert.equal(r.status, 0, r.stdout + r.stderr); }
    const db = new DatabaseSync(f.db); db.exec("PRAGMA journal_mode=WAL");
    if (mode === "closed-wal") db.close(); else f.cleanup.push(() => db.close());
    const r = command(f.root, ["work", "trigger", "work.fixture", "--id", "order.fixture", "--requester", "user://fixture", "--enqueue", "fixture", "--json"]);
    assert.equal(r.status, 0, r.stdout + r.stderr);
    const result = JSON.parse(r.stdout);
    assert.equal(result.trigger.executed, false); assert.equal(result.trigger.enqueue.enqueued, true);
    const check = new DatabaseSync(f.db);
    try { assert.equal(check.prepare("SELECT status FROM project_queue_message WHERE queue_name = 'fixture' AND message_id = 'order.fixture'").get()?.status, "ready"); }
    finally { check.close(); }
  });
}

for (const mode of ["live-wal", "orphan-wal", "hot-journal"]) {
  test(`observations leave real ${mode} database and sidecar bytes unchanged`, t => {
    const f = fixture(t);
    const db = new DatabaseSync(f.db);
    db.exec("CREATE TABLE observation_probe(value BLOB); WITH RECURSIVE n(x) AS (SELECT 1 UNION ALL SELECT x+1 FROM n WHERE x<100) INSERT INTO observation_probe SELECT zeroblob(4096) FROM n");
    if (mode === "live-wal") { db.exec("PRAGMA journal_mode=WAL; UPDATE observation_probe SET value=randomblob(4096)"); f.cleanup.push(() => db.close()); }
    else {
      db.close();
      const setup = mode === "orphan-wal" ? "PRAGMA journal_mode=WAL; UPDATE observation_probe SET value=randomblob(4096)" : "PRAGMA cache_size=1; BEGIN IMMEDIATE; UPDATE observation_probe SET value=randomblob(4096)";
      const r = spawnSync(process.execPath, ["-e", `const db=new(require('node:sqlite').DatabaseSync)(${JSON.stringify(f.db)});db.exec(${JSON.stringify(setup)});process.kill(process.pid,'SIGKILL')`], { encoding: "utf8", timeout: 10000 });
      assert.equal(r.signal, "SIGKILL", r.stderr);
    }
    const suffix = mode === "hot-journal" ? "-journal" : "-wal";
    assert.ok(fs.statSync(f.db + suffix).size > 512);
    if (mode === "hot-journal") assert.notDeepEqual(fs.readFileSync(f.db + suffix).subarray(0, 8), Buffer.alloc(8), "journal has a hot header");
    const before = inventory(f.root);
    for (const name of ["verify", "stats", "queueStats", "queueSummary", "leases"]) {
      const r = read(f, name); assert.equal(r.signal, null, r.stderr);
      assert.match(r.stdout + r.stderr, /WAL|observ|sidecar|transient|invalid/i);
      assert.deepEqual(inventory(f.root), before);
    }
  });
}

for (const shape of ["directory", "symlink", "fifo", "malformed"]) {
  test(`observational admission refuses ${shape} databases without effects`, t => {
    if (process.platform === "win32" && shape === "fifo") { t.skip("POSIX FIFO"); return; }
    const f = fixture(t); fs.unlinkSync(f.db);
    if (shape === "directory") fs.mkdirSync(f.db);
    if (shape === "symlink") fs.symlinkSync(f.snapshot, f.db);
    if (shape === "malformed") fs.writeFileSync(f.db, "not a database");
    if (shape === "fifo") { const r = spawnSync("mkfifo", [f.db], { encoding: "utf8" }); assert.equal(r.status, 0, r.stderr); }
    const before = inventory(f.root);
    for (const name of ["verify", "queueStats", "leases"]) {
      const r = read(f, name); assert.equal(r.signal, null, r.stderr); assert.ok(r.status !== 0 || JSON.parse(r.stdout).result.ok === false); assert.deepEqual(inventory(f.root), before);
    }
  });
}

for (const suffix of ["-wal", "-shm", "-journal"]) {
  test(`${suffix} files and unsafe types are refused before observation`, t => {
    const f = fixture(t), sidecar = f.db + suffix;
    for (const shape of ["file", "directory", "symlink"]) {
      if (shape === "file") fs.writeFileSync(sidecar, "synthetic sidecar");
      if (shape === "directory") fs.mkdirSync(sidecar);
      if (shape === "symlink") fs.symlinkSync(f.snapshot, sidecar);
      const before = inventory(f.root), r = read(f, "queueStats");
      assert.notEqual(r.status, 0); assert.equal(r.signal, null); assert.deepEqual(inventory(f.root), before);
      if (shape === "directory") fs.rmdirSync(sidecar); else fs.unlinkSync(sidecar);
    }
  });
}

const cliReads = [
  ["status", "--json"], ["validate", "--json"], ["db", "index", "status", "--json"], ["db", "index", "verify", "--json"],
  ["db", "verify", "--json"], ["db", "stats", "--json"], ["db", "queue", "stats", "--json"], ["db", "queue", "list", "fixture", "--json"],
  ["db", "snapshot", "verify", "--json"], ["db", "snapshot", "status", "--json"], ["db", "snapshot", "dump", "--json"],
  ["db", "snapshot", "diff", ".mdkg/db/state/project.sqlite", ".mdkg/db/state/project.sqlite", "--json"],
];
for (const mode of ["closed", "wal", "permission-read-only"]) {
  test(`CLI observations preserve complete ${mode} inventories`, t => {
    if (mode === "permission-read-only" && (process.platform === "win32" || process.getuid?.() === 0)) { t.skip("requires non-root POSIX permission enforcement"); return; }
    const f = fixture(t);
    for (const file of [f.db, f.index, f.snapshot]) {
      if (mode === "wal") { const db = new DatabaseSync(file); db.exec("PRAGMA journal_mode=WAL"); db.close(); }
      if (mode === "permission-read-only") { fs.chmodSync(file, 0o400); fs.chmodSync(path.dirname(file), 0o500); }
    }
    if (mode === "permission-read-only") {
      f.cleanup.push(() => { for (const file of [f.db, f.index, f.snapshot]) { fs.chmodSync(path.dirname(file), 0o700); fs.chmodSync(file, 0o600); } });
      assert.throws(() => fs.openSync(f.db, "r+"), /EACCES|EPERM/);
      assert.throws(() => fs.writeFileSync(f.db + "-journal", "permission probe"), /EACCES|EPERM/);
    }
    const before = inventory(f.root);
    for (const args of cliReads) {
      const r = command(f.root, args); assert.equal(r.signal, null, args.join(" ") + r.stderr);
      if (mode !== "wal") assert.equal(r.status, 0, args.join(" ") + r.stdout + r.stderr);
      else {
        if (args[0] === "status") {
          const result = JSON.parse(r.stdout);
          assert.equal(result.db.ok, false); assert.ok(result.db.failure_count > 0);
          assert.ok(result.summary.errors.some((error: string) => error.startsWith("db:")));
        } else assert.match(r.stdout + r.stderr, /SQLite observation refuses WAL or transient\/recovery state/, args.join(" "));
        assert.doesNotMatch(r.stdout + r.stderr, /requires <queue>|unknown (?:command|option)|Usage:/, args.join(" "));
      }
      assert.deepEqual(inventory(f.root), before, args.join(" "));
    }
  });
}
