---
id: chk-376
type: checkpoint
title: public docs meta section removed
checkpoint_kind: audit
status: backlog
priority: 9
tags: [docs-mdkg-dev, public-copy, corrective-audit]
owners: []
links: []
artifacts: []
relates: [task-662, chk-375]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [task-662, chk-375]
created: 2026-07-05
updated: 2026-07-05
---
# Summary

Removed the public-facing `Public copy and release evidence` section from
`docs.mdkg.dev` source after review found it was internal agent/process meta
commentary rather than reader-facing documentation.

# Scope Covered

## Changed Surfaces

- `docs/src/content/docs/start-here/safety-boundaries.md`
- `.mdkg/work/task-662-refresh-mdkg-dev-postpublish-launch-track-copy.md`
- `.mdkg/work/chk-375-public-surface-copy-boundary-corrected.md`
- this checkpoint

## Boundaries

- in scope: removing internal governance prose from public docs and correcting
  root mdkg evidence.
- out of scope: `mdkg-dev/` homepage source, seeded templates, init payloads,
  examples, package metadata, npm publish, tags, DNS, analytics, and provider
  mutation.
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded:
  yes.

# Decisions Captured

- Public docs should explain mdkg behavior to users, not expose agent operating
  policy, release-copy governance, Vercel deployment ids, or internal audit
  mechanics.
- The durable guardrail remains in mdkg skills and work evidence.

# Implementation Summary

- Removed the `Public copy and release evidence` section from
  `docs/src/content/docs/start-here/safety-boundaries.md`.
- Updated `task-662` and `chk-375` so they no longer describe the public docs
  page as the place for internal release-copy governance.
- Left `mdkg-dev/`, seeded templates, init payloads, examples, package files,
  changelog, README, and command matrix untouched.

# Verification / Testing

- command: `npm --prefix docs run build`
- result: ok, 28 static docs pages built.
- command: `npm run smoke:mdkg-dev-docs`
- result: ok, docs smoke passed with 62 required files.
- command: `npm run docs:check`
- result: ok, generated CLI reference, release notes data, and 431 command
  examples checked with zero failures.
- command: `node dist/cli.js index`
- result: ok, global, skills, capabilities, subgraphs, and SQLite indexes
  refreshed.
- command: `git diff --check`
- result: ok.

# Known Issues / Follow-ups

- Live docs still need the corrective commit pushed and deployed so the public
  page no longer shows the internal meta section.

# Links / Artifacts

- `docs/src/content/docs/start-here/safety-boundaries.md`
- `chk-375`
- `task-662`
