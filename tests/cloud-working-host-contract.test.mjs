import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const target = path.resolve(process.env.MDKG_WORKING_PACKAGE ?? new URL("..", import.meta.url).pathname);
const { createGraphFormat, canonicalJson } = require(path.join(target, "dist/graph/identity.js"));
const { readWorkingHost, readWorkingMarker, workingMarkerBytes, bootstrapWorkingHost } = require(path.join(target, "dist/core/working_host.js"));
const { createOwnedFixture } = require("../scripts/qualification-fixture.js");
function fixtureTest(name, run) {
  test(name, () => { const f = createOwnedFixture({ prefix: "mdkg-host-binding-" });
    try { const root = f.resolve("host"); fs.mkdirSync(path.join(root, ".mdkg"), { recursive: true }); run(f, root); }
    finally { f.cleanup(); } });
}
fixtureTest("independent host reader never bootstraps an absent legacy marker from incoming storage", (f, root) => {
  fs.mkdirSync(path.join(root, ".mdkg/working"));
  fs.writeFileSync(path.join(root, ".mdkg/working/manifest.json"), JSON.stringify({ host: { kind: "working-host-v1", id: crypto.randomUUID() } }));
  assert.equal(readWorkingHost(root), undefined); assert.equal(fs.existsSync(path.join(root, ".mdkg/working-host.json")), false);
});
fixtureTest("actual legacy host marker is independent, strictly read and preserved by repeat bootstrap", (f, root) => {
  assert.equal(bootstrapWorkingHost(root), true);
  const file = path.join(root, ".mdkg/working-host.json"), before = fs.readFileSync(file);
  assert.equal(readWorkingHost(root).kind, "working-host-v1");
  assert.equal(bootstrapWorkingHost(root), false); assert.deepEqual(fs.readFileSync(file), before);
  assert.equal(fs.existsSync(path.join(root, ".mdkg/graph.json")), false);
});
fixtureTest("canonical v2 graph identity takes precedence without replacing retained legacy marker", (f, root) => {
  const canonical = crypto.randomUUID(), marker = crypto.randomUUID();
  fs.writeFileSync(path.join(root, ".mdkg/graph.json"), canonicalJson(createGraphFormat(canonical)));
  const bytes = workingMarkerBytes(marker); fs.writeFileSync(path.join(root, ".mdkg/working-host.json"), bytes);
  assert.deepEqual(readWorkingHost(root), { kind: "canonical-v2", id: canonical });
  assert.equal(fs.readFileSync(path.join(root, ".mdkg/working-host.json"), "utf8"), bytes);
});
fixtureTest("malformed, unknown and oversized legacy markers refuse without repair", (f, root) => {
  const file = path.join(root, ".mdkg/working-host.json"), valid = JSON.parse(workingMarkerBytes(crypto.randomUUID()));
  for (const value of ["{broken", JSON.stringify({ ...valid, version: 99 }), JSON.stringify({ ...valid, unknown: true }),
    JSON.stringify({ ...valid, host_id: "task-1" }), " ".repeat(4097)]) {
    fs.writeFileSync(file, value); assert.throws(() => readWorkingHost(root)); assert.equal(fs.readFileSync(file, "utf8"), value);
  }
});
fixtureTest("malformed canonical v2 authority cannot fall back to a valid legacy marker", (f, root) => {
  bootstrapWorkingHost(root); const file = path.join(root, ".mdkg/graph.json");
  for (const value of ["{broken", JSON.stringify({ ...createGraphFormat(), format_version: 99 }), JSON.stringify({ ...createGraphFormat(), unknown: true })]) {
    fs.writeFileSync(file, value); assert.throws(() => readWorkingHost(root)); assert.equal(fs.readFileSync(file, "utf8"), value);
  }
});
fixtureTest("marker hardlink and symlink admission preserves both copies and positive regular-file control", (f, root) => {
  const file = path.join(root, ".mdkg/working-host.json"), source = path.join(root, "source.json"), bytes = workingMarkerBytes(crypto.randomUUID());
  fs.writeFileSync(source, bytes); fs.linkSync(source, file); assert.throws(() => readWorkingMarker(root), /hardlinks/);
  fs.unlinkSync(file); fs.symlinkSync("../source.json", file); assert.throws(() => readWorkingMarker(root));
  assert.equal(fs.readFileSync(source, "utf8"), bytes); fs.unlinkSync(file); fs.writeFileSync(file, bytes);
  assert.equal(readWorkingMarker(root), JSON.parse(bytes).host_id);
});
test("current contract records accepted bootstrap and pending independent readiness", () => {
  const doc = fs.readFileSync(new URL("../docs/cloud-goal89-design.md", import.meta.url), "utf8");
  for (const phrase of ["working-host-anchor-v1", "independent", "store_id", "subordinate store identity", "not authentication",
    "explicit purge", "No canonical v2 migration is required", "pre-journal", "NOT_READY"])
    assert.ok(doc.includes(phrase), `current contract must retain ${phrase}`);
});
