---
id: chk-624
type: checkpoint
checkpoint_kind: handoff
title: Capture security findings partial remediation and evidence custody gates
status: done
priority: 1
tags: [release-0.6.0, security, handoff]
owners: []
links: []
artifacts: [.mdkg/artifacts/goal-86/security-findings-checkpoint-20260918.json]
relates: []
blocked_by: []
blocks: []
refs: [goal-86, goal-84, task-837, bug-46, bug-47, bug-48, task-838, task-828, test-488]
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: []
created: 2026-09-18
updated: 2026-09-18
---
# Summary

Captured the completed Standard scan's14 findings (5medium/9low) and current
dispositions without duplicating nodes or changing historical scan counts.
Bugs44/45 are locally verified; twelve remain open. Bugs58-60 are separately
classified adjacent blockers. Publication remains NOT_READY; Goal85 stays paused.

# Scope Covered

User request: report known security findings and plan remediation/mdkg
enhancements, not further functional implementation. Goal86 is the sole existing
execution lane, Goal84 the blocker ledger. New artifact records exact current
source custody, observed results, protected hashes and evidence availability.

# Decisions Captured

Live workbench recheck confirms the concrete guardrail: remediationAvailable is
false because current checkout85226b5 differs from scanned revisione42f1d9.
The scan is complete, all14 findings remain available without truncation, and
reportAvailable is false. This is revision-bound remediation protection, not a
security-policy refusal of this defensive work. Preserve main and the partial
patch; do not reset or check out the old revision to bypass the gate. Use current
mdkg-owned source remedies and later qualify a new frozen candidate through the
approved review workflow. No scan was launched or re-finalized by this read.

Keep core0.6.0 and release-critical truth in scope; broad documentation polish is
later. No native dependency, new host/storage service, scan, remote action,
publication, source completion or Git commit is authorized by this checkpoint.

Pending: bounded OS-native filesystem design/feasibility for Bug46/47 before a
packaging decision; exact recovery/retention of canonical scan artifacts from
an approved plugin-owned/private location. No unsupported authority or waiver.

# Implementation Summary

No functional changes after the findings-capture request. Earlier in the turn,
Bug48 changed src/core/config.ts and src/commands/bundle.ts and added
tests/core/config_read_admission.test.ts,
tests/commands/source_read_admission.test.ts and
tests/fixtures/source-read-admission.cjs. All remain unstaged/uncommitted and
owned partial work. No src/util/zip.ts correction has been applied.

The independent review found selected-ZIP admission still separates pathname
stat from unbounded read. Parent reproduced a controlled leaf-to-FIFO swap and
two-second timeout in a synthetic owned child. Bind that remaining path to
Bug48/test488; it is not Bug47's ancestor race or a fifteenth sealed-scan finding.

Planning updates: Bug48 current state; Goal86 current state; Task838 durable
evidence custody; Task828 canonical-report acceptance; Test488 ZIP-reader cases.
Existing Bugs44-60 already contain source anchors, scope and acceptance work.

# Verification / Testing

Previously observed this turn: build and test compilation passed;155 focused
source tests passed;23 installed CLI/MCP cases passed on each required Node
24.15.0/24.18.0/26.0.0, macOS arm64. CLI/docs/CI-projection parity passed. These
do not close Bug48 because its ZIP-reader path survives. Full-suite execution
had no recoverable terminal result after the environment transition: unknown,
not pass. Linux, final diff review, full ladder and exact seal remain pending.

At this checkpoint, all14 semantic findings are also retrievable from the live
security workbench; they have not been lost. Canonical raw scan files and Bug48 temporary receipts and
tarball are absent at their recorded paths. Persisted sanitized scan intake,
Bug44/45 verification, Bug46 investigation and graph records remain available.
The artifact preserves prior tool-observed results and hashes explicitly as
such, not reconstructed original receipts. Recover originals by exact hash or
supersede the missing qualification with a fresh authorized workflow. Task837's
historical completion remains intact; acceptance cannot ignore missing evidence.

Planning-package checks passed: full graph zero errors/three preserved stale
subgraph warnings; changed-only zero errors/warnings; all five index projections
fresh; git diff --check clean. Partial-source and protected-state hashes match.
These do not replace unfinished source/security/platform qualification.

# Known Issues / Follow-ups

- First resolve filesystem architecture and report-retention decisions; neither
  requires weakening safety checks or removing release gates.
- Then finish Bug48 and independent shared-boundary remedies; group review by
  filesystem/registry/loop, snapshot/SQLite, journal/ID integrity and archive
  ownership. Preserve separately attributable bugs and one writer per checkout.
- Close Tasks838/839 and adjacent Bugs58-60; freeze inputs for independent review,
  macOS/Linux installed qualification, full ladder and final exact artifact seal.
- main85226b5 is55 ahead/0behind cached origin/main9652b855; no remote check.
  No stage/commit/push occurred in this checkpoint pass. Generated SQLite remains
  owned and unstaged. No runtime lease was acquired; no mutation lock remains.
- Root/sibling/consumer state, Demo3 bundle, selected Goal73 and runtime DB stay
  unchanged. No bundles/subgraphs rebuilt; no deployment/provider/publication.

# Links / Artifacts

- .mdkg/artifacts/goal-86/security-findings-checkpoint-20260918.json
- .mdkg/artifacts/goal-86/task-837-standard-security-audit.json
- chk620: completed Standard scan; chk621/622: local Bug44/45 milestones;
  chk623: filesystem metadata decision gate.
- Skill coverage: select-work-and-ground-context, fix-finding,
  verify-close-and-checkpoint. Skill candidates: none.
