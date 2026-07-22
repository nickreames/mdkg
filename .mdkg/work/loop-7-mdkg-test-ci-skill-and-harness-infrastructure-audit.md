---
id: loop-7
type: loop
title: mdkg test CI skill and harness infrastructure audit
status: done
priority: 1
scope_refs: []
loop_mode: readonly
loop_role: scoped
scope_description: Root package tests builds CI automation scripts docs and mdkg-dev gate integration canonical skills managed mirrors public init seeds and agent harness guidance.
template_refs: [template://loops/test-ci-skill-infrastructure-audit]
materialization_mode: default_children
child_refs: [spike-32, test-461, task-801]
pre_run_questions: [scope_and_exclusions, ci_evidence_source_policy, local_execution_budget, authoritative_skill_projection_contract, generated_output_policy]
question_answer_refs: [scope_and_exclusions=dec-86, ci_evidence_source_policy=dec-86, local_execution_budget=dec-86, authoritative_skill_projection_contract=dec-86, generated_output_policy=dec-86]
pre_approved_actions: [inspect_tests_and_build_configuration, inspect_ci_configuration, inspect_automation_scripts, inspect_skill_registry_and_projections, inspect_harness_guidance, run_local_node24_verification, create_mdkg_evidence_and_followups]
approval_gated_actions: [external_ci_provider_calls, external_network_or_registry_calls]
required_actions: [inspect_tests_and_build_configuration, inspect_ci_configuration, inspect_automation_scripts, inspect_skill_registry_and_projections, inspect_harness_guidance, run_local_node24_verification, create_mdkg_evidence_and_followups]
requested_actions: [inspect_tests_and_build_configuration, inspect_ci_configuration, inspect_automation_scripts, inspect_skill_registry_and_projections, inspect_harness_guidance, run_local_node24_verification, create_mdkg_evidence_and_followups]
prohibited_actions: [functional_source_changes, test_source_changes, ci_configuration_changes, skill_file_edits, skill_mirror_sync, tracked_generated_output_changes, dependency_or_lockfile_changes, unrelated_loop_or_selected_goal_mutation, commit_push_tag_publish_deploy]
action_approval_refs: []
evidence_lanes: [local_test_build_inventory, ci_gate_inventory, smoke_coverage, skill_registry_mirror_integrity, harness_guidance_gaps, prioritized_improvements]
evidence_lane_refs: [local_test_build_inventory=chk-544, ci_gate_inventory=chk-544, smoke_coverage=chk-544, skill_registry_mirror_integrity=chk-544, harness_guidance_gaps=chk-544, prioritized_improvements=chk-544]
lane_waiver_refs: []
lane_waiver_decision_refs: []
lane_waiver_approval_refs: []
run_refs: [chk-542]
decision_refs: [dec-86]
output_refs: [task-801, chk-543, task-802, test-462, task-803, test-463, task-804, test-464, task-805, test-465, task-806, test-466, prop-9]
approval_refs: []
evaluation_refs: [test-461]
definition_of_done: Every required evidence lane has identity-bound completed evidence or a same-lane accepted waiver decision plus verified approval; all three materialized children are done; test CI smoke skill-projection and harness gaps are classified and prioritized; final validation receipts are linked.
blocker_policy: spike_proposal_recommendation_continue
tags: [loop-template, audit, tests, ci, skills, loop-fork]
owners: []
links: []
artifacts: [template_path=.mdkg/templates/loops/test-ci-skill-infrastructure-audit.loop.md, template_hash=sha256:84d12faf4c33d808eae229f13f169f5b1aedd199e9ef5ef3f1b4b055f0fb3c39, .mdkg/artifacts/loop-7/test-ci-skill-infrastructure]
relates: [dec-86]
blocked_by: []
blocks: []
refs: [template://loops/test-ci-skill-infrastructure-audit, dec-86]
context_refs: [root:chk-426, root:chk-512, root:chk-531, root:chk-540, root:dec-85, root:dec-86]
evidence_refs: [chk-544]
aliases: []
skills: [pursue-mdkg-loop]
created: 2026-07-17
updated: 2026-07-17
---
# Fork Context

- Source template: template://loops/test-ci-skill-infrastructure-audit
- Source path: .mdkg/templates/loops/test-ci-skill-infrastructure-audit.loop.md
- Source hash: sha256:84d12faf4c33d808eae229f13f169f5b1aedd199e9ef5ef3f1b4b055f0fb3c39
- Scope: the mdkg repository root test, CI, automation, skill-projection, and
  harness infrastructure described below.
- Materialization mode: default_children
- Materialized child refs and routing order: spike-32, test-461, task-801
- Accepted pre-run decision: dec-86

# Operating Model

Run a local-only audit. Functional source, tests, workflows, skill files,
managed mirrors, public seeds, dependencies, lockfiles, and tracked generated
outputs are read-only. The loop may write bounded mdkg decisions, evidence,
artifacts, checkpoints, and justified follow-up tasks/tests.

# Scope And Ownership

- Root package/build/test configuration: `package.json`, lock and TypeScript
  configs, `src/`, `tests/`, and `scripts/`.
- CI source: `.github/workflows/release-readiness.yml`; no live provider state.
- Workspace integration: docs and mdkg-dev package/build behavior as reached by
  root CI, release, and smoke commands; no product-design or stack audit.
- Skill infrastructure: canonical `.mdkg/skills`, configured `.agents/skills`
  and `.claude/skills` projections, registry/config, and governed public init
  seeds. `release-mdkg-package` remains intentionally repository-local under
  `dec-85`.
- Harness guidance: startup wrappers, collaboration/core guidance,
  contributing and CLI references, relevant agent workflow docs, and
  representative examples.
- Excluded: duplicate/lint, security rediscovery, stack modernization,
  product-design/UX, and user-story audits; provider, registry, advisory,
  publication, deployment, and unrelated-loop actions.

# Historical Context

- `chk-426`: loop/readiness behavior and prior Node 24 CI evidence.
- `chk-512`: security verification integrated into release gates.
- `chk-531`: prior complete local prepublish evidence.
- `chk-540`: canonical skill, managed mirror, and public-seed proof.
- `dec-85`: repository-only release skill boundary.

These refs are context only. They do not complete a current evidence lane.

# Pre-Run Decision Matrix

| Question identity | Accepted decision | Answer |
| --- | --- | --- |
| scope_and_exclusions | dec-86 | exact repository surfaces and adjacent-audit exclusions |
| ci_evidence_source_policy | dec-86 | checked-in source plus current local receipts; no provider/API evidence |
| local_execution_budget | dec-86 | one Node 24 coverage, CI-release, and full prepublish pass with time bounds |
| authoritative_skill_projection_contract | dec-86 | `.mdkg/skills` canonical; configured mirrors managed; public seed governed subset |
| generated_output_policy | dec-86 | ignored outputs and private temp allowed; unauthorized tracked drift stops the lane |

# Action Authorization Matrix

| Action | Class | Required/requested | State |
| --- | --- | --- | --- |
| inspect tests/build configuration, CI, scripts, skills/projections, and harness guidance | pre-approved | yes/yes | authorized |
| run bounded local Node 24 verification | pre-approved | yes/yes | authorized by dec-86 |
| create bounded mdkg evidence and justified follow-up tasks/tests | pre-approved | yes/yes | authorized |
| external CI-provider calls | approval-gated | no/no | unrequested and unauthorized |
| external network or registry calls | approval-gated | no/no | unrequested and unauthorized |
| source/test/workflow/skill/generated/dependency edits or release actions | prohibited | no/no | forbidden |

# Child Routing

1. `spike-32` inventories and classifies the complete static surface.
2. `test-461` executes the accepted local verification ladder and records
   current receipts.
3. `task-801` synthesizes and prioritizes findings after inventory and
   verification are complete.

# Required Evidence Matrix

| Stable lane identity | Primary children | Required evidence | State |
| --- | --- | --- | --- |
| local_test_build_inventory | spike-32 + test-461 | script/test/build inventory and current command receipts | completed: chk-544 |
| ci_gate_inventory | spike-32 + test-461 | workflow-to-command parity, runtime/time/network policy, and local CI receipt | completed: chk-544 |
| smoke_coverage | spike-32 + test-461 | every smoke alias classified plus full prepublish receipt | completed: chk-544 |
| skill_registry_mirror_integrity | spike-32 + test-461 | registry/projection inventory, validation, hashes, and intentional seed divergence | completed: chk-544 |
| harness_guidance_gaps | spike-32 | source-backed startup/harness contradiction or gap map | completed: chk-544 |
| prioritized_improvements | task-801 | deduplicated risk/payoff/effort ordering and bounded follow-up nodes | completed: chk-544 |

No lane is waived. All six stable identities bind to final done checkpoint
`root:chk-544`, which references the three child checkpoints and seven compact
artifacts.

# Local Execution Contract

Use Node `24.16.0` and npm `11.13.0` from
`/opt/homebrew/opt/node@24/bin`, with npm offline, audit-disabled,
fund-disabled, and a dedicated cache and `TMPDIR` under
`/private/tmp/mdkg-test-ci-audit-loop-7/`.

The validation child owns one pass each of:

- offline dependency-tree inspection for root, docs, and mdkg-dev;
- `npm run test:coverage` with a 30-minute limit;
- `npm run ci:release` with a 30-minute limit;
- `npm run prepublishOnly` with a 60-minute limit;
- mdkg skill list/validation and canonical/projection comparisons; and
- graph validation plus tracked-path and Git boundary checks.

`npm ci` is inspected but not run. Node 24.16 satisfies the package engine and
floating `24.x` workflow row; the exact `24.15.0` row remains source-inspected,
not locally executed.

# Evidence Artifacts

Compact summaries belong under
`.mdkg/artifacts/loop-7/test-ci-skill-infrastructure/`:

- `test-command-inventory.json`
- `ci-parity-matrix.json`
- `smoke-coverage-map.json`
- `skill-projection-inventory.json`
- `harness-guidance-map.md`
- `command-receipts.md`
- `prioritized-recommendations.md`

Bulky logs, package caches, temporary installs, and fixtures stay under the
dedicated `/private/tmp` root and are not committed.

# Blocker Continuation

Treat command failure, timeout, unavailable external evidence, or hidden
network coupling as lane evidence. Record it and continue every unaffected
lane. Do not use a blocker as permission to edit functional surfaces.

For a non-trivial blocker, record at least three viable recovery paths and one
recommended path. Keep the whole loop open while useful authorized work
remains. A required-lane waiver needs both a same-lane accepted decision and a
separate verified approval.

# Closeout Contract

After all children finish, create one final audit checkpoint referencing their
receipts and artifacts. Bind that checkpoint to all six evidence identities,
place the execution receipt in `run_refs`, retain `test-461` in
`evaluation_refs`, and put recommendation/follow-up nodes in `output_refs`.

Follow-up tasks/tests do not block loop closure unless explicitly promoted into
`child_refs`. Mark the loop done only after `mdkg loop plan root:loop-7`
reports `closeout.ready: true` and final graph/Git checks prove no unauthorized
tracked changes.

# Audit Result

- Inventory: 65 package scripts, 90 test files/676 current test identities, 59
  automation scripts, 47 smoke aliases, one 30-minute two-row CI matrix, eight
  canonical skills, and seven compact evidence artifacts.
- Current execution: coverage passed; `ci:release` and `prepublishOnly` each
  failed once on the same stale publish-readiness heading assertion during
  local `npm pack`; no command was retried.
- Integrity: managed skill mirrors and skill validation pass; public seed
  currentness, clean nested installs, build amplification, coverage gating, CI
  topology, and harness contradictions have bounded residual outputs.
- Boundaries: no functional, dependency, lockfile, provider, registry, release,
  selected-goal, or unrelated-loop mutation occurred.
- Waivers and approvals: none.

# Residual Outputs

- P0: `root:task-802` -> `root:test-462`.
- P1: `root:task-803` -> `root:test-463`; `root:task-804` ->
  `root:test-464`; `root:task-805` -> `root:test-465`; `root:prop-9`.
- P2: `root:task-806` -> `root:test-466`.

These refs are in `output_refs` and are not children. Their implementation
does not block the definition-complete read-only audit.

# Final Closeout Receipt

- `mdkg loop plan root:loop-7 --no-cache --no-reindex --json`: closeout ready;
  nine completed child/evidence states, zero blocked/waiting/waived/actionable
  or missing states, zero unanswered questions, pending approvals, invalid
  bindings, or warnings.
- Template lineage remains current at
  `sha256:84d12faf4c33d808eae229f13f169f5b1aedd199e9ef5ef3f1b4b055f0fb3c39`.
- After `mdkg index`, changed-only and bounded full validation both returned
  `ok: true`, zero warnings, and zero errors.
- Concise pack dry-run succeeded with 25 nodes and approximately 4,727 tokens;
  latest checkpoint is `root:chk-544`.
- `git diff --check` passed; nothing is staged; the only tracked changed path is
  normal mdkg metadata `.mdkg/index/mdkg.sqlite`. All other additions are
  loop-scoped `.mdkg` nodes/artifacts.
- No commit, push, provider call, registry call, publication, tag, or deployment
  occurred.
