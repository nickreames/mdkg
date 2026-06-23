---
id: task-481
type: task
title: record evidence commit graph closeout and leave DNS deferred
status: done
priority: 1
epic: epic-142
parent: goal-28
tags: []
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-22
updated: 2026-06-22
---
# Overview

Record final evidence for the preview implementation and keep public launch work explicitly deferred.

# Acceptance Criteria

- mdkg evidence records preview URLs, Vercel project ids/slugs, deployment ids, validation result, known warnings, and deferred work.
- A final checkpoint confirms no DNS, production promotion, npm publish, git tag, analytics activation, or public launch occurred.
- Closeout graph changes are committed and pushed to `origin/main`.

# Files Affected

List files/directories expected to change.

- `.mdkg/work/goal-28-*`
- final checkpoint

# Implementation Notes

- Use refs and URLs only; never store secrets, cookies, tokens, or private bypass values.

# Test Plan

- `node dist/cli.js validate --summary --json --limit 20`
- `node dist/cli.js goal next goal-28 --json`
- `git status --short --branch`
- `git push origin main`

# Links / Artifacts

- `test-223`

# Completion Evidence

- Final evidence checkpoint created: `chk-203`.
- Preview URLs:
  - `https://mdkg-dev.vercel.app`
  - `https://mdkg-docs.vercel.app`
- Vercel projects:
  - `mdkg-dev` / `prj_R9FJkRf2FsmcM9cuIyQbPTV9A056`
  - `mdkg-docs` / `prj_3Aoh90VnkqNmqM6AnX9t72fSULEd`
- Vercel deployments:
  - `mdkg-dev`: `dpl_7oq5idj6rjsamgPt1DgXXyiMb2VT`, state `READY`.
  - `mdkg-docs`: `dpl_BSRCqokvScb8Uvot4cHBu27bmKg2`, state `READY`.
- Live validation:
  - Chrome route checks passed for marketing and docs HTML routes with no page-level console errors.
  - In-app Browser opened and verified both preview homepages.
  - Direct live asset checks passed for LLM docs, robots, marketing sitemap, and docs sitemap index.
- Boundaries confirmed:
  - No DNS change.
  - No custom-domain binding.
  - No production promotion beyond default Vercel imported `main` deployment/preview aliases.
  - No npm publish.
  - No git tag.
  - No analytics activation.
  - No public launch announcement.
