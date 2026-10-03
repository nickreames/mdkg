const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const repo='/workspace/mdkg-cloud-goal90';
const {fixture,target,inventory,quiet}=require(path.join(repo,'tests/fixtures/independent-graphs.cjs'));
const {observeGit}=require(path.join(target,'dist/util/git_observation.js'));
const {isolatedFixtureEnvironment}=require(path.join(repo,'scripts/qualification-fixture.js'));
const results=[];
function scenario(name,fn){const x=fixture();try{results.push({name,...fn(x)});}finally{x.cleanup();}}
const exception='\n/memory/personal/\n!/memory/personal/\n/memory/personal/*\n!/memory/personal/.mdkg/\n/memory/personal/.mdkg/*\n!/memory/personal/.mdkg/work/\n';
scenario('F1 mixed-case export',x=>{
 const cp=path.join(x.personal,'.mdkg/config.json'),c=JSON.parse(fs.readFileSync(cp));c.workspaces.root.visibility='public';fs.writeFileSync(cp,JSON.stringify(c,null,2)+'\n');x.register();
 const cases=[['pack','task-1','--graph','personal','--visibility','public','--out','lower.md'],['pack','task-1','--graph','personal','--visibility','PUBLIC','--out','upper.md'],['pack','task-1','--graph','personal','--visibility','Internal','--out','mixed.md'],['bundle','create','--graph','personal','--profile','public','--output','lower.zip','--json'],['bundle','create','--graph','personal','--profile','PUBLIC','--output','upper.zip','--json']];
 const records=cases.map(argv=>{const b=inventory(x.host),r=x.cmd(argv),file=path.join(x.personal,argv[argv[0]==='bundle'?argv.indexOf('--output')+1:argv.indexOf('--out')+1]);let payload='';if(fs.existsSync(file))payload=file.endsWith('.zip')?require(path.join(target,'dist/util/zip.js')).readZipEntries(fs.readFileSync(file)).map(e=>e.data.toString()).join('\n'):fs.readFileSync(file,'utf8');return{argv,status:r.status,stderr:r.stderr,mutated:JSON.stringify(b)!==JSON.stringify(inventory(x.host)),canary_exported:payload.includes('private synthetic canary')};});
 for(const i of [0,3]){assert.equal(records[i].status,1);assert.equal(records[i].mutated,false);}
 for(const i of [1,2,4]){assert.equal(records[i].status,0);assert.equal(records[i].canary_exported,true);}
 return{cases:records};
});
for(const when of ['before','after'])scenario('F2 ignore exceptions '+when,x=>{
 if(when==='before')fs.appendFileSync(path.join(x.host,'.gitignore'),exception);x.register();if(when==='after')fs.appendFileSync(path.join(x.host,'.gitignore'),exception);
 const r=x.cmd(['new','task','PRIVATE_REVIEW_CANARY_IGNORE_EXCEPTION','--graph','personal','--json']);assert.equal(r.status,0,r.stderr);
 const config=x.f.git.run(x.host,['check-ignore','memory/personal/.mdkg/config.json']);
 const verbose=observeGit(x.host,['check-ignore','--verbose','--non-matching','-z','--stdin'],{input:'memory/personal/\0',allowedFailures:[1],env:isolatedFixtureEnvironment(process.env)});
 const unstaged=x.f.git.run(x.host,['ls-files','--others','--exclude-standard','--','memory/personal']).stdout;
 x.f.git.run(x.host,['add','--','.']);const staged=x.f.git.run(x.host,['ls-files','--cached','--','memory/personal']).stdout;
 assert.equal(config.status,0);assert.match(staged,/task-1-synthetic|task-2-private-review|events\/events/);
 return{when,selected_write_status:r.status,config_ignore_status:config.status,whole_directory_ignore_observation:verbose,untracked:unstaged,staged};
});
scenario('F3 unrelated unregister implicitly rebinds host',x=>{
 x.register();const second=path.join(x.host,'memory/disposable');fs.mkdirSync(second);quiet(()=>require(path.join(target,'dist/commands/init.js')).runInitCommand({root:second}));x.register('disposable','memory/disposable');
 const b=inventory(x.personal),changedId=crypto.randomUUID();fs.writeFileSync(path.join(x.host,'.mdkg/working-host.json'),JSON.stringify({format:'mdkg-working-host',version:1,host_id:changedId}));
 const before=x.cmd(['show','task-1','--graph','personal','--json']);const argv=['graph','unregister','disposable','--json'],p=JSON.parse(x.ok(argv).stdout);x.ok([...argv,'--apply','--plan-hash',p.plan_hash]);
 const after=x.cmd(['show','task-1','--graph','personal','--json']),reg=JSON.parse(fs.readFileSync(path.join(x.host,'.mdkg-graphs.local.json')));
 assert.equal(before.status,1);assert.match(before.stderr,/host namespace binding changed/);assert.equal(after.status,0);assert.equal(reg.default_binding.id,changedId);assert.deepEqual(inventory(x.personal),b);
 return{before:{status:before.status,stderr:before.stderr},after:{status:after.status,stderr:after.stderr},remaining_mapping:reg.graphs[0],registry_rebound_to_changed_host:reg.default_binding.id===changedId,personal_bytes_unchanged:true};
});
process.stdout.write(JSON.stringify({target,node:process.version,original_head:'650f8258495b4904e113830529ed4ffb7b92cc09',defects_reproduced:true,scenarios:results},null,2)+'\n');
