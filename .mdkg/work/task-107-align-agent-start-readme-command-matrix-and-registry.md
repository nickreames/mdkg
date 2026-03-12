---
id: task-107
type: task
title: align agent start readme command matrix and registry
status: done
priority: 1
epic: epic-16
tags: [0_0_6, docs, startup, skills]
owners: []
links: []
artifacts: [AGENT_START.md, AGENTS.md, CLAUDE.md, llms.txt, CLI_COMMAND_MATRIX.md, .mdkg/README.md, .mdkg/skills/registry.md, README.md, assets/init/AGENT_START.md, assets/init/AGENTS.md, assets/init/CLI_COMMAND_MATRIX.md]
relates: [dec-19, epic-16, dec-17, dec-18]
blocked_by: []
blocks: [test-60, test-61]
refs: []
aliases: []
skills: [author-mdkg-skill]
created: 2026-03-11
updated: 2026-03-11
---
# Overview

Make every startup and command-reference surface agree on the seeded skill bootstrap, committed-by-default events, and the hybrid command/manual-edit workflow.

# Acceptance Criteria

- startup docs point to SOUL, HUMAN, `.mdkg/README.md`, `CLI_COMMAND_MATRIX.md`, and the seeded planning skill
- registry describes the seeded skills immediately after agent bootstrap
- docs note that product-specific config files outside mdkg skill mirrors are not managed by mdkg

# Files Affected

- `AGENT_START.md`
- `AGENTS.md`
- `CLAUDE.md`
- `llms.txt`
- `CLI_COMMAND_MATRIX.md`
- `.mdkg/README.md`
- `.mdkg/skills/registry.md`

# Implementation Notes

- update init-time asset copies and live root docs together to prevent drift
- keep the command matrix as the canonical command reference

# Test Plan

- `test-60`
- `test-61`

# Links / Artifacts

- `dec-19`
