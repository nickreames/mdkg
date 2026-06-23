---
id: task-469
type: task
title: specify future demo N mdkg.dev preview and promotion policy
status: done
priority: 2
epic: epic-135
parent: goal-27
tags: [mdkg-dev, demo, subdomain]
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

Plan how live demo previews can become durable demo subdomains without impacting canonical mdkg.dev.

# Acceptance Criteria

- Throwaway demos use preview URLs.
- Durable demos use `demo-N.mdkg.dev` only after acceptance.
- Promotion requires no-secret checks, claims review, noindex/canonical policy, and teardown notes.
- Canonical mdkg.dev remains stable during demo iteration.

# Files Affected

- `.mdkg/work/task-469-*`
- Demo/example source only in future implementation goals.

# Implementation Notes

- Treat demo previews as public unless protected by Vercel access.
- Do not promote demos during preview-hosting setup.

# Test Plan

Policy is complete when a future agent can decide preview/discard/promote without inventing acceptance gates.

# Links / Artifacts

- `edd-33`
- `epic-135`
- `examples/demo-agentic-coding`
- `examples/template-mdkg-dev`
