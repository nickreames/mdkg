from pathlib import Path
import os, sys, subprocess, json, hashlib, datetime, time, platform, tarfile, stat, re, gzip

root = Path('/workspace/mdkg-cloud-goal89')
cache = Path('/workspace/mdkg-cloud-review-cache/goal89-review-correction-final')
receipt = root / '.mdkg/artifacts/goal-89/review-correction'
receipt.mkdir(parents=True, exist_ok=True)
fixture = Path('/dev/shm/mdkg-cloud-review-fixtures'); fixture.mkdir(exist_ok=True)
env = {k: v for k, v in os.environ.items() if not k.startswith('GIT_')}
env.update(TMPDIR=str(fixture), MDKG_WORKING_LEGACY_PACKAGE='/workspace/mdkg-cloud-goal88',
           npm_config_cache=str(cache/'npm-cache'), ASTRO_TELEMETRY_DISABLED='1', XDG_CONFIG_HOME=str(cache/'astro-config'))
subreaper = '/workspace/mdkg-cloud-goal88-cache/subreaper.py'
runtimes = [('24.19.0', 'node'), ('24.18.0', '/workspace/mdkg-cloud-goal88-cache/qualification-3/node-v24.18.0-linux-x64/bin/node'),
            ('24.21.0', '/workspace/mdkg-cloud-review-cache/node-24.21.0/node-v24.21.0-linux-x64/bin/node')]
results = []
def utc(): return datetime.datetime.now(datetime.timezone.utc).isoformat()
def sha(p): return hashlib.sha256(p.read_bytes()).hexdigest()
def manifest(directory):
    return {str(p.relative_to(directory)): {'sha256': sha(p), 'mode': stat.S_IMODE(p.stat().st_mode)}
            for p in sorted(directory.rglob('*')) if p.is_file()}
def capture():
    dirs = ['src', 'scripts', 'tests', 'assets', 'release', 'docs/_generated', 'docs/src', 'mdkg-dev/src',
            '.mdkg/templates', '.mdkg/core', '.mdkg/skills', '.agents/skills', '.claude/skills']
    files = ['package.json', 'package-lock.json', 'README.md', 'CHANGELOG.md', 'CLI_COMMAND_MATRIX.md',
             'docs/astro.config.mjs', 'docs/package.json', 'docs/package-lock.json', 'mdkg-dev/package.json',
             'mdkg-dev/package-lock.json', 'docs/cloud-goal89-design.md', 'docs/cloud-goal89-contract-delta.md',
             'docs/cloud-goal89-validation-plan.md']
    paths = set(root/f for f in files); paths.update(root.glob('tsconfig*.json'))
    for d in dirs: paths.update(p for p in (root/d).rglob('*') if p.is_file())
    return {str(p.relative_to(root)): {'sha256': sha(p), 'mode': stat.S_IMODE(p.stat().st_mode)} for p in sorted(paths)}
def save(name, data): (cache/name).write_text(json.dumps(data, indent=2)+'\n')
def run(name, cmd, extra=None, timeout=180):
    e = dict(env); e.update(extra or {}); log = cache/(name+'.log'); begin = utc(); t = time.monotonic()
    if log.exists(): raise RuntimeError('refuse duplicate qualification execution: '+name)
    with log.open('w') as out:
        try: code = subprocess.run(cmd, cwd=root, env=e, stdout=out, stderr=subprocess.STDOUT, timeout=timeout).returncode
        except subprocess.TimeoutExpired: code = 124
    record = {'name': name, 'command': cmd, 'start': begin, 'end': utc(), 'seconds': round(time.monotonic()-t, 3),
              'exit': code, 'result': 'PASSED' if code == 0 else 'FAILED', 'log': log.name, 'log_sha256': sha(log)}
    text = log.read_text(errors='replace')
    for key in ['tests', 'pass', 'fail', 'skipped', 'cancelled']:
        m = re.search(r'(?:ℹ|#) '+key+r' (\d+)', text)
        if m: record[key] = int(m[1])
    results.append(record); save('progress.json', results)
    print(name, code, record.get('pass', ''), record.get('fail', ''), flush=True)
    if code: print(text[-5000:], flush=True)
    return code

before = capture(); save('product-inputs.json', before)
built_before = manifest(root/'dist'); save('built-inputs.json', built_before)
legacy = Path(env['MDKG_WORKING_LEGACY_PACKAGE'])
legacy_before = manifest(legacy/'dist'); save('legacy-built-inputs.json', legacy_before)
legacy_head = subprocess.check_output(['git', '-C', str(legacy), 'rev-parse', 'HEAD'], text=True).strip()
if legacy_head != 'ce53ea56629af23ecd10d6e58a393db1235fda79': raise RuntimeError('legacy initializer head changed')
for version, node in runtimes:
    if subprocess.check_output([node, '--version'], text=True).strip() != 'v'+version: raise RuntimeError('runtime changed')
    run('source-'+version, ['python3', subreaper, node, '--test', 'tests/working-storage.test.mjs', 'tests/cloud-working-host-contract.test.mjs'])
selected = ['commands/init', 'commands/init_identity', 'commands/init_manifest_ownership', 'commands/goal88_init', 'commands/cli_option_admission',
            'commands/archive_work', 'commands/archive_payload_ownership', 'commands/archive_compress_ownership', 'commands/bundle',
            'commands/bundle_ownership', 'commands/bundle_state', 'commands/bundle_admission', 'commands/bundle_archive_visibility',
            'core/config', 'core/config_read_admission', 'core/filesystem_authority', 'core/filesystem_nullable_read', 'util/argparse', 'util/mutation_lock',
            'graph/cache_containment', 'graph/cache_freshness', 'graph/cache_git_metadata', 'graph/archive_containment', 'graph/identity',
            'graph/identity_portable_recovery', 'graph/workspace_containment', 'commands/workspace_indexing', 'commands/workspace_errors']
compiled = ['dist/tests/'+p+'.test.js' for p in selected]
for file in compiled:
    if not (root/file).is_file(): raise RuntimeError('missing selected test: '+file)
run('shared-regressions', ['python3', subreaper, 'node', '--test', *compiled], timeout=240)
for name, cmd in [
    ('cli-matrix', ['node', 'scripts/cli_help_snapshot.js', '--check']),
    ('cli-contract', ['node', 'scripts/generate-command-contract.js', '--check']),
    ('docs', ['npm', 'run', 'docs:check:built']),
    ('graph', ['node', 'dist/cli.js', 'validate', '--json']),
    ('skills', ['node', 'dist/cli.js', 'skill', 'validate', '--json']),
    ('security', ['npm', 'run', 'security:verify']),
    ('workflow', ['node', 'scripts/generate-ci-workflow.js', '--check']),
    ('publish-static', ['node', 'scripts/assert-publish-ready.js']),
    ('release-contracts', ['python3', subreaper, 'node', '--test', 'tests/public-release.test.mjs', 'tests/publish-readiness-goal-contract.test.mjs', 'tests/security-remediation.test.mjs']),
    ('docs-site', ['npm', 'run', 'build', '--prefix', 'docs']),
    ('diff', ['git', 'diff', '--check'])]: run(name, cmd)

artifact = None; installed_before = None; target = None
# A local draft artifact, with no prepack/prepublication assertion or publication action.
if run('pack', ['npm', 'pack', '--ignore-scripts', '--json', '--pack-destination', str(cache)]) == 0:
    raw = (cache/'pack.log').read_text(); info = json.JSONDecoder().raw_decode(raw[raw.index('['):])[0]
    artifact = cache/info[0]['filename']; extraction = cache/'sealed-extraction'
    with tarfile.open(artifact) as tar:
        for member in tar.getmembers():
            if not member.name.startswith('package/') or '..' in member.name.split('/') or member.issym() or member.islnk():
                raise RuntimeError('unsafe package path')
            if '.mdkg/working' in member.name: raise RuntimeError('working artifact in package')
            if member.isfile():
                data = tar.extractfile(member).read()
                if any(canary in data for canary in [b'PRIVATE_CHILD_CANARY', b'PRIVATE_CACHE_CANARY', b'PRIVATE RAW CANARY', b'PRIVATE UNEXPORTED BODY', b'synthetic private draft canary']):
                    raise RuntimeError('private fixture canary in package')
        tar.extractall(extraction, filter='data')
    tar_files = manifest(extraction/'package')
    save('package-inventory.json', {'filename': artifact.name, 'sha256': sha(artifact), 'files': info[0]['files'],
                                  'tar_files': tar_files, 'private_working_canaries_absent': True})
    consumer = cache/'npm-consumer'; target = consumer/'node_modules/mdkg'
    if run('npm-install-exact', ['npm', 'install', '--prefix', str(consumer), '--no-audit', '--no-fund', '--offline', str(artifact)]) == 0:
        installed_before = manifest(target); save('npm-installed-inputs.json', installed_before)
        if set(installed_before) != set(tar_files) or any(installed_before[k]['sha256'] != tar_files[k]['sha256'] for k in tar_files):
            raise RuntimeError('installed file bytes differ from exact tar')
        mode_diffs = {k: {'tar': tar_files[k]['mode'], 'npm': installed_before[k]['mode']} for k in tar_files if tar_files[k]['mode'] != installed_before[k]['mode']}
        if mode_diffs != {'dist/cli.js': {'tar': 0o600, 'npm': 0o700}}: raise RuntimeError('unexpected npm mode changes')
        save('npm-bin-mode.json', {'byte_inventories_equal': True, 'mode_differences': mode_diffs})
        for version, node in runtimes:
            run('installed-'+version, ['python3', subreaper, node, '--test', 'tests/working-storage.test.mjs', 'tests/cloud-working-host-contract.test.mjs'], {'MDKG_WORKING_PACKAGE': str(target)})
        run('installed-bin-version', [str(consumer/'node_modules/.bin/mdkg'), '--version'])

drift = {'product': before != capture(), 'built': built_before != manifest(root/'dist'), 'legacy': legacy_before != manifest(legacy/'dist'),
         'installed': installed_before != manifest(target) if installed_before is not None else None}
save('input-drift.json', drift)
metadata = {'created': utc(), 'parent_head': subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=root, text=True).strip(),
            'base_head': legacy_head, 'cwd': str(root), 'platform': platform.platform(), 'machine': platform.machine(), 'native': True,
            'node': subprocess.check_output(['node', '--version'], text=True).strip(), 'npm': subprocess.check_output(['npm', '--version'], text=True).strip(),
            'git': subprocess.check_output(['git', '--version'], text=True).strip(), 'checks': results, 'input_drift': drift,
            'harness_sha256': sha(Path(__file__)), 'product_inputs_sha256': sha(cache/'product-inputs.json'), 'built_inputs_sha256': sha(cache/'built-inputs.json'),
            'subreaper_sha256': sha(Path(subreaper)), 'artifact': {'sha256': sha(artifact), 'filename': artifact.name} if artifact else None,
            'readiness': 'NOT_READY', 'transient_executor_failures_since_instruction': 1,
            'scope': 'Bounded correction of three reviewed regressions; source/installed 30 runtime controls plus one repository-doc assertion per runtime. Existing 25 shared families retained, three workspace families added. Actual legacy initializer, nested/exact decomposed Unicode child spelling, full pack and cache-owner forgery controls included. No full coverage/CI remediation.',
            'pending': ['independent exact corrected-patch review Chk675; Goal90 held', 'owner/local acceptance Chk676',
                        'full premerge/thresholded coverage and complete package prepublication ladder Chk677', 'native macOS/remaining platform acceptance',
                        'exact corrected-head hosted qualification', 'publication/professional-adoption approval'],
            'preparation': {'commands': ['npm run build', 'npm run build:test', 'npm run docs:release-notes'], 'result': 'PASSED before freeze; build logs retained; preparation elapsed times not measured'},
            'baseline_controls': {'source_head': '4c55758d6dbd1d16f77bcd406f3c995cba76b4d9', 'legacy_initializer_head': legacy_head, 'reported_regressions': 'all three fail for reported reasons on source24.19 and exact installed24.18/24.21; nine expected failure executions', 'receipt': 'iterations/candidate-1/baseline-portable.json', 'setup_errors': 'initial missing fixture namespace and CLI assumptions retained separately'},
            'previous_head_hosted': {'run': 37105547354, 'head': '4c55758d6dbd1d16f77bcd406f3c995cba76b4d9', 'result': 'cancelled',
                                     'test_outcome': 'UNRESOLVED', 'collector_results': 'both failed; minimum tree-change refusal, floating disappearing coverage-file tar errors'}}
save('checks.json', metadata)
(root/'.mdkg/index/mdkg.sqlite').write_bytes(subprocess.check_output(['git', 'show', 'HEAD:.mdkg/index/mdkg.sqlite'], cwd=root))
for p in cache.iterdir():
    if p.is_file() and p.suffix in ['.json', '.py']: (receipt/p.name).write_bytes(p.read_bytes())
    elif p.is_file() and p.suffix == '.log': (receipt/(p.name+'.gz')).write_bytes(gzip.compress(p.read_bytes(), mtime=0))
save('evidence-manifest.json', manifest(receipt)); (receipt/'evidence-manifest.json').write_bytes((cache/'evidence-manifest.json').read_bytes())
failed = [x['name'] for x in results if x['exit']]
print('FINAL', json.dumps({'failed': failed, 'drift': drift, 'artifact': metadata['artifact']}), flush=True)
sys.exit(1 if failed or any(drift.values()) or target is None else 0)
