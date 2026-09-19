---
id: test-481
type: test
title: Installed scale and complete goal blocker-routing acceptance for mdkg 0.6.0
status: backlog
priority: 1
tags: [release-0.6.0, local-qualification]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-84/bug-7-scale-goal.json]
relates: []
blocked_by: [task-826]
blocks: []
refs: [bug-7]
context_refs: [goal-83]
evidence_refs: []
aliases: []
skills: []
cases: [test-481-case-1, test-481-case-2, test-481-case-3, test-481-case-4, test-481-case-5]
created: 2026-09-07
updated: 2026-09-09
---

# Overview

Qualify installed scale and complete goal blocker-routing acceptance for mdkg 0.6.0 using the installed candidate, not source imports.

# Target / Scope

Goal 83 installed consumer qualification and linked Goal 84 regressions.

# Preconditions / Environment

Exact built tarball and source hashes, disposable /private/tmp roots, synthetic data, isolated caches/config and only local Git remotes. This is the user-approved local-only 0.6.0 qualification pass. Owner mdkg-project-agent is the sole repository writer; use supported goal claims and transient locks. Preserve selected Goal 73, protected Demo 3 bundles, unrelated paths and runtime DB bytes. No remote Git, publication/dist-tags, tags, history rewriting, provider/deployment, consumer/root/sibling writes, canonical graph migration or bundle/subgraph refresh. Disposable local fixtures are allowed only under /private/tmp. Local explicit-path commits on main are authorized after validation and staged review. Stop for unknown custody, concurrent writer, baseline movement, required global configuration or materially new decisions.

# Test Cases

1. Representative large graphs with recorded sizes and bounded history thresholds.
2. Clear fail-closed limits without lowering existing safety budgets.
3. Complete task/goal execution with checkpoints, blocker-goal verification and publication routing.
4. Publication remains blocked until both completed audit checkpoint and blocker verification task.
5. Goal done/evaluate alone cannot satisfy artifact identity or publication authority.

# Results / Evidence

Not executed. Record case-level expected/actual, exact commands/runtime/package identity, stdout/exit results and compact reproducible evidence. No missing runtime, interrupted case or source-only assertion is a pass.

2026-09-09 partial execution supersedes the initial not-executed placeholder:
scripts/installed-scale-goal.js has 15 passing 100-node control cases on all three
required runtimes. Cases 3-5 have installed legacy/v2 and JSON/SQLite evidence;
case 2 has default per-node/event-line and actual history-limit refusal controls.
Case 1 remains incomplete: 2000-node migration applications timed out at the
explicit 180-second harness bound, including an isolated Node26 run. This is not
a declared product SLA. The four partial fixtures/journals are retained and the
cost investigation stays under bug-7. Do not count these incomplete runs as full
scale acceptance or complete this aggregate node before task-826 and final review.
Evidence: .mdkg/artifacts/goal-84/bug-7-scale-goal.json.

# Notes / Follow-ups

Route newly validated blockers to goal-84; retain unknown/unsupported historical cases explicitly. Do not migrate canonical graph or regenerate protected bundles.
