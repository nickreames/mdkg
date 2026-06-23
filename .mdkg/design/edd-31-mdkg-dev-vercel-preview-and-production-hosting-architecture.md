---
id: edd-31
type: edd
title: mdkg.dev Vercel preview and production hosting architecture
tags: [mdkg-dev, vercel, hosting]
owners: []
links: []
artifacts: []
relates: []
refs: []
aliases: []
created: 2026-06-22
updated: 2026-06-22
---
# Overview

mdkg.dev hosting uses Vercel preview deployments first, then explicit manual DNS cutover only after visual, metadata, and no-secret validation passes.

# Architecture

- Marketing project: Vercel project `mdkg-dev`.
- Repository root setting: `mdkg-dev/`.
- Build command: `npm run build`.
- Output directory: `dist`.
- Production domain later: `mdkg.dev`, with `www.mdkg.dev` redirecting to apex.
- Preview validation happens before any production domain binding.

# Data model

- Project: name, root, framework, build command, output directory.
- Deployment: preview URL, commit SHA, build status, logs, validation receipt.
- Domain: apex, www redirect, DNS target, manual cutover status.

# APIs / interfaces

- Chrome UI is preferred for first Vercel project setup.
- Vercel plugin may inspect teams, projects, deployments, logs, and share URLs after resources exist.
- DNS provider changes are manual and outside mdkg automation.

# Failure modes

- Wrong root directory: preview fails or deploys the CLI repo root; reject and recreate/configure project before DNS.
- Preview protection blocks Browser validation: use Vercel share/access URL and record it only as a non-secret artifact reference.
- Build passes but metadata is wrong: fix site source in a later implementation goal before cutover.

# Observability

- Vercel deployment status and logs.
- Browser/Chrome route validation receipts.
- `npm run smoke:mdkg-dev`, `npm run smoke:mdkg-dev-seo`, and no-secret checks before deploy.

# Security / privacy

- Do not store Vercel tokens, DNS credentials, cookies, or deployment bypass secrets in mdkg.
- Do not click external links during preview QA; inspect hrefs only.
- Keep DNS cutover manual and separately approved.

# Testing strategy

- Validate local build before preview.
- Validate preview routes, metadata, sitemap, robots, `llms.txt`, screenshots, console errors, and responsive layouts.
- Validate DNS records after manual cutover in a later launch goal.

# Rollout plan

1. Create preview project with root `mdkg-dev/`.
2. Deploy preview URL.
3. Validate preview with Browser/Chrome and Vercel logs.
4. Record evidence and decide polish work.
5. Later, after approval, bind domains and update DNS manually.
