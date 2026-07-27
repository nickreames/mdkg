---
id: test-6
type: test
title: Verify deterministic fork startup routing and concise pack
status: done
priority: 1
epic: epic-2
parent: goal-2
prev: test-5
tags: [ai-native-sdlc, presentation-demo, phase-2, step-10]
owners: [shared-source-writer]
links: []
artifacts: [artifacts/demo-platform/fork-bootstrap-pack-receipt.json]
relates: []
blocked_by: []
blocks: []
refs: [goal-2, epic-2, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, task-9, task-10, test-5]
context_refs: [goal-2, epic-2, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, task-9, task-10, test-5]
evidence_refs: []
aliases: [phase-2-step-10]
skills: [build-pack-and-execute-task, verify-close-and-checkpoint]
cases: [source_tree_hash, absent_target_bootstrap, preserved_ids, operator_manifest, skill_mirrors, child_validation, goal_routing, context_complete_concise_pack, full_body_standard_pack, repeat_equality, deliberate_drift_failure]
created: 2026-07-26
updated: 2026-07-26
---

# Overview

Validate verify deterministic fork startup routing and concise pack as step 10 of Goal 2. A passing result must include exact commands or observations, reviewed outputs, and public-safe evidence.

# Target / Scope

- Executable graph-fork and operator/skill bootstrap from an absent target.
- Preserved graph identity, manifest equality, child validation/routing, and fresh-agent context coverage.
- Repeat verification and deliberate-drift failure.
- Site behavior is owned by tests 4 and 5.

# Preconditions / Environment

- Goal 2 Activation Conditions and writer ownership are accepted.
- All predecessor nodes are done with evidence.
- The current source, Git, graph, artifact, and provider state has been re-read where applicable.

# Test Cases

- `npm run smoke:demo-graph` exercises the accepted bootstrap command against an absent isolated target.
- The receipt binds the canonical source tree hash, target, preserved local IDs, selected `goal-1`, generated file inventory, operator-manifest hash, and mirrored-skill equality.
- Child `validate`, `goal next goal-1`, context-complete concise pack, and full-body standard pack pass. Pack evidence lists included QIDs and proves PRD, EDD, decisions, predecessor checkpoint, and required skills are present.
- A verify-only repeat produces the identical inventory and hashes without rewriting accepted content.
- Missing source input, unexpected target content, mismatched mirror, changed ID, or deliberate file drift fails closed with a stable classification.
- `fork-bootstrap-pack-receipt.json` records commands/exits, source/target hashes, generated inventory, child receipts, pack QIDs/stats, repeat result, negative-test result, warnings, and pass/blocker state.
- Any skipped, unavailable, or unreviewed case is a failure or explicit blocker.

# Results / Evidence

Pending activation. Populate `artifacts/demo-platform/fork-bootstrap-pack-receipt.json` with pass/fail evidence for every declared case.

# Notes / Follow-ups

- Do not advance to goal closeout until the required result is evidenced.
