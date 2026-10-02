---
id: chk-656
type: checkpoint
title: Correct release-critical guidance and verify installed command discovery
checkpoint_kind: implementation
status: done
priority: 9
tags: []
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-86/task-839-release-guidance.json]
relates: []
blocked_by: []
blocks: []
refs: [task-839, task-828, task-829, task-830, goal-86, dec-98, goal-87, chk-655]
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [task-839]
created: 2026-09-28
updated: 2026-09-28
---
# Summary

Task839's bounded release-critical guidance milestone is locally verified.
Goal86 remains active and NOT_READY. Bugs46/47 remain DEFERRED / UNRESOLVED
under paused Goal87, never accepted or fixed; Goal85 remains paused.

# Scope Covered

One writer, mdkg-project-agent, under Goal86/Dec98. The receipt binds twelve
owned guidance/checker/test paths and exact before/after hashes. Runtime source
is unchanged by this task. Main remains6d23981e70bc68798def73c81b9cd5fa7bc9f3df,
69ahead cached origin/main; no remote verification, new staging or commit.

# Decisions Captured

Preserve portable Node operation, explicit safety limits, historical chronology
and separate execution/publication authority. No broad documentation polish,
native helper, canonical migration, bundle/subgraph refresh or deployment.

# Implementation Summary

- Replace active retired Git/consumer-policy guidance with generic current
  interfaces and independently invoked native Git.
- Distinguish observational memory from explicit persistent indexing and local
  application DB state; correct output-format and capability resolve envelopes.
- Correct compact default initialization, reviewed upgrade and runtime limits.
- Disclose deferred ACL/ownership and ancestor-replacement risks without
  claiming a fix or unverified operating-system qualification.
- Validate current command examples through the real parser/option contract;
  report historical and illustrative examples separately without executing them.

# Verification / Testing

Node24.18.0/macOSarm64:34 focused checks pass,0fail/skip,83.012834ms;
499 current examples across66 files pass,59 illustrative and13 historical are
reported separately. Build, source/help/seed/generated-reference parity,
CI workflow source check,8 skills, website18-file/docs69-file/SEO smokes pass.

Normally packed/installed command-docs smoke passes in14,313.799458ms:
114 contract entries, seven operational examples, explicit index and final
graph validation. Candidate SHA256:
6154e4ea920bfa09d57532171df808f3f406250b44b2b318f0bb48542f82cdca.
Owned fixture cleanup succeeds. This intermediate candidate is not sealed.

A bounded independent source review found three prose contradictions and the
validator's missing-value admission gap. All were corrected with negative
controls and final reviewer readback. The latter has1/1 failing-before evidence
and34/34 passing-after. Harness/placeholder corrections remain in the receipt;
no blocked scan context or historical security report was recovered.

# Known Issues / Follow-ups

- Package-input changes supersede prior candidates for final qualification;
  earlier passes remain snapshot-bound intermediate evidence.
- Final installed families, macOS/Linux, independent security acceptance, full
  tests/coverage/ladder, exact seal and reviewed commits remain Goal86 work.
  Windows is unqualified. No release clearance or provider proof is claimed.
- Selection Goal73, runtime DB, Demo3 bundle and draft-release hashes match.
  No persistent lease was acquired; scoped mutation locks are released.
- Full/changed graph, SQLite index and diff closeout results are recorded in
  the receipt. Pre-existing imported bundle freshness warnings remain preserved.
- Skills reused: goal pursuit, pack-first execution and selective verification.
  New skill candidates:none.

# Links / Artifacts

- .mdkg/artifacts/goal-86/task-839-release-guidance.json
- Chk652-655, Dec98, Goals85-87, Tasks839/828/829/830.
