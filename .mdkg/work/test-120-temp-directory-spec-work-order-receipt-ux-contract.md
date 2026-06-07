---
id: test-120
type: test
title: temp directory SPEC WORK ORDER RECEIPT UX contract
status: done
priority: 1
epic: epic-64
parent: goal-10
tags: [smoke, temp-repo, spec, work, receipt]
owners: []
links: []
artifacts: [scripts://smoke-cli-ux-polish.js, temp://mdkg-cli-ux-polish.TZ03Kz]
relates: [task-307]
blocked_by: [task-307]
blocks: []
refs: []
aliases: []
skills: []
cases: [packed-install, temp-repo, spec-work-order-receipt, queue-bridge]
created: 2026-06-06
updated: 2026-06-06
---
# Overview

Validate the polished SPEC/WORK/ORDER/RECEIPT UX from a packed installed CLI in
a fresh temp repo.

# Target / Scope

- `task-307`
- `scripts/smoke-cli-ux-polish.js`

# Preconditions / Environment

- Fresh `/private/tmp/mdkg-cli-ux-polish.XXXXXX/repo`.
- Installed tarball binary only; no internal helper imports.

# Test Cases

- `git init -q` and `mdkg init --agent`.
- No-SPEC `mdkg spec list --json` returns count 0 and `spec validate --json`
  succeeds.
- Public commands create SPEC and WORK mirrors.
- `mdkg index`, `spec list/show/validate`, and capability search discover them.
- `work trigger`, `work order status`, `work receipt new`, and
  `work receipt verify` prove no-execution semantic mirror flow.
- Project DB queue bridge enqueues delivery state without executing work.
- `search`, `show`, and `validate` pass against the created graph.

# Results / Evidence

- Pending.

# Notes / Follow-ups

- None yet.
