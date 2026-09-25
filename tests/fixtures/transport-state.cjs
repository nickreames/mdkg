"use strict";

// CLI-only consumer exercises. ZIP helpers come from the installed package and
// are used only to inspect or construct synthetic input, never to run the
// producer/consumer behavior being qualified through canonical source imports.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

function runTransportStateFixtures({ packageRoot, root, commands }) {
  assert(!fs.existsSync(root), "transport fixture root must be new and exclusively owned");
  fs.mkdirSync(root, { recursive: true });
  const cli = path.join(packageRoot, "dist/cli.js");
  const { readZipEntries, createDeterministicZipFromEntries } = require(path.join(packageRoot, "dist/util/zip.js"));
  const cases = [];
  const hash = bytes => crypto.createHash("sha256").update(bytes).digest("hex");
  const put = (base, file, bytes) => {
    const target = path.join(base, file); fs.mkdirSync(path.dirname(target), { recursive: true }); fs.writeFileSync(target, bytes); return target;
  };
  const invoke = (cwd, args, expected = 0) => {
    const r = commands.node(cli, args, cwd, { allowFailure: expected !== 0, timeout: 30000 });
    assert.equal(r.error, undefined); assert.equal(r.signal, null);
    if (expected === 0) assert.equal(r.status, 0, `${args.join(" ")}\n${r.stdout}\n${r.stderr}`);
    else assert.notEqual(r.status, 0, `${args.join(" ")} unexpectedly succeeded`);
    return r;
  };
  const inventory = base => {
    const rows = [];
    const walk = dir => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
        const file = path.join(dir, entry.name), rel = path.relative(base, file), stat = fs.lstatSync(file);
        if (entry.isSymbolicLink()) rows.push([rel, "link", fs.readlinkSync(file)]);
        else if (entry.isDirectory()) { rows.push([rel, "directory", stat.mode]); walk(file); }
        else { assert(entry.isFile()); rows.push([rel, stat.mode, hash(fs.readFileSync(file))]); }
      }
    };
    walk(base); return rows;
  };
  const init = name => {
    const base = path.join(root, name); fs.mkdirSync(base);
    invoke(base, ["init", "--graph-only"]);
    const cfg = JSON.parse(fs.readFileSync(path.join(base, ".mdkg/config.json"), "utf8"));
    cfg.workspaces.root.visibility = "public";
    put(base, ".mdkg/config.json", JSON.stringify(cfg));
    invoke(base, ["new", "task", "Portable intent", "--status", "todo", "--json"]);
    return { base, cfg };
  };
  const bundle = (source, profile, name) => {
    const output = path.join(source, ".mdkg/bundles", `${name}.zip`);
    invoke(source, ["bundle", "create", "--profile", profile, "--output", output, "--json"]);
    return { output, entries: new Map(readZipEntries(fs.readFileSync(output)).map(e => [e.name, e.data])) };
  };
  const saveVariant = (base, name, entries, transform) => {
    const copy = new Map(entries), manifest = JSON.parse(copy.get("manifest.json").toString());
    transform(manifest, copy); copy.set("manifest.json", Buffer.from(JSON.stringify(manifest)));
    return put(base, `imports/${name}.zip`, createDeterministicZipFromEntries([...copy].map(([name, data]) => ({ name, data }))));
  };
  const refuseUnchanged = (base, args, diagnostic) => {
    const before = inventory(base), r = invoke(base, args, 1);
    if (diagnostic) assert.match(r.stdout + r.stderr, diagnostic);
    assert.deepEqual(inventory(base), before, `${args.join(" ")} changed the fixture on refusal`);
  };
  const source = init("producer");
  const privateMarker = "SYNTHETIC_PRIVATE_PORTABLE_DB";
  const liveMarker = "SYNTHETIC_LIVE_EXECUTION_STATE";
  for (const file of [source.cfg.db.runtime_path, `${source.cfg.db.runtime_path}-wal`, ".mdkg/db/receipts/working-WAL", ".mdkg/state/selection.json"])
    put(source.base, file, liveMarker);
  for (const file of [source.cfg.db.state_path, ".mdkg/db/receipts/accepted.json"])
    put(source.base, file, privateMarker);
  const exports = {};
  for (const profile of ["public", "private"]) {
    const exported = bundle(source.base, profile, profile); exports[profile] = exported;
    for (const [file, bytes] of exported.entries) {
      assert(!bytes.includes(Buffer.from(liveMarker)), file);
      if (profile === "public") assert(!bytes.includes(Buffer.from(privateMarker)), file);
    }
    const manifest = JSON.parse(exported.entries.get("manifest.json").toString());
    assert.equal(manifest.transport_policy.version, 1);
    assert.equal(manifest.transport_policy.profile, profile);
    assert.equal(manifest.transport_policy.bundle_hash, manifest.bundle_hash);
    assert.equal(exported.entries.has(source.cfg.db.state_path), profile === "private");
    if (profile === "private") assert.equal(exported.entries.get(source.cfg.db.state_path).toString(), privateMarker);
    else assert(manifest.transport_exclusions.some(r => r.reason === "private-db-payload"));
    cases.push(`${profile}: state exclusions and portable contract`);
  }
  const consumer = init("consumer");
  const fresh = put(consumer.base, "imports/fresh.zip", fs.readFileSync(exports.public.output));
  invoke(consumer.base, ["subgraph", "add", "fresh", path.relative(consumer.base, fresh), "--profile", "public", "--json"]);
  invoke(consumer.base, ["show", "fresh:task-1", "--json"]);
  invoke(consumer.base, ["subgraph", "materialize", "fresh", "--target", ".mdkg/subgraphs", "--json"]);
  const view = path.join(consumer.base, ".mdkg/subgraphs/fresh");
  for (const file of [source.cfg.db.runtime_path, source.cfg.db.state_path, ".mdkg/index/global.json", ".mdkg/config.json"])
    assert(!fs.existsSync(path.join(view, file)), file);
  cases.push("fresh public: bounded inspection/materialization without restored authority");
  invoke(consumer.base, ["graph", "import-template", fresh, "--apply", "--json"]);
  cases.push("fresh public: template application");
  refuseUnchanged(consumer.base, ["graph", "clone", fresh, "--target", "refused-clone", "--json"], /config|owning/i);
  cases.push("fresh public: incomplete checkout clone refuses unchanged");
  const historical = saveVariant(consumer.base, "historical", exports.public.entries, m => { delete m.transport_policy; });
  invoke(consumer.base, ["bundle", "show", historical, "--json"]);
  invoke(consumer.base, ["subgraph", "add", "historical", path.relative(consumer.base, historical), "--profile", "public", "--json"]);
  invoke(consumer.base, ["show", "historical:task-1", "--json"]);
  refuseUnchanged(consumer.base, ["subgraph", "materialize", "historical", "--target", ".mdkg/subgraphs", "--gitignore", "--json"], /transport|inspect.only|fresh.*export/i);
  refuseUnchanged(consumer.base, ["graph", "import-template", historical, "--apply", "--json"], /transport|inspect.only|fresh.*export/i);
  cases.push("historical public: inspection retained, both mutation consumers refuse unchanged");
  for (const mutation of ["version", "profile", "hash", "role", "missing-row", "workspace"]) {
    const malformed = saveVariant(consumer.base, `malformed-${mutation}`, exports.public.entries, m => {
      const p = m.transport_policy;
      if (mutation === "version") p.version = 999;
      if (mutation === "profile") p.profile = "private";
      if (mutation === "hash") p.bundle_hash = `sha256:${"0".repeat(64)}`;
      if (mutation === "role") p.files.find(f => f.role === "graph").role = "live-db";
      if (mutation === "missing-row") p.files.pop();
      if (mutation === "workspace") p.workspaces[0].root = "unselected";
    });
    for (const args of [["bundle", "show", malformed, "--json"], ["subgraph", "add", "unsafe", path.relative(consumer.base, malformed), "--profile", "public", "--json"],
      ["graph", "import-template", malformed, "--apply", "--json"]]) refuseUnchanged(consumer.base, args, /portable transport policy/i);
    cases.push(`malformed ${mutation}: all three entrypoints refuse unchanged`);
  }
  for (const mode of ["clone", "fork"]) {
    const target = path.join(source.base, mode);
    invoke(source.base, ["graph", mode, exports.private.output, "--target", mode, "--json"]);
    assert.equal(fs.readFileSync(path.join(target, source.cfg.db.state_path), "utf8"), privateMarker);
    for (const file of [source.cfg.db.runtime_path, `${source.cfg.db.runtime_path}-wal`, ".mdkg/state/selection.json"])
      assert(!fs.existsSync(path.join(target, file)), file);
    cases.push(`private ${mode}: checkpoint exact, live state absent`);
  }
  const rehash = m => {
    const hashRows = rows => `sha256:${hash(Buffer.from(`${JSON.stringify(rows.map(r => ({ path: r.path, kind: r.kind, workspace: r.workspace, visibility: r.visibility, size: r.size, sha256: r.sha256 })), null, 2)}\n`))}`;
    m.file_count = m.files.length; m.source_tree_hash = hashRows(m.files.filter(r => r.kind !== "generated_index"));
    m.bundle_hash = hashRows(m.files); m.transport_policy.bundle_hash = m.bundle_hash;
  };
  const configless = saveVariant(consumer.base, "configless-private", exports.private.entries, (m, entries) => {
    entries.delete(".mdkg/config.json"); m.files = m.files.filter(f => f.path !== ".mdkg/config.json");
    m.transport_policy.files = m.transport_policy.files.filter(f => f.path !== ".mdkg/config.json"); rehash(m);
  });
  invoke(consumer.base, ["subgraph", "add", "configless", path.relative(consumer.base, configless), "--json"]);
  invoke(consumer.base, ["subgraph", "materialize", "configless", "--target", ".mdkg/subgraphs", "--json"]);
  const configlessTarget = path.join(consumer.base, ".mdkg/subgraphs/configless");
  assert.equal(fs.readFileSync(path.join(configlessTarget, source.cfg.db.state_path), "utf8"), privateMarker);
  assert(!fs.existsSync(path.join(configlessTarget, source.cfg.db.runtime_path)));
  assert(!fs.existsSync(path.join(configlessTarget, ".mdkg/config.json")));
  cases.push("config-less private: conventional checkpoints remain portable without checkout authority");
  const configlessEntries = new Map(readZipEntries(fs.readFileSync(configless)).map(e => [e.name, e.data]));
  const forgedRuntime = saveVariant(consumer.base, "configless-runtime", configlessEntries, (m, entries) => {
    const file = ".mdkg/db/runtime/project.sqlite", bytes = Buffer.from(liveMarker); entries.set(file, bytes);
    m.files.push({ path: file, kind: "authored", workspace: "root", visibility: "private", size: bytes.length, sha256: `sha256:${hash(bytes)}` });
    m.transport_policy.files.push({ path: file, role: "private-db" }); rehash(m);
  });
  for (const args of [["bundle", "verify", forgedRuntime, "--json"], ["subgraph", "add", "unsafe", path.relative(consumer.base, forgedRuntime), "--json"],
    ["graph", "import-template", forgedRuntime, "--apply", "--json"], ["graph", "clone", forgedRuntime, "--target", "unsafe", "--json"]])
    refuseUnchanged(consumer.base, args, /contradicts role/);
  fs.copyFileSync(forgedRuntime, configless);
  refuseUnchanged(consumer.base, ["subgraph", "materialize", "configless", "--target", ".mdkg/subgraphs", "--clean", "--json"], /contradicts role/);
  cases.push("config-less private: conventional runtime forgery refuses across five consumers without writes");
  const explicit = init("runtime-checkpoint"); explicit.cfg.db.state_path = ".mdkg/db/runtime/checkpoint.sqlite";
  put(explicit.base, ".mdkg/config.json", JSON.stringify(explicit.cfg));
  put(explicit.base, explicit.cfg.db.state_path, privateMarker); put(explicit.base, explicit.cfg.db.runtime_path, liveMarker);
  const explicitBundle = bundle(explicit.base, "private", "explicit");
  invoke(explicit.base, ["subgraph", "add", "explicit", path.relative(explicit.base, explicitBundle.output), "--json"]);
  invoke(explicit.base, ["subgraph", "materialize", "explicit", "--target", ".mdkg/subgraphs", "--json"]);
  const explicitTarget = path.join(explicit.base, ".mdkg/subgraphs/explicit");
  assert.equal(fs.readFileSync(path.join(explicitTarget, explicit.cfg.db.state_path), "utf8"), privateMarker);
  assert(!fs.existsSync(path.join(explicitTarget, explicit.cfg.db.runtime_path)));
  cases.push("private: owning config preserves an explicit checkpoint within the conventional runtime directory");
  const nested = init("nested-producer");
  nested.cfg.workspaces.child = { path: ".mdkg/nested", mdkg_dir: "memory", enabled: true, visibility: "public" };
  put(nested.base, ".mdkg/config.json", JSON.stringify(nested.cfg));
  const child = structuredClone(nested.cfg);
  child.workspaces = { root: { path: ".", mdkg_dir: ".mdkg", enabled: true, visibility: "public" },
    deep: { path: "memory/deep", mdkg_dir: "graph", enabled: true, visibility: "private" } };
  put(nested.base, ".mdkg/nested/memory/config.json", JSON.stringify(child));
  const safeNested = bundle(nested.base, "private", "before-nested-payload");
  const live = ".mdkg/nested/memory/deep/graph/storage/live.db";
  put(nested.base, live, liveMarker);
  for (const profile of ["public", "private"]) {
    refuseUnchanged(nested.base, ["bundle", "create", "--profile", profile, "--output", ".mdkg/bundles/refused.zip", "--json"], /nested workspace.*not registered/);
    cases.push(`${profile}: unregistered child-declared payload refuses before export writes`);
  }
  const forged = saveVariant(consumer.base, "forged-nested", safeNested.entries, (m, entries) => {
    const bytes = Buffer.from(liveMarker); entries.set(live, bytes);
    m.files.push({ path: live, kind: "authored", workspace: "child", visibility: "private", size: bytes.length, sha256: `sha256:${hash(bytes)}` });
    m.transport_policy.files.push({ path: live, role: "graph" });
    const hashRows = rows => `sha256:${hash(Buffer.from(`${JSON.stringify(rows.map(r => ({ path: r.path, kind: r.kind, workspace: r.workspace, visibility: r.visibility, size: r.size, sha256: r.sha256 })), null, 2)}\n`))}`;
    m.file_count = m.files.length; m.source_tree_hash = hashRows(m.files.filter(r => r.kind !== "generated_index"));
    m.bundle_hash = hashRows(m.files); m.transport_policy.bundle_hash = m.bundle_hash;
  });
  for (const args of [["bundle", "verify", forged, "--json"], ["subgraph", "add", "forged", path.relative(consumer.base, forged), "--json"],
    ["graph", "import-template", forged, "--apply", "--json"], ["graph", "clone", forged, "--target", "forged-target", "--json"]])
    refuseUnchanged(consumer.base, args, /nested workspace.*not registered/);
  cases.push("self-consistent nested live-payload forgery: four consumers refuse unchanged");
  nested.cfg.workspaces.deep = { path: ".mdkg/nested/memory/deep", mdkg_dir: "graph", enabled: true, visibility: "private" };
  put(nested.base, ".mdkg/config.json", JSON.stringify(nested.cfg));
  const deep = structuredClone(child); deep.workspaces = { root: { path: ".", mdkg_dir: ".mdkg", enabled: true, visibility: "private" } };
  deep.db = { ...deep.db, root_path: "graph/storage", schema_path: "graph/storage/schema", migrations_path: "graph/storage/schema/migrations",
    runtime_path: "graph/storage/live.db", state_path: "graph/storage/checkpoint.db", receipts_path: "graph/storage/receipts" };
  put(nested.base, ".mdkg/nested/memory/deep/graph/config.json", JSON.stringify(deep));
  const checkpoint = ".mdkg/nested/memory/deep/graph/storage/checkpoint.db"; put(nested.base, checkpoint, privateMarker);
  for (const profile of ["public", "private"]) {
    const accepted = bundle(nested.base, profile, `registered-${profile}`);
    assert(!accepted.entries.has(live)); assert.equal(accepted.entries.has(checkpoint), profile === "private");
    cases.push(`${profile}: explicitly registered nested ownership preserves portable checkpoint policy`);
  }
  return { node: invoke(consumer.base, ["--version"]).stdout.trim(), runtime: process.version,
    platform: `${process.platform}-${process.arch}`, cases: cases.length, case_names: cases,
    cli_sha256: hash(fs.readFileSync(cli)), final_qualification: false };
}

module.exports = { runTransportStateFixtures };
