---
id: test-340
type: test
title: mdkg git closeout push-readiness and credential safety contract
status: done
priority: 1
parent: goal-52
tags: [0.4.2, git, remote-git, push-readiness, credential-safety, release-gate]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-656, task-655]
blocks: []
refs: [goal-52, task-656, task-655, dec-63, dec-64, edd-64]
context_refs: []
evidence_refs: []
aliases: []
skills: [service-boundary-ownership-check, verify-close-and-checkpoint]
cases: []
created: 2026-07-05
updated: 2026-07-05
---
# Overview

Validate the `mdkg git` closeout, push-readiness, and direct push safety
contract for `mdkg@0.4.2`.

# Target / Scope

- `goal-52`
- `task-656`
- source, tests, docs, templates, fixtures, generated references, and release
  notes changed by the Git remote lifecycle implementation

# Preconditions / Environment

- `task-651` has selected exact implementation surfaces.
- `task-653`, `task-654`, `task-656`, and `task-655` are done with evidence.

# Test Cases

- Clone/fetch/inspect use system Git CLI behavior and emit credential-safe
  receipts.
- Push readiness fails without explicit remote/branch target.
- Push readiness fails when validation, credential-safety, or closeout gates
  fail.
- Push readiness fails when DB state participated but sealed DB snapshot and
  static Markdown/JSON receipts are missing.
- Direct push succeeds against a safe local temp remote after push-readiness
  gates pass.
- Receipts, docs, fixtures, packs, and generated references contain refs and
  hashes only, never tokens, SSH key material, agent sockets, provider payloads,
  raw prompts, queue bodies, or runtime state roots.
- Project-memory semantic query UX is not claimed by the `0.4.2` release lane.

# Results / Evidence

Pending.

# Notes / Follow-ups

- Real remote push, npm publish, tag push, provider mutation, downstream repo
  mutation, and root bundle refresh require separate explicit approval.
