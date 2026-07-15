---
id: chk-518
type: checkpoint
title: Archive compression ownership v0.5.1 implementation ready
checkpoint_kind: goal-closeout
status: done
priority: 9
tags: [archive, compression, ownership, subgraph, v0.5.1, release-readiness]
owners: []
links: []
artifacts: []
relates: [goal-70, goal-71, task-782, edd-76, dec-82]
blocked_by: []
blocks: []
refs: [goal-70, goal-71, edd-76, dec-82, test-435, test-436, test-437, test-438, test-439, test-440, test-441, test-442, test-443]
context_refs: [edd-76, dec-82]
evidence_refs: [test-435, test-436, test-437, test-438, test-439, test-440, test-441, test-442, test-443]
aliases: []
skills: []
scope: [goal-70, bug-1, task-777, task-778, task-779, task-780, task-781, task-782]
created: 2026-07-14
updated: 2026-07-14
---
# Summary

Goal 70 fixes archive compression ownership for mixed local/imported graphs and
passes the complete source, installed-package, documentation, security, and npm
dry-run release ladder at package version 0.5.0. The implementation is ready
for the separate v0.5.1 release mutation in Goal 71.

# Scope Covered

- `archive compress --all` selects only archives owned by enabled local
  `config.workspaces`.
- Exact qids disambiguate duplicate archive ids without converting imported
  bundle projections into filesystem paths.
- Full-set selection, ownership, containment, symlink, raw-input, sidecar, and
  destination preflight completes before the first write.
- JSON and text output report selected local workspaces and imported read-only
  projections excluded from mutation.
- CLI help, generated command contracts, README, public docs, generated
  references, and the Unreleased changelog describe the same boundary.

## Changed Surfaces

- Source: `src/commands/archive.ts`, `src/cli.ts`.
- Contracts/docs: `scripts/generate-command-contract.js`,
  `CLI_COMMAND_MATRIX.md`, `README.md`, `CHANGELOG.md`, and subgraph docs.
- Regression fixture: `tests/commands/archive_compress_ownership.test.ts`.
- Generated references: CLI reference, command-contract summary, and release
  notes data.
- Graph evidence: Goal 70 design, work, tests, and this checkpoint.

## Boundaries

- No command targeted `/Users/nick/omni-chat-rooms`; all mutation regressions
  used disposable fixtures.
- No package/lock version bump, push, publish, tag, global install, deployment,
  or real consumer graph mutation occurred.
- Package version remains `0.5.0`; Goal 71 owns the `0.5.1` release changes.
- Imported bundles, child source trees, gitlinks, and materialized subgraphs are
  outside archive compression authority.

# Decisions Captured

- Enabled local workspaces are the exclusive writable archive owners.
- Imported nodes stay visible to list/show/search/capability discovery but fail
  closed for direct compression with actionable read-only guidance.
- `--all --ws <local>` filters writable selection; an imported alias fails
  before writes.
- Writes remain per-file atomic after complete full-set preflight. Unexpected
  operating-system I/O failure is not represented as a cross-archive
  transaction.

# Implementation Summary

Previously, `--all` iterated every archive in the merged index, ignored `--ws`,
and treated virtual `<bundle>.zip#<internal-path>` projections as ordinary paths.
A local archive could therefore be changed before a later imported projection
failed. The new plan/apply split resolves graph identity and writable ownership
first, builds and validates every local output in memory, and only then performs
atomic per-file replacements.

# Verification / Testing

## Command Evidence

- `npm run build`: passed.
- `npm run test`: 641/641 repository tests and 13/13 public-release tests passed.
- `npm run smoke:archive-work`, `smoke:subgraph`, and `smoke:bundle`: passed
  independently and inside `prepublishOnly`.
- `npm run cli:check`, `npm run cli:contract`, and `npm run docs:check`: passed;
  463 documentation command examples checked with zero failures.
- `npm run prepublishOnly`: passed the complete installed-package smoke ladder
  and final publish-readiness assertion.
- `node scripts/assert-publish-ready.js`: passed.
- `npm pack --dry-run --json`: passed; 190 files, 412,458 packed bytes,
  2,164,716 unpacked bytes.
- `npm publish --dry-run --registry=https://registry.npmjs.org/`: passed and
  reported `+ mdkg@0.5.0`; no publication occurred.
- Disposable ownership regressions passed under SQLite and JSON index backends,
  including hash-stable bundle bytes, child Git state, gitlink identity,
  materialized output, and zero writes on invalid full-set preflight.

## Pass / Fail Status

- status: passed

## Known Warnings

- The logical implementation commit is created after this checkpoint and final
  graph validation. Its SHA is reported in the Goal 70 closeout and operator
  handoff because a commit cannot embed its own final hash.
- No cross-archive rollback is promised after an unexpected operating-system
  failure begins the mutation phase; complete deterministic preflight prevents
  selection and validation failures from causing partial writes.

# Known Issues / Follow-ups

- Goal 71 must bump package and lock versions to `0.5.1`, finalize the
  changelog, rerun release gates, obtain explicit operator approval, publish,
  update docs, upgrade the global CLI, and verify the real root graph with
  before/after no-touch evidence.

## Follow-up Refs

- `goal-71`
- `test-444` through `test-449`

# Links / Artifacts

- Implementation commit subject: `fix(archive): enforce local compression ownership`.
- Final commit SHA and clean/dirty state are reported after commit creation.

# Raw Content Safety

- This checkpoint stores the completion summary and artifact refs, not raw prompts, secrets, payloads, or bulky traces.
