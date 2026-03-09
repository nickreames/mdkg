---
id: epic-6
type: epic
title: v0.4x llm readable doc artifacts and mdkg dev handoff
status: done
priority: 1
tags: [v0_4x, docs, llm, mdkg-dev]
owners: []
links: []
artifacts: [README.md, llms.txt, AGENT_PROMPT_SNIPPET.md, PACK_EXAMPLES.md, implement-8]
relates: [prd-2, dec-11, edd-9, epic-4, epic-7, epic-8]
blocked_by: []
blocks: [task-57, task-58, task-59, task-64, implement-8, test-26, test-27, test-30]
refs: []
aliases: [llms-txt-followup, mdkg-dev-handoff]
created: 2026-03-05
updated: 2026-03-06
---

# Goal

Track non-blocking follow-up docs artifacts for LLM readability and mdkg.dev launch handoff after CLI v0.4.0 cut, with explicit audience separation for humans and AI agents.

# Scope

- llms.txt artifact contract and implementation
- agent prompt snippet and example pack docs
- pack-first onboarding story for human + agent collaboration
- generic OSS docs posture that keeps `init --llm` primary and `--omni` optional
- minimal mdkg.dev handoff artifacts

# Milestones

- M1: artifact tasks and tests defined
- M2: llms.txt + snippet delivered
- M3: examples and mdkg.dev handoff completed

# Out of Scope

- blocking CLI v0.4.0 tag on website completion

# Risks

- docs may drift if command/help parity audits are skipped

# Links / Artifacts

- prd-2
- epic-4
- dec-11
- edd-9
- implement-8
