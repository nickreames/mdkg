---
id: dec-18
type: dec
title: 0.0.5 canonical mdkg skills with agents and claude mirrors
status: accepted
tags: [0_0_5, skills, mirrors, agent]
owners: []
links: []
artifacts: [src/commands/skill_mirror.ts, src/commands/skill.ts, src/commands/validate.ts, .mdkg/skills/registry.md]
relates: [dec-16, dec-17, epic-14]
refs: []
aliases: [skill-mirrors, agents-claude-mirrors]
created: 2026-03-10
updated: 2026-03-10
---

# Context

OpenAI Codex currently documents `.agents/skills`, while Anthropic documents `.claude/skills`. mdkg already has canonical skills under `.mdkg/skills/`, but agents benefit when the same skills are mirrored into the product-specific locations they already scan.

# Decision

- Keep `.mdkg/skills/` as the only canonical source of truth.
- Materialize copies of every canonical skill into `.agents/skills/` and `.claude/skills/`.
- Mirror only the open Agent Skills payload: `SKILL.md`, `references/`, `assets/`, and `scripts/` when present.
- Mirror creation and sync are append-focused and create-if-missing.
- Preserve unrelated existing folders and files under `.agents/skills/` and `.claude/skills/`.
- Same-slug collisions fail by default; explicit `--force` is the override path.
- `mdkg validate` warns on drift instead of mutating automatically.

# Alternatives considered

- Make `.agents/skills/` or `.claude/skills/` canonical: rejected because mdkg should own one skill source of truth.
- Use symlinks instead of materialized copies: rejected because product support and portability are less predictable.
- Auto-delete unknown mirror folders: rejected because that is too destructive for third-party skill trees.

# Consequences

- Canonical mdkg skills remain easy to author and validate.
- Product-specific agents get first-class mirrored skills without learning mdkg internals first.
- Mirror maintenance becomes an explicit, safe command surface through init/bootstrap and `mdkg skill sync`.

# Links / references

- `epic-14`
- `task-95`
- `task-96`
- `task-97`
