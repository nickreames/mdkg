---
id: goal-47
type: goal
title: Add lazy embedded demo workspace viewer after read only explorer
status: blocked
priority: 3
goal_state: blocked
goal_condition: The embedded VS Code-style demo workspace viewer is researched, implemented, and verified only after goal-44 proves the read-only /demos and /demo/1 explorer; homepage and docs bundles remain unaffected, Browser/Chrome desktop and mobile checks pass, and no production deploy, push, tag, DNS, or publish occurs without explicit approval.
scope_refs: [epic-207, spike-24, task-627, test-328]
active_node: spike-24
required_skills: [select-work-and-ground-context, build-pack-and-execute-task, verify-close-and-checkpoint]
required_checks: [node dist/cli.js index, node dist/cli.js validate --json, node dist/cli.js validate --changed-only --json, goal-44 read-only demo route proof exists, npm --prefix mdkg-dev run build, Browser desktop and mobile demo viewer validation, Chrome desktop and mobile demo viewer validation, homepage and docs route bundle isolation proof, git diff --check]
max_iterations: 25
blocked_after_attempts: 3
tags: [demo, viewer, workspace, mdkg-dev, followup, lazy-load]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [test-325, test-329]
blocks: []
refs: [goal-44, edd-60, edd-61]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-29
updated: 2026-06-29
---
# Objective

Add a richer embedded workspace viewer for accepted mdkg demos after the
lightweight read-only graph/file/output explorer has shipped locally.

# End Condition

This goal is achieved when an embedded VS Code-style or equivalent workspace
viewer is available only on demo detail routes, is backed by sanitized accepted
demo snapshots, passes Browser/Chrome desktop and mobile validation, and has
evidence that homepage, docs, and normal mdkg.dev routes do not load its heavy
runtime.

# Non-Goals

- Do not implement this before `goal-44` proves `/demos`, `/demo/1`, and
  `/demo/1/output` with the read-only viewer.
- Do not replace the v1 graph/file/output explorer with a heavier workspace if
  a lightweight view is enough for public launch.
- Do not fetch arbitrary repo files, expose private paths, or render raw prompts
  or provider payloads.
- Do not push, deploy, tag, publish, change DNS, or mutate provider state.

# Recursive Algorithm

1. Wait for `test-325` and `test-329` to prove the read-only demo route and
   lazy-load baseline.
2. Run `spike-24` to compare Monaco, Sandpack, WebContainer, static code panes,
   and any Astro-friendly alternatives.
3. Implement only the smallest workspace viewer that improves demo
   understanding without harming page performance.
4. Run build, Browser, Chrome, route, bundle, no-secret, and public-claims
   checks.
5. Re-evaluate the goal and either close with evidence or record exact blockers.

# Required Skills

- `select-work-and-ground-context`
- `build-pack-and-execute-task`
- `verify-close-and-checkpoint`
- `browser:control-in-app-browser`
- `chrome:control-chrome`

# Required Checks

- `node dist/cli.js validate --json`
- `node dist/cli.js validate --changed-only --json`
- `npm --prefix mdkg-dev run build`
- Browser and Chrome desktop/mobile validation
- bundle or build-output evidence proving homepage/docs isolation
- no-secret and public-claims audit of viewer data
- `git diff --check`

# Acceptance Criteria

- `goal-44` has already proven accepted-demo short paths and read-only viewer
  behavior.
- Heavy editor/workspace code is lazy-loaded only on demo detail routes.
- The viewer uses sanitized committed demo snapshots only.
- The homepage and docs paths do not inherit large viewer chunks or console
  errors.
- The final recommendation states whether the heavier workspace belongs in the
  public launch surface or should remain deferred.

# Definition Of Done

- Goal condition is achieved.
- Required checks have evidence.
- Completion evidence is recorded in the goal.

# Stop Conditions

- Goal is blocked beyond the configured attempt limit.
- Required context or permissions are missing.
- Budget or safety constraints prevent continued work.

# Current State

- Created on 2026-06-29 as a follow-up to keep embedded workspace ambitions out
  of the first `/demo/1` source-proof lane.
- Blocked by the read-only demo route proof in `goal-44`.
- Active node is `spike-24`, but execution should not begin until
  `test-325` and `test-329` are satisfied.

# Iteration Log

- 2026-06-29: Created by graph-only URL alignment pass after the operator chose
  `/demo/1`, `/demo/2`, and `/demos` over `demo-N.mdkg.dev`.

# Skill Improvement Candidates

- None yet.

# Completion Evidence

- Pending.
