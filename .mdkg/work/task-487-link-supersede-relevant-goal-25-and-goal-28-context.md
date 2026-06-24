---
id: task-487
type: task
title: link supersede relevant goal-25 and goal-28 context
status: done
priority: 1
tags: [mdkg-dev, historical-context, feedback]
owners: []
links: []
artifacts: []
relates: [goal-30]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-23
updated: 2026-06-23
---
# Overview

Keep Goal 25 and Goal 28 as achieved historical context while making Goal 29/30 the new feedback-polish roadmap.

# Acceptance Criteria

- New goals relate to `goal-25` and `goal-28`.
- Existing achieved goals are not reopened or marked active.
- The feedback roadmap is clearly post-preview polish, not a replacement for prior completion evidence.

# Files Affected

- `.mdkg/work/goal-29-*.md`
- `.mdkg/work/goal-30-*.md`
- New design records for feedback polish.

# Test Plan

- `node dist/cli.js goal next goal-30 --json`
- `node dist/cli.js validate --summary --json --limit 20`

# Implementation Notes

# Links / Artifacts
