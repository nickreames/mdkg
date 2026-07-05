---
id: task-661
type: task
title: prove real mdkg git origin push for goal-54
status: progress
priority: 0
parent: goal-54
tags: [git, origin, push, goal-54, docs, live-validation]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [task-660, test-341]
context_refs: []
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint]
created: 2026-07-05
updated: 2026-07-05
---
# Overview

Prove the `mdkg git` remote lifecycle path against this repository's real
`origin/main` while closing the deployment boundary for `goal-54`. The task
exists because earlier `mdkg git push` proof used a safe local bare remote; this
task verifies the same command family against the actual GitHub origin with
external Git auth.

# Acceptance Criteria

- `mdkg git inspect --json` reports this repo, `origin`, branch `main`, and
  sanitized source/accepted revision evidence.
- `mdkg git closeout --json` validates mdkg state and writes static closeout
  receipts without leaking credentials or bulky payloads.
- `mdkg git push-ready --remote origin --branch main --json` passes from a clean
  worktree with explicit remote/branch and credential-safe remote configuration.
- `mdkg git push --remote origin --branch main --json` pushes the current
  committed goal-54 docs/evidence commits to real `origin/main`.
- Post-push status is clean and even with `origin/main`.
- Live `docs.mdkg.dev/reference/generated-cli-reference/` includes `mdkg git`,
  `push-ready`, and closeout markers after deployment has updated.

# Files Affected

List files/directories expected to change.

- `.mdkg/work/task-661-prove-real-mdkg-git-origin-push-for-goal-54.md`
- `.mdkg/index/mdkg.sqlite`
- `.mdkg/git/closeouts/...` closeout receipts may be generated locally by
  `mdkg git closeout`; commit only if needed for the proof record.

# Implementation Notes

- Use real `origin/main`, not a temp local remote.
- Keep Git auth external; do not print, copy, or commit credentials.
- Run `mdkg git push` without `--stage-all` after this proof task is committed,
  so the real push occurs from a clean worktree.
- Do not publish npm, create tags, or change provider/DNS state.

# Test Plan

- `node dist/cli.js validate --changed-only --json`
- `git status --short --branch`
- `mdkg git inspect --json`
- `mdkg git closeout --json`
- `mdkg git push-ready --remote origin --branch main --json`
- `mdkg git push --remote origin --branch main --json`
- post-push `git status --short --branch`
- live read-only checks for `mdkg.dev`, docs changelog, and generated CLI
  reference

# Links / Artifacts

- `task-660`
- `test-341`
- `goal-54`
- `mdkg git inspect --json` against real `origin` passed at
  `84a6fe979f5667c7a9ca07b008987da52fbc5a7b`, branch `main`, tree
  `965beaa7d74f4c949eeab3abe0d575f599d32797`, remote
  `git@github.com:nickreames/mdkg.git`, clean status.
- `mdkg git closeout --output .mdkg/git/closeouts/goal-54-real-origin-proof --json`
  passed with validation ok, static JSON/Markdown receipts, DB snapshot
  `.mdkg/db/state/project.sqlite`, manifest `.mdkg/db/state/project.manifest.json`,
  and deterministic dump
  `.mdkg/git/closeouts/goal-54-real-origin-proof/project-db.dump.md`.
