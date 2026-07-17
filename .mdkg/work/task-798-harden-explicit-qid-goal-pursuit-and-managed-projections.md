---
id: task-798
type: task
title: Harden explicit QID goal pursuit and managed projections
status: done
priority: 1
epic: epic-254
tags: [lifecycle, skills, explicit-qid]
owners: [goal-60-mdkg-child-writer]
links: []
artifacts: [.mdkg/skills/pursue-mdkg-goal/SKILL.md, .agents/skills/pursue-mdkg-goal/SKILL.md, .claude/skills/pursue-mdkg-goal/SKILL.md]
relates: [goal-74, edd-79, dec-85]
blocked_by: []
blocks: [task-799, task-800, test-458]
refs: [goal-74, edd-79, dec-85]
context_refs: [edd-79, dec-85]
evidence_refs: [chk-540]
aliases: []
skills: [pursue-mdkg-goal, author-mdkg-skill]
created: 2026-07-16
updated: 2026-07-16
---
# Overview

Evolve the canonical lifecycle so a supplied explicit goal QID is authoritative,
selected state is only a potentially stale hint, and evidence-supported local
closeout follows explicit ownership and command ordering.

# Acceptance Criteria

- Explicit `goal show`, `goal next`, owner update, and `goal claim` commands use
  the supplied goal/work QIDs.
- Durable checkpoint evidence precedes path-specific local commit guidance.
- `goal evaluate` precedes `goal done`, and done is conditional on evidence.
- Blocked lanes do not stop other actionable scoped work.
- Ordinary lifecycle work explicitly excludes registry credential inspection,
  publish, push, tag, deploy, and provider mutation.
- Configured managed mirrors are exact copies of canonical.

# Files Affected

- `.mdkg/skills/pursue-mdkg-goal/SKILL.md`
- `.agents/skills/pursue-mdkg-goal/SKILL.md`
- `.claude/skills/pursue-mdkg-goal/SKILL.md`

# Implementation Notes

- Keep selection and closeout workflows distinct and unchanged.
- Do not activate, select, or clear any goal in this lane.

# Test Plan

Run `test-458`, skill validation, managed mirror equality checks, explicit goal
show/next/claim/evaluate receipts, and selected-state before/after comparison.

# Links / Artifacts

- `edd-79`
- `dec-85`
- `goal-74`

# Verification Evidence

- `pursue-mdkg-goal` validates with 0 warnings and 0 errors.
- Canonical, both configured mirrors, and public seed are exact matches.
- Selected achieved `root:goal-73` remained unchanged throughout explicit
  `root:goal-74` show, next, and claim operations.
