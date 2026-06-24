---
id: test-246
type: test
title: push origin main and Vercel preview validation contract
status: done
priority: 1
tags: [mdkg-dev, vercel-preview]
owners: []
links: [https://mdkg-dev.vercel.app/, https://mdkg-docs.vercel.app/]
artifacts: []
relates: []
blocked_by: [task-517]
blocks: [task-518]
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
cases: [push-main, vercel-ready, hosted-browser-checks]
created: 2026-06-23
updated: 2026-06-23
---
# Overview

Validate that pushed changes redeploy on Vercel previews.

# Test Cases

- `main` is pushed to `origin/main` without force.
- Vercel projects `mdkg-dev` and `mdkg-docs` deploy the pushed commit.
- Hosted preview routes pass Browser/Chrome checks.

# Results / Evidence

- Passed.
- `main` was pushed to `origin/main` without force at commit `b6061af932077d10d3d19a54875dc40bf08a79d2`.
- Vercel `mdkg-dev` deployment `dpl_524cCFF6BWbw2MsS4ioVcwxwUhcJ` is `READY` and points to commit `b6061af`.
- Vercel `mdkg-docs` deployment `dpl_85Si5nKQ1zvcLKgd7uhnFTh4ETcc` is `READY` and points to commit `b6061af`.
- Build logs for both deployments show clone from `github.com/nickreames/mdkg`, branch `main`, commit `b6061af`, `npm run build`, static output, and deployment completion.
- Browser checked hosted marketing and docs routes with no console errors.
- Chrome checked both primary aliases with expected current H1/title content and no console errors.
- Vercel fetch confirmed HTTP 200 for homepage/docs aliases plus `llms.txt`, `llms-full.txt`, `robots.txt`, marketing sitemap, and docs sitemap index.
