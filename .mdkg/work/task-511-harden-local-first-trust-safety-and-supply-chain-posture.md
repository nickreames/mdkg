---
id: task-511
type: task
title: harden local-first trust safety and supply-chain posture
status: backlog
priority: 1
tags: [mdkg-dev, trust]
owners: []
links: []
artifacts: [mdkg_preview_polish_pass2]
relates: []
blocked_by: [task-510]
blocks: [task-512, test-240, test-241]
refs: [archive://archive.mdkg-dev-preview-polish-pass-2-2026-06-24]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-23
updated: 2026-06-23
---
# Overview

Strengthen trust copy while avoiding unsupported security claims.

# Acceptance Criteria

- Local-first and low-dependency posture is explained plainly.
- Supply-chain-safe install guidance is present.
- What-mdkg-is-not boundaries are clear.
- Public copy does not imply comprehensive secret scanning, hosted queues, hosted memory, arbitrary SQL, or production agent execution.

# Files Affected

- `mdkg-dev/`
- `docs/`
- README/package metadata copy where appropriate.

# Test Plan

- Trust/no-secret/boundary wording checks.

# Implementation Notes

# Links / Artifacts
