from pathlib import Path
import json,gzip,hashlib,shutil,datetime
c=Path('/workspace/mdkg-cloud-review-cache/goal90/review-correction');f=c/'final';r=Path('/workspace/mdkg-cloud-goal90');out=r/'.mdkg/artifacts/goal-90/review-correction'
out.mkdir(exist_ok=True)
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def save(source,target):
 target.parent.mkdir(parents=True,exist_ok=True)
 if source.suffix=='.log' or source.name=='coverage-event.json':
  target=target.with_name(target.name+'.gz');data=gzip.compress(source.read_bytes(),mtime=0)
 else:data=source.read_bytes()
 if target.exists():assert target.read_bytes()==data,('receipt conflict',str(target))
 else:target.write_bytes(data)
for p in sorted(c.iterdir()):
 if p.is_file() and p.suffix in ['.json','.log','.py','.cjs']:save(p,out/'controls'/p.name)
for p in sorted(f.iterdir()):
 if p.is_file() and p.suffix in ['.json','.log']:save(p,out/'qualification'/p.name)
run=f/'prepublish/run-18yHTw'
for p in [run/'receipt.json',run/'progress.json',run/'failure-classification-initial.json',run/'build-events.jsonl',run/'logs/coverage.log',run/'coverage/coverage-event.json']:
 if p.exists():save(p,out/'first-full-failure'/p.relative_to(run))
clean=json.load(open(f/'clean-run-terminal-receipt-recovered.json'))
gap={'observed_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'kind':'missing-clean-run-detail-evidence','receipt_dir':clean['receipt_dir'],'directory_exists':Path(clean['receipt_dir']).exists(),'retained':'canonical-prepublish-clean.log plus exact terminal JSON recovered from its stdout and wrapper record','missing':['on-disk progress/receipt originals','full coverage stdout/log','raw V8 coverage','concise coverage summary/metrics'],'known_result':{'ok':False,'pass':2877,'fail':13,'total':2891,'smokes_executed':0,'coverage_exit':1,'timed_out':False},'classification':'Two excerpt-identified qualification-output controls reproduce on base and candidate with retained-release input environment, and pass when those variables are cleared. Remaining eleven failures, loss of detailed output directory, and coverage percentages are unclassified/unavailable. No blanket environment attribution. No third full run or gate waiver.'}
(out/'clean-run-evidence-gap.json').write_text(json.dumps(gap,indent=2)+'\n')
sm=f/'supplemental-package37'
if (sm/'receipt.json').exists():
 d=json.load(open(sm/'receipt.json'))
 if 'result' in d:
  for p in sorted(sm.iterdir()):
   if p.is_file() and p.suffix in ['.json','.jsonl','.log']:save(p,out/'supplemental-package37'/p.name)
print(json.dumps({'receipts':len([p for p in out.rglob('*') if p.is_file()]),'bytes':sum(p.stat().st_size for p in out.rglob('*') if p.is_file())}))
