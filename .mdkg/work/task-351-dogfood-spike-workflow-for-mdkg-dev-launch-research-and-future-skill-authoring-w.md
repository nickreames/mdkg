---
id: task-351
type: task
title: dogfood spike workflow for mdkg.dev launch research and future skill-authoring work
status: todo
priority: 1
epic: epic-77
parent: goal-14
tags: [spike, dogfood, mdkg-dev, skill-authoring]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-348]
blocks: []
refs: []
aliases: []
skills: []
created: 2026-06-11
updated: 2026-06-11
---
# Overview

Dogfood the new spike workflow against mdkg.dev launch preparation and convert
the findings into explicit follow-up mdkg nodes and skill-authoring candidates.

# Acceptance Criteria

- Create at least one real spike for mdkg.dev launch readiness after the spike
  node type exists.
- The dogfood spike covers documentation, SEO/marketing positioning, UX,
  security, data structures, and algorithms where relevant.
- Create follow-up tasks/tests/epics from the spike's recommendation section.
- Record any repeatable research or skill-authoring process as a candidate for
  `author-mdkg-skill` or a future mdkg skill update.

# Files Affected

- `.mdkg/work/`
- `.mdkg/skills/` only if an explicit skill-maintenance follow-up is created and
  selected later

# Implementation Notes

- This task should not build mdkg.dev. It should create launch-ready research
  structure and follow-up nodes.
- Keep public docs launch blocked on generated command docs and validated
  capability narratives.

# Test Plan

- `node dist/cli.js validate --json`
- `node dist/cli.js search "mdkg.dev" --json`
- `npm run smoke:spike`

# Links / Artifacts

- `goal-14`
- `epic-77`
- `test-144`
