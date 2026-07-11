---
id: test-351
type: test
title: loop parser template validation contract
status: done
priority: 1
epic: epic-214
parent: goal-58
tags: [loop, parser, template, validation]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [goal-58, edd-66, dec-65, test-345]
context_refs: []
evidence_refs: [chk-383, chk-390]
aliases: []
skills: [verify-close-and-checkpoint]
cases: []
created: 2026-07-06
updated: 2026-07-06
---
# Overview

Validate that `type: loop` is accepted by parser and template scaffolding.

# Target / Scope

- `task-675`
- `task-676`
- loop fixtures and template schema

# Preconditions / Environment

Loop parser and default template implementation exists.

# Test Cases

- Valid loop fixture parses and indexes.
- Default loop template creates a validation-clean node.
- Existing work types and MANIFEST/SPEC fixtures still pass.

# Results / Evidence

PASS. The implemented contract is covered by the current loop, graph, pack,
template, CLI, and regression suites as applicable. Historical milestone
evidence is linked in frontmatter and consolidated by `chk-390`.

# Notes / Follow-ups

- This test proves recognition, not CLI fork behavior.
