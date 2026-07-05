---
id: goal-54
type: goal
title: Close 0.4.2 docs generated CLI reference gap
status: todo
priority: 1
goal_state: active
goal_condition: Close 0.4.2 docs generated CLI reference gap
scope_refs: []
required_skills: []
required_checks: []
max_iterations: 25
blocked_after_attempts: 3
tags: [0.4.2, docs, generated-cli-reference, postpublish, mdkg-dev]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [goal-52]
context_refs: []
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint]
created: 2026-07-05
updated: 2026-07-05
---
# Objective

Close the remaining post-publish documentation gap for `mdkg@0.4.2`: the
package, root changelog, live `mdkg.dev`, and live docs changelog are current,
but the docs generated CLI reference page does not yet expose the new `mdkg git`
command family.

# End Condition

The live docs generated CLI reference at
`https://docs.mdkg.dev/reference/generated-cli-reference/` includes `mdkg git`
coverage consistent with `CLI_COMMAND_MATRIX.md`, while the live changelog and
homepage remain aligned to `0.4.2`.

# Non-Goals

- Do not change package runtime behavior.
- Do not publish another npm version unless a later release goal explicitly
  authorizes it.
- Do not deploy or mutate Vercel provider state without explicit approval.

# Recursive Algorithm

1. Inspect the current goal state, relevant graph nodes, and required skills.
2. Create missing mdkg nodes only when evidence shows they are needed.
3. Select one concrete child node and work it to completion.
4. Run required checks and record evidence.
5. Re-evaluate the end condition and continue, pause, or close.

# Required Skills

- build-pack-and-execute-task
- verify-close-and-checkpoint

# Required Checks

- `npm run docs:check`
- `npm --prefix docs run build`
- `npm run smoke:mdkg-dev-docs`
- live read-only checks for `mdkg.dev` and `docs.mdkg.dev`
- `node dist/cli.js validate --changed-only --json`

# Acceptance Criteria

- `docs/src/content/docs/reference/generated-cli-reference.md` or its
  generation path includes `mdkg git inspect|clone|fetch|closeout|push-ready|push`.
- Live generated CLI reference includes `mdkg git` and `push-ready` after an
  approved docs deploy.
- Live changelog still includes `0.4.2` details and `mdkg git` release notes.
- Live homepage structured data still reports `softwareVersion: "0.4.2"`.

# Definition Of Done

- Goal condition is achieved.
- Required checks have evidence.
- Completion evidence is recorded in the goal.

# Stop Conditions

- Goal is blocked beyond the configured attempt limit.
- Required context or permissions are missing.
- Budget or safety constraints prevent continued work.

# Current State

Post-publish evidence from 2026-07-05:

- `mdkg@0.4.2` was published to npm and installed globally on the dev machine.
- Live `https://mdkg.dev/` contains `softwareVersion: "0.4.2"` and the
  `Git closeout` card.
- Live `https://docs.mdkg.dev/project/changelog/` contains `0.4.2`,
  `mdkg git`, `push-ready`, and closeout content.
- Live `https://docs.mdkg.dev/reference/generated-cli-reference/` omits
  `mdkg git` and `push-ready` markers.
- Local `CLI_COMMAND_MATRIX.md`, `README.md`, `CHANGELOG.md`, and targeted docs
  source files contain `mdkg git` coverage; the gap appears scoped to the docs
  generated CLI reference page.

Artifacts captured locally:

- `/private/tmp/mdkg-live-home-postpublish.html`
- `/private/tmp/mdkg-live-docs-changelog-postpublish.html`
- `/private/tmp/mdkg-live-docs-cli-reference-postpublish.html`

# Iteration Log

- 2026-07-05: Created as a follow-up gap after `mdkg@0.4.2` publish and
  post-publish validation.

# Skill Improvement Candidates

- None yet.

# Completion Evidence

- Pending.
