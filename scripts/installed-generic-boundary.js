const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const digest = bytes => crypto.createHash("sha256").update(bytes).digest("hex");

function inventory(root) {
  const rows = [];
  function visit(directory) {
    for (const name of fs.readdirSync(directory).sort()) {
      const file = path.join(directory, name), stat = fs.lstatSync(file);
      rows.push([path.relative(root, file), stat.mode, stat.isFile() ? digest(fs.readFileSync(file))
        : stat.isSymbolicLink() ? fs.readlinkSync(file) : "directory"]);
      if (stat.isDirectory()) visit(file);
    }
  }
  visit(root);
  return rows;
}

// Installed candidate only. Source writes below construct synthetic disposable
// consumer inputs; they are not a conversion or a reconstruction of lost data.
function verifyGenericBoundary({ packageRoot, tarballPath, tempRoot, commands }) {
  const cli = path.join(packageRoot, "dist/cli.js");
  const root = path.join(tempRoot, "generic-boundary");
  fs.mkdirSync(root);
  const execute = (cwd, args, nodeArgs = []) => commands.node(cli, args, cwd, {
    nodeArgs, allowFailure: true, timeout: 60000,
  });
  const run = (cwd, args) => {
    const result = execute(cwd, args);
    assert.equal(result.status, 0, `${args.join(" ")}\n${result.stdout}\n${result.stderr}`);
    return result.stdout;
  };
  const json = (cwd, args) => JSON.parse(run(cwd, [...args, "--json"]));
  run(root, ["init", "--graph-only"]);

  // Even auth or observational subprocesses are forbidden on rejected input.
  const marker = path.join(tempRoot, "generic-forbidden-subprocess");
  const preload = path.join(tempRoot, "generic-subprocess-trap.cjs");
  fs.writeFileSync(preload, `const cp=require("node:child_process"),fs=require("node:fs");\n` +
    `for(const key of ["spawn","spawnSync","exec","execSync","execFile","execFileSync","fork"]) ` +
    `cp[key]=()=>{fs.writeFileSync(${JSON.stringify(marker)},key);throw Error("forbidden subprocess");};\n`);
  const beforeRefusal = inventory(root);
  const refusals = [
    ["validate", "--profile", "omni-room", "--out", "forbidden.txt"],
    ["validate", "--pack-profile=generic", "--json-out", "forbidden.json"],
    ["work", "validate", "--profile", "omni-room"],
    ["work", "validate", "--pack-profile=generic"],
    ["work", "contract", "new", "Rejected", "--pricing-model", "free"],
    ["new", "work", "Rejected", "--pricing-model=quoted"],
    ["validate", "--out", "--pricing-model=free"],
    ["validate", "--json-out", "--pricing-model", "free"],
    ["work", "validate", "--type", "--pricing-model=free"],
  ];
  for (const args of refusals) {
    const result = execute(root, args, ["--require", preload]);
    assert.equal(result.status, 1, args.join(" "));
    assert.match(result.stderr, /not supported/, args.join(" "));
    assert.equal(fs.existsSync(marker), false, "rejected input launched a subprocess");
    assert.deepEqual(inventory(root), beforeRefusal, "rejected input changed the graph");
  }

  const manifest = json(root, ["new", "manifest", "Generic Worker", "--id", "agent.generic"]).node;
  const work = json(root, ["work", "contract", "new", "Generic Work", "--id", "work.generic",
    "--agent-id", "agent.generic", "--kind", "generic", "--inputs", "request:text:required",
    "--outputs", "result:text:required", "--required-capabilities", "graph.read"]).node;
  const workPath = path.join(root, work.path), manifestPath = path.join(root, manifest.path);
  assert.doesNotMatch(fs.readFileSync(workPath, "utf8"), /pricing_model/);
  let manifestBody = fs.readFileSync(manifestPath, "utf8").replace(/runtime_mode: \S+/, "runtime_mode: orchestrated");
  fs.writeFileSync(manifestPath, manifestBody);
  assert.equal(json(root, ["work", "validate"]).ok, true);
  fs.writeFileSync(manifestPath, manifestBody.replace("runtime_mode: orchestrated", "runtime_mode: room_orchestrated"));
  const beforeInvalid = inventory(root), invalid = execute(root, ["validate", "--json"]);
  assert.equal(invalid.status, 2, "invalid graph uses the validation-failure exit code");
  assert.match(invalid.stdout + invalid.stderr, /runtime_mode/);
  assert.deepEqual(inventory(root), beforeInvalid);
  fs.writeFileSync(manifestPath, manifestBody);

  // No special compatibility: legacy fields obey the ordinary custom-template
  // mechanism, without being a first-class discovery or pricing capability.
  const templatePath = path.join(root, ".mdkg/templates/default/work.md");
  fs.writeFileSync(templatePath, fs.readFileSync(templatePath, "utf8").replace("kind: generic", "kind: generic\npricing_model: consumer-only"));
  fs.writeFileSync(workPath, fs.readFileSync(workPath, "utf8").replace("kind: generic", "kind: generic\npricing_model: consumer-only"));
  const skillPath = path.join(root, ".mdkg/skills/generic/SKILL.md");
  fs.mkdirSync(path.dirname(skillPath), { recursive: true });
  fs.writeFileSync(skillPath, "---\nname: generic\ndescription: Generic instructions\nochatr_policy: namespace-only-probe\ncustom_policy: custom-only-probe\n---\n# Steps\nRead evidence.\n");
  const authored = [templatePath, workPath, manifestPath, skillPath].map(file => [file, digest(fs.readFileSync(file))]);
  assert.equal(json(root, ["validate"]).ok, true);
  run(root, ["index"]);
  const cachePath = path.join(root, ".mdkg/index/capabilities.json");
  const cache = JSON.parse(fs.readFileSync(cachePath, "utf8"));
  const addHistoricalShape = records => {
    const skill = records.find(record => record.kind === "skill" && record.slug === "generic");
    const workRecord = records.find(record => record.kind === "work" && record.id === "work.generic");
    assert.ok(skill && workRecord, "both capability kinds must be present");
    skill.skill.extensions = { ochatr: { policy: "namespace-only-probe" }, custom: { policy: "custom-only-probe" } };
    workRecord.work.pricing_model = "consumer-only";
  };
  addHistoricalShape(cache.records);
  fs.writeFileSync(cachePath, JSON.stringify(cache));
  const beforeDiscovery = inventory(root);
  const listing = run(root, ["capability", "list", "--no-reindex", "--json"]);
  assert.doesNotMatch(listing, /pricing_model|extensions|namespace-only-probe|custom-only-probe/);
  for (const query of ["namespace-only-probe", "custom-only-probe", "consumer-only"]) {
    assert.equal(json(root, ["capability", "search", query, "--no-reindex"]).count, 0);
    assert.equal(json(root, ["skill", "search", query, "--no-reindex"]).count, 0);
  }
  assert.doesNotMatch(run(root, ["skill", "show", "generic", "--meta"]), /ochatr_policy|custom_policy|extensions/);
  assert.match(run(root, ["skill", "show", "generic"]), /ochatr_policy: namespace-only-probe/);
  assert.deepEqual(inventory(root), beforeDiscovery);

  // This is a synthetic historical-shaped bundle, not an exact published bundle.
  // Use only the installed candidate's ZIP codec; rebind every generated digest.
  const bundlePath = path.join(root, ".mdkg/bundles/private/generic.mdkg.zip");
  run(root, ["bundle", "create", "--profile", "private", "--output", bundlePath, "--json"]);
  const { readZipEntries, createDeterministicZipFromEntries } = require(path.join(packageRoot, "dist/util/zip.js"));
  const entries = new Map(readZipEntries(fs.readFileSync(bundlePath)).map(({ name, data }) => [name, data]));
  const bundleManifest = JSON.parse(entries.get("manifest.json").toString("utf8"));
  const indexPath = ".mdkg/index/capabilities.json";
  const importedCache = JSON.parse(entries.get(indexPath).toString("utf8"));
  addHistoricalShape(importedCache.records);
  const bytes = Buffer.from(JSON.stringify(importedCache, null, 2) + "\n");
  entries.set(indexPath, bytes);
  const indexedFile = bundleManifest.files.find(file => file.path === indexPath);
  indexedFile.size = bytes.length;
  indexedFile.sha256 = `sha256:${digest(bytes)}`;
  bundleManifest.index_hashes[indexPath] = indexedFile.sha256;
  bundleManifest.bundle_hash = `sha256:${digest(Buffer.from(JSON.stringify(bundleManifest.files.map(file => ({
    path: file.path, kind: file.kind, workspace: file.workspace, visibility: file.visibility, size: file.size, sha256: file.sha256,
  })), null, 2) + "\n"))}`;
  bundleManifest.transport_policy.bundle_hash = bundleManifest.bundle_hash;
  entries.set("manifest.json", Buffer.from(JSON.stringify(bundleManifest, null, 2) + "\n"));
  const importedRoot = path.join(tempRoot, "generic-import");
  fs.mkdirSync(importedRoot);
  run(importedRoot, ["init", "--graph-only"]);
  const importedPath = path.join(importedRoot, ".mdkg/bundles/private/import.mdkg.zip");
  fs.mkdirSync(path.dirname(importedPath), { recursive: true });
  fs.writeFileSync(importedPath, createDeterministicZipFromEntries([...entries].map(([name, data]) => ({ name, data }))));
  const importedHash = digest(fs.readFileSync(importedPath));
  // Bundle verification compares payload hashes to its source graph, not to
  // the receiving project's different graph. Imported mounting is checked below.
  assert.equal(json(root, ["bundle", "verify", importedPath]).ok, true);
  run(importedRoot, ["subgraph", "add", "legacy", ".mdkg/bundles/private/import.mdkg.zip", "--json"]);
  const beforeImportedRead = inventory(importedRoot);
  const imported = json(importedRoot, ["capability", "list"]);
  for (const id of ["work.generic", "skill:generic"]) {
    assert.ok(imported.items.some(record => record.qid === `legacy:${id}` && record.source.read_only), `missing ${id}`);
  }
  assert.doesNotMatch(JSON.stringify(imported), /pricing_model|extensions|namespace-only-probe|custom-only-probe/);
  for (const query of ["namespace-only-probe", "custom-only-probe", "consumer-only"]) {
    assert.equal(json(importedRoot, ["capability", "search", query]).count, 0);
  }
  assert.deepEqual(inventory(importedRoot), beforeImportedRead);
  assert.equal(digest(fs.readFileSync(importedPath)), importedHash);
  for (const [file, hash] of authored) assert.equal(digest(fs.readFileSync(file)), hash, file);
  return { node: process.version, tarball_sha256: digest(fs.readFileSync(tarballPath)), rejected_invocations: refusals.length,
    subprocesses_on_refusal: 0, generic_work: true, old_runtime_token_rejected: true, custom_fields_preserved: true,
    cached_projection_neutral: true, synthetic_import_projection_neutral: true, imported_bytes_preserved: true };
}

module.exports = { verifyGenericBoundary };
