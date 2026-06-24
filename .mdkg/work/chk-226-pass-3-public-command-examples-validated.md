---
id: chk-226
type: checkpoint
title: pass-3 public command examples validated
checkpoint_kind: test-proof
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [task-521]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [task-521]
created: 2026-06-24
updated: 2026-06-24
---
# Summary

Public command examples were checked against current CLI help and normalized across the marketing site, docs, and LLM text. The new pass-3 smoke now fails on representative stale command syntax, internal mdkg.dev work IDs in public copy, stale public meta language, and broken `/docs` bridge behavior.

# Scope Covered

- task-521
- test-250
- edd-39

## Changed Surfaces

- `mdkg-dev/src/pages/index.astro`
- `mdkg-dev/src/pages/docs.astro`
- `mdkg-dev/src/pages/llms-full.txt.ts`
- `docs/src/content/docs/index.md`
- `docs/src/content/docs/reference/index.md`
- `docs/src/content/docs/reference/command-contract.md`
- `docs/src/content/docs/project/roadmap.md`
- `scripts/smoke-mdkg-dev*.js`
- `scripts/smoke-mdkg-dev-polish-pass3.js`
- `package.json`
- `scripts/assert-publish-ready.js`

## Boundaries

- in scope: public command examples, `/docs` bridge behavior, reference-doc positioning, roadmap wording, and smoke/prepublish wiring.
- out of scope: DNS, production promotion, npm publish, tag, analytics activation, and GitHub settings mutation.
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded: yes.

# Decisions Captured

Link the most important decision records.

# Implementation Summary

Homepage examples now use `TASK_ID` for `mdkg task done`, include `mdkg show WORK_ID` and `mdkg handoff create WORK_ID`, and use generic example IDs instead of internal mdkg.dev roadmap IDs. Reference docs now direct users to the generated CLI reference first and frame the command contract as a maintainer/integration surface.

# Test Proof

- Test target: public command examples and pass-3 public copy constraints.
- Fixtures or temp repos: built marketing/docs output from local smoke scripts.
- Coverage gaps: Browser and hosted preview inspection remain for later task-530/task-531.

# Verification / Testing

## Command Evidence

- command: `node dist/cli.js goal --help`
- result: verified `goal current`, `goal next [goal-id-or-qid]`, and `goal claim [goal-id-or-qid] <work-id-or-qid>`.
- command: `node dist/cli.js task --help`
- result: verified `task done <id-or-qid> --checkpoint ...` and task lifecycle node limits.
- command: `node dist/cli.js checkpoint --help`
- result: verified checkpoint kinds and evidence-oriented template contract.
- command: `node dist/cli.js handoff --help`
- result: verified sanitized `handoff create <id-or-qid>` boundary.
- command: `node dist/cli.js pack --help`
- result: verified `--profile concise`, `--visibility`, and `--edges context_refs,evidence_refs`.
- command: `node dist/cli.js fix --help`
- result: verified dry-run-first `fix plan` syntax.
- command: `npm run smoke:mdkg-dev`
- result: passed sequentially.
- command: `npm run smoke:mdkg-dev-docs`
- result: passed sequentially.
- command: `npm run smoke:mdkg-dev-seo`
- result: passed sequentially.
- command: `npm run smoke:mdkg-dev-polish-pass2`
- result: passed sequentially.
- command: `npm run smoke:mdkg-dev-polish-pass3`
- result: passed sequentially.

## Pass / Fail Status

- status: passed

## Known Warnings

- warning: parallel smoke execution can race on shared build output; release gates run these scripts sequentially.

# Known Issues / Follow-ups

- issue: Browser/Chrome visual QA remains pending for task-530.
- issue: Vercel preview validation remains pending for task-531.

## Follow-up Refs

- task-522 through task-531
- test-251 through test-257

# Links / Artifacts

- packs
- PRs/commits
- docs
- dashboards

# Raw Content Safety

- Summarize evidence and use refs, hashes, and artifact links instead of raw secrets, raw prompts, raw payloads, or bulky execution traces.
