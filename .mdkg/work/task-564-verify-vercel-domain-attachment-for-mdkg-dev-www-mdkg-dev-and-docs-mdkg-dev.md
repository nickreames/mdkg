---
id: task-564
type: task
title: verify Vercel domain attachment for mdkg.dev www.mdkg.dev and docs.mdkg.dev
status: done
priority: 1
epic: epic-190
parent: goal-36
tags: []
owners: []
links: []
artifacts: [chk-256]
relates: []
blocked_by: [task-563]
blocks: []
refs: []
context_refs: []
evidence_refs: [chk-256]
aliases: []
skills: []
created: 2026-06-24
updated: 2026-06-24
---
# Overview

Verify, or attach if needed, the production custom domains in the correct Vercel projects.

# Acceptance Criteria

- `mdkg.dev` and `www.mdkg.dev` are attached to Vercel project `mdkg-dev`.
- `docs.mdkg.dev` is attached to Vercel project `mdkg-docs`.
- Chrome UI evidence is captured when the Vercel tool metadata is insufficient.
- Vercel project receipts list the expected domains and any pending configuration warnings.
- No unrelated Vercel project is mutated.

# Files Affected

- mdkg checkpoints/evidence only unless Vercel configuration requires follow-up documentation.

# Implementation Notes

- Use Vercel tools for read-only project/deployment metadata.
- Use Chrome for authenticated Vercel UI confirmation and any required domain attachment.

# Test Plan

- Vercel project domain list contains the expected custom domains.
- Chrome screenshot or receipt shows healthy domain configuration state.

# Links / Artifacts

- Vercel project `mdkg-dev`
- Vercel project `mdkg-docs`
