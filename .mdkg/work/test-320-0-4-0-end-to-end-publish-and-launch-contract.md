---
id: test-320
type: test
title: 0.4.0 end to end publish and launch contract
status: todo
priority: 1
epic: epic-204
parent: goal-42
tags: [0.4.0, end-to-end, publish, launch, chrome, vercel, test]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-617]
blocks: [task-606, test-312]
refs: [task-617, task-606, test-312]
context_refs: []
evidence_refs: []
aliases: []
skills: []
cases: []
created: 2026-06-27
updated: 2026-06-27
---
# Overview

Validate the complete `0.4.0` end-to-end publish and launch contract before
`goal-42` can recommend readiness.

# Target / Scope

`task-617`, npm postpublish state, Vercel production currentness, Chrome live
proof, public content, and closeout boundaries.

# Preconditions / Environment

All upstream package, npm postpublish, Vercel, and Chrome tasks have run with
evidence.

# Test Cases

- Npm registry and temp-install receipts prove `mdkg@0.4.0` is published and
  installable from npm.
- Vercel receipts prove `mdkg.dev` and `docs.mdkg.dev` production deployments
  are current and built from the approved commit.
- Chrome receipts prove live desktop/mobile pages expose current 0.4.0
  metadata, release notes, changelog details, navigation, and CTA rendering
  without console or responsive regressions.
- Public no-secret/content sanity passes on live pages.
- Final evidence states either `publish/launch ready pending explicit approval`
  or `not ready` with exact remaining gaps.
- No unapproved npm publish, git tag, push, deploy, DNS, analytics, or provider
  mutation occurred outside the recorded approval boundaries.

# Results / Evidence

Pending implementation.

# Notes / Follow-ups

- This is the final contract that unblocks `task-606` and `test-312`.
