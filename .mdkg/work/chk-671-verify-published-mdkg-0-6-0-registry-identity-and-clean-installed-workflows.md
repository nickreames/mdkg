---
id: chk-671
type: checkpoint
title: Verify published mdkg 0.6.0 registry identity and clean installed workflows
checkpoint_kind: goal-closeout
status: done
priority: 1
tags: [release-0.6.0, publication]
owners: [mdkg-project-agent]
links: [https://www.npmjs.com/package/mdkg/v/0.6.0]
artifacts: [.mdkg/artifacts/goal-85/publication-admission-20261001.json, .mdkg/artifacts/goal-85/publication-attempt-20261001.json, .mdkg/artifacts/goal-85/post-publish-validation-20261001.json]
relates: []
blocked_by: []
blocks: []
refs: []
context_refs: [goal-85, goal-86, goal-87, epic-257, epic-258]
evidence_refs: [task-831, task-832, chk-570, chk-670]
aliases: []
skills: []
scope: [task-831, task-832]
created: 2026-10-01
updated: 2026-10-01
---
# Summary

PUBLISHED_VERIFIED. Public npm mdkg@0.6.0 and latest=0.6.0 are independently
observed. The downloaded canonical registry tarball exactly matches the sealed
b5497c5f5e5f022e artifact. Clean installed-package validation passed on
macOS ARM64 Node24.18.0. This supersedes Chk670's partial handoff outcome
without rewriting its historical admission/failed-attempt evidence.

# Scope Covered

Goal85 publication admission, exact-artifact publication and independent
post-publication verification. Tasks831/832 satisfy the explicit goal condition.

## Changed Surfaces

- Public npm version0.6.0 and latest dist-tag, with interactive Nick approval.
- Origin/main fast-forwarded9652b855 to31c6c9a158224ccc865bb4cd1d5fa5c651c2c37c.
- Goal85, Tasks831/832, two checkpoints and three sanitized JSON receipts.
- Required graph projections refreshed; derived SQLite cache remains unstaged.

## Boundaries

- In scope: Nick's current npm publication, origin push, post-publish validation,
  supported goal lifecycle/evidence, reviewed explicit-path local evidence commit.
- Excluded: tags, force/history rewrite, deployments/providers, consumer/root/
  sibling changes, repacking, canonical graph migration and bundle refresh.
- No credentials, one-time codes, raw security context or operational payloads.

# Decisions Captured

Direct0.6.0 publication followed exact-artifact qualification. Bugs46/47 remain
deferred/unresolved under Goal87, not accepted/fixed. Website and hosted work
remain follow-ups; those surfaces are not implied by npm publication.

# Implementation Summary

Fresh GitHub/npm auth identified nickreames. The first agent publication was
E403 for two-factor approval; Nick securely completed the npm browser challenge
using the sealed bytes. Metadata and then tarball propagation were independently
verified, without republish or policy bypass. Original attempt receipt retained.
Only evidence/lifecycle changed locally; no package inputs changed.

# Goal Closeout

- Goal condition: exact version published, seal matched and clean install verified.
- Scoped nodes: Task831 fresh admission and Task832 publication/install verification.
- Goal85 evaluated with completion evidence present and is achieved; the
  supported done transition cleared active_node and retained Task832 as history.
- Deferred: Goal87 hardening, Epic257 hosted checks, Epic258 website/docs work.

# Verification / Testing

## Command Evidence

- Current admission/CLI/docs/publish-readiness checks: pass; no repack.
- Full2389-test/37-smoke/platform/security qualification reused from Chk570
  only after unchanged-input admission and byte-identical registry download.
- Registry version/integrity/SHA1/engines/bin and latest tag: pass.
- npm pack mdkg@0.6.0 downloaded published bytes with ignore-scripts; SHA256
  b5497c5f5e5f022e19f10c72512cd23d1dfbfa874e79e384112e293df7bff2bc.
- Clean npm install mdkg@0.6.0 with normal postinstall: pass; installed lockfile
  SHA512 matches sealed integrity. No canonical source imports substituted.
- 31 commands:25 positive controls and six expected removed-command refusals
  with complete fixture inventories proving no changes.
- Version/help, compact/graph-only/customized/repeated init, node lifecycle,
  show/search/pack/skills, validation and read-only Git inspect: pass.
- Final graph full: zero errors, three pre-existing bundle-age warnings;
  changed-only: zero errors/warnings. SQLite index fresh/verified; working and
  staged diff checks passed. Exact allowlist is in the publication receipt.

## Pass / Fail Status

- Post-publication acceptance PASS; no unexpected installed-test failures.

## Known Warnings

- Three pre-existing imported-bundle age warnings preserved; no refresh authority.
- Temporary npm metadata/tarball CDN404 resolved before verification.
- One historical outgoing receipt EOF blank line preserved, not represented
  as a clean full-history diff check. Current evidence diff checks pass.

# Known Issues / Follow-ups

- Bugs46/47 unresolved deferrals; no claim of zero undiscovered bugs.
- Linux platform evidence is prepublication unchanged-byte proof, not a fresh
  Linux registry-install run. Windows, hosted CI, website and adoption unqualified.

## Follow-up Refs

- Goal87; Epic257/258. No publication tasks remain after supported closure.

# Links / Artifacts

- Published: https://www.npmjs.com/package/mdkg/v/0.6.0
- Candidate source b10870355b264355af2be4fc53bb4640851f747b; pushed source/evidence
  HEAD31c6c9a158224ccc865bb4cd1d5fa5c651c2c37c before this closure commit.
- See the three Goal85 receipts and Goal86 candidate-seal-20260930.json.

# Raw Content Safety

- Before/after hashes match for selected Goal73, runtime DB, Demo3 bundle,
  website draft and retained candidate. No runtime lease was acquired; transient
  locks released and goal completion clears active_node. Derived index custody
  stays with mdkg and is excluded from staging. Temporary fixtures cleaned after
  compact evidence preservation; no global config or host install changed.
- Skill coverage: release-mdkg-package, pursue-mdkg-goal,
  verify-close-and-checkpoint, safe-git-publication-preflight. Candidates:none.
