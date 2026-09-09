import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

const repo = process.cwd();
const runner = path.join(repo, "scripts/test-built.js");

function fixture(t: { after(fn: () => void): void }) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "mdkg-test-built-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const put = (p: string, s: string) => {
    fs.mkdirSync(path.dirname(path.join(root, p)), { recursive: true });
    fs.writeFileSync(path.join(root, p), s);
  };
  const record = (id: string) => `require('node:fs').appendFileSync('executed.txt', ${JSON.stringify(id + "\n")});`;
  for (const [name, id] of [["root", "root"], ["deep/nested/name with spaces", "deep"]]) {
    put(`tests/${name}.test.ts`, "// compiled fixture source\n");
    put(`dist/tests/${name}.test.js`, `require('node:test')(${JSON.stringify(id)}, () => {${record(id)}});`);
  }
  put("tests/source.test.mjs", "import test from 'node:test'; import fs from 'node:fs'; test('mjs',()=>fs.appendFileSync('executed.txt','mjs\\n'));\n");
  // This is a separate fixture suite, not a recursive run inside this test
  // worker. Node otherwise skips the files when it inherits this marker.
  const env = { ...process.env };
  delete env.NODE_TEST_CONTEXT;
  const run = (extra: NodeJS.ProcessEnv = {}) => spawnSync(process.execPath, ["-e", `process.exitCode=require(${JSON.stringify(runner)}).execute(${JSON.stringify(root)});`], { cwd: root, env: { ...env, ...extra }, encoding: "utf8" });
  const executed = () => fs.existsSync(path.join(root, "executed.txt")) ? fs.readFileSync(path.join(root, "executed.txt"), "utf8").trim().split("\n").sort() : [];
  return { root, put, run, executed };
}

test("ordinary npm test uses the complete explicit runner rather than a shell glob", () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(repo, "package.json"), "utf8"));
  assert.equal(pkg.scripts["test:built"], "npm run build:test && node scripts/test-built.js");
  assert.equal(pkg.scripts.test, "npm run build && npm run test:built");
  assert.equal(pkg.scripts["test:coverage:built"], "node scripts/coverage-contract.js run");
  assert.match(pkg.scripts["test:public-release"], /public-release\.test\.mjs/);
});

test("ordinary runner executes root, nested and MJS tests exactly once including spaced paths", t => {
  const f = fixture(t), r = f.run();
  assert.equal(r.status, 0, r.stderr + r.stdout);
  assert.deepEqual(f.executed(), ["deep", "mjs", "root"]);
});

test("ordinary runner refuses missing compiled inputs before executing any tests", t => {
  const f = fixture(t);
  fs.unlinkSync(path.join(f.root, "dist/tests/root.test.js"));
  const r = f.run();
  assert.notEqual(r.status, 0);
  assert.match(r.stderr, /compiled test discovery mismatch/);
  assert.deepEqual(f.executed(), []);
});

test("ordinary runner refuses orphaned compiled inputs before executing any tests", t => {
  const f = fixture(t);
  f.put("dist/tests/orphan.test.js", "throw new Error('must not execute');");
  const r = f.run();
  assert.notEqual(r.status, 0);
  assert.match(r.stderr, /compiled test discovery mismatch/);
  assert.deepEqual(f.executed(), []);
});

test("ordinary runner propagates a failing root-level regression", t => {
  const f = fixture(t);
  f.put("dist/tests/root.test.js", "require('node:test')('intentional root failure',()=>{throw new Error('fixture regression');});");
  const r = f.run();
  assert.notEqual(r.status, 0);
  assert.match(r.stdout + r.stderr, /fixture regression/);
});

test("ordinary runner rejects inherited worker context rather than accepting an empty recursive run", t => {
  const f = fixture(t), r = f.run({ NODE_TEST_CONTEXT: "child-v8" });
  assert.notEqual(r.status, 0);
  assert.match(r.stderr, /outside a node:test worker/);
  assert.deepEqual(f.executed(), []);
});
