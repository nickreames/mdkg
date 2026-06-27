---
id: task-617
type: task
title: run Chrome live postpublish validation and close readiness proof
status: todo
priority: 1
epic: epic-204
parent: goal-42
tags: [0.4.0, chrome, live-validation, postpublish, mdkg-dev, docs]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-616, test-319]
blocks: [test-320, task-605, task-606, test-312]
refs: [task-616, test-319, task-605, task-606, test-312]
context_refs: []
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint]
created: 2026-06-27
updated: 2026-06-27
---
# Overview

Use the Chrome plugin to validate the live postpublish production surface after
npm and Vercel proof are both complete.

# Acceptance Criteria

- Chrome live checks cover `mdkg.dev` and
  `docs.mdkg.dev/project/changelog/` at desktop and mobile widths.
- Live mdkg.dev structured data and visible copy reflect `softwareVersion:
  "0.4.0"` only after npm postpublish validation exists.
- Live docs release cards, changelog details, navigation, and release notes
  include `0.4.0` and do not lag behind source.
- Chrome console, network, responsive rendering, CTA edge polish, and critical
  SEO metadata have no release-blocking issues.
- Public no-secret/content sanity is repeated against live production pages.
- Receipts and screenshots are stored in a local `/private/tmp` artifact folder
  and summarized in mdkg evidence.

# Files Affected

- `/private/tmp` Chrome receipts/screenshots
- mdkg checkpoint evidence

# Implementation Notes

- Keep live checks read-only.
- Do not change provider settings, DNS, analytics, tags, or npm state.
- If Chrome finds any release-blocking gap, leave `task-605` and `task-606`
  open with exact blocker evidence.

# Test Plan

- Chrome desktop/mobile checks for `https://mdkg.dev`
- Chrome desktop/mobile checks for `https://docs.mdkg.dev/project/changelog/`
- DOM checks for `0.4.0` version, release-note, and structured-data markers
- console/network checks
- responsive screenshot review
- public no-secret/content sanity
- `test-320`

# Links / Artifacts

- `task-616`
- `test-319`
- `task-605`
- `task-606`
