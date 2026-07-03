---
id: task-631
type: task
title: classify generic MANIFEST WORK WORK_ORDER RECEIPT release surfaces
status: todo
priority: 1
tags: [goal-48, classification, workflow-files]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [goal-48]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-07-02
updated: 2026-07-02
---
# Overview

Classify release-candidate work across the generic agent workflow surfaces:
MANIFEST, WORK, WORK_ORDER, and RECEIPT.

The output should decide which candidate changes belong to generic mdkg
template/schema/validator/CLI/scaffold/docs behavior, which belong only to an
Omni Room profile, which are runtime consumer responsibilities, and which are
out of scope.

# Acceptance Criteria

- MANIFEST candidates are classified across current `spec_kind`, `role`,
  `runtime_mode`, `resource_profile`, `work_contracts`, capability refs, and
  any proposed `contract_profile` support.
- WORK candidates are classified across current `agent_id`, `kind`,
  capabilities, inputs/outputs, receipt requirements, and profile coupling.
- WORK_ORDER candidates are classified across `work_id`, `requester`,
  trigger/request refs, hashes, input/queue refs, requested outputs,
  constraints, and artifact policy.
- RECEIPT candidates are classified across `work_order_id`, receipt status,
  outcome, cost/proof/attestation refs, evidence hashes, redaction policy, and
  any proposed `receipt_kind` / `redaction_class` support.
- CLI, scaffold, docs, generated references, smoke tests, and release notes are
  classified as generic, profile-specific, or deferred.
- Seed/default template edits remain explicitly gated rather than assumed.

# Files Affected

- Planning updates under `.mdkg/work/**`.
- Future implementation, if approved separately, may touch source, tests,
  docs, generated references, templates, and init assets only after this
  classification is accepted.

# Implementation Notes

- Use a table or checklist that includes at least these columns: surface,
  current behavior, candidate change, owner, compatibility risk, validator
  impact, CLI/scaffold impact, docs impact, tests, and release gate.
- Classify `assets/init/skills/default` and seed/default templates as their own
  blast-radius row.

# Test Plan

- `mdkg validate --changed-only --json`
- Review the matrix against `task-633` inventory and the root boundary handoff.

# Links / Artifacts

- `goal-48`
- `task-633`
