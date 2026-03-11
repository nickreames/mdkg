---
id: epic-4
type: epic
title: 0.0.4 agent memory skills and omni bootstrap
status: done
priority: 1
tags: [0_0_4, roadmap]
owners: []
links: []
artifacts: [README.md, llms.txt, AGENT_PROMPT_SNIPPET.md, CLI_COMMAND_MATRIX.md, .mdkg/design/prd-2-mdkg-dev-external-docs-handoff-note.md]
relates: [prd-1, prd-2, dec-8, dec-9, dec-10, dec-14, dec-15, edd-2, edd-3, edd-4, edd-5, edd-6, edd-7, edd-8, epic-5, epic-6, epic-7, epic-9, epic-10, epic-12]
blocked_by: []
blocks: [task-33, task-34, task-35, task-36, task-37, task-38, task-39, task-40, task-41, task-42, task-43, task-44, task-45, task-46, task-47, task-48, task-49, implement-6, implement-7, test-9, test-10, test-11, test-12, test-13, test-14, test-15, test-16, test-17, test-18, test-19, epic-5, epic-6, epic-7, epic-9, epic-10, epic-12]
refs: []
aliases: [0.0.4, agent-memory]
created: 2026-02-27
updated: 2026-03-08
---

# Goal

Track the `0.0.4` memory, skills, onboarding, and safety work for the mdkg CLI repo.

# Scope

- init/bootstrap planning and implementation tracking
- deterministic skills metadata indexing and pack inclusion
- external-orchestrator and single-writer guidance
- event log JSONL conventions and checkpoint guidance
- first-class skill authoring and skill namespace UX
- focused task lifecycle mutation and opt-in event logging
- local root-doc onboarding artifacts that stay in this repo

# Milestones

- M1: memory and skills planning completed
- M2: first-class skill authoring and discovery completed
- M3: focused task/event workflow completed
- M4: mdkg.dev planning externalized from the CLI repo

# Out of Scope

- mdkg.dev website implementation
- hosted services, vectors, or non-file memory layers

# Risks

- local docs can still drift without regular command-matrix audits

# Links / Artifacts

- `prd-1`
- `prd-2`
- `dec-8`
- `dec-9`
- `dec-10`
- `dec-14`
- `dec-15`
