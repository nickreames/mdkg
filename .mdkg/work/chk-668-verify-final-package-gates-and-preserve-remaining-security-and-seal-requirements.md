---
id: chk-668
type: checkpoint
title: Verify final package gates and preserve remaining security and seal requirements
status: done
priority: 1
tags: [release-0.6.0, qualification, evidence]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-86/final-package-gates-20260930.json, .mdkg/artifacts/goal-86/implementation-commit-allowlist-20260930.json]
relates: []
blocked_by: []
blocks: []
refs: [goal-86, task-828, task-829, task-830, test-487, test-491, test-492, bug-67]
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: []
created: 2026-09-29
updated: 2026-09-29
---
# Summary

Goal86 remains NOT_READY. The complete runtime suite passed 2382/2382 with
92.59% line,84.30% branch and97.57% function coverage. All37 required package
smokes passed against retained0.6.0 bytes f7cbdc1d… without repacking or site
builds. This milestone supports a reviewed132-path local implementation commit;
it does not close Task828,Task829,Task830 or grant publication authority.

# Scope Covered

Task829's executed package gates; Tests487/491/492 installed platform controls;
Bug67's exact-reference regression and portable Git fixture correction. The
attached allowlist individually names all132 reviewed implementation paths.
Other mdkg nodes,artifacts,events and generated index remain unstaged for that
logical commit. One writer:mdkg-project-agent; active Goal86 work is Bug67.

# Decisions Captured

Dec99/100 remain authoritative. Selected achieved Goal73, runtime DB, Demo3
bundle and public draft release bytes are unchanged. Bugs46/47 remain deferred
and unresolved under Goal87. Goal85 stays paused. No blocked historical scan
context was accessed or recovered.

# Implementation Summary

The final runtime package inputs are unchanged after qualification. A Git2.43
fixture assumption was corrected using explicit recursive/no-renames setup;
the existing add/add ancestry assertion and product classifier were retained.
The corrected30-case family passes on macOS and both Ubuntu architectures.

# Verification / Testing

The attached milestone binds the full suite,49 focused qualification regressions,
37 smokes and their real receipt hashes. Seven unchanged earlier ladder gates
are explicitly reused-not-rerun; this is not a newly executed2383-case suite.

Ubuntu24.04.4 ARM64/native and x86_64/emulated each have17 original passing
families plus a64-case audit supplement. The first eleven audit families supply
165 distinct unchanged passing cases, giving229 unique current-audit controls
per architecture. Original failed receipts are preserved, not relabeled passed.

ARM64 JSON/SQLite scale passes. The original x86_64 JSON migration exceeded its
600000ms qualification allowance; an explicit single900000ms JSON retry and
the remaining SQLite row pass on identical bytes and2000-node scenarios. This
is no new product latency guarantee. The final persisted macOS collector is
still running at this checkpoint.

Independent local_commit_review conditionally approved the exact132-path
manifest. Its fixture-validation condition now passes on macOS and Ubuntu.
That bounded commit review is not Task828's security-diff acceptance.

# Known Issues / Follow-ups

- Finish final macOS persisted platform evidence.
- Obtain complete fresh immutable-range security-diff acceptance for Task828.
- Reconcile final acceptance records and seal exact bytes under Task830.
- Hosted CI,Windows and non-shipping website qualification remain unverified or
  explicitly deferred, not passed.

# Links / Artifacts

- `.mdkg/artifacts/goal-86/final-package-gates-20260930.json`
- `.mdkg/artifacts/goal-86/implementation-commit-allowlist-20260930.json`
- No new local commit yet; no push,tag,publish,deployment,provider or remote Git.
- Skill coverage:pursue-mdkg-goal,verify-close-and-checkpoint; candidates:none.
