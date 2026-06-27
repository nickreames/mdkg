---
id: task-615
type: task
title: validate mdkg 0.4.0 npm postpublish install and registry
status: done
priority: 1
epic: epic-204
parent: goal-42
tags: [0.4.0, npm, postpublish, registry, temp-install, validation]
owners: []
links: []
artifacts: [/private/tmp/mdkg-0.4.0-postpublish.g9HJiz, /private/tmp/mdkg-0.4.0-workspace.wNjwcV]
relates: []
blocked_by: [task-614]
blocks: [test-318, task-616, task-606, test-312]
refs: [task-614, task-606, test-312]
context_refs: []
evidence_refs: [chk-316]
aliases: []
skills: [verify-close-and-checkpoint]
created: 2026-06-27
updated: 2026-06-27
---
# Overview

Validate the published `mdkg@0.4.0` package from npm before any website/docs
production deployment claims it is available.

# Acceptance Criteria

- `npm view mdkg version --registry=https://registry.npmjs.org/` returns
  `0.4.0`.
- `npm view mdkg dist-tags --json --registry=https://registry.npmjs.org/`
  shows `latest: "0.4.0"`.
- A clean temp global install under `/private/tmp/mdkg-0.4.0-postpublish`
  installs `mdkg@latest` and the installed binary reports `0.4.0`.
- A temp workspace validates published-package behavior for init, status,
  validate, new manifest, skill sync, and upgrade apply probes relevant to the
  0.4.0 claims.
- The task records accepted warnings and exact failures; Vercel deploy remains
  blocked if any npm postpublish proof fails.

# Files Affected

- `/private/tmp/mdkg-0.4.0-postpublish`
- mdkg postpublish evidence/checkpoint

# Implementation Notes

- Use isolated temp directories and caches.
- This task verifies npm only; it does not deploy sites or push tags.

# Test Plan

- `npm view mdkg version --registry=https://registry.npmjs.org/`
- `npm view mdkg dist-tags --json --registry=https://registry.npmjs.org/`
- isolated `npm install -g mdkg@latest --prefix /private/tmp/mdkg-0.4.0-postpublish`
- installed `mdkg --version`
- temp workspace init/status/validate/new manifest/skill sync/upgrade probes
- `test-318`

# Links / Artifacts

- `task-614`
- `task-616`
