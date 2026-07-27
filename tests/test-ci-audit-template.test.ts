import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import { makeTempDir, writeFile } from "./helpers/fs";
import { writeRootConfig } from "./helpers/config";
import { writeDefaultTemplates } from "./helpers/templates";

const { parseFrontmatter, formatFrontmatter } = require("../graph/frontmatter");
const {
  runLoopForkCommand,
  runLoopNextCommand,
  runLoopPlanCommand,
  runLoopShowCommand,
} = require("../commands/loop");
const { runIndexCommand } = require("../commands/index");
const { runPackCommand } = require("../commands/pack");

const REPOSITORY_ROOT = path.resolve(__dirname, "..", "..");
const TEMPLATE_RELATIVE_PATH =
  ".mdkg/templates/loops/test-ci-skill-infrastructure-audit.loop.md";
const TEMPLATE_PATH = path.join(REPOSITORY_ROOT, TEMPLATE_RELATIVE_PATH);
const COMPLETED_LOOP_PATH = path.join(
  REPOSITORY_ROOT,
  ".mdkg/work/loop-7-mdkg-test-ci-skill-and-harness-infrastructure-audit.md"
);

const EVIDENCE_LANES = [
  "local_test_build_inventory",
  "ci_gate_inventory",
  "smoke_coverage",
  "skill_registry_mirror_integrity",
  "harness_guidance_gaps",
  "prioritized_improvements",
];

const PRE_RUN_QUESTIONS = [
  "scope_and_exclusions",
  "ci_evidence_source_policy",
  "local_execution_budget",
  "authoritative_skill_projection_contract",
  "generated_output_policy",
];

const LOCAL_ACTIONS = [
  "inspect_tests_and_build_configuration",
  "inspect_ci_configuration",
  "inspect_automation_scripts",
  "inspect_skill_registry_and_projections",
  "inspect_harness_guidance",
  "run_local_node24_verification",
  "create_mdkg_evidence_and_followups",
];

const APPROVAL_GATED_ACTIONS = [
  "external_ci_provider_calls",
  "external_network_or_registry_calls",
];

const PROHIBITED_ACTIONS = [
  "functional_implementation",
  "dependency_replacement",
  "tracked_generated_output_mutation",
  "existing_consumer_mutation",
  "unrelated_graph_or_selection_mutation",
  "publication_or_deployment",
];

function captureOutput(fn: () => void): { stdout: string; stderr: string } {
  const stdout: string[] = [];
  const stderr: string[] = [];
  const originalLog = console.log;
  const originalError = console.error;
  console.log = (...args: unknown[]) => stdout.push(args.map(String).join(" "));
  console.error = (...args: unknown[]) => stderr.push(args.map(String).join(" "));
  try {
    fn();
  } finally {
    console.log = originalLog;
    console.error = originalError;
  }
  return { stdout: stdout.join("\n"), stderr: stderr.join("\n") };
}

function bodyEvidenceLaneIdentities(body: string): string[] {
  const section = body.match(
    /# Required Evidence Lanes\s+([\s\S]*?)(?=\n# [^\n]+|\s*$)/
  )?.[1];
  assert.ok(section, "Required Evidence Lanes section is missing");
  return Array.from(section.matchAll(/^\|\s*`([a-z0-9_]+)`\s*\|/gm), (match) => match[1]);
}

function exactIdentityError(
  label: string,
  actual: string[],
  expected: string[]
): string | undefined {
  const counts = new Map<string, number>();
  for (const identity of actual) {
    counts.set(identity, (counts.get(identity) ?? 0) + 1);
  }
  const missing = expected.filter((identity) => !counts.has(identity));
  const duplicate = Array.from(counts)
    .filter(([, count]) => count > 1)
    .map(([identity]) => identity);
  const extra = Array.from(counts.keys()).filter((identity) => !expected.includes(identity));
  if (
    missing.length === 0 &&
    duplicate.length === 0 &&
    extra.length === 0 &&
    actual.length === expected.length
  ) {
    return undefined;
  }
  return [
    `${label} identity mismatch`,
    `missing=[${missing.join(",")}]`,
    `duplicate=[${duplicate.join(",")}]`,
    `extra=[${extra.join(",")}]`,
  ].join(" ");
}

function validateTemplateContract(content: string): void {
  const parsed = parseFrontmatter(content, TEMPLATE_RELATIVE_PATH);
  const frontmatterLanes = parsed.frontmatter.evidence_lanes as string[];
  const bodyLanes = bodyEvidenceLaneIdentities(parsed.body);
  const frontmatterError = exactIdentityError(
    "frontmatter evidence lane",
    frontmatterLanes,
    EVIDENCE_LANES
  );
  const bodyError = exactIdentityError("body evidence lane", bodyLanes, EVIDENCE_LANES);
  if (frontmatterError || bodyError) {
    throw new Error([frontmatterError, bodyError].filter(Boolean).join("; "));
  }
  assert.deepEqual(frontmatterLanes, EVIDENCE_LANES);
  assert.deepEqual(bodyLanes, EVIDENCE_LANES);
  assert.deepEqual(parsed.frontmatter.pre_run_questions, PRE_RUN_QUESTIONS);
  assert.deepEqual(parsed.frontmatter.pre_approved_actions, LOCAL_ACTIONS);
  assert.deepEqual(parsed.frontmatter.required_actions, LOCAL_ACTIONS);
  assert.deepEqual(parsed.frontmatter.requested_actions, LOCAL_ACTIONS);
  assert.deepEqual(parsed.frontmatter.approval_gated_actions, APPROVAL_GATED_ACTIONS);
  assert.deepEqual(parsed.frontmatter.prohibited_actions, PROHIBITED_ACTIONS);
  assert.equal(parsed.frontmatter.loop_mode, "readonly");
  assert.equal(parsed.frontmatter.loop_role, "template");
  assert.equal(parsed.frontmatter.materialization_mode, "default_children");
  assert.equal(parsed.frontmatter.blocker_policy, "spike_proposal_recommendation_continue");
}

function snapshotDirectory(root: string): Array<[string, string]> {
  const snapshot: Array<[string, string]> = [];
  const visit = (directory: string): void => {
    for (const entry of fs
      .readdirSync(directory, { withFileTypes: true })
      .sort((a, b) => a.name.localeCompare(b.name))) {
      const absolutePath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        visit(absolutePath);
      } else if (entry.isFile()) {
        snapshot.push([
          path.relative(root, absolutePath),
          fs.readFileSync(absolutePath).toString("base64"),
        ]);
      }
    }
  };
  visit(root);
  return snapshot;
}

function configureSqlite(root: string): void {
  const configPath = path.join(root, ".mdkg", "config.json");
  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  config.index.backend = "sqlite";
  fs.writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`, "utf8");
}

function writeAcceptedDecision(root: string, loopId: string): void {
  writeFile(
    path.join(root, ".mdkg", "design", "dec-1-test-ci-audit-readiness.md"),
    [
      "---",
      "id: dec-1",
      "type: dec",
      "title: Test CI audit readiness",
      "status: accepted",
      "tags: [loop, readiness]",
      "owners: []",
      "links: []",
      "artifacts: []",
      `relates: [${loopId}]`,
      "refs: []",
      "aliases: []",
      "created: 2026-07-26",
      "updated: 2026-07-26",
      "---",
      "",
      "# Decision",
      "",
      "Bind all local-only audit readiness questions.",
    ].join("\n")
  );
}

function bindReadinessDecision(loopPath: string): void {
  const content = fs.readFileSync(loopPath, "utf8");
  const parsed = parseFrontmatter(content, loopPath);
  parsed.frontmatter.question_answer_refs = PRE_RUN_QUESTIONS.map(
    (identity) => `${identity}=dec-1`
  );
  parsed.frontmatter.decision_refs = ["dec-1"];
  fs.writeFileSync(
    loopPath,
    `---\n${formatFrontmatter(parsed.frontmatter).join("\n")}\n---\n${parsed.body.replace(/^\n/, "")}`,
    "utf8"
  );
}

function setupDisposableRepository(): string {
  const root = makeTempDir("mdkg-test-ci-audit-template-");
  writeRootConfig(root);
  configureSqlite(root);
  writeDefaultTemplates(root);
  writeFile(
    path.join(root, TEMPLATE_RELATIVE_PATH),
    fs.readFileSync(TEMPLATE_PATH, "utf8")
  );
  writeFile(path.join(root, ".mdkg", "core", "core.md"), "# Disposable core\n");
  writeFile(
    path.join(root, ".mdkg", "work", "goal-1-selected-fixture.md"),
    [
      "---",
      "id: goal-1",
      "type: goal",
      "title: Selected fixture",
      "status: todo",
      "priority: 1",
      "goal_state: paused",
      "goal_condition: Preserve selected state during loop fork proof.",
      "scope_refs: []",
      "required_skills: []",
      "required_checks: []",
      "max_iterations: 25",
      "blocked_after_attempts: 3",
      "tags: []",
      "owners: []",
      "links: []",
      "artifacts: []",
      "relates: []",
      "blocked_by: []",
      "blocks: []",
      "refs: []",
      "context_refs: []",
      "evidence_refs: []",
      "aliases: []",
      "skills: []",
      "created: 2026-07-26",
      "updated: 2026-07-26",
      "---",
      "",
      "# Goal",
    ].join("\n")
  );
  writeFile(
    path.join(root, ".mdkg", "state", "selected-goal.json"),
    JSON.stringify({ qid: "root:goal-1" }, null, 2)
  );
  captureOutput(() => runIndexCommand({ root }));
  return root;
}

test("canonical test CI audit template has one exact body row per lane identity", () => {
  validateTemplateContract(fs.readFileSync(TEMPLATE_PATH, "utf8"));
});

test("test CI audit lane validator identifies missing duplicate renamed and extra rows", () => {
  const canonical = fs.readFileSync(TEMPLATE_PATH, "utf8");
  const removed = canonical.replace(
    /^\| `smoke_coverage` \|.*\n/m,
    ""
  );
  assert.throws(
    () => validateTemplateContract(removed),
    /missing=\[smoke_coverage\]/
  );

  const duplicated = canonical.replace(
    /^(\| `ci_gate_inventory` \|.*\n)/m,
    "$1$1"
  );
  assert.throws(
    () => validateTemplateContract(duplicated),
    /duplicate=\[ci_gate_inventory\]/
  );

  const renamed = canonical.replace(
    "| `harness_guidance_gaps` |",
    "| `harness_documentation_gaps` |"
  );
  assert.throws(
    () => validateTemplateContract(renamed),
    /missing=\[harness_guidance_gaps\].*extra=\[harness_documentation_gaps\]/
  );

  const extra = canonical.replace(
    /^\| `prioritized_improvements` \|.*\n/m,
    (row) => `${row}| \`unexpected_lane\` | unexpected | yes | none | todo | none | none | none |\n`
  );
  assert.throws(
    () => validateTemplateContract(extra),
    /extra=\[unexpected_lane\]/
  );
});

test("canonical test CI audit dry-run is observational and real fork is ready", () => {
  const completedLoopBefore = fs.readFileSync(COMPLETED_LOOP_PATH, "utf8");
  assert.match(completedLoopBefore, /^status: done$/m);
  assert.match(completedLoopBefore, /template_hash=sha256:[a-f0-9]{64}/);

  const root = setupDisposableRepository();
  const mdkgDir = path.join(root, ".mdkg");
  const beforeDryRun = snapshotDirectory(mdkgDir);
  const dryRun = JSON.parse(
    captureOutput(() =>
      runLoopForkCommand({
        root,
        template: "test-ci-skill-infrastructure-audit",
        scope: ".",
        title: "Disposable test CI audit",
        materialization: "default_children",
        dryRun: true,
        json: true,
        noCache: true,
        noReindex: true,
        now: new Date("2026-07-26T12:00:00.000Z"),
      })
    ).stdout
  );
  assert.equal(dryRun.action, "planned");
  assert.equal(dryRun.dry_run, true);
  assert.deepEqual(snapshotDirectory(mdkgDir), beforeDryRun);

  const fork = JSON.parse(
    captureOutput(() =>
      runLoopForkCommand({
        root,
        template: "test-ci-skill-infrastructure-audit",
        scope: ".",
        title: "Disposable test CI audit",
        materialization: "default_children",
        json: true,
        noCache: true,
        noReindex: true,
        now: new Date("2026-07-26T12:00:00.000Z"),
      })
    ).stdout
  );
  assert.equal(fork.loop.id, dryRun.loop.id);
  assert.deepEqual(
    fork.materialized_children.map((child: { id: string }) => child.id),
    dryRun.materialized_children.map((child: { id: string }) => child.id)
  );

  writeAcceptedDecision(root, fork.loop.id);
  bindReadinessDecision(path.join(root, fork.loop.path));
  captureOutput(() => runIndexCommand({ root }));

  const shown = JSON.parse(
    captureOutput(() =>
      runLoopShowCommand({ root, id: fork.loop.id, json: true })
    ).stdout
  );
  assert.deepEqual(shown.loop.attributes.pre_run_questions, PRE_RUN_QUESTIONS);
  assert.deepEqual(shown.loop.attributes.question_answer_refs, PRE_RUN_QUESTIONS.map(
    (identity) => `${identity}=dec-1`
  ));
  assert.deepEqual(shown.loop.attributes.evidence_lanes, EVIDENCE_LANES);

  const plan = JSON.parse(
    captureOutput(() =>
      runLoopPlanCommand({ root, id: fork.loop.id, json: true })
    ).stdout
  );
  assert.deepEqual(plan.readiness.questions.unanswered_pre_run_questions, []);
  assert.deepEqual(plan.readiness.approvals.pending_approval_actions, []);
  assert.deepEqual(plan.readiness.invalid_bindings, []);
  assert.deepEqual(plan.readiness.blockers.blocked_children, []);
  assert.deepEqual(
    plan.readiness.lanes.evidence.map(
      (lane: { name: string; state: string }) => [lane.name, lane.state]
    ),
    EVIDENCE_LANES.map((identity) => [identity, "waiting"])
  );

  const next = JSON.parse(
    captureOutput(() =>
      runLoopNextCommand({ root, id: fork.loop.id, json: true })
    ).stdout
  );
  assert.equal(next.selected.kind, "child");
  assert.equal(next.selected.qid, `root:${fork.materialized_children[0].id}`);
  assert.equal(fork.materialized_children[0].type, "spike");

  const beforePack = snapshotDirectory(mdkgDir);
  const packOutput = captureOutput(() =>
    runPackCommand({
      root,
      id: fork.loop.id,
      packProfile: "concise",
      dryRun: true,
      stats: true,
      noCache: true,
      noReindex: true,
    })
  );
  assert.match(packOutput.stdout, /dry-run: no files written/i);
  assert.deepEqual(snapshotDirectory(mdkgDir), beforePack);
  assert.equal(fs.readFileSync(COMPLETED_LOOP_PATH, "utf8"), completedLoopBefore);
});
