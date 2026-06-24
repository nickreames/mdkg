---
id: chk-223
type: checkpoint
title: Goal 32 pushed Vercel preview redeploy proof
checkpoint_kind: implementation
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [task-517]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [task-517]
created: 2026-06-23
updated: 2026-06-23
---
# Summary

Goal 32 implementation commits were pushed to `origin/main` without force, and both existing Vercel preview projects rebuilt the pushed commit successfully. Hosted Browser, Chrome, Vercel alias fetch, and Vercel build-log checks confirm the public-alpha pass-2 site/docs changes are live on the `.vercel.app` preview aliases.

# Scope Covered

Scope covers `task-517`, `test-246`, and `test-247`.

## Changed Surfaces

- Remote `origin/main` now includes Goal 32 implementation commits through `b6061af932077d10d3d19a54875dc40bf08a79d2`.
- Existing Vercel projects `mdkg-dev` and `mdkg-docs` redeployed from the pushed commit.
- mdkg task/test evidence was updated with deployment and no-launch proof.

## Boundaries

- in scope: non-force push, Vercel deployment/log inspection, hosted alias fetches, Browser route checks, Chrome alias spot checks.
- out of scope: DNS changes, custom-domain binding, Vercel production promotion for `mdkg.dev`/`docs.mdkg.dev`, npm publish, git tag, analytics activation, GitHub settings mutation, and public launch announcement.
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded: yes; evidence uses ids, refs, summarized logs, and public URLs only.

# Decisions Captured

Link the most important decision records.

# Implementation Summary

The final Goal 32 implementation stack was pushed to GitHub and Vercel built both subprojects from that commit. Vercel's project-list endpoint still returned an empty project list for the team, so deployment proof used known project IDs plus deployment listing, build logs, alias fetches, Browser checks, and Chrome checks.

# Implementation Details

- Code or graph surfaces changed: remote `main`, Vercel deployments, and mdkg evidence nodes.
- Architecture or data-shape notes: marketing stays in `mdkg-dev/`, docs stay in `docs/`, and hosted canonical metadata still points to future custom domains while preview aliases remain the validation target.
- Compatibility notes: Vercel reports target `production` for `.vercel.app` project aliases on `main`; no custom domain DNS or public launch action occurred.

# Verification / Testing

## Command Evidence

- `git push origin main`: pass, advanced `main` from `b83fe72` to `b6061af`.
- Vercel deployment list for project `prj_R9FJkRf2FsmcM9cuIyQbPTV9A056`: latest `mdkg-dev` deployment `dpl_524cCFF6BWbw2MsS4ioVcwxwUhcJ`, `READY`, commit `b6061af`.
- Vercel deployment list for project `prj_3Aoh90VnkqNmqM6AnX9t72fSULEd`: latest `mdkg-docs` deployment `dpl_85Si5nKQ1zvcLKgd7uhnFTh4ETcc`, `READY`, commit `b6061af`.
- Vercel build logs for `dpl_524cCFF6BWbw2MsS4ioVcwxwUhcJ`: cloned `github.com/nickreames/mdkg`, branch `main`, commit `b6061af`, ran `npm run build`, output `/vercel/path0/mdkg-dev/dist/`, deployment completed.
- Vercel build logs for `dpl_85Si5nKQ1zvcLKgd7uhnFTh4ETcc`: cloned `github.com/nickreames/mdkg`, branch `main`, commit `b6061af`, ran `npm run build`, output `/vercel/path0/docs/dist/`, generated 28 pages, built Pagefind search, created sitemap, deployment completed.
- Vercel alias fetches: HTTP 200 for `https://mdkg-dev.vercel.app/`, `https://mdkg-docs.vercel.app/`, `llms.txt`, `llms-full.txt`, `robots.txt`, marketing sitemap, and docs sitemap index.
- Browser hosted HTML check: marketing `/`, `/quickstart/`, `/trust/`, `/alpha/`, deleted `/docs/` route, docs `/`, install, quickstart, Plan -> Work -> Evidence, read-only MCP, demo graphs, and CLI reference all checked.
- Chrome hosted spot check: `https://mdkg-dev.vercel.app/` and `https://mdkg-docs.vercel.app/` loaded expected current H1/title content with no console errors.

## Pass / Fail Status

- status: pass.

## Known Warnings

- Vercel project list returned an empty list for the team; direct deployment listing by known project IDs worked.
- Browser extension blocked direct Browser navigation to `https://mdkg-dev.vercel.app/llms.txt`; the text assets were verified through Vercel fetch instead.

# Known Issues / Follow-ups

- Custom-domain DNS and production launch remain deferred.
- Generated visual assets and a demo video storyboard remain deferred to `task-519` and `test-248`.

## Follow-up Refs

- `task-518`
- `task-519`
- `test-248`

# Links / Artifacts

- `https://mdkg-dev.vercel.app/`
- `https://mdkg-docs.vercel.app/`
- `https://vercel.com/nicholas-reames-projects/mdkg-dev/524cCFF6BWbw2MsS4ioVcwxwUhcJ`
- `https://vercel.com/nicholas-reames-projects/mdkg-docs/85Si5nKQ1zvcLKgd7uhnFTh4ETcc`
- commit `b6061af932077d10d3d19a54875dc40bf08a79d2`

# Raw Content Safety

- Summarize evidence and use refs, hashes, and artifact links instead of raw secrets, raw prompts, raw payloads, or bulky execution traces.
