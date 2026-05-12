#!/usr/bin/env node

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const NPM_CMD = process.platform === "win32" ? "npm.cmd" : "npm";
const GIT_CMD = process.platform === "win32" ? "git.exe" : "git";

const HELP_TARGETS = [
  ["global"],
  ["init"],
  ["upgrade"],
  ["new"],
  ["show"],
  ["list"],
  ["search"],
  ["pack"],
  ["skill"],
  ["skill", "new"],
  ["skill", "list"],
  ["skill", "show"],
  ["skill", "search"],
  ["skill", "validate"],
  ["skill", "sync"],
  ["task"],
  ["task", "start"],
  ["task", "update"],
  ["task", "done"],
  ["event"],
  ["event", "enable"],
  ["event", "append"],
  ["next"],
  ["checkpoint"],
  ["validate"],
  ["format"],
  ["doctor"],
  ["workspace"],
  ["index"],
  ["guide"],
];

const repoRoot = path.resolve(__dirname, "..");
const packageVersion = JSON.parse(fs.readFileSync(path.join(repoRoot, "package.json"), "utf8")).version;
const tempBase = fs.existsSync("/private/tmp") ? "/private/tmp" : os.tmpdir();

function commandEnv(extra = {}) {
  const npmCache = extra.NPM_CONFIG_CACHE || process.env.NPM_CONFIG_CACHE || path.join(tempBase, "mdkg-npm-cache");
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
    cwd: options.cwd,
    env: commandEnv(options.env),
    encoding: "utf8",
    stdio: "pipe",
  });
  if (result.status !== 0) {
    throw new Error(
      [
        `command failed: ${command} ${args.join(" ")}`,
        `cwd: ${options.cwd || process.cwd()}`,
        `exit: ${result.status}`,
        `stdout:\n${result.stdout}`,
        `stderr:\n${result.stderr}`,
      ].join("\n")
    );
  }
  return {
    stdout: result.stdout.trim(),
    stderr: result.stderr.trim(),
    combined: `${result.stdout}${result.stderr}`.trim(),
  };
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
  run(GIT_CMD, ["init", "-q"], { cwd: root });
}

function assertOnboardingDocs(root, expectWrappers) {
  assertExists(path.join(root, "AGENT_START.md"));
  assertExists(path.join(root, "llms.txt"));
  assertExists(path.join(root, "CLI_COMMAND_MATRIX.md"));
  assertNotExists(path.join(root, "AGENT_PROMPT_SNIPPET.md"));
  if (expectWrappers) {
    assertExists(path.join(root, "AGENTS.md"));
    assertExists(path.join(root, "CLAUDE.md"));
  }

  const agentStart = fs.readFileSync(path.join(root, "AGENT_START.md"), "utf8");
  assertIncludes(agentStart, "Agent operating prompt", "AGENT_START.md");
  assertIncludes(agentStart, "Prefer `mdkg pack <id>`", "AGENT_START.md");
  assertIncludes(agentStart, "Run `mdkg validate` before marking work done", "AGENT_START.md");

  const llms = fs.readFileSync(path.join(root, "llms.txt"), "utf8");
  assertIncludes(llms, "AGENT_START.md", "llms.txt");
}

function exerciseHelp(binPath) {
  for (const target of HELP_TARGETS) {
    const args = target[0] === "global" ? ["--help"] : ["help", ...target];
    const result = mdkg(binPath, args, repoRoot);
    assertIncludes(result.stdout, "mdkg", `help ${target.join(" ")}`);
  }
}

function exerciseInit(binPath, tempRoot) {
  const llmRoot = path.join(tempRoot, "init-llm");
  initGit(llmRoot);
  const llmInit = mdkg(binPath, ["init", "--llm"], llmRoot);
  assertIncludes(llmInit.stdout, "read AGENT_START.md", "init --llm");
  assertOnboardingDocs(llmRoot, true);
  mdkg(binPath, ["validate"], llmRoot);

  const agentRoot = path.join(tempRoot, "init-agent");
  initGit(agentRoot);
  const agentInit = mdkg(binPath, ["init", "--agent"], agentRoot);
  assertIncludes(agentInit.stdout, "read AGENT_START.md", "init --agent");
  assertOnboardingDocs(agentRoot, false);
  assertExists(path.join(agentRoot, ".mdkg", "skills", "select-work-and-ground-context", "SKILL.md"));
  assertExists(path.join(agentRoot, ".agents", "skills", "select-work-and-ground-context", "SKILL.md"));
  assertExists(path.join(agentRoot, ".claude", "skills", "select-work-and-ground-context", "SKILL.md"));
  mdkg(binPath, ["validate"], agentRoot);

  const fullRoot = path.join(tempRoot, "init-llm-agent");
  initGit(fullRoot);
  mdkg(binPath, ["init", "--llm", "--agent"], fullRoot);
  assertOnboardingDocs(fullRoot, true);
  assertExists(path.join(fullRoot, ".mdkg", "work", "events", "events.jsonl"));
  mdkg(binPath, ["validate"], fullRoot);

  const noIgnoresRoot = path.join(tempRoot, "init-no-ignores");
  initGit(noIgnoresRoot);
  mdkg(binPath, ["init", "--llm", "--no-update-ignores"], noIgnoresRoot);
  assertNotExists(path.join(noIgnoresRoot, ".gitignore"));
  assertNotExists(path.join(noIgnoresRoot, ".npmignore"));

  const removed = spawnSync(binPath, ["init", "--omni"], {
    cwd: tempRoot,
    env: commandEnv(),
    encoding: "utf8",
    stdio: "pipe",
  });
  if (removed.status === 0 || !removed.stderr.includes("use `mdkg init --agent`")) {
    throw new Error("init --omni did not report migration guidance");
  }
}

function exerciseWorkflow(binPath, tempRoot) {
  const root = path.join(tempRoot, "workflow");
  initGit(root);
  mdkg(binPath, ["init", "--llm", "--agent"], root);

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

  mdkg(binPath, ["task", "start", taskId, "--run-id", "smoke-run", "--note", "started", "--json"], root);
  mdkg(binPath, ["task", "update", taskId, "--add-artifacts", "artifact://smoke", "--add-tags", "verified", "--json"], root);
  mdkg(binPath, ["task", "done", taskId, "--checkpoint", "Smoke task done", "--json"], root);
  mdkg(binPath, ["event", "enable", "--json"], root);
  mdkg(binPath, ["event", "append", "--kind", "RUN_COMPLETED", "--status", "ok", "--refs", taskId, "--notes", "smoke", "--json"], root);
  mdkg(binPath, ["checkpoint", "new", "Standalone smoke checkpoint", "--json"], root);
  mdkg(binPath, ["format"], root);

  const spec = parseReceipt(mdkg(binPath, ["new", "spec", "Image Worker", "--id", "agent.image-worker", "--json"], root).stdout);
  const work = parseReceipt(mdkg(binPath, ["new", "work", "Generate Image", "--id", "work.generate-image", "--json"], root).stdout);
  const order = parseReceipt(mdkg(binPath, ["new", "work_order", "Generate Image Order", "--id", "order.generate-image-1", "--no-reindex", "--json"], root).stdout);
  const receipt = parseReceipt(mdkg(binPath, ["new", "receipt", "Generate Image Receipt", "--id", "receipt.generate-image-1", "--no-reindex", "--json"], root).stdout);
  const feedback = parseReceipt(mdkg(binPath, ["new", "feedback", "Image Feedback", "--id", "feedback.image-quality-1", "--no-reindex", "--json"], root).stdout);
  const dispute = parseReceipt(mdkg(binPath, ["new", "dispute", "Image Dispute", "--id", "dispute.image-quality-1", "--no-reindex", "--json"], root).stdout);
  const proposal = parseReceipt(mdkg(binPath, ["new", "proposal", "Review Loop Proposal", "--id", "proposal.review-loop-1", "--no-reindex", "--json"], root).stdout);

  const workContractRef = `${path.basename(path.dirname(work.path))}/WORK.md`;
  writeUpdatedFrontmatter(path.join(root, spec.path), {
    work_contracts: `[${workContractRef}]`,
    relates: "[work.generate-image]",
  });
  writeUpdatedFrontmatter(path.join(root, work.path), {
    agent_id: "agent.image-worker",
    pricing_model: "included",
    subagent_refs: "[agent.image-worker]",
    relates: "[agent.image-worker]",
  });
  writeUpdatedFrontmatter(path.join(root, order.path), {
    work_id: "work.generate-image",
    work_version: "0.1.0",
    order_status: "completed",
    relates: "[work.generate-image]",
  });
  writeUpdatedFrontmatter(path.join(root, receipt.path), {
    work_order_id: "order.generate-image-1",
    relates: "[order.generate-image-1]",
  });
  writeUpdatedFrontmatter(path.join(root, feedback.path), {
    target_id: "work.generate-image",
    feedback_status: "triaged",
    relates: "[work.generate-image, receipt.generate-image-1]",
  });
  writeUpdatedFrontmatter(path.join(root, dispute.path), {
    work_order_id: "order.generate-image-1",
    receipt_id: "receipt.generate-image-1",
    relates: "[order.generate-image-1, receipt.generate-image-1]",
  });
  writeUpdatedFrontmatter(path.join(root, proposal.path), {
    target_id: "skill.review-loop",
    proposal_kind: "skill_update",
    evidence_refs: "[feedback.image-quality-1, receipt.generate-image-1, skill.review-loop]",
    relates: "[feedback.image-quality-1, receipt.generate-image-1, skill.review-loop]",
  });

  mdkg(binPath, ["index"], root);
  mdkg(binPath, ["validate"], root);
  assertJsonOk(mdkg(binPath, ["doctor", "--json"], root).stdout, "doctor");
  assertIncludes(mdkg(binPath, ["guide"], root).stdout, "mdkg", "guide");
  mdkg(binPath, ["next"], root);

  const secondary = path.join(root, "secondary-workspace");
  initGit(secondary);
  mdkg(binPath, ["init"], secondary);
  mdkg(binPath, ["workspace", "add", "secondary", "secondary-workspace", "--json"], root);
  JSON.parse(mdkg(binPath, ["workspace", "ls", "--json"], root).stdout);
  mdkg(binPath, ["workspace", "disable", "secondary", "--json"], root);
  mdkg(binPath, ["workspace", "enable", "secondary", "--json"], root);
  mdkg(binPath, ["workspace", "rm", "secondary", "--json"], root);
  mdkg(binPath, ["validate"], root);
}

function runSmoke() {
  let tempRoot;
  try {
    tempRoot = fs.mkdtempSync(path.join(tempBase, "mdkg-matrix-"));
    const packDir = path.join(tempRoot, "pack");
    const prefix = path.join(tempRoot, "npm-prefix");
    fs.mkdirSync(packDir, { recursive: true });
    fs.mkdirSync(prefix, { recursive: true });

    const packOutput = run(NPM_CMD, ["pack", "--silent", "--dry-run=false", "--pack-destination", packDir], {
      cwd: repoRoot,
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

    const install = run(NPM_CMD, ["install", "-g", tarballPath, "--prefix", prefix, "--foreground-scripts"], {
      cwd: tempRoot,
      env: { npm_config_prefix: prefix },
    });
    assertIncludes(install.combined, `mdkg ${packageVersion} installed.`, "postinstall");
    assertIncludes(install.combined, "mdkg --help", "postinstall");

    const binPath = process.platform === "win32"
      ? path.join(prefix, "mdkg.cmd")
      : path.join(prefix, "bin", "mdkg");
    assertExists(binPath);

    const version = mdkg(binPath, ["--version"], tempRoot).stdout;
    if (version !== packageVersion) {
      throw new Error(`expected mdkg version ${packageVersion}, got ${version}`);
    }

    exerciseHelp(binPath);
    exerciseInit(binPath, tempRoot);
    exerciseWorkflow(binPath, tempRoot);

    console.log("command matrix smoke passed");
    console.log(`version=${version}`);
    console.log(`tarball=${path.basename(tarballPath)}`);
  } finally {
    if (tempRoot && fs.existsSync(tempRoot)) {
      fs.rmSync(tempRoot, { recursive: true, force: true });
    }
  }
}

try {
  runSmoke();
} catch (err) {
  const message = err instanceof Error ? err.message : String(err);
  console.error(message);
  process.exit(1);
}
