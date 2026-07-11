---
id: epic-240
type: epic
title: Dormant release experience verification and closeout
status: done
priority: 1
tags: [release, implementation, goal-63]
owners: []
links: []
artifacts: []
relates: [goal-63]
blocked_by: []
blocks: []
refs: [task-740, task-741, task-742, test-407, edd-71, dec-68, dec-73, dec-74, prd-11, prop-8]
context_refs: [goal-62, goal-63, goal-64, dec-74, prd-11, prop-8, task-712]
evidence_refs: [chk-482, chk-483, chk-489, chk-490, chk-491]
aliases: []
skills: []
created: 2026-07-11
updated: 2026-07-11
---
# Goal

Prove the complete release experience locally in dormant and active-preview
modes, then hand Goal 64 a clean, evidence-backed activation candidate.

# Scope

- Marketing/docs draft and active-preview builds.
- Release-state smoke, leak scans, metadata/search/route assertions, and manifest
  immutability proof.
- Desktop/mobile browser comparison against the selected Process Rail artifact.
- Keyboard, focus, zoom, reflow, themes, forced colors, links, and no-secret
  verification.
- Dormant closeout checkpoint for Goal 64.

# Milestones

- `task-740`: automated four-mode and leak-prevention proof.
- `task-741`: browser/accessibility proof.
- `task-742` / `test-407`: dormant handoff and boundary verification.

# Out of Scope

Push, deploy, tag, npm publish, global install, production verification, and
manifest activation.

# Risks

- Screenshots alone can miss semantic and keyboard regressions.
- Preview overrides can become production escape hatches without fail-closed
  tests.

# Links / Artifacts

- `dec-74`
- `prop-8`
- `goal-64`
