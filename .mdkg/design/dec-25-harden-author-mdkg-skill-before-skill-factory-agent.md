---
id: dec-25
type: dec
title: harden author mdkg skill before skill factory agent
status: accepted
tags: [skills, skill-factory, author-mdkg-skill, backlog]
owners: []
links: []
artifacts: [.mdkg/skills/author-mdkg-skill/SKILL.md]
relates: [epic-40, epic-44, edd-14]
refs: [dec-12, dec-18, dec-21]
aliases: [author-skill-before-factory]
created: 2026-06-04
updated: 2026-06-04
---
# Context

A skill-factory agent would be valuable, but generating many skills before the
authoring standard stabilizes would create low-quality durable knowledge.

# Decision

Harden the existing `author-mdkg-skill` first. The future skill-factory-agent is
documented as backlog and must depend on stable SPEC/SKILL templates, projection
doctrine, and validation rules.

# Alternatives considered

- Build a skill-factory-agent now. Rejected because unstable templates would
  produce low-quality generated skills.

# Consequences

- This lane improves the current skill instead of creating a new factory skill.
- The factory agent remains future work.
- New template requests become backlog unless the current taxonomy is clearly
  insufficient.

# Links / references

- `dec-21`
- `edd-14`
