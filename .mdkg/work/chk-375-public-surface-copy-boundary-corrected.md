---
id: chk-375
type: checkpoint
title: public surface copy boundary corrected
checkpoint_kind: audit
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [task-662]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [task-662]
created: 2026-07-05
updated: 2026-07-05
---
# Summary

Closed `task-662` as a corrective audit task. The prior `chk-374` homepage-copy
finding is now recorded as a false-positive surface classification, not a
remaining `mdkg.dev` launch blocker.

`mdkg.dev` homepage source was intentionally left untouched. The correction was
routed to `docs.mdkg.dev`, the root mdkg work graph, and first-party skills so
future release audits distinguish package/docs/reference truth from public
positioning copy and internal operational evidence.

# Scope Covered

Keep `scope` frontmatter updated when possible.

## Changed Surfaces

- `docs/src/content/docs/start-here/safety-boundaries.md`
- `.mdkg/skills/verify-close-and-checkpoint/SKILL.md`
- `.mdkg/skills/service-boundary-ownership-check/SKILL.md`
- `.mdkg/skills/select-work-and-ground-context/SKILL.md`
- configured mirrors under `.agents/skills/` and `.claude/skills/`
- `.mdkg/work/chk-374-0-4-2-vercel-production-currentness-audit-after-goal-54.md`
- `.mdkg/work/task-662-refresh-mdkg-dev-postpublish-launch-track-copy.md`
- `.mdkg/index/mdkg.sqlite`

## Boundaries

- in scope: active root mdkg work nodes, docs.mdkg.dev source, canonical
  project skills, configured skill mirrors, and regenerated mdkg index state.
- out of scope: `mdkg-dev/` homepage source, seeded `.mdkg/templates/**`,
  `assets/init/**`, `dist/init/**`, example/template graph seeds under
  `examples/**/.mdkg/**`, package metadata, npm publish, git push, Vercel
  deploy, DNS, tags, analytics, and provider mutation.
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded:
  yes.

# Decisions Captured

- `mdkg.dev` homepage, demo, trust, and launch pages are public positioning
  surfaces, not automatic mirrors of npm, Vercel, provider, or checkpoint
  evidence.
- `docs.mdkg.dev`, generated CLI reference, and `CHANGELOG.md` are the right
  surfaces for current capability facts, command details, release notes, and
  validation evidence.
- Release audits should create docs/reference/open-question follow-ups when the
  public positioning boundary is ambiguous.

# Implementation Summary

- Corrected `chk-374` so deployment/build/route health remains passing while
  the homepage-copy gap is explicitly superseded.
- Reframed `task-662` from a homepage copy implementation task into a
  docs/skill hardening task and closed it.
- Added a `Safety Boundaries` docs section named `Public copy and release
  evidence`.
- Hardened `verify-close-and-checkpoint`,
  `service-boundary-ownership-check`, and `select-work-and-ground-context` with
  public-surface classification requirements.
- Synced the configured `.agents/skills/` and `.claude/skills/` mirrors from
  canonical `.mdkg/skills/`.

# Audit Findings

- Reviewed surfaces: root work nodes `chk-374` and `task-662`,
  docs.mdkg.dev source, canonical first-party skills, configured mirrors, and
  git changed-file scope.
- Findings:
  - pass: no `mdkg-dev/` homepage source was changed.
  - pass: no seeded templates, init payloads, or example/template graph seeds
    were changed.
  - pass: docs.mdkg.dev now documents the release evidence vs public
    positioning boundary.
  - pass: skills now require public-surface classification before release
    audits create copy tasks from internal evidence.
- Residual risk: live docs.mdkg.dev will not show the new safety-boundary
  section until the docs site is pushed and deployed through the normal
  approval-gated path.

# Verification / Testing

## Command Evidence

- command: `node dist/cli.js skill validate verify-close-and-checkpoint --json`
- result: ok, zero warnings, zero errors.
- command: `node dist/cli.js skill validate service-boundary-ownership-check --json`
- result: ok, zero warnings, zero errors.
- command: `node dist/cli.js skill validate select-work-and-ground-context --json`
- result: ok, zero warnings, zero errors.
- command: `npm --prefix docs run build`
- result: ok, 28 static docs pages built.
- command: `node dist/cli.js skill sync --json`
- result: ok after rerunning outside the sandbox because sandbox write access to
  `.agents/skills/` was denied; 12 mirrors synced across 2 targets.
- command: `npm run smoke:mdkg-dev-docs`
- result: ok, docs smoke passed with 62 required files.
- command: `npm run docs:check`
- result: ok, generated docs/reference and release notes checks passed, 431
  command examples checked with zero failures.
- command: `node dist/cli.js index`
- result: ok, global, skills, capabilities, subgraphs, and SQLite indexes
  refreshed.

## Pass / Fail Status

- status: pass pending final graph validation and diff hygiene after checkpoint
  body completion.

## Known Warnings

- warning: `mdkg skill sync --json` required an escalated rerun to update
  configured skill mirrors because the sandbox blocked writes to `.agents/`.

# Known Issues / Follow-ups

- Live docs deployment is not part of this local corrective pass.

## Follow-up Refs

- `task-662`
- `chk-374`
- `goal-54`

# Links / Artifacts

- `docs/src/content/docs/start-here/safety-boundaries.md`
- `.mdkg/skills/verify-close-and-checkpoint/SKILL.md`
- `.mdkg/skills/service-boundary-ownership-check/SKILL.md`
- `.mdkg/skills/select-work-and-ground-context/SKILL.md`

# Raw Content Safety

- Evidence uses refs, file paths, command names, and summarized results. Raw
  secrets, prompts, credentials, cookies, provider payloads, and bulky execution
  traces are excluded.
