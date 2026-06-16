---
id: chk-131
type: checkpoint
title: mdkg.dev spike dogfood backlog created
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [task-351]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
scope: [task-351]
created: 2026-06-15
updated: 2026-06-15
---
# Summary

Completed the first real dogfood pass for first-class spike nodes. The repo now
has five completed mdkg.dev research spikes and a paused `goal-15` launch lane
that is wired to those spike findings.

# Scope Covered

- `task-351`
- `task-360`
- `test-144`
- `spike-1` through `spike-5`
- `goal-15`
- `task-370`
- `task-371`
- `test-157`

# Decisions Captured

- Spikes are useful as actionable research nodes, not passive notes.
- mdkg.dev launch planning should resume from spike-backed evidence rather than
  a static sitemap.
- `goal-15` remains paused; no website implementation started.
- Follow-up mdkg.dev docs must be source-backed by generated command metadata,
  smoke-tested examples, local source evidence, or accepted spike findings.

# Implementation Summary

Created and completed five dogfood spikes:

- `spike-1`: mdkg.dev IA and generated command docs.
- `spike-2`: outcome examples and downstream adoption narratives.
- `spike-3`: security, trust, and no-secret posture.
- `spike-4`: SEO positioning and AI search readiness.
- `spike-5`: technical architecture, data structures, and algorithms narrative.

Updated paused `goal-15` to include the spikes and new follow-up scope:

- `task-370`: source-backed page evidence matrix.
- `task-371`: architecture and state-boundary visuals.
- `test-157`: source-backed claims and examples contract.

Existing `goal-15` launch tasks now reference the spike evidence.

# Verification / Testing

- `node dist/cli.js index`; passed.
- `npm run smoke:spike`; passed from a packed installed tarball in
  `/private/tmp/mdkg-spike.SkRX1h/repo`.
- `node dist/cli.js validate --json`; passed with zero warnings/errors.
- `node dist/cli.js search "mdkg.dev" --json`; found the new spikes and launch
  follow-up nodes.
- `node dist/cli.js list --type spike --json`; showed five done spike nodes.
- `node dist/cli.js goal next goal-14 --json`; routed to `task-351` before
  closeout and `task-365` after closeout.
- `git diff --check`; passed.

# Known Issues / Follow-ups

- `task-365` is the next `goal-14` hardening node: spike template init and
  upgrade compatibility.
- `goal-15` remains paused until `goal-14` reaches 0.3.2 RC readiness.

# Links / Artifacts

- `task-351`
- `task-360`
- `test-144`
- `goal-15`
- `spike-1`
- `spike-2`
- `spike-3`
- `spike-4`
- `spike-5`
- `task-370`
- `task-371`
- `test-157`
