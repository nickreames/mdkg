---
id: bug-30
type: bug
title: Make ordinary test execution discover every compiled test family
status: done
priority: 1
tags: [release-0.6.0, validation-infrastructure]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-84/bugs-30-31-verification.json]
relates: [goal-83, goal-84, bug-25, task-829]
blocked_by: [bug-31]
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

Goal: make the ordinary test command execute the same complete source/compiled
test inventory as the existing coverage contract, without enabling coverage or
changing coverage thresholds. Owner: mdkg-project-agent, under goal-84.

Context: bug-25 verification exposed a release-validation evidence gap. At
98e60c3c, 122 compiled TypeScript files exist but /bin/sh expansion of
dist/tests/**/*.test.js supplies only 114. Eight root-level test files are
omitted, including release-ladder, coverage, CI topology and skill projections.
Medium functional severity: false completeness of ordinary validation, not a
shipped CLI runtime vulnerability. The release coverage runner already uses
recursive discovery; do not imply it has this same omission.

# Reproduction Steps

1. Recursively enumerate dist/tests for .test.js and compare it with /bin/sh
   expansion of the exact package.json test:built glob, without running tests.
2. Observe omitted root files: ci-topology, coverage-contract,
   dependency-boundary, harness-guidance, portable-skill-bodies,
   public-skill-projection, release-ladder and test-ci-audit-template.

# Expected vs Actual

- expected: every compiled test and source MJS test executes exactly once;
  missing/orphaned compiled tests fail before execution; failures propagate.
- actual: shell-depth-dependent enumeration skips whole test families.

# Suspected Cause

The npm script delegates discovery to a shell glob. Ordinary execution does
not reuse scripts/coverage-contract.js discoverTestContract.

# Fix Plan

Reuse the existing recursive discovery contract in a small ordinary test
runner. Pass explicit file arguments directly to Node, with no shell expansion.
Preserve standalone test:public-release, test builds and coverage gates. Update
the focused test guide to describe actual ordinary execution.

Allowed: package.json scripts only, scripts/test-built.js, existing discovery
helper only if strictly necessary, tests/test-built.test.ts, tests/README.md,
and scoped mdkg evidence/projections. No dependencies/version changes, runtime
features, coverage threshold/denominator changes, bundles, canonical migration,
provider/remote actions or publication. Local reviewed commits are authorized
by the existing goal-83/84 contract. Preserve partial bug-17 and SQLite custody.
Stop for unknown ownership, baseline movement or new policy decisions.

# Test Plan

Before/after package-entry regression; temporary root/deep compiled tests and
MJS tests execute once, including paths with spaces; missing and orphaned
compiled inputs refuse before execution; failing tests return nonzero. Run
focused tests on Node 24 and 26, then the complete corrected ordinary suite,
CLI/docs/graph/SQLite/diff checks. Never convert newly surfaced failures to
skips: qualify them as blockers if they need separate remedies. Task-828 and
task-829 independently recheck inventory parity on the final candidate.

Done when: one complete ordinary runner, passing regression evidence, exact
inventory receipt and local commit; final release coverage remains unqualified.

# Links / Artifacts

- root:bug-25; root:goal-84; root:task-828; root:task-829
- package.json test:built and scripts/coverage-contract.js discoverTestContract
- New skill candidates: none; this is enforced validation behavior.
