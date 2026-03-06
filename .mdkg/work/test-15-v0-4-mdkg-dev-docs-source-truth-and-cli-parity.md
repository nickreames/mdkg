---
id: test-15
type: test
title: v0.4 mdkg dev docs source truth and cli parity
status: todo
priority: 1
epic: epic-4
tags: [v0_4, mdkg-dev, docs, validation]
owners: []
links: []
artifacts: []
relates: [prd-2, dec-8, dec-9, task-44, task-46, epic-4]
blocked_by: []
blocks: []
refs: []
aliases: []
cases: [cli-reference-parity, roadmap-labeling, non-implemented-claim-guard]
created: 2026-03-04
updated: 2026-03-04
---

# Overview

Validate that mdkg.dev planning docs remain aligned with current CLI source truth and do not misstate unimplemented behavior.

# Target / Scope

Covers docs/website planning node accuracy against current command surfaces and roadmap labeling policy.

# Preconditions / Environment

- `prd-2` and linked mdkg.dev planning tasks are integrated.
- Current CLI help output is available from source (`src/cli.ts`) and `mdkg --help`.
- This remains a docs/work-node integration pass.

# Test Cases

- Verify planned docs claims distinguish implemented behavior from v0.4 targets.
- Verify command/flag references in planning docs match current `mdkg --help` where claims are current-state.
- Verify deferred skills/events command naming policy is preserved.
- Verify mdkg.dev IA/docs scope is represented in task nodes and epic linkage.

# Results / Evidence

Capture `mdkg show prd-2 --body`, `mdkg --help`, and selected task node outputs for parity review.

# Notes / Follow-ups

- Add automated docs drift checks if/when docs site assets are committed in repo.
- Add website build/preview checks once mdkg.dev implementation starts.
