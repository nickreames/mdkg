import { test } from "node:test";
import fs from "node:fs";
import path from "node:path";
import { makeTempDir } from "../helpers/fs";
const { qualifyChangedWarnings } = require("../../../tests/fixtures/changed-warnings.cjs");
const cli = path.resolve(__dirname, "../../cli.js");

for (const topology of ["standalone", "worktree", "submodule", "gitdir"]) {
  test(`changed-only diagnostics preserve native Git paths in ${topology}`, t => {
    const owner = makeTempDir("mdkg-changed-warning-paths-");
    t.after(() => fs.rmSync(owner, { recursive: true, force: true }));
    qualifyChangedWarnings({ cli, tempRoot: owner, topologies: [topology] });
  });
}
