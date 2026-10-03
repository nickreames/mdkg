from pathlib import Path
import os, sys, subprocess, json, hashlib, datetime, time, platform, tarfile, stat, re

root = Path('/workspace/mdkg-cloud-goal90')
cache = Path('/workspace/mdkg-cloud-review-cache/goal90/final')
cache.mkdir(exist_ok=True)
tmp = Path('/dev/shm/mdkg-cloud-goal90-fixtures'); tmp.mkdir(exist_ok=True)
env = {k:v for k,v in os.environ.items() if not k.upper().startswith('GIT_')}
env.update(TMPDIR=str(tmp), npm_config_cache=str(cache/'npm-cache'),
           XDG_CONFIG_HOME=str(cache/'astro-config'), ASTRO_TELEMETRY_DISABLED='1',
           MDKG_WORKING_LEGACY_PACKAGE='/workspace/mdkg-cloud-goal88')
subreaper = '/workspace/mdkg-cloud-goal88-cache/subreaper.py'
runtimes = [('24.19.0','node'),
 ('24.18.0','/workspace/mdkg-cloud-goal88-cache/qualification-3/node-v24.18.0-linux-x64/bin/node'),
 ('24.21.0','/workspace/mdkg-cloud-review-cache/node-24.21.0/node-v24.21.0-linux-x64/bin/node')]
def sha(p): return hashlib.sha256(p.read_bytes()).hexdigest()
def save(name,data): (cache/name).write_text(json.dumps(data,indent=2)+'\n')
def utc(): return datetime.datetime.now(datetime.timezone.utc).isoformat()
def manifest(directory):
 return {str(p.relative_to(directory)):{'sha256':sha(p),'mode':stat.S_IMODE(p.stat().st_mode)}
         for p in sorted(directory.rglob('*')) if p.is_file()}
def product():
 paths=set(root.glob('tsconfig*.json'))
 for file in ['package.json','package-lock.json','README.md','CHANGELOG.md','CLI_COMMAND_MATRIX.md',
              'docs/astro.config.mjs','docs/package.json','docs/package-lock.json',
              'docs/cloud-goal90-design.md','docs/cloud-goal90-validation-plan.md']:
  paths.add(root/file)
 for directory in ['src','scripts','tests','assets','release','docs/_generated','docs/src',
                   '.mdkg/templates','.mdkg/core','.mdkg/skills','.agents/skills','.claude/skills']:
  paths.update(p for p in (root/directory).rglob('*') if p.is_file())
 return {str(p.relative_to(root)):{'sha256':sha(p),'mode':stat.S_IMODE(p.stat().st_mode)} for p in sorted(paths)}
def stable():
 if product()!=json.loads((cache/'product-inputs.json').read_text()): raise RuntimeError('product inputs drifted')
 if manifest(root/'dist')!=json.loads((cache/'built-inputs.json').read_text()): raise RuntimeError('built inputs drifted')
results=json.loads((cache/'progress.json').read_text()) if (cache/'progress.json').exists() else []
def run(name,cmd,extra=None,timeout=180):
 if any(x['name']==name for x in results): raise RuntimeError('duplicate qualification execution '+name)
 log=cache/(name+'.log'); e=dict(env);e.update(extra or {});begin=utc();s=time.monotonic()
 with log.open('w') as out:
  try: code=subprocess.run(cmd,cwd=root,env=e,stdout=out,stderr=subprocess.STDOUT,timeout=timeout).returncode
  except subprocess.TimeoutExpired: code=124
 text=log.read_text(errors='replace')
 record={'name':name,'command':cmd,'environment_overrides':extra or {},'start':begin,'end':utc(),
         'seconds':round(time.monotonic()-s,3),'exit':code,'result':'PASSED' if code==0 else 'FAILED',
         'log':log.name,'log_sha256':sha(log)}
 for key in ['tests','pass','fail','skipped','cancelled']:
  m=re.search(r'(?:ℹ|#) '+key+r' (\d+)',text)
  if m:record[key]=int(m[1])
 results.append(record);save('progress.json',results);print(json.dumps(record),flush=True)
 if code:print(text[-6000:],flush=True);raise RuntimeError('qualification failed '+name)
 return record

phase=sys.argv[1]
if phase=='freeze':
 if (cache/'product-inputs.json').exists():raise RuntimeError('freeze exists')
 save('product-inputs.json',product());save('built-inputs.json',manifest(root/'dist'))
 save('environment.json',{'cwd':str(root),'base':'1e5b5981611b019c4ab0d14ec9d0bcccf3c171ef',
  'branch':'cloud/goal90-independent-siblings','platform':platform.platform(),'arch':platform.machine(),
  'native':True,'node':subprocess.check_output(['node','--version'],text=True).strip(),
  'npm':subprocess.check_output(['npm','--version'],text=True).strip(),
  'git':subprocess.check_output(['git','--version'],text=True).strip(),'harness_sha256':sha(Path(__file__)),
  'subreaper_sha256':sha(Path(subreaper)),'transient_failures':2})
 print('FROZEN',sha(cache/'product-inputs.json'),sha(cache/'built-inputs.json'),flush=True)
 sys.exit(0)
stable()
feature=['tests/independent-graphs.test.mjs']
nearby=['tests/working-storage.test.mjs','tests/cloud-working-host-contract.test.mjs']
if phase=='source':
 for version,node in runtimes:
  if subprocess.check_output([node,'--version'],text=True).strip()!='v'+version:raise RuntimeError('runtime drift')
  run('source-feature-'+version,['python3',subreaper,node,'--test','--test-reporter=tap',*feature],timeout=180)
 selected=['commands/cli_option_admission','util/argparse','commands/git_observation','util/mutation_lock',
  'core/config','core/config_read_admission','core/filesystem_authority','core/filesystem_nullable_read',
  'graph/identity','graph/cache_containment','graph/cache_freshness','graph/workspace_containment',
  'commands/mcp','commands/mcp_request_admission','commands/goal','commands/loop','commands/skill_mirrors','commands/db_index',
  'commands/pack_output_containment','commands/bundle','commands/bundle_state','commands/goal88_init']
 compiled=['dist/tests/'+p+'.test.js' for p in selected]
 for file in compiled:
  if not (root/file).is_file():raise RuntimeError('missing selected test '+file)
 run('shared-regressions',['python3',subreaper,'node','--test','--test-reporter=tap',*compiled,*nearby],timeout=300)
elif phase=='artifact':
 run('pack',['npm','pack','--ignore-scripts','--json','--pack-destination',str(cache)])
 text=(cache/'pack.log').read_text();info=json.JSONDecoder().raw_decode(text[text.index('['):])[0][0]
 artifact=cache/info['filename'];extraction=cache/'sealed-extraction'
 with tarfile.open(artifact) as tar:
  for member in tar.getmembers():
   if not member.name.startswith('package/') or '..' in member.name.split('/') or member.issym() or member.islnk():raise RuntimeError('unsafe tar path')
   if any(x in member.name for x in ['.mdkg/working','.mdkg-graphs','tests/fixtures','.mdkg/artifacts']):raise RuntimeError('private graph/evidence payload')
   if member.isfile():
    data=tar.extractfile(member).read()
    if any(s in data for s in [b'PRIVATE_EXPORT_CANARY',b'PRIVATE_LARGE_CANARY_',b'private synthetic canary']):raise RuntimeError('private canary in package')
  tar.extractall(extraction,filter='data')
 tar_files=manifest(extraction/'package')
 save('package-inventory.json',{'filename':artifact.name,'sha256':sha(artifact),'files':tar_files,
  'npm_files':info['files'],'private_canaries_absent':True,'prepack_and_publication_gates':'NOT_RUN -- draft artifact only'})
 consumer=cache/'npm-consumer';target=consumer/'node_modules/mdkg'
 run('install-exact',['npm','install','--prefix',str(consumer),'--offline','--no-audit','--no-fund',str(artifact)])
 installed=manifest(target);save('installed-inputs.json',installed)
 if set(installed)!=set(tar_files) or any(installed[k]['sha256']!=tar_files[k]['sha256'] for k in tar_files):raise RuntimeError('npm installed byte drift')
 save('installed-mode-changes.json',{k:{'tar':tar_files[k]['mode'],'npm':installed[k]['mode']} for k in tar_files if tar_files[k]['mode']!=installed[k]['mode']})
 for version,node in runtimes:
  run('installed-feature-'+version,['python3',subreaper,node,'--test','--test-reporter=tap',*feature],{'MDKG_GRAPHS_PACKAGE':str(target)},timeout=180)
  run('installed-working-'+version,['python3',subreaper,node,'--test','--test-reporter=tap',*nearby],{'MDKG_WORKING_PACKAGE':str(target)},timeout=180)
 run('installed-bin-version',[str(consumer/'node_modules/.bin/mdkg'),'--version'])
 if installed!=manifest(target):raise RuntimeError('installed payload drift')
elif phase=='static':
 for name,cmd in [
  ('cli-matrix',['node','scripts/cli_help_snapshot.js','--check']),
  ('cli-contract',['node','scripts/generate-command-contract.js','--check']),
  ('docs',['npm','run','docs:check:built']),
  ('guidance',['python3',subreaper,'node','--test','--test-reporter=tap','tests/release-guidance.test.mjs']),
  ('graph',['node','dist/cli.js','validate','--json']),('skills',['node','dist/cli.js','skill','validate','--json']),
  ('security',['npm','run','security:verify']),('workflow',['node','scripts/generate-ci-workflow.js','--check']),
  ('publish-static',['node','scripts/assert-publish-ready.js']),
  ('release-contracts',['python3',subreaper,'node','--test','--test-reporter=tap','tests/public-release.test.mjs','tests/publish-readiness-goal-contract.test.mjs','tests/security-remediation.test.mjs']),
  ('docs-site',['npm','run','build','--prefix','docs']),('diff',['git','diff','--check'])]:run(name,cmd)
else:raise RuntimeError('unknown phase')
stable();save('input-stability-'+phase+'.json',{'product_equal':True,'built_equal':True,'checked_at':utc()})
print('PHASE_PASSED',phase,flush=True)
