---
id: chk-135
type: checkpoint
title: goal 14 spike system closeout and mdkg dev handoff
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [task-369]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
scope: [task-369]
created: 2026-06-15
updated: 2026-06-15
---
# Summary

`goal-14` reached its end condition. mdkg now has a first-class, hardened
research spike work-node system prepared for a `0.3.2` release candidate, with
docs, init/upgrade compatibility, validation/fix-plan UX, packed smoke proof,
and mdkg.dev dogfood handoff recorded.

# Scope Covered

- `task-369`
- `goal-14`
- `goal-15` handoff state

# Decisions Captured

- `spike` remains a work-node type, not a new top-level command namespace.
- Spikes organize research and planning evidence; they do not run web searches,
  execute work, or automatically create follow-up nodes or `SKILL.md` files.
- mdkg.dev launch work remains paused under `goal-15` until explicitly resumed.
- `0.3.2` is dry-run publish-ready only. Real publish, global install, tag, and
  push remain separate explicit release actions.

# Implementation Summary

- Closed the final `goal-14` evidence node after all implementation, docs,
  smoke, hardening, dogfood, and release-candidate readiness tasks/tests were
  complete.
- Added goal-level completion evidence summarizing spike creation, lifecycle,
  goal routing, discovery, pack/export, validation, fix-plan, init/upgrade, and
  command-contract support.
- Updated paused `goal-15` to state that spike support now exists and that the
  next launch-planning node remains `task-354`.

# Verification / Testing

- `node dist/cli.js validate --json` passed with zero warnings and zero errors.
- `node dist/cli.js goal next goal-14 --json` returned no actionable node after
  `task-369` closed, with only a stale active-node warning before final goal
  completion.
- `node dist/cli.js goal evaluate goal-14 --json` reported completion evidence
  present and listed the required checks as report-only.
- `git diff --check` passed.
- Prior RC checkpoint `chk-134` records the full build/test/smoke/pack/publish
  dry-run proof for `mdkg@0.3.2`.

# Known Issues / Follow-ups

- Real npm publish/global install/fresh global temp-repo E2E should be a
  separate explicit release request.
- `goal-15` is ready to resume at `task-354` when mdkg.dev docs/SEO/site
  planning becomes the active lane.
- Paused `goal-11` remains out of scope for this slice.

# Links / Artifacts

- `goal-14`
- `goal-15`
- `chk-134`
- `task-369`
- `spike-1` through `spike-5`
- `task-370`, `task-371`, `test-157`
