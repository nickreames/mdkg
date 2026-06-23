---
id: task-461
type: task
title: archive selected Browser screenshots receipts and update evidence checkpoints
status: done
priority: 1
epic: epic-129
parent: goal-26
tags: [mdkg-dev, browser-evidence, archive]
owners: []
links: []
artifacts: []
relates: [goal-26, task-458, task-459, test-210]
blocked_by: [task-460]
blocks: []
refs: []
context_refs: []
evidence_refs: [chk-199, archive://archive.mdkg-dev-browser-e2e-goal26-2026-06-22]
aliases: []
skills: [verify-close-and-checkpoint]
created: 2026-06-22
updated: 2026-06-22
---
# Overview

Archive selected Browser screenshots and E2E receipt files as mdkg evidence after reviewing them for raw secret-like content.

# Acceptance Criteria

- Screenshot and receipt artifacts are reviewed for raw secret, prompt, token, credential, or payload markers.
- Selected artifacts are archived with `mdkg archive add` or an equivalent mdkg archive sidecar flow.
- Archive refs are attached to relevant tasks/tests/checkpoints.
- Archive verification passes.

# Files Affected

- `.mdkg/archive/**`
- `.mdkg/work/chk-*`
- Relevant goal-26 task/test evidence refs.

# Implementation Notes

- Archive selected screenshots, not every temporary capture.
- Keep raw local temp files out of the repo unless archived intentionally.

# Test Plan

- `node dist/cli.js archive verify <archive-uri> --json`
- `node dist/cli.js validate --summary --json --limit 20`

# Links / Artifacts

- test-210
- chk-199
- archive://archive.mdkg-dev-browser-e2e-goal26-2026-06-22

# Closeout Evidence

- Selected Browser evidence zip created from reviewed viewport screenshots and bounded JSON receipt.
- Private archive artifact: archive://archive.mdkg-dev-browser-e2e-goal26-2026-06-22.
- `node dist/cli.js archive verify archive://archive.mdkg-dev-browser-e2e-goal26-2026-06-22 --json`: pass.
