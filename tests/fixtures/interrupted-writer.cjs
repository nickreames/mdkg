const assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path'), crypto = require('node:crypto');
const { spawnSync } = require('node:child_process');

// Consumer proof uses installed CLI bytes, not imported graph modules. A
// fixture-only Node preload kills its own process after a complete selected
// filesystem publication. No product fault flag or recovery shortcut exists.
function qualifyInterruptedWriter({ cli, node = process.execPath, tempRoot }) {
  const owner = fs.mkdtempSync(path.join(tempRoot, 'interrupted-writer-'));
  const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
  const env = { PATH: process.env.PATH, LC_ALL: 'C', TMPDIR: owner, GIT_CONFIG_NOSYSTEM: '1', GIT_CONFIG_GLOBAL: '/dev/null' };
  const preload = path.join(owner, 'owned-fault.cjs');
  fs.writeFileSync(preload, `
const fs=require('node:fs'),path=require('node:path');
const root=fs.realpathSync(process.env.MDKG_FIXTURE_ROOT);
if(root!==fs.realpathSync(process.cwd())||!root.startsWith(${JSON.stringify(owner + path.sep)}))throw Error('owned recovery fixture boundary');
const targets=JSON.parse(process.env.MDKG_FIXTURE_TARGETS).map(p=>path.resolve(root,p));
if(targets.some(p=>!p.startsWith(root+path.sep)))throw Error('owned recovery target boundary');
let hits=0;const hit=p=>{if(targets.includes(path.resolve(String(p)))&&hits++===Number(process.env.MDKG_FIXTURE_POSITION)){if(process.env.MDKG_FIXTURE_KIND==='throw')throw Error('caught owned fixture interruption');process.kill(process.pid,'SIGKILL');}};
const open=fs.openSync,close=fs.closeSync,rename=fs.renameSync,handles=new Map();
fs.openSync=function(p,flags){const fd=open.apply(this,arguments);if(typeof flags==='number'&&(flags&fs.constants.O_WRONLY)&&targets.includes(path.resolve(String(p))))handles.set(fd,p);return fd;};
fs.closeSync=function(fd){const p=handles.get(fd);handles.delete(fd);const out=close.apply(this,arguments);if(p)hit(p);return out;};
fs.renameSync=function(a,b){const out=rename.apply(this,arguments);hit(b);return out;};
`);
  const inventory = root => {
    const result = {}; const walk = dir => {
      for (const name of fs.readdirSync(dir).sort()) {
        const file = path.join(dir,name), stat=fs.lstatSync(file), relative=path.relative(root,file).split(path.sep).join('/');
        assert(!stat.isSymbolicLink(), 'fixture does not accept links');
        result[relative] = `${stat.mode}:`+(stat.isDirectory()?'directory':hash(fs.readFileSync(file)));
        if(stat.isDirectory())walk(file);
      }
    };walk(root);return result;
  };
  const run = (root,args,fault) => spawnSync(node,[...(fault?['--require',preload]:[]),cli,...args],{
    cwd:root,env:{...env,...(fault?{MDKG_FIXTURE_ROOT:root,MDKG_FIXTURE_TARGETS:JSON.stringify(fault.paths),MDKG_FIXTURE_POSITION:String(fault.position||0),MDKG_FIXTURE_KIND:fault.kind||'kill'}:{})},encoding:'utf8',timeout:60000,maxBuffer:16*1024*1024,
  });
  const ok = (root,args) => {const r=run(root,args);assert.equal(r.error,undefined);assert.equal(r.status,0,r.stderr+r.stdout);return r.stdout;};
  const json = (root,args) => JSON.parse(ok(root,[...args,'--json']));
  const git = (root,args) => {const r=spawnSync('git',['--no-optional-locks','-c','core.fsmonitor=false','-c','core.hooksPath=/dev/null','-c','user.name=mdkg fixture','-c','user.email=fixture@example.invalid',...args],{cwd:root,env,encoding:'utf8'});assert.equal(r.status,0,r.stderr);return r.stdout.trim();};
  const seed=path.join(owner,'seed');fs.mkdirSync(seed);ok(seed,['init','--graph-only']);
  json(seed,['new','task','Common recovery task']);json(seed,['new','task','Cross-linked recovery task','--refs','task-1']);
  git(seed,['init','-q','-b','main']);git(seed,['add','--','.gitignore','.mdkg/config.json','.mdkg/core','.mdkg/templates','.mdkg/work']);git(seed,['commit','-qm','synthetic installed recovery seed']);
  const ancestor=git(seed,['rev-parse','HEAD']),rows=[];
  function setup(name) {
    const root=path.join(owner,name);fs.cpSync(seed,root,{recursive:true,errorOnExist:true,force:false});
    fs.writeFileSync(path.join(root,'staged-user-note.txt'),'preserve staged fixture bytes\n');git(root,['add','--','staged-user-note.txt']);
    const indexHash=hash(fs.readFileSync(path.join(root,'.git/index')));
    const args=['graph','migrate','--graph-id',crypto.randomUUID(),'--origin',crypto.randomUUID(),'--ancestor',ancestor],plan=json(root,args);
    assert.deepEqual(plan.blocking,[]);assert(plan.writes.length>3);
    return {root,args,plan,indexHash,journal:'.mdkg/state/identity-transactions/'+plan.plan_hash.slice(7)+'.json'};
  }
  function interrupt(f,paths,position=0,kind='kill',args=[...f.args,'--apply','--plan-hash',f.plan.plan_hash,'--json']) {
    const r=run(f.root,args,{paths,position,kind});assert.equal(r.error,undefined);
    if(kind==='kill')assert.equal(r.signal,'SIGKILL',r.stderr+r.stdout);else {assert.notEqual(r.status,0);assert.match(r.stderr,/caught owned fixture/);}
  }
  function approve(f,mode) {
    const before=inventory(f.root),result=json(f.root,['graph','recover',f.plan.plan_hash]);assert.deepEqual(inventory(f.root),before);
    assert.equal(result.recovery[mode].ready,true,JSON.stringify(result.recovery));assert.match(result.recovery[mode].lock_evidence,/^sha256:[0-9a-f]{64}$/);
    return result.recovery[mode].lock_evidence;
  }
  function finish(f,mode,evidence) {
    const before=inventory(f.root),bad=run(f.root,['graph','recover',f.plan.plan_hash,'--'+mode,'--lock-evidence','sha256:'+'0'.repeat(64),'--json']);
    assert.notEqual(bad.status,0);assert.deepEqual(inventory(f.root),before);
    const journal=JSON.parse(fs.readFileSync(path.join(f.root,f.journal),'utf8'));
    const result=json(f.root,['graph','recover',f.plan.plan_hash,'--'+mode,'--lock-evidence',evidence]);assert.equal(result.state,mode==='resume'?'applied':'rolled-back');
    for(const op of journal.plan.writes){const target=path.join(f.root,op.path),actual=fs.existsSync(target)?fs.readFileSync(target,'utf8'):null;assert.equal(actual,mode==='resume'?op.after:op.before,op.path);}
    assert(!fs.existsSync(path.join(f.root,'.mdkg/index/write.lock')));assert.equal(hash(fs.readFileSync(path.join(f.root,'.git/index'))),f.indexHash);
    json(f.root,['validate']);const terminal=inventory(f.root);json(f.root,['graph','recover',f.plan.plan_hash,'--'+mode]);assert.deepEqual(inventory(f.root),terminal);
  }
  for(const mode of ['resume','rollback'])for(const point of ['first','middle','last','terminal']) {
    const f=setup(mode+'-'+point),position=point==='first'?0:point==='middle'?Math.floor(f.plan.writes.length/2):f.plan.writes.length-1;
    interrupt(f,point==='terminal'?[f.journal]:f.plan.writes.map(w=>w.path),point==='terminal'?1:position);
    const evidence=approve(f,mode);finish(f,mode,evidence);rows.push({scenario:'installed-cli-real-sigkill',mode,point,pass:true});
  }
  for(const mode of ['resume','rollback']) {
    const f=setup('unmirrored-'+mode);interrupt(f,f.plan.writes.map(w=>w.path));const evidence=approve(f,mode);
    const ownerBytes=fs.readFileSync(path.join(f.root,'.mdkg/index/write.lock/owner.json'));
    const claim='.mdkg/index/write.lock/claim-'+hash(ownerBytes)+'.json';
    interrupt(f,[claim],0,'kill',['graph','recover',f.plan.plan_hash,'--'+mode,'--lock-evidence',evidence,'--json']);
    if(mode==='rollback'){const inspection=json(f.root,['graph','recover',f.plan.plan_hash]);assert.equal(inspection.recovery.resume.ready,false);assert.match(inspection.recovery.resume.reason,/rollback was requested/);}
    finish(f,mode,approve(f,mode));rows.push({scenario:'installed-cli-killed-unmirrored-claim',mode,pass:true});
  }
  const retry=setup('normal-retry-epoch');interrupt(retry,retry.plan.writes.map(w=>w.path),0,'throw');
  assert(!fs.existsSync(path.join(retry.root,'.mdkg/index/write.lock')));
  interrupt(retry,retry.plan.writes.slice(1).map(w=>w.path),0,'kill',['graph','recover',retry.plan.plan_hash,'--resume','--json']);
  finish(retry,'resume',approve(retry,'resume'));rows.push({scenario:'installed-cli-new-normal-lock-epoch',pass:true});
  return {owner,rows,fixture_preload_sha256:hash(fs.readFileSync(preload)),boundary:'Installed CLI with owned filesystem-publication fault injection; no graph-module imports, canonical writes, remote Git or provider access. Intermediate macOS proof, not final platform/security clearance.'};
}
module.exports={qualifyInterruptedWriter};
