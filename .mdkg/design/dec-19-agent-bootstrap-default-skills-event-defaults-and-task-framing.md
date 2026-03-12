---
id: dec-19
type: dec
title: agent bootstrap default skills event defaults and task framing
status: accepted
tags: [0_0_6, agent, skills, events, ux]
owners: []
links: []
artifacts: [src/commands/init.ts, src/commands/event.ts, src/commands/event_support.ts, src/commands/skill_mirror.ts, AGENT_START.md, CLI_COMMAND_MATRIX.md]
relates: [epic-16, dec-16, dec-17, dec-18, edd-4, edd-6]
refs: []
aliases: [default-skills, committed-events, hybrid-task-markdown]
created: 2026-03-11
updated: 2026-03-11
---
# Context

Real `mdkg init --agent` usage exposed three product gaps:

- the bootstrap created an empty skill system instead of immediately useful mdkg skills
- event logs were scaffolded but defaulted to gitignored provenance
- docs framed `mdkg task ...` too strongly as a replacement for manual node editing

The release target for 0.0.6 is a more guided default experience, not a redesign of task command ergonomics.

# Decision

- `mdkg init --agent` seeds three canonical mdkg usage skills by default:
  - `select-work-and-ground-context`
  - `build-pack-and-execute-task`
  - `verify-close-and-checkpoint`
- seeded skills come from init assets, not from this repo's live `.mdkg/skills/` tree
- seeded skills are create-if-missing and skip same-slug canonical skills unless `--force`
- `.mdkg/skills/` remains canonical; `.agents/skills/` and `.claude/skills/` mirror from it
- event logs are committed by default; mdkg no longer adds `.mdkg/work/events/*.jsonl` to `.gitignore`
- `mdkg event enable` becomes a create/ensure command only and no longer edits ignore files
- deleting `events.jsonl` manually is tolerated; validation still passes when the file is absent
- `mdkg task start|update|done` stay unchanged in 0.0.6
- task commands are documented as best for structured fields; manual markdown edits remain valid for body, narrative, and parent-summary edits
- task command ergonomics redesign is explicitly deferred beyond 0.0.6

# Alternatives considered

- Keep bootstrap skills empty and rely on docs only: rejected because product-specific skill mirrors stay empty and startup guidance remains indirect.
- Keep event logs gitignored by default: rejected because current event volume is low-frequency and structured enough to be durable repo memory.
- Redesign the task command surface immediately: rejected because the runtime is functional; the current gap is framing and guidance, not the existence of the commands.

# Consequences

- fresh `init --agent` repos become immediately useful to agents without manual skill authoring
- event logs now align with the repo-native memory story instead of being treated as ephemeral by default
- docs and skills must clearly explain the split between structured command edits and manual markdown edits
- future command ergonomics work remains an open question, but is no longer a blocker for 0.0.6

# Links / references

- `epic-16`
- `edd-4`
- `edd-6`
