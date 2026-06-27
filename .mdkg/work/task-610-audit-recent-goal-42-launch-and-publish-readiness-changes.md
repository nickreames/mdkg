---
id: task-610
type: task
title: audit recent goal-42 launch and publish-readiness changes
status: done
priority: 2
epic: epic-204
parent: goal-42
tags: [0.4.0, audit, browser, product-design, publish-readiness, launch-proof]
owners: []
links: []
artifacts: [/private/tmp/mdkg-goal42-readiness-audit-20260627/browser-evidence.json, /private/tmp/mdkg-goal42-readiness-audit-20260627/product-design-audit.md, /private/tmp/mdkg-goal42-readiness-audit-20260627]
relates: []
blocked_by: []
blocks: [task-606]
refs: [task-605, test-308, task-606, test-312, test-314]
context_refs: []
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint]
created: 2026-06-27
updated: 2026-06-27
---
# Overview

Run a read-only audit of the recent `goal-42` changes in `origin/main..HEAD`
for correctness, completeness, remaining gaps, and `0.4.0`
publish-readiness recommendation.

# Acceptance Criteria

- Audit range is refreshed with `git fetch origin main`, then mapped with
  `git log --oneline origin/main..HEAD` and
  `git diff --name-status origin/main..HEAD`.
- Fresh Product Design and Browser evidence is captured in a local
  `/private/tmp/mdkg-goal42-readiness-audit-YYYYMMDD` folder.
- Product Design findings classify each issue as `must fix before 0.4.0
  readiness`, `acceptable`, or `blocked by deploy approval`.
- Browser verifies local built mdkg.dev/docs pages and live production pages
  for version metadata, 0.3.9 customization copy, release-card/grid markers,
  changelog detail coverage, navigation, console health, and responsive
  rendering.
- Package/build gates and npm pack dry-run pass or record exact failures.
- Registry checks record current `mdkg` latest and whether `mdkg@0.4.0`
  exists.
- If `package.json` is not `0.4.0`, record `0.4.0 npm publish dry-run not
  applicable` as an explicit readiness gap instead of running a misleading
  publish dry-run.
- Close with a checkpoint related to this task, `test-314`, `task-605`,
  `test-308`, `task-606`, and `test-312`.

# Files Affected

- mdkg graph nodes and checkpoint evidence only.
- local audit artifacts under `/private/tmp`.

# Implementation Notes

- Do not edit source, docs, package, website, or npm payload files.
- Do not push, deploy, tag, publish, change DNS, activate analytics, or mutate
  provider state.
- Keep raw Browser/Product Design screenshots and JSON receipts in
  `/private/tmp`; commit only summarized mdkg evidence and artifact paths.
- `task-605` remains open unless production has been pushed/redeployed and
  live Browser/Chrome verification passes.

# Test Plan

- `node dist/cli.js index`
- `node dist/cli.js validate --changed-only --json`
- `node dist/cli.js validate --json`
- `node dist/cli.js goal next goal-42 --json`
- `git diff --check`
- `test-314`

# Links / Artifacts

- `goal-42`
- `task-605`
- `test-308`
- `task-606`
- `test-312`
- `test-314`
- `chk-304`
- `/private/tmp/mdkg-goal42-readiness-audit-20260627/browser-evidence.json`
- `/private/tmp/mdkg-goal42-readiness-audit-20260627/product-design-audit.md`

# Results

Completed with verdict: `not ready with exact gaps`.

- Local mdkg.dev and docs builds are current enough for the checked 0.3.9
  launch markers and responsive screenshots.
- Live `mdkg.dev` remains stale at structured `softwareVersion: "0.3.7"` and
  does not expose the local 0.3.9 customization copy.
- Live docs changelog has 0.3.9 milestone text but lacks the local
  release-card/grid surface.
- `package.json` remains `0.3.9`, so `0.4.0` npm publish dry-run was not run.
- No public/provider mutation, push, tag, publish, deploy, DNS, or analytics
  change occurred.
