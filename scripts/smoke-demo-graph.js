#!/usr/bin/env node

const crypto = require("node:crypto");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const {
  assert,
  assertNoHighRiskMarkers,
  parseJson,
  readText,
  repoRoot: sourceRepoRoot,
} = require("./mdkg-dev-smoke-utils");
const { createOwnedFixture, isolatedFixtureEnvironment, finalizeFixture } = require("./qualification-fixture");
const { exampleRoots, prepareDemoFixture } = require("./demo-graph-fixture");

const tempBase = fs.existsSync("/private/tmp") ? "/private/tmp" : os.tmpdir();

function snapshotExampleIndexes() {
  const snapshot = {};
  const visit = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const filePath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        visit(filePath);
      } else if (entry.isFile()) {
        const relativePath = path.relative(sourceRepoRoot, filePath).split(path.sep).join("/");
        snapshot[relativePath] = crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
      }
    }
  };
  for (const rootRel of exampleRoots) {
    visit(path.join(sourceRepoRoot, rootRel, ".mdkg", "index"));
  }
  return snapshot;
}

function executeWebsiteDemoBootstrap(fixture, repoRoot, env, args, options = {}) {
  const result = fixture.runNode([path.join(repoRoot, "scripts", "bootstrap-website-demo-run.js"), ...args], {
    cwd: repoRoot,
    env,
  });
  if (!options.allowFailure) {
    assert(result.status === 0, `website demo bootstrap failed: ${result.stderr || result.stdout}`);
    return parseJson(result.stdout);
  }
  assert(result.status !== 0, `website demo bootstrap unexpectedly passed: ${args.join(" ")}`);
  const lines = (result.stderr || "").trim().split("\n").filter(Boolean);
  return parseJson(lines.at(-1));
}

function bootstrapArgs(targetRel, manifestRel, releaseRel, bindingRel) {
  return [
    "--source",
    "examples/website-demo-template",
    "--target",
    targetRel,
    "--start-goal",
    "goal-1",
    "--manifest",
    manifestRel,
    "--release",
    releaseRel,
    "--binding",
    bindingRel,
    "--receipt",
    `${targetRel}/BOOTSTRAP_RECEIPT.json`,
  ];
}

function assertBootstrapFailureFor(runWebsiteDemoBootstrap, targetRel, manifestRel, releaseRel, bindingRel, expectedClassification) {
  const failure = runWebsiteDemoBootstrap(
    bootstrapArgs(targetRel, manifestRel, releaseRel, bindingRel),
    { allowFailure: true }
  );
  assert(
    failure.failure_classification === expectedClassification,
    `expected ${expectedClassification}, received ${failure.failure_classification}: ${failure.message}`
  );
}

function sha256File(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function buildFixtureBinding({
  semanticSourceRelease,
  timingProfileRef,
  runId,
  targetRoot,
  demoNumber,
  audience,
  offerBoundary,
  designatedHarness,
  prohibitedDefaults,
}) {
  return {
    schema_version: "1.0",
    kind: "website-demo-run-binding",
    materializer_version: "2.0",
    semantic_source_release: semanticSourceRelease,
    run_id: runId,
    target_root: targetRoot,
    detail_route: `/demo/${demoNumber}/`,
    output_route: `/demo/${demoNumber}/output/`,
    component_key: `demo-${demoNumber}`,
    positioning_brief: {
      audience,
      offer_boundary: offerBoundary,
      required_story: [
        "clear hero promise",
        "context or problem framing",
        "Plan -> Work -> Evidence",
        "what completed why and what comes next",
        "inspectable source-to-execution proof",
        "quickstart and feedback CTA",
      ],
      creative_latitude: [
        "composition",
        "visual metaphor",
        "section order",
        "typographic hierarchy",
        "CSS-only motion",
        "bounded marketing copy",
      ],
      prohibited_defaults: prohibitedDefaults,
    },
    designated_harness: designatedHarness,
    timing_profile_ref: timingProfileRef,
    output_destinations: {
      portable_component: "site/src/components/DemoOutput.astro",
      local_preview: "site/src/pages/index.astro",
    },
    receipt_destinations: {
      creative_direction: "artifacts/creative-direction.md",
      implementation: "artifacts/implementation-receipt.json",
      local_validation: "artifacts/local-validation.json",
      integration: "artifacts/integration-receipt.json",
      canonical_validation: "artifacts/canonical-route-validation.json",
      publication: "artifacts/publication-receipt.json",
      live_verification: "artifacts/live-verification-receipt.json",
    },
    immutable_fields: [
      "schema_version",
      "kind",
      "materializer_version",
      "semantic_source_release",
      "run_id",
      "target_root",
      "detail_route",
      "output_route",
      "component_key",
      "positioning_brief",
      "designated_harness",
      "timing_profile_ref",
      "output_destinations",
      "receipt_destinations",
    ],
    runtime_mutable_fields: [
      ".mdkg/index/**",
      ".mdkg/state/**",
      ".mdkg/pack/**",
      ".mdkg/work/events/**",
      "artifacts/**",
      "site/**",
      "runtime checkpoints",
      "work status and evidence_refs",
    ],
  };
}

function assertExample(rootRel, searchText, expectedTitle, options = {}) {
  const { root, mdkg } = options;
  assert(root && typeof mdkg === "function", "example checks require an explicit fixture root and runner");
  const startedAt = Date.now();
  // Copied indexes bind another checkout's fingerprints. Rebuild derived state
  // inside this fixture before requiring warning-free validation.
  mdkg(["--root", root, "index"]);
  const validate = parseJson(mdkg(["--root", root, "validate", "--json"]).stdout);
  assert(validate.ok === true, `${rootRel} did not validate`);
  assert(validate.warning_count === 0, `${rootRel} has validation warnings`);

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
  const baseQids =
    rootRel === "examples/website-demo-template"
      ? [
          "root:goal-1",
          "root:spike-1",
          "root:task-1",
          "root:test-1",
          "root:task-2",
          "root:test-2",
          "root:task-3",
          "root:test-3",
          "root:chk-3",
        ]
      : ["root:goal-1", "root:spike-1", "root:task-1", "root:test-1"];
  for (const qid of baseQids) {
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
    const checkpoint = parseJson(mdkg(["--root", root, "show", "chk-3", "--json"]).stdout);
    assert(checkpoint.item.status === "done", "website demo semantic source checkpoint must be accepted");
    const operatorContract = [
      readText(path.join(root, "README.md")),
      readText(path.join(root, "DESIGN.md")),
      readText(path.join(root, "WEBSITE_DEMO_TEMPLATE_BRIEF.md")),
      readText(path.join(root, "DEMO_HANDOFF_PROMPT.md")),
    ].join("\n");
    for (const required of [
      "Static Astro",
      "zero client-side JavaScript",
      "caller",
      "RUN_BINDING.json",
      "task-2",
      "test-3",
    ]) {
      assert(operatorContract.toLowerCase().includes(required.toLowerCase()), `template contract missing ${required}`);
    }
    for (const forbidden of ["Astro plus React Islands", "parent `goal-44`", "parent `goal-46`"]) {
      assert(!operatorContract.includes(forbidden), `template current contract retains ${forbidden}`);
    }
  }
}

function main() {
  const sourceIndexSnapshot = snapshotExampleIndexes();
  const fixture = createOwnedFixture({ base: fs.realpathSync(tempBase), prefix: "mdkg-demo-graph-smoke-" });
  let receipt, cleanup, prepared, failure;
  try {
    prepared = prepareDemoFixture(fixture, sourceRepoRoot);
    const { repoRoot, copiedRoots } = prepared;
    const env = isolatedFixtureEnvironment();
    const runWebsiteDemoBootstrap = (args, options) => {
      fixture.assertOwned();
      return executeWebsiteDemoBootstrap(fixture, repoRoot, env, args, options);
    };
    const assertBootstrapFailure = (...args) => assertBootstrapFailureFor(runWebsiteDemoBootstrap, ...args);
    const mdkg = (args, cwd = repoRoot, options = {}) => {
      fixture.assertOwned();
      // Only the three explicit canonical observations below use --root;
      // execution and every mutable graph operation stay in the owned copy.
      const observingSource = cwd === sourceRepoRoot;
      const result = fixture.runNode([path.join(repoRoot, "dist/cli.js"), ...(observingSource ? ["--root", sourceRepoRoot] : []), ...args], {
        cwd: observingSource ? repoRoot : cwd, env,
      });
      if (!options.allowFailure) assert(result.status === 0, `mdkg fixture command failed: ${result.stderr || result.stdout}`);
      return { stdout: (result.stdout || "").trim(), stderr: (result.stderr || "").trim(), status: result.status };
    };
    const runScratchParent = path.join(
      repoRoot,
      "presentations",
      "ai-native-sdlc-demo",
      "runs"
    );
    const scratchName = `.bootstrap-smoke-${process.pid}-${Date.now()}`;
    fs.mkdirSync(runScratchParent, { recursive: true });
    const bootstrapScratchRoot = path.join(runScratchParent, scratchName);
    const bootstrapScratchRel = path.relative(repoRoot, bootstrapScratchRoot).split(path.sep).join("/");
    const bootstrapScratchRootB = path.join(runScratchParent, `${scratchName}-b`);
    const bootstrapScratchRelB = path.relative(repoRoot, bootstrapScratchRootB).split(path.sep).join("/");
    const manifestRel =
      "presentations/ai-native-sdlc-demo/artifacts/demo-platform/operator-materialization-manifest.json";
    const releaseRel =
      "presentations/ai-native-sdlc-demo/artifacts/demo-platform/source-release-manifest.json";
    const timedRunRel =
      "presentations/ai-native-sdlc-demo/artifacts/demo-platform/timed-run-contract.json";
    const bindingRel = `${bootstrapScratchRel}.binding.json`;
    const bindingRelB = `${bootstrapScratchRelB}.binding.json`;
    const semanticSourceRelease = `sha256:${sha256File(path.join(repoRoot, releaseRel))}`;
    const timingProfileRef = `sha256:${sha256File(path.join(repoRoot, timedRunRel))}`;

    fs.writeFileSync(
      path.join(repoRoot, bindingRel),
      `${JSON.stringify(
        buildFixtureBinding({
          semanticSourceRelease,
          timingProfileRef,
          runId: "fixture-platform-teams",
          targetRoot: bootstrapScratchRel,
          demoNumber: 901,
          audience: "Platform engineering teams adopting durable AI-native delivery workflows.",
          offerBoundary: "Show inspectable source-to-execution proof without selecting a fixed visual metaphor.",
          designatedHarness: "codex",
          prohibitedDefaults: ["Demo 2 durable-continuity promise", "navigation-chart composition"],
        }),
        null,
        2,
      )}\n`,
    );
    fs.writeFileSync(
      path.join(repoRoot, bindingRelB),
      `${JSON.stringify(
        buildFixtureBinding({
          semanticSourceRelease,
          timingProfileRef,
          runId: "fixture-independent-builders",
          targetRoot: bootstrapScratchRelB,
          demoNumber: 902,
          audience: "Independent software builders who want architecture-first agentic project execution.",
          offerBoundary: "Explain durable planning and evidence while leaving composition and message hierarchy open.",
          designatedHarness: "claude-code",
          prohibitedDefaults: ["Demo 2 marketing copy", "timeline-as-page composition"],
        }),
        null,
        2,
      )}\n`,
    );
    const demoReadme = readText(path.join(sourceRepoRoot, "examples", "demo-agentic-coding", "README.md"));
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
      path.join(sourceRepoRoot, "docs", "src", "content", "docs", "advanced-alpha", "demo-graphs.md")
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
      { root: copiedRoots["examples/demo-agentic-coding"], mdkg }
    );
    assertExample(
      "examples/template-mdkg-dev",
      "candidate website",
      "Generate a candidate mdkg.dev website from a cloned graph",
      { root: copiedRoots["examples/template-mdkg-dev"], mdkg }
    );
    assertExample(
      "examples/website-demo-template",
      "differentiated website demo",
      "Build a complete differentiated website demo from the canonical mdkg template",
      { root: copiedRoots["examples/website-demo-template"], mdkg }
    );
    assertExample(
      "examples/demo-runs/demo-001",
      "differentiated website demo",
      "Build a complete differentiated website demo from the canonical mdkg template",
      { allowAchievedGoal: true, root: copiedRoots["examples/demo-runs/demo-001"], mdkg }
    );

    const bootstrapCreate = runWebsiteDemoBootstrap(
      bootstrapArgs(bootstrapScratchRel, manifestRel, releaseRel, bindingRel)
    );
    const bootstrapCreateB = runWebsiteDemoBootstrap(
      bootstrapArgs(bootstrapScratchRelB, manifestRel, releaseRel, bindingRelB)
    );
    assert(bootstrapCreate.mode === "create", "first website demo bootstrap must create an absent target");
    assert(bootstrapCreateB.mode === "create", "second website demo bootstrap must create an absent target");
    assert(bootstrapCreate.preserved_ids === true, "website demo bootstrap must preserve ids");
    assert(bootstrapCreateB.preserved_ids === true, "second website demo bootstrap must preserve ids");
    assert(bootstrapCreate.selected_goal_qid === "root:goal-1", "website demo bootstrap selected goal mismatch");
    assert(bootstrapCreateB.selected_goal_qid === "root:goal-1", "second website demo goal mismatch");
    assert(bootstrapCreate.validation.ok === true, "website demo bootstrap child validation failed");
    assert(bootstrapCreateB.validation.ok === true, "second website demo child validation failed");
    assert(bootstrapCreate.validation.warning_count === 0, "website demo bootstrap child validation warned");
    assert(bootstrapCreateB.validation.warning_count === 0, "second website demo child validation warned");
    assert(
      bootstrapCreate.routing.first_actionable_qid === "root:spike-1",
      "website demo bootstrap first actionable node mismatch"
    );
    assert(
      bootstrapCreateB.routing.first_actionable_qid === "root:spike-1",
      "second website demo first actionable node mismatch"
    );
    assert(
      bootstrapCreate.canonical_fork_command ===
        `mdkg graph fork examples/website-demo-template/.mdkg --target ${bootstrapScratchRel} --start-goal goal-1 --json`,
      "website demo canonical fork command mismatch"
    );
    assert(bootstrapCreate.semantic_source_release === semanticSourceRelease, "semantic source release mismatch");
    assert(bootstrapCreateB.semantic_source_release === semanticSourceRelease, "second semantic release mismatch");
    assert(/^sha256:[a-f0-9]{64}$/.test(bootstrapCreate.semantic_source_release), "semantic release missing");
    assert(/^sha256:[a-f0-9]{64}$/.test(bootstrapCreate.cli_source_tree_hash), "CLI source tree hash missing");
    assert(/^([a-f0-9]{64})$/.test(bootstrapCreate.binding_sha256), "binding hash missing");
    assert(/^([a-f0-9]{64})$/.test(bootstrapCreate.child_interface_sha256), "interface hash missing");
    assert(/^([a-f0-9]{64})$/.test(bootstrapCreate.child_contract_seal_sha256), "seal hash missing");
    assert(
      bootstrapCreate.binding_sha256 !== bootstrapCreateB.binding_sha256,
      "materially distinct fixture bindings must differ"
    );
    assert(
      bootstrapCreate.child_contract_seal_sha256 !== bootstrapCreateB.child_contract_seal_sha256,
      "materially distinct fixture seals must differ"
    );
    assert(bootstrapCreate.external_authority_granted === false, "bootstrap must not grant authority");
    assert(bootstrapCreate.work_started === false, "bootstrap must not start child work");
    for (const requiredFile of [
      "README.md",
      ".gitignore",
      "RUN_BINDING.json",
      "CHILD_INTERFACE.json",
      "IMMUTABLE_CHILD_CONTRACT.json",
    ]) {
      assert(fs.existsSync(path.join(bootstrapScratchRoot, requiredFile)), `bootstrap missing ${requiredFile}`);
      assert(fs.existsSync(path.join(bootstrapScratchRootB, requiredFile)), `second bootstrap missing ${requiredFile}`);
    }
    for (const qid of [
      "root:goal-1",
      "root:epic-1",
      "root:spike-1",
      "root:task-1",
      "root:test-1",
      "root:task-2",
      "root:test-2",
      "root:task-3",
      "root:test-3",
      "root:prd-2",
      "root:edd-1",
      "root:dec-1",
      "root:dec-2",
      "root:chk-3",
      "root:skill:select-work-and-ground-context",
      "root:skill:build-pack-and-execute-task",
      "root:skill:pursue-mdkg-goal",
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
      assert(
        bootstrapCreateB.packs.concise.included_qids.includes(qid),
        `second website demo concise pack missing ${qid}`
      );
      assert(
        bootstrapCreateB.packs.standard.included_qids.includes(qid),
        `second website demo standard pack missing ${qid}`
      );
    }

    const bootstrapVerify = runWebsiteDemoBootstrap(
      bootstrapArgs(bootstrapScratchRel, manifestRel, releaseRel, bindingRel)
    );
    const bootstrapVerifyB = runWebsiteDemoBootstrap(
      bootstrapArgs(bootstrapScratchRelB, manifestRel, releaseRel, bindingRelB)
    );
    assert(bootstrapVerify.mode === "verify-only", "repeat website demo bootstrap must be verify-only");
    assert(bootstrapVerifyB.mode === "verify-only", "second repeat bootstrap must be verify-only");
    assert(
      bootstrapVerify.repeat_result ===
        "identical release binding authored child operator interface seal routing packs and inventory",
      "repeat website demo bootstrap did not prove equality"
    );
    assert(
      bootstrapVerifyB.repeat_result ===
        "identical release binding authored child operator interface seal routing packs and inventory",
      "second repeat website demo bootstrap did not prove equality"
    );
    assert(
      JSON.stringify(bootstrapVerify.generated_inventory) === JSON.stringify(bootstrapCreate.generated_inventory),
      "repeat website demo bootstrap inventory changed"
    );
    assert(
      JSON.stringify(bootstrapVerifyB.generated_inventory) === JSON.stringify(bootstrapCreateB.generated_inventory),
      "second repeat website demo bootstrap inventory changed"
    );

    const agentsPath = path.join(bootstrapScratchRoot, "AGENTS.md");
    const agentsOriginal = fs.readFileSync(agentsPath);
    fs.appendFileSync(agentsPath, "\nDeliberate drift fixture.\n");
    assertBootstrapFailure(
      bootstrapScratchRel,
      manifestRel,
      releaseRel,
      bindingRel,
      "target_content_drift"
    );
    fs.writeFileSync(agentsPath, agentsOriginal);

    const skillMirrorPath = path.join(
      bootstrapScratchRoot,
      ".agents",
      "skills",
      "author-mdkg-skill",
      "SKILL.md"
    );
    const skillMirrorOriginal = fs.readFileSync(skillMirrorPath);
    fs.appendFileSync(
      skillMirrorPath,
      "\nDeliberate skill mirror drift.\n"
    );
    assertBootstrapFailure(
      bootstrapScratchRel,
      manifestRel,
      releaseRel,
      bindingRel,
      "skill_mirror_mismatch"
    );
    fs.writeFileSync(skillMirrorPath, skillMirrorOriginal);

    const goalPath = path.join(
      bootstrapScratchRoot,
      ".mdkg",
      "work",
      "goal-1-build-a-complete-differentiated-website-demo-from-the-canonical-mdkg-template.md"
    );
    const goalOriginal = fs.readFileSync(goalPath);
    fs.appendFileSync(goalPath, "\nDeliberate authored child drift.\n");
    assertBootstrapFailure(
      bootstrapScratchRel,
      manifestRel,
      releaseRel,
      bindingRel,
      "authored_child_drift"
    );
    fs.writeFileSync(goalPath, goalOriginal);

    const interfacePath = path.join(bootstrapScratchRoot, "CHILD_INTERFACE.json");
    const interfaceOriginal = fs.readFileSync(interfacePath);
    fs.appendFileSync(interfacePath, "\n");
    assertBootstrapFailure(
      bootstrapScratchRel,
      manifestRel,
      releaseRel,
      bindingRel,
      "interface_drift"
    );
    fs.writeFileSync(interfacePath, interfaceOriginal);

    const missingPath = path.join(bootstrapScratchRoot, "AGENT_START.md");
    const missingOriginal = fs.readFileSync(missingPath);
    fs.unlinkSync(missingPath);
    assertBootstrapFailure(
      bootstrapScratchRel,
      manifestRel,
      releaseRel,
      bindingRel,
      "missing_target_input"
    );
    fs.writeFileSync(missingPath, missingOriginal);

    const unexpectedRoot = `${bootstrapScratchRoot}-unexpected`;
    const unexpectedRel = path.relative(repoRoot, unexpectedRoot).split(path.sep).join("/");
    const unexpectedBindingRel = `${unexpectedRel}.binding.json`;
    const unexpectedBinding = buildFixtureBinding({
      ...JSON.parse(readText(path.join(repoRoot, bindingRel))),
      semanticSourceRelease,
      timingProfileRef,
      runId: "fixture-unexpected-target",
      targetRoot: unexpectedRel,
      demoNumber: 903,
      audience: "Unexpected-target negative fixture for deterministic materialization checks.",
      offerBoundary: "Prove an existing target without a receipt is rejected before any graph mutation.",
      designatedHarness: "codex",
      prohibitedDefaults: ["existing target adoption", "implicit overwrite"],
    });
    fs.writeFileSync(path.join(repoRoot, unexpectedBindingRel), `${JSON.stringify(unexpectedBinding, null, 2)}\n`);
    fs.mkdirSync(unexpectedRoot, { recursive: true });
    assertBootstrapFailure(
      unexpectedRel,
      manifestRel,
      releaseRel,
      unexpectedBindingRel,
      "unexpected_target"
    );

    const authorityBindingRel = `${bootstrapScratchRel}.authority.binding.json`;
    const authorityBinding = JSON.parse(readText(path.join(repoRoot, bindingRel)));
    authorityBinding.authority = { approved: true };
    fs.writeFileSync(path.join(repoRoot, authorityBindingRel), `${JSON.stringify(authorityBinding, null, 2)}\n`);
    assertBootstrapFailure(
      bootstrapScratchRel,
      manifestRel,
      releaseRel,
      authorityBindingRel,
      "binding_authority_leakage"
    );

    const targetMismatchBindingRel = `${bootstrapScratchRel}.target-mismatch.binding.json`;
    const targetMismatchBinding = JSON.parse(readText(path.join(repoRoot, bindingRel)));
    targetMismatchBinding.target_root = `${bootstrapScratchRel}-wrong`;
    fs.writeFileSync(
      path.join(repoRoot, targetMismatchBindingRel),
      `${JSON.stringify(targetMismatchBinding, null, 2)}\n`
    );
    assertBootstrapFailure(
      bootstrapScratchRel,
      manifestRel,
      releaseRel,
      targetMismatchBindingRel,
      "binding_target_mismatch"
    );

    const driftManifestRel = `${bootstrapScratchRel}.operator-drift.json`;
    const driftManifest = JSON.parse(readText(path.join(repoRoot, manifestRel)));
    driftManifest.entries[0].sha256 = "0".repeat(64);
    fs.writeFileSync(path.join(repoRoot, driftManifestRel), `${JSON.stringify(driftManifest, null, 2)}\n`);
    assertBootstrapFailure(
      bootstrapScratchRel,
      driftManifestRel,
      releaseRel,
      bindingRel,
      "source_release_dependency_drift"
    );

    const subgraphResult = mdkg(["subgraph", "verify", "--all", "--json"], sourceRepoRoot, {
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

    const demoGoal = parseJson(mdkg(["show", "demo_agentic_coding:goal-1", "--json"], sourceRepoRoot).stdout);
    assert(demoGoal.item.source.read_only === true, "demo subgraph goal should be read-only");
    const templateGoal = parseJson(mdkg(["show", "template_mdkg_dev:goal-1", "--json"], sourceRepoRoot).stdout);
    assert(templateGoal.item.source.read_only === true, "template subgraph goal should be read-only");

    assertNoHighRiskMarkers([
      path.join(sourceRepoRoot, "examples", "demo-agentic-coding"),
      path.join(sourceRepoRoot, "examples", "template-mdkg-dev"),
      path.join(sourceRepoRoot, "examples", "website-demo-template"),
      path.join(sourceRepoRoot, "examples", "demo-runs", "demo-001"),
    ]);
    assert(
      JSON.stringify(snapshotExampleIndexes()) === JSON.stringify(sourceIndexSnapshot),
      "demo graph smoke mutated committed example index caches"
    );
    receipt = {
      ok: true,
      fixture_inputs: prepared.inputIdentity,
      semantic_source_release: bootstrapCreate.semantic_source_release,
      cli_source_tree_hash: bootstrapCreate.cli_source_tree_hash,
      preserved_ids: bootstrapCreate.preserved_ids,
      selected_goal_qid: bootstrapCreate.selected_goal_qid,
      first_actionable_qid: bootstrapCreate.routing.first_actionable_qid,
      validation: bootstrapCreate.validation,
      fixtures: [
        {
          run_id: "fixture-platform-teams",
          binding_sha256: bootstrapCreate.binding_sha256,
          child_interface_sha256: bootstrapCreate.child_interface_sha256,
          child_contract_seal_sha256: bootstrapCreate.child_contract_seal_sha256,
          generated_file_count: bootstrapCreate.generated_file_count,
          generated_inventory_sha256: crypto
            .createHash("sha256")
            .update(JSON.stringify(bootstrapCreate.generated_inventory))
            .digest("hex"),
          repeat_result: bootstrapVerify.repeat_result,
        },
        {
          run_id: "fixture-independent-builders",
          binding_sha256: bootstrapCreateB.binding_sha256,
          child_interface_sha256: bootstrapCreateB.child_interface_sha256,
          child_contract_seal_sha256: bootstrapCreateB.child_contract_seal_sha256,
          generated_file_count: bootstrapCreateB.generated_file_count,
          generated_inventory_sha256: crypto
            .createHash("sha256")
            .update(JSON.stringify(bootstrapCreateB.generated_inventory))
            .digest("hex"),
          repeat_result: bootstrapVerifyB.repeat_result,
        },
      ],
      operator_manifest_sha256: bootstrapCreate.operator_manifest_sha256,
      packs: bootstrapCreate.packs,
      negative_classifications: [
        "target_content_drift",
        "skill_mirror_mismatch",
        "authored_child_drift",
        "interface_drift",
        "missing_target_input",
        "unexpected_target",
        "binding_authority_leakage",
        "binding_target_mismatch",
        "source_release_dependency_drift",
      ],
    };
  } catch (error) { failure = error; }
  cleanup = finalizeFixture(fixture, { error: failure, verify: () => prepared?.assertSourceUnchanged() });
  console.log(JSON.stringify({ ...receipt, cleanup, retained_run_directories: 0 }, null, 2));
}

if (require.main === module) main();

module.exports = { main };
