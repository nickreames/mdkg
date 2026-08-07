---
id: test-473
type: test
title: Verify the Remotion dependency license rendering captions still fallback accessibility performance and no-secret contract
status: done
priority: 1
epic: epic-255
prev: task-814
next: task-815
tags: [remotion, presentation, research, validation]
owners: [root-integration-owner]
links: []
artifacts: [artifact://remotion/feasibility-receipt, .mdkg/artifacts/goal-79/remotion/feasibility-receipt.md]
relates: [goal-79, task-814]
blocked_by: [task-814]
blocks: [task-815]
refs: [goal-79, epic-255, task-814, task-519, test-248, ai_native_sdlc_demo:goal-3, dec-92]
context_refs: [goal-79, epic-255, task-814, task-519, test-248, ai_native_sdlc_demo:goal-3, dec-92]
evidence_refs: [spike-35, task-814, chk-561]
aliases: []
skills: [service-boundary-ownership-check, verify-close-and-checkpoint]
cases: [dependency-boundary, license-compatibility, offline-rendering, captions, still-fallback, accessibility, performance, no-secret]
created: 2026-07-26
updated: 2026-07-27
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

Accepted receipt:
`.mdkg/artifacts/goal-79/remotion/feasibility-receipt.md`.

Overall result: **pass for a decision of defer; fail for proceed**.

Every case has a primary-source/repository-backed disposition:

- `dependency-boundary`: pass for research / fail for proceed. Current official
  docs define exact same-version packages and a browser bootstrap, but no
  isolated lock, transitive tree, browser hash, or maintenance owner exists.
- `license-compatibility`: fail for proceed. Current v4 eligibility and FFmpeg
  terms are identified, but the legal entity/use classification and retained
  obligations are unaccepted.
- `offline-rendering`: pass for research / fail for proceed. Local bundle,
  assets/fonts, seeded inputs, and preinstalled browser are documented; no
  network-denied render, two-run comparison, or event playback exists.
- `captions`: pass for research / fail for proceed. Local SRT import,
  burned-in/SRT export, transcript, and WCAG contract are defined; no caption
  artifact or sync review exists.
- `still-fallback`: pass. The accepted slide 17 and retained production
  source-versus-specialized PNG preserve the complete narrative.
- `accessibility`: pass for research / fail for proceed. The non-motion,
  reduced-motion, pause/skip, contrast, caption/transcript, and flash contracts
  are frozen; no clip-level review exists.
- `performance`: fail for proceed. Target budgets are frozen, but no render,
  memory, output-size, repeatability, or PowerPoint playback measurement exists.
- `no-secret`: pass for current research / fail for proceed. Current artifacts
  are bounded and public-safe, while a future composition/output scan remains
  unrun.

Frozen-gate rollup: 2/12 proceed gates pass, ten fail for proceed, and no waiver
exists. Remotion's current R1 readiness score is 32.0/100.

The root/docs/mdkg-dev package and lock hashes match their activation baselines,
and no Remotion dependency is present. Inspected local runtime was Node
v24.18.0/npm 11.16.0. No install, browser bootstrap, render, playback, or
functional mutation occurred.

# Notes / Follow-ups

- Do not advance task-815 until every case has evidence.
- Do not install Remotion to compensate for missing research evidence.
- Every case now has evidence, so task-815 may resolve dec-92. Missing proceed
  gates require defer; they are not blockers to completing the research test.
