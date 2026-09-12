---
id: chk-606
type: checkpoint
title: Git workflow removal and inspection verification complete locally
checkpoint_kind: implementation
status: done
priority: 9
tags: []
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-84/bug-36-38-verification.json, .mdkg/artifacts/goal-84/bug-36-38-commit-allowlist.json]
relates: [bug-36]
blocked_by: []
blocks: []
refs: [goal-84, bug-36, bug-38, test-485, test-484, task-828, chk-605]
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [bug-36, bug-38, test-485]
created: 2026-09-12
updated: 2026-09-12
---
# Summary

Six wrappers removed; exact installed artifact passes three runtimes; native worktree generic-contract and final security release gates remain open.

Local source implementation unit verified, not complete0.6.0 qualification.
Owner mdkg-project-agent; explicit user-approved source/test/docs/mdkg and local
commit scope only. Publication Goal85 stays paused. No remote action occurred.

# Scope Covered

- Completed node: bug-36 (Remove Git mutation convenience commands from mdkg 0.6.0 without compatibility aliases)
- Node type: bug
- Checkpoint source: `mdkg task done --checkpoint`

## Changed Surfaces

- Forty reviewed source/test/docs/planning/evidence paths are individually named
  in bug-36-38-commit-allowlist.json. The materialization implementation and smoke
  are deleted; smoke:git-boundary preserves release-gate membership.
- Preserved incomplete Bug17/Bug35/Bug7 paths and the shared tracked SQLite cache
  remain unstaged. Derived cache regeneration is not source ownership authority.

## Boundaries

- in scope: structured task completion and checkpoint evidence
- out of scope: unrelated graph, runtime, provider, or release mutations
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded

# Decisions Captured

- See decision and approval refs on the completed node and checkpoint frontmatter.

# Implementation Summary

- Six Git mutation/lifecycle wrappers and exclusive flags/dispatch are removed.
- Retained inspection preserves NUL-delimited status paths/columns, pins tree
  evidence to its captured commit, pairs remote names/URLs, withholds unsafe URL
  descriptors and fails closed on incomplete/failed observations. Fsmonitor is
  disabled per subprocess. Active tracked content filters, including initialized
  submodules, refuse rather than execute or fabricate normalization.
- One independent post-patch review cycle identified four concrete gaps; the
  parent reproduced applicable triggers and added regressions. This is not a
  replacement for the final task828 security review or a new broad credential
  exploit finding. Chk571 rejection and original Standard-scan count remain.

# Verification / Testing

## Command Evidence

- command: `mdkg task done --checkpoint`
- result: completed node and evidence checkpoint written

## Pass / Fail Status

- 53 focused Git/containment tests pass;1402 complete ordinary tests pass, zero
  failures/skips. Build, CLI matrix, generated docs/release notes,472 command
  examples, static package guard, graph validation and SQLite verification pass.
- The same intermediate tarball aee02deaff63d3690511405ded534ce965a36df456af555463f90ad65ae218a1
  passes26 refusal and16 inspection cases on Node24.15.0,24.18.0 and26.0.0.
- Published0.5.2 retained source reproduces the original defects with a passing
  clean control. This source remains unchanged. Intermediate package version
  labeling is not final0.6.0 metadata or a release seal.

## Known Warnings

- Three stale imported-bundle warnings remain intentionally preserved. No bundle
  refresh was authorized. Selected73, runtime DB and Demo3 bundle hashes match
  the protected bookends in the verification artifact; all five DB leases remain
  released and the queue is empty.

# Known Issues / Follow-ups

- Next source work is Bug37 consumer-neutral contracts. Bug7/Bug17/Bug35,
  native worktree test478, generic installed test484, release guidance, final
  independent security review, full release ladder and exact0.6.0 seal remain.
- A mistyped index --verify invocation exposed general ignored-option behavior;
  it rebuilt only authorized caches. Actual verification used db index verify.
  Broader unknown-option handling remains an audit observation, not a verified
  fix or a reason to treat unsupported invocations as proof.
- Windows, hosted CI, consumer adoption and external/provider state are unverified.
- Skills reused: goal pursuit, pack execution, boundary classification, closeout,
  source-grounded diagnosis and Codex Security fix workflow. New candidates:none.

## Follow-up Refs

- task/test/goal refs: inspect the completed node and checkpoint frontmatter

# Links / Artifacts

- .mdkg/artifacts/goal-84/bug-36-38-verification.json

# Raw Content Safety

- This checkpoint stores the completion summary and artifact refs, not raw prompts, secrets, payloads, or bulky traces.
