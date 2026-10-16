---
id: test-496
type: test
title: Qualify independent sibling graphs behavior with synthetic installed fixtures
status: backlog
priority: 1
parent: goal-90
tags: [cloud-planning, design-only]
owners: [mdkg-project-agent]
links: []
artifacts: []
relates: []
blocked_by: [task-854]
blocks: []
refs: []
context_refs: [edd-83]
evidence_refs: []
aliases: []
skills: []
cases: [fresh-or-selection, preservation-and-isolation, negative-boundaries, interruption-recovery, installed-artifact, persistence-or-export]
created: 2026-10-02
updated: 2026-10-02
---

# Overview

Meaningful future automated acceptance for goal-90, bound to edd-83.
Use synthetic data only and install the exact retained candidate tarball into
isolated consumer fixtures; source imports alone are insufficient.

# Test Cases

1. Parameterized every-command-family matrix: no selector uses .mdkg;
   explicit named/stable-ID (and numeric if accepted) selects only intended graph.
   Unknown/ambiguous/unsupported selector fails before ALL effects; no fallback.
   Include init/upgrade/new/show/list/search/pack/handoff/skill/capability/manifest/
   spec/archive/bundle/graph/git/subgraph/work/loop/goal/task/next/validate/status/
   mcp/fix/db/event/checkpoint/index/guide/format/doctor/workspace, plus help and
   version behavior and generated command-contract parity. Configuration reads
   are covered as an internal surface, not an invented config command.
2. Independent graphs intentionally reuse goal/task numbers. Allocation, graph
   IDs/config/references, JSON/SQLite fingerprints, locks/recovery, events,
   goals/claims/loops, DB/snapshot/queue, working storage and packs remain isolated.
   Same graph branches preserve identity; independent sibling import/fork follows
   the existing stable-identity contract, never numeric alias equality.
3. Tracked small team graph plus large ignored synthetic private graph with
   canaries. Instrument selected graph reads/writes; default results, diagnostics,
   packs/index/bundles/package inventory and events contain no private canary.
   Explicit private selection is local; export refuses unapproved private scope.
4. Registry paths/IDs/aliases overlap, nesting, symlinks, traversal, case aliases,
   unknown selectors and shared mirrors refuse. Private local registry metadata
   never enters tracked team outputs. Unsupported commands refuse early.
5. Synthetic interrupted/concurrent work in separate graphs does not share
   reservations/locks/leases/journals or queue settlement; only selected owners
   can recover state. Same-graph writer exclusion continues working.
6. Large private sibling does not change default graph discovery/index cost;
   record synthetic dataset sizes, time/memory/bytes and reviewed budgets. No
   company data access, implicit federation or cross-graph publication.

# Results / Evidence

Use existing supported tests/smokes and add behavior tests only during the later
implementation. Record case IDs, inputs/digests, exact commands, runtime/OS/arch,
native/emulated host, durations, positive/negative controls and pass/fail/not-run
counts. Full repository pre-merge checks and final package/platform/security
gates remain obligations of task-855. Current fast CI is not full
Linux portable qualification; missing proof means NOT_READY.

# Current State

NOT_RUN. This documentation PR creates test requirements, not executable
feature tests or a passing implementation receipt.

# Target / Scope

goal-90 and its two bounded feature tasks; no company or unrelated graph data.

# Preconditions / Environment

Later accepted implementation, exact installed tarball, supported Node engine and isolated synthetic fixture custody. Required platform evidence remains explicit.

# Notes / Follow-ups

Do not claim these future cases passed from documentation or fast CI results.
