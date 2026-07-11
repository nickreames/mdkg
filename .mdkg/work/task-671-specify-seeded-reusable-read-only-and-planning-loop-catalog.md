---
id: task-671
type: task
title: Specify seeded reusable read-only and planning loop catalog
status: done
priority: 1
epic: epic-210
parent: epic-210
tags: [loop, planning, seeds, audit-templates]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [goal-57, epic-210, edd-66, dec-65]
context_refs: []
evidence_refs: []
aliases: []
skills: [select-work-and-ground-context]
created: 2026-07-05
updated: 2026-07-05
---
# Overview

Specify the initial reusable mdkg loop catalog so future CLI consumers can fork
or run high-quality audit and planning processes repeatedly across repos.

# Acceptance Criteria

- Seed catalog includes security audit.
- Seed catalog includes design/frontend UX audit.
- Seed catalog includes backend/API/CLI design-bloat audit.
- Seed catalog includes tech-stack best-practices audit.
- Seed catalog includes duplicate-code/linting audit.
- Seed catalog includes test/CI/SKILL.md infrastructure audit.
- Seed catalog includes user-story audit and recommendations.
- Each seed loop describes intended mode, expected child nodes, evidence, and
  definition-of-done expectations.
- Seeded loops are read-only or planning-oriented in MVP.

# Files Affected

Future implementation targets to verify, not change in this pass:

- `.mdkg/templates/**`
- seed or fixture folders selected by the implementation design
- docs pages that explain reusable loops

# Implementation Notes

- Avoid runtime-job language.
- Keep write-capable implementation loops out of MVP seeding unless the planning
  decision explicitly changes.

# Seed Catalog Specification

Initial seeded loops should be reusable, importable/forkable, and read-only or
planning-oriented. They should not execute agents directly.

## Security Audit Loop

- Mode: read-only audit.
- Purpose: find plausible security risks with source grounding.
- Expected child nodes: scoped audit task, findings tests, spike for uncertain
  exploitability, proposal for remediation options, checkpoint/receipt evidence.
- Evidence: affected paths, source-to-sink notes, severity rationale, false
  positive notes, recommended follow-up.

## Design / Frontend UX Audit Loop

- Mode: read-only audit or planning.
- Purpose: audit frontend design against the existing product direction,
  ChatGPT/Codex interface inspiration where applicable, contrast, accessibility,
  responsive fit, information density, and color/schema standards.
- Expected child nodes: screenshot/audit task, accessibility test, proposal for
  design adjustments, decision if product direction changes.
- Evidence: screenshots or artifact refs, contrast/accessibility notes, route
  coverage, recommended prioritized changes.

## Backend / API / CLI Design-Bloat Audit Loop

- Mode: read-only audit.
- Purpose: reduce code bloat, promote modular boundaries, and check for CLI flag
  or command-surface sprawl.
- Expected child nodes: source audit task, spike for ambiguous architecture,
  proposal with simplification options, decision for accepted boundary changes.
- Evidence: modules/commands inspected, duplication or complexity findings,
  recommended simplification path.

## Tech-Stack Best-Practices Audit Loop

- Mode: read-only audit or planning.
- Purpose: compare current implementation against framework/toolchain best
  practices without forcing dependency churn.
- Expected child nodes: stack inventory task, best-practice comparison spike,
  recommendation proposal, tests for risky gaps.
- Evidence: package/runtime versions, relevant source patterns, official-doc
  citations when current external guidance is needed.

## Duplicate-Code / Linting Audit Loop

- Mode: read-only audit.
- Purpose: find duplication, lint gaps, formatting drift, and low-risk cleanup
  candidates.
- Expected child nodes: source scan task, lint/test check, proposal for safe
  cleanup batches.
- Evidence: duplicated symbols/paths, lint outputs, recommended batching.

## Test / CI / SKILL.md Infrastructure Audit Loop

- Mode: read-only audit or planning.
- Purpose: improve automation tests, unit testing, CI gates, and skill
  infrastructure/consolidation.
- Expected child nodes: test inventory task, CI gate review, skill inventory
  review, proposal for consolidation or new checks.
- Evidence: command matrix, CI/test files, skill refs, coverage gaps, proposed
  guardrails.

## User-Story Audit And Recommendations Loop

- Mode: planning.
- Purpose: review user stories, product flows, and recommendation gaps.
- Expected child nodes: story inventory task, evidence review, proposal with
  at least three product-path options where tradeoffs are material.
- Evidence: user story refs, affected workflows, recommendation rationale, open
  questions.

# Common Seed Requirements

- Every seed loop declares intended mode, default scope expectation,
  definition-of-done shape, expected linked child nodes, evidence expectations,
  and blocker-continuation behavior.
- Every seed loop is usable without CocoIndex or semantic search.
- Every seed loop can be forked into a scoped loop with default child
  materialization.
- Every seed loop avoids write capability unless a later decision explicitly
  introduces write-capable loop templates.

# Test Plan

- `mdkg show test-348`
- `mdkg validate --changed-only --json`

# Links / Artifacts

- `epic-210`
- `test-348`
