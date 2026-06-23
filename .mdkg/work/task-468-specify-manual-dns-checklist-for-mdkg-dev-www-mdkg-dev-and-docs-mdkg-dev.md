---
id: task-468
type: task
title: specify manual DNS checklist for mdkg.dev www.mdkg.dev and docs.mdkg.dev
status: done
priority: 1
epic: epic-132
parent: goal-27
tags: [mdkg-dev, dns, domain]
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
# Overview

Document the manual DNS checklist for public launch while keeping DNS mutation outside this alignment pass.

# Acceptance Criteria

- Apex `mdkg.dev` points to the accepted marketing production deployment only after approval.
- `www.mdkg.dev` redirects to apex.
- `docs.mdkg.dev` points to the accepted Starlight docs deployment only after approval.
- DNS record targets are recorded from Vercel UI during execution, not guessed.
- Rollback and propagation checks are included.

# Files Affected

- `.mdkg/work/task-468-*`
- Optional future launch checklist/checkpoint.

# Implementation Notes

- DNS changes are manual in the registrar/DNS provider.
- Never store registrar credentials or DNS tokens in mdkg.

# Test Plan

`test-215` verifies the checklist blocks DNS until preview proof and names exact domains plus rollback checks.

# Links / Artifacts

- `dec-33`
- `dec-34`
- `test-215`
