id: task-9
type: task
title: implement next (chain first then priority p0..p9)
status: todo
priority: 2
epic: epic-1
relates: [dec-6, rule-3]
tags: [next, priority, chain]
created: 2026-01-06
updated: 2026-01-06

Overview

Implement the mdkg next command to surface the immediate next priority item.

Acceptance Criteria
	•	if an ID is provided and it has next, return the next node
	•	if no next exists, fall back to priority selection
	•	priority selection chooses:
	•	highest urgency priority (lowest number)
	•	preferred statuses first (progress, todo, review, blocked, backlog)
	•	stable tie-breakers
	•	supports --ws <alias> filtering
	•	clear errors for ambiguity and not found

Files Affected
	•	src/commands/next.ts
	•	src/util/sort.ts

Implementation Notes
	•	priority is 0..9 where 0 is highest urgency.
	•	do not attempt to “infer” next if chain has gaps; just fall back.

Test Plan
	•	set task chain and verify next follows chain
	•	set priorities and verify selection returns p0 before p1

Links / Artifacts
	•	dec-6
	•	rule-3
---
id: task-9
type: task
title: implement next (chain first then priority p0..p9)
status: todo
priority: 2
epic: epic-1
tags: [next, priority, chain]
links: [cmd:next, priority:p0-p9, chain:prev-next]
artifacts: [next-chain, next-priority-fallback, status-preference-sort]
relates: [dec-6, rule-3]
blocked_by: []
blocks: []
refs: []
aliases: []
created: 2026-01-06
updated: 2026-01-06
---

# Overview

Implement the `mdkg next` command to surface the immediate next priority item.

# Acceptance Criteria

- if an ID is provided and it has `next`, return the `next` node
- if no `next` exists, fall back to priority selection
- priority selection chooses:
  - highest urgency priority (lowest number)
  - preferred statuses first (progress, todo, review, blocked, backlog)
  - stable tie-breakers
- supports `--ws <alias>` filtering
- clear errors for ambiguity and not found

# Files Affected

- src/commands/next.ts
- src/util/sort.ts

# Implementation Notes

- priority is 0..9 where 0 is highest urgency.
- do not infer next if chain has gaps; just fall back.

# Test Plan

- set task chain and verify next follows chain
- set priorities and verify selection returns p0 before p1

# Links / Artifacts

- dec-6
- rule-3