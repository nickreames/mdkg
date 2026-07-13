---
id: goal-69
type: goal
title: Remediate v0.5.0 security findings and requalify release
status: done
priority: 0
goal_state: achieved
goal_condition: Every one of the 51 source-backed v0.5.0 security findings is closed by a verified fix or evidence-backed rejection, all mapped regressions and release checks pass, manual source-backed requalification confirms the original issue families are resolved under dec-81, and Goal 64 is explicitly requalified for its first push without weakening the release policy.
scope_refs: [epic-241, epic-242, epic-243, epic-244, epic-245, task-763, task-764, task-765, task-766, task-767, task-768, task-769, task-770, task-771, task-772, task-773, task-774, task-775, task-776, test-425, test-426, test-427, test-428, test-429, test-430, test-431, test-432, test-433, test-434]
last_active_node: task-776
required_skills: [select-work-and-ground-context, service-boundary-ownership-check, build-pack-and-execute-task, verify-close-and-checkpoint]
required_checks: [git status --short --branch, npm ci, npm run build, npm run test, npm run cli:check, npm run cli:contract, npm run docs:check, npm run smoke:loop, npm run smoke:sqlite, npm run smoke:db, npm run smoke:db-snapshot, npm run smoke:bundle, npm run smoke:subgraph, npm run smoke:visibility, npm run smoke:parallel, node scripts/assert-publish-ready.js, node scripts/verify-security-remediation.js, node dist/cli.js validate --json, node dist/cli.js validate --changed-only --json, NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json, NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run --registry=https://registry.npmjs.org/, node dist/cli.js goal show goal-69 --json, node dist/cli.js goal next goal-69 --json, node dist/cli.js pack task-763 --pack-profile concise --dry-run --stats, manual source-backed requalification under dec-81, git diff --check]
max_iterations: 40
blocked_after_attempts: 3
tags: [security, release, remediation, v0.5.0]
owners: []
links: []
artifacts: [artifact://codex-security/scan/1fed2fe1-d81f-41d1-9f1c-470fb669ff4c/available-findings]
relates: [goal-64, task-718, test-389, edd-75, dec-80, dec-81]
blocked_by: []
blocks: []
refs: [goal-64, task-718, test-389, test-434, chk-497, dec-81]
context_refs: [goal-64, task-718, test-389, test-434, edd-75, dec-80, dec-81, chk-497, chk-509, chk-510]
evidence_refs: [chk-497, chk-509, chk-510, chk-511, chk-512]
aliases: []
skills: []
created: 2026-07-12
updated: 2026-07-12
---
# Objective

Remove the security blockers found in the v0.5.0 pre-publish repository audit,
prove each independently reachable instance closed, and return a clean release
candidate to Goal 64 without pushing, publishing, tagging, globally replacing,
activating, or deploying anything in this goal.

# End Condition

The exact 5 high, 28 medium, and 18 low findings are mapped once to implementation
and regression evidence. Every row is fixed or rejected by stronger evidence,
all required local and packaged checks pass, and manual source-backed review
under `dec-81` confirms the original issue families are resolved. Only then
may `test-389` close and Goal 64 clear `goal-69` from its blockers.

# Non-Goals

- Do not push, publish npm, create a tag, replace the real global installation,
  activate release content, or deploy either website.
- Do not waive a high or medium finding merely because the affected command is
  local. Repository contributors, imported data, and agent harnesses are trust
  boundaries under `edd-75`.
- Do not replace exact instance closure with one representative test.
- Do not broaden into CocoIndex, the general CLI redesign, or unrelated Omni
  semantic-file changes.

# Recursive Algorithm

1. Establish the shared path, schema, authorization, and budget invariants before
   editing individual command families.
2. Work one bounded task, preserving exact candidate IDs and affected sinks.
3. Add targeted regression proof for every migrated or reclassified instance.
4. Keep the 51-row matrix current; no row may disappear, duplicate, or close on
   indirect evidence.
5. Run focused checks after each lane and the full release ladder after all lanes.
6. Manually requalify every original finding family against current source and
   direct regressions under `dec-81`.
7. If any release-blocking finding survives, route it back to its owning task and
   continue; do not reactivate Goal 64.

# Required Skills

- `select-work-and-ground-context`
- `service-boundary-ownership-check`
- `build-pack-and-execute-task`
- `verify-close-and-checkpoint`

# Required Checks

- Run every command listed in frontmatter and record exact pass/fail receipts.
- Prove the reviewed target revision and worktree state.
- Prove `test-425` through `test-434` and the 51-row matrix are complete.

# Acceptance Criteria

- A centralized, symlink-safe filesystem authority owns contained reads, writes,
  replacements, and recursive deletions; all affected sinks use it.
- Transported manifests, indexes, caches, import IDs, snapshots, and projections
  are runtime-validated and bound to canonical source.
- Loop approval/evidence/readiness decisions require exact typed authority.
- Observational commands do not persist indexes, IDs, events, or SQLite state.
- ZIP, graph, body, pack, parser, and MCP work is bounded before expensive work.
- Existing goal, loop, Omni, archive, bundle, subgraph, DB, docs, and release
  behavior remains compatible except for intentional fail-closed errors.
- Manual source-backed requalification finds no unresolved original
  release-blocking finding.

# Definition Of Done

- All 51 findings have exact closure evidence and passing regressions.
- Required local, packaged, docs, graph, site, and compatibility checks pass.
- `test-434` records the exact matrix and manual source-backed requalification.
- A goal-closeout checkpoint names the commit, review receipt, residual risks, and
  explicit handoff that lets Goal 64 resume at `task-719`.

# Stop Conditions

- Stop before external mutation; Goal 64 still owns push and publication.
- Stop and create a spike/proposal if a fix requires a product-policy change or
  breaks a documented compatibility contract.
- Do not call the goal blocked while another scoped lane or regression can make
  useful progress.
- A verification-method change requires an explicit accepted DEC and cannot
  alter or suppress any finding disposition.

# Current State

All 51 original findings are fixed and mapped to direct passing regressions.
The exact-set verifier, full local prepublish ladder, publish dry-run, isolated
package install, focused 146-test manual requalification, and approval/no-tag
recheck pass. Decision `dec-81` records the operator-selected manual
requalification method. Checkpoint `chk-512` hands the release back to Goal 64
at `task-719`.

# Iteration Log

- 2026-07-12: Audit findings transferred from Goal 64; remediation program
  activated without treating transfer as a security waiver.
- 2026-07-12: Closed every original finding, accepted manual source-backed
  requalification in `dec-81`, and produced Goal 64 handoff `chk-512`.

# Skill Improvement Candidates

- None yet.

# Completion Evidence

- Exact finding closure: `chk-509`.
- Full local prepublish and installed-package proof: `chk-510`.
- Manual source-backed requalification: `dec-81`, `chk-511`.
- Goal closeout and release handoff: `chk-512`.
