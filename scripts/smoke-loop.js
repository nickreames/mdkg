#!/usr/bin/env node

const crypto = require("node:crypto");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const repoRoot = path.resolve(__dirname, "..");
const tempBase = fs.existsSync("/private/tmp") ? "/private/tmp" : os.tmpdir();
const NPM_CMD = process.platform === "win32" ? "npm.cmd" : "npm";
const GIT_CMD = process.platform === "win32" ? "git.exe" : "git";
const SEED_SLUGS = [
  "security-audit",
  "design-frontend-ux-audit",
  "backend-api-cli-bloat-audit",
  "tech-stack-best-practices-audit",
  "duplicate-code-and-linting-audit",
  "test-ci-skill-infrastructure-audit",
  "user-story-audit-and-recommendations",
];

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
    throw new Error(`${command} ${args.join(" ")} failed\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`);
  }
  return result.stdout.trim();
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function assertExists(filePath) {
  assert(fs.existsSync(filePath), `expected path to exist: ${filePath}`);
}

function hashFile(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function snapshotFiles(root) {
  const files = [];
  const visit = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const absolutePath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        visit(absolutePath);
      } else if (entry.isFile()) {
        files.push([path.relative(root, absolutePath), hashFile(absolutePath)]);
      }
    }
  };
  visit(root);
  return files;
}

function locateInstalledPackage(prefix) {
  const candidates = [
    path.join(prefix, "lib", "node_modules", "mdkg"),
    path.join(prefix, "node_modules", "mdkg"),
  ];
  const packageRoot = candidates.find((candidate) => fs.existsSync(path.join(candidate, "package.json")));
  assert(packageRoot, `installed mdkg package not found under ${prefix}`);
  return packageRoot;
}

function packAndInstall(tempRoot) {
  const packDir = path.join(tempRoot, "pack");
  const prefix = path.join(tempRoot, "prefix");
  fs.mkdirSync(packDir, { recursive: true });
  fs.mkdirSync(prefix, { recursive: true });
  const packOutput = run(NPM_CMD, ["pack", "--silent", "--dry-run=false", "--pack-destination", packDir]);
  const tarball = packOutput.split(/\r?\n/).map((line) => line.trim()).filter(Boolean).pop();
  assert(tarball, "npm pack did not return a tarball");
  const tarballPath = path.join(packDir, path.basename(tarball));
  assertExists(tarballPath);
  run(NPM_CMD, [
    "install",
    "-g",
    tarballPath,
    "--prefix",
    prefix,
    "--foreground-scripts",
    "--no-audit",
    "--no-fund",
  ], { cwd: tempRoot, env: { npm_config_prefix: prefix } });
  const binPath = process.platform === "win32" ? path.join(prefix, "mdkg.cmd") : path.join(prefix, "bin", "mdkg");
  assertExists(binPath);
  return { binPath, packageRoot: locateInstalledPackage(prefix), tarballPath };
}

function mdkg(binPath, args, cwd) {
  return run(binPath, args, { cwd });
}

function assertInstalledLoopPayload(packageRoot) {
  for (const relativePath of [
    "dist/commands/loop.js",
    "dist/commands/loop_descriptors.js",
    "dist/graph/loop_bindings.js",
    "dist/init/templates/default/loop.md",
    "dist/init/skills/default/pursue-mdkg-loop/SKILL.md",
  ]) {
    assertExists(path.join(packageRoot, relativePath));
  }
  for (const slug of SEED_SLUGS) {
    assertExists(path.join(packageRoot, "dist", "init", "templates", "loops", `${slug}.loop.md`));
  }
  const contract = JSON.parse(fs.readFileSync(path.join(packageRoot, "dist", "command-contract.json"), "utf8"));
  const commandKeys = new Set(contract.commands.map((command) => command.key));
  for (const key of ["loop", "loop list", "loop show", "loop fork", "loop plan", "loop next", "loop runs"]) {
    assert(commandKeys.has(key), `installed command contract is missing ${key}`);
  }
}

function main() {
  const tempRoot = fs.mkdtempSync(path.join(tempBase, "mdkg-loop-smoke-"));
  try {
    const { binPath, packageRoot } = packAndInstall(tempRoot);
    assertInstalledLoopPayload(packageRoot);

    const root = path.join(tempRoot, "repo");
    fs.mkdirSync(root, { recursive: true });
    run(GIT_CMD, ["init", "-q"], { cwd: root });
    mdkg(binPath, ["init", "--agent"], root);

    const config = JSON.parse(fs.readFileSync(path.join(root, ".mdkg", "config.json"), "utf8"));
    assert(config.index.backend === "sqlite", "installed init did not select the SQLite index backend");
    for (const slug of SEED_SLUGS) {
      assertExists(path.join(root, ".mdkg", "templates", "loops", `${slug}.loop.md`));
    }

    mdkg(binPath, ["index"], root);
    const scope = JSON.parse(mdkg(binPath, [
      "new",
      "goal",
      "Installed loop smoke scope",
      "--status",
      "todo",
      "--priority",
      "1",
      "--json",
    ], root));
    const scopeId = scope.node.id;

    const catalog = JSON.parse(mdkg(binPath, ["loop", "list", "--json"], root));
    const templateRefs = new Set(catalog.templates.map((template) => template.ref));
    for (const slug of SEED_SLUGS) {
      assert(templateRefs.has(`template://loops/${slug}`), `installed loop catalog is missing ${slug}`);
    }
    const shownTemplate = JSON.parse(mdkg(binPath, ["loop", "show", "security-audit", "--json"], root));
    assert(shownTemplate.action === "showed", "installed template show did not complete");
    assert(
      shownTemplate.template.ref === "template://loops/security-audit",
      "installed template show resolved the wrong template"
    );

    for (const slug of SEED_SLUGS) {
      const title = `${slug} installed smoke`;
      const mdkgRoot = path.join(root, ".mdkg");
      const beforeDryRun = snapshotFiles(mdkgRoot);
      const preview = JSON.parse(mdkg(binPath, [
        "loop",
        "fork",
        slug,
        "--scope",
        scopeId,
        "--title",
        title,
        "--dry-run",
        "--json",
      ], root));
      assert(preview.action === "planned" && preview.dry_run === true, `${slug} dry-run receipt is not observational`);
      assert(preview.template.ref === `template://loops/${slug}`, `${slug} dry-run lost template identity`);
      assert(preview.materialized_children.length === 3, `${slug} dry-run did not plan default children`);
      assert(
        JSON.stringify(preview.materialized_children.map((child) => child.type)) === JSON.stringify(["spike", "task", "test"]),
        `${slug} dry-run planned unexpected child types`
      );
      assert(
        JSON.stringify(snapshotFiles(mdkgRoot)) === JSON.stringify(beforeDryRun),
        `${slug} dry-run changed installed SQLite or filesystem state`
      );

      const forked = JSON.parse(mdkg(binPath, [
        "loop",
        "fork",
        slug,
        "--scope",
        scopeId,
        "--title",
        title,
        "--json",
      ], root));
      assert(forked.action === "forked", `${slug} real fork did not complete`);
      assert(forked.loop.id === preview.loop.id, `${slug} dry-run consumed the real loop id`);
      assert(
        JSON.stringify(forked.materialized_children.map((child) => child.id)) ===
          JSON.stringify(preview.materialized_children.map((child) => child.id)),
        `${slug} dry-run consumed one or more child ids`
      );

      const plan = JSON.parse(mdkg(binPath, ["loop", "plan", forked.loop.id, "--json"], root));
      assert(plan.materialization_mode === "default_children", `${slug} plan lost materialization mode`);
      assert(plan.child_refs.length === 3, `${slug} plan did not expose linked children`);
      assert(
        plan.readiness.template_lineage.provenance.state === "current",
        `${slug} installed fork provenance is not current`
      );

      if (slug === "security-audit") {
        const decision = JSON.parse(mdkg(binPath, [
          "new",
          "dec",
          "Authorize the local read-only security audit",
          "--status",
          "accepted",
          "--json",
        ], root));
        const decisionId = decision.node.id;
        const loopPath = path.join(root, forked.loop.path);
        let loopSource = fs.readFileSync(loopPath, "utf8");
        const questionBindings = plan.readiness.questions.pre_run_questions
          .map((question) => `${question}=${decisionId}`)
          .join(", ");
        loopSource = loopSource
          .replace(/^question_answer_refs: \[\]$/m, `question_answer_refs: [${questionBindings}]`)
          .replace(/^decision_refs: \[\]$/m, `decision_refs: [${decisionId}]`);
        fs.writeFileSync(loopPath, loopSource);
        mdkg(binPath, ["index"], root);

        const resolvedPlan = JSON.parse(mdkg(binPath, ["loop", "plan", forked.loop.id, "--json"], root));
        assert(
          resolvedPlan.readiness.questions.unanswered_pre_run_questions.length === 0,
          "security walkthrough question bindings did not resolve readiness"
        );
        assert(
          resolvedPlan.readiness.approvals.pending_approval_actions.length === 0,
          "unrequested external security actions should remain optional"
        );
        const packedWrite = mdkg(binPath, ["pack", forked.loop.id, "--profile", "concise"], root);
        assert(packedWrite.includes("pack written:"), "security walkthrough concise pack did not write in the temp workspace");
      }

      const next = JSON.parse(mdkg(binPath, ["loop", "next", forked.loop.id, "--json"], root));
      assert(next.selected && next.selected.kind === "child", `${slug} next did not route to authorized child work`);
      assert(next.exhaustion.whole_loop_blocked === false, `${slug} was incorrectly reported whole-loop blocked`);

      const runs = JSON.parse(mdkg(binPath, ["loop", "runs", forked.loop.id, "--json"], root));
      assert(runs.action === "listed", `${slug} runs inspection did not complete`);
      assert(Array.isArray(runs.run_refs) && Array.isArray(runs.evidence_refs), `${slug} runs output is not structured`);

      const packed = mdkg(binPath, ["pack", forked.loop.id, "--profile", "concise", "--dry-run", "--stats"], root);
      assert(packed.includes("dry-run: no files written"), `${slug} pack dry-run did not complete`);
    }

    const rawLoop = JSON.parse(mdkg(binPath, [
      "new",
      "loop",
      "Review release support policy",
      "--json",
    ], root));
    assert(rawLoop.action === "created" && rawLoop.node.type === "loop", "raw loop creation did not complete");
    assert(rawLoop.next_actions.some((action) => action.includes("mdkg loop list")), "raw loop output lacks template guidance");
    assert(rawLoop.suggested_templates.length === SEED_SLUGS.length, "raw loop output lacks the complete template catalog");

    mdkg(binPath, ["validate", "--json"], root);
    console.log(`loop smoke passed (${SEED_SLUGS.length} installed seed templates, SQLite backend)`);
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
}

main();
