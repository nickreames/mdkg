---
id: task-662
type: task
title: refresh mdkg.dev postpublish launch-track copy
status: todo
priority: 1
tags: [0.4.2, mdkg-dev, copy, postpublish, vercel, live-validation]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [chk-370, chk-373, chk-374, goal-54]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-07-05
updated: 2026-07-05
---
# Overview

Refresh the `mdkg.dev` homepage 0.4.2 launch-track copy now that npm publish,
postpublish validation, Vercel production deployment, and live-route checks have
all completed.

The live homepage currently remains mostly correct, but one sentence still uses
pre-postpublish gating language: "production launch still waits for npm
postpublish validation." That undercuts the otherwise successful 0.4.2 public
surface.

# Acceptance Criteria

- `mdkg-dev/src/pages/index.astro` no longer says production launch waits for
  npm postpublish validation after postpublish validation is complete.
- The 0.4.2 homepage copy accurately distinguishes completed publish/deploy
  evidence from any remaining future work.
- Live `mdkg.dev` still reports `softwareVersion":"0.4.2"` and still includes
  `Git closeout` / `mdkg git push-ready` public copy.
- No unrelated homepage, docs, npm package, graph, DNS, analytics, or provider
  changes are included.

# Files Affected

List files/directories expected to change.

- `mdkg-dev/src/pages/index.astro`
- mdkg checkpoint/evidence nodes for implementation closeout

# Implementation Notes

- Keep the change copy-only and scoped to the stale launch-track/gating
  sentence unless further source grounding proves adjacent text is also stale.
- Treat `chk-370` as the 0.4.2 npm publish/postpublish evidence and `chk-374`
  as the Vercel/live-currentness audit evidence.
- Do not publish npm, create tags, change DNS, or mutate provider settings.

# Test Plan

How will we verify it works?

- `npm --prefix mdkg-dev run build`
- `npm run smoke:mdkg-dev`
- `npm run smoke:mdkg-dev-seo`
- `node dist/cli.js validate --changed-only --json`
- `git diff --check`
- After approved push/deploy, verify live `https://mdkg.dev/` no longer
  contains the stale postpublish-waiting sentence and still contains the 0.4.2
  structured-data and Git closeout markers.

# Links / Artifacts

- `chk-370`
- `chk-373`
- `chk-374`
- `goal-54`
- `https://mdkg.dev/`
