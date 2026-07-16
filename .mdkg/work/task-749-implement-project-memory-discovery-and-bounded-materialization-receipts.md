---
id: task-749
type: task
title: implement project memory discovery and bounded materialization receipts
status: done
priority: 1
parent: goal-66
prev: task-748
next: task-750
tags: [goal-66, project-memory, receipt, redaction, validation]
owners: []
links: []
artifacts: []
relates: [goal-66]
blocked_by: [task-748]
blocks: [task-750]
refs: [goal-66, dec-77]
context_refs: [edd-73]
evidence_refs: []
aliases: [materialize-discovery-receipts]
skills: [service-boundary-ownership-check]
created: 2026-07-11
updated: 2026-07-15
---

# Overview

Implement `required|optional|forbidden` `.mdkg` discovery and deterministic
success/failure receipts without indexing, executing, or retaining cloned
content.

# Acceptance Criteria

- `required` demands `.mdkg/config.json` and passing non-mutating validation;
  `optional` accepts absence but rejects malformed discovered memory; and
  `forbidden` rejects any `.mdkg` directory.
- Discovery uses current mdkg validation internals in a no-persist mode and does
  not write indexes, events, project DB state, packs, bundles, or skill mirrors.
- Discovery never executes repository scripts, hooks, skills, package managers,
  provider commands, or cloned binaries.
- Success and JSON failure receipts follow the frozen schema and include only
  bounded refs, hashes, identity/policy outcomes, cleanup state, and reason
  codes with deterministic ordering.
- Local absolute repository refs become bounded labels plus hashes;
  destinations remain root-relative; raw Git/repo/auth output is excluded.

# Test Plan

- `test-414`
- installed-package cases in `test-415`

# Completion Evidence

- Implemented exact `required|optional|forbidden` discovery. Required demands a
  regular non-linked `.mdkg/config.json` and passing in-process validation;
  optional accepts absence and rejects malformed discovered memory; forbidden
  rejects any discovered `.mdkg` entry.
- Validation uses `collectValidateReceipt` directly, with no CLI invocation,
  index write, event append, pack/bundle generation, DB migration, skill sync,
  package manager, provider command, or repository-controlled executable. A
  bounded materialization ceiling rejects hostile validation limits before
  graph discovery.
- Receipts deterministically expose only bounded refs, canonical request hash,
  a credential-free repository transport/label/ref-hash descriptor, accepted
  object identities, policy results, relative destination, cleanup state,
  reason code, and constant warnings. Absolute local/file source paths appear
  only as basename-derived labels plus SHA-256 hashes.
- Success and failure tests prove receipts remain below 8 KiB for the covered
  contract, raw repository/Git/helper/environment/socket content is absent,
  project-memory failures retain only presence/validity/error counts, and
  validation creates no tracked, untracked, or ignored generated files.
- Compiled focused test evidence: 13/13 pass, including valid required memory,
  optional absence, malformed optional memory, forbidden memory, inert package
  and shell-script fixtures, absolute-local source redaction, and clean Git
  state after accepted validation.

# Files Affected

- Materialization discovery, validation projection, receipt serialization, and
  negative fixtures.

# Implementation Notes

- Reuse non-persisting graph validation APIs; do not invoke the cloned CLI or
  hydrate its generated indexes.

# Links / Artifacts

- `dec-77`, `test-414`, and `test-415`.
