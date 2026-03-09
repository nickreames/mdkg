import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
const { runNewCommand } = require("../../commands/new");
import { makeTempDir, writeFile } from "../helpers/fs";
import { writeDefaultTemplates } from "../helpers/templates";
import { writeRootConfig } from "../helpers/config";

function writeNode(root: string, dir: string, fileName: string, lines: string[]): void {
  writeFile(path.join(root, ".mdkg", dir, fileName), lines.join("\n"));
}

function writeFixtures(root: string): void {
  writeNode(root, "work", "epic-1-seed-epic.md", [
    "---",
    "id: epic-1",
    "type: epic",
    "title: Seed epic",
    "status: todo",
    "priority: 1",
    "tags: []",
    "owners: []",
    "links: []",
    "artifacts: []",
    "relates: []",
    "blocked_by: []",
    "blocks: []",
    "refs: []",
    "aliases: []",
    "skills: []",
    "created: 2026-03-05",
    "updated: 2026-03-05",
    "---",
    "",
  ]);
  writeNode(root, "work", "task-1-parent.md", [
    "---",
    "id: task-1",
    "type: task",
    "title: Parent task",
    "status: todo",
    "priority: 1",
    "epic: epic-1",
    "tags: []",
    "owners: []",
    "links: []",
    "artifacts: []",
    "relates: []",
    "blocked_by: []",
    "blocks: []",
    "refs: []",
    "aliases: []",
    "skills: []",
    "created: 2026-03-05",
    "updated: 2026-03-05",
    "---",
    "",
  ]);
  writeNode(root, "work", "task-2-next.md", [
    "---",
    "id: task-2",
    "type: task",
    "title: Next task",
    "status: todo",
    "priority: 1",
    "tags: []",
    "owners: []",
    "links: []",
    "artifacts: []",
    "relates: []",
    "blocked_by: []",
    "blocks: []",
    "refs: []",
    "aliases: []",
    "skills: []",
    "created: 2026-03-05",
    "updated: 2026-03-05",
    "---",
    "",
  ]);
  writeNode(root, "work", "task-3-prev.md", [
    "---",
    "id: task-3",
    "type: task",
    "title: Prev task",
    "status: todo",
    "priority: 1",
    "tags: []",
    "owners: []",
    "links: []",
    "artifacts: []",
    "relates: []",
    "blocked_by: []",
    "blocks: []",
    "refs: []",
    "aliases: []",
    "skills: []",
    "created: 2026-03-05",
    "updated: 2026-03-05",
    "---",
    "",
  ]);
  writeNode(root, "design", "dec-1-seed.md", [
    "---",
    "id: dec-1",
    "type: dec",
    "title: Seed decision",
    "status: accepted",
    "supersedes: dec-0",
    "tags: []",
    "owners: []",
    "links: []",
    "artifacts: []",
    "relates: []",
    "refs: []",
    "aliases: []",
    "created: 2026-03-05",
    "updated: 2026-03-05",
    "---",
    "",
  ]);
}

test("runNewCommand creates work item with graph refs and metadata lists", () => {
  const root = makeTempDir("mdkg-new-extended-");
  writeRootConfig(root);
  writeDefaultTemplates(root);
  writeFixtures(root);

  runNewCommand({
    root,
    type: "task",
    title: "Ship release candidate",
    status: "review",
    priority: 2,
    epic: "epic-1",
    parent: "task-1",
    prev: "task-3",
    next: "task-2",
    relates: "epic-1,task-1",
    blockedBy: "task-3",
    blocks: "task-2",
    refs: "rule-guide,dec-1",
    aliases: "Release-Candidate,Shipper",
    tags: "release,CLI",
    owners: "Nick,Agent",
    links: "https://example.com/pr",
    artifacts: "build://artifact",
    skills: "build-pack-and-execute-task,verify-close-and-checkpoint",
    noCache: true,
    noReindex: true,
    now: new Date(2026, 2, 6),
  });

  const filePath = path.join(root, ".mdkg", "work", "task-4-ship-release-candidate.md");
  const content = fs.readFileSync(filePath, "utf8");
  assert.match(content, /epic: epic-1/);
  assert.match(content, /parent: task-1/);
  assert.match(content, /prev: task-3/);
  assert.match(content, /next: task-2/);
  assert.match(content, /relates: \[epic-1, task-1\]/);
  assert.match(content, /blocked_by: \[task-3\]/);
  assert.match(content, /blocks: \[task-2\]/);
  assert.match(content, /refs: \[rule-guide, dec-1\]/);
  assert.match(content, /aliases: \[release-candidate, shipper\]/);
  assert.match(content, /tags: \[release, cli\]/);
  assert.match(content, /owners: \[nick, agent\]/);
  assert.match(content, /links: \[https:\/\/example.com\/pr\]/);
  assert.match(content, /artifacts: \[build:\/\/artifact\]/);
  assert.match(
    content,
    /skills: \[build-pack-and-execute-task, verify-close-and-checkpoint\]/
  );
});

test("runNewCommand creates decision, rule, and checkpoint in the correct locations", () => {
  const root = makeTempDir("mdkg-new-layout-");
  writeRootConfig(root);
  writeDefaultTemplates(root);
  writeFixtures(root);

  runNewCommand({
    root,
    type: "dec",
    title: "Accept simplified CLI",
    supersedes: "DEC-1",
    now: new Date(2026, 2, 6),
  });
  runNewCommand({
    root,
    type: "rule",
    title: "Keep pack first",
    now: new Date(2026, 2, 6),
  });
  runNewCommand({
    root,
    type: "checkpoint",
    title: "Release dry run",
    status: "done",
    priority: 1,
    now: new Date(2026, 2, 6),
  });

  const decPath = path.join(root, ".mdkg", "design", "dec-2-accept-simplified-cli.md");
  const rulePath = path.join(root, ".mdkg", "core", "rule-1-keep-pack-first.md");
  const chkPath = path.join(root, ".mdkg", "work", "chk-1-release-dry-run.md");

  assert.ok(fs.existsSync(decPath));
  assert.ok(fs.existsSync(rulePath));
  assert.ok(fs.existsSync(chkPath));
  assert.match(fs.readFileSync(decPath, "utf8"), /status: proposed/);
  assert.match(fs.readFileSync(decPath, "utf8"), /supersedes: dec-1/);
});

test("runNewCommand rejects unsupported workspace and invalid work-only arguments", () => {
  const root = makeTempDir("mdkg-new-reject-");
  writeRootConfig(root);
  writeDefaultTemplates(root);
  writeFixtures(root);

  assert.throws(
    () =>
      runNewCommand({
        root,
        type: "task",
        title: "bad ws",
        ws: "all",
      }),
    /--ws all is not valid for creation/
  );

  assert.throws(
    () =>
      runNewCommand({
        root,
        type: "rule",
        title: "bad rule refs",
        epic: "epic-1",
      }),
    /epic\/parent\/prev\/next\/blocked-by\/blocks are only valid for work items/
  );

  assert.throws(
    () =>
      runNewCommand({
        root,
        type: "rule",
        title: "bad skill field",
        skills: "build-pack-and-execute-task",
      }),
    /--skills is only valid for work items/
  );
});

test("runNewCommand rejects missing related ids and invalid supersedes target", () => {
  const root = makeTempDir("mdkg-new-missing-ref-");
  writeRootConfig(root);
  writeDefaultTemplates(root);
  writeFixtures(root);

  assert.throws(
    () =>
      runNewCommand({
        root,
        type: "task",
        title: "missing epic",
        epic: "epic-999",
        status: "todo",
      }),
    /epic not found in workspace root: epic-999/
  );

  assert.throws(
    () =>
      runNewCommand({
        root,
        type: "dec",
        title: "bad supersedes",
        supersedes: "task-1",
      }),
    /--supersedes must be a dec-# id/
  );
});
