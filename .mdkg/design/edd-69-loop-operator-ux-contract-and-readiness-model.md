---
id: edd-69
type: edd
title: Loop operator UX contract and readiness model
tags: [loop, ux, readiness, descriptor]
owners: []
links: []
artifacts: []
relates: [goal-59]
refs: [goal-59, goal-58, loop-4, prop-4, task-691, task-692, test-366]
aliases: []
created: 2026-07-06
updated: 2026-07-06
---
# Overview

`goal-58` made `loop` a first-class node type, and `loop-4` proved the model can
drive a real read-only audit. The remaining gap is operator ergonomics: humans
and agents still have to stitch together `loop show`, `loop runs`, `loop plan`,
`pack`, and skill instructions to know whether a loop is ready, what decision
inputs are missing, and what lane should run next.

This EDD defines the focused contract for `goal-59`: improve loop operation now
without turning the pass into a broad CLI redesign.

# Architecture

- Keep mdkg as the graph substrate and source of loop state.
- Add a reusable loop readiness projection in mdkg core/command code.
- Have `mdkg new loop`, `mdkg loop list`, `mdkg loop plan`, and `mdkg loop next`
  consume that projection where relevant.
- Pilot typed command descriptors only for the loop command family so help,
  command-contract metadata, and routing can share a more explicit source of
  truth.

# Data Model

Loop readiness should expose first-class metadata for:

- pre-run questions;
- pre-approved actions;
- approval-gated actions;
- evidence lanes and lane status;
- lane waiver refs;
- `decision_refs` for durable rationale;
- `approval_refs` for human or orchestrator approvals;
- child refs, run refs, evidence refs, output refs, and evaluation refs;
- closeout readiness and next actionable lane.

The implementation may store this as frontmatter attributes, body sections, or
derived projection data, but the public command output must be deterministic and
machine-readable.

# APIs / interfaces

- `mdkg new loop "<title>"` remains deterministic raw/custom loop creation.
- `mdkg new loop` text output should point users toward `mdkg loop list` and
  `mdkg loop fork <template> --scope <scope>` when seeded templates may fit.
- `mdkg new loop --json` should add `next_actions` or `suggested_templates`
  without changing the core created-node envelope.
- `mdkg loop list` should make seeded templates and existing loops easier to
  compare.
- `mdkg loop plan <loop> --json` is the primary readiness/status cockpit.
- `mdkg loop next <loop> --json` is the minimal goal-like actionable routing
  surface.
- `/goal` handoff should be documented as a future design contract only, not
  implemented in this goal.

# Failure Modes

- Do not add interactive prompts; mdkg must stay scriptable for agents and CI.
- Do not make `mdkg loop next` mark state or claim work silently.
- Do not let descriptor migration change public loop command behavior.
- Do not collapse loop semantics into goal semantics.
- Do not widen this goal into a generic CLI redesign.

# Observability

Loop UX changes should be observable through deterministic command output,
generated command contracts, docs checks, and mdkg validation. No runtime
telemetry or external service instrumentation belongs in this goal.

# Security / privacy

Readiness metadata must not store secrets, raw provider payloads, private tool
outputs, or runtime-managed approval state. Approval refs should point to mdkg
decision/approval evidence, not embed sensitive approval payloads.

# Testing Strategy

Validation must cover:

- raw loop creation guidance and JSON next actions;
- readiness metadata parsing/projection;
- list/plan/next JSON contracts;
- descriptor-backed help and command-contract parity;
- existing loop command compatibility;
- unchanged goal behavior.

# Rollout Plan

Ship the loop UX changes as a focused implementation goal. Use the results to
inform `goal-60`, the later general CLI ergonomics and descriptor rollout
planning lane.
