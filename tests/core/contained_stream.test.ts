import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import { makeTempDir, writeFile } from "../helpers/fs";
const { forEachContainedFileChunk } = require("../../core/filesystem_authority");
function fixture(t: { after(fn: () => void): void }, content: string) {
  const root = makeTempDir("mdkg-contained-stream-");
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const file = path.join(root, "stream"); writeFile(file, content);
  return { root, relativePath: "stream", file };
}
test("contained streaming reads exact budgets in bounded chunks and accepts empty files", (t) => {
  const f = fixture(t, "é".repeat(100000)); const chunks: Buffer[] = [];
  const count = forEachContainedFileChunk({ ...f, maxBytes: 200000 }, (chunk: Buffer) => { assert.ok(chunk.length <= 65536); chunks.push(chunk); });
  assert.equal(count, 200000); assert.equal(Buffer.concat(chunks).toString(), "é".repeat(100000));
  writeFile(f.file, ""); assert.equal(forEachContainedFileChunk({ ...f, maxBytes: 0 }, () => assert.fail("empty stream callback")), 0);
});
test("contained streaming rejects actual post-stat growth before delivering excess bytes", (t) => {
  const f = fixture(t, "before"), original = fs.readSync;
  let grew = false, delivered = 0;
  t.mock.method(fs, "readSync", (...args: any[]) => {
    if (!grew) { fs.appendFileSync(f.file, "extra"); grew = true; }
    return (original as any)(...args);
  });
  assert.throws(() => forEachContainedFileChunk({ ...f, maxBytes: 6 }, (chunk: Buffer) => { delivered += chunk.length; }), /byte limit/);
  assert.ok(delivered <= 6);
});
test("contained streaming closes the descriptor when its consumer rejects", (t) => {
  const f = fixture(t, "content"), original = fs.openSync;
  let descriptor: number | undefined;
  t.mock.method(fs, "openSync", (...args: any[]) => { descriptor = (original as any)(...args); return descriptor; });
  assert.throws(() => forEachContainedFileChunk({ ...f, maxBytes: 100 }, () => { throw new Error("parser rejected"); }), /parser rejected/);
  assert.equal(typeof descriptor, "number");
  assert.throws(() => fs.fstatSync(descriptor!), { code: "EBADF" });
});
test("contained streaming rejects invalid numeric budgets", (t) => {
  const f = fixture(t, "");
  for (const maxBytes of [-1, 1.5, Infinity, Number.MAX_SAFE_INTEGER + 1]) {
    assert.throws(() => forEachContainedFileChunk({ ...f, maxBytes }, () => undefined), /safe integer/);
  }
});
