// Read-only condensation of owned synthetic qualification output. Prints JSON;
// the repository writer reviews and persists it separately.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex'),directory=process.argv[2];
assert(/^\/private\/tmp\/mdkg-docker-g86-[A-Za-z0-9]+\/[a-z0-9-]+-results$/.test(directory));
const bytes=fs.readFileSync(path.join(directory,'receipt.json')),receipt=JSON.parse(bytes);
for(const row of receipt.completed)for(const stream of ['stdout','stderr'])assert.equal(hash(fs.readFileSync(path.join(directory,row.name+'.'+stream+'.txt'))),row[stream+'_sha256']);
function compact(value,key){
  if(value&&['artifact_verification','capture_verification','input_capture_verification','verification','before','after','deliveries','consumptions','baselines','source_inputs','drivers','compiledInputs'].includes(key))return {sha256:hash(JSON.stringify(value)),entry_count:Array.isArray(value)?value.length:undefined};
  if(typeof value==='string'&&(value.length>1000||['stdout','stderr','diagnostics'].includes(key)))return {bytes:Buffer.byteLength(value),sha256:hash(value)};
  if(Array.isArray(value)){
    if(value.length>(key==='completed'?100:8))return {entry_count:value.length,sha256:hash(JSON.stringify(value)),first:compact(value[0]),last:compact(value.at(-1))};
    return value.map(x=>compact(x));
  }
  if(value&&typeof value==='object'){
    if(Object.keys(value).length>35)return {key_count:Object.keys(value).length,sha256:hash(JSON.stringify(value)),sample_keys:Object.keys(value).slice(0,4)};
    return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,compact(v,k)]));
  }
  return value;
}
const runtime=receipt.completed.find(x=>x.name==='runtime')?.receipt?.rows;
const failures=receipt.completed.filter(x=>!x.pass).map(row=>{const stderr=fs.readFileSync(path.join(directory,row.name+'.stderr.txt'),'utf8');
  return {family:row.name,status:row.status,signal:row.signal,stderr_sha256:hash(stderr),diagnostic_tail:stderr.slice(-3000),diagnostic_head:stderr.slice(0,1200)};});
console.log(JSON.stringify({schema_version:1,kind:'sanitized-linux-qualification-receipt',original_receipt_sha256:hash(bytes),original_receipt_bytes:bytes.length,
  condensation:'Complete raw synthetic stream hashes verified; large arrays/inventories are represented by hashes/counts. Reproduction uses the pinned capsule and original test assertions. No raw security reports or consumer data.',
  evidence:compact(receipt),failures,runtime_safe_controls:runtime?.filter(x=>x.pass===true).length,
  unsupported_old_init_observations:runtime?.filter(x=>x.disposition).map(x=>({case:x.case,disposition:x.disposition})),
  scope:'Platform family evidence only; final security, full ladder and artifact seal remain separate. Deferred Bugs46/47 are not fixed.'}));
