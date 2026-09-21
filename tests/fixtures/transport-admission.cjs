// CLI-only, reusable against an installed candidate. All inputs are synthetic;
// Git administration samples are inert; no hooks or commands are supplied.
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

function qualifyTransportAdmission({ cli, tempRoot, node = process.execPath }) {
  const owned = fs.mkdtempSync(path.join(tempRoot, "transport-admission-"));
  const env = { PATH: process.env.PATH, SystemRoot: process.env.SystemRoot, LC_ALL: "C",
    GIT_CONFIG_NOSYSTEM: "1", GIT_CONFIG_GLOBAL: process.platform === "win32" ? "NUL" : "/dev/null",
    GIT_TERMINAL_PROMPT: "0", TMPDIR: owned, TMP: owned, TEMP: owned };
  const { readZipEntries, createDeterministicZipFromEntries } = require(path.join(path.dirname(cli), "util/zip.js"));
  const hash = bytes => crypto.createHash("sha256").update(bytes).digest("hex");
  const put = (root, file, bytes) => {
    const target = path.join(root, file); fs.mkdirSync(path.dirname(target), { recursive: true }); fs.writeFileSync(target, bytes); return target;
  };
  const mdkg = (root, args) => {
    const result = spawnSync(node, [cli, ...args], { cwd: root, env, encoding: "utf8", timeout: 30000, maxBuffer: 16 * 1024 * 1024 });
    assert.equal(result.error, undefined, String(result.error)); assert.equal(result.signal, null); return result;
  };
  const ok = result => { assert.equal(result.status, 0, result.stdout + result.stderr); return result; };
  const cases = [], check = (name, fn) => {
    try { fn(); cases.push({ name, pass: true }); }
    catch (error) { cases.push({ name, pass: false, error: error.message }); }
  };
  const inventory = root => {
    const rows = [];
    const walk = dir => {
      for (const name of fs.readdirSync(dir).sort()) {
        const file = path.join(dir, name), stat = fs.lstatSync(file), relative = path.relative(root, file);
        if (stat.isDirectory()) { rows.push([relative, "directory", stat.mode]); walk(file); }
        else if (stat.isSymbolicLink()) rows.push([relative, "link", fs.readlinkSync(file)]);
        else { assert(stat.isFile()); rows.push([relative, stat.mode, hash(fs.readFileSync(file))]); }
      }
    };
    walk(root); return rows;
  };
  const refuse = (root, args) => {
    const before = inventory(root), result = mdkg(root, args);
    assert.notEqual(result.status, 0, `${args.join(" ")} admitted unsafe transport`);
    assert.match(result.stdout + result.stderr, /transport|ownership|owned|administrat|spelling|portable|unselected|ambiguous/i);
    assert.deepEqual(inventory(root), before, `${args.join(" ")} wrote on refusal`);
  };
  const init = name => {
    const root = path.join(owned, name); fs.mkdirSync(root);
    ok(mdkg(root, ["init", "--graph-only"]));
    ok(mdkg(root, ["new", "task", "Portable intent", "--json"])); return root;
  };
  const decode = bytes => new Map(readZipEntries(bytes).map(entry => [entry.name, entry.data]));
  const rewrite = (base, mutate) => {
    const entries = new Map(base), m = JSON.parse(entries.get("manifest.json"));
    mutate(m, entries);
    m.files = [...entries].filter(([file]) => file !== "manifest.json").map(([file, data]) => ({
      ...(m.files.find(row => row.path === file) ?? { kind: "authored", workspace: "root", visibility: "private" }),
      path: file, size: data.length, sha256: `sha256:${hash(data)}`,
    }));
    const rowsHash = rows => `sha256:${hash(Buffer.from(`${JSON.stringify(rows.map(r => ({ path: r.path, kind: r.kind,
      workspace: r.workspace, visibility: r.visibility, size: r.size, sha256: r.sha256 })), null, 2)}\n`))}`;
    m.file_count = m.files.length; m.source_tree_hash = rowsHash(m.files.filter(r => r.kind !== "generated_index")); m.bundle_hash = rowsHash(m.files);
    for (const row of m.files.filter(r => r.kind === "generated_index")) m.index_hashes[row.path] = row.sha256;
    if (m.transport_policy) {
      m.transport_policy.bundle_hash = m.bundle_hash;
      m.transport_policy.files = m.files.map(row => ({ path: row.path,
        role: m.transport_policy.files.find(f => f.path === row.path)?.role ?? (row.kind === "generated_index" ? "projection" : "graph") }));
    }
    entries.set("manifest.json", Buffer.from(JSON.stringify(m)));
    return createDeterministicZipFromEntries([...entries].map(([name, data]) => ({ name, data })));
  };
  try {
    const source = init("producer"), consumer = init("consumer");
    const cfg = JSON.parse(fs.readFileSync(path.join(source, ".mdkg/config.json")));
    put(source, ".mdkg/support.bin", "graph-owned support asset");
    put(source, ".mdkg/.gitignore", "local-only\n");
    put(source, cfg.db.state_path, "portable private snapshot");
    ok(mdkg(source, ["bundle", "create", "--profile", "private", "--output", "safe.zip", "--json"]));
    const fresh = decode(fs.readFileSync(path.join(source, "safe.zip")));
    const historical = decode(rewrite(fresh, m => { delete m.transport_policy; }));
    const input = put(consumer, "imports/input.zip", rewrite(historical, () => {}));
    ok(mdkg(consumer, ["subgraph", "add", "sample", "imports/input.zip", "--json"]));
    for (const [format, base] of [["historical", historical], ["fresh", fresh]]) {
      for (const mode of ["clone", "fork"]) check(`${format} ${mode}: legitimate graph assets and private snapshot`, () => {
        fs.writeFileSync(input, rewrite(base, () => {}));
        const target = `positive-${format}-${mode}`;
        ok(mdkg(consumer, ["graph", mode, input, "--target", target, "--json"]));
        for (const file of [".mdkg/support.bin", ".mdkg/.gitignore", cfg.db.state_path])
          assert.deepEqual(fs.readFileSync(path.join(consumer, target, file)), fs.readFileSync(path.join(source, file)));
      });
      check(`${format} materialization: legitimate graph assets`, () => {
        fs.writeFileSync(input, rewrite(base, () => {}));
        ok(mdkg(consumer, ["subgraph", "materialize", "sample", "--target", ".mdkg/subgraphs", "--clean", "--json"]));
        assert.equal(fs.readFileSync(path.join(consumer, ".mdkg/subgraphs/sample/.mdkg/support.bin"), "utf8"), "graph-owned support asset");
      });
    }
    fs.writeFileSync(input, rewrite(historical, m => { for (const row of m.files) delete row.workspace; }));
    for (const mode of ["clone", "fork"]) check(`historical optional owner labels: ${mode} derives exact config ownership`, () =>
      ok(mdkg(consumer, ["graph", mode, input, "--target", `positive-no-label-${mode}`, "--json"])));
    check("historical optional owner labels: materialization derives exact config ownership", () =>
      ok(mdkg(consumer, ["subgraph", "materialize", "sample", "--target", ".mdkg/subgraphs", "--clean", "--json"])));
    for (const [format, base] of [["historical", historical], ["fresh", fresh]]) {
      for (const field of ["global_index_path", "sqlite_path", "cache_path"]) {
        for (const destination of [".git/config", ".mdkg/cache/.GiT/config", "package.json"]) {
          fs.writeFileSync(input, rewrite(base, (_m, entries) => {
            const config = JSON.parse(entries.get(".mdkg/config.json"));
            if (field === "cache_path") config.capabilities.cache_path = destination;
            else config.index[field] = destination;
            if (field === "sqlite_path") config.index.backend = "sqlite";
            entries.set(".mdkg/config.json", Buffer.from(JSON.stringify(config)));
          }));
          for (const mode of ["clone", "fork"]) check(`${format} configured ${field} ${destination}: ${mode} refuses unchanged`, () =>
            refuse(consumer, ["graph", mode, input, "--target", `refused-configured-${cases.length}`, "--json"]));
          check(`${format} configured ${field} ${destination}: materialize refuses unchanged`, () =>
            refuse(consumer, ["subgraph", "materialize", "sample", "--target", ".mdkg/subgraphs", "--clean", "--json"]));
        }
      }
      fs.writeFileSync(input, rewrite(base, (_m, entries) => {
        const config = JSON.parse(entries.get(".mdkg/config.json"));
        config.index.global_index_path = ".mdkg/cache/global.json";
        config.index.sqlite_path = ".mdkg/cache/index.sqlite"; config.index.backend = "sqlite";
        config.capabilities.cache_path = ".mdkg/cache/capabilities.json";
        entries.set(".mdkg/config.json", Buffer.from(JSON.stringify(config)));
      }));
      for (const mode of ["clone", "fork"]) check(`${format} legitimate custom cache destinations: ${mode}`, () => {
        const target = `positive-cache-${format}-${mode}`;
        ok(mdkg(consumer, ["graph", mode, input, "--target", target, "--json"]));
        for (const file of ["global.json", "index.sqlite", "capabilities.json"]) assert(fs.existsSync(path.join(consumer, target, ".mdkg/cache", file)));
      });
    }
    const samples = [
      ["git-config", { ".git/config": "[core]\nrepositoryformatversion = 0\n" }],
      ["git-layout", { ".git/config": "[core]\nrepositoryformatversion = 0\n", ".git/HEAD": "ref: refs/heads/main\n", ".git/objects/inert": "not an object", ".git/refs/heads/inert": "0".repeat(40) }],
      ["git-indirection", { ".git": "gitdir: inert-not-created\n" }],
      ["nested-git", { ".mdkg/assets/.git/config": "inert" }],
      ["case-git", { ".mdkg/.GiT/config": "inert" }],
      ["hfs-git", { ".mdkg/.g\u200cit/config": "inert" }],
      ["trailing-git", { ".mdkg/.git./config": "inert" }],
      ["unrelated-root", { "package.json": "{}" }],
      ["unrelated-child", { "projects/other/payload.txt": "unowned" }],
      ["prefix-collision", { ".mdkg/assets": "file", ".mdkg/assets/child": "child" }],
      ["case-collision", { ".mdkg/Asset": "one", ".mdkg/asset": "two" }],
      ["unicode-collision", { ".mdkg/caf\u00e9": "one", ".mdkg/cafe\u0301": "two" }],
    ];
    for (const [format, base] of [["historical", historical], ["fresh", fresh]]) {
      for (const [name, files] of samples) {
        fs.writeFileSync(input, rewrite(base, (_m, entries) => { for (const [file, bytes] of Object.entries(files)) entries.set(file, Buffer.from(bytes)); }));
        for (const mode of ["clone", "fork"]) check(`${format} ${name}: ${mode} refuses unchanged`, () =>
          refuse(consumer, ["graph", mode, input, "--target", `refused-${format}-${name}-${mode}`, "--json"]));
        check(`${format} ${name}: materialize clean refuses unchanged`, () =>
          refuse(consumer, ["subgraph", "materialize", "sample", "--target", ".mdkg/subgraphs", "--clean", "--gitignore", "--json"]));
        if (["git-config", "unrelated-root", "nested-git"].includes(name)) for (const apply of [false, true])
          check(`${format} ${name}: template ${apply ? "apply" : "preview"} refuses unchanged`, () =>
            refuse(consumer, ["graph", "import-template", input, ...(apply ? ["--apply"] : []), "--json"]));
      }
    }
    for (const kind of ["disabled", "unselected", "wrong-owner"]) {
      fs.writeFileSync(input, rewrite(historical, (m, entries) => {
        const config = JSON.parse(entries.get(".mdkg/config.json"));
        config.workspaces.child = { path: ".mdkg/children/child", mdkg_dir: "memory", enabled: kind !== "disabled", visibility: "private" };
        entries.set(".mdkg/config.json", Buffer.from(JSON.stringify(config)));
        const file = ".mdkg/children/child/memory/support.bin"; entries.set(file, Buffer.from("child-owned"));
        m.files.push({ path: file, kind: "authored", workspace: kind === "wrong-owner" ? "root" : "child", visibility: "private" });
        if (kind !== "unselected") m.selected_workspaces.push("child");
      }));
      for (const mode of ["clone", "fork"]) check(`${kind} owner: ${mode} refuses unchanged`, () =>
        refuse(consumer, ["graph", mode, input, "--target", `refused-${kind}-${mode}`, "--json"]));
      check(`${kind} owner: materialize refuses unchanged`, () =>
        refuse(consumer, ["subgraph", "materialize", "sample", "--target", ".mdkg/subgraphs", "--clean", "--json"]));
    }
    fs.writeFileSync(input, rewrite(fresh, (m, entries) => {
      entries.delete(".mdkg/config.json");
      const global = JSON.parse(entries.get(".mdkg/index/global.json"));
      for (const node of Object.values(global.nodes)) node.path = node.path.replace(/^\.mdkg\//, ".git/");
      for (const row of m.files.filter(row => row.kind !== "generated_index")) {
        const bytes = entries.get(row.path); entries.delete(row.path); row.path = row.path.replace(/^\.mdkg\//, ".git/");
        if (bytes) entries.set(row.path, bytes);
      }
      entries.set(".mdkg/index/global.json", Buffer.from(JSON.stringify(global)));
      m.transport_policy.workspaces[0].root = ".git";
      m.transport_policy.files = m.transport_policy.files.map(row => ({ ...row, path: row.role === "projection" ? row.path : row.path.replace(/^\.mdkg\//, ".git/") }));
    }));
    check("config-less policy cannot authorize a Git administrative root", () =>
      refuse(consumer, ["subgraph", "materialize", "sample", "--target", ".mdkg/subgraphs", "--clean", "--json"]));
    for (const file of [".mdkg/.git/config", ".mdkg/assets/.GiT/config"]) {
      const producer = init(`producer-${cases.length}`); put(producer, file, "inert");
      for (const profile of ["private", "public"]) check(`${profile} producer refuses ${file}`, () => {
        const cfgPath = path.join(producer, ".mdkg/config.json"), config = JSON.parse(fs.readFileSync(cfgPath));
        config.workspaces.root.visibility = "public"; fs.writeFileSync(cfgPath, JSON.stringify(config));
        refuse(producer, ["bundle", "create", "--profile", profile, "--output", "unsafe.zip", "--json"]);
      });
      check(`directory clone refuses ${file}`, () =>
        refuse(consumer, ["graph", "clone", producer, "--target", `refused-directory-${cases.length}`, "--json"]));
    }
    return { pass: cases.every(c => c.pass), cases, runtime: ok(spawnSync(node, ["--version"], { encoding: "utf8" })).stdout.trim(),
      platform: `${process.platform}-${process.arch}`, cli_sha256: hash(fs.readFileSync(cli)), final_qualification: false };
  } finally { fs.rmSync(owned, { recursive: true, force: true }); }
}

module.exports = { qualifyTransportAdmission };
