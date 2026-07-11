---
id: goal-62
type: goal
title: Plan and design the mdkg v0.5.0 loop release experience
status: done
priority: 1
goal_state: achieved
goal_condition: The v0.5.0 public release experience is implementation-ready only after test-400 proves a clean committed baseline, source-backed loop capabilities and an evidence-labeled value story are accepted, current mdkg.dev and docs.mdkg.dev are audited from fresh screenshots, exactly three announcement-section directions are reviewed with the operator, top-level Loops information architecture and shared dormant activation are decided, and goal-63 is fully populated from accepted EDD DEC and PRD records.
scope_refs: [epic-229, epic-230, epic-231, task-710, task-711, task-712, task-713, task-714, task-715, test-383, test-384, test-385, test-386, test-387]
last_active_node: task-715
required_skills: [select-work-and-ground-context, service-boundary-ownership-check, build-pack-and-execute-task, verify-close-and-checkpoint]
required_checks: [verified test-400 clean committed baseline before activation, git status --short --branch, required plugin skill product-design:audit, required plugin skill product-design:ideate, required plugin skill sales:index, fresh desktop and mobile screenshot evidence, node dist/cli.js validate --changed-only --json, node dist/cli.js validate --summary --json --limit 20, node dist/cli.js goal show goal-62 --json, node dist/cli.js goal next goal-62 --json, node dist/cli.js pack task-710 --profile concise --dry-run --stats, git diff --check]
max_iterations: 25
blocked_after_attempts: 3
tags: [release, planning, design, mdkg-dev, docs, 0.5.0]
owners: []
links: []
artifacts: []
relates: [goal-61, goal-63]
blocked_by: []
blocks: [goal-63]
refs: [goal-61, chk-426, goal-63, goal-58, goal-59, dec-73, dec-74, prop-7, prop-8, task-729, test-400, chk-427, chk-428, chk-429, chk-430, chk-431, chk-432, chk-433, chk-434, chk-435, chk-436, chk-437, chk-438, chk-439, chk-440]
context_refs: [goal-56, goal-61, chk-426, goal-58, goal-59, edd-70, dec-67, edd-71, dec-68, dec-73, dec-74, prd-11, prop-7, prop-8, task-729, test-400]
evidence_refs: [chk-427, chk-428, chk-429, chk-430, chk-431, chk-432, chk-433, chk-434, chk-435, chk-436, chk-437, chk-438, chk-439, chk-440]
aliases: [v0-5-0-release-experience-planning]
skills: [select-work-and-ground-context, service-boundary-ownership-check, build-pack-and-execute-task, verify-close-and-checkpoint]
created: 2026-07-10
updated: 2026-07-11
---
# Objective

Collaboratively define the incremental post-quickstart mdkg.dev announcement and
top-level docs.mdkg.dev loop experience for verified `v0.5.0` capabilities
without turning internal release evidence into unsupported public claims.

# End Condition

The planning lane starts only from the clean baseline proven by `test-400` and
closes only after the operator accepts the value narrative, one of exactly three
announcement-section directions, the top-level Loops documentation architecture,
the shared source-controlled dormant activation contract, and a fully executable
`goal-63` populated with implementation epics, tasks, tests, assets, and browser
acceptance criteria.

# Non-Goals

- Do not edit website, docs, package, generated, or deployment files.
- Do not publish, push, deploy, activate a release, or change DNS/analytics.
- Do not invent ROI, competitive superiority, production adoption, or runtime
  execution claims.
- Do not close through inferred operator preferences; record explicit decisions.
- Do not redesign the homepage hero, add a dedicated marketing release page, or
  expand into unrelated site design work.
- Do not perform the baseline commits from this planning goal; `task-729` and
  `test-400` are standalone prerequisites.

# Recursive Algorithm

1. Remain paused until `task-729` and `test-400` prove a clean local baseline.
2. Build a source-backed capability inventory from completed Goal 61 evidence.
3. Use Sales routing to label claims as Known, Inferred, Assumed, or Missing.
4. Capture fresh desktop/mobile screenshots and run Product Design Audit.
5. Produce exactly three announcement-section directions with Product Design
   Ideate and pause for operator selection.
6. Resolve exact copy, routes, accessibility, SEO, public-alpha, and activation
   details within the accepted `dec-73` boundary.
7. Finalize `edd-71`, `dec-68`, `dec-73`, and `prd-11`, then populate and unblock
   `goal-63` without implementing it.

# Required Skills

- Local mdkg planning, ownership, pack, and verification skills in frontmatter.
- Product Design `audit` and `ideate` plugin workflows.
- Sales `index` routing for the evidence-labeled value story.

# Required Checks

- Fresh screenshot-backed audit receipts for both sites and both viewport classes.
- Exactly three visual concepts plus an explicit operator decision.
- Source citation or evidence classification for every public capability claim.
- Graph validation and a dry-run pack for the seeded implementation handoff.

# Acceptance Criteria

- `test-383` through `test-387` pass.
- `test-400` passed before this goal was activated.
- Primary audience is AI coding teams and agent-harness engineers; maintainers
  adopting mdkg are secondary.
- The release narrative distinguishes goals as outcomes from loops as durable,
  reusable processes with lineage, recovery, and a high definition of done.
- One source-controlled activation flag keeps release promotion dormant until
  Goal 4 verifies npm.
- The homepage change is an announcement immediately after quickstart, security
  is the first walkthrough, and the docs use a top-level Loops group.

# Definition Of Done

- Goal condition is achieved.
- Required checks have evidence.
- Completion evidence is recorded in the goal.

# Stop Conditions

- `test-400` has not proved a clean committed baseline.
- The operator has not selected a visual direction or resolved a material claim.
- Work starts editing public surfaces instead of planning them.

# Current State

The clean baseline, capability ledger, claim-safety test, value hierarchy,
sixteen-screenshot audit, and three independent announcement directions are
complete in `chk-427` through `chk-433`. The operator selected Process Rail with
the Readiness Ledger runtime-boundary refinement; accepted `dec-74` fixes exact
copy, proof stages, mobile behavior, routes, and the shared `prop-8` activation
contract. `chk-434` through `chk-437` close the visual and contract lanes.

Goal 63 is fully seeded with five epics, thirteen implementation tasks, seven
acceptance tests, exact assets/copy/routes, strict dormant-state behavior, and
browser/accessibility criteria. `chk-438` and `chk-439` verify the mdkg-only
handoff. No website, docs, package, generated command, deployment, or public
release source was changed by this planning goal.

# Iteration Log

- 2026-07-10: Created as the collaborative design lane following loop hardening.
- 2026-07-10: Unblocked after `goal-61` achieved; retained paused state for
  explicit operator activation and collaborative design decisions.
- 2026-07-10: Locked the release-experience direction in `dec-73` and added
  `task-729` / `test-400` as a clean-baseline prerequisite before activation.
- 2026-07-10: Baseline commits `f28b1f74` and `a4e17899` passed `test-400` with
  evidence in `chk-427` and `chk-428`; the pre-activation blocker was cleared.
- 2026-07-10: Completed source-backed capability and value-story lanes with
  `chk-429` through `chk-432`; completed the 16-screenshot Product Design audit
  in `chk-433`.
- 2026-07-10: Generated exactly three incremental announcement directions,
  recorded mobile/docs mappings in `prop-7`, and drafted the complete shared
  activation/IA/security-walkthrough/Goal-63 blueprint in `prop-8`.
- 2026-07-10: Paused at proposed `dec-74` because explicit operator selection is
  required and cannot be inferred.
- 2026-07-11: Operator selected Process Rail and accepted Direction 2's explicit
  mdkg-versus-harness runtime boundary; `dec-74` became accepted.
- 2026-07-11: Finalized EDD/DEC/PRD, classified audit B1-B5 as release blockers
  and F1-F4 as follow-up, and closed `task-713` / `test-385` plus
  `task-714` / `test-386`.
- 2026-07-11: Materialized Goal 63 as `epic-236` through `epic-240`,
  `task-730` through `task-742`, and `test-401` through `test-407`; graph and
  concise handoff checks pass with zero validation warnings or errors.

# Skill Improvement Candidates

- None yet.

# Completion Evidence

- Baseline: `chk-427`, `chk-428`, and passed `test-400`.
- Capability and claims: `chk-429` through `chk-432` and passed `test-383` /
  `test-384`.
- Product Design audit and selection: `chk-433` through `chk-435`, three stored
  artifacts, passed `test-385`, and accepted `dec-74`.
- Final release contract: `chk-436`, `chk-437`, passed `test-386`, accepted
  `edd-71`, `dec-68`, `dec-73`, `dec-74`, and `prd-11`.
- Goal 63 handoff: `chk-438`, `chk-439`, passed `test-387`, populated scope,
  first node `task-730`, and validated concise pack.
- Changed-only and summary validation pass with zero warnings/errors;
  `git diff --check` passes; changed paths remain `.mdkg` only.
- Goal closeout receipt: `chk-440`.
