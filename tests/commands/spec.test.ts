import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import { spawnSync } from "node:child_process";
import { makeTempDir } from "../helpers/fs";

const cliPath = path.resolve(__dirname, "..", "..", "cli.js");

function run(args: string[], cwd: string): { stdout: string; stderr: string } {
  const result = spawnSync(process.execPath, [cliPath, ...args], {
    cwd,
    encoding: "utf8",
  });
  assert.equal(result.status, 0, `${args.join(" ")}\n${result.stderr}\n${result.stdout}`);
  return { stdout: result.stdout.trim(), stderr: result.stderr.trim() };
}

function runFailure(args: string[], cwd: string): { stdout: string; stderr: string; status: number | null } {
  const result = spawnSync(process.execPath, [cliPath, ...args], {
    cwd,
    encoding: "utf8",
  });
  assert.notEqual(result.status, 0, `${args.join(" ")} unexpectedly succeeded`);
  return { stdout: result.stdout.trim(), stderr: result.stderr.trim(), status: result.status };
}

function upsertFrontmatter(filePath: string, replacements: Record<string, string>): void {
  const content = fs.readFileSync(filePath, "utf8");
  const next = content.replace(/^---\n([\s\S]*?)\n---/, (_match, rawFrontmatter) => {
    const seen = new Set<string>();
    const lines = rawFrontmatter.split(/\r?\n/).map((line: string) => {
      for (const [key, value] of Object.entries(replacements)) {
        if (line.startsWith(`${key}:`)) {
          seen.add(key);
          return `${key}: ${value}`;
        }
      }
      return line;
    });
    for (const [key, value] of Object.entries(replacements)) {
      if (!seen.has(key)) {
        lines.push(`${key}: ${value}`);
      }
    }
    return `---\n${lines.join("\n")}\n---`;
  });
  fs.writeFileSync(filePath, next, "utf8");
}

test("spec command lists shows and validates optional SPEC capability records", () => {
  const root = makeTempDir("mdkg-spec-cli-");
  run(["init", "--agent"], root);
  const spec = JSON.parse(
    run(["new", "spec", "Capability Worker", "--id", "agent.capability-worker", "--json"], root)
      .stdout
  ).node;
  upsertFrontmatter(path.join(root, spec.path), {
    spec_kind: "cli_tool",
    requested_capabilities: "[capability.routing]",
    aliases: "[capability-worker-spec]",
  });

  const indexOutput = run(["index"], root).stdout;
  assert.match(indexOutput, /capabilities index written/);

  const list = JSON.parse(run(["spec", "list", "--json"], root).stdout);
  assert.equal(list.kind, "spec");
  assert.equal(list.canonical_kind, "manifest");
  assert.equal(list.legacy_alias, true);
  assert.match(list.deprecation, /legacy alias for mdkg manifest/);
  assert.equal(list.count, 1);
  assert.equal(list.items[0].id, "agent.capability-worker");
  assert.equal(list.items[0].spec.spec_kind, "cli_tool");
  assert.equal(list.items[0].manifest.semantic_kind, "manifest");
  assert.equal(list.items[0].manifest.compatibility_mode, "legacy");

  const shown = JSON.parse(run(["spec", "show", "capability-worker-spec", "--json"], root).stdout);
  assert.equal(shown.kind, "spec");
  assert.equal(shown.canonical_kind, "manifest");
  assert.equal(shown.legacy_alias, true);
  assert.equal(shown.item.id, "agent.capability-worker");
  assert.deepEqual(shown.item.spec.requested_capabilities, ["capability.routing"]);

  const validation = JSON.parse(run(["spec", "validate", "agent.capability-worker", "--json"], root).stdout);
  assert.equal(validation.action, "validated");
  assert.equal(validation.ok, true);
  assert.equal(validation.error_count, 0);
});

test("manifest command lists shows and validates canonical manifest records", () => {
  const root = makeTempDir("mdkg-manifest-cli-");
  run(["init", "--agent"], root);
  const manifest = JSON.parse(
    run(["new", "manifest", "Manifest Worker", "--id", "agent.manifest-worker", "--json"], root)
      .stdout
  ).node;
  upsertFrontmatter(path.join(root, manifest.path), {
    spec_kind: "agent",
    requested_capabilities: "[capability.manifest]",
    aliases: "[manifest-worker]",
  });

  run(["index"], root);

  const list = JSON.parse(run(["manifest", "list", "--json"], root).stdout);
  assert.equal(list.kind, "manifest");
  assert.equal(list.compatibility_kind, "spec");
  assert.equal(list.count, 1);
  assert.equal(list.items[0].kind, "spec");
  assert.equal(list.items[0].id, "agent.manifest-worker");
  assert.equal(list.items[0].manifest.compatibility_mode, "canonical");
  assert.equal(list.items[0].manifest.source_basename, "MANIFEST.md");

  const shown = JSON.parse(run(["manifest", "show", "manifest-worker", "--json"], root).stdout);
  assert.equal(shown.kind, "manifest");
  assert.equal(shown.compatibility_kind, "spec");
  assert.equal(shown.item.id, "agent.manifest-worker");
  assert.deepEqual(shown.item.spec.requested_capabilities, ["capability.manifest"]);

  const validation = JSON.parse(run(["manifest", "validate", "agent.manifest-worker", "--json"], root).stdout);
  assert.equal(validation.action, "validated");
  assert.equal(validation.ok, true);
  assert.equal(validation.error_count, 0);
});

test("spec command help explains optional reusable capability semantics", () => {
  const root = makeTempDir("mdkg-spec-help-");
  run(["init", "--agent"], root);

  const manifestHelp = run(["help", "manifest"], root).stdout;
  assert.match(manifestHelp, /mdkg manifest list \[--json\]/);
  assert.match(manifestHelp, /mdkg manifest show <id-or-qid-or-alias> \[--json\]/);
  assert.match(manifestHelp, /mdkg manifest validate \[<id-or-qid-or-alias>\] \[--json\]/);
  assert.match(manifestHelp, /MANIFEST\.md is canonical and reusable-capability oriented; SPEC\.md remains a legacy alias/);

  const help = run(["help", "spec"], root).stdout;
  assert.match(help, /mdkg spec list \[--json\]/);
  assert.match(help, /mdkg spec show <id-or-qid-or-alias> \[--json\]/);
  assert.match(help, /mdkg spec validate \[<id-or-qid-or-alias>\] \[--json\]/);
  assert.match(help, /MANIFEST\.md is canonical and reusable-capability oriented; SPEC\.md remains a legacy alias/);
  assert.match(help, /`mdkg spec` is the legacy alias for `mdkg manifest`/);

  const validateHelp = run(["help", "spec", "validate"], root).stdout;
  assert.match(validateHelp, /With no reference, validates the graph and all MANIFEST\.md\/SPEC\.md capability records/);
  assert.match(validateHelp, /With a reference, also ensures that the specific manifest capability exists/);
});

test("spec show rejects missing SPEC references", () => {
  const root = makeTempDir("mdkg-spec-cli-missing-");
  run(["init", "--agent"], root);
  run(["index"], root);

  const failure = runFailure(["spec", "show", "missing-spec", "--json"], root);
  assert.match(failure.stderr, /SPEC not found: missing-spec/);
});
