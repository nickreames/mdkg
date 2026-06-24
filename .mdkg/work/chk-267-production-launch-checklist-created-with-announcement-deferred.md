---
id: chk-267
type: checkpoint
title: Production launch checklist created with announcement deferred
checkpoint_kind: implementation
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [task-571]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [task-571]
created: 2026-06-24
updated: 2026-06-24
---
# Summary

The production cutover checklist was created for the mdkg.dev public launch
state after custom-domain verification. Launch announcement remains explicitly
deferred.

# Scope Covered

Scope: `task-571` and `test-288`.

## Changed Surfaces

- mdkg evidence/checklist only.

## Boundaries

- In scope: checklist for the approved custom-domain cutover and production
  domain verification.
- Out of scope: public announcement, npm publish, git tag, analytics
  activation, GitHub settings mutation, and further DNS changes.
- Raw secrets, raw prompts, raw payloads, and bulky execution traces excluded.

# Decisions Captured

- Production domains are live and indexable immediately.
- Announcement and broader public launch activity require a separate explicit
  goal/request.

# Implementation Summary

The checklist separates "production domain is live" from "public launch
announcement is complete" so the repo can verify infrastructure and crawlers
without accidentally starting marketing/announcement work.

# Implementation Details

Production checklist:

- `https://mdkg.dev/` serves the marketing app.
- `https://www.mdkg.dev/` redirects to `https://mdkg.dev/`.
- `https://docs.mdkg.dev/` serves the Starlight docs app.
- `https://mdkg.dev/docs` redirects to `https://docs.mdkg.dev/`.
- Production custom domains are not noindexed.
- Production robots and sitemaps point at canonical production domains.
- Browser and Chrome screenshots are archived.
- Vercel deployment IDs and logs are recorded.
- No npm publish was run.
- No git tag was created.
- No analytics activation was performed.
- No GitHub settings mutation was performed.
- No public launch announcement was posted.

# Verification / Testing

## Command Evidence

- command: route, Browser/Chrome, archive verify, and Vercel checks from
  `chk-260`, `chk-263`, and `chk-265`.
- result: pass.

## Pass / Fail Status

- status: pass.

## Known Warnings

- Public announcement remains deferred by design.

# Known Issues / Follow-ups

- Future launch-announcement goal should cover public copy, social announcement,
  repository metadata updates, analytics activation if desired, and post-launch
  monitoring.

## Follow-up Refs

- `task-572`

# Links / Artifacts

- `chk-260`
- `chk-263`
- `chk-265`

# Raw Content Safety

- Checklist stores summarized route, deployment, and boundary evidence only.
