import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const { qualifyTransportAdmission } = require("../../../tests/fixtures/transport-admission.cjs");

test("bundle consumers admit only graph-owned paths and never Git administration", () => {
  const result = qualifyTransportAdmission({ cli: path.resolve(__dirname, "../../cli.js"),
    tempRoot: fs.existsSync("/private/tmp") ? "/private/tmp" : os.tmpdir() });
  assert.equal(result.pass, true, JSON.stringify(result.cases.filter((item: { pass: boolean }) => !item.pass), null, 2));
});
