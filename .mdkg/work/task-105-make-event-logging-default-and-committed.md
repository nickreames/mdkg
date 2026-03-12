---
id: task-105
type: task
title: make event logging default and committed
status: done
priority: 1
epic: epic-16
tags: [0_0_6, events, init, memory]
owners: []
links: []
artifacts: [src/commands/init.ts, src/commands/event.ts, src/commands/event_support.ts, src/cli.ts, src/util/argparse.ts, README.md, CLI_COMMAND_MATRIX.md, .mdkg/core/rule-3-cli-contract.md, .mdkg/core/rule-4-repo-safety-and-ignores.md, .mdkg/design/edd-4-mdkg-init-agent-specification-0-0-5.md, .mdkg/design/edd-6-mdkg-event-logs-and-checkpoints-guide-0-0-4-episodic-memory-and-provenance.md, AGENTS.md, AGENT_START.md, assets/init/AGENT_START.md, .mdkg/skills/select-work-and-ground-context/SKILL.md, .mdkg/skills/verify-close-and-checkpoint/SKILL.md, assets/init/skills/default/select-work-and-ground-context/SKILL.md, assets/init/skills/default/verify-close-and-checkpoint/SKILL.md]
relates: [dec-19, epic-16, edd-6]
blocked_by: []
blocks: [test-59, test-62]
refs: []
aliases: []
skills: []
created: 2026-03-11
updated: 2026-03-11
---
# Overview

Reverse the old ignore-first event stance so `init --agent` and `mdkg event enable` produce durable repo memory by default.

# Acceptance Criteria

- init no longer appends `.mdkg/work/events/*.jsonl` to ignore files
- `mdkg event enable` creates or ensures `events.jsonl` and leaves `.gitignore` untouched
- obsolete event-ignore opt-out behavior is removed from runtime help and docs
- validation still passes when `events.jsonl` is absent after manual deletion

# Files Affected

- `src/commands/init.ts`
- `src/commands/event.ts`
- `src/commands/event_support.ts`
- `src/cli.ts`
- docs that currently claim event logs are ignored by default

# Implementation Notes

- keep `.mdkg/index/` and `.mdkg/pack/` ignore behavior unchanged
- frame manual `.gitignore` edits as user choice, not a mdkg default

# Test Plan

- `test-59`
- `test-62`

# Links / Artifacts

- `dec-19`
