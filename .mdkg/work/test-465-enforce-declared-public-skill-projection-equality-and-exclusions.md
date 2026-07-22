---
id: test-465
type: test
title: enforce declared public skill projection equality and exclusions
status: backlog
priority: 1
tags: [audit-followup, skills, public-seed, test]
owners: []
links: []
artifacts: []
relates: [loop-7, task-805]
blocked_by: [task-805]
blocks: []
refs: [loop-7, spike-32, test-461, chk-541, chk-542, dec-85, task-805]
context_refs: []
evidence_refs: []
aliases: []
skills: []
cases: []
created: 2026-07-17
updated: 2026-07-17
---
# Overview

Enforce the membership, equality, and repository-only exclusions declared by
`root:task-805` so future public seed drift is intentional and reviewable.

# Target / Scope

- canonical `.mdkg/skills`, configured mirrors, public init seed, and built seed
- machine-readable projection policy
- disposable `mdkg init --agent` discovery

# Preconditions / Environment

- `root:task-805` is done and its projection policy is validation-clean.
- Build current init assets and use a disposable local fixture.

# Test Cases

- All six declared public members are byte-identical to canonical and both
  configured mirrors.
- Release and service-boundary skills are absent from public/built init output
  and present in canonical/configured local mirrors.
- An unannotated hash difference, missing member, unexpected member, stale
  expected hash, or absent accepted-decision ref fails with the skill identity.
- Fresh init lists exactly the declared public set and `mdkg skill validate`
  passes with zero warnings/errors.

# Results / Evidence

Attach policy, hash matrix, init fixture receipt, and negative cases to a
test-proof checkpoint.

# Notes / Follow-ups

- A future membership change is a decision/policy update, not a test bypass.
