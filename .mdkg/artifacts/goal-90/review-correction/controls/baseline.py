from pathlib import Path
import os,subprocess,json,hashlib,time,datetime,re
cache=Path('/workspace/mdkg-cloud-review-cache/goal90/review-correction')
tmp=Path('/dev/shm/mdkg-cloud-goal90-review-correction-fixtures');tmp.mkdir(exist_ok=True)
repo=Path('/workspace/mdkg-cloud-goal90');base=Path('/workspace/mdkg-cloud-goal89')
subreaper='/workspace/mdkg-cloud-goal88-cache/subreaper.py'
runtimes=[('24.18.0','/workspace/mdkg-cloud-goal88-cache/qualification-3/node-v24.18.0-linux-x64/bin/node'),('24.21.0','/workspace/mdkg-cloud-review-cache/node-24.21.0/node-v24.21.0-linux-x64/bin/node')]
env={k:v for k,v in os.environ.items() if not k.upper().startswith('GIT_') and k!='MDKG_GRAPHS_PACKAGE'};env['TMPDIR']=str(tmp)
records=[]
def run(name,cmd,cwd,extra,expected):
 e=dict(env);e.update(extra);p=cache/(name+'.log');begin=datetime.datetime.now(datetime.timezone.utc).isoformat();start=time.monotonic()
 with p.open('x') as f:r=subprocess.run(cmd,cwd=cwd,env=e,stdout=f,stderr=subprocess.STDOUT,timeout=90)
 s=p.read_text();record={'name':name,'command':cmd,'cwd':str(cwd),'environment_overrides':extra,'start':begin,'seconds':round(time.monotonic()-start,3),'exit':r.returncode,'expected_exit':expected,'matched_expected':r.returncode==expected,'log':p.name,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()}
 for key in ['tests','pass','fail','skipped','cancelled']:
  m=re.search(r'(?:ℹ|#) '+key+r' (\d+)',s)
  if m:record[key]=int(m[1])
 records.append(record);(cache/'baseline-progress.json').write_text(json.dumps(records,indent=2)+'\n');print(json.dumps(record),flush=True)
 if r.returncode!=expected:print(s[-5000:],flush=True);raise RuntimeError('baseline reproduction did not match '+name)
for version,node in runtimes:
 assert subprocess.check_output([node,'--version'],text=True).strip()=='v'+version
 for kind,target in [('source',str(repo)),('installed','/workspace/mdkg-cloud-review-cache/goal90/final/npm-consumer/node_modules/mdkg')]:
  run('baseline-runtime-'+kind+'-'+version,['python3',subreaper,node,str(cache/'reproduce.cjs')],repo,{'MDKG_GRAPHS_PACKAGE':target},0)
 for kind,cwd,expected in [('base',base,0),('head',repo,1)]:
  run('baseline-loop-'+kind+'-'+version,['python3',subreaper,node,'--test','--test-reporter=tap','--test-name-pattern','loop descriptor flags match parser branches and generated help','dist/tests/commands/command_contract.test.js'],cwd,{},expected)
print('ALL_FOUR_REPRODUCED',flush=True)
