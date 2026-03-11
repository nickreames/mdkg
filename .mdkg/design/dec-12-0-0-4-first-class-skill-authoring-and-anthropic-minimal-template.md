---
id: dec-12
type: dec
title: 0.0.4 first class skill authoring and anthropic minimal template
status: accepted
tags: [0_0_4, skills, cli, template, anthropic]
owners: []
links: [https://docs.claude.com/en/docs/agents-and-tools/agent-skills/best-practices]
artifacts: [assets/skills/SKILL.md.example, src/commands/skill.ts, src/commands/skill_support.ts, README.md]
relates: [dec-11, edd-5, edd-7, epic-9, dec-13]
refs: []
aliases: [first-class-skills, skill-template, skill-namespace]
created: 2026-03-08
updated: 2026-03-08
---

# Context

mdkg already supported skills for indexing, search, show, pack inclusion, and validation. The remaining gap was authoring: users needed a first-class way to scaffold, discover, and validate skills without hand-assembling folders and guessing the right `SKILL.md` shape.

# Decision

- Add a dedicated `mdkg skill` namespace for skill creation and skill-specific discovery.
- Keep the dogfood `SKILL.md` files as the source-truth examples for mdkg skill authoring.
- Use an Anthropic-aligned minimal built-in template with required sections only.
- Keep `Preconditions`, `Examples`, and `References` optional rather than default scaffold requirements.
- Keep `SKILL.md` canonical and retain tolerant read-compat for `SKILLS.md`; generated scaffolds always write `SKILL.md`.
- Make `skill validate` reuse the same underlying skill validation rules.

# Alternatives considered

- Manual-only skill authoring: rejected because it keeps skills second-class and increases doc drift.
- `mdkg new skill` without a dedicated namespace: rejected because it weakens discoverability and skill-specific guidance.

# Consequences

- mdkg skill authoring is first-class for humans and agents in the `0.0.4` release line.
- The built-in template, docs, init registry guidance, and dogfood skills share one contract.
- Runtime script execution remains out of scope; mdkg scaffolds and validates skills but does not execute them.

# Links / references

- `dec-11`
- `edd-5`
- `edd-7`
- `epic-9`
