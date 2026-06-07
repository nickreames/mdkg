---
id: test-116
type: test
title: templates init assets upgrade assets and backcompat validation
status: done
priority: 2
epic: epic-60
parent: goal-9
prev: test-115
next: test-117
tags: [templates, init, upgrade, backcompat]
owners: []
links: []
artifacts: [checks://node-dist-cli-validate-json]
relates: [goal-9, task-287, task-298, task-299]
blocked_by: [task-287, task-298, task-299]
blocks: []
refs: [edd-15]
aliases: [0-3-0-template-backcompat-validation]
skills: []
cases: [init, upgrade, help-snapshot]
created: 2026-06-06
updated: 2026-06-06
---
# Overview

Validate docs/templates/init/upgrade compatibility for 0.3.0.

# Test Cases

- `npm run smoke:init` passes.
- `npm run smoke:upgrade` passes.
- `npm run cli:check` passes.
- Repos without SPEC files remain compatible.
