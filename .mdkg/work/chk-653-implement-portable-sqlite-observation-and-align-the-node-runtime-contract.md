---
id: chk-653
type: checkpoint
title: Implement portable SQLite observation and align the Node runtime contract
status: done
priority: 9
tags: []
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-86/node-portability/portable-source-progress.json, .mdkg/artifacts/goal-86/node-portability/runtime-qualification.json]
relates: []
blocked_by: []
blocks: []
refs: [goal-86, bug-60, task-842, task-841, test-489, goal-87, dec-98]
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [bug-60, task-842]
created: 2026-09-28
updated: 2026-09-28
---
# Summary

Bug60's SQLite observers now query a held-source image in Node memory instead
of macOS/Linux descriptor paths. Task842 aligns the runtime, CLI diagnostics,
package/lockfile, release CI and owned guidance on Node >=24.18.0 <25 with
explicit built-in capability checks. Unsupported execution refuses before
workspace discovery; help/version and option refusal remain available.

Bugs46/47 remain DEFERRED / UNRESOLVED under paused Goal87, not accepted or
fixed. Goal86 stays active and NOT_READY. Goal85 remains paused. No native
helper, graph migration, bundle refresh or publication was performed.

# Scope Covered

Canonical main at 6d23981e70bc68798def73c81b9cd5fa7bc9f3df;
owner mdkg-project-agent under the explicit Goal86 run. Entry custody was82
preserved dirty paths, nothing staged, no active runtime lease or mutation lock.
Source/tests, runtime metadata, release guidance/checks and necessary mdkg
evidence/projections are owned; the linked receipt names and hashes the paths.
No unrelated skill, Demo3, runtime DB or selected-goal bytes were absorbed.

# Decisions Captured

Dec98 governs. Node24.18.0 is the observed positive runtime; the current Node26
refuses unsupported execution. Higher majors are not inferred compatible from
their version number. Memory admission is not an OOM guarantee. Windows is
unqualified; macOS/Linux final installed evidence remains a required gate.
Task841's explicit operator-confirmed recovery is still unfinished: OS-bound
lock evidence remains in current source and is not claimed portable here.

# Implementation Summary

- All SQLite observational callers use the shared memory-only helper; ordinary
  writers remain distinct. Journal-state, identity, timestamp/size, path,
  SQL-write/ATTACH and source-custody refusal controls remain.
- Capability checks, low-memory/allocation/deserialization failures, generated
  columns and falsy thrown callbacks have direct regressions.
- Both CLI entrypoints reject unsupported Node/capabilities before root
  discovery, including explicit roots and MCP. No silent fallback exists.
- Runtime and release metadata/guidance agree. The Linux manual full stub
  still fails until exact portable installed-platform qualification exists;
  it no longer implies deferred native-helper fixes are 0.6.0 obligations.
- A stale prose-only smoke-loop gate was reproduced and corrected to require
  the actual SQLite backend assertion. The real installed loop smoke passes.

# Verification / Testing

- Failing-before memory-observer constructor trap:1/1 failed. Subsequent
  affected DB/index/snapshot/allocation suite:265/265 passed on Node24.18/macOS.
- Both unsupported-runtime entrypoint regressions failed before the guard.
  Runtime/nearby selection passed67/67; final runtime/CI/release contract
  selection passed27/27; public-release/goal-contract selection passed23/23.
- One234-file intermediate package (SHA256
  94970609a4f96f18879f04dd5a68e89b5061fdf85c4adc4ba337171c3d410995)
  passed8 installed CLI workflows,25 installed observer tests, and4 Node26
  refusal cases with complete unchanged graph inventories. Normal installed
  loop qualification produced the exact same tarball hash and passed all7
  seed templates using the SQLite backend, including pack/install lifecycle.
- Build, command/CLI parity, generated documentation/release notes,472 command
  examples, CI projection, static package checks,8 skill validations and diff
  checks passed. Final affected-subsystem and graph bookends are in the receipt.
- Initial exit-code expectation and a compiled-test rebuild overlap were
  corrected; failures remain recorded. Owned synthetic fixtures were removed.
- These are intermediate local proofs, not a final tarball seal, complete
  repository/coverage run, Test489 recovery, Linux or independent acceptance.
- Final combined affected-subsystem selection passes343/343 with zero failures
  or skips on unchanged runtime/source inputs (64,410.241791ms), covering
  DB/index/snapshot/allocation, runtime/CLI/doctor and release-contract callers.

# Known Issues / Follow-ups

- Next: Task841 portable explicit recovery, then Test489 and remaining final
  installed/platform/security/coverage/ladder/seal gates. Bug60 remains open.
- Selected achieved Goal73, runtime SQLite and Demo3 bundle hashes match the
  protected bookends. No standing lease or filesystem mutation lock remains.
- All work remains unstaged/uncommitted at this checkpoint; no remote action,
  push, tag, provider, deployment, blocked-context recovery or global change.
- Skill coverage reused: pursue-mdkg-goal, build-pack-and-execute-task,
  source-grounded-diagnose-and-fix and verify-close-and-checkpoint. Candidates:none.

# Links / Artifacts

- Portable source and runtime receipts in this checkpoint's artifact fields.
- Dec98, Goal87, Task841, Test489, Test487, Test488 and Task828–830.
