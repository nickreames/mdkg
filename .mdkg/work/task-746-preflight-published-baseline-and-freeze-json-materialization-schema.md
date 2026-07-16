---
id: task-746
type: task
title: preflight published baseline and freeze JSON materialization schema
status: done
priority: 1
parent: goal-66
next: task-747
tags: [goal-66, preflight, schema, json, 0.5.2]
owners: []
links: []
artifacts: []
relates: [goal-66]
blocked_by: []
blocks: [task-747]
refs: [goal-66, edd-73, dec-75, dec-76, dec-77, dec-78]
context_refs: [goal-52, goal-64, goal-65, goal-71, edd-73]
evidence_refs: []
aliases: [materialize-schema-preflight]
skills: [select-work-and-ground-context, service-boundary-ownership-check]
created: 2026-07-11
updated: 2026-07-15
---

# Overview

Record the current source, global, registry, and published-package baseline,
then freeze the strict v1 request and bounded receipt contracts before source
implementation begins.

# Acceptance Criteria

- Confirm `goal-64`, `goal-65`, and `goal-71` are achieved; source/global/npm
  latest remain `0.5.1`; and `mdkg@0.5.2` is absent at execution time.
- Freeze `schema: mdkg.git.materialize.request.v1` with stable source/access
  refs, credential-free `repository_ref`, declared auth capability, full
  `target_ref`, required expected commit, optional expected tree, contained
  relative destination, full-or-positive depth, `deny|ignore` submodules,
  `required|optional|forbidden` project memory, and optional correlation and
  refs-only evidence fields.
- Freeze `mdkg.git.materialize.receipt.v1` success/failure behavior, bounded
  reason codes, request hash, identity/policy/auth/cleanup evidence, JSON exit
  semantics, output limits, and redaction rules.
- Reject unknown fields, YAML, controls, embedded credentials, option-shaped
  refs, unsupported transports/policies, malformed object ids, absolute or
  escaping destinations, and unsafe local path shapes before Git runs.
- Define auth availability checks for unauthenticated, `gh`, SSH agent,
  credential helper, and Git-native environment-mediated access without
  resolving or recording secret values.

# Implementation Notes

- Do not hardcode `0.5.2` into the wire schema or receipt.
- Detect SHA-1/SHA-256 object format through system Git.
- `access_ref` remains opaque correlation evidence, not a secret resolver.
- Caller-owned cancellation/timeout semantics must be explicit before engine
  implementation starts.

# Test Plan

- `test-411`
- `test-414`
- `test-415`

# Completion Evidence

- Baseline on 2026-07-15: source package, global `mdkg`, and npm latest all
  report `0.5.1`; `npm view mdkg@0.5.2 version` returns the expected registry
  404. Goals `goal-64`, `goal-65`, and `goal-71` are achieved.
- Frozen request schema `mdkg.git.materialize.request.v1` is a strict JSON
  object with required fields `schema`, `source_ref`, `repository_ref`,
  `access_ref`, `auth_capability`, `target_ref`, `expected_commit`,
  `destination`, `depth`, `submodule_policy`, and
  `project_memory_policy`. Optional fields are `expected_tree`,
  `correlation_ref`, and bounded unique `evidence_refs`.
- Frozen enums are `unauthenticated|gh|ssh-agent|credential-helper|git-environment`,
  `deny|ignore`, and `required|optional|forbidden`; depth is `full` or a
  positive integer. Object IDs are full lowercase SHA-1 or SHA-256 values and
  target refs are full `refs/heads/*` or `refs/tags/*` refs.
- Frozen receipt schema `mdkg.git.materialize.receipt.v1` contains only the
  request hash, bounded source/access/correlation/evidence refs, expected and
  observed object identities, object format, policy outcomes, relative
  destination state, cleanup state, bounded reason code, and constant
  warnings. It excludes `repository_ref`, raw Git/helper output, environment
  values, absolute paths, socket paths, and repository content.
- Focused compiled test evidence: 10/10 materialization tests pass for
  file/stdin equivalence, strict rejection before Git, identity mismatch,
  containment, auth availability, depth, SHA-256, submodules, project memory,
  hook/no-push boundaries, redaction, and cancellation cleanup.

# Files Affected

- Generic Git schema, command, tests, docs, and generated-contract surfaces
  selected after the source/package baseline audit.

# Links / Artifacts

- `goal-66`, `edd-73`, and accepted decisions `dec-75` through `dec-78`.
