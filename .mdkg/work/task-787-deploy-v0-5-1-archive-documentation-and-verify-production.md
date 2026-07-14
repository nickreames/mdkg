---
id: task-787
type: task
title: Deploy v0.5.1 archive documentation and verify production
status: todo
priority: 1
epic: epic-253
tags: [release, docs, deployment, browser]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-786, test-447]
blocks: [task-788]
refs: [goal-71, edd-77, dec-83]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-07-14
updated: 2026-07-14
---
# Overview

Deploy source-backed v0.5.1 archive ownership documentation only after registry
and real consumer behavior are proven.

# Acceptance Criteria

- Local mdkg.dev/docs builds and smoke checks pass.
- Deployment corresponds to the intended release commit.
- Live desktop/mobile pages accurately show `--all --ws`, qid targeting,
  imported read-only behavior, receipts, version/install facts, and links.
- Accessibility, metadata, indexing, and no-secret checks pass.

# Files Affected

List files/directories expected to change.

- mdkg.dev/docs deployment evidence and browser captures.

# Implementation Notes

- Do not broaden into a site redesign.
- Fix production defects forward from the published release state.

# Test Plan

Close `test-448` with exact deployment and live browser evidence.

# Links / Artifacts

- `test-448`
