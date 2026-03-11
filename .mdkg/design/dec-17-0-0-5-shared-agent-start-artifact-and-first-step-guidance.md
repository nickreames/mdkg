---
id: dec-17
type: dec
title: 0.0.5 shared agent start artifact and first step guidance
status: accepted
tags: [0_0_5, agent, onboarding, docs]
owners: []
links: []
artifacts: [AGENT_START.md, AGENTS.md, CLAUDE.md, llms.txt, CLI_COMMAND_MATRIX.md, .mdkg/core/SOUL.md, .mdkg/core/HUMAN.md]
relates: [dec-16, dec-18, epic-14, epic-15]
refs: []
aliases: [agent-start, first-step-guidance]
created: 2026-03-10
updated: 2026-03-10
---

# Context

Agents do not reliably infer repo workflow from a mixture of README text, help output, and internal graph docs. They need one short startup artifact that explains what to trust first and what to do next.

# Decision

- Add `AGENT_START.md` at repo root as the canonical instant-start artifact.
- Make `AGENTS.md`, `CLAUDE.md`, and `llms.txt` thin wrappers that point to `AGENT_START.md`.
- `AGENT_START.md` must explicitly reference `.mdkg/core/SOUL.md`, `.mdkg/core/HUMAN.md`, `.mdkg/README.md`, `CLI_COMMAND_MATRIX.md`, and the first-step planning skill.
- Promote `select-work-and-ground-context` as the canonical first procedural step when the active task is not yet known.

# Alternatives considered

- Rely on `README.md` or `mdkg help` alone: rejected because they are reference surfaces, not instant-start instruction surfaces.
- Add a new bootstrap skill instead of a startup doc: rejected because skills are not auto-triggered unless startup docs point agents to them.

# Consequences

- Humans and agents get one obvious first file to read.
- Product-specific wrappers stay small and easier to keep in sync.
- The startup flow becomes: read startup doc, read SOUL/HUMAN, then use `mdkg skill list --tags stage:plan --json` and `mdkg pack <id>` as needed.

# Links / references

- `AGENT_START.md`
- `epic-14`
