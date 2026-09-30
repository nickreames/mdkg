import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import vm from 'node:vm';
import { createRequire } from 'node:module';

const root = path.resolve(import.meta.dirname, '..');
for (const name of ['test-built.js', 'coverage-contract.js']) {
  test(`${name} isolates inherited Git authority at its actual worker boundary`, () => {
    const owned = fs.mkdtempSync(path.join(fs.realpathSync(os.tmpdir()), 'mdkg-test-env-'));
    try {
      const input = { ...process.env, MDKG_COVERAGE_DIR: path.join(owned, 'coverage'),
        MDKG_TEST_SENTINEL: 'retained-qualification-input' };
      delete input.NODE_TEST_CONTEXT;
      const keys = ['GIT', 'GIT_DIR', 'GIT_COMMON_DIR', 'GIT_WORK_TREE', 'GIT_INDEX_FILE',
        'GIT_OBJECT_DIRECTORY', 'GIT_ALTERNATE_OBJECT_DIRECTORIES', 'GIT_CONFIG_COUNT',
        'GIT_CONFIG_KEY_0', 'GIT_CONFIG_VALUE_0', 'GIT_CONFIG_PARAMETERS', 'GIT_TEMPLATE_DIR', 'git_dir'];
      for (const key of keys) input[key] = 'synthetic-external-routing';
      const before = { ...input }, launchTrap = new Error('synthetic worker launch trap');
      let captured;
      const filename = path.join(root, 'scripts', name), nativeRequire = createRequire(filename);
      const require = request => request === 'node:child_process'
        ? { ...nativeRequire(request), spawnSync: (_exe, _args, options) => {
          captured = options.env ?? input; throw launchTrap;
        } } : nativeRequire(request);
      const sandboxProcess = Object.create(process);
      Object.defineProperty(sandboxProcess, 'env', { value: input });
      Object.defineProperty(sandboxProcess, 'stderr', { value: { write() {} } });
      const module = { exports: {} };
      vm.runInNewContext(fs.readFileSync(filename, 'utf8'), { require, module,
        __dirname: path.dirname(filename), __filename: filename, process: sandboxProcess,
        console, Buffer }, { filename });
      assert.throws(() => name === 'test-built.js' ? module.exports.execute(root)
        : module.exports.execute('measure', root), error => error === launchTrap);
      assert(captured, 'actual worker spawn was not reached');
      for (const key of keys) assert.equal(captured[key], undefined, `${name}: inherited ${key}`);
      assert.equal(captured.GIT_CONFIG_NOSYSTEM, '1');
      assert.equal(captured.GIT_TERMINAL_PROMPT, '0');
      assert.equal(captured.MDKG_TEST_SENTINEL, input.MDKG_TEST_SENTINEL);
      assert.deepEqual(input, before, 'launcher changed parent environment');
    } finally { fs.rmSync(owned, { recursive: true, force: true }); }
  });
}
