---
id: chk-201
type: checkpoint
title: mdkg.dev Starlight preview hosting alignment accepted
checkpoint_kind: goal-closeout
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [task-471]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [task-471]
created: 2026-06-22
updated: 2026-06-22
---
# Summary

`goal-27` completed a graph-only alignment pass for mdkg.dev preview hosting. The repo now has a decision-complete plan for a Vercel-hosted marketing preview and a separate Starlight docs preview without creating external resources or editing site/docs source files.

# Scope Covered

- `goal-27`
- `spike-15`
- `epic-131` through `epic-136`
- `task-463` through `task-471`
- `test-212` through `test-217`
- `edd-31` through `edd-33`
- `dec-33` through `dec-35`

## Changed Surfaces

- `.mdkg/work/goal-26-*` was paused with evidence.
- `.mdkg/work/goal-27-*` was created and completed.
- `.mdkg/work/epic-131-*` through `.mdkg/work/epic-136-*` were created.
- `.mdkg/work/spike-15-*`, `.mdkg/work/task-463-*` through `.mdkg/work/task-471-*`, and `.mdkg/work/test-212-*` through `.mdkg/work/test-217-*` were created and closed.
- `.mdkg/design/edd-31-*` through `.mdkg/design/edd-33-*` and `.mdkg/design/dec-33-*` through `.mdkg/design/dec-35-*` were created.
- `.mdkg/index/mdkg.sqlite` and JSON indexes were refreshed with `node dist/cli.js index`.

## Boundaries

- in scope: mdkg graph/design/index state for Vercel preview hosting and Starlight docs readiness.
- out of scope: Vercel project creation, deploys, DNS changes, production promotion, public launch, source/site/docs implementation, npm publish, git tag, git push, and global install.
- raw secrets, raw prompts, raw payloads, Vercel tokens, DNS credentials, cookies, and deployment bypass values were excluded.

# Decisions Captured

- `dec-33`: apex `mdkg.dev` is canonical and `www` redirects to apex.
- `dec-34`: preview deploy comes before manual DNS cutover or production promotion.
- `dec-35`: Starlight replaces GitBook; `docs.mdkg.dev` is canonical docs and `/docs` is a marketing bridge.

# Implementation Summary

- Marketing preview contract: Vercel project `mdkg-dev`, root `mdkg-dev/`, build `npm run build`, output `dist`.
- Docs preview contract: Vercel project `mdkg-docs`, root `docs/`, Starlight, build `npm run build`, output `dist`, future host `docs.mdkg.dev`.
- Demo preview/promotion policy: preview URLs and future durable `demo-N.mdkg.dev` subdomains are planned but not implemented.
- The graph keeps non-actionable design/decision/historical refs in body inventories rather than frontmatter context edges because current goal traversal treats those refs as warning-producing scope-adjacent items.

# Goal Closeout

- Goal condition result: achieved.
- Scoped nodes closed: `spike-15`, `task-463` through `task-471`, and `test-212` through `test-217`.
- Remaining deferred work: actual Vercel preview project setup, Starlight implementation, DNS cutover, production promotion, demo subdomain promotion, and public launch.

# Verification / Testing

## Command Evidence

- `git status --short --branch`: graph-only dirty tree on `main...origin/main [ahead 16]`.
- `node dist/cli.js index`: indexes refreshed.
- `node dist/cli.js validate --summary --json --limit 20`: `ok: true`, `warning_count: 0`, `error_count: 0`.
- `node dist/cli.js doctor --strict --json`: `ok: true`, `failure_count: 0`.
- `node dist/cli.js goal current --json`: showed `goal-27` active before closeout.
- `node dist/cli.js goal next goal-27 --json`: routed to the expected active closeout node before it was closed, with no warnings.
- `node dist/cli.js pack goal-27 --pack-profile concise`: wrote a concise pack with no warnings.
- `git diff --check`: passed.

## Pass / Fail Status

- status: pass.

## Known Warnings

- `mdkg doctor --strict --json` reported the expected local-only `db.runtime_transient_files` warning for `.mdkg/db/runtime/project.sqlite`; this is not a source defect and remains ignored runtime state.

# Known Issues / Follow-ups

- Implement Starlight under `docs/` in a later functional goal.
- Use Chrome/Vercel UI to create preview projects only after the graph-only plan is accepted.
- Keep DNS cutover and production promotion manual and separately approved.

## Follow-up Refs

- `task-464`
- `task-465`
- `task-466`
- `task-467`
- `task-468`
- `task-469`
- `task-470`
- `edd-31`
- `edd-32`
- `edd-33`
- `dec-33`
- `dec-34`
- `dec-35`

# Links / Artifacts

- Official references are listed in `spike-15`.
- Latest concise goal pack was produced by `node dist/cli.js pack goal-27 --pack-profile concise`.

# Raw Content Safety

- This checkpoint summarizes evidence and uses refs only. No raw secrets, raw prompts, raw payloads, DNS credentials, Vercel tokens, cookies, or provider payloads were stored.
