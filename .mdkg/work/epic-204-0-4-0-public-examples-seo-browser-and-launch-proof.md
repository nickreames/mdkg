---
id: epic-204
type: epic
title: 0.4.0 public examples SEO browser and launch proof
status: todo
priority: 2
tags: [0.4.0, examples, seo, browser, launch-proof]
owners: []
links: []
artifacts: [examples, mdkg-dev, docs, scripts]
relates: []
blocked_by: []
blocks: [task-604, task-605, test-308, test-309, test-310]
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-26
updated: 2026-06-26
---
# Goal

Prove the public launch surface through current examples, deterministic demos,
browser checks, SEO/accessibility checks, and no-secret review.

# Scope

- Public examples and demo proof from the latest CLI.
- Browser desktop/mobile launch validation.
- SEO, accessibility, and no-secret content checks.

# Milestones

- `task-604`: examples and deterministic demo proof.
- `task-605`: browser/SEO/accessibility/no-secret proof.
- `test-308`, `test-309`, `test-310`: launch contracts.

# Out of Scope

- DNS, deploy, analytics, publish, tag, or push without explicit approval.

# Risks

- Example drift can weaken public claims.
- Screenshots or receipts must not include private provider UI or secrets.

# Links / Artifacts

- `goal-42`
- `chk-282`
