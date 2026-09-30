import { test } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import os from "node:os";
const { qualifyNativeGitCustody } = require("../../../tests/fixtures/native-git-custody.cjs");
const runtime = process.env.MDKG_TEST_PACKAGE ? path.join(process.env.MDKG_TEST_PACKAGE, "dist") : path.resolve(__dirname, "../..");

test("installed-compatible materialization and snapshot mutations preserve native Git custody", () => {
  const result = qualifyNativeGitCustody({ cli: path.join(runtime, "cli.js"), tempRoot: os.tmpdir() });
  assert.equal(result.pass, true, JSON.stringify(result.cases.filter((item: any) => !item.pass), null, 2));
});
