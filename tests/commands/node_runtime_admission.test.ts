import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { makeTempDir } from "../helpers/fs";
const { runCli, runCliAsync } = require("../../cli");
const { isSupportedNodeVersion, nodeRuntimeIssue, SUPPORTED_NODE_RANGE } = require("../../core/node_runtime");
const sqlite = require("node:sqlite");

for (const [entrypoint, invoke] of [["sync", runCli], ["async", runCliAsync]] as const) {
  test(`${entrypoint} unsupported Node refuses before workspace discovery`, async () => {
    const original = Object.getOwnPropertyDescriptor(process.versions, "node")!;
    try {
      for (const version of ["24.15.0", "24.17.9", "25.0.0", "26.0.0", "not-a-version"]) {
        Object.defineProperty(process.versions, "node", { ...original, value: version });
        for (const argv of [["init", "--graph-only"], ["index"], ["mcp", "serve", "--stdio"]]) {
          let calls = 0; const errors: string[] = [];
          const code = await invoke(argv, {
            cwd: () => { calls++; throw new Error("workspace discovery reached"); },
            log: () => {}, error: (message: string) => errors.push(message),
          });
          assert.equal(calls, 0);
          assert.equal(code, 2);
          assert.match(errors.join("\n"), /unsupported.*>=24\.18\.0 <25/);
        }
      }
    } finally { Object.defineProperty(process.versions, "node", original); }
  });

  test(`${entrypoint} missing runtime capability refuses explicit roots without filesystem effects`, async t => {
    const root = makeTempDir("mdkg-runtime-refusal-");
    t.after(() => fs.rmSync(root, { recursive: true, force: true }));
    fs.writeFileSync(path.join(root, "user.txt"), "preserved");
    for (const name of ["deserialize", "setAuthorizer", "enableDefensive", "availableMemory"]) {
      const target = name === "availableMemory" ? process : sqlite.DatabaseSync.prototype;
      const original = target[name], open = fs.openSync; let opens = 0;
      const errors: string[] = [];
      try {
        target[name] = undefined;
        (fs as any).openSync = (...args: any[]) => { opens++; return (open as any)(...args); };
        assert.equal(await invoke(["init", "--graph-only", "--root", root], {
          cwd: () => { throw new Error("unexpected discovery"); },
          log: () => {}, error: (message: string) => errors.push(message),
        }), 2);
        assert.equal(opens, 0);
        assert.match(errors.join("\n"), new RegExp(`missing ${name}`));
      } finally { target[name] = original; fs.openSync = open; }
      assert.deepEqual(fs.readdirSync(root), ["user.txt"]);
      assert.equal(fs.readFileSync(path.join(root, "user.txt"), "utf8"), "preserved");
    }
  });

  test(`${entrypoint} help version and option refusals remain usable on unsupported Node`, async () => {
    const original = Object.getOwnPropertyDescriptor(process.versions, "node")!;
    try {
      Object.defineProperty(process.versions, "node", { ...original, value: "26.0.0" });
      const runtime = { cwd: () => { throw new Error("unexpected discovery"); }, log: () => {}, error: () => {} };
      for (const argv of [[], ["--help"], ["help", "init"], ["--version"]]) assert.equal(await invoke(argv, runtime), 0);
      assert.equal(await invoke(["init", "--unsupported-option"], runtime), 1);
      assert.equal(await invoke(["git", "push"], runtime), 1);
    } finally { Object.defineProperty(process.versions, "node", original); }
  });
}

test("runtime contract is explicit about stable Node 24 versions and package metadata", () => {
  for (const version of ["24.18.0", "24.18.1", "24.99.0"]) assert.equal(isSupportedNodeVersion(version), true, version);
  for (const version of ["24.17.99", "23.99.0", "25.0.0", "26.0.0", "24.18.0-rc.1", "24.18", "v24.18.0", "24.18.0junk"]) assert.equal(isSupportedNodeVersion(version), false, version);
  const pkg = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../../../package.json"), "utf8"));
  const lock = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../../../package-lock.json"), "utf8"));
  assert.equal(pkg.engines.node, SUPPORTED_NODE_RANGE);
  assert.equal(lock.packages[""].engines.node, SUPPORTED_NODE_RANGE);
  assert.equal(nodeRuntimeIssue(), undefined);
});

test("missing built-in SQLite produces a useful capability diagnostic", () => {
  const Module = require("node:module"), load = Module._load;
  try {
    Module._load = function(name: string, ...args: any[]) {
      if (name === "node:sqlite") throw new Error("synthetic unavailable module");
      return load.call(this, name, ...args);
    };
    assert.match(nodeRuntimeIssue(), /built-in node:sqlite is unavailable/);
  } finally { Module._load = load; }
});
