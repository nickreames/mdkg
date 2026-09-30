// Synthetic CLI cases reusable against an installed package. No network, user
// data, global Git configuration, or files outside this exact owned fixture.
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
const crypto = require('node:crypto'), { spawnSync } = require('node:child_process');

function qualifySkillRegistryAdmission({ cli, tempRoot, node = process.execPath }) {
  const owned = fs.mkdtempSync(path.join(tempRoot, 'skill-registry-'));
  const env = { PATH: process.env.PATH, LC_ALL: 'C', TMPDIR: owned, GIT_CONFIG_NOSYSTEM: '1',
    GIT_CONFIG_GLOBAL: '/dev/null', GIT_TERMINAL_PROMPT: '0' };
  const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
  const inventory = root => {
    const rows = [];
    function walk(dir) {
      for (const name of fs.readdirSync(dir).sort()) {
        const file = path.join(dir, name), stat = fs.lstatSync(file), relative = path.relative(root, file);
        if (stat.isDirectory()) { rows.push([relative, 'directory', stat.mode]); walk(file); }
        else if (stat.isSymbolicLink()) rows.push([relative, 'link', fs.readlinkSync(file)]);
        else if (stat.isFile()) rows.push([relative, 'file', stat.mode, hash(fs.readFileSync(file))]);
        else rows.push([relative, 'special', stat.mode]);
      }
    }
    walk(root); return rows;
  };
  const run = (root, args) => spawnSync(node, [cli, ...args], { cwd: root, env, encoding: 'utf8', timeout: 5000, killSignal: 'SIGKILL', maxBuffer: 4 * 1024 * 1024 });
  const ok = result => { assert.equal(result.error, undefined); assert.equal(result.signal, null); assert.equal(result.status, 0, result.stdout + result.stderr); return result; };
  const cases = [];
  function check(name, fn) { try { fn(); cases.push({ name, pass: true }); } catch (error) { cases.push({ name, pass: false, error: error.message }); } }
  let number = 0;
  function setup(custom = false, maxBytes = 8192) {
    const base = path.join(owned, String(++number)), root = path.join(base, 'project'), outside = path.join(base, 'outside');
    fs.mkdirSync(root, { recursive: true }); fs.mkdirSync(outside);
    ok(run(root, ['init', '--graph-only']));
    const configPath = path.join(root, '.mdkg/config.json'), config = JSON.parse(fs.readFileSync(configPath));
    if (custom) { config.workspaces.root.path = 'nested'; config.workspaces.root.mdkg_dir = '.graph'; }
    config.index.limits.max_file_bytes = maxBytes;
    fs.writeFileSync(configPath, JSON.stringify(config));
    const skills = path.join(root, custom ? 'nested/.graph/skills' : '.mdkg/skills');
    fs.mkdirSync(skills, { recursive: true });
    const registry = path.join(skills, 'registry.md'), sentinel = path.join(outside, 'sentinel.md');
    fs.writeFileSync(sentinel, 'SYNTHETIC-EXTERNAL-REGISTRY-CONTENT\n');
    return { base, root, outside, skills, registry, sentinel };
  }
  const skillArgs = ['skill', 'new', 'admitted-skill', 'Admitted skill', '--description', 'Synthetic registry admission control', '--json'];
  const fifo = file => { const r = spawnSync('mkfifo', [file], { env, encoding: 'utf8', timeout: 3000 }); assert.equal(r.status, 0, r.stderr); };
  const unsafe = [
    ['external symlink', f => fs.symlinkSync(f.sentinel, f.registry)],
    ['relative external symlink', f => fs.symlinkSync(path.relative(f.skills, f.sentinel), f.registry)],
    ['internal symlink', f => { const target = path.join(f.root, 'authored.md'); fs.writeFileSync(target, 'user-authored\n'); fs.symlinkSync(target, f.registry); }],
    ['dangling symlink', f => fs.symlinkSync(path.join(f.outside, 'absent.md'), f.registry)],
    ['directory', f => fs.mkdirSync(f.registry)],
    ['FIFO', f => fifo(f.registry)],
    ['device symlink', f => fs.symlinkSync('/dev/null', f.registry)],
    ['oversized regular registry', f => fs.writeFileSync(f.registry, Buffer.alloc(8193, 32))],
    ['linked skills ancestor', f => { fs.rmdirSync(f.skills); fs.symlinkSync(f.outside, f.skills); }],
  ];
  try {
    for (const custom of [false]) for (const [name, poison] of unsafe) check(`${custom ? 'custom' : 'default'} new refuses ${name} without partial writes`, () => {
      const f = setup(custom); poison(f); const before = inventory(f.base), result = run(f.root, skillArgs);
      assert.equal(result.error, undefined, String(result.error)); assert.equal(result.signal, null);
      assert.notEqual(result.status, 0, 'unsafe registry was accepted');
      assert.match(result.stdout + result.stderr, /contained|symbolic|linked|file|byte limit/i);
      assert.deepEqual(inventory(f.base), before, 'refusal changed authored/generated/Git/other fixture state');
    });
    check('force refuses a linked registry without replacing an existing skill', () => {
      const f = setup(); ok(run(f.root, skillArgs)); fs.unlinkSync(f.registry); fs.symlinkSync(f.sentinel, f.registry);
      const before = inventory(f.base), result = run(f.root, [...skillArgs, '--force']);
      assert.equal(result.error, undefined); assert.notEqual(result.status, 0); assert.deepEqual(inventory(f.base), before);
    });
    check('force refuses a linked pending skill before creating resources or projections', () => {
      const f = setup(), file = path.join(f.skills, 'admitted-skill/SKILL.md'); fs.mkdirSync(path.dirname(file)); fs.symlinkSync(f.sentinel, file);
      const before = inventory(f.base), result = run(f.root, [...skillArgs, '--force']);
      assert.equal(result.error, undefined); assert.notEqual(result.status, 0); assert.match(result.stderr, /symbolic link/);
      assert.deepEqual(inventory(f.base), before);
    });
    for (const operation of ['new', 'force', 'sync']) check(`${operation} refuses an oversized mirror manifest before all effects`, () => {
      const f = setup();
      if (operation === 'force') ok(run(f.root, skillArgs));
      const manifest = path.join(f.root, '.agents/skills/.mdkg-managed.json'); fs.mkdirSync(path.dirname(manifest), { recursive: true });
      fs.writeFileSync(manifest, JSON.stringify({ managed_slugs: [], padding: 'x'.repeat(8193) }));
      const before = inventory(f.base), result = run(f.root, operation === 'sync' ? ['skill', 'sync', '--force', '--json'] : [...skillArgs, ...(operation === 'force' ? ['--force'] : [])]);
      assert.equal(result.error, undefined); assert.equal(result.signal, null); assert.notEqual(result.status, 0, 'oversized mirror manifest accepted');
      assert.match(result.stderr, /byte limit/); assert.deepEqual(inventory(f.base), before);
    });
    check('a boundary-equal regular mirror manifest remains usable', () => {
      const f = setup(), manifest = path.join(f.root, '.agents/skills/.mdkg-managed.json'); fs.mkdirSync(path.dirname(manifest), { recursive: true });
      const base = JSON.stringify({ managed_slugs: [], padding: '' });
      fs.writeFileSync(manifest, JSON.stringify({ managed_slugs: [], padding: 'x'.repeat(8192 - Buffer.byteLength(base)) }));
      assert.equal(fs.statSync(manifest).size, 8192); ok(run(f.root, skillArgs));
      assert(JSON.parse(fs.readFileSync(manifest)).managed_slugs.includes('admitted-skill'));
    });
    for (const budget of ['file', 'combined', 'count']) check(`pending source ${budget} budget refuses before all effects`, () => {
      const f = setup(), configPath = path.join(f.root, '.mdkg/config.json'), config = JSON.parse(fs.readFileSync(configPath));
      const source = name => path.join(f.skills, name, 'SKILL.md');
      const writeSource = (name, padding) => { const file = source(name); fs.mkdirSync(path.dirname(file)); fs.writeFileSync(file, `---\nname: ${name}\ndescription: synthetic source\n---\n` + padding); };
      writeSource('existing', budget === 'file' ? 'é'.repeat(8192) : '');
      if (budget === 'combined') config.index.limits.max_total_bytes = 100;
      if (budget === 'count') { writeSource('second', ''); config.index.limits.max_files = 2; }
      fs.writeFileSync(configPath, JSON.stringify(config));
      const initialized = spawnSync('git', ['init', '-q'], { cwd: f.root, env, encoding: 'utf8', timeout: 3000 });
      assert.equal(initialized.status, 0, initialized.stderr);
      const before = inventory(f.base), result = run(f.root, skillArgs);
      assert.equal(result.error, undefined); assert.equal(result.signal, null); assert.notEqual(result.status, 0);
      assert.match(result.stderr, /byte limit|file limit|entry limit/);
      assert.deepEqual(inventory(f.base), before, 'source budget refusal changed skill, registry, index or Git custody');
    });
    check('prospective directory and registry entries share the discovery limit', () => {
      const f = setup(), file = path.join(f.root, '.mdkg/config.json'), c = JSON.parse(fs.readFileSync(file));
      c.index.limits.max_files = 1; fs.writeFileSync(file, JSON.stringify(c));
      const before = inventory(f.base), denied = run(f.root, skillArgs);
      assert.equal(denied.error, undefined); assert.notEqual(denied.status, 0); assert.match(denied.stderr, /file limit|entry(?:\/depth)? limit/);
      assert.deepEqual(inventory(f.base), before);
      c.index.limits.max_files = 2; fs.writeFileSync(file, JSON.stringify(c));
      const resourceBefore = inventory(f.base), resourceDenied = run(f.root, skillArgs);
      assert.equal(resourceDenied.error, undefined); assert.notEqual(resourceDenied.status, 0);
      assert.match(resourceDenied.stderr, /resource inventory exceeds entry\/depth limit/);
      assert.deepEqual(inventory(f.base), resourceBefore);
      c.index.limits.max_files = 3; fs.writeFileSync(file, JSON.stringify(c));
      ok(run(f.root, skillArgs)); assert(fs.existsSync(path.join(f.skills, 'admitted-skill/SKILL.md')));
    });
    check('force can replace an oversized existing source with bounded content', () => {
      const f = setup(), file = path.join(f.skills, 'admitted-skill/SKILL.md'); fs.mkdirSync(path.dirname(file));
      fs.writeFileSync(file, 'invalid superseded source\n' + 'é'.repeat(8192));
      ok(run(f.root, [...skillArgs, '--force']));
      assert(fs.statSync(file).size <= 8192); assert.match(fs.readFileSync(f.registry, 'utf8'), /Admitted skill/);
    });
    for (const custom of [false]) for (const kind of ['missing', 'customized', 'managed', 'hardlinked']) check(`${custom ? 'custom' : 'default'} regular ${kind} registry retains customization`, () => {
      const f = setup(custom), prefix = '# My registry\n\nKeep my project notes.\n', suffix = '\nKeep my footer.\n';
      if (kind === 'customized') fs.writeFileSync(f.registry, prefix);
      if (kind === 'managed') fs.writeFileSync(f.registry, prefix + '<!-- mdkg:skill-registry:start -->\nold generated entry\n<!-- mdkg:skill-registry:end -->' + suffix);
      if (kind === 'hardlinked') fs.linkSync(f.sentinel, f.registry);
      const sentinel = fs.readFileSync(f.sentinel);
      const receipt = JSON.parse(ok(run(f.root, skillArgs)).stdout); assert.equal(receipt.action, 'created');
      const raw = fs.readFileSync(f.registry, 'utf8'); assert.match(raw, /`admitted-skill`/);
      if (kind === 'customized' || kind === 'managed') assert(raw.startsWith(prefix));
      if (kind === 'managed') { assert(raw.endsWith(suffix)); assert(!raw.includes('old generated entry')); }
      if (kind === 'hardlinked') assert(raw.startsWith(sentinel.toString()));
      assert.deepEqual(fs.readFileSync(f.sentinel), sentinel);
      assert(fs.existsSync(path.join(f.skills, 'admitted-skill/SKILL.md')));
      assert.equal(fs.existsSync(path.join(f.root, '.mdkg/index/write.lock')), false);
    });
    check('CLI rejects unsupported custom root configuration without effects', () => {
      const f = setup(true), before = inventory(f.base), result = run(f.root, skillArgs);
      assert.equal(result.error, undefined); assert.notEqual(result.status, 0);
      assert.match(result.stderr, /workspaces.root.path must be|workspaces.root.mdkg_dir must be/);
      assert.deepEqual(inventory(f.base), before);
    });
    check('ordinary force updates an existing skill with an admitted customized registry', () => {
      const f = setup(); fs.writeFileSync(f.registry, '# Keep these notes\n'); ok(run(f.root, skillArgs));
      const args = [...skillArgs, '--force']; args[3] = 'Updated skill'; ok(run(f.root, args));
      assert.match(fs.readFileSync(path.join(f.skills, 'admitted-skill/SKILL.md'), 'utf8'), /Updated skill/);
      assert.match(fs.readFileSync(f.registry, 'utf8'), /^# Keep these notes\n/);
    });
    check('registry growth refuses before skill effects and leaves further valid edits usable', () => {
      const f = setup();
      for (let i = 1; i <= 16; i++) ok(run(f.root, ['skill', 'new', `s-${i}`, `Skill ${i}`, '--description', 'x'.repeat(400)]));
      assert(fs.statSync(f.registry).size <= 8192);
      const before = inventory(f.base);
      for (const args of [
        ['skill', 'new', 's-17', 'Skill 17', '--description', 'x'.repeat(400)],
        ['skill', 'new', 's-16', 'Skill 16', '--description', 'é'.repeat(400), '--force'],
      ]) {
        const result = run(f.root, args); assert.equal(result.error, undefined); assert.notEqual(result.status, 0);
        assert.match(result.stderr, /registry output exceeds byte limit/);
        assert.deepEqual(inventory(f.base), before, 'output-budget refusal caused partial skill or projection effects');
      }
      ok(run(f.root, ['skill', 'new', 's-16', 'Skill 16', '--description', 'short', '--force']));
      ok(run(f.root, ['skill', 'new', 's-17', 'Skill 17', '--description', 'short']));
      assert(fs.statSync(f.registry).size <= 8192);
    });
    check('init shared refresh preserves an admitted customized registry', () => {
      const f = setup(false, 8 * 1024 * 1024); fs.writeFileSync(f.registry, '# Keep these init notes\n'); ok(run(f.root, ['init']));
      assert.match(fs.readFileSync(f.registry, 'utf8'), /^# Keep these init notes\n/);
      assert.match(fs.readFileSync(f.registry, 'utf8'), /select-work-and-ground-context/);
    });
    check('init rejects a linked registry without copying or changing its target', () => {
      const f = setup(false, 8 * 1024 * 1024); fs.symlinkSync(f.sentinel, f.registry); const before = fs.readFileSync(f.sentinel);
      const result = run(f.root, ['init']); assert.equal(result.error, undefined); assert.notEqual(result.status, 0);
      assert.equal(fs.readlinkSync(f.registry), f.sentinel); assert.deepEqual(fs.readFileSync(f.sentinel), before);
      // Init already had leaf admission; its broader scaffold transaction is
      // not changed here, so this case does not assert whole-init rollback.
    });
    return { pass: cases.every(c => c.pass), cases, fixture_cleanup: 'exact owned mkdtemp removed' };
  } finally { fs.rmSync(owned, { recursive: true, force: true }); }
}
module.exports = { qualifySkillRegistryAdmission };
