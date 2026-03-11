---
id: prd-2
type: prd
title: mdkg dev external docs handoff note
tags: [external, mdkg-dev, docs, handoff]
owners: []
links: []
artifacts: [README.md, llms.txt, AGENT_PROMPT_SNIPPET.md, PACK_EXAMPLES.md, CLI_COMMAND_MATRIX.md]
relates: [dec-14, epic-6]
refs: []
aliases: [mdkg.dev, docs-handoff, external-docs]
created: 2026-03-04
updated: 2026-03-08
---

# Problem

The CLI repo had accumulated mdkg.dev website and SEO planning that belongs in a separate docs/site repo.

# Goals

- preserve a clear handoff note for the external docs repo
- keep the local CLI repo focused on shipped runtime, root onboarding artifacts, and source-truth contracts

# Non-goals

- no active website backlog remains in this repo
- no docs-site implementation or hosting choices are tracked here

# Requirements

- root onboarding artifacts remain discoverable in this repo
- the canonical command matrix stays local to the CLI repo
- the external docs repo can use this note as a handoff anchor

# Acceptance Criteria

- mdkg.dev planning is no longer treated as active local CLI work
- local root docs remain source-aligned to the shipped CLI

# Metrics / Success

- `epic-4` no longer carries mdkg.dev tasks as open blockers
- `README.md`, `llms.txt`, and `CLI_COMMAND_MATRIX.md` remain the local onboarding truth

# Risks

- the handoff note can drift if the external docs repo stops refreshing from local source truth

# Open Questions

- what repo and deployment stack will own the external docs site
- how often the external docs repo should refresh from the CLI repo command matrix
