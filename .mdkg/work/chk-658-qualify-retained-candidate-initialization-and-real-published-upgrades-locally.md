---
id: chk-658
type: checkpoint
title: Qualify retained candidate initialization and real published upgrades locally
checkpoint_kind: test-proof
status: done
priority: 9
tags: []
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-86/test-477-local-bootstrap-qualification.json, .mdkg/artifacts/goal-86/test-477-installed-bootstrap.cjs]
relates: [test-477, task-826, test-487, task-828, task-830, goal-86, dec-98]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [test-477]
created: 2026-09-28
updated: 2026-09-28
---
# Summary

Test477 has a current installed bootstrap/upgrade milestone on one retained
0.6.0 candidate. Actual published 0.5.2 standard/customized upgrades and six
caught-error recovery cases pass locally. Test477 remains progress, not done;
Goal86 remains active and NOT_READY. This is not the final artifact seal.

# Scope Covered

One writer under Goal86/Dec98. Entry custody: 157 preserved dirty paths;
main at 6d23981e70bc68798def73c81b9cd5fa7bc9f3df, 69 ahead/0 behind cached
origin/main. No remote verification, staging or commit. No package-input change.

## Changed Surfaces

- A bounded private Test477 runner reuses existing manifest-backed installed
  init/upgrade smokes and the existing artifact/process/fixture helpers.
- Retained candidate plus a 273-file source-input capture, sanitized receipt,
  Test477/Goal86 evidence, requirement coverage and required mdkg projections.

## Boundaries

- Owned local fixtures and current qualification only. No source feature,
  canonical Git mutation, provider, publication, native helper, migration,
  bundle/subgraph refresh or blocked scan-context recovery.
- Exact locally cached published baseline verified without a download or
  registry credential/configuration inspection. Source revision is not inferred.
- Raw reports, credentials and unrelated runtime payloads remain excluded.

# Decisions Captured

Dec98 governs. Bugs46/47 remain DEFERRED / UNRESOLVED under paused Goal87,
not accepted/fixed. Node24.18.0/24.x capability support supersedes the historical
24.15/26 matrix. Goals85/87 remain paused; no publication authority follows.

# Implementation Summary

Normally pack once, verify the expected SHA256, retain an independent immutable
tarball, and bind source-input capture, runner and consumer hashes. The final
rerun reused those exact bytes without repacking. Each installed smoke retains
its existing owned process supervision and cleanup; no new test framework.

# Test Proof

- Node24.18.0, macOS arm64; candidate SHA256
  6154e4ea920bfa09d57532171df808f3f406250b44b2b318f0bb48542f82cdca.
- Published 0.5.2: 425431 bytes, SHA256
  18b9bb3c474481155ad46c4ce9b06530d5bdcce0812052fc76f7bcc159799540;
  pinned SHA512 integrity also matches. Both actual installed upgrade paths pass.
- Compact default/--agent/graph-only, six canonical skills, sixteen local links,
  two native projections, customized root instructions and project files pass.
- Seven current-upgrade cases, actual standard/customized upgrades and six
  first/middle/last resume/recover cases preserve user bytes and Git staging.
  Customized canonical skill conflicts remain explicit; --only does not erase
  that conflict. Stale reviewed plans refuse before journal creation.
- The six recovery cases inject a caught error after successful rename. They
  are not abrupt process-death evidence; Test479/Test489 remain distinct.

# Verification / Testing

## Command Evidence

- Existing scripts/smoke-init.js: pass, 11791.407 ms.
- Existing scripts/smoke-upgrade.js: pass, 30820.74925 ms.
- Two candidate deliveries/consumptions and two published-baseline installs
  retain exact before/after hashes; 273 source inputs and the capture match.
- Final graph/SQLite/diff results and protected bookends are in the receipt.
  No unrelated full-suite rerun or final-ladder clearance is inferred.

## Pass / Fail Status

- Local intermediate pass. Initial npm pack output parsing failed before any
  product smoke because lifecycle text preceded JSON. Corrected to the existing
  expected final-filename convention and reran both smokes successfully.
- Independent bounded static review also required capture before/after checks;
  corrected and reran against the retained candidate. Final readback found no
  remaining concrete defect in the inspected scope; reviewer did not run tests.

## Known Warnings

- Three historical stale imported-bundle warnings remain; no refresh authority.

# Known Issues / Follow-ups

- Retain exact candidate and input capture for later consumers. The tarball is
  ignored by *.tgz; its retained bytes are not yet a shared or sealed artifact.
- Final macOS/Linux acceptance, independent current-source review, full ladder
  and exact seal remain. Windows is unqualified. No persistent lease acquired.
- Owned successful fixtures and the inspected failed pack-only fixture were
  removed after terminal execution; no unknown work was removed.

## Follow-up Refs

- Test477, Task826, Test487, Task828, Task829, Task830, Goal86 and Dec98.
- Skills reused: goal pursuit, pack-first execution and selective verification.
  New skill candidates: none.

# Links / Artifacts

- .mdkg/artifacts/goal-86/test-477-local-bootstrap-qualification.json
- .mdkg/artifacts/goal-86/test-477-installed-bootstrap.cjs
- .mdkg/artifacts/goal-86/private/candidate-0.6.0-6154e4ea920bfa09.inputs.json

# Raw Content Safety

- Summarize evidence and use refs, hashes, and artifact links instead of raw secrets, raw prompts, raw payloads, or bulky execution traces.
