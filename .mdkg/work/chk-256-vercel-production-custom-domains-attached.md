---
id: chk-256
type: checkpoint
title: Vercel production custom domains attached
checkpoint_kind: implementation
status: backlog
priority: 9
tags: [goal-36, vercel, domains, mdkg-dev, production-domain]
owners: []
links: []
artifacts: []
relates: [task-564]
blocked_by: []
blocks: []
refs: [goal-36, task-564, task-565]
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [task-564]
created: 2026-06-24
updated: 2026-06-24
---
# Summary

Verified and completed Vercel custom-domain attachment for the production cutover scope.

Chrome UI showed:

- `mdkg-dev` project has `mdkg.dev` attached as `Valid Configuration / Production`.
- `mdkg-dev` project has `www.mdkg.dev` attached as `Valid Configuration / 307 mdkg.dev`.
- `mdkg-docs` project has `docs.mdkg.dev` attached as `Valid Configuration / Production`.

The Vercel project metadata tool still returned only default `*.vercel.app` domains, so Chrome UI was the authoritative project-domain evidence for this task.

# Scope Covered

Keep `scope` frontmatter updated when possible.

## Changed Surfaces

- Vercel project `mdkg-dev`: added/verified `www.mdkg.dev` redirect-only domain to `mdkg.dev`.
- Vercel project `mdkg-dev`: verified existing `mdkg.dev` production domain attachment.
- Vercel project `mdkg-docs`: verified existing `docs.mdkg.dev` production domain attachment.
- mdkg graph: closed `task-564` and claimed `task-565`.

## Boundaries

- in scope: only the three scoped production domains and the two scoped Vercel projects.
- out of scope: unrelated Vercel projects, DNS mutation outside Vercel-managed domain state, source edits, npm publish, tag, analytics activation, GitHub settings mutation, public announcement.
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded: yes.

# Decisions Captured

- `www.mdkg.dev` is a redirect-only domain to `mdkg.dev`.
- `docs.mdkg.dev` is the canonical docs production host.

# Implementation Summary

The domain attachment phase is complete; `task-565` owns DNS/SSL propagation proof next.

# Implementation Details

- Code or graph surfaces changed: Vercel custom-domain settings and mdkg task/checkpoint state.
- Architecture or data-shape notes: Vercel UI is authoritative for custom-domain attachment because the available project metadata tool did not include custom domains.
- Compatibility notes: no source changes were made in this task.

# Verification / Testing

## Command Evidence

- command: Vercel tool `_get_project` for `mdkg-dev`
- result: latest deployment ready, but domains array only included default `*.vercel.app` domains.
- command: Vercel tool `_get_project` for `mdkg-docs`
- result: latest deployment ready, but domains array only included default `*.vercel.app` domains.
- command: Chrome UI `/nicholas-reames-projects/mdkg-dev/settings/domains`
- result: `mdkg.dev Valid Configuration Production`; `www.mdkg.dev Valid Configuration 307 mdkg.dev`; `mdkg-dev.vercel.app Valid Configuration Production`.
- command: Chrome UI `/nicholas-reames-projects/mdkg-docs/settings/domains`
- result: `docs.mdkg.dev Valid Configuration Production`; `mdkg-docs.vercel.app Valid Configuration Production`.
- command: network DNS/HTTPS probe after attachment
- result: apex served HTTPS 200 from Vercel; `www` served HTTPS 307 redirect to apex; docs served HTTPS 200 from Vercel.

## Pass / Fail Status

- status: pass for task-564.

## Known Warnings

- warning: Vercel API metadata did not show custom domains even when Chrome UI did; keep Chrome UI receipt as the project-domain source for this task.

# Known Issues / Follow-ups

- `task-565` must still prove DNSSEC/DS absence, authoritative/recursive DNS consistency, and SSL health in more detail.
- Later tasks must still remove production noindex and implement `mdkg.dev/docs` redirect.

## Follow-up Refs

- `task-565`
- `test-282`
- `test-283`

# Links / Artifacts

- Vercel project `mdkg-dev`
- Vercel project `mdkg-docs`
- `task-564`
- `goal-36`

# Raw Content Safety

- Evidence summarized from visible Vercel domain rows and network receipts. No tokens, credentials, provider payloads, private account screenshots, or raw prompts were stored.
