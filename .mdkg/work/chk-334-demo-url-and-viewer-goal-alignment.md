---
id: chk-334
type: checkpoint
title: demo URL and viewer goal alignment
checkpoint_kind: audit
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: []
created: 2026-06-29
updated: 2026-06-29
---
# Summary

Aligned the demo roadmap on short mdkg.dev paths:

- `/demos` is the accepted-demo directory.
- `/demo/1`, `/demo/2`, etc. are canonical accepted-demo detail URLs.
- Demo 1 implementation should use the existing mdkg-dev Astro app and local
  source routes, not a separate default `mdkg-demo-previews` project.
- The old `demo-N.mdkg.dev` hosting goal is archived as optional historical
  context.
- Embedded VS Code-style workspace viewing is split into `goal-47`, blocked
  behind a lightweight read-only `/demo/1` proof.

# Scope Covered

Scope is recorded narratively instead of through checkpoint graph edges so this
receipt does not enter `goal-44`'s actionable work selection.

## Changed Surfaces

- Added accepted decisions `dec-58` and `dec-59`.
- Added EDDs `edd-60` and `edd-61`.
- Re-scoped `goal-44`, `epic-205`, `task-621`, `task-622`, `test-324`, and
  `test-325`.
- Added `task-628`, `task-629`, `task-630`, and `test-329` for the mdkg-dev
  short-path source proof.
- Archived `goal-46` as superseded optional hosting context.
- Added `goal-47`, `epic-207`, `spike-24`, `task-627`, and `test-328` for the
  advanced lazy workspace viewer follow-up.
- Regenerated mdkg index state.

## Boundaries

- in scope: mdkg graph/design/checkpoint/index state.
- out of scope: source/docs/package/site edits, Vercel mutation, DNS, push,
  deploy, tag, npm publish, and production promotion.
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded:
  yes.

# Decisions Captured

- `dec-58`: accepted public demos use `/demos` and `/demo/:id`.
- `dec-59`: v1 uses existing mdkg-dev Astro routes and project.
- `edd-60`: demo detail pages synchronize sanitized graph, filesystem, and
  output surfaces.
- `edd-61`: viewer code must lazy-load outside homepage/docs paths.

# Implementation Summary

The immediate `goal-44` lane now resumes at `task-628`, then proceeds through
sanitized snapshot creation (`task-629`), route implementation (`task-630`),
route evidence (`test-324`), homepage isolation (`test-329`), and closeout
classification (`task-622`, `test-325`). The superseded Vercel-preview project
task (`task-621`) is marked done as historical preflight context.

# Audit Findings

- Reviewed surfaces: goals `goal-44`, `goal-46`, `goal-47`; demo design records;
  goal-44 task/test chain; generated mdkg index.
- Findings: graph now represents the selected `/demo/1` direction and no longer
  presents Vercel preview project creation as the next lane.
- Residual risk: source implementation still needs to prove route behavior,
  snapshot safety, Browser/Chrome rendering, and lazy-load isolation.

# Verification / Testing

## Command Evidence

- `node dist/cli.js index`: passed; regenerated JSON, skills, capability,
  subgraph, and SQLite indexes.
- `node dist/cli.js validate --changed-only --json`: `ok: true`, warnings `0`.
- `node dist/cli.js validate --json`: `ok: true`, one accepted legacy
  `SPEC.md` compatibility warning.
- `node dist/cli.js goal show goal-44 --json`: shows active node `task-628` and
  required local route validation for `/demos`, `/demo/1`, and `/demo/1/output`.
- `node dist/cli.js goal next goal-44 --json`: selects `root:task-628`.
- `node dist/cli.js goal show goal-47 --json`: shows blocked advanced viewer
  follow-up.
- `git diff --check`: passed.

## Pass / Fail Status

- status: pass for graph-only alignment.

## Known Warnings

- Full validation still reports the accepted legacy warning for
  `.mdkg/work/mdkg-cli/SPEC.md`; changed-only validation is clean.

# Known Issues / Follow-ups

- Implement `task-628` before source changes so the `/demos` and `/demo/1`
  route/data contract is explicit.
- Keep `goal-47` blocked until `test-325` and `test-329` prove the lightweight
  read-only demo route and lazy-load baseline.

## Follow-up Refs

- `task-628`
- `task-629`
- `task-630`
- `test-324`
- `test-329`
- `task-622`
- `test-325`
- `goal-47`

# Links / Artifacts

- No external artifacts, PRs, pushes, provider mutations, or deploys.

# Raw Content Safety

- Summarize evidence and use refs, hashes, and artifact links instead of raw secrets, raw prompts, raw payloads, or bulky execution traces.
