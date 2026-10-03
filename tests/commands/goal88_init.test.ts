import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { makeTempDir, writeFile } from "../helpers/fs";
const { runInitCommand } = require("../../commands/init");
const { runUpgradeCommand } = require("../../commands/upgrade");
const { runSkillSyncCommand, runSkillNewCommand } = require("../../commands/skill");

function quiet<T>(fn: () => T): T {
  const log = console.log; console.log = () => {};
  try { return fn(); } finally { console.log = log; }
}
function inventory(root: string): Record<string, string> {
  const result: Record<string, string> = {};
  const visit = (dir: string): void => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const file = path.join(dir, entry.name), rel = path.relative(root, file);
      if (entry.isDirectory()) visit(file);
      else result[rel] = entry.isSymbolicLink() ? `link:${fs.readlinkSync(file)}` :
        crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
    }
  };
  visit(root); return result;
}
function configTargets(root: string, targets: string[]): void {
  const file = path.join(root, ".mdkg/config.json"), cfg = JSON.parse(fs.readFileSync(file, "utf8"));
  cfg.customization.skill_mirrors.targets = targets;
  writeFile(file, JSON.stringify(cfg, null, 2) + "\n");
}

for (const explicit of [false, true]) test(`AGENTS-only ${explicit ? "explicit agent" : "default"} init is byte-idempotent and link-complete`, () => {
  const root = makeTempDir("mdkg-goal88-fresh-");
  quiet(() => runInitCommand({ root, ...(explicit ? { agent: true } : {}) }));
  const first = inventory(root);
  assert.deepEqual(Object.keys(first).filter(file => !file.includes(path.sep)).sort(),
    [".gitignore", ".npmignore", "AGENTS.md"]);
  const manifest = JSON.parse(fs.readFileSync(path.join(root, ".mdkg/init-manifest.json"), "utf8"));
  assert.deepEqual(manifest.files.filter((file: any) => file.category === "agent_doc").map((file: any) => file.path), ["AGENTS.md"]);
  for (const file of manifest.files) assert.ok(fs.existsSync(path.join(root, file.path)), file.path);
  for (const file of ["AGENTS.md", ".mdkg/AGENT_START.md", ".mdkg/README.md", ".mdkg/llms.txt"]) {
    const absolute = path.join(root, file), body = fs.readFileSync(absolute, "utf8");
    for (const match of body.matchAll(/\]\(([^)#]+)(?:#[^)]*)?\)/g)) {
      if (!/^[a-z][a-z\d+.-]*:/i.test(match[1])) assert.ok(fs.existsSync(path.resolve(path.dirname(absolute), match[1])), `${file}: ${match[1]}`);
    }
  }
  quiet(() => runInitCommand({ root, ...(explicit ? { agent: true } : {}) }));
  assert.deepEqual(inventory(root), first);
  assert.deepEqual(quiet(() => runUpgradeCommand({ root })).will_write_paths, []);
});

test("authored and malformed legacy instructions survive init, force, and reviewed upgrade byte-for-byte", () => {
  const root = makeTempDir("mdkg-goal88-preserve-");
  const originals = { "CLAUDE.md": "User bytes\r\n<!-- mdkg:instructions:start -->\r\n",
    "AGENT_START.md": "# Project-authored startup\nKeep this.\n" };
  for (const [name, bytes] of Object.entries(originals)) writeFile(path.join(root, name), bytes);
  quiet(() => runInitCommand({ root }));
  quiet(() => runInitCommand({ root, force: true }));
  const preview = quiet(() => runUpgradeCommand({ root }));
  assert.ok(preview.changes.some((change: any) => change.path === "CLAUDE.md" && change.action === "skip"));
  assert.equal(preview.will_write_paths.includes("CLAUDE.md"), false);
  quiet(() => runUpgradeCommand({ root, apply: true, planHash: preview.plan_hash }));
  for (const [name, bytes] of Object.entries(originals)) assert.equal(fs.readFileSync(path.join(root, name), "utf8"), bytes);
  fs.unlinkSync(path.join(root, "CLAUDE.md"));
  const missing = quiet(() => runUpgradeCommand({ root }));
  assert.equal(missing.will_write_paths.includes("CLAUDE.md"), false);
});

test("both native and two extra targets preserve unrelated files and copy all resource bytes without wrappers", () => {
  const root = makeTempDir("mdkg-goal88-extra-");
  quiet(() => runInitCommand({ root }));
  const targets = [".agents/skills", ".claude/skills", ".extra-a/skills", ".extra-b/skills"];
  configTargets(root, targets);
  const source = ".mdkg/skills/author-mdkg-skill";
  for (const file of ["references/example.md", "assets/example.txt", "scripts/nonexecuting.txt"]) {
    writeFile(path.join(root, source, file), `Synthetic ${file}\n`);
  }
  for (const target of targets) writeFile(path.join(root, target, "unrelated/note.txt"), "Unmanaged bytes\n");
  quiet(() => runSkillSyncCommand({ root }));
  for (const target of targets) {
    assert.deepEqual(inventory(path.join(root, target, "author-mdkg-skill")), inventory(path.join(root, source)));
    assert.equal(fs.readFileSync(path.join(root, target, "unrelated/note.txt"), "utf8"), "Unmanaged bytes\n");
  }
  for (const name of ["CLAUDE.md", ".extra-a/AGENTS.md", ".extra-b/CLAUDE.md"]) assert.equal(fs.existsSync(path.join(root, name)), false);
  const synced = inventory(root); quiet(() => runSkillSyncCommand({ root })); assert.deepEqual(inventory(root), synced);
});

for (const targets of [
  [".mdkg/skills"], [".mdkg"], ["."], [".agents/skills", ".agents/skills/nested"],
  [".agents/skills", ".AGENTS/skills"], [".agents/skills", "./.agents//skills"],
  ["../escape/skills"], ["/tmp/escape/skills"], [".git/skills"],
]) test(`unsafe mirror policy refuses before effects, including force: ${targets.join(",")}`, () => {
  const root = makeTempDir("mdkg-goal88-policy-"); quiet(() => runInitCommand({ root }));
  configTargets(root, targets); const before = inventory(root);
  for (const force of [false, true]) {
    assert.throws(() => quiet(() => runSkillSyncCommand({ root, force })), /overlap|alias|relative|parent-directory|metadata|duplicate/);
    assert.deepEqual(inventory(root), before);
    assert.throws(() => quiet(() => runInitCommand({ root })), /overlap|alias|relative|parent-directory|metadata|duplicate/);
    assert.deepEqual(inventory(root), before);
  }
});

test("late-target unmanaged collision preserves all earlier targets and pending canonical authoring", () => {
  const root = makeTempDir("mdkg-goal88-late-conflict-"); quiet(() => runInitCommand({ root }));
  configTargets(root, [".agents/skills", ".claude/skills", ".extra/skills"]);
  writeFile(path.join(root, ".extra/skills/author-mdkg-skill/SKILL.md"), "User collision\n");
  writeFile(path.join(root, ".mdkg/skills/author-mdkg-skill/assets/new.txt"), "New canonical resource\n");
  let before = inventory(root);
  assert.throws(() => quiet(() => runSkillSyncCommand({ root })), /not mdkg-managed/);
  assert.deepEqual(inventory(root), before);
  fs.rmSync(path.join(root, ".extra/skills/author-mdkg-skill"), { recursive: true });
  writeFile(path.join(root, ".extra/skills/new-synthetic/SKILL.md"), "User collision\n");
  before = inventory(root);
  assert.throws(() => quiet(() => runSkillNewCommand({ root, slug: "new-synthetic", name: "Synthetic", description: "Synthetic nonexecuting fixture" })), /not mdkg-managed/);
  assert.deepEqual(inventory(root), before);
});

test("custom mirror policy remains intact and upgrade explicitly reports missing native defaults", () => {
  const root = makeTempDir("mdkg-goal88-policy-preserve-"); quiet(() => runInitCommand({ root }));
  configTargets(root, [".extra/skills"]);
  const file = path.join(root, ".mdkg/config.json"), before = fs.readFileSync(file);
  const preview = quiet(() => runUpgradeCommand({ root }));
  assert.ok(preview.preserved_customizations.some((change: any) => /native defaults missing: .agents\/skills, .claude\/skills/.test(change.reason)));
  quiet(() => runUpgradeCommand({ root, apply: true, planHash: preview.plan_hash }));
  assert.deepEqual(fs.readFileSync(file), before);
});
