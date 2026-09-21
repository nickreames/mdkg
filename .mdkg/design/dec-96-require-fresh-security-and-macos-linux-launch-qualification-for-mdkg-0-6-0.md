---
id: dec-96
type: dec
title: Require fresh security and macOS Linux launch qualification for mdkg 0.6.0
status: accepted
tags: [release-0.6.0, launch-qualification]
owners: [mdkg-project-agent]
links: []
artifacts: []
relates: []
refs: [dec-93, dec-94, dec-95, edd-82]
aliases: []
created: 2026-09-13
updated: 2026-09-13
---

# Context

Nick approved the mdkg-only launch-readiness planning package on2026-09-13 after
choosing plan-now/execute-later, a fresh Standard scan plus independent diff, and
macOS/Linux publication gates. Existing architecture and decisions93-95 remain.

# Decision

1. Author only project-local mdkg planning/evidence/projections now. Goal86 is
   paused and unclaimed. A later explicit Run authorizes its fully specified
   bounded remedies, tests, local release preparation, ownership and reviewed
   explicit-path commits on main; no repeat implementation approval is needed.
2. Require task837's fresh full Standard repository audit after known remediation
   and draft metadata, plus task828's independent complete remediation-diff review.
   Preserve completed task825 and original scan accounting; missing coverage blocks.
3. Require test487 macOS and Linux proof against one exact0.6.0 candidate before
   publication. Windows remains explicitly unqualified. Local Linux execution
   needs verified isolation; new services/global config/hosted CI need separate
   authority rather than a presumed pass or automatic scope expansion.
4. Goal86 is the sole future execution lane. Goals83/84 retain achievements and
   acceptance duties but are paused. Goal85 stays paused; task831 must recheck
   chk570, task828, task837, test487, all blockers and exact candidate under fresh
   publication approval. No graph state supplies release authority.
5. Fix dependency direction: implementation prerequisites -> installed cases ->
   task826 acceptance -> Bug7 acceptance -> independent verification -> ladder ->
   seal -> publication recheck. No aggregate task may be its own test prerequisite.

# Alternatives considered

- Audit-only execution was declined; bounded remediation is authorized by later Run.
- Reuse-only Standard coverage was declined after broad CLI removals.
- Windows as a0.6 publication gate was not selected; macOS-only proof is insufficient.
- Duplicating achieved work or creating another publish goal loses evidence lineage.

# Consequences

No publication, remote Git, provider/deployment, consumer changes, canonical
migration or bundle refresh is granted. Original receipts and authored history
remain intact. Confirmed security/data-loss/compatibility/gate defects require
verification, not automatic risk waivers. Full operational and economic state
remains outside generic mdkg. Supporting detail belongs in linked tasks/evidence.

# Links / references

Goal86; tasks834-837; test487; chk608; existing Goals83-85 and decisions93-95.
