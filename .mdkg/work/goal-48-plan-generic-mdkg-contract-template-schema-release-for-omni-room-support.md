---
id: goal-48
type: goal
title: plan generic mdkg contract template schema release for Omni Room support
status: todo
priority: 1
goal_state: paused
goal_condition: Goal 48 is complete when mdkg has a decision-complete release plan for generic MANIFEST/WORK/WORK_ORDER/RECEIPT contract template, schema, validator, CLI, scaffold, docs, and package validation changes needed by Omni Room consumers, without hardcoding a future version and without changing source, package metadata, public docs, seed/default assets, or downstream repos in the planning pass.
scope_refs: [task-633, task-631, task-632, task-634, task-635, task-636, test-330, test-331, test-332]
required_skills: [select-work-and-ground-context, verify-close-and-checkpoint]
required_checks: [git status --short --branch, mdkg status --json, mdkg index, mdkg validate --changed-only --json, mdkg validate --summary --limit 20 --json, git diff --check, git diff --cached --name-status]
max_iterations: 25
blocked_after_attempts: 3
tags: [mdkg, templates, schema, release, omni-room, planning]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: []
context_refs: [task-633, task-631, task-632, task-634, task-635, task-636, test-330, test-331, test-332]
evidence_refs: [chk-342]
aliases: [contract-template-schema-release-plan, omni-room-contract-profile-release-plan]
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-07-02
updated: 2026-07-02
---
# Objective

Create and later execute a child-owned mdkg planning lane for the generic
contract-template/schema release work requested by the root Omni Room planning
handoff.

This goal is intentionally paused. The current pass only seeds the release
planning graph and checkpoint. Later work may inspect source, tests, templates,
docs, and package/release surfaces, but must not start implementation until the
goal is deliberately resumed.

# End Condition

This goal is achieved only when mdkg has a decision-complete, version-agnostic
release plan for generic contract support covering:

- release-candidate inventory from root handoffs plus current mdkg source/docs;
- classification of MANIFEST, WORK, WORK_ORDER, and RECEIPT template, schema,
  validator, CLI, scaffold, and docs changes;
- profile-aware validation strategy for Omni Room support without baking
  runtime-only behavior into generic mdkg;
- candidate fields such as `contract_profile`, `receipt_kind`, and
  `redaction_class`, including compatibility with current generic fields such
  as `resource_profile`, WORK `kind`, and receipt `redaction_policy`;
- scaffold and upgrade behavior, including customization preservation and
  seed/default asset blast-radius decisions;
- consumer runtime dependency boundaries for unreleased or experimental fields;
- warning-output and strict-doctor guidance;
- package, smoke, npm-pack, and release validation plan;
- checkpointed closeout evidence, local commit evidence, and explicit no-push
  status.

# Non-Goals

- No functional TypeScript/source changes in this seeding pass.
- No package, README, CLI docs, generated docs, template, skill, asset, or
  `assets/init/skills/default` changes in this seeding pass.
- No seed/default template mutation unless a later explicit mdkg-owned goal
  authorizes that blast radius.
- No hardcoded future mdkg version number.
- No npm publish, version bump, tag, push, merge, deploy, provider mutation, or
  downstream runtime/sandbox/backend repo mutation.
- No raw secrets, raw prompts, raw payloads, provider dumps, or bulky runtime
  evidence in mdkg nodes.

# Recursive Algorithm

1. Resume this goal only when mdkg-internal planning work is explicitly
   authorized.
2. Start with `task-633` and build a source-grounded inventory from the root
   handoffs, root source nodes, and current mdkg source/docs.
3. Classify each candidate as generic mdkg release work, Omni Room profile
   policy, runtime-only consumer work, docs-only guidance, or out of scope.
4. Decide whether profile fields are generic, optional, experimental, or
   rejected before any template/schema/source edits.
5. Plan scaffold and upgrade behavior before touching bundled init assets,
   default templates, docs, or generated references.
6. Define consumer dependency boundaries so runtime does not require unreleased
   mdkg flags or schema fields without an explicit experimental caveat.
7. Plan warning, strict-doctor, release, package, and smoke validation gates.
8. Record checkpoint evidence and close only after all scoped tasks/tests are
   done or deliberately superseded.

# Required Skills

- `select-work-and-ground-context`
- `verify-close-and-checkpoint`

The root handoff named `mdkg-goal-completion-hygiene` as desirable closeout
guidance, but this child repo does not currently register that skill slug. Keep
the closeout hygiene requirement in narrative evidence unless a later skill
sync adds the slug locally.

# Required Checks

- `git status --short --branch`
- `mdkg status --json`
- `mdkg index`
- `mdkg validate --changed-only --json`
- `mdkg validate --summary --limit 20 --json`
- `git diff --check`
- `git diff --cached --name-status`

# Acceptance Criteria

- The release plan starts from root handoff/source evidence and current mdkg
  source/docs, not memory alone.
- Generic mdkg contract behavior is separated from Omni Room runtime-only
  policy.
- MANIFEST, WORK, WORK_ORDER, and RECEIPT surfaces are each classified across
  template, schema, validator, CLI, scaffold, docs, and release-test impact.
- Profile-aware validation, `contract_profile`, `receipt_kind`,
  `redaction_class`, warning output, and strict-doctor behavior have explicit
  decision points before implementation.
- Upgrade/scaffold behavior preserves local customization and treats
  seed/default changes as explicitly gated.
- Consumer runtime dependency guidance avoids unreleased mdkg hard dependencies
  unless marked experimental/local.
- Package/release validation and closeout evidence are specified without a
  hardcoded future version.

# Definition Of Done

- Goal condition is achieved.
- Required checks have evidence.
- Completion evidence is recorded in the goal.
- Scoped tasks/tests are done or superseded with equivalent evidence.
- A local commit captures the completed planning work. No push has occurred.

# Stop Conditions

- A proposed change would mutate functional source, package files, public docs,
  templates, skills, init assets, seed/default assets, or downstream repos
  during the seeding pass.
- A proposed schema field would encode Omni Room runtime-only policy as a
  generic mdkg contract without an accepted decision.
- Release validation would require npm publish, version bump, tag, push, merge,
  deploy, or provider mutation before an explicit execution goal.
- Required root evidence or current source evidence is missing.

# Current State

Seeded by the root:goal-42 mdkg-internal child pass on 2026-07-02 and
intentionally paused/todo. The seed pass created only mdkg work/checkpoint
planning nodes and mdkg event-log entries.

Source evidence reviewed during seeding:

- root handoff pack `.mdkg/pack/handoff_root_goal_41_mdkg_release.md`
- root boundary handoff `.mdkg/pack/handoff_root_task_398_boundary.md`
- root source node `.mdkg/work/goal-41-plan-mdkg-cli-template-schema-release-for-omni-room-contract-support.md`
- root source node `.mdkg/work/task-398-create-backend-mdkg-and-root-follow-up-boundary-handoff.md`
- child startup docs `AGENTS.md`, `AGENT_START.md`, `.mdkg/core/SOUL.md`,
  `.mdkg/core/COLLABORATION.md`, `.mdkg/core/HUMAN.md`, `.mdkg/README.md`, and
  `CLI_COMMAND_MATRIX.md`
- current mdkg templates and validators sampled from `.mdkg/templates/default`,
  `src/graph/agent_file_types.ts`, `src/commands/validate.ts`,
  `src/commands/upgrade.ts`, `src/cli.ts`, `README.md`, and
  `CLI_COMMAND_MATRIX.md`

# Iteration Log

- 2026-07-02: Seeded paused planning lane with tasks `task-631` through
  `task-636`, tests `test-330` through `test-332`, and checkpoint `chk-342`.

# Skill Improvement Candidates

- None yet.

# Completion Evidence

- Pending; this goal is intentionally todo/paused after seeding.
