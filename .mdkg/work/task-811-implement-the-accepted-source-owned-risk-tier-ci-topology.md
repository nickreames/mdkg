---
id: task-811
type: task
title: Implement the accepted source-owned risk-tier CI topology
status: backlog
priority: 1
parent: goal-78
prev: spike-33
next: test-470
tags: [ci, smoke, release, workflow]
owners: []
links: []
artifacts: []
relates: [prop-9, loop-7]
blocked_by: [spike-33]
blocks: [test-470]
refs: [goal-78, prop-9, spike-33, test-464, chk-549, chk-550, chk-551]
context_refs: [goal-78, prop-9, spike-33, test-464, chk-549, chk-550, chk-551]
evidence_refs: [chk-549, chk-550, chk-551]
aliases: []
skills: [build-pack-and-execute-task, service-boundary-ownership-check]
created: 2026-07-25
updated: 2026-07-26
---
# Overview

Implement the measured, accepted risk-tier topology from `root:spike-33` and
the decision derived from `root:prop-9`. The source-owned smoke manifest is the
single membership truth for local prepublish, fast CI, and full-release shards.

# Acceptance Criteria

- The existing `scripts/smoke-manifest.json` is extended—never replaced by a
  second catalog—to expand all 47 aliases into 46 canonical identities and
  record domain, prerequisites, profile, timeout, fast-tier membership, and
  full-release shard.
- Local prepublish and workflow topology consume the same manifest or are
  deterministically checked against it.
- The fast job runs on Node `24.15.0` and `24.x` for PR, `main` push, and
  manual triggers.
- The fast job performs explicit bootstrap/build, complete enforced coverage,
  existing CLI/docs/security/graph/readiness gates, the accepted curated smoke
  set, and final tracked-drift proof.
- The full release tier is manual and exact-SHA, validates the supplied SHA,
  verifies the detached checkout resolves to that SHA before release work,
  uses Node `24.15.0`, runs all 46 canonical smoke identities exactly once
  across accepted shards, uploads independent evidence, and requires one
  aggregate success job.
- Job DAG, shard membership/load, timeouts, concurrency/cancellation,
  artifact names and retention, `if: always()` failure evidence, immutable
  tarball producer/verified consumers, profile caching, and final drift proof
  match the accepted decision.
- A source-owned structured validator parses or generates workflow semantics;
  four substring assertions are not sufficient.
- Remote provider execution and branch-protection changes are not required or
  claimed.

# Files Affected

- existing `scripts/smoke-manifest.json` and validation/runner helpers
- `package.json` only for manifest-backed commands
- `.github/workflows/release-readiness.yml`
- focused workflow/topology tests
- ignored local receipt paths if needed

# Implementation Notes

- Do not duplicate the smoke catalog in JavaScript, package scripts, workflow
  YAML, and tests.
- Preserve Goal 1's one-tarball and profile-build contracts.
- Default to deterministic workflow generation/checking with no new dependency
  or registry access. A maintained YAML parser may be used only if the accepted
  decision chooses it and separate dependency/registry authority is granted;
  never build a partial parser.
- Treat Node `24.15.0` as an exact source-owned workflow requirement. Local
  source validation is not evidence that this exact runtime or the provider
  workflow executed.
- Provider artifacts use `if: always()` where failure evidence is required and
  fail when an expected local evidence file is missing.

# Test Plan

- Run focused alias expansion, manifest schema, duplicate/cycle, tier, shard,
  runtime, timeout, artifact, and aggregate-gate tests.
- Remove one alias, canonical identity, runtime row, shard, artifact, or drift
  gate in fixtures and prove the validator fails with its identity.
- Run focused manifest, validator, workflow-contract, and negative-fixture
  checks only for this node.
- Defer the single shared `ci:release` and optimized `prepublishOnly` runs until
  all five Goal 78 test nodes are done; the final goal-closeout checkpoint owns
  those receipts and there is no automatic retry.
- Run graph validation and Git hygiene checks without invoking a provider.

# Links / Artifacts

- `root:goal-78`
- `root:prop-9`
- `root:spike-33`
- `root:test-470`
- `root:test-463`
- `root:test-464`
