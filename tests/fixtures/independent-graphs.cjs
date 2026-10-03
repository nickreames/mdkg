const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { createOwnedFixture } = require('../../scripts/qualification-fixture.js');
const { acceptOwnedGitFixture } = require('../../scripts/qualification-git.js');
const { runFixtureProcess } = require('../../scripts/qualification-process.js');
const { isolatedFixtureEnvironment } = require('../../scripts/qualification-fixture.js');
const target = path.resolve(process.env.MDKG_GRAPHS_PACKAGE || path.join(__dirname, '../..'));
function quiet(fn) { const log=console.log; console.log=()=>{}; try{return fn();}finally{console.log=log;} }
function inventory(root) {
  const out={};
  function walk(dir) { for(const e of fs.readdirSync(dir,{withFileTypes:true})) {
    const p=path.join(dir,e.name), rel=path.relative(root,p).split(path.sep).join('/');
    if(e.name==='.git')continue;
    if(e.isDirectory())walk(p);
    else out[rel]=e.isSymbolicLink()?`link:${fs.readlinkSync(p)}`:crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
  }} walk(root); return out;
}
function node(root,title='team task',number=1) {
  const file=path.join(root,`.mdkg/work/task-${number}-synthetic.md`);
  fs.writeFileSync(file,`---\nid: task-${number}\ntype: task\ntitle: ${title}\nstatus: todo\npriority: 1\ntags: []\nowners: [synthetic-owner]\nlinks: []\nartifacts: []\nrelates: []\nrefs: []\naliases: []\nskills: []\ncreated: 2026-10-03\nupdated: 2026-10-03\n---\n\n# Overview\n\n${title}\n`);
  return file;
}
function fixture() {
  const owned=createOwnedFixture({prefix:'mdkg-independent-graphs-'});
  const f={...owned,git:acceptOwnedGitFixture(owned.root)};
  try {
  const host=f.resolve('host');fs.mkdirSync(host);
  f.git.run(host,['init','-q']);
  const {runInitCommand}=require(path.join(target,'dist/commands/init.js'));
  quiet(()=>runInitCommand({root:host}));node(host);
  const personal=path.join(host,'memory/personal');fs.mkdirSync(personal,{recursive:true});
  quiet(()=>runInitCommand({root:personal}));node(personal,'private synthetic canary');
  const cmd=(argv,root=host)=>f.runNode([path.join(target,'dist/cli.js'),'--root',root,...argv],{cwd:host,timeout:30000});
  const ok=(argv,root=host)=>{const r=cmd(argv,root);assert.equal(r.status,0,r.stderr+'\n'+r.stdout);return r;};
  const register=(name='personal',rootPath='memory/personal',visibility='private')=>{
    const args=['graph','register',name,'--target',rootPath,'--visibility',visibility,'--json'];
    const plan=JSON.parse(ok(args).stdout);ok([...args,'--apply','--plan-hash',plan.plan_hash]);return plan;
  };
  const stdio=(argv,input)=>runFixtureProcess(f.root,process.execPath,[path.join(target,'dist/cli.js'),'--root',host,...argv],
    {cwd:host,env:isolatedFixtureEnvironment(process.env),timeout:30000,input});
  return {f,host,personal,cmd,ok,register,stdio,cleanup:()=>f.cleanup()};
  } catch (error) {
    f.cleanup();
    throw error;
  }
}
module.exports={target,fixture,inventory,node,quiet};
