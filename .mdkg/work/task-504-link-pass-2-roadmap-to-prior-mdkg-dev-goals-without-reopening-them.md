---
id: task-504
type: task
title: link pass 2 roadmap to prior mdkg.dev goals without reopening them
status: done
priority: 1
tags: [mdkg-dev, graph-only]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-503]
blocks: [task-505]
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-23
updated: 2026-06-23
---
# Overview

Connect pass-2 work to prior mdkg.dev planning and implementation without changing achieved goals.

# Acceptance Criteria

- Prior achieved goals remain historical context.
- Goal 31 and Goal 32 reference Goal 30 and the prior feedback design records.
- No achieved goal is reopened or selected.

# Files Affected

- `.mdkg/work/goal-31-*`
- `.mdkg/work/goal-32-*`
- New pass-2 design records.

# Test Plan

- `node dist/cli.js validate --summary --json --limit 20`

# Implementation Notes

# Links / Artifacts
