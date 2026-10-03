from pathlib import Path
import json, hashlib
exec(Path('/workspace/mdkg-cloud-review-cache/goal90/qualify.py').read_text().split('phase=sys.argv[1]')[0])
before=json.loads((cache/'product-inputs.json').read_text());after=product()
delta=[k for k in set(before)|set(after) if before.get(k)!=after.get(k)]
if delta!=['release/public-release.json']:raise RuntimeError('unexpected product delta '+repr(delta))
release=json.loads((root/'release/public-release.json').read_text())
if release['state']!='draft' or release['target_version']!='0.6.3':raise RuntimeError('draft metadata incorrect')
if manifest(root/'dist')!=json.loads((cache/'built-inputs.json').read_text()):raise RuntimeError('built drift')
inventory=json.loads((cache/'package-inventory.json').read_text());artifact=cache/inventory['filename']
if sha(artifact)!=inventory['sha256']:raise RuntimeError('tar drift')
target=cache/'npm-consumer/node_modules/mdkg'
if manifest(target)!=json.loads((cache/'installed-inputs.json').read_text()):raise RuntimeError('installed drift')
save('product-inputs-final.json',after)
save('metadata-input-reuse.json',{'changed_product_files':delta,'state_preserved':'draft',
 'runtime_source_unchanged':True,'compiled_build_unchanged':True,'feature_and_working_harnesses_unchanged':True,
 'package_bytes_unchanged':True,'installed_bytes_unchanged':True,'tar_sha256':sha(artifact),
 'reason':'Necessary draft release target/id parity correction; no runtime, tests, npm payload or visibility approval change.',
 'superseded_check':'release-contracts:23pass/5fail due stale0.6.2 target; retained as introduced metadata failure',
 'prior_product_sha256':sha(cache/'product-inputs.json'),'final_product_sha256':sha(cache/'product-inputs-final.json'),
 'harness_sha256':sha(Path(__file__))})
for version,node in runtimes:
 run('release-contracts-corrected-'+version,['python3',subreaper,node,'--test','--test-reporter=tap',
  'tests/public-release.test.mjs','tests/publish-readiness-goal-contract.test.mjs','tests/security-remediation.test.mjs'])
for name,cmd in [
 ('docs-corrected',['npm','run','docs:check:built']),('publish-static-corrected',['node','scripts/assert-publish-ready.js']),
 ('docs-site',['npm','run','build','--prefix','docs']),('diff',['git','diff','--check'])]:run(name,cmd)
if product()!=after or manifest(root/'dist')!=json.loads((cache/'built-inputs.json').read_text()):raise RuntimeError('final input drift')
if manifest(target)!=json.loads((cache/'installed-inputs.json').read_text()):raise RuntimeError('installed drift')
save('input-stability-static.json',{'final_product_equal':True,'built_equal':True,'installed_equal':True,
 'original_product_delta':delta,'corrected_at':utc(),'artifact_sha256':sha(artifact)})
print('METADATA_CORRECTION_PASSED',flush=True)
