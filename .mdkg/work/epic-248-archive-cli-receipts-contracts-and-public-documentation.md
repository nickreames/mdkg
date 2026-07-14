---
id: epic-248
type: epic
title: Archive CLI receipts contracts and public documentation
status: done
priority: 1
tags: [archive, cli, json, documentation]
owners: []
links: []
artifacts: []
relates: [goal-70, edd-76, dec-82]
blocked_by: [epic-246, epic-247]
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-07-14
updated: 2026-07-14
---
# Goal

Expose the mutation boundary consistently through JSON, text, help, generated
contracts, public docs, and Unreleased release notes.

# Scope

Additive selection receipts, stable errors, `--all --ws` and qid syntax,
command matrix/contract generation, and source-backed public documentation.

# Milestones

- Receipt contract is deterministic and backward compatible.
- Help, generated artifacts, docs, and changelog checks pass.

# Out of Scope

Website deployment and package version changes.

# Risks

- Generated and handwritten command surfaces can drift.
- Exclusion evidence must remain bounded and deterministic.

# Links / Artifacts

- `task-779`
- `task-780`
- `test-442`
- external links
