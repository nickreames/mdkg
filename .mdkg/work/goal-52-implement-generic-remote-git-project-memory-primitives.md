---
id: goal-52
type: goal
title: Implement mdkg 0.4.2 git remote lifecycle primitives
status: progress
priority: 1
goal_state: active
goal_condition: mdkg@0.4.2 implements low-level `mdkg git` remote lifecycle primitives for source descriptors, accepted revisions, external-auth clone/fetch/inspect, SQLite sealed snapshot plus static Markdown/JSON closeout, high-bar push readiness, and explicit-authority push to origin, with docs/templates/release gates validated and project-memory semantic query design deferred to goal-53.
scope_refs: [task-651, task-653, task-654, task-656, task-655, test-339, test-340]
active_node: task-651
required_skills: [select-work-and-ground-context, service-boundary-ownership-check, verify-close-and-checkpoint]
required_checks: [git status --short --branch, npm run build, npm run test, npm run cli:check, npm run cli:contract, npm run docs:check, node dist/cli.js validate --json, node dist/cli.js validate --changed-only --json, targeted public naming and credential-safety audit, targeted git auth and push-readiness boundary audit, npm pack --dry-run --json]
max_iterations: 25
blocked_after_attempts: 3
tags: [0.4.2, git, remote-git, remote-origin, project-memory, generic-capability, implementation, successor]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [goal-51, goal-53, task-650, test-338, dec-61, dec-62, dec-63, dec-64, edd-62, edd-63, edd-64]
context_refs: []
evidence_refs: []
aliases: []
skills: [select-work-and-ground-context, service-boundary-ownership-check, verify-close-and-checkpoint]
created: 2026-07-03
updated: 2026-07-05
---
# Objective

Implement the generic remote Git lifecycle primitive surface planned by
`goal-51` as the `mdkg@0.4.2` implementation lane.

# End Condition

This goal is achieved when mdkg provides low-level `mdkg git` primitives for
remote source descriptors, opaque external-auth access refs, accepted revision
evidence, real remote clone/fetch/inspect, SQLite sealed snapshot plus static
Markdown/JSON closeout, explicit push readiness, and direct push to origin with
tests, docs/templates, generated references, and release evidence.

# Non-Goals

- Do not store raw credentials, PATs, SSH keys, agent sockets, raw prompts, raw
  model output, provider payloads, queue bodies, or runtime state roots.
- Do not mutate downstream repos, push, publish, tag, deploy, change DNS, or
  refresh root bundles without explicit later approval.
- Do not brand public mdkg primitives around a downstream product/runtime.
- Do not implement project-memory semantic query UX for `history`, `why`, or
  `next-work` in this lane; `goal-53` owns that design work.
- Do not implement downstream Omni Room runtime policy; downstream adoption gets
  a later handoff after generic mdkg behavior is proven.
- Do not infer push permission from a remote descriptor. `mdkg git` push
  requires external Git auth and explicit push-readiness evidence.

# Recursive Algorithm

1. Inspect the current goal state, relevant graph nodes, and required skills.
2. Create missing mdkg nodes only when evidence shows they are needed.
3. Select one concrete child node and work it to completion.
4. Run required checks and record evidence.
5. Re-evaluate the end condition and continue, pause, or close.

# Required Skills

- `select-work-and-ground-context`
- `service-boundary-ownership-check`
- `verify-close-and-checkpoint`

# Required Checks

- `git status --short --branch`
- `npm run build`
- `npm run test`
- `npm run cli:check`
- `npm run cli:contract`
- `npm run docs:check`
- `node dist/cli.js validate --json`
- `node dist/cli.js validate --changed-only --json`
- targeted public naming and credential-safety audit
- targeted git auth and push-readiness boundary audit
- `npm pack --dry-run --json`

# Acceptance Criteria

- Source descriptor, access-ref, and accepted revision schemas are implemented
  with generic public names and credential-safe validation.
- `mdkg git` uses the system Git CLI as the v1 backend and keeps auth external
  through credential helpers, SSH, `gh`, CI/runtime env, or user shell state.
- `mdkg git` clone/fetch/inspect works for real remote repositories with
  credential-safe receipts and safe temp-remote test coverage.
- `mdkg git` closeout produces both sealed SQLite snapshot evidence and static
  Markdown/JSON receipts when DB state participated in the run.
- `mdkg git` push requires explicit remote/branch, high validation gates,
  push-readiness evidence, and refs-first receipts before writing to origin.
- Docs, templates, fixtures, generated references, and release notes explain
  the generic capability and downstream boundary.
- `test-339` and `test-340` pass and record release-readiness evidence.

# Definition Of Done

- Goal condition is achieved.
- Required checks have evidence.
- Completion evidence is recorded in the goal.

# Stop Conditions

- Goal is blocked beyond the configured attempt limit.
- Required context or permissions are missing.
- Budget or safety constraints prevent continued work.

# Current State

Unblocked because `goal-51` has closed. First node is `task-651`.

# Iteration Log

- 2026-07-03: Created as the explicit implementation lane for `goal-51`
  planning output.
- 2026-07-05: Reframed as the `mdkg@0.4.2` low-level `mdkg git` remote
  lifecycle lane. Project-memory semantic query UX moved to paused follow-up
  `goal-53`.

# Skill Improvement Candidates

- None yet.

# Completion Evidence

- Pending.
