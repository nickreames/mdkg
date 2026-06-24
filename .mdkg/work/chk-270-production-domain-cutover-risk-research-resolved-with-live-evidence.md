---
id: chk-270
type: checkpoint
title: Production-domain cutover risk research resolved with live evidence
checkpoint_kind: implementation
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [spike-21]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [spike-21]
created: 2026-06-24
updated: 2026-06-24
---
# Summary

Production-domain cutover risks were resolved through live evidence rather
than remaining as speculative research. DNS, SSL, Vercel domain attachment,
indexability, canonical URLs, `/docs` redirect behavior, and screenshot/log
evidence all passed.

# Scope Covered

Scope: `spike-21`.

## Changed Surfaces

- Research findings converted into goal-36 implementation and validation
  evidence.

## Boundaries

- In scope: risk verification for the approved production custom-domain cutover.
- Out of scope: public announcement, analytics activation, npm publish, git
  tag, and GitHub settings mutation.
- Raw secrets, raw prompts, raw payloads, cookies, tokens, and bulky traces
  excluded.

# Decisions Captured

- DNS delegated to Vercel nameservers is acceptable for launch.
- Production domains are indexable immediately.
- `docs.mdkg.dev` is the canonical docs host.
- Default production `*.vercel.app` aliases are not canonical launch surfaces.

# Implementation Summary

The highest risk during execution was unsupported Vercel host-conditioned
static alias routing. That was tested, rejected by Vercel when `key: "host"`
was added, and removed in favor of the supported custom-domain deployment path.

# Implementation Details

- `mdkg.dev`, `www.mdkg.dev`, and `docs.mdkg.dev` are attached to Vercel
  projects and live.
- Custom-domain SSL and HTTPS routing are live.
- Vercel deployments for commit `790060a` are `READY`.
- Browser/Chrome evidence is archived at
  `archive://archive.goal36-browser-chrome-production-evidence-2026-06-24`.

# Verification / Testing

## Command Evidence

- command: DNS, route, Browser/Chrome, Vercel deployment, and archive
  verification checks from `chk-256` through `chk-269`.
- result: pass.

## Pass / Fail Status

- status: pass.

## Known Warnings

- Default production `*.vercel.app` aliases remain available as Vercel aliases
  but are not canonical, linked, or present in sitemaps.

# Known Issues / Follow-ups

- Optional follow-up: alias hardening if future policy requires it.

## Follow-up Refs

- `chk-260`
- `chk-263`
- `chk-265`
- `chk-269`

# Links / Artifacts

- `archive://archive.goal36-browser-chrome-production-evidence-2026-06-24`
- commit `790060a`

# Raw Content Safety

- Evidence summarized through refs, commit IDs, route facts, and archive URIs.
