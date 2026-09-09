const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { spawnSync } = require("node:child_process");

// Exercise installed CLI bytes; do not import graph implementation or expose a
// production fault flag. All repository and filesystem operations are fixtures.
function exerciseInstalledGraphRecovery(bin, ownedRoot, suppliedEnv = process.env) {
  const base = path.join(ownedRoot, "installed-graph-recovery"); fs.mkdirSync(base);
  const env = { ...suppliedEnv, GIT_CONFIG_NOSYSTEM: "1", GIT_CONFIG_GLOBAL: process.platform === "win32" ? "NUL" : "/dev/null" };
  const binary = process.platform === "win32" && bin.endsWith(".cmd") ? path.join(path.dirname(bin), "node_modules/mdkg/dist/cli.js") : bin;
  const run = (root, args, fault) => spawnSync(process.execPath, [...(fault ? ["--require", preload] : []), binary, ...args],
    { cwd: root, env: { ...env, ...(fault ? { MDKG_FIXTURE_ROOT: root, MDKG_FIXTURE_TARGETS: JSON.stringify(fault.paths), MDKG_FIXTURE_FAULT: String(fault.index) } : {}) },
      encoding: "utf8", timeout: 60000, maxBuffer: 16 * 1024 * 1024 });
  const cli = (root, args) => { const r = run(root, [...args, "--json"]); assert.equal(r.status, 0, `${args.join(" ")}\n${r.stderr}\n${r.stdout}`); return JSON.parse(r.stdout); };
  const git = (root, args) => { const r = spawnSync(process.env.GIT || "git", ["-c", "user.name=mdkg fixture", "-c", "user.email=fixture@example.invalid", ...args], {cwd:root,env,encoding:"utf8",timeout:60000}); assert.equal(r.status,0,r.stderr); return r.stdout.trim(); };
  const digest = data => crypto.createHash("sha256").update(data).digest("hex");
  const read = (root, p) => fs.existsSync(path.join(root,p)) ? fs.readFileSync(path.join(root,p),"utf8") : null;
  const snapshot = (root, authored = false) => {
    const result = {}; const visit = dir => {
      for (const e of fs.readdirSync(dir,{withFileTypes:true})) {
        const file=path.join(dir,e.name), relative=path.relative(root,file).split(path.sep).join("/");
        if(authored && [".mdkg/state", ".mdkg/index"].includes(relative))continue;
        if(e.isDirectory())visit(file);
        else {assert.ok(e.isFile(),"unexpected fixture file type "+relative); result[relative]=digest(fs.readFileSync(file));}
      }
    };visit(root);return result;
  };
  const unchangedRefusal = (root,args,pattern) => {
    const before=snapshot(root), r=run(root,args);assert.notEqual(r.status,0,args.join(" "));
    assert.equal(r.signal,null);assert.equal(r.error,undefined);assert.match(r.stdout+r.stderr,pattern);assert.deepEqual(snapshot(root),before,"refusal must preserve every file");
  };
  const preload = path.join(base,"fault.cjs");
  fs.writeFileSync(preload, `const fs=require('node:fs'),path=require('node:path');
const root=fs.realpathSync(process.env.MDKG_FIXTURE_ROOT);
if(process.cwd()!==root||!root.startsWith(${JSON.stringify(base+path.sep)}))throw Error('graph fault fixture boundary');
const targets=JSON.parse(process.env.MDKG_FIXTURE_TARGETS).map(p=>path.resolve(root,p));
if(targets.some(p=>!p.startsWith(root+path.sep)))throw Error('graph fault target boundary');
let count=0;const finish=p=>{if(targets.includes(path.resolve(String(p)))&&count++===Number(process.env.MDKG_FIXTURE_FAULT))throw Error('installed graph fixture interruption');};
const open=fs.openSync,close=fs.closeSync,rename=fs.renameSync,remove=fs.rmSync,handles=new Map();
fs.openSync=function(p,flags){const fd=open.apply(this,arguments);if(typeof flags==='number'&&(flags&fs.constants.O_WRONLY)&&targets.includes(path.resolve(String(p))))handles.set(fd,p);return fd;};
fs.closeSync=function(fd){const p=handles.get(fd);handles.delete(fd);const out=close.apply(this,arguments);if(p)finish(p);return out;};
fs.renameSync=function(a,b){const out=rename.apply(this,arguments);finish(b);return out;};
fs.rmSync=function(p){const out=remove.apply(this,arguments);finish(p);return out;};\n`);

  const seed=path.join(base,"legacy-seed");fs.mkdirSync(seed);
  const init=run(seed,["init","--graph-only"]);assert.equal(init.status,0,init.stderr);
  const common=cli(seed,["new","task","Recovery common"]).node;
  const obsolete=cli(seed,["new","task","Recovery obsolete"]).node;
  git(seed,["init","-b","main"]);
  git(seed,["add","--",".gitignore",".mdkg/config.json",".mdkg/core",".mdkg/templates",".mdkg/work"]);
  git(seed,["commit","-m","legacy recovery seed"]);
  const ancestor=git(seed,["rev-parse","HEAD"]);
  const v2=path.join(base,"v2-seed");fs.cpSync(seed,v2,{recursive:true,errorOnExist:true,force:false});
  const migrateArgs=["graph","migrate","--graph-id",crypto.randomUUID(),"--origin",crypto.randomUUID(),"--ancestor",ancestor];
  const migrated=cli(v2,migrateArgs);assert.deepEqual(migrated.blocking,[]);
  cli(v2,[...migrateArgs,"--apply","--plan-hash",migrated.plan_hash]);
  git(v2,["add","--",...migrated.writes.map(w=>w.path)]);git(v2,["commit","-m","adopted recovery seed"]);
  const v2Ancestor=git(v2,["rev-parse","HEAD"]);
  const incoming=path.join(base,"incoming");git(base,["clone","--no-local",v2,incoming]);
  cli(incoming,["task","update",common.id,"--priority","2"]);
  const added=cli(incoming,["new","task","Incoming recovery work","--refs",common.id]).node;
  const linked=cli(incoming,["new","task","Incoming recovery link","--refs",added.id]).node;
  git(incoming,["rm","--",obsolete.path]);
  git(incoming,["add","--",common.path,added.path,linked.path]);git(incoming,["commit","-m","reviewable deletion edit and cross-links"]);
  const incomingRevision=git(incoming,["rev-parse","HEAD"]);
  const cases=[];
  for(const kind of ["migration","reconciliation"])for(const mode of ["resume","rollback"])for(const position of ["first","middle","last"]){
    const root=path.join(base,`${kind}-${mode}-${position}`);fs.cpSync(kind==="migration"?seed:v2,root,{recursive:true,errorOnExist:true,force:false});
    if(kind==="reconciliation")git(root,["fetch",incoming,"main:refs/heads/fixture-incoming"]);
    fs.writeFileSync(path.join(root,"user-notes.txt"),"Unrelated staged user bytes.\r\n");git(root,["add","--","user-notes.txt"]);
    const gitIndex=fs.readFileSync(path.join(root,".git/index"));
    const args=kind==="migration"?["graph","migrate","--graph-id",crypto.randomUUID(),"--origin",crypto.randomUUID(),"--ancestor",ancestor]:["graph","reconcile","--ancestor",v2Ancestor,"--incoming",incomingRevision];
    const before=snapshot(root,true),plan=cli(root,args);assert.deepEqual(plan.blocking,[]);assert.ok(plan.writes.length>3);
    const faultIndex=position==="first"?0:position==="last"?plan.writes.length-1:Math.floor(plan.writes.length/2);
    const interrupted=run(root,[...args,"--apply","--plan-hash",plan.plan_hash,"--json"],{paths:plan.writes.map(w=>w.path),index:faultIndex});
    assert.notEqual(interrupted.status,0);assert.match(interrupted.stdout+interrupted.stderr,/installed graph fixture interruption/);
    const journalPath=path.join(root,".mdkg/state/identity-transactions",plan.plan_hash.slice(7)+".json");
    const journal=JSON.parse(fs.readFileSync(journalPath));assert.equal(journal.state,"applying");
    const observed=journal.plan.writes.filter(w=>read(root,w.path)===w.after).length;assert.equal(observed,faultIndex+1,"interrupt after exact authored operation count");
    const paused=snapshot(root),inspection=cli(root,["graph","recover",plan.plan_hash]);assert.deepEqual(snapshot(root),paused);
    assert.equal(inspection.state,"applying");assert.equal(inspection.completed_write_paths.length,observed);
    assert.equal(fs.existsSync(path.join(root,".mdkg/index/write.lock")),false);
    if(process.platform!=="win32")assert.equal(fs.statSync(journalPath).mode&0o777,0o600);
    if(position==="middle"){
      const op=journal.plan.writes.find(w=>w.after!==null&&w.path.endsWith(".md")&&read(root,w.path)===w.after);assert.ok(op);
      const file=path.join(root,op.path),bytes=fs.readFileSync(file);fs.appendFileSync(file,"\nSynthetic later user edit.\n");
      unchangedRefusal(root,["graph","recover",plan.plan_hash,"--"+mode,"--json"],/custody collision/);fs.writeFileSync(file,bytes);
      const dependency=Object.keys(journal.plan.dependency_files).find(p=>p.startsWith(".mdkg/templates/")&&fs.statSync(path.join(root,p)).isFile());assert.ok(dependency);
      const depPath=path.join(root,dependency),depBytes=fs.readFileSync(depPath);fs.appendFileSync(depPath,"\n");
      unchangedRefusal(root,["graph","recover",plan.plan_hash,"--"+mode,"--json"],/dependency|template|control baseline/);fs.writeFileSync(depPath,depBytes);
      // Toggle fixture index metadata without adding an unrelated loose object
      // that would make the harness itself change the rollback inventory.
      git(root,["update-index","--assume-unchanged","user-notes.txt"]);
      assert.notDeepEqual(fs.readFileSync(path.join(root,".git/index")),gitIndex);
      unchangedRefusal(root,["graph","recover",plan.plan_hash,"--"+mode,"--json"],/control baseline/);
      // Restore only exact synthetic fixture bytes captured above. This is not
      // a product recovery mechanism for user data or Git state.
      fs.writeFileSync(path.join(root,".git/index"),gitIndex);
      if(mode==="rollback"){
        const failed=run(root,["graph","recover",plan.plan_hash,"--rollback","--json"],{paths:plan.writes.map(w=>w.path),index:0});
        assert.notEqual(failed.status,0);assert.match(failed.stdout+failed.stderr,/installed graph fixture interruption/);
        assert.equal(JSON.parse(fs.readFileSync(journalPath)).state,"rolling-back");
        unchangedRefusal(root,["graph","recover",plan.plan_hash,"--resume","--json"],/rollback was requested/);
      }
    }
    const result=cli(root,["graph","recover",plan.plan_hash,"--"+mode]);assert.equal(result.state,mode==="resume"?"applied":"rolled-back");
    for(const w of journal.plan.writes)assert.equal(read(root,w.path),w[mode==="resume"?"after":"before"],w.path);
    assert.deepEqual(fs.readFileSync(path.join(root,".git/index")),gitIndex);
    if(mode==="rollback")assert.deepEqual(snapshot(root,true),before,"rollback must restore all authored/Git files exactly");
    else for(const p of Object.keys(before).filter(p=>p.startsWith(".git/")||p==="user-notes.txt"))assert.equal(snapshot(root,true)[p],before[p]);
    cli(root,["validate"]);
    const terminal=snapshot(root);cli(root,["graph","recover",plan.plan_hash,"--"+mode]);assert.deepEqual(snapshot(root),terminal,"terminal recovery is observational");
    cases.push({kind,mode,position,writes:plan.writes.length,observed_written:observed,state:result.state,git_index_preserved:true,user_bytes_preserved:true,dependency_and_control_refused:position==="middle",rollback_interruption_verified:mode==="rollback"&&position==="middle"});
  }
  return {runtime:process.version,cases,fault_preload_sha256:digest(fs.readFileSync(preload)),limitations:["Error interruption after real filesystem operations, not SIGKILL or power-loss durability.","First/middle/last boundaries sampled; not every operation position."]};
}
module.exports={exerciseInstalledGraphRecovery};
