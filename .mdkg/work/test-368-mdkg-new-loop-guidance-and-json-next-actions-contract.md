---
id: test-368
type: test
title: mdkg new loop guidance and JSON next actions contract
status: done
priority: 1
epic: epic-224
parent: goal-59
tags: [loop, new, json, regression]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [goal-59, edd-69, dec-66, task-695]
context_refs: []
evidence_refs: [chk-396, chk-408]
aliases: []
skills: [verify-close-and-checkpoint]
cases: []
created: 2026-07-06
updated: 2026-07-06
---
# Overview

Validate raw loop creation guidance and machine-readable next actions from
`mdkg new loop`.

# Target / Scope

- `task-695`
- `mdkg new loop`

# Preconditions / Environment

- Temporary mdkg fixture repo with seeded loop templates available.

# Test Cases

- `mdkg new loop "<title>"` creates a raw loop file from the default template.
- Text output points to `mdkg loop list` and `mdkg loop fork`.
- `mdkg new loop "<title>" --json` includes additive `next_actions` or
  `suggested_templates`.
- No interactive prompt occurs.
- Other `mdkg new` node types keep current output.

# Results / Evidence

PASS. The loop UX descriptor pilot contract is implemented and covered by the
focused loop, CLI, descriptor, generated-contract, and compatibility suites.
Historical evidence is linked in frontmatter and consolidated by `chk-408`.

# Notes / Follow-ups

- Do not add `--from-template` in this test unless a later decision adds that
  flag.
