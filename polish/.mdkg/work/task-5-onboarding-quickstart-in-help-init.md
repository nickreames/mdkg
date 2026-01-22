---
id: task-5
type: task
title: onboarding quickstart in help + init
status: done
priority: 1
epic: epic-1
tags: [help, init, onboarding]
owners: []
links: []
artifacts: [help-quickstart]
relates: []
blocked_by: []
blocks: []
refs: []
aliases: []
created: 2026-01-21
updated: 2026-01-21
---
# Overview

Make help and init self-contained for README-less onboarding.

# Acceptance Criteria

- `mdkg help` shows a Quickstart block.
- `mdkg init` prints next-step commands.

# Files Affected

- src/cli.ts
- src/commands/init.ts

# Implementation Notes

- Added quickstart to help output.
- Added next steps after init completion.

# Test Plan

- `mdkg help`
- `mdkg init --llm --root .context/smoke-init`

# Links / Artifacts

- help-quickstart
