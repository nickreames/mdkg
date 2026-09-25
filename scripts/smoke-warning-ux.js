#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const { runInstalledSmoke } = require("./qualification-smoke");

const repoRoot = path.resolve(__dirname, "..");

let commands;

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function assertExists(filePath) {
  assert(fs.existsSync(filePath), `expected path to exist: ${filePath}`);
}

function parseJson(output) {
  return JSON.parse(output);
}

function mdkg(binPath, args, cwd) {
  const result = commands.node(binPath, args, cwd);
  return { stdout: result.stdout.trim(), stderr: result.stderr.trim(), combined: `${result.stdout}${result.stderr}` };
}

function git(cwd, args) {
  return commands.git(args, cwd);
}

function prepareInstall(tempRoot) {
  const packDir = path.join(tempRoot, "pack");
  const prefix = path.join(tempRoot, "prefix");
  fs.mkdirSync(packDir, { recursive: true });
  fs.mkdirSync(prefix, { recursive: true });

  const packOutput = commands.npm(["pack", repoRoot, "--silent", "--dry-run=false", "--pack-destination", packDir]).stdout;
  const tarballName = packOutput
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .pop();
  assert(tarballName, "npm pack did not return a tarball name");
  const tarballPath = path.join(packDir, path.basename(tarballName));
  assertExists(tarballPath);

  return { tarballPath, install() {
    commands.npm(["install", "-g", tarballPath, "--prefix", prefix, "--foreground-scripts", "--offline"], {
      cwd: tempRoot,
      env: { npm_config_prefix: prefix },
    });
    const binPath = process.platform === "win32" ? path.join(prefix, "mdkg.cmd") : path.join(prefix, "bin", "mdkg");
    assertExists(binPath);
    return { binPath, tarballPath };
  } };
}

function warningTaskContent(id) {
  return [
    "---",
    `id: ${id}`,
    "type: task",
    "title: Warning UX fixture",
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
    "created: 2026-06-21",
    "updated: 2026-06-21",
    "---",
    "",
    "# Overview",
    "",
    "Fixture intentionally misses recommended headings.",
    "",
  ].join("\n");
}

function createWarningFixtures(root, count) {
  const workDir = path.join(root, ".mdkg", "work");
  fs.mkdirSync(workDir, { recursive: true });
  for (let i = 1; i <= count; i += 1) {
    const id = `task-${900000 + i}`;
    fs.writeFileSync(path.join(workDir, `${id}.md`), warningTaskContent(id), "utf8");
  }
}

function assertSummaryReceipt(receipt, limit) {
  assert(receipt.action === "validated", "validate action mismatch");
  assert(receipt.ok === true, "warning fixture should validate without errors");
  assert(receipt.warning_count >= 1000, `expected 1000+ warnings, got ${receipt.warning_count}`);
  assert(receipt.warnings.length <= limit, "summary warnings exceed limit");
  assert(receipt.warning_diagnostics.length <= limit, "summary diagnostics exceed limit");
  assert(receipt.warning_summary.total === receipt.warning_count, "summary total mismatch");
  assert(receipt.warning_summary.emitted === Math.min(receipt.warning_count, limit), "summary emitted mismatch");
  assert(receipt.warning_summary.truncated === true, "summary should be truncated");
  assert(receipt.warning_summary.omitted_count === receipt.warning_count - limit, "summary omitted count mismatch");
  assert(
    receipt.warning_summary.by_id.some((entry) => entry.key === "heading.missing" && entry.count >= 1000),
    "summary missing 1000+ heading.missing aggregate"
  );
  assert(
    receipt.warning_summary.by_node_type.some((entry) => entry.key === "task"),
    "summary missing task node type aggregate"
  );
}

function exerciseSmoke(tempRoot, installed) {
  const { binPath, tarballPath } = installed;
  const root = path.join(tempRoot, "repo");
  fs.mkdirSync(root, { recursive: true });
  git(root, ["init", "-q"]);
  git(root, ["config", "user.email", "mdkg-smoke@example.test"]);
  git(root, ["config", "user.name", "mdkg smoke"]);
  mdkg(binPath, ["init", "--agent"], root);
  createWarningFixtures(root, 250);
  git(root, ["add", ".mdkg/work"]);

  const summary = parseJson(mdkg(binPath, ["validate", "--summary", "--json", "--limit", "20"], root).stdout);
  assertSummaryReceipt(summary, 20);
  assert(JSON.stringify(summary).length < 30000, "summary validate JSON is unexpectedly large");

  const jsonOutRel = ".mdkg/receipts/warning-validate-full.json";
  const jsonOutSummary = parseJson(
    mdkg(binPath, ["validate", "--json-out", jsonOutRel, "--summary", "--json", "--limit", "10"], root).stdout
  );
  assertSummaryReceipt(jsonOutSummary, 10);
  const jsonOutPath = path.join(root, jsonOutRel);
  assertExists(jsonOutPath);
  const fullReceipt = parseJson(fs.readFileSync(jsonOutPath, "utf8"));
  assert(fullReceipt.warning_count === jsonOutSummary.warning_count, "json-out warning_count mismatch");
  assert(fullReceipt.warnings.length === fullReceipt.warning_count, "json-out should contain full warnings");
  assert(fullReceipt.warning_diagnostics.length === fullReceipt.warning_count, "json-out should contain full diagnostics");

  const textOutRel = ".mdkg/receipts/warning-validate.txt";
  mdkg(binPath, ["validate", "--out", textOutRel, "--summary", "--json", "--limit", "5"], root);
  const textReport = fs.readFileSync(path.join(root, textOutRel), "utf8");
  assert(textReport.startsWith("warning:"), "--out should remain a warning text report");
  assert(textReport.includes("root:task-"), "--out should include node warning lines");

  const format = parseJson(
    mdkg(binPath, ["format", "--headings", "--dry-run", "--summary", "--json", "--limit", "20"], root).stdout
  );
  assert(format.action === "format.headings", "format headings action mismatch");
  assert(format.dry_run === true && format.applied === false, "format headings summary must be dry-run");
  assert(format.changed_count >= 250, "format headings should see warning fixture changes");
  assert(format.changes.length <= 20, "format headings changes exceed limit");
  assert(format.summary.truncated === true, "format headings summary should be truncated");
  assert(format.summary.by_node_type.some((entry) => entry.key === "task"), "format summary missing task aggregate");

  const changedOnly = parseJson(mdkg(binPath, ["validate", "--changed-only", "--summary", "--json", "--limit", "20"], root).stdout);
  assert(changedOnly.ok === true, "changed-only validate should remain ok");
  assert(changedOnly.warning_filter.mode === "changed-only", "changed-only filter missing");
  assert(changedOnly.warning_count >= 1000, "changed-only should include warning fixture files");

  mdkg(binPath, ["index"], root);
  const finalValidate = parseJson(mdkg(binPath, ["validate", "--summary", "--json", "--limit", "5"], root).stdout);
  assertSummaryReceipt(finalValidate, 5);

  return { smoke: "warning-ux", ok: true, temp_root: tempRoot, tarball: tarballPath };
}

function main() {
  const receipt = runInstalledSmoke({
    prefix: "mdkg-warning-ux-smoke-",
    prepare: (root, ownedCommands) => { commands = ownedCommands; return prepareInstall(root); },
    exercise: exerciseSmoke,
  });
  console.log(JSON.stringify(receipt, null, 2));
}

if (require.main === module) {
  try { main(); } catch (error) { console.error(error); process.exitCode = 1; }
}
