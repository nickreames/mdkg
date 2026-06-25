---
id: test-275
type: test
title: llms txt and llms-full txt formatting and content contract
status: done
priority: 1
epic: epic-185
parent: goal-35
tags: [mdkg-dev, llms, agents]
owners: []
links: []
artifacts: []
relates: [task-555]
blocked_by: [task-555]
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
cases: [plain-text, formatting, agent-readable-content]
created: 2026-06-24
updated: 2026-06-24
---
# Overview

Prove the agent-readable text files are readable, structured, and accurate.

# Test Cases

- Hosted `llms.txt` and `llms-full.txt` preserve headings, bullets, links, and line breaks.
- Content avoids unsupported public claims.
- Browser/Chrome route checks confirm text/plain readability where applicable.
