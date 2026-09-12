---
id: chk-600
type: checkpoint
title: Verify current installed security regressions across all required runtimes
checkpoint_kind: test-proof
status: done
priority: 9
tags: []
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-84/bug-7-installed-security-regressions.json]
relates: [root:bug-7]
blocked_by: []
blocks: []
refs: [goal-83, goal-84, task-826, task-828, test-479, test-482]
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [bug-7, test-479, test-482]
created: 2026-09-11
updated: 2026-09-11
---
# Summary

All twelve locally fixed original Standard security findings now have current
installed-package regression coverage on Node24.15.0,24.18.0 and26.0.0:
14unique suites,292tests per runtime,876passing executions,zero failures/skips.
Bug17 is excluded and remains open. This is passing-after qualification, not
new independent security clearance or final 0.6.0 release acceptance.

# Scope Covered

Bug7 installed qualification; test479 containment portions and test482 runtime
evidence. Reuse unchanged regression source for bugs8-16 and18-20, with original
failing-before receipts linked individually. No achieved bug is reopened.

## Changed Surfaces

- Compact per-finding artifact, this checkpoint, linked evidence nodes and index.
- No product, regression-source, instruction, skill or package-input changes.

## Boundaries

- Owned external compiled-test harness and synthetic disposable graph fixtures.
- Canonical source is read only; child CLI and module calls resolve installed dist.
- No canonical migration, protected bundle/runtime/selection change, remote Git,
  provider, publication, deployment, consumer or sibling action.
- Raw traces remain in owned temporary storage; durable evidence uses hashes.

# Decisions Captured

No material policy decision accepted. Existing old-writer, killed-writer and
config-less public-bundle compatibility questions remain unanswered.

# Implementation Summary

Freshly compiled tests and helpers are copied outside the repository. Shipped
modules and CLI resolve through links to the existing installed candidate; a
CommonJS guard rejects canonical runtime imports. Per-suite results reject any
failure, timeout, signal, absent count, skip, cancellation or TODO. Canonical
and installed-file hashes remain unchanged through all three runtime runs.

# Test Proof

- Candidate tarball SHA256:39575a351ed5eb7b7074721102863aa3000a842630f7ed2597e30d490a1f349b.
- Direct tarball comparison matches all223installed regular files byte-for-byte;
  222files also match canonical build inputs, excluding package.json normalization.
- Positive installed-module and negative canonical-module guard controls pass.
- /private/tmp/mdkg-installed-security.prJunP contains three runtime receipts,
  logs and exact harness/provenance source. All42suite fixture directories removed.
- Tests include ordinary behavioral controls, not876distinct vulnerabilities.
  Shared suites overlap in the per-finding map;292is the unique runtime total.

# Verification / Testing

## Command Evidence

- npm run build:test passes; all42installed suite executions pass.
- Closing source/CLI/docs/graph checks are recorded in the linked artifact.

## Pass / Fail Status

- Bounded installed regression proof passes; aggregate qualification NOT_READY.

## Known Warnings

- macOS arm64 only; no new Windows, real read-only mount, active hostile-writer
  race, extended ACL/ownership, or killed-writer recovery claim.
- Custody proves recorded regular-file bytes, inventory, HEAD and Git index;
  not all ignored files, modes or empty directories. Guard is not a sandbox.
- Independent functional harness review found no blocking defect. Its package
  provenance caveat was addressed by direct tarball comparison. Not task828.

# Known Issues / Follow-ups

- Bug17, old-client adoption, killed-writer recovery and historical references.
- Final independent security diff, draft0.6metadata, complete release ladder,
  real read-only-mount qualification and exact immutable artifact seal.

## Follow-up Refs

- bug7,bug17,task826,task828,tests479/480/482,goals83/84/85.

# Links / Artifacts

- .mdkg/artifacts/goal-84/bug-7-installed-security-regressions.json
- Source baseline:c6c7bf08a4328fb4d91fb8840e8eb2b9d18117f5.
- Skills:pursue-mdkg-goal,build-pack-and-execute-task,verify-close-and-checkpoint,
  safe-git-publication-preflight. New skill candidates:none.

# Raw Content Safety

- Summarize evidence and use refs, hashes, and artifact links instead of raw secrets, raw prompts, raw payloads, or bulky execution traces.
