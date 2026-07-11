---
id: task-689
type: task
title: Corrected security audit loop for mdkg root execution plan
status: todo
priority: 1
parent: loop-3
tags: [loop-template, audit, security, loop-fork, loop-child, task]
owners: []
links: []
artifacts: []
relates: [loop-3]
blocked_by: []
blocks: []
refs: [loop-3, template://loops/security-audit]
context_refs: []
evidence_refs: []
aliases: []
skills: [pursue-mdkg-loop]
created: 2026-07-06
updated: 2026-07-06
---
# Overview

Plan and coordinate execution work for Corrected security audit loop for mdkg root over mdkg root repository.

# Acceptance Criteria

- Work remains scoped to the `loop-3` definition of done and required evidence lanes.
- The runner answers or records all pre-run questions before claiming the loop is ready.
- Read-only/local audit actions continue without per-step approval when they stay inside the loop's pre-approved actions.
- External registry, advisory, security-provider, publish, push, deploy, and functional-change actions are routed through proposals, decisions, or approvals.
- Each lane is classified as complete, definition-blocking, residual hardening, false positive, or accepted waiver before closeout.
- Outputs, evidence, proposals, decisions, approvals, and follow-up nodes are linked to the loop.
- If one lane is blocked, the loop records blocker evidence and continues every other authorized lane before marking the whole loop blocked.

# Files Affected

- `.mdkg/work/loop-3-corrected-security-audit-loop-for-mdkg-root.md`
- Linked mdkg evidence, proposal, decision, approval, task, test, spike, checkpoint, and receipt nodes created during the loop.
- No functional source, docs, templates, generated command output, package metadata, runtime behavior, push, publish, deploy, or provider state without explicit approval.

# Implementation Notes

- Start by reading `pursue-mdkg-loop`, `loop-3`, `spike-28`, and `test-364`.
- Treat `loop-1`, `task-688`, and `spike-27` as failed dogfood/superseded evidence, not active work.
- Prefer `/goal` or equivalent long-running harness execution for the actual loop run because the loop is expected to continue across partial blockers.
- Candidate waivers should become proposals/open questions first; accepted waivers should be linked through `decision_refs` or `approval_refs`.

# Test Plan

- `node dist/cli.js skill show pursue-mdkg-loop --json`
- `node dist/cli.js loop show loop-3 --json`
- `node dist/cli.js pack loop-3 --pack-profile concise --dry-run --stats`
- `node dist/cli.js validate --changed-only --json`

# Links / Artifacts

- `loop-3`
- `spike-28`
- `test-364`
- `loop-1`

Template: template://loops/security-audit
