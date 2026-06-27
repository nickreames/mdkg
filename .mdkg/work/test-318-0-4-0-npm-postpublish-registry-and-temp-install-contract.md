---
id: test-318
type: test
title: 0.4.0 npm postpublish registry and temp install contract
status: todo
priority: 1
epic: epic-204
parent: goal-42
tags: [0.4.0, npm, postpublish, registry, temp-install, test]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-615]
blocks: [task-616, task-606, test-312]
refs: [task-615, task-606, test-312]
context_refs: []
evidence_refs: []
aliases: []
skills: []
cases: []
created: 2026-06-27
updated: 2026-06-27
---
# Overview

Validate the npm postpublish contract before any public website deployment can
claim `mdkg@0.4.0` is available.

# Target / Scope

`task-615`, npm registry version/dist-tags, isolated global install, and temp
workspace behavior from the published package.

# Preconditions / Environment

`task-615` has run after a successful real npm publish.

# Test Cases

- Registry version and `latest` dist-tag both resolve to `0.4.0`.
- Installed `mdkg@latest` binary reports `0.4.0`.
- A new temp workspace can run the published CLI through init, status,
  validation, manifest creation, skill sync, and upgrade probes without using
  repo-local source.
- Any warning is explicitly accepted in the evidence or blocks website launch.

# Results / Evidence

Pending implementation.

# Notes / Follow-ups

- Passing this test unblocks Vercel production deployment planning; it does not
  authorize deploy by itself.
