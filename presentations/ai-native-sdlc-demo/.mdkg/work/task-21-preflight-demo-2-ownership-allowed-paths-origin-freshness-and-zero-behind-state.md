---
id: task-21
type: task
title: Preflight Demo 2 local integration ownership and exact allowed paths
status: done
priority: 1
epic: epic-5
parent: goal-5
prev: task-48
next: task-22
tags: [ai-native-sdlc, presentation-demo, phase-5, step-2, local-integration]
owners: [root-integration-owner]
links: []
artifacts: [artifacts/demo-002/local-integration-allowlist.json, artifacts/demo-002/local-commit-preflight.json]
relates: []
blocked_by: []
blocks: []
refs: [goal-5, epic-5, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, goal-4, chk-13, chk-14, task-48]
context_refs: [goal-5, epic-5, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, goal-4, chk-13, chk-14, task-48]
evidence_refs: [chk-14, task-48]
aliases: [phase-5-step-2, demo-2-local-integration-preflight]
skills: [select-work-and-ground-context, publish-static-demo-with-exact-sha, verify-close-and-checkpoint]
created: 2026-07-26
updated: 2026-07-27
---

# Overview

Establish the exclusive root integration-owner lease and exact local commit
allowlist after the canonical Demo 2 smoke contract is green. This node does
not obtain publication approval and does not fetch, commit, or push.

# Acceptance Criteria

- Consume `chk-14`, task-48's passing smoke/candidate revalidation, and the
  Goal 2–4 accepted receipts.
- Inventory every dirty, untracked, ignored-relevant, and staged path without
  cleaning, restoring, or absorbing unrelated work.
- Derive `local-integration-allowlist.json` with each exact repository-relative
  path, owner, reason, expected hash, allowed local operation, logical commit
  group, and forbidden surfaces.
- The allowlist may include only accepted Demo 2 canonical integration,
  program/run graph and public-safe evidence, the task-48 smoke/fixture repair,
  required generated indexes/mirrors, and the explicit root program bundle.
- Separate commit-eligible paths from local-only evidence and generated runtime
  debris. Pack files, preview build output, caches, credentials, and raw
  provider state are never staged.
- Acquire a root-integration-owner lease that names checkout, owner, start/expiry, base SHA, allowed paths, conflict check, release condition, and the parallel-writer acknowledgement.
- Record HEAD and tracked upstream state without claiming remote freshness,
  dirty/staged inventories, candidate/checkpoint hashes, the exact logical
  commit/message plan, and abort conditions in `local-commit-preflight.json`.
- Abort on unrelated dirty/staged work, allowlist mismatch, expired lease,
  missing ownership, candidate/hash drift, or any required source outside the
  accepted local boundary.
- Changed surfaces, commands, decisions, warnings, and artifacts are recorded in public-safe evidence.
- The successor task-22 does not begin until this node is verified.

# Files Affected

- Only the exact local integration allowlist established by this node.
- Program evidence under this nested graph.
- No unrelated root, Git index/history/remote, or provider surface.

# Implementation Notes

- Re-read the active writer lease and current state immediately before mutation.
- Prefer deterministic mdkg, build, Git, and provider receipts over narrative claims.
- Keep raw prompts, credentials, tokens, cookies, provider payloads, and unrelated private context out of artifacts.
- Stop rather than broaden scope or authority.

# Test Plan

- Every dirty or proposed commit path is present with the same expected hash
  and logical commit group in the allowlist; unrelated paths are absent.
- The staged inventory remains empty at closeout.
- The lease and local preflight remain valid at task-22 start; otherwise this
  node is repeated.

# Links / Artifacts

- goal-5
- epic-5

# Results

- Acquired the exclusive `root-integration-owner` lease at root HEAD
  `e2af9e9ec5b2e0e8912671ed54b1a2082dd19988`; no parallel root or Git-index
  writer is authorized during the bounded integration window.
- Inventoried 206 dirty paths with an empty Git index. All paths are owned by
  the accepted Demo 2 candidate, its run graph and public-safe evidence, the
  Goal 5 publication contract, the canonical smoke repair, or the explicit
  root-owned program bundle. No unrelated path was found.
- Froze 202 commit-eligible paths into two exact hash-bound groups:
  `demo2-candidate` (166 paths) and `goal5-contract` (36 paths).
- Reserved the two self-referential task-21 receipts and two generated
  run-local context-pack files as local-only and unstaged. Other context packs,
  run-local build output, dependencies, and root/site build output are
  hash-inventoried generated debris and are never staged.
- Recorded the tracked upstream only as an observation. No fetch was
  performed and no remote-freshness claim is made in this node.

# Evidence

- `artifacts/demo-002/local-integration-allowlist.json`
- `artifacts/demo-002/local-commit-preflight.json`
- The exact commit-path manifest hash is recorded in both receipts and is
  rechecked at task-22 start.
