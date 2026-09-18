import { test, after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { makeTempDir } from "../helpers/fs";
import crypto from "node:crypto";

const runtime = process.env.MDKG_TEST_PACKAGE ? path.join(process.env.MDKG_TEST_PACKAGE, "dist") : path.resolve(__dirname, "../..");
const { runInitCommand } = require(path.join(runtime, "commands/init"));
const { runUpgradeCommand } = require(path.join(runtime, "commands/upgrade"));
const { planLegacyIdentityMigration } = require(path.join(runtime, "graph/identity_migration"));
const { applyGraphMigrationPlan } = require(path.join(runtime, "graph/identity_transaction"));
const roots: string[] = [];
const repo = path.resolve(__dirname, "../../..");
const { assertPublicCoreSeed, CORE_IDS } = require(path.join(repo, "scripts/public-core-seed.js"));
function temp(name: string) { const root = makeTempDir(name); roots.push(root); return root; }
after(() => { for (const root of roots) fs.rmSync(root, {recursive:true, force:true}); });
function quiet<T>(fn: () => T): T { const log = console.log; console.log = () => {}; try { return fn(); } finally { console.log = log; } }
function cli(root: string, args: string[]) {
  const result = spawnSync(process.execPath, [path.join(runtime,"cli.js"), ...args], {cwd:root, encoding:"utf8"});
  assert.equal(result.status, 0, result.stdout + result.stderr);
  return result.stdout;
}
function assertCompatibilityAliases(root: string) {
  for (const [id,aliases] of [["rule-human",["human"]],["rule-soul",["soul","system-contract"]],["rule-7",["collaboration","operator-profile"]]] as const) {
    const shown=JSON.parse(cli(root,["show",id,"--json"]));
    assert.deepEqual(shown.item.aliases,[...aliases]);
  }
}

test("public core inventory is self-contained, identity-free and byte-identical to the built seed", () => {
  const result = assertPublicCoreSeed({publicRoot:path.join(repo,"assets/init/core"),builtRoot:path.join(runtime,"init/core"),runtimeRoot:runtime});
  assert.equal(result.node_count,10);
  const manifest=JSON.parse(fs.readFileSync(path.join(runtime,"init/init-manifest.json"),"utf8"));
  for(const file of result.files) {
    const hash=crypto.createHash("sha256").update(fs.readFileSync(path.join(runtime,"init/core",file))).digest("hex");
    assert.equal(manifest.files.find((entry:any)=>entry.path===`.mdkg/core/${file}`)?.sha256,hash);
  }
});

for(const [name, mutate, expected] of [
  ["unshipped reference", (dir:string)=>edit(dir,"SOUL.md",s=>s.replace(/^refs:.*$/m,"refs: [dec-999]")), /unbound reference/],
  ["search alias used as graph ID", (dir:string)=>edit(dir,"SOUL.md",s=>s.replace(/^refs:.*$/m,"refs: [human]")), /unbound reference/],
  ["unknown reference field", (dir:string)=>edit(dir,"SOUL.md",s=>s.replace(/^refs:.*$/m,"refs: []\nfuture_refs: [dec-999]")), /unknown key/],
  ["label in ordinary refs", (dir:string)=>edit(dir,"SOUL.md",s=>s.replace(/^refs:.*$/m,"refs: [prior=rule-human]")), /refs entries must/],
  ["malformed refs type", (dir:string)=>edit(dir,"SOUL.md",s=>s.replace(/^refs:.*$/m,"refs: true")), /refs must be a list/],
  ["fixed adopted identity", (dir:string)=>edit(dir,"SOUL.md",s=>s.replace("type: rule","node_id: e7403372-f270-4cd7-902d-64b792c781df\ntype: rule")), /adopted identity/],
  ["changed public id", (dir:string)=>edit(dir,"SOUL.md",s=>s.replace("id: rule-soul","id: rule-1")), /identity mismatch/],
  ["duplicate alias", (dir:string)=>edit(dir,"SOUL.md",s=>s.replace(/^aliases:.*$/m,"aliases: [soul, system-contract, rule-1]")), /duplicate alias/],
  ["removed compatibility alias", (dir:string)=>edit(dir,"SOUL.md",s=>s.replace(/^aliases:.*$/m,"aliases: [soul]")), /missing compatibility alias/],
  ["non-list aliases", (dir:string)=>edit(dir,"SOUL.md",s=>s.replace(/^aliases:.*$/m,"aliases: soul")), /aliases must be/],
  ["unknown file", (dir:string)=>fs.writeFileSync(path.join(dir,"private.md"),"private maintainer evidence"), /inventory mismatch/],
  ["missing file", (dir:string)=>fs.unlinkSync(path.join(dir,"SOUL.md")), /inventory mismatch/],
  ["extra directory", (dir:string)=>fs.mkdirSync(path.join(dir,"private")), /inventory mismatch/],
  ["symlink seed", (dir:string)=>{fs.renameSync(path.join(dir,"SOUL.md"),path.join(dir,"../source.md"));fs.symlinkSync("../source.md",path.join(dir,"SOUL.md"));}, /regular file/],
  ["dangling core pin", (dir:string)=>fs.appendFileSync(path.join(dir,"core.md"),"dec-999\n"), /pins/],
  ["duplicate core pin", (dir:string)=>fs.appendFileSync(path.join(dir,"core.md"),"rule-soul\n"), /pins/],
] as Array<[string,(dir:string)=>void,RegExp]>) {
  test(`public core guard rejects ${name}`,()=>{
    const dir=path.join(temp("mdkg-seed-guard-"),"core");
    fs.cpSync(path.join(repo,"assets/init/core"),dir,{recursive:true});
    mutate(dir);
    assert.throws(()=>assertPublicCoreSeed({publicRoot:dir,runtimeRoot:runtime}),expected);
  });
}
function edit(dir:string,file:string, transform:(text:string)=>string) {
  const target=path.join(dir,file);fs.writeFileSync(target,transform(fs.readFileSync(target,"utf8")));
}

test("public core guard rejects stale built bytes and root symlinks",()=>{
  const root=temp("mdkg-seed-parity-"),source=path.join(root,"source"),built=path.join(root,"built");
  fs.cpSync(path.join(repo,"assets/init/core"),source,{recursive:true});
  fs.cpSync(source,built,{recursive:true});
  fs.appendFileSync(path.join(built,"SOUL.md"),"\nChanged output.\n");
  assert.throws(()=>assertPublicCoreSeed({publicRoot:source,builtRoot:built,runtimeRoot:runtime}),/parity mismatch/);
  const linked=path.join(root,"linked");fs.symlinkSync(source,linked);
  assert.throws(()=>assertPublicCoreSeed({publicRoot:linked,runtimeRoot:runtime}),/must be a directory/);
});

test("public seed references can use qualified IDs without rewriting prose or opaque artifacts",()=>{
  const dir=path.join(temp("mdkg-seed-ref-"),"core");fs.cpSync(path.join(repo,"assets/init/core"),dir,{recursive:true});
  edit(dir,"SOUL.md",s=>s.replace(/^refs:.*$/m,"refs: [root:rule-1, rule-human]").replace(/^artifacts:.*$/m,"artifacts: [external-evidence.json]") + "\nExample dec-999 is prose, not a graph edge.\n");
  assert.equal(assertPublicCoreSeed({publicRoot:dir,runtimeRoot:runtime}).node_count,Object.keys(CORE_IDS).length);
});

for (const [name, options] of [["default", {}], ["agent", {agent:true}], ["graph-only", {graphOnly:true}]] as const) {
  test(`untouched ${name} bootstrap supports task creation and explicit v2 adoption`, () => {
    const root = temp("mdkg-public-seed-");
    quiet(() => runInitCommand({root, ...options}));
    assert.equal(fs.existsSync(path.join(root,"AGENTS.md")), name !== "graph-only");
    assert.equal(fs.existsSync(path.join(root,".mdkg/graph.json")), false);
    cli(root,["validate","--json"]);
    assertCompatibilityAliases(root);
    cli(root,["new","task","First independently authored work","--status","todo"]);
    const plan = planLegacyIdentityMigration(root, {graphId:"e7403372-f270-4cd7-902d-64b792c781df",origin:"ddf626b6-073f-4f99-9d30-5e30912922fd"});
    assert.deepEqual(plan.blocking, []);
    applyGraphMigrationPlan(root,plan,plan.plan_hash);
    cli(root,["validate","--json"]);
    assertCompatibilityAliases(root);
    cli(root,["show","task-1","--json"]);
    cli(root,["pack","task-1","--pack-profile","concise","--dry-run","--stats"]);
    const task = fs.readdirSync(path.join(root,".mdkg/work")).find(file=>file.startsWith("task-1-"))!;
    assert.match(fs.readFileSync(path.join(root,".mdkg/work",task),"utf8"), /^node_id: /m);
  });
}

test("customized legacy guidance retains its references during init and reviewed safe upgrades", () => {
  const root = temp("mdkg-public-seed-custom-");
  quiet(() => runInitCommand({root}));
  const file = path.join(root,".mdkg/core/COLLABORATION.md");
  const custom = fs.readFileSync(file,"utf8").replace(/^refs:.*$/m,"refs: [dec-999]") + "\nProject-authored constraint.\n";
  fs.writeFileSync(file,custom);
  fs.writeFileSync(path.join(root,"README.md"),"Project documentation\n");
  quiet(() => runInitCommand({root}));
  assert.equal(fs.readFileSync(file,"utf8"),custom);
  fs.unlinkSync(path.join(root,".mdkg/AGENT_START.md"));
  const only=[".mdkg/AGENT_START.md"], receipt = quiet(()=>runUpgradeCommand({root,only}));
  assert.equal(receipt.safe_to_apply,true);
  quiet(()=>runUpgradeCommand({root,only,apply:true,planHash:receipt.plan_hash}));
  assert.equal(fs.readFileSync(file,"utf8"),custom);
  assert.equal(fs.readFileSync(path.join(root,"README.md"),"utf8"),"Project documentation\n");
  const migration=planLegacyIdentityMigration(root,{graphId:"e7403372-f270-4cd7-902d-64b792c781df",origin:"ddf626b6-073f-4f99-9d30-5e30912922fd"});
  assert.ok(migration.blocking.some((reason:string)=>reason.includes("dec-999")), "unbound user reference must remain an explicit migration blocker");
});
