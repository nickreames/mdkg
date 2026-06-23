---
id: chk-203
type: checkpoint
title: goal-28 Vercel preview closeout
checkpoint_kind: goal-closeout
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [goal-28, task-478, task-479, task-480, task-481, test-221, test-222, test-223]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: []
created: 2026-06-22
updated: 2026-06-22
---
# Summary

Goal-28 completed the mdkg.dev preview implementation lane. The repo now has a Starlight docs subproject, the marketing docs bridge points at Starlight/docs.mdkg.dev, implementation commits were pushed to `origin/main`, and Vercel preview projects were created and validated for both the marketing site and docs site.

# Scope Covered

Keep `scope` frontmatter updated when possible.

## Changed Surfaces

- Source/site/docs implementation was completed before this closeout checkpoint:
  - `mdkg-dev/` marketing bridge and generated static site checks.
  - `docs/` Starlight docs site.
  - README/AGENT_START/CLI matrix/docs references from GitBook to Starlight.
  - smoke/readiness checks for mdkg-dev and docs.
- Vercel projects created through Chrome:
  - `mdkg-dev`
  - `mdkg-docs`
- mdkg graph evidence updated:
  - `task-477` through `task-481`
  - `test-221` through `test-223`

## Boundaries

- in scope: local implementation, local validation, local commits, push to `origin/main`, Chrome-created Vercel preview projects, Vercel deployment/log verification, Browser/Chrome live URL checks.
- out of scope: DNS, custom-domain binding, production promotion, npm publish, git tag, analytics activation, public launch announcement.
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded: yes. Evidence records refs, URLs, IDs, commands, and summarized results only.

# Decisions Captured

Link the most important decision records.

- `dec-33`: apex `mdkg.dev` is canonical and `www` redirects to apex.
- `dec-34`: preview deploy comes before manual DNS cutover or production promotion.
- `dec-35`: Starlight replaces GitBook; `docs.mdkg.dev` is canonical docs and `/docs` is a marketing bridge.

# Implementation Summary

- Marketing Vercel project:
  - Project: `mdkg-dev`
  - Project id: `prj_R9FJkRf2FsmcM9cuIyQbPTV9A056`
  - Root: `mdkg-dev`
  - Framework: Astro
  - Build/output: `npm run build`, `dist`
  - Deployment id: `dpl_7oq5idj6rjsamgPt1DgXXyiMb2VT`
  - Preview URL: `https://mdkg-dev.vercel.app`
- Docs Vercel project:
  - Project: `mdkg-docs`
  - Project id: `prj_3Aoh90VnkqNmqM6AnX9t72fSULEd`
  - Root: `docs`
  - Framework: Astro / Starlight
  - Build/output: `npm run build`, `dist`
  - Deployment id: `dpl_BSRCqokvScb8Uvot4cHBu27bmKg2`
  - Preview URL: `https://mdkg-docs.vercel.app`
- Both projects build from GitHub repo `nickreames/mdkg`, branch `main`, commit `1240f86`.

# Goal Closeout

- Goal condition result: achieved for preview implementation and validation.
- Scoped nodes closed: `task-472` through `task-480`, `test-218` through `test-223`; `task-481` is closing with this checkpoint.
- Remaining deferred work: DNS setup for `mdkg.dev`, `www.mdkg.dev`, and `docs.mdkg.dev`; custom-domain binding; production launch/promotion decisions; analytics activation; additional design/docs polish after preview critique.

# Verification / Testing

## Command Evidence

- `npm --prefix mdkg-dev run build`: passed.
- `npm --prefix docs run build`: passed.
- `npm run docs:check`: passed.
- `npm run smoke:mdkg-dev`: passed.
- `npm run smoke:mdkg-dev-docs`: passed.
- `npm run smoke:mdkg-dev-seo`: passed.
- `npm run smoke:demo-graph`: passed.
- `npm run build`: passed.
- `npm run test`: passed.
- `npm run cli:contract`: passed.
- `git push origin main`: passed, updating `origin/main` to `1240f86`.
- Vercel build logs:
  - `mdkg-dev`: clone `github.com/nickreames/mdkg`, branch `main`, commit `1240f86`, Astro static build, output `/vercel/path0/mdkg-dev/dist/`, deployment completed.
  - `mdkg-docs`: clone `github.com/nickreames/mdkg`, branch `main`, commit `1240f86`, Starlight static build, Pagefind search index, sitemap generation, output `/vercel/path0/docs/dist/`, deployment completed.
- Chrome live route checks:
  - Marketing: `/`, `/quickstart/`, `/trust/`, `/alpha/`, `/docs/`.
  - Docs: `/`, `/start-here/quickstart/`, `/start-here/install/`, `/reference/generated-cli-reference/`, `/reference/command-contract/`, `/project/claims-evidence-matrix/`.
- In-app Browser live checks:
  - `https://mdkg-dev.vercel.app/`
  - `https://mdkg-docs.vercel.app/`
- Direct live asset checks:
  - `https://mdkg-dev.vercel.app/llms.txt`
  - `https://mdkg-dev.vercel.app/llms-full.txt`
  - `https://mdkg-dev.vercel.app/robots.txt`
  - `https://mdkg-dev.vercel.app/sitemap.xml`
  - `https://mdkg-docs.vercel.app/sitemap-index.xml`
- `node dist/cli.js validate --summary --json --limit 20`: passed, zero warnings/errors.
- `node dist/cli.js doctor --strict --json`: passed with one expected local-only project DB runtime warning.
- `git diff --check`: passed.

## Pass / Fail Status

- status: pass.

## Known Warnings

- `db.runtime_transient_files`: expected local-only `.mdkg/db/runtime/project.sqlite` warning; project DB verify passes.
- Chrome direct navigation to `https://mdkg-dev.vercel.app/llms.txt` was blocked by a local browser extension (`ERR_BLOCKED_BY_CLIENT`), so text assets were verified with direct network checks instead.
- Public safety-boundary pages intentionally mention tokens/raw prompts/raw payloads as prohibited content; narrow secret-pattern checks passed.

# Known Issues / Follow-ups

- Preview deployments are currently on Vercel-provided URLs, not mdkg.dev custom domains.
- Docs and marketing are preview-ready, but public launch polish and DNS cutover remain separate explicit work.

## Follow-up Refs

- `goal-21`: canonical mdkg.dev launch readiness.
- `goal-23`: warning-scale diagnostics and multi-repo UX hardening, currently paused.
- Future DNS/custom-domain/public-launch goal to bind `mdkg.dev`, `www.mdkg.dev`, and `docs.mdkg.dev` after preview review.

# Links / Artifacts

- Marketing preview: `https://mdkg-dev.vercel.app`
- Docs preview: `https://mdkg-docs.vercel.app`
- Marketing Vercel project: `mdkg-dev`
- Docs Vercel project: `mdkg-docs`
- Latest pushed implementation/evidence commit: `1240f86`

# Raw Content Safety

- Summarize evidence and use refs, hashes, and artifact links instead of raw secrets, raw prompts, raw payloads, or bulky execution traces.
- No secrets, cookies, tokens, deployment bypass values, DNS credentials, or raw runtime payloads were stored in this checkpoint.
