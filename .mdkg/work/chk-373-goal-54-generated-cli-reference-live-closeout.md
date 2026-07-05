---
id: chk-373
type: checkpoint
title: goal-54 generated CLI reference live closeout
checkpoint_kind: goal-closeout
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [chk-371, chk-372]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [goal-54, task-660, task-661, task-658, test-341]
created: 2026-07-05
updated: 2026-07-05
---
# Summary

`goal-54` is complete. The remaining `mdkg@0.4.2` generated CLI reference gap
was fixed locally, pushed to real `origin/main` using `mdkg git push`, deployed
by the existing docs hosting pipeline, and verified live on `docs.mdkg.dev`.

# Scope Covered

Keep `scope` frontmatter updated when possible.

## Changed Surfaces

- `docs/src/content/docs/reference/generated-cli-reference.md` and generated
  backing docs were already fixed by `task-660`.
- `task-661` added real origin proof for `mdkg git inspect`, `closeout`,
  `push-ready`, and `push`.
- `task-658` and `test-341` now record live public-surface verification.
- `origin/main` was advanced to
  `01afd36804f1810d9de79d66af20574325351a5f`.

## Boundaries

- in scope: docs generated CLI reference currentness, live homepage/changelog
  consistency, real `mdkg git` origin push proof, and goal closeout evidence.
- out of scope: npm publish, tag creation, DNS changes, Vercel provider
  mutation beyond the existing automatic deployment, and unrelated source work.
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded:
  yes.

# Decisions Captured

- The generated CLI reference must include `mdkg git` coverage when public
  release notes and homepage copy advertise Git closeout capabilities.
- Real remote proof belongs in mdkg graph evidence when the goal is blocked on
  actual push/deployment currentness.

# Implementation Summary

The docs generated CLI reference source change from `task-660` was pushed to
`origin/main` after a real `mdkg git` proof task. Public docs now contain the
`Git lifecycle commands` section, command examples for inspect/closeout/
push-ready, and the external-auth/system-Git safety language.

# Goal Closeout

- Goal condition result: achieved.
- Scoped nodes closed: `task-660`, `task-661`, `task-658`, `test-341`.
- Remaining deferred work: none for `goal-54`.

# Verification / Testing

## Command Evidence

- command: `node dist/cli.js validate --changed-only --json`
- result: passed before closeout status changes.
- command: `node dist/cli.js git inspect --json`
- result: passed against real `origin/main`.
- command:
  `node dist/cli.js git closeout --output .mdkg/git/closeouts/goal-54-real-origin-proof --json`
- result: passed with static closeout receipts and DB snapshot evidence.
- command: `node dist/cli.js git push-ready --remote origin --branch main --json`
- result: passed with explicit remote/branch, clean worktree, validation ok, and
  DB snapshot valid.
- command: `node dist/cli.js git push --remote origin --branch main --json`
- result: passed; pushed `HEAD -> main` to
  `git@github.com:nickreames/mdkg.git`.
- command: live `curl` fetches plus `rg` marker checks for `mdkg.dev`,
  `docs.mdkg.dev/project/changelog/`, and
  `docs.mdkg.dev/reference/generated-cli-reference/`
- result: passed.

## Pass / Fail Status

- status: pass

## Known Warnings

- warning: none.

# Known Issues / Follow-ups

- none for the 0.4.2 generated CLI reference gap.

## Follow-up Refs

- `goal-54`
- `task-660`
- `task-661`
- `task-658`
- `test-341`
- `chk-371`
- `chk-372`

# Links / Artifacts

- commit: `01afd36804f1810d9de79d66af20574325351a5f`
- live docs generated reference:
  `https://docs.mdkg.dev/reference/generated-cli-reference/`
- live docs changelog: `https://docs.mdkg.dev/project/changelog/`
- live homepage: `https://mdkg.dev/`
- `/private/tmp/mdkg-live-home-after-mdkg-git-push-closeout.html`
- `/private/tmp/mdkg-live-docs-changelog-after-mdkg-git-push-closeout.html`
- `/private/tmp/mdkg-live-docs-cli-reference-after-mdkg-git-push-closeout.html`
- `.mdkg/git/closeouts/goal-54-real-origin-proof/closeout.json`
- `.mdkg/git/closeouts/goal-54-real-origin-proof/closeout.md`
- `.mdkg/git/closeouts/goal-54-real-origin-proof/project-db.dump.md`

# Raw Content Safety

- Evidence is refs-first: URLs, commit hashes, command names, and local artifact
  paths. No raw credentials, tokens, prompts, or bulky execution traces are
  embedded.
