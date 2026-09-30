---
id: goal-85
type: goal
title: Publish and verify mdkg 0.6.0
status: blocked
priority: 1
goal_state: paused
goal_condition: Under fresh explicit publication authority publish the exact qualified 0.6.0 artifact after independent blocker and identity rechecks and verify its registry and installed behavior.
scope_refs: [task-831, task-832]
required_skills: [select-work-and-ground-context, pursue-mdkg-goal, verify-close-and-checkpoint]
required_checks: [npm run build, npm run test, npm run cli:check, npm run docs:check, node dist/cli.js validate --json, node dist/cli.js validate --changed-only --json, git diff --check]
max_iterations: 75
blocked_after_attempts: 3
tags: [release-0.6.0, local-qualification]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-86/candidate-seal-20260930.json, .mdkg/artifacts/goal-86/requirement-coverage.json, .mdkg/artifacts/goal-86/successor-package-gates-20260930.json, .mdkg/artifacts/goal-86/successor-installed-platform-qualification-20260930.json, .mdkg/artifacts/goal-86/successor-installed-case-acceptance-20260930.json, .mdkg/artifacts/goal-86/successor-security-acceptance-20260930.json, .mdkg/artifacts/goal-86/successor-private-preview-20260930.json, .mdkg/artifacts/goal-86/local-closeout-20260930.json, .mdkg/artifacts/goal-86/closeout-commit-allowlist-20260930.json]
relates: []
blocked_by: []
blocks: []
refs: []
context_refs: [goal-74, goal-77, goal-78, goal-81, goal-82, goal-75, goal-83, goal-84, goal-86, dec-96, dec-100, epic-258, epic-257]
evidence_refs: [chk-570]
aliases: []
skills: []
created: 2026-09-07
updated: 2026-09-30
---

# Qualified local artifact handoff - 2026-09-30

The0.6.0 candidate is locally qualified and sealed in Chk570 and
.mdkg/artifacts/goal-86/candidate-seal-20260930.json, SHA256
b5497c5f5e5f022e19f10c72512cd23d1dfbfa874e79e384112e293df7bff2bc.
This goal remains PAUSED. This handoff/goal completion grants no publication,
push, tag, credentials, provider or deployment authority.

A future explicitly approved publication pass must independently recheck current
blockers/deferrals, package inputs, exact retained tarball integrity, Git custody,
registry/version/auth prerequisites and the publication-specific contract. Consume
qualified bytes, not a replacement pack. Bugs46/47 remain deferred/unresolved
under Goal87. macOS/Ubuntu ARM64-native and Ubuntu x86_64-emulated acceptance is
local proof only; Windows, hosted CI, website and consumer adoption are not passes.

# Historical publication planning retained below


# Current accepted package closeout contract - 2026-09-28 Dec100

Remain PAUSED/unclaimed. Tasks831/832 still require fresh publication approval and exact artifact/blocker rechecks after Chk570. No push, tag, publication or public-state change is authorized.

Dec100 requires37 package smokes plus local platform/security/guidance acceptance.
All46 definitions remain; nine website smokes/nine site profiles defer to Epic258
and hosted execution to Epic257. Same-input case evidence can be reused; missing
seal does not erase passes. Node >=24.18.0 <25 replaces old runtime success gates.
Bugs46/47 remain deferred/unresolved; no blocked scan context recovery. This
amendment is not qualification proof or publication authority.

# Historical contract and evidence retained below

# Current Successor Contract - 2026-09-13

2026-09-28 Dec98 addendum: Bugs46/47 are deferred/unresolved under paused
Goal87, not accepted or fixed. Publication must recheck their disclosed
version-specific disposition and the remaining Goal86 gates against the exact
candidate. Node-only planning/experiments, runtime changes and this deferral
grant no publication, remote, tag or provider authority. This goal stays paused.

Remain blocked/paused with only task831/832 in execution scope. Fresh publication
approval, exact artifact and independent blocker checks are still mandatory.
Task831 now explicitly waits for chk570, task828, task837 and test487. Do not
expand this goal into remediation by linking other goals through scope/compatibility
edges. No current Git push, registry, provider or deployment authority.

The earlier sections below retain their historical evidence. This current addendum,
updated dependencies, goal-86 and dec-96 govern the remaining work. Planning
authoring is not execution, qualification, a writer claim, or publication.

# Objective

Under fresh explicit publication authority publish the exact qualified 0.6.0 artifact after independent blocker and identity rechecks and verify its registry and installed behavior.

# End Condition

task-831 and task-832 have fresh approval, exact artifact and independently observed registry/install evidence. Current pass cannot achieve this goal.

# Non-Goals

This is the user-approved local-only 0.6.0 qualification pass. Owner mdkg-project-agent is the sole repository writer; use supported goal claims and transient locks. Preserve selected Goal 73, protected Demo 3 bundles, unrelated paths and runtime DB bytes. No remote Git, publication/dist-tags, tags, history rewriting, provider/deployment, consumer/root/sibling writes, canonical graph migration or bundle/subgraph refresh. Disposable local fixtures are allowed only under /private/tmp. Local explicit-path commits on main are authorized after validation and staged review. Stop for unknown custody, concurrent writer, baseline movement, required global configuration or materially new decisions.

# Recursive Algorithm

Dependency gates live on task-831 (`blocked_by: [chk-570, task-828]`),
not on this goal's compatibility edges. Goal references remain context-only:
generic goal scope expansion must not import the audit/blocker work or Goal 75.
The publication task cannot become eligible until both gates are done, and
eligibility still grants no publication authority.

1. Wait for a new explicit publication approval; this planning record and goal completion are not approval.
2. Independently recheck chk-570, task-828, goal-84 and exact sealed candidate under task-831.
3. Publish and verify only the approved exact tarball under task-832 and release-mdkg-package.
4. Keep Git push/tag, deployment/provider and consumer-upgrade authority distinct.

# Required Skills

Reuse select-work-and-ground-context, pursue-mdkg-goal and verify-close-and-checkpoint. Codex Security Standard and later diff workflows are plugin-owned capabilities, not new public mdkg skills. Future publication uses release-mdkg-package only after fresh approval.

# Required Checks

Full tests and manifest-backed ladder; coverage floors 89/77/96 unchanged; CLI/docs/skill/package parity; all six installed fixture families; source and artifact provenance; graph full/changed-only, SQLite and diff checks. Node 24.15.0, available supported 24 and Node 26 exact versions. Missing proof is a blocker, not a waiver.

# Acceptance Criteria

- Preserve compact default init, graph-only/--agent compatibility, explicit v2 adoption, stable identities with numeric aliases and reviewed reconciliation.
- Use actual 0.5.2 upgrade, offline branch cross-links, semantic conflicts, replay/revert, recovery, ownership, legacy/old-client, clone/fork, archive/work, packs/MCP, large graph and complete lifecycle routing fixtures.
- Review source and package delta separately from demo/history-only evidence.
- Keep source reviewers read-only and freeze each exact reviewed snapshot.
- Keep private canonical graph rehearsal private and report unsupported historical evidence without inventing identity.
- Bind each blocker to regression and independent verification; do not silently waive missing coverage.
- Seal one immutable artifact; any package-input change invalidates qualification.

# Definition Of Done

The end condition is supported by exact artifacts and checks, not just report-only goal evaluation. No current execution authority exists.

# Stop Conditions

Unknown dirty ownership, writer collision, baseline movement, global configuration changes, materially new decisions or excluded actions. Publication remains a distinct gate.

# Current State

Planning complete at creation; paused, blocked and unclaimed awaiting future publication approval. Canonical main is 9d7e0d3fdbcfbc3908b7d3983b4957f15d17cb2b, two ahead of cached origin/main; no remote verification. Only pre-existing dirty SQLite projection was accepted before these isolated planning nodes. Selection is achieved Goal 73. Runtime leases released, queues empty; obsolete worktree metadata remains untouched.

# Iteration Log

- 2026-09-07: User-approved full qualification plan recorded. Frozen Standard source audit is sealed in chk-571; its findings are not remediated yet.

# Skill Improvement Candidates

None. Findings belong in source/regression contracts, not procedural skill creation.

# Completion Evidence

Pending full end-condition evidence.
