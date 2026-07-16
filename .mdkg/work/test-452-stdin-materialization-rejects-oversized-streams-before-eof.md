---
id: test-452
type: test
title: stdin materialization rejects oversized streams before EOF
status: done
priority: 1
parent: goal-66
prev: bug-2
next: bug-3
tags: [goal-66, test, security, materialization, input-bounds, 0.5.2]
owners: []
links: []
artifacts: []
relates: [bug-2, task-747, task-748]
blocked_by: [bug-2]
blocks: [bug-3]
refs: [bug-2, test-450, goal-67]
context_refs: [chk-530]
evidence_refs: [chk-530]
aliases: [stdin-request-limit-regression]
skills: [verify-close-and-checkpoint]
cases: [threshold-plus-one-held-open, exact-limit-control, no-git-before-rejection, cleanup, file-request-compatibility]
created: 2026-07-15
updated: 2026-07-15
---
# Overview

Prove that streamed JSON requests are bounded during reading, not only after
EOF, while preserving the existing file request and receipt contracts.

# Target / Scope

- `bug-2`
- `src/commands/git_materialize.ts`
- Focused source and packed-consumer materialization behavior.

# Preconditions / Environment

- Use a local child process and inert bytes only.
- Cap the probe at 65,537 bytes and a bounded timeout.
- Do not use a network source, real credential, or external provider.

# Test Cases

- Keep stdin open after writing 65,537 bytes; the CLI must reject before EOF.
- A valid request exactly at or below the limit must continue to parsing.
- Oversized input must not start Git, publish a destination, or leave temporary
  state.
- Regular-file `--request <file>` behavior remains unchanged.
- Cancellation and error receipts remain bounded and deterministic.

# Results / Evidence

- Held-open stdin with 65,537 inert bytes exited with code 2 and
  `reason_code: invalid_request` before EOF.
- The oversized path emitted no request hash, did not invoke the Git wrapper,
  and published no destination.
- A valid JSON request padded to exactly 65,536 bytes materialized successfully.
- Regular file/stdin equivalence, cancellation, cleanup, and all existing
  materialization tests passed: 15/15.
- `npm run smoke:git-materialize` and `git diff --check` passed.

# Notes / Follow-ups

- Any post-EOF-only rejection keeps `test-450` blocked.
