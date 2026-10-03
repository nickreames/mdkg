from pathlib import Path
import os,sys,subprocess,json,hashlib,time,datetime,re,stat,tarfile,platform
root=Path('/workspace/mdkg-cloud-goal90');cache=Path('/workspace/mdkg-cloud-review-cache/goal90/review-correction/final');cache.mkdir(exist_ok=True)
outer=cache.parent;tmp=Path('/dev/shm/mdkg-cloud-goal90-review-correction-fixtures');tmp.mkdir(exist_ok=True)
env={k:v for k,v in os.environ.items() if not k.upper().startswith('GIT_') and k not in ['MDKG_GRAPHS_PACKAGE','MDKG_RELEASE_TARBALL','MDKG_RELEASE_TARBALL_SHA256','MDKG_RELEASE_INPUTS','MDKG_RELEASE_INPUTS_SHA256']}
env.update(TMPDIR=str(tmp),npm_config_cache=str(cache/'npm-cache'),XDG_CONFIG_HOME=str(cache/'astro-config'),ASTRO_TELEMETRY_DISABLED='1',MDKG_WORKING_LEGACY_PACKAGE='/workspace/mdkg-cloud-goal88')
subreaper='/workspace/mdkg-cloud-goal88-cache/subreaper.py'
runtimes=[('24.19.0','node'),('24.18.0','/workspace/mdkg-cloud-goal88-cache/qualification-3/node-v24.18.0-linux-x64/bin/node'),('24.21.0','/workspace/mdkg-cloud-review-cache/node-24.21.0/node-v24.21.0-linux-x64/bin/node')]
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def utc():return datetime.datetime.now(datetime.timezone.utc).isoformat()
def save(name,value):(cache/name).write_text(json.dumps(value,indent=2)+'\n')
def manifest(directory):return {str(p.relative_to(directory)):{'sha256':sha(p),'mode':stat.S_IMODE(p.stat().st_mode)} for p in sorted(directory.rglob('*')) if p.is_file()}
def product():
 paths=set(root.glob('tsconfig*.json'))
 for rel in ['package.json','package-lock.json','README.md','CHANGELOG.md','CLI_COMMAND_MATRIX.md','docs/package.json','docs/package-lock.json','docs/astro.config.mjs','docs/cloud-goal90-design.md','docs/cloud-goal90-validation-plan.md','docs/cloud-goal90-review-correction.md','.mdkg/config.json']:
  paths.add(root/rel)
 for directory in ['src','scripts','tests','assets','release','docs/_generated','docs/src','docs/guides','.mdkg/templates','.mdkg/core','.mdkg/skills','.agents/skills','.claude/skills']:
  paths.update(p for p in (root/directory).rglob('*') if p.is_file())
 for prefix in ['goal-90','task-855','test-496','chk-678','chk-680']:paths.update((root/'.mdkg/work').glob(prefix+'-*.md'))
 return {str(p.relative_to(root)):{'sha256':sha(p),'mode':stat.S_IMODE(p.stat().st_mode)} for p in sorted(paths)}
def stable():
 if product()!=json.loads((cache/'product-inputs.json').read_text()):raise RuntimeError('frozen product inputs drifted')
 if manifest(root/'dist')!=json.loads((cache/'built-inputs.json').read_text()):raise RuntimeError('frozen built inputs drifted')
 if (cache/'installed-inputs.json').exists() and manifest(cache/'npm-consumer/node_modules/mdkg')!=json.loads((cache/'installed-inputs.json').read_text()):raise RuntimeError('installed inputs drifted')
results=json.loads((cache/'progress.json').read_text()) if (cache/'progress.json').exists() else []
def run(name,cmd,extra=None,timeout=180):
 if any(r['name']==name for r in results):raise RuntimeError('duplicate qualification '+name)
 e=dict(env);e.update(extra or {});log=cache/(name+'.log');start=utc();clock=time.monotonic()
 with log.open('x') as f:
  try:r=subprocess.run(cmd,cwd=root,env=e,stdout=f,stderr=subprocess.STDOUT,timeout=timeout);code=r.returncode
  except subprocess.TimeoutExpired:code=124
 text=log.read_text(errors='replace');rec={'name':name,'command':cmd,'environment_overrides':extra or {},'start':start,'end':utc(),'seconds':round(time.monotonic()-clock,3),'exit':code,'result':'PASSED' if code==0 else 'FAILED','log':log.name,'log_sha256':sha(log)}
 for key in ['tests','pass','fail','skipped','cancelled']:
  matches=re.findall(r'(?:ℹ|#) '+key+r' (\d+)',text)
  if matches:rec[key]=int(matches[-1])
 results.append(rec);save('progress.json',results);print(json.dumps(rec),flush=True)
 if code:print(text[-6000:],flush=True);raise RuntimeError('qualification failed '+name)
 return rec
phase=sys.argv[1]
if phase=='prepare':
 artifactDir=cache/'artifact';artifactDir.mkdir()
 run('pack-prepack',['npm','pack','--json','--pack-destination',str(artifactDir)],timeout=180)
 text=(cache/'pack-prepack.log').read_text();m=re.search(r'\[\s*\{\s*"id"',text);assert m,'npm package JSON absent';info=json.JSONDecoder().raw_decode(text[m.start():])[0][0]
 artifact=artifactDir/info['filename'];extraction=cache/'sealed-extraction'
 with tarfile.open(artifact) as tar:
  for member in tar.getmembers():
   if not member.name.startswith('package/') or '..' in member.name.split('/') or member.issym() or member.islnk():raise RuntimeError('unsafe package member')
   if any(s in member.name for s in ['.mdkg/working','.mdkg-graphs','tests/fixtures','.mdkg/artifacts']):raise RuntimeError('private/evidence package member')
   if member.isfile() and any(s in tar.extractfile(member).read() for s in [b'PRIVATE_REVIEW_CANARY',b'PRIVATE_EXPORT_CANARY',b'PRIVATE_LARGE_CANARY_',b'private synthetic canary']):raise RuntimeError('private canary payload')
  tar.extractall(extraction,filter='data')
 artifact.chmod(0o444);payload=manifest(extraction/'package')
 save('artifact.json',{'file':str(artifact),'sha256':sha(artifact),'bytes':artifact.stat().st_size,'prepack':'PASSED','private_canaries_absent':True,'files':payload,'npm_files':info['files']})
 consumer=cache/'npm-consumer'
 run('install-exact',['npm','install','--prefix',str(consumer),'--offline','--no-audit','--no-fund',str(artifact)])
 installed=manifest(consumer/'node_modules/mdkg');assert set(installed)==set(payload)
 assert all(installed[k]['sha256']==payload[k]['sha256'] for k in payload),'installed byte drift'
 save('installed-inputs.json',installed);save('installed-mode-changes.json',{k:{'tar':payload[k]['mode'],'npm':installed[k]['mode']} for k in payload if payload[k]['mode']!=installed[k]['mode']})
 old=json.loads(Path('/workspace/mdkg-cloud-review-cache/goal90/final/installed-inputs.json').read_text());save('rejected-payload-comparison.json',{'changed_files':[k for k in installed if k not in old or installed[k]['sha256']!=old[k]['sha256']],'added':sorted(set(installed)-set(old)),'removed':sorted(set(old)-set(installed))})
 run('test-compile',['npm','run','build:test'])
 sqlite=root/'.mdkg/index/mdkg.sqlite'
 if sqlite.is_file():
  (cache/'owned-sqlite-before.bin').write_bytes(sqlite.read_bytes());save('owned-sqlite-before.json',{'path':str(sqlite),'sha256':sha(sqlite),'mode':stat.S_IMODE(sqlite.stat().st_mode),'scope':'Generated cache only; saved before authorized graph validation. Restore after qualification without changing owner selection/artifacts.'})
 run('graph-warm',['node','dist/cli.js','validate','--json'])
 print('PREPARED',flush=True);sys.exit(0)
elif phase=='freeze':
 assert not (cache/'product-inputs.json').exists(),'freeze already exists'
 save('product-inputs.json',product());save('built-inputs.json',manifest(root/'dist'))
 run('candidate-inputs',['node','-e',"const fs=require('fs'),crypto=require('crypto');const api=require('./scripts/retained-release-candidate.js');const a=JSON.parse(fs.readFileSync(process.argv[1]));const value=api.candidateInputs(process.cwd(),a.file,a.sha256);fs.writeFileSync(process.argv[2],JSON.stringify(value,null,2)+'\\n',{flag:'wx',mode:0o444});console.log(JSON.stringify({artifact_sha256:a.sha256,package_inputs_sha256:value.package_inputs.sha256,payload_files:value.payload.length}));",str(cache/'artifact.json'),str(cache/'candidate-inputs.json')])
 save('environment.json',{'cwd':str(root),'rejected_head':'650f8258495b4904e113830529ed4ffb7b92cc09','base':'1e5b5981611b019c4ab0d14ec9d0bcccf3c171ef','branch':'cloud/goal90-independent-siblings','platform':platform.platform(),'native':True,'node':subprocess.check_output(['node','--version'],text=True).strip(),'npm':subprocess.check_output(['npm','--version'],text=True).strip(),'git':subprocess.check_output(['git','--version'],text=True).strip(),'harness_sha256':sha(Path(__file__)),'subreaper_sha256':sha(Path(subreaper)),'availability_counter':2,'frozen_product_sha256':sha(cache/'product-inputs.json'),'frozen_built_sha256':sha(cache/'built-inputs.json')})
 stable();print('FROZEN',flush=True);sys.exit(0)
stable()
feature=['tests/independent-graphs.test.mjs','tests/independent-graphs-review.test.mjs']
if phase in ['source','installed']:
 for version,node in runtimes:
  assert subprocess.check_output([node,'--version'],text=True).strip()=='v'+version
  extra={'MDKG_GRAPHS_PACKAGE':str(cache/'npm-consumer/node_modules/mdkg')} if phase=='installed' else {}
  run(phase+'-graphs-'+version,['python3',subreaper,node,'--test','--test-reporter=tap',*feature],extra,timeout=240)
  if phase=='source':run('source-loop-'+version,['python3',subreaper,node,'--test','--test-reporter=tap','--test-name-pattern','loop descriptor flags match parser branches and generated help','dist/tests/commands/command_contract.test.js'],timeout=60)
  else:run('installed-loop-'+version,['python3',subreaper,node,str(outer/'installed-loop.cjs')],extra,timeout=60)
  stable()
elif phase=='shared':
 selected=['commands/cli_option_admission','util/argparse','commands/git_observation','util/mutation_lock','core/config','core/config_read_admission','core/filesystem_authority','core/filesystem_nullable_read','graph/identity','graph/cache_containment','graph/cache_freshness','graph/workspace_containment','commands/mcp','commands/mcp_request_admission','commands/goal','commands/loop','commands/skill_mirrors','commands/db_index','commands/pack_output_containment','commands/bundle','commands/bundle_state','commands/goal88_init']
 files=['dist/tests/'+p+'.test.js' for p in selected]+['tests/working-storage.test.mjs','tests/cloud-working-host-contract.test.mjs']
 run('shared-callers',['python3',subreaper,'node','--test','--test-reporter=tap',*files],timeout=300)
elif phase=='static':
 for name,cmd in [('cli-matrix',['node','scripts/cli_help_snapshot.js','--check']),('cli-contract',['node','scripts/generate-command-contract.js','--check']),('docs',['npm','run','docs:check:built']),('security',['npm','run','security:verify']),('workflow',['node','scripts/generate-ci-workflow.js','--check']),('publish-static',['node','scripts/assert-publish-ready.js']),('skills',['node','dist/cli.js','skill','validate','--json']),('release-contracts',['python3',subreaper,'node','--test','--test-reporter=tap','tests/public-release.test.mjs','tests/publish-readiness-goal-contract.test.mjs','tests/security-remediation.test.mjs']),('docs-site',['npm','run','build','--prefix','docs']),('diff',['git','diff','--check'])]:run(name,cmd)
elif phase=='prepublish':
 a=json.loads((cache/'artifact.json').read_text());extra={'MDKG_RELEASE_SCOPE':'package','MDKG_RELEASE_RECEIPT_DIR':str(cache/'prepublish'),'MDKG_RELEASE_TARBALL':a['file'],'MDKG_RELEASE_TARBALL_SHA256':a['sha256'],'MDKG_RELEASE_INPUTS':str(cache/'candidate-inputs.json'),'MDKG_RELEASE_INPUTS_SHA256':sha(cache/'candidate-inputs.json')}
 run('canonical-prepublish',['python3',subreaper,'node','scripts/release-ladder.js','prepublish'],extra,timeout=3660)
 runs=list((cache/'prepublish').glob('run-*/receipt.json'));assert len(runs)==1
 receipt=json.loads(runs[0].read_text());assert receipt['ok'] and receipt['scope']=='package'
 save('prepublish-reference.json',{'receipt':str(runs[0]),'sha256':sha(runs[0]),'result':'PASSED','coverage':receipt.get('coverage'),'canonical_smokes':len(receipt.get('smokes',[]))})
else:raise RuntimeError('unknown phase')
stable();save('input-stability-'+phase+'.json',{'product_equal':True,'built_equal':True,'installed_equal':True,'checked_at':utc()});print('PHASE_PASSED',phase,flush=True)
