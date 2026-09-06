import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { makeTempDir, writeFile } from "../helpers/fs";
const { runInitCommand } = require("../../commands/init");
const { runUpgradeCommand } = require("../../commands/upgrade");
const { UpgradePlan, continueUpgrade, UPGRADE_JOURNAL } = require("../../commands/upgrade_transaction");
const { instructionSection } = require("../../commands/bootstrap_instructions");
function quiet<T>(fn: () => T): T { const log = console.log; console.log = () => {}; try { return fn(); } finally { console.log = log; } }
const hash = (value: string | Buffer): string => crypto.createHash("sha256").update(value).digest("hex");
function snapshot(root: string): Record<string, string> {
  const result: Record<string, string> = {};
  function walk(dir: string): void {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(file);
      else result[path.relative(root, file)] = entry.isSymbolicLink() ? fs.readlinkSync(file) : hash(fs.readFileSync(file));
    }
  }
  walk(root); return result;
}
function fixture(): { root: string; seed: string } {
  const root = makeTempDir("mdkg-upgrade-safety-");
  const seed = makeTempDir("mdkg-upgrade-safety-seed-");
  fs.cpSync(path.resolve("dist/init"), seed, { recursive: true });
  quiet(() => runInitCommand({ root, seedRoot: seed }));
  fs.appendFileSync(path.join(seed, "AGENT_START.md"), "\nUpdated router.\n");
  writeFile(path.join(seed, "AGENTS.md"), fs.readFileSync(path.join(seed, "AGENTS.md"), "utf8").replace("<!-- mdkg:instructions:end -->", "Updated adapter.\n<!-- mdkg:instructions:end -->"));
  return { root, seed };
}
const preview = (root: string, seed: string, only?: string[]): any => quiet(() => runUpgradeCommand({ root, seedRoot: seed, only }));
const apply = (root: string, seed: string, receipt: any, extra: any = {}): any => quiet(() => runUpgradeCommand({ root, seedRoot: seed, apply: true, planHash: receipt.plan_hash, ...extra }));

test("upgrade preview is byte-preserving and stable; stale plans fail before writes", () => {
  const { root, seed } = fixture();
  writeFile(path.join(root, ".git/index"), "unrelated staged bytes");
  const before = snapshot(root), receipt = preview(root, seed);
  assert.equal(receipt.safe_to_apply, true);
  assert.equal(preview(root, seed).plan_hash, receipt.plan_hash);
  assert.deepEqual(snapshot(root), before);
  assert.throws(() => quiet(() => runUpgradeCommand({ root, seedRoot: seed, apply: true })), /plan-hash/);
  assert.deepEqual(snapshot(root), before);
  fs.appendFileSync(path.join(root, "AGENTS.md"), "\nUser change after review.\n");
  const moved = snapshot(root);
  assert.throws(() => apply(root, seed, receipt), /stale plans/);
  assert.deepEqual(snapshot(root), moved);
  apply(root, seed, preview(root, seed));
  assert.match(fs.readFileSync(path.join(root, "AGENTS.md"), "utf8"), /User change after review/);
  assert.equal(fs.readFileSync(path.join(root, ".git/index"), "utf8"), "unrelated staged bytes");
  assert.deepEqual(preview(root, seed).will_write_paths, []);
});

test("managed sections preserve CRLF surrounding bytes and reject modified or malformed units", () => {
  const { root, seed } = fixture(), file = path.join(root, "AGENTS.md");
  const section = instructionSection(fs.readFileSync(file, "utf8")).text.replace(/\n/g, "\r\n");
  writeFile(file, "User prefix\r\n\r\n" + section + "\r\nUser suffix  \r\n");
  const manifestPath = path.join(root, ".mdkg/init-manifest.json");
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  manifest.files.find((item: any) => item.path === "AGENTS.md").managed_section_sha256 = hash(section);
  writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
  apply(root, seed, preview(root, seed));
  const updated = fs.readFileSync(file, "utf8");
  assert.ok(updated.startsWith("User prefix\r\n\r\n"));
  assert.ok(updated.endsWith("\r\nUser suffix  \r\n"));
  assert.match(updated, /Updated adapter\.\r\n/);
  writeFile(file, updated.replace("Updated adapter.", "User-owned managed edit."));
  const before = snapshot(root), conflicted = preview(root, seed);
  assert.equal(conflicted.safe_to_apply, false);
  assert.equal(apply(root, seed, conflicted).safe_to_apply, false);
  assert.deepEqual(snapshot(root), before);
  writeFile(file, updated + "<!-- mdkg:instructions:start -->");
  assert.equal(preview(root, seed).safe_to_apply, false);
});

test("safe subsets require explicit exact paths and preserve conflicting unselected content", () => {
  const { root, seed } = fixture();
  writeFile(path.join(root, ".mdkg/AGENT_START.md"), "Customized router\n");
  assert.equal(preview(root, seed).safe_to_apply, false);
  const only = ["AGENTS.md"], receipt = preview(root, seed, only);
  assert.equal(receipt.safe_to_apply, true);
  assert.deepEqual(receipt.will_write_paths.sort(), [".mdkg/init-manifest.json", "AGENTS.md"].sort());
  apply(root, seed, receipt, { only });
  assert.equal(fs.readFileSync(path.join(root, ".mdkg/AGENT_START.md"), "utf8"), "Customized router\n");
  assert.throws(() => preview(root, seed, ["unrelated.txt"]), /not a pending upgrade unit/);
});

test("legacy redirects require seed proof; public and customized documents survive", () => {
  const { root, seed } = fixture();
  const manifestPath = path.join(root, ".mdkg/init-manifest.json");
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  writeFile(path.join(root, "AGENT_START.md"), "Known legacy generated router\n");
  manifest.files.push({ path: "AGENT_START.md", category: "startup_doc", sha256: hash("Known legacy generated router\n") });
  writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
  writeFile(path.join(root, "CLI_COMMAND_MATRIX.md"), "Maintained project reference\n");
  writeFile(path.join(root, "llms.txt"), "Public website discovery\n");
  const receipt = preview(root, seed);
  assert.ok(receipt.changes.some((item: any) => item.path === "AGENT_START.md" && item.category === "legacy_redirect"));
  apply(root, seed, receipt);
  assert.match(fs.readFileSync(path.join(root, "AGENT_START.md"), "utf8"), /\]\(\.mdkg\/AGENT_START\.md\)/);
  assert.equal(fs.readFileSync(path.join(root, "CLI_COMMAND_MATRIX.md"), "utf8"), "Maintained project reference\n");
  assert.equal(fs.readFileSync(path.join(root, "llms.txt"), "utf8"), "Public website discovery\n");
  assert.deepEqual(preview(root, seed).will_write_paths, []);
});

test("every interrupted write supports explicit resume or verified original-byte recovery", () => {
  for (const mode of ["resume", "recover"]) for (let fault = 0; fault < 3; fault++) {
    const { root, seed } = fixture(), only = ["AGENTS.md", ".mdkg/AGENT_START.md"];
    const receipt = preview(root, seed, only);
    assert.equal(receipt.will_write_paths.length, 3);
    const originals = new Map<string, Buffer>(receipt.will_write_paths.map((relative: string) => [relative, fs.readFileSync(path.join(root, relative))]));
    assert.throws(() => apply(root, seed, receipt, { only, afterWrite: (_: string, index: number) => { if (index === fault) throw new Error("simulated interruption"); } }), /simulated interruption/);
    assert.throws(() => preview(root, seed), /unfinished upgrade/);
    const result: any = quiet(() => runUpgradeCommand({ root, seedRoot: seed, [mode]: true, planHash: receipt.plan_hash }));
    assert.equal(result.recovery_state, mode === "resume" ? "completed" : "recovered");
    if (mode === "recover") for (const [relative, body] of originals) assert.deepEqual(fs.readFileSync(path.join(root, relative)), body);
    else assert.deepEqual(preview(root, seed).will_write_paths, []);
    assert.equal(fs.existsSync(path.join(root, ".mdkg/index/write.lock")), false);
    assert.equal(fs.statSync(path.join(root, UPGRADE_JOURNAL)).mode & 0o777, 0o600);
  }
});

test("recovery refuses user edits; operation-owned creation and deletion are reversible", () => {
  const root = makeTempDir("mdkg-upgrade-journal-");
  writeFile(path.join(root, "old.md"), "original");
  const plan = new UpgradePlan(root);
  plan.write("new.md", "new"); plan.write("old.md", null);
  assert.throws(() => plan.apply("test-plan", 10, (_: string, index: number) => { if (index === 1) throw new Error("interrupted"); }), /interrupted/);
  writeFile(path.join(root, "new.md"), "user edited");
  const before = snapshot(root);
  assert.throws(() => continueUpgrade(root, "recover", "test-plan", 10), /recovery collision/);
  assert.deepEqual(snapshot(root), before);
  writeFile(path.join(root, "new.md"), "new");
  continueUpgrade(root, "recover", "test-plan", 10);
  assert.equal(fs.existsSync(path.join(root, "new.md")), false);
  assert.equal(fs.readFileSync(path.join(root, "old.md"), "utf8"), "original");
});

test("linked destinations and malformed manifests fail without writes", () => {
  const { root, seed } = fixture(), outside = makeTempDir("mdkg-upgrade-outside-");
  writeFile(path.join(outside, "AGENTS.md"), "outside");
  fs.unlinkSync(path.join(root, "AGENTS.md"));
  fs.symlinkSync(path.join(outside, "AGENTS.md"), path.join(root, "AGENTS.md"));
  const before = snapshot(root);
  assert.throws(() => preview(root, seed), /symbolic link|linked/);
  assert.deepEqual(snapshot(root), before);
  assert.equal(fs.readFileSync(path.join(outside, "AGENTS.md"), "utf8"), "outside");
  fs.unlinkSync(path.join(root, "AGENTS.md"));
  writeFile(path.join(root, ".mdkg/init-manifest.json"), "{broken");
  const broken = snapshot(root);
  assert.throws(() => preview(root, seed));
  assert.deepEqual(snapshot(root), broken);
});

test("repeated init preserves previous section provenance for a later reviewed upgrade", () => {
  const { root, seed } = fixture();
  const before = fs.readFileSync(path.join(root, "AGENTS.md"));
  quiet(() => runInitCommand({ root, seedRoot: seed }));
  assert.deepEqual(fs.readFileSync(path.join(root, "AGENTS.md")), before);
  const receipt = preview(root, seed);
  assert.equal(receipt.safe_to_apply, true);
  apply(root, seed, receipt);
  assert.match(fs.readFileSync(path.join(root, "AGENTS.md"), "utf8"), /Updated adapter/);
});

test("native mirror customizations and same-slug unowned folders block blind synchronization", () => {
  const { root, seed } = fixture();
  const mirrored = path.join(root, ".agents/skills/select-work-and-ground-context/SKILL.md");
  fs.appendFileSync(mirrored, "\nUser-owned native edit.\n");
  const before = snapshot(root), receipt = preview(root, seed);
  assert.equal(receipt.safe_to_apply, false);
  assert.ok(receipt.blocking_conflicts.some((item: any) => item.path.endsWith("select-work-and-ground-context/SKILL.md")));
  assert.equal(apply(root, seed, receipt).safe_to_apply, false);
  assert.deepEqual(snapshot(root), before);
  const ownership = path.join(root, ".claude/skills/.mdkg-managed.json");
  writeFile(ownership, JSON.stringify({ managed_slugs: [] }));
  const unowned = preview(root, seed);
  assert.ok(unowned.blocking_conflicts.some((item: any) => item.reason.includes("unowned native skill")));
});
