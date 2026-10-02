// Read-only diagnosis of the precise verifier that rejected the unchanged smoke.
// Export pure inventory/validation functions rather than invoking materialization.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),Module=require('node:module');
const repo='/workspace/mdkg-cloud-goal88',base='/workspace/mdkg-cloud-goal88-cache/demo-pristine-plan';
const relative='scripts/bootstrap-website-demo-run.js',hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const script=fs.readFileSync(path.join(repo,relative),'utf8'),prior=fs.readFileSync(path.join(base,relative),'utf8');
if(script!==prior||!script.endsWith('main();\n'))throw Error('verifier script base/candidate mismatch');
const diagnostic=script.replace(/\nmain\(\);\s*$/, '\nmodule.exports={semanticInventory,inventoryIdentity,verifyReleaseInputs};\n');
const moduleInstance=new Module(path.join(repo,relative));moduleInstance._compile(diagnostic,path.join(repo,relative));
const api=moduleInstance.exports,platform='presentations/ai-native-sdlc-demo/artifacts/demo-platform/';
const runs=[['candidate',repo],['pristine_plan_base',base]].map(([name,root])=>{
 const manifest=JSON.parse(fs.readFileSync(path.join(root,platform,'operator-materialization-manifest.json')));
 const release=JSON.parse(fs.readFileSync(path.join(root,platform,'source-release-manifest.json')));
 const rows=api.semanticInventory(path.join(root,'examples/website-demo-template'),manifest);let refusal;
 try{api.verifyReleaseInputs(path.join(root,'examples/website-demo-template'),release,manifest);}catch(e){refusal={classification:e.classification,message:e.message};}
 return {name,root,expected_inventory:release.authored_inventory,actual_count:rows.length,actual_identity:api.inventoryIdentity(rows),refusal,rows};
});
const identical=JSON.stringify(runs[0].rows)===JSON.stringify(runs[1].rows);
if(!identical||runs.some(r=>r.refusal?.classification!=='source_release_input_drift'))throw Error('unable to classify unchanged base failure');
const receipt={kind:'demo-smoke-baseline-classification',base_commit:'ddafe0836fdc790cd36ba203afbcfc1878bbddd8',candidate_commit:'c13c7adba673b0de79ad55e87e0519e54cce5b95',
 script_sha256:hash(script),diagnostic_source_sha256:hash(diagnostic),instrumentation:'replace final main() only with exports of the unmodified read-only verifier functions; do not execute CLI/materialization',
 classification:'BASELINE_SOURCE_RELEASE_INPUT_DRIFT',identical_semantic_rows:identical,runtime:process.version,runs};
fs.writeFileSync('/workspace/mdkg-cloud-goal88-cache/candidate-2/demo-classification.json',JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify({classification:receipt.classification,identical_semantic_rows:identical,actual:runs.map(r=>({name:r.name,count:r.actual_count,identity:r.actual_identity,refusal:r.refusal})),expected:runs[0].expected_inventory.sha256}));
