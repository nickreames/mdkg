---
id: chk-665
type: checkpoint
title: Record retained candidate installed qualification and remaining platform acceptance
checkpoint_kind: test-proof
status: done
priority: 9
tags: []
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-86/test-479-local-containment-qualification.json, .mdkg/artifacts/goal-86/test-479-real-readonly-qualification.json, .mdkg/artifacts/goal-86/test-479-local-remedies-qualification.json, .mdkg/artifacts/goal-86/test-480-local-compatibility-qualification.json, .mdkg/artifacts/goal-86/test-480-historical-reference-disposition.json, .mdkg/artifacts/goal-86/test-481-local-scale-qualification.json, .mdkg/artifacts/goal-86/test-484-local-generic-qualification.json, .mdkg/artifacts/goal-86/current-finding-qualification-map.json, .mdkg/artifacts/goal-86/requirement-coverage.json, .mdkg/artifacts/goal-86/test-480-local-work-qualification.json, .mdkg/artifacts/goal-86/test-480-private-preview-qualification.json, .mdkg/artifacts/goal-86/test-480-old-client-runtime-qualification.json, .mdkg/artifacts/goal-86/test-483-local-behavior-qualification.json, .mdkg/artifacts/goal-86/test-483-local-pack-controls-qualification.json, .mdkg/artifacts/goal-86/package-closeout-progress-receipt.json]
relates: [test-479, test-480, test-481, test-483, test-484]
blocked_by: []
blocks: []
refs: []
context_refs: [goal-83, goal-84, goal-86, dec-98, dec-99, dec-100, goal-87]
evidence_refs: [chk-664]
aliases: []
skills: []
scope: [test-479, test-480, test-481, test-483, test-484]
created: 2026-09-28
updated: 2026-09-28
---
# Summary

NOT_READY: substantial current-candidate native macOS evidence is complete,
but Linux platform coverage, independent security acceptance, full package
ladder and exact final seal remain open. This checkpoint closes an evidence
milestone, not the test families or Goals83/84/86. Goal85 stays paused.

# Scope Covered

Owner mdkg-project-agent; current main36e075b8. The original186-path baseline
and attributable additions remain preserved. There is no selected-goal change,
runtime lease acquisition, remote action or publication assertion.

## Changed Surfaces

- Added installed qualification drivers and sanitized receipts under
  `.mdkg/artifacts/goal-86/`, updated Tests479/480/481/484 and the requirement ledger.
- No shipped package inputs changed in this tranche. Retained candidate
  SHA2566154e4ea920bfa09d57532171df808f3f406250b44b2b318f0bb48542f82cdca.
- Dec100 input manifest bcc8b6e1ec5aac804e20ef2fe6676ecfdfa8ae367f69e35a884b5b5980c8fe90;
  package inputs cd254a9dd04bcb2dc300f91bef68b900bb40716608d71c1049c8a35daaa9b832;
  harness inputs106f6f40db10787f7e687caa77e37bcba7ea1a0f4899df7554cdece908527676.

## Boundaries

- In scope: installed retained-byte consumer qualification in owned temporary
  fixtures, source-grounded test selection, current mdkg evidence/projections.
- Excluded: remote Git, providers, publication, tags, canonical migration,
  branch/worktree changes, bundle refresh, consumer/root/sibling changes.
- No blocked scan context/report recovery. Synthetic fixtures only; no raw
  security reports, credentials or operational payloads enter these receipts.

# Decisions Captured

Dec100 retains37 package smokes and all local platforms/security/guidance gates.
Nine website smokes and hosted execution remain visible deferred follow-ups.
Dec98 keeps Bugs46/47 DEFERRED / UNRESOLVED under Goal87, not accepted or fixed.
Dec99 requires new independent current-source and full-remediation-diff evidence.

# Implementation Summary

No feature change. The new current-finding map accounts for all14 original
findings:12 with native macOS current-artifact regression families and2 explicit
unresolved deferrals. Bugs58-60 are separate adjacent correctness controls.
Installed CLI versus shipped internal-module proof is labeled, and canonical
production imports were refused in the copied compiled-test runner.

# Test Proof

- Test480:258 cases (242 cache/parity/MCP/pack/archive plus16 changed-warning).
- Test481:15 cases/266 commands;2000 cross-linked tasks and20000 events per
  backend, bounded-history diagnostics and complete goal/blocker routing.
- Test479:203 containment cases,46 real read-only HFS+ volume cases and623
  remedy cases (456 Node tests plus167 transport cases). No deferred fix claimed.
- Test484:six removed Git commands and nine product-specific invocations refuse
  before effects; retained generic controls pass and all152 extraction files
  reverify. Package exclusion and undispatched/adoption-unverified status remain.
- All executed families use Node24.18.0 on native macOS arm64 and exact6154e4ea
  installed bytes. Unknown user bytes/staging and owned cleanup controls pass.
- Real read-only image produced EROFS, was detached and removed. No mounts remain.
- Test480 supplement:three manifest-backed installed archive/work,
  work-invocation and clone/fork smokes pass (19027/22035/5876ms). Exact artifact
  delivery/consumption receipts and owned cleanup are preserved.
- Private2712-file graph preview reproduces task309's exact historical
  mdkg://goal-10 blocker with safe_to_apply=false and no preview/canonical writes.
  The1998ms rehearsal copied only authoring inputs and registered read-only
  bundles; no runtime DB, operational payloads or Git metadata. Copy removed.
- Actual published0.5.2/v2 warm/cold controls and actual Node24.15.0/26.0.0
  runtime refusal/discovery add19 expected safe controls and2 explicitly
  unsupported old-init effects. Old init rewrites the manifest, force-init
  removes schema2; these are not safety passes. Verified temporary downloads
  and the owned fixture were removed; no global runtime installation occurred.
- Linux ARM64/x86_64 full rows, case-level aggregate acceptance, independent
  security review, full37-smoke ladder and seal remain.
- Test483:176 installed behavioral regressions plus22 pack/profile/budget
  controls pass on unchanged234-file payload. Eleven retained behavioral cases
  have native macOS evidence; the website-cache case is deferred to Epic258,
  never counted as passed. Linux rows remain explicitly missing in the ledger.

# Verification / Testing

## Command Evidence

- `node .mdkg/artifacts/goal-86/test-480-installed-compatibility.cjs`:PASS258.
- `node .mdkg/artifacts/goal-86/test-481-installed-scale.cjs`:PASS15/266,
  888805ms. Two migration applies consumed424975ms and420502ms; retain measured
  latency without introducing a performance redesign or new product SLA.
- `node .mdkg/artifacts/goal-86/test-479-installed-containment.cjs`:PASS203,
  57289ms. Repeated once for complete receipt capture after tool truncation;
  cases counted once, not406.
- `node .mdkg/artifacts/goal-86/test-479-readonly-filesystem.cjs`:PASS46,
  18983ms. Earlier restricted-image failure and wrong fixture `next --json`
  invocation remain separate failed setup/harness evidence, not product passes.
- `npm run build:test`:PASS; then
  `node .mdkg/artifacts/goal-86/test-479-installed-remedies.cjs`:PASS623,
  177274ms; source/package/harness/installed identities unchanged.
- `node .mdkg/artifacts/goal-86/test-484-installed-generic.cjs`:PASS4848ms.
- `node scripts/export-consumer-context.js --verify`:PASS152 unchanged files,
  manifest7ad3dc58e759bd8891089ae532bba513170387a610dbbc77084917c11bc9068a.
- `node .mdkg/artifacts/goal-86/test-480-old-client-runtime.cjs`:PASS the
  expected21-row contract in42607ms, distinguishing19 safe controls from2
  unsupported historical effects; earlier harness/DNS failures are preserved.
- Milestone graph validation:full0errors/3preserved stale-bundle warnings;
  changed-only0errors/0warnings; SQLite5/5fresh; diffcheckPASS. Dependency
  analysis finds51 actionable scope records,87 reachable prerequisites, no
  cycles/missing references/invalid scope types. Goal evaluation is report-only.

## Pass / Fail Status

- Native macOS named cases pass; aggregate release status NOT_READY.
- This checkpoint does not replace independent Task828 or final Task829/830.

## Known Warnings

- Three pre-existing stale imported-bundle warnings remain; refresh is withheld.
- Historical reverse-link checkpoints appear in compatibility goal routing,
  but explicit51-node actionable scope and dependency closure remain separate.
- The historical alias-shaped mdkg://goal-10 and mdkg://epic-64 references retain
  an unsupported-condition disposition grounded in the current private preview;
  no immutable identity was invented or history edited.

# Known Issues / Follow-ups

- No authorized Linuxx86_64 executor is yet identified. The unrelated stopped
  ARM64 Lima instance was left untouched; Nick was asked for an approved endpoint.
  Existing nativeARM64 subset49-row proof remains valid, not full matrix proof.
- Finish other missing family rows, then aggregate Task826/Bug7, independent
  Task828, complete package Task829 and exact candidate Task830/Chk570.

## Follow-up Refs

- Tests477-488, Task826, Bug7, Tasks828-830, Chk570; Goals83/84/86 stay open.
- Goal85 remains paused. Epic257/Epic258 and Goal87 remain explicit follow-ups.

# Links / Artifacts

- Local commit36e075b8 contains only two reviewed artifact-custody files;
  `.mdkg/artifacts/goal-86/task-843-local-commit.json` records exact paths.
- main is70ahead/0behind cached origin/main; no remote verification or push.
- Latest protected hashes: selectedGoal73 f996926a868b7c06fb29311fb69c48d862e9dc354404f777df93e1c5443b07ab;
  runtimeDB b1f2bfb3c9ebd254d520eb7f47c12c2fa18daf691056fe97ba1890f94d013a81;
  Demo3bundle741b4644da1d3d1ff3bbd4b9240e22870609f015e49e28170a91748ab024570b;
  draftrelease cd4f252295112d4a509b6a47069ede60da5b215b3a22281ba4f4225b5c96bd91.

# Raw Content Safety

- Sanitized case names, hashes, results and limitations only. Historical scan
  provenance limits remain explicit. Skills reused; new skill candidates:none.
