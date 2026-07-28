---
id: task-18
type: task
title: Execute the Demo 2 local website goal
status: done
priority: 1
epic: epic-4
parent: goal-4
prev: task-17
next: task-19
tags: [ai-native-sdlc, presentation-demo, phase-4, step-5]
owners: [program-orchestrator]
links: []
artifacts: [artifacts/demo-002/local-execution-receipt.json]
relates: []
blocked_by: []
blocks: []
refs: [goal-4, epic-4, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, task-17]
context_refs: [goal-4, epic-4, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, task-17]
evidence_refs: []
aliases: [phase-4-step-5]
skills: [select-work-and-ground-context, build-pack-and-execute-task, pursue-mdkg-goal, verify-close-and-checkpoint]
created: 2026-07-26
updated: 2026-07-27
---

# Overview

Execute the Demo 2 local website goal. This is step 5 of 9 in Goal 4; it owns only the outcome named here and the authority granted by goal-4.

# Acceptance Criteria

- The named outcome is complete and matches prd-1, edd-1, dec-1 through dec-6, and goal-4.
- From `presentations/ai-native-sdlc-demo/runs/demo-002/`, run child-root `mdkg goal current --json`, `mdkg goal next goal-1 --json`, a concise dry-run pack for the next node, claim that node, and pursue only the child goal's local positioning, implementation, and local-test chain.
- Record every completed child node, command, changed path, local build/test result, source-to-specialized rationale, and resulting artifact hash in `artifacts/demo-002/local-execution-receipt.json`.
- Stop before canonical-site adapter integration, Git index mutation, publication, provider inspection, or any root mdkg mutation; task-19 exclusively owns adapter integration.
- Do not stage, commit, push, inspect deployments, or claim public availability.
- Changed surfaces, commands, decisions, warnings, and artifacts are recorded in public-safe evidence.
- The successor task-19 does not begin until this node is verified.

# Files Affected

- Only the exact allowlist established by goal-4 at activation.
- Program evidence under this nested graph.
- No unrelated root, product, Git, or provider surface.

# Implementation Notes

- Re-read the active writer lease and current state immediately before mutation.
- Build a deterministic pack from the specialized run root, then pursue its explicit `goal-1` through local-only child evidence.
- Prefer deterministic mdkg, build, Git, and provider receipts over narrative claims.
- Keep raw prompts, credentials, tokens, cookies, provider payloads, and unrelated private context out of artifacts.
- Stop rather than broaden scope or authority.

# Test Plan

- Child `goal evaluate goal-1 --json` does not report achieved; it shows the
  positioning, implementation, and local-test segment complete and the
  integration task as the next actionable node.
- The local output is static, zero-JavaScript, accessible, noindex/unlisted, public-safe, responsive, and within budgets.
- The receipt binds exact child node IDs, source and output hashes, local commands, and pass/fail results.
- No Git or provider side effect occurred.

# Links / Artifacts

- goal-4
- epic-4
- Evidence pending activation.
