---
id: task-635
type: task
title: define consumer runtime dependency boundaries for unreleased contract support
status: done
priority: 1
tags: [goal-48, runtime-boundary, release]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [goal-48]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-07-02
updated: 2026-07-02
---
# Overview

Define how Omni Room runtime consumers may depend on mdkg contract-profile
support before, during, and after a generic mdkg release.

The plan must prevent runtime from requiring unreleased mdkg flags or schema
fields unless they are explicitly marked experimental/local and bounded to the
consumer repo.

# Acceptance Criteria

- Stable runtime dependency requires an actual released mdkg package version
  resolved during the later execution pass, not hardcoded in this planning
  goal.
- Experimental/local runtime consumption is allowed only with explicit caveats,
  fallback behavior, and no public contract promise.
- Runtime remains responsible for enforcing Omni Room-specific policy until
  generic mdkg validators expose accepted behavior.
- Root/subgraph refresh, accepted SHA decisions, package release, and runtime
  adoption are separate gates.
- No downstream repo is mutated by this mdkg planning goal.

# Files Affected

- Planning updates under `.mdkg/work/**`.
- Future downstream handoffs may be created only when an explicit owner asks for
  them.

# Implementation Notes

- Capture the difference between generic mdkg semantic mirrors and runtime
  canonical execution state.
- Keep product/backend economics, sandbox provider semantics, and runtime
  execution policy out of the generic mdkg contract unless intentionally exposed
  as refs-only metadata.

# Test Plan

- `test-332`
- Review downstream handoff language for no hardcoded future version and no
  unreleased hard dependency.

# Dependency Boundary Plan

## Stable Dependency Rule

Omni Room runtime, root execution, sandbox/vault, backend, or downstream demos
may treat generic mdkg contract-profile behavior as stable only after all of the
following are true:

- the behavior is implemented in `projects/mdkg`;
- source, tests, CLI help, command matrix, generated docs, and release notes are
  aligned;
- package/build/docs/smoke gates pass;
- npm pack/publish dry-run gates pass;
- the actual package version is resolved from live `package.json` and registry
  state during the later execution pass;
- the package is published only after explicit approval if real publish is in
  scope;
- post-publish install validation proves the released CLI exposes the behavior.

This planning goal intentionally names no future package version.

## Experimental/Local Consumption Rule

Before a stable mdkg release, runtime may use local or experimental fields only
when all caveats are present:

- field use is labeled `experimental`, `local`, or `runtime-profile-only`;
- runtime has its own parser/validator and does not depend on unreleased mdkg
  CLI flags;
- mdkg handoffs state that generic mdkg may rename, reject, or narrow the field;
- public docs and npm package claims do not advertise the behavior as released;
- root/subgraph evidence records the local child SHA and no-push/no-publish
  boundary.

## Ownership Boundary

| Area | Stable owner | Runtime may do before mdkg release | Runtime must not do |
| --- | --- | --- | --- |
| Generic file names and core fields | mdkg | Consume existing released MANIFEST/WORK/WORK_ORDER/RECEIPT fields. | Require unreleased mdkg fields or flags as stable. |
| `contract_profile` syntax | mdkg once implemented | Carry local experimental marker with fallback. | Publish downstream docs that require the field before mdkg release. |
| `receipt_kind` syntax | mdkg once implemented | Use runtime-local receipt kind internally. | Claim generic mdkg receipt-kind validation exists before release. |
| `redaction_class` syntax | mdkg once implemented | Enforce runtime-local classes for its own receipts. | Replace mdkg `redaction_policy` or omit redaction handling. |
| Omni Room room lifecycle | omni-room-runtime | Own parser, queue/lifecycle, AgentBrain, final receipt normalization. | Push runtime-only lifecycle fields into generic mdkg templates. |
| Sandbox/vault descriptors | omni-sandbox-control-plane | Export refs-only descriptors for runtime/root. | Expect mdkg to validate provider semantics beyond refs/hashes. |
| Backend fixture/economics | backend/product lane | Remain fixture/local until explicitly advanced. | Store live ledger, wallet, billing, or tenant state in mdkg. |
| Root orchestration/subgraphs | root repo | Record sanitized handoffs and accepted SHAs. | Refresh subgraphs from dirty/unaccepted child states without gates. |

## Handoff Language For Downstream Repos

Use this wording until release execution proves otherwise:

```text
This repo may carry local experimental mdkg contract-profile fields for Omni
Room proof work. They are not a stable public mdkg contract until a later mdkg
release implements, tests, documents, packs, and publishes them. Consumers must
keep fallback parsing or treat the fields as runtime-profile-only.
```

Stable downstream handoffs must instead cite the actual released package version
and post-publish validation evidence gathered at execution time.

## Gate Separation

- mdkg source implementation gate: source/tests/docs/package dry-run pass in
  `projects/mdkg`.
- npm release gate: explicit approval, registry currentness, real publish, and
  post-publish install validation.
- runtime adoption gate: runtime updates dependency to the released package or
  records an explicit local experimental caveat.
- root/subgraph gate: root records child accepted SHAs and refreshes subgraphs
  only after child repos are clean and accepted.
- downstream deployment gate: separate from mdkg package release; no deploy or
  provider mutation belongs to this planning goal.

# Links / Artifacts

- `goal-48`
- `test-332`
