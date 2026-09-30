// Execute unchanged installed-candidate Test479 drivers inside an isolated VM.
const assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path'), os = require('node:os'), crypto = require('node:crypto');
const { spawn, execFileSync } = require('node:child_process');
const root = path.resolve(__dirname, '../../..');
const digest = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const manifestFile = path.join(root, 'capsule-manifest.json');
const manifestHash = digest(manifestFile), manifest = JSON.parse(fs.readFileSync(manifestFile));
assert.equal(manifestHash, process.env.MDKG_CAPSULE_MANIFEST_SHA256);
assert.equal(process.platform, 'linux'); assert.equal(process.arch, 'arm64');
assert.equal(process.version, 'v24.18.0');
const output = '/private/tmp/mdkg-linux-results';
assert(!fs.existsSync(output)); fs.mkdirSync(output, { mode: 0o700 });
const identity = fs.lstatSync(output);
function verify() {
  assert.equal(digest(manifestFile), manifestHash);
  for (const row of manifest.files) {
    const file = path.join(root, row.path), stat = fs.lstatSync(file);
    assert(stat.isFile() && !stat.isSymbolicLink(), row.path);
    assert.equal(fs.realpathSync(file), file);
    assert.equal(digest(file), row.sha256, row.path);
    assert.equal(stat.mode & 0o777, row.mode, row.path);
  }
}
function command(file, args) { return execFileSync(file, args, { encoding: 'utf8', timeout: 10000 }).trim(); }
verify();
const mounts = JSON.parse(command('findmnt', ['--json', '--output', 'TARGET,SOURCE,FSTYPE,OPTIONS']));
const flatten = list => list.flatMap(row => [row, ...flatten(row.children || [])]);
assert(!flatten(mounts.filesystems).some(row => ['virtiofs','9p','fuse.sshfs'].includes(row.fstype)), 'host/shared mount present');
const environment = { platform: process.platform, arch: process.arch, node: process.version,
  kernel: os.release(), os_release: fs.readFileSync('/etc/os-release','utf8'),
  git: command('git', ['--version']), npm: command(process.execPath, [process.env.MDKG_REAL_NPM, '--version']),
  uid: process.getuid(), filesystem: command('findmnt', ['--noheadings', '--output', 'SOURCE,FSTYPE,OPTIONS', '--target', root]),
  host_directory_mounts: false, execution: 'native ARM64 Apple Virtualization guest' };
const families = [], started = new Date().toISOString();
function run(name, driver) {
  return new Promise((resolve,reject) => {
    verify(); const began = performance.now();
    const child = spawn(process.execPath, [path.join(__dirname, driver)], { cwd: root, env: process.env,
      stdio: ['ignore','pipe','pipe'] });
    let stdout = '', stderr = '';
    const timer = setTimeout(() => { child.kill('SIGKILL'); }, 600000);
    child.stdout.on('data', bytes => { stdout += bytes; process.stdout.write(bytes); });
    child.stderr.on('data', bytes => { stderr += bytes; process.stderr.write(bytes); });
    child.once('error', error => { clearTimeout(timer); reject(error); });
    child.once('close', (status,signal) => {
      clearTimeout(timer);
      for (const [stream, data] of [['stdout',stdout],['stderr',stderr]])
        fs.writeFileSync(path.join(output, name + '.' + stream + '.txt'), data, { flag: 'wx', mode: 0o600 });
      const row = { name, driver, status, signal, duration_ms: performance.now() - began,
        stdout_sha256: digest(path.join(output,name + '.stdout.txt')),
        stderr_sha256: digest(path.join(output,name + '.stderr.txt')) };
      families.push(row);
      try { verify(); assert.equal(status,0, name + ' failed'); assert.equal(signal,null);
        const receipts = stdout.split('\n').filter(Boolean).map(line => JSON.parse(line));
        row.receipt = receipts.at(-1); assert.equal(row.receipt.candidate_sha256, manifest.candidate_sha256);
        assert.equal(row.receipt.platform,'linux'); assert.equal(row.receipt.arch,'arm64'); resolve();
      } catch(error) { reject(error); }
    });
  });
}
async function main() {
  let error;
  try {
    await run('transport-recovery', 'test-479-installed-ownership.cjs');
    await run('state-admission', 'test-479-state-admission.cjs');
  } catch(failure) { error = failure.stack || String(failure); }
  verify(); const current = fs.lstatSync(output);
  assert.equal(current.dev,identity.dev); assert.equal(current.ino,identity.ino);
  const receipt = { kind: 'test487-local-linux-arm64-subset', started_at: started,
    completed_at: new Date().toISOString(), candidate_sha256: manifest.candidate_sha256,
    capsule_manifest_sha256: manifestHash, source_inputs_sha256: manifest.source_inputs_sha256,
    environment, families, ...(error ? { error } : {}), pass: !error,
    final_platform_qualification: false, final_artifact_seal: false,
    limitations: ['Selected Test479 families only; other platform families remain incomplete.',
      'Linux x86_64 and Windows not exercised.', 'Bugs46/47 remain deferred and unresolved.',
      'No hosted CI, source build/full ladder or independent security clearance.'] };
  fs.writeFileSync(path.join(output,'receipt.json'), JSON.stringify(receipt,null,2)+'\n', {flag:'wx',mode:0o600});
  console.log(JSON.stringify({event:'linux-subset-finished',pass:!error,output}));
  if(error) process.exitCode=1;
}
main().catch(error=>{console.error(error);process.exitCode=1;});
