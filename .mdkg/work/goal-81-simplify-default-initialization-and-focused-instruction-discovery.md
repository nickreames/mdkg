---
id: goal-81
type: goal
title: Simplify default initialization and focused instruction discovery
status: done
priority: 1
goal_state: achieved
goal_condition: Compact default initialization and reviewed provenance-aware upgrades preserve user content while focused instruction discovery and native skill links pass the complete bootstrap acceptance matrix.
scope_refs: [task-816, task-817, task-818, test-474]
last_active_node: test-474
required_skills: [select-work-and-ground-context, service-boundary-ownership-check, verify-close-and-checkpoint]
required_checks: [npm run build, npm run test, npm run cli:check, npm run docs:check, npm run smoke:upgrade, node dist/cli.js skill validate --json, node dist/cli.js validate --changed-only --json, node dist/cli.js validate --json, git diff --check]
max_iterations: 25
blocked_after_attempts: 3
tags: [alignment-002, execution-authorized]
owners: [mdkg-project-agent]
links: []
artifacts: []
relates: [goal-82]
blocked_by: []
blocks: []
refs: []
context_refs: [dec-93, edd-80, dec-17, dec-18, dec-19, edd-56, goal-78, task-363]
evidence_refs: [chk-563, chk-564, test-474]
aliases: []
skills: []
created: 2026-09-05
updated: 2026-09-05
---

# Objective

Make mdkg initialization easy to enter, with compact AGENTS.md/CLAUDE.md adapters,
detailed guidance under .mdkg, and task-specific skill discovery.

# End Condition

The goal condition is met only by implemented and verified behavior for all four
scope nodes, not by authoring this plan. Fresh init and upgrade preserve custom
content, commands remain compatible, and every supported generated link resolves.

# Non-Goals

- Fleet-wide migration, public website positioning, README/LICENSE relocation.
- Remote skill distribution, source feature changes outside bootstrap.
- Commit, push, package publication, provider or deployment activity.

# Recursive Algorithm

1. Treat the user's explicit Run action as authorization for this goal's declared
   implementation and validation scope; re-inventory custody before writes.
2. Work task-816, then task-817, then task-818 under a scoped writer.
3. Prove test-474 in disposable fixtures and record exact evidence.
4. Evaluate the condition without implicitly activating other goals or adopting
   the scaffold in this or another repository.

# Required Skills

- select-work-and-ground-context; service-boundary-ownership-check.
- verify-close-and-checkpoint; author-mdkg-skill only for qualified task-818 work.

# Required Checks

Passed gates: focused init/upgrade/skill tests; npm run build; npm run cli:check;
npm run docs:check; npm run smoke:upgrade; node dist/cli.js skill validate --json;
node dist/cli.js validate --json; git diff --check.
The earlier planning pass ran only graph validation and diff/path review. The
implementation pass passed 678 TypeScript tests plus 26 public-release contract
tests, docs/CLI checks, packaged init and upgrade smokes, and skill validation.
See chk-564 and test-474 for command evidence and preserved-state hashes.

# Acceptance Criteria

- Compact setup is the default; --agent is compatible; explicit graph-only exists.
- One small router replaces circular mandatory reading; skills remain focused.
- Provenance-aware preview/apply/recovery preserves authored content.
- Project docs/public discovery are distinguished from scaffold outputs.

# Definition Of Done

All scope tasks and test-474 have source-grounded results and reviewed path
receipts. Changes may be locally verified without implying release/adoption.

# Stop Conditions

Missing authority, writer collision, baseline movement, unowned/custom content,
escaping paths, unclear upgrade provenance, or changes beyond bootstrap.

# Current State

Implementation and acceptance completed locally on 2026-09-05. All four scoped
nodes are done; chk-564 records the source/path review and passing evidence.
Changes remain unstaged/uncommitted. No Goal 82 execution or checkout migration
is implied. The following authorization record documents this completed run.

Execution authorized by the user's Run action and explicit continuation approval
on 2026-09-05. The prior planning-only labels are historical, not an execution
blocker. Preserve selected Goal 73; use explicit goal/work QIDs for this run.

Allowed: sole-writer ownership, task claims/lifecycle, bootstrap source and seed
assets, focused existing skill updates/projections, relevant CLI/reference
output, tests/builds, local fixture upgrade/recovery, mdkg evidence and indexes.
Preserve all existing planning changes, including unrelated Goal 82 nodes.
Excluded: staging/commits/push, releases/tags/history, bundles/subgraphs,
providers/deployments, cross-project edits and canonical-checkout migration.
The specifically requested AGENTS.md authority correction is allowed without
adopting the new bootstrap in this checkout. The SQLite fingerprint issue is
documented but remains outside this goal's source scope.

Accepted policies: retain verified legacy compatibility redirects throughout
this goal; refuse conflicting requested writes and apply a smaller safe subset
only when explicitly named in a reviewed plan; keep an operation journal and
verified original bytes for explicit resume/recovery, never automatic destructive
rollback. No secondary approval is needed for these declared implementation steps.

# Iteration Log

- 2026-09-05: task-363 authored the approved design and execution package.

# Skill Improvement Candidates

No new candidates. Six existing skills were updated within qualified task-818
maintenance, with canonical/public/native parity and full validation.

# Completion Evidence

Planning receipt: chk-563. Implementation/acceptance receipt: chk-564; test-474.
Compact default init, provenance-aware upgrades and focused discovery are proven
locally. Commit, push, release and live checkout adoption remain separate gates.
