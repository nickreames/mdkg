---
id: test-405
type: test
title: Security walkthrough uses supported CLI safe placeholders and read-only boundaries
status: done
priority: 1
epic: epic-238
tags: [release, test, goal-63]
owners: []
links: []
artifacts: []
relates: [goal-63]
blocked_by: [task-737, task-739]
blocks: [test-407]
refs: [edd-71, dec-73, dec-74, prd-11, prop-8]
context_refs: [goal-61, goal-62, goal-63, epic-238, dec-74, prop-8, task-737, task-739]
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint]
cases: []
created: 2026-07-11
updated: 2026-07-11
---
# Overview

Prove the security walkthrough is executable as documentation, safe to publish,
and honest about read-only writes, approvals, routing, and runtime ownership.

# Target / Scope

`task-737` and `task-739`; command sequence, structured excerpts, question
bindings, dry-run purity, boundaries, placeholders, links, and leak scans.

# Preconditions / Environment

Temporary initialized mdkg workspace, packaged/current CLI, draft and
active-preview docs builds, and no external advisory/provider authorization.

# Test Cases

- Parse or safely execute list, show, fork dry-run, real fork, plan, pack with
  `--profile concise`, next, and runs exactly as documented.
- Prove dry-run writes nothing and does not consume the identity used by the real
  fork.
- Structured excerpts contain only fields emitted by current JSON contracts.
- Question bindings use `question_answer_refs` identities and do not invent an
  answer command.
- External advisory/provider work remains unapproved; local cache writes and
  read-only scope are explicit.
- Read-only functional-source boundary and allowed mdkg writes are stated.
- mdkg/harness execution boundary, next routing, and closeout conditions are
  stated accurately.
- Public output contains placeholders only and no local paths, dogfood ids,
  hashes, receipts, secrets, or provider data.
- Nonexistent `run`, `resume`, `execute`, and `note add` commands are absent.

# Results / Evidence

- The purpose-built walkthrough uses the supported sequence: list, show, fork
  dry-run, real fork, plan, concise pack, next, and runs. It uses `LOOP_ID` and
  stable question identities rather than copied dogfood output.
- Installed-package `smoke:loop` exercised all seven seeds on SQLite, proved
  fork dry-run purity and stable real-fork identity, bound the accepted security
  answers, wrote and dry-ran concise packs, inspected plan/next/runs, and ended
  with graph validation.
- The walkthrough distinguishes mdkg state/orchestration from coding-harness
  execution and explains that read-only functional-source work may still write
  mdkg findings and evidence.
- Generated/docs checks reject invented run/resume/execute/note commands. Built
  output contains no local path, dogfood id, current checkpoint id, content
  hash, private receipt, or provider claim.

# Notes / Follow-ups

- External checks are not required for this documentation test.
- Update examples through source/generation contracts when CLI syntax changes.
