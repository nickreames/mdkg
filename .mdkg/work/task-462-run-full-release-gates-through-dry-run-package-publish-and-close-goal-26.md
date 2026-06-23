---
id: task-462
type: task
title: run full release gates through dry-run package publish and close goal-26
status: blocked
priority: 1
epic: epic-130
parent: goal-26
tags: [mdkg-dev, prepublish, closeout]
owners: []
links: []
artifacts: []
relates: [goal-26, test-211]
blocked_by: [task-461]
blocks: []
refs: []
context_refs: [chk-194]
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint]
created: 2026-06-22
updated: 2026-06-22
---
# Overview

Run the full goal-26 release-readiness gate chain through dry-run package/publish and close the goal with no-public-side-effect evidence.

# Acceptance Criteria

- All required checks listed on goal-26 pass with current evidence.
- Browser E2E receipt and selected screenshots are archived and referenced.
- `test-211` is closed with final pre-release proof.
- A final goal-26 closeout checkpoint records commands, archive refs, known warnings, and stop-condition confirmation.
- goal-26 is marked done/achieved only after acceptance criteria are met.
- No real npm publish, deploy, tag, push, global install, DNS change, Vercel production promotion, GitBook production sync, or public launch occurred.

# Files Affected

- `.mdkg/work/chk-*`
- goal-26 scoped task/test files
- `.mdkg/index/mdkg.sqlite`

# Implementation Notes

- Do not run real publish or deploy commands.
- Stop and report the failing command if any release gate fails.

# Test Plan

- `npm run smoke:mdkg-dev`
- `npm run smoke:mdkg-dev-docs`
- `npm run smoke:mdkg-dev-seo`
- `npm run smoke:demo-graph`
- `npm run build`
- `npm run test`
- `npm run cli:check`
- `npm run cli:contract`
- `npm run prepublishOnly`
- `node scripts/assert-publish-ready.js`
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json`
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run`
- `git diff --check`

# Links / Artifacts

- goal-26
- test-211
- chk-200
