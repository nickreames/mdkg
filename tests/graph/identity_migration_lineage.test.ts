import { test, after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import { makeTempDir, writeFile } from "../helpers/fs";
import { writeRootConfig } from "../helpers/config";
import { writeDefaultTemplates } from "../helpers/templates";
import { reviewedFixtureRecovery } from "../helpers/identity_recovery";

const runtime=process.env.MDKG_TEST_PACKAGE?path.join(process.env.MDKG_TEST_PACKAGE,"dist"):path.resolve(__dirname,"../..");
const {planLegacyIdentityMigration}=require(path.join(runtime,"graph/identity_migration"));
const transaction=require(path.join(runtime,"graph/identity_transaction"));
const {applyGraphMigrationPlan}=transaction;
const continueGraphTransaction=reviewedFixtureRecovery(transaction);
const roots:string[]=[];
const GRAPH="e7403372-f270-4cd7-902d-64b792c781df",ORIGIN="ddf626b6-073f-4f99-9d30-5e30912922fd";
after(()=>{for(const root of roots)fs.rmSync(root,{recursive:true,force:true});});
function git(root:string,args:string[]){const r=spawnSync("git",["-c","user.name=mdkg test","-c","user.email=mdkg-test@example.invalid",...args],{cwd:root,encoding:"utf8"});assert.equal(r.status,0,r.stderr+r.stdout);return r.stdout.trim();}
function bytes(root:string){const files:Record<string,string>={};function visit(dir:string){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const file=path.join(dir,e.name);if(e.isDirectory())visit(file);else if(e.isFile())files[path.relative(root,file)]=crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");}}visit(root);return files;}
function fixture(){const root=makeTempDir("mdkg-legacy-lineage-");roots.push(root);writeRootConfig(root);writeDefaultTemplates(root);writeFile(path.join(root,".mdkg/core/core.md"),"# core\n");
 const created=spawnSync(process.execPath,[path.join(runtime,"cli.js"),"new","task","Ancestor node","--json"],{cwd:root,encoding:"utf8"});assert.equal(created.status,0,created.stderr);
 const file=JSON.parse(created.stdout).node.path,original=fs.readFileSync(path.join(root,file),"utf8");git(root,["init","-qb","main"]);git(root,["add",".mdkg/config.json",".mdkg/templates",file]);git(root,["commit","-qm","accepted ancestor"]);const ancestor=git(root,["rev-parse","HEAD"]);
 return {root,file,original,ancestor,plan:()=>planLegacyIdentityMigration(root,{graphId:GRAPH,origin:ORIGIN,ancestor})};
}

for(const mode of ["distinct recreation","byte-identical restoration","working-tree recreation","staged deletion and recreated file","rename away and back","alias changed and restored"]){
 test(`legacy ${mode} requires reviewed provenance rather than matching alias/path`,()=>{
  const f=fixture(),absolute=path.join(f.root,f.file);
  if(mode==="rename away and back"){
   git(f.root,["mv",f.file,".mdkg/work/task-1-moved.md"]);git(f.root,["commit","-qm","move away"]);git(f.root,["mv",".mdkg/work/task-1-moved.md",f.file]);git(f.root,["commit","-qm","return path"]);
  }else if(mode==="alias changed and restored"){
   fs.writeFileSync(absolute,f.original.replace("id: task-1","id: task-2"));git(f.root,["add",f.file]);git(f.root,["commit","-qm","reuse path for different alias"]);fs.writeFileSync(absolute,f.original);git(f.root,["add",f.file]);git(f.root,["commit","-qm","return alias"]);
  }else{
   git(f.root,["rm",f.file]);
   if(mode!=="staged deletion and recreated file")git(f.root,["commit","-qm","delete predecessor"]);
   writeFile(absolute,mode==="byte-identical restoration"?f.original:f.original.replace("Ancestor node","Different new intent"));
   if(!["working-tree recreation","staged deletion and recreated file"].includes(mode)){git(f.root,["add",f.file]);git(f.root,["commit","-qm","recreate alias"]);}
  }
  const before=bytes(f.root),plan=f.plan();assert.deepEqual(bytes(f.root),before,"preview must preserve Git and authored state");
  assert.ok(plan.blocking.some((s:string)=>/continuity|recreation|provenance/i.test(s)),JSON.stringify(plan.mappings));
 });
}

test("uninterrupted committed and uncommitted edits retain accepted ancestor identity",()=>{
 const f=fixture(),initial=f.plan().mappings[0].stable_ref;
 fs.appendFileSync(path.join(f.root,f.file),"\nAccepted continuing work.\n");git(f.root,["add",f.file]);git(f.root,["commit","-qm","normal edit"]);fs.appendFileSync(path.join(f.root,f.file),"\nUncommitted continuing work.\n");
 const before=bytes(f.root),plan=f.plan();assert.deepEqual(plan.blocking,[]);assert.equal(plan.mappings[0].stable_ref,initial);assert.deepEqual(bytes(f.root),before);
});

test("legacy migration refuses shallow history without changing it",()=>{
 const f=fixture();fs.appendFileSync(path.join(f.root,f.file),"\nCurrent change.\n");git(f.root,["add",f.file]);git(f.root,["commit","-qm","change"]);
 // Owned fixture metadata models the missing history boundary, never canonical Git.
 fs.writeFileSync(path.join(f.root,".git/shallow"),f.ancestor+"\n");const before=bytes(f.root);
 assert.throws(()=>f.plan(),/complete local history|shallow/);assert.deepEqual(bytes(f.root),before);
});

function recreate(f:ReturnType<typeof fixture>){
 git(f.root,["rm",f.file]);git(f.root,["commit","-qm","delete predecessor"]);
 writeFile(path.join(f.root,f.file),f.original);git(f.root,["add",f.file]);git(f.root,["commit","-qm","Revert: a message is not provenance"]);
}
function chosen(f:ReturnType<typeof fixture>,take="restore-ancestor"){
 const preview=f.plan();const review=preview.continuity_reviews.find((entry:any)=>entry.qid==="root:task-1");assert.ok(review);
 return {"root:task-1":{take,reason:"Owner reviewed lineage and all current inbound bindings",review_hash:review.review_hash}};
}
for(const take of ["restore-ancestor","new-identity"]){
 test(`explicit ${take} preserves bodies and binds current cross-links without staging`,()=>{
  const f=fixture(),originalRef=f.plan().mappings[0].stable_ref;recreate(f);
  const cross=f.original.replace("id: task-1","id: task-2").replace("refs: []","refs: [task-1]")+"\nHistorical receipt says task-1; do not rewrite this body.\n";
  const crossPath=".mdkg/work/task-2-current-link.md";writeFile(path.join(f.root,crossPath),cross);
  const decisions=chosen(f,take),parameters={graphId:GRAPH,origin:ORIGIN,ancestor:f.ancestor,decisions};
  const before=bytes(f.root),plan=planLegacyIdentityMigration(f.root,parameters);
  assert.deepEqual(bytes(f.root),before);assert.deepEqual(plan.blocking,[]);assert.deepEqual(plan,planLegacyIdentityMigration(f.root,parameters));
  const mapped=plan.mappings.find((entry:any)=>entry.qid==="root:task-1");
  if(take==="restore-ancestor")assert.equal(mapped.stable_ref,originalRef);else assert.notEqual(mapped.stable_ref,originalRef);
  const operation=plan.writes.find((entry:any)=>entry.path===crossPath);
  assert.ok(operation.after.includes(mapped.stable_ref));assert.ok(operation.after.endsWith("Historical receipt says task-1; do not rewrite this body.\n"));
  const index=git(f.root,["ls-files","--stage"]);applyGraphMigrationPlan(f.root,plan,plan.plan_hash);
  assert.equal(git(f.root,["ls-files","--stage"]),index);
  const receipt=JSON.parse(fs.readFileSync(path.join(f.root,plan.receipt_path),"utf8"));
  assert.deepEqual(receipt.decisions,decisions);assert.ok(receipt.lineage.revisions.length>=3);assert.match(receipt.provenance_limit,/indistinguishable/);
 });
}

test("review choices reject unknown, unused, malformed and stale evidence",()=>{
 const f=fixture();assert.throws(()=>planLegacyIdentityMigration(f.root,{graphId:GRAPH,origin:ORIGIN,ancestor:f.ancestor,decisions:{"root:task-1":{take:"new-identity",reason:"not needed",review_hash:"x"}}}),/unused/);
 recreate(f);const decisions=chosen(f),params={graphId:GRAPH,origin:ORIGIN,ancestor:f.ancestor};
 for(const changed of [{...decisions["root:task-1"],reason:" "},{...decisions["root:task-1"],take:"automatic"},{...decisions["root:task-1"],extra:true}]){
  assert.throws(()=>planLegacyIdentityMigration(f.root,{...params,decisions:{"root:task-1":changed}}),/invalid or stale/);
 }
 fs.appendFileSync(path.join(f.root,f.file),"\nNew work changes reviewed provenance.\n");const before=bytes(f.root);
 assert.throws(()=>planLegacyIdentityMigration(f.root,{...params,decisions}),/invalid or stale/);assert.deepEqual(bytes(f.root),before);
});

test("history loss after preview or interruption prevents application and resume",()=>{
 for(const interrupted of [false,true]){
  const f=fixture();fs.appendFileSync(path.join(f.root,f.file),"\nContinuous edit.\n");git(f.root,["add",f.file]);git(f.root,["commit","-qm","edit"]);const plan=f.plan();
  if(interrupted)assert.throws(()=>applyGraphMigrationPlan(f.root,plan,plan.plan_hash,{afterWrite:()=>{throw new Error("fixture interruption");}}),/fixture interruption/);
  fs.writeFileSync(path.join(f.root,".git/shallow"),f.ancestor+"\n");const before=bytes(f.root);
  assert.throws(()=>interrupted?continueGraphTransaction(f.root,plan.plan_hash,"resume"):applyGraphMigrationPlan(f.root,plan,plan.plan_hash),/complete local history/);
  assert.deepEqual(bytes(f.root),before);
 }
});

test("both preserved merge lineages retain identity but one recreated parent requires review",()=>{
 for(const changed of [false,true]){
  const f=fixture();git(f.root,["checkout","-qb","side"]);
  if(changed)recreate(f);else{writeFile(path.join(f.root,"side.txt"),"side\n");git(f.root,["add","side.txt"]);git(f.root,["commit","-qm","side"]);}
  git(f.root,["checkout","-q","main"]);writeFile(path.join(f.root,"main.txt"),"main\n");git(f.root,["add","main.txt"]);git(f.root,["commit","-qm","main"]);git(f.root,["merge","--no-ff","-m","integrate side","side"]);
  const before=bytes(f.root),plan=f.plan();assert.deepEqual(bytes(f.root),before);
  if(changed)assert.ok(plan.continuity_reviews.length);else assert.deepEqual(plan.blocking,[]);
 }
});

test("merged side branch predating accepted ancestor is not silently omitted",()=>{
 const f=fixture();git(f.root,["branch","side"]);fs.appendFileSync(path.join(f.root,f.file),"\nAccepted later edit.\n");git(f.root,["add",f.file]);git(f.root,["commit","-qm","later accepted ancestor"]);const ancestor=git(f.root,["rev-parse","HEAD"]);
 git(f.root,["checkout","-q","side"]);writeFile(path.join(f.root,"side.txt"),"side\n");git(f.root,["add","side.txt"]);git(f.root,["commit","-qm","pre-ancestor side work"]);git(f.root,["checkout","-q","main"]);git(f.root,["merge","--no-ff","-m","merge old side","side"]);
 const before=bytes(f.root),plan=planLegacyIdentityMigration(f.root,{graphId:GRAPH,origin:ORIGIN,ancestor});assert.deepEqual(bytes(f.root),before);
 assert.ok(plan.continuity_reviews[0].reasons.some((reason:string)=>reason.includes("predates")));
});

test("migration CLI consumes exact reviewed QID decisions without writing during preview",()=>{
 const f=fixture();recreate(f);const decisions=chosen(f),decisionPath="migration-decisions.json";writeFile(path.join(f.root,decisionPath),JSON.stringify(decisions));
 const args=[path.join(runtime,"cli.js"),"graph","migrate","--graph-id",GRAPH,"--origin",ORIGIN,"--ancestor",f.ancestor,"--decisions",decisionPath,"--json"];
 const before=bytes(f.root),preview=spawnSync(process.execPath,args,{cwd:f.root,encoding:"utf8"});assert.equal(preview.status,0,preview.stderr);assert.deepEqual(bytes(f.root),before);
 const plan=JSON.parse(preview.stdout);assert.equal(plan.safe_to_apply,true);
 const apply=spawnSync(process.execPath,[...args,"--apply","--plan-hash",plan.plan_hash],{cwd:f.root,encoding:"utf8"});assert.equal(apply.status,0,apply.stderr);
});

test("staged duplicate with a newline filename is included in lineage review",()=>{
 const f=fixture(),duplicate=".mdkg/work/task-1-\ncopy.md";writeFile(path.join(f.root,duplicate),f.original);
 git(f.root,["add",duplicate]);fs.unlinkSync(path.join(f.root,duplicate));const before=bytes(f.root),plan=f.plan();
 assert.deepEqual(bytes(f.root),before);assert.ok(plan.blocking.length);
 assert.equal(plan.continuity_reviews[0].observations.find((entry:any)=>entry.at==="index").nodes.length,2);
});

test("null and array decision documents fail closed in API and CLI",()=>{
 const f=fixture();for(const decisions of [null,[]]){
  assert.throws(()=>planLegacyIdentityMigration(f.root,{graphId:GRAPH,origin:ORIGIN,ancestor:f.ancestor,decisions}),/object keyed by legacy QID/);
  writeFile(path.join(f.root,"decisions.json"),JSON.stringify(decisions));const before=bytes(f.root);
  const result=spawnSync(process.execPath,[path.join(runtime,"cli.js"),"graph","migrate","--graph-id",GRAPH,"--origin",ORIGIN,"--ancestor",f.ancestor,"--decisions","decisions.json"],{cwd:f.root,encoding:"utf8"});
  assert.equal(result.status,1);assert.match(result.stderr,/object keyed by legacy QID/);assert.deepEqual(bytes(f.root),before);
 }
});

test("legacy journals lacking continuity evidence can roll back exact owned bytes but cannot resume",()=>{
 const f=fixture(),plan=f.plan();delete plan.legacy_lineage;
 const {graphPlanHash}=require(path.join(runtime,"graph/identity_migration"));const {plan_hash:ignored,...body}=plan;plan.plan_hash=graphPlanHash(body);
 const journalPath=path.join(f.root,".mdkg/state/identity-transactions",plan.plan_hash.slice(7)+".json");
 writeFile(journalPath,JSON.stringify({schema_version:1,state:"applying",plan}));writeFile(path.join(f.root,plan.writes[0].path),plan.writes[0].after);
 const before=bytes(f.root);assert.throws(()=>continueGraphTransaction(f.root,plan.plan_hash,"resume"),/lacks reviewed continuity/);assert.deepEqual(bytes(f.root),before);
 const result=continueGraphTransaction(f.root,plan.plan_hash,"rollback");assert.equal(result.state,"rolled-back");assert.equal(fs.readFileSync(path.join(f.root,f.file),"utf8"),f.original);
});

test("partial/promisor history is refused without contacting a remote",()=>{
 const f=fixture();git(f.root,["config","remote.fixture.url",path.join(f.root,"nonexistent-remote")]);
 for(const value of ["true","2"]){git(f.root,["config","remote.fixture.promisor",value]);
  const before=bytes(f.root);assert.throws(()=>f.plan(),/partial\/promisor/);assert.deepEqual(bytes(f.root),before);
 }
});

test("generated lineage evidence must fit per-file, aggregate and file-count budgets before application",()=>{
 for(const limit of ["max_file_bytes","max_total_bytes","max_files"]){
  const f=fixture();
  // Keep only the task schema in this owned fixture so the low graph budget
  // reaches generated-evidence validation, not unrelated template discovery.
  const templateRoot=path.join(f.root,".mdkg/templates/default");
  for(const name of fs.readdirSync(templateRoot))if(name.endsWith(".md")&&name!=="task.md")fs.unlinkSync(path.join(templateRoot,name));
  fs.unlinkSync(path.join(f.root,".mdkg/core/core.md"));
  const initial=f.plan(),receipt=initial.writes.find((entry:any)=>entry.path===initial.receipt_path).after;
  const authoredBytes=initial.writes.filter((entry:any)=>entry.path.endsWith(".md")).reduce((sum:number,entry:any)=>sum+Buffer.byteLength(entry.after),0);
  const configPath=path.join(f.root,".mdkg/config.json"),config=JSON.parse(fs.readFileSync(configPath,"utf8"));
  const {loadConfig}=require(path.join(runtime,"core/config"));
  config.index={...config.index,limits:{...loadConfig(f.root).index.limits,[limit]:limit==="max_files"?1:Buffer.byteLength(receipt)+(limit==="max_total_bytes"?authoredBytes:0)-1}};
  writeFile(configPath,JSON.stringify(config));const before=bytes(f.root),plan=f.plan();assert.deepEqual(bytes(f.root),before);
  assert.ok(plan.blocking.some((reason:string)=>/generated migration evidence.*limits/.test(reason)),limit);
  assert.throws(()=>applyGraphMigrationPlan(f.root,plan,plan.plan_hash),/blocked/);assert.deepEqual(bytes(f.root),before);
 }
});

test("grafted or missing historical objects refuse preview without guessing continuity",()=>{
 for(const mode of ["graft","missing-blob"]){
  const f=fixture();
  if(mode==="graft")writeFile(path.join(f.root,".git/info/grafts"),f.ancestor+"\n");
  else{const object=git(f.root,["rev-parse",`${f.ancestor}:${f.file}`]);assert.match(object,/^[0-9a-f]{40,64}$/);fs.unlinkSync(path.join(f.root,".git/objects",object.slice(0,2),object.slice(2)));}
  const before=bytes(f.root);assert.throws(()=>f.plan(),/graft|missing graph input|unable to read local Git/);assert.deepEqual(bytes(f.root),before);
 }
});

test("unchanged authored bytes do not let old decisions survive new HEAD or staged inputs",()=>{
 for(const mode of ["head","index"]){
  const f=fixture();recreate(f);const decisions=chosen(f);
  if(mode==="head")git(f.root,["commit","--allow-empty","-qm","new history"]);
  else{writeFile(path.join(f.root,"unrelated.txt"),"staged input\n");git(f.root,["add","unrelated.txt"]);}
  const before=bytes(f.root);assert.throws(()=>planLegacyIdentityMigration(f.root,{graphId:GRAPH,origin:ORIGIN,ancestor:f.ancestor,decisions}),/invalid or stale/);assert.deepEqual(bytes(f.root),before);
 }
});
