---
id: task-711
type: task
title: Develop an evidence labeled loop value story with the Sales plugin
status: todo
priority: 1
epic: epic-229
prev: task-710
next: task-712
tags: [release, sales, audience, value]
owners: []
links: []
artifacts: []
relates: [goal-62, test-384]
blocked_by: [task-710]
blocks: [task-712]
refs: [test-384]
context_refs: [goal-62, epic-229, edd-71, dec-68, dec-73, prd-11, task-710]
evidence_refs: []
aliases: []
skills: []
created: 2026-07-10
updated: 2026-07-10
---
# Overview

Use Sales `index` routing to turn the capability inventory into a structural
value story for AI coding teams and agent-harness engineers.

# Acceptance Criteria

- Narrative covers audience job, current failure mode, loop workflow, value
  drivers, evidence, limits, and next action.
- Use the causal sequence: recurring audit/process problem, fork and readiness
  workflow, continuation and provenance value, product proof, public-alpha
  caveats, then the `Run a security audit loop` CTA.
- Every claim is labeled Known, Inferred, Assumed, or Missing.
- No invented ROI, adoption, customer quote, or competitive superiority appears.
- Goals remain outcome-oriented; loops are presented as durable processes.
- Security is the primary example and backend/API/CLI bloat is secondary.
- Avoid `self-healing`, autonomous-runtime, built-in scanner, model-routing, and
  sandbox claims that exceed mdkg ownership.

# Files Affected

List files/directories expected to change.

- mdkg planning/design records only

# Implementation Notes

- No CRM or customer connector is required.
- Use dogfood as product evidence, not as a customer outcome claim.
- Purpose-built public examples may be modeled on verified behavior but must not
  copy internal ids, receipts, or raw dogfood transcripts.

# Test Plan

Run `test-384` and obtain operator alignment on the value hierarchy before visual
or copy architecture proceeds.

# Links / Artifacts

- `dec-68`
- `dec-73`
- `prd-11`
