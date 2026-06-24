---
id: test-248
type: test
title: mdkg dev generated asset and demo video evidence contract
status: todo
priority: 2
tags: [mdkg-dev, visuals, demo-video, deferred]
owners: []
links: []
artifacts: []
relates: [goal-21, task-519, goal-32]
blocked_by: [task-519]
blocks: []
refs: [archive://archive.mdkg-dev-preview-polish-pass-2-2026-06-24]
context_refs: [prd-7, edd-36, edd-37, edd-38, dec-37, dec-38]
evidence_refs: []
aliases: []
skills: []
cases: []
created: 2026-06-23
updated: 2026-06-23
---
# Overview

Validate that future generated visual assets and demo-video materials are source-backed, safe, accessible, responsive, and aligned with mdkg.dev public-alpha claims before they are used publicly.

# Target / Scope

- `task-519`
- mdkg.dev visual/product pages
- docs pages that embed generated diagrams or demo material

# Preconditions / Environment

- Goal-32 copy and docs IA are complete.
- Any generated assets have a recorded source brief and evidence checkpoint.
- Demo material uses local/temp repositories or sanitized public examples only.

# Test Cases

- Asset source brief maps every visual claim to docs, CLI, or mdkg evidence.
- Images and video frames contain no raw secrets, tokens, private prompts, provider payloads, unrelated logs, or private repo identifiers.
- Alt text, captions, and surrounding copy explain the asset without relying on decorative visuals.
- Desktop and mobile Browser checks show no overlap, unreadable code, or layout shift introduced by assets.
- Demo storyboard avoids production side effects, DNS changes, npm publish, analytics activation, and hidden credential requirements.

# Results / Evidence

Record Browser screenshots, Product Design notes, source briefs, and no-secret scan results before public use.

# Notes / Follow-ups

- Keep this deferred until goal-32 preview polish and Vercel proof are complete.
