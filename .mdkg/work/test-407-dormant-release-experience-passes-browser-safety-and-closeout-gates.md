---
id: test-407
type: test
title: Dormant release experience passes browser safety and closeout gates
status: done
priority: 1
epic: epic-240
tags: [release, test, goal-63]
owners: []
links: []
artifacts: [design-qa.md, .mdkg/artifacts/goal-63/browser/marketing-process-rail-desktop.png, .mdkg/artifacts/goal-63/browser/marketing-process-rail-mobile-390x844.png, .mdkg/artifacts/goal-63/browser/docs-security-desktop-1440x900.png, .mdkg/artifacts/goal-63/browser/docs-security-content-mobile-390x844.png, .mdkg/artifacts/goal-63/browser/process-rail-reference-comparison.png, .mdkg/artifacts/goal-63/browser/process-rail-focused-comparison.png]
relates: [goal-63]
blocked_by: [task-742, test-401, test-402, test-403, test-404, test-405, test-406]
blocks: []
refs: [edd-71, dec-73, dec-74, prd-11, prop-8]
context_refs: [goal-62, goal-63, goal-64, epic-240, dec-74, prop-8, task-740, task-741, task-742]
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint]
cases: []
created: 2026-07-11
updated: 2026-07-11
---
# Overview

Final Goal 63 acceptance test: prove the complete release experience works
locally, remains dormant and unpublished, and leaves a clean evidence-backed
commit for Goal 64.

# Target / Scope

All Goal 63 tasks and tests; four build modes, browser/accessibility proof,
forbidden-content scans, package/manifest state, local commit, and external-side-
effect boundary.

# Preconditions / Environment

Passing `test-401` through `test-406`, completed `task-742`, canonical manifest
draft, package 0.4.2, local servers/browser evidence, and no remote mutation.

# Test Cases

- Full Goal 63 build/test/CLI/docs/smoke ladder passes.
- Marketing/docs draft and active-preview receipts cover every release lane.
- Browser evidence covers Process Rail desktop/mobile, all four loop routes,
  navigation, themes, keyboard, focus, 320px reflow, 200% zoom, overflow,
  reduced motion, forced colors, and accessibility checks.
- Built-output scan finds no secrets, paths, dogfood ids, hashes, private
  receipts, unsupported claims, dead links, or dormant leaks.
- Manifest remains byte-for-byte draft and package remains 0.4.2.
- Local implementation commit is inspectable, scoped, and leaves the worktree
  clean.
- No push, deployment, npm publish, tag, global install, production activation,
  DNS/analytics change, or external release mutation occurred.
- Goal 64 pack receives all evidence and remains the sole owner of release
  versioning, publication, activation, and production proof.

# Results / Evidence

- `test-401` through `test-406` and `task-730` through `task-742` are complete
  with structured checkpoints. The full Goal 63 required-check ladder passed
  with zero graph warnings/errors and zero documentation example failures.
- Four-mode release-state checks prove canonical marketing/docs output has no
  release leak and local active preview exposes only the accepted noindex
  announcement, four loop routes, and truthful draft supplements.
- Browser evidence covers the Process Rail and complete docs journey at desktop,
  390x844, 320px, and 200% layout zoom, plus navigation, focus, themes, reduced
  motion, forced colors, overflow, and console checks. Automated accessibility
  smoke passed 10 pages and `design-qa.md` reports `final result: passed`.
- Built-output scans found no local paths, dogfood ids, internal checkpoint ids,
  content hashes, secrets, private receipts, unsupported commands, or premature
  npm availability claim.
- Package truth is 0.4.2. The manifest remains `draft` with SHA-256
  `7c08cbcb6da2fce73c3945378786f1dd64192c976e155a0e79eabd7bde4a7f3a`.
  Dormant implementation commit
  `e28c1c0f5e3929008068e0504a118e01b92de3e8` is scoped and inspectable.
- No remote or provider mutation occurred. Goal 64 retains exclusive ownership
  of versioning, finalized changelog/availability copy, pushes, npm publication,
  release activation, global installation, deployment, and production proof.

# Notes / Follow-ups

- Published production browser checks belong to Goal 64.
- Post-v0.5.0 design follow-ups remain separate from release acceptance.
