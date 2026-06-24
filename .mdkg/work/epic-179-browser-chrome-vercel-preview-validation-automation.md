---
id: epic-179
type: epic
title: Browser Chrome Vercel preview validation automation
status: todo
priority: 1
tags: [mdkg-dev, browser, chrome, vercel]
owners: []
links: []
artifacts: []
relates: [goal-34, task-547, test-267]
blocked_by: []
blocks: []
refs: [archive://archive.mdkg-dev-preview-audit-pass-4-2026-06-24, edd-46]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-24
updated: 2026-06-24
---
# Goal

Validate local marketing/docs routes with Browser and Chrome across target viewports and cover pass-4 regressions in smoke automation.

# Scope

Desktop/tablet/mobile local QA, console/nav/overflow/metadata/noindex/no-secret checks, screenshot evidence, and `smoke:mdkg-dev-polish-pass4`.

# Milestones

- Local Browser/Chrome evidence is recorded.
- Pass-4 smoke covers the new regression surface.
- Known tool limitations are documented if either browser surface cannot complete.

# Out of Scope

External mutation flows and production launch checks.

# Risks

- Browser bridge instability.
- Chrome profile state interfering with local proof.

# Links / Artifacts

- `task-547`
- `test-267`
