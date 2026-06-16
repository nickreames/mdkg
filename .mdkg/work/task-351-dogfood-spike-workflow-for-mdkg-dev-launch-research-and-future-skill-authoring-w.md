---
id: task-351
type: task
title: dogfood spike workflow for mdkg.dev launch research and future skill-authoring work
status: done
priority: 1
epic: epic-77
parent: goal-14
tags: [spike, dogfood, mdkg-dev, skill-authoring]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-348]
blocks: [task-354, task-360, task-369]
refs: [spike-1, spike-2, spike-3, spike-4, spike-5, goal-15, task-370, task-371, test-157]
aliases: []
skills: []
created: 2026-06-11
updated: 2026-06-15
---
# Overview

Dogfood the new spike workflow against mdkg.dev launch preparation and convert
the findings into explicit follow-up mdkg nodes and skill-authoring candidates.

# Acceptance Criteria

- Create at least one real spike for mdkg.dev launch readiness after the spike
  node type exists.
- The dogfood spikes cover documentation, SEO/marketing positioning, UX,
  security/trust, data structures, algorithms, generated command docs, public
  examples, and downstream adoption narratives where relevant.
- Create or update follow-up tasks/tests/epics under paused `goal-15` from the
  spike recommendation sections.
- Record any repeatable research or skill-authoring process as a candidate for
  `author-mdkg-skill` or a future mdkg skill update.
- Do not start mdkg.dev website implementation in this task.

# Files Affected

- `.mdkg/work/`
- `.mdkg/skills/` only if an explicit skill-maintenance follow-up is created and
  selected later

# Implementation Notes

- This task should not build mdkg.dev. It should create launch-ready research
  structure and follow-up nodes.
- Keep public docs launch blocked on generated command docs and validated
  capability narratives.
- Use real spike nodes after implementation, not ordinary task notes, so the
  workflow dogfoods the new type.

# Test Plan

- `node dist/cli.js validate --json`
- `node dist/cli.js search "mdkg.dev" --json`
- `npm run smoke:spike`

# Results / Evidence

- Created and completed five real research spikes:
  - `spike-1`: mdkg.dev information architecture and generated command docs.
  - `spike-2`: outcome examples and downstream adoption narratives.
  - `spike-3`: security, trust, and no-secret posture.
  - `spike-4`: SEO positioning and AI search readiness.
  - `spike-5`: technical architecture, data structures, and algorithms
    narrative.
- Each spike uses the first-class spike template sections for research question,
  context, search plan, findings, options/tradeoffs, recommendation, follow-up
  nodes, skill candidates, data-structure/algorithm notes, UX notes, security
  notes, mdkg.dev launch implications, and sources.
- Updated paused `goal-15` scope with the five spikes plus new follow-up nodes:
  `task-370`, `task-371`, and `test-157`.
- Wired existing `goal-15` launch tasks `task-354` through `task-361` to the
  spike evidence and evidence-matrix follow-up work.
- Closed overlapping `task-360` with evidence so paused `goal-15` does not
  duplicate this dogfood pass later.
- Closed `test-144` because the packed temp-repo spike workflow and real
  mdkg.dev dogfood bridge are now proven.
- Did not start mdkg.dev website implementation.

# Verification

- `node dist/cli.js index`
- `npm run smoke:spike`; passed from packed installed tarball in
  `/private/tmp/mdkg-spike.SkRX1h/repo`.
- `node dist/cli.js validate --json`; passed with zero warnings/errors.
- `node dist/cli.js search "mdkg.dev" --json`; finds the spikes, paused
  `goal-15`, and launch follow-up nodes.
- `node dist/cli.js list --type spike --json`; shows five done spike nodes.
- `node dist/cli.js goal next goal-14 --json`; routes to `task-351` with no
  warnings before closeout.
- `git diff --check`; passed.

# Links / Artifacts

- `goal-14`
- `epic-77`
- `test-144`
- `spike-1`
- `spike-2`
- `spike-3`
- `spike-4`
- `spike-5`
- `goal-15`
- `task-370`
- `task-371`
- `test-157`
