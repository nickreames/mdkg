import { test } from "node:test";
import assert from "node:assert/strict";
const { LATEST_SCHEMA_VERSION, migrateConfig } = require("../../core/migrate");

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
  assert.equal(result.to, LATEST_SCHEMA_VERSION);
  assert.deepEqual(migrated.workspaces, legacy.workspaces);
});
