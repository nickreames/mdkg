import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
const { createNodeBodyReader } = require("../../graph/node_body");
const { buildBundle } = require("../../commands/bundle");
import { makeTempDir, writeFile } from "../helpers/fs";
import { writeRootConfig } from "../helpers/config";

function importedNode(id: string, bundlePath: string, originalPath: string, bundleHash: string): any {
  return {
    id,
    qid: `child:${id}`,
    ws: "child",
    type: "task",
    title: id,
    status: "todo",
    created: "2026-01-01",
    updated: "2026-01-01",
    tags: [], owners: [], links: [], artifacts: [], refs: [], aliases: [], skills: [],
    attributes: {}, path: originalPath,
    edges: { relates: [], blocked_by: [], blocks: [], context_refs: [], evidence_refs: [] },
    source: {
      imported: true,
      read_only: true,
      subgraph_alias: "child",
      original_qid: `root:${id}`,
      original_ws: "root",
      original_path: originalPath,
      bundle_path: bundlePath,
      bundle_hash: bundleHash,
      profile: "private",
      stale: false,
      warnings: [],
    },
  };
}

function nodeContent(id: string, body: string): Buffer {
  return Buffer.from(`---\nid: ${id}\ntype: task\ntitle: ${id}\nstatus: todo\npriority: 1\ntags: []\nowners: []\nlinks: []\nartifacts: []\nrelates: []\nblocked_by: []\nblocks: []\nrefs: []\naliases: []\nskills: []\ncreated: 2026-01-01\nupdated: 2026-01-01\n---\n\n${body}\n`);
}

test("node body reader inflates each imported bundle once and enforces body bytes", (t) => {
  const root = makeTempDir("mdkg-node-body-import-");
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  writeRootConfig(root);
  const relativeBundle = ".mdkg/bundles/private/child.mdkg.zip";
  const bundlePath = path.join(root, relativeBundle);
  writeFile(path.dirname(bundlePath) + "/.keep", "");
  writeFile(path.join(root, ".mdkg/work/task-1.md"), nodeContent("task-1", "first").toString());
  writeFile(path.join(root, ".mdkg/work/task-2.md"), nodeContent("task-2", "second").toString());
  const first = buildBundle({ root, profile: "private" });
  fs.writeFileSync(bundlePath, first.zip);

  const readBody = createNodeBodyReader(root, 1024 * 1024);
  assert.equal(readBody(importedNode("task-1", relativeBundle, ".mdkg/work/task-1.md", first.manifest.bundle_hash)), "\nfirst");
  fs.rmSync(bundlePath);
  assert.equal(readBody(importedNode("task-2", relativeBundle, ".mdkg/work/task-2.md", first.manifest.bundle_hash)), "\nsecond");

  writeFile(path.join(root, ".mdkg/work/task-3.md"), nodeContent("task-3", "oversized").toString());
  const next = buildBundle({ root, profile: "private" });
  fs.writeFileSync(bundlePath, next.zip);
  assert.throws(
    () => createNodeBodyReader(root, 64)(importedNode("task-3", relativeBundle, ".mdkg/work/task-3.md", next.manifest.bundle_hash)),
    /node body source exceeds byte limit/
  );
});
