---
id: task-826
type: task
title: Execute installed mdkg 0.6.0 temporary graph qualification
status: backlog
priority: 1
tags: [release-0.6.0, local-qualification]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-84/bug-7-init-discovery.json, .mdkg/artifacts/goal-84/bug-7-stale-upgrade.json, .mdkg/artifacts/goal-84/bug-7-mixed-state-recovery.json, .mdkg/artifacts/goal-84/bug-7-installed-security-regressions.json]
relates: []
blocked_by: [task-824, test-477, test-478, test-479, test-480, test-481, test-482, test-483, test-484, test-486, test-487]
blocks: []
refs: [dec-94, dec-95, test-484]
context_refs: [goal-83, goal-86, dec-96]
evidence_refs: [chk-600, chk-603]
aliases: []
skills: []
created: 2026-09-07
updated: 2026-09-13
---

# Current Successor Contract - 2026-09-13

This task is aggregate acceptance AFTER tests477-484/486 and test487, not their
prerequisite. It no longer waits for Bug7: implementation prerequisites are
tasks835/836 and the owned bugs; Bug7 closes missing qualification after this task.
Check every case/runtime/platform and exact artifact identity. Earlier matrices
are useful intermediate evidence, not permission to skip final-artifact execution.
No tests may depend on this aggregate while their results are required by it.

The earlier sections below retain their historical evidence. This current addendum,
updated dependencies, goal-86 and dec-96 govern the remaining work. Planning
authoring is not execution, qualification, a writer claim, or publication.

# Overview

Goal: Installed candidate consumer workflows across all six acceptance families.

Context: The complete approved contract is goal-83 and bounded blocker ownership is goal-84.

# Acceptance Criteria

Linked Git worktrees are an explicit required topology, not equivalent to the
already-executed independent repository fixtures. Extend existing test478 with
real shared-object-store worktrees and concurrent local process execution;
pin refs/inputs, prove isolation and the complete source-plus-graph integration
sequence. Chk603 records source findings and outstanding alignment questions.
Review only in the acceptance/alignment turn; no canonical worktree is created.

Use the built tarball rather than source imports as consumer CLI. Execute test-477 through test-482 with isolated npm caches/config and local-only remotes. Reproduce missing identity qualification via bug-7. Record commands, exact versions, fixture inputs and outcomes; preserve compact diagnostics and remove only owned fixtures. Never run recovered Demo 3 applications.

# Files Affected

scripts/ and tests/ qualification infrastructure; owned evidence; disposable /private/tmp repositories, package installs and private graph copy.

# Implementation Notes

This is the user-approved local-only 0.6.0 qualification pass. Owner mdkg-project-agent is the sole repository writer; use supported goal claims and transient locks. Preserve selected Goal 73, protected Demo 3 bundles, unrelated paths and runtime DB bytes. No remote Git, publication/dist-tags, tags, history rewriting, provider/deployment, consumer/root/sibling writes, canonical graph migration or bundle/subgraph refresh. Disposable local fixtures are allowed only under /private/tmp. Local explicit-path commits on main are authorized after validation and staged review. Stop for unknown custody, concurrent writer, baseline movement, required global configuration or materially new decisions.

# Test Plan

Each named fixture case has pass/fail and hash-bound runtime/package evidence; no missing runtimes or partial cases counted as pass.

# Links / Artifacts

Owning goal and dependencies are explicit above. Record exact commands, input/source/artifact hashes and pass/fail before completion.

## 2026-09-09 Installed Coverage Reconciliation

Chk-597 and the linked bug-7-init-discovery artifact provide a requirement-level
coverage map for test-477 through test-482. Bootstrap, branch, caught-error
recovery, MCP/cache parity, work/archive and scale scenarios have all executed
across the three required runtimes, on recorded intermediate candidates. This
does not qualify one final artifact or resolve policy-dependent failures.

Chk598 closes the installed stale-upgrade-plan gap with18cases across all
three runtimes. Chk599 now closes mixed tracked staged/unstaged node, full-body
pack/mutation and manual metadata stale-cache proof, and refreshes graph recovery
after the nullable-read optimization. All proof remains intermediate-candidate.
Next independent step: complete per-finding installed coverage and explicit
requirement disposition rather than rerun these families as never executed. The old
client v2 partial-write hazard, killed-writer recovery, legacy public-bundle
materialization and historical task309 migration disposition remain open.
Final task828 review, release ladder and exact artifact seal remain required.
Keep this aggregate uncompleted; no compatibility waiver or publication approval.
