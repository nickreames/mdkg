---
id: test-451
type: test
title: v0.5.2 main CI and production docs contract
status: todo
priority: 1
parent: goal-67
next: task-757
tags: [goal-67, test, main, ci, vercel, docs, production, 0.5.2]
owners: []
links: []
artifacts: []
relates: [task-790]
blocked_by: [task-790]
blocks: [task-757]
refs: [goal-67, goal-66]
context_refs: [goal-71]
evidence_refs: []
aliases: [v0-5-2-production-docs-contract]
skills: []
cases: [fast-forward-main, exact-sha-ci, vercel-ready, docs-materialization-page, docs-cli-reference, docs-changelog, links-seo-robots-sitemap, mdkg-dev-basic-health, no-browser]
created: 2026-07-15
updated: 2026-07-15
---

# Overview

Prove the exact published release history reached `origin/main` without force,
post-push CI and deployments are healthy, and docs.mdkg.dev exposes current
`0.5.2` materialization documentation without Browser or Chrome.

# Test Cases

- Local and remote main contain the published release commit; push was fast-
  forward and no tag or PR was created.
- Every configured GitHub release-readiness job passes for the pushed SHA.
- Vercel deployments are READY and identify the pushed commit.
- docs.mdkg.dev returns successful HTTP responses for the materialization guide,
  generated CLI reference, and changelog; expected command/schema/version
  markers are present and stale latest-release claims are absent.
- Existing link, SEO, robots, sitemap, and docs smoke checks pass.
- mdkg.dev receives no authored source/copy diff and passes only basic
  deployment/HTTP health; its automatic package-derived version metadata is
  accepted.
- No Browser/Chrome, direct provider mutation, force push, tag, unpublish, or
  rollback occurs.

# Results / Evidence

- Pending post-push execution. Any failure blocks `task-757`.
