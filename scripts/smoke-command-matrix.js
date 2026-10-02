#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const { runInstalledSmoke } = require("./qualification-smoke");
const { HELP_TARGETS } = require("./cli_help_targets");
const { runCliOptionFixtures } = require("../tests/fixtures/cli-options.cjs");


const repoRoot = path.resolve(__dirname, "..");
const packageVersion = JSON.parse(fs.readFileSync(path.join(repoRoot, "package.json"), "utf8")).version;

let commands;

function run(binPath, args, options = {}) {
  const result = commands.node(binPath, args, options.cwd, options);
  return { status: result.status, stdout: result.stdout.trim(), stderr: result.stderr.trim(),
    combined: `${result.stdout}${result.stderr}` };
}

function assertIncludes(value, expected, label) {
  if (!value.includes(expected)) {
    throw new Error(`${label} missing expected text: ${expected}`);
  }
}

function assertExists(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`expected file not found: ${filePath}`);
  }
}

function assertNotExists(filePath) {
  if (fs.existsSync(filePath)) {
    throw new Error(`unexpected file found: ${filePath}`);
  }
}

function assertJsonOk(output, label) {
  const parsed = JSON.parse(output);
  if (parsed.ok === false) {
    throw new Error(`${label} reported ok=false`);
  }
  return parsed;
}

function writeUpdatedFrontmatter(filePath, replacements) {
  const content = fs.readFileSync(filePath, "utf8");
  const next = content.replace(/^---\n([\s\S]*?)\n---/, (_match, rawFrontmatter) => {
    const lines = rawFrontmatter.split(/\r?\n/).map((line) => {
      for (const [key, value] of Object.entries(replacements)) {
        if (line.startsWith(`${key}:`)) {
          return `${key}: ${value}`;
        }
      }
      return line;
    });
    return `---\n${lines.join("\n")}\n---`;
  });
  fs.writeFileSync(filePath, next, "utf8");
}

function parseReceipt(output) {
  return JSON.parse(output).node;
}

function mdkg(binPath, args, cwd) {
  return run(binPath, args, { cwd });
}

function initGit(root) {
  fs.mkdirSync(root, { recursive: true });
  commands.git(["init", "-q"], root);
}

function assertOnboardingDocs(root) {
  for (const name of ["AGENT_START.md", "llms.txt", "CLI_COMMAND_MATRIX.md"]) {
    assertExists(path.join(root, ".mdkg", name));
    assertNotExists(path.join(root, name));
  }
  assertNotExists(path.join(root, "AGENT_PROMPT_SNIPPET.md"));
  assertExists(path.join(root, "AGENTS.md"));
  assertExists(path.join(root, "CLAUDE.md"));

  const agentStart = fs.readFileSync(path.join(root, ".mdkg", "AGENT_START.md"), "utf8");
  assertIncludes(agentStart, "Authority and custody", ".mdkg/AGENT_START.md");
  assertIncludes(agentStart, "mdkg pack <qid> --pack-profile concise", ".mdkg/AGENT_START.md");
  assertIncludes(agentStart, "run `mdkg validate` before", ".mdkg/AGENT_START.md");
  for (const name of ["AGENTS.md", "CLAUDE.md"]) {
    assertIncludes(fs.readFileSync(path.join(root, name), "utf8"), ".mdkg/AGENT_START.md", name);
  }

  const llms = fs.readFileSync(path.join(root, ".mdkg", "llms.txt"), "utf8");
  assertIncludes(llms, "AGENT_START.md", "llms.txt");
}

function exerciseHelp(binPath, tempRoot) {
  for (const target of HELP_TARGETS) {
    const args = target[0] === "global" ? ["--help"] : ["help", ...target];
    const result = mdkg(binPath, args, tempRoot);
    assertIncludes(result.stdout, "mdkg", `help ${target.join(" ")}`);
  }
}

function exerciseInit(binPath, tempRoot) {
  const baseRoot = path.join(tempRoot, "init-graph-only");
  initGit(baseRoot);
  const baseInit = mdkg(binPath, ["init", "--graph-only"], baseRoot);
  assertIncludes(baseInit.stdout, "mdkg init complete", "init base");
  assertExists(path.join(baseRoot, ".mdkg", "config.json"));
  assertNotExists(path.join(baseRoot, "AGENT_START.md"));
  assertNotExists(path.join(baseRoot, "AGENTS.md"));
  mdkg(binPath, ["doctor"], baseRoot);
  mdkg(binPath, ["validate"], baseRoot);

  const defaultRoot = path.join(tempRoot, "init-default");
  initGit(defaultRoot);
  mdkg(binPath, ["init"], defaultRoot);
  assertOnboardingDocs(defaultRoot);
  mdkg(binPath, ["validate"], defaultRoot);

  const agentRoot = path.join(tempRoot, "init-agent");
  initGit(agentRoot);
  const agentInit = mdkg(binPath, ["init", "--agent"], agentRoot);
  assertIncludes(agentInit.stdout, "read .mdkg/AGENT_START.md", "init --agent");
  assertIncludes(agentInit.stdout, "agent bootstrap:", "init --agent summary");
  assertOnboardingDocs(agentRoot);
  assertExists(path.join(agentRoot, ".mdkg", "skills", "select-work-and-ground-context", "SKILL.md"));
  assertExists(path.join(agentRoot, ".agents", "skills", "select-work-and-ground-context", "SKILL.md"));
  assertExists(path.join(agentRoot, ".claude", "skills", "select-work-and-ground-context", "SKILL.md"));
  const agentGitignore = fs.readFileSync(path.join(agentRoot, ".gitignore"), "utf8");
  assertIncludes(agentGitignore, ".mdkg/archive/**/source/", ".gitignore");
  assertIncludes(agentGitignore, ".mdkg/db/runtime/", ".gitignore");
  mdkg(binPath, ["validate"], agentRoot);
  const dryRun = JSON.parse(mdkg(binPath, ["upgrade", "--dry-run", "--json"], agentRoot).stdout);
  if (dryRun.changes.length !== 0) {
    throw new Error(`fresh init --agent should not need upgrade: ${JSON.stringify(dryRun, null, 2)}`);
  }

  const rerun = mdkg(binPath, ["init", "--agent"], agentRoot);
  assertIncludes(rerun.stdout, "skipped", "repeated init --agent");

  const noIgnoresRoot = path.join(tempRoot, "init-no-ignores");
  initGit(noIgnoresRoot);
  mdkg(binPath, ["init", "--agent", "--no-update-ignores"], noIgnoresRoot);
  assertNotExists(path.join(noIgnoresRoot, ".gitignore"));
  assertNotExists(path.join(noIgnoresRoot, ".npmignore"));

  for (const removedFlag of ["--llm", "--agents", "--claude", "--omni"]) {
    const removedRoot = path.join(tempRoot, `removed-${removedFlag.slice(2)}`);
    initGit(removedRoot);
    const removed = commands.node(binPath, ["init", removedFlag], removedRoot, { allowFailure: true });
    if (removed.status === 0 || !removed.stderr.includes("use `mdkg init`") || !removed.stderr.includes("mdkg init --graph-only")) {
      throw new Error(`init ${removedFlag} did not report migration guidance`);
    }
    assertNotExists(path.join(removedRoot, ".mdkg"));
  }
}

function exerciseWorkflow(binPath, tempRoot) {
  const root = path.join(tempRoot, "workflow");
  initGit(root);
  mdkg(binPath, ["init", "--agent"], root);

  const task = parseReceipt(
    mdkg(
      binPath,
      ["new", "task", "Smoke Task", "--status", "todo", "--priority", "1", "--tags", "smoke,cli", "--json"],
      root
    ).stdout
  );
  const taskId = task.id;

  mdkg(binPath, ["show", taskId], root);
  mdkg(binPath, ["show", taskId, "--meta"], root);
  JSON.parse(mdkg(binPath, ["show", taskId, "--json"], root).stdout);
  assertIncludes(mdkg(binPath, ["show", taskId, "--xml"], root).stdout, "<command>show</command>", "show --xml");
  assertIncludes(mdkg(binPath, ["show", taskId, "--toon"], root).stdout, "show", "show --toon");
  assertIncludes(mdkg(binPath, ["show", taskId, "--md"], root).stdout, "Smoke Task", "show --md");

  JSON.parse(mdkg(binPath, ["list", "--type", "task", "--json"], root).stdout);
  assertIncludes(mdkg(binPath, ["list", "--type", "task", "--xml"], root).stdout, "<command>list</command>", "list --xml");
  assertIncludes(mdkg(binPath, ["search", "Smoke", "--toon"], root).stdout, "Smoke Task", "search --toon");
  assertIncludes(mdkg(binPath, ["search", "Smoke", "--md"], root).stdout, "Smoke Task", "search --md");

  mdkg(binPath, ["pack", "--list-profiles"], root);
  assertIncludes(mdkg(binPath, ["pack", taskId, "--dry-run", "--stats"], root).stdout, "dry-run: no files written", "pack dry-run");
  mdkg(binPath, ["pack", taskId, "-f", "json", "--out", ".mdkg/pack/smoke.json"], root);
  JSON.parse(fs.readFileSync(path.join(root, ".mdkg", "pack", "smoke.json"), "utf8"));
  mdkg(binPath, ["pack", taskId, "-f", "xml", "--out", ".mdkg/pack/smoke.xml"], root);
  assertIncludes(fs.readFileSync(path.join(root, ".mdkg", "pack", "smoke.xml"), "utf8"), "<pack>", "pack xml");
  mdkg(binPath, ["pack", taskId, "-f", "toon", "--out", ".mdkg/pack/smoke.toon"], root);
  assertIncludes(fs.readFileSync(path.join(root, ".mdkg", "pack", "smoke.toon"), "utf8"), "Smoke Task", "pack toon");

  mdkg(
    binPath,
    [
      "skill",
      "new",
      "review-loop",
      "Review Loop",
      "--description",
      "use when reviewing smoke work",
      "--tags",
      "stage:review,smoke",
      "--json",
    ],
    root
  );
  JSON.parse(mdkg(binPath, ["skill", "list", "--json"], root).stdout);
  assertIncludes(mdkg(binPath, ["skill", "search", "review", "--xml"], root).stdout, "review-loop", "skill search --xml");
  assertIncludes(mdkg(binPath, ["skill", "show", "review-loop", "--toon"], root).stdout, "review-loop", "skill show --toon");
  assertJsonOk(mdkg(binPath, ["skill", "validate", "review-loop", "--json"], root).stdout, "skill validate");
  mdkg(binPath, ["skill", "sync", "--json"], root);
  const skillsCapabilities = JSON.parse(mdkg(binPath, ["capability", "list", "--kind", "skill", "--json"], root).stdout);
  if (!skillsCapabilities.items.some((item) => item.slug === "review-loop")) {
    throw new Error("capability list did not include review-loop skill");
  }

  mdkg(binPath, ["task", "start", taskId, "--run-id", "smoke-run", "--note", "started", "--json"], root);
  mdkg(binPath, ["task", "update", taskId, "--add-artifacts", "artifact://smoke", "--add-tags", "verified", "--json"], root);
  mdkg(binPath, ["task", "done", taskId, "--checkpoint", "Smoke task done", "--json"], root);
  mdkg(binPath, ["event", "enable", "--json"], root);
  mdkg(binPath, ["event", "append", "--kind", "RUN_COMPLETED", "--status", "ok", "--refs", taskId, "--notes", "smoke", "--json"], root);
  mdkg(binPath, ["checkpoint", "new", "Standalone smoke checkpoint", "--json"], root);
  mdkg(binPath, ["format"], root);

  const spec = parseReceipt(mdkg(binPath, ["new", "spec", "Image Worker", "--id", "agent.image-worker", "--json"], root).stdout);
  const work = parseReceipt(mdkg(binPath, ["new", "work", "Generate Image", "--id", "work.generate-image", "--json"], root).stdout);

  const workContractRef = `${path.basename(path.dirname(work.path))}/WORK.md`;
  writeUpdatedFrontmatter(path.join(root, spec.path), {
    spec_kind: "agent",
    role: "subagent",
    runtime_mode: "orchestrated",
    work_contracts: `[${workContractRef}]`,
    relates: "[work.generate-image]",
  });
  writeUpdatedFrontmatter(path.join(root, work.path), {
    agent_id: "agent.image-worker",
    subagent_refs: "[agent.image-worker]",
    relates: "[agent.image-worker]",
  });
  // Complete each authored mirror before the next allocation admission reads it.
  // --no-reindex does not waive current-source reference integrity.
  const order = parseReceipt(mdkg(binPath, ["new", "work_order", "Generate Image Order", "--id", "order.generate-image-1", "--no-reindex", "--json"], root).stdout);
  writeUpdatedFrontmatter(path.join(root, order.path), {
    work_id: "work.generate-image",
    work_version: "0.1.0",
    order_status: "completed",
    relates: "[work.generate-image]",
  });
  const receipt = parseReceipt(mdkg(binPath, ["new", "receipt", "Generate Image Receipt", "--id", "receipt.generate-image-1", "--no-reindex", "--json"], root).stdout);
  writeUpdatedFrontmatter(path.join(root, receipt.path), {
    work_order_id: "order.generate-image-1",
    relates: "[order.generate-image-1]",
  });
  const feedback = parseReceipt(mdkg(binPath, ["new", "feedback", "Image Feedback", "--id", "feedback.image-quality-1", "--no-reindex", "--json"], root).stdout);
  writeUpdatedFrontmatter(path.join(root, feedback.path), {
    target_id: "work.generate-image",
    feedback_status: "triaged",
    relates: "[work.generate-image, receipt.generate-image-1]",
  });
  const dispute = parseReceipt(mdkg(binPath, ["new", "dispute", "Image Dispute", "--id", "dispute.image-quality-1", "--no-reindex", "--json"], root).stdout);
  writeUpdatedFrontmatter(path.join(root, dispute.path), {
    work_order_id: "order.generate-image-1",
    receipt_id: "receipt.generate-image-1",
    relates: "[order.generate-image-1, receipt.generate-image-1]",
  });
  const proposal = parseReceipt(mdkg(binPath, ["new", "proposal", "Review Loop Proposal", "--id", "proposal.review-loop-1", "--no-reindex", "--json"], root).stdout);
  writeUpdatedFrontmatter(path.join(root, proposal.path), {
    target_id: "skill.review-loop",
    proposal_kind: "skill_update",
    evidence_refs: "[feedback.image-quality-1, receipt.generate-image-1, skill.review-loop]",
    relates: "[feedback.image-quality-1, receipt.generate-image-1, skill.review-loop]",
  });

  mdkg(binPath, ["index"], root);
  const emptySubgraphs = JSON.parse(mdkg(binPath, ["subgraph", "list", "--json"], root).stdout);
  if (emptySubgraphs.count !== 0) {
    throw new Error("fresh matrix workspace should not have subgraphs configured");
  }
  const workCapabilities = JSON.parse(mdkg(binPath, ["capability", "search", "image", "--kind", "work", "--json"], root).stdout);
  if (!workCapabilities.items.some((item) => item.id === "work.generate-image")) {
    throw new Error("capability search did not include generated WORK.md");
  }
  JSON.parse(mdkg(binPath, ["capability", "show", "review-loop", "--json"], root).stdout);
  mdkg(binPath, ["validate"], root);
  assertJsonOk(mdkg(binPath, ["doctor", "--json"], root).stdout, "doctor");
  assertIncludes(mdkg(binPath, ["guide"], root).stdout, "mdkg", "guide");
  mdkg(binPath, ["next"], root);

  const secondary = path.join(root, "secondary-workspace");
  initGit(secondary);
  mdkg(binPath, ["init"], secondary);
  mdkg(binPath, ["workspace", "add", "secondary", "secondary-workspace", "--visibility", "internal", "--json"], root);
  JSON.parse(mdkg(binPath, ["workspace", "ls", "--json"], root).stdout);
  mdkg(binPath, ["workspace", "disable", "secondary", "--json"], root);
  mdkg(binPath, ["workspace", "enable", "secondary", "--json"], root);
  mdkg(binPath, ["workspace", "rm", "secondary", "--json"], root);
  mdkg(binPath, ["validate"], root);
}

function prepareInstall(tempRoot) {
  const packDir = path.join(tempRoot, "pack");
  const prefix = path.join(tempRoot, "npm-prefix");
  fs.mkdirSync(packDir, { recursive: true });
  fs.mkdirSync(prefix, { recursive: true });

  const packOutput = commands.npm(["pack", repoRoot, "--silent", "--dry-run=false", "--pack-destination", packDir], {
    cwd: tempRoot,
  }).stdout;
  const tarballName = packOutput
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .pop();
  if (!tarballName) {
    throw new Error("unable to determine npm pack output tarball");
  }
  const tarballPath = path.join(packDir, path.basename(tarballName));
  assertExists(tarballPath);

  return { tarballPath, install() {
    const install = commands.npm(["install", "-g", tarballPath, "--prefix", prefix, "--foreground-scripts", "--offline"], {
      cwd: tempRoot,
      env: { npm_config_prefix: prefix },
    });
    assertIncludes(`${install.stdout}${install.stderr}`, `mdkg ${packageVersion} installed.`, "postinstall");
    assertIncludes(`${install.stdout}${install.stderr}`, "mdkg --help", "postinstall");

    const binPath = process.platform === "win32"
      ? path.join(prefix, "mdkg.cmd")
      : path.join(prefix, "bin", "mdkg");
    assertExists(binPath);

    const packageRoot = process.platform === "win32"
      ? path.join(prefix, "node_modules", "mdkg")
      : path.join(prefix, "lib", "node_modules", "mdkg");
    assertExists(path.join(packageRoot, "dist", "command-contract.json"));
    return { binPath, tarballPath, packageRoot };
  } };
}
function runSmoke() {
  const receipt = runInstalledSmoke({
    prefix: "mdkg-command-matrix-",
    prepare(tempRoot, ownedCommands) { commands = ownedCommands; return prepareInstall(tempRoot); },
    exercise(tempRoot, { binPath, tarballPath, packageRoot }) {
    const version = mdkg(binPath, ["--version"], tempRoot).stdout;
    if (version !== packageVersion) throw new Error(`expected mdkg version ${packageVersion}, got ${version}`);
    exerciseHelp(binPath, tempRoot);
    exerciseInit(binPath, tempRoot);
    exerciseWorkflow(binPath, tempRoot);
    const option_qualification = runCliOptionFixtures({
      packageRoot, root: path.join(tempRoot, "option-qualification"), ownedRoot: tempRoot, commands,
    });
    return { ok: true, smoke: "command-matrix", version, option_qualification };
    },
  });
  console.log(JSON.stringify(receipt));
}

if (require.main === module) {
  try { runSmoke(); }
  catch (error) { console.error(error instanceof Error ? error.message : String(error)); process.exitCode = 1; }
}
