---
id: dec-12
type: dec
title: v0.5 first class skill authoring and anthropic minimal template
status: accepted
tags: [v0_5, skills, cli, template, anthropic]
owners: []
links: [https://docs.claude.com/en/docs/agents-and-tools/agent-skills/best-practices]
artifacts: [assets/skills/SKILL.md.example, src/commands/skill.ts, src/commands/skill_support.ts, README.md]
relates: [dec-11, edd-5, edd-7, epic-9]
refs: []
aliases: [first-class-skills, skill-template, skill-namespace]
created: 2026-03-08
updated: 2026-03-08
---

# Context

mdkg already supports skills for indexing, search, show, pack inclusion, and validation. The remaining gap is authoring: users need a first-class way to scaffold, discover, and validate skills without hand-assembling folders and guessing the right `SKILL.md` shape.

# Decision

- Add a dedicated `mdkg skill` namespace for skill creation and skill-specific discovery.
- Keep the current dogfood `SKILL.md` files as the source-truth examples for mdkg skill authoring.
- Use an Anthropic-aligned minimal built-in template with required sections only:
  - `# Goal`
  - `## When To Use`
  - `## Inputs`
  - `## Steps`
  - `## Outputs`
  - `## Safety`
  - `## Failure Handling`
- Keep `Preconditions`, `Examples`, and `References` optional rather than default scaffold requirements.
- Keep `SKILL.md` canonical and retain tolerant read-compat for `SKILLS.md`; generated scaffolds always write `SKILL.md`.
- Make `skill list/show/search` thin wrappers over the existing skill-aware flows and make `skill validate` reuse the same underlying skill validation rules.

# Alternatives considered

- Keep skills authoring manual-only (rejected): keeps skills second-class and increases doc drift.
- Add only `mdkg new skill` without a dedicated namespace (rejected): weak skill UX and poorer discoverability.
- Generate richer default skill bodies with extra sections by default (rejected): diverges from the current dogfood skills and adds unnecessary token cost.

# Consequences

- mdkg skill authoring becomes first-class for humans and agents.
- The built-in template, docs, init registry guidance, and dogfood skills now have one shared contract.
- Compatibility is preserved for generic `list/show/search` skill flows and for legacy `SKILLS.md` read-compat.
- Runtime script execution remains out of scope; mdkg scaffolds and validates skills but does not execute them.

# Links / references

- `dec-11`
- `edd-5`
- `edd-7`
- `epic-9`
