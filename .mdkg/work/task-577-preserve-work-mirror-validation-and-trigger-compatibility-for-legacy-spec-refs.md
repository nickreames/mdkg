---
id: task-577
type: task
title: preserve WORK mirror validation and trigger compatibility for legacy spec refs
status: done
priority: 1
epic: epic-196
parent: goal-37
tags: [manifest, work-mirrors, compatibility, refs]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [edd-54, task-276]
context_refs: []
evidence_refs: []
aliases: [manifest-work-trigger-compatibility, legacy-spec-work-ref-compatibility, work-md-manifest-refs]
skills: [select-work-and-ground-context]
created: 2026-06-25
updated: 2026-06-26
---
# Overview

Preserve semantic mirror behavior where `WORK.md` relationships, work trigger,
orders, receipts, and validation currently resolve through `SPEC.md`
capability refs.

# Acceptance Criteria

- `WORK.md` can reference canonical manifest records where it previously
  referenced specs.
- Existing `WORK.md` to `SPEC.md` references continue to validate during the
  one-compatibility-release window.
- `mdkg work trigger` accepts a direct `WORK.md` ref and a manifest/spec ref
  with exactly one resolvable work contract.
- Error messages prefer `MANIFEST.md` while explaining legacy `SPEC.md`
  compatibility.
- `WORK_ORDER.md`, `RECEIPT.md`, `FEEDBACK.md`, `DISPUTE.md`, and
  `PROPOSAL.md` semantics remain unchanged.

# Files Affected

- `.mdkg/templates/default/manifest.md`
- `scripts/assert-publish-ready.js`
- `tests/helpers/templates.ts`
- `tests/commands/agent_file_types.test.ts`
- `tests/commands/archive_work.test.ts`

# Implementation Notes

- Keep production order state and execution state outside mdkg. This task only
  updates semantic mirror validation and deterministic trigger creation.
- Do not widen validation to accept arbitrary manifest-like files.
- The existing trigger resolver already handled direct `WORK.md`, canonical
  manifest, transitional manifest, and legacy spec semantic nodes. This pass
  added regression coverage and the missing canonical manifest template asset
  needed by pack heading summaries and packaged init fallback.

# Results / Evidence

- Added `.mdkg/templates/default/manifest.md` so canonical manifest scaffolds
  have a repo-local source template; build copies it to ignored
  `dist/init/templates/default/manifest.md`.
- Added `mdkg new manifest` scaffold coverage in
  `tests/commands/agent_file_types.test.ts`.
- Added canonical `MANIFEST.md` `mdkg work trigger` coverage in
  `tests/commands/archive_work.test.ts`, including manifest-first missing and
  ambiguous contract diagnostics.
- Added `manifest.md` to the publish-ready seeded-template contract.
- `node dist/cli.js pack task-577 --profile concise --dry-run --stats` passes
  after the manifest template exists.
- `node --test dist/tests/commands/archive_work.test.js`: 11 passing.
- `node --test dist/tests/commands/agent_file_types.test.js`: 39 passing.
- `node scripts/assert-publish-ready.js`: `publish readiness ok`.
- `npm run smoke:archive-work`: `archive/work smoke passed`.
- `npm run smoke:work-invocation`: `work invocation smoke passed`.
- A first parallel run of `npm run smoke:archive-work` and
  `npm run smoke:work-invocation` raced their shared `dist/init` rebuild and
  failed in build/package setup. Rebuilding once and rerunning the same smokes
  sequentially passed, so the recorded failure is a command-concurrency caveat,
  not a product regression.

# Test Plan

- `test-293`
- `npm run smoke:archive-work`
- Existing work invocation smoke remains compatible.

# Links / Artifacts

- `edd-54`
- `task-276`
- `test-293`
