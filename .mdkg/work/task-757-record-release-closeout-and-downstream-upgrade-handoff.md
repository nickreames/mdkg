---
id: task-757
type: task
title: record v0.5.2 release closeout and downstream upgrade handoff
status: done
priority: 1
parent: goal-67
prev: test-451
tags: [goal-67, closeout, downstream-handoff, 0.5.2]
owners: []
links: [https://www.npmjs.com/package/mdkg/v/0.5.2, https://docs.mdkg.dev/advanced-alpha/git-materialization/, https://github.com/nickreames/mdkg/actions/runs/29473265920]
artifacts: []
relates: [goal-67]
blocked_by: [test-451]
blocks: [test-419]
refs: [goal-67, goal-66, test-419, chk-532, chk-533, chk-534, chk-535, chk-536, chk-537, edd-73]
context_refs: [goal-66, edd-73]
evidence_refs: []
aliases: [materialize-release-closeout]
skills: [verify-close-and-checkpoint]
created: 2026-07-11
updated: 2026-07-15
---

# Overview

Close the release with immutable evidence and a product-neutral handoff for
repositories that need to upgrade to `mdkg@0.5.2` and consume generic Git
materialization.

# Acceptance Criteria

- Final checkpoint records Goal-66 and release commits, npm integrity/time,
  temp/global installs, real-root upgrade, validation, origin/CI/Vercel/docs
  evidence, approved side effects, no-tag status, fix-forward policy, warnings,
  and residual risks.
- Handoff names `mdkg git materialize`, request/receipt schemas, compatibility
  floor, external-auth boundary, no-push behavior, and conservative upgrade
  commands without downstream runtime policy.
- `test-419` verifies all evidence is mutually consistent.
- Create and push one final graph closeout commit directly to `origin/main`
  without force; verify local/remote parity.
- Goal show/next/evaluate reports achieved with no scoped work remaining.

# Test Plan

- `test-419`
- final graph/status/Git parity and no-tag checks

# Completion Evidence

- One final release checkpoint and sanitized downstream handoff.

# Files Affected

- Final Goal-67 checkpoint/handoff state and one local graph closeout commit.

# Implementation Notes

- Push the closeout commit only after `test-419` confirms every evidence lane;
  preserve no-tag and fix-forward policy.

# Links / Artifacts

- `test-419`, npm/install/root/CI/Vercel/docs receipts, and downstream handoff.
