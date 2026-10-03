from pathlib import Path
import os, subprocess, json, hashlib, stat, datetime, time, re, gzip, sys
root=Path('/workspace/mdkg-cloud-goal89')
cache=Path('/workspace/mdkg-cloud-review-cache/goal89-guidance-correction')
prior=root/'.mdkg/artifacts/goal-89/review-correction'
receipt=root/'.mdkg/artifacts/goal-89/guidance-correction'; receipt.mkdir(parents=True,exist_ok=True)
installed=Path('/workspace/mdkg-cloud-review-cache/goal89-review-correction-final/npm-consumer/node_modules/mdkg')
artifact=Path('/workspace/mdkg-cloud-review-cache/goal89-review-correction-final/mdkg-0.6.2.tgz')
fixture=Path('/dev/shm/mdkg-cloud-review-fixtures'); fixture.mkdir(exist_ok=True)
env={k:v for k,v in os.environ.items() if not k.startswith('GIT_')}
env.update(TMPDIR=str(fixture),npm_config_cache=str(cache/'npm-cache'),ASTRO_TELEMETRY_DISABLED='1',XDG_CONFIG_HOME=str(cache/'astro-config'))
def sha(p): return hashlib.sha256(p.read_bytes()).hexdigest()
def utc(): return datetime.datetime.now(datetime.timezone.utc).isoformat()
def save(name,data): (cache/name).write_text(json.dumps(data,indent=2)+'\n')
def manifest(directory):
 return {str(p.relative_to(directory)):{'sha256':sha(p),'mode':stat.S_IMODE(p.stat().st_mode)} for p in sorted(directory.rglob('*')) if p.is_file()}
allowed={'docs/start-here/install.md','docs/src/content/docs/start-here/install.md','docs/src/content/docs/project/changelog.md'}
product_prior=json.loads((prior/'product-inputs.json').read_text())
paths=set(product_prior)|allowed
def capture(): return {p:{'sha256':sha(root/p),'mode':stat.S_IMODE((root/p).stat().st_mode)} for p in sorted(paths)}
before=capture(); changed_prior=[p for p,v in product_prior.items() if before[p]!=v]
if set(changed_prior)!=allowed-{'docs/start-here/install.md'}: raise RuntimeError('unexpected runtime/source change relative to945: '+str(changed_prior))
built_before=manifest(root/'dist'); installed_before=manifest(installed)
if built_before!=json.loads((prior/'built-inputs.json').read_text()): raise RuntimeError('retained build changed')
if installed_before!=json.loads((prior/'npm-installed-inputs.json').read_text()): raise RuntimeError('installed package changed')
artifact_sha=sha(artifact)
if artifact_sha!='1ad72ba366c93c28f98c3ee2eacbf3368aec8a09b249f3043bf18e37805a4df4': raise RuntimeError('retained tar changed')
tar_files=json.loads((prior/'package-inventory.json').read_text())['tar_files']
payload_changes=[p for p,v in tar_files.items() if not (root/p).is_file() or sha(root/p)!=v['sha256']]
if payload_changes: raise RuntimeError('package inputs changed: '+str(payload_changes))
save('product-inputs.json',before)
save('reused-inputs.json',{'prior_commit':'945ee4434b50b21861e8fff300450cca39769937','built_manifest_sha256':sha(prior/'built-inputs.json'),
 'installed_manifest_sha256':sha(prior/'npm-installed-inputs.json'),'tar_sha256':artifact_sha,'npm_payload_byte_changes':payload_changes,
 'changed_prior_product_paths':changed_prior,'newly_bound_document':'docs/start-here/install.md',
 'meaning':'Only three repository documentation projections change. Runtime, package payload and installed artifact remain exact; old feature evidence is preserved, not a new full-head qualification claim.'})
results=[]
def run(name,cmd,timeout=90):
 log=cache/(name+'.log'); begin=utc(); start=time.monotonic()
 if log.exists(): raise RuntimeError('duplicate execution refused: '+name)
 with log.open('w') as f:
  try: code=subprocess.run(cmd,cwd=root,env=env,stdout=f,stderr=subprocess.STDOUT,timeout=timeout).returncode
  except subprocess.TimeoutExpired: code=124
 text=log.read_text(errors='replace'); row={'name':name,'command':cmd,'start':begin,'end':utc(),'seconds':round(time.monotonic()-start,3),'exit':code,'log':log.name,'log_sha256':sha(log)}
 for key in ['tests','pass','fail','skipped','cancelled']:
  m=re.search(r'(?:ℹ|#) '+key+r' (\d+)',text)
  if m: row[key]=int(m[1])
 results.append(row); save('progress.json',results); print(name,code,row.get('pass',''),row.get('fail',''),flush=True)
 if code: print(text[-3000:],flush=True)
 return code
runtimes=[('24.19.0','node'),('24.18.0','/workspace/mdkg-cloud-goal88-cache/qualification-3/node-v24.18.0-linux-x64/bin/node'),
 ('24.21.0','/workspace/mdkg-cloud-review-cache/node-24.21.0/node-v24.21.0-linux-x64/bin/node')]
for version,node in runtimes:
 if subprocess.check_output([node,'--version'],text=True).strip()!='v'+version: raise RuntimeError('runtime identity changed')
 run('source-'+version,[node,'--test','tests/release-guidance.test.mjs'])
 run('installed-guidance-'+version,[node,str(cache/'installed-guidance.cjs')])
 run('installed-version-'+version,[node,str(installed/'dist/cli.js'),'--version'])
for name,cmd in [
 ('docs',['npm','run','docs:check:built']),
 ('cli-matrix',['node','scripts/cli_help_snapshot.js','--check']),
 ('cli-contract',['node','scripts/generate-command-contract.js','--check']),
 ('graph',['node','dist/cli.js','validate','--json']),
 ('docs-site',['npm','run','build','--prefix','docs']),
 ('diff',['git','diff','--check'])]: run(name,cmd,180)
drift={'product':before!=capture(),'built':built_before!=manifest(root/'dist'),'installed':installed_before!=manifest(installed),'artifact':sha(artifact)!=artifact_sha}
save('checks.json',{'created':utc(),'parent_head':'945ee4434b50b21861e8fff300450cca39769937','base_head':'ce53ea56629af23ecd10d6e58a393db1235fda79',
 'cwd':str(root),'checks':results,'input_drift':drift,'tar_sha256':artifact_sha,'source_suite':'11 unchanged repository release-guidance assertions per runtime',
 'installed_suite':'Two unchanged version-guidance assertions per runtime using exact installed package metadata/contract and an explicit repository-doc overlay. These docs are not npm payload.',
 'harness_sha256':sha(Path(__file__)),'installed_runner_sha256':sha(cache/'installed-guidance.cjs'),'product_inputs_sha256':sha(cache/'product-inputs.json'),
 'cloud_resumption_attempt':3,'cloud_resumption_result':'connected; harmless pwd exit0 /workspace','confirmed_transient_failures_since_rule':2,
 'readiness':'NOT_READY','pending':['independent corrected-head review; Goal90 held','required new-head hosted CI','owner/local acceptance','complete prepublication/platform/coverage ladder'],
 'prior_hosted_run':{'id':37109564106,'result':'failure','minimum':'2449 pass/2 release-guidance version failures; collector/upload succeeded','floating':'cancelled; no coverage log; collector tar exit2; upload succeeded; test outcome/cancellation cause inconclusive'}})
(root/'.mdkg/index/mdkg.sqlite').write_bytes(subprocess.check_output(['git','show','HEAD:.mdkg/index/mdkg.sqlite'],cwd=root))
for p in cache.iterdir():
 if p.is_file() and p.suffix in ['.json','.py','.cjs']: (receipt/p.name).write_bytes(p.read_bytes())
 elif p.is_file() and p.suffix=='.log': (receipt/(p.name+'.gz')).write_bytes(gzip.compress(p.read_bytes(),mtime=0))
save('evidence-manifest.json',manifest(receipt));(receipt/'evidence-manifest.json').write_bytes((cache/'evidence-manifest.json').read_bytes())
fail=[r['name'] for r in results if r['exit']]; print('FINAL',json.dumps({'failed':fail,'drift':drift,'passes':sum(r.get('pass',0) for r in results)}),flush=True)
sys.exit(1 if fail or any(drift.values()) else 0)
