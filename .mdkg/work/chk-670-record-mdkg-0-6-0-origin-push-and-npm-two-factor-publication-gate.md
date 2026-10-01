---
id: chk-670
type: checkpoint
title: Record mdkg 0.6.0 origin push and npm two-factor publication gate
checkpoint_kind: handoff
status: done
priority: 1
tags: [release-0.6.0, publication-gate]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-85/publication-admission-20261001.json, .mdkg/artifacts/goal-85/publication-attempt-20261001.json]
relates: []
blocked_by: []
blocks: []
refs: []
context_refs: [goal-85, goal-86, goal-87]
evidence_refs: [task-831, task-832, chk-570]
aliases: []
skills: []
scope: [task-831, task-832]
created: 2026-10-01
updated: 2026-10-01
---
# Summary

Historical partial handoff: subsequently resolved by Nick's interactive npm
approval and independent registry/install verification in Chk671. The initial
admission and failed-attempt receipt bodies remain unchanged.

ORIGIN_PUSHED / NPM_NOT_PUBLISHED / TWO_FACTOR_APPROVAL_REQUIRED.
Origin/main is verified at31c6c9a158224ccc865bb4cd1d5fa5c651c2c37c after a
normal fast-forward from9652b855. Task831 is done; Task832 is blocked.
Goal85 remains incomplete. This checkpoint is evidence of the partial
handoff, not publication success.

# Scope Covered

Fresh release admission and the single exact-tarball publication attempt.

## Changed Surfaces

- Goal85 lifecycle, Tasks831/832 and these sanitized receipts/checkpoint.
- Origin/main received75 reviewed local commits; no tags or force.
- Derived graph indexes were refreshed and remain excluded from staging.

## Boundaries

- In scope: current approved npm publication, origin push and validation.
- Excluded: tags, deployments/providers, consumers/root/siblings, history
  rewrite, canonical graph migration, repacking and bundle refresh.
- No credentials, one-time codes, raw security reports or operational payloads.

# Decisions Captured

Current Nick release/push approval supersedes historical planning-only labels.
Bugs46/47 remain deferred/unresolved under Goal87, not fixed or accepted.

# Implementation Summary

The qualified artifact was admitted against unchanged package and harness
inputs; authenticated dry-run matched all237 files and sealed integrity.
The outgoing75-commit range had1601 new blobs; bounded screening of1599 text
blobs found no credential-pattern hits. Two historical SQLite index blobs
are part of Git history, not npm payload. This is not exhaustive secret proof.

# Handoff Summary

- Recipient: Nick and this persistent mdkg writer lane.
- Starting work: Task832 after secure interactive npm two-factor approval.
- Recheck registry state before retrying; consume the same sealed bytes.
- Complete registry integrity and clean-install checks before closure.

# Verification / Testing

## Command Evidence

- GitHub/npm identity checks: nickreames; exact public repo/main verified.
- Retained candidate admission and authenticated publication dry-run: pass.
- CLI matrix, docs and package readiness assertion: pass current inputs.
- Graph validation:0 errors,3 pre-existing bundle-age warnings.
- Full tests/platform/security qualification: reused unchanged-input Chk570;
  not represented as a fresh full run.
- Non-force origin push and independent remote SHA check: pass.
- Single npm publish: fail E403 requiring two-factor approval.
- Independent post-attempt mdkg@0.6.0 lookup: E404, no publication observed.

## Pass / Fail Status

- Partial success; publication and post-publish validation remain incomplete.

## Known Warnings

- Existing stale imported-bundle warnings, unchanged selected achieved Goal73.
- One historical EOF blank line in execution-baseline-20260915.json retained
  to preserve receipt bytes; the full outgoing-range diff check is not
  represented as clean. Current working-tree diff check passed.

# Known Issues / Follow-ups

- npm two-factor approval is the current external blocker.
- Windows, hosted CI, website qualification and consumer adoption remain
  explicitly unqualified/deferred, not release acceptance claims.

## Follow-up Refs

- Task832/Goal85; Bugs46/47/Goal87; Epic257/258.

# Links / Artifacts

- Exact tarball SHA256:
  b5497c5f5e5f022e19f10c72512cd23d1dfbfa874e79e384112e293df7bff2bc.
- Goal86 candidate-seal-20260930.json and both Goal85 receipts.

# Raw Content Safety

- Candidate, selected Goal73, runtime database, Demo3 bundle and website
  draft hashes remain unchanged. No runtime writer lease was acquired;
  transient command locks are released. Task832 remains recorded/blocked.
- Skill coverage: release-mdkg-package, pursue-mdkg-goal,
  verify-close-and-checkpoint, safe-git-publication-preflight. Candidates:none.
