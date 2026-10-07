// Trusted synthetic installed CLI control; no real graph IDs or approvals.
const fs = require('node:fs'), path = require('node:path'), crypto = require('node:crypto'), assert = require('node:assert/strict');
const repo = '/workspace/mdkg-cloud-goal88';
const { runInstalledSmoke } = require(path.join(repo, 'scripts/qualification-smoke'));
const { copyVerifiedArtifact } = require(path.join(repo, 'scripts/qualification-artifact'));
const [tarball, expected, output] = process.argv.slice(2);
const calls = []; const started = Date.now();
const receipt = runInstalledSmoke({ prefix: 'mdkg-readiness-installed-',
  prepare(root, commands) { const local = path.join(root, 'candidate.tgz'); copyVerifiedArtifact(tarball, local, expected);
    return { tarballPath: local, install() { const prefix = path.join(root, 'install');
      commands.npm(['install', '--offline', '--prefix', prefix, local, '--no-audit', '--no-fund']);
      return { bin: path.join(prefix, 'node_modules/mdkg/dist/cli.js'), commands }; } }; },
  exercise(base, { bin, commands }) { const root = path.join(base, 'graph'); fs.mkdirSync(root); commands.git(['init','-q'], root);
    commands.node(bin, ['init'], root); const node = path.join(root, '.mdkg/work/chk-1-synthetic-readiness.md');
    const body = (status, tag) => `---\nid: chk-1\ntype: checkpoint\ntitle: Synthetic readiness control\nstatus: ${status}\npriority: 1\ntags: [${tag}]\nowners: []\nlinks: []\nartifacts: []\nrelates: []\nrefs: []\nscope: []\ncheckpoint_kind: review\ncreated: 2026-10-03\nupdated: 2026-10-03\n---\n\n# Summary\n\nSynthetic fixture only; no real approval.\n`;
    for (const [status, tag, ok, error] of [
      ['blocked','readiness:not-ready',true], ['done','readiness:not-ready',false,'NOT_READY checkpoint must stay blocked or review'],
      ['done','readiness:not-run',false,'only READY_PENDING_APPROVAL'], ['done','readiness:ready-pending-approval',true],
    ]) { fs.writeFileSync(node, body(status, tag)); const before = fs.readFileSync(node);
      const result = commands.node(bin, ['validate','--json'], root, { allowFailure: true });
      assert.equal(result.status === 0, ok, result.stdout + result.stderr);
      if (error) assert.ok((result.stdout+result.stderr).includes(error), result.stdout+result.stderr);
      assert.deepEqual(fs.readFileSync(node), before);
      calls.push({ status, tag, expected_ok: ok, exit: result.status, stdout_sha256: crypto.createHash('sha256').update(result.stdout).digest('hex') });
    }
    return { ok:true, kind:'installed-readiness-cli-controls', node:process.version, platform:process.platform, arch:process.arch, calls }; }
});
fs.writeFileSync(output, JSON.stringify({ ...receipt, duration_ms:Date.now()-started }, null, 2)+'\n');
console.log(JSON.stringify({ ok:true, cases:calls.length, tarball_sha256:expected, output }));
