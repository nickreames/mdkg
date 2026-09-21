---
id: chk-598
type: checkpoint
title: Verify installed stale upgrade plans preserve edited instructions and Git state
checkpoint_kind: test-proof
status: done
priority: 9
tags: []
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-84/bug-7-stale-upgrade.json]
relates: [root:bug-7]
blocked_by: []
blocks: []
refs: [goal-83, goal-84, task-826, test-477, test-482, task-828]
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [bug-7, test-477, test-482]
created: 2026-09-11
updated: 2026-09-11
---
# Summary

Eighteen installed upgrade/recovery cases pass across Node24.15.0,24.18.0
and26.0.0. Editing AGENTS/CLAUDE after preview invalidates the reviewed plan;
refusal preserves every regular-file byte, including Git, and creates no journal.
A fresh review preserves the edit through resume or exact rollback. This closes
the fresh stale-upgrade-plan coverage gap, not aggregate release qualification.

# Scope Covered

Bug7 installed qualification; test477 cases1/3/4/5 portions and test482 runtime proof.

## Changed Surfaces

- scripts/installed-upgrade-recovery.js; owned evidence, graph narratives and index.

## Boundaries

- Only approved local fixture/testing/evidence and reviewed local commit scope.
- No shipped product changes, canonical migration, selected-goal change, bundles,
  runtime DB changes, remote/provider/publication action or new skills.
- Raw fixture command receipts remain in owned /private/tmp; summaries and hashes only here.

# Decisions Captured

No compatibility policy or release waiver accepted. Existing decisions stay open.

# Implementation Summary

Extend the existing installed recovery matrix rather than create a parallel harness.
Require stable observational previews, changed plan hashes after user edits, stale
refusal before journaling, and exact edited-wrapper preservation after recovery.

# Test Proof

- Actual verified published0.5.2 install to intermediate candidate SHA256
  39575a351ed5eb7b7074721102863aa3000a842630f7ed2597e30d490a1f349b.
- /private/tmp/mdkg-upgrade-stale.EQQ0lV:18 cases,222 commands
  (186mdkg invocations and36fixture Git commands); all successful graph fixtures removed.
- Caught-error bootstrap recovery only; not killed-writer or graph transaction recovery.

# Verification / Testing

## Command Evidence

- Fresh serial npm test on Node24.18.0:1395pass,0fail,0skip.
- Existing compiled upgrade-safety source regressions on Node26:9pass.
- CLI and documentation checks against completed build pass;494examples checked.
- Independent source-only functional review found no concrete defect.
- Full graph validation passes with three preserved stale-subgraph warnings;
  changed-only graph and SQLite verification pass. Diff whitespace check passes.

## Pass / Fail Status

- Bounded proof passes; bug7/goal83 remain incomplete and publication remains blocked.

## Known Warnings

- One full-suite run overlapped an accidentally launched build and failed after
  generated output disappeared. Build stopped, both processes terminal, entire
  affected run excluded; serial full rerun passes. Installed matrix predates overlap.
- Existing three stale subgraph warnings are preserved; no refresh authority used.

# Known Issues / Follow-ups

- Mixed tracked staged/unstaged node/pack case; graph recovery after optimization.
- Old-client/killed-writer/public-bundle decisions, historical migration limitations,
  final independent security review, draft metadata, full ladder and artifact seal.

## Follow-up Refs

- bug7,bug17,task826,test477,test478,test479,test480,test482,task828,goals83/84/85.

# Links / Artifacts

- .mdkg/artifacts/goal-84/bug-7-stale-upgrade.json
- Prior init/discovery milestone committed locally as0c0f7d26b64c80154aa09fc4fc9d3faa93586ed4.
- Skill coverage:pursue-mdkg-goal,build-pack-and-execute-task,
  verify-close-and-checkpoint,safe-git-publication-preflight. Candidates:none.

# Raw Content Safety

- Summarize evidence and use refs, hashes, and artifact links instead of raw secrets, raw prompts, raw payloads, or bulky execution traces.
