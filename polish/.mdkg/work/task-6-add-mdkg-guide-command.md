---
id: task-6
type: task
title: add mdkg guide command
status: done
priority: 1
epic: epic-1
tags: [guide, onboarding]
owners: []
links: []
artifacts: [guide-command]
relates: []
blocked_by: []
blocks: []
refs: []
aliases: []
created: 2026-01-21
updated: 2026-01-21
---
# Overview

Add `mdkg guide` to print `.mdkg/core/guide.md`.

# Acceptance Criteria

- `mdkg guide` prints the guide.
- Help output documents the command.

# Files Affected

- src/commands/guide.ts
- src/cli.ts
- .mdkg/core/guide.md
- .mdkg/core/rule-3-cli-contract.md

# Implementation Notes

- Implemented `runGuideCommand` to read and print the guide.

# Test Plan

- `mdkg guide`
- `npm run test`

# Links / Artifacts

- guide-command
