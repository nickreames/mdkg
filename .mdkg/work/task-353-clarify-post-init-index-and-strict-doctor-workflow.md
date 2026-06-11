---
id: task-353
type: task
title: clarify post-init index and strict doctor workflow
status: done
priority: 1
epic: epic-74
tags: [init, index, doctor, ux]
owners: []
links: []
artifacts: []
relates: [goal-14]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
created: 2026-06-11
updated: 2026-06-11
---
# Overview

Clarify the fresh-init health workflow: `mdkg init --agent` creates source
assets, `mdkg index` creates generated caches, and `mdkg doctor --strict --json`
is clean after those caches exist.

# Acceptance Criteria

- README quickstart instructs users to run `mdkg index` after `mdkg init --agent`.
- Seeded init README includes `mdkg index` in next commands before status/doctor
  style checks.
- Command matrix notes that strict doctor may report missing generated caches
  until `mdkg index` runs.
- No auto-indexing behavior is introduced in this pass.
- `test-146` records the temp-repo behavior contract.

# Files Affected

- `README.md`
- `assets/init/README.md`
- `CLI_COMMAND_MATRIX.md`
- `assets/init/CLI_COMMAND_MATRIX.md`

# Implementation Notes

- Preserve current strict doctor semantics; the gap is guidance, not the health
  check behavior.
- Keep the workflow explicit so generated caches remain reproducible and
  reviewable.

# Test Plan

- `rg -n "mdkg index|doctor --strict" README.md assets/init/README.md CLI_COMMAND_MATRIX.md assets/init/CLI_COMMAND_MATRIX.md`
- Fresh temp repo: `mdkg init --agent`, `mdkg fix plan --json`, `mdkg index`,
  `mdkg doctor --strict --json`
- `npm run smoke:init`

# Links / Artifacts

- `test-146`
- `goal-14`

# Evidence

- Updated README, seeded `.mdkg/README.md` asset, root command matrix, and seeded
  command matrix to guide users to run `mdkg index` after fresh init.
- Verified a temp repo at `/private/tmp/mdkg-init-index-doc.qiG2fb/repo`:
  `init --agent`, `fix plan --json` reported missing generated caches,
  `mdkg index` created caches, and `doctor --strict --json` passed.
- `npm run smoke:init` passed.
