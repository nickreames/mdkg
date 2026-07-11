---
id: dec-75
type: dec
title: mdkg git materialize is JSON request driven and clone remains compatible
status: accepted
tags: [git, materialization, json, compatibility]
owners: []
links: []
artifacts: []
relates: [goal-66]
refs: [edd-73, dec-63, goal-52]
aliases: [git-materialize-command-contract]
created: 2026-07-11
updated: 2026-07-11
---

# Context

`mdkg git clone` is a useful low-level primitive but cannot express one
caller-selected identity and policy transaction without overloading its stable
positional interface.

# Decision

Add `mdkg git materialize --request <file|->`. V1 accepts JSON only and requires
`schema: mdkg.git.materialize.request.v1`. The request separates stable
`source_ref` identity from the execution-time cloneable `repository_ref`.
`mdkg git clone` remains behaviorally and syntactically unchanged.

# Alternatives considered

- Add expected-revision flags directly to `git clone`. Rejected because it
  mixes an interactive low-level command with a versioned transaction model.
- Accept YAML in v1. Deferred so parsing, canonicalization, and package
  compatibility do not delay the JSON contract.

# Consequences

The implementation must add descriptor/schema, help, generated contract,
docs, and packed-package parity without regressing clone. YAML support remains
a non-blocking follow-up task.

# Links / references

- `edd-73`
- `goal-66`
- `task-752`
