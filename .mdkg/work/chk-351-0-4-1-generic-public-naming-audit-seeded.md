---
id: chk-351
type: checkpoint
title: 0.4.1 generic public naming audit seeded
checkpoint_kind: audit
status: done
priority: 9
tags: [0.4.1, contract-profile, naming-audit, publish-readiness, no-push]
owners: []
links: []
artifacts: []
relates: [goal-50, task-649, test-337]
blocked_by: []
blocks: []
refs: [goal-49, goal-50, task-649, test-337, test-335]
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [goal-50, task-649, test-337, task-645, task-647, task-648, test-336]
created: 2026-07-03
updated: 2026-07-03
---
# Summary

The `goal-50` publish/readiness lane now has a strict generic public naming gate
before final prepublish work. `task-649` is the active first node, `test-337`
blocks `task-645`, and the goal condition requires generic public mdkg claims
before npm dry-runs or real publish approval.

The active release path now frames mdkg public behavior as generic
CLI/template/schema/validator capabilities: external/source descriptors,
accepted revision evidence, validation/evidence policy refs, receipt/redaction
metadata, and generic profile validation. Consumer validation remains allowed as
installed-package proof or downstream-private handoff only.

# Scope Covered

- `goal-50`
- `task-649`
- `test-337`
- `task-645`
- `task-647`
- `task-648`
- `test-336`

## Changed Surfaces

- Added `task-649` for the 0.4.1 public naming audit.
- Added `test-337` as the generic public naming release gate.
- Rewired `goal-50` to put `task-649` and `test-337` before `task-645`.
- Reframed `task-647`, `task-648`, and `test-336` from product-specific
  consumer claims to generic or downstream-private validation.
- Tightened achieved implementation proof wording in `task-640` and `test-333`
  so validation profile fixtures are not public mdkg primitive names.
- Renamed `task-648` path from downstream product-specific handoff wording to
  downstream-private consumer handoff wording.
- Rebuilt `.mdkg/index/mdkg.sqlite` through `mdkg index`.

## Boundaries

- in scope: mdkg graph work/test/checkpoint nodes and mdkg command-produced
  index state.
- out of scope: TypeScript/source files, package metadata, package lock,
  changelog, README/docs, templates/default, seed/default assets, generated
  docs, bundles, root files, npm publish, tags, pushes, deploys, DNS, provider
  mutation, and downstream repo mutation.
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded:
  yes.

# Decisions Captured

- `goal-50` publish readiness now requires `test-337` before `task-645`.
- Active public release claims must not publish product-specific runtime names or
  policy as mdkg behavior.
- Historical/internal downstream mentions can remain when clearly prior context
  or downstream-owned; no broad historical rewrite was attempted.

# Implementation Summary

The current publish lane now separates three concepts:

- generic mdkg public primitives and validators;
- installed-package release proof from npm registry/temp install;
- downstream-private consumer handoff, which may cite released mdkg evidence
  without branding mdkg public behavior around any consumer runtime.

# Audit Findings

- Reviewed surfaces: `goal-50`, `task-645`, `task-647`, `task-648`,
  `task-649`, `test-336`, and `test-337`.
- Findings: active release/publish work nodes have no `Omni`, `omni-room`, or
  `--profile omni-room` matches after the reframe.
- Residual risk: source/docs/package surfaces were intentionally not edited in
  this mdkg-node-only pass; `task-649` and `test-337` require a future
  publish-readiness agent to audit publish-bound source/docs/package outputs
  before real release.

# Verification / Testing

## Command Evidence

- command: `mdkg index`
- result: passed; wrote `.mdkg/index/global.json`,
  `.mdkg/index/skills.json`, `.mdkg/index/capabilities.json`,
  `.mdkg/index/subgraphs.json`, and `.mdkg/index/mdkg.sqlite`.
- command: `mdkg validate --changed-only --json`
- result: passed; `ok: true`, `warning_count: 0`, `error_count: 0`.
- command: `mdkg validate --summary --limit 20 --json`
- result: passed; `ok: true`, `warning_count: 1`, `error_count: 0`; only known
  warning was `manifest.compat.spec_legacy` for `.mdkg/work/mdkg-cli/SPEC.md`.
- command: targeted `rg -n "Omni|omni-room|--profile omni-room"` over active
  `goal-50` release/publish work nodes.
- result: no matches.
- command: `git diff --check`
- result: passed with no output.

## Pass / Fail Status

- status: pass for the mdkg-node-only seeding scope.

## Known Warnings

- warning: full-summary validation still reports the existing legacy
  `.mdkg/work/mdkg-cli/SPEC.md` compatibility warning, unrelated to this pass.

# Known Issues / Follow-ups

- `task-649` remains the active publish-readiness audit node.
- `test-337` remains blocked by `task-649` and blocks `task-645`.
- Future publish work must rerun the public naming audit against publish-bound
  source/docs/package outputs before npm pack/publish dry-runs.

## Follow-up Refs

- `task-649`
- `test-337`
- `task-645`

# Links / Artifacts

- local commit planned after checkpoint validation; no push authorized.
- dirty state before commit: intended `.mdkg/work/**` changes plus
  `.mdkg/index/mdkg.sqlite`; no unrelated dirty paths observed.
- branch state before commit: `main...origin/main [ahead 16]`.

# Raw Content Safety

- Evidence is summarized with refs and command receipts only. No raw secrets,
  raw prompts, raw provider payloads, or bulky execution traces were recorded.

# No-Push Status

No npm publish, tag, push, deploy, DNS change, provider mutation, package
metadata change, docs/source mutation, or downstream repo mutation occurred in
this pass.
