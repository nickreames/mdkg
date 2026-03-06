---
id: epic-4
type: epic
title: v0.4 agent memory skills and omni bootstrap
status: progress
priority: 1
tags: [v0_4, roadmap]
owners: []
links: []
artifacts: []
relates: [prd-1, prd-2, dec-8, dec-9, dec-10, edd-2, edd-3, edd-4, edd-5, edd-6, edd-7, edd-8, epic-5, epic-6, epic-7]
blocked_by: []
blocks: [task-33, task-34, task-35, task-36, task-37, task-38, task-39, task-40, task-41, task-42, task-43, task-44, task-45, task-46, task-47, task-48, task-49, implement-6, implement-7, test-9, test-10, test-11, test-12, test-13, test-14, test-15, test-16, test-17, test-18, test-19, epic-5, epic-6, epic-7]
refs: []
aliases: [v0.4]
created: 2026-02-27
updated: 2026-03-05
---

# Goal

Deliver the v0.4 documentation and implementation planning framework for deterministic semantic, procedural, and episodic memory in mdkg.

# Scope

- plan `init --omni` and compatibility with `--llm`
- plan safer init ignore defaults
- plan deterministic skills metadata indexing
- plan optional skill inclusion in packs
- plan `SOUL.md` and `HUMAN.md` core-node documentation contracts
- plan episodic event log JSONL conventions and checkpoint guidance
- plan external-orchestrator memory update guidance (single-writer and batched commits)
- plan skills query/display and node->skill validation capability coverage
- plan contract freeze and gap-closure stream via `epic-5`
- deliver mdkg.dev-oriented messaging work as tracked tasks
- deliver mdkg.dev website/docs/SEO/LLM-readability planning work as tracked tasks

# Milestones

- M1: source-truth docs aligned and v0.4 PRD/decision captured
- M2: omni/init/safety planning tasks defined and validated
- M3: skills + pack integration planning tasks defined and validated
- M4: episodic log and mdkg.dev messaging tasks defined and validated
- M5: architecture gap tasks/tests for skills query + cross-validation defined and validated
- M6: memory model guidance (edd-3) integrated and linked to implementation roadmap
- M7: decision philosophy rollup (dec-9) integrated and linked to v0.4 docs
- M8: mdkg.dev website/docs plan (prd-2) integrated with executable work nodes
- M9: init-omni feature spec (edd-4) integrated with scaffold/pin contract coverage
- M10: skills integration guide (edd-5) integrated with authoring/security usage contracts
- M11: episodic event logs + checkpoints guide (edd-6) integrated with provenance and commit-cadence guidance
- M12: gap-closure contract freeze stream integrated (`dec-10`, `edd-7`, `edd-8`, `epic-5`)

# Out of Scope

- implementing v0.4 code changes in this documentation integration pass
- introducing vector DBs, hosted services, or non-file memory layers

# Risks

- planning artifacts may drift from source if not validated regularly
- unclear command contracts for skills/events could delay implementation

# Links / Artifacts

- `prd-1`
- `prd-2`
- `dec-8`
- `dec-9`
- `edd-2`
- `edd-3`
- `edd-4`
- `edd-5`
- `edd-6`
- `edd-7`
- `edd-8`
- `dec-10`
- `epic-5`
- `rule-3`
- `rule-4`
