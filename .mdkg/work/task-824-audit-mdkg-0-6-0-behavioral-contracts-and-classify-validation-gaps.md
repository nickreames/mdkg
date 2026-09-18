---
id: task-824
type: task
title: Audit mdkg 0.6.0 behavioral contracts and classify validation gaps
status: done
priority: 1
tags: [release-0.6.0, local-qualification]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-83/task-824-behavioral-audit.json, .mdkg/artifacts/goal-83/task-824-contract-audit.json]
relates: []
blocked_by: [task-823, task-825]
blocks: []
refs: [bug-21, bug-22, bug-23, bug-24, bug-25, test-483, bug-26, bug-27]
context_refs: [goal-83]
evidence_refs: []
aliases: []
skills: []
created: 2026-09-07
updated: 2026-09-09
---

# Overview

Goal: End-to-end bootstrap, identity, migration, reconciliation, recovery, observational-read and release-gate audit.

Context: The complete approved contract is goal-83 and bounded blocker ownership is goal-84.

# Acceptance Criteria

Reuse achieved Goals 74/77/78/81/82 rather than reopen them. Reproduce audit observations before promoting defects: legacy cache writes on reads; pack identity serialization; format and repeated init on v2; bundle payload verification at consumers; checkpoint blocker routing; site build cache dependency closure. Classify each as confirmed blocker, rejected with evidence, or explicitly nonblocking.

# Files Affected

Read all current source and tests; write only owned findings/evidence, with validated bounded remedies routed through goal-84.

# Implementation Notes

This is the user-approved local-only 0.6.0 qualification pass. Owner mdkg-project-agent is the sole repository writer; use supported goal claims and transient locks. Preserve selected Goal 73, protected Demo 3 bundles, unrelated paths and runtime DB bytes. No remote Git, publication/dist-tags, tags, history rewriting, provider/deployment, consumer/root/sibling writes, canonical graph migration or bundle/subgraph refresh. Disposable local fixtures are allowed only under /private/tmp. Local explicit-path commits on main are authorized after validation and staged review. Stop for unknown custody, concurrent writer, baseline movement, required global configuration or materially new decisions.

# Test Plan

Case-level installed fixtures and source/contract trace; no speculative feature expansion.

# Links / Artifacts

Owning goal and dependencies are explicit above. Record exact commands, input/source/artifact hashes and pass/fail before completion.

## 2026-09-08 Installed Behavioral Evidence

Completed 26 primary plus eight supplemental synthetic probes against one
installed candidate on Node v26.0.0. All source/package inputs and installed
bytes stayed frozen. Final probes had zero harness errors; an initial temporary
supplemental syntax error executed no cases and was corrected before evidence.

Five confirmed blockers are fully routed to bug-21 through bug-25 and test-483.
The stronger init repro starts with a valid v2 graph and produces an invalid
graph by reseeding missing legacy HUMAN.md without identity. Complete graph
reinitialization remains valid. Unknown-format formatting refuses before writes;
checkpoint dependency routing correctly gates the task. Those hypotheses are
rejected as defects and remain controls. Bundle consumer integrity is already
owned by bug-17; no duplicate finding was created.

The external-import cache probe uses a synthetic local builder and the actual
release proxy, not historical Demo 3 application payloads or hosted state.
The package still has development 0.5.2 metadata; it is not a final 0.6.0 seal.
See `.mdkg/artifacts/goal-83/task-824-behavioral-audit.json` for hashes, cases,
limits and protected-state custody.

Task remains progress: complete the remaining end-to-end source/contract trace
for identity, reconciliation, recovery, execution state and release-gate coverage
before audit closure. Do not infer complete qualification from these probes.

## 2026-09-09 Final Contract Disposition

The remaining identity, reconciliation, recovery, execution-state and release
contract trace is recorded in
`.mdkg/artifacts/goal-83/task-824-contract-audit.json`. The frozen installed
candidate passed 124 existing contract tests with no skips. Three additional
probes (37 total custom cases) established two migration blockers, bug-26 and
bug-27. Normal migration controls pass; a missing-skill graph incorrectly
receives an applied migration receipt despite failing normal validation.

Every observation named in this task has a disposition: bugs 21-27 are qualified
behavioral blockers; bundle integrity/state remains bug-17; checkpoint routing,
unknown-format formatter refusal and complete-v2 init remain passing controls.
Audit classification is complete with blockers, not a claim of clean behavior.
Bug-7/task-826 retain full installed user-journey/runtime qualification;
task-828 retains independent fix review; task-829/830 retain the ladder and seal.

Source hashes were reverified unchanged at the closeout boundary. Temporary
harness setup mistakes were corrected and excluded from product findings.
Selected Goal 73, runtime DB and protected Demo 3 bundle remain unchanged.
No source remedy, canonical migration, bundle refresh, commit or external action
occurred during this audit. Skill candidates: none.
