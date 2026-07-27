#!/usr/bin/env node

const crypto = require("node:crypto");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const {
  assert,
  assertNoHighRiskMarkers,
  mdkg,
  parseJson,
  readText,
  repoRoot,
} = require("./mdkg-dev-smoke-utils");

const tempBase = fs.existsSync("/private/tmp") ? "/private/tmp" : os.tmpdir();
const exampleRoots = [
  "examples/demo-agentic-coding",
  "examples/template-mdkg-dev",
  "examples/website-demo-template",
  "examples/demo-runs/demo-001",
];

function snapshotExampleIndexes() {
  const snapshot = {};
  const visit = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const filePath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        visit(filePath);
      } else if (entry.isFile()) {
        const relativePath = path.relative(repoRoot, filePath).split(path.sep).join("/");
        snapshot[relativePath] = crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
      }
    }
  };
  for (const rootRel of exampleRoots) {
    visit(path.join(repoRoot, rootRel, ".mdkg", "index"));
  }
  return snapshot;
}

function copyExample(tempRoot, rootRel) {
  const target = path.join(tempRoot, rootRel);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.cpSync(path.join(repoRoot, rootRel), target, { recursive: true });
  return target;
}

function runWebsiteDemoBootstrap(args, options = {}) {
  const result = spawnSync(process.execPath, [path.join(repoRoot, "scripts", "bootstrap-website-demo-run.js"), ...args], {
    cwd: repoRoot,
    encoding: "utf8",
  });
  if (!options.allowFailure) {
    assert(result.status === 0, `website demo bootstrap failed: ${result.stderr || result.stdout}`);
    return parseJson(result.stdout);
  }
  assert(result.status !== 0, `website demo bootstrap unexpectedly passed: ${args.join(" ")}`);
  const lines = (result.stderr || "").trim().split("\n").filter(Boolean);
  return parseJson(lines.at(-1));
}

function bootstrapArgs(targetRel, manifestRel) {
  return [
    "--source",
    "examples/website-demo-template",
    "--target",
    targetRel,
    "--start-goal",
    "goal-1",
    "--manifest",
    manifestRel,
    "--receipt",
    `${targetRel}/BOOTSTRAP_RECEIPT.json`,
  ];
}

function assertBootstrapFailure(targetRel, manifestRel, expectedClassification) {
  const failure = runWebsiteDemoBootstrap(bootstrapArgs(targetRel, manifestRel), { allowFailure: true });
  assert(
    failure.failure_classification === expectedClassification,
    `expected ${expectedClassification}, received ${failure.failure_classification}: ${failure.message}`
  );
}

function assertExample(rootRel, searchText, expectedTitle, options = {}) {
  const root = options.root || path.join(repoRoot, rootRel);
  const startedAt = Date.now();
  const validate = parseJson(mdkg(["--root", root, "validate", "--json"]).stdout);
  assert(validate.ok === true, `${rootRel} did not validate`);
  assert(validate.warning_count === 0, `${rootRel} has validation warnings`);

  mdkg(["--root", root, "index"]);
  const next = parseJson(mdkg(["--root", root, "goal", "next", "goal-1", "--json"]).stdout);
  if (options.allowAchievedGoal) {
    assert(
      (next.node && next.node.id === "spike-1") || (next.node === null && next.goal.goal_state === "achieved"),
      `${rootRel} goal next did not route to spike-1 or an achieved goal`
    );
  } else {
    assert(next.node && next.node.id === "spike-1", `${rootRel} goal next did not route to spike-1`);
  }
  const allowedWarning = "scope contains non-actionable or unsupported node: root:chk-1";
  assert(
    (next.warnings || []).every((warning) => warning === allowedWarning),
    `${rootRel} goal next emitted unexpected warnings: ${(next.warnings || []).join("; ")}`
  );

  const search = parseJson(mdkg(["--root", root, "search", searchText, "--json"]).stdout);
  assert(search.count > 0, `${rootRel} search returned no results`);
  assert(search.items.some((item) => item.title === expectedTitle), `${rootRel} search missing expected goal`);

  const packed = mdkg(["--root", root, "pack", "goal-1", "--profile", "concise", "--dry-run", "--stats"]).stdout;
  for (const qid of ["root:goal-1", "root:spike-1", "root:task-1", "root:test-1"]) {
    assert(packed.includes(qid), `${rootRel} pack missing ${qid}`);
  }
  if (rootRel === "examples/demo-agentic-coding") {
    const spike = parseJson(mdkg(["--root", root, "show", "spike-1", "--json"]).stdout);
    assert(spike.item.title.includes("demo audience"), "demo spike should describe audience research");
    const decision = parseJson(mdkg(["--root", root, "show", "dec-1", "--json"]).stdout);
    assert(decision.item.title.includes("local preview"), "demo decision should document local preview boundary");
    const checkpoint = parseJson(mdkg(["--root", root, "show", "chk-1", "--json"]).stdout);
    assert(checkpoint.item.title.includes("seed accepted"), "demo checkpoint should record seed evidence");
    const capabilities = parseJson(mdkg(["--root", root, "capability", "search", "pack", "--kind", "skill", "--json"]).stdout);
    assert(capabilities.count > 0, "demo capability search should find pack skill");
    assert(
      capabilities.items.some((item) => item.id === "build-pack-and-execute-task" || item.slug === "build-pack-and-execute-task"),
      "demo capability search missing build-pack-and-execute-task skill"
    );
    const elapsedMs = Date.now() - startedAt;
    assert(elapsedMs < 600_000, `demo first-success path took too long: ${elapsedMs}ms`);
  }
  if (rootRel === "examples/website-demo-template") {
    const decision = parseJson(mdkg(["--root", root, "show", "dec-1", "--json"]).stdout);
    assert(
      decision.item.title === "Static Astro and zero client JavaScript is the demo stack",
      "website demo template stack decision must be static Astro"
    );
    const task = parseJson(mdkg(["--root", root, "show", "task-1", "--json"]).stdout);
    assert(
      task.item.title === "Build complete static Astro website demo",
      "website demo template implementation task must be static Astro"
    );
    const checkpoint = parseJson(mdkg(["--root", root, "show", "chk-2", "--json"]).stdout);
    assert(checkpoint.item.status === "done", "website demo static-Astro contract checkpoint must be accepted");
    const operatorContract = [
      readText(path.join(root, "README.md")),
      readText(path.join(root, "DESIGN.md")),
      readText(path.join(root, "WEBSITE_DEMO_TEMPLATE_BRIEF.md")),
      readText(path.join(root, "DEMO_HANDOFF_PROMPT.md")),
    ].join("\n");
    for (const required of ["Static Astro", "zero client-side JavaScript", "caller"]) {
      assert(operatorContract.toLowerCase().includes(required.toLowerCase()), `template contract missing ${required}`);
    }
    for (const forbidden of ["Astro plus React Islands", "parent `goal-44`", "parent `goal-46`"]) {
      assert(!operatorContract.includes(forbidden), `template current contract retains ${forbidden}`);
    }
  }
}

function main() {
  const sourceIndexSnapshot = snapshotExampleIndexes();
  const tempRoot = fs.mkdtempSync(path.join(tempBase, "mdkg-demo-graph-smoke-"));
  const runScratchParent = path.join(
    repoRoot,
    "presentations",
    "ai-native-sdlc-demo",
    "runs"
  );
  const scratchName = `.bootstrap-smoke-${process.pid}-${Date.now()}`;
  const bootstrapScratchRoot = path.join(runScratchParent, scratchName);
  const bootstrapScratchRel = path.relative(repoRoot, bootstrapScratchRoot).split(path.sep).join("/");
  const manifestRel =
    "presentations/ai-native-sdlc-demo/artifacts/demo-platform/operator-materialization-manifest.json";

  try {
    const copiedRoots = Object.fromEntries(
      exampleRoots.map((rootRel) => [rootRel, copyExample(tempRoot, rootRel)])
    );
    const demoReadme = readText(path.join(repoRoot, "examples", "demo-agentic-coding", "README.md"));
    for (const expected of [
      "First-success path",
      "Expected results",
      "mdkg validate --json",
      "mdkg goal next goal-1 --json",
      "mdkg pack spike-1 --profile concise --dry-run --stats",
      "mdkg capability search \"pack\" --kind skill --json",
      "under 10 minutes",
    ]) {
      assert(demoReadme.includes(expected), `demo README missing ${expected}`);
    }
    const demoDocs = readText(
      path.join(repoRoot, "docs", "src", "content", "docs", "advanced-alpha", "demo-graphs.md")
    );
    for (const expected of [
      "First-success path",
      "examples/demo-agentic-coding",
      "Use returned IDs",
      "Do not hardcode numeric IDs",
    ]) {
      assert(demoDocs.includes(expected), `demo docs missing ${expected}`);
    }
    assertExample(
      "examples/demo-agentic-coding",
      "agentic coding demo",
      "Build a one-shot agentic coding demo from mdkg context",
      { root: copiedRoots["examples/demo-agentic-coding"] }
    );
    assertExample(
      "examples/template-mdkg-dev",
      "candidate website",
      "Generate a candidate mdkg.dev website from a cloned graph",
      { root: copiedRoots["examples/template-mdkg-dev"] }
    );
    assertExample(
      "examples/website-demo-template",
      "differentiated website demo",
      "Build a complete differentiated website demo from the canonical mdkg template",
      { root: copiedRoots["examples/website-demo-template"] }
    );
    assertExample(
      "examples/demo-runs/demo-001",
      "differentiated website demo",
      "Build a complete differentiated website demo from the canonical mdkg template",
      { allowAchievedGoal: true, root: copiedRoots["examples/demo-runs/demo-001"] }
    );

    const bootstrapCreate = runWebsiteDemoBootstrap(bootstrapArgs(bootstrapScratchRel, manifestRel));
    assert(bootstrapCreate.mode === "create", "first website demo bootstrap must create an absent target");
    assert(bootstrapCreate.preserved_ids === true, "website demo bootstrap must preserve ids");
    assert(bootstrapCreate.selected_goal_qid === "root:goal-1", "website demo bootstrap selected goal mismatch");
    assert(bootstrapCreate.validation.ok === true, "website demo bootstrap child validation failed");
    assert(bootstrapCreate.validation.warning_count === 0, "website demo bootstrap child validation warned");
    assert(
      bootstrapCreate.routing.first_actionable_qid === "root:spike-1",
      "website demo bootstrap first actionable node mismatch"
    );
    assert(bootstrapCreate.packs.concise.node_count === 13, "website demo concise pack coverage mismatch");
    assert(bootstrapCreate.packs.standard.node_count === 13, "website demo standard pack coverage mismatch");
    assert(
      bootstrapCreate.canonical_fork_command ===
        `mdkg graph fork examples/website-demo-template/.mdkg --target ${bootstrapScratchRel} --start-goal goal-1 --json`,
      "website demo canonical fork command mismatch"
    );
    assert(/^sha256:[a-f0-9]{64}$/.test(bootstrapCreate.source_tree_hash), "source tree hash missing");
    assert(/^sha256:[a-f0-9]{64}$/.test(bootstrapCreate.cli_source_tree_hash), "CLI source tree hash missing");
    assert(bootstrapCreate.generated_file_count === 103, "website demo generated inventory count mismatch");
    for (const qid of [
      "root:prd-2",
      "root:edd-1",
      "root:dec-1",
      "root:dec-2",
      "root:chk-2",
      "root:skill:select-work-and-ground-context",
      "root:skill:build-pack-and-execute-task",
      "root:skill:verify-close-and-checkpoint",
    ]) {
      assert(
        bootstrapCreate.packs.concise.included_qids.includes(qid),
        `website demo concise pack missing ${qid}`
      );
      assert(
        bootstrapCreate.packs.standard.included_qids.includes(qid),
        `website demo standard pack missing ${qid}`
      );
    }

    const bootstrapVerify = runWebsiteDemoBootstrap(bootstrapArgs(bootstrapScratchRel, manifestRel));
    assert(bootstrapVerify.mode === "verify-only", "repeat website demo bootstrap must be verify-only");
    assert(
      bootstrapVerify.repeat_result === "identical inventory and hashes",
      "repeat website demo bootstrap did not prove equality"
    );
    assert(
      JSON.stringify(bootstrapVerify.generated_inventory) === JSON.stringify(bootstrapCreate.generated_inventory),
      "repeat website demo bootstrap inventory changed"
    );

    const driftRoot = `${bootstrapScratchRoot}-drift`;
    const driftRel = path.relative(repoRoot, driftRoot).split(path.sep).join("/");
    fs.cpSync(bootstrapScratchRoot, driftRoot, { recursive: true });
    fs.appendFileSync(path.join(driftRoot, "AGENTS.md"), "\nDeliberate drift fixture.\n");
    assertBootstrapFailure(driftRel, manifestRel, "target_content_drift");

    const skillDriftRoot = `${bootstrapScratchRoot}-skill-drift`;
    const skillDriftRel = path.relative(repoRoot, skillDriftRoot).split(path.sep).join("/");
    fs.cpSync(bootstrapScratchRoot, skillDriftRoot, { recursive: true });
    fs.appendFileSync(
      path.join(skillDriftRoot, ".agents", "skills", "author-mdkg-skill", "SKILL.md"),
      "\nDeliberate skill mirror drift.\n"
    );
    assertBootstrapFailure(skillDriftRel, manifestRel, "skill_mirror_mismatch");

    const missingRoot = `${bootstrapScratchRoot}-missing`;
    const missingRel = path.relative(repoRoot, missingRoot).split(path.sep).join("/");
    fs.cpSync(bootstrapScratchRoot, missingRoot, { recursive: true });
    fs.unlinkSync(path.join(missingRoot, "AGENT_START.md"));
    assertBootstrapFailure(missingRel, manifestRel, "missing_target_input");

    const unexpectedRoot = `${bootstrapScratchRoot}-unexpected`;
    const unexpectedRel = path.relative(repoRoot, unexpectedRoot).split(path.sep).join("/");
    fs.mkdirSync(unexpectedRoot, { recursive: true });
    assertBootstrapFailure(unexpectedRel, manifestRel, "unexpected_target");

    const missingInputManifest = JSON.parse(readText(path.join(repoRoot, manifestRel)));
    missingInputManifest.entries[0].source_path = "MISSING_REQUIRED_OPERATOR_FILE.md";
    const missingInputManifestPath = `${bootstrapScratchRoot}-missing-input-manifest.json`;
    const missingInputManifestRel = path.relative(repoRoot, missingInputManifestPath).split(path.sep).join("/");
    fs.writeFileSync(missingInputManifestPath, `${JSON.stringify(missingInputManifest, null, 2)}\n`);
    const missingInputTargetRel = `${bootstrapScratchRel}-missing-input`;
    assertBootstrapFailure(missingInputTargetRel, missingInputManifestRel, "missing_source_input");

    const subgraphResult = mdkg(["subgraph", "verify", "--all", "--json"], repoRoot, {
      allowFailure: true,
    });
    const subgraphs = parseJson(subgraphResult.stdout);
    assert(subgraphs.count >= 2, "expected at least two registered subgraphs");
    assert(
      subgraphResult.status === 0 ||
        (
          subgraphResult.status === 2 &&
          subgraphs.subgraphs.every((entry) => entry.error_count === 0) &&
          subgraphs.subgraphs.every((entry) =>
            entry.warnings.every((warning) => /bundle age \d+s exceeds max_stale_seconds \d+/.test(warning))
          )
        ),
      `root subgraph verification reported non-staleness failures: ${subgraphResult.stderr}`
    );
    for (const alias of ["demo_agentic_coding", "template_mdkg_dev"]) {
      const entry = subgraphs.subgraphs.find((item) => item.alias === alias);
      assert(entry, `missing subgraph ${alias}`);
      assert(entry.visibility === "private", `${alias} should be private`);
      assert(entry.permissions.includes("read"), `${alias} should be read-only`);
      assert(entry.error_count === 0, `${alias} has errors`);
    }

    const demoGoal = parseJson(mdkg(["show", "demo_agentic_coding:goal-1", "--json"]).stdout);
    assert(demoGoal.item.source.read_only === true, "demo subgraph goal should be read-only");
    const templateGoal = parseJson(mdkg(["show", "template_mdkg_dev:goal-1", "--json"]).stdout);
    assert(templateGoal.item.source.read_only === true, "template subgraph goal should be read-only");

    assertNoHighRiskMarkers([
      path.join(repoRoot, "examples", "demo-agentic-coding"),
      path.join(repoRoot, "examples", "template-mdkg-dev"),
      path.join(repoRoot, "examples", "website-demo-template"),
      path.join(repoRoot, "examples", "demo-runs", "demo-001"),
    ]);
    assert(
      JSON.stringify(snapshotExampleIndexes()) === JSON.stringify(sourceIndexSnapshot),
      "demo graph smoke mutated committed example index caches"
    );
    console.log(
      JSON.stringify(
        {
          ok: true,
          source_tree_hash: bootstrapCreate.source_tree_hash,
          cli_source_tree_hash: bootstrapCreate.cli_source_tree_hash,
          preserved_ids: bootstrapCreate.preserved_ids,
          selected_goal_qid: bootstrapCreate.selected_goal_qid,
          first_actionable_qid: bootstrapCreate.routing.first_actionable_qid,
          validation: bootstrapCreate.validation,
          generated_file_count: bootstrapCreate.generated_file_count,
          generated_inventory_sha256: crypto
            .createHash("sha256")
            .update(JSON.stringify(bootstrapCreate.generated_inventory))
            .digest("hex"),
          manifest_sha256: bootstrapCreate.manifest_sha256,
          packs: bootstrapCreate.packs,
          repeat_result: bootstrapVerify.repeat_result,
          negative_classifications: [
            "target_content_drift",
            "skill_mirror_mismatch",
            "missing_target_input",
            "unexpected_target",
            "missing_source_input",
          ],
          retained_run_directories: 0,
        },
        null,
        2,
      ),
    );
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
    for (const entry of fs.existsSync(runScratchParent) ? fs.readdirSync(runScratchParent) : []) {
      if (entry.startsWith(scratchName)) {
        fs.rmSync(path.join(runScratchParent, entry), { recursive: true, force: true });
      }
    }
    if (fs.existsSync(runScratchParent) && fs.readdirSync(runScratchParent).length === 0) {
      fs.rmdirSync(runScratchParent);
    }
  }
}

main();
