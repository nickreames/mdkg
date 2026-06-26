---
id: task-592
type: task
title: implement upgrade migration from SPEC.md to MANIFEST.md
status: backlog
priority: 1
parent: goal-40
tags: [manifest, spec, upgrade, migration, blocker, 0-3-8]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: [task-589]
refs: [goal-37, dec-50, edd-54]
context_refs: [goal-37, dec-50, edd-54]
evidence_refs: []
aliases: [spec-to-manifest-upgrade, upgrade-renames-spec-md, manifest-upgrade-migration]
skills: [pursue-mdkg-goal, verify-close-and-checkpoint]
created: 2026-06-26
updated: 2026-06-26
---
# Overview

Implement the missing `mdkg upgrade` migration that safely renames legacy
`SPEC.md` capability files to canonical `MANIFEST.md` and normalizes
frontmatter from `type: spec` to `type: manifest`.

A local probe before this task was created showed the current blocker:
`mdkg upgrade --apply` left
`/private/tmp/mdkg-upgrade-spec-probe/.mdkg/work/agent.legacy-probe-legacy-capability-probe/SPEC.md`
in place, created no `MANIFEST.md`, and returned a summary with `migrated: 0`.

# Acceptance Criteria

- `mdkg upgrade --dry-run --json` reports planned legacy SPEC migrations
  without writing files.
- `mdkg upgrade --apply --json` atomically renames eligible `SPEC.md` files to
  `MANIFEST.md`.
- The migration updates the file frontmatter from `type: spec` to
  `type: manifest` while preserving ids, titles, body content, and unrelated
  metadata.
- If a sibling `MANIFEST.md` already exists, upgrade does not overwrite it and
  reports a blocking conflict with remediation.
- Legacy compatibility behavior remains: validators still accept `SPEC.md`
  with a warning during the compatibility release, and `MANIFEST.md` plus
  sibling `SPEC.md` remains a validation error.
- Upgrade receipts include enough detail to audit migrated paths and conflicts.
- Unit and smoke coverage prove dry-run, apply, conflict, and post-migration
  validation behavior.

# Files Affected

- `src/commands/upgrade.ts`
- upgrade-related tests under `tests/commands/`
- docs or generated command references only if behavior text changes
- mdkg graph evidence for this goal

# Implementation Notes

- Reuse existing upgrade receipt fields where possible; add migration detail
  only when it is needed for auditability.
- Use atomic write/rename helpers where existing upgrade code already relies on
  them.
- Keep migration conservative. A customized `SPEC.md` is still eligible if it
  has valid mdkg frontmatter and no sibling `MANIFEST.md`; content must be
  preserved exactly except for the frontmatter type normalization.
- Do not remove parser/indexer support for legacy `SPEC.md`.
- Do not rename non-mdkg files named `SPEC.md` outside the managed `.mdkg`
  semantic-file surfaces.

# Test Plan

- Focused unit test for dry-run migration receipt.
- Focused unit test for apply migration from `SPEC.md` / `type: spec` to
  `MANIFEST.md` / `type: manifest`.
- Focused unit test for sibling conflict when both `MANIFEST.md` and `SPEC.md`
  exist.
- Temp-repo smoke:
  - create a manifest with `mdkg new manifest`
  - rename it to `SPEC.md` and set `type: spec`
  - run `mdkg upgrade --dry-run --json`
  - run `mdkg upgrade --apply --json`
  - assert `SPEC.md` is gone, `MANIFEST.md` exists, and validation is clean
- `npm run build`
- `npm run test`
- `npm run cli:check`
- `npm run cli:contract`
- `node dist/cli.js validate --changed-only --json`
- `git diff --check`

# Links / Artifacts

- `goal-37`
- `dec-50`
- `edd-54`
- `test-301`
