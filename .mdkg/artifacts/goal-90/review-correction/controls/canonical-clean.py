from pathlib import Path
import os,subprocess,json,hashlib,time,datetime,stat
root=Path('/workspace/mdkg-cloud-goal90');cache=Path('/workspace/mdkg-cloud-review-cache/goal90/review-correction/final')
collection=Path('/dev/shm/mdkg-cloud-goal90-review-correction-fixtures/prepublish-clean')
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def stable():
 for file,base in [('product-inputs.json',root),('built-inputs.json',root/'dist'),('installed-inputs.json',cache/'npm-consumer/node_modules/mdkg')]:
  for rel,want in json.loads((cache/file).read_text()).items():
   p=base/rel
   assert p.is_file() and sha(p)==want['sha256'] and stat.S_IMODE(p.stat().st_mode)==want['mode'],('input drift',file,rel)
stable();a=json.loads((cache/'artifact.json').read_text())
env={k:v for k,v in os.environ.items() if not k.upper().startswith('GIT_') and k not in ['MDKG_GRAPHS_PACKAGE','MDKG_RELEASE_TARBALL','MDKG_RELEASE_TARBALL_SHA256','MDKG_RELEASE_INPUTS','MDKG_RELEASE_INPUTS_SHA256']}
env.update(TMPDIR='/dev/shm/mdkg-cloud-goal90-review-correction-fixtures',npm_config_cache=str(cache/'npm-cache'),XDG_CONFIG_HOME=str(cache/'astro-config'),ASTRO_TELEMETRY_DISABLED='1',MDKG_WORKING_LEGACY_PACKAGE='/workspace/mdkg-cloud-goal88',MDKG_RELEASE_SCOPE='package',MDKG_RELEASE_RECEIPT_DIR=str(collection),MDKG_RELEASE_TARBALL=a['file'],MDKG_RELEASE_TARBALL_SHA256=a['sha256'],MDKG_RELEASE_INPUTS=str(cache/'candidate-inputs.json'),MDKG_RELEASE_INPUTS_SHA256=sha(cache/'candidate-inputs.json'))
cmd=['python3','/workspace/mdkg-cloud-goal88-cache/subreaper.py','node','scripts/release-ladder.js','prepublish'];log=cache/'canonical-prepublish-clean.log';start=datetime.datetime.now(datetime.timezone.utc).isoformat();clock=time.monotonic()
with log.open('x') as f:
 try:r=subprocess.run(cmd,cwd=root,env=env,stdout=f,stderr=subprocess.STDOUT,timeout=3660);code=r.returncode
 except subprocess.TimeoutExpired:code=124
record={'name':'canonical-prepublish-clean','command':cmd,'start':start,'end':datetime.datetime.now(datetime.timezone.utc).isoformat(),'seconds':round(time.monotonic()-clock,3),'exit':code,'log':log.name,'log_sha256':sha(log),'collection':str(collection),'artifact_sha256':a['sha256'],'candidate_inputs_sha256':sha(cache/'candidate-inputs.json'),'reason':'Two failure families reproduce on baseline and candidate with invalid /workspace/.git ancestry, and pass under clean TMPDIR. This controlled repeat changes only receipt/fixture ancestry; source/artifact/gates/floors/timeouts unchanged. First full failed run preserved; other original failure details remain unclassified.'}
(cache/'canonical-prepublish-clean.json').write_text(json.dumps(record,indent=2)+'\n');print(json.dumps(record),flush=True);stable()
if code:print(log.read_text()[-5000:],flush=True)
raise SystemExit(code)
