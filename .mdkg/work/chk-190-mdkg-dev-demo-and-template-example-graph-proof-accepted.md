---
id: chk-190
type: checkpoint
title: mdkg.dev demo and template example graph proof accepted
checkpoint_kind: implementation
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [task-450]
blocked_by: []
blocks: []
refs: [archive://archive.mdkg-dev-planning-docs-2026-06-22]
context_refs: [goal-25, task-450, edd-26, dec-30, dec-32]
evidence_refs: []
aliases: []
skills: []
scope: [task-450]
created: 2026-06-22
updated: 2026-06-22
---
# Summary

The mdkg.dev examples directory now contains two standalone mdkg graphs: `/examples/demo-agentic-coding` and `/examples/template-mdkg-dev`. Each graph is valid, public-safe, goal-startable, and seeded with one umbrella goal, epic, spike, task, test, checkpoint, EDD, and decision record.

# Scope Covered

- task-450: demo/template example graph creation.

## Changed Surfaces

- `examples/demo-agentic-coding/README.md`
- `examples/demo-agentic-coding/DEMO_BRIEF.md`
- `examples/demo-agentic-coding/.mdkg/**`
- `examples/template-mdkg-dev/README.md`
- `examples/template-mdkg-dev/WEBSITE_TEMPLATE_BRIEF.md`
- `examples/template-mdkg-dev/.mdkg/**`
- `.mdkg/work/task-450-*`
- `.mdkg/work/chk-190-*`

## Boundaries

- in scope: local example graph seeds, goal-only agent-start contracts, local-only deployment policy, and validation proof.
- out of scope: live demo implementation, Vercel preview deploy, durable demo subdomain, production promotion, DNS changes, analytics activation, and external repo cloning.
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded: yes.

# Decisions Captured

- `examples/demo-agentic-coding/.mdkg/design/dec-1-*`: keep the demo local-only until explicit promotion.
- `examples/template-mdkg-dev/.mdkg/design/dec-1-*`: keep the template cloneable and no-production-deploy by default.
- dec-32: Vercel readiness is planning-only until explicit preview/deploy work is requested.

# Implementation Summary

Both examples are intentionally small. They demonstrate a reusable pattern for mdkg live demos: a user can give an agent only `goal-1`, the agent can inspect `goal next`, pack context, read the spike/task/test/design/decision records, and begin without private parent context.

# Implementation Details

- Code or graph surfaces changed: example README/brief files, nested `.mdkg` graphs, nested graph indexes, and root task/checkpoint evidence.
- Architecture or data-shape notes: checkpoints are linked through context/relates rather than executable `scope_refs`; example goals scope only actionable epic/spike/task/test nodes.
- Compatibility notes: examples are local directories, not separate packages; deploy/promotion remains explicit future work.

# Verification / Testing

## Command Evidence

- command: `node dist/cli.js --root examples/demo-agentic-coding index`
  result: passed; nested index files were written.
- command: `node dist/cli.js --root examples/template-mdkg-dev index`
  result: passed; nested index files were written.
- command: `node dist/cli.js --root examples/demo-agentic-coding validate --json`
  result: passed with `ok: true`, `warning_count: 0`, and `error_count: 0`.
- command: `node dist/cli.js --root examples/template-mdkg-dev validate --json`
  result: passed with `ok: true`, `warning_count: 0`, and `error_count: 0`.
- command: `node dist/cli.js --root examples/demo-agentic-coding search "agentic coding demo" --json`
  result: returned the demo epic and goal.
- command: `node dist/cli.js --root examples/template-mdkg-dev search "candidate website" --json`
  result: returned the template goal and task.
- command: `node dist/cli.js --root examples/demo-agentic-coding goal next goal-1 --json`
  result: returned `spike-1`; see known warning.
- command: `node dist/cli.js --root examples/template-mdkg-dev goal next goal-1 --json`
  result: returned `spike-1`; see known warning.

## Pass / Fail Status

- status: pass for example graph creation and validation.

## Known Warnings

- warning: `goal next goal-1 --json` in each nested example returns `spike-1`, but also emits `scope contains non-actionable or unsupported node: root:chk-1`. This appears to come from mdkg goal routing including latest checkpoint context. The graphs validate cleanly and the checkpoint is not in `scope_refs`; task-452 should account for this or create a follow-up CLI polish node.

# Known Issues / Follow-ups

- task-451 must register the validated examples as root subgraphs.
- task-452 must add reusable smoke automation for the example graphs.
- Future live-demo implementation remains a separate explicit goal.

## Follow-up Refs

- task-451
- task-452
- test-203
- test-204

# Links / Artifacts

- examples/demo-agentic-coding
- examples/template-mdkg-dev
- examples/demo-agentic-coding/.mdkg/work/goal-1-build-a-one-shot-agentic-coding-demo-from-mdkg-context.md
- examples/template-mdkg-dev/.mdkg/work/goal-1-generate-a-candidate-mdkg-dev-website-from-a-cloned-graph.md

# Raw Content Safety

- Evidence is summarized with command receipts and artifact paths. No raw secrets, raw prompts, provider payloads, private graph dumps, local absolute paths, or bulky execution traces were stored.
