// Supplemental actual package smoke execution. This does not qualify prepublish.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),Module=require('node:module');
const root='/workspace/mdkg-cloud-goal90',base='/workspace/mdkg-cloud-review-cache/goal90/review-correction/final';
const file=path.join(root,'scripts/release-ladder.js'),source=fs.readFileSync(file,'utf8');
const mod=new Module(file,module); mod.filename=file; mod.paths=Module._nodeModulePaths(path.dirname(file));
mod._compile(source+'\nmodule.exports.createProxyBin=createProxyBin;module.exports.resolveTools=resolveTools;module.exports.runExecutable=runExecutable;\n',file);
const api=mod.exports,artifact=JSON.parse(fs.readFileSync(path.join(base,'artifact.json')));
const {withVerifiedArtifact,verifyArtifactFile}=require(path.join(root,'scripts/qualification-artifact.js'));
const dir=path.join(base,'supplemental-package37-continuation');fs.mkdirSync(dir);
const manifest=require(path.join(root,'scripts/smoke-manifest.json'));
const entries=api.canonicalEntries(manifest,'prepublish',undefined,'package').slice(4);if(entries.length!==33)throw Error('remaining package smoke inventory mismatch');
const before=api.captureTrackedBoundary(root),env=api.releaseEnvironment(dir,api.resolveTools(),'package');
for(const key of Object.keys(env))if(key.toUpperCase().startsWith('GIT_')&&!['GIT_OPTIONAL_LOCKS'].includes(key.toUpperCase()))delete env[key];
for(const key of ['MDKG_RELEASE_TARBALL','MDKG_RELEASE_TARBALL_SHA256','MDKG_RELEASE_INPUTS','MDKG_RELEASE_INPUTS_SHA256'])delete env[key];
env.TMPDIR='/dev/shm/mdkg-cloud-goal90-review-correction-fixtures/supplemental-package37';fs.mkdirSync(env.TMPDIR,{recursive:true});
env.MDKG_PUBLISHED_052_TARBALL='/workspace/mdkg-cloud-goal88-cache/mdkg-0.5.2-published.tgz';require(path.join(root,'scripts/published-upgrade-baseline')).readLocalBaseline(env.MDKG_PUBLISHED_052_TARBALL);
env.PATH=api.createProxyBin(dir)+path.delimiter+env.PATH;env.npm_execpath=path.join(dir,'proxy-bin','npm');
// Derive the generated proxy path rather than assume its directory name.
env.npm_execpath=path.join(env.PATH.split(path.delimiter)[0],'npm');
env.MDKG_SMOKE_TARBALL=artifact.file;env.MDKG_SMOKE_TARBALL_SHA256=artifact.sha256;
const receipt={schema_version:1,kind:'supplemental-package37-continuation',previous_passed_ids:['smoke:consumer','smoke:git-boundary','smoke:loop','smoke:matrix'],repeat_reason:'Published baseline fetch DNS EAI_AGAIN; pinned retained local artifact is supported and verified. Reuse prior four passed case records; run remaining33. No canonical prepublish success inferred.',canonical_prepublish:'FAILED',does_not_waive_coverage:true,artifact_sha256:artifact.sha256,harness_sha256:crypto.createHash('sha256').update(source).digest('hex'),node:process.version,start:new Date().toISOString(),smokes:[]};
function save(){fs.writeFileSync(path.join(dir,'receipt.json'),JSON.stringify(receipt,null,2)+'\n');}save();
for(const entry of entries){
 const start=Date.now();let result,verification,error;
 try{({result,verification}=withVerifiedArtifact(artifact.file,artifact.sha256,()=>api.runExecutable(process.execPath,[path.join(root,entry.entrypoint)],{cwd:root,env:{...env,MDKG_SMOKE_ID:entry.canonical},encoding:'utf8',stdio:'pipe',timeout:entry.timeout_seconds*1000})));}catch(e){error=e.message;}
 const log=entry.canonical.replace(/:/g,'-')+'.log';fs.writeFileSync(path.join(dir,log),(result?.stdout||'')+(result?.stderr||'')+(error||''));
 const record={id:entry.canonical,entrypoint:entry.entrypoint,aliases:entry.aliases,exit:result?.status??null,timed_out:result?.error?.code==='ETIMEDOUT',seconds:(Date.now()-start)/1000,verification,error,log,log_sha256:crypto.createHash('sha256').update(fs.readFileSync(path.join(dir,log))).digest('hex')};receipt.smokes.push(record);save();console.log(JSON.stringify({id:record.id,exit:record.exit,seconds:record.seconds,error}));
 if(error||record.exit!==0){receipt.result='FAILED';break;}
}
receipt.end=new Date().toISOString();receipt.artifact_final=verifyArtifactFile(artifact.file,artifact.sha256);receipt.git_boundary=api.compareTrackedBoundaries(before,api.captureTrackedBoundary(root));
receipt.artifact_usages=fs.existsSync(path.join(dir,'artifact-usages.jsonl'))?fs.readFileSync(path.join(dir,'artifact-usages.jsonl'),'utf8').trim().split('\n').filter(Boolean).map(JSON.parse):[];
receipt.result=receipt.smokes.length===33&&receipt.smokes.every(x=>x.exit===0&&!x.error)&&receipt.git_boundary.ok?'PASSED':'FAILED';save();console.log(JSON.stringify({result:receipt.result,count:receipt.smokes.length,boundary:receipt.git_boundary.ok}));process.exitCode=receipt.result==='PASSED'?0:1;
