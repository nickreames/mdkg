import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { makeTempDir } from "../helpers/fs";

const runtime = process.env.MDKG_TEST_PACKAGE ? path.join(process.env.MDKG_TEST_PACKAGE, "dist") : path.resolve(__dirname, "../..");
const observation = require(path.join(runtime, "core/sqlite_observation"));
const sqlite = require("node:sqlite");
const Native = sqlite.DatabaseSync;

function fixture(t: any): { root: string; file: string } {
  const root = makeTempDir("mdkg-memory-observation-"), file = path.join(root, "fixture.sqlite");
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const db = new Native(file);
  try { db.exec("CREATE TABLE sample(value TEXT); INSERT INTO sample VALUES('synthetic');"); }
  finally { db.close(); }
  return { root, file };
}
function inventory(root: string) {
  return fs.readdirSync(root).sort().map(name => {
    const file = path.join(root, name), stat = fs.lstatSync(file);
    return { name, mode: stat.mode, size: stat.size, sha256: crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex") };
  });
}
function observe(file: string, read: (db: any) => any = db => db.prepare("SELECT value FROM sample").get().value) {
  return observation.withSelectedSqliteObservation(file, read);
}

test("portable SQLite observation opens memory only without OS dispatch or tools", t => {
  const f = fixture(t), before = inventory(f.root), calls: string[] = [];
  const platform = Object.getOwnPropertyDescriptor(process, "platform")!;
  sqlite.DatabaseSync = function(file: string, options: unknown) { calls.push(file); assert.equal(file, ":memory:"); return new Native(file, options); };
  sqlite.DatabaseSync.prototype = Native.prototype;
  try {
    // Simulated dispatch is not Windows qualification. It proves there is no
    // macOS/Linux branch gate or dependence on a descriptor pseudo-filesystem.
    Object.defineProperty(process, "platform", { ...platform, value: "win32" });
    assert.equal(observe(f.file), "synthetic");
  } finally { Object.defineProperty(process, "platform", platform); sqlite.DatabaseSync = Native; }
  assert.deepEqual(calls, [":memory:"]);
  assert.deepEqual(inventory(f.root), before);
});

for (const method of ["deserialize", "setAuthorizer", "enableDefensive"]) {
  test(`missing ${method} refuses before source admission or native construction`, t => {
    const f = fixture(t), before = inventory(f.root), original = Native.prototype[method];
    const open = fs.openSync; let opens = 0;
    try {
      Native.prototype[method] = undefined;
      (fs as any).openSync = (...args: any[]) => { opens++; return (open as any)(...args); };
      assert.throws(() => observe(f.file), /runtime is unsupported/);
      assert.equal(opens, 0);
    } finally { Native.prototype[method] = original; fs.openSync = open; }
    assert.deepEqual(inventory(f.root), before);
  });
}

for (const statement of [
  "INSERT INTO sample VALUES('changed')", "CREATE TABLE rejected(value TEXT)",
  "CREATE TEMP TABLE rejected(value TEXT)", "PRAGMA query_only=OFF",
  "PRAGMA temp_store=FILE", "PRAGMA trusted_schema=ON", "PRAGMA writable_schema=ON",
  "PRAGMA user_version=4", "PRAGMA foreign_keys=OFF", "SELECT load_extension('absent')",
]) {
  test(`memory observer refuses SQL mutation or capability change: ${statement}`, t => {
    const f = fixture(t), before = inventory(f.root);
    observe(f.file, db => {
      assert.throws(() => db.exec(statement), /not authorized|authorization|readonly/i);
      assert.equal(db.prepare("PRAGMA query_only").get().query_only, 1);
      assert.equal(db.prepare("PRAGMA temp_store").get().temp_store, 2);
      assert.equal(db.prepare("SELECT count(*) AS n FROM sample").get().n, 1);
    });
    assert.deepEqual(inventory(f.root), before);
  });
}

for (const operation of ["ATTACH", "VACUUM INTO"]) {
  test(`${operation} cannot make an external database`, t => {
    const f = fixture(t), before = inventory(f.root);
    const destination = path.join(f.root, "forbidden.sqlite").replace(/'/g, "''");
    observe(f.file, db => assert.throws(() => db.exec(operation === "ATTACH" ? `ATTACH '${destination}' AS other` : `VACUUM INTO '${destination}'`)));
    assert.deepEqual(inventory(f.root), before);
  });
}

test("memory observation refuses low or unknown available memory without allocating the image", t => {
  const f = fixture(t), before = inventory(f.root), available = process.availableMemory, alloc = Buffer.alloc;
  const size = fs.statSync(f.file).size;
  let images = 0;
  try {
    (Buffer as any).alloc = (bytes: number, ...args: any[]) => { if (bytes >= size) images++; return (alloc as any)(bytes, ...args); };
    for (const value of [0, size * 2 - 1, NaN]) {
      process.availableMemory = () => value;
      assert.throws(() => observe(f.file), /available image memory/);
    }
    assert.equal(images, 0);
  } finally { process.availableMemory = available; Buffer.alloc = alloc; }
  assert.deepEqual(inventory(f.root), before);
});

test("memory is checked again before the native deserialize copy", t => {
  const f = fixture(t), before = inventory(f.root), available = process.availableMemory;
  let checks = 0, constructed = 0;
  sqlite.DatabaseSync = function(...args: any[]) { constructed++; return new Native(...args); };
  sqlite.DatabaseSync.prototype = Native.prototype;
  try {
    process.availableMemory = () => ++checks === 1 ? 1024 * 1024 : 0;
    assert.throws(() => observe(f.file), /available image memory/);
    assert.equal(constructed, 0);
  } finally { process.availableMemory = available; sqlite.DatabaseSync = Native; }
  assert.deepEqual(inventory(f.root), before);
});

test("image allocation failure reports clearly and closes both source admissions", t => {
  const f = fixture(t), before = inventory(f.root), alloc = Buffer.alloc, close = fs.closeSync;
  let closed = 0;
  try {
    (Buffer as any).alloc = (size: number, ...args: any[]) => { if (size > 100) throw new RangeError("synthetic allocation failure"); return (alloc as any)(size, ...args); };
    fs.closeSync = fd => { closed++; close(fd); };
    assert.throws(() => observe(f.file), /could not allocate its image.*synthetic allocation failure/);
    assert.equal(closed, 2);
  } finally { Buffer.alloc = alloc; fs.closeSync = close; }
  assert.deepEqual(inventory(f.root), before);
});

test("failed native deserialization closes its connection and preserves the source", t => {
  const f = fixture(t), before = inventory(f.root), deserialize = Native.prototype.deserialize, close = Native.prototype.close;
  let closed = 0;
  try {
    Native.prototype.deserialize = () => { throw new Error("synthetic deserialize failure"); };
    Native.prototype.close = function(this: any) { closed++; return close.call(this); };
    assert.throws(() => observe(f.file), /synthetic deserialize failure/);
    assert.equal(closed, 1);
  } finally { Native.prototype.deserialize = deserialize; Native.prototype.close = close; }
  assert.deepEqual(inventory(f.root), before);
});

for (const change of ["truncate", "grow"]) {
  test(`${change} during image capture refuses before returning a query`, t => {
    const f = fixture(t), read = fs.readSync;
    let changed = false, queried = false;
    try {
      (fs as any).readSync = (fd: number, buffer: Buffer, ...args: any[]) => {
        if (!changed && buffer.length > 100) {
          changed = true;
          if (change === "truncate") fs.truncateSync(f.file, 0);
          else fs.appendFileSync(f.file, Buffer.alloc(4096));
        }
        return (read as any)(fd, buffer, ...args);
      };
      assert.throws(() => observe(f.file, () => { queried = true; }), /truncated|changed during image capture/);
    } finally { fs.readSync = read; }
    assert(changed); assert.equal(queried, false);
    assert.deepEqual(fs.readdirSync(f.root), ["fixture.sqlite"]);
  });
}

test("same-inode writer change during a query invalidates the snapshot result", t => {
  const f = fixture(t);
  assert.throws(() => observe(f.file, db => {
    const writer = new Native(f.file);
    try { writer.exec("INSERT INTO sample VALUES('writer')"); } finally { writer.close(); }
    return db.prepare("SELECT count(*) AS n FROM sample").get().n;
  }), /database changed during observation/);
  assert.deepEqual(fs.readdirSync(f.root), ["fixture.sqlite"]);
  assert.equal(observe(f.file, db => db.prepare("SELECT count(*) AS n FROM sample").get().n), 2);
});

test("legitimate generated-column builtins remain usable in project databases", t => {
  const f = fixture(t), writer = new Native(f.file);
  try { writer.exec("CREATE TABLE expressions(value TEXT, normalized TEXT GENERATED ALWAYS AS (lower(value)) VIRTUAL); INSERT INTO expressions(value) VALUES('GENERIC');"); }
  finally { writer.close(); }
  const before = inventory(f.root);
  assert.equal(observe(f.file, db => db.prepare("SELECT normalized FROM expressions").get().normalized), "generic");
  assert.deepEqual(inventory(f.root), before);
});

test("a falsy thrown callback value still fails and releases the connection", t => {
  const f = fixture(t), before = inventory(f.root);
  let failed = false;
  try { observe(f.file, () => { throw undefined; }); }
  catch (error) { failed = true; assert.equal(error, undefined); }
  assert(failed);
  assert.equal(observe(f.file), "synthetic");
  assert.deepEqual(inventory(f.root), before);
});
