import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import { spawnSync } from "node:child_process";
import { makeTempDir, writeFile } from "../helpers/fs";
import { writeRootConfig } from "../helpers/config";
const { buildBundle, sha256Buffer, verifyBundle } = require("../../commands/bundle");
const { readZipEntries, createDeterministicZipFromEntries } = require("../../util/zip");
const privateMarker = "SYNTHETIC_PRIVATE_DATABASE_PAYLOAD";

function saveBundle(root: string, result: any, name = "fresh.mdkg.zip") {
  const file = path.join(root, name);
  result.entries.set("manifest.json", Buffer.from(JSON.stringify(result.manifest)));
  fs.writeFileSync(file, createDeterministicZipFromEntries([...result.entries].map(([name, data]: any) => ({ name, data }))));
  return file;
}

function rehashBundle(result: any) {
  const manifest = result.manifest;
  const hashRows = (rows: any[]) => sha256Buffer(Buffer.from(`${JSON.stringify(rows.map((row) => ({ path: row.path, kind: row.kind,
    workspace: row.workspace, visibility: row.visibility, size: row.size, sha256: row.sha256 })), null, 2)}\n`));
  manifest.file_count = manifest.files.length;
  manifest.source_tree_hash = hashRows(manifest.files.filter((file: any) => file.kind !== "generated_index"));
  manifest.bundle_hash = hashRows(manifest.files);
  if (manifest.transport_policy) manifest.transport_policy.bundle_hash = manifest.bundle_hash;
}

function omitOwningConfig(result: any) {
  result.entries.delete(".mdkg/config.json");
  result.manifest.files = result.manifest.files.filter((file: any) => file.path !== ".mdkg/config.json");
  result.manifest.transport_policy.files = result.manifest.transport_policy.files.filter((file: any) => file.path !== ".mdkg/config.json");
  rehashBundle(result);
}

function fixture(t: { after(fn: () => void): void }) {
  const root = makeTempDir("mdkg-bundle-state-");
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  writeRootConfig(root);
  const configPath = path.join(root, ".mdkg/config.json");
  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  config.workspaces.root.visibility = "public";
  const save = () => writeFile(configPath, JSON.stringify(config)); save();
  const put = (file: string, value = privateMarker) => writeFile(path.join(root, file), value);
  put(".mdkg/work/task-1-public.md", "---\nid: task-1\ntype: task\ntitle: Public intent\nstatus: backlog\npriority: 1\ncreated: 2026-09-08\nupdated: 2026-09-08\n---\nPublic project memory\n");
  const bundle = (profile = "public") => {
    const built = buildBundle({ root, profile });
    return { ...built, entries: new Map<string, Buffer>(readZipEntries(built.zip).map((entry: any) => [entry.name, entry.data])) };
  };
  return { root, config, save, put, bundle };
}

for (const profile of ["public", "private"]) {
  test(`${profile} bundle excludes local authority and live database files before reading them`, (t) => {
    const f = fixture(t);
    const excluded = [".mdkg/db/runtime/project.sqlite", ".mdkg/db/runtime/project.sqlite-wal",
      ".mdkg/db/runtime/project.sqlite-shm", ".mdkg/db/state/project.sqlite-journal",
      ".mdkg/db/receipts/working.tmp", ".mdkg/state/selected-goal.json",
      ".mdkg/state/upgrade/transaction.json", ".mdkg/state/identity-transactions/journal.json"];
    excluded.forEach((file) => f.put(file));
    const original = fs.readFileSync;
    fs.readFileSync = ((file: any, ...args: any[]) => {
      assert.ok(!excluded.some((relative) => file === path.join(f.root, relative)), `read excluded payload ${file}`);
      return (original as any)(file, ...args);
    }) as typeof fs.readFileSync;
    let result: ReturnType<typeof f.bundle>;
    try { result = f.bundle(profile); } finally { fs.readFileSync = original; }
    for (const file of excluded) assert.equal(result.entries.has(file), false, file);
    for (const [file, bytes] of result.entries) assert.equal(bytes.includes(Buffer.from(privateMarker)), false, file);
  });
}

test("public DB snapshot and receipt payloads are omitted with explicit exclusion evidence", (t) => {
  const f = fixture(t);
  for (const file of [".mdkg/db/state/project.sqlite", ".mdkg/db/state/project.manifest.json", ".mdkg/db/receipts/work.json"]) f.put(file);
  f.put(".mdkg/db/schema/project.sql", "CREATE TABLE approved (id TEXT);");
  f.put(".mdkg/identity/reconciliations/accepted.json", '{"kind":"semantic-evidence"}');
  const result = f.bundle();
  for (const [file, bytes] of result.entries) assert.equal(bytes.includes(Buffer.from(privateMarker)), false, file);
  assert.ok(result.entries.has(".mdkg/db/schema/project.sql"));
  assert.ok(result.entries.has(".mdkg/identity/reconciliations/accepted.json"));
  assert.ok(result.manifest.transport_exclusions?.some((entry: any) => entry.reason === "private-db-payload"));
});

test("private portable DB snapshots and receipts remain byte exact", (t) => {
  const f = fixture(t), files = [".mdkg/db/state/project.sqlite", ".mdkg/db/state/project.manifest.json", ".mdkg/db/receipts/work.json"];
  files.forEach((file) => f.put(file));
  const result = f.bundle("private");
  for (const file of files) assert.equal(result.entries.get(file)?.toString(), privateMarker);
});

for (const enabled of [true, false]) {
  test(`configured live path excludes exact file and sidecars without dropping its portable sibling; enabled=${enabled}`, (t) => {
    const f = fixture(t);
    f.config.db.enabled = enabled;
    f.config.db.root_path = ".mdkg/storage";
    f.config.db.schema_path = ".mdkg/storage/schema";
    f.config.db.migrations_path = ".mdkg/storage/schema/migrations";
    f.config.db.runtime_path = ".mdkg/storage/shared/live.db";
    f.config.db.state_path = ".mdkg/storage/shared/checkpoint.db";
    f.config.db.receipts_path = ".mdkg/storage/receipts";
    f.save();
    const live = [f.config.db.runtime_path, f.config.db.runtime_path + "-wal", f.config.db.runtime_path + ".lock", ".mdkg/db/runtime/old.sqlite"];
    live.forEach((file) => f.put(file));
    f.put(f.config.db.state_path, "portable checkpoint");
    f.put(".mdkg/storage/shared/checkpoint.manifest.json", "portable manifest");
    f.put(".mdkg/storage/schema/project.sql", "portable schema");
    const privateBundle = f.bundle("private");
    live.forEach((file) => assert.equal(privateBundle.entries.has(file), false, file));
    assert.equal(privateBundle.entries.get(f.config.db.state_path)?.toString(), "portable checkpoint");
    const publicBundle = f.bundle();
    assert.equal(publicBundle.entries.has(f.config.db.state_path), false);
    assert.equal(publicBundle.entries.has(".mdkg/storage/shared/checkpoint.manifest.json"), false);
    assert.ok(publicBundle.entries.has(".mdkg/storage/schema/project.sql"));
  });
}

test("nested workspace custom graph roots do not borrow local state into the parent", (t) => {
  const f = fixture(t);
  f.config.workspaces.child = { path: ".mdkg/nested", mdkg_dir: "memory", enabled: true, visibility: "public" }; f.save();
  for (const local of ["db/runtime/project.sqlite", "state/selected-goal.json", "db/state/project.sqlite", "db/receipts/work.json"]) f.put(`.mdkg/nested/memory/${local}`);
  const result = f.bundle();
  for (const [file, bytes] of result.entries) assert.equal(bytes.includes(Buffer.from(privateMarker)), false, file);
});

test("runtime configuration overlapping graph discovery fails before node payload reads", (t) => {
  const f = fixture(t);
  f.config.db.root_path = ".mdkg";
  f.config.db.schema_path = ".mdkg/db/schema";
  f.config.db.migrations_path = ".mdkg/db/schema/migrations";
  f.config.db.runtime_path = ".mdkg/work/task-1-public.md";
  f.save();
  assert.throws(() => f.bundle(), /transport.*overlap|overlap.*transport/i);
});

test("normalized configured paths and conventional remnants stay local after DB reconfiguration", (t) => {
  const f = fixture(t);
  f.config.db.root_path = "./.mdkg/storage";
  f.config.db.runtime_path = "./.mdkg/storage/shared/live.sqlite";
  f.config.db.state_path = "./.mdkg/storage/shared/checkpoint.sqlite";
  f.config.db.schema_path = "./.mdkg/storage/schema";
  f.config.db.migrations_path = "./.mdkg/storage/schema/migrations";
  f.config.db.receipts_path = "./.mdkg/storage/receipts"; f.save();
  for (const file of [".mdkg/storage/shared/live.sqlite", ".mdkg/storage/runtime/old.sqlite"]) f.put(file);
  f.put(".mdkg/storage/shared/checkpoint.sqlite", "portable");
  for (const profile of ["private", "public"]) {
    for (const [file, bytes] of f.bundle(profile).entries) assert.equal(bytes.includes(Buffer.from(privateMarker)), false, file);
  }
});

test("an explicit portable checkpoint may share the conventional runtime directory", (t) => {
  const f = fixture(t);
  f.config.db.state_path = ".mdkg/db/runtime/checkpoint.sqlite"; f.save();
  f.put(f.config.db.runtime_path);
  f.put(f.config.db.state_path, "portable checkpoint");
  f.put(".mdkg/db/runtime/checkpoint.manifest.json", "portable manifest");
  const result = f.bundle("private");
  assert.equal(result.entries.get(f.config.db.state_path)?.toString(), "portable checkpoint");
  assert.equal(result.entries.get(".mdkg/db/runtime/checkpoint.manifest.json")?.toString(), "portable manifest");
  assert.equal(result.entries.has(f.config.db.runtime_path), false);
  const publicResult = f.bundle();
  assert.equal(publicResult.entries.has(f.config.db.state_path), false);
});

for (const prefix of [".mdkg", ".mdkg/examples/unregistered/.mdkg"]) {
  test(`config-less private contracts cannot label conventional runtime as portable at ${prefix}`, (t) => {
    const f = fixture(t), result = f.bundle("private"), file = `${prefix}/db/runtime/project.sqlite`, data = Buffer.from(privateMarker);
    omitOwningConfig(result);
    result.entries.set(file, data);
    result.manifest.files.push({ path: file, kind: "authored", workspace: "root", visibility: "private", size: data.length, sha256: sha256Buffer(data) });
    result.manifest.transport_policy.files.push({ path: file, role: "private-db" });
    rehashBundle(result);
    const bundle = saveBundle(f.root, result);
    assert.match(verifyBundle(f.root, bundle).errors.join(";"), /contradicts role/);
    const added = cli(f.root, ["subgraph", "add", "forged", path.basename(bundle), "--json"]);
    assert.notEqual(added.status, 0, added.stdout + added.stderr);
    assert.equal(fs.existsSync(path.join(f.root, ".mdkg/subgraphs/forged")), false);
  });
}

test("config-less private contracts preserve conventional checkpoints without restoring checkout authority", (t) => {
  const f = fixture(t); f.put(f.config.db.state_path, "portable checkpoint");
  const result = f.bundle("private"); omitOwningConfig(result);
  const bundle = saveBundle(f.root, result);
  assert.deepEqual(verifyBundle(f.root, bundle).errors, []);
  const added = cli(f.root, ["subgraph", "add", "portable", path.basename(bundle), "--json"]);
  assert.equal(added.status, 0, added.stdout + added.stderr);
  const materialized = cli(f.root, ["subgraph", "materialize", "portable", "--target", ".mdkg/subgraphs", "--json"]);
  assert.equal(materialized.status, 0, materialized.stdout + materialized.stderr);
  const target = path.join(f.root, ".mdkg/subgraphs/portable");
  assert.equal(fs.readFileSync(path.join(target, f.config.db.state_path), "utf8"), "portable checkpoint");
  assert.equal(fs.existsSync(path.join(target, f.config.db.runtime_path)), false);
  assert.equal(fs.existsSync(path.join(target, ".mdkg/config.json")), false);
});

test("an explicit private checkpoint under runtime remains materializable with its owning config", (t) => {
  const f = fixture(t); f.config.db.state_path = ".mdkg/db/runtime/checkpoint.sqlite"; f.save();
  f.put(f.config.db.state_path, "portable checkpoint"); f.put(f.config.db.runtime_path);
  const bundle = saveBundle(f.root, f.bundle("private"));
  const added = cli(f.root, ["subgraph", "add", "portable", path.basename(bundle), "--json"]);
  assert.equal(added.status, 0, added.stdout + added.stderr);
  const materialized = cli(f.root, ["subgraph", "materialize", "portable", "--target", ".mdkg/subgraphs", "--json"]);
  assert.equal(materialized.status, 0, materialized.stdout + materialized.stderr);
  const target = path.join(f.root, ".mdkg/subgraphs/portable");
  assert.equal(fs.readFileSync(path.join(target, f.config.db.state_path), "utf8"), "portable checkpoint");
  assert.equal(fs.existsSync(path.join(target, f.config.db.runtime_path)), false);
});

test("state and live runtime cannot claim the same file", (t) => {
  const f = fixture(t);
  f.config.db.state_path = f.config.db.runtime_path; f.save();
  assert.throws(() => f.bundle("private"), /overlap|ambiguous/i);
});

test("configured state cannot masquerade as identity or configuration authority", (t) => {
  const f = fixture(t);
  f.config.db.root_path = ".mdkg";
  for (const file of [".mdkg/graph.json", ".mdkg/config.json", ".mdkg/identity/receipts.json"]) {
    f.config.db.runtime_path = file; f.save();
    assert.throws(() => f.bundle("private"), /overlap|ambiguous/i, file);
  }
});

test("nested graph own DB configuration is honored without publishing its configuration", (t) => {
  const f = fixture(t);
  f.config.workspaces.child = { path: ".mdkg/nested", mdkg_dir: "memory", enabled: true, visibility: "public" }; f.save();
  const child = JSON.parse(JSON.stringify(f.config));
  child.workspaces = { root: { path: ".", mdkg_dir: ".mdkg", enabled: true, visibility: "public" } };
  child.db = { ...child.db, root_path: "memory/storage", runtime_path: "memory/storage/live.db",
    state_path: "memory/storage/checkpoint.db", receipts_path: "memory/storage/receipts",
    schema_path: "memory/storage/schema", migrations_path: "memory/storage/schema/migrations" };
  f.put(".mdkg/nested/memory/config.json", JSON.stringify(child));
  f.put(".mdkg/nested/memory/storage/live.db");
  f.put(".mdkg/nested/memory/storage/checkpoint.db", "portable checkpoint");
  for (const profile of ["public", "private"]) {
    const result = f.bundle(profile);
    for (const [file, bytes] of result.entries) assert.equal(bytes.includes(Buffer.from(privateMarker)), false, file);
    assert.equal(result.entries.has(".mdkg/nested/memory/storage/checkpoint.db"), profile === "private");
    assert.equal(result.entries.has(".mdkg/nested/memory/config.json"), profile === "private");
  }
});

function historicalBundle(f: ReturnType<typeof fixture>, profile = "private") {
  const result = f.bundle(profile);
  // Reconstruct the historical producer's manifest correctly, not a corrupt
  // archive that an unrelated integrity gate would already reject.
  const manifest = result.manifest;
  delete manifest.transport_exclusions;
  delete manifest.transport_policy;
  const entries = result.entries;
  for (const file of [f.config.db.runtime_path, f.config.db.runtime_path + "-wal", ".mdkg/state/selected-goal.json"]) {
    const data = Buffer.from(privateMarker);
    entries.set(file, data);
    manifest.files.push({ path: file, kind: "authored", workspace: "root", visibility: "public", size: data.length, sha256: sha256Buffer(data) });
  }
  const hashFiles = (files: any[]) => sha256Buffer(Buffer.from(`${JSON.stringify(files.map((file) => ({
    path: file.path, kind: file.kind, workspace: file.workspace, visibility: file.visibility, size: file.size, sha256: file.sha256,
  })), null, 2)}\n`));
  manifest.file_count = manifest.files.length;
  manifest.source_tree_hash = hashFiles(manifest.files.filter((file: any) => file.kind !== "generated_index"));
  manifest.bundle_hash = hashFiles(manifest.files);
  entries.set("manifest.json", Buffer.from(JSON.stringify(manifest)));
  const bundlePath = path.join(f.root, "historical.mdkg.zip");
  fs.writeFileSync(bundlePath, createDeterministicZipFromEntries([...entries].map(([name, data]) => ({ name, data }))));
  assert.equal(verifyBundle(f.root, bundlePath).errors.some((error: string) => /mismatch|unexpected|missing/.test(error)), false);
  return bundlePath;
}

function cli(root: string, args: string[]) {
  return spawnSync(process.execPath, [path.resolve(__dirname, "../../cli.js"), ...args], { cwd: root, encoding: "utf8" });
}

test("bundle verification binds its ZIP receipt to the exact parsed bytes", (t) => {
  const f = fixture(t), first = f.bundle(), file = saveBundle(f.root, first);
  const expected = sha256Buffer(fs.readFileSync(file));
  const original = fs.readFileSync; let reads = 0;
  fs.readFileSync = ((target: any, ...args: any[]) => {
    const bytes = (original as any)(target, ...args);
    if (target === file && ++reads === 1) fs.writeFileSync(file, Buffer.from("changed after the snapshot read"));
    return bytes;
  }) as typeof fs.readFileSync;
  try {
    const receipt = verifyBundle(f.root, file);
    assert.equal(receipt.zip_sha256, expected);
    assert.equal(reads, 1);
    assert.deepEqual(receipt.errors, []);
  } finally { fs.readFileSync = original; }
});

test("template application refuses source movement between preview and owned apply", (t) => {
  const f = fixture(t), first = saveBundle(f.root, f.bundle(), "first.zip");
  f.put(".mdkg/work/task-1-public.md", fs.readFileSync(path.join(f.root, ".mdkg/work/task-1-public.md"), "utf8").replace("Public project memory", "Different source snapshot"));
  const replacement = saveBundle(f.root, f.bundle(), "replacement.zip");
  f.put("swap-source.cjs", `const fs = require("node:fs");
const bundle = require(${JSON.stringify(path.resolve(__dirname, "../../commands/bundle.js"))});
const original = bundle.parseBundle; let swapped = false;
bundle.parseBundle = (file) => { const result = original(file);
  if (!swapped && file === ${JSON.stringify(first)}) { fs.copyFileSync(${JSON.stringify(replacement)}, file); swapped = true; }
  return result;
};\n`);
  const result = spawnSync(process.execPath, ["--require", path.join(f.root, "swap-source.cjs"), path.resolve(__dirname, "../../cli.js"),
    "graph", "import-template", first, "--apply", "--json"], { cwd: f.root, encoding: "utf8" });
  assert.notEqual(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout + result.stderr, /source.*changed|snapshot.*changed/i);
  assert.equal(fs.readdirSync(path.join(f.root, ".mdkg/work")).length, 1);
});

test("fresh public portable-state contract permits inspection materialization and template import without restoring authority", (t) => {
  const f = fixture(t);
  f.put(f.config.db.runtime_path);
  f.put(f.config.db.state_path);
  const result = f.bundle();
  assert.equal(result.manifest.transport_policy?.version, 1);
  assert.equal(result.manifest.transport_policy?.profile, "public");
  assert.equal(result.manifest.transport_policy?.bundle_hash, result.manifest.bundle_hash);
  const policy = JSON.stringify(result.manifest.transport_policy);
  assert.equal(policy.includes(f.config.db.runtime_path), false);
  assert.equal(policy.includes(f.config.db.state_path), false);
  const bundle = saveBundle(f.root, result);
  const added = cli(f.root, ["subgraph", "add", "fresh", path.basename(bundle), "--profile", "public", "--json"]);
  assert.equal(added.status, 0, added.stdout + added.stderr);
  const materialized = cli(f.root, ["subgraph", "materialize", "fresh", "--target", ".mdkg/subgraphs", "--json"]);
  assert.equal(materialized.status, 0, materialized.stdout + materialized.stderr);
  const target = path.join(f.root, ".mdkg/subgraphs/fresh");
  assert.equal(fs.readFileSync(path.join(target, ".mdkg/work/task-1-public.md"), "utf8"), result.entries.get(".mdkg/work/task-1-public.md")?.toString());
  for (const file of [".mdkg/config.json", ".mdkg/index/global.json", f.config.db.runtime_path, f.config.db.state_path]) assert.equal(fs.existsSync(path.join(target, file)), false, file);
  const imported = cli(f.root, ["graph", "import-template", bundle, "--apply", "--json"]);
  assert.equal(imported.status, 0, imported.stdout + imported.stderr);
  assert.equal(fs.readdirSync(path.join(f.root, ".mdkg/work")).length, 2);
  const cloned = cli(f.root, ["graph", "clone", bundle, "--target", "not-a-checkout", "--json"]);
  assert.notEqual(cloned.status, 0, "portable inspection contract is not a complete owning checkout config");
  assert.equal(fs.existsSync(path.join(f.root, "not-a-checkout")), false);
});

for (const mutation of ["version", "profile", "hash", "role", "missing-row", "workspace"]) {
  test(`both manifest validators refuse a malformed portable-state contract: ${mutation}`, (t) => {
    const f = fixture(t), result = f.bundle();
    const policy = result.manifest.transport_policy ?? {
      version: 1, profile: "public", bundle_hash: result.manifest.bundle_hash,
      workspaces: [{ alias: "root", root: ".mdkg" }],
      files: result.manifest.files.map((file: any) => ({ path: file.path, role: file.kind === "generated_index" ? "projection" : "graph" })),
    };
    if (mutation === "version") policy.version = 99;
    if (mutation === "profile") policy.profile = "private";
    if (mutation === "hash") policy.bundle_hash = `sha256:${"0".repeat(64)}`;
    if (mutation === "role") policy.files.find((file: any) => file.role === "graph").role = "live-db";
    if (mutation === "missing-row") policy.files.pop();
    if (mutation === "workspace") policy.workspaces[0].root = "unselected";
    result.manifest.transport_policy = policy;
    const bundle = saveBundle(f.root, result);
    assert.notEqual(cli(f.root, ["bundle", "show", bundle, "--json"]).status, 0);
    assert.notEqual(cli(f.root, ["subgraph", "add", "unsafe", path.basename(bundle), "--profile", "public", "--json"]).status, 0);
    assert.notEqual(cli(f.root, ["graph", "import-template", bundle, "--apply", "--json"]).status, 0);
    assert.equal(fs.readdirSync(path.join(f.root, ".mdkg/work")).length, 1);
  });
}

for (const mode of ["clone", "fork"]) {
  test(`legacy ZIP ${mode} excludes configured live state before writing a new checkout`, (t) => {
    const f = fixture(t);
    f.config.db.runtime_path = ".mdkg/db/shared/live.db";
    f.config.db.state_path = ".mdkg/db/shared/checkpoint.db"; f.save();
    f.put(f.config.db.state_path, "portable checkpoint");
    const bundle = historicalBundle(f);
    const result = cli(f.root, ["graph", mode, bundle, "--target", "target", "--json"]);
    assert.equal(result.status, 0, result.stdout + result.stderr);
    for (const file of [f.config.db.runtime_path, f.config.db.runtime_path + "-wal", ".mdkg/state/selected-goal.json"]) {
      assert.equal(fs.existsSync(path.join(f.root, "target", file)), false, file);
    }
    assert.equal(fs.readFileSync(path.join(f.root, "target", f.config.db.state_path), "utf8"), "portable checkpoint");
  });
}

test("legacy private bundle materialization does not restore live state", (t) => {
  const f = fixture(t);
  f.config.db.runtime_path = ".mdkg/db/shared/live.db"; f.save();
  const bundle = historicalBundle(f);
  const added = cli(f.root, ["subgraph", "add", "historical", path.relative(f.root, bundle), "--json"]);
  assert.equal(added.status, 0, added.stdout + added.stderr);
  const result = cli(f.root, ["subgraph", "materialize", "historical", "--target", ".mdkg/subgraphs", "--json"]);
  assert.equal(result.status, 0, result.stdout + result.stderr);
  for (const file of [f.config.db.runtime_path, ".mdkg/state/selected-goal.json"]) {
    assert.equal(fs.existsSync(path.join(f.root, ".mdkg/subgraphs/historical", file)), false, file);
  }
});

test("graph transport rejects a changed owning policy before creating the target", (t) => {
  const f = fixture(t);
  f.config.db.runtime_path = ".mdkg/db/shared/live.db"; f.save();
  const bundle = historicalBundle(f);
  const entries = readZipEntries(fs.readFileSync(bundle));
  const configEntry = entries.find((entry: any) => entry.name === ".mdkg/config.json");
  const changed = JSON.parse(configEntry.data.toString());
  changed.db.runtime_path = ".mdkg/db/alternate/live.db";
  configEntry.data = Buffer.from(JSON.stringify(changed));
  fs.writeFileSync(bundle, createDeterministicZipFromEntries(entries));
  const result = cli(f.root, ["graph", "clone", bundle, "--target", "target", "--json"]);
  assert.notEqual(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout + result.stderr, /hash mismatch|size mismatch/);
  assert.equal(fs.existsSync(path.join(f.root, "target")), false);
});

test("public export omits conventional snapshot and receipt remnants under a custom DB root", (t) => {
  const f = fixture(t);
  f.config.db = { ...f.config.db, root_path: ".mdkg/storage", runtime_path: ".mdkg/storage/live.db",
    state_path: ".mdkg/storage/checkpoint.db", receipts_path: ".mdkg/storage/current-receipts",
    schema_path: ".mdkg/storage/schema", migrations_path: ".mdkg/storage/schema/migrations" }; f.save();
  const remnants = [".mdkg/storage/state/older.sqlite", ".mdkg/storage/receipts/older.json"];
  remnants.forEach((file) => f.put(file));
  const publicBundle = f.bundle();
  for (const file of remnants) assert.equal(publicBundle.entries.has(file), false, file);
  const privateBundle = f.bundle("private");
  for (const file of remnants) assert.equal(privateBundle.entries.get(file)?.toString(), privateMarker);
});

for (const [profile, childPath] of [
  ["public", ".mdkg/state/child"], ["private", ".mdkg/state/child"],
  ["public", ".mdkg/db/receipts/child"],
]) {
  test(`${profile} transport refuses authored child discovery within excluded ${childPath}`, (t) => {
    const f = fixture(t);
    f.config.workspaces.child = { path: childPath, mdkg_dir: ".mdkg", enabled: true, visibility: "public" }; f.save();
    f.put(`${childPath}/.mdkg/work/task-1-private.md`, `---\nid: task-1\ntype: task\ntitle: ${privateMarker}\nstatus: todo\npriority: 1\ncreated: 2026-09-15\nupdated: 2026-09-15\n---\n`);
    f.put(`${childPath}/.mdkg/skills/example/SKILL.md`, `---\nname: example\ndescription: ${privateMarker}\n---\nProcedure\n`);
    assert.throws(() => f.bundle(profile), /transport.*(?:overlap|ambiguous)|overlap.*transport/i);
  });
}

for (const profile of ["public", "private"]) {
  test(`${profile} transport excludes custom-root and relocated derived state`, (t) => {
    const f = fixture(t);
    f.config.index.global_index_path = ".mdkg/cache/global.json";
    f.config.index.sqlite_path = ".mdkg/cache/graph.sqlite";
    f.config.capabilities.cache_path = ".mdkg/cache/capabilities.json";
    f.config.bundles.output_dir = ".mdkg/export-cache";
    f.config.workspaces.child = { path: ".mdkg/nested", mdkg_dir: "memory", enabled: true, visibility: "public" }; f.save();
    const excluded = [f.config.index.global_index_path, f.config.index.sqlite_path,
      `${f.config.index.sqlite_path}-wal`, f.config.capabilities.cache_path,
      ".mdkg/export-cache/previous.zip", ".mdkg/nested/memory/index/write.lock/owner.json",
      ".mdkg/nested/memory/pack/previous.md", ".mdkg/nested/memory/bundles/previous.zip",
      ".mdkg/nested/memory/subgraphs/private.json", ".mdkg/nested/memory/archive/example/source/private.txt"];
    excluded.forEach((file) => f.put(file));
    const result = f.bundle(profile);
    for (const [file, bytes] of result.entries) assert.equal(bytes.includes(Buffer.from(privateMarker)), false, file);
    excluded.forEach((file) => assert.equal(result.entries.has(file), false, file));
    assert.ok(result.entries.has(".mdkg/index/global.json"), "fresh portable projection retained");
    assert.ok(result.entries.has(".mdkg/work/task-1-public.md"), "authored intent retained");
  });
}

test("transport rejects configured state spellings that alias different filesystem entries", (t) => {
  const f = fixture(t);
  f.config.db.runtime_path = ".mdkg/db/shared/live.db"; f.save();
  f.put(".mdkg/db/shared/LIVE.db");
  if (!fs.existsSync(path.join(f.root, f.config.db.runtime_path))) {
    t.skip("case-sensitive filesystem; platform alias case is not applicable"); return;
  }
  assert.throws(() => f.bundle(), /spelling|alias|transport/i);
});

test("transport rejects literal POSIX backslashes before ZIP normalization", (t) => {
  const f = fixture(t);
  f.put(".mdkg/db/receipts\\private.json");
  assert.throws(() => f.bundle("private"), /spelling|backslash|transport|portable/i);
});

test("private configured receipts remain portable beside conventional runtime files", (t) => {
  const f = fixture(t);
  f.config.db.receipts_path = ".mdkg/db/runtime/portable-receipts"; f.save();
  f.put(`${f.config.db.receipts_path}/accepted.json`, "portable receipt");
  f.put(`${f.config.db.receipts_path}/pending.tmp`);
  f.put(f.config.db.runtime_path);
  const result = f.bundle("private");
  assert.equal(result.entries.get(`${f.config.db.receipts_path}/accepted.json`)?.toString(), "portable receipt");
  assert.equal(result.entries.has(`${f.config.db.receipts_path}/pending.tmp`), false);
  assert.equal(result.entries.has(f.config.db.runtime_path), false);
  const publicResult = f.bundle();
  assert.equal(publicResult.entries.has(`${f.config.db.receipts_path}/accepted.json`), false);
  assert.ok(publicResult.manifest.transport_exclusions.some((row: any) => row.reason === "private-db-payload"));
});

function alterHistoricalBundle(f: ReturnType<typeof fixture>, profile: string,
  mutate: (entries: Map<string, Buffer>, manifest: any) => void) {
  const file = historicalBundle(f, profile);
  const entries = new Map<string, Buffer>(readZipEntries(fs.readFileSync(file)).map((entry: any) => [entry.name, entry.data]));
  const manifest = JSON.parse(entries.get("manifest.json")!.toString());
  mutate(entries, manifest);
  manifest.files = [...entries].filter(([name]) => name !== "manifest.json").map(([name, data]) => ({
    ...(manifest.files.find((row: any) => row.path === name) ?? { kind: "authored", workspace: "root", visibility: "public" }),
    path: name, size: data.length, sha256: sha256Buffer(data),
  }));
  const hashRows = (rows: any[]) => sha256Buffer(Buffer.from(`${JSON.stringify(rows.map((row) => ({
    path: row.path, kind: row.kind, workspace: row.workspace, visibility: row.visibility, size: row.size, sha256: row.sha256,
  })), null, 2)}\n`));
  manifest.file_count = manifest.files.length;
  manifest.source_tree_hash = hashRows(manifest.files.filter((row: any) => row.kind !== "generated_index"));
  manifest.bundle_hash = hashRows(manifest.files);
  for (const row of manifest.files.filter((row: any) => row.kind === "generated_index")) manifest.index_hashes[row.path] = row.sha256;
  entries.set("manifest.json", Buffer.from(JSON.stringify(manifest)));
  fs.writeFileSync(file, createDeterministicZipFromEntries([...entries].map(([name, data]) => ({ name, data }))));
  assert.equal(verifyBundle(f.root, file).errors.some((error: string) => /mismatch|unexpected|missing/.test(error)), false);
  return file;
}

test("historical policy-less public bundles stay inspectable but refuse materialization", (t) => {
  const f = fixture(t), bundle = historicalBundle(f, "public");
  assert.equal(cli(f.root, ["bundle", "show", bundle, "--json"]).status, 0);
  const added = cli(f.root, ["subgraph", "add", "historical", path.relative(f.root, bundle), "--profile", "public", "--json"]);
  assert.equal(added.status, 0, added.stdout + added.stderr);
  assert.equal(cli(f.root, ["show", "historical:task-1", "--json"]).status, 0, "bounded historical node inspection retained");
  f.put(".mdkg/subgraphs/keep.txt", "unrelated authored sentinel");
  const result = cli(f.root, ["subgraph", "materialize", "historical", "--target", ".mdkg/subgraphs", "--gitignore", "--json"]);
  assert.notEqual(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout + result.stderr, /transport|inspect.only|fresh.*export/i);
  assert.deepEqual(fs.readdirSync(path.join(f.root, ".mdkg/subgraphs")), ["keep.txt"]);
});

test("historical policy-less public templates cannot create authored nodes", (t) => {
  const f = fixture(t), bundle = historicalBundle(f, "public");
  const before = fs.readdirSync(path.join(f.root, ".mdkg/work"));
  const result = cli(f.root, ["graph", "import-template", bundle, "--apply", "--json"]);
  assert.notEqual(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout + result.stderr, /transport|inspect.only|fresh.*export/i);
  assert.deepEqual(fs.readdirSync(path.join(f.root, ".mdkg/work")), before);
});

for (const mode of ["clone", "fork"]) {
  test(`${mode} applies public transport policy even when a historical bundle includes its config`, (t) => {
    const f = fixture(t);
    const bundle = alterHistoricalBundle(f, "public", (entries) => {
      entries.set(".mdkg/config.json", Buffer.from(JSON.stringify(f.config)));
      entries.set(f.config.db.state_path, Buffer.from(privateMarker));
    });
    const result = cli(f.root, ["graph", mode, bundle, "--target", "target", "--json"]);
    assert.equal(result.status, 0, result.stdout + result.stderr);
    assert.equal(fs.existsSync(path.join(f.root, "target", f.config.db.state_path)), false);
  });
}

test("materialization rechecks a registered expected profile before replacing any view", (t) => {
  const f = fixture(t), bundle = historicalBundle(f, "public");
  const added = cli(f.root, ["subgraph", "add", "historical", path.relative(f.root, bundle), "--profile", "public", "--json"]);
  assert.equal(added.status, 0, added.stdout + added.stderr);
  alterHistoricalBundle(f, "public", (_entries, manifest) => { manifest.profile = "private"; });
  const result = cli(f.root, ["subgraph", "materialize", "historical", "--target", ".mdkg/subgraphs", "--json"]);
  assert.notEqual(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout + result.stderr, /profile/i);
  assert.equal(fs.existsSync(path.join(f.root, ".mdkg/subgraphs/historical")), false);
});

test("historical authored lock rows never restore checkout authority", (t) => {
  const f = fixture(t);
  const lock = ".mdkg/index/write.lock/owner.json";
  const bundle = alterHistoricalBundle(f, "private", (entries) => entries.set(lock, Buffer.from(privateMarker)));
  const result = cli(f.root, ["graph", "clone", bundle, "--target", "target", "--json"]);
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.equal(fs.existsSync(path.join(f.root, "target", lock)), false);
});

test("transport retains conventional exclusions inside an unregistered nested graph directory", (t) => {
  const f = fixture(t);
  const prefix = ".mdkg/examples/unregistered/.mdkg";
  const files = ["index/global.json", "index/write.lock/owner.json", "pack/context.md", "bundles/private.zip",
    "subgraphs/child/index.json", "archive/item/source/payload.txt", "state/identity-transactions/old.json"];
  files.forEach((file) => f.put(`${prefix}/${file}`));
  for (const profile of ["public", "private"]) {
    const result = f.bundle(profile);
    for (const [file, bytes] of result.entries) assert.equal(bytes.includes(Buffer.from(privateMarker)), false, file);
  }
});

test("unregistered conventional state is excluded before payload reads in both profiles", (t) => {
  const f = fixture(t), prefix = ".mdkg/examples/unregistered/.mdkg";
  const files = ["state/selected-goal.json", "db/runtime/live.sqlite", "db/runtime/live.sqlite-wal"];
  files.forEach((file) => f.put(`${prefix}/${file}`));
  const original = fs.readFileSync;
  fs.readFileSync = ((file: any, ...args: any[]) => {
    assert.ok(!files.some((relative) => file === path.join(f.root, prefix, relative)), `read excluded payload ${file}`);
    return (original as any)(file, ...args);
  }) as typeof fs.readFileSync;
  try { for (const profile of ["public", "private"]) f.bundle(profile); }
  finally { fs.readFileSync = original; }
});

for (const profile of ["public", "private"]) {
  test(`${profile} sidecar spelling variants are excluded before payload reads`, (t) => {
    const f = fixture(t);
    const files = [".mdkg/db/receipts/working-WAL", ".mdkg/db/state/checkpoint-JOURNAL", ".mdkg/db/receipts/working.TmP"];
    files.forEach((file) => f.put(file));
    f.put(".mdkg/db/receipts/portable.json", "portable receipt");
    const original = fs.openSync;
    fs.openSync = ((file: any, ...args: any[]) => {
      assert.ok(!files.some((relative) => file === path.join(f.root, relative)), `opened excluded sidecar ${file}`);
      return (original as any)(file, ...args);
    }) as typeof fs.openSync;
    try {
      const result = f.bundle(profile);
      for (const file of files) assert.equal(result.entries.has(file), false);
      assert.equal(result.entries.has(".mdkg/db/receipts/portable.json"), profile === "private");
    } finally { fs.openSync = original; }
  });

  test(`${profile} refuses excluded nested state in node discovery before opening it`, (t) => {
    const f = fixture(t), file = ".mdkg/work/unregistered/.mdkg/state/task-2.md";
    f.put(file, "---\nid: task-2\ntype: task\ntitle: Private state marker\nstatus: backlog\npriority: 1\ncreated: 2026-09-15\nupdated: 2026-09-15\n---\nPrivate state\n");
    const original = fs.openSync;
    fs.openSync = ((target: any, ...args: any[]) => {
      assert.notEqual(target, path.join(f.root, file), "excluded state opened by graph projection");
      return (original as any)(target, ...args);
    }) as typeof fs.openSync;
    try { assert.throws(() => f.bundle(profile), /transport state overlaps authored graph discovery/); }
    finally { fs.openSync = original; }
  });

  test(`${profile} refuses an unregistered child-declared workspace before reading its payloads`, (t) => {
    const f = fixture(t);
    f.config.workspaces.child = { path: ".mdkg/nested", mdkg_dir: "memory", enabled: true, visibility: "public" }; f.save();
    const child = JSON.parse(JSON.stringify(f.config));
    child.workspaces = { root: { path: ".", mdkg_dir: ".mdkg", enabled: true, visibility: "public" },
      deep: { path: "memory/deep", mdkg_dir: "graph", enabled: true, visibility: "private" } };
    f.put(".mdkg/nested/memory/config.json", JSON.stringify(child));
    const deep = JSON.parse(JSON.stringify(child));
    deep.workspaces = { root: { path: ".", mdkg_dir: ".mdkg", enabled: true, visibility: "private" } };
    deep.db = { ...deep.db, root_path: "graph/storage", runtime_path: "graph/storage/live.db",
      state_path: "graph/storage/checkpoint.db", receipts_path: "graph/storage/receipts",
      schema_path: "graph/storage/schema", migrations_path: "graph/storage/schema/migrations" };
    const files = [".mdkg/nested/memory/deep/graph/config.json", ".mdkg/nested/memory/deep/graph/storage/live.db"];
    f.put(files[0], JSON.stringify(deep)); f.put(files[1]);
    const original = fs.openSync;
    fs.openSync = ((file: any, ...args: any[]) => {
      assert.ok(!files.some((relative) => file === path.join(f.root, relative)), "unregistered nested payload opened");
      return (original as any)(file, ...args);
    }) as typeof fs.openSync;
    try { assert.throws(() => f.bundle(profile), /nested workspace.*not registered|resolve.*transport ownership/); }
    finally { fs.openSync = original; }
    // Registering the exact nested graph makes its DB policy classifiable,
    // without importing its private payloads into the public profile.
    f.config.workspaces.deep = { path: ".mdkg/nested/memory/deep", mdkg_dir: "graph", enabled: true, visibility: "private" }; f.save();
    f.put(".mdkg/nested/memory/deep/graph/storage/checkpoint.db", "portable nested checkpoint");
    const accepted = f.bundle(profile);
    assert.equal(accepted.entries.has(files[1]), false);
    assert.equal(accepted.entries.has(".mdkg/nested/memory/deep/graph/storage/checkpoint.db"), profile === "private");
  });
}

test("undeclared nested graph configuration refuses export before custom live state is read", (t) => {
  const f = fixture(t), prefix = ".mdkg/examples/unregistered/.mdkg";
  f.put(`${prefix}/config.json`, JSON.stringify(f.config));
  const live = `${prefix}/custom/current.payload`; f.put(live);
  const original = fs.readFileSync;
  fs.readFileSync = ((file: any, ...args: any[]) => {
    assert.notEqual(file, path.join(f.root, live), "must resolve graph policy before opening an undeclared payload");
    return (original as any)(file, ...args);
  }) as typeof fs.readFileSync;
  try { assert.throws(() => f.bundle(), /undeclared.*config|register.*workspace/i); }
  finally { fs.readFileSync = original; }
});

for (const ws of ["all", "child"]) {
  test(`private ${ws} contract cannot admit a child-declared unregistered graph's live bytes`, (t) => {
    const f = fixture(t);
    f.config.workspaces.child = { path: ".mdkg/nested", mdkg_dir: "memory", enabled: true, visibility: "private" }; f.save();
    const child = JSON.parse(JSON.stringify(f.config));
    child.workspaces = { root: { path: ".", mdkg_dir: ".mdkg", enabled: true, visibility: "private" },
      deep: { path: "memory/deep", mdkg_dir: "graph", enabled: true, visibility: "private" } };
    f.put(".mdkg/nested/memory/config.json", JSON.stringify(child));
    const built = buildBundle({ root: f.root, profile: "private", ws });
    const result = { ...built, entries: new Map<string, Buffer>(readZipEntries(built.zip).map((entry: any) => [entry.name, entry.data])) };
    const live = ".mdkg/nested/memory/deep/graph/storage/live.db", data = Buffer.from(privateMarker);
    result.entries.set(live, data);
    result.manifest.files.push({ path: live, kind: "authored", workspace: "child", visibility: "private", size: data.length, sha256: sha256Buffer(data) });
    result.manifest.transport_policy.files.push({ path: live, role: "graph" });
    rehashBundle(result);
    const bundle = saveBundle(f.root, result, `forged-${ws}.zip`);
    // show is bounded manifest inspection, not payload verification.
    assert.notEqual(cli(f.root, ["bundle", "verify", bundle, "--json"]).status, 0);
    assert.notEqual(cli(f.root, ["subgraph", "add", "unsafe", path.basename(bundle), "--json"]).status, 0);
    assert.notEqual(cli(f.root, ["graph", "import-template", bundle, "--apply", "--json"]).status, 0);
    assert.notEqual(cli(f.root, ["graph", "clone", bundle, "--target", "unsafe-target", "--json"]).status, 0);
    assert.equal(fs.existsSync(path.join(f.root, "unsafe-target")), false);
  });
}

test("selected child-only private portable contract preserves custom snapshot bytes without root config", (t) => {
  const f = fixture(t);
  f.config.workspaces.child = { path: ".mdkg/nested", mdkg_dir: "memory", enabled: true, visibility: "private" }; f.save();
  const child = JSON.parse(JSON.stringify(f.config));
  child.workspaces = { root: { path: ".", mdkg_dir: ".mdkg", enabled: true, visibility: "private" } };
  child.db = { ...child.db, root_path: "memory/storage", runtime_path: "memory/storage/live.db", state_path: "memory/storage/checkpoint.db",
    receipts_path: "memory/storage/receipts", schema_path: "memory/storage/schema", migrations_path: "memory/storage/schema/migrations" };
  f.put(".mdkg/nested/memory/config.json", JSON.stringify(child));
  f.put(".mdkg/nested/memory/storage/live.db");
  f.put(".mdkg/nested/memory/storage/checkpoint.db", "private portable checkpoint");
  const result = buildBundle({ root: f.root, profile: "private", ws: "child" });
  result.entries = new Map(readZipEntries(result.zip).map((entry: any) => [entry.name, entry.data]));
  assert.equal(result.entries.has(".mdkg/config.json"), false);
  const file = saveBundle(f.root, result);
  const added = cli(f.root, ["subgraph", "add", "selected", path.basename(file), "--json"]);
  assert.equal(added.status, 0, added.stdout + added.stderr);
  const materialized = cli(f.root, ["subgraph", "materialize", "selected", "--target", ".mdkg/subgraphs", "--json"]);
  assert.equal(materialized.status, 0, materialized.stdout + materialized.stderr);
  const root = path.join(f.root, ".mdkg/subgraphs/selected/.mdkg/nested/memory/storage");
  assert.equal(fs.readFileSync(path.join(root, "checkpoint.db"), "utf8"), "private portable checkpoint");
  assert.equal(fs.existsSync(path.join(root, "live.db")), false);
});

for (const profile of ["public", "private"]) {
  test(`unselected child DB configuration constrains ${profile} parent exports`, (t) => {
    const f = fixture(t);
    f.config.workspaces.child = { path: ".mdkg/nested", mdkg_dir: ".mdkg", enabled: true, visibility: "private" }; f.save();
    const child = JSON.parse(JSON.stringify(f.config));
    child.workspaces = { root: { path: ".", mdkg_dir: ".mdkg", enabled: true, visibility: "private" } };
    child.db = { ...child.db, root_path: "storage", runtime_path: "storage/live.db", state_path: "storage/checkpoint.db",
      receipts_path: "storage/receipts", schema_path: "storage/schema", migrations_path: "storage/schema/migrations" };
    f.put(".mdkg/nested/.mdkg/config.json", JSON.stringify(child));
    for (const file of ["storage/live.db", "storage/checkpoint.db", "storage/receipts/work.json"]) f.put(`.mdkg/nested/${file}`);
    const built = buildBundle({ root: f.root, profile, ws: "root" });
    for (const entry of readZipEntries(built.zip)) assert.equal(entry.data.includes(Buffer.from(privateMarker)), false, entry.name);
    const selected = f.bundle("private");
    assert.equal(selected.entries.get(".mdkg/nested/storage/checkpoint.db")?.toString(), privateMarker);
    assert.equal(selected.entries.has(".mdkg/nested/storage/live.db"), false);
  });
}

test("disabled child DB custody cannot be guessed from parent-owned sibling files", (t) => {
  const f = fixture(t);
  f.config.workspaces.child = { path: ".mdkg/nested", mdkg_dir: ".mdkg", enabled: false, visibility: "private" }; f.save();
  f.put(".mdkg/nested/.mdkg/config.json", "unread disabled configuration");
  f.put(".mdkg/nested/storage/live.db");
  const original = fs.readFileSync;
  fs.readFileSync = ((file: any, ...args: any[]) => {
    assert.ok(typeof file !== "string" || !file.startsWith(path.join(f.root, ".mdkg/nested")), "disabled subtree payload opened");
    return (original as any)(file, ...args);
  }) as typeof fs.readFileSync;
  try { assert.throws(() => f.bundle(), /disabled.*unclassified|transport ownership/); }
  finally { fs.readFileSync = original; }
});

for (const role of ["graph", "private-db"]) {
  test(`child-only portable contract cannot override its included runtime config with a ${role} role`, (t) => {
    const f = fixture(t);
    f.config.workspaces.child = { path: ".mdkg/nested", mdkg_dir: "memory", enabled: true, visibility: "private" }; f.save();
    const child = JSON.parse(JSON.stringify(f.config));
    child.workspaces = { root: { path: ".", mdkg_dir: ".mdkg", enabled: true, visibility: "private" } };
    child.db = { ...child.db, root_path: "memory/storage", runtime_path: "memory/storage/live.db", state_path: "memory/storage/checkpoint.db",
      receipts_path: "memory/storage/receipts", schema_path: "memory/storage/schema", migrations_path: "memory/storage/schema/migrations" };
    f.put(".mdkg/nested/memory/config.json", JSON.stringify(child));
    const result = buildBundle({ root: f.root, profile: "private", ws: "child" });
    result.entries = new Map(readZipEntries(result.zip).map((entry: any) => [entry.name, entry.data]));
    const file = ".mdkg/nested/memory/storage/live.db", data = Buffer.from(privateMarker);
    result.entries.set(file, data);
    result.manifest.files.push({ path: file, kind: "authored", workspace: "child", visibility: "private", size: data.length, sha256: sha256Buffer(data) });
    result.manifest.transport_policy.files.push({ path: file, role });
    rehashBundle(result);
    const bundle = saveBundle(f.root, result);
    const verification = verifyBundle(f.root, bundle);
    assert.match(verification.errors.join(";"), /configuration contradicts role/);
    const added = cli(f.root, ["subgraph", "add", "forged", path.basename(bundle), "--json"]);
    assert.notEqual(added.status, 0, added.stdout + added.stderr);
    assert.equal(fs.existsSync(path.join(f.root, ".mdkg/subgraphs/forged")), false);
  });
}

for (const profile of ["public", "private"]) {
  test(`${profile} materialization never cleans a pre-existing temporary-name collision`, (t) => {
    const f = fixture(t), bundle = historicalBundle(f, profile);
    const added = cli(f.root, ["subgraph", "add", "historical", path.relative(f.root, bundle), "--profile", profile, "--json"]);
    assert.equal(added.status, 0, added.stdout + added.stderr);
    const preload = path.join(f.root, "collision.cjs");
    f.put("collision.cjs", `const fs = require("node:fs"), path = require("node:path");
Date.now = () => 12345;
const dir = path.join(process.cwd(), ".mdkg/subgraphs", ".historical." + process.pid + ".12345.tmp");
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, "keep.txt"), "pre-existing owned-fixture sentinel");
fs.writeFileSync(path.join(process.cwd(), "collision-path.txt"), dir);
`);
    const result = spawnSync(process.execPath, ["--require", preload, path.resolve(__dirname, "../../cli.js"),
      "subgraph", "materialize", "historical", "--target", ".mdkg/subgraphs", "--json"], { cwd: f.root, encoding: "utf8" });
    const collided = fs.readFileSync(path.join(f.root, "collision-path.txt"), "utf8");
    assert.equal(fs.readFileSync(path.join(collided, "keep.txt"), "utf8"), "pre-existing owned-fixture sentinel");
    assert.notEqual(result.status, 0, result.stdout + result.stderr);
    assert.equal(fs.existsSync(path.join(f.root, ".mdkg/subgraphs/historical")), false);
  });
}
