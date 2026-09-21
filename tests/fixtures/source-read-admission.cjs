// Public CLI/MCP consumers; reusable against an installed package. Synthetic
// files only. Timeouts kill only children created here; cleanup owns one mkdtemp.
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { spawn, spawnSync } = require("node:child_process");

async function qualifySourceReadAdmission({ cli, tempRoot, node = process.execPath }) {
  const owned = fs.mkdtempSync(path.join(tempRoot, "source-read-admission-"));
  const root = path.join(owned, "project"), outside = path.join(owned, "outside");
  fs.mkdirSync(root); fs.mkdirSync(outside);
  const env = { PATH: process.env.PATH, SystemRoot: process.env.SystemRoot, LC_ALL: "C",
    GIT_CONFIG_NOSYSTEM: "1", GIT_CONFIG_GLOBAL: process.platform === "win32" ? "NUL" : "/dev/null",
    GIT_TERMINAL_PROMPT: "0", TMPDIR: owned, TMP: owned, TEMP: owned };
  const hash = data => crypto.createHash("sha256").update(data).digest("hex");
  const run = (args, options = {}) => spawnSync(node, [cli, ...args], {
    cwd: root, env, encoding: "utf8", timeout: 3000, killSignal: "SIGKILL", maxBuffer: 4 * 1024 * 1024, ...options,
  });
  const terminated = r => { assert.equal(r.error, undefined, String(r.error)); assert.equal(r.signal, null); };
  const ok = r => { terminated(r); assert.equal(r.status, 0, r.stdout + r.stderr); return r; };
  const inventory = base => {
    const rows = [];
    const walk = dir => {
      for (const name of fs.readdirSync(dir).sort()) {
        const file = path.join(dir, name), stat = fs.lstatSync(file), rel = path.relative(base, file);
        if (stat.isDirectory()) { rows.push([rel, "directory", stat.mode]); walk(file); }
        else if (stat.isSymbolicLink()) rows.push([rel, "link", fs.readlinkSync(file)]);
        else if (stat.isFile()) rows.push([rel, "file", stat.mode, hash(fs.readFileSync(file))]);
        else rows.push([rel, "special", stat.mode]);
      }
    };
    walk(base); return rows;
  };
  const cases = [], check = async (name, fn) => {
    try { await fn(); cases.push({ name, pass: true }); }
    catch (error) { cases.push({ name, pass: false, error: error.message }); }
  };
  const fifo = file => {
    const r = spawnSync("mkfifo", [file], { cwd: owned, env, encoding: "utf8", timeout: 3000 });
    assert.equal(r.error, undefined); assert.equal(r.status, 0, r.stderr);
  };
  const removeFixturePath = file => {
    assert(path.resolve(file).startsWith(owned + path.sep));
    if (fs.lstatSync(file).isDirectory()) fs.rmdirSync(file); else fs.unlinkSync(file);
  };
  const unchanged = (args, pattern) => {
    const before = inventory(owned), result = run(args);
    terminated(result); assert.notEqual(result.status, 0, "unsafe input was admitted");
    assert.match(result.stdout + result.stderr, pattern);
    assert.deepEqual(inventory(owned), before, "observation modified fixture state");
    return result;
  };
  try {
    ok(run(["init", "--graph-only"]));
    const created = JSON.parse(ok(run(["new", "task", "Bounded source", "--json"])).stdout);
    const config = path.join(root, ".mdkg/config.json"), configBytes = fs.readFileSync(config);
    const taskRelative = created.node.path, source = path.join(root, taskRelative), sourceBytes = fs.readFileSync(source);
    const limit = 8 * 1024 * 1024;
    const externalConfig = path.join(outside, "config.json"), externalSource = path.join(outside, "source.md");
    fs.writeFileSync(externalConfig, configBytes); fs.writeFileSync(externalSource, sourceBytes);
    const externalFifo = path.join(outside, "pipe"); fifo(externalFifo);
    // Local Git only, with global/system config disabled. Preserve its full
    // inventory across each observation, including deliberately staged content.
    const git = args => {
      const r = spawnSync("git", args, { cwd: root, env, encoding: "utf8", timeout: 5000 });
      assert.equal(r.error, undefined); assert.equal(r.status, 0, r.stderr);
    };
    git(["init", "-q"]); git(["add", "--", ".mdkg/config.json", taskRelative]);
    ok(run(["bundle", "create", "--output", "fixture.mdkg.zip", "--json"]));
    const bundle = path.join(root, "fixture.mdkg.zip"), bundleBytes = fs.readFileSync(bundle);
    const { readZipEntries, createDeterministicZipFromEntries } = require(path.join(path.dirname(cli), "util/zip.js"));
    const entries = readZipEntries(bundleBytes);
    const replace = async (file, bytes, setup, fn) => {
      removeFixturePath(file);
      try { setup(file); await fn(); }
      finally { try { removeFixturePath(file); } catch (e) { if (e.code !== "ENOENT") throw e; } fs.writeFileSync(file, bytes); }
    };
    const configCases = [
      ["external symlink", file => fs.symlinkSync(externalConfig, file), /symbolic|linked|contained/i],
      ["dangling symlink", file => fs.symlinkSync(path.join(outside, "absent"), file), /symbolic|linked|contained|repo root with \.mdkg\/config\.json/i],
      ["device symlink", file => fs.symlinkSync("/dev/null", file), /symbolic|linked|contained/i],
      ["FIFO symlink", file => fs.symlinkSync(externalFifo, file), /symbolic|linked|contained/i],
      ["FIFO", fifo, /must be a file|regular file/i],
      ["directory", file => fs.mkdirSync(file), /must be a file|regular file/i],
      ["oversized valid JSON", file => fs.writeFileSync(file, Buffer.concat([configBytes, Buffer.alloc(limit + 1 - configBytes.length, 32)])), /byte limit/i],
    ];
    for (const [name, setup, pattern] of configCases) await check(`CLI config refuses ${name} unchanged`, () =>
      replace(config, configBytes, setup, () => unchanged(["status", "--json"], pattern)));
    await check("CLI config exact byte ceiling remains valid", () => replace(config, configBytes,
      file => fs.writeFileSync(file, Buffer.concat([configBytes, Buffer.alloc(limit - configBytes.length, 32)])), () => {
        const before = inventory(owned); ok(run(["status", "--json"])); assert.deepEqual(inventory(owned), before);
      }));
    await check("CLI missing config retains explicit missing diagnostic", () => replace(config, configBytes,
      () => {}, () => unchanged(["status", "--json"], /config not found|repo root with \.mdkg\/config\.json/)));
    await check("CLI malformed JSON retains read/parse diagnostic", () => replace(config, configBytes,
      file => fs.writeFileSync(file, "{"), () => unchanged(["status", "--json"], /failed to read config/)));
    const verify = ["bundle", "verify", "fixture.mdkg.zip", "--json"];
    await check("bundle exact source bytes verify without writes", () => {
      const before = inventory(owned); assert.equal(JSON.parse(ok(run(verify)).stdout).ok, true);
      assert.deepEqual(inventory(owned), before);
    });
    const externalBundle = path.join(outside, "selected.zip"), linkedBundle = path.join(root, "selected-link.zip");
    fs.writeFileSync(externalBundle, bundleBytes); fs.symlinkSync(externalBundle, linkedBundle);
    for (const [name, selected] of [["external", externalBundle], ["linked regular", linkedBundle]])
      await check(`explicit ${name} ZIP remains supported`, () => {
        const before = inventory(owned);
        assert.equal(JSON.parse(ok(run(["bundle", "verify", selected, "--json"])).stdout).ok, true);
        assert.deepEqual(inventory(owned), before);
      });
    for (const [name, setup] of [["FIFO", fifo], ["linked FIFO", file => fs.symlinkSync(externalFifo, file)],
      ["device link", file => fs.symlinkSync("/dev/null", file)], ["directory", file => fs.mkdirSync(file)]])
      await check(`selected ZIP refuses ${name} unchanged`, () => replace(bundle, bundleBytes, setup, () => {
        const r = JSON.parse(unchanged(verify, /not a regular file/).stdout);
        assert.equal(r.ok, false); assert.equal(r.stale, false);
      }));
    await check("selected ZIP leaf replacement cannot block before descriptor admission", () => {
      const hook = path.join(owned, "zip-open-hook.cjs"), marker = path.join(owned, "zip-open-marker");
      fs.writeFileSync(hook, `const fs=require('node:fs'),cp=require('node:child_process');
        const target=${JSON.stringify(bundle)},open=fs.openSync;let swapped=false;
        fs.openSync=function(...args){if(String(args[0])===target&&!swapped){
          swapped=true;fs.unlinkSync(target);cp.execFileSync('mkfifo',[target]);
          fs.writeFileSync(${JSON.stringify(marker)},'swapped');
        }return open.apply(this,args)};`);
      const before = inventory(owned);
      try {
        const result = spawnSync(node, ["--require", hook, cli, ...verify], {
          cwd: root, env, encoding: "utf8", timeout: 3000, killSignal: "SIGKILL", maxBuffer: 4 * 1024 * 1024,
        });
        terminated(result); assert.notEqual(result.status, 0);
        assert.equal(fs.readFileSync(marker, "utf8"), "swapped");
        const receipt = JSON.parse(result.stdout); assert.equal(receipt.ok, false);
        assert.match(receipt.errors.join("\n"), /not a regular file/);
        const changed = new Set([path.relative(owned, bundle), path.relative(owned, marker)]);
        assert.deepEqual(inventory(owned).filter(row => !changed.has(row[0])), before.filter(row => !changed.has(row[0])));
      } finally {
        removeFixturePath(bundle); fs.writeFileSync(bundle, bundleBytes);
        fs.unlinkSync(hook); if (fs.existsSync(marker)) fs.unlinkSync(marker);
      }
    });
    const sourceCases = [
      ["external symlink", file => fs.symlinkSync(externalSource, file), /symbolic|linked|contained/i],
      ["dangling symlink", file => fs.symlinkSync(path.join(outside, "absent"), file), /symbolic|linked|contained/i],
      ["device symlink", file => fs.symlinkSync("/dev/null", file), /symbolic|linked|contained/i],
      ["FIFO symlink", file => fs.symlinkSync(externalFifo, file), /symbolic|linked|contained/i],
      ["FIFO", fifo, /must be a file|regular file/i],
      ["directory", file => fs.mkdirSync(file), /must be a file|regular file/i],
      ["larger than admitted payload", file => fs.writeFileSync(file, Buffer.concat([sourceBytes, Buffer.from("x")])), /byte limit/i],
    ];
    for (const [name, setup, pattern] of sourceCases) await check(`bundle source refuses ${name} unchanged`, () =>
      replace(source, sourceBytes, setup, () => {
        const r = JSON.parse(unchanged(verify, pattern).stdout);
        assert.equal(r.ok, false); assert(r.stale_paths.includes(taskRelative)); assert(r.errors.length > 0);
      }));
    for (const [name, setup] of [["missing", () => {}], ["shorter", file => fs.writeFileSync(file, "short")]])
      await check(`bundle ${name} source is ordinary staleness`, () => replace(source, sourceBytes, setup, () => {
        const r = JSON.parse(unchanged(verify, /stale/).stdout);
        assert.equal(r.ok, false); assert.equal(r.stale, true); assert.deepEqual(r.errors, []);
        assert(r.stale_paths.includes(taskRelative));
      }));
    await check("invalid payload stops before FIFO source access", () => replace(source, sourceBytes, fifo, () => {
      const corrupt = entries.map(e => ({ ...e, data: e.name === taskRelative ? Buffer.from("synthetic mismatch") : e.data }));
      fs.writeFileSync(bundle, createDeterministicZipFromEntries(corrupt));
      try {
        const r = JSON.parse(unchanged(verify, /hash mismatch|size mismatch/).stdout);
        assert.equal(r.stale, false); assert.deepEqual(r.stale_paths, []);
      } finally { fs.writeFileSync(bundle, bundleBytes); }
    }));
    // A fixed-root serving process must answer a rejected tool call, then
    // successfully inspect the same graph after the operator restores config.
    for (const [name, setup] of [["FIFO", fifo], ["external symlink", file => fs.symlinkSync(externalConfig, file)]])
      await check(`MCP survives ${name} config and subsequent valid request`, () => replace(config, configBytes, setup, async () => {
        const before = inventory(owned);
        const child = spawn(node, [cli, "mcp", "serve", "--stdio"], { cwd: root, env, stdio: ["pipe", "pipe", "pipe"] });
        const closed = new Promise(resolve => child.once("close", (code, signal) => resolve({ code, signal })));
        let pending = "", next, childError, stderr = "";
        child.on("error", e => { childError = e; next?.reject(e); });
        child.stderr.on("data", d => { stderr += d.toString(); });
        child.stdout.on("data", d => {
          pending += d.toString();
          while (pending.includes("\n")) {
            const end = pending.indexOf("\n"), line = pending.slice(0, end); pending = pending.slice(end + 1);
            if (line) { try { next?.resolve(JSON.parse(line)); } catch (e) { next?.reject(e); } }
          }
        });
        const request = id => new Promise((resolve, reject) => {
          const timer = setTimeout(() => reject(new Error("MCP request timed out")), 3000);
          next = { resolve: v => { clearTimeout(timer); resolve(v); }, reject: e => { clearTimeout(timer); reject(e); } };
          if (childError) next.reject(childError);
          else child.stdin.write(JSON.stringify({ jsonrpc: "2.0", id, method: "tools/call", params: { name: "mdkg_status", arguments: {} } }) + "\n");
        });
        try {
          const bad = await request(1); assert(bad.error, "unsafe configuration reached an MCP result");
          assert.match(bad.error.message, /contained|symbolic|linked|must be a file/);
          assert.deepEqual(inventory(owned), before);
          removeFixturePath(config); fs.writeFileSync(config, configBytes);
          const restored = inventory(owned), good = await request(2);
          assert(good.result && !good.error, JSON.stringify(good)); assert.deepEqual(inventory(owned), restored);
        } finally {
          next = undefined; child.stdin.end(); child.kill("SIGKILL"); await closed;
          assert.equal(childError, undefined, stderr);
        }
      }));
    return { pass: cases.every(c => c.pass), cases, fixture_cleanup: "exact owned mkdtemp removed", native_platform: process.platform };
  } finally { fs.rmSync(owned, { recursive: true, force: true }); }
}
module.exports = { qualifySourceReadAdmission };
