import { test, after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import { makeTempDir } from "../helpers/fs";

const runtime = process.env.MDKG_TEST_PACKAGE ? path.join(process.env.MDKG_TEST_PACKAGE, "dist") : path.resolve(__dirname, "../..");
const roots: string[] = [];
const temp = () => { const root = makeTempDir("mdkg-cli-onboarding-"); roots.push(root); return root; };
after(() => { for (const root of roots) fs.rmSync(root, { recursive: true, force: true }); });
const cli = (root: string, args: string[]) => spawnSync(process.execPath, [path.join(runtime, "cli.js"), ...args], { cwd: root, encoding: "utf8" });
function snapshot(root: string) {
  const result: Record<string, string> = {};
  const visit = (dir: string) => { for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) visit(p);
    else result[path.relative(root, p)] = crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
  } };
  visit(root); return result;
}
function init(args: string[] = []) {
  const root = temp();
  const result = cli(root, ["init", ...args]); assert.equal(result.status, 0, result.stderr);
  return root;
}
function reviewedHint(text: string) {
  assert.match(text, /mdkg upgrade/);
  assert.match(text, /review/i);
  assert.match(text, /--plan-hash/);
  assert.match(text, /--only/);
  assert.doesNotMatch(text, /`mdkg upgrade --apply`/);
}

test("top-level quickstart leads with compact init and separates reviewed upgrades", () => {
  const root = temp(), before = snapshot(root), result = cli(root, ["--help"]);
  assert.equal(result.status, 0);
  const quickstart = result.stdout.split("Quickstart:\n")[1].split("\n\n")[0];
  assert.match(quickstart, /^  mdkg init\n/);
  assert.doesNotMatch(quickstart, /upgrade|skill new/);
  assert.match(result.stdout, /compact.*default|default.*compact/i);
  assert.match(result.stdout, /--graph-only/);
  assert.match(result.stdout, /--agent.*compatib/i);
  reviewedHint(result.stdout);
  assert.deepEqual(snapshot(root), before);
});

test("bundled command reference agrees with compact and reviewed-upgrade guidance", () => {
  const root = init();
  const text = fs.readFileSync(path.join(root, ".mdkg/CLI_COMMAND_MATRIX.md"), "utf8");
  assert.match(text, /compact.*default|default.*compact/i);
  assert.match(text, /--graph-only/);
  reviewedHint(text);
  assert.doesNotMatch(text, /`mdkg upgrade --apply`/);
});

test("upgrade path selection is command-specific and uses a real placeholder", () => {
  const contract = JSON.parse(fs.readFileSync(path.join(runtime, "command-contract.json"), "utf8"));
  assert.equal(contract.commands.find((c: any) => c.key === "global").flags.some((f: any) => f.name === "--only"), false);
  const flag = contract.commands.find((c: any) => c.key === "upgrade").flags.find((f: any) => f.name === "--only");
  assert.match(flag.value, /^<paths?>$/);
});

test("removed init modes point to the default without writing anything", () => {
  const root = temp(), before = snapshot(root);
  for (const flag of ["--llm", "--agents", "--claude", "--omni"]) {
    const result = cli(root, ["init", flag]); assert.equal(result.status, 1);
    assert.match(result.stderr, /use `mdkg init` for compact agent setup \(default\)/);
    assert.match(result.stderr, /--graph-only/);
  }
  assert.deepEqual(snapshot(root), before);
});

for (const args of [[], ["--agent"], ["--graph-only"]]) test(`documented init mode ${args.join(" ") || "default"} preserves project instructions`, () => {
  const root = temp(), authored = "# Project instructions\nKeep these exact bytes.\n";
  for (const name of ["AGENTS.md", "CLAUDE.md", "README.md", "LICENSE"]) fs.writeFileSync(path.join(root, name), authored);
  const result = cli(root, ["init", ...args]); assert.equal(result.status, 0, result.stderr);
  for (const name of ["README.md", "LICENSE"]) assert.equal(fs.readFileSync(path.join(root, name), "utf8"), authored);
  const agents = fs.readFileSync(path.join(root, "AGENTS.md"), "utf8");
  assert.ok(agents.startsWith(authored));
  assert.equal(agents.includes(".mdkg/AGENT_START.md"), !args.includes("--graph-only"));
  assert.equal(fs.readFileSync(path.join(root, "CLAUDE.md"), "utf8"), authored,
    "init must preserve user-authored legacy Claude instructions byte-for-byte");
  const beforeRepeat = snapshot(root);
  const repeated = cli(root, ["init", ...args]); assert.equal(repeated.status, 0, repeated.stderr);
  assert.deepEqual(snapshot(root), beforeRepeat, "repeated init must preserve every generated and authored file");
});

test("missing-template create validate and doctor hints require reviewed upgrades", () => {
  const root = init(); fs.unlinkSync(path.join(root, ".mdkg/templates/default/task.md"));
  const created = cli(root, ["new", "task", "Fallback", "--json"]); assert.equal(created.status, 0, created.stderr);
  reviewedHint(created.stderr);
  const before = snapshot(root);
  const validated = cli(root, ["validate", "--json"]); assert.equal(validated.status, 0, validated.stdout + validated.stderr);
  const report = JSON.parse(validated.stdout);
  reviewedHint(report.warnings.find((s: string) => s.includes("bundled template schema fallback")));
  reviewedHint(report.warning_diagnostics.find((d: any) => d.id === "template_schema.fallback").remediation);
  const doctor = cli(root, ["doctor", "--json"]);
  assert.equal(doctor.status, 0, doctor.stdout + doctor.stderr); reviewedHint(doctor.stdout);
  assert.deepEqual(snapshot(root), before, "diagnostic guidance never applies upgrades");
});

test("legacy bundle command gives preview-first upgrade guidance without writes", () => {
  const root = init(), before = snapshot(root);
  const result = cli(root, ["bundle", "import"]); assert.notEqual(result.status, 0);
  reviewedHint(result.stderr); assert.deepEqual(snapshot(root), before);
});

test("upgrade preview emits a usable exact-hash command and stale or missing approval refuses", () => {
  const root = init(), target = ".mdkg/AGENT_START.md";
  fs.unlinkSync(path.join(root, target));
  const initialized = spawnSync("git", ["init", "-q"], { cwd: root, encoding: "utf8" });
  assert.equal(initialized.status, 0, initialized.stderr);
  const index = path.join(root, ".git/index"); fs.writeFileSync(index, "synthetic staged bytes");
  const before = snapshot(root), args = ["upgrade", "--only", target];
  const preview = cli(root, [...args, "--json"]); assert.equal(preview.status, 0, preview.stderr);
  const receipt = JSON.parse(preview.stdout); assert.equal(receipt.safe_to_apply, true);
  const human = cli(root, args); assert.equal(human.status, 0); reviewedHint(human.stdout);
  assert.ok(human.stdout.includes(receipt.plan_hash)); assert.deepEqual(snapshot(root), before);
  for (const extra of [[], ["--plan-hash", "sha256:" + "0".repeat(64)]]) {
    const denied = cli(root, [...args, "--apply", ...extra]); assert.notEqual(denied.status, 0);
    assert.match(denied.stderr, /review|stale/); assert.deepEqual(snapshot(root), before);
  }
  const applied = cli(root, [...args, "--apply", "--plan-hash", receipt.plan_hash, "--json"]);
  assert.equal(applied.status, 0, applied.stdout + applied.stderr);
  assert.equal(fs.existsSync(path.join(root, target)), true);
  assert.equal(fs.readFileSync(index, "utf8"), "synthetic staged bytes");
});
