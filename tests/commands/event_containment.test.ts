import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import { spawnSync } from "node:child_process";
import { makeTempDir, writeFile } from "../helpers/fs";
import { writeRootConfig } from "../helpers/config";
import { writeDefaultTemplates } from "../helpers/templates";
const { collectValidateReceipt } = require("../../commands/validate");
const { loadConfig } = require("../../core/config");
const { handleMcpRequest } = require("../../commands/mcp");
const event = (workspace = "root", notes = "é🙂") => JSON.stringify({ ts: "t", run_id: "r", workspace, agent: "a", kind: "k", status: "custom-status", refs: [1], artifacts: [false], notes, extra: true });
function fixture(t: { after(fn: () => void): void }) {
  const owner = makeTempDir("mdkg-events-boundary-");
  t.after(() => fs.rmSync(owner, { recursive: true, force: true }));
  const root = path.join(owner, "repo"), outside = path.join(owner, "outside");
  fs.mkdirSync(root); fs.mkdirSync(outside);
  writeRootConfig(root); writeDefaultTemplates(root);
  const events = path.join(root, ".mdkg/work/events/events.jsonl");
  fs.mkdirSync(path.dirname(events), { recursive: true });
  return { root, outside, events };
}
function configure(root: string, patch: Record<string, number>, change?: (config: any) => void) {
  const file = path.join(root, ".mdkg/config.json"), config = JSON.parse(fs.readFileSync(file, "utf8"));
  config.events = { validation: patch }; change?.(config);
  writeFile(file, JSON.stringify(config));
}
function validate(root: string) { return collectValidateReceipt({ root, json: true }); }
function linkOrSkip(t: { skip(message?: string): void }, target: string, link: string, type: "dir" | "file") {
  try { fs.symlinkSync(target, link, type); return true; }
  catch (error) { if ((error as NodeJS.ErrnoException).code !== "EPERM") throw error; t.skip("symbolic links unavailable"); return false; }
}
for (const kind of ["leaf", "ancestor", "dangling", "inward"]) {
  test(`event validation rejects ${kind} links without exposing target bytes`, (t) => {
    const f = fixture(t), sentinel = path.join(f.outside, "events.jsonl");
    writeFile(sentinel, event());
    let target = sentinel;
    if (kind === "dangling") target += ".missing";
    if (kind === "inward") { target = path.join(f.root, "inside.jsonl"); writeFile(target, event()); }
    if (kind === "ancestor") {
      fs.rmdirSync(path.dirname(f.events));
      if (!linkOrSkip(t, f.outside, path.dirname(f.events), "dir")) return;
    } else if (!linkOrSkip(t, target, f.events, "file")) return;
    const receipt = validate(f.root);
    assert.equal(receipt.ok, false);
    assert.match(receipt.errors.join("\n"), /symbolic link|linked ancestor/);
    assert.equal(fs.readFileSync(sentinel, "utf8"), event());
  });
}
for (const [key, value, content] of [
  ["max_file_bytes", 100, event()],
  ["max_total_bytes", 100, event()],
  ["max_line_bytes", 20, " ".repeat(21)],
  ["max_records", 1, event() + "\n" + event()],
  ["max_lines", 2, "\n\n\n"],
] as const) {
  test(`event validation enforces ${key}`, (t) => {
    const f = fixture(t); configure(f.root, { [key]: value }); writeFile(f.events, content);
    const receipt = validate(f.root);
    assert.equal(receipt.ok, false);
    assert.match(receipt.errors.join("\n"), /limit|exceed/);
    assert.equal(fs.readFileSync(f.events, "utf8"), content);
  });
}
test("event diagnostics are bounded for malformed-record floods", (t) => {
  const f = fixture(t); configure(f.root, { max_errors: 2 }); writeFile(f.events, "bad\n".repeat(200));
  const receipt = validate(f.root);
  assert.equal(receipt.ok, false); assert.ok(receipt.errors.length <= 3);
  assert.match(receipt.errors.join("\n"), /max_errors/);
});
test("event aggregate limits cover every enabled workspace", (t) => {
  const f = fixture(t), second = event("child");
  configure(f.root, { max_total_bytes: Buffer.byteLength(event()) + Buffer.byteLength(second) - 1 }, (c) => {
    c.workspaces.child = { path: "child", enabled: true, mdkg_dir: ".graph", visibility: "private" };
  });
  writeFile(f.events, event()); writeFile(path.join(f.root, "child/.graph/work/events/events.jsonl"), second);
  assert.equal(validate(f.root).ok, false);
});
test("event and Markdown reads share the graph aggregate budget", (t) => {
  const f = fixture(t), node = "---\nid: task-1\ntype: task\ntitle: node\nstatus: todo\npriority: 2\ncreated: 2026-01-01\nupdated: 2026-01-01\n---\n";
  configure(f.root, {}, (c) => { c.index.limits = { max_files: 100, max_file_bytes: 1024, max_total_bytes: Buffer.byteLength(node) + Buffer.byteLength(event()) - 1, max_depth: 10 }; });
  writeFile(path.join(f.root, ".mdkg/work/task-1.md"), node); writeFile(f.events, event());
  const receipt = validate(f.root);
  assert.equal(receipt.ok, false); assert.match(receipt.errors.join("\n"), /budget|limit/);
});
test("missing logs and legacy record semantics remain valid at exact limits", (t) => {
  const f = fixture(t); assert.equal(validate(f.root).ok, true);
  const content = "\r\n  \n" + event() + "\r\n" + event();
  configure(f.root, { max_file_bytes: Buffer.byteLength(content), max_total_bytes: Buffer.byteLength(content), max_line_bytes: Buffer.byteLength(event()) + 1, max_records: 2, max_lines: 4 });
  writeFile(f.events, content); assert.equal(validate(f.root).ok, true);
});
test("UTF-8 sequences spanning read chunks and histories above the Markdown file limit remain valid", (t) => {
  const f = fixture(t); configure(f.root, {}, (c) => { c.index.limits = { max_files: 100, max_file_bytes: 1024, max_total_bytes: 1024 * 1024, max_depth: 10 }; });
  writeFile(f.events, event("root", "a".repeat(65500) + "🙂é".repeat(100)));
  assert.equal(validate(f.root).ok, true);
});
test("invalid or excessive event limit overrides fail config validation", (t) => {
  const f = fixture(t);
  for (const value of [0, -1, 1.5, Number.MAX_SAFE_INTEGER]) {
    configure(f.root, { max_line_bytes: value }); assert.throws(() => loadConfig(f.root), /events.validation.max_line_bytes/);
  }
});
test("MCP validate inherits bounded event consumption", (t) => {
  const f = fixture(t); configure(f.root, { max_records: 1 }); writeFile(f.events, event() + "\n" + event());
  const response = handleMcpRequest({ root: f.root }, { jsonrpc: "2.0", id: 1, method: "tools/call", params: { name: "mdkg_validate", arguments: {} } });
  assert.match(JSON.stringify(response), /max_records/);
});
test("direct FIFO events are rejected promptly without a writer", (t) => {
  if (process.platform === "win32") { t.skip("POSIX FIFO fixture"); return; }
  const f = fixture(t), fifo = spawnSync("mkfifo", [f.events], { encoding: "utf8" });
  assert.equal(fifo.status, 0, fifo.stderr);
  const result = spawnSync(process.execPath, [path.resolve(__dirname, "../../cli.js"), "validate", "--json"], { cwd: f.root, encoding: "utf8", timeout: 3000 });
  assert.equal(result.error, undefined); assert.notEqual(result.status, 0);
  assert.match(result.stdout + result.stderr, /must be a file|regular/);
});
