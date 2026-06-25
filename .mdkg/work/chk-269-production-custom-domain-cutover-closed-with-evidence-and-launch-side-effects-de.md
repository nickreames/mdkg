---
id: chk-269
type: checkpoint
title: Production custom-domain cutover closed with evidence and launch side effects deferred
checkpoint_kind: implementation
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [task-572]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [task-572]
created: 2026-06-24
updated: 2026-06-24
---
# Summary

Goal 36 production custom-domain cutover is complete. The marketing site is
live at `https://mdkg.dev/`, `https://www.mdkg.dev/` redirects to the apex,
Starlight docs are live at `https://docs.mdkg.dev/`, and
`https://mdkg.dev/docs` redirects to the docs custom domain. Production custom
domains are indexable, Browser/Chrome screenshots are archived, Vercel
deployments are verified, and launch side effects beyond the approved cutover
remain deferred.

# Scope Covered

Scope: `goal-36`, `task-563` through `task-572`, and `test-281` through
`test-288`.

## Changed Surfaces

- Production domains:
  - `https://mdkg.dev/`
  - `https://www.mdkg.dev/`
  - `https://docs.mdkg.dev/`
  - `https://mdkg.dev/docs`
- Vercel projects:
  - `mdkg-dev`
  - `mdkg-docs`
- mdkg evidence:
  - `chk-255` through `chk-269`
  - `archive://archive.goal36-browser-chrome-production-evidence-2026-06-24`

## Boundaries

- In scope: approved production custom-domain cutover, Vercel verification,
  live Browser/Chrome QA, screenshot archival, and graph closeout.
- Out of scope and not performed: npm publish, git tag, analytics activation,
  GitHub settings mutation, public launch announcement, and unrelated DNS
  changes.
- Raw secrets, raw prompts, raw payloads, cookies, provider credentials, and
  bulky execution traces excluded.

# Decisions Captured

- `mdkg.dev` is the canonical production marketing host.
- `www.mdkg.dev` redirects to `https://mdkg.dev/`.
- `docs.mdkg.dev` is the canonical production docs host.
- `mdkg.dev/docs` redirects to `https://docs.mdkg.dev/`.
- Production custom domains are indexable immediately.
- Preview/noindex handling remains scoped to preview environments, not these
  production custom domains.
- Public announcement and analytics activation require later explicit work.

# Implementation Summary

The cutover progressed from DNS/Vercel domain attachment to source changes,
live route verification, Browser/Chrome visual evidence, Vercel build-log
verification, and mdkg closeout evidence. A failed attempt to use unsupported
host-conditioned static Vercel alias routing was corrected by removing that
configuration in commit `790060a`, after which both Vercel production
deployments returned to `READY`.

# Implementation Details

- Source commits already pushed:
  - `700ac19` launched production-domain source behavior.
  - `790060a` removed unsupported Vercel alias routing and is the verified
    deployment commit for both Vercel projects.
- Live route results:
  - `https://mdkg.dev/`: HTTP 200, canonical apex, not noindexed.
  - `https://www.mdkg.dev/`: HTTP 307 to `https://mdkg.dev/`.
  - `https://docs.mdkg.dev/`: HTTP 200, canonical docs domain, not noindexed.
  - `https://mdkg.dev/docs`: HTTP 308 to `https://docs.mdkg.dev/`.
- Vercel:
  - `mdkg-dev`: deployment `dpl_HgKHLLeWbJ6KeCkqcTrBrh7zpBLw`, state
    `READY`, commit `790060a`, aliases include `mdkg.dev` and `www.mdkg.dev`.
  - `mdkg-docs`: deployment `dpl_8qocYxCaLzNaiKbjEoRQq7rFkqaE`, state
    `READY`, commit `790060a`, aliases include `docs.mdkg.dev`.
- Browser/Chrome evidence:
  - Browser desktop/mobile screenshots for apex and docs.
  - Browser redirect screenshot for `/docs`.
  - Chrome screenshots for apex, docs, and `/docs` redirect.
  - Structured evidence JSON for Browser and Chrome.
  - Archive verification passed.

# Verification / Testing

## Command Evidence

- command: live route/metadata/sitemap probe for apex, `www`, docs, `/docs`,
  robots, and sitemaps.
- result: pass.
- command: Browser production-domain QA at desktop and mobile widths.
- result: pass, no console errors, screenshots archived.
- command: Chrome production-domain QA.
- result: pass, no console errors, screenshots archived.
- command: Vercel get deployment and build logs for `mdkg-dev` and `mdkg-docs`.
- result: pass, both `READY`, both built and deployed from commit `790060a`.
- command: `node dist/cli.js archive verify archive://archive.goal36-browser-chrome-production-evidence-2026-06-24 --json`
- result: pass.
- command: `npm run smoke:mdkg-dev`
- result: pass.
- command: `npm run smoke:mdkg-dev-docs`
- result: pass.
- command: `npm run smoke:mdkg-dev-seo`
- result: pass.
- command: `node scripts/assert-publish-ready.js`
- result: pass.
- command: `node dist/cli.js validate --summary --json --limit 20`
- result: pass, 0 warnings and 0 errors.
- command: `node dist/cli.js doctor --strict --json`
- result: pass, expected local DB runtime warning only.
- command: `git diff --check`
- result: pass.

## Pass / Fail Status

- status: pass.

## Known Warnings

- `doctor --strict` reports the expected local-only
  `.mdkg/db/runtime/project.sqlite` runtime warning; project DB verification
  passes.
- Default production `*.vercel.app` aliases remain Vercel aliases. They are
  not canonical, are not linked from production pages, and are not included in
  production sitemaps.

# Known Issues / Follow-ups

- Optional follow-up: decide whether default production `*.vercel.app` aliases
  need dashboard-level or middleware handling.
- Later public-launch goal should handle public announcement, analytics
  activation if desired, GitHub repository metadata handoff/application, and
  post-launch monitoring.

## Follow-up Refs

- future public launch announcement goal
- optional alias-hardening follow-up if desired

# Links / Artifacts

- `https://mdkg.dev/`
- `https://docs.mdkg.dev/`
- `https://www.mdkg.dev/`
- `https://mdkg.dev/docs`
- `archive://archive.goal36-browser-chrome-production-evidence-2026-06-24`
- `chk-260`
- `chk-263`
- `chk-265`
- `chk-267`
- commit `790060a`

# Raw Content Safety

- Evidence is summarized with route statuses, deployment IDs, commit IDs,
  archive refs, and bounded receipts. No raw secrets, prompts, payloads,
  cookies, tokens, provider credentials, or unrelated raw logs are stored.
