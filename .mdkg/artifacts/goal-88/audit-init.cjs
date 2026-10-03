// Synthetic source-built baseline audit. This is not installed-artifact qualification.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const repo = path.resolve(__dirname, '../../..');
const cli = path.join(repo, 'dist/cli.js');
const output = process.argv[2];
if (!output) throw new Error('Supply an explicit receipt output path');
const temp = fs.mkdtempSync('/tmp/mdkg-goal88-audit-');
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
function inventory(root) {
  const result = {};
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true }).sort((a,b) => a.name.localeCompare(b.name))) {
      if (entry.name === '.git') continue;
      const absolute = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(absolute);
      else if (entry.isFile()) result[path.relative(root, absolute).split(path.sep).join('/')] = hash(fs.readFileSync(absolute));
      else result[path.relative(root, absolute)] = 'nonregular';
    }
  }
  walk(root); return result;
}
const cases = [];
function fixture(name) {
  const root = path.join(temp, name); fs.mkdirSync(root);
  const git = spawnSync('git', ['init', '--initial-branch=fixture', root], { encoding: 'utf8' });
  assert.equal(git.status, 0, git.stderr); return root;
}
function run(root, args) {
  const start = Date.now();
  const result = spawnSync(process.execPath, [cli, '--root', root, ...args], { encoding:'utf8', timeout:30000 });
  if (result.error) throw result.error;
  const record = { case: path.basename(root), args, status: result.status, duration_ms: Date.now()-start,
    stdout: result.stdout, stderr: result.stderr, inventory: inventory(root) };
  cases.push(record); return record;
}
const started = new Date().toISOString();
try {
  for (const [name, flags] of [['default', []], ['agent', ['--agent']], ['graph-only', ['--graph-only']]]) {
    const root = fixture(name), first = run(root, ['init', ...flags]); assert.equal(first.status, 0, first.stderr);
    const second = run(root, ['init', ...flags]); assert.equal(second.status, 0, second.stderr);
    assert.deepEqual(second.inventory, first.inventory, `${name} repeat bytes`);
    const preview = run(root, ['upgrade', '--json']); assert.equal(preview.status,0,preview.stderr);
    const receipt = JSON.parse(preview.stdout); assert.equal(receipt.safe_to_apply, true);
    assert.deepEqual(receipt.will_write_paths, [], `${name} upgrade after fresh init`);
  }
  const invalid = fixture('invalid-combination'), before = inventory(invalid);
  assert.notEqual(run(invalid,['init','--agent','--graph-only']).status,0);
  assert.deepEqual(inventory(invalid),before);
  const custom = fixture('custom-instructions');
  for (const name of ['AGENTS.md','CLAUDE.md','AGENT_START.md']) fs.writeFileSync(path.join(custom,name),`Authored ${name} must survive.\n`);
  assert.equal(run(custom,['init']).status,0);
  const customBefore=inventory(custom); assert.equal(run(custom,['init']).status,0);
  assert.deepEqual(inventory(custom),customBefore);
  assert.equal(run(custom,['init','--force']).status,0);
  for (const name of ['AGENTS.md','CLAUDE.md','AGENT_START.md']) assert.ok(fs.readFileSync(path.join(custom,name),'utf8').startsWith(`Authored ${name} must survive.\n`));
  const extra = fixture('extra-mirrors'); assert.equal(run(extra,['init']).status,0);
  const configPath=path.join(extra,'.mdkg/config.json'), config=JSON.parse(fs.readFileSync(configPath,'utf8'));
  config.customization.skill_mirrors.targets.push('.synthetic-a/skills','.synthetic-b/skills');
  fs.writeFileSync(configPath,JSON.stringify(config,null,2)+'\n');
  assert.equal(run(extra,['skill','sync']).status,0);
  for (const slug of fs.readdirSync(path.join(extra,'.mdkg/skills')).filter(name=>fs.existsSync(path.join(extra,'.mdkg/skills',name,'SKILL.md')))) {
    const canonical=inventory(path.join(extra,'.mdkg/skills',slug));
    for (const target of config.customization.skill_mirrors.targets) assert.deepEqual(inventory(path.join(extra,target,slug)),canonical);
  }
  const malformed=fixture('malformed-markers');
  fs.writeFileSync(path.join(malformed,'AGENTS.md'),'Custom\n<!-- mdkg:instructions:start -->\n');
  const malformedBefore=inventory(malformed); assert.notEqual(run(malformed,['init']).status,0);
  assert.deepEqual(inventory(malformed),malformedBefore);
  // Record admission gaps as observations, never convert them into passing acceptance.
  for (const [name, targets] of [
    ['mirror-traversal', ['../escape/skills']], ['mirror-absolute', ['/tmp/escape/skills']],
    ['mirror-duplicate', ['.agents/skills','.agents/skills']],
    ['mirror-canonical', ['.mdkg/skills']],
    ['mirror-nested', ['.agents/skills','.agents/skills/nested']],
    ['mirror-case-alias', ['.agents/skills','.AGENTS/skills']],
    ['mirror-git', ['.git/skills']], ['mirror-custom-only', ['.synthetic-only/skills']],
  ]) {
    const root=fixture(name); assert.equal(run(root,['init']).status,0);
    const file=path.join(root,'.mdkg/config.json'), cfg=JSON.parse(fs.readFileSync(file,'utf8'));
    cfg.customization.skill_mirrors.targets=targets;
    fs.writeFileSync(file,JSON.stringify(cfg,null,2)+'\n');
    const result=run(root,['skill','sync']);
    result.boundary_observation={targets,admitted:result.status===0};
  }
  // Lossless deduplication: reconstruct inventory from the common base plus
  // replacements/removals, and stdout/stderr from the content-addressed pool.
  const baseline=cases[0].inventory, outputs={};
  const compactCases=cases.map(({inventory,stdout,stderr,...record})=>{
    const stdoutHash=hash(stdout),stderrHash=hash(stderr);
    outputs[stdoutHash]=stdout; outputs[stderrHash]=stderr;
    return {...record,stdout_sha256:stdoutHash,stderr_sha256:stderrHash,
      inventory:{base:'fresh-default',set:Object.fromEntries(Object.entries(inventory).filter(([k,v])=>baseline[k]!==v)),
        removed:Object.keys(baseline).filter(k=>inventory[k]===undefined)}};
  });
  fs.writeFileSync(output,JSON.stringify({schema_version:1,kind:'source-built-baseline-audit',started_at:started,
    completed_at:new Date().toISOString(),node:process.version,platform:process.platform,arch:process.arch,
    source_commit:spawnSync('git',['rev-parse','HEAD'],{cwd:repo,encoding:'utf8'}).stdout.trim(),
    package_version:JSON.parse(fs.readFileSync(path.join(repo,'package.json'))).version,
    cli_sha256:hash(fs.readFileSync(cli)),script_sha256:hash(fs.readFileSync(__filename)),
    inventory_bases:{'fresh-default':baseline},outputs,cases:compactCases},null,2)+'\n');
  console.log(`${cases.length} baseline invocations verified; receipt: ${output}`);
} finally { fs.rmSync(temp,{recursive:true,force:true}); }
