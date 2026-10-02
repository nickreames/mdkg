import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";
import test from "node:test";
import zlib from "node:zlib";
const require = createRequire(import.meta.url);
const repo = path.resolve(import.meta.dirname, "..");
const { createOwnedFixture, finalizeFixture } = require("../scripts/qualification-fixture");
const { acceptOwnedGitFixture } = require("../scripts/qualification-git");
const boundary = require("../scripts/dependency-boundary");
const ladder = require("../scripts/release-ladder");
const { releaseScope, scopeForMode } = require("../scripts/release-scope");
const candidate = require("../scripts/retained-release-candidate");
const manifest = require("../scripts/smoke-manifest.json");
const hash = bytes => crypto.createHash("sha256").update(bytes).digest("hex");

function owned(t) {
  const fixture = createOwnedFixture({ prefix: "mdkg-package-profile-" });
  t.after(() => finalizeFixture(fixture));
  return fixture;
}
function put(root, relative, bytes, mode = 0o644) {
  const file = path.join(root, relative);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, bytes, { mode });
  return file;
}
function tar(entries) {
  const parts = [];
  for (const { name, bytes, type = "0", mode = 0o644 } of entries) {
    const body = Buffer.from(bytes), h = Buffer.alloc(512);
    h.write(name, 0, 100); h.write(mode.toString(8).padStart(7, "0") + "\0", 100);
    h.write("0000000\0", 108); h.write("0000000\0", 116);
    h.write(body.length.toString(8).padStart(11, "0") + "\0", 124);
    h.write("00000000000\0", 136); h.fill(32, 148, 156);
    h.write(type, 156); h.write("ustar\0", 257); h.write("00", 263);
    const sum = h.reduce((a, b) => a + b, 0);
    h.write(sum.toString(8).padStart(6, "0") + "\0 ", 148);
    parts.push(h, body, Buffer.alloc((512 - body.length % 512) % 512));
  }
  return zlib.gzipSync(Buffer.concat([...parts, Buffer.alloc(1024)]));
}
function seeded(t) {
  const f = owned(t);
  for (const file of ["tsconfig.json", "tsconfig.build.json", "CLI_COMMAND_MATRIX.md", "CHANGELOG.md", "CONTRIBUTING.md",
    "scripts/postinstall.js", "scripts/add-shebang.js", "scripts/copy-init-assets.js", "scripts/clean-build-output.js",
    "scripts/public-core-seed.js", "scripts/repository-skill-policy.js", "scripts/generate-command-contract.js", "scripts/cli_help_targets.js"]) {
    put(f.root, file, "fixture\n");
  }
  put(f.root, "src/cli.ts", "fixture source\n");
  put(f.root, "package.json", JSON.stringify({ name: "fixture", version: "0.6.0", files: ["dist/cli.js", "README.md", "LICENSE"] }));
  put(f.root, "package-lock.json", JSON.stringify({ lockfileVersion: 3, packages: { "": {} } }));
  put(f.root, "dist/cli.js", "fixture compiled\n"); put(f.root, "README.md", "readme\n"); put(f.root, "LICENSE", "license\n");
  fs.mkdirSync(f.resolve("node_modules"));
  const payload = candidate.builtPayload(f.root);
  const archive = tar(payload.map(p => ({ name: "package/" + p.path, bytes: fs.readFileSync(f.resolve(p.path)) })));
  const tarball = put(f.root, "candidate.tgz", archive, 0o444);
  const sha256 = hash(archive);
  const inputs = candidate.candidateInputs(f.root, tarball, sha256);
  const inputPath = put(f.root, "inputs.json", JSON.stringify(inputs));
  return { f, inputs, options: { tarball, sha256, inputs: inputPath, inputsSha256: hash(fs.readFileSync(inputPath)) } };
}

test("package profile keeps37 executions while repository preserves46 and nine site profiles", () => {
  ladder.validateManifest(manifest, require("../package.json"));
  const pkg = ladder.canonicalEntries(manifest, "prepublish", undefined, "package");
  const all = ladder.canonicalEntries(manifest, "prepublish", undefined, "repository");
  assert.equal(pkg.length, 37); assert.equal(all.length, 46);
  assert.equal(all.filter(x => !pkg.some(y => y.canonical === x.canonical)).length, 9);
  assert.equal(manifest.profiles.docs.length + manifest.profiles["mdkg-dev"].length, 9);
  assert.equal(pkg.some(x => x.prerequisites.includes("site_profile_cache")), false);
  assert.equal(ladder.canonicalEntries(manifest, "ci").length, 13);
  assert.equal(manifest.ci_topology.full.linux_filesystem.state, "unqualified_stub");
});

test("profile drift is refused and hosted modes cannot inherit narrowed package scope", () => {
  const bad = structuredClone(manifest); bad.release_profiles.package.canonical_execution_count = 36;
  assert.throws(() => ladder.validateManifest(bad, require("../package.json")), /package37/);
  const saved = process.env.MDKG_RELEASE_SCOPE;
  try {
    delete process.env.MDKG_RELEASE_SCOPE;
    assert.equal(scopeForMode("prepublish"), "package");
    process.env.MDKG_RELEASE_SCOPE = "repository";
    assert.equal(scopeForMode("prepublish"), "repository");
  } finally {
    if (saved === undefined) delete process.env.MDKG_RELEASE_SCOPE;
    else process.env.MDKG_RELEASE_SCOPE = saved;
  }
  assert.equal(scopeForMode("full-prepare", "package"), "repository");
  assert.equal(scopeForMode("full-shard", "package"), "repository");
  assert.throws(() => releaseScope("unknown"), /unsupported release scope/);
});

test("package preflight needs no website dependencies; repository still detects them", t => {
  const { f } = seeded(t);
  const pkg = boundary.inspectDependencyTrees(f.root, "package");
  assert.equal(pkg.ok, true); assert.deepEqual(pkg.domains.map(x => x.id), ["root"]);
  const repository = boundary.inspectDependencyTrees(f.root, "repository");
  assert.equal(repository.ok, false); assert.equal(repository.domains.length, 3);
  assert.equal(boundary.bootstrapPlan(f.root, "package").length, 1);
  assert.equal(boundary.bootstrapPlan(f.root, "repository").length, 3);
  const call = spawnSync(process.execPath, [path.join(repo, "scripts/dependency-boundary.js"), "preflight", "--json", "--root", f.root],
    { encoding: "utf8", env: { ...process.env, MDKG_RELEASE_SCOPE: "package" } });
  assert.equal(call.status, 0, call.stderr); assert.equal(JSON.parse(call.stdout).domain_count, 1);
});

test("scope reaches nested package/build/prepack environment with no optional Git locks", t => {
  const f = owned(t);
  const env = ladder.releaseEnvironment(f.root, { npm: process.execPath, npx: process.execPath }, "package");
  assert.equal(env.MDKG_RELEASE_SCOPE, "package"); assert.equal(env.GIT_OPTIONAL_LOCKS, "0");
  assert.equal(env.NPM_CONFIG_OFFLINE, "true");
  const args = ["-e", `console.log(require(${JSON.stringify(path.join(repo, "scripts/release-scope.js"))}).releaseScope())`];
  const result = spawnSync(process.execPath, args, { env, encoding: "utf8" });
  assert.equal(result.status, 0); assert.equal(result.stdout.trim(), "package");
});

test("retained admission preserves artifact, full source inputs and real Git staging", t => {
  const { f, options } = seeded(t), git = acceptOwnedGitFixture(f.root);
  git.run(f.root, ["init", "-q"]); git.run(f.root, ["add", "README.md"]);
  const staged = fs.readFileSync(f.resolve(".git/index"));
  const before = fs.readFileSync(options.tarball), ino = fs.statSync(options.tarball).ino;
  const proof = candidate.admitRetainedCandidate(f.root, options);
  assert.equal(proof.repacked, false); assert.equal(proof.payload_count, 4);
  assert.deepEqual(fs.readFileSync(options.tarball), before); assert.equal(fs.statSync(options.tarball).ino, ino);
  assert.deepEqual(fs.readFileSync(f.resolve(".git/index")), staged);
  put(f.root, "scripts/release-ladder.js", "a changed qualification-only harness\n");
  assert.equal(candidate.admitRetainedCandidate(f.root, options).repacked, false);
});

for (const [name, mutate, pattern] of [
  ["source content", ({ f }) => put(f.root, "src/cli.ts", "changed"), /package-input/],
  ["new source file", ({ f }) => put(f.root, "src/new.ts", "changed"), /package-input/],
  ["packaged guidance", ({ f }) => put(f.root, "README.md", "changed"), /package-input/],
  ["build payload", ({ f }) => put(f.root, "dist/cli.js", "changed"), /payload identity/],
  ["wrong artifact", ({ options }) => { options.sha256 = "0".repeat(64); }, /mismatch/],
  ["wrong manifest hash", ({ options }) => { options.inputsSha256 = "0".repeat(64); }, /mismatch/],
  ["missing artifact", ({ options }) => { options.tarball += ".absent"; }, /ENOENT/],
  ["hard-linked artifact", ({ f, options }) => fs.linkSync(options.tarball, f.resolve("alias.tgz")), /independent regular/],
]) {
  test(`retained admission refuses ${name}`, t => {
    const context = seeded(t); mutate(context);
    assert.throws(() => candidate.admitRetainedCandidate(context.f.root, context.options), pattern);
  });
}

test("retained manifest cannot replace source or payload evidence with a freshly hashed forgery", t => {
  const { f, options, inputs } = seeded(t);
  inputs.payload[0].sha256 = "0".repeat(64);
  put(f.root, "inputs.json", JSON.stringify(inputs)); options.inputsSha256 = hash(fs.readFileSync(options.inputs));
  assert.throws(() => candidate.admitRetainedCandidate(f.root, options), /payload identity/);
  inputs.package_inputs.files[0].path = "../outside";
  put(f.root, "inputs.json", JSON.stringify(inputs)); options.inputsSha256 = hash(fs.readFileSync(options.inputs));
  assert.throws(() => candidate.admitRetainedCandidate(f.root, options), /package-input/);
});

test("partial retained options refuse rather than silently packing a replacement", () => {
  assert.equal(candidate.retainedOptions({}), null);
  assert.throws(() => candidate.retainedOptions({ MDKG_RELEASE_TARBALL: "file" }), /explicit tarball/);
  assert.throws(() => candidate.retainedOptions({ MDKG_RELEASE_TARBALL: "file", MDKG_RELEASE_TARBALL_SHA256: "bad",
    MDKG_RELEASE_INPUTS: "inputs", MDKG_RELEASE_INPUTS_SHA256: "0".repeat(64) }), /both SHA/);
});

for (const key of ["tarball", "inputs"]) {
  test(`retained ${key} cannot reside in mutable build output`, t => {
    const { f, options } = seeded(t), original = options[key];
    const target = f.resolve("dist/" + path.basename(original));
    fs.copyFileSync(original, target); options[key] = target;
    const bytes = fs.readFileSync(target);
    assert.throws(() => candidate.admitRetainedCandidate(f.root, options, { verifyBuild: false }), /mutable build output/);
    assert.deepEqual(fs.readFileSync(target), bytes);
  });
  test(`retained ${key} refuses filesystem-equivalent build-output spellings`, t => {
    const { f, options } = seeded(t), original = options[key];
    const target = f.resolve("dist/" + path.basename(original));
    fs.copyFileSync(original, target);
    const alias = f.resolve("DIST/" + path.basename(original));
    if (fs.existsSync(alias)) {
      assert.equal(fs.statSync(alias).ino, fs.statSync(target).ino);
      options[key] = alias;
      assert.throws(() => candidate.admitRetainedCandidate(f.root, options, { verifyBuild: false }), /mutable build output/);
      t.diagnostic("case-insensitive filesystem alias refused by ancestor identity");
    } else {
      // On a case-sensitive filesystem this spelling is not an alias. Prove
      // the missing path refuses, rather than claiming an alias was tested.
      options[key] = alias;
      assert.throws(() => candidate.admitRetainedCandidate(f.root, options, { verifyBuild: false }), /ENOENT/);
      t.diagnostic("case-sensitive filesystem: alternate spelling does not exist");
    }
    assert.deepEqual(fs.readFileSync(target), fs.readFileSync(original));
  });
  test(`retained ${key} same-byte replacement fails pinned admission`, t => {
    const { f, options } = seeded(t), previous = candidate.admitRetainedCandidate(f.root, options);
    const target = options[key], bytes = fs.readFileSync(target);
    fs.renameSync(target, target + ".original");
    fs.writeFileSync(target, bytes);
    assert.throws(() => candidate.admitRetainedCandidate(f.root, options, { previous }), /identity changed or was replaced/);
  });
}

test("harness-only edits change qualification identity without changing package input identity", t => {
  const { f, options } = seeded(t);
  put(f.root, "tests/example.mjs", "fixture test\n"); put(f.root, "tsconfig.test.json", "{}\n");
  put(f.root, ".github/workflows/release-readiness.yml", "fixture workflow\n");
  const before = candidate.captureQualificationInputs(f.root);
  put(f.root, "scripts/new-qualification-helper.js", "new harness behavior\n");
  assert.notEqual(candidate.captureQualificationInputs(f.root).sha256, before.sha256);
  assert.equal(candidate.admitRetainedCandidate(f.root, options).repacked, false);
});

for (const replace of [false, true]) {
  test(`actual runner retained branch uses37 package gates without packing (replacement=${replace})`, t => {
    const { f, options } = seeded(t), output = owned(t);
    fs.cpSync(path.join(repo, "scripts"), f.resolve("scripts"), { recursive: true });
    const pkg = JSON.parse(fs.readFileSync(f.resolve("package.json"), "utf8"));
    pkg.scripts = require("../package.json").scripts;
    pkg.engines = require("../package.json").engines;
    put(f.root, "package.json", JSON.stringify(pkg));
    put(f.root, "tests/mechanical-control.mjs", "// This fixture does not execute qualification gates.\n");
    put(f.root, "tsconfig.test.json", "{}\n");
    put(f.root, ".github/workflows/release-readiness.yml", "synthetic control\n");
    const selected = ".mdkg/work/goal-73-make-the-docs-current-release-supplement-version-driven.md";
    put(f.root, selected, "synthetic selected goal\n");
    put(f.root, "docs/package-lock.json", "{}\n"); put(f.root, "mdkg-dev/package-lock.json", "{}\n");
    const archive = tar(candidate.builtPayload(f.root).map(p => ({ name: "package/" + p.path, bytes: fs.readFileSync(f.resolve(p.path)) })));
    fs.chmodSync(options.tarball, 0o644); fs.writeFileSync(options.tarball, archive);
    options.sha256 = hash(archive);
    const inputs = candidate.candidateInputs(f.root, options.tarball, options.sha256);
    fs.writeFileSync(options.inputs, JSON.stringify(inputs)); options.inputsSha256 = hash(fs.readFileSync(options.inputs));
    // Only this test child intercepts external gates. The production runner,
    // artifact admission, Git bookends and receipt assembly execute unchanged.
    const preload = put(f.root, "mechanical-control.cjs", `
      const cp=require('node:child_process'),fs=require('node:fs'),path=require('node:path');
      const original=cp.spawnSync, manifest=require('./scripts/smoke-manifest.json');
      cp.spawnSync=(command,args,opts={})=>{
        if(command==='git') { if(opts.env?.GIT_OPTIONAL_LOCKS!=='0') throw Error('optional Git locks not suppressed'); return original(command,args,opts); }
        if(command==='which') return {status:0,stdout:'/synthetic/'+args[0]+'.js\\n',stderr:''};
        if(opts.env?.MDKG_RELEASE_SCOPE!=='package') throw Error('package scope lost');
        if(args.includes('pack') || args.some(a=>a.includes('mdkg-dev'))) throw Error('unexpected pack or website gate');
        if(args.includes('test:coverage')) {
          fs.mkdirSync(opts.env.MDKG_COVERAGE_DIR,{recursive:true});
          fs.writeFileSync(path.join(opts.env.MDKG_COVERAGE_DIR,'summary.json'),JSON.stringify({ok:true,thresholds:{lines:89,branches:77,functions:96},synthetic_control:true}));
          if(${replace}) { const file=process.env.MDKG_RELEASE_TARBALL; fs.renameSync(file,file+'.original');fs.copyFileSync(file+'.original',file); }
        }
        if(opts.env.MDKG_SMOKE_ID) {
          const entry=manifest.aliases.find(e=>e.canonical===opts.env.MDKG_SMOKE_ID);
          if(entry.prerequisites.includes('site_profile_cache')) throw Error('website selected');
          fs.appendFileSync(path.join(opts.env.MDKG_BUILD_RECEIPT_DIR,'artifact-usages.jsonl'),JSON.stringify({smoke:entry.canonical,sha256:opts.env.MDKG_SMOKE_TARBALL_SHA256})+'\\n');
        }
        return {status:0,stdout:'synthetic gate control only\\n',stderr:''};
      };
    `);
    const git = acceptOwnedGitFixture(f.root);
    git.run(f.root, ["init", "-q"]);
    git.run(f.root, ["add", "package-lock.json", "docs/package-lock.json", "mdkg-dev/package-lock.json", selected]);
    assert.equal(git.run(f.root, ["commit", "-qm", "synthetic boundary"]).status, 0);
    git.run(f.root, ["add", "README.md"]);
    const index = fs.readFileSync(f.resolve(".git/index")), ino = fs.statSync(options.tarball).ino;
    const result = f.runNode(["--require", preload, f.resolve("scripts/release-ladder.js"), "prepublish"], {
      env: { ...process.env, npm_execpath: "/synthetic/npm.js", MDKG_RELEASE_SCOPE: "package",
        MDKG_RELEASE_RECEIPT_DIR: output.root, MDKG_RELEASE_TARBALL: options.tarball,
        MDKG_RELEASE_TARBALL_SHA256: options.sha256, MDKG_RELEASE_INPUTS: options.inputs,
        MDKG_RELEASE_INPUTS_SHA256: options.inputsSha256 }, maxBuffer: 4 * 1024 * 1024,
    });
    const run = fs.readdirSync(output.root).find(name => name.startsWith("run-"));
    const receipt = JSON.parse(fs.readFileSync(path.join(output.root, run, "receipt.json"), "utf8"));
    assert.deepEqual(fs.readFileSync(f.resolve(".git/index")), index);
    assert.equal(fs.existsSync(f.resolve("docs/node_modules")), false);
    assert.equal(fs.existsSync(f.resolve("mdkg-dev/node_modules")), false);
    if (replace) {
      assert.equal(result.status, 1); assert.match(receipt.error, /identity changed or was replaced/);
      assert.equal(receipt.progress.smokes.length, 0);
    } else {
      assert.equal(result.status, 0, result.stderr + result.stdout); assert.equal(receipt.ok, true);
      assert.equal(receipt.canonical_execution_count, 37); assert.equal(receipt.smokes.length, 37);
      assert.equal(receipt.gates.some(g => g.id === "package-artifact"), false);
      assert.equal(receipt.artifact.retained_admission.repacked, false);
      assert.equal(receipt.git_boundary.ok, true); assert.equal(fs.statSync(options.tarball).ino, ino);
      assert.equal(receipt.qualification_inputs.files.some(file => file.path === "scripts/retained-release-candidate.js"), true);
    }
  });
}

for (const [name, entries, pattern] of [
  ["traversal", [{ name: "package/../outside", bytes: "unsafe" }], /relative path/],
  ["symlink", [{ name: "package/link", bytes: "", type: "2" }], /regular USTAR/],
  ["duplicate", [{ name: "package/x", bytes: "one" }, { name: "package/x", bytes: "two" }], /duplicate/],
]) {
  test(`read-only archive comparison refuses ${name}`, t => {
    const f = owned(t), bytes = tar(entries), file = put(f.root, "bad.tgz", bytes);
    assert.throws(() => candidate.archivePayload(file, hash(bytes)), pattern);
    assert.equal(fs.existsSync(f.resolve("outside")), false);
  });
}
