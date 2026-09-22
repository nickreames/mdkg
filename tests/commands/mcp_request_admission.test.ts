import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { spawnSync } from "node:child_process";
import { makeTempDir, writeFile } from "../helpers/fs";
import { writeRootConfig } from "../helpers/config";
import { writeDefaultTemplates } from "../helpers/templates";

const runtime = process.env.MDKG_TEST_PACKAGE ? path.join(process.env.MDKG_TEST_PACKAGE, "dist") : path.resolve(__dirname, "../..");
const { handleMcpRequest, handleMcpMessage } = require(path.join(runtime, "commands/mcp"));
const ping = { jsonrpc: "2.0", id: "after-ping", method: "ping" };
const show = { jsonrpc: "2.0", id: "after-show", method: "tools/call", params: { name: "mdkg_show", arguments: { id: "task-1" } } };
function fixture(t: any): string {
  const root = makeTempDir("mcp-request-admission-");
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  writeRootConfig(root); writeDefaultTemplates(root);
  writeFile(path.join(root, ".mdkg/core/core.md"), "# Core\n");
  writeFile(path.join(root, ".mdkg/work/task-1.md"), "---\nid: task-1\ntype: task\ntitle: Synthetic readable task\nstatus: todo\npriority: 1\ntags: []\nowners: []\nlinks: []\nartifacts: []\nrelates: []\nblocked_by: []\nblocks: []\nrefs: []\naliases: []\nskills: []\ncreated: 2026-09-21\nupdated: 2026-09-21\n---\n# Summary\nSynthetic body.\n");
  writeFile(path.join(root, ".git/index"), "INDEX_SENTINEL");
  writeFile(path.join(root, ".mdkg/state/selected-goal.json"), "{}\n");
  writeFile(path.join(root, ".mdkg/db/runtime/sentinel"), "RUNTIME_SENTINEL");
  return root;
}
function inventory(root: string): Record<string, string> {
  const result: Record<string, string> = {};
  function walk(dir: string) { for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, e.name), relative = path.relative(root, file);
    if (e.isDirectory()) { result[relative] = "directory"; walk(file); }
    else result[relative] = crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
  } }
  walk(root); return result;
}
function session(root: string, first: string): any[] {
  const before = inventory(root);
  const result = spawnSync(process.execPath, [path.join(runtime, "cli.js"), "mcp", "serve", "--stdio"], {
    cwd: root, input: `${first}\n${JSON.stringify(ping)}\n${JSON.stringify(show)}\n`, encoding: "utf8", timeout: 20000, maxBuffer: 4 * 1024 * 1024,
  });
  assert.equal(result.error, undefined); assert.equal(result.status, 0, result.stderr);
  const responses = result.stdout.trim().split("\n").filter(Boolean).map(line => JSON.parse(line));
  assert.deepEqual(responses[responses.length - 2], { jsonrpc: "2.0", id: "after-ping", result: {} });
  assert.equal(responses[responses.length - 1].result.structuredContent.item.id, "task-1");
  assert.deepEqual(inventory(root), before);
  return responses.slice(0, -2);
}
const invalid: unknown[] = [null, true, false, 0, "text", {}, { id: 1 },
  { jsonrpc: "1.0", method: "ping" }, { jsonrpc: "2.0", method: null },
  ...[true, false, {}, []].map(id => ({ jsonrpc: "2.0", id, method: "ping" })),
  ...[null, true, 0, "text"].map(params => ({ jsonrpc: "2.0", id: "bad-params", method: "ping", params })),
];
for (const [index, value] of invalid.entries()) {
  test(`invalid request envelope ${index} returns an error and preserves the stdio session`, t => {
    const responses = session(fixture(t), JSON.stringify(value));
    assert.equal(responses.length, 1); assert.equal(responses[0].error.code, -32600);
    if (!value || typeof value !== "object" || !Object.prototype.hasOwnProperty.call(value, "id") || typeof (value as any).id === "boolean" || typeof (value as any).id === "object") assert.equal(responses[0].id, null);
  });
}
test("overflow numeric IDs fail request admission instead of becoming null successful IDs", t => {
  const responses = session(fixture(t), '{"jsonrpc":"2.0","id":1e400,"method":"ping"}');
  assert.equal(responses[0].id, null); assert.equal(responses[0].error.code, -32600);
});
for (const id of [null, 0, -1, 1.5, "", "string-id"]) {
  test(`valid ${JSON.stringify(id)} ID is preserved exactly`, t => {
    assert.deepEqual(session(fixture(t), JSON.stringify({ jsonrpc: "2.0", id, method: "ping" })), [{ jsonrpc: "2.0", id, result: {} }]);
  });
}
for (const params of [undefined, {}, []]) {
  test(`valid notification with ${JSON.stringify(params)} params remains silent`, t => {
    assert.deepEqual(session(fixture(t), JSON.stringify({ jsonrpc: "2.0", method: "ping", params })), []);
  });
}
test("mixed invalid and valid batch members are independently admitted without nested dispatch", t => {
  const responses = session(fixture(t), JSON.stringify([null, [ping], true, {}, { jsonrpc: "2.0", method: "ping" }, { jsonrpc: "2.0", id: 12, method: "ping" }]));
  assert.equal(responses.length, 5);
  assert.ok(responses.slice(0, 4).every(r => r.id === null && r.error.code === -32600));
  assert.deepEqual(responses[4], { jsonrpc: "2.0", id: 12, result: {} });
});
test("invalid request cannot dispatch a tool with a malformed ID", t => {
  const responses = session(fixture(t), JSON.stringify({ ...show, id: {} }));
  assert.equal(responses[0].error.code, -32600); assert.equal(responses[0].result, undefined);
});
for (const [name, input, code] of [
  ["parse", "{", -32700], ["empty batch", "[]", -32600],
  ["batch size", JSON.stringify(Array.from({ length: 51 }, () => ping)), -32600],
  ["nesting", "[".repeat(65) + "0" + "]".repeat(65), -32600],
  ["line size", "x".repeat(1024 * 1024 + 1), -32600],
] as const) {
  test(`${name} limit/error preserves later session requests`, t => {
    const responses = session(fixture(t), input); assert.equal(responses.length, 1); assert.equal(responses[0].error.code, code);
  });
}
test("direct boundary accepts unknown input without dereferencing null or undefined", () => {
  for (const value of [null, undefined, true, [], 1, "x"]) {
    const response = handleMcpRequest({ root: "/unused" }, value);
    assert.equal(response.id, null); assert.equal(response.error.code, -32600);
  }
  assert.equal(handleMcpMessage({ root: "/unused" }, [null, ping]).length, 2);
});
