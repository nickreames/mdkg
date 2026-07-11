---
id: goal-62
type: goal
title: Plan and design the mdkg v0.5.0 loop release experience
status: todo
priority: 1
goal_state: paused
goal_condition: The v0.5.0 public release experience is implementation-ready only after test-400 proves a clean committed baseline, source-backed loop capabilities and an evidence-labeled value story are accepted, current mdkg.dev and docs.mdkg.dev are audited from fresh screenshots, exactly three announcement-section directions are reviewed with the operator, top-level Loops information architecture and shared dormant activation are decided, and goal-63 is fully populated from accepted EDD DEC and PRD records.
scope_refs: [epic-229, epic-230, epic-231, task-710, task-711, task-712, task-713, task-714, task-715, test-383, test-384, test-385, test-386, test-387]
required_skills: [select-work-and-ground-context, service-boundary-ownership-check, build-pack-and-execute-task, verify-close-and-checkpoint]
required_checks: [verified test-400 clean committed baseline before activation, git status --short --branch, required plugin skill product-design:audit, required plugin skill product-design:ideate, required plugin skill sales:index, fresh desktop and mobile screenshot evidence, node dist/cli.js validate --changed-only --json, node dist/cli.js validate --summary --json --limit 20, node dist/cli.js goal show goal-62 --json, node dist/cli.js goal next goal-62 --json, node dist/cli.js pack task-710 --pack-profile concise --dry-run --stats, git diff --check]
max_iterations: 25
blocked_after_attempts: 3
tags: [release, planning, design, mdkg-dev, docs, 0.5.0]
owners: []
links: []
artifacts: []
relates: [goal-61, goal-63]
blocked_by: [test-400]
blocks: [goal-63]
refs: [goal-61, chk-426, goal-63, goal-58, goal-59, dec-73, task-729, test-400]
context_refs: [goal-56, goal-61, chk-426, goal-58, goal-59, edd-70, dec-67, edd-71, dec-68, dec-73, prd-11, task-729, test-400]
evidence_refs: []
aliases: [v0-5-0-release-experience-planning]
skills: [select-work-and-ground-context, service-boundary-ownership-check, build-pack-and-execute-task, verify-close-and-checkpoint]
created: 2026-07-10
updated: 2026-07-10
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

Paused and blocked by `test-400`. Goal 61 is achieved with authoritative
release-candidate evidence in `chk-426`, and `dec-73` records the accepted
incremental announcement, security walkthrough, top-level Loops docs, and
dormant-route direction. After the standalone baseline task and test close, the
operator may clear the blocker, activate this goal, and route first to
`task-710`. Current `mdkg goal activate` behavior does not hard-enforce
`blocked_by`, so the operator must treat `test-400` as the authoritative gate
and must not activate this goal early.

# Iteration Log

- 2026-07-10: Created as the collaborative design lane following loop hardening.
- 2026-07-10: Unblocked after `goal-61` achieved; retained paused state for
  explicit operator activation and collaborative design decisions.
- 2026-07-10: Locked the release-experience direction in `dec-73` and added
  `task-729` / `test-400` as a clean-baseline prerequisite before activation.

# Skill Improvement Candidates

- None yet.

# Completion Evidence

- Pending.
