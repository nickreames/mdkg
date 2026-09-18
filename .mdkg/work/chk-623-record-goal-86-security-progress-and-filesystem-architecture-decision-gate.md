---
id: chk-623
type: checkpoint
title: Record Goal 86 security progress and filesystem architecture decision gate
checkpoint_kind: handoff
status: done
priority: 9
tags: [release-0.6.0, decision-gate]
owners: []
links: []
artifacts: [.mdkg/artifacts/goal-86/bug-46-investigation.json]
relates: []
blocked_by: []
blocks: []
refs: [goal-86, goal-84, bug-44, bug-45, bug-46, bug-47, task-837, task-828, test-487]
context_refs: [goal-86, goal-84]
evidence_refs: [chk-620, chk-621, chk-622]
aliases: []
skills: []
scope: [bug-46]
created: 2026-09-18
updated: 2026-09-18
---
# Summary

Goal86 continues core0.6.0 work with broad documentation polish deferred.
The fresh Standard audit is complete, and Bugs44/45 are locally remedied and
committed. Bug46 is reproduced but not fixed: a complete metadata-preserving
atomic replacement needs a material filesystem architecture decision.
Publication remains NOT_READY; Goal85 is paused.

# Scope Covered

This checkpoint binds Bug46 investigation and the current decision gate, not
implementation acceptance. It preserves earlier local milestones and does not
reopen achieved work, modify consumer projects or grant external authority.

# Decisions Captured

Accepted user direction remains core0.6.0 first, broad docs/polish later; only
release-critical truth correction belongs here. Alpha status is not a security
waiver and does not establish adoption of unreleased v2 graphs.

Pending: may mdkg add a narrowly scoped OS-native filesystem layer, including
explicit build/package/platform qualification? Recommend a bounded feasibility
and design pass before settling distribution and fallback behavior. A
capability-checked platform-tool bridge is an alternative with added runtime
prerequisites and per-operation cost. No such change is implemented or approved.

# Implementation Summary

Local implementation milestones since the fresh audit:

- d44831b6: Bug44 provenance redaction and unsafe historical provenance refusal;
  chk621 and its artifact contain exact paths, source and installed evidence.
- 754710c7: Bug45 graph-owned transport admission, including configured cache
  destinations before effects; chk622 contains the eleven-path commit allowlist.
- Bug46: both atomic writers omit destination metadata. Seven synthetic
  reproductions cover mode, ACL and differing group preservation plus actual
  built-CLI task update. Six hard-linked peers remain unchanged.

No Bug46 source fix or runtime dependency has been introduced. No mode-only
partial fix is represented as closure. Source helpers also serve goals,
formatting, selection, caches, packs and mirrors; explicit journal0600 and
existing mirror/pack contracts must remain valid. Bug47 stays separate.

# Verification / Testing

Bug44:67 focused tests and49 installed scenarios on each required Node runtime.
Bug45:154 focused tests and167 installed scenarios on each required Node runtime.
These are macOS arm64 intermediate proofs, not final-artifact acceptance.

Bug46: seven confirmed metadata failures and six preserved hardlink controls on
built-source Node26.0.0, macOS arm64. A fresh read-only investigator independently
traced sinks and compatibility. No installed Bug46, Linux ACL, effective
cross-principal access, candidate-fix or final review proof is claimed.
Exact source/reproduction hashes and official API/source references are in the
sanitized investigation artifact. Fixture roots were removed; compact diagnostic
script/receipt remain under the owned /private/tmp/mdkg-goal86-bug46.akXu0j root.

Before evidence commit: run full/changed graph validation, SQLite index
verification, diff checks, exact staged-byte/path review and protected bookends.
No full test rerun is required for this evidence-only boundary; final release
tests remain mandatory after all source remedies.

# Known Issues / Follow-ups

- Stop the current execution pass at the material architecture decision; no
  blanket write approval is inferred. Goal86 remains incomplete and Bug46 blocked.
- Remaining Bugs46-57 are twelve fresh Standard findings; Bugs58-60 separately
  track adjacent correctness/safety work. Tasks838/839, installed/platform
  families, Task828, full ladder and exact artifact seal remain incomplete.
- Main754710c7 is54 ahead of cached origin/main9652b855,0behind. No remote
  verification occurred. The generated SQLite index remains owned/unstaged.
  Only this four-path mdkg evidence unit is proposed for the next local commit;
  no source, package metadata, protected bundle or unrelated path belongs in it.
- Protected selected Goal73, runtime DB and Demo3 bundle hashes match. Runtime
  has five released leases, zero active leases, zero queues/messages. No mutation
  lock remains. Graph active_node is a semantic pointer, not a runtime lease.
- No remote Git, push, tag, publish, provider/deployment, migration, bundle/
  subgraph refresh, global configuration or cross-project change occurred.

# Links / Artifacts

- .mdkg/artifacts/goal-86/bug-46-investigation.json
- .mdkg/artifacts/goal-86/bug-44-local-verification.json
- .mdkg/artifacts/goal-86/bug-45-local-verification.json
- Skill coverage: fix-finding, source-grounded-diagnose-and-fix and
  verify-close-and-checkpoint. New skill candidates: none.
