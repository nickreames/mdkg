---
id: test-352
type: test
title: invalid loop mode and provenance diagnostics contract
status: done
priority: 1
epic: epic-215
parent: goal-58
tags: [loop, validation, diagnostics, provenance]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [goal-58, edd-66, dec-65, test-346]
context_refs: []
evidence_refs: [chk-383, chk-384, chk-390]
aliases: []
skills: [verify-close-and-checkpoint]
cases: []
created: 2026-07-06
updated: 2026-07-06
---
# Overview

Validate clear diagnostics for malformed loop mode/provenance metadata.

# Target / Scope

- `task-677`
- loop validation fixtures

# Preconditions / Environment

Loop validation has MVP mode and provenance rules.

# Test Cases

- Unsupported loop mode fails with a loop-specific message.
- Forked loop missing template/source lineage fails.
- Run-bearing loop with invalid linked evidence refs fails without weakening
  generic edge validation.

# Results / Evidence

PASS. The implemented contract is covered by the current loop, graph, pack,
template, CLI, and regression suites as applicable. Historical milestone
evidence is linked in frontmatter and consolidated by `chk-390`.

# Notes / Follow-ups

- Do not require separate `loop_template` or `loop_run` node types.
