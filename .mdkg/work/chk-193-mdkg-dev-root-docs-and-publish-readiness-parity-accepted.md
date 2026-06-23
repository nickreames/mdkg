---
id: chk-193
type: checkpoint
title: mdkg.dev root docs and publish readiness parity accepted
checkpoint_kind: implementation
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [task-453]
blocked_by: []
blocks: []
refs: [archive://archive.mdkg-dev-planning-docs-2026-06-22]
context_refs: [goal-25, task-453, prd-4, prd-5, edd-25, edd-27, edd-29, edd-30]
evidence_refs: []
aliases: []
skills: []
scope: [task-453]
created: 2026-06-22
updated: 2026-06-22
---
# Summary

Root documentation and publish-readiness assertions now know about the mdkg.dev launch-readiness source layout, local smokes, private example subgraphs, and npm package payload boundaries.

# Scope Covered

- task-453: root docs and publish readiness parity.

## Changed Surfaces

- `README.md`
- `AGENT_START.md`
- `CLI_COMMAND_MATRIX.md`
- `scripts/assert-publish-ready.js`
- `.mdkg/work/task-453-*`
- `.mdkg/work/chk-193-*`

## Boundaries

- in scope: root docs parity, smoke script references, publish-readiness assertions, npm payload exclusions, and local launch gate descriptions.
- out of scope: public deployment, DNS, analytics activation, GitBook sync, Vercel production promotion, npm publish, tag, push, and broader product-version changes.
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded: yes.

# Decisions Captured

- dec-30: split `/mdkg-dev`, `/docs`, `/examples` source layout.
- dec-31: GitBook remains repo-first docs sync target.
- dec-32: Vercel readiness is planning-only until explicit preview/deploy work is requested.

# Implementation Summary

The root README now describes the mdkg.dev source layout and local launch gates. `AGENT_START.md` and `CLI_COMMAND_MATRIX.md` list the new smoke commands and clarify that mdkg.dev/docs/examples are source and launch assets, not npm runtime payload. Publish readiness now fails if the mdkg.dev smokes, docs, examples, bundle snapshots, or `.npmignore` exclusions drift.

# Implementation Details

- Code or graph surfaces changed: documentation files plus readiness assertions.
- Architecture or data-shape notes: examples are exposed through private read-only subgraph qids `demo_agentic_coding:goal-1` and `template_mdkg_dev:goal-1`.
- Compatibility notes: the npm package `files` list remains CLI-focused; mdkg.dev/docs/examples stay out of npm runtime payload.

# Verification / Testing

## Command Evidence

- command: `npm run build`
  result: passed.
- command: `node scripts/assert-publish-ready.js`
  result: passed.
- command: `npm run smoke:mdkg-dev`
  result: passed.
- command: `npm run smoke:mdkg-dev-docs`
  result: passed.
- command: `npm run smoke:mdkg-dev-seo`
  result: passed.
- command: `npm run smoke:demo-graph`
  result: passed.

## Pass / Fail Status

- status: pass for task-453 docs/readiness parity.

## Known Warnings

- warning: full `prepublishOnly` is not rerun in this task; task-454 owns final goal-level release-gate evidence.
- warning: build-dependent npm scripts should run sequentially because they share `dist/`.

# Known Issues / Follow-ups

- task-454 must run the final goal-level checks and close with explicit "not deployed / not launched" evidence.

## Follow-up Refs

- task-454
- test-205

# Links / Artifacts

- README.md
- AGENT_START.md
- CLI_COMMAND_MATRIX.md
- scripts/assert-publish-ready.js

# Raw Content Safety

- Evidence is summarized with command receipts and artifact paths. No raw secrets, raw prompts, provider payloads, private graph dumps, local absolute paths, or bulky execution traces were stored.
