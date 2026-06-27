---
id: test-301
type: test
title: upgrade renames legacy SPEC files to MANIFEST files
status: done
priority: 1
parent: goal-40
tags: [manifest, spec, upgrade, migration, contract]
owners: []
links: []
artifacts: []
relates: [task-592]
blocked_by: []
blocks: [task-589]
refs: [task-592, goal-37, dec-50, edd-54]
context_refs: [goal-37, dec-50, edd-54]
evidence_refs: []
aliases: [upgrade-spec-to-manifest-contract, spec-md-rename-contract]
skills: [verify-close-and-checkpoint]
cases: [dry-run reports planned SPEC to MANIFEST migration, apply renames SPEC.md to MANIFEST.md, apply rewrites type spec to type manifest, body and metadata are preserved, sibling MANIFEST conflict blocks safely, validation is clean after migration]
created: 2026-06-26
updated: 2026-06-26
---
# Overview

Validate the release-blocking upgrade behavior for canonical `MANIFEST.md`.
This test proves that `mdkg upgrade` can migrate existing downstream repos from
legacy `SPEC.md` capability files without data loss.

# Target / Scope

- `task-592`
- `src/commands/upgrade.ts`
- legacy `SPEC.md` / `type: spec` compatibility migration

# Preconditions / Environment

- A temporary mdkg repo can be created under `/private/tmp`.
- The test fixture has a legacy `SPEC.md` file with `type: spec` and no sibling
  `MANIFEST.md`.
- A separate conflict fixture has both `SPEC.md` and sibling `MANIFEST.md`.

# Test Cases

- Dry-run migration receipt lists the legacy `SPEC.md` path and target
  `MANIFEST.md` path without writing files.
- Apply migration removes or renames the old `SPEC.md` path, creates the target
  `MANIFEST.md`, and normalizes frontmatter to `type: manifest`.
- The migration preserves id, title, tags, semantic body content, and unrelated
  metadata.
- Apply migration is idempotent after the first successful run.
- Sibling `MANIFEST.md` conflict is reported and does not overwrite either
  file.
- After successful migration, `mdkg validate --json` is clean for the migrated
  fixture and `mdkg manifest list/show/validate --json` sees the migrated
  capability.

# Results / Evidence

- Pre-task blocker probe: previous local `mdkg upgrade --apply` left
  `/private/tmp/mdkg-upgrade-spec-probe/.mdkg/work/agent.legacy-probe-legacy-capability-probe/SPEC.md`
  in place, created no `MANIFEST.md`, and reported `migrated: 0`.
- Implemented proof now passes:
  - dry-run reports a `manifest_migration` with source `SPEC.md` and target
    `MANIFEST.md`;
  - apply renames `SPEC.md` to `MANIFEST.md`;
  - apply rewrites `type: spec` to `type: manifest`;
  - metadata and body content are preserved;
  - sibling `MANIFEST.md` conflicts are blocking and non-destructive;
  - validation is clean after migration.
- PASS: `node --test dist/tests/commands/upgrade.test.js` with 11 passing
  upgrade tests.
- PASS: temp CLI proof at `/private/tmp/mdkg-upgrade-spec-proof` with
  `dry_run.safe_to_apply: true`, `dry_run.migrated: 1`, `apply.migrated: 1`,
  zero remaining `SPEC.md` files, one `MANIFEST.md`, `type: manifest`, and
  `validate.ok: true`.
- PASS: `npm run smoke:upgrade` with package-level coverage through a packed
  install.
- PASS: `npm run test` with 521 passing tests and 0 failures.

# Notes / Follow-ups

- This test must pass before `task-589` can proceed to real publish approval.
