---
id: chk-607
type: checkpoint
title: Consumer-neutral CLI contracts verified locally
checkpoint_kind: implementation
status: done
priority: 9
tags: []
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-84/bug-37-verification.json, .mdkg/artifacts/goal-84/bug-37-commit-allowlist.json, .mdkg/artifacts/goal-84/bug-39-unknown-option-reproduction.json]
relates: [bug-37]
blocked_by: []
blocks: []
refs: [goal-84, goal-83, goal-85, bug-37, bug-39, test-484, test-486, task-828, chk-606, task-833]
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [bug-37]
created: 2026-09-12
updated: 2026-09-12
---
# Summary

Generic removal unit verified; 1408 complete tests and exact installed three-runtime proof pass. Release remains blocked by incomplete qualification and Bug39.

Outcome: VERIFIED_LOCAL_IMPLEMENTATION_UNIT_NOT_RELEASE_QUALIFICATION. Owner
mdkg-project-agent. Goal85 remains paused. No publishing, remote Git, provider
or consumer action occurred.

# Scope Covered

- Completed node: bug-37 (Remove consumer-specific validation and skill metadata behavior from mdkg 0.6.0)
- Node type: bug
- Checkpoint source: `mdkg task done --checkpoint`

## Changed Surfaces

- Source, generic templates, current guidance, direct tests and installed release
  fixtures are individually named in bug-37-commit-allowlist.json.
- Bug39/Test486 record the reproduced unsupported-option defect; task828 now
  depends on both. No independent final security acceptance is claimed here.
- Preserved Bug17/Bug35/Bug7 partial paths and shared tracked SQLite remain
  unstaged. Derived cache refresh does not grant source custody.

## Boundaries

- in scope: structured task completion and checkpoint evidence
- out of scope: unrelated graph, runtime, provider, or release mutations
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded

# Decisions Captured

- See decision and approval refs on the completed node and checkpoint frontmatter.

# Implementation Summary

- Removed consumer validation execution/privilege, special skill projection and
  search weighting, first-class pricing, and the old runtime token. Kept generic
  contracts, opaque policy refs, structural/local-evidence verification and
  preserved custom-template/raw authored data. Cached/imported capabilities use
  the same consumer-neutral projection as newly indexed records.
- Independent read-only review identified a retired-option swallowing bypass;
  raw-argument refusal and sync/async/installed no-side-effect regressions now
  pass. This is not a substitute for task828's final Codex Security diff review.
- Maintained README, command references and affected smoke fixtures now agree
  with compact init and generic contracts. Historical receipts and published
  release-note data remain unchanged; the extraction export still verifies.

# Verification / Testing

## Command Evidence

- command: `mdkg task done --checkpoint`
- result: completed node and evidence checkpoint written

## Pass / Fail Status

- Build and all1408 complete tests pass, no failures/skips. CLI/help/contract,
  generated docs,470 command examples, static package guard and diff check pass.
- Exact intermediate tarball e2bf338e180805bbeb6fb16626ea494474fe76d4ecf13edffc0232cd8960346c
  passes generic/work receipt checks on Node24.15.0/24.18.0/26.0.0. Each includes
  nine rejected invocations with no writes/subprocesses, custom-field retention,
  cached and synthetic-import neutral projections, and warm/cold JSON/SQLite
  identity links. Four additional affected installed smokes pass on24.18.0.
- A disposable prospective source commit without the preserved Bug17 partial
  patch builds and passes158 direct tests plus installed generic proof. Its
  different tarball is a commit-isolation check, not the shared candidate seal.

## Known Warnings

- Three stale imported-bundle warnings are intentionally preserved. No canonical
  bundle/subgraph refresh was authorized. Full graph errors0, changed-only
  errors0/warnings0 and all five supported SQLite verification checks pass after
  explicit reindex. Final local-commit bookends remain required.
- SelectedGoal73, runtime DB and protected Demo3 bundle match their hash bookends.
  The five existing runtime leases remain released; queue rows remain zero.

# Known Issues / Follow-ups

- Bugs7/17/35, new Bug39/Test486, actual0.5.2 upgrade, native worktree test478,
  complete test484, draft0.6.0 metadata/guidance, final task828 security acceptance,
  full task829 ladder and task830 exact seal remain incomplete.
- Bug39 reproduces on actual published0.5.2 and the candidate: `index --verify`
  exits zero and rebuilds five index projections. No authored or staged-content
  loss was observed. Publication remains blocked; no automatic risk waiver.
- Intermediate packages remain versioned0.5.2, not released0.6.0 candidates.
  Windows, hosted CI, remote/provider state and consumer adoption are unverified.
- Skills reused: goal pursuit, pack execution, boundary classification,
  source-grounded repair and verify-close-and-checkpoint. New candidates:none.

## Follow-up Refs

- task/test/goal refs: inspect the completed node and checkpoint frontmatter

# Links / Artifacts

- .mdkg/artifacts/goal-84/bug-37-verification.json

# Raw Content Safety

- This checkpoint stores the completion summary and artifact refs, not raw prompts, secrets, payloads, or bulky traces.
