---
id: test-269
type: test
title: goal-35 routing archive provenance and mdkg-only creation contract
status: done
priority: 1
epic: epic-181
parent: goal-35
tags: [mdkg-dev, graph-only, provenance]
owners: []
links: []
artifacts: [archive://archive.mdkg-dev-preview-audit-pass-5-2026-06-24]
relates: [goal-35, task-549]
blocked_by: []
blocks: []
refs: [archive://archive.mdkg-dev-preview-audit-pass-5-2026-06-24]
context_refs: []
evidence_refs: []
aliases: []
skills: []
cases: [archive-verify, goal-routing, graph-validation, no-functional-mutation]
created: 2026-06-24
updated: 2026-06-24
---
# Overview

Validate that goal-35 is a mdkg-only creation pass with durable source provenance and clean routing.

# Test Cases

- Archive verifies.
- `goal show goal-35 --json` returns the launch-ready pass-5 goal.
- `goal next goal-35 --json` routes to `task-549` before closeout and `task-550` after claim.
- `validate --summary --json --limit 20` returns zero warnings/errors.
- `git diff --check` passes.
- No source/site/docs/deploy/Vercel files are changed in the creation pass.

# Results / Evidence

- Pending.
