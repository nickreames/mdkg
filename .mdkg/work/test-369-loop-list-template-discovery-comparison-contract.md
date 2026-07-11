---
id: test-369
type: test
title: Loop list template discovery comparison contract
status: done
priority: 1
epic: epic-224
parent: goal-59
tags: [loop, list, templates, regression]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [goal-59, edd-69, dec-66, task-696]
context_refs: []
evidence_refs: [chk-398, chk-408]
aliases: []
skills: [verify-close-and-checkpoint]
cases: []
created: 2026-07-06
updated: 2026-07-06
---
# Overview

Validate that `mdkg loop list` helps users and agents compare seeded templates
and existing loops.

# Target / Scope

- `task-696`
- seeded loop templates
- indexed loop nodes

# Preconditions / Environment

- Fixture repo has at least one seeded template and one forked/scoped loop.

# Test Cases

- Text output clearly distinguishes templates from existing loop nodes.
- JSON output includes comparable metadata for templates and loops.
- Existing `loop list --json` consumers keep current top-level fields.
- Seeded templates remain discoverable by title/ref.

# Results / Evidence

PASS. The loop UX descriptor pilot contract is implemented and covered by the
focused loop, CLI, descriptor, generated-contract, and compatibility suites.
Historical evidence is linked in frontmatter and consolidated by `chk-408`.

# Notes / Follow-ups

- This test supports the `mdkg new loop` guidance path.
