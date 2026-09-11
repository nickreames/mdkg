---
id: chk-599
type: checkpoint
title: Verify installed mixed Git state and current graph recovery across runtimes
checkpoint_kind: test-proof
status: done
priority: 9
tags: []
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-84/bug-7-mixed-state-recovery.json]
relates: [root:bug-7]
blocked_by: []
blocks: []
refs: [goal-83, goal-84, task-826, test-478, test-479, test-482, task-828]
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [bug-7, test-478, test-479, test-482]
created: 2026-09-11
updated: 2026-09-11
---
# Summary

Current installed collaboration and graph recovery pass on Node24.15.0,
24.18.0 and26.0.0:831commands (516mdkg and315local fixture Git), including
three mixed tracked-node scenarios and36caught-error graph recovery cases.
The mixed-state and post-optimization recovery freshness gaps are closed for
this intermediate candidate. Bug7 and full release qualification remain open.

# Scope Covered

Bug7 installed qualification; test478 collaboration, test479 recovery portions,
and test482 exact-runtime evidence. This does not complete those aggregate nodes.

## Changed Surfaces

- scripts/installed-identity-collaboration.js; linked owned graph evidence and index.
- Existing scripts/installed-graph-recovery.js rerun unchanged on current candidate.

## Boundaries

- Approved local fixture/test/evidence and exact-path local commit scope only.
- No product source, canonical graph migration, protected bundle/runtime/selection,
  remote Git, provider, publication, consumer or skill changes.
- Compact hashes and synthetic summaries only; raw command traces stay in owned temp storage.

# Decisions Captured

No material policy accepted. Three existing compatibility/recovery questions
were surfaced for Nick while independent qualification continued.

# Implementation Summary

Use a separate clone with three distinct versions of one tracked stable identity:
committed node, staged priority edit, unstaged lifecycle/body/manual title edit.
Show/list/search observe latest metadata despite a stale SQLite cache. Show/pack
preserve the complete latest body; ordinary mutation preserves it and Git staging.
Preview is observational; explicit pack writes only its requested output.

# Test Proof

- Intermediate tarball SHA256:39575a351ed5eb7b7074721102863aa3000a842630f7ed2597e30d490a1f349b.
- /private/tmp/mdkg-mixed-recovery.4Xz36d:final three v3 receipts, matching
  source/runtime/package/custody hashes; successful graph trees removed.
- Existing complete branch scenarios and12graph recovery cases per runtime remain intact.
- macOS SQLite mixed-state proof; no new Windows/JSON mixed-state or killed-writer claim.

# Verification / Testing

## Command Evidence

- Final serial npm test:1395pass,0fail,0skip on Node24.18.0.
- CLI parity and docs checks pass after that build;494examples checked.
- Independent bounded functional review:two coverage limits strengthened,
  no remaining actionable assertion defect. Not final task828 security clearance.

## Pass / Fail Status

- Bounded installed proof passes; aggregate qualification NOT_READY.

## Known Warnings

- Initial and v2 matrices passed but predate final assertion/source freeze;
  supplemental only. Final acceptance uses v3 receipts.
- Three stale imported-graph warnings remain preserved; no bundle refresh.

# Known Issues / Follow-ups

- Per-finding installed coverage aggregation; old-writer, killed-writer and
  old public-bundle decisions; historical migration and read-only mount gaps.
- Final independent security review, draft0.6metadata, full ladder and artifact seal.

## Follow-up Refs

- bug7,bug17,task826,test478,test479,test480,test482,task828,goals83/84/85.

# Links / Artifacts

- .mdkg/artifacts/goal-84/bug-7-mixed-state-recovery.json
- Source baseline:70134f895bb7c1428c49938f083955cccfaeab24.
- Skills:pursue-mdkg-goal,build-pack-and-execute-task,verify-close-and-checkpoint,
  safe-git-publication-preflight. Candidates:none.

# Raw Content Safety

- Summarize evidence and use refs, hashes, and artifact links instead of raw secrets, raw prompts, raw payloads, or bulky execution traces.
