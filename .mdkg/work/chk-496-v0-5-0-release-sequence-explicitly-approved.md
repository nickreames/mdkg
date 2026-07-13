---
id: chk-496
type: checkpoint
title: v0.5.0 release sequence explicitly approved
checkpoint_kind: audit
status: done
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [goal-64, task-718, test-389]
blocked_by: []
blocks: []
refs: [task-718, test-389, dec-69, edd-72]
context_refs: [goal-64, task-718, test-389, edd-72, dec-69]
evidence_refs: [chk-493, chk-495]
aliases: []
skills: []
scope: [task-718, task-719, task-720, task-721, task-722, task-723]
created: 2026-07-11
updated: 2026-07-11
---
# Summary

The operator explicitly approved the complete bounded Goal 64 release sequence
by replying `Approve Goal 64 release sequence` after reviewing the enumerated
external checks, mutations, stop conditions, no-tag policy, and fix-forward
policy.

# Scope Covered

- External npm authentication, registry, dependency-advisory, and repository
  security checks.
- First push of the dormant release candidate and required GitHub CI proof.
- One real publication of `mdkg@0.5.0` after all prepublication gates pass.
- Registry integrity, clean consumer, `0.4.2` upgrade, and real
  `/opt/homebrew` global replacement verification.
- One release-state activation change, second push, production deployment, and
  live mdkg.dev/docs.mdkg.dev validation.

# Decisions Captured

- No Git tag is authorized or planned.
- Stop before push or publication on an auth, registry, advisory, security, or
  CI failure or ambiguous receipt.
- After successful npm publication, do not unpublish; repair subsequent package
  or website failures with a fix-forward release.
- Never print or commit credentials, tokens, or raw provider payloads.

# Implementation Summary

This checkpoint records authorization only. It does not itself perform a push,
publish, global installation, activation, deployment, or provider mutation.

# Verification / Testing

- Approval text: `Approve Goal 64 release sequence`.
- Approved contract: `edd-72` and `dec-69`.
- Local prepublish evidence: `chk-493` and `chk-495`.
- Candidate at approval: commit
  `8ac683599cd2765e7f33fa93113dbace8ed77543`, clean worktree, release manifest
  state `draft`.

# Known Issues / Follow-ups

- Execute `task-718` through `task-723` in order and attach sanitized receipts.
- A successful npm publish is irreversible within this plan.

# Links / Artifacts

- `goal-64`
- `task-718`
- `test-389`
- `edd-72`
- `dec-69`
