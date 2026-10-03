from pathlib import Path
import os,sys,subprocess,json,hashlib,datetime,time,platform,tarfile,stat,re
root=Path('/workspace/mdkg-cloud-goal89'); cache=Path('/workspace/mdkg-cloud-review-cache/goal89-qualification'); cache.mkdir(exist_ok=True)
receipt=Path('.mdkg/artifacts/goal-89/implementation'); receipt.mkdir(parents=True,exist_ok=True)
fixture=Path('/dev/shm/mdkg-cloud-review-fixtures'); fixture.mkdir(exist_ok=True)
env=dict(os.environ,TMPDIR=str(fixture))
for k in list(env):
 if k.startswith('GIT_'): del env[k]
results=[]
def utc(): return datetime.datetime.now(datetime.timezone.utc).isoformat()
def sha(p): return hashlib.sha256(p.read_bytes()).hexdigest()
def capture():
 dirs=['src','scripts','tests','assets','release','docs/_generated','docs/src/content/docs','.mdkg/templates','.mdkg/core','.mdkg/skills','.agents/skills','.claude/skills']
 files=['package.json','package-lock.json','README.md','CHANGELOG.md','CLI_COMMAND_MATRIX.md','docs/astro.config.mjs','docs/package.json','docs/package-lock.json','mdkg-dev/package.json','mdkg-dev/package-lock.json','docs/cloud-goal89-design.md','docs/cloud-goal89-contract-delta.md','docs/cloud-goal89-validation-plan.md']
 paths=set(root/f for f in files)
 paths.update(root.glob('tsconfig*.json'))
 for d in dirs: paths.update(p for p in (root/d).rglob('*') if p.is_file())
 return {str(p.relative_to(root)):{'sha256':sha(p),'mode':stat.S_IMODE(p.stat().st_mode)} for p in sorted(paths)}
def run(name,cmd,extra=None,timeout=180):
 e=dict(env); e.update(extra or {}); log=cache/(name+'.log'); begin=utc(); t=time.monotonic()
 with log.open('w') as out:
  try:
   p=subprocess.run(cmd,cwd=root,env=e,stdout=out,stderr=subprocess.STDOUT,timeout=timeout); code=p.returncode
  except subprocess.TimeoutExpired: code=124
 record={'name':name,'command':cmd,'start':begin,'end':utc(),'seconds':round(time.monotonic()-t,3),'exit':code,'result':'PASSED' if code==0 else 'FAILED','log':name+'.log','log_sha256':sha(log)}
 s=log.read_text(errors='replace')
 for key in ['tests','pass','fail','skipped','cancelled']:
  match=re.search(r'(?:ℹ|#) '+key+r' (\d+)',s)
  if match: record[key]=int(match[1])
 results.append(record); (cache/'progress.json').write_text(json.dumps(results,indent=2)+'\n'); print(name,code,record.get('pass',''),record.get('fail',''),flush=True)
 if code: print(s[-9000:],flush=True)
 return code
before=capture(); (cache/'product-inputs.json').write_text(json.dumps(before,indent=2)+'\n')
(compiled:=list(map(lambda p:'dist/tests/'+p+'.test.js',[
 'commands/init','commands/init_identity','commands/init_manifest_ownership','commands/goal88_init','commands/cli_option_admission',
 'commands/archive_work','commands/archive_payload_ownership','commands/archive_compress_ownership','commands/bundle','commands/bundle_ownership','commands/bundle_state','commands/bundle_admission','commands/bundle_archive_visibility',
 'core/config','core/config_read_admission','core/filesystem_authority','core/filesystem_nullable_read','util/argparse','util/mutation_lock',
 'graph/cache_containment','graph/cache_freshness','graph/cache_git_metadata','graph/archive_containment','graph/identity','graph/identity_portable_recovery'])))
for p in compiled:
 if not (root/p).is_file(): raise RuntimeError('missing selected test '+p)
subreaper='/workspace/mdkg-cloud-goal88-cache/subreaper.py'
run('source-feature',['python3',subreaper,'node','--test','tests/working-storage.test.mjs','tests/cloud-working-host-contract.test.mjs'])
run('source-regressions',['python3',subreaper,'node','--test',*compiled],timeout=240)
for name,cmd in [
 ('cli-matrix',['node','scripts/cli_help_snapshot.js','--check']),
 ('cli-contract',['node','scripts/generate-command-contract.js','--check']),
 ('docs',['npm','run','docs:check:built']),
 ('graph',['node','dist/cli.js','validate','--json']),
 ('skills',['node','dist/cli.js','skill','validate','--json']),
 ('security',['npm','run','security:verify']),
 ('workflow',['node','scripts/generate-ci-workflow.js','--check']),
 ('publish-static',['node','scripts/assert-publish-ready.js']),
 ('public-release',['python3',subreaper,'node','--test','tests/public-release.test.mjs','tests/publish-readiness-goal-contract.test.mjs','tests/security-remediation.test.mjs']),
 ('docs-site',['npm','run','build','--prefix','docs']),
 ('marketing-site',['npm','run','build','--prefix','mdkg-dev']),
 ('diff',['git','diff','--check'])]: run(name,cmd,timeout=180)
# Draft-only pack. Scripts disabled explicitly: this is not a prepack/prepublish pass.
packcode=run('pack',['npm','pack','--ignore-scripts','--json','--pack-destination',str(cache)])
artifact=None
if not packcode:
 info=json.loads((cache/'pack.log').read_text()); artifact=cache/info[0]['filename']; installed=cache/'installed'; installed.mkdir(exist_ok=True)
 with tarfile.open(artifact) as tar:
  names=tar.getnames()
  if any(not (n=='package' or n.startswith('package/')) or '..' in n.split('/') or tar.getmember(n).issym() or tar.getmember(n).islnk() for n in names): raise RuntimeError('unsafe pack inventory')
  if any('.mdkg/working' in n or 'PRIVATE_CACHE_CANARY' in n for n in names): raise RuntimeError('working artifact in package')
  for member in tar.getmembers():
   if member.isfile():
    data=tar.extractfile(member).read()
    if any(x in data for x in [b'PRIVATE_CACHE_CANARY',b'PRIVATE RAW CANARY',b'PRIVATE UNEXPORTED BODY',b'synthetic private draft canary']): raise RuntimeError('synthetic private canary in package')
  tar.extractall(installed,filter='data')
 target=installed/'package'; (cache/'package-inventory.json').write_text(json.dumps({'filename':artifact.name,'sha256':sha(artifact),'files':info[0]['files'],'unpacked_size':info[0]['unpackedSize'],'installed_files':{str(p.relative_to(target)):{'sha256':sha(p),'mode':stat.S_IMODE(p.stat().st_mode)} for p in sorted(target.rglob('*')) if p.is_file()}},indent=2)+'\n')
 run('postinstall',['node',str(target/'scripts/postinstall.js')])
 runtimes=[('24.19.0','node'),('24.18.0','/workspace/mdkg-cloud-goal88-cache/qualification-3/node-v24.18.0-linux-x64/bin/node'),('24.21.0','/workspace/mdkg-cloud-review-cache/node-24.21.0/node-v24.21.0-linux-x64/bin/node')]
 for version,node in runtimes:
  actual=subprocess.check_output([node,'--version'],text=True).strip()
  if actual!='v'+version: raise RuntimeError('runtime identity drift '+actual)
  run('installed-'+version,['python3',subreaper,node,'--test','tests/working-storage.test.mjs','tests/cloud-working-host-contract.test.mjs'],{'MDKG_WORKING_PACKAGE':str(target)})
 after_install={str(p.relative_to(target)):{'sha256':sha(p),'mode':stat.S_IMODE(p.stat().st_mode)} for p in sorted(target.rglob('*')) if p.is_file()}
 prior=json.loads((cache/'package-inventory.json').read_text())['installed_files']; (cache/'installed-drift.json').write_text(json.dumps({'before_after_equal':prior==after_install},indent=2)+'\n')
after=capture(); drift=sorted(k for k in set(before)|set(after) if before.get(k)!=after.get(k))
(cache/'input-drift.json').write_text(json.dumps({'drift':drift,'before_after_equal':not drift},indent=2)+'\n')
metadata={'created':utc(),'branch_head':subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip(),'branch':subprocess.check_output(['git','branch','--show-current'],text=True).strip(),'cwd':str(root),'platform':platform.platform(),'machine':platform.machine(),'native':True,'node':subprocess.check_output(['node','--version'],text=True).strip(),'npm':subprocess.check_output(['npm','--version'],text=True).strip(),'git':subprocess.check_output(['git','--version'],text=True).strip(),'product_inputs_sha256':sha(cache/'product-inputs.json'),'subreaper_sha256':sha(Path(subreaper)),'source_manifest_scope':'product/source/generated docs/test inputs; narrative work/checkpoint/evidence outputs excluded','input_drift':drift,'checks':results,'artifact':{'path':str(artifact),'sha256':sha(artifact)} if artifact else None,'readiness':'NOT_READY','pending':['independent current-contract/patch review Chk675','owner/local acceptance Chk676','full premerge/coverage/package prepublication ladder and complete smoke profiles','native macOS and remaining required platform/security acceptance','hosted exact-candidate qualification','publication/adoption approval'],'transient_executor_failures_since_instruction':0}
(cache/'checks.json').write_text(json.dumps(metadata,indent=2)+'\n')
# Same-command receipt export from fixture-controlled execution into owned workspace.
for p in cache.iterdir():
 if p.is_file() and p.suffix in ['.log','.json']: (receipt/p.name).write_bytes(p.read_bytes())
# Tests/validators may rebuild local graph caches. Preserve the tracked derived base.
(root/'.mdkg/index/mdkg.sqlite').write_bytes(subprocess.check_output(['git','show','HEAD:.mdkg/index/mdkg.sqlite']))
print('FINAL',json.dumps({'failed':[x['name'] for x in results if x['exit']],'drift':drift,'artifact':metadata['artifact']}),flush=True)
sys.exit(1 if drift or any(x['exit'] for x in results) else 0)
