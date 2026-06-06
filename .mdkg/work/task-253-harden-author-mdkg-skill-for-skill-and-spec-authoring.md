---
id: task-253
type: task
title: harden author mdkg skill for skill and SPEC authoring
status: done
priority: 1
epic: epic-40
parent: goal-6
tags: [skills, author-mdkg-skill, spec]
owners: []
links: []
artifacts: [.mdkg/skills/author-mdkg-skill/SKILL.md]
relates: [goal-6, epic-40, test-89]
blocked_by: [task-252]
blocks: [task-257]
refs: [dec-25]
aliases: [author-mdkg-skill-hardening-task]
skills: [author-mdkg-skill]
created: 2026-06-04
updated: 2026-06-04
---
# Overview

Update `author-mdkg-skill` so it can author and revise SKILL.md and SPEC.md
using durable source/projection standards.

# Acceptance Criteria

- Required SKILL and SPEC output sections are documented.
- Projection/source distinction is documented.
- Skill-factory-agent remains deferred.

# Files Affected

- `.mdkg/skills/author-mdkg-skill/SKILL.md`

# Implementation Notes

- Sync mirrored skill folders after canonical skill edits.

# Test Plan

- `mdkg skill validate author-mdkg-skill --json`

# Closeout Evidence

- The skill now requires purpose, inputs, outputs, capabilities, resources,
  checks, evidence, safety, failure modes, related SPECs, projection targets,
  and repair tasks for incomplete input.

# Links / Artifacts

- `.mdkg/skills/author-mdkg-skill/SKILL.md`
