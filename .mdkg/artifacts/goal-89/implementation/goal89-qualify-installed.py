from pathlib import Path
import json,subprocess,sys
exec(Path('/workspace/mdkg-cloud-review-cache/goal89-qualify.py').read_text().split('before=capture();')[0])
results=json.loads((cache/'progress.json').read_text()); before=json.loads((cache/'product-inputs.json').read_text()); prior=json.loads((cache/'checks.json').read_text())
if capture()!=before: raise RuntimeError('candidate inputs changed before installed continuation')
env.update(npm_config_cache=str(cache/'npm-cache'),ASTRO_TELEMETRY_DISABLED='1',XDG_CONFIG_HOME=str(cache/'astro-config'))
subreaper='/workspace/mdkg-cloud-goal88-cache/subreaper.py'; inventory=json.loads((cache/'package-inventory.json').read_text()); artifact=cache/inventory['filename']
if sha(artifact)!=inventory['sha256']: raise RuntimeError('artifact digest changed')
consumer=cache/'npm-consumer'; target=consumer/'node_modules/mdkg'
if target.exists():
 if not any(x['name']=='npm-install-exact' and x['exit']==0 for x in results): raise RuntimeError('installed consumer lacks successful custody receipt')
else:
 run('npm-install-exact',['npm','install','--prefix',str(consumer),'--no-audit','--no-fund','--offline',str(artifact)])
if not target.is_dir(): raise RuntimeError('exact install missing')
def installed_manifest(): return {str(p.relative_to(target)):{'sha256':sha(p),'mode':stat.S_IMODE(p.stat().st_mode)} for p in sorted(target.rglob('*')) if p.is_file()}
installed_before=installed_manifest(); (cache/'npm-installed-inputs.json').write_text(json.dumps(installed_before,indent=2)+'\n')
tarfiles=inventory['installed_files']
if set(installed_before)!=set(tarfiles) or any(installed_before[k]['sha256']!=tarfiles[k]['sha256'] for k in tarfiles): raise RuntimeError('npm file bytes differ from sealed tar extraction')
mode_diffs={k:{'tar':tarfiles[k]['mode'],'npm':installed_before[k]['mode']} for k in tarfiles if tarfiles[k]['mode']!=installed_before[k]['mode']}
if mode_diffs!={'dist/cli.js':{'tar':0o600,'npm':0o700}}: raise RuntimeError('unexpected installed mode changes')
(cache/'npm-bin-mode.json').write_text(json.dumps({'byte_inventories_equal':True,'mode_differences':mode_diffs,'meaning':'npm bin installation adds owner execution to dist/cli.js; exact tar and installed modes are retained, not normalized or waived.'},indent=2)+'\n')
for version,node in [('24.19.0','node'),('24.18.0','/workspace/mdkg-cloud-goal88-cache/qualification-3/node-v24.18.0-linux-x64/bin/node'),('24.21.0','/workspace/mdkg-cloud-review-cache/node-24.21.0/node-v24.21.0-linux-x64/bin/node')]:
 actual=subprocess.check_output([node,'--version'],text=True).strip()
 if actual!='v'+version: raise RuntimeError('runtime identity drift '+actual)
 run('installed-'+version,['python3',subreaper,node,'--test','tests/working-storage.test.mjs','tests/cloud-working-host-contract.test.mjs'],{'MDKG_WORKING_PACKAGE':str(target)})
run('installed-bin-version',[str(consumer/'node_modules/.bin/mdkg'),'--version'])
(cache/'installed-drift.json').write_text(json.dumps({'before_after_equal':installed_before==installed_manifest()},indent=2)+'\n')
after=capture(); drift=sorted(k for k in set(before)|set(after) if before.get(k)!=after.get(k)); (cache/'input-drift.json').write_text(json.dumps({'drift':drift,'before_after_equal':not drift},indent=2)+'\n')
superseded={'docs-site':'docs-site-owned-cache','marketing-site':'marketing-site-owned-cache','pack':'pack-owned-cache'}
prior.update(created=utc(),checks=results,input_drift=drift,artifact={'path':str(artifact),'sha256':sha(artifact)},transient_executor_failures_since_instruction=1,
 superseded_setup_failures=superseded,installed_target=str(target),qualification_harnesses={str(p):sha(p) for p in [Path('/workspace/mdkg-cloud-review-cache/goal89-qualify.py'),Path('/workspace/mdkg-cloud-review-cache/goal89-qualify-artifact.py'),Path('/workspace/mdkg-cloud-review-cache/goal89-qualify-installed.py')]},
 continuation_note='Default-cache site/pack setup failures corrected with owned workspace caches. Artifact phase stopped before installed tests due runner NameError(subreaper); next phase paused before tests on exact-mode inequality. Inspected successful install custody: all file bytes match, only npm bin dist/cli.js adds owner execution(0600 to0700). Recorded exact modes, reused retained install, only remaining tests performed. Completed checks and pack not duplicated.',
 installed_suite_scope='27 runtime cases plus one repository contract-document assertion, per native supported runtime; same qualification files on source and installed target')
(cache/'checks.json').write_text(json.dumps(prior,indent=2)+'\n')
for p in cache.iterdir():
 if p.is_file() and p.suffix in ['.log','.json']: (receipt/p.name).write_bytes(p.read_bytes())
for p in [Path('/workspace/mdkg-cloud-review-cache/goal89-qualify.py'),Path('/workspace/mdkg-cloud-review-cache/goal89-qualify-artifact.py'),Path('/workspace/mdkg-cloud-review-cache/goal89-qualify-installed.py')]: (receipt/p.name).write_bytes(p.read_bytes())
(root/'.mdkg/index/mdkg.sqlite').write_bytes(subprocess.check_output(['git','show','HEAD:.mdkg/index/mdkg.sqlite']))
fail=[x['name'] for x in results if x['exit'] and x['name'] not in superseded]
print('FINAL',json.dumps({'failed':fail,'drift':drift,'artifact':prior['artifact']}),flush=True); sys.exit(1 if drift or fail else 0)
