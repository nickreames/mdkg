---
id: chk-594
type: checkpoint
title: Record installed goal routing and unresolved migration scale timing
checkpoint_kind: test-proof
status: done
priority: 9
tags: []
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-84/bug-7-scale-goal.json]
relates: [bug-7]
blocked_by: []
blocks: []
refs: [goal-83, goal-84, task-826, task-828]
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [bug-7, test-481, test-482]
created: 2026-09-09
updated: 2026-09-09
---

# Summary

Installed controls verify lifecycle and limit behavior, while representative
migration scale remains unqualified. Bug7 and test481/482 stay open. This is an
audit milestone, not release acceptance or a completed scale test.

# Scope Covered

- scripts/installed-scale-goal.js: installed CLI only, no product-source imports.
- 15 control cases and 262 commands on each of Node 24.15.0, 24.18.0 and 26.0.0.
- Four 2000-node attempts, including one isolated Node26 run, timed out during
  migration apply at the explicit 180-second harness bound.

## Changed Surfaces

One reusable fixture harness, its sanitized evidence artifact, bug7, goal84,
test481, test482 and this checkpoint: seven explicit commit paths. No product
runtime, instructions, package metadata or protected bundle changes.

# Implementation Summary

Added an installed-only qualification harness and recorded passing controls plus
an incomplete representative migration run. No runtime behavior was changed.

# Decisions Captured

No new product SLA or compatibility decision. Smaller passing controls do not
replace the 2000-node target. Do not remove custody checks for a green result.
A longer diagnostic allowance must be recorded explicitly. Publication remains
separately gated; goal evaluation/routability does not verify artifact bytes.

# Test Proof

- Warm/cold, JSON/SQLite and legacy/v2 reads preserve whole fixtures.
- Linked packs contain target and neighbor; 20000 valid events are exercised.
- Default node/event limits and actual 2049-commit history fail closed at their
  recorded guards. The 2048-commit acceptance boundary is not fully exercised.
- Task start/done/checkpoint and goal claim/done preserve identity and Git index.
- Both publication gate orders and reopened dependencies block appropriately.
- No required-check execution, selection mutation or publication occurs.
- Small control matrices pass on all three runtimes; the 2000-node v2 matrix is
  explicitly incomplete. Isolated timeout left 1086/2000 task headers migrated.

# Verification / Testing

Node syntax check, CLI built parity, documentation parity and all 26 public
release-contract tests pass. Full/changed-only graph, SQLite and diff checks
pass at milestone closeout; only three preserved stale-subgraph warnings remain
in full validation. The preceding 1357-test runtime
proof is unchanged-input context, not a newly executed full suite for this
milestone; no complete release ladder or performance SLA is claimed.

Independent read-only harness review found no remaining bounded finding at
SHA-256 c510d27f3c51277cba42a81d87789471ec8bb714d4820e9668eba11590754f71.
Harness corrections and all case/report hashes are in the artifact. They are
not counted as product defects or new Standard security findings.

# Known Issues / Follow-ups

Source performs a complete custody scan before every graph write. This is
quadratic traversal work; exact cost attribution still needs profiling.
Continue bug7/large-migration-custody-scaling with measured per-phase costs and
safe optimization that retains containment, dependency, control, current-byte
and unknown-path checks. Existing old-writer, killed-writer and public-bundle
policy questions remain unaccepted. Final security, release guidance, full
ladder and artifact sealing also remain open.

# Custody and Authority

Before commit: main 5c4f15f065d4a150d8b9ad3230cfee3d4c7e1fee, 36 ahead and
0 behind cached origin/main; no live remote verification. The nine pre-existing
dirty paths remain excluded: SQLite plus the separate eight bug17 paths. Protected
hashes match bug34's receipt. Runtime leases remain released; queues empty.
No canonical migration, lock takeover, bundle/subgraph refresh, remote Git,
publication, tag, provider/deployment or root/sibling change.

Successful final control runs removed nine owned fixture directories each.
A further 22 failed harness-development fixtures were removed; the four large
partial migrations and exact journals, scripts and diagnostics remain private
for investigation. No unknown/user-owned files were deleted.

Skills reused: goal pursuit, execution pack, context grounding and checkpoint/
Git verification. No skill authoring or new candidates.

# Links / Artifacts

.mdkg/artifacts/goal-84/bug-7-scale-goal.json contains exact hashes, limitations,
reproduction inputs, review and private fixture custody. Final outcome: NOT_READY.
