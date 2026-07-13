import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
const { createNodeBodyReader } = require("../../graph/node_body");
const { createDeterministicZipFromEntries } = require("../../util/zip");
import { makeTempDir, writeFile } from "../helpers/fs";

function importedNode(id: string, bundlePath: string, originalPath: string): any {
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
      stale: false,
      warnings: [],
    },
  };
}

function nodeContent(id: string, body: string): Buffer {
  return Buffer.from(`---\nid: ${id}\ntype: task\ntitle: ${id}\nstatus: todo\npriority: 1\ntags: []\nowners: []\nlinks: []\nartifacts: []\nrelates: []\nblocked_by: []\nblocks: []\nrefs: []\naliases: []\nskills: []\ncreated: 2026-01-01\nupdated: 2026-01-01\n---\n\n${body}\n`);
}

test("node body reader inflates each imported bundle once and enforces body bytes", () => {
  const root = makeTempDir("mdkg-node-body-import-");
  const relativeBundle = ".mdkg/bundles/private/child.mdkg.zip";
  const bundlePath = path.join(root, relativeBundle);
  writeFile(path.dirname(bundlePath) + "/.keep", "");
  fs.writeFileSync(bundlePath, createDeterministicZipFromEntries([
    { name: ".mdkg/work/task-1.md", data: nodeContent("task-1", "first") },
    { name: ".mdkg/work/task-2.md", data: nodeContent("task-2", "second") },
  ]));

  const readBody = createNodeBodyReader(root, 1024 * 1024);
  assert.equal(readBody(importedNode("task-1", relativeBundle, ".mdkg/work/task-1.md")), "\nfirst");
  fs.rmSync(bundlePath);
  assert.equal(readBody(importedNode("task-2", relativeBundle, ".mdkg/work/task-2.md")), "\nsecond");

  fs.writeFileSync(bundlePath, createDeterministicZipFromEntries([
    { name: ".mdkg/work/task-3.md", data: nodeContent("task-3", "oversized") },
  ]));
  assert.throws(
    () => createNodeBodyReader(root, 64)(importedNode("task-3", relativeBundle, ".mdkg/work/task-3.md")),
    /node body source exceeds byte limit/
  );
});
