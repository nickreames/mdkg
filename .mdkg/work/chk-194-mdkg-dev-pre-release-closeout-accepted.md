---
id: chk-194
type: checkpoint
title: mdkg.dev pre-release closeout accepted
checkpoint_kind: goal-closeout
status: backlog
priority: 9
tags: [mdkg-dev, launch-readiness, goal-closeout]
owners: []
links: []
artifacts: []
relates: [goal-25, task-454, test-205]
blocked_by: []
blocks: []
refs: [archive://archive.mdkg-dev-planning-docs-2026-06-22]
context_refs: [prd-4, prd-5, edd-24, edd-25, edd-26, edd-27, edd-28, edd-29, edd-30, dec-30, dec-31, dec-32]
evidence_refs: [chk-186, chk-187, chk-188, chk-189, chk-190, chk-191, chk-192, chk-193]
aliases: []
skills: []
scope: [goal-25, task-454, test-205]
created: 2026-06-22
updated: 2026-06-22
---
# Summary

Goal-25 reached local pre-release readiness for the in-repo mdkg.dev launch workspace. The implementation now includes a static-first Astro site in `mdkg-dev/`, GitBook-ready docs source in `docs/`, generated command-reference docs, two example/demo mdkg graphs in `examples/`, private root-owned subgraph bundles, launch-readiness smoke automation, and root docs/readiness assertions.

The work is intentionally not deployed and not launched. It is ready for review, local preview, and a later explicit deploy/public-launch pass.

# Scope Covered

- `goal-25`
- `task-445` through `task-454`
- `test-200` through `test-206`
- Required closeout checkpoints `chk-186` through `chk-194`

## Changed Surfaces

- `mdkg-dev/`: Astro static site, design system, public-alpha pages, `llms.txt`, `llms-full.txt`, `robots.txt`, `sitemap.xml`, social card, claims matrix, and local package scripts.
- `docs/`: GitBook-ready docs source with start-here, concepts, guides, reference, advanced-alpha, project evidence, and generated command reference.
- `examples/`: `demo-agentic-coding` and `template-mdkg-dev` standalone mdkg graphs.
- `.mdkg/config.json` and `.mdkg/bundles/private/examples/`: private read-only demo/template subgraph registration.
- `scripts/`: docs generation and mdkg.dev/docs/SEO/demo graph smoke tests.
- `package.json`: `docs:*`, `smoke:mdkg-dev`, `smoke:mdkg-dev-docs`, `smoke:mdkg-dev-seo`, and `smoke:demo-graph`.
- `README.md`, `AGENT_START.md`, `CLI_COMMAND_MATRIX.md`, `.npmignore`, and `.gitignore`: root guidance and package/readiness boundaries.

## Boundaries

- in scope: local static site/docs/examples scaffolding, generated docs checks, no-secret/link/metadata smokes, root subgraph registration, and pre-release evidence.
- out of scope: real npm publish, tag, push, deploy, DNS change, Vercel production promotion, analytics activation, GitBook production sync, public launch, hosted queue claims, public worker execution, arbitrary SQL exposure, and public event/reducer/lease/materializer CLI claims.
- raw secrets, raw prompts, raw payloads, live provider traces, and bulky execution logs were excluded from nodes, docs, checkpoints, and generated handoffs.

# Decisions Captured

- `dec-30`: source ownership uses split `/mdkg-dev`, `/docs`, `/examples` layout inside this repo.
- `dec-31`: docs are repo-first, with GitBook as a renderer/sync target rather than canonical source.
- `dec-32`: Vercel readiness is allowed; production launch and analytics activation remain separate explicit work.
- `edd-28`: visual design system, tokens, component, and diagram contract.
- `edd-29`: public claims, SEO metadata, and launch measurement contract.
- `edd-30`: quality, accessibility, performance, and no-secret gate contract.

# Implementation Summary

The implementation uses a split-source architecture:

- `mdkg-dev/` is a static-first Astro site with crawlable HTML routes and no required client-side runtime for core content.
- `docs/` is canonical repo-owned documentation, with generated command docs derived from `dist/command-contract.json`.
- `examples/` contains complete mdkg graphs that can be packed, validated, shown from root-qualified subgraph qids, and used for demo/template planning.
- Private subgraph bundles make example graph state inspectable from the root without treating demo nodes as local executable work.
- Smoke tests run from the repo root and fail on missing routes, stale generated docs, unsafe launch claims, high-risk marker leakage, missing metadata, broken root subgraph registration, or package-readiness drift.

# Goal Closeout

- Goal condition result: accepted locally; goal-25 is pre-release ready after full build/test/CLI/docs/site/demo/prepublish/pack/publish dry-run gates.
- Scoped nodes closed: implementation tasks `task-445` through `task-454`; validation nodes `test-200` through `test-206`; checkpoints `chk-186` through `chk-194`.
- Remaining deferred work: human review, optional visual polish, browser screenshot review, real deploy configuration, GitBook production sync, Vercel preview/prod deployment, analytics activation, DNS, public launch, and any subsequent npm publish remain separate explicit requests.

# Verification / Testing

## Command Evidence

- `npm run build`: pass.
- `npm run test`: pass, 507 tests, 0 failures.
- `npm run cli:check`: pass.
- `npm run cli:contract`: pass with command contract hash `bb6d15e23a09b9a013aed406eac42e4e90f8ef6cb799759198a7777b3527ca74`.
- `node dist/cli.js validate --json`: pass, zero warnings/errors.
- `npm run smoke:command-docs`: pass, 98 command records.
- `npm run smoke:mdkg-dev`: pass, 11 required files.
- `npm run smoke:mdkg-dev-docs`: pass, 18 required files.
- `npm run smoke:mdkg-dev-seo`: pass.
- `npm run smoke:demo-graph`: pass.
- `npm run prepublishOnly`: pass.
- `node scripts/assert-publish-ready.js`: pass.
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json`: pass, `mdkg@0.3.7`, 163 files, package size about 327.4 kB.
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run`: pass, reported `+ mdkg@0.3.7`.
- `git diff --check`: pass.

## Pass / Fail Status

- status: pass.

## Known Warnings

- The example graphs intentionally preserve a root-scoped checkpoint context warning in `goal next goal-1`; `smoke:demo-graph` treats only the exact known `root:chk-1` non-actionable-scope warning as acceptable.
- The site/docs/example sources are excluded from npm package contents by `.npmignore`; this is intentional because they are repo launch assets, not CLI runtime payload.

# Known Issues / Follow-ups

- Review the mdkg.dev visual design in a browser before public launch; command smokes validate routes and metadata but not full visual polish.
- Decide GitBook production sync and custom-domain configuration in a dedicated launch/deploy goal.
- Decide Vercel preview and production deployment flow separately; no deployment happened in this goal.
- Add screenshot/performance/accessibility measurements during the deploy-readiness pass if the public site is promoted.
- Decide whether example/demo graph subgraph warnings should be eliminated later by introducing context-only goal scopes or adjusting demo graph checkpoint references.

## Follow-up Refs

- `goal-23`: warning-scale diagnostics and multi-repo UX hardening remains separate.
- `goal-21`: canonical mdkg.dev launch readiness remains a later public launch lane.
- Future deploy/launch goal: Vercel preview, GitBook sync, analytics, DNS, public launch, and post-launch validation.

# Links / Artifacts

- `mdkg-dev/`
- `docs/`
- `examples/demo-agentic-coding/`
- `examples/template-mdkg-dev/`
- `.mdkg/bundles/private/examples/demo-agentic-coding.mdkg.zip`
- `.mdkg/bundles/private/examples/template-mdkg-dev.mdkg.zip`
- `archive://archive.mdkg-dev-planning-docs-2026-06-22`

# Raw Content Safety

- Evidence is summarized by command name, pass/fail state, counts, hashes, and artifact refs.
- No raw secrets, raw prompts, provider payloads, tokens, credentials, live runtime traces, or bulky command output are stored in this checkpoint.
