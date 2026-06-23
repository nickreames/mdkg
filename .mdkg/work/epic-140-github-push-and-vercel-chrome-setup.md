---
id: epic-140
type: epic
title: GitHub push and Vercel Chrome setup
status: todo
priority: 1
tags: []
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

Push accepted implementation work to `origin/main` and create the required Vercel preview projects through Chrome UI.

# Scope

- Commit implementation work locally.
- Push `main` to `origin/main` without force.
- Create Vercel projects `mdkg-dev` and `mdkg-docs` under team `team_RkZhrKQs9wWs6PAdTcrwZ87z`.

# Milestones

- Push succeeds.
- Both Vercel projects exist with correct root/build/output settings.

# Out of Scope

- No DNS binding, production promotion, analytics activation, or stored Vercel secrets.

# Risks

- Chrome may require user authentication or manual approval; stop rather than invent credentials.

# Links / Artifacts

- `task-477`
- `task-478`
- `task-479`
- `test-221`
