---
id: bug-31
type: bug
title: Align startup and skill regression gates with compact authority-safe discovery
status: done
priority: 1
tags: [release-0.6.0, validation-infrastructure]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-84/bugs-30-31-verification.json]
relates: [goal-83, goal-84, goal-81, bug-30]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-09-09
updated: 2026-09-09
---
# Overview

Goal: correct two stale regression contracts exposed by complete test discovery,
preserving stronger checks for focused bootstrap and explicit authority.
Owner mdkg-project-agent. Context: goal-84, bug-30, achieved goal-81 and dec-93.
These are validation-infrastructure defects, not new runtime vulnerabilities.

# Reproduction Steps

Run the previously omitted root-level harness-guidance and portable-skill-bodies
tests against 98e60c3c. One expects a verbose legacy loop section in the compact
public router and a root AGENT_START.md in fresh compact init. The other expects
mdkg archive compress --all in a patch-only skill. Both fail. Full initial
bug-30 run: 1209 tests, 1205 pass, four fail; two failures are these inherited
assertions and two are the separately corrected nested fixture runner.

# Expected vs Actual

- expected: thin root adapters route to focused .mdkg guidance, loop procedures
  remain discoverable through canonical skills, and patch-only work hands
  archive/bundle mutation to separately authorized orchestration.
- actual: stale tests require duplicating the old handbook and unscoped archive
  commands instead of validating the accepted successor contracts.

# Suspected Cause

Goal-81 changed guidance layout/authority but ordinary shell test discovery
excluded these regression files. Exact public/native skill parity itself passes.

# Fix Plan

Allowed: tests/harness-guidance.test.ts, tests/portable-skill-bodies.test.ts,
directly required test helpers and owned mdkg evidence/projections. No edits
to source implementation, startup instructions, skills, native mirrors, public
assets or accepted decisions. Reuse existing loop-skill procedure semantics;
assert compact adapters/router/resource links and negative missing-guidance
cases, while preserving legacy repository startup coverage and skill parity.
Replace the stale patch-only archive command requirement with positive separate-
authority checks and negative direct-mutation checks; do not simply delete gates.

Existing goal-83/84 local tests/evidence/commit authorization applies. Preserve
partial bug-17 and bug-30 work. No canonical migration, bundles, remote Git,
provider/deployment, publication or history action. Stop on new decisions,
ownership collision, source movement or required skill/source authoring.

# Test Plan

Reproduce both stale assertions; run focused tests on Node 24.18.0 and 26.0.0.
Remove each required compact routing/loop/authority identity in synthetic text
and require failure. Preserve exact canonical/native/public membership and
customization controls. Run all 126 discovered test files via bug-30's runner,
plus CLI/docs/graph/SQLite/diff checks. No skips or threshold changes.

Done when: intended contracts pass with negative controls and the full ordinary
suite is complete. Independent task-828 and final release ladder remain open.

# Links / Artifacts

- root:dec-93; root:goal-81; root:bug-30; root:task-828; root:task-829
- Original full-run output SHA-256: c8bd4b752ccf6eeb36256974e439cb312a3f835f6b7716d0be88481a44832132.
- Skill candidates: none. This work validates existing skills; no authoring.
