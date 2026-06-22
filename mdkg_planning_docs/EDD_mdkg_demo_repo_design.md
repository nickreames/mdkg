---
title: mdkg Demo Repo Design EDD
status: planning snapshot
date: 2026-06-22
owner: Nicholas Reames
product: Markdown Knowledge Graph
---

# mdkg Demo Repo Design EDD

## 1. Purpose

This document defines the recommended demo repo strategy for Markdown Knowledge Graph public alpha and mdkg.dev launch.

The demo should prove the golden path clearly before showcasing advanced orchestration. It should be small, deterministic, easy to reset, and suitable for docs, screen recordings, conference conversations, and future Remotion-generated videos.

## 2. Core decision

The first demo should live nested inside the mdkg repo.

Rationale:

- Keeps demo close to the CLI source.
- Allows mdkg to dogfood subgraphs, packs, and handoffs.
- Makes demo validation part of CI/pre-publish hardening.
- Lets mdkg.dev ingest demo artifacts as the repo grows.
- Supports side-by-side template and demo graph experiments.

Potential layout:

```text
mdkg/
├── examples/
│   ├── demo-agentic-coding/
│   ├── template-web-app/
│   └── template-mdkg-dev/
├── mdkg-dev/
└── .mdkg/
```

Alternative names:

- `demos/agentic-coding/`
- `examples/agentic-coding/`
- `fixtures/demo-agentic-coding/`

Recommendation: use `examples/` if the repo should feel developer-friendly; use `fixtures/` only for internal test fixtures.

## 3. Demo principle

The hero demo should show one thing:

> Give an AI coding agent deterministic repo context, let it do work, record a checkpoint, and validate project memory.

Do not put subgraphs, queues, MCP, archives, bundles, and graph import into the first hero demo. Those can be follow-up demos.

## 4. Demo repo concept

Recommended project:

> A tiny TypeScript CLI or web utility with one small feature request, one known bug, one design decision, and one research spike.

It should be intentionally small so viewers focus on mdkg, not application complexity.

Possible app ideas:

1. Tiny Markdown note indexer.
2. Tiny TODO CLI.
3. Tiny static site snippet renderer.
4. Tiny package metadata linter.
5. Tiny agent prompt formatter.

The app should:

- Use TypeScript + Node.
- Have a small test suite.
- Have one obvious improvement task.
- Have a README.
- Avoid external APIs.
- Avoid private env vars.
- Run quickly in CI.

## 5. Required mdkg graph contents

The demo graph should include:

### 5.1 One goal

Example:

> `goal-1`: Improve the demo CLI so an AI agent can add a small feature without losing project context.

Should include:

- clear success criteria
- required checks
- scoped task/test/spike refs
- context refs to decision/product docs
- evidence refs after completion

### 5.2 One research spike

Example:

> `spike-1`: Evaluate the simplest UX for adding a new command flag.

Should include:

- research question
- context
- options
- recommendation
- follow-up task/test refs
- evidence refs

### 5.3 One task

Example:

> `task-1`: Add `--summary` output to the demo CLI.

Should include:

- expected behavior
- references to implementation files
- required checks
- context refs
- evidence refs after completion

### 5.4 One test node

Example:

> `test-1`: Add coverage for `--summary` output.

### 5.5 One decision doc

Example:

> `dec-1`: Keep demo dependencies minimal.

This mirrors mdkg’s own low-dependency philosophy.

### 5.6 One checkpoint

Example:

> `checkpoint-1`: Implementation checkpoint with command evidence.

Should include:

- commands run
- pass/fail status
- changed surfaces
- known warnings
- follow-up refs

### 5.7 One skill

Example:

> `skill:demo-mdkg-agent-loop`: How to use mdkg in this demo repo.

Should show how agents discover work, pack context, record checkpoints, and validate.

### 5.8 One handoff example

Generate and commit or document a sample handoff output, depending on current mdkg conventions.

The handoff should show:

- selected work
- latest checkpoint
- next actions
- required checks
- boundaries
- raw-marker warning behavior, if available without adding risky content

## 6. Hero demo command flow

The hero demo should be short enough for a 60–120 second video.

Possible flow:

```bash
cd examples/demo-agentic-coding
mdkg status
mdkg goal current
mdkg goal next
mdkg pack task-1 --profile concise
mdkg task start task-1
# show agent or human making a tiny code change
npm test
mdkg task done task-1 --checkpoint "Added summary output and tests"
mdkg handoff create task-1
mdkg validate
```

If `goal current` requires an active goal, ensure demo graph is initialized accordingly or use `goal activate goal-1` in setup.

## 7. Expected outputs

Docs and video should show short excerpts, not overwhelming full output.

Show:

- `status`: graph valid, selected goal visible, cache fresh.
- `goal next`: next work item.
- `pack`: headings showing context, scope, evidence.
- `task done`: checkpoint created.
- `handoff`: next actions and safety warning area.
- `validate`: success or warnings intentionally explained.

Avoid showing:

- huge raw packs.
- internal debug output.
- advanced DB state.
- unrelated CLI commands.

## 8. Demo reset strategy

The demo should be resettable.

Options:

1. Keep demo in a clean committed state and use branches for “before” and “after.”
2. Provide a script that resets generated state.
3. Use graph template import to generate the demo graph.
4. Keep separate `before/` and `after/` examples.

Recommended for launch:

- Use a clean committed demo repo with a stable “before” state.
- Keep expected “after” outputs documented.
- Add a smoke script that runs non-destructive demo commands.

Later:

- Add generated demo graph/template import for richer demos.

## 9. Demo video storyboard

### Video 1: Golden path

Title:

> Give an AI coding agent deterministic project context with Markdown Knowledge Graph.

Storyboard:

1. Show project tree with `.mdkg/`.
2. Run `mdkg status`.
3. Run `mdkg goal next`.
4. Run `mdkg pack task-1 --profile concise`.
5. Show agent/human making tiny code/test change.
6. Run tests.
7. Run `mdkg task done ... --checkpoint`.
8. Run `mdkg handoff create task-1`.
9. Run `mdkg validate`.
10. End on mdkg.dev / GitHub CTA.

### Video 2: Research spike

Title:

> Turn fuzzy planning into durable project memory.

Flow:

1. Show spike.
2. Show context/evidence refs.
3. Add findings/recommendation.
4. Create/follow task/test.
5. Close with checkpoint.
6. Validate.

### Video 3: Handoff

Title:

> Transfer agent work without dumping raw chat history.

Flow:

1. Show active work.
2. Show checkpoint.
3. Generate handoff.
4. Show next actions/boundaries/checks.
5. Explain warning limitations.

## 10. Remotion path

Remotion is a good future option for reusable programmatic videos, especially because the project is developer-focused and CLI demos can be scripted.

Do not make Remotion a launch blocker.

Recommended progression:

1. Launch with simple screen recording.
2. Stabilize demo script and copy.
3. Convert stable demo flow into Remotion composition.
4. Generate social clips and docs videos from the same script.

Potential Remotion inputs:

- command transcript JSON
- generated screenshots
- code snippets
- mdkg logo/title assets
- CTA frames

## 11. Advanced demo roadmap

After the hero demo, add advanced demos:

### 11.1 Template graph import

Show:

```bash
mdkg graph import-template <template> --select-goal --apply
```

Use case:

- Bootstrap reusable planning graph.
- Activate imported goal.
- Validate.

### 11.2 Subgraph planning

Show:

- root mdkg repo planning across `mdkg-dev` and demo child repos
- qids such as `mdkg_dev:task-1`
- read-only planning context
- mutating commands rejected for subgraph qids

### 11.3 Branch-safe ID repair

Show:

- two branches create same numeric ID
- `mdkg fix plan`
- `mdkg fix apply --family ids --base-ref main`
- links preserved

### 11.4 Handoff hardening

Show:

- handoff output boundaries
- raw-marker warnings
- no raw node body dumping

### 11.5 Project DB queue bridge

Advanced only.

Show:

- queue create
- work trigger enqueue
- claim/ack
- queue stats

Clearly label as advanced alpha local delivery infrastructure.

## 12. CI and validation requirements

Demo should have checks:

- Demo app tests pass.
- mdkg validate passes.
- mdkg status reports expected healthy state.
- Quickstart/demo commands run.
- Generated handoff can be produced.
- No raw secrets or private env dependencies.
- README snippets match actual commands.

Potential script:

```bash
npm run demo:smoke
```

## 13. mdkg.dev integration

The homepage should embed:

- one short screen recording or GIF
- one command snippet from demo
- one sample pack excerpt
- one handoff excerpt
- one validation success excerpt

The docs should include:

- clone/open demo instructions
- command walkthrough
- expected output
- “what to notice” callouts
- links to advanced demos

## 14. Summary

The first demo should make the golden path obvious: mdkg gives an AI agent deterministic context, records structured evidence, and validates project memory. Keep the first demo nested, small, boring, reproducible, and aligned with the homepage. Advanced demos can follow after the core story lands.
