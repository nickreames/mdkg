---
id: chk-224
type: checkpoint
title: Goal 32 pass 2 public alpha closeout
checkpoint_kind: implementation
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [task-518]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [task-518]
created: 2026-06-23
updated: 2026-06-23
---
# Summary

Goal 32 completed the pass-2 mdkg.dev public-alpha polish run. The marketing site and Starlight docs now implement the pass-2 P0, P1, P2, and P3 story map; local builds, smokes, Browser/Chrome/Product Design checks, full mdkg release-quality gates, logical commits, `origin/main` push, and Vercel preview redeploy proof are recorded.

# Scope Covered

Scope covers final Goal 32 closeout via `task-518`, with supporting evidence in checkpoints `chk-216` through `chk-223`.

## Changed Surfaces

- `mdkg-dev/`: public positioning, Plan -> Work -> Evidence model, command UX, trust/alpha pages, quickstart, deleted `/docs` bridge, and manually rewritten `llms.txt` / `llms-full.txt`.
- `docs/`: Starlight docs IA, install and quickstart docs, concepts, node/reference docs, advanced alpha guides, generated CLI reference entrypoint, and sitemap/search output.
- `scripts/` and `package.json`: pass-2 polish smoke and launch-quality assertions.
- `.mdkg/work/`: Goal 32 task/test/checkpoint evidence, deferred visual/video follow-up nodes, and final closeout state.
- Remote and preview proof: `main` pushed to `origin/main`; existing Vercel projects `mdkg-dev` and `mdkg-docs` redeployed the pushed commit.

## Boundaries

- in scope: site/docs polish, docs IA, local QA, Product Design review evidence, required smokes, logical commits, non-force push to `origin/main`, hosted preview validation, and mdkg closeout evidence.
- out of scope: DNS changes, custom-domain binding, Vercel production promotion for `mdkg.dev`/`docs.mdkg.dev`, npm publish, git tag, analytics activation, GitHub settings mutation, generated visual assets, demo video production, and public launch announcement.
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded: yes; evidence uses refs, command summaries, public URLs, commit ids, and deployment ids.

# Decisions Captured

- Keep `mdkg.dev/docs` deleted for now; future `docs.mdkg.dev` redirect/cutover remains separate launch work.
- Keep Claims Evidence Matrix out of public navigation and treat it as internal evidence rather than public docs content.
- Keep generated visual assets and demo-video storyboard deferred to `task-519` / `test-248`.
- Treat `.vercel.app` preview validation as sufficient for this goal while custom-domain DNS and production launch remain later explicit work.

# Implementation Summary

Goal 32 moved mdkg.dev from "preview scaffold with public-alpha content" to a stronger public-alpha preview: the homepage and docs now explain mdkg as Git-native project memory for AI coding agents, use the Plan -> Work -> Evidence model consistently, and avoid unsupported public claims or implementation-meta language. The docs site now carries the deeper Starlight experience, including install, quickstart, concepts, node/reference material, MCP/subgraph/demo advanced-alpha pages, and generated-reference entrypoints.

# Implementation Details

- Code or graph surfaces changed: marketing Astro routes/assets, Starlight docs pages, launch polish smoke scripts, package scripts, README/package copy, and mdkg graph evidence.
- Architecture or data-shape notes: marketing remains in `mdkg-dev/`; docs remain in `docs/`; canonical metadata targets future custom domains while `.vercel.app` aliases are the current preview validation URLs.
- Compatibility notes: no npm package publish occurred, and no CLI runtime source changed in this closeout slice beyond docs/package metadata and smoke/readiness wiring.

# Verification / Testing

## Command Evidence

- `npm --prefix mdkg-dev run build`: pass.
- `npm --prefix docs run build`: pass.
- `npm run docs:check`: pass.
- `npm run smoke:mdkg-dev`: pass.
- `npm run smoke:mdkg-dev-docs`: pass.
- `npm run smoke:mdkg-dev-seo`: pass.
- `npm run smoke:demo-graph`: pass.
- `npm run smoke:mdkg-dev-polish-pass2`: pass.
- `npm run build`: pass.
- `npm run test`: pass, 507 tests and 0 failures.
- `npm run cli:check`: pass.
- `npm run cli:contract`: pass, command contract hash `bb6d15e23a09b9a013aed406eac42e4e90f8ef6cb799759198a7777b3527ca74`.
- `node dist/cli.js validate --summary --json --limit 20`: pass at local gate time with 0 warnings/errors.
- `node dist/cli.js doctor --strict --json`: pass at local gate time with only expected ignored local DB runtime warning.
- `git diff --check`: pass.
- `git push origin main`: pass, non-force push through commit `b6061af932077d10d3d19a54875dc40bf08a79d2`.
- Vercel `mdkg-dev`: deployment `dpl_524cCFF6BWbw2MsS4ioVcwxwUhcJ`, state `READY`, commit `b6061af`, alias `https://mdkg-dev.vercel.app/`.
- Vercel `mdkg-docs`: deployment `dpl_85Si5nKQ1zvcLKgd7uhnFTh4ETcc`, state `READY`, commit `b6061af`, alias `https://mdkg-docs.vercel.app/`.
- Browser hosted route check: pass for marketing `/`, `/quickstart/`, `/trust/`, `/alpha/`, deleted `/docs/`, and docs install/quickstart/concepts/advanced/reference routes.
- Chrome hosted spot check: pass for `https://mdkg-dev.vercel.app/` and `https://mdkg-docs.vercel.app/`.

## Pass / Fail Status

- status: pass.

## Known Warnings

- Vercel project-list returned no projects for the team, so deployment proof used known project ids, direct deployment lookup, build logs, alias fetches, Browser checks, and Chrome checks.
- Browser extension blocked direct Browser navigation to `https://mdkg-dev.vercel.app/llms.txt`; the text assets were verified through Vercel fetch instead.
- Vercel reports target `production` for `.vercel.app` main-branch aliases. This is the existing project alias behavior and did not include custom-domain DNS cutover or public launch.

# Known Issues / Follow-ups

- Custom-domain DNS and production launch remain deferred.
- Generated visual assets and demo-video storyboard remain deferred.

## Follow-up Refs

- `goal-21`
- `task-519`
- `test-248`

# Links / Artifacts

- `https://mdkg-dev.vercel.app/`
- `https://mdkg-docs.vercel.app/`
- `https://vercel.com/nicholas-reames-projects/mdkg-dev/524cCFF6BWbw2MsS4ioVcwxwUhcJ`
- `https://vercel.com/nicholas-reames-projects/mdkg-docs/85Si5nKQ1zvcLKgd7uhnFTh4ETcc`
- commit `b6061af932077d10d3d19a54875dc40bf08a79d2`
- `chk-216`
- `chk-217`
- `chk-218`
- `chk-219`
- `chk-220`
- `chk-221`
- `chk-222`
- `chk-223`

# Raw Content Safety

- Summarized evidence only. No raw secrets, tokens, credentials, cookies, raw prompts, raw provider payloads, or bulky execution traces were copied into this checkpoint.
