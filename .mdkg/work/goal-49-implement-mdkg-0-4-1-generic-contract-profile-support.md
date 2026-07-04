---
id: goal-49
type: goal
title: Implement mdkg 0.4.1 generic contract-profile support
status: done
priority: 1
goal_state: achieved
goal_condition: mdkg 0.4.1 generic contract-profile support is implemented across MANIFEST, WORK, WORK_ORDER, and RECEIPT validators, profile validation CLI, scaffolds/helpers, full default/init assets, docs, generated references, changelog, and release-readiness evidence; no npm publish, tag, push, deploy, DNS, provider mutation, or downstream repo mutation occurs in this implementation goal.
scope_refs: [task-637, task-639, task-640, task-641, task-642, task-643, task-644, test-333, test-334, test-335]
last_active_node: task-644
required_skills: [select-work-and-ground-context, build-pack-and-execute-task, verify-close-and-checkpoint]
required_checks: [node dist/cli.js index, node dist/cli.js validate --changed-only --json, node dist/cli.js validate --summary --limit 20 --json, npm run build, npm run test, npm run cli:check, npm run cli:contract, npm run docs:check, node scripts/assert-publish-ready.js, npm run smoke:upgrade, npm run smoke:init, npm run smoke:capabilities, npm run smoke:archive-work, npm run smoke:work-invocation, npm run smoke:warning-ux, npm run smoke:integration-ux, npm run smoke:mdkg-dev-docs, npm run smoke:demo-graph, git diff --check]
max_iterations: 25
blocked_after_attempts: 3
tags: [0.4.1, contract-profile, manifest, work, work-order, receipt, implementation, release-readiness]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [goal-48, task-631, task-632, task-634, task-635, task-636, test-330, test-331, test-332]
context_refs: []
evidence_refs: []
aliases: []
skills: [select-work-and-ground-context, build-pack-and-execute-task, verify-close-and-checkpoint]
created: 2026-07-02
updated: 2026-07-03
---
# Objective

Implement the `goal-48` contract-profile release plan as a source, template,
docs, and readiness lane for `mdkg@0.4.1`.

# End Condition

This goal is achieved when contract-profile behavior is implemented and locally
ready for a separate approval-gated `0.4.1` publish goal:

- optional `contract_profile` is supported on MANIFEST, WORK, WORK_ORDER, and
  RECEIPT;
- optional `validation_policy_ref` and `evidence_policy_ref` are supported on
  MANIFEST, WORK_ORDER, and RECEIPT;
- optional `receipt_kind` and `redaction_class` are supported on RECEIPT only;
- bare `profile` is rejected or diagnosed as ambiguous rather than implemented
  as an alias;
- generic validation keeps shape-based warnings/errors and profile mode
  escalates according to an implemented allowlist;
- CLI flags, scaffolds, work helpers, full default/init assets, docs,
  generated references, changelog, release notes, tests, and smoke gates are
  aligned;
- the closeout checkpoint records a publish-readiness recommendation and exact
  remaining gaps, if any.

# Non-Goals

- Do not publish, tag, push, deploy, change DNS, mutate providers, or update
  downstream Omni Room repos.
- Do not encode Omni Room runtime execution semantics as generic mdkg behavior.
- Do not replace `resource_profile`, WORK `kind`, WORK_ORDER
  `artifact_policy`, or RECEIPT `redaction_policy`.
- Do not print or store raw secrets, prompts, provider payloads, queue payloads,
  or bulky runtime content in diagnostics, fixtures, checkpoints, or packs.

# Recursive Algorithm

1. Start with `task-637` and ground the implementation in `goal-48`,
   `task-631` through `task-636`, `test-330` through `test-332`, and current
   source/templates/docs.
2. Implement validators and stable diagnostics before exposing CLI flags or
   scaffolds.
3. Add explicit profile validation surfaces after generic validators pass.
4. Add CLI scaffold and `mdkg work` helper flags only after validators and
   profile fixtures prove the field behavior.
5. Update full default/init assets only after upgrade preservation is proven.
6. Update docs, generated references, changelog, and release notes only after
   source behavior is proven.
7. Run the implementation gates, record a readiness checkpoint, and leave real
   publish work to `goal-50`.

# Required Skills

- `select-work-and-ground-context`
- `build-pack-and-execute-task`
- `verify-close-and-checkpoint`

# Required Checks

- `node dist/cli.js index`
- `node dist/cli.js validate --changed-only --json`
- `node dist/cli.js validate --summary --limit 20 --json`
- `npm run build`
- `npm run test`
- `npm run cli:check`
- `npm run cli:contract`
- `npm run docs:check`
- `node scripts/assert-publish-ready.js`
- focused validator, profile CLI, scaffold/helper, upgrade, and docs fixtures
- selected smoke gates for upgrade, init, capabilities, archive/work, warnings,
  integration, docs, and demo graph
- `git diff --check`

# Acceptance Criteria

- The accepted and rejected fields match `task-632`.
- Diagnostics use stable ids from `task-636` and never disclose raw content.
- `mdkg validate --profile <name>` and `mdkg work validate --profile <name>`
  are implemented only after generic validation behavior is proven.
- Full default/init assets are updated with explicit upgrade-preservation proof.
- README, `CLI_COMMAND_MATRIX.md`, generated docs, docs site, changelog, and
  release notes are aligned with live CLI behavior.
- The goal closes with a local implementation commit and no publish/push/tag.

# Definition Of Done

- Goal condition is achieved.
- Required checks have evidence.
- Completion evidence is recorded in the goal.

# Stop Conditions

- Goal is blocked beyond the configured attempt limit.
- Required context or permissions are missing.
- Budget or safety constraints prevent continued work.

# Current State

Created from completed `goal-48`. Current package version is `0.4.0`; this
goal targets the next additive patch release, `mdkg@0.4.1`, but does not
publish it.

# Iteration Log

- 2026-07-02: Created as the active implementation lane from the completed
  `goal-48` plan. First node is `task-637`.

# Skill Improvement Candidates

- None yet.

# Completion Evidence

- Pending.
