const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs');
const {target,fixture}=require('/workspace/mdkg-cloud-goal90/tests/fixtures/independent-graphs.cjs');
const contract=JSON.parse(fs.readFileSync(path.join(target,'dist/command-contract.json')));
const leaves={
 'loop list':['--root','--ws','--json','--no-cache','--no-reindex'],
 'loop show':['--meta','--root','--ws','--json','--no-cache','--no-reindex'],
 'loop fork':['--scope','--title','--materialization','--planning-only','--no-children','--dry-run','--run-id','--root','--ws','--json','--no-cache','--no-reindex'],
 'loop plan':['--root','--ws','--json','--no-cache','--no-reindex'],
 'loop next':['--root','--ws','--json','--no-cache','--no-reindex'],
 'loop runs':['--root','--ws','--json','--no-cache','--no-reindex'],
};
leaves.loop=[...new Set(Object.values(leaves).flat())];
const x=fixture();try{
 for(const [key,flags]of Object.entries(leaves)){
  const command=contract.commands.find(c=>c.key===key);assert.ok(command,key);
  assert.deepEqual(command.flags.map(f=>f.name).sort(),[...flags,'--graph','--help','--version'].sort(),key);
  assert.equal(command.flags.find(f=>f.name==='--graph').value,'<value>');
  const help=x.ok(['help',...key.split(' ')]).stdout;
  for(const flag of [...flags,'--graph'])assert.ok(help.includes(flag),key+' '+flag);
 }
 console.log(JSON.stringify({target,node:process.version,passed:7,failed:0,skipped:0,scope:'Exact installed descriptor and CLI help for seven loop targets; source test is separate.'}));
}finally{x.cleanup();}
