import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { spawnSync } from "node:child_process";
import { makeTempDir, writeFile } from "../helpers/fs";
import { writeRootConfig } from "../helpers/config";
import { writeDefaultTemplates } from "../helpers/templates";
const runtime = process.env.MDKG_TEST_PACKAGE ? path.join(process.env.MDKG_TEST_PACKAGE, "dist") : path.resolve(__dirname, "../..");
const { loadConfig } = require(path.join(runtime, "core/config"));
const { syncSkillMirrors, scaffoldMirrorRoots, preflightSkillMirrorTargets } = require(path.join(runtime, "commands/skill_mirror"));
const { UpgradePlan, continueUpgrade, digest } = require(path.join(runtime, "commands/upgrade_transaction"));
const { planUpgradeProjections } = require(path.join(runtime, "commands/upgrade_projections"));
const gitEnv = { ...process.env, GIT_CONFIG_GLOBAL: "/dev/null", GIT_CONFIG_SYSTEM: "/dev/null", GIT_CONFIG_NOSYSTEM: "1", GIT_TERMINAL_PROMPT: "0" };
function git(root: string, args: string[]) {
  const r = spawnSync("git", args, { cwd: root, env: gitEnv, encoding: "utf8" }); assert.equal(r.status, 0, r.stderr); return r.stdout.trim();
}
function fixture(t: any, kind = "normal") {
  const base = makeTempDir("skill-git-metadata-"); t.after(() => fs.rmSync(base, { recursive: true, force: true }));
  let root = path.join(base, "repo"); fs.mkdirSync(root);
  if (kind === "separate") git(base, ["init", "-q", "--separate-git-dir", path.join(root, "admin"), root]);
  else if (kind !== "non-git") git(root, ["init", "-q"]);
  if (kind === "worktree" || kind === "submodule") {
    git(root, ["-c", "user.name=Fixture", "-c", "user.email=fixture@example.invalid", "commit", "--allow-empty", "--no-verify", "-qm", "fixture"]);
    const child = path.join(root, "child");
    if (kind === "worktree") git(root, ["worktree", "add", "-qb", "fixture-child", child]);
    else {
      const source = path.join(base, "child-source"); fs.mkdirSync(source); git(source, ["init", "-q"]);
      git(source, ["-c", "user.name=Fixture", "-c", "user.email=fixture@example.invalid", "commit", "--allow-empty", "--no-verify", "-qm", "fixture"]);
      git(root, ["-c", "protocol.file.allow=always", "submodule", "add", "-q", source, "child"]);
    }
    root = child;
  }
  writeRootConfig(root); writeDefaultTemplates(root);
  writeFile(path.join(root, ".mdkg/core/SOUL.md"), "# Synthetic bootstrap marker\n");
  writeFile(path.join(root, ".mdkg/skills/example/SKILL.md"), "---\nname: example\ndescription: inspect synthetic evidence\n---\n# Goal\n");
  return { root, base };
}
function targets(root: string, values: string[]) {
  const p = path.join(root, ".mdkg/config.json"), c = JSON.parse(fs.readFileSync(p, "utf8"));
  c.customization = { skill_mirrors: { targets: values } }; fs.writeFileSync(p, JSON.stringify(c));
  return loadConfig(root);
}
function inventory(root: string): Record<string, string> {
  const result: Record<string, string> = {};
  function walk(dir: string) { for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name), k = path.relative(root, p);
    if (e.isDirectory()) { result[k] = "directory"; walk(p); }
    else if (e.isSymbolicLink()) result[k] = `link:${fs.readlinkSync(p)}`;
    else result[k] = crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
  } } walk(root); return result;
}
function refuses(f: { root: string; base: string }, run: () => void) {
  const before = inventory(f.base); assert.throws(run, /Git|git metadata|git directory|canonical graph storage/i); assert.deepEqual(inventory(f.base), before);
}
for (const force of [false, true]) for (const target of [".git/hooks", ".GIT/hooks", ".git\\hooks", "admin/hooks", "admin", "."]) {
  test(`skill sync refuses ${target} with force=${force} before all effects`, t => {
    const f = fixture(t, target.startsWith("admin") ? "separate" : "normal"), config = targets(f.root, [".agents/skills", target]);
    refuses(f, () => syncSkillMirrors({ root: f.root, config, force, createRoots: true }));
  });
}
for (const kind of ["worktree", "submodule"]) {
  test(`${kind} native gitfile remains unchanged on mirror refusal`, t => {
    const f = fixture(t, kind), config = targets(f.root, [".git"]);
    refuses(f, () => syncSkillMirrors({ root: f.root, config, force: true, createRoots: true }));
  });
}
for (const operation of ["scaffold", "forced-preflight", "empty-preflight"]) {
  test(`${operation} refuses native metadata without bypassing empty/forced checks`, t => {
    const f = fixture(t, "separate"), config = targets(f.root, ["admin/hooks"]);
    refuses(f, () => operation === "scaffold" ? scaffoldMirrorRoots(f.root, config) : preflightSkillMirrorTargets({ root: f.root, config, force: operation === "forced-preflight", slugs: operation === "empty-preflight" ? [] : ["example"] }));
  });
}
for (const operation of ["new", "sync", "init"]) {
  test(`${operation} CLI rejects unsafe mirrors before canonical or lock-directory writes`, t => {
    const f = fixture(t, "separate"); targets(f.root, ["admin/hooks"]);
    const before = inventory(f.base), args = operation === "init" ? ["init", "--agent"] : operation === "new" ? ["skill", "new", "fresh", "fresh", "--description", "synthetic skill", "--force", "--json"] : ["skill", "sync", "--force", "--json"];
    const r = spawnSync(process.execPath, [path.join(runtime, "cli.js"), ...args], { cwd: f.root, env: gitEnv, encoding: "utf8", timeout: 20000 });
    assert.notEqual(r.status, 0, r.stdout); assert.match(r.stderr, /Git|git metadata|git directory/i); assert.deepEqual(inventory(f.base), before);
  });
}
test("nested Git repositories cannot be pruned through a managed stale slug", t => {
  const f = fixture(t), config = targets(f.root, [".agents/skills"]), child = path.join(f.root, ".agents/skills/stale");
  fs.mkdirSync(child, { recursive: true }); git(child, ["init", "-q"]);
  writeFile(path.join(f.root, ".agents/skills/.mdkg-managed.json"), JSON.stringify({ managed_slugs: ["stale"] }));
  refuses(f, () => syncSkillMirrors({ root: f.root, config, force: true, createRoots: true }));
});
test("upgrade projection planning refuses an actual non-dotgit administrative directory", t => {
  const f = fixture(t, "separate"), config = targets(f.root, ["admin/hooks"]);
  refuses(f, () => planUpgradeProjections(new UpgradePlan(f.root), config, new Map()));
});
for (const mode of ["resume", "recover"]) {
  test(`approved historical upgrade ${mode} cannot write native metadata`, t => {
    const f = fixture(t, "separate"), operation = { path: "admin/hooks/retained", before: Buffer.from("BEFORE").toString("base64"), after: Buffer.from("AFTER").toString("base64") };
    writeFile(path.join(f.root, operation.path), mode === "recover" ? "AFTER" : "BEFORE");
    const dependencies = { files: [], directories: [] }, operations = [operation], approved_plan = { extra: null, dependencies, operations };
    const canonical = JSON.stringify(approved_plan, (_k, v) => v && typeof v === "object" && !Array.isArray(v) ? Object.fromEntries(Object.entries(v).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0)) : v);
    const plan_hash = digest(canonical), journal = { schema_version: 3, plan_hash, operations, operations_hash: digest(JSON.stringify(operations)), dependencies, dependencies_hash: digest(JSON.stringify(dependencies)), approved_plan, state: "applying" };
    writeFile(path.join(f.root, ".mdkg/state/upgrade-journal.json"), JSON.stringify(journal));
    refuses(f, () => continueUpgrade(f.root, mode, plan_hash, 10000));
  });
}
for (const kind of ["normal", "separate", "worktree", "submodule", "non-git"]) {
  test(`ordinary custom mirrors remain usable in ${kind} repositories`, t => {
    const f = fixture(t, kind), config = targets(f.root, [".agents/skills", ".claude/skills", ".custom/skills"]);
    const result = syncSkillMirrors({ root: f.root, config, createRoots: true }); assert.equal(result.synced, 3);
    for (const target of config.customization.skill_mirrors.targets) assert.ok(fs.existsSync(path.join(f.root, target, "example/SKILL.md")));
  });
}

for (const variable of ["GIT_INDEX_FILE", "GIT_OBJECT_DIRECTORY"]) {
  test(`native ${variable} redirection is protected alongside natural Git metadata`, t => {
    const f = fixture(t), destination = path.join(f.root, "redirected");
    if (variable === "GIT_OBJECT_DIRECTORY") fs.mkdirSync(destination); else writeFile(destination, "synthetic index sentinel");
    const old = process.env[variable]; process.env[variable] = destination;
    try {
      const config = targets(f.root, ["redirected"]);
      refuses(f, () => syncSkillMirrors({ root: f.root, config, createRoots: true, force: true }));
    } finally { if (old === undefined) delete process.env[variable]; else process.env[variable] = old; }
  });
}
test("Git environment redirection cannot hide the natural administrative directory", t => {
  const f = fixture(t, "separate"), other = path.join(f.base, "other"); fs.mkdirSync(other); git(other, ["init", "-q"]);
  const old = process.env.GIT_DIR; process.env.GIT_DIR = path.join(other, ".git");
  try {
    const config = targets(f.root, ["admin/hooks"]);
    refuses(f, () => syncSkillMirrors({ root: f.root, config, createRoots: true, force: true }));
  } finally { if (old === undefined) delete process.env.GIT_DIR; else process.env.GIT_DIR = old; }
});
test("configured native hooks path is not a mirror destination", t => {
  const f = fixture(t); git(f.root, ["config", "core.hooksPath", path.join(f.root, "hooks")]);
  const config = targets(f.root, ["hooks"]);
  refuses(f, () => syncSkillMirrors({ root: f.root, config, createRoots: true, force: true }));
});
test("a plan admitted before Git topology changes is refused before journal/lock writes", t => {
  const f = fixture(t, "non-git"), plan = new UpgradePlan(f.root);
  plan.write("admin/hooks/retained", "SYNTHETIC"); const hash = plan.hash(null);
  git(f.base, ["init", "-q", "--separate-git-dir", path.join(f.root, "admin"), f.root]);
  refuses(f, () => plan.apply(hash, 10000));
});
test("portable mirror selectors and literal resource backslashes remain distinct", t => {
  const f = fixture(t), config = targets(f.root, [".custom\\skills"]);
  writeFile(path.join(f.root, ".mdkg/skills/example/assets/a\\b.bin"), "LITERAL");
  syncSkillMirrors({ root: f.root, config, createRoots: true });
  assert.equal(fs.readFileSync(path.join(f.root, ".custom/skills/example/assets/a\\b.bin"), "utf8"), "LITERAL");
  assert.equal(fs.existsSync(path.join(f.root, ".custom\\skills")), false);
});
test("nested bare Git repositories cannot be pruned", t => {
  const f = fixture(t), config = targets(f.root, [".agents/skills"]), child = path.join(f.root, ".agents/skills/stale");
  fs.mkdirSync(child, { recursive: true }); git(child, ["init", "--bare", "-q"]);
  writeFile(path.join(f.root, ".agents/skills/.mdkg-managed.json"), JSON.stringify({ managed_slugs: ["stale"] }));
  refuses(f, () => syncSkillMirrors({ root: f.root, config, createRoots: true, force: true }));
});

for (const variable of ["GIT_CEILING_DIRECTORIES", "GIT_DISCOVERY_ACROSS_FILESYSTEM"]) {
  test(`non-Git mirrors remain usable with discovery-only ${variable}`, t => {
    const f = fixture(t, "non-git"), old = process.env[variable];
    process.env[variable] = variable === "GIT_CEILING_DIRECTORIES" ? f.base : "1";
    try { assert.equal(syncSkillMirrors({ root: f.root, config: targets(f.root, [".agents/skills"]), createRoots: true }).synced, 1); }
    finally { if (old === undefined) delete process.env[variable]; else process.env[variable] = old; }
  });
}
for (const mode of ["environment", "file", "quoted", "chained"]) {
  test(`alternate object stores are protected (${mode})`, t => {
    const f = fixture(t), alternate = path.join(f.root, mode === "quoted" ? "alternate:quoted" : "alternate");
    fs.mkdirSync(path.join(alternate, "info"), { recursive: true }); fs.mkdirSync(path.join(alternate, "pack"));
    const old = process.env.GIT_ALTERNATE_OBJECT_DIRECTORIES;
    if (mode === "environment" || mode === "quoted") process.env.GIT_ALTERNATE_OBJECT_DIRECTORIES = mode === "quoted" ? JSON.stringify(alternate) : alternate;
    else {
      writeFile(path.join(f.root, ".git/objects/info/alternates"), "../../alternate\n");
      if (mode === "chained") writeFile(path.join(alternate, "info/alternates"), "../second\n");
    }
    try {
      const config = targets(f.root, [mode === "chained" ? "second" : path.basename(alternate)]);
      refuses(f, () => syncSkillMirrors({ root: f.root, config, createRoots: true, force: true }));
    } finally { if (old === undefined) delete process.env.GIT_ALTERNATE_OBJECT_DIRECTORIES; else process.env.GIT_ALTERNATE_OBJECT_DIRECTORIES = old; }
  });
}
test("unknown Git topology refuses before any writes", t => {
  const f = fixture(t, "non-git"); writeFile(path.join(f.root, ".git"), "gitdir: missing-metadata\n");
  const config = targets(f.root, [".agents/skills"]);
  refuses(f, () => syncSkillMirrors({ root: f.root, config, createRoots: true }));
});
test("invalid alternate path bytes fail closed without reinterpretation", t => {
  const f = fixture(t); fs.writeFileSync(path.join(f.root, ".git/objects/info/alternates"), Buffer.from([0xff, 10]));
  const config = targets(f.root, [".agents/skills"]);
  refuses(f, () => syncSkillMirrors({ root: f.root, config, createRoots: true }));
});
for (const mode of ["file", "quoted-environment"]) {
  test(`BOM-prefixed alternate path bytes are preserved (${mode})`, t => {
    const f = fixture(t), store = path.join(f.root, "\uFEFFALT"), old = process.env.GIT_ALTERNATE_OBJECT_DIRECTORIES;
    writeFile(path.join(store, "info/alternates"), "../second-store\n");
    if (mode === "file") {
      // Relative to the primary object directory; BOM is not a text marker.
      const inner = path.join(f.root, ".git/objects/\uFEFFALT");
      writeFile(path.join(inner, "info/alternates"), "../../../second-store\n");
      writeFile(path.join(f.root, ".git/objects/info/alternates"), "\uFEFFALT\n");
    } else process.env.GIT_ALTERNATE_OBJECT_DIRECTORIES = JSON.stringify("\uFEFFALT");
    try {
      const config = targets(f.root, ["second-store"]);
      refuses(f, () => syncSkillMirrors({ root: f.root, config, createRoots: true }));
    } finally { if (old === undefined) delete process.env.GIT_ALTERNATE_OBJECT_DIRECTORIES; else process.env.GIT_ALTERNATE_OBJECT_DIRECTORIES = old; }
  });
}
test("distinct case-sensitive alternate stores retain separate traversal identity", t => {
  const f = fixture(t), upper = path.join(f.root, "ALT"), lower = path.join(f.root, "alt");
  fs.mkdirSync(upper);
  // The macOS host may be case-insensitive; Linux must exercise both stores.
  if (fs.existsSync(lower)) { assert.equal(fs.statSync(lower).ino, fs.statSync(upper).ino); return; }
  fs.mkdirSync(lower);
  writeFile(path.join(lower, "info/alternates"), "../second-store\n");
  writeFile(path.join(f.root, ".git/objects/info/alternates"), "../../ALT\n../../alt\n");
  const config = targets(f.root, ["second-store"]);
  refuses(f, () => syncSkillMirrors({ root: f.root, config, createRoots: true }));
});
