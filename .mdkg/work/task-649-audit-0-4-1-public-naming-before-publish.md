---
id: task-649
type: task
title: audit 0.4.1 public naming before publish
status: todo
priority: 1
parent: goal-50
tags: [0.4.1, contract-profile, naming-audit, publish-readiness]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: [test-337]
refs: [goal-49, goal-50, test-335, task-636, test-332]
context_refs: []
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint]
created: 2026-07-03
updated: 2026-07-03
---
# Overview

Audit the active `mdkg@0.4.1` release/publish/readiness lane before final
prepublish gates so public mdkg claims stay generic.

This task is mdkg-node-only. It does not mutate source, docs, package metadata,
templates, generated docs, downstream repos, npm registry state, tags, pushes,
deployments, DNS, or provider configuration.

# Acceptance Criteria

- `goal-50`, `task-645`, `task-647`, `task-648`, and `test-336` no longer make
  an active downstream product name part of mdkg public release behavior.
- Consumer validation remains allowed only as generic postpublish proof or as a
  downstream-private handoff that cites the actual published package version.
- Public mdkg primitives are described generically: external/source
  descriptors, accepted revision evidence, validation/evidence policy refs,
  receipt/redaction metadata, and generic profile validation.
- Historical/internal graph mentions of downstream product names are not
  broadly rewritten when they are clearly prior context or downstream-owned
  boundary records.
- `test-337` records a strict naming gate that blocks `task-645` until this
  audit is complete.

# Files Affected

- `.mdkg/work/goal-50-publish-mdkg-0-4-1-contract-profile-support-and-validate-consumers.md`
- `.mdkg/work/task-645-run-0-4-1-final-prepublish-gates-and-registry-dry-runs.md`
- `.mdkg/work/task-647-run-0-4-1-postpublish-temp-install-and-workflow-probes.md`
- `.mdkg/work/task-648-prepare-downstream-private-contract-profile-consumer-handoff.md`
- `.mdkg/work/test-336-0-4-1-npm-release-and-postpublish-consumer-validation-contract.md`
- `.mdkg/work/test-337-0-4-1-generic-public-naming-release-gate-contract.md`
- mdkg index/event files produced by mdkg commands

# Implementation Notes

- Do not edit TypeScript/source, package metadata, README/docs, changelog,
  default templates, generated docs, bundles, root files, or downstream repos in
  this task.
- Treat any downstream consumer name as private handoff context, not public mdkg
  primitive naming.
- Keep `contract_profile`, `validation_policy_ref`, `evidence_policy_ref`,
  `receipt_kind`, `redaction_class`, source/external descriptors, accepted
  revision evidence, receipts, and profile validation language generic.

# Test Plan

- `mdkg index`
- `mdkg validate --changed-only --json`
- `mdkg validate --summary --limit 20 --json`
- Targeted `rg` over the active release/publish work nodes for downstream
  product names and profile literals.
- `git diff --check`

# Links / Artifacts

- `goal-50`
- `test-337`
- `test-335`
- `task-636`
