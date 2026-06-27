---
id: task-606
type: task
title: prepare article announcement support and close 0.4.0 launch readiness
status: todo
priority: 2
epic: epic-204
parent: goal-42
tags: [0.4.0, article, announcement, closeout, launch]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-601, task-602, task-603, task-604, task-605, test-307, test-308, test-309, test-310]
blocks: [test-311, test-312]
refs: [task-601, task-602, task-603, task-604, task-605]
context_refs: []
evidence_refs: [chk-307]
aliases: []
skills: [verify-close-and-checkpoint]
created: 2026-06-26
updated: 2026-06-27
---
# Overview

Prepare the final article announcement support package and close the `0.4.0`
launch-readiness lane with change-audit, package-readiness, and public launch
evidence.

# Acceptance Criteria

- Article support references launch pages, release notes, and source-backed
  product claims.
- Git/changelog audit maps every publish-bound change to release notes,
  version references, tests, docs/site changes, browser proof, and package
  payload.
- Full package pre-publish gates, npm pack dry-run, and npm publish dry-run
  pass before any ready recommendation.
- Public deploy verification proves mdkg.dev and docs.mdkg.dev are live-current
  for 0.3.9 capability facts before any 0.4.0 launch-ready recommendation.
- A closeout checkpoint records public launch readiness, known boundaries, and
  any required follow-ups.
- The closeout recommends either `publish/launch ready pending explicit
  approval` or lists exact remaining gaps.
- No real `0.4.0` npm publish, tag, push, deploy, DNS, or analytics mutation
  happens unless explicitly approved in that execution pass.

# Files Affected

- mdkg checkpoint/goal closeout evidence
- handoff copy or article-support artifact if requested

# Implementation Notes

- Use June 28, 2026 as the article target date.
- Keep article claims aligned with `CHANGELOG.md` and validated public pages.
- Treat npm publish and public deploy/launch as separate approval boundaries
  after the readiness recommendation.
- `test-311` and `test-312` validate this closeout task after it runs; they do
  not block this task from becoming actionable once upstream website/docs,
  Browser/Chrome, SEO, no-secret, and example proof is complete.

# Test Plan

- `node dist/cli.js validate --json`
- `node dist/cli.js goal next goal-42 --json`
- `git log --oneline origin/main..HEAD`
- `git diff --name-status origin/main..HEAD`
- changelog/release note mapping for every publish-bound change
- `npm run build`
- `npm run test`
- `npm run cli:check`
- `npm run cli:contract`
- `npm run docs:check`
- `node scripts/assert-publish-ready.js`
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json`
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run --registry=https://registry.npmjs.org/`
- Product Design audit receipt
- Browser local desktop/mobile receipts
- Chrome live production verification receipts
- `git diff --check`
- `test-311`
- `test-312`

# Links / Artifacts

- `goal-42`
