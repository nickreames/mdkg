---
id: task-815
type: task
title: Author a proceed defer or reject Remotion decision
status: done
priority: 1
epic: epic-255
prev: test-473
tags: [remotion, presentation, research, decision]
owners: [root-integration-owner]
links: []
artifacts: [artifact://remotion/decision-receipt, .mdkg/artifacts/goal-79/remotion/decision-receipt.md]
relates: [goal-79]
blocked_by: [test-473]
blocks: []
refs: [goal-79, epic-255, spike-35, task-814, test-473, task-519, test-248, ai_native_sdlc_demo:goal-3, dec-92]
context_refs: [goal-79, epic-255, spike-35, task-814, test-473, task-519, test-248, ai_native_sdlc_demo:goal-3, dec-92]
evidence_refs: [spike-35, task-814, test-473, chk-561, chk-562]
aliases: []
skills: [service-boundary-ownership-check, verify-close-and-checkpoint]
created: 2026-07-26
updated: 2026-07-27
---
# Overview

Resolve dec-92 from the accepted comparison, rubric, and feasibility receipt so the optional Remotion lane has a durable proceed, defer, or reject answer.

# Acceptance Criteria

- dec-92 cites spike-35, task-814, and every test-473 result.
- The outcome is exactly proceed, defer, or reject with rationale, confidence, unresolved risks, owner, and review trigger.
- Proceed names one scene that materially benefits from motion and records satisfied offline rendering, captions, static fallback, license, dependency, accessibility, performance, no-secret, and retention boundaries.
- The decision separately selects presentation-only, canonical-site candidate requiring another decision, or no canonical-site usage.
- Defer/reject keeps goal-80 paused and empty; proceed still requires a separate scope-population and activation pass.
- No implementation, package, deck, site, Git publication, or provider work occurs.

# Files Affected

- `.mdkg/design/dec-92-select-whether-to-adopt-remotion-for-offline-presentation-and-mdkg-dev-storytell.md`
- Root mdkg evidence/checkpoint surfaces only.

# Implementation Notes

- Prefer the simplest medium that satisfies the narrative need.
- Do not use sunk-cost or demo novelty as proceed evidence.

# Accepted Decision

`root:dec-92` is accepted as **defer**, with high confidence and no waiver.

Evidence:

- spike-35 found Remotion architecturally feasible but not adoption-ready;
- task-814 froze the candidates, gates, score, and outcome algorithm before
  validation;
- test-473 completed every case with 2/12 proceed gates passing, ten failing for
  proceed, and a Remotion readiness score of 32.0/100;
- the accepted PowerPoint/static baseline remains editable, QA-reviewed,
  offline-rehearsed to 33:55, and backed by a retained still; and
- root/docs/mdkg-dev package and lock hashes remain unchanged with no Remotion
  dependency.

The sole future pilot candidate is reusable source goal -> specialized goal ->
accepted evidence. A new explicit pass must establish legal entity/use,
then-current license/version, isolated package/browser authority,
network-denied render and event playback, captions/transcript, accessibility,
performance, reproducibility/retention, no-secret scanning, and human A/B
benefit.

The future boundary is presentation-only. Canonical mdkg.dev receives no
Remotion dependency, Player, runtime, generated asset, or publication authority
by implication. Any public asset is a distinct task-519/test-248 decision.

Goal 80 remains paused, childless, unselected, and empty. This task performed no
install, render, code, deck, site, publication, provider, or remote Git action.

The complete decision receipt is
`.mdkg/artifacts/goal-79/remotion/decision-receipt.md`.

# Test Plan

- dec-92 has one unambiguous outcome and independently traceable evidence.
- Goal-80 activation conditions can be evaluated without interpretation.
- Root changed-only and bounded full validation plus `git diff --check` pass.
- Accepted result: `defer`; Goal 80 stays paused with `scope_refs: []`.

# Links / Artifacts

- goal-79
- test-473
- dec-92
- goal-80
- `.mdkg/artifacts/goal-79/remotion/decision-receipt.md`
