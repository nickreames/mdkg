---
id: chk-115
type: checkpoint
title: Reference rewrite receipts and stale goal repair planning implemented
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [task-342]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
scope: [task-342]
created: 2026-06-09
updated: 2026-06-09
---
# Summary

`task-342` implemented read-only repair planning for structured reference
rewrites and stale selected-goal state. The `refs` fix family now reports more
than generic graph edge misses: it also inspects goal fields, workflow mirror
fields, archive URI refs, and selected-goal state.

# Scope Covered

- `task-342`
- Structured frontmatter refs: `epic`, `parent`, `prev`, `next`, `relates`,
  `blocked_by`, `blocks`, `scope_refs`, `active_node`, workflow refs, and
  archive/work refs.
- Stale selected-goal state: malformed, missing, and achieved selected goals.
- Duplicate-id text rewrite counts for manual review.

# Decisions Captured

- Keep all repair output as `fix plan` receipts with `apply_supported: false`.
- Treat structured frontmatter refs as high-confidence discovery but still
  manual-review repair items.
- Treat markdown/text replacement counts as manual-review only because semantic
  intent can be ambiguous.
- Plan selected-goal repair separately from duplicate-id rewrite.

# Implementation Summary

- Added structured reference entry scanning in `src/commands/fix.ts`.
- Added missing archive URI detection for workflow/archive refs.
- Added selected-goal state planning for malformed, missing, and achieved
  selected goal state.
- Added duplicate-id `reference_rewrite_plan` items with path-level replacement
  counts and manual-review confidence.
- Added tests that use canonical nested `WORK_ORDER.md` and `RECEIPT.md`
  fixtures to prove workflow/archive ref discovery.

# Verification / Testing

- `npm run build`
- `npm run build:test`
- `node --test dist/tests/commands/fix.test.js dist/tests/commands/validate.test.js`
- `npm run test`
- `npm run cli:check`
- `node dist/cli.js index`
- `node dist/cli.js validate --json`
- `node dist/cli.js goal next goal-13 --json`
- `git diff --check`

# Known Issues / Follow-ups

- `task-343` still needs writer-lock coverage and atomic write audit.
- `task-344` remains the full two-branch smoke/prepublish gate.
- No public `fix apply` exists.

# Links / Artifacts

- `src/commands/fix.ts`
- `tests/commands/fix.test.ts`
- `edd-21`
