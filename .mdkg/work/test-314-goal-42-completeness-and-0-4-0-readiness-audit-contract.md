---
id: test-314
type: test
title: goal-42 completeness and 0.4.0 readiness audit contract
status: done
priority: 2
epic: epic-204
parent: goal-42
tags: [0.4.0, audit, publish-readiness, browser, product-design, test]
owners: []
links: []
artifacts: [/private/tmp/mdkg-goal42-readiness-audit-20260627/browser-evidence.json, /private/tmp/mdkg-goal42-readiness-audit-20260627/product-design-audit.md, /private/tmp/mdkg-goal42-readiness-audit-20260627]
relates: []
blocked_by: [task-610]
blocks: [task-606, test-312]
refs: [task-610, task-605, test-308, task-606, test-312, chk-304]
context_refs: []
evidence_refs: []
aliases: []
skills: []
cases: []
created: 2026-06-27
updated: 2026-06-27
---
# Overview

Validate that the goal-42 audit produces a complete readiness classification
for recent launch/docs changes and `0.4.0` npm publish readiness.

# Target / Scope

`task-610`, recent `origin/main..HEAD` changes, `goal-42`, `task-605`,
`test-308`, `task-606`, `test-312`, mdkg.dev, docs.mdkg.dev, package gates,
and registry readiness checks.

# Preconditions / Environment

Run only with read-only public/provider access and local `/private/tmp`
artifacts. No public mutation is allowed.

# Test Cases

- Every `goal-42` acceptance criterion is classified as proven, incomplete, or
  blocked by explicit approval.
- Product Design audit evidence is fresh for this run and saved locally.
- Browser evidence covers local built pages and live production pages.
- Git, changelog, docs/site source, package payload, and registry checks are
  mapped to the readiness verdict.
- Result is exactly one of: `ready pending explicit approval` or `not ready
  with exact gaps`.
- No real `0.4.0` npm publish, git tag, push, deploy, DNS, analytics, or
  provider mutation occurs.

# Results / Evidence

Result: `not ready with exact gaps`.

Evidence:

- `chk-304`
- `/private/tmp/mdkg-goal42-readiness-audit-20260627/browser-evidence.json`
- `/private/tmp/mdkg-goal42-readiness-audit-20260627/product-design-audit.md`
- `/private/tmp/mdkg-goal42-readiness-audit-20260627/*-viewport.png`

Contract checks:

- Every `goal-42` acceptance criterion has a classification:
  - proven locally: build/test/docs/package gates, local mdkg.dev Browser
    markers, local docs release-card/grid markers, local responsive screenshots,
    package payload dry-run, public-output high-confidence secret heuristic.
  - incomplete/blocking: live `mdkg.dev` still reports structured
    `softwareVersion: "0.3.7"` and lacks local 0.3.9 customization markers.
  - incomplete/blocking: live docs changelog has 0.3.9 milestone text but lacks
    the local release-card/grid surface and `.mdkg/config.json` marker.
  - incomplete/blocking: `package.json` remains `0.3.9`; `0.4.0` publish
    dry-run is not valid yet.
- Fresh Product Design audit evidence was saved locally and classified issues
  as `must fix before 0.4.0 readiness`, `acceptable`, or `blocked by deploy
  approval`.
- Fresh Browser evidence covered local built pages and live production pages at
  desktop and mobile breakpoints.
- Git, package payload, source-visible docs/site state, and npm registry checks
  were mapped into `chk-304`.
- No real `0.4.0` npm publish, git tag, push, deploy, DNS, analytics, or
  provider mutation occurred.

# Notes / Follow-ups

- Readiness is a recommendation only, not authorization to publish or launch.
- Keep `task-605` open until approved push/redeploy and live Browser/Chrome
  verification pass.
