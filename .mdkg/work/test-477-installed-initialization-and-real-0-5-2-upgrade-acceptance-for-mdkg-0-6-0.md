---
id: test-477
type: test
title: Installed initialization and real 0.5.2 upgrade acceptance for mdkg 0.6.0
status: backlog
priority: 1
tags: [release-0.6.0, local-qualification]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-84/bug-7-init-discovery.json, .mdkg/artifacts/goal-84/bug-7-recovery-runtime.json, .mdkg/artifacts/goal-84/bug-7-stale-upgrade.json, .mdkg/artifacts/goal-86/bug-17-local-verification.json]
relates: []
blocked_by: [task-835, task-836, task-827]
blocks: []
refs: []
context_refs: [goal-83, goal-86, dec-96]
evidence_refs: []
aliases: []
skills: []
cases: [test-477-case-1, test-477-case-2, test-477-case-3, test-477-case-4, test-477-case-5]
created: 2026-09-07
updated: 2026-09-15
---

# Current Successor Contract - 2026-09-13

Actual0.5.2 upgrades, compact defaults, graph-only/--agent, customized instructions/docs/skills and repeated/stale/interrupted/recovered upgrade cases.

This test no longer waits for task826 or Bug7 aggregate closure. Its updated
implementation prerequisites lead into installed cases; task826 consumes the
results. Record historical/current-intermediate/final-artifact-pass/failure/
unverified states. Final qualification uses one frozen0.6.0 tarball; macOS/Linux
completeness is independently bound by test487. Task828 remains independent
acceptance, not an upstream requirement for these test results.

The earlier sections below retain their historical evidence. This current addendum,
updated dependencies, goal-86 and dec-96 govern the remaining work. Planning
authoring is not execution, qualification, a writer claim, or publication.

# Overview

Qualify installed initialization and real 0.5.2 upgrade acceptance for mdkg 0.6.0 using the installed candidate, not source imports.

# Target / Scope

Goal 83 installed consumer qualification and linked Goal 84 regressions.

# Preconditions / Environment

Exact built tarball and source hashes, disposable /private/tmp roots, synthetic data, isolated caches/config and only local Git remotes. This is the user-approved local-only 0.6.0 qualification pass. Owner mdkg-project-agent is the sole repository writer; use supported goal claims and transient locks. Preserve selected Goal 73, protected Demo 3 bundles, unrelated paths and runtime DB bytes. No remote Git, publication/dist-tags, tags, history rewriting, provider/deployment, consumer/root/sibling writes, canonical graph migration or bundle/subgraph refresh. Disposable local fixtures are allowed only under /private/tmp. Local explicit-path commits on main are authorized after validation and staged review. Stop for unknown custody, concurrent writer, baseline movement, required global configuration or materially new decisions.

# Test Cases

1. Actual published 0.5.2 tarball integrity and installed upgrade, not a mock legacy seed.
2. Default compact init, --graph-only and --agent compatibility.
3. Customized AGENTS/CLAUDE and project README/LICENSE preserved.
4. Repeated preview/apply, stale plan, interrupted upgrade and recovery.
5. Native skill mirrors, resource links and rollback compatibility.

# Results / Evidence

Partial installed evidence exists; this aggregate remains open. Chk-597 binds
fresh default/explicit-agent/graph-only initialization, customized root/project
documents, focused skill discovery and complete canonical/native resource
preservation on Node 24.15.0, 24.18.0 and 26.0.0. This supports cases 2/3 and the
discovery portion of case 5 on the current intermediate candidate.

The linked bug-7-recovery-runtime artifact already records actual published
0.5.2 standard/customized upgrades and caught-error upgrade recovery on all
three runtimes, supporting cases 1/3 and portions of 4/5 on an older candidate.
Do not repeat those as never executed or infer final-candidate freshness.
Chk598 now verifies installed fresh preview -> user edit -> stale apply refusal
and fresh-plan edited-wrapper resume/rollback on all three runtimes, using the
current intermediate candidate. This closes that case4 gap and strengthens
cases1/3/5 with18actual published-upgrade/recovery cases. Still required:
final-candidate upgrade/recovery reruns and independent aggregate acceptance.
No interrupted, missing-runtime or source-only assertion is counted as a pass.

# Notes / Follow-ups

2026-09-15 bootstrap qualification observation, bound in
`.mdkg/artifacts/goal-86/bug-17-local-verification.json`: compact default init emits
root-scoped history. Registering that independently initialized child as a mutable
parent workspace and then writing parent-scoped events produces a scope-validation
failure. Published0.5.2 bare init and current explicit graph-only setup pass the
original parent-workspace control without deleting or relabeling history.
The bundle/capability smoke fixtures now state that setup explicitly; this is not
proof of independent graph re-aliasing. Reverify the documented setup and diagnose
any required unsupported transition during final bootstrap qualification, alongside
task827's guidance. No new federation or event-history migration is authorized.

Route newly validated blockers to goal-84; retain unknown/unsupported historical cases explicitly. Do not migrate canonical graph or regenerate protected bundles.
