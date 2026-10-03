from pathlib import Path
import os,subprocess,json,time,hashlib,datetime
cache=Path('/workspace/mdkg-cloud-review-cache/goal90/review-correction');dirty=cache/'fresh-ancestor-controls';dirty.mkdir()
clean=Path('/dev/shm/mdkg-cloud-goal90-review-correction-fixtures');clean.mkdir(exist_ok=True)
roots=[('base','/workspace/mdkg-cloud-goal89'),('candidate','/workspace/mdkg-cloud-goal90')]
families=[('working','tests/working-storage.test.mjs','fresh init creates independent host markers; repeat init preserves marker and legacy instructions'),('agent','dist/tests/commands/agent_file_types.test.js','validate and index accept valid Agent workflow file fixtures')]
records=[]
for name,root in roots:
 for environment,tmp,expected in [('workspace-empty-ancestor',dirty,1),('clean-shm',clean,0)]:
  for family,file,pattern in families:
   env={k:v for k,v in os.environ.items() if not k.upper().startswith('GIT_') and k not in ['MDKG_WORKING_PACKAGE','MDKG_GRAPHS_PACKAGE']};env['TMPDIR']=str(tmp)
   cmd=['python3','/workspace/mdkg-cloud-goal88-cache/subreaper.py','node','--test','--test-reporter=tap','--test-name-pattern',pattern,file]
   log=cache/('control-'+name+'-'+environment+'-'+family+'.log');start=time.monotonic()
   with log.open('x') as f:r=subprocess.run(cmd,cwd=root,env=env,stdout=f,stderr=subprocess.STDOUT,timeout=45)
   record={'source':name,'cwd':root,'environment':environment,'TMPDIR':str(tmp),'command':cmd,'exit':r.returncode,'expected':expected,'seconds':round(time.monotonic()-start,3),'log':log.name,'log_sha256':hashlib.sha256(log.read_bytes()).hexdigest(),'matched':r.returncode==expected};records.append(record)
   (cache/'ancestor-controls.json').write_text(json.dumps({'recorded':datetime.datetime.now(datetime.timezone.utc).isoformat(),'controls':records,'limit':'Two representative failures reproduced on baseline/candidate and pass with clean fixture ancestry; remaining full-run failures are not all attributed to this mechanism. No source changes or modifications to /workspace/.git or retained failed-run fixtures.'},indent=2)+'\n');print(json.dumps(record),flush=True)
   if not record['matched']:print(log.read_text()[-3000:]);raise RuntimeError('control mismatch')
print('ANCESTOR_CONTROLS_MATCHED',flush=True)
