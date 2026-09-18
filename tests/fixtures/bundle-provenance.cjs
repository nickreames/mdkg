// CLI-only regression reusable against an independently installed package.
// Every remote is synthetic; helpers/SSH are traps, never network clients.
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

function inventory(root) {
  const result = {};
  const walk = dir => {
    for (const name of fs.readdirSync(dir).sort()) {
      const file = path.join(dir, name), stat = fs.lstatSync(file);
      const relative = path.relative(root, file);
      if (stat.isSymbolicLink()) result[relative] = ["link", fs.readlinkSync(file)];
      else if (stat.isDirectory()) { result[relative] = ["directory", stat.mode]; walk(file); }
      else if (stat.isFile()) result[relative] = ["file", stat.mode,
        crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex")];
      else throw new Error(`Unexpected fixture type: ${relative}`);
    }
  };
  walk(root);
  return result;
}

function qualifyBundleProvenance({ cli, tempRoot, node = process.execPath }) {
  assert(path.isAbsolute(cli) && fs.statSync(cli).isFile());
  assert(path.isAbsolute(tempRoot) && fs.statSync(tempRoot).isDirectory());
  const owned = fs.mkdtempSync(path.join(tempRoot, "bundle-provenance-"));
  const env = { PATH: process.env.PATH, SystemRoot: process.env.SystemRoot, LC_ALL: "C",
    GIT_CONFIG_NOSYSTEM: "1", GIT_CONFIG_GLOBAL: process.platform === "win32" ? "NUL" : "/dev/null",
    GIT_TERMINAL_PROMPT: "0", TMPDIR: owned, TMP: owned, TEMP: owned };
  const run = (exe, args, cwd, input) => {
    const r = spawnSync(exe, args, { cwd, env, input, encoding: "utf8", timeout: 30000,
      maxBuffer: 32 * 1024 * 1024 });
    assert.equal(r.error, undefined, String(r.error));
    return r;
  };
  const ok = r => { assert.equal(r.status, 0, `${r.stdout}\n${r.stderr}`); return r; };
  const git = (cwd, args) => ok(run("git", ["-c", "core.fsmonitor=false", "-c", "core.hooksPath=/dev/null",
    "-c", "user.name=mdkg fixture", "-c", "user.email=fixture@example.invalid", ...args], cwd)).stdout.trim();
  const mdkg = (cwd, args) => run(node, [cli, ...args], cwd);
  const cases = [];
  const check = (name, fn) => {
    try { fn(); cases.push({ name, pass: true }); }
    catch (error) { cases.push({ name, pass: false, error: error.message }); }
  };
  // Read ZIPs using this candidate's implementation, never a canonical source import.
  const zipPath = path.join(path.dirname(cli), "util/zip.js");
  assert(fs.realpathSync(zipPath).startsWith(fs.realpathSync(path.dirname(cli)) + path.sep));
  const { readZipEntries, createDeterministicZipFromEntries } = require(zipPath);
  const entries = file => readZipEntries(fs.readFileSync(file));
  const manifest = file => JSON.parse(entries(file).find(entry => entry.name === "manifest.json").data);
  const markers = /g86secret[A-Za-z0-9]*|%67%38%36secret[A-Za-z0-9]*/;
  const noSecrets = value => assert.doesNotMatch(value, markers);
  try {
    const parent = path.join(owned, "parent"), root = path.join(parent, "projects/child");
    fs.mkdirSync(root, { recursive: true });
    git(root, ["init", "-q", "-b", "main"]);
    assert.equal(fs.realpathSync(git(root, ["rev-parse", "--show-toplevel"])), fs.realpathSync(root));
    ok(mdkg(root, ["init", "--graph-only"]));
    ok(mdkg(root, ["new", "task", "Provenance fixture", "--json"]));
    const configPath = path.join(root, ".mdkg/config.json");
    const config = JSON.parse(fs.readFileSync(configPath));
    config.workspaces.root.visibility = "public";
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2) + "\n");
    fs.writeFileSync(path.join(root, ".gitignore"), ".mdkg/index/\n.mdkg/pack/\n.mdkg/state/\n.mdkg/work/events/\n.mdkg/bundles/\n");
    git(root, ["add", "."]); git(root, ["commit", "-q", "-m", "synthetic graph"]);
    const bin = path.join(owned, "bin"), trap = path.join(owned, "helper-called");
    fs.mkdirSync(bin);
    const helper = `#!${node}\nrequire('node:fs').writeFileSync(${JSON.stringify(trap)}, 'called');process.exit(99);\n`;
    for (const name of ["git-remote-g86fixture", "ssh", "askpass"]) {
      fs.writeFileSync(path.join(bin, name), helper, { mode: 0o755 });
    }
    env.PATH = bin + path.delimiter + env.PATH;
    env.GIT_SSH = path.join(bin, "ssh"); env.GIT_ASKPASS = path.join(bin, "askpass");
    const exportBundle = profile => {
      const result = ok(mdkg(root, ["bundle", "create", "--profile", profile, "--json"]));
      const receipt = JSON.parse(result.stdout), file = path.join(root, receipt.path);
      return { result, receipt, file, data: manifest(file) };
    };
    const attacks = [
      ["userinfo-query-fragment", "https://g86secretUser:g86secretPass@example.invalid/repo?MiXeD=g86secretQuery# g86secretFragment"],
      ["encoded-userinfo", "https://%67%38%36secretEncoded@example.invalid/repo?%74oken=g86secretEncodedQuery"],
      ["extra-authority-slashes", "https:///user:g86secretSlashes@example.invalid/repo"],
      ["four-authority-slashes", "https:////user:g86secretSlashes@example.invalid/repo"],
      ["explicit-helper", "g86fixture::g86secretOpaque"],
      ["implicit-helper", "g86fixture://example.invalid/g86secretOpaque"],
      ["malformed-url", "https://g86secretMalformed@[bad/repo"],
      ["control-bearing", "https://example.invalid/repo\ng86secretControl"],
      ["configured-helper", "g86secretOpaqueConfigured", "g86fixture"],
    ];
    for (const [name, remote, vcs] of attacks) {
      git(root, ["config", "remote.origin.url", remote]);
      if (vcs) git(root, ["config", "remote.origin.vcs", vcs]);
      const before = inventory(path.join(root, ".git"));
      for (const profile of ["public", "private"]) check(`${name}:${profile}`, () => {
        const exported = exportBundle(profile);
        for (const entry of entries(exported.file)) noSecrets(entry.data.toString("utf8"));
        noSecrets(exported.result.stdout + exported.result.stderr);
        assert.notEqual(exported.data.source.repo, remote);
        for (const json of [[], ["--json"]]) {
          const shown = ok(mdkg(root, ["bundle", "show", exported.receipt.path, ...json]));
          noSecrets(shown.stdout + shown.stderr);
          const inspected = ok(mdkg(root, ["git", "inspect", ...json]));
          noSecrets(inspected.stdout + inspected.stderr);
        }
        assert.deepEqual(inventory(path.join(root, ".git")), before);
        assert.equal(fs.existsSync(trap), false);
      });
      if (vcs) git(root, ["config", "--unset", "remote.origin.vcs"]);
    }
    const controls = ["https://example.invalid/repo%3Fname%23part", "git@example.invalid:org/repo",
      "../local?name#part", "C:\\repos\\project", "\\\\server\\share\\project"];
    for (const remote of controls) check(`control:${remote}`, () => {
      git(root, ["config", "remote.origin.url", remote]);
      const before = inventory(path.join(root, ".git"));
      const first = exportBundle("private"), second = exportBundle("private");
      assert.equal(first.data.source.repo, remote);
      assert.equal(first.receipt.zip_sha256, second.receipt.zip_sha256);
      assert.equal(JSON.parse(ok(mdkg(root, ["git", "inspect", "--json"])).stdout).source_descriptor.repository_ref, remote);
      assert.deepEqual(inventory(path.join(root, ".git")), before);
    });
    git(root, ["config", "--unset", "remote.origin.url"]);
    check("control:no-origin", () => assert.equal(exportBundle("private").data.source.repo, "child"));
    ok(mdkg(parent, ["init", "--graph-only"]));
    check("control:no-git", () => {
      const receipt = JSON.parse(ok(mdkg(parent, ["bundle", "create", "--json"])).stdout);
      assert.equal(receipt.source.repo, "parent"); assert.equal(receipt.source.git_head, null);
    });
    const safe = exportBundle("private"), legacy = path.join(parent, "imports/legacy.mdkg.zip");
    fs.mkdirSync(path.dirname(legacy));
    const legacyEntries = entries(safe.file);
    const legacyManifest = JSON.parse(legacyEntries.find(entry => entry.name === "manifest.json").data);
    legacyManifest.source.repo = "https://g86secretLegacy@example.invalid/repo?key=g86secretLegacyQuery# g86secretLegacyFragment";
    legacyEntries.find(entry => entry.name === "manifest.json").data = Buffer.from(JSON.stringify(legacyManifest, null, 2) + "\n");
    fs.writeFileSync(legacy, createDeterministicZipFromEntries(legacyEntries));
    const legacyBytes = fs.readFileSync(legacy);
    check("historical:inspection", () => {
      const shown = ok(mdkg(parent, ["bundle", "show", "imports/legacy.mdkg.zip", "--json"]));
      noSecrets(shown.stdout + shown.stderr);
      const value = JSON.parse(shown.stdout);
      assert.equal(value.provenance_redacted, true);
      assert.equal(value.bundle.bundle_hash, legacyManifest.bundle_hash);
      assert.equal(value.bundle.zip_sha256, "sha256:" + crypto.createHash("sha256").update(legacyBytes).digest("hex"));
      assert.deepEqual(fs.readFileSync(legacy), legacyBytes);
    });
    ok(mdkg(parent, ["subgraph", "add", "legacy", "imports/legacy.mdkg.zip", "--json"]));
    check("historical:provenance", () => {
      noSecrets(ok(mdkg(parent, ["show", "legacy:task-1", "--json"])).stdout);
      const pack = path.join(parent, "inspection-pack.json");
      ok(mdkg(parent, ["pack", "legacy:task-1", "--format", "json", "--out", pack]));
      noSecrets(fs.readFileSync(pack, "utf8"));
      ok(mdkg(parent, ["index"]));
      const parentConfig = JSON.parse(fs.readFileSync(path.join(parent, ".mdkg/config.json")));
      noSecrets(fs.readFileSync(path.join(parent, parentConfig.index.global_index_path), "utf8"));
      noSecrets(fs.readFileSync(path.join(parent, ".mdkg/index/subgraphs.json"), "utf8"));
      assert.deepEqual(fs.readFileSync(legacy), legacyBytes);
    });
    check("historical:materialize-refuses-without-writes", () => {
      const before = inventory(parent);
      const result = mdkg(parent, ["subgraph", "materialize", "legacy", "--target", ".mdkg/subgraphs", "--json"]);
      assert.notEqual(result.status, 0);
      assert.match(result.stdout + result.stderr, /provenance.*inspect-only/i);
      noSecrets(result.stdout + result.stderr);
      assert.deepEqual(inventory(parent), before);
      assert.deepEqual(fs.readFileSync(legacy), legacyBytes);
    });
    check("historical:normalized-authority-refuses-without-rewriting", () => {
      const file = path.join(parent, "imports/slashes.mdkg.zip");
      const data = entries(safe.file), sourceManifest = JSON.parse(data.find(entry => entry.name === "manifest.json").data);
      sourceManifest.source.repo = "https:///user:g86secretHistorical@example.invalid/repo";
      data.find(entry => entry.name === "manifest.json").data = Buffer.from(JSON.stringify(sourceManifest, null, 2) + "\n");
      fs.writeFileSync(file, createDeterministicZipFromEntries(data));
      ok(mdkg(parent, ["subgraph", "add", "slashes", "imports/slashes.mdkg.zip", "--json"]));
      const before = inventory(parent);
      noSecrets(ok(mdkg(parent, ["bundle", "show", "imports/slashes.mdkg.zip", "--json"])).stdout);
      noSecrets(ok(mdkg(parent, ["show", "slashes:task-1", "--json"])).stdout);
      const result = mdkg(parent, ["subgraph", "materialize", "slashes", "--target", ".mdkg/subgraphs", "--json"]);
      assert.notEqual(result.status, 0);
      assert.match(result.stdout + result.stderr, /provenance.*inspect-only/i);
      noSecrets(result.stdout + result.stderr);
      assert.deepEqual(inventory(parent), before);
    });
    check("control:materialize-safe-bundle", () => {
      fs.copyFileSync(safe.file, path.join(parent, "imports/safe.mdkg.zip"));
      ok(mdkg(parent, ["subgraph", "add", "safe", "imports/safe.mdkg.zip", "--json"]));
      ok(mdkg(parent, ["subgraph", "materialize", "safe", "--target", ".mdkg/subgraphs", "--json"]));
      assert.deepEqual(fs.readFileSync(path.join(parent, ".mdkg/subgraphs/safe/manifest.json")),
        entries(safe.file).find(entry => entry.name === "manifest.json").data);
    });
    const configuredRepo = "https://user:g86secretConfigured@example.invalid/repo?arbitrary=g86secretSuffix";
    const configuredAdd = ok(mdkg(parent, ["subgraph", "add", "configured", "imports/safe.mdkg.zip",
      "--source-path", "projects/child", "--source-repo", configuredRepo, "--json"]));
    check("configured:added", () => noSecrets(configuredAdd.stdout + configuredAdd.stderr));
    for (const enabled of [true, false]) {
      if (!enabled) {
        const disabled = ok(mdkg(parent, ["subgraph", "disable", "configured", "--json"]));
        check("configured:disabled", () => noSecrets(disabled.stdout + disabled.stderr));
      }
      for (const args of [["list"], ["show", "configured"], ["verify", "configured"],
        ["audit", "configured"], ["upgrade-plan", "configured"], ["sync", "configured", "--dry-run"]]) {
        check(`configured:${enabled ? "enabled" : "disabled"}:${args[0]}`, () => {
          const before = inventory(parent);
          const result = mdkg(parent, ["subgraph", ...args, "--json"]);
          assert([0, 2].includes(result.status), result.stdout + result.stderr);
          noSecrets(result.stdout + result.stderr);
          assert.deepEqual(inventory(parent), before);
        });
      }
    }
    check("configured:disabled-sync-text", () => {
      const result = ok(mdkg(parent, ["subgraph", "sync", "configured"]));
      noSecrets(result.stdout + result.stderr);
    });
    check("configured:mcp-observation", () => {
      const before = inventory(parent);
      const input = JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/call",
        params: { name: "mdkg_workspace_list", arguments: {} } }) + "\n";
      const result = ok(run(node, [cli, "mcp", "serve", "--stdio"], parent, input));
      noSecrets(result.stdout + result.stderr);
      assert(JSON.parse(result.stdout).result.structuredContent);
      assert.deepEqual(inventory(parent), before);
    });
    check("configured:enabled-and-indexed", () => {
      const result = ok(mdkg(parent, ["subgraph", "enable", "configured", "--json"]));
      noSecrets(result.stdout + result.stderr);
      ok(mdkg(parent, ["index"]));
      noSecrets(fs.readFileSync(path.join(parent, ".mdkg/index/subgraphs.json"), "utf8"));
      // Display redaction never silently rewrites the author's configuration.
      assert.equal(JSON.parse(fs.readFileSync(path.join(parent, ".mdkg/config.json"))).subgraphs.configured.source_repo, configuredRepo);
    });
    check("subgraph-sync:shared-producer", () => {
      git(root, ["config", "remote.origin.url", "https://g86secretSync@example.invalid/repo?token=g86secretSyncQuery"]);
      fs.mkdirSync(path.join(parent, ".mdkg/bundles/private"), { recursive: true });
      fs.copyFileSync(safe.file, path.join(parent, ".mdkg/bundles/private/child.mdkg.zip"));
      ok(mdkg(parent, ["subgraph", "add", "child", ".mdkg/bundles/private/child.mdkg.zip", "--source-path", "projects/child", "--json"]));
      const before = inventory(path.join(root, ".git"));
      const synced = ok(mdkg(parent, ["subgraph", "sync", "child", "--json"]));
      noSecrets(synced.stdout + synced.stderr);
      for (const entry of entries(path.join(parent, ".mdkg/bundles/private/child.mdkg.zip"))) noSecrets(entry.data.toString("utf8"));
      assert.deepEqual(inventory(path.join(root, ".git")), before);
    });
    check("configured:sqlite-projection", () => {
      const file = path.join(parent, ".mdkg/config.json"), value = JSON.parse(fs.readFileSync(file));
      value.index.backend = "sqlite"; value.index.sqlite_path = ".mdkg/index/mdkg.sqlite";
      fs.writeFileSync(file, JSON.stringify(value, null, 2) + "\n");
      ok(mdkg(parent, ["index"]));
      noSecrets(fs.readFileSync(path.join(parent, value.index.sqlite_path), "utf8"));
      assert.equal(JSON.parse(ok(mdkg(parent, ["db", "index", "verify", "--json"])).stdout).ok, true);
      assert.equal(JSON.parse(fs.readFileSync(file)).subgraphs.configured.source_repo, configuredRepo);
    });
    assert.equal(fs.existsSync(trap), false);
    return { cli_sha256: crypto.createHash("sha256").update(fs.readFileSync(cli)).digest("hex"),
      node: node, cases, pass: cases.every(item => item.pass) };
  } finally {
    // Only this call's freshly created, exact fixture root is eligible for cleanup.
    fs.rmSync(owned, { recursive: true, force: true });
  }
}

module.exports = { qualifyBundleProvenance };
