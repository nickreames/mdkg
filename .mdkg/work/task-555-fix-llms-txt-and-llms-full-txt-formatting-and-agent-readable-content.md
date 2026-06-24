---
id: task-555
type: task
title: fix llms txt and llms-full txt formatting and agent-readable content
status: todo
priority: 1
epic: epic-185
parent: goal-35
tags: [mdkg-dev, llms, agents, docs]
owners: []
links: []
artifacts: []
relates: [test-275]
blocked_by: [task-554]
blocks: [task-556]
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-24
updated: 2026-06-24
---
# Overview

Make the agent-readable text files useful as plain text instead of flattened or hard-to-parse blobs.

# Acceptance Criteria

- `llms.txt` and `llms-full.txt` preserve headings, bullets, links, and line breaks.
- The files describe current capabilities without unsupported claims.
- Hosted preview route checks verify `text/plain` readability.

# Test Plan

- Pass-5 smoke for text formatting.
- Hosted preview route checks after Vercel redeploy.

# Files Affected

# Implementation Notes

# Links / Artifacts
