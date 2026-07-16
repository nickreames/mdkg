---
id: bug-2
type: bug
title: bound stdin materialization requests before allocation
status: done
priority: 1
parent: goal-66
next: test-452
tags: [goal-66, security, materialization, input-bounds, cwe-400, 0.5.2]
owners: []
links: []
artifacts: []
relates: [task-747, task-748]
blocked_by: []
blocks: [test-452]
refs: [test-452, test-450, goal-67, edd-73]
context_refs: [chk-530]
evidence_refs: [chk-530]
aliases: [stdin-request-preallocation-bound]
skills: [build-pack-and-execute-task, verify-close-and-checkpoint]
created: 2026-07-15
updated: 2026-07-15
---
# Overview

The partial Goal-66 Codex Security scan validated that
`mdkg git materialize --request -` reads stdin to EOF with
`fs.readFileSync(0)` before enforcing `MAX_REQUEST_BYTES`. The nominal
64 KiB contract therefore does not bound allocation for streamed requests.

This is provisional scan evidence rather than a finalized plugin finding, but
the real CLI behavior is independently reproduced and blocks release.

# Reproduction Steps

1. Start the real CLI with `git materialize --request - --json`.
2. Write 65,537 bytes while keeping stdin open.
3. Observe that the process remains active with no rejection.
4. Close stdin and observe the bounded `invalid_request` receipt.

# Expected vs Actual

- expected: reject and stop reading as soon as the byte limit is exceeded,
  without waiting for EOF or starting Git.
- actual: the process accepts the bytes into memory, waits for EOF, and checks
  the size afterward.

# Suspected Cause

`readRequest` applies a pre-read `lstat` limit for regular files but uses a
whole-stream synchronous read for file descriptor 0. The shared post-read size
check runs too late to enforce the stdin allocation boundary.

# Fix Plan

- Replace whole-stream stdin buffering with a bounded incremental reader.
- Abort and close the input path immediately after byte `65,536`.
- Preserve JSON-only parsing, duplicate-key rejection, file request behavior,
  exit-code semantics, bounded receipts, and the no-Git-before-valid-request
  invariant.
- Do not increase the request-size limit or silently truncate JSON.

# Test Plan

- Complete `test-452`.
- Add a held-open stream regression that proves rejection before EOF.
- Assert no Git subprocess starts and no destination or temporary state appears.
- Run focused materialization tests, full tests, consumer smoke, and
  `git diff --check`.

# Implementation Evidence

- Replaced whole-stdin buffering with incremental `fs.read` calls capped at the
  remaining request allowance plus one byte.
- The reader rejects immediately when byte 65,537 arrives and never stores more
  than 65,536 accepted bytes.
- Focused materialization suite: 15/15 passed.
- `npm run smoke:git-materialize`, `npm run build`, and `git diff --check`
  passed on 2026-07-15.

# Links / Artifacts

- Partial scan: `4956a227-c1c0-4309-98d0-1e65687fab71`
- Candidate: `git-materialize-stdin-prelimit-001`
- Durable evidence summary and hashes: `chk-530`
