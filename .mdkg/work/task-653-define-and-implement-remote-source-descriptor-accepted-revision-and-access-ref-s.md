---
id: task-653
type: task
title: define and implement remote source descriptor accepted revision and access-ref schemas
status: todo
priority: 1
parent: goal-52
tags: [remote-git, source-descriptor, accepted-revision, access-ref, validation]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-651]
blocks: [task-654, test-339]
refs: [goal-51, task-650, test-338, dec-61, dec-62, dec-64, edd-62, edd-64]
context_refs: []
evidence_refs: []
aliases: []
skills: [service-boundary-ownership-check, verify-close-and-checkpoint]
created: 2026-07-03
updated: 2026-07-05
---
# Overview

Define and implement the schema and validation layer for remote source
descriptors, accepted revision evidence, and opaque authenticated access refs.

# Acceptance Criteria

- Source descriptors support generic repository or bundle source context
  without product-specific names.
- Accepted revision evidence records branch/tag/commit/hash/actor/ref/timestamp
  and validation receipt refs without implying deployment policy.
- Access refs and policy refs are accepted as opaque references only.
- Access refs are validated as external Git auth handles, capability refs,
  policy refs, or proof hashes; mdkg does not resolve or store credentials.
- Raw credentials, PATs, SSH key material, agent socket paths, and provider auth
  payloads are rejected or diagnosed before release.
- Fixtures cover valid generic values, unknown-but-shaped custom values,
  malformed refs, secret-shaped values, and visibility/redaction boundaries.

# Files Affected

- source schema/validator modules selected during `task-651`
- tests and fixtures
- generated docs only after validation behavior is stable

# Implementation Notes

- Preserve existing MANIFEST/WORK/WORK_ORDER/RECEIPT semantics.
- Prefer refs and hashes over copied remote payload data.

# Test Plan

- focused schema/validator tests
- `npm run test`
- targeted credential-safety fixture audit
- `node dist/cli.js validate --json`

# Links / Artifacts

- `dec-61`
- `dec-62`
- `dec-64`
- `edd-62`
- `edd-64`
- `test-339`
