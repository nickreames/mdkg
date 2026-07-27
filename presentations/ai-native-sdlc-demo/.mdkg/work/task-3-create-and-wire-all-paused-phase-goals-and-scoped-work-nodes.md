---
id: task-3
type: task
title: Create and wire all paused phase goals and scoped work nodes
status: done
priority: 1
epic: epic-1
parent: goal-1
prev: task-2
next: task-4
tags: [ai-native-sdlc, presentation-demo, phase-1, step-4]
owners: [program-orchestrator]
links: []
artifacts: [.mdkg/work/]
relates: []
blocked_by: []
blocks: []
refs: [goal-1, epic-1, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, task-2]
context_refs: [goal-1, epic-1, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, task-2]
evidence_refs: []
aliases: [phase-1-step-4]
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-07-26
updated: 2026-07-26
---

# Overview

Create and wire all paused phase goals and scoped work nodes. This is step 4 of 8 in Goal 1; it owns only the outcome named here and the authority granted by goal-1.

# Acceptance Criteria

- The named outcome is complete and matches prd-1, edd-1, dec-1 through dec-6, and goal-1.
- Reconcile the live repository and template facts without mutating product surfaces.
- Keep all authoring inside the nested graph except the explicitly deferred root handoff.
- Prove exactly eight goals, no loops, one active authoring goal, and deterministic routing.
- Record the private bundle, root projection, Remotion placeholder, and closeout gates.
- Do not create deck content, run graphs, source changes, Git history, or provider state.
- Changed surfaces, commands, decisions, warnings, and artifacts are recorded in public-safe evidence.
- The successor task-4 does not begin until this node is verified.

# Files Affected

- Only the exact allowlist established by goal-1 at activation.
- Program evidence under this nested graph.
- No unrelated root, product, Git, or provider surface.

# Implementation Notes

- Re-read the active writer lease and current state immediately before mutation.
- Prefer deterministic mdkg, build, Git, and provider receipts over narrative claims.
- Keep raw prompts, credentials, tokens, cookies, provider payloads, and unrelated private context out of artifacts.
- Stop rather than broaden scope or authority.

# Test Plan

- Every scope ref resolves to the owned epic and recursively to only actionable phase nodes.
- The first route is correct, prev/next links are symmetric, and only Goal 1 is active.
- No loop exists and the diff stays inside approved mdkg/operator paths.
- Nested validation, concise pack, private bundle, root projection, and Remotion handoff pass.

# Links / Artifacts

- goal-1
- epic-1
- goal-1 through goal-8 and epic-1 through epic-8 exist.
- Five spikes, forty-six tasks, and twenty-four tests form eight deterministic phase chains.
- Goal 1 is active; Goals 2–8 are paused; each goal next command returns the intended first node without warnings.
