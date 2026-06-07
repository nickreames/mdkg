---
id: test-110
type: test
title: SPEC capability search and show metadata validation
status: done
priority: 1
epic: epic-55
parent: goal-9
prev: test-109
next: test-111
tags: [spec, capability-search, metadata]
owners: []
links: []
artifacts: []
relates: [goal-9, task-285, task-286]
blocked_by: [task-285, task-286]
blocks: []
refs: [edd-15]
aliases: [spec-search-show-validation]
skills: []
cases: [spec-list, spec-show, capability-search]
created: 2026-06-06
updated: 2026-06-06
---
# Overview

Validate focused SPEC discovery and metadata output.

# Test Cases

- `mdkg spec list --json` or equivalent lists concrete specs.
- `mdkg spec show <id> --json` or equivalent shows metadata.
- `capability search "mdkg cli tool spec"` returns the dogfood SPEC.
