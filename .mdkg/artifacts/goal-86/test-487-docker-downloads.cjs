// Anonymous public inputs for owned Linux fixtures; never uses npm credentials.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=process.argv[2];assert(/^\/private\/tmp\/mdkg-docker-g86-[A-Za-z0-9]+$/.test(root));assert.equal(fs.realpathSync(root),root);
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
async function get(url,max){const r=await fetch(url,{redirect:'error',signal:AbortSignal.timeout(60000)});assert(r.ok&&!r.redirected&&r.body,url);
  let size=0;const chunks=[];for await(const b of r.body){size+=b.length;assert(size<=max);chunks.push(b);}return Buffer.concat(chunks,size);}
function put(file,bytes){if(fs.existsSync(file)){assert.equal(hash(fs.readFileSync(file)),hash(bytes));return;}fs.writeFileSync(file,bytes,{flag:'wx',mode:0o644});}
async function main(){fs.mkdirSync(path.join(root,'runtimes'),{recursive:true});const rows=[];
  for(const version of ['24.18.0','24.15.0','26.0.0']){
    const base='https://nodejs.org/download/release/v'+version+'/',sums=await get(base+'SHASUMS256.txt',262144);
    for(const arch of ['arm64','x64']){const name='node-v'+version+'-linux-'+arch+'.tar.xz';
      const line=sums.toString().split('\n').find(l=>l.endsWith('  '+name));assert(line&&/^[a-f0-9]{64}  /.test(line));
      const expected=line.slice(0,64),file=path.join(root,'runtimes',name);
      const bytes=fs.existsSync(file)?fs.readFileSync(file):await get(base+name,80*1024*1024);assert.equal(hash(bytes),expected);put(file,bytes);
      rows.push({kind:'official-node-runtime',version,arch,url:base+name,sha256:expected,bytes:bytes.length,checksum_manifest_sha256:hash(sums)});
      console.log(JSON.stringify({download:name,sha256:expected,bytes:bytes.length}));
    }
  }
  const {PUBLISHED_052,verifyBaseline}=require('../../../scripts/published-upgrade-baseline');
  const file=path.join(root,'published-mdkg-0.5.2.tgz');const bytes=fs.existsSync(file)?fs.readFileSync(file):await get(PUBLISHED_052.url,PUBLISHED_052.bytes);
  verifyBaseline(bytes);put(file,bytes);put(path.join(root,'runtime-downloads.json'),Buffer.from(JSON.stringify(rows,null,2)+'\n'));
  console.log(JSON.stringify({runtime_manifest_sha256:hash(fs.readFileSync(path.join(root,'runtime-downloads.json'))),baseline_sha256:PUBLISHED_052.sha256}));
}
main().catch(e=>{console.error(e);process.exitCode=1;});
