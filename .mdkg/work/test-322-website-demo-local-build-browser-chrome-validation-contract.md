---
id: test-322
type: test
title: website demo local build Browser Chrome validation contract
status: done
priority: 1
epic: epic-205
parent: goal-44
tags: [demo, website, browser, chrome, local-build]
owners: []
links: []
artifacts: [examples/demo-runs/demo-001/package.json, examples/demo-runs/demo-001/package-lock.json, examples/demo-runs/demo-001/src/pages/index.astro, examples/demo-runs/demo-001/src/components/GoalRunConsole.tsx, examples/demo-runs/demo-001/src/styles/global.css, examples/demo-runs/demo-001/src/assets/ocean-flow-map.svg, examples/demo-runs/demo-001/.mdkg/work/goal-1-build-a-complete-differentiated-website-demo-from-the-canonical-mdkg-template.md, examples/demo-runs/demo-001/.mdkg/work/chk-4-demo-001-validation-passed-and-preview-approval-recommended.md, /private/tmp/mdkg-demo-001-validation/browser-desktop-top.png, /private/tmp/mdkg-demo-001-validation/browser-desktop-console-verify.png, /private/tmp/mdkg-demo-001-validation/browser-mobile-top.png, /private/tmp/mdkg-demo-001-validation/chrome-desktop-top.png, /private/tmp/mdkg-demo-001-validation/chrome-desktop-console-build.png, /private/tmp/mdkg-demo-001-validation/chrome-mobile-top.png, scripts/smoke-demo-graph.js]
relates: []
blocked_by: [task-620]
blocks: [task-621]
refs: [edd-58, edd-59]
context_refs: [edd-58, edd-59]
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint]
cases: [generated demo site builds locally., browser desktop and mobile checks pass., chrome desktop and mobile checks pass., no console or responsive layout blockers remain.]
created: 2026-06-29
updated: 2026-06-29
---
# Overview

Validate that a forked demo run produces a locally buildable website with clean
Browser and Chrome rendering.

# Target / Scope

- `task-620`
- generated demo site under `examples/demo-runs/demo-001/`

# Preconditions / Environment

- Demo run exists and has generated website source.
- Local dev/static server can serve the generated site.

# Test Cases

- Generated demo site builds locally.
- Browser desktop and mobile checks pass.
- Chrome desktop and mobile checks pass.
- No console or responsive layout blockers remain.

# Results / Evidence

Pending.

# Notes / Follow-ups

- Capture screenshots and receipts under `/private/tmp` during execution.
