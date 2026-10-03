from pathlib import Path
import json,subprocess,tarfile,sys
# Reuse the recorded runner helpers, not its already completed operations.
exec(Path('/workspace/mdkg-cloud-review-cache/goal89-qualify.py').read_text().split('before=capture();')[0])
prior=json.loads((cache/'checks.json').read_text()); results=prior['checks']; before=json.loads((cache/'product-inputs.json').read_text())
if capture()!=before: raise RuntimeError('candidate inputs changed before artifact continuation')
env.update(npm_config_cache=str(cache/'npm-cache'),ASTRO_TELEMETRY_DISABLED='1',XDG_CONFIG_HOME=str(cache/'astro-config'))
run('docs-site-owned-cache',['npm','run','build','--prefix','docs'])
run('marketing-site-owned-cache',['npm','run','build','--prefix','mdkg-dev'])
packcode=run('pack-owned-cache',['npm','pack','--ignore-scripts','--json','--pack-destination',str(cache)])
artifact=None
if not packcode:
 raw=(cache/'pack-owned-cache.log').read_text(); info=json.JSONDecoder().raw_decode(raw[raw.index('['):])[0]
 artifact=cache/info[0]['filename']; installed=cache/'installed'; installed.mkdir(exist_ok=True)
 with tarfile.open(artifact) as tar:
  names=tar.getnames()
  if any(not (n=='package' or n.startswith('package/')) or '..' in n.split('/') or tar.getmember(n).issym() or tar.getmember(n).islnk() for n in names): raise RuntimeError('unsafe pack inventory')
  if any('.mdkg/working' in n for n in names): raise RuntimeError('working artifact in package')
  for member in tar.getmembers():
   if member.isfile():
    data=tar.extractfile(member).read()
    if any(x in data for x in [b'PRIVATE_CACHE_CANARY',b'PRIVATE RAW CANARY',b'PRIVATE UNEXPORTED BODY',b'synthetic private draft canary']): raise RuntimeError('synthetic private canary in package')
  tar.extractall(installed,filter='data')
 target=installed/'package'
 if json.loads((target/'package.json').read_text())['version']!='0.6.2': raise RuntimeError('artifact version mismatch')
 def installed_manifest(): return {str(p.relative_to(target)):{'sha256':sha(p),'mode':stat.S_IMODE(p.stat().st_mode)} for p in sorted(target.rglob('*')) if p.is_file()}
 inventory={'filename':artifact.name,'sha256':sha(artifact),'files':info[0]['files'],'unpacked_size':info[0]['unpackedSize'],'installed_files':installed_manifest(),'private_working_canaries_absent':True}
 (cache/'package-inventory.json').write_text(json.dumps(inventory,indent=2)+'\n')
 run('postinstall',['node',str(target/'scripts/postinstall.js')])
 for version,node in [('24.19.0','node'),('24.18.0','/workspace/mdkg-cloud-goal88-cache/qualification-3/node-v24.18.0-linux-x64/bin/node'),('24.21.0','/workspace/mdkg-cloud-review-cache/node-24.21.0/node-v24.21.0-linux-x64/bin/node')]:
  actual=subprocess.check_output([node,'--version'],text=True).strip()
  if actual!='v'+version: raise RuntimeError('runtime identity drift '+actual)
  run('installed-'+version,['python3',subreaper,node,'--test','tests/working-storage.test.mjs','tests/cloud-working-host-contract.test.mjs'],{'MDKG_WORKING_PACKAGE':str(target)})
 (cache/'installed-drift.json').write_text(json.dumps({'before_after_equal':inventory['installed_files']==installed_manifest()},indent=2)+'\n')
after=capture(); drift=sorted(k for k in set(before)|set(after) if before.get(k)!=after.get(k)); (cache/'input-drift.json').write_text(json.dumps({'drift':drift,'before_after_equal':not drift},indent=2)+'\n')
latest={x['name']:x for x in results}; superseded={'docs-site':'docs-site-owned-cache','marketing-site':'marketing-site-owned-cache','pack':'pack-owned-cache'}
prior.update(created=utc(),checks=results,input_drift=drift,artifact={'path':str(artifact),'sha256':sha(artifact)} if artifact else None,transient_executor_failures_since_instruction=1,
 retry_note='Only failed default-cache site/pack setup steps rerun with explicit owned workspace caches; no denial bypass. Completed source/static checks not repeated.', superseded_setup_failures=superseded)
(cache/'checks.json').write_text(json.dumps(prior,indent=2)+'\n')
for p in cache.iterdir():
 if p.is_file() and p.suffix in ['.log','.json']: (receipt/p.name).write_bytes(p.read_bytes())
(root/'.mdkg/index/mdkg.sqlite').write_bytes(subprocess.check_output(['git','show','HEAD:.mdkg/index/mdkg.sqlite']))
fail=[x['name'] for x in results if x['exit'] and x['name'] not in superseded]
print('FINAL',json.dumps({'failed':fail,'drift':drift,'artifact':prior['artifact']}),flush=True); sys.exit(1 if drift or fail else 0)
