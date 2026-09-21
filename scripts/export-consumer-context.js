#!/usr/bin/env node
// Source-only extraction evidence. Never execute the exported implementation.
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const cp = require("node:child_process");
const ts = require("typescript");
const root = path.resolve(__dirname, "..");
const destination = path.join(root, ".mdkg/artifacts/goal-84/consumer-extraction");
const hash = bytes => crypto.createHash("sha256").update(bytes).digest("hex");
const git = args => cp.execFileSync("git", args, { cwd: root, encoding: "utf8", env: { ...process.env, GIT_OPTIONAL_LOCKS: "0" } }).trim();
const primary = ["src/commands/git.ts", "src/commands/git_materialize.ts", "src/commands/validate.ts", "src/commands/work.ts", "src/commands/skill.ts", "src/commands/pack.ts", "src/commands/query_output.ts", "src/graph/skills_indexer.ts", "src/graph/agent_file_types.ts", "src/core/public_skill_projection.ts"];
const evidence = ["src/cli.ts", "LICENSE", "package.json", "tsconfig.build.json", "tsconfig.test.json", "scripts/smoke-git-materialize.js", "scripts/smoke-manifest.json", "scripts/assert-publish-ready.js", "tests/commands/git.test.ts", "tests/commands/git_materialize.test.ts", "tests/commands/agent_file_types.test.ts", "tests/commands/archive_work.test.ts", "tests/commands/skills.test.ts", "tests/graph/skills_indexer.test.ts", ".mdkg/templates/default/work.md", ".mdkg/work/mdkg-cli/validate/WORK.md"];
function read(relative) {
  if (path.isAbsolute(relative) || relative.split(/[\\/]/).includes("..")) throw Error(`invalid source path: ${relative}`);
  const file = path.join(root, relative);
  let current = root;
  for (const component of relative.split("/")) {
    current = path.join(current, component);
    if (fs.lstatSync(current).isSymbolicLink()) throw Error(`linked source refused: ${relative}`);
  }
  if (!fs.lstatSync(file).isFile()) throw Error(`non-file source: ${relative}`);
  return fs.readFileSync(file);
}
function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(directory, entry.name);
    if (entry.isSymbolicLink()) throw Error(`linked evidence refused: ${file}`);
    return entry.isDirectory() ? walk(file) : [file];
  });
}
function scan(bytes, label) {
  const text = bytes.toString("utf8");
  if (/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|\bgh[pousr]_[A-Za-z0-9]{30,}|\bAKIA[A-Z0-9]{16}\b/.test(text)) throw Error(`credential-shaped source requires review: ${label}`);
}
function verify() {
  const manifestPath = path.join(destination, "manifest.json");
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const expected = new Set(["manifest.json", ...manifest.files.map(file => file.export_path)]);
  for (const file of walk(destination)) {
    const relative = path.relative(destination, file).split(path.sep).join("/");
    if (!expected.has(relative)) throw Error(`unexpected export file: ${relative}`);
  }
  for (const entry of manifest.files) {
    if (path.isAbsolute(entry.export_path) || entry.export_path.split(/[\\/]/).includes("..")) throw Error("unsafe export manifest path");
    const bytes = fs.readFileSync(path.join(destination, entry.export_path));
    if (hash(bytes) !== entry.sha256 || bytes.length !== entry.bytes) throw Error(`export mismatch: ${entry.export_path}`);
    scan(bytes, entry.export_path);
  }
  const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
  if (pkg.files.some(file => file.startsWith(".mdkg") || file === "*" || file === "**")) throw Error("package allowlist could include local export");
  console.log(JSON.stringify({ ok: true, files: manifest.files.length, manifest_sha256: hash(fs.readFileSync(manifestPath)), source_revision: manifest.source_revision, status: manifest.status, payloads_executed: false }));
}
if (process.argv[2] === "--seal-context") {
  const file = path.join(destination, "manifest.json");
  const manifest = JSON.parse(fs.readFileSync(file, "utf8"));
  if (manifest.files.some(entry => entry.role === "consumer-handoff")) throw Error("context already sealed; do not overwrite");
  for (const name of ["context.md", "handoff.md"]) {
    const bytes = read(path.relative(root, path.join(destination, name)).split(path.sep).join("/"));
    scan(bytes, name);
    manifest.files.push({ export_path: name, role: "consumer-handoff", bytes: bytes.length, sha256: hash(bytes) });
  }
  fs.writeFileSync(file, JSON.stringify(manifest, null, 2) + "\n");
  verify(); process.exit(0);
}
if (process.argv[2] === "--verify") { verify(); process.exit(0); }
if (process.argv[2] !== "--create") throw Error("use --create once or --verify; no implicit export mutation");
if (fs.existsSync(destination)) throw Error("export already exists; preserve it and verify instead of overwriting");
const revision = git(["rev-parse", "HEAD"]);
const selected = new Map(primary.map(file => [file, "primary-removal-or-refactor-source"]));
const queue = [...primary];
while (queue.length) {
  const file = queue.shift();
  const source = ts.createSourceFile(file, read(file).toString("utf8"), ts.ScriptTarget.Latest, true);
  for (const statement of source.statements) {
    if (!(ts.isImportDeclaration(statement) || ts.isExportDeclaration(statement)) || !statement.moduleSpecifier || !ts.isStringLiteral(statement.moduleSpecifier)) continue;
    const specifier = statement.moduleSpecifier.text;
    if (!specifier.startsWith(".")) continue;
    const base = path.posix.normalize(path.posix.join(path.posix.dirname(file), specifier));
    const dependency = [base + ".ts", base + "/index.ts"].find(candidate => fs.existsSync(path.join(root, candidate)));
    if (!dependency) throw Error(`unresolved local import: ${file} -> ${specifier}`);
    if (!selected.has(dependency)) { selected.set(dependency, "transitive-source-dependency"); queue.push(dependency); }
  }
}
for (const file of evidence) if (!selected.has(file)) selected.set(file, "integration-or-test-evidence");
for (const file of walk(path.join(root, "tests/fixtures/agent"))) selected.set(path.relative(root, file).split(path.sep).join("/"), "synthetic-agent-fixture");
const snapshot = [...selected].sort(([a], [b]) => a.localeCompare(b)).map(([file, role]) => {
  const bytes = read(file); scan(bytes, file);
  const committed = cp.spawnSync("git", ["show", `${revision}:${file}`], { cwd: root, env: { ...process.env, GIT_OPTIONAL_LOCKS: "0" } });
  return { source_path: file, export_path: `source/${file}`, role, bytes: bytes.length, sha256: hash(bytes), committed_sha256: committed.status === 0 ? hash(committed.stdout) : null, content: bytes };
});
if (git(["rev-parse", "HEAD"]) !== revision || snapshot.some(entry => hash(read(entry.source_path)) !== entry.sha256)) throw Error("source moved during capture");
fs.mkdirSync(destination, { recursive: true });
for (const entry of snapshot) { const target = path.join(destination, entry.export_path); fs.mkdirSync(path.dirname(target), { recursive: true }); fs.writeFileSync(target, entry.content, { flag: "wx" }); }
const manifest = { schema: "mdkg.consumer-extraction.source.v1", status: "LOCAL / UNDISPATCHED / CONSUMER ADOPTION UNVERIFIED", source_revision: revision, source_license: "MIT; see source/LICENSE", purpose: "Source evidence for consumer-owned policy and native Git integration; not an installable runtime", runnable: false, files: snapshot.map(({ content, ...entry }) => entry), coverage: { dependency_closure: "Static relative TS import/export closure of primary modules; CLI and tests are integration evidence, not a standalone build", exclusions: ["Git objects and history", "runtime databases", "bundles", "credentials", "raw scan output", "operational records"] } };
fs.writeFileSync(path.join(destination, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n", { flag: "wx" });
verify();
