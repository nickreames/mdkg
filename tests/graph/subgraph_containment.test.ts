import { before, test } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import { spawnSync } from "node:child_process";
import { makeTempDir, writeFile } from "../helpers/fs";
import { writeRootConfig } from "../helpers/config";
const { loadConfig } = require("../../core/config");
const { buildSubgraphsIndex, buildSubgraphCapabilityRecords } = require("../../graph/subgraphs");
const { createNodeBodyReader, readNodeBody } = require("../../graph/node_body");
const { handleMcpRequest } = require("../../commands/mcp");
const cli = path.resolve(__dirname, "../../cli.js");
const marker = "SYNTHETIC_SUBGRAPH_BODY_MARKER";
let bundle: Buffer;
function writeBundle(file: string) { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, bundle); }
function command(root: string, args: string[]) {
  return spawnSync(process.execPath, [cli, ...args], { cwd: root, encoding: "utf8", timeout: 10000 });
}
before(() => {
  const source = makeTempDir("mdkg-subgraph-source-");
  try {
    for (const args of [["init", "--graph-only"], ["new", "task", "Synthetic task"], ["new", "manifest", "Synthetic capability", "--id", "agent.synthetic"]]) {
      const result = command(source, args); assert.equal(result.status, 0, result.stdout + result.stderr);
    }
    const task = fs.readdirSync(path.join(source, ".mdkg/work")).find((name) => name.startsWith("task-1-"))!;
    fs.appendFileSync(path.join(source, ".mdkg/work", task), `\n${marker}\n`);
    const packed = command(source, ["bundle", "create", "--profile", "private", "--json"]);
    assert.equal(packed.status, 0, packed.stdout + packed.stderr);
    bundle = fs.readFileSync(path.join(source, ".mdkg/bundles/private/all.mdkg.zip"));
  } finally { fs.rmSync(source, { recursive: true, force: true }); }
});
function fixture(t: { after(fn: () => void): void }) {
  const owner = makeTempDir("mdkg-subgraph-boundary-");
  t.after(() => fs.rmSync(owner, { recursive: true, force: true }));
  const root = path.join(owner, "repo"), outside = path.join(owner, "outside");
  fs.mkdirSync(root); fs.mkdirSync(outside); writeRootConfig(root);
  const bundlePath = path.join(root, "bundles/child.zip"), external = path.join(outside, "child.zip");
  writeBundle(bundlePath); writeBundle(external);
  const configFile = path.join(root, ".mdkg/config.json"), raw = JSON.parse(fs.readFileSync(configFile, "utf8"));
  raw.subgraphs = { child: { sources: [{ path: "bundles/child.zip", expected_profile: "private" }] } };
  writeFile(configFile, JSON.stringify(raw));
  const config = loadConfig(root);
  return { root, outside, bundlePath, external, config };
}
function node(f: any) { const projected = buildSubgraphsIndex(f.root, f.config); assert.ok(projected.index.nodes["child:task-1"], JSON.stringify(projected.index.subgraphs)); return projected.index.nodes["child:task-1"]; }
function linked(t: { skip(message?: string): void }, target: string, link: string, kind: "file" | "dir") {
  try { fs.symlinkSync(target, link, kind); return true; }
  catch (error) { if ((error as NodeJS.ErrnoException).code !== "EPERM") throw error; t.skip("symlink privileges unavailable"); return false; }
}
for (const kind of ["leaf", "ancestor", "inward", "dangling"]) {
  test(`subgraph ${kind} links cannot supply projected bodies or capabilities`, (t) => {
    const f = fixture(t), oldNode = node(f);
    let target = f.external, link = f.bundlePath;
    if (kind === "ancestor") { fs.rmSync(path.dirname(f.bundlePath), { recursive: true }); target = f.outside; link = path.dirname(f.bundlePath); }
    else { fs.unlinkSync(f.bundlePath); if (kind === "inward") { target = path.join(f.root, "inside.zip"); writeBundle(target); } if (kind === "dangling") target += ".missing"; }
    if (!linked(t, target, link, kind === "ancestor" ? "dir" : "file")) return;
    const projection = buildSubgraphsIndex(f.root, f.config);
    assert.deepEqual(Object.keys(projection.index.nodes), []);
    assert.match(JSON.stringify(projection.index.subgraphs), /symbolic link|linked/);
    assert.equal(buildSubgraphCapabilityRecords(f.root, f.config).records.length, 0);
    assert.throws(() => readNodeBody(f.root, oldNode), /symbolic link|linked/);
    assert.throws(() => createNodeBodyReader(f.root)(oldNode), /symbolic link|linked/);
    assert.deepEqual(fs.readFileSync(f.external), bundle);
  });
}
test("warmed imported body cache rechecks bundle path authority", (t) => {
  const f = fixture(t), n = node(f), read = createNodeBodyReader(f.root);
  assert.match(read(n), new RegExp(marker));
  fs.unlinkSync(f.bundlePath); if (!linked(t, f.external, f.bundlePath, "file")) return;
  assert.throws(() => read(n), /symbolic link|linked/);
});
for (const sourcePath of ["../outside/child.zip", "bundles/../bundles/child.zip"]) {
  test(`direct imported metadata cannot launder ${sourcePath}`, (t) => {
    const f = fixture(t), n = node(f); n.source.bundle_path = sourcePath;
    assert.throws(() => readNodeBody(f.root, n), /relative|parent|component/);
    assert.throws(() => createNodeBodyReader(f.root)(n), /relative|parent|component/);
  });
}
test("direct imported metadata rejects absolute external paths", (t) => {
  const f = fixture(t), n = node(f); n.source.bundle_path = f.external;
  assert.throws(() => readNodeBody(f.root, n), /relative/);
  assert.throws(() => createNodeBodyReader(f.root)(n), /relative/);
});
test("contained regular bundles preserve projection, body limits, and capability reads", (t) => {
  const f = fixture(t), n = node(f);
  assert.match(readNodeBody(f.root, n), new RegExp(marker)); assert.match(createNodeBodyReader(f.root)(n), new RegExp(marker));
  assert.ok(buildSubgraphCapabilityRecords(f.root, f.config).records.some((r: any) => r.qid === "child:agent.synthetic"));
  assert.throws(() => readNodeBody(f.root, n, 1), /byte limit/);
  assert.throws(() => createNodeBodyReader(f.root, 1)(n), /byte limit/);
});
test("native dotted/repeated paths and POSIX literal backslashes remain usable", (t) => {
  const f = fixture(t); f.config.subgraphs.child.sources[0].path = "./bundles//child.zip";
  assert.match(readNodeBody(f.root, node(f)), new RegExp(marker));
  if (process.platform !== "win32") {
    writeBundle(path.join(f.root, "literal\\name.zip"));
    f.config.subgraphs.child.sources[0].path = "literal\\name.zip";
    assert.match(readNodeBody(f.root, node(f)), new RegExp(marker));
  }
});
test("disabled and unrelated aliases preserve health isolation", (t) => {
  const f = fixture(t); f.config.subgraphs.other = { ...f.config.subgraphs.child, sources: [{ ...f.config.subgraphs.child.sources[0], path: "missing.zip" }] };
  let result = buildSubgraphsIndex(f.root, f.config); assert.ok(result.index.nodes["child:task-1"]); assert.ok(result.index.subgraphs.find((s: any) => s.alias === "other").error_count);
  f.config.subgraphs.other.enabled = false; result = buildSubgraphsIndex(f.root, f.config);
  assert.equal(result.index.subgraphs.find((s: any) => s.alias === "other").error_count, 0);
  f.config.subgraphs.child.sources.push({ path: "missing.zip", expected_profile: "private", enabled: false }); assert.ok(node(f));
});
test("CLI and MCP reject linked imports without exposing fixture body after a cached index", (t) => {
  const f = fixture(t); assert.equal(command(f.root, ["index"]).status, 0);
  assert.match(command(f.root, ["show", "child:task-1", "--json"]).stdout, new RegExp(marker));
  fs.unlinkSync(f.bundlePath); if (!linked(t, f.external, f.bundlePath, "file")) return;
  for (const args of [["show", "child:task-1", "--json"], ["pack", "child:task-1", "--dry-run"], ["capability", "search", "Synthetic", "--json"]]) {
    const result = command(f.root, args); assert.equal(result.error, undefined); assert.doesNotMatch(result.stdout + result.stderr, new RegExp(marker));
    if (args[0] !== "capability") assert.notEqual(result.status, 0);
  }
  for (const name of ["mdkg_show", "mdkg_pack"]) {
    const response = handleMcpRequest({ root: f.root }, { jsonrpc: "2.0", id: 1, method: "tools/call", params: { name, arguments: { id: "child:task-1" } } });
    assert.doesNotMatch(JSON.stringify(response), new RegExp(marker));
  }
});
test("explicit operator-selected external bundle inspection remains supported", (t) => {
  const f = fixture(t), result = command(f.root, ["bundle", "show", f.external, "--json"]);
  assert.equal(result.status, 0, result.stdout + result.stderr);
});

test("oversized and nonregular bundle replacements fail before a body read", (t) => {
  const f = fixture(t), n = node(f);
  const handle = fs.openSync(f.bundlePath, "r+");
  try { fs.ftruncateSync(handle, 128 * 1024 * 1024 + 1); } finally { fs.closeSync(handle); }
  t.mock.method(fs, "readSync", () => { throw new Error("unexpected bundle byte read"); });
  assert.throws(() => readNodeBody(f.root, n), /byte limit/);
  assert.throws(() => createNodeBodyReader(f.root)(n), /byte limit/);
  t.mock.reset();
  fs.unlinkSync(f.bundlePath); fs.mkdirSync(f.bundlePath);
  assert.throws(() => readNodeBody(f.root, n), /regular file/);
});
test("capability reread rejects a leaf substituted after projection", (t) => {
  const f = fixture(t), original = fs.openSync;
  let opened = 0, substituted = false;
  t.mock.method(fs, "openSync", (...args: any[]) => {
    if (args[0] === f.bundlePath && ++opened === 2) {
      fs.unlinkSync(f.bundlePath); fs.symlinkSync(f.external, f.bundlePath); substituted = true;
    }
    return (original as any)(...args);
  });
  const result = buildSubgraphCapabilityRecords(f.root, f.config);
  assert.equal(substituted, true); assert.equal(result.records.length, 0);
  assert.ok(result.warnings.length > 0); assert.deepEqual(fs.readFileSync(f.external), bundle);
});
