import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
const { readZipFileBytes, readZipFileEntries, readSingleFileZipPath, createDeterministicZip } = require("../../util/zip");

function fixture(t: { after(fn: () => void): void }) {
  const root = fs.mkdtempSync(path.join(fs.existsSync("/private/tmp") ? "/private/tmp" : os.tmpdir(), "mdkg-zip-read-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const file = path.join(root, "selected.zip"), bytes = createDeterministicZip("note.md", Buffer.from("bounded archive"));
  fs.writeFileSync(file, bytes);
  return { root, file, bytes };
}

test("selected ZIP preserves raw bytes exact limits and downstream parsing", t => {
  const f = fixture(t);
  assert.deepEqual(readZipFileBytes(f.file, { maxArchiveBytes: f.bytes.length }), f.bytes);
  assert.equal(readZipFileEntries(f.file)[0].data.toString(), "bounded archive");
  assert.equal(readSingleFileZipPath(f.file).entryName, "note.md");
  assert.throws(() => readZipFileBytes(f.file, { maxArchiveBytes: f.bytes.length - 1 }), /archive exceeds configured byte limit/);
  fs.writeFileSync(f.file, ""); assert.deepEqual(readZipFileBytes(f.file), Buffer.alloc(0));
  assert.throws(() => readZipFileEntries(f.file), /missing or truncated/);
});

test("explicit linked regular ZIPs retain operator-selected path behavior", { skip: process.platform === "win32" }, t => {
  const f = fixture(t), link = path.join(f.root, "link.zip");
  fs.symlinkSync(f.file, link); assert.deepEqual(readZipFileBytes(link), f.bytes);
});

test("ZIP actual-byte bound survives stale size metadata and closes the descriptor", t => {
  const f = fixture(t), stat = fs.statSync, fstat = fs.fstatSync, open = fs.openSync, read = fs.readSync, close = fs.closeSync;
  let descriptor: number | undefined, total = 0, closed = false;
  t.mock.method(fs, "statSync", (...args: any[]) => {
    const s = (stat as any)(...args); return String(args[0]) === f.file ? Object.assign(s, { size: 0 }) : s;
  });
  t.mock.method(fs, "openSync", (...args: any[]) => { const fd = (open as any)(...args); if (String(args[0]) === f.file) descriptor = fd; return fd; });
  t.mock.method(fs, "fstatSync", (...args: any[]) => { const s = (fstat as any)(...args); return args[0] === descriptor ? Object.assign(s, { size: 0 }) : s; });
  t.mock.method(fs, "readSync", (...args: any[]) => {
    if (args[0] === descriptor) assert(args[3] <= 65536);
    const count = (read as any)(...args); if (args[0] === descriptor) total += count; return count;
  });
  t.mock.method(fs, "closeSync", (fd: number) => { if (fd === descriptor) closed = true; return close(fd); });
  assert.throws(() => readZipFileBytes(f.file, { maxArchiveBytes: 8 }), /archive exceeds configured byte limit/);
  assert.equal(total, 9); assert.equal(closed, true);
});

test("ZIP reads stay bound to the opened object when its pathname is replaced", t => {
  const f = fixture(t), open = fs.openSync;
  let replaced = false;
  t.mock.method(fs, "openSync", (...args: any[]) => {
    const fd = (open as any)(...args);
    if (String(args[0]) === f.file && !replaced) {
      replaced = true; fs.unlinkSync(f.file); fs.writeFileSync(f.file, "different selected pathname");
    }
    return fd;
  });
  assert.deepEqual(readZipFileBytes(f.file), f.bytes);
  assert.equal(fs.readFileSync(f.file, "utf8"), "different selected pathname");
});

test("ZIP descriptor is closed when read fails", t => {
  const f = fixture(t), open = fs.openSync, close = fs.closeSync, read = fs.readSync;
  let descriptor: number | undefined, closed = false;
  t.mock.method(fs, "openSync", (...args: any[]) => { const fd = (open as any)(...args); if (String(args[0]) === f.file) descriptor = fd; return fd; });
  t.mock.method(fs, "readSync", (...args: any[]) => { if (args[0] === descriptor) throw Error("synthetic read failure"); return (read as any)(...args); });
  t.mock.method(fs, "closeSync", (fd: number) => { if (fd === descriptor) closed = true; return close(fd); });
  assert.throws(() => readZipFileBytes(f.file), /synthetic read failure/); assert.equal(closed, true);
});
