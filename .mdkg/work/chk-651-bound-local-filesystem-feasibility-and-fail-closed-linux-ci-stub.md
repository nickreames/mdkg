---
id: chk-651
type: checkpoint
title: Bound local filesystem feasibility and fail-closed Linux CI stub
checkpoint_kind: test-proof
status: backlog
priority: 9
tags: []
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-86/filesystem-feasibility/receipt.json]
relates: [bug-46, bug-47, test-487, goal-86]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [bug-46, bug-47, test-487]
created: 2026-09-28
updated: 2026-09-28
---
# Summary

Owned local experiments found a feasible OS-level direction for Bug46/47 but
did not produce a production mdkg fix. A generated manual-full GitHub Actions
Test487 x64/ARM64 stub now fails closed and blocks aggregate release acceptance
until exact installed-artifact Linux tests replace it. No hosted job ran.
Goal86 remains active and NOT_READY; Goal85 remains paused.

# Scope Covered

Scope: root:bug-46, root:bug-47, root:test-487 within explicit root:goal-86.
Selected Goal73, canonical runtime DB and protected Demo3 bundle remain outside
this work. Source HEAD at experiment time: `6d23981e70bc68798def73c81b9cd5fa7bc9f3df` on main.

## Changed Surfaces

- Experimental source and sanitized receipt under
  `.mdkg/artifacts/goal-86/filesystem-feasibility/`; Bug46/47, Test487,
  Epic257, Dec97 and Goal86 were updated as evidence/routing records.
- `scripts/smoke-manifest.json`, `scripts/generate-ci-workflow.js`,
  `scripts/release-ladder.js`, `scripts/assert-publish-ready.js`,
  `.github/workflows/release-readiness.yml`, and
  `tests/ci-topology.test.ts` gained the local fail-closed CI stub.
- No production `src/` filesystem code, package inputs, public copy, release
  version, remote state, or provider state changed.

## Boundaries

- In scope: synthetic owned local macOS/Ubuntu ARM64 filesystem feasibility;
  generated local CI gate scaffolding; scoped graph evidence/projections.
- Out of scope: production native integration, hosted dispatch, x64 or installed
  package qualification, final scan acceptance, bundle refresh, canonical
  branch/worktree changes, commit/push/tag/publication/deployment.
- Raw secrets, prompts, operational payloads, and bulky traces were excluded.
  Only synthetic fixture strings and compact results are retained.

# Decisions Captured

Dec97 remains historical for its original Node-only/no-VM/no-workflow-edit
boundary. Nick's 2026-09-28 continuation narrowly allowed local experiments
and a local CI stub, not a general native runtime or hosted qualification run.
Dec96's macOS/Linux release gate remains unchanged; the next material decision
is native interface/distribution and fail-closed fallback design.

# Implementation Summary

Node's regular file-copy control retained 0600 mode but lost a restrictive
named macOS ACL. A deterministic validation-to-sink ancestor swap reached
outside read/append/remove sentinels in current compiled mdkg code. The
experimental C fixture, using held directory descriptors and relative OS
operations, kept all five tested sinks inside the original directory after
the swap on macOS and Ubuntu ARM64. It also established matching owner,
group, mode and ACL on a replacement inode before writing bytes in positive
controls. These are promising primitives, not a product remedy; both atomic
writers, callbacks, packaging and failure paths remain unimplemented.

# Test Proof

- Test target: Bugs46/47 local primitive feasibility and Test487 fail-closed
  workflow topology, not final release acceptance.
- Owned fixtures: disposable macOS directories and an isolated local Lima VZ
  Ubuntu24.04.4 ARM64/ext4 guest with no host mounts. The guest was stopped and
  deleted; its exact host scratch tree was removed after retaining source.
- Coverage gaps: Linux x64, Node24 installed candidate, cross-principal cases,
  ACL/owner failure injection, all contained-path sinks/callers, independent
  security review, full ladder, exact artifact seal and hosted CI.

# Verification / Testing

## Command Evidence

- `node .mdkg/artifacts/goal-86/filesystem-feasibility/node-baseline-probe.cjs dist/core/filesystem_authority.js`: expected current-code ACL loss and
  outside-sentinel read/append/remove reproduction on macOS arm64/Node26.
- Experimental C fixture compiled with `clang -Wall -Wextra -Werror -O2`
  on macOS and with guest GCC/libacl on Ubuntu ARM64; descriptor and metadata
  positive controls passed in both owned environments. Exact hashes and
  results are in the linked receipt; no compiled binary is retained.
- `npm run build`, `npm run build:test`, `npm run ci:workflow:check`: pass.
- `node --test dist/tests/ci-topology.test.js dist/tests/release-ladder.test.js`:
  19/19 pass, zero failures or skips.
- Ruby YAML parser accepted the generated workflow; `actionlint` was not
  installed, so GitHub-specific workflow validation is unverified.
- Full graph validation passed with three pre-existing stale imported-subgraph
  warnings; changed-only validation passed without warnings; DB index verify
  reported all five caches fresh; `git diff --check` passed.
- Selected Goal73, runtime project DB and private Demo3 bundle SHA-256 bookends
  matched the pre-experiment values. No files were staged or committed.

## Pass / Fail Status

- Local primitive and workflow-stub tests: PASS for stated limited controls.
  Production Bug46/47 remedies and Test487 release gate: NOT_READY.

## Known Warnings

- The CI job deliberately exits 1 if a future full workflow is dispatched;
  this is a visible unqualified gate, not a test failure to suppress.
- Native C fixture is experimental and not a supported mdkg dependency.

# Known Issues / Follow-ups

1. Choose a narrow native addon versus versioned helper interface, package
   provenance, platform support and fail-closed behavior before production
   integration. A mode-only or repeated-path-check patch is not clearance.
2. Replace the stub with exact-candidate macOS/Linux x64/ARM64 installed tests
   under separate hosted dispatch and resource authority, then complete the
   independent security review, full ladder and seal.

## Follow-up Refs

- root:bug-46; root:bug-47; root:test-487; root:task-828;
  root:goal-86; root:goal-85; root:epic-256; root:epic-257.

# Links / Artifacts

- `.mdkg/artifacts/goal-86/filesystem-feasibility/receipt.json` binds probe
  sources, source/binary hashes, environments, results and limits.
- No PR, local commit, push, hosted job, tag or publication in this phase.

# Raw Content Safety

The receipt contains summarized synthetic evidence and hashes; no secrets,
real graph payloads, blocked scan context, or bulky traces are embedded.
