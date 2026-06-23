---
id: epic-134
type: epic
title: preview validation with Browser Chrome and Vercel evidence
status: backlog
priority: 1
tags: [mdkg-dev, validation, browser, chrome, vercel]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-22
updated: 2026-06-22
---
# Goal

Define the evidence required before any preview can be treated as launch-candidate feedback material.

# Scope

- Browser and Chrome route validation.
- Vercel deployment status/log inspection.
- Metadata, sitemap, robots, `llms.txt`, responsive layout, and no-secret checks.
- Screenshot/receipt evidence expectations.

# Milestones

- Create the preview validation checklist.
- Define pass/fail evidence fields for handoff.
- Require separate marketing and docs preview checks.

# Out of Scope

- Running Browser/Chrome validation in this alignment pass.
- Clicking external links or transmitting forms.
- Treating preview proof as public launch approval.

# Risks

- Preview deployment protection can require an authenticated share URL.
- Metadata may differ between preview URLs and final domains.

# Links / Artifacts

- `task-467`
- `test-216`
- `chk-196`
- `chk-199`
