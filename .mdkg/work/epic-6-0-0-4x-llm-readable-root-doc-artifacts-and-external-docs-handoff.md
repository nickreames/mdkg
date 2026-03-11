---
id: epic-6
type: epic
title: 0.0.4x llm readable root doc artifacts and external docs handoff
status: done
priority: 1
tags: [0_0_4x, docs, llm, handoff]
owners: []
links: []
artifacts: [README.md, llms.txt, AGENT_PROMPT_SNIPPET.md, PACK_EXAMPLES.md, implement-8]
relates: [prd-2, dec-11, dec-14, edd-9, epic-4, epic-7, epic-8]
blocked_by: []
blocks: [task-57, task-58, task-59, task-64, implement-8, test-26, test-27, test-30]
refs: []
aliases: [llms-txt-followup, external-docs-handoff]
created: 2026-03-05
updated: 2026-03-08
---

# Goal

Track non-blocking root-level onboarding artifacts for humans and LLMs, plus the explicit handoff boundary to the external docs site/repo.

# Scope

- llms.txt artifact contract and implementation
- agent prompt snippet and example pack docs
- pack-first onboarding story for human + agent collaboration
- generic OSS docs posture that keeps `init --llm` primary and `--omni` optional
- explicit external docs handoff note

# Milestones

- M1: artifact tasks and tests defined
- M2: llms.txt + snippet delivered
- M3: examples and external handoff completed

# Out of Scope

- blocking the `0.0.4` release on website completion

# Risks

- docs can drift if command/help parity audits are skipped

# Links / Artifacts

- `prd-2`
- `epic-4`
- `dec-11`
- `edd-9`
