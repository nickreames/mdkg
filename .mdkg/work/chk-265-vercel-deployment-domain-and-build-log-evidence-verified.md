---
id: chk-265
type: checkpoint
title: Vercel deployment domain and build-log evidence verified
checkpoint_kind: implementation
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [task-570]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [task-570]
created: 2026-06-24
updated: 2026-06-24
---
# Summary

The latest Vercel production deployments for both `mdkg-dev` and `mdkg-docs`
were verified as `READY`, associated with source commit `790060a`, attached to
the expected custom domains, and backed by successful build logs.

# Scope Covered

Scope: `task-570` and `test-287`.

## Changed Surfaces

- Vercel project `mdkg-dev`
- Vercel project `mdkg-docs`
- Vercel deployment metadata and build logs

## Boundaries

- In scope: Vercel deployment, custom-domain, and build-log verification.
- Out of scope: new Vercel project creation, analytics activation, DNS edits,
  production promotion beyond the approved domains, and public announcement.
- No Vercel tokens or secrets are stored in mdkg.

# Decisions Captured

- Existing Vercel projects remain the production targets:
  - `mdkg-dev` for marketing.
  - `mdkg-docs` for Starlight docs.

# Implementation Summary

Both Vercel projects redeployed from GitHub source commit `790060a` after the
unsupported alias-routing config was removed. Custom-domain aliases are attached
to the expected deployments with no alias errors.

# Implementation Details

- `mdkg-dev`
  - deployment: `dpl_HgKHLLeWbJ6KeCkqcTrBrh7zpBLw`
  - project: `prj_R9FJkRf2FsmcM9cuIyQbPTV9A056`
  - state: `READY`
  - commit: `790060a0a330b41cff95a0e9d798d4a52392f92e`
  - aliases include `mdkg.dev`, `www.mdkg.dev`, and `mdkg-dev.vercel.app`
  - build log: Astro static build completed and deployment completed.
- `mdkg-docs`
  - deployment: `dpl_8qocYxCaLzNaiKbjEoRQq7rFkqaE`
  - project: `prj_3Aoh90VnkqNmqM6AnX9t72fSULEd`
  - state: `READY`
  - commit: `790060a0a330b41cff95a0e9d798d4a52392f92e`
  - aliases include `docs.mdkg.dev` and `mdkg-docs.vercel.app`
  - build log: Starlight/Astro static build completed, Pagefind index built,
    sitemap created, and deployment completed.

# Verification / Testing

## Command Evidence

- command: Vercel get deployment for `dpl_HgKHLLeWbJ6KeCkqcTrBrh7zpBLw`.
- result: `READY`, expected aliases, no alias error.
- command: Vercel get deployment for `dpl_8qocYxCaLzNaiKbjEoRQq7rFkqaE`.
- result: `READY`, expected aliases, no alias error.
- command: Vercel build logs for both deployments.
- result: successful build and deployment logs observed.

## Pass / Fail Status

- status: pass.

## Known Warnings

- A previous deployment attempt at commit `ca24e58` failed because Vercel did
  not accept the attempted `key: "host"` route/header matcher. The final commit
  `790060a` removed that unsupported configuration and deployed successfully.

# Known Issues / Follow-ups

- Optional follow-up: determine whether default production `*.vercel.app`
  aliases need additional dashboard-level handling.

## Follow-up Refs

- `task-571`
- `task-572`

# Links / Artifacts

- commit: `790060a`
- `mdkg-dev` deployment: `dpl_HgKHLLeWbJ6KeCkqcTrBrh7zpBLw`
- `mdkg-docs` deployment: `dpl_8qocYxCaLzNaiKbjEoRQq7rFkqaE`

# Raw Content Safety

- Evidence stores deployment IDs, project IDs, commit IDs, aliases, and bounded
  build summaries only. No Vercel secrets, tokens, cookies, or credentials are
  stored.
