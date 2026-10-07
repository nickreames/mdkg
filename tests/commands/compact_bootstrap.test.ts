import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
const { runInitCommand } = require("../../commands/init");
const { appendInstructions, instructionSection, replaceInstructions } = require("../../commands/bootstrap_instructions");
const { parseFrontmatter } = require("../../graph/frontmatter");
import { makeTempDir, writeFile } from "../helpers/fs";

test("default init is compact agent setup and preserves public and user documents", () => {
  const root = makeTempDir("mdkg-compact-default-");
  const user = "# User instructions\r\nKeep my rules.\r\n";
  writeFile(path.join(root, "AGENTS.md"), user);
  for (const name of ["README.md", "LICENSE", "llms.txt"]) writeFile(path.join(root, name), "user owned " + name);
  runInitCommand({ root });
  const wrapper = fs.readFileSync(path.join(root, "AGENTS.md"), "utf8");
  assert.ok(wrapper.startsWith(user));
  assert.ok(instructionSection(wrapper));
  assert.match(wrapper, /\.mdkg\/AGENT_START.md/);
  for (const name of ["AGENT_START.md", "CLI_COMMAND_MATRIX.md"]) {
    assert.equal(fs.existsSync(path.join(root, name)), false);
    assert.ok(fs.existsSync(path.join(root, ".mdkg", name)));
  }
  for (const name of ["README.md", "LICENSE", "llms.txt"]) assert.equal(fs.readFileSync(path.join(root, name), "utf8"), "user owned " + name);
  const router = fs.readFileSync(path.join(root, ".mdkg", "AGENT_START.md"), "utf8");
  assert.ok(router.split(/\s+/).length < 450);
  assert.match(router, /mdkg skill search/);
  assert.match(router, /explicit user instruction or UI action/);
  runInitCommand({ root, agent: true });
  assert.equal(fs.readFileSync(path.join(root, "AGENTS.md"), "utf8"), wrapper);
});

test("mode conflicts and malformed wrapper markers fail before writes", () => {
  const root = makeTempDir("mdkg-compact-invalid-");
  assert.throws(() => runInitCommand({ root, agent: true, graphOnly: true }), /cannot be combined/);
  assert.deepEqual(fs.readdirSync(root), []);
  writeFile(path.join(root, "AGENTS.md"), "<!-- mdkg:instructions:start -->");
  assert.throws(() => runInitCommand({ root }), /malformed/);
  assert.deepEqual(fs.readdirSync(root), ["AGENTS.md"]);
});

test("managed sections preserve surrounding bytes and newline style", () => {
  const initial = appendInstructions("prefix\r\n", "old");
  const withSuffix = initial + "suffix\r\n";
  const updated = replaceInstructions(withSuffix, "new");
  assert.ok(updated.startsWith("prefix\r\n"));
  assert.ok(updated.endsWith("suffix\r\n"));
  assert.equal(updated.replaceAll("\r\n", "").includes("\n"), false);
  assert.equal(appendInstructions(updated, "other"), updated);
  assert.throws(() => instructionSection(updated + updated), /duplicate/);
});

test("compact generated discovery links and canonical/native skills resolve without project docs", () => {
  const root = makeTempDir("mdkg-bootstrap-links-");
  runInitCommand({ root });
  assert.equal(fs.existsSync(path.join(root, "CLAUDE.md")), false);
  const files = ["AGENTS.md", ".mdkg/AGENT_START.md", ".mdkg/llms.txt", ".mdkg/README.md"];
  for (const slug of fs.readdirSync(path.join(root, ".mdkg/skills"))) {
    const canonical = path.join(root, ".mdkg/skills", slug, "SKILL.md");
    if (!fs.existsSync(canonical)) continue;
    const content = fs.readFileSync(canonical, "utf8");
    for (const link of parseFrontmatter(content, canonical).frontmatter.links ?? []) {
      if (!/^[a-z]+:/.test(link)) assert.ok(fs.existsSync(path.join(root, link)), `${slug}: ${link}`);
    }
    for (const target of [".agents/skills", ".claude/skills"]) assert.equal(fs.readFileSync(path.join(root, target, slug, "SKILL.md"), "utf8"), content);
  }
  for (const relative of files) {
    const content = fs.readFileSync(path.join(root, relative), "utf8");
    for (const match of content.matchAll(/\]\(([^)#]+)(?:#[^)]*)?\)/g)) {
      if (/^[a-z]+:/.test(match[1])) continue;
      assert.ok(fs.existsSync(path.resolve(root, path.dirname(relative), match[1])), `${relative}: ${match[1]}`);
    }
  }
  assert.equal(fs.existsSync(path.join(root, "README.md")), false);
});
