---
id: chk-260
type: checkpoint
title: Production custom-domain route canonical sitemap and indexability verified
checkpoint_kind: implementation
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [task-568]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [task-568]
created: 2026-06-24
updated: 2026-06-24
---
# Summary

Production custom-domain routing, canonical metadata, sitemap behavior, and
indexability were verified against the live domains after the final Vercel
deployment for commit `790060a`.

# Scope Covered

Scope: `task-568`, `test-284`, and `test-285`.

## Changed Surfaces

- Live routes:
  - `https://mdkg.dev/`
  - `https://www.mdkg.dev/`
  - `https://docs.mdkg.dev/`
  - `https://mdkg.dev/docs`
- Live crawler surfaces:
  - `https://mdkg.dev/robots.txt`
  - `https://mdkg.dev/sitemap.xml`
  - `https://docs.mdkg.dev/sitemap-index.xml`

## Boundaries

- In scope: approved production custom-domain cutover validation.
- Out of scope: npm publish, git tag, analytics activation, GitHub settings
  mutation, and public announcement.
- Raw secrets, raw prompts, raw payloads, and bulky execution traces excluded.

# Decisions Captured

- `mdkg.dev` is the canonical marketing host.
- `www.mdkg.dev` redirects to `https://mdkg.dev/`.
- `docs.mdkg.dev` is the canonical docs host.
- `https://mdkg.dev/docs` redirects to `https://docs.mdkg.dev/`.
- Production custom domains are indexable immediately.

# Implementation Summary

The final source commit removed unsupported Vercel host-conditioned alias
routing and kept the supported production-domain behavior: custom domains serve
the real apps, and the marketing `/docs` path redirects to the docs custom
domain.

# Implementation Details

- Code/source change proof is commit `790060a`.
- Route probe observed:
  - `https://mdkg.dev/`: HTTP 200, server `Vercel`, canonical
    `https://mdkg.dev/`, no `noindex`.
  - `https://www.mdkg.dev/`: HTTP 307 to `https://mdkg.dev/`.
  - `https://docs.mdkg.dev/`: HTTP 200, server `Vercel`, canonical
    `https://docs.mdkg.dev/`, no `noindex`.
  - `https://mdkg.dev/docs`: HTTP 308 to `https://docs.mdkg.dev/`.
- Marketing sitemap contains apex URLs and no `/docs` URL.
- Docs sitemap contains `docs.mdkg.dev` URLs.
- Marketing page links the production docs domain and no longer links
  `mdkg-docs.vercel.app`.

# Verification / Testing

## Command Evidence

- command: live `curl` route/metadata/sitemap probe for apex, `www`, docs,
  `/docs`, robots, and sitemaps.
- result: pass.
- command: `npm run smoke:mdkg-dev`
- result: pass.
- command: `npm run smoke:mdkg-dev-docs`
- result: pass.
- command: `npm run smoke:mdkg-dev-seo`
- result: pass.
- command: `node scripts/assert-publish-ready.js`
- result: pass.
- command: `git diff --check`
- result: pass.

## Pass / Fail Status

- status: pass.

## Known Warnings

- The default production `*.vercel.app` aliases remain Vercel aliases. They are
  not canonical, not linked from production pages, and not present in production
  sitemaps. Host-conditioned static alias redirects/headers were not supported
  by the attempted Vercel configuration and were removed.

# Known Issues / Follow-ups

- Optional follow-up: if default production aliases must be redirected or
  noindexed, handle it through a supported Vercel/dashboard or middleware path
  rather than static host-conditioned routing in `vercel.json`.

## Follow-up Refs

- `task-569`
- `task-570`
- `task-571`
- `task-572`

# Links / Artifacts

- commit: `790060a`
- route evidence continues in `chk-263`, `chk-265`, and final goal closeout.

# Raw Content Safety

- Evidence is summarized by routes, status codes, checks, commits, and archive
  refs. No raw secrets, raw prompts, raw payloads, or bulky traces are stored.
