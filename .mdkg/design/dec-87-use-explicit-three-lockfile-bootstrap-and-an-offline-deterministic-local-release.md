---
id: dec-87
type: dec
title: Use explicit three-lockfile bootstrap and an offline deterministic local release ladder
status: accepted
tags: [release, prepublish, dependencies, local-only]
owners: []
links: []
artifacts: []
relates: [loop-7]
refs: [loop-7, chk-544, chk-545, dec-85, dec-86]
aliases: []
created: 2026-07-25
updated: 2026-07-25
---
# Context

The Loop 7 audit found three independent lockfile-owned dependency domains:
the root package, `docs`, and `mdkg-dev`. Root `npm ci` does not install the
two site dependency trees, while `scripts/mdkg-dev-smoke-utils.js` can run a
hidden nested `npm ci` when Astro is missing. The current full publication
ladder also rebuilds and repacks the same surfaces repeatedly.

`root:task-802`, `root:test-462`, and `root:chk-545` repaired the separate P0
publish-readiness assertion. This decision governs the remaining local
dependency, package-artifact, smoke-inventory, and build-amplification work. It
does not authorize publication.

# Decision

## Dependency Ownership And Bootstrap

- Preserve independent root, `docs`, and `mdkg-dev` lockfiles. Do not migrate
  these packages to npm workspaces in this hardening goal.
- Add one explicit preflight that checks all three dependency trees before a
  publication ladder begins.
- Missing, extraneous, or unavailable nested dependencies fail closed before
  any smoke runs and identify the exact bootstrap command.
- Smoke helpers must never install dependencies implicitly.
- One explicit registry-capable bootstrap in an isolated fixture is allowed
  when the implementation run has the required tool-level network approval.
  Registry access ends when bootstrap ends.

## Network-Closed Verification

After bootstrap, verification must use:

- `NPM_CONFIG_OFFLINE=true`;
- an empty dedicated verification cache;
- an unreachable registry URL;
- an isolated `TMPDIR`; and
- no nested or registry-backed install.

Local tarball installation remains allowed because it consumes the package
artifact produced by the same run rather than the registry.

## Smoke And Package Identity

- One source-owned machine-readable smoke manifest records every declared
  alias, canonical execution identity, subsystem, prerequisites, environment
  profile, timeout, and future CI membership.
- All 47 declared smoke aliases must be mapped. The 46 canonical executions
  run once because `smoke:bundle-import` delegates to `smoke:subgraph`.
- Build and validate one immutable package tarball, record its SHA-256, and
  reuse that exact artifact for installed-package smokes.
- Preserve `prepack` and publish-readiness safety. Artifact reuse cannot bypass
  package validation.

## Build Bounds

- Count actual compiler and Astro invocations, not npm wrapper calls.
- A complete local ladder performs at most three root builds.
- Docs and marketing builds are bounded at one actual build per normalized
  environment profile.
- The current conservative inventory contains no more than four docs profiles
  and five marketing profiles. Implementation must bind the exact profile list
  in the smoke manifest rather than collapse behaviorally distinct profiles.

## Git And Release Boundary

Planning and later implementation may create local commits on `main`. This
decision does not authorize push, force update, tag, package publication,
deployment, provider mutation, branch-protection changes, or public copy.

# Alternatives considered

- Migrate all three packages to npm workspaces. Rejected because it broadens a
  deterministic-release repair into dependency-topology migration.
- Continue opportunistic nested installs. Rejected because verification would
  remain network-dependent and failures would occur mid-smoke.
- Run all 47 aliases as independent processes. Rejected because it double-runs
  the canonical subgraph execution.
- Enforce one total docs and one total marketing build. Rejected because
  distinct SEO, preview, production, and release profiles carry real behavior.

# Consequences

- `root:goal-77` may split bootstrap correctness from artifact/build reuse.
- The clean-install proof requires an explicit bootstrap authority boundary
  and must describe any unexecuted network evidence honestly.
- Local `prepublishOnly` becomes reproducible after bootstrap and remains
  bounded to 60 minutes on the approved Node 24 runtime.
- The manifest and timing receipts may inform a later CI-topology decision, but
  this decision does not choose or mutate the remote CI topology.

# Links / references

- `root:goal-77`
- `root:loop-7`
- `root:task-802`
- `root:test-462`
- `root:chk-544`
- `root:chk-545`
- `root:dec-85`
- `root:dec-86`
