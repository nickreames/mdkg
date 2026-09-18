import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { makeTempDir, writeFile } from "../helpers/fs";
import { writeRootConfig } from "../helpers/config";
import { writeDefaultTemplates } from "../helpers/templates";
const { loadConfig } = require("../../core/config");
const { createGraphFormat } = require("../../graph/identity");
const { withMutationLock } = require("../../util/lock");
const { runInitCommand } = require("../../commands/init");
const { ensureEventsEnabled, appendEvent, appendAutomaticEvent } = require("../../commands/event_support");
const { writeCacheFile } = require("../../graph/cache_output");
const { loadSkillsIndex } = require("../../graph/skills_index_cache");
const { writeSqliteIndex, reserveSqliteNumericId } = require("../../graph/sqlite_index");
const { buildIndex } = require("../../graph/indexer");
const { buildSkillsIndex } = require("../../graph/skills_indexer");
const { buildCapabilitiesIndex } = require("../../graph/capabilities_indexer");
const { buildSubgraphsIndex } = require("../../graph/subgraphs");
const { collectValidateReceipt, runValidateCommand } = require("../../commands/validate");
const { dumpProjectDbSnapshot, sealProjectDbSnapshot } = require("../../core/project_db_snapshot");
const { runDbInitCommand, runDbMigrateCommand } = require("../../commands/db");

function inventory(root: string): Record<string, string> {
  const out: Record<string, string> = {};
  function walk(dir: string): void {
    for (const name of fs.readdirSync(dir).sort()) {
      const file = path.join(dir, name), stat = fs.lstatSync(file), key = path.relative(root, file);
      out[key] = `${stat.mode}:` + (stat.isDirectory() ? "directory" : stat.isSymbolicLink() ? fs.readlinkSync(file)
        : crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex"));
      if (stat.isDirectory()) walk(file);
    }
  }
  walk(root); return out;
}

function fixture(t: { after(fn: () => void): void }) {
  const root = makeTempDir("mdkg-writer-admission-");
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  writeRootConfig(root); writeDefaultTemplates(root);
  writeFile(path.join(root, ".mdkg/core/core.md"), "# core\n");
  const raw = JSON.parse(fs.readFileSync(path.join(root, ".mdkg/config.json"), "utf8"));
  raw.index.backend = "sqlite";
  writeFile(path.join(root, ".mdkg/config.json"), JSON.stringify(raw));
  const config = loadConfig(root), nodeIndex = buildIndex(root, config), skillsIndex = buildSkillsIndex(root, config);
  const prepared = { root, config, nodeIndex, skillsIndex,
    capabilitiesIndex: buildCapabilitiesIndex(root, config, nodeIndex), subgraphsIndex: buildSubgraphsIndex(root, config).index };
  const snapshot = ".mdkg/db/state/project.sqlite";
  fs.mkdirSync(path.dirname(path.join(root, snapshot)), { recursive: true });
  const { DatabaseSync } = require("node:sqlite");
  const db = new DatabaseSync(path.join(root, snapshot));
  db.exec("CREATE TABLE fixture (value TEXT); INSERT INTO fixture VALUES ('synthetic');"); db.close();
  return { root, raw, config, prepared, snapshot };
}

for (const incompatible of ["writer", "feature", "config"] as const) {
  test(`direct snapshot seal refuses ${incompatible} admission using a previously valid config`, t => {
    const { root, raw } = fixture(t);
    const saved = console.log; console.log = () => {};
    try { runDbInitCommand({ root }); runDbMigrateCommand({ root }); } finally { console.log = saved; }
    const preparedConfig = loadConfig(root);
    assert.equal(sealProjectDbSnapshot(root, preparedConfig).ok, true);
    if (incompatible === "config") writeFile(path.join(root, ".mdkg/config.json"), JSON.stringify({ ...raw, schema_version: 99 }));
    else writeFile(path.join(root, ".mdkg/graph.json"), JSON.stringify({
      ...createGraphFormat("e7403372-f270-4cd7-902d-64b792c781df"),
      ...(incompatible === "writer" ? { writer_min: 99 } : { required_features: ["node-identity", "stable-references", "future-feature"] }),
    }));
    const before = inventory(root);
    assert.throws(() => sealProjectDbSnapshot(root, preparedConfig), /unsupported|newer than supported/);
    assert.deepEqual(inventory(root), before);
  });
  for (const action of ["lock", "event-enable", "event-append", "automatic-event", "json-cache", "skills-cache",
    "sqlite-cache", "sqlite-allocation", "text-report", "json-report", "snapshot-output"] as const) {
    test(`${action} refuses ${incompatible} admission before effects, including direct APIs`, t => {
      const f = fixture(t), { root, config } = f;
      if (action === "event-append" || action === "automatic-event") ensureEventsEnabled({ root });
      if (incompatible === "config") writeFile(path.join(root, ".mdkg/config.json"), JSON.stringify({ ...f.raw, schema_version: 99 }));
      else writeFile(path.join(root, ".mdkg/graph.json"), JSON.stringify({
        ...createGraphFormat("e7403372-f270-4cd7-902d-64b792c781df"),
        ...(incompatible === "writer" ? { writer_min: 99 } : { required_features: ["node-identity", "stable-references", "future-feature"] }),
      }));
      const before = inventory(root);
      const event = { root, kind: "TEST", status: "ok", refs: ["task-1"] };
      const run = () => {
        switch (action) {
          case "lock": return withMutationLock(root, 10, () => { throw Error("lock admitted callback"); });
          case "event-enable": return ensureEventsEnabled({ root });
          case "event-append": return appendEvent(event);
          case "automatic-event": return appendAutomaticEvent(event);
          case "json-cache": return writeCacheFile(root, ".mdkg/index/test.json", "{}\n");
          case "skills-cache": return loadSkillsIndex({ root, config, persistReindex: true });
          case "sqlite-cache": return writeSqliteIndex(f.prepared);
          case "sqlite-allocation": return reserveSqliteNumericId({ root, config, ws: "root", prefix: "task", currentMax: 0 });
          case "text-report": return collectValidateReceipt({ root, out: "reports/validation.txt" });
          case "json-report": return runValidateCommand({ root, json: true, jsonOut: "reports/validation.json" });
          case "snapshot-output": return dumpProjectDbSnapshot(root, config, f.snapshot, "reports/snapshot.txt");
        }
      };
      assert.throws(run, /unsupported|newer than supported/);
      assert.deepEqual(inventory(root), before);
    });
  }
}

test("force init checks unsupported existing config before replacing it without a graph manifest", t => {
  const f = fixture(t);
  writeFile(path.join(f.root, ".mdkg/config.json"), JSON.stringify({ ...f.raw, schema_version: 99 }));
  const before = inventory(f.root);
  assert.throws(() => runInitCommand({ root: f.root, force: true }), /newer than supported/);
  assert.deepEqual(inventory(f.root), before);
});

test("force init cannot erase a supported explicit fence while its identity manifest is absent", t => {
  const f = fixture(t);
  writeFile(path.join(f.root, ".mdkg/config.json"), JSON.stringify({ ...f.raw, schema_version: 2 }));
  const before = inventory(f.root);
  assert.throws(() => runInitCommand({ root: f.root, force: true }), /configuration|identity/);
  assert.deepEqual(inventory(f.root), before);
});

test("unknown-format diagnostics without requested file outputs remain observational", t => {
  const f = fixture(t);
  writeFile(path.join(f.root, ".mdkg/graph.json"), JSON.stringify({ ...createGraphFormat("e7403372-f270-4cd7-902d-64b792c781df"), writer_min: 99 }));
  const before = inventory(f.root), receipt = collectValidateReceipt({ root: f.root });
  assert.ok(receipt.errors.some((e: string) => /unsupported/.test(e)));
  assert.deepEqual(inventory(f.root), before);
});

test("compatible legacy direct writers and explicit report outputs retain useful effects", t => {
  const f = fixture(t), { root, config } = f;
  withMutationLock(root, 10, () => ensureEventsEnabled({ root }));
  appendEvent({ root, kind: "TEST", status: "ok", refs: ["task-1"] });
  writeCacheFile(root, ".mdkg/index/test.json", "{}\n");
  loadSkillsIndex({ root, config, persistReindex: true });
  writeSqliteIndex(f.prepared);
  assert.equal(reserveSqliteNumericId({ root, config, ws: "root", prefix: "task", currentMax: 0 }), "task-1");
  collectValidateReceipt({ root, out: "reports/validation.txt" });
  dumpProjectDbSnapshot(root, config, f.snapshot, "reports/snapshot.txt");
  for (const file of [".mdkg/work/events/events.jsonl", ".mdkg/index/test.json", ".mdkg/index/skills.json", ".mdkg/index/mdkg.sqlite", "reports/validation.txt", "reports/snapshot.txt"]) {
    assert.ok(fs.existsSync(path.join(root, file)), file);
  }
  assert.equal(fs.existsSync(path.join(root, ".mdkg/index/write.lock")), false);
});
