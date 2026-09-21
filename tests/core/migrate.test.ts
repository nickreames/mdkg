import { test } from "node:test";
import assert from "node:assert/strict";
const { DEFAULT_SCHEMA_VERSION, LATEST_SCHEMA_VERSION, identityWriterConfig, migrateConfig } = require("../../core/migrate");

test("migrateConfig rejects non-object and negative schema versions", () => {
  assert.throws(() => migrateConfig(null), /config must be a JSON object/);
  assert.throws(
    () => migrateConfig({ schema_version: -1 }),
    /config schema_version must be non-negative/
  );
});

test("migrateConfig preserves explicit legacy workspaces", () => {
  const legacy = {
    tool: "mdkg",
    root_required: true,
    workspaces: {
      docs: { path: "docs", enabled: true, mdkg_dir: ".mdkg" },
    },
  };

  const result = migrateConfig(legacy);
  const migrated = result.config as Record<string, unknown>;
  assert.equal(result.from, 0);
  assert.equal(result.to, DEFAULT_SCHEMA_VERSION);
  assert.deepEqual(migrated.workspaces, legacy.workspaces);
});

test("recognizing schema 2 does not silently adopt legacy configurations", () => {
  for (const version of [undefined, 0, 1, 2]) {
    const raw = { schema_version: version, extension: { preserve: true } };
    const result = migrateConfig(raw);
    assert.equal(result.to, version === 2 ? 2 : 1);
    assert.equal(result.config.schema_version, version === 2 ? 2 : 1);
    assert.equal(identityWriterConfig(raw).schema_version, 2);
    assert.deepEqual(identityWriterConfig(raw).extension, raw.extension);
    assert.equal(raw.schema_version, version);
  }
  assert.equal(LATEST_SCHEMA_VERSION, 2);
  assert.throws(() => identityWriterConfig({ schema_version: 3 }), /newer than supported/);
});
