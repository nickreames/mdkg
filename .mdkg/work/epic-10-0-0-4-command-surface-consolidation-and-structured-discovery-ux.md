---
id: epic-10
type: epic
title: 0.0.4 command surface consolidation and structured discovery ux
status: done
priority: 1
tags: [0_0_4, cli, ux, json, skills]
owners: []
links: []
artifacts: [CLI_COMMAND_MATRIX.md, README.md, llms.txt, AGENT_PROMPT_SNIPPET.md, AGENTS.md, src/cli.ts, src/commands/list.ts, src/commands/search.ts, src/commands/show.ts, src/commands/skill.ts, .mdkg/skills/author-mdkg-skill/SKILL.md]
relates: [dec-13, dec-12, dec-14, edd-5, edd-7, epic-7, epic-9, epic-11, epic-12]
blocked_by: []
blocks: [task-73, task-74, task-75, task-76, task-77, task-78, task-79, test-37, test-38, test-39, test-40, test-41, test-42]
refs: []
aliases: [command-surface-consolidation, structured-discovery]
created: 2026-03-08
updated: 2026-03-08
---

# Goal

Consolidate mdkg discovery around one skill namespace, add the first structured discovery contract, and simplify the human/agent teaching surface for `0.0.4`.

# Scope

- remove generic skill discovery access
- add JSON output for list/search/show and skill list/search/show
- standardize text-mode counts and empty states
- make the command matrix the canonical reference
- add the internal `author-mdkg-skill` workflow skill

# Milestones

- M1: canonical command matrix and docs aligned
- M2: runtime generic skill access removed
- M3: JSON discovery contract implemented
- M4: author-mdkg-skill dogfooded and indexed

# Out of Scope

- XML, TOON, or Markdown discovery output
- task mutation commands

# Risks

- docs drift if the command matrix stops matching live help
- JSON output can fragment if node and skill envelopes diverge without tests

# Links / Artifacts

- `dec-13`
- `task-73`
- `task-74`
- `task-75`
- `task-76`
- `task-77`
- `task-78`
- `task-79`
