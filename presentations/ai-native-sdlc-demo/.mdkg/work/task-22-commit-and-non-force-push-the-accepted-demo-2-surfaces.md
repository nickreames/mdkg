---
id: task-22
type: task
title: Commit the accepted Demo 2 surfaces locally without push
status: progress
priority: 1
epic: epic-5
parent: goal-5
prev: task-21
next: task-49
tags: [ai-native-sdlc, presentation-demo, phase-5, step-3, local-commit]
owners: [root-integration-owner]
links: []
artifacts: [artifacts/demo-002/local-commit-receipt.json]
relates: []
blocked_by: []
blocks: []
refs: [goal-5, epic-5, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, goal-4, chk-14, task-21]
context_refs: [goal-5, epic-5, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, goal-4, chk-14, task-21]
evidence_refs: [chk-14, task-21]
aliases: [phase-5-step-3, demo-2-local-commit]
skills: [select-work-and-ground-context, publish-static-demo-with-exact-sha, verify-close-and-checkpoint]
created: 2026-07-26
updated: 2026-07-27
---

# Overview

Create the bounded logical local commits for the accepted Demo 2 candidate,
smoke-contract repair, graph evidence, and root projection. This node expressly
does not push.

# Acceptance Criteria

- Consume the still-valid task-21 lease, allowlist, candidate, and local
  preflight hashes; rerun task-21 on any HEAD, path, hash, owner, or lease drift.
- Run the complete affected validation set before staging.
- Refresh the program bundle through the root integration owner and require
  root subgraph verification before it enters the local commit allowlist.
- Stage one logical group at a time and compare every staged path/hash
  byte-for-byte with its allowlist group. Never use broad staging.
- Create bounded local commits with recorded messages, parent SHAs, staged
  inventories, and validation receipts. Do not amend or rewrite existing
  commits.
- Finish with all commit-eligible allowlist paths committed, the Git index
  empty, and only explicitly declared local evidence remaining dirty.
- Write `local-commit-receipt.json` with allowlist/preflight hashes, commit
  SHAs/parents/messages, exact paths/hashes, checks, actor, and timestamps.
- Do not resume or claim child publication `task-3`; task-50 owns that action
  only after human approval of the actual push range.
- Do not fetch as a freshness claim, push, inspect deployments, or mutate a
  provider in this node.
- Changed surfaces, commands, decisions, warnings, and artifacts are recorded in public-safe evidence.
- The successor task-23 does not begin until this node is verified.

# Files Affected

- Only task-21's exact local integration allowlist.
- Program evidence under this nested graph.
- Local Git commits are allowed; Git push, provider access, and unrelated
  product/root surfaces are not.

# Implementation Notes

- Re-read the active writer lease and current state immediately before mutation.
- Only the root integration owner may stage or commit; the program writer
  supplies reviewed hashes and does not mutate the Git index.
- Prefer deterministic mdkg, build, Git, and provider receipts over narrative claims.
- Keep raw prompts, credentials, tokens, cookies, provider payloads, and unrelated private context out of artifacts.
- Stop rather than broaden scope or authority.

# Test Plan

- Each staged group exactly equals its allowlist subset and contains no
  unrelated or generated-local-only state.
- Every local commit resolves its parent, message, paths, and hashes, and the
  final index is empty.
- `git status` contains only the accepted local-evidence exception.
- Stop before fetch-based approval or push; those belong to task-49 and task-50.

# Links / Artifacts

- goal-5
- epic-5
- Evidence pending activation.
