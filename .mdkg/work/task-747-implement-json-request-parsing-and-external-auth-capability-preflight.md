---
id: task-747
type: task
title: implement JSON request parsing and external auth capability preflight
status: todo
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

- Attach focused parser/auth tests and a Git-not-invoked receipt for every
  preflight rejection class.

# Files Affected

- Git request parser, auth preflight, receipt types, and focused tests.

# Links / Artifacts

- `dec-75`, `dec-77`, and the frozen `task-746` contract.
