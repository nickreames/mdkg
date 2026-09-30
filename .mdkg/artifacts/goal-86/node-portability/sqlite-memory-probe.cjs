"use strict";

// Synthetic local feasibility evidence only. This is not production code or
// installed-package/platform qualification. No canonical mdkg state is opened.
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { performance } = require("node:perf_hooks");
const { constants: bufferConstants } = require("node:buffer");
const { DatabaseSync, constants: sql } = require("node:sqlite");

const result = {
  kind: "node-only-sqlite-memory-feasibility",
  runtime: process.version,
  platform: process.platform,
  arch: process.arch,
  source_sha256: crypto.createHash("sha256").update(fs.readFileSync(__filename)).digest("hex"),
  capability: {
    deserialize: typeof DatabaseSync.prototype.deserialize === "function",
    setAuthorizer: typeof DatabaseSync.prototype.setAuthorizer === "function",
    defensive: typeof DatabaseSync.prototype.enableDefensive === "function",
  },
  fixture_created: false,
  fixture_removed: false,
  tests: [],
  measurements: [],
  limitations: [
    "Synthetic macOS execution is not Windows/Linux or installed-package acceptance.",
    "No guarantee against adversarial ancestor substitution or ACL preservation is claimed.",
    "Memory and timing samples are bounded feasibility measurements, not a runtime size policy.",
    "SQL callbacks are trusted package code, not a sandbox for arbitrary JavaScript.",
  ],
};

// Capability refusal precedes fixture creation; higher major is not proof.
if (Object.values(result.capability).some(value => !value)) {
  result.status = "unsupported-capability";
  console.log(JSON.stringify(result, null, 2));
  process.exit(0);
}

const fixtureRoot = fs.mkdtempSync(path.join("/private/tmp", "mdkg-sqlite-memory-probe-"));
const fixtureStat = fs.lstatSync(fixtureRoot);
result.fixture_created = true;

function hash(bytes) { return crypto.createHash("sha256").update(bytes).digest("hex"); }
function inventory() {
  return fs.readdirSync(fixtureRoot).sort().map(name => {
    const file = path.join(fixtureRoot, name);
    const stat = fs.lstatSync(file);
    assert(stat.isFile(), "unexpected fixture entry");
    return { name, bytes: stat.size, mode: stat.mode, sha256: hash(fs.readFileSync(file)) };
  });
}
function createDatabase(name, payloadBytes = 0) {
  const file = path.join(fixtureRoot, name);
  const db = new DatabaseSync(file);
  try {
    db.exec("PRAGMA journal_mode=DELETE; CREATE TABLE sample(id INTEGER PRIMARY KEY, value TEXT, payload BLOB);");
    db.prepare("INSERT INTO sample VALUES(1, 'original', zeroblob(?))").run(payloadBytes);
  } finally { db.close(); }
  return file;
}
function sameFile(a, b) {
  return a.isFile() && b.isFile() && a.dev === b.dev && a.ino === b.ino &&
    a.size === b.size && a.mtimeNs === b.mtimeNs && a.ctimeNs === b.ctimeNs;
}
function admitHeader(image) {
  assert(image.length >= 100 && image.subarray(0, 16).equals(Buffer.from("SQLite format 3\0")), "invalid SQLite header");
  assert(image[18] === 1 && image[19] === 1, "WAL/recovery state refused");
}
function refuseSidecars(file) {
  for (const suffix of ["-wal", "-shm", "-journal"]) {
    try { fs.lstatSync(file + suffix); }
    catch (error) { if (error.code === "ENOENT") continue; throw error; }
    throw new Error("transient sidecar state refused");
  }
}
function observe(file, read, afterCapture) {
  refuseSidecars(file);
  const before = fs.lstatSync(file, { bigint: true });
  assert(before.isFile(), "regular file required");
  const fd = fs.openSync(file, fs.constants.O_RDONLY | (fs.constants.O_NOFOLLOW ?? 0) | (fs.constants.O_NONBLOCK ?? 0));
  try {
    const opened = fs.fstatSync(fd, { bigint: true });
    assert(sameFile(before, opened), "custody changed before capture");
    const size = Number(opened.size);
    assert(Number.isSafeInteger(size) && size >= 100 && size <= bufferConstants.MAX_LENGTH, "image size not representable");
    const image = Buffer.alloc(size);
    let offset = 0;
    while (offset < image.length) {
      const count = fs.readSync(fd, image, offset, image.length - offset, offset);
      assert(count > 0, "image truncated during capture");
      offset += count;
    }
    admitHeader(image);
    assert(sameFile(opened, fs.fstatSync(fd, { bigint: true })), "source changed during capture");
    if (afterCapture) afterCapture();

    const db = new DatabaseSync(":memory:", { allowExtension: false });
    let value;
    let readError;
    try {
      db.deserialize(image);
      db.enableDefensive(true);
      db.exec("PRAGMA temp_store=MEMORY; PRAGMA trusted_schema=OFF; PRAGMA foreign_keys=ON; PRAGMA query_only=ON;");
      const readPragmas = new Set(["integrity_check", "quick_check", "foreign_key_check", "database_list", "page_count", "page_size", "query_only", "temp_store", "trusted_schema"]);
      const schemaPragmas = new Set(["table_info", "table_xinfo", "index_list", "index_info", "index_xinfo"]);
      db.setAuthorizer((action, first, second) => {
        if ([sql.SQLITE_SELECT, sql.SQLITE_READ, sql.SQLITE_RECURSIVE].includes(action)) return sql.SQLITE_OK;
        if (action === sql.SQLITE_FUNCTION && ["count", "sum", "length", "quote", "coalesce"].includes(String(second).toLowerCase())) return sql.SQLITE_OK;
        if (action === sql.SQLITE_PRAGMA && (schemaPragmas.has(first) || (readPragmas.has(first) && second === null))) return sql.SQLITE_OK;
        return sql.SQLITE_DENY;
      });
      value = read(db);
    } catch (error) { readError = error; }
    finally { db.close(); }

    // A snapshot may query successfully but is not accepted if its source moved.
    refuseSidecars(file);
    const header = Buffer.alloc(100);
    assert.equal(fs.readSync(fd, header, 0, 100, 0), 100);
    admitHeader(header);
    assert(sameFile(opened, fs.fstatSync(fd, { bigint: true })), "source changed during observation");
    assert(sameFile(opened, fs.lstatSync(file, { bigint: true })), "source path replaced during observation");
    if (readError) throw readError;
    return value;
  } finally { fs.closeSync(fd); }
}
function check(name, fn) {
  const start = performance.now();
  try { fn(); result.tests.push({ name, status: "pass", duration_ms: performance.now() - start }); }
  catch (error) { result.tests.push({ name, status: "fail", error: String(error), duration_ms: performance.now() - start }); }
}
function unchangedCheck(name, fn) {
  check(name, () => { const before = inventory(); fn(); assert.deepEqual(inventory(), before); });
}

try {
  const file = createDatabase("closed.sqlite");
  unchangedCheck("closed database query and integrity with unchanged fixture files", () => {
    observe(file, db => {
      assert.equal(db.prepare("SELECT value FROM sample WHERE id=1").get().value, "original");
      assert.equal(db.prepare("PRAGMA integrity_check").get().integrity_check, "ok");
      assert.equal(db.prepare("PRAGMA query_only").get().query_only, 1);
      assert.equal(db.prepare("PRAGMA temp_store").get().temp_store, 2);
      assert.equal(db.prepare("PRAGMA table_info(sample)").all().length, 3);
    });
  });
  for (const [name, statement] of [
    ["INSERT refused", "INSERT INTO sample VALUES(2, 'bad', NULL)"],
    ["DDL refused", "CREATE TABLE rejected(id INTEGER)"],
    ["temporary DDL refused", "CREATE TEMP TABLE rejected(id INTEGER)"],
    ["ATTACH refused", `ATTACH DATABASE '${path.join(fixtureRoot, "attached.sqlite")}' AS other`],
    ["query_only reset refused", "PRAGMA query_only=OFF"],
    ["temp_store reset refused", "PRAGMA temp_store=FILE"],
    ["VACUUM INTO refused", `VACUUM INTO '${path.join(fixtureRoot, "vacuum.sqlite")}'`],
    ["extension loading refused", "SELECT load_extension('not-a-real-extension')"],
  ]) unchangedCheck(name, () => observe(file, db => assert.throws(() => db.exec(statement))));

  check("ordinary intentional writer remains functional", () => {
    const db = new DatabaseSync(file);
    try { db.prepare("INSERT INTO sample VALUES(2, 'writer', NULL)").run(); }
    finally { db.close(); }
    assert.equal(observe(file, db => db.prepare("SELECT count(*) AS n FROM sample").get().n), 2);
  });

  const wal = createDatabase("wal.sqlite");
  const writer = new DatabaseSync(wal);
  try { writer.exec("PRAGMA journal_mode=WAL"); } finally { writer.close(); }
  unchangedCheck("closed WAL header refused without creating sidecars", () => assert.throws(() => observe(wal, () => {}), /WAL/));
  for (const suffix of ["-wal", "-shm", "-journal"]) {
    fs.writeFileSync(file + suffix, "synthetic transient state", { flag: "wx" });
    unchangedCheck(`${suffix} state refused`, () => assert.throws(() => observe(file, () => {}), /sidecar/));
    fs.unlinkSync(file + suffix);
  }
  const malformed = path.join(fixtureRoot, "malformed.sqlite");
  fs.writeFileSync(malformed, Buffer.alloc(1024), { flag: "wx" });
  unchangedCheck("malformed image refused", () => assert.throws(() => observe(malformed, () => {}), /header/));
  const corrupt = createDatabase("corrupt.sqlite");
  const corruptedImage = fs.readFileSync(corrupt);
  corruptedImage.fill(0, 100, 4096);
  fs.writeFileSync(corrupt, corruptedImage);
  unchangedCheck("corrupt body fails without native file effects", () => assert.throws(() => observe(corrupt, db => db.prepare("SELECT * FROM sample").all())));

  check("same-inode update during observation refuses its result", () => {
    const changing = createDatabase("changing.sqlite");
    assert.throws(() => observe(changing, db => db.prepare("SELECT * FROM sample").all(), () => {
      const db = new DatabaseSync(changing);
      try { db.exec("UPDATE sample SET value='changed'"); } finally { db.close(); }
    }), /source changed/);
  });
  check("pathname replacement during observation refuses its result", () => {
    const replaced = createDatabase("replaced.sqlite");
    const replacement = createDatabase("replacement.sqlite");
    assert.throws(() => observe(replaced, db => db.prepare("SELECT * FROM sample").all(), () => fs.renameSync(replacement, replaced)), /source changed|path replaced/);
  });
  check("journal transition after capture refuses without observer sidecars", () => {
    const transition = createDatabase("transition.sqlite");
    assert.throws(() => observe(transition, db => db.prepare("SELECT * FROM sample").all(), () => {
      const db = new DatabaseSync(transition);
      try { db.exec("PRAGMA journal_mode=WAL"); } finally { db.close(); }
    }), /WAL/);
    for (const suffix of ["-wal", "-shm", "-journal"]) assert.equal(fs.existsSync(transition + suffix), false);
  });

  for (const mib of [4, 16, 32]) {
    const large = createDatabase(`size-${mib}.sqlite`, mib * 1024 * 1024);
    const beforeHash = hash(fs.readFileSync(large));
    if (global.gc) global.gc();
    const beforeMemory = process.memoryUsage();
    const start = performance.now();
    let loadedMemory;
    const length = observe(large, db => {
      loadedMemory = process.memoryUsage();
      return db.prepare("SELECT sum(length(payload)) AS n FROM sample").get().n;
    });
    const duration = performance.now() - start;
    assert.equal(length, mib * 1024 * 1024);
    assert.equal(hash(fs.readFileSync(large)), beforeHash);
    result.measurements.push({ requested_mib: mib, file_bytes: fs.statSync(large).size, duration_ms: duration,
      rss_delta_while_loaded: loadedMemory.rss - beforeMemory.rss,
      external_delta_while_loaded: loadedMemory.external - beforeMemory.external });
  }
  result.status = result.tests.every(test => test.status === "pass") ? "bounded-feasibility-pass" : "failed";
} catch (error) { result.status = "failed"; result.error = String(error); }
finally {
  const current = fs.lstatSync(fixtureRoot);
  assert(current.isDirectory() && !current.isSymbolicLink() && current.dev === fixtureStat.dev && current.ino === fixtureStat.ino, "fixture cleanup custody changed");
  assert.equal(path.dirname(fixtureRoot), "/private/tmp");
  assert(path.basename(fixtureRoot).startsWith("mdkg-sqlite-memory-probe-"));
  fs.rmSync(fixtureRoot, { recursive: true });
  result.fixture_removed = !fs.existsSync(fixtureRoot);
  console.log(JSON.stringify(result, null, 2));
}
process.exitCode = result.status === "failed" ? 1 : 0;
