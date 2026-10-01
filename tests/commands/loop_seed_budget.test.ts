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
const cli = path.join(runtime, "cli.js");
const commands = require(path.join(runtime, "commands/loop"));
const frontmatter = require(path.join(runtime, "graph/frontmatter"));
const indexCache = require(path.join(runtime, "graph/index_cache"));
const { loadConfig } = require(path.join(runtime, "core/config"));
function run(root: string, args: string[]) { return spawnSync(process.execPath, [cli, ...args], { cwd: root, encoding: "utf8", timeout: 10000 }); }
function output(fn: () => void) {
  const lines: string[] = [], log = console.log, error = console.error;
  console.log = (...args: unknown[]) => { lines.push(args.map(String).join(" ")); }; console.error = () => {};
  try { fn(); } finally { console.log = log; console.error = error; }
  return JSON.parse(lines.join("\n"));
}
function fixture() {
  const root = makeTempDir("loop-budget-"); writeRootConfig(root); writeDefaultTemplates(root);
  writeFile(path.join(root, ".mdkg/core/core.md"), "# Core\n");
  const create = run(root, ["new", "loop", "Source template", "--json"]);
  assert.equal(create.status, 0, create.stderr);
  const source = JSON.parse(create.stdout).node.path;
  const seed = path.join(root, ".mdkg/templates/loops/safe.loop.md");
  writeFile(seed, fs.readFileSync(path.join(root, source), "utf8"));
  const forks: string[] = [];
  for (let i = 0; i < 3; i++) {
    const r = run(root, ["loop", "fork", "safe", "--scope", "repo", "--planning-only", "--json"]);
    assert.equal(r.status, 0, r.stderr); forks.push(JSON.parse(r.stdout).loop.path);
  }
  writeFile(path.join(root, ".git/index"), "index sentinel");
  writeFile(path.join(root, ".mdkg/state/selected-goal.json"), "{}\n");
  writeFile(path.join(root, ".mdkg/db/runtime/preserved"), "runtime sentinel");
  return { root, seed, source, forks };
}
function inventory(root: string) {
  const result: Record<string, string> = {};
  function walk(dir: string) { for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const f = path.join(dir, e.name); if (e.isDirectory()) walk(f);
    else result[path.relative(root, f)] = crypto.createHash("sha256").update(fs.readFileSync(f)).digest("hex");
  } }
  walk(root); return result;
}
for (const templates of [true, false]) test(`loop list reuses seed provenance once, templates=${templates}`, () => {
  const { root, seed } = fixture(); const parse = frontmatter.parseFrontmatter; let reads = 0;
  frontmatter.parseFrontmatter = (content: string, file: string) => { if (file === seed) reads++; return parse(content, file); };
  try {
    const before = inventory(root);
    const receipt = output(() => commands.runLoopListCommand({ root, templates, json: true }));
    assert.equal(reads, 1, "one parse per unique seed per command");
    assert.equal(receipt.catalog.loops.filter((n: any) => n.template_lineage.state === "current").length, 3);
    assert.deepEqual(inventory(root), before);
    fs.appendFileSync(seed, "\nNew guidance\n"); reads = 0;
    const changed = output(() => commands.runLoopListCommand({ root, templates, json: true }));
    assert.equal(reads, 1); assert.equal(changed.catalog.loops.filter((n: any) => n.template_lineage.state === "stale").length, 3);
  } finally { frontmatter.parseFrontmatter = parse; fs.rmSync(root, { recursive: true, force: true }); }
});
test("loop list reuses one indexed provenance source", () => {
  const { root, source, forks } = fixture(); const parse = frontmatter.parseFrontmatter, load = indexCache.loadIndex; let reads = 0;
  try {
    for (const f of forks) fs.writeFileSync(path.join(root, f), fs.readFileSync(path.join(root, f), "utf8").replace(/template:\/\/loops\/safe/g, "root:loop-1"));
    assert.equal(run(root, ["index"]).status, 0);
    const admitted = load({ root, config: loadConfig(root), useCache: false, allowReindex: true, persistReindex: false });
    indexCache.loadIndex = () => admitted;
    frontmatter.parseFrontmatter = (content: string, file: string) => { if (file === path.join(root, source)) reads++; return parse(content, file); };
    output(() => commands.runLoopListCommand({ root, json: true }));
    assert.equal(reads, 1);
  } finally { indexCache.loadIndex = load; frontmatter.parseFrontmatter = parse; fs.rmSync(root, { recursive: true, force: true }); }
});
for (const route of ["fork", "provenance", "show"]) test(`indexed ${route} bounds fresh bytes after index admission`, () => {
  const { root, source, forks } = fixture(), load = indexCache.loadIndex;
  try {
    for (const f of forks) fs.writeFileSync(path.join(root, f), fs.readFileSync(path.join(root, f), "utf8").replace(/template:\/\/loops\/safe/g, "root:loop-1"));
    assert.equal(run(root, ["index"]).status, 0);
    const configPath = path.join(root, ".mdkg/config.json"), config = JSON.parse(fs.readFileSync(configPath, "utf8"));
    config.index.limits = { ...loadConfig(root).index.limits, max_file_bytes: 16384 }; fs.writeFileSync(configPath, JSON.stringify(config));
    const admitted = load({ root, config: loadConfig(root), useCache: false, allowReindex: true, persistReindex: false });
    // Model a regular file growing after valid index admission without mutating
    // shared repository state; the consumer must bound the bytes it actually uses.
    fs.appendFileSync(path.join(root, source), "x".repeat(16384));
    indexCache.loadIndex = () => admitted;
    const before = inventory(root);
    assert.throws(() => output(() => route === "fork"
      ? commands.runLoopForkCommand({ root, template: "loop-1", scope: "repo", dryRun: true, json: true })
      : route === "show" ? commands.runLoopShowCommand({ root, id: "loop-1", json: true })
      : commands.runLoopListCommand({ root, templates: false, json: true })), /byte limit/);
    assert.deepEqual(inventory(root), before);
  } finally { indexCache.loadIndex = load; fs.rmSync(root, { recursive: true, force: true }); }
});
test("newline-dense in-budget frontmatter body fits a bounded parser heap", () => {
  const root = makeTempDir("loop-parser-budget-");
  try {
    const script = path.join(root, "parse.cjs");
    writeFile(script, `const {parseFrontmatter}=require(${JSON.stringify(path.join(runtime, "graph/frontmatter"))});const body='\\n'.repeat(6*1024*1024);const parsed=parseFrontmatter('---\\ntype: loop\\n---\\n'+body,'synthetic');if(parsed.body!==body)throw Error('body changed');console.log('ok');`);
    const r = spawnSync("sh", ["-c", 'ulimit -c 0; exec "$@"', "sh", process.execPath, "--max-old-space-size=64", "--max-semi-space-size=1", script], { cwd: root, encoding: "utf8", timeout: 15000 });
    assert.equal(r.error, undefined); assert.equal(r.status, 0, r.stderr); assert.match(r.stdout, /ok/);
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});

const catalogRoutes: Record<string, string[]> = {
  list: ["loop", "list", "--json"],
  provenance: ["loop", "show", "loop-2", "--json"],
  plan: ["loop", "plan", "loop-2", "--json"],
  next: ["loop", "next", "loop-2", "--json"],
  new: ["new", "loop", "Budget admission", "--json"],
};
for (const [route, args] of Object.entries(catalogRoutes)) for (const limit of ["file", "total", "count", "entries", "depth"]) {
  test(`${route} refuses ${limit} overflow without persistent effects`, () => {
    const { root, seed } = fixture();
    try {
      const configPath = path.join(root, ".mdkg/config.json"), config = JSON.parse(fs.readFileSync(configPath, "utf8"));
      config.index.limits = { ...loadConfig(root).index.limits };
      const body = fs.readFileSync(seed, "utf8"), dir = path.dirname(seed);
      if (limit === "file") { config.index.limits.max_file_bytes = 65536; fs.appendFileSync(seed, "x".repeat(65537)); }
      if (limit === "total") {
        config.index.limits.max_total_bytes = 262144;
        fs.writeFileSync(seed, body + "x".repeat(131073 - Buffer.byteLength(body)));
        writeFile(path.join(dir, "second.loop.md"), fs.readFileSync(seed, "utf8"));
      }
      if (limit === "count") { config.index.limits.max_files = 32; for (let i = 0; i < 32; i++) writeFile(path.join(dir, `other-${i}.loop.md`), body); }
      if (limit === "entries") { config.index.limits.max_files = 32; for (let i = 0; i < 320; i++) writeFile(path.join(dir, `unrelated-${i}`), ""); }
      if (limit === "depth") { config.index.limits.max_depth = 2; fs.mkdirSync(path.join(dir, "one/two/three"), { recursive: true }); }
      fs.writeFileSync(configPath, JSON.stringify(config));
      const before = inventory(root), result = run(root, args);
      assert.equal(result.error, undefined, String(result.error)); assert.notEqual(result.status, 0);
      assert.match(result.stderr, /byte limit|template count|entry budget|directory depth/);
      assert.deepEqual(inventory(root), before);
    } finally { fs.rmSync(root, { recursive: true, force: true }); }
  });
}
for (const args of [["loop", "show", "safe", "--json"], ["loop", "fork", "safe", "--scope", "repo", "--dry-run", "--json"], ["loop", "fork", "safe", "--scope", "repo", "--planning-only", "--json"]]) {
  test(`${args.join(" ")} respects selected seed byte admission`, () => {
    const { root, seed } = fixture();
    try {
      const configPath = path.join(root, ".mdkg/config.json"), config = JSON.parse(fs.readFileSync(configPath, "utf8"));
      config.index.limits = { ...loadConfig(root).index.limits, max_file_bytes: 65536 };
      fs.writeFileSync(configPath, JSON.stringify(config));
      const content = fs.readFileSync(seed, "utf8"), acceptedBytes = args[1] === "show" ? 65536 : 16384;
      fs.writeFileSync(seed, content + "x".repeat(acceptedBytes - Buffer.byteLength(content)));
      const accepted = run(root, args); assert.equal(accepted.status, 0, accepted.stderr);
      fs.appendFileSync(seed, "x".repeat(65537 - acceptedBytes)); const before = inventory(root), refused = run(root, args);
      assert.equal(refused.error, undefined); assert.notEqual(refused.status, 0); assert.match(refused.stderr, /byte limit/);
      assert.deepEqual(inventory(root), before);
    } finally { fs.rmSync(root, { recursive: true, force: true }); }
  });
}
test("frontmatter incremental header preserves line and body semantics", () => {
  for (const eol of ["\n", "\r\n"]) for (const body of ["", "one", "\n", "one\r\ntwo\n", "last\r"]) {
    const parsed = frontmatter.parseFrontmatter(["  ---  ", "title: test", "---", body].join(eol), "fixture");
    assert.equal(parsed.body, body.replace(/\r\n/g, "\n")); assert.equal(parsed.frontmatter.title, "test");
  }
  assert.throws(() => frontmatter.parseFrontmatter("---\r\ntitle: a\r\ntitle: b\r\n---", "fixture"), /fixture:3: duplicate key/);
  assert.throws(() => frontmatter.parseFrontmatter("---\n" + "x\n".repeat(10001) + "---\n", "fixture"), /exceeds 1000 lines/);
  assert.throws(() => frontmatter.parseFrontmatter("---\n" + "x\n".repeat(10001), "fixture"), /closing --- not found/);
});

test("seed and indexed provenance share one unique-input total budget", () => {
  const { root, source, seed, forks } = fixture();
  try {
    fs.appendFileSync(seed, "x".repeat(58000)); fs.appendFileSync(path.join(root, source), "x".repeat(9000));
    fs.writeFileSync(path.join(root, forks[1]), fs.readFileSync(path.join(root, forks[1]), "utf8").replace(/template:\/\/loops\/safe/g, "root:loop-1"));
    const configPath = path.join(root, ".mdkg/config.json"), config = JSON.parse(fs.readFileSync(configPath, "utf8"));
    config.index.limits = { ...loadConfig(root).index.limits, max_total_bytes: fs.statSync(seed).size + fs.statSync(path.join(root, source)).size };
    fs.writeFileSync(configPath, JSON.stringify(config));
    assert.equal(run(root, ["loop", "list", "--json"]).status, 0);
    config.index.limits.max_total_bytes--; fs.writeFileSync(configPath, JSON.stringify(config));
    const before = inventory(root), refused = run(root, ["loop", "list", "--json"]);
    assert.notEqual(refused.status, 0); assert.match(refused.stderr, /byte limit/); assert.deepEqual(inventory(root), before);
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});

for (const selected of [false, true]) test(`seed ${selected ? "selected" : "catalog"} counts actual bytes, not just descriptor size`, () => {
  const { root, seed } = fixture(), stat = fs.fstatSync;
  try {
    const { loadLoopSeed, loadLoopSeedCatalog } = require(path.join(runtime, "templates/loop_seeds"));
    const config = loadConfig(root); config.index.limits.max_file_bytes = 128;
    const target = fs.statSync(seed);
    (fs.fstatSync as any) = (fd: number, ...args: any[]) => {
      const value = (stat as any)(fd, ...args);
      if (value.dev === target.dev && value.ino === target.ino) value.size = 0;
      return value;
    };
    assert.throws(() => selected ? loadLoopSeed(root, config, "safe") : loadLoopSeedCatalog(root, config), /byte limit/);
  } finally { fs.fstatSync = stat; fs.rmSync(root, { recursive: true, force: true }); }
});

test("loop list handles a newline-dense seed with bounded parser and purpose-line memory", () => {
  const { root, seed } = fixture();
  try {
    const original = fs.readFileSync(seed, "utf8"), parsed = frontmatter.parseFrontmatter(original, seed);
    const header = original.slice(0, original.indexOf("\n---", 4) + 5);
    fs.writeFileSync(seed, header + "\n".repeat(6 * 1024 * 1024) + "Useful purpose\n");
    assert.equal(parsed.frontmatter.type, "loop");
    const r = spawnSync("sh", ["-c", 'ulimit -c 0; exec "$@"', "sh", process.execPath, "--max-old-space-size=64", "--max-semi-space-size=1", cli, "loop", "list", "--json"], { cwd: root, encoding: "utf8", timeout: 15000 });
    assert.equal(r.error, undefined); assert.equal(r.status, 0, r.stderr);
    assert.equal(JSON.parse(r.stdout).templates[0].purpose, "Useful purpose");
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});

test("imported loop body and local provenance consume the same total budget", () => {
  const { root, seed } = fixture(), child = makeTempDir("loop-budget-child-");
  try {
    writeRootConfig(child); writeDefaultTemplates(child); writeFile(path.join(child, ".mdkg/core/core.md"), "# Core\n");
    const made = run(child, ["new", "loop", "Imported loop", "--json"]); assert.equal(made.status, 0, made.stderr);
    const sourcePath = path.join(child, JSON.parse(made.stdout).node.path);
    let source = fs.readFileSync(sourcePath, "utf8").replace("template_refs: []", "template_refs: [template://loops/safe]").replace("artifacts: []", `artifacts: [template_hash=sha256:${"0".repeat(64)}]`);
    source += "x".repeat(40960 - Buffer.byteLength(source)); fs.writeFileSync(sourcePath, source);
    const packed = run(child, ["bundle", "create", "--pack-profile", "private", "--json"]); assert.equal(packed.status, 0, packed.stderr);
    const bundle = path.join(root, ".mdkg/bundles/synthetic.zip"); fs.mkdirSync(path.dirname(bundle), { recursive: true });
    fs.copyFileSync(path.join(child, ".mdkg/bundles/private/all.mdkg.zip"), bundle);
    const seedText = fs.readFileSync(seed, "utf8"); fs.writeFileSync(seed, seedText + "x".repeat(40960 - Buffer.byteLength(seedText)));
    const configPath = path.join(root, ".mdkg/config.json"), config = JSON.parse(fs.readFileSync(configPath, "utf8"));
    config.subgraphs = { child: { sources: [{ path: ".mdkg/bundles/synthetic.zip", expected_profile: "private" }] } };
    config.index.limits = { ...loadConfig(root).index.limits, max_file_bytes: 65536, max_total_bytes: 81920 };
    fs.writeFileSync(configPath, JSON.stringify(config));
    const control = run(root, ["loop", "show", "child:loop-1", "--json"]); assert.equal(control.status, 0, control.stderr);
    config.index.limits.max_total_bytes = 65536; fs.writeFileSync(configPath, JSON.stringify(config));
    const before = inventory(root), result = run(root, ["loop", "show", "child:loop-1", "--json"]);
    assert.notEqual(result.status, 0); assert.match(result.stderr, /byte limit/); assert.deepEqual(inventory(root), before);
  } finally { fs.rmSync(root, { recursive: true, force: true }); fs.rmSync(child, { recursive: true, force: true }); }
});
