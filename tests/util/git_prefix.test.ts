import { test } from "node:test";
import assert from "node:assert/strict";
const childProcess = require("node:child_process");
const { readGitPrefix } = require("../../util/git_observation");

test("Git cwd prefix preserves literal names and rejects malformed observations", t => {
  let raw = "\n";
  t.mock.method(childProcess, "spawnSync", (_command: string, args: string[], options: any) => {
    assert.deepEqual(args, ["-c", "core.fsmonitor=false", "rev-parse", "--show-prefix"]);
    assert.equal(options.env.GIT_OPTIONAL_LOCKS, "0");
    assert.equal(options.env.GIT_NO_LAZY_FETCH, "1");
    return { status: 0, stdout: Buffer.from(raw), stderr: Buffer.alloc(0) };
  });
  for (const prefix of ["", "project/", "nested\\literal\nline/", "tab\tand\rreturn/", " space /child/"]) {
    raw = prefix + "\n";
    assert.equal(readGitPrefix("fixture"), prefix);
  }
  for (const invalid of ["", "project/", "project\n", "/absolute/\n", "../up/\n", "a/./b/\n", "a//b/\n", "bad\0/\n"]) {
    raw = invalid;
    assert.throws(() => readGitPrefix("fixture"), /Git rev-parse observation failed/);
  }
});
