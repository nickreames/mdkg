---
id: bug-25
type: bug
title: Invalidate site build caches on external source dependencies
status: backlog
priority: 1
tags: [release-0.6.0, behavioral-audit]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-83/task-824-behavioral-audit.json]
relates: [task-824, goal-84, goal-83]
blocked_by: []
blocks: []
refs: []
context_refs: [goal-84, goal-83, task-824]
evidence_refs: []
aliases: []
skills: []
created: 2026-09-08
updated: 2026-09-08
---
# Overview

Release-ladder site cache keys omit imported source outside the site root. Impact: a later source revision can receive checks against stale build output. Functional severity: medium; qualification-evidence integrity blocker, not a shipped runtime vulnerability.

Owner: mdkg-project-agent. Context: root:task-824 under root:goal-83; remediation belongs to root:goal-84. Publication blocker, not a new security advisory. No source fix or verification is claimed at intake.

Allowed future remedy: named source paths, directly required helpers, regression tests, and sanitized mdkg evidence under the approved local qualification contract. Preserve numeric aliases, explicit v2 adoption, user-authored content, Git staging, selected Goal 73, runtime DB and protected bundles. No canonical migration, bundle refresh, remote/provider action, publication or unrelated refactoring. Stop on ownership collision, moving baseline or a materially new decision. Require failing-before/passing-after installed evidence and independent root:task-828 verification.

# Reproduction Steps

Use the exact scripts/npm-smoke-proxy.js with a synthetic mdkg-dev owner and external presentations/example/site/src/Portable.astro. Fake local npm writes that dependency into dist. First build is a miss. Change only the external dependency; second invocation reports cache_hit=true and returns version-one output instead of version-two. Real source imports across this boundary in mdkg-dev/src/components/demos/Demo3Output.astro; no historical application payload was executed.

# Expected vs Actual

Every accepted site cache key binds all actual local source dependencies, or safely declines reuse when completeness is unknown. Actual: external dependency changes do not invalidate the cache.

# Suspected Cause

runSiteBuild hashes ownerRoot plus release/ and root package.json, but not the external component imported by the site. Existing tests exercise only within-owner changes.

# Fix Plan

Use an explicit verifiable dependency closure or conservative complete input manifest. Preserve immutable artifact reuse, declared profiles, runtime/lockfile separation and offline validation. Do not solve this by editing public Demo 3 copy or rebuilding protected graph bundles.

Allowed paths: scripts/npm-smoke-proxy.js, scripts/smoke-manifest.json and directly required release-ladder helpers; tests/release-ladder.test.ts. Site/demo source is read-only evidence.

Affected-version assessment: Current repository release infrastructure; script is absent from cached 0.5.2 package. Classify as release-chain validation gap, not an npm runtime defect.

# Test Plan

Unchanged cache hit; external direct/transitive source edits; added/removed dependency; profile/runtime/lockfile differences; unsupported dependency fail-closed behavior; no stale acceptance receipts. Use synthetic source and local fake builder for unit regression, followed by authorized real local ladder validation.

Acceptance: all reproduced failures corrected with passing controls preserved; root:test-483 and root:task-828 verify the exact installed candidate. No missing proof is a waiver.

# Links / Artifacts

- .mdkg/artifacts/goal-83/task-824-behavioral-audit.json
- root:test-483; root:task-824; root:task-828; root:goal-84
- Initial candidate SHA-256: 3238663f76882f094cfd1e9c86abbd43e057aa165ec69099a976949f9d011c05 (development metadata 0.5.2; not a 0.6.0 seal).
