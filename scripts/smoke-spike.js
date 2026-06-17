#!/usr/bin/env node

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const repoRoot = path.resolve(__dirname, "..");
const tempBase = fs.existsSync("/private/tmp") ? "/private/tmp" : os.tmpdir();
const NPM_CMD = process.env.npm_execpath || (process.platform === "win32" ? "npm.cmd" : "npm");
const GIT_CMD = process.env.GIT || (process.platform === "win32" ? "git.exe" : "git");

function commandEnv(extra = {}) {
  const npmCache = process.env.NPM_CONFIG_CACHE || path.join(tempBase, "mdkg-npm-cache");
  fs.mkdirSync(npmCache, { recursive: true });
  return {
    ...process.env,
    NPM_CONFIG_CACHE: npmCache,
    npm_config_cache: npmCache,
    NPM_CONFIG_DRY_RUN: "false",
    npm_config_dry_run: "false",
    ...extra,
  };
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd || repoRoot,
    env: commandEnv(options.env || {}),
    encoding: "utf8",
    stdio: "pipe",
  });
  if (result.status !== 0) {
    throw new Error(
      [
        `command failed: ${command} ${args.join(" ")}`,
        `cwd: ${options.cwd || repoRoot}`,
        `exit: ${result.status}`,
        `stdout:\n${result.stdout}`,
        `stderr:\n${result.stderr}`,
      ].join("\n")
    );
  }
  return { stdout: result.stdout.trim(), stderr: result.stderr.trim(), status: result.status };
}

function runExpectFailure(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd || repoRoot,
    env: commandEnv(options.env || {}),
    encoding: "utf8",
    stdio: "pipe",
  });
  if (result.status === 0) {
    throw new Error(`command unexpectedly succeeded: ${command} ${args.join(" ")}`);
  }
  return { stdout: result.stdout.trim(), stderr: result.stderr.trim(), status: result.status };
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function assertExists(filePath) {
  assert(fs.existsSync(filePath), `expected path to exist: ${filePath}`);
}

function assertIncludes(haystack, needle, label) {
  assert(haystack.includes(needle), `${label} missing ${needle}`);
}

function parseJson(output) {
  return JSON.parse(output);
}

function mdkg(binPath, args, cwd) {
  return run(binPath, args, { cwd }).stdout;
}

function packAndInstall(tempRoot) {
  const packDir = path.join(tempRoot, "pack");
  const prefix = path.join(tempRoot, "prefix");
  fs.mkdirSync(packDir, { recursive: true });
  fs.mkdirSync(prefix, { recursive: true });

  const packOutput = run(NPM_CMD, ["pack", "--silent", "--dry-run=false", "--pack-destination", packDir]).stdout;
  const tarball = packOutput
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .pop();
  assert(tarball, "npm pack did not return a tarball");
  const tarballPath = path.join(packDir, path.basename(tarball));
  assertExists(tarballPath);

  run(NPM_CMD, ["install", "-g", tarballPath, "--prefix", prefix, "--foreground-scripts"], {
    cwd: tempRoot,
    env: { npm_config_prefix: prefix },
  });

  const binPath = process.platform === "win32" ? path.join(prefix, "mdkg.cmd") : path.join(prefix, "bin", "mdkg");
  const packageRoot = path.join(prefix, "lib", "node_modules", "mdkg");
  assertExists(binPath);
  assertExists(path.join(packageRoot, "dist", "init", "templates", "default", "spike.md"));
  return { binPath, packageRoot, tarballPath };
}

function replaceFrontmatterValue(filePath, key, value) {
  const content = fs.readFileSync(filePath, "utf8");
  const next = content.replace(/^---\n([\s\S]*?)\n---/, (_match, rawFrontmatter) => {
    const lines = rawFrontmatter.split(/\r?\n/);
    let replaced = false;
    const updated = lines.map((line) => {
      if (line.startsWith(`${key}:`)) {
        replaced = true;
        return `${key}: ${value}`;
      }
      return line;
    });
    if (!replaced) {
      updated.push(`${key}: ${value}`);
    }
    return `---\n${updated.join("\n")}\n---`;
  });
  fs.writeFileSync(filePath, next, "utf8");
}

function replaceBody(filePath, body) {
  const content = fs.readFileSync(filePath, "utf8");
  const next = content.replace(/^(---\n[\s\S]*?\n---\n)[\s\S]*$/, `$1${body}`);
  fs.writeFileSync(filePath, next, "utf8");
}

function spikeDocument({
  id,
  title,
  status = "todo",
  priority = "1",
  blockedBy = [],
  artifacts = [],
  body = [
    "# Research Question",
    "",
    "What needs research?",
    "",
    "# Context And Constraints",
    "",
    "# Search Plan",
    "",
    "# Findings",
    "",
    "# Options And Tradeoffs",
    "",
    "# Recommendation",
    "",
    "# Follow-Up Nodes To Create",
    "",
    "# Skill Candidates",
    "",
    "# Evidence And Sources",
    "",
  ].join("\n"),
}) {
  return [
    "---",
    `id: ${id}`,
    "type: spike",
    `title: ${title}`,
    `status: ${status}`,
    `priority: ${priority}`,
    "tags: []",
    "owners: []",
    "links: []",
    `artifacts: [${artifacts.join(", ")}]`,
    "relates: []",
    `blocked_by: [${blockedBy.join(", ")}]`,
    "blocks: []",
    "refs: []",
    "aliases: []",
    "skills: []",
    "created: 2026-06-11",
    "updated: 2026-06-11",
    "---",
    "",
    body,
  ].join("\n");
}

function skillDirNames(root) {
  const skillsRoot = path.join(root, ".mdkg", "skills");
  if (!fs.existsSync(skillsRoot)) {
    return [];
  }
  return fs
    .readdirSync(skillsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

function assertPackageDocs(packageRoot, binPath, root) {
  const rootReadme = fs.readFileSync(path.join(packageRoot, "README.md"), "utf8");
  const seededReadme = fs.readFileSync(path.join(packageRoot, "dist", "init", "README.md"), "utf8");
  const matrix = fs.readFileSync(path.join(packageRoot, "CLI_COMMAND_MATRIX.md"), "utf8");
  assertIncludes(rootReadme, "mdkg new spike", "root README");
  assertIncludes(rootReadme, "Research spikes", "root README");
  assertIncludes(rootReadme, "perform web search", "root README");
  assertIncludes(rootReadme, "SKILL.md", "root README");
  assertIncludes(seededReadme, "mdkg new spike", "seeded README");
  assertIncludes(seededReadme, "Spikes use the existing task lifecycle", "seeded README");
  assertIncludes(matrix, "mdkg new spike", "command matrix");
  assertIncludes(matrix, "mdkg task start|update|done <spike-id>", "command matrix");

  const newHelp = mdkg(binPath, ["help", "new"], root);
  assertIncludes(newHelp, "goal epic feat task bug spike checkpoint test", "new help");
  assertIncludes(newHelp, "spikes do not run web search", "new help");
  const taskHelp = mdkg(binPath, ["help", "task"], root);
  assertIncludes(taskHelp, "feat, task, bug, test, and spike nodes", "task help");
  assertIncludes(taskHelp, "no separate `mdkg spike ...` command family", "task help");

  const spikeHelp = mdkg(binPath, ["help", "spike"], root);
  assert(!spikeHelp.includes("mdkg spike"), "help should not expose a mdkg spike command namespace");
}

function assertMalformedSpikeUx(binPath, tempRoot) {
  const root = path.join(tempRoot, "malformed-repo");
  fs.mkdirSync(root, { recursive: true });
  run(GIT_CMD, ["init", "-q"], { cwd: root });
  mdkg(binPath, ["init", "--agent"], root);

  const workRoot = path.join(root, ".mdkg", "work");
  fs.writeFileSync(
    path.join(workRoot, "spike-bad-status.md"),
    spikeDocument({
      id: "spike-1",
      title: "bad spike status",
      status: "researching",
    }),
    "utf8"
  );
  fs.writeFileSync(
    path.join(workRoot, "spike-broken-ref.md"),
    spikeDocument({
      id: "spike-2",
      title: "broken spike refs",
      blockedBy: ["task-999"],
      artifacts: ["archive://archive.missing"],
      body: ["# Research Question", "", "What refs are broken?"].join("\n"),
    }),
    "utf8"
  );

  const invalid = runExpectFailure(binPath, ["validate", "--json"], { cwd: root });
  const invalidReceipt = parseJson(invalid.stdout);
  assert(invalidReceipt.ok === false, "malformed spike validate unexpectedly passed");
  assert(
    invalidReceipt.errors.some((error) => error.includes("spike-bad-status.md") && error.includes("status must be one of")),
    "validate json missing bad status diagnostic"
  );
  assert(
    invalidReceipt.errors.some((error) => error.includes("root:spike-2: blocked_by references missing node root:task-999")),
    "validate json missing broken spike ref diagnostic"
  );
  assert(
    invalidReceipt.warnings.some((warning) => warning.includes("root:spike-2") && warning.includes("Search Plan")),
    "validate json missing spike template-shape warning"
  );

  const refsPlan = parseJson(mdkg(binPath, ["fix", "plan", "--family", "refs", "--target", "spike-2", "--json"], root));
  const refReasons = refsPlan.proposed_changes.map((change) => change.reason);
  assert(refsPlan.summary.apply_supported === false, "fix refs plan should remain read-only");
  assert(refReasons.includes("graph_ref_missing"), "fix refs plan missing graph ref guidance");
  assert(refReasons.includes("archive_ref_missing"), "fix refs plan missing archive ref guidance");
  assert(
    refsPlan.proposed_changes.some(
      (change) => change.reason === "archive_ref_missing" && change.refs.includes("archive://archive.missing")
    ),
    "fix refs plan did not include missing archive ref"
  );

  fs.writeFileSync(
    path.join(workRoot, "spike-copy.md"),
    spikeDocument({
      id: "spike-2",
      title: "duplicate spike id",
    }),
    "utf8"
  );
  const idsPlan = parseJson(mdkg(binPath, ["fix", "plan", "--family", "ids", "--target", "spike-2", "--json"], root));
  assert(idsPlan.summary.apply_supported === true, "fix ids plan should be apply-capable");
  assert(
    idsPlan.proposed_changes.some(
      (change) => change.reason === "duplicate_id" && change.after.candidate_id === "spike-3"
    ),
    "fix ids plan missing deterministic duplicate spike id guidance"
  );

  return root;
}

function main() {
  const tempRoot = fs.mkdtempSync(path.join(tempBase, "mdkg-spike."));
  const { binPath, packageRoot, tarballPath } = packAndInstall(tempRoot);
  const root = path.join(tempRoot, "repo");
  fs.mkdirSync(root, { recursive: true });
  run(GIT_CMD, ["init", "-q"], { cwd: root });

  mdkg(binPath, ["init", "--agent"], root);
  assertPackageDocs(packageRoot, binPath, root);
  mdkg(binPath, ["index"], root);

  const initialSkills = skillDirNames(root);
  const created = parseJson(
    mdkg(binPath, ["new", "spike", "research mdkg.dev launch workflow", "--status", "todo", "--priority", "1", "--json"], root)
  ).node;
  assert(created.id === "spike-1", "expected first spike id");
  assert(created.type === "spike", "expected spike type");
  assertExists(path.join(root, created.path));

  const spikePath = path.join(root, created.path);
  replaceBody(
    spikePath,
    [
      "# Research Question",
      "",
      "What should mdkg.dev teach first for high-trust agent workflows?",
      "",
      "# Context And Constraints",
      "",
      "- Keep docs grounded in local-first mdkg commands.",
      "",
      "# Search Plan",
      "",
      "- Review current README and command matrix.",
      "",
      "# Findings",
      "",
      "- Users need a concrete spike-to-task handoff.",
      "",
      "# Options And Tradeoffs",
      "",
      "- Guide-first launch: clearer onboarding, more docs work.",
      "",
      "# Recommendation",
      "",
      "Create a quickstart guide and validate examples before launch.",
      "",
      "# Follow-Up Nodes To Create",
      "",
      "- task: write mdkg.dev spike quickstart",
      "- test: validate mdkg.dev spike examples",
      "",
      "# Skill Candidates",
      "",
      "- author-mdkg-dev-launch-skill",
      "",
      "# Data Structures And Algorithms Notes",
      "",
      "- Keep spikes as normal graph nodes for deterministic traversal.",
      "",
      "# UX Notes",
      "",
      "- Keep lifecycle under mdkg task commands.",
      "",
      "# Security Notes",
      "",
      "- Do not auto-run web search or create files from spike content.",
      "",
      "# mdkg.dev Launch Implications",
      "",
      "- Launch docs should show spike -> task/test follow-up flow.",
      "",
      "# Evidence And Sources",
      "",
      "- artifact://smoke-spike/local-doc-review",
      "",
    ].join("\n")
  );

  const started = parseJson(mdkg(binPath, ["task", "start", "spike-1", "--json"], root));
  assert(started.task.status === "progress", "spike did not enter progress");
  mdkg(binPath, ["task", "update", "spike-1", "--status", "review", "--add-refs", "task-1", "--json"], root);

  const goal = parseJson(mdkg(binPath, ["new", "goal", "complete spike research workflow", "--json"], root)).node;
  replaceFrontmatterValue(path.join(root, goal.path), "scope_refs", "[spike-1]");
  replaceFrontmatterValue(path.join(root, goal.path), "active_node", "spike-1");
  mdkg(binPath, ["index"], root);
  const next = parseJson(mdkg(binPath, ["goal", "next", "goal-1", "--json"], root));
  assert(next.node.qid === "root:spike-1", "goal next did not route to spike");
  const claimed = parseJson(mdkg(binPath, ["goal", "claim", "goal-1", "spike-1", "--json"], root));
  assert(claimed.node.qid === "root:spike-1", "goal claim did not accept spike");

  const listed = parseJson(mdkg(binPath, ["list", "--type", "spike", "--json", "--no-cache"], root));
  assert(listed.count === 1 && listed.items[0].id === "spike-1", "list --type spike failed");
  const searched = parseJson(mdkg(binPath, ["search", "mdkg.dev launch workflow", "--json", "--no-cache"], root));
  assert(searched.items.some((item) => item.id === "spike-1"), "search did not find spike");
  const shown = parseJson(mdkg(binPath, ["show", "spike-1", "--json", "--no-cache"], root));
  assert(shown.item.type === "spike", "show did not return spike");
  assertIncludes(shown.item.body, "# Skill Candidates", "show body");
  const markdownShow = mdkg(binPath, ["show", "spike-1", "--md", "--no-cache"], root);
  assertIncludes(markdownShow, "# Research Question", "markdown show");
  const toonShow = parseJson(mdkg(binPath, ["show", "spike-1", "--toon", "--no-cache"], root));
  assert(toonShow.item.type === "spike", "toon show did not return spike");
  assertIncludes(toonShow.item.body, "# Skill Candidates", "toon show body");
  const xmlList = mdkg(binPath, ["list", "--type", "spike", "--xml", "--no-cache"], root);
  assertIncludes(xmlList, "<type>spike</type>", "xml list");
  assertIncludes(xmlList, "<id>spike-1</id>", "xml list");
  const markdownSearch = mdkg(binPath, ["search", "mdkg.dev launch workflow", "--type", "spike", "--md", "--no-cache"], root);
  assertIncludes(markdownSearch, "- type: spike", "markdown search");
  assertIncludes(markdownSearch, "- id: spike-1", "markdown search");

  mdkg(binPath, ["pack", "spike-1", "--format", "json", "--out", ".mdkg/pack/spike.json"], root);
  const pack = parseJson(fs.readFileSync(path.join(root, ".mdkg", "pack", "spike.json"), "utf8"));
  assert(pack.nodes[0].qid === "root:spike-1", "spike was not pack root");
  mdkg(binPath, ["pack", "spike-1", "--format", "md", "--out", ".mdkg/pack/spike.md"], root);
  const packMd = fs.readFileSync(path.join(root, ".mdkg", "pack", "spike.md"), "utf8");
  assertIncludes(packMd, "root: root:spike-1", "markdown pack");
  assertIncludes(packMd, "type: spike", "markdown pack");
  assertIncludes(packMd, "# Research Question", "markdown pack");
  mdkg(binPath, ["pack", "spike-1", "--format", "xml", "--out", ".mdkg/pack/spike.xml"], root);
  const packXml = fs.readFileSync(path.join(root, ".mdkg", "pack", "spike.xml"), "utf8");
  assertIncludes(packXml, "<root>root:spike-1</root>", "xml pack");
  assertIncludes(packXml, "<type>spike</type>", "xml pack");
  assertIncludes(packXml, "# Research Question", "xml pack");
  mdkg(binPath, ["pack", "spike-1", "--format", "toon", "--out", ".mdkg/pack/spike.toon"], root);
  const packToon = parseJson(fs.readFileSync(path.join(root, ".mdkg", "pack", "spike.toon"), "utf8"));
  assert(packToon.nodes[0].qid === "root:spike-1", "toon pack did not use spike as root");

  const followTask = parseJson(
    mdkg(binPath, ["new", "task", "write mdkg.dev spike quickstart", "--parent", "spike-1", "--status", "todo", "--priority", "1", "--json"], root)
  ).node;
  const followTest = parseJson(
    mdkg(binPath, ["new", "test", "validate mdkg.dev spike examples", "--parent", "spike-1", "--status", "todo", "--priority", "1", "--json"], root)
  ).node;
  assert(followTask.id === "task-1", "follow-up task was not created");
  assert(followTest.id === "test-1", "follow-up test was not created");
  assert(!skillDirNames(root).some((name) => !initialSkills.includes(name)), "spike workflow unexpectedly created a skill");

  const done = parseJson(mdkg(binPath, ["task", "done", "spike-1", "--json"], root));
  assert(done.task.status === "done", "spike was not completed");
  const validate = parseJson(mdkg(binPath, ["validate", "--json"], root));
  assert(validate.ok === true, "validate failed after spike workflow");
  const status = parseJson(mdkg(binPath, ["status", "--json"], root));
  assert(status.action === "status", "status json failed");
  const malformedRoot = assertMalformedSpikeUx(binPath, tempRoot);

  console.log(
    JSON.stringify(
      {
        ok: true,
        smoke: "spike",
        temp_root: tempRoot,
        repo: root,
        tarball: tarballPath,
        spike: "root:spike-1",
        malformed_repo: malformedRoot,
        follow_up_task: `root:${followTask.id}`,
        follow_up_test: `root:${followTest.id}`,
        skill_count: initialSkills.length,
      },
      null,
      2
    )
  );
}

main();
