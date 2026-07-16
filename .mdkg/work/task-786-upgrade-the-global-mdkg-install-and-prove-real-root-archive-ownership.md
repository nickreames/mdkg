---
id: task-786
type: task
title: Upgrade the global mdkg install and prove real root archive ownership
status: done
priority: 0
epic: epic-252
tags: [release, upgrade, root-graph, archive]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-785, test-446]
blocks: [task-787]
refs: [goal-71, edd-77, dec-83]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-07-14
updated: 2026-07-15
---
# Overview

Replace the real global CLI with registry mdkg@0.5.1 and prove the motivating
mixed local/imported graph now compresses only locally owned archives.

# Acceptance Criteria

- Verify the resolved global binary and version.
- Run `archive compress --all --json` once against the approved root baseline.
- Receipt lists selected local workspaces and excluded imported projections.
- Only owned local ZIP/sidecar outputs may change; raw files, bundles, children,
  gitlinks, materializations, and unrelated state remain unchanged.
- Root index/validation passes; no bundle sync or child mutation occurs.

# Files Affected

List files/directories expected to change.

- Global installation receipt.
- `/Users/nick/omni-chat-rooms` before/after evidence.

# Implementation Notes

- Compare hashes and Git state before any cleanup or follow-up command.
- A mismatch blocks docs deployment and creates a fix-forward task.

# Test Plan

Close `test-447` with global-path, JSON-selection, hash, Git, and validation
receipts.

# Links / Artifacts

- `test-447`
