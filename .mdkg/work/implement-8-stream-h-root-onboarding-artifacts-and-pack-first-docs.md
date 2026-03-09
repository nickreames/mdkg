---
id: implement-8
type: task
title: implement stream h root onboarding artifacts and pack first docs
status: done
priority: 1
epic: epic-6
tags: [v0_4x, implementation, docs, onboarding, pack]
owners: []
links: []
artifacts: [README.md, llms.txt, AGENT_PROMPT_SNIPPET.md, PACK_EXAMPLES.md]
relates: [dec-11, edd-9, task-57, task-58, task-59, task-64, test-26, test-27, test-30, epic-6]
blocked_by: []
blocks: [test-26, test-27, test-30]
refs: []
aliases: [stream-h, root-onboarding]
created: 2026-03-05
updated: 2026-03-06
---

# Overview

Implement the root-first onboarding artifacts and align README around the simplified pack-first story.

# Acceptance Criteria

- Root artifacts exist: `llms.txt`, `AGENT_PROMPT_SNIPPET.md`, `PACK_EXAMPLES.md`.
- README teaches the same generic pack-first loop.
- `init --llm` remains the generic OSS entry path and `init --omni` remains optional.

# Files Affected

- README.md
- llms.txt
- AGENT_PROMPT_SNIPPET.md
- PACK_EXAMPLES.md

# Implementation Notes

- Root-first only; no new docs tree in this phase.
- Keep content source-truth aligned to current CLI behavior.

# Test Plan

- Satisfy `test-26`, `test-27`, and `test-30` via source-truth review and validation.

# Links / Artifacts

- epic-6
