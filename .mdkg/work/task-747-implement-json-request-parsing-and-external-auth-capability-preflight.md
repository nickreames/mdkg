---
id: task-747
type: task
title: implement JSON request parsing and external auth capability preflight
status: done
priority: 1
parent: goal-66
prev: task-746
next: task-748
tags: [goal-66, json, auth, redaction, security]
owners: []
links: []
artifacts: []
relates: [goal-66]
blocked_by: [task-746]
blocks: [task-748]
refs: [goal-66, dec-75, dec-77]
context_refs: [edd-73, dec-64]
evidence_refs: []
aliases: [materialize-json-auth]
skills: [service-boundary-ownership-check]
created: 2026-07-11
updated: 2026-07-15
---

# Overview

Implement file/stdin JSON loading, strict schema validation, request
canonicalization, safe repository/ref normalization, and secret-free external
auth availability checks before any Git subprocess starts.

# Acceptance Criteria

- File and stdin inputs produce the same canonical request hash and one bounded
  JSON failure receipt on invalid input.
- Unknown/missing/wrong-type fields, duplicate semantic inputs, YAML, controls,
  NUL/newline values, option-shaped refs, embedded URL userinfo, unsafe remote
  helpers, and unsupported protocol or policy values fail before Git executes.
- Allowed repository references cover the accepted HTTPS, SSH/scp, Git/file,
  and local-path forms without shell interpolation.
- Auth classes report availability/status/reason only. Discard helper, `gh`,
  environment, and SSH output; never expose values, configured helper text, or
  socket paths.
- Disable interactive credential prompts and bound every parser/preflight error.

# Implementation Notes

- System Git remains the transport executor.
- `access_ref` is retained only as a bounded opaque ref.
- Use argv APIs exclusively; never build a shell command string.

# Test Plan

- `test-411`
- `test-414`

# Completion Evidence

- Implemented a bounded 64 KiB strict JSON parser with duplicate-key and
  trailing-value rejection, exact field allowlisting, portable path/ref
  validation, full SHA-1/SHA-256 identities, and deterministic canonical
  request hashing for file and stdin input.
- Invalid YAML, missing/unknown/wrong-type fields, controls, embedded URL
  userinfo, credential-like query parameters, remote helpers, option operands,
  unsupported protocols, invalid full refs, malformed object IDs, policy
  values, depth, and destination paths all produce one bounded
  `invalid_request` receipt before any Git invocation.
- HTTPS, SSH/SCP-like, Git, file, and local path forms are accepted without
  shell interpolation. Git commands use argv and disable interactive prompts,
  extension transports, hooks, and recursive submodules.
- Auth evidence is limited to capability, availability, bounded status, and
  bounded reason code for unauthenticated, `gh`, SSH-agent, credential-helper,
  and Git-environment classes. Helper/`gh` output, environment values, and SSH
  socket paths are discarded and absent from receipts.
- Compiled focused test evidence: 11/11 tests pass, including a Git-wrapper
  proof that all strict rejection classes execute no Git subprocess and
  auth-output redaction checks for every deterministic local capability case.

# Files Affected

- Git request parser, auth preflight, receipt types, and focused tests.

# Links / Artifacts

- `dec-75`, `dec-77`, and the frozen `task-746` contract.
