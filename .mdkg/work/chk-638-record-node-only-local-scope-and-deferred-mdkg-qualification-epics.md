---
id: chk-638
type: checkpoint
title: Record Node-only local scope and deferred mdkg qualification epics
status: done
priority: 9
tags: [planning, readiness, local-only]
owners: [mdkg-project-agent]
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [dec-97, goal-86, goal-85, chk-637, task-840, epic-256, epic-257, bug-46, bug-47, bug-60, test-487, task-838, task-839]
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: []
created: 2026-09-21
updated: 2026-09-21
---
# Summary

Documented Nick's explicit Node.js-only/local-only decision in Dec97. Created
future backlog Epics256/257 for Rust filesystem authority and GitHub Actions
Linux qualification. Goal86 stays paused and Goal85 stays paused/NOT_READY.
READY_TO_RESUME_LOCAL_WORK does not mean ready to close or publish Goal86.

# Scope Covered

Planning-only authority: new decision, two future epics, this checkpoint and
narrow current-routing updates on Goal86, Bugs46/47 and Test487, plus required
indexes/events. No source/test/skill changes, execution claims, scans, blocked
context, native implementation, workflow/CI edits, services or remote operations.

HEAD c10113489381badf2845fc378c49b317376f953e, main, unchanged; cached upstream
last measured67 ahead/0 behind, not reverified remotely. Prior Bug60 patch,
Task840 canonical/public/mirror skill changes, Chk637 and generated SQLite
custody remain unstaged and uncommitted. No staging or commit this pass.

# Decisions Captured

- Dec97: Node.js/local-only now, deferred native/hosted work, selective checks.
- Dec96 release gates are not silently removed. No Rust fallback or hosted
  Linux authority is inferred from backlog records. No confirmed finding waived.
- Epics are not added to Goal86 scope_refs. Future work requires a qualified
  execution assignment and any separate workflow/remote/native-distribution authority.

# Implementation Summary

- Epic256 is a narrow filesystem-authority successor, not Epic34's older database
  sidecar idea, a full rewrite or duplicate Epic241 containment implementation.
- Epic257 reuses Test487 and existing CI/ladder contracts; it does not duplicate
  qualification tests or assume Docker/Lima availability establishes execution.
- Bugs46/47 explicitly retain unresolved security status. Test487 explicitly
  retains missing Linux proof. Historical local-executor preference is superseded.
- Goal86 next local lanes: Bug60 focused correction/acceptance, Task838 safe
  fixtures/evidence, then Task839 preparation. Full checks remain readiness gates.

# Verification / Testing

Validate the mdkg graph, new references and changed paths; regenerate only required
indexes and run git diff --check. No runtime suite is warranted for this planning
pass under verify-close-and-checkpoint0.3.0. Preserve Goal73/runtime/Demo3 hashes
and all paused source/test bytes. No readiness percentage is inflated by creating
future epics: Goal86 remains26/47 scoped nodes done (55% checklist measure).

Executed validation: required index refresh, full graph validation and changed-only
validation passed, zero errors. Full validation retains three existing stale
subgraph warnings; changed-only has zero warnings. git diff --check passed.
All nine paused Bug60 source/test hashes match chk637; the three updated skill
projection sets still match. Selected Goal73/runtime/Demo3 hashes are unchanged:
f996926a868b7c06fb29311fb69c48d862e9dc354404f777df93e1c5443b07ab,
b1f2bfb3c9ebd254d520eb7f47c12c2fa18daf691056fe97ba1890f94d013a81,
741b4644da1d3d1ff3bbd4b9240e22870609f015e49e28170a91748ab024570b.
Nothing staged; HEAD unchanged. No source tests or hosted checks were launched.

# Known Issues / Follow-ups

- Bugs46/47, Linux proof, final independent current-source review, full release
  ladder and exact candidate sealing remain open. No new audit or blocked scan
  recovery was attempted; retain the approved evidence boundary.
- The goal cannot meet its unchanged full-release condition solely by finishing
  independent local lanes. A different0.6.0 acceptance boundary would require an
  explicit later decision, not automatic waiver by deferral.
- Recommend resume local work only when Nick requests it. Preserve one writer,
  custody checks, focused tests and explicit progress/stop receipts.

# Links / Artifacts

- Dec97; Epics256/257; Goal86; Chk637; Task840; Bugs46/47; Test487.
- Skills used: select-work-and-ground-context, service-boundary-ownership-check,
  verify-close-and-checkpoint. New skill candidates:none; no skill edits this pass.
- Owner: mdkg-project-agent. No persistent writer lease acquired. No changes to
  selected state, protected runtime/bundles, consuming projects or public state.
