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
refs: [goal-78, prop-9, spike-33, test-464]
context_refs: [goal-78, prop-9, spike-33, test-464]
evidence_refs: []
aliases: []
skills: [build-pack-and-execute-task, service-boundary-ownership-check]
created: 2026-07-25
updated: 2026-07-25
---
# Overview

Implement the measured, accepted risk-tier topology from `root:spike-33` and
the decision derived from `root:prop-9`. The source-owned smoke manifest is the
single membership truth for local prepublish, fast CI, and full-release shards.

# Acceptance Criteria

- A machine-readable manifest expands all 47 aliases into 46 canonical
  identities and records domain, prerequisites, profile, timeout, fast-tier
  membership, and full-release shard.
- Local prepublish and workflow topology consume the same manifest or are
  deterministically checked against it.
- The fast job runs on Node `24.15.0` and `24.x` for PR, `main` push, and
  manual triggers.
- The fast job performs explicit bootstrap/build, complete enforced coverage,
  existing CLI/docs/security/graph/readiness gates, the accepted curated smoke
  set, and final tracked-drift proof.
- The full release tier is manual and exact-SHA, uses Node `24.15.0`, runs all
  46 canonical smoke identities exactly once across accepted shards, uploads
  independent evidence, and requires one aggregate success job.
- Workflow timeouts, artifacts, retention, and shard names match the accepted
  decision.
- A source-owned structured validator parses or generates workflow semantics;
  four substring assertions are not sufficient.
- Remote provider execution and branch-protection changes are not required or
  claimed.

# Files Affected

- source-owned smoke topology manifest and validation/runner helpers
- `package.json` only for manifest-backed commands
- `.github/workflows/release-readiness.yml`
- focused workflow/topology tests
- ignored local receipt paths if needed

# Implementation Notes

- Do not duplicate the smoke catalog in JavaScript, package scripts, workflow
  YAML, and tests.
- Preserve Goal 1's one-tarball and profile-build contracts.
- Choose a maintained YAML parser dependency or deterministic workflow
  generation/checking in the accepted decision; do not build a partial parser.
- Provider artifacts use `if: always()` where failure evidence is required and
  fail when an expected local evidence file is missing.

# Test Plan

- Run focused alias expansion, manifest schema, duplicate/cycle, tier, shard,
  runtime, timeout, artifact, and aggregate-gate tests.
- Remove one alias, canonical identity, runtime row, shard, artifact, or drift
  gate in fixtures and prove the validator fails with its identity.
- Run local fast-tier commands and the optimized full local ladder once.
- Run `ci:release`, graph validation, and Git hygiene checks without invoking a
  provider.

# Links / Artifacts

- `root:goal-78`
- `root:prop-9`
- `root:spike-33`
- `root:test-470`
- `root:test-463`
- `root:test-464`
