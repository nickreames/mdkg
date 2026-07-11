---
id: task-752
type: task
title: add YAML request support for git materialize
status: backlog
priority: 4
tags: [git, materialization, yaml, followup]
owners: []
links: []
artifacts: []
relates: [goal-66]
blocked_by: []
blocks: []
refs: [edd-73, dec-75, dec-78, goal-66]
context_refs: [goal-66, dec-75, dec-78]
evidence_refs: []
aliases: [git-materialize-yaml-followup]
skills: [service-boundary-ownership-check]
created: 2026-07-11
updated: 2026-07-11
---

# Overview

Placeholder for adding YAML as a second input encoding after the JSON v1
contract is published and consumer experience demonstrates a need.

# Acceptance Criteria

- YAML maps to the same canonical request model and request hash as JSON.
- Parser limits, duplicate keys, anchors/aliases, type coercion, and unknown
  fields are decided and tested before implementation.
- JSON remains canonical and backward compatible.
- This task never blocks `goal-66` or `goal-67`.

# Files Affected

- Future parser/docs/tests only after explicit activation.

# Implementation Notes

Do not add a YAML dependency speculatively.

# Test Plan

- Future JSON/YAML canonical equivalence and parser-safety matrix.

# Links / Artifacts

- `dec-78`
