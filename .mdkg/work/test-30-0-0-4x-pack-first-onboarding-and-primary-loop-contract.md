---
id: test-30
type: test
title: 0.0.4x pack first onboarding and primary loop contract
status: done
priority: 1
epic: epic-6
tags: [v0_4x, docs, onboarding, pack]
owners: []
links: []
artifacts: [README.md, llms.txt, AGENT_PROMPT_SNIPPET.md, PACK_EXAMPLES.md, dec-11, edd-9]
relates: [dec-11, edd-9, task-64, task-66, epic-6, epic-7]
blocked_by: []
blocks: []
refs: []
aliases: []
created: 2026-03-05
updated: 2026-03-06
---

# Overview

Validate that mdkg docs teach a generic, pack-first workflow for human and agent collaboration without making the OSS tool feel Omni-specific.

# Cases

- README generic quickstart keeps `init --llm`.
- Optional `init --omni` is documented as an add-on, not the only entry story.
- Primary workflow emphasizes `pack <id>` over ad-hoc file-reading guidance.
- Primary vs advanced command story is consistent across roadmap docs.

# Evidence

- README.md
- dec-11
- edd-9

# Exit Criteria

- Human and agent onboarding docs describe the same simplified loop.
