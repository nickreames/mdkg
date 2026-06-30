---
id: task-620
type: task
title: prove branch path demo fork workflow from this repo
status: done
priority: 1
epic: epic-205
parent: goal-44
tags: [demo, graph-fork, branch-path, workflow, template]
owners: []
links: []
artifacts: [examples/demo-runs/demo-001, examples/demo-runs/demo-001/DEMO_RUN_RECEIPT.md, scripts/smoke-demo-graph.js]
relates: []
blocked_by: [task-618, task-619]
blocks: [task-621, test-321, test-322, test-323]
refs: [dec-56, edd-58]
context_refs: [dec-56, edd-58]
evidence_refs: []
aliases: []
skills: [build-pack-and-execute-task, verify-close-and-checkpoint]
created: 2026-06-29
updated: 2026-06-29
---
# Overview

Prove the demo can be forked into a tracked branch path from this repo using
existing mdkg graph movement primitives.

# Acceptance Criteria

- A fresh run can be created at `examples/demo-runs/demo-001/`.
- The fork preserves the template graph namespace and selects `goal-1`.
- `goal next` returns the intended first node.
- `pack --profile concise --dry-run --stats` contains enough context for a
  coding agent to proceed.
- No new mdkg npm publish is required unless a CLI gap is proven.

# Files Affected

- `examples/demo-runs/demo-001/**`
- smoke or receipt files if implementation chooses to automate the proof

# Implementation Notes

- Use branch-path outputs so multiple demo runs can be compared later.
- Keep `/private/tmp` for transient receipts only, not canonical run source.

# Test Plan

- `mdkg graph fork examples/website-demo-template --target examples/demo-runs/demo-001 --start-goal goal-1 --json`
- `mdkg goal next goal-1 --json` from the run
- `mdkg pack <first-node> --profile concise --dry-run --stats` from the run
- `test-321`

# Links / Artifacts

- `goal-44`
- `test-321`
