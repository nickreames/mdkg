// Synthetic CLI acceptance against an explicitly supplied retained npm artifact.
// Run outside node:test: node qualify-installed.cjs TAR SHA OLD_TAR OUTPUT.json
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const repo = path.resolve(__dirname, '../../..');
const { runInstalledSmoke } = require(path.join(repo, 'scripts/qualification-smoke'));
const { copyVerifiedArtifact } = require(path.join(repo, 'scripts/qualification-artifact'));
const [tarball, expected, oldTarball, output] = process.argv.slice(2);
assert.ok(tarball && /^[a-f0-9]{64}$/.test(expected) && oldTarball && output);
const old = JSON.parse(fs.readFileSync(path.join(__dirname, 'published-060.json'), 'utf8'));
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const calls = [], cases = [];
function inventory(root) {
  const files = {};
  function visit(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true }).sort((a,b) => a.name.localeCompare(b.name))) {
      const file = path.join(dir, entry.name), relative = path.relative(root, file).split(path.sep).join('/');
      if (entry.isDirectory()) visit(file);
      else files[relative] = entry.isSymbolicLink() ? 'link:' + fs.readlinkSync(file) : hash(fs.readFileSync(file));
    }
  }
  visit(root); return files;
}
const started = Date.now();
const receipt = runInstalledSmoke({
  prefix: 'mdkg-goal88-installed-',
  prepare(root, commands) {
    const local = path.join(root, 'candidate.tgz'), previous = path.join(root, 'previous.tgz');
    copyVerifiedArtifact(tarball, expected, local);
    copyVerifiedArtifact(oldTarball, old.sha256, previous);
    return { tarballPath: local, install() {
      const prefix = path.join(root, 'candidate'), previousPrefix = path.join(root, 'previous');
      for (const [dest, file] of [[prefix, local], [previousPrefix, previous]]) {
        commands.npm(['install', '--offline', '--prefix', dest, file, '--no-audit', '--no-fund']);
      }
      return { bin: path.join(prefix, 'node_modules/mdkg/dist/cli.js'),
        oldBin: path.join(previousPrefix, 'node_modules/mdkg/dist/cli.js'), commands };
    }};
  },
  exercise(base, { bin, oldBin, commands }) {
    const run = (root, args, previous = false, fail = false) => {
      const start = Date.now(), result = commands.node(previous ? oldBin : bin, args, root, { allowFailure: fail });
      calls.push({ fixture: path.basename(root), args, previous, exit: result.status, duration_ms: Date.now()-start,
        stdout_sha256: hash(result.stdout), stderr_sha256: hash(result.stderr) });
      if (fail) assert.notEqual(result.status, 0, result.stdout + result.stderr);
      return result.stdout;
    };
    const fixture = name => { const root=path.join(base,name); fs.mkdirSync(root); commands.git(['init','-q'],root); return root; };
    const targets = (root, values) => {const file=path.join(root,'.mdkg/config.json'), cfg=JSON.parse(fs.readFileSync(file));
      cfg.customization.skill_mirrors.targets=values; fs.writeFileSync(file,JSON.stringify(cfg,null,2)+'\n');};
    for (const [name, flags] of [['default',[]],['agent',['--agent']],['graph-only',['--graph-only']]]) {
      const root=fixture(name); run(root,['init',...flags]); const first=inventory(root);
      assert.equal(fs.existsSync(path.join(root,'CLAUDE.md')),false);
      assert.equal(fs.existsSync(path.join(root,'AGENTS.md')),name!=='graph-only');
      for (const file of ['AGENT_START.md','CLI_COMMAND_MATRIX.md','llms.txt','README.md','package.json','node_modules']) assert.equal(fs.existsSync(path.join(root,file)),false,file);
      run(root,['init',...flags]); assert.deepEqual(inventory(root),first);
      const preview=JSON.parse(run(root,['upgrade','--json'])); assert.deepEqual(preview.will_write_paths,[]);
      assert.deepEqual(inventory(root),first); cases.push({name,files:Object.keys(first).length,inventory_sha256:hash(JSON.stringify(first)),idempotent:true});
    }
    const invalid=fixture('invalid-profile'), empty=inventory(invalid);
    run(invalid,['init','--agent','--graph-only'],false,true); assert.deepEqual(inventory(invalid),empty); cases.push({name:'invalid-profile',unchanged:true});
    for (const custom of [false,true]) {
      const root=fixture(custom?'custom-published-060':'exact-published-060'); run(root,['init','--agent'],true);
      const original=fs.readFileSync(path.join(root,'CLAUDE.md'));
      if(custom) {fs.appendFileSync(path.join(root,'CLAUDE.md'),'\r\nUser CLAUDE bytes.\r\n'); fs.writeFileSync(path.join(root,'AGENT_START.md'),'User startup bytes\n');}
      const protectedFiles=['CLAUDE.md',...(custom?['AGENT_START.md']:[])], before=Object.fromEntries(protectedFiles.map(f=>[f,fs.readFileSync(path.join(root,f))]));
      const preview=JSON.parse(run(root,['upgrade','--json'])); assert.equal(preview.safe_to_apply,true);
      assert.equal(preview.will_write_paths.includes('CLAUDE.md'),false);
      run(root,['upgrade','--apply','--plan-hash',preview.plan_hash,'--json']);
      for (const [file,bytes] of Object.entries(before)) assert.deepEqual(fs.readFileSync(path.join(root,file)),bytes);
      const upgraded=inventory(root); assert.deepEqual(JSON.parse(run(root,['upgrade','--json'])).will_write_paths,[]);assert.deepEqual(inventory(root),upgraded);
      run(root,['init','--force']);for(const [file,bytes] of Object.entries(before))assert.deepEqual(fs.readFileSync(path.join(root,file)),bytes);
      cases.push({name:path.basename(root),baseline:'published0.6.0',generated_claude_sha256:hash(original),preserved:true});
    }
    const malformed=fixture('malformed-agents');fs.writeFileSync(path.join(malformed,'AGENTS.md'),'User\n<!-- mdkg:instructions:start -->\n');
    const malformedBefore=inventory(malformed);run(malformed,['init'],false,true);assert.deepEqual(inventory(malformed),malformedBefore);cases.push({name:'malformed-agents',unchanged:true});
    const legacy=fixture('malformed-claude');fs.writeFileSync(path.join(legacy,'CLAUDE.md'),'User\r\n<!-- mdkg:instructions:start -->\r\n');
    run(legacy,['init']);run(legacy,['init','--force']);assert.equal(fs.readFileSync(path.join(legacy,'CLAUDE.md'),'utf8'),'User\r\n<!-- mdkg:instructions:start -->\r\n');cases.push({name:'malformed-claude',preserved:true});
    const mirrors=fixture('mirror-resources');run(mirrors,['init']);const all=['.agents/skills','.claude/skills','.extra-a/skills','.extra-b/skills'];targets(mirrors,all);
    const source=path.join(mirrors,'.mdkg/skills/author-mdkg-skill');
    for(const file of ['references/example.md','assets/example.txt','scripts/nonexecuting.txt']){fs.mkdirSync(path.dirname(path.join(source,file)),{recursive:true});fs.writeFileSync(path.join(source,file),'Synthetic '+file+'\n');}
    for(const target of all){fs.mkdirSync(path.join(mirrors,target,'unmanaged'),{recursive:true});fs.writeFileSync(path.join(mirrors,target,'unmanaged/note.txt'),'User bytes\n');}
    run(mirrors,['skill','sync']);for(const target of all){assert.deepEqual(inventory(path.join(mirrors,target,'author-mdkg-skill')),inventory(source));assert.equal(fs.readFileSync(path.join(mirrors,target,'unmanaged/note.txt'),'utf8'),'User bytes\n');}
    const synced=inventory(mirrors);run(mirrors,['skill','sync']);assert.deepEqual(inventory(mirrors),synced);cases.push({name:'mirror-resources',targets:all,parity:true,unchanged_unmanaged:true});
    for(const policy of [['.mdkg/skills'],['.agents/skills','.agents/skills/nested'],['.agents/skills','.AGENTS/skills'],['.agents/skills','./.agents//skills'],['../escape'],['/tmp/escape'],['.git/skills']]){
      const root=fixture('policy-'+cases.length);run(root,['init']);targets(root,policy);const before=inventory(root);
      for(const flags of [[],['--force']]){run(root,['skill','sync',...flags],false,true);assert.deepEqual(inventory(root),before);}cases.push({name:path.basename(root),policy,refused_before_effects:true});
    }
    const link=fixture('mirror-symlink'), outside=fixture('outside-control');fs.writeFileSync(path.join(outside,'control.txt'),'Preserve outside bytes\n');run(link,['init']);
    fs.symlinkSync(outside,path.join(link,'.linked'),'dir');targets(link,['.linked/skills']);const beforeLink=inventory(link),beforeOutside=inventory(outside);
    run(link,['skill','sync','--force'],false,true);assert.deepEqual(inventory(link),beforeLink);assert.deepEqual(inventory(outside),beforeOutside);cases.push({name:'mirror-symlink',outside_unchanged:true});
    const conflict=fixture('late-conflict');run(conflict,['init']);targets(conflict,['.agents/skills','.claude/skills','.extra/skills']);
    fs.mkdirSync(path.join(conflict,'.extra/skills/author-mdkg-skill'),{recursive:true});fs.writeFileSync(path.join(conflict,'.extra/skills/author-mdkg-skill/SKILL.md'),'User collision\n');
    const beforeConflict=inventory(conflict);run(conflict,['skill','sync'],false,true);assert.deepEqual(inventory(conflict),beforeConflict);cases.push({name:'late-conflict',all_targets_unchanged:true});
    return {ok:true,kind:'installed-goal88-acceptance',runtime:process.version,platform:process.platform,arch:process.arch,
      published_baseline:old,cases,calls,case_count:cases.length,cli_invocations:calls.length};
  },
});
assert.equal(receipt.tarball_sha256,expected);
fs.writeFileSync(output,JSON.stringify({...receipt,duration_ms:Date.now()-started,script_sha256:hash(fs.readFileSync(__filename))},null,2)+'\n');
console.log(JSON.stringify({ok:true,cases:cases.length,cli_invocations:calls.length,tarball_sha256:expected,output}));
