import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const { qualifyBundleProvenance } = require("../../../tests/fixtures/bundle-provenance.cjs");

test("bundle and imported provenance redact remote authentication without rewriting evidence", () => {
  const result = qualifyBundleProvenance({
    cli: path.resolve(__dirname, "../../cli.js"),
    tempRoot: fs.existsSync("/private/tmp") ? "/private/tmp" : os.tmpdir(),
  });
  assert.equal(result.pass, true, JSON.stringify(result.cases.filter((item: { pass: boolean }) => !item.pass), null, 2));
});
