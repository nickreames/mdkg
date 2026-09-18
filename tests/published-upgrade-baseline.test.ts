import { test } from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
const { verifyBaseline, boundedResponse, readLocalBaseline, PUBLISHED_052 } = require("../../scripts/published-upgrade-baseline.js");

const bytes = Buffer.from("synthetic pinned package bytes");
const expected = { bytes: bytes.length, sha256: crypto.createHash("sha256").update(bytes).digest("hex"), integrity: "sha512-" + crypto.createHash("sha512").update(bytes).digest("base64") };

test("published baseline verification binds length and both digests", () => {
  assert.doesNotThrow(() => verifyBaseline(bytes, expected));
  assert.throws(() => verifyBaseline(Buffer.from("changed"), expected), /integrity mismatch/);
  assert.throws(() => verifyBaseline(bytes, { ...expected, integrity: "sha512-wrong" }), /integrity mismatch/);
  assert.throws(() => verifyBaseline(bytes), /integrity mismatch/, "a development package cannot masquerade as published 0.5.2");
  assert.equal(PUBLISHED_052.sha256, "18b9bb3c474481155ad46c4ce9b06530d5bdcce0812052fc76f7bcc159799540");
});

test("local published baseline refuses nonfiles links changed and oversized bytes", t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "mdkg-published-baseline-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const file = path.join(root, "baseline.tgz");
  fs.writeFileSync(file, bytes);
  assert.deepEqual(readLocalBaseline(file, expected), bytes);
  assert.throws(() => readLocalBaseline(root, expected), /size\/type mismatch/);
  fs.symlinkSync(file, path.join(root, "linked.tgz"));
  assert.throws(() => readLocalBaseline(path.join(root, "linked.tgz"), expected));
  fs.writeFileSync(file, Buffer.alloc(bytes.length));
  assert.throws(() => readLocalBaseline(file, expected), /integrity mismatch/);
  fs.writeFileSync(file, Buffer.concat([bytes, bytes]));
  assert.throws(() => readLocalBaseline(file, expected), /size\/type mismatch/);
});

test("public baseline response refuses redirect missing data and oversized streams", async () => {
  assert.deepEqual(await boundedResponse(new Response(bytes), expected), bytes);
  await assert.rejects(boundedResponse({ ok: true, redirected: true }, expected), /redirected/);
  await assert.rejects(boundedResponse(new Response(null), expected), /failed/);
  await assert.rejects(boundedResponse(new Response(bytes, { headers: { "content-length": "999" } }), expected), /length mismatch/);
  await assert.rejects(boundedResponse(new Response(Buffer.concat([bytes, bytes])), expected), /exceeds/);
  await assert.rejects(boundedResponse(new Response(bytes.subarray(1)), expected), /integrity mismatch/);
});
