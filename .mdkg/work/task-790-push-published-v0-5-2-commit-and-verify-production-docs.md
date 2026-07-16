---
id: task-790
type: task
title: push published v0.5.2 commit and verify production docs
status: done
priority: 1
parent: goal-67
prev: test-418
tags: [goal-67, push, ci, vercel, docs, production, 0.5.2]
owners: []
links: [https://github.com/nickreames/mdkg/actions/runs/29473265920, https://docs.mdkg.dev/advanced-alpha/git-materialization/, https://docs.mdkg.dev/reference/generated-cli-reference/, https://docs.mdkg.dev/project/changelog/, https://mdkg.dev/]
artifacts: []
relates: [goal-67]
blocked_by: [test-418]
blocks: [test-451]
refs: [goal-67, goal-66, test-451, task-757, chk-535, chk-536]
context_refs: [goal-71]
evidence_refs: []
aliases: [v0-5-2-production-docs-proof]
skills: [verify-close-and-checkpoint]
created: 2026-07-15
updated: 2026-07-15
---

# Overview

Push the exact published release history directly to `origin/main` without
force, then verify post-push CI, Vercel deployment identity/readiness, and
production docs through HTTP and repository smoke checks.

# Acceptance Criteria

- Recheck origin freshness immediately before push. Push only fast-forward
  `main`; if post-publication drift prevents it, preserve the published commit
  and reconcile through a normal fix-forward merge/commit with repeated gates.
- GitHub release-readiness CI passes for the pushed commit on every configured
  Node version.
- Vercel reports READY deployments from the pushed commit for docs.mdkg.dev and
  basic mdkg.dev health. Do not directly mutate provider configuration.
- docs.mdkg.dev serves the materialization guide, generated CLI command,
  `0.5.2` changelog card/detail, correct internal links, indexable metadata,
  robots, and sitemap without stale `0.5.1` latest-release claims.
- Run existing docs/site smoke, link, and SEO checks plus bounded HTTP probes.
  Do not use Browser or Chrome.
- Do not edit mdkg-dev source/copy; accept only its automatic rebuild and
  package-derived version metadata update.
- No Git tag, force push, PR, unpublish, rollback, or unrelated provider action.

# Test Plan

- `test-451`

# Completion Evidence

- Attach push SHA, CI run, Vercel deployment ids/SHAs/statuses, HTTP markers,
  and no-authored-mdkg-dev-diff proof.

# Files Affected

- `origin/main`, resulting CI/Vercel deployments, and bounded production
  verification evidence; no authored site source in this task.

# Implementation Notes

- Push only after npm and installed/root verification. Use HTTP and existing
  smokes rather than Browser or Chrome.

# Links / Artifacts

- `test-451`, GitHub CI receipts, and Vercel deployment evidence.
