---
id: goal-50
type: goal
title: Publish mdkg 0.4.1 contract-profile support and validate consumers
status: blocked
priority: 1
goal_state: blocked
goal_condition: mdkg 0.4.1 contract-profile support is published only after explicit approval, npm registry state and dry-runs prove readiness, a strict public naming audit confirms publish-bound mdkg claims are generic, post-publish temp install and workflow probes pass, and any downstream-private consumer handoff cites the actual published version and evidence without making product-specific runtime policy part of mdkg public behavior.
scope_refs: [task-649, test-337, task-645, task-646, task-647, task-648, test-336]
active_node: task-649
required_skills: [select-work-and-ground-context, verify-close-and-checkpoint]
required_checks: [git fetch origin main, git status --short --branch, git log --oneline origin/main..HEAD, git diff --name-status origin/main..HEAD, targeted public naming audit over publish-bound mdkg work nodes, npm ci, npm run build, npm run test, npm run cli:check, npm run cli:contract, npm run docs:check, node scripts/assert-publish-ready.js, node dist/cli.js validate --json, node dist/cli.js validate --changed-only --json, npm pack --dry-run --json, npm publish --dry-run --registry=https://registry.npmjs.org/, npm view mdkg version --registry=https://registry.npmjs.org/, npm view mdkg@0.4.1 version --registry=https://registry.npmjs.org/]
max_iterations: 25
blocked_after_attempts: 3
tags: [0.4.1, contract-profile, npm, publish, postpublish, consumer-handoff, naming-audit, generic-release]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [test-337]
blocks: []
refs: [goal-49, goal-48, task-635, task-636, task-649, test-332, test-337]
context_refs: []
evidence_refs: []
aliases: []
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-07-02
updated: 2026-07-03
---
# Objective

Publish `mdkg@0.4.1` contract-profile support and validate the released package
from a clean temp install, but only after the implementation goal proves
publish readiness and the user explicitly approves real publish/push/tag work.

# End Condition

This goal is achieved when:

- `test-335` from `goal-49` proves implementation publish-readiness;
- the public naming audit proves publish-bound mdkg claims are generic and
  product-specific runtime naming is only historical or downstream-private
  context;
- final local gates, registry checks, npm pack review, and npm publish dry-run
  pass;
- real `npm publish` occurs only after explicit approval;
- registry, dist-tags, temp global install, CLI version, init, validate,
  workflow-file probes, generic profile validation, work helper validation, and
  upgrade probes pass against the published package;
- any downstream-private consumer handoff cites the actual published version and
  post-publish evidence without branding mdkg public behavior around that
  consumer.

# Non-Goals

- Do not start before `test-335` passes.
- Do not run real npm publish, git push, tag creation, tag push, deploy, DNS,
  provider mutation, or downstream repo mutation without explicit approval.
- Do not treat dry-run or local-link behavior as stable downstream release
  evidence.

# Recursive Algorithm

1. Wait for `test-335` from `goal-49`.
2. Run `task-649` / `test-337` public naming audit before publish readiness.
3. Run final git, package, docs, smoke, registry, npm pack, and npm publish
   dry-run gates.
4. Stop for explicit approval before real push/publish/tag operations.
5. Publish with temp npm userconfig that references `${NPM_TOKEN}` literally
   when token auth is used.
6. Validate registry state and temp global install of `mdkg@latest`.
7. Probe fresh temp workspace behavior for init, validate, contract-profile
   fields, profile validation, work helpers, and upgrade.
8. Record any downstream-private consumer handoff and close with evidence.

# Required Skills

- `select-work-and-ground-context`
- `verify-close-and-checkpoint`

# Required Checks

- `git fetch origin main`
- `git status --short --branch`
- `git log --oneline origin/main..HEAD`
- `git diff --name-status origin/main..HEAD`
- targeted public naming audit over active release/publish work nodes
- `npm ci`
- full package, docs, CLI, validation, and smoke gates from `goal-49`
- registry checks for current `mdkg` latest and `mdkg@0.4.1`
- npm pack dry-run and package payload review
- npm publish dry-run
- post-publish registry, dist-tags, temp global install, workflow-file, generic
  profile validation, work helper, and upgrade probes

# Acceptance Criteria

- Release work remains blocked until `test-335` passes.
- Real publish/push/tag operations happen only after explicit user approval.
- Published package evidence comes from npm registry and clean temp install, not
  local source.
- Public mdkg primitives are described generically: external/source
  descriptors, accepted revision evidence, validation/evidence policy refs,
  receipt/redaction metadata, and generic profile validation.
- Handoff language separates generic mdkg contract-profile support from
  downstream-private runtime policy.

# Definition Of Done

- Goal condition is achieved.
- Required checks have evidence.
- Completion evidence is recorded in the goal.

# Stop Conditions

- Goal is blocked beyond the configured attempt limit.
- Required context or permissions are missing.
- Budget or safety constraints prevent continued work.

# Current State

Created as the blocked follow-up release lane for `goal-49`. The current first
node is `task-649`, which must prove generic-only public naming posture before
`task-645` can run final prepublish gates.

# Iteration Log

- 2026-07-02: Created as blocked publish/post-publish lane for `mdkg@0.4.1`.
- 2026-07-03: Inserted `task-649` / `test-337` as the strict generic public
  naming audit before publish readiness.

# Skill Improvement Candidates

- None yet.

# Completion Evidence

- Pending.
