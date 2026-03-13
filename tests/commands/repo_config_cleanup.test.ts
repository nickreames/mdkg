import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";

test("live repo no longer includes leaked polish and smoke workspaces", () => {
  const repoRoot = process.cwd();
  const config = JSON.parse(
    fs.readFileSync(path.join(repoRoot, ".mdkg", "config.json"), "utf8")
  );

  assert.deepEqual(Object.keys(config.workspaces), ["root"]);
  assert.equal(fs.existsSync(path.join(repoRoot, "polish")), false);
  assert.equal(fs.existsSync(path.join(repoRoot, "smoke")), false);

  const indexPath = path.join(repoRoot, ".mdkg", "index", "global.json");
  if (fs.existsSync(indexPath)) {
    const indexRaw = fs.readFileSync(indexPath, "utf8");
    assert.doesNotMatch(indexRaw, /"polish:/);
    assert.doesNotMatch(indexRaw, /"smoke:/);
  }
});
