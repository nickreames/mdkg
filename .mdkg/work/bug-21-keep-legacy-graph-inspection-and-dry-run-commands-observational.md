---
id: bug-21
type: bug
title: Keep legacy graph inspection and dry-run commands observational
status: done
priority: 1
tags: [release-0.6.0, behavioral-audit]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-83/task-824-behavioral-audit.json, .mdkg/artifacts/goal-84/bug-21-verification.json]
relates: [task-824, goal-84, goal-83]
blocked_by: []
blocks: []
refs: []
context_refs: [goal-84, goal-83, task-824]
evidence_refs: []
aliases: []
skills: []
created: 2026-09-08
updated: 2026-09-09
---
# Overview

Legacy graph inspection unexpectedly persists missing caches, including explicitly dry-run pack requests. Impact: inspection can dirty read-only or shared checkouts and fail on read-only storage. Functional severity: medium; release-blocking observational contract violation.

Owner: mdkg-project-agent. Context: root:task-824 under root:goal-83; remediation belongs to root:goal-84. Publication blocker, not a new security advisory. No source fix or verification is claimed at intake.

Allowed future remedy: named source paths, directly required helpers, regression tests, and sanitized mdkg evidence under the approved local qualification contract. Preserve numeric aliases, explicit v2 adoption, user-authored content, Git staging, selected Goal 73, runtime DB and protected bundles. No canonical migration, bundle refresh, remote/provider action, publication or unrelated refactoring. Stop on ownership collision, moving baseline or a materially new decision. Require failing-before/passing-after installed evidence and independent root:task-828 verification.

# Reproduction Steps

Initialize a synthetic legacy graph with two tasks, index it, copy it per case and remove only the fixture .mdkg/index. On JSON and SQLite backend configurations run show task-1 --json, list --json, search Alpha --json, next, and pack task-1 --dry-run --skills none. Compare every file hash before/after. All ten requests exit 0 and create .mdkg/index/global.json. Corresponding ten v2 controls change no files.

# Expected vs Actual

Inspection and dry-run commands derive missing information without persisting it; explicit index remains the cache-writing command. Actual: legacy inspection writes a missing global cache.

# Suspected Cause

src/graph/index_cache.ts: loadIndex restricts inspection mode to format_version === 2 and otherwise defaults persistReindex to true. Command callers already request inspection. Imported-cache persistence needs the same review.

# Fix Plan

Separate observational persistence policy from v2 ambiguity semantics. Audit all inspection callers and imported indexes; preserve intended explicit indexing and stale-cache/error policies. Do not hide unsafe paths or weaken containment.

Allowed paths: src/graph/index_cache.ts; src/commands/show.ts, list.ts, search.ts, next.ts, pack.ts; directly required cache helpers and tests.

Affected-version assessment: Confirmed current candidate. Cached published 0.5.2 dist/graph/index_cache.js has the same persistReindex default pattern; no published-runtime reproduction yet. Verify exact affected command behavior before claiming a published regression.

# Test Plan

Missing and stale caches on both backends and legacy/v2; imported snapshots; explicit auto_reindex=false; --no-cache/--no-reindex; read-only fixture permissions where supported; all five commands; unchanged source, Git index, selection and runtime state. Confirm explicit index still builds valid equivalent caches.

Acceptance: all reproduced failures corrected with passing controls preserved; root:test-483 and root:task-828 verify the exact installed candidate. No missing proof is a waiver.

# Links / Artifacts

- .mdkg/artifacts/goal-83/task-824-behavioral-audit.json
- root:test-483; root:task-824; root:task-828; root:goal-84
- Initial candidate SHA-256: 3238663f76882f094cfd1e9c86abbd43e057aa165ec69099a976949f9d011c05 (development metadata 0.5.2; not a 0.6.0 seal).

## 2026-09-09 Local Fix Verification

Locally fixed: inspection suppresses node/import cache persistence for legacy
and v2 graphs independently of v2 ambiguity handling. Next explicitly disables
persistence; pack skill discovery does likewise, including --dry-run with auto
skills. Five affected commands now respect configured auto_reindex=false.
Explicit --no-cache still derives in memory; explicit index remains writable.

The original statement that all five callers requested inspection was too broad:
next did not. Source tracing and tests cover that separate call site. Automatic
skill inclusion was also found to write skills.json even on v2; it is covered by
this same observational fix, not a duplicate finding.

Proof: `.mdkg/artifacts/goal-84/bug-21-verification.json`. A prepatch 20-case
matrix had 14 failures/6 controls passing. The expanded installed matrix passes
23/23 on Node 26.0.0 and 23/23 on Node 24.18.0 with no skips. Cached published
0.5.2 matches recorded registry integrity and reproduces writes in all 24
missing/stale-cache cases; this is verified affected-version behavior, not a
source-only inference. Read-only POSIX storage, imported graph ambiguity,
JSON/SQLite caches, explicit indexing and checkout-byte preservation are covered.

Full tests: 1059 source and 26 release/security-contract tests pass. Nineteen
focused pack/show controls, build, CLI/docs, full/changed graph, SQLite verify
and diff checks pass. Three existing fixtures were changed to index explicitly
instead of relying on reads to write; their behavior assertions are unchanged.
The full graph retains three known stale-subgraph age warnings. No source
thresholds or validators were weakened.

Final independent test-483/task-828 acceptance, exact Node 24.15.0, full installed
families, coverage ladder and release seal remain open. Package metadata remains
development 0.5.2. Protected selected/runtime/Demo 3 bytes and the partial bug-17
patch are unchanged. No public-bundle decision inferred; no remote or publication.
Skills: pursue-mdkg-goal, build-pack-and-execute-task,
source-grounded-diagnose-and-fix, verify-close-and-checkpoint. Candidates: none.
