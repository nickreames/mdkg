---
id: test-100
type: test
title: SPEC template and example coverage validation
status: done
priority: 1
epic: epic-47
parent: goal-8
tags: [spec, templates, examples, validation]
owners: []
links: []
artifacts: []
relates: [goal-8, task-269, task-270]
blocked_by: [task-269, task-270]
blocks: [task-279]
refs: []
aliases: [spec-template-example-validation]
skills: []
cases: []
created: 2026-06-06
updated: 2026-06-06
---
# Overview

Validate that template taxonomy and example fixture requirements cover the
initial SPEC family.

# Test Cases

- Project, agent, runtime-agent, API, capability, tool, model, runtime image,
  and integration coverage is required.
- Positive and negative examples are specified.
- Template naming remains generic.

# Validation Evidence

- `task-269` is done and defines the SPEC template taxonomy, default scaffold
  boundary, naming, and promotion policy.
- `task-270` is done and defines positive/negative fixture expectations for
  the initial SPEC template family.
- `chk-47` and `chk-48` record template taxonomy and fixture coverage
  closeout evidence.
- `node dist/cli.js capability search "SPEC template taxonomy" --json`
  resolves `edd-14`.
- `node dist/cli.js capability search "SPEC example fixtures" --json`
  resolves `edd-14`.
- Template names remain generic mdkg names; downstream product names are not
  required.
