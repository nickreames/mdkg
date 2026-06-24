---
id: spike-18
type: spike
title: research pass-3 feedback into product trust docs and preview QA model
status: done
priority: 1
epic: epic-165
tags: [mdkg-dev, research, product, pass-3]
owners: []
links: []
artifacts: []
relates: [goal-33]
blocked_by: [task-520]
blocks: [task-521, task-522, task-523]
refs: [archive://archive.mdkg-dev-polish-pass-3-2026-06-24]
context_refs: []
evidence_refs: []
aliases: []
skills: [select-work-and-ground-context]
created: 2026-06-24
updated: 2026-06-24
---
# Research Question

How should the pass-3 feedback be translated into a low-risk implementation sequence that improves public trust, docs clarity, and preview QA without expanding mdkg.dev beyond public-alpha scope?

# Research Plan

- Re-read the archived pass-3 handoff.
- Compare each recommendation against current mdkg.dev/docs state before implementation.
- Identify command examples that require CLI contract verification.
- Identify public meta/scaffold wording that should move out of user-facing pages.
- Confirm Browser/Chrome/Vercel validation requirements before closeout.

# Expected Output

- A story map recorded in `chk-225`.
- Updated implementation plan if current source differs from the archived assumptions.
- Follow-up nodes only for work that should not block pass-3 polish.

# Context And Constraints

# Search Plan

# Findings

- Command examples are a trust boundary; public examples need a smoke that checks representative syntax, not only page existence.
- The marketing homepage carried internal mdkg.dev graph IDs that looked like product syntax. Public examples should use generic `goal-1`, `task-1`, `test-1`, and archive-like refs.
- `/docs` should not be public scaffold/meta commentary. A small noindex bridge is safer than a broken route while the docs host remains canonical.
- Product and docs pages should avoid launch-operation chores as public roadmap content.

# Options And Tradeoffs

- Keep all examples hand-authored: readable, but drifts without smoke coverage.
- Generate all examples from command metadata: robust, but too mechanical for beginner pages.
- Use hand-authored beginner examples plus smoke-enforced invariants: best fit for pass-3.

# Recommendation

Use hand-authored beginner-safe examples in marketing and start-here docs, keep advanced variants in reference docs, and enforce representative examples with `smoke:mdkg-dev-polish-pass3`.

# Follow-Up Nodes To Create

# Skill Candidates

# Evidence And Sources

- archive://archive.mdkg-dev-polish-pass-3-2026-06-24
- chk-225
- chk-226
