---
id: task-604
type: task
title: validate public examples and deterministic demo proof from latest CLI
status: done
priority: 2
epic: epic-204
parent: goal-42
tags: [0.4.0, examples, demo, latest-cli, proof]
owners: []
links: []
artifacts: [examples, scripts, docs]
relates: []
blocked_by: [spike-22]
blocks: [test-309, task-605, task-606]
refs: [spike-22]
context_refs: []
evidence_refs: []
aliases: []
skills: [build-pack-and-execute-task]
created: 2026-06-26
updated: 2026-06-27
---
# Overview

Validate public examples and deterministic demo proof against the latest mdkg
CLI before the public launch claim is made.

# Acceptance Criteria

- Public examples initialize and validate from the latest local package or
  installed package appropriate for the release gate, including `mdkg@0.3.9`
  where the launch claim depends on published behavior.
- Demo proof uses deterministic commands and bounded artifacts.
- Claims made on mdkg.dev/docs are backed by example evidence.

# Files Affected

- `examples/`
- `docs/`
- smoke scripts or receipts as needed

# Implementation Notes

- Keep generated demo evidence public-safe.
- Do not deploy demo subdomains unless separately approved.

# Test Plan

- `npm run smoke:demo-graph`
- temp-repo example validation
- `test-309`

# Links / Artifacts

- `goal-42`
