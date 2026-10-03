from pathlib import Path
import os,subprocess,json,hashlib,time,datetime
c=Path('/workspace/mdkg-cloud-review-cache/goal90/review-correction'); f=c/'final';tmp=Path('/dev/shm/mdkg-cloud-goal90-review-correction-fixtures/release-controls');tmp.mkdir(parents=True,exist_ok=True)
a=json.loads((f/'artifact.json').read_text());records=[]
for name,root in [('base','/workspace/mdkg-cloud-goal89'),('candidate','/workspace/mdkg-cloud-goal90')]:
 for variant in ['clear-retained-inputs','inherited-retained-inputs']:
  env={k:v for k,v in os.environ.items() if not k.upper().startswith('GIT_') and not k.startswith('MDKG_RELEASE_') and k not in ['MDKG_COVERAGE_DIR','MDKG_WORKING_PACKAGE','MDKG_GRAPHS_PACKAGE']};env['TMPDIR']=str(tmp)
  if variant=='inherited-retained-inputs':env.update(MDKG_RELEASE_SCOPE='package',MDKG_RELEASE_TARBALL=a['file'],MDKG_RELEASE_TARBALL_SHA256=a['sha256'],MDKG_RELEASE_INPUTS=str(f/'candidate-inputs.json'),MDKG_RELEASE_INPUTS_SHA256=hashlib.sha256((f/'candidate-inputs.json').read_bytes()).hexdigest())
  cmd=['python3','/workspace/mdkg-cloud-goal88-cache/subreaper.py','node','--test','--test-reporter=tap','--test-name-pattern','ladder keeps earlier receipts|ladder rejects a linked receipt','tests/qualification-output.test.mjs'];log=c/('release-control-'+name+'-'+variant+'.log');start=time.monotonic()
  with log.open('x') as out:r=subprocess.run(cmd,cwd=root,env=env,stdout=out,stderr=subprocess.STDOUT,timeout=45)
  records.append({'source':name,'cwd':root,'variant':variant,'command':cmd,'exit':r.returncode,'seconds':round(time.monotonic()-start,3),'log':log.name,'log_sha256':hashlib.sha256(log.read_bytes()).hexdigest()});print(json.dumps(records[-1]),flush=True)
  (c/'release-environment-controls.json').write_text(json.dumps({'controls':records,'limit':'Only the two failures named in the retained clean-run stdout excerpt. Remaining eleven clean-run failures and missing detailed/raw coverage receipts remain unclassified. Controls do not waive canonical gates.'},indent=2)+'\n')
