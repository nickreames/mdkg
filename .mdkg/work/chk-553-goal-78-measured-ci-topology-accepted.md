---
id: chk-553
type: checkpoint
title: Goal 78 measured CI topology accepted
checkpoint_kind: audit
status: done
priority: 9
tags: []
owners: [root]
links: []
artifacts: [.mdkg/artifacts/goal-78/ci-topology-plan.json, .mdkg/artifacts/goal-78/ci-topology-measurements.json]
relates: [spike-33]
blocked_by: []
blocks: []
refs: [goal-78, prop-9, dec-91, spike-33, task-811, test-470, chk-549, chk-550, chk-551]
context_refs: [goal-78, prop-9, dec-91, chk-549, chk-550, chk-551]
evidence_refs: [chk-549, chk-550, chk-551]
aliases: []
skills: []
scope: [spike-33]
created: 2026-07-26
updated: 2026-07-26
---
# Summary

Accepted Decision 91 after proving exact 13-fast and five-shard 46-canonical membership against Goal 77 measurements; no workflow, provider, dependency, or selected-goal mutation occurred.

# Scope Covered

- Completed node: spike-33 (Bind measured local release receipts to the risk-tier CI topology)
- Node type: spike
- Checkpoint source: `mdkg task done --checkpoint`

## Changed Surfaces

- Completed `root:spike-33`.
- Added accepted `root:dec-91`.
- Added one compact machine-readable topology plan; no functional surface
  changed in the spike.

## Boundaries

- in scope: local source inspection, measured topology analysis, mdkg decision,
  artifact, spike completion, and checkpoint evidence
- out of scope: workflow, package script, smoke runner, dependency, provider,
  selected-goal, release, and publication mutations
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded

# Decisions Captured

- `root:dec-91` accepts 13 fast canonical smokes measured at `52.097s`.
- Five named full shards partition all 46 canonical smokes exactly once with
  measured loads from `23.179s` to `39.356s`.
- Deterministic workflow generation/checking is selected with no new YAML
  parser or dependency.
- Full release is manual exact-SHA with detached-checkout verification; local
  source proof does not claim provider execution or exact Node `24.15.0`
  execution.

# Implementation Summary

- Bound Goal 77 timing, coverage, immutable package, consumer, and profile
  evidence to the accepted topology.
- Recorded exact fast membership, shard membership/load, job DAG, runtimes,
  triggers, timeouts, artifact names/retention, failure evidence,
  concurrency/cancellation, profile cache policy, and aggregate gate.

# Verification / Testing

## Command Evidence

- topology-integrity script: 47 aliases, 46 unique canonical identities, 13
  fast identities, five complete/disjoint shards, and all measured durations
  matched
- `mdkg format --headings --dry-run`: zero files
- `mdkg validate --changed-only --json`: zero warnings and errors
- bounded full validation: zero errors and only the two accepted stale-subgraph
  warnings
- `mdkg show root:dec-91 --json`: accepted decision, owner, refs, and artifacts
  resolved
- `git diff --check`: passed
- `mdkg goal current --json`: selected achieved `root:goal-73` unchanged

## Pass / Fail Status

- status: done

## Known Warnings

- `demo_agentic_coding` and `template_mdkg_dev` retain the existing stale
  bundle-age warnings; refresh remains outside Goal 78.

# Known Issues / Follow-ups

- Implement the accepted source-owned topology in `root:task-811`.
- Prove positive and negative contract behavior in `root:test-470`.

## Follow-up Refs

- `root:task-811`
- `root:test-470`

# Links / Artifacts

- .mdkg/artifacts/goal-78/ci-topology-measurements.json
- .mdkg/artifacts/goal-78/ci-topology-plan.json
- `root:dec-91`

# Raw Content Safety

- This checkpoint stores the completion summary and artifact refs, not raw prompts, secrets, payloads, or bulky traces.
