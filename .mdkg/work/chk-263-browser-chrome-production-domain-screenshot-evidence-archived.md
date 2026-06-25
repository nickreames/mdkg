---
id: chk-263
type: checkpoint
title: Browser Chrome production-domain screenshot evidence archived
checkpoint_kind: implementation
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [task-569]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [task-569]
created: 2026-06-24
updated: 2026-06-24
---
# Summary

Browser and Chrome production-domain evidence was captured and archived as a
private mdkg artifact bundle.

# Scope Covered

Scope: `task-569` and `test-286`.

## Changed Surfaces

- Evidence archive created:
  `archive://archive.goal36-browser-chrome-production-evidence-2026-06-24`
- Archive contents:
  - Browser desktop screenshot for `https://mdkg.dev/`
  - Browser mobile screenshot for `https://mdkg.dev/`
  - Browser desktop screenshot for `https://docs.mdkg.dev/`
  - Browser mobile screenshot for `https://docs.mdkg.dev/`
  - Browser screenshot proving `https://mdkg.dev/docs` resolves to
    `https://docs.mdkg.dev/`
  - Chrome screenshot for `https://mdkg.dev/`
  - Chrome screenshot for `https://docs.mdkg.dev/`
  - Chrome screenshot proving `/docs` redirects to docs
  - Browser and Chrome structured evidence JSON receipts

## Boundaries

- In scope: local visual QA and screenshot evidence for the approved production
  domains.
- Out of scope: generated marketing assets, analytics activation, production
  announcement, and GitHub metadata mutation.
- Screenshots and receipts were scanned for obvious raw secret/prompt/payload
  markers before archival.

# Decisions Captured

- Browser evidence covers both desktop `1440x900` and mobile `390x844`.
- Chrome evidence covers production-domain behavior in the user-profile
  browser.

# Implementation Summary

The visual evidence confirms the marketing and docs pages render with visible
content, expected canonical URLs, and no console errors in both Browser and
Chrome.

# Implementation Details

- Browser observations:
  - `mdkg.dev` desktop and mobile final URL: `https://mdkg.dev/`.
  - docs desktop and mobile final URL: `https://docs.mdkg.dev/`.
  - `/docs` final URL: `https://docs.mdkg.dev/`.
  - observed `errorCount: 0` for all Browser captures.
- Chrome observations:
  - `mdkg.dev`, docs, and `/docs` redirect all resolved to expected production
    URLs.
  - observed `errorCount: 0` for all Chrome captures.
- Archive verification returned `ok: true`.

# Verification / Testing

## Command Evidence

- command: Browser live navigation/screenshot pass for apex, docs, mobile, and
  `/docs` redirect.
- result: pass.
- command: Chrome live navigation/screenshot pass for apex, docs, and `/docs`
  redirect.
- result: pass.
- command: `node dist/cli.js archive verify archive://archive.goal36-browser-chrome-production-evidence-2026-06-24 --json`
- result: `ok: true`.

## Pass / Fail Status

- status: pass.

## Known Warnings

- None from Browser or Chrome console error checks.

# Known Issues / Follow-ups

- None blocking production-domain cutover.

## Follow-up Refs

- `test-286`
- `task-570`
- `task-572`

# Links / Artifacts

- `archive://archive.goal36-browser-chrome-production-evidence-2026-06-24`

# Raw Content Safety

- Archive is private. Evidence uses screenshots and bounded JSON receipts only;
  no raw secrets, raw prompts, raw payloads, cookies, tokens, or bulky runtime
  traces are stored.
