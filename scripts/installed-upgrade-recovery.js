const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { runFixtureNode } = require("./qualification-process");
const { acceptOwnedGitFixture } = require("./qualification-git");

function exerciseInstalledUpgradeRecovery(candidate, published, ownedRoot, suppliedEnv = process.env) {
  const base = path.join(ownedRoot, "installed-upgrade-recovery"); fs.mkdirSync(base);
  const fixtureGit = acceptOwnedGitFixture(ownedRoot, suppliedEnv), env = fixtureGit.environment;
  const preload = path.join(base, "fault.cjs");
  // Instrument only node:fs in a disposable CLI process. The installed package
  // remains byte-identical, and no production fault-injection flag is added.
  fs.writeFileSync(preload, `const fs=require('node:fs'),path=require('node:path');
const root=fs.realpathSync(process.env.MDKG_FIXTURE_ROOT);
if(process.cwd()!==root||!root.startsWith(${JSON.stringify(base + path.sep)}))throw Error('fault fixture boundary');
const targets=JSON.parse(process.env.MDKG_FIXTURE_TARGETS).map(p=>path.resolve(root,p));
if(targets.some(p=>!p.startsWith(root+path.sep)))throw Error('fault target boundary');
const rename=fs.renameSync;let index=0;
fs.renameSync=function(a,b){const result=rename.apply(this,arguments);if(targets.includes(path.resolve(String(b)))&&index++===Number(process.env.MDKG_FIXTURE_FAULT)){throw Error('installed fixture interrupted after authored write');}return result;};\n`);
  const run = (root, bin, args, extra = {}) => runFixtureNode(ownedRoot, bin, args,
    { cwd: root, env: { ...env, ...extra.env }, nodeArgs: extra.preload ? ["--require", preload] : [], timeout: 60000, maxBuffer: 16 * 1024 * 1024 });
  const cli = (root, bin, args) => {
    const r = run(root, bin, [...args, "--json"]);
    assert.equal(r.status, 0, `${args.join(" ")}\n${r.stderr}\n${r.stdout}`); return JSON.parse(r.stdout);
  };
  const bytes = file => fs.existsSync(file) ? fs.readFileSync(file) : null;
  const snapshot = (root, authored = false) => {
    const result = {}; const visit = dir => {
      for (const e of fs.readdirSync(dir, { withFileTypes: true }).sort((a,b)=>a.name.localeCompare(b.name))) {
        const file=path.join(dir,e.name), relative=path.relative(root,file).split(path.sep).join("/");
        if (authored && [".mdkg/state", ".mdkg/index"].includes(relative)) continue;
        if(e.isDirectory())visit(file);else if(e.isFile())result[relative]=crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
        else throw Error("unexpected fixture file type: "+relative);
      }
    }; visit(root); return result;
  };
  const cases=[];
  for (const mode of ["resume", "recover"]) for (const position of ["first", "middle", "last"]) {
    const root=path.join(base,mode+"-"+position); fs.mkdirSync(root);
    const init=run(root,published,["init","--agent"]); assert.equal(init.status,0,init.stderr);
    fs.writeFileSync(path.join(root,"unknown.txt"),"Preserve unrelated user bytes.\r\n");
    const git=fixtureGit.run(root,["init","-q"]);assert.equal(git.status,0,git.stderr);
    const staged=fixtureGit.run(root,["add","--","unknown.txt"]);assert.equal(staged.status,0,staged.stderr);
    const initial=snapshot(root), reviewed=cli(root,candidate,["upgrade"]);
    assert.deepEqual(snapshot(root),initial,"fresh preview must preserve all fixture and Git bytes");
    assert.equal(cli(root,candidate,["upgrade"]).plan_hash,reviewed.plan_hash);
    assert.deepEqual(snapshot(root),initial,"repeated preview must be observational");
    const wrapper=position==="middle"?"CLAUDE.md":"AGENTS.md";
    const userEdit="\r\nUser instruction added after upgrade review.\r\n";
    fs.appendFileSync(path.join(root,wrapper),userEdit);
    const editedWrapper=fs.readFileSync(path.join(root,wrapper),"utf8");
    const edited=snapshot(root), stale=run(root,candidate,["upgrade","--apply","--plan-hash",reviewed.plan_hash,"--json"]);
    assert.equal(stale.signal,null); assert.notEqual(stale.status,0);
    assert.match(stale.stderr+stale.stdout,/stale plans are refused/);
    assert.deepEqual(snapshot(root),edited,"stale apply must preserve all edited fixture and Git bytes");
    assert.equal(fs.existsSync(path.join(root,".mdkg/state/upgrade-journal.json")),false,"stale plan must not create a recovery journal");
    const plan=cli(root,candidate,["upgrade"]);
    assert.notEqual(plan.plan_hash,reviewed.plan_hash,"new user bytes require a newly reviewed plan");
    assert.deepEqual(snapshot(root),edited,"fresh re-review must not mutate the edited fixture");
    const before=snapshot(root,true);
    assert.equal(plan.safe_to_apply,true);
    assert.ok(plan.will_write_paths.length>3);
    const fault=position==="first"?0:position==="last"?plan.will_write_paths.length-1:Math.floor(plan.will_write_paths.length/2);
    const interrupted=run(root,candidate,["upgrade","--apply","--plan-hash",plan.plan_hash,"--json"],{preload:true,env:{MDKG_FIXTURE_ROOT:root,MDKG_FIXTURE_TARGETS:JSON.stringify(plan.will_write_paths),MDKG_FIXTURE_FAULT:String(fault)}});
    assert.notEqual(interrupted.status,0);
    assert.match(interrupted.stderr+interrupted.stdout,/installed fixture interrupted after authored write/);
    const journalPath=path.join(root,".mdkg/state/upgrade-journal.json");
    const journal=JSON.parse(fs.readFileSync(journalPath,"utf8"));
    assert.equal(journal.state,"applying"); assert.equal(journal.plan_hash,plan.plan_hash);
    assert.equal(fs.existsSync(path.join(root,".mdkg/index/write.lock")),false);
    const observedAfter=journal.operations.filter(op=>{
      const actual=bytes(path.join(root,op.path)); return (actual===null?null:actual.toString("base64"))===op.after;
    }).length;
    assert.equal(observedAfter,fault+1,"fault must occur at the selected actual write boundary");
    const paused=snapshot(root), refused=run(root,candidate,["upgrade","--json"]);
    assert.notEqual(refused.status,0);assert.match(refused.stderr+refused.stdout,/unfinished upgrade/);
    assert.deepEqual(snapshot(root),paused);
    if(position==="middle") {
      const op=journal.operations.find(op=>op.after!==null && bytes(path.join(root,op.path))?.toString("base64")===op.after);
      assert.ok(op); const file=path.join(root,op.path), ownedBytes=fs.readFileSync(file);
      fs.appendFileSync(file,"\nUser edit after interruption.\n");
      const collisionBefore=snapshot(root), collision=run(root,candidate,["upgrade","--"+mode,"--plan-hash",plan.plan_hash,"--json"]);
      assert.notEqual(collision.status,0); assert.match(collision.stderr+collision.stdout,/collision|user bytes preserved/);
      assert.deepEqual(snapshot(root),collisionBefore,"recovery must refuse changed user bytes");
      // Fixture-owned correction restores the precise observed operation bytes;
      // this is not an application recovery feature or a user-data repair.
      fs.writeFileSync(file,ownedBytes);
    }
    const recovered=cli(root,candidate,["upgrade","--"+mode,"--plan-hash",plan.plan_hash]);
    assert.equal(recovered.recovery_state,mode==="resume"?"completed":"recovered");
    if(mode==="recover")assert.deepEqual(snapshot(root,true),before,"rollback restores complete original authored and Git bytes");
    else {
      for(const op of journal.operations){const actual=bytes(path.join(root,op.path));assert.equal(actual===null?null:actual.toString("base64"),op.after);}
      assert.deepEqual(cli(root,candidate,["upgrade"]).will_write_paths,[]);
      cli(root,candidate,["validate"]);
      assert.ok(fs.readFileSync(path.join(root,wrapper),"utf8").startsWith(editedWrapper),"fresh plan preserves the complete edited legacy wrapper");
      for(const p of Object.keys(before).filter(p=>p.startsWith(".git/")||p==="unknown.txt"))assert.equal(snapshot(root,true)[p],before[p]);
    }
    const terminal=snapshot(root);cli(root,candidate,["upgrade","--"+mode,"--plan-hash",plan.plan_hash]);
    assert.deepEqual(snapshot(root),terminal,"terminal continuation is observational");
    if(process.platform!=="win32")assert.equal(fs.statSync(journalPath).mode&0o777,0o600);
    cases.push({mode,position,writes:plan.will_write_paths.length,observed_written:observedAfter,state:recovered.recovery_state,unknown_and_git_preserved:true,changed_user_bytes_refused:position==="middle",
      stale_preview:{wrapper,reviewed_hash:reviewed.plan_hash,fresh_hash:plan.plan_hash,exit:stale.status,all_bytes_preserved:true,journal_absent:true,edited_wrapper_preserved:true}});
  }
  return {runtime:process.version,cases,fixture_fault_preload_sha256:crypto.createHash("sha256").update(fs.readFileSync(preload)).digest("hex")};
}

module.exports={exerciseInstalledUpgradeRecovery};
