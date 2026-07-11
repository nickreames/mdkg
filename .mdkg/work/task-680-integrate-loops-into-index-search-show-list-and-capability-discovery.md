---
id: task-680
type: task
title: integrate loops into index search show list and capability discovery
status: done
priority: 1
epic: epic-216
parent: goal-58
tags: [loop, index, search, show, list]
owners: []
links: []
artifacts: [src/commands/search.ts, src/commands/loop.ts, tests/commands/loop.test.ts]
relates: []
blocked_by: [task-675, task-677]
blocks: []
refs: [goal-58, edd-66, dec-65, task-673, test-356, test-345]
context_refs: []
evidence_refs: [chk-386]
aliases: []
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-07-06
updated: 2026-07-06
---
# Overview

Make loop nodes visible through mdkg discovery surfaces after parser/validation
support exists.

# Acceptance Criteria

- `mdkg index` includes loop nodes.
- `mdkg search`, `show`, and `list` can discover and render loops.
- Capability/discovery indexing includes loops only where the existing model
  supports that safely.

# Files Affected

- `src/graph/indexer.ts`
- `src/commands/search.ts`
- `src/commands/show.ts`
- `src/commands/list.ts`
- capability index code if applicable

# Implementation Notes

- Prefer generic discovery compatibility plus loop-specific CLI UX.
- Keep search text useful for "loop", seeded template names, and provenance
  terms.
- Current broad `mdkg search loop --json` exits 0 but stdout is capped at 65536
  bytes and becomes unparseable JSON in this graph. Treat parseable truncated
  JSON or explicit result limiting as part of the discovery hardening surface if
  loop search increases result volume.

# Test Plan

- Search/show/list/index tests with loop fixtures.
- Capability discovery regression tests if capability surfaces change.
- Broad JSON search output remains parseable even when results are truncated or
  limited.

# Links / Artifacts

- `task-673`
- `test-356`
