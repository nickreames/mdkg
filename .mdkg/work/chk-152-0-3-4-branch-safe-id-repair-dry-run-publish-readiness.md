---
id: chk-152
type: checkpoint
title: 0.3.4 branch-safe ID repair readiness
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [task-385]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
scope: [task-385]
created: 2026-06-16
updated: 2026-06-16
---
# Summary

`goal-17` is complete. mdkg 0.3.4 is dry-run publish ready for branch-safe ID repair: duplicate IDs and unresolved Git add/add conflict-stage ID collisions can be planned, applied, receipted, and verified while prioritizing main branch IDs and preserving safe links.

# Scope Covered

- `goal-17`: Complete mdkg 0.3.4 branch-safe ID repair plan and apply.
- `task-385`: close 0.3.4 RC evidence and checkpoint.
- Implementation scope covered `mdkg fix apply --family ids`, `mdkg fix ids --base-ref <ref> --apply --json`, clean duplicate-tree repair, Git conflict-stage duplicate repair, repair receipts, docs, command contract, publish-readiness assertions, and packed temp-repo smokes.

# Decisions Captured

- `--base-ref` is the operator control for prioritizing mainline IDs.
- Clean-tree repair rewrites only the duplicate side when a base-owned path exists for the same ID.
- Git conflict-stage repair keeps stage 2 at the conflicted path, rewrites stage 3 to the next canonical numeric ID/path, and stages both files to resolve the add/add collision.
- Link rewriting is conservative: files absent at `--base-ref` are safe incoming-side references; base-existing references are left unchanged and ambiguous references are reported.
- Index/cache and general reference findings remain plan/manual-review only; only the `ids` repair family is apply-capable in 0.3.4.

# Implementation Summary

- `src/commands/fix.ts` now plans and applies duplicate-ID repairs with deterministic plan hashes, apply metadata, safe/ambiguous reference classification, mutation locking, atomic writes, and repair receipts.
- `src/cli.ts` exposes `fix apply` and `fix ids` help/dispatch.
- `scripts/generate-command-contract.js` and `scripts/cli_help_targets.js` include the new apply-capable repair commands.
- `tests/commands/fix.test.ts` covers clean duplicate apply, `fix ids --apply`, and unresolved Git conflict-stage repair.
- `tests/commands/command_contract.test.ts` verifies the command contract exposes the apply-capable repair surface.
- `scripts/smoke-id-repair.js` packs mdkg, installs it into a temp prefix, creates fresh temp repos, proves clean duplicate repair with link preservation, proves unresolved Git add/add conflict-stage repair, and validates the repaired graph.
- Docs, init assets, changelog, and publish-readiness assertions describe the 0.3.4 repair surface.

# Verification / Testing

- `npm run build`: passed.
- `npm run test`: passed with 478 tests.
- `npm run cli:check`: passed.
- `npm run cli:contract`: passed.
- `node dist/cli.js validate --json`: passed with zero warnings and zero errors.
- `npm run smoke:id-repair`: passed from a packed `mdkg-0.3.4.tgz` install.
- `npm run smoke:fix-plan`: passed.
- `npm run smoke:branch-conflicts`: passed.
- `npm run smoke:command-docs`: passed.
- `npm run prepublishOnly`: passed.
- `node scripts/assert-publish-ready.js`: passed.
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json`: passed and reported `mdkg@0.3.4`, tarball `mdkg-0.3.4.tgz`, shasum `f5cac8ef823ad1684ccef82d3ff69988c6bdbc74`.
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run`: passed and reported `+ mdkg@0.3.4`.
- `git diff --check`: passed.

# Known Issues / Follow-ups

- No real npm publish, git tag, git push, global install, website deploy, or child-repo mutation was performed in this goal.
- The selected goal is now achieved; clear or replace the selected goal before starting the next release lane.
- Recommended next versioned goal after commit/release handling is `goal-18`, graph clone/fork and template import workflows.

# Links / Artifacts

- `.mdkg/work/goal-17-complete-mdkg-0-3-4-branch-safe-id-repair-plan-and-apply.md`
- `.mdkg/work/task-385-close-0-3-4-rc-evidence-and-checkpoint.md`
- `scripts/smoke-id-repair.js`
- `src/commands/fix.ts`
- `tests/commands/fix.test.ts`
