---
id: dec-99
type: dec
title: Retain local Linux qualification and require fresh current-source security acceptance
status: accepted
tags: [release-0.6.0, qualification]
owners: [mdkg-project-agent]
links: []
artifacts: []
relates: []
refs: [goal-86, test-487, test-488, task-828, task-830, dec-98, goal-87]
aliases: []
created: 2026-09-28
updated: 2026-09-28
---
# Context

Nick clarified that the question about requiring Linux was explanatory, not
an instruction to remove the gate: local Linux testing is authorized. Nick
also approved the preceding recommendation to use fresh independent
current-source/remediation-diff evidence with retained finding records rather
than recover unavailable original scan context. These are current Goal86
qualification decisions, not publication approval.

# Decision

1. Keep Test487's macOS/Linux qualification required. Disposable isolated local
   Linux VMs are authorized; identify image, runtime, architecture, filesystem
   and native/emulated execution. No host mounts, shared credentials, host
   installation, hosted runner dispatch or provider operation is implied.
2. Node-only describes the product implementation, not a claim that every
   host filesystem behaves identically. Linux tests do not add a native mdkg
   helper or OS-specific implementation. Windows remains unqualified.
3. Task828's final evidence contract is a fresh independent review of the
   frozen current source and complete remediation diff, plus retained mdkg
   finding/disposition records and installed regression evidence. Record exact
   review coverage, exclusions, input hashes and canonical current reports.
   Missing required current coverage still blocks acceptance.
4. Original inaccessible reports remain an explicit historical provenance
   limitation. Do not recover or rerun blocked historical context, manufacture
   original report bodies, or represent sanitized records as the lost reports.
   Their absence does not require repeating the unavailable historical workflow
   before an explicitly authorized current-source review can be accepted.
5. Task830 seals the artifact against the newly accepted current review
   evidence, its hashes and the explicit historical-report loss disposition.
   Retain the original fourteen-finding accounting: twelve in-scope remedies
   require verification; Bugs46/47 remain DEFERRED and UNRESOLVED under Goal87,
   not accepted/fixed findings. No new review is launched by this record.

# Alternatives considered

- Remove Linux acceptance: not Nick's decision; the clarification preserves it.
- Add OS-specific product code to enable testing: unnecessary and excluded.
- Recover blocked scan context or infer original report contents: prohibited.
- Call historical summaries final security clearance: rejected; fresh scoped,
  independent current-source/diff acceptance is still required.

# Consequences

Supersede contradictory historical report-recovery prerequisites in Task828
and the original-report interpretation of Task830. Preserve history rather
than rewriting past findings or scans. Final platform, independent security,
full ladder and exact seal gates remain open. Goal85 remains paused; no push,
tag, release, provider action, hosted execution or consumer mutation follows.
One repository writer stays on main. Record bounded Linux milestones without
promoting partial execution into full platform acceptance.

# Links / references

- Goal86, Test487, Test488, Task828 and Task830.
- Dec98 and paused Goal87 preserve the portable implementation and deferrals.
- Chk662 records the first actual installed-candidate Linux ARM64 subset.
