---
id: task-842
type: task
title: Align Node-only runtime compatibility and release qualification
status: done
priority: 1
tags: [nodejs, portability, release-0.6.0]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-86/node-portability/runtime-qualification.json]
relates: []
blocked_by: []
blocks: []
refs: [goal-86, bug-60, task-827, test-487]
context_refs: [goal-86, dec-98, task-827, test-487]
evidence_refs: [chk-653]
aliases: []
skills: [build-pack-and-execute-task, verify-close-and-checkpoint]
created: 2026-09-28
updated: 2026-09-28
---
# Overview

Goal: make the approved Node-only 0.6.0 contract consistent across package
metadata, CLI diagnostics, owned documentation and qualification infrastructure.
Owner mdkg-project-agent. This follows the bounded Bug60 proof and Task841
recovery contract; it must not claim final artifact or platform acceptance.

# Acceptance Criteria

- Supported Node versions and required built-in SQLite capabilities are tested
  and truthful. Missing capabilities fail early with useful diagnostics; no
  silent OS-specific or side-effecting fallback. Preserve graph-format policy.
- Package, lockfile, release manifest/CI, installed fixtures and owned guidance
  agree on supported runtime choices and unsupported-version controls.
- Separate portable functional cases from POSIX-only proof and harness
  assumptions. Preserve process/fixture custody; unsupported harness execution
  reports unqualified instead of silently skipping required acceptance.
- Reconcile the Linux stub with the portable contract while preserving real
  macOS/Linux installed-candidate gates. No hosted dispatch in this task.
- Bugs46/47 are consistently described as deferred/unresolved under Goal87,
  never accepted/fixed. Release notes state the remaining limitations.
- Full/security/coverage/seal duties remain; Windows is unqualified until tested.

Local completion requires the contract changes and focused positive/refusal
checks. Test489 and Test487 consume the completed contract as separate final
installed/platform gates; this task must not wait on its own downstream tests.

# Files Affected

- package.json/package-lock.json and required Node capability admission
- scripts/smoke-manifest.json, CI generator/projection and release validators
- Portable installed fixture/runtime selectors and directly affected tests
- README, CLI command reference and release-critical owned draft guidance
- Current mdkg qualification/dependency records; historical receipts preserved

# Implementation Notes

- Do not remove benign Windows path or npm adapters to achieve a misleading
  zero-platform-reference count. Remove restrictive runtime branches.
- No new runtime/native dependency, unsupported compatibility promise or broad
  docs redesign. Retain exact candidate invalidation and package allowlisting.
- Approved local fixtures only; no VM/service/remote/provider changes.

# Test Plan

Run package/command/docs/CI parity and focused installed tests on each retained
runtime plus missing-capability controls. Review a fresh package manifest for
native/tool dependencies. Bind source/runtime identities and preserve failures.
Test489 precedes installed aggregate acceptance; Test487 still owns genuine
platform qualification. Full release ladder and exact seal are not substituted.

# Links / Artifacts

## Local implementation milestone - 2026-09-28

Node >=24.18.0 <25 is now the consistent supported range. Shared capability
admission covers both CLI entrypoints, direct SQLite observation and doctor;
missing capabilities or unsupported versions refuse before workspace discovery.
Help/version and ordinary unsupported-option diagnostics remain available.
Package/lockfile, README/install/quickstart, draft changelog, release manifest,
generated CI, validators and regression tests agree. The Linux stub remains
fail-closed for portable installed qualification, not native-helper remediation.

Both new entrypoint regressions failed before the fix. Runtime/nearby tests
pass67/67; runtime/CI/release contract tests27/27; public release/goal contracts
23/23. A234-file installed intermediate artifact passes8 real CLI workflows,
25 memory-observer cases and4 actual Node26 no-write refusals. The normal loop
smoke, including package/install lifecycle, passes on the same tarball hash.
Build, CLI/docs/CI/package and skill checks pass. Source/path/runtime identities,
failed setup attempts, cleanup and protected state are in runtime-qualification.json.

The final combined DB/index/snapshot/allocation/runtime/CLI/doctor/release
selection passes343/343, zero failures/skips, on unchanged source inputs.

Task842 is a local contract milestone, not Test489, Test487, independent security
acceptance or final release readiness. Task841 still owns OS-bound recovery;
Bugs46/47 remain deferred/unresolved. Windows and final Linux proof are absent.
The old local24.15 binary is unavailable; version-matrix tests cover its refusal,
but no fresh24.15 executable run is claimed. No full-ladder or final seal claim.

- Dec98, Bug60, Task841, Test489, Task827, Test487 and Goal85.
- Skill candidates: none.
