---
id: spike-16
type: spike
title: research feedback priority grouping and launch-polish risk
status: done
priority: 1
tags: [mdkg-dev, feedback, research, launch-polish]
owners: []
links: []
artifacts: [mdkg_dev_feedback]
relates: [goal-30]
blocked_by: []
blocks: [task-484, task-486]
refs: [archive://archive.mdkg-dev-feedback-user-stories-2026-06-23]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-23
updated: 2026-06-23
---
# Research Question

How should the 60-story `mdkg_dev_feedback/` bundle be grouped so the next implementation run is ambitious, launch-relevant, and still finishable with Browser/Product Design proof and Vercel preview validation?

# Context And Constraints

- Goal 25 created the mdkg.dev/docs workspace.
- Goal 28 deployed current Vercel previews.
- The feedback bundle defines P0, P1, and P2 stories from live preview review.
- Goal 30 should implement P0 plus core P1, then defer P2 and external-side-effect work.

# Search Plan

- Read `mdkg_dev_feedback/MDKG_DEV_FEEDBACK_USER_STORIES.md`.
- Compare priorities against `prd-5`, `edd-28`, `edd-29`, and `edd-30`.
- Identify stories that require DNS, production promotion, analytics activation, GitHub settings mutation, npm publish, or tags.

# Findings

- P0 stories are true launch blockers.
- Several P1 stories are required for public-alpha credibility because they deepen first-run UX, docs, trust, reference, and visual proof.
- P2 stories are valuable but should not block the next push/preview validation loop.

# Options And Tradeoffs

- P0 only: safest, but leaves docs and product proof too thin.
- P0 plus core P1: selected because it balances launch quality with bounded execution.
- All stories: too broad for one validated implementation run.

# Recommendation

Use P0 plus core P1 for Goal 30, and record P2/external-side-effect stories as deferred follow-up work.

# Follow-Up Nodes To Create

- `goal-30`
- `task-489` through `task-498`
- `test-228` through `test-234`

# Evidence And Sources

- `mdkg_dev_feedback/`
- `archive://archive.mdkg-dev-feedback-user-stories-2026-06-23`
- `prd-6`
- `dec-36`

# Skill Candidates
