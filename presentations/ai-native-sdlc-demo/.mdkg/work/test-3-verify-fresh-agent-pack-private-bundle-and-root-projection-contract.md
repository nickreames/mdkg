---
id: test-3
type: test
title: Verify fresh agent pack private bundle and root projection contract
status: done
priority: 1
epic: epic-1
parent: goal-1
prev: test-2
tags: [ai-native-sdlc, presentation-demo, phase-1, step-8]
owners: [program-orchestrator]
links: []
artifacts: [artifact://ai-native-sdlc-demo/root-registration-receipt, artifact://ai-native-sdlc-demo/remotion-placeholder-receipt]
relates: []
blocked_by: []
blocks: []
refs: [goal-1, epic-1, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, test-2]
context_refs: [goal-1, epic-1, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, test-2]
evidence_refs: []
aliases: [phase-1-step-8]
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
cases: [fresh_agent_startup, pack_coverage, private_bundle, root_projection, remotion_handoff]
created: 2026-07-26
updated: 2026-07-26
---

# Overview

Validate verify fresh agent pack private bundle and root projection contract as step 8 of Goal 1. A passing result must include exact commands or observations, reviewed outputs, and public-safe evidence.

# Target / Scope

- goal-1
- epic-1
- test-2

# Preconditions / Environment

- Goal 1 Activation Conditions and writer ownership are accepted.
- All predecessor nodes are done with evidence.
- The current source, Git, graph, artifact, and provider state has been re-read where applicable.

# Test Cases

- Every scope ref resolves to the owned epic and recursively to only actionable phase nodes.
- The first route is correct, prev/next links are symmetric, and only Goal 1 is active.
- No loop exists and the diff stays inside approved mdkg/operator paths.
- Nested validation, concise pack, private bundle, root projection, and Remotion handoff pass.
- This test specifically proves: Verify fresh agent pack private bundle and root projection contract.
- Any skipped or unavailable check is a failure or explicit blocker, not an implicit pass.

# Results / Evidence

- PASS — final pre-closeout `mdkg index` and `mdkg validate --json` report zero warnings and zero errors.
- PASS — the graph contains eight goals, seventy-five actionable nodes, zero authored loop nodes, and zero asymmetric `prev`/`next` links.
- PASS — Goal 1 remains the selected active nested goal; Goals 2–8 remain `status: backlog`, `goal_state: paused`.
- PASS — `mdkg goal next goal-1 --json` selects this test, and each paused successor selects its intended first actionable node without a routing warning.
- PASS — concise pack dry runs for `spike-1` and `test-3` include their goal, epic, and required skills without a missing-skill warning.
- PASS — a provisional explicit private bundle was created and verified with 176 files, profile `private`, source tree hash `sha256:6d4b3cdacb44dda27cde91d25ba3678533285e736c432a25d5e6bb3cf7fda60d`, bundle hash `sha256:40e776203f7aa51e1496bf59b1dc57f77c883189dfff46ada8cfa7895b13f75b`, ZIP SHA-256 `sha256:e5ba9805ad8010f574a18e912424e4fe5535263e2f3266637b8e673383e052b6`, and no stale paths. A post-closeout rebuild/refresh then projected achieved Goal 1; its final hashes live in the root handoff rather than self-referencing inside the bundle.
- PASS — root registration `ai_native_sdlc_demo` is private, read-only, has no `source_path`, uses profile `private`, has freshness threshold 86,400 seconds, and passes `subgraph verify ai_native_sdlc_demo --json`.
- PASS — root generic `mdkg show ai_native_sdlc_demo:goal-1 --json` and `...:goal-3` resolve the imported read-only goals. The specialized `goal show` family rejects read-only subgraph QIDs by design, so projection inspection uses generic `show`.
- PASS — root Remotion research Goal 79 is paused and scoped to epic-255 with first node spike-35; implementation Goal 80 is paused with empty scope. The research chain is spike-35 -> task-814 -> test-473 -> task-815 and proposed decision dec-92 owns proceed/defer/reject resolution.
- PASS — root `goal current --json` remains selected on achieved root Goal 73; this pass did not change root selected-goal state.

# Notes / Follow-ups

- The post-closeout program bundle rebuild and root refresh completed; generic root `show` resolves Goal 1 as achieved and chk-1 as done.
- Refresh the two independently validated age-stale example bundles before final root `subgraph verify --all`.
