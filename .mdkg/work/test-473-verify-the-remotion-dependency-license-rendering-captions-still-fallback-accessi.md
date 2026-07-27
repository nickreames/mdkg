---
id: test-473
type: test
title: Verify the Remotion dependency license rendering captions still fallback accessibility performance and no-secret contract
status: backlog
priority: 1
epic: epic-255
prev: task-814
next: task-815
tags: [remotion, presentation, research, validation]
owners: [root-integration-owner]
links: []
artifacts: [artifact://remotion/feasibility-receipt]
relates: [goal-79, task-814]
blocked_by: []
blocks: []
refs: [goal-79, epic-255, task-814, task-519, test-248, ai_native_sdlc_demo:goal-3, dec-92]
context_refs: [goal-79, epic-255, task-814, task-519, test-248, ai_native_sdlc_demo:goal-3, dec-92]
evidence_refs: []
aliases: []
skills: [service-boundary-ownership-check, verify-close-and-checkpoint]
cases: [dependency-boundary, license-compatibility, offline-rendering, captions, still-fallback, accessibility, performance, no-secret]
created: 2026-07-26
updated: 2026-07-26
---
# Overview

Validate that the proposed Remotion direction is decision-ready under repository, presentation, offline-media, accessibility, performance, licensing, retention, and public-safety constraints. This is evidence review and bounded feasibility analysis, not an install or render test.

# Target / Scope

- spike-35 option comparison
- task-814 candidate scenes and rubric
- dec-92 decision inputs
- task-519, test-248, and the read-only presentation goal projection

# Preconditions / Environment

- Current source and Git state are re-read.
- Current primary package/license/rendering documentation is available.
- No dependency is installed and no media/source/deck/site/provider mutation occurs.

# Test Cases

- `dependency-boundary`: identify exact packages/toolchain, supported versions, lockfile impact, and maintenance owner; unknowns fail proceed.
- `license-compatibility`: cite current license and usage constraints for offline presentation and any contemplated site assets.
- `offline-rendering`: prove from documentation and architecture that rendering and playback can be deterministic without network/runtime provider dependency.
- `captions`: define caption source, synchronization, editing, and speaker/offline playback behavior.
- `still-fallback`: every candidate scene has a legible static still or slide that preserves the core meaning.
- `accessibility`: define reduced-motion, pause/seek, contrast, readable labels, transcript/caption, and non-motion comprehension.
- `performance`: set render-time, output-size, slide/video playback, and any canonical-site budget before implementation.
- `no-secret`: inputs, logs, assets, receipts, and generated outputs exclude credentials, raw private prompts, provider payloads, and unreviewed proprietary media.
- Any unavailable or unresolved gate yields defer/reject, never an implicit pass.

# Results / Evidence

Pending activation. Record source, accessed/publication date, supported claim, approved paraphrase, command/inspection method, result, limitation, and pass/fail per case in `artifact://remotion/feasibility-receipt`.

# Notes / Follow-ups

- Do not advance task-815 until every case has evidence.
- Do not install Remotion to compensate for missing research evidence.
