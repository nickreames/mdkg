---
id: task-695
type: task
title: Improve mdkg new loop guidance and JSON next actions
status: done
priority: 1
epic: epic-221
parent: goal-59
tags: [loop, new, ux, json]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [goal-59, edd-69, dec-66, task-693, task-694]
context_refs: []
evidence_refs: [chk-395]
aliases: []
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-07-06
updated: 2026-07-06
---
# Overview

Improve `mdkg new loop` so raw/custom loop creation remains deterministic while
guiding users and agents toward seeded template forking when appropriate.

# Acceptance Criteria

- `mdkg new loop "<title>"` still creates a raw loop from the default template.
- Text output includes clear next steps pointing to `mdkg loop list` and
  `mdkg loop fork <template> --scope <scope>`.
- `mdkg new loop --json` includes additive `next_actions` or
  `suggested_templates` metadata.
- No interactive prompt is introduced.
- Existing `mdkg new` behavior for other types is unchanged.

# Files Affected

- `src/commands/new.ts`
- `src/cli.ts`
- `tests/commands/new.test.ts`
- generated docs/command matrix if help text changes

# Implementation Notes

- Do not add `mdkg new loop --from-template` in this goal unless a later
  decision explicitly accepts it.
- Keep `mdkg loop fork` canonical for seeded template instantiation.
- JSON additions must not break existing created-node consumers.

# Test Plan

- `npm run build`
- focused `new loop` CLI tests
- `test-368`
- `npm run cli:check`

# Links / Artifacts

- `goal-59`
- `dec-66`
