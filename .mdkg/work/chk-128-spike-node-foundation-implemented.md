---
id: chk-128
type: checkpoint
title: spike node foundation implemented
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [task-348]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
scope: [task-348]
created: 2026-06-15
updated: 2026-06-15
---
# Summary

Implemented the first `spike` node foundation for `task-348`. `spike` is now a
recognized actionable work-node type with `spike-#` ids under `.mdkg/work/`.
It participates in creation, validation, task lifecycle mutations, normal
`next`, goal scope/actionable routing, goal claim, pack ordering, template
fallback, help text, command matrix references, and publish-readiness template
checks.

# Scope Covered

- `src/graph/node.ts`
- `src/commands/new.ts` through existing work-type routing
- `src/commands/task.ts`
- `src/commands/next.ts`
- `src/commands/goal.ts`
- `src/graph/goal_scope.ts`
- `src/pack/order.ts`
- `src/cli.ts`
- `.mdkg/templates/default/spike.md`
- README and command matrix seed mentions
- parser, creation, lifecycle, next, goal, pack, help, and command-contract tests

# Decisions Captured

- `spike` remains a work-node type, not a separate `mdkg spike` namespace.
- Spikes are actionable research/planning work, not autonomous web-search,
  file-generation, node-generation, or `SKILL.md` authoring agents.
- Evidence and citations stay in Markdown body sections for this first pass.
- Deeper docs and packed smoke proof continue under `task-349` and `task-350`.

# Implementation Summary

The implementation follows existing `task`/`test`/`feat` patterns instead of
adding a new command namespace. `spike` was added to work type policy,
next-selection policy, goal actionable scope, task lifecycle mutation policy,
and pack ordering. A bundled/local template now gives spikes structured research
sections for question, context, search plan, findings, tradeoffs,
recommendation, follow-up nodes, skill candidates, UX/security/data-structure
notes, mdkg.dev implications, and evidence/sources.

# Verification / Testing

- `npm run build`
- Focused compiled tests: parser, new, task lifecycle, next, goal, pack, CLI
  help, and command contract; 81 passed.
- `npm run test`; 461 passed.
- `npm run cli:check`; passed.
- `npm run cli:contract`; passed after rerunning serially. The first parallel
  attempt raced another build in `dist/init`, so it was not a product failure.
- `node dist/cli.js validate --json`; passed with zero warnings/errors.
- `node scripts/assert-publish-ready.js`; passed.
- `git diff --check`; passed.
- Temp repo `/private/tmp/mdkg-spike-task348.KMDvOs/repo` created
  `root:spike-1`, started it, found it via search/show, packed it as pack root,
  and validated cleanly.

# Known Issues / Follow-ups

- `task-349` still needs the fuller docs/readiness pass and explicit
  no-autonomous-search/no-auto-generation examples.
- `task-350` still needs packed `smoke:spike` coverage and prepublish wiring.
- `test-142` and `test-143` should be closed explicitly with the evidence above
  or refreshed if the docs/smoke work changes the contract.

# Links / Artifacts

- `task-348`
- `test-142`
- `test-143`
