---
id: chk-372
type: checkpoint
title: real mdkg git origin push proof
checkpoint_kind: test-proof
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [task-661]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [task-661]
created: 2026-07-05
updated: 2026-07-05
---
# Summary

`task-661` proved the real `mdkg git` remote lifecycle against this repository's
actual GitHub `origin/main`.

The proof covered `inspect`, `closeout`, `push-ready`, and `push` with external
Git auth, a clean worktree, explicit remote/branch targets, valid mdkg
validation, valid DB snapshot status, and live docs verification after the push.

# Scope Covered

Keep `scope` frontmatter updated when possible.

## Changed Surfaces

- `.mdkg/work/task-661-prove-real-mdkg-git-origin-push-for-goal-54.md`
- `.mdkg/git/closeouts/goal-54-real-origin-proof/closeout.json`
- `.mdkg/git/closeouts/goal-54-real-origin-proof/closeout.md`
- `.mdkg/git/closeouts/goal-54-real-origin-proof/project-db.dump.md`
- `.mdkg/db/state/project.sqlite`
- `.mdkg/db/state/project.manifest.json`
- `origin/main` was advanced to
  `01afd36804f1810d9de79d66af20574325351a5f` by `mdkg git push`.

## Boundaries

- in scope: real `origin/main` inspect, closeout, push-readiness, push, and
  post-push live docs checks.
- out of scope: npm publish, tag creation, DNS/provider mutation, raw credential
  inspection, or unrelated source changes.
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded:
  yes. Remote auth remained external through system Git.

# Decisions Captured

- `mdkg git` push readiness requires explicit remote/branch, clean worktree,
  mdkg validation, DB snapshot health when DB state participated, and no raw
  credential persistence.

# Implementation Summary

No runtime code changed in this phase. The run created a focused proof task,
recorded an in-repo closeout receipt, pushed already committed release/docs
evidence to the real GitHub origin through `mdkg git push`, and then verified
the public docs generated CLI reference after deployment.

# Test Proof

- Test target: real `git@github.com:nickreames/mdkg.git` remote `origin/main`.
- Fixtures or temp repos: none for this proof; earlier 0.4.2 implementation used
  safe temp-remotes, while this checkpoint proves the real remote path.
- Coverage gaps: no remaining known goal-54 generated-reference gap after live
  verification.

# Verification / Testing

## Command Evidence

- command: `node dist/cli.js git inspect --json`
- result: passed against real `origin`, branch `main`, clean status.
- command:
  `node dist/cli.js git closeout --output /private/tmp/mdkg-goal54-real-origin-closeout --json`
- result: failed as expected because closeout outputs must stay inside the repo.
- command:
  `node dist/cli.js git closeout --output .mdkg/git/closeouts/goal-54-real-origin-proof --json`
- result: passed with validation ok, static JSON/Markdown receipts, sealed DB
  snapshot evidence, manifest, and deterministic dump.
- command: `node dist/cli.js git push-ready --remote origin --branch main --json`
- result: passed at `01afd36804f1810d9de79d66af20574325351a5f`, clean
  worktree, validation ok, DB snapshot valid, zero warnings/failures.
- command: `node dist/cli.js git push --remote origin --branch main --json`
- result: passed, pushed `HEAD -> main` to real `origin`.
- command: live read-only fetches for `mdkg.dev` and `docs.mdkg.dev`
- result: generated CLI reference, docs changelog, and homepage markers passed.

## Pass / Fail Status

- status: pass

## Known Warnings

- warning: none from `push-ready` or `push`.

# Known Issues / Follow-ups

- none for `goal-54`.

## Follow-up Refs

- `goal-54`
- `task-660`
- `task-658`
- `task-661`
- `test-341`
- `chk-371`

# Links / Artifacts

- `.mdkg/git/closeouts/goal-54-real-origin-proof/closeout.json`
- `.mdkg/git/closeouts/goal-54-real-origin-proof/closeout.md`
- `.mdkg/git/closeouts/goal-54-real-origin-proof/project-db.dump.md`
- `.mdkg/db/state/project.manifest.json`
- `.mdkg/db/state/project.sqlite`
- `/private/tmp/mdkg-live-home-after-mdkg-git-push-closeout.html`
- `/private/tmp/mdkg-live-docs-changelog-after-mdkg-git-push-closeout.html`
- `/private/tmp/mdkg-live-docs-cli-reference-after-mdkg-git-push-closeout.html`
- pushed commit: `01afd36804f1810d9de79d66af20574325351a5f`

# Raw Content Safety

- Evidence is summarized with refs, command names, commit hashes, and artifact
  paths. No raw credentials, prompts, tokens, or bulky provider payloads are
  embedded.
