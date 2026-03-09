---
id: test-16
type: test
title: v0.4 llms txt prompt snippet and example pack contract
status: done
priority: 1
epic: epic-4
tags: [v0_4, mdkg-dev, llm, docs]
owners: []
links: []
artifacts: [llms.txt, AGENT_PROMPT_SNIPPET.md, PACK_EXAMPLES.md, README.md, .mdkg/design/prd-2-mdkg-dev-website-and-documentation-plan-v0-4.md]
relates: [prd-2, dec-8, dec-9, edd-4, edd-5, task-45, epic-4]
blocked_by: []
blocks: []
refs: []
aliases: []
cases: [llms-txt-contract, prompt-snippet-contract, example-pack-coverage, docs-versioning-contract]
created: 2026-03-04
updated: 2026-03-06
---

# Overview

Validate the planning contract for LLM-readable docs artifacts and examples in the mdkg.dev launch scope.

# Target / Scope

Covers `llms.txt` structure, agent snippet guidance, and example-pack documentation requirements as planning artifacts.

# Preconditions / Environment

- `prd-2` and `task-45` are integrated.
- Agent-memory and architecture docs (`edd-2`, `edd-3`) are already linked.
- Runtime implementation remains unchanged in this pass.

# Test Cases

- Verify `llms.txt` planned fields are explicit and source-truth compatible.
- Verify agent prompt snippet guidance is deterministic and pack-first.
- Verify required sample pack classes are documented (task, edd, skills-included).
- Verify docs versioning expectations are captured for v0.4/v0.5 continuity.

# Results / Evidence

Capture `mdkg show prd-2 --body`, `mdkg show task-45 --body`, and related design node outputs.

# Notes / Follow-ups

- Add file-existence and schema checks once `llms.txt` and docs artifacts are implemented.
- Add quality checks for pack example freshness after CLI behavior changes.
