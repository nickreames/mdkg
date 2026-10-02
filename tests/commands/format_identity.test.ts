import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import { makeTempDir, writeFile } from "../helpers/fs";
import { writeRootConfig } from "../helpers/config";
import { writeDefaultTemplates } from "../helpers/templates";
const { createGraphFormat, identityRef } = require("../../graph/identity");
const { parseFrontmatter } = require("../../graph/frontmatter");
const cli = path.resolve(__dirname, "../../cli.js");

function run(root: string, args: string[]) {
  return spawnSync(process.execPath, [cli, ...args], { cwd: root, encoding: "utf8" });
}
function success(root: string, args: string[]) {
  const result = run(root, args);
  assert.equal(result.status, 0, `${args.join(" ")}\n${result.stdout}\n${result.stderr}`);
  return result.stdout;
}
function snapshot(root: string): Record<string, string> {
  const result: Record<string, string> = {};
  const visit = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) visit(file);
      else result[path.relative(root, file)] = crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
    }
  };
  visit(root); return result;
}
function fixture(t: { after(fn: () => void): void }, version = 2) {
  const root = makeTempDir("mdkg-format-identity-");
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  writeRootConfig(root); writeDefaultTemplates(root);
  writeFile(path.join(root, ".mdkg/core/core.md"), "# Core\n");
  if (version === 2) writeFile(path.join(root, ".mdkg/graph.json"), JSON.stringify(createGraphFormat()));
  const add = (title: string) => JSON.parse(success(root, ["new", "task", title, "--json"])).node;
  const first = add("First"), second = add("Second");
  const file = path.join(root, second.path);
  const parsed = () => parseFrontmatter(fs.readFileSync(file, "utf8"), file);
  const edit = (before: string, after: string) => {
    const content = fs.readFileSync(file, "utf8"); assert.ok(content.includes(before), before);
    writeFile(file, content.replace(before, after));
  };
  success(root, ["index"]);
  for (const args of [["init", "-q"], ["add", "--", ".mdkg/work"]]) {
    const r = spawnSync("git", args, { cwd: root, encoding: "utf8" }); assert.equal(r.status, 0, r.stderr);
  }
  writeFile(path.join(root, "user-notes.txt"), "Keep these unrelated bytes.\n");
  return { root, first, second, file, parsed, edit };
}

test("v2 format preserves identities, stable relation values, custom fields and Git staging", t => {
  const f = fixture(t);
  const source = parseFrontmatter(fs.readFileSync(path.join(f.root, f.first.path), "utf8"), f.first.path).frontmatter;
  const ref = identityRef({ graph_id: source.graph_id, node_id: source.node_id });
  const template = path.join(f.root, ".mdkg/templates/default/task.md");
  // A project-owned extension is valid schema input, not formatter authority
  // to synthesize or reinterpret identity.
  writeFile(template, fs.readFileSync(template, "utf8").replace("refs: []", "scope: []\ncustom_label: MiXeD Context\nrequest_ref: Opaque\nrefs: []"));
  f.edit("refs: []", `scope: [${ref}]\ncustom_label: MiXeD Context\nrequest_ref: mdkg://OpaqueConsumerPolicy\nrefs: [${ref}]`);
  for (const field of ["relates", "blocked_by", "blocks", "context_refs", "evidence_refs"]) f.edit(`${field}: []`, `${field}: [${ref}]`);
  f.edit("title: Second\n", "title: Second\n" + ["epic", "parent", "prev", "next"].map(field => `${field}: ${ref}\n`).join(""));
  f.edit("tags: []", "tags: [Z, a]");
  const before = f.parsed().frontmatter, staged = fs.readFileSync(path.join(f.root, ".git/index"));
  success(f.root, ["format"]);
  const after = f.parsed().frontmatter;
  for (const key of ["graph_id", "node_id", "scope", "custom_label", "request_ref", "refs", "relates", "blocked_by", "blocks", "context_refs", "evidence_refs", "epic", "parent", "prev", "next"]) {
    assert.deepEqual(after[key], before[key], key);
  }
  assert.deepEqual(after.tags, ["a", "z"]);
  assert.deepEqual(fs.readFileSync(path.join(f.root, ".git/index")), staged);
  const formatted = snapshot(f.root);
  assert.match(success(f.root, ["format"]), /updated 0 file/);
  assert.deepEqual(snapshot(f.root), formatted);
});

test("v2 decision supersession retains stable references through repeated formatting", t => {
  const f = fixture(t);
  const first = JSON.parse(success(f.root, ["new", "dec", "Original decision", "--json"])).node;
  const second = JSON.parse(success(f.root, ["new", "dec", "Successor decision", "--json"])).node;
  const source = parseFrontmatter(fs.readFileSync(path.join(f.root, first.path), "utf8"), first.path).frontmatter;
  const ref = identityRef({ graph_id: source.graph_id, node_id: source.node_id });
  const file = path.join(f.root, second.path);
  writeFile(file, fs.readFileSync(file, "utf8").replace("title: Successor decision", `title: Successor decision\nsupersedes: ${ref}`));
  success(f.root, ["validate", "--json"]);
  success(f.root, ["format"]);
  assert.equal(parseFrontmatter(fs.readFileSync(file, "utf8"), file).frontmatter.supersedes, ref);
  success(f.root, ["validate", "--json"]);
  const before = snapshot(f.root);
  success(f.root, ["format"]);
  assert.deepEqual(snapshot(f.root), before);
});

test("v2 heading preview and apply preserve exact identity frontmatter", t => {
  const f = fixture(t), before = snapshot(f.root), frontmatter = f.parsed().frontmatter;
  success(f.root, ["format", "--headings", "--dry-run", "--json"]);
  assert.deepEqual(snapshot(f.root), before);
  success(f.root, ["format", "--headings", "--apply", "--json"]);
  assert.deepEqual(f.parsed().frontmatter, frontmatter);
  const after = snapshot(f.root);
  success(f.root, ["format", "--headings", "--apply", "--json"]);
  assert.deepEqual(snapshot(f.root), after);
});

for (const eol of ["\n", "\r\n"]) test(`heading format preserves exact header with scalar dashes and spaced fences ${JSON.stringify(eol)}`, t => {
  const f = fixture(t);
  const original = fs.readFileSync(f.file, "utf8");
  const header = original.slice(0, original.indexOf("\n---\n") + 5)
    .replace("title: Second", "title: a---b").replace(/\n---\n$/, "\n --- \n").replace(/\n/g, eol);
  const body = `Evidence before rule${eol}---${eol}Evidence suffix${eol}`;
  writeFile(f.file, header + body);
  const before = snapshot(f.root), fields = f.parsed().frontmatter;
  success(f.root, ["format", "--headings", "--dry-run", "--json"]);
  assert.deepEqual(snapshot(f.root), before);
  success(f.root, ["format", "--headings", "--apply", "--json"]);
  const formatted = fs.readFileSync(f.file, "utf8");
  assert.ok(formatted.startsWith(header));
  assert.deepEqual(f.parsed().frontmatter, fields);
  assert.match(f.parsed().body, /Evidence before rule\n---\nEvidence suffix/);
  success(f.root, ["format", "--headings", "--apply", "--json"]);
  assert.equal(fs.readFileSync(f.file, "utf8"), formatted);
});

const invalid: Record<string, (f: ReturnType<typeof fixture>) => void> = {
  "missing identity": f => { f.edit(`graph_id: ${f.parsed().frontmatter.graph_id}\n`, ""); f.edit(`node_id: ${f.parsed().frontmatter.node_id}\n`, ""); },
  "partial identity": f => f.edit(`node_id: ${f.parsed().frontmatter.node_id}\n`, ""),
  "foreign graph": f => f.edit(`graph_id: ${f.parsed().frontmatter.graph_id}`, `graph_id: ${createGraphFormat().graph_id}`),
  "malformed UUID": f => f.edit(`node_id: ${f.parsed().frontmatter.node_id}`, "node_id: not-a-uuid"),
  "uppercase identity": f => f.edit(`node_id: ${f.parsed().frontmatter.node_id}`, "node_id: E7403372-F270-4CD7-902D-64B792C781DF"),
  "malformed stable scalar": f => f.edit("refs: []", "parent: mdkg://broken\nrefs: []"),
  "malformed stable list": f => f.edit("context_refs: []", "context_refs: [mdkg://broken]"),
  "uppercase stable reference": f => f.edit("refs: []", `parent: ${identityRef({ graph_id: f.parsed().frontmatter.graph_id, node_id: f.parsed().frontmatter.node_id }).toUpperCase()}\nrefs: []`),
  "conflict markers": f => writeFile(f.file, `${fs.readFileSync(f.file, "utf8")}\n<<<<<<< ours\n# Ours\n=======\n# Theirs\n>>>>>>> theirs\n`),
  "unknown format": f => {
    const file = path.join(f.root, ".mdkg/graph.json"), format = JSON.parse(fs.readFileSync(file, "utf8"));
    format.format_version = 99; writeFile(file, JSON.stringify(format));
  },
};
for (const [name, damage] of Object.entries(invalid)) for (const headings of [false, true]) {
  test(`${headings ? "headings" : "normal"} format refuses ${name} before touching any authored or staged file`, t => {
    const f = fixture(t); damage(f);
    // Another file is eligible for formatting: no partial successful write is allowed.
    const first = path.join(f.root, f.first.path);
    writeFile(first, fs.readFileSync(first, "utf8").replace("tags: []", "tags: [Z, a]"));
    const before = snapshot(f.root);
    const result = run(f.root, headings ? ["format", "--headings", "--apply"] : ["format"]);
    assert.notEqual(result.status, 0, `${name} unexpectedly accepted`);
    assert.deepEqual(snapshot(f.root), before);
  });
}

test("legacy formatting does not invent identities and rejects accidental identity adoption", t => {
  const f = fixture(t, 1);
  const template = path.join(f.root, ".mdkg/templates/default/task.md");
  writeFile(template, fs.readFileSync(template, "utf8").replace("refs: []", "graph_id: []\nnode_id: []\nrefs: []"));
  success(f.root, ["format"]);
  assert.equal(f.parsed().frontmatter.graph_id, undefined);
  assert.equal(f.parsed().frontmatter.node_id, undefined);
  const graph = createGraphFormat();
  f.edit("id: task-2", `id: task-2\ngraph_id: ${graph.graph_id}\nnode_id: ${graph.graph_id}`);
  const before = snapshot(f.root);
  for (const args of [["format"], ["format", "--headings", "--apply"]]) {
    assert.notEqual(run(f.root, args).status, 0);
    assert.deepEqual(snapshot(f.root), before);
  }
});
