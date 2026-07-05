---
id: task-660
type: task
title: add mdkg git coverage to docs generated CLI reference
status: done
priority: 1
parent: goal-54
tags: [docs, generated-cli-reference, mdkg-git, 0.4.2]
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
skills: [build-pack-and-execute-task, verify-close-and-checkpoint]
created: 2026-07-05
updated: 2026-07-05
---
# Overview

Update the docs generated CLI reference surface so it reflects the `mdkg git`
command family shipped in `mdkg@0.4.2`. This is a documentation-currentness
gap, not a runtime package gap.

# Acceptance Criteria

- The generated CLI reference page documents `mdkg git` and its subcommands:
  `inspect`, `clone`, `fetch`, `closeout`, `push-ready`, and `push`.
- The page states the key boundaries: system Git backend, external auth, explicit
  remote/branch, sanitized refs/hashes/receipts, and push approval by caller.
- The content is consistent with `CLI_COMMAND_MATRIX.md`, `README.md`, and
  `CHANGELOG.md` for `0.4.2`.
- Local docs build and docs smoke checks pass.

# Files Affected

List files/directories expected to change.

- `docs/src/content/docs/reference/generated-cli-reference.md`
- generated docs support scripts if the page is meant to be regenerated rather
  than edited directly
- `docs/dist/` only as build output, not committed unless the repo convention
  requires it

# Implementation Notes

- Before editing, inspect why `docs/src/content/docs/reference/generated-cli-reference.md`
  is only a curated summary while `CLI_COMMAND_MATRIX.md` has complete command
  coverage.
- Prefer a durable generation or sync improvement if the current page can drift
  again as CLI command families are added.
- Do not change CLI behavior or package version in this task.

# Test Plan

- `npm run docs:check`
- `npm --prefix docs run build`
- `npm run smoke:mdkg-dev-docs`
- `rg -n "mdkg git|push-ready|closeout" docs/dist/reference/generated-cli-reference/index.html`
- live read-only verification after approved deployment

# Links / Artifacts

- `CLI_COMMAND_MATRIX.md`
- `README.md`
- `CHANGELOG.md`
- `docs/src/content/docs/project/changelog.md`
- `/private/tmp/mdkg-live-docs-cli-reference-postpublish.html`

# Completion Evidence

Completed locally on 2026-07-05.

- Added the public `Git lifecycle commands` section to
  `docs/src/content/docs/reference/generated-cli-reference.md`.
- Updated `scripts/generate-docs-reference.js` so generated Git command-family
  guidance states the system-Git/external-auth boundary.
- Regenerated `docs/_generated/cli-reference.md`.
- Hardened `scripts/smoke-mdkg-dev-docs.js` so the public source page and
  generated backing file must include the `mdkg git` command family.
- Verification passed: `npm run docs:check`, `npm --prefix docs run build`,
  rendered HTML marker search for the local generated-reference route,
  `npm run smoke:mdkg-dev-docs`, `node dist/cli.js validate --changed-only --json`,
  `node dist/cli.js validate --summary --limit 20 --json`, and
  `git diff --check`.
- Checkpoint: `chk-371`.
