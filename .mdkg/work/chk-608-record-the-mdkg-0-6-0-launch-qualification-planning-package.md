---
id: chk-608
type: checkpoint
title: Record the mdkg 0.6.0 launch qualification planning package
status: done
priority: 1
tags: [release-0.6.0, launch-qualification]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-86/planning-receipt.json]
relates: []
blocked_by: []
blocks: []
refs: [dec-96]
context_refs: [goal-86, goal-83, goal-84, goal-85]
evidence_refs: []
aliases: []
skills: []
scope: [task-834, task-835, task-836, task-837, test-487]
created: 2026-09-13
updated: 2026-09-13
checkpoint_kind: handoff
---

# Summary

PLANNING_COMPLETE / EXECUTION_NOT_STARTED. The approved mdkg-only planning
package is authored and independently reviewed. Goal 86 remains paused and
unclaimed; Goal 85 remains paused with no eligible publication work. This
checkpoint closes planning only, not remediation, audit or release qualification.

# Scope Covered

New root:goal-86, root:dec-96, root:task-834 through root:task-837,
root:test-487 and root:chk-608. Enhanced existing Goals 83/84/85, Bugs 7/17/35/39,
Tasks 826-831, Tests 477-484/486 and chk-570. The receipt names all 31 node paths
and the planning evidence path. No achieved work or historical receipt reopened.

# Decisions Captured

Direct 0.6.0 after qualification; fresh Standard security audit plus independent
remediation-diff review; complete installed-family qualification on Node 24.15.0,
the selected supported Node 24 runtime, and Node 26 on both macOS and Linux.
Windows remains unqualified. Decisions 93-95 and generic OSS boundaries stand.
Only a later explicit Run of Goal 86 authorizes its bounded implementation and
reviewed local commits. Publication and all excluded external actions stay separate.

# Implementation Summary

This turn changed only mdkg planning fields/bodies and required event/index
projections. The dependency flow is implementation prerequisites -> installed
test families -> task-826 aggregate -> Bug 7 qualification -> independent
verification -> full ladder -> exact seal -> publication recheck. Goal references
are context, actionable work is scope, and checkpoint references are evidence
or dependencies. Goals 83/84 retain their accomplishments and acceptance duties
while Goal 86 is the sole future execution lane.

Independent planning review identified and verified corrections for three issues:
old-client refusal versus accepted unsupported init bypass; full Node 26 family
coverage; and typed goal/checkpoint references. No material defect remained in
those corrections. The 23 existing narrative bodies were hash-preserved below
their current-contract addenda, including superseded historical expectations.

# Verification / Testing

- Full graph validation: pass, zero errors and three preserved stale-import warnings.
- Changed-only graph validation: pass, zero errors or warnings.
- SQLite verification: all five derived indexes present and fresh.
- Dependency/scope checks: 62-node dependency closure acyclic; 23 actionable
  Goal 86 scope nodes; publication tasks remain only in Goal 85's scope.
- Read-only routing: Goal 86 yields backlog task-834; Goal 85 yields no work.
- Diff/path review: git diff --check passes; nothing staged; HEAD unchanged.
- Protected selection, runtime database, Demo 3 bundle, Git index, seven partial
  source/evidence paths and all 1,855 non-mdkg paths retain their baseline hashes.

The receipt records post-checkpoint verification, exact path hashes, generated
state and custody. These are planning checks only. No source tests/builds,
security scans, installed release qualification or publication ran this turn.

# Known Issues / Follow-ups

Bugs 7/17/35/39, final installed/worktree/platform coverage, fresh security and
independent diff review, draft release metadata, full ladder and artifact sealing
remain future work. Main remains 50 ahead / 0 behind cached origin/main; no live
remote verification was performed. The starting 11 dirty paths were classified;
partial Bug 17 work is preserved, not adopted as a completed fix. Stale imported
bundles remain untouched because refresh is outside this planning authority.

# Links / Artifacts

.mdkg/artifacts/goal-86/planning-receipt.json

Next: explicit Run Goal 86 starts with task-834's fresh inventory and custody
check. No planning decision is open. No standing lease survives this turn;
supported transient mutation locks are released, runtime leases remain unchanged,
and planning work stays unstaged/uncommitted under mdkg-project-agent custody.

Skills used: select-work-and-ground-context, service-boundary-ownership-check,
verify-close-and-checkpoint. Their scoped authority and evidence separation
preserved protected bundles and excluded source/publication work. Candidates: none.
