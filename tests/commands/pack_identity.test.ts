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
const { handleMcpRequest } = require("../../commands/mcp");
const cli = path.resolve(__dirname, "../../cli.js");

function run(root: string, args: string[]) {
  const result = spawnSync(process.execPath, [cli, ...args], { cwd: root, encoding: "utf8" });
  assert.equal(result.status, 0, `${args.join(" ")}\n${result.stdout}\n${result.stderr}`);
  return result.stdout;
}

function configure(root: string, edit: (config: any) => void) {
  const file = path.join(root, ".mdkg/config.json");
  const config = JSON.parse(fs.readFileSync(file, "utf8"));
  edit(config); writeFile(file, JSON.stringify(config));
}

function setup(root: string, backend: string, version = 2) {
  writeRootConfig(root); writeDefaultTemplates(root);
  configure(root, config => { config.index.backend = backend; });
  writeFile(path.join(root, ".mdkg/core/core.md"), "# Core\n");
  if (version === 2) writeFile(path.join(root, ".mdkg/graph.json"), JSON.stringify(createGraphFormat()));
  fs.mkdirSync(path.join(root, "exports"));
}

function add(root: string, title: string, parent?: string) {
  const node = JSON.parse(run(root, ["new", "task", title,
    ...(parent ? ["--parent", parent, "--refs", parent] : []), "--json"])).node;
  const content = fs.readFileSync(path.join(root, node.path), "utf8");
  const graph = /^graph_id: (.+)$/m.exec(content), id = /^node_id: (.+)$/m.exec(content);
  return { ...node, identity: graph && id ? { graph_id: graph[1], node_id: id[1] } : undefined };
}

function snapshot(root: string) {
  const result: Record<string, string> = {};
  const visit = (directory: string) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name), relative = path.relative(root, file);
      if (relative === "exports") continue;
      if (entry.isDirectory()) visit(file);
      else result[relative] = crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
    }
  };
  visit(root); return result;
}

function checkExport(raw: string, format: string, nodes: any[], expectedRef?: string) {
  for (const node of nodes) {
    const stable = identityRef(node.identity);
    assert.ok(raw.includes(node.identity.graph_id), `${format}: missing graph identity`);
    assert.ok(raw.includes(node.identity.node_id), `${format}: missing node identity`);
    assert.ok(raw.includes(stable), `${format}: missing stable reference`);
    if (format === "json" || format === "toon") {
      const exported = JSON.parse(raw).nodes.find((item: any) => item.stable_ref === stable);
      assert.deepEqual(exported.identity, node.identity);
      assert.equal(exported.id, node.id);
      assert.equal(exported.qid, node.collision ? stable : `root:${node.id}`);
      assert.equal(exported.alias_qid, node.collision ? `root:${node.id}` : undefined);
      assert.equal(exported.source, undefined);
      if (expectedRef && node === nodes[0]) assert.ok(exported.frontmatter.refs.includes(expectedRef));
    }
  }
  if (expectedRef) assert.ok(raw.includes(expectedRef));
}

for (const backend of ["json", "sqlite"]) {
  for (const state of ["authored", "remapped", "colliding"]) {
    test(`${backend} ${state} CLI packs and MCP retain persisted identities without changing staged work`, t => {
      const root = makeTempDir("mdkg-pack-identity-");
      t.after(() => fs.rmSync(root, { recursive: true, force: true }));
      setup(root, backend);
      const first = add(root, "First"), second = add(root, "Linked", first.id);
      if (state !== "authored") {
        const original = path.join(root, first.path);
        const nextId = state === "remapped" ? "task-41" : second.id;
        const nextPath = first.path.replace(`${first.id}-`, `${nextId}-`);
        writeFile(original, fs.readFileSync(original, "utf8").replace(`id: ${first.id}\n`, `id: ${nextId}\n`));
        fs.renameSync(original, path.join(root, nextPath));
        first.id = nextId; first.path = nextPath;
        first.collision = second.collision = state === "colliding";
      }
      for (const args of [["init", "-q"], ["add", "--", ".mdkg/work"]]) {
        const result = spawnSync("git", args, { cwd: root, encoding: "utf8",
          env: { ...process.env, GIT_CONFIG_GLOBAL: "/dev/null", GIT_CONFIG_NOSYSTEM: "1" } });
        assert.equal(result.status, 0, result.stderr);
      }
      writeFile(path.join(root, second.path), `${fs.readFileSync(path.join(root, second.path), "utf8")}\nUnstaged intent.\n`);
      writeFile(path.join(root, "user-notes.txt"), "Unrelated user notes.\n");
      writeFile(path.join(root, ".mdkg/db/runtime/sentinel"), "Private runtime sentinel.\n");
      const before = snapshot(root);
      // Persisted edges bind identities. Inspection deliberately normalizes
      // unique targets to their current QID; the export must retain that QID
      // and its identity mapping, not change graph resolution semantics.
      assert.ok(fs.readFileSync(path.join(root, second.path), "utf8").includes(identityRef(first.identity)));
      const ref = first.collision ? identityRef(first.identity) : `root:${first.id}`;
      for (const profile of ["standard", "concise", "headers"]) {
        for (const format of ["json", "md", "xml", "toon"]) {
          const out = path.join(root, "exports", `${profile}.${format}`);
          run(root, ["pack", identityRef(second.identity), "--pack-profile", profile,
            "--skills", "none", "--format", format, "--out", out]);
          checkExport(fs.readFileSync(out, "utf8"), format, [second, first], ref);
          assert.deepEqual(snapshot(root), before);
        }
        const response = handleMcpRequest({ root }, { jsonrpc: "2.0", id: 1,
          method: "tools/call", params: { name: "mdkg_pack", arguments: { id: identityRef(second.identity), profile } } });
        assert.equal(response.error, undefined, JSON.stringify(response));
        const payload = response.result.structuredContent;
        for (const node of [second, first]) {
          const exported = payload.pack.nodes.find((item: any) => item.stable_ref === identityRef(node.identity));
          assert.deepEqual(exported.identity, node.identity);
          assert.equal(exported.alias_qid, node.collision ? `root:${node.id}` : undefined);
        }
        assert.ok(payload.pack.nodes[0].refs.includes(ref));
        assert.deepEqual(JSON.parse(response.result.content[0].text), JSON.parse(JSON.stringify(payload)));
        assert.deepEqual(snapshot(root), before);
      }
    });
  }

  test(`${backend} imported v2 packs retain identities and public visibility remains fail-closed`, t => {
    const root = makeTempDir("mdkg-pack-imported-identity-");
    t.after(() => fs.rmSync(root, { recursive: true, force: true }));
    setup(root, backend);
    const child = path.join(root, "child"); fs.mkdirSync(child); setup(child, backend);
    const node = add(child, "Private child");
    run(child, ["bundle", "create", "--profile", "private", "--json"]);
    configure(root, config => { config.subgraphs.child = { enabled: true, visibility: "private", sources: [
      { path: "child/.mdkg/bundles/private/all.mdkg.zip", enabled: true, expected_profile: "private" },
    ] }; });
    const before = snapshot(root);
    for (const format of ["json", "md", "xml", "toon"]) {
      const out = path.join(root, "exports", `child.${format}`);
      run(root, ["pack", `child:${node.id}`, "--pack-profile", "headers", "--skills", "none", "--format", format, "--out", out]);
      const raw = fs.readFileSync(out, "utf8");
      assert.ok(raw.includes(identityRef(node.identity)));
      if (format === "json" || format === "toon") {
        assert.deepEqual(JSON.parse(raw).nodes[0].identity, node.identity);
        assert.equal(JSON.parse(raw).nodes[0].qid, `child:${node.id}`);
        assert.equal(JSON.parse(raw).nodes[0].source, undefined);
      }
      const deniedPath = path.join(root, "exports", `denied.${format}`);
      const denied = spawnSync(process.execPath, [cli, "pack", `child:${node.id}`, "--visibility", "public",
        "--skills", "none", "--format", format, "--out", deniedPath], { cwd: root, encoding: "utf8" });
      assert.notEqual(denied.status, 0);
      assert.match(denied.stderr, /not visible at public/);
      assert.equal(fs.existsSync(deniedPath), false);
      assert.deepEqual(snapshot(root), before);
    }
  });

  test(`${backend} legacy pack output never invents stable identities`, t => {
    const root = makeTempDir("mdkg-pack-legacy-identity-");
    t.after(() => fs.rmSync(root, { recursive: true, force: true }));
    setup(root, backend, 1);
    const node = add(root, "Legacy");
    for (const format of ["json", "md", "xml", "toon"]) {
      const out = path.join(root, "exports", `legacy.${format}`);
      run(root, ["pack", node.id, "--pack-profile", "headers", "--skills", "none", "--format", format, "--out", out]);
      assert.doesNotMatch(fs.readFileSync(out, "utf8"), /graph_id|node_id|stable_ref|alias_qid/);
    }
  });
}
