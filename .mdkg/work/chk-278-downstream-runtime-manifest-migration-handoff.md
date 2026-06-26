---
id: chk-278
type: checkpoint
title: downstream runtime MANIFEST migration handoff
checkpoint_kind: handoff
status: backlog
priority: 9
tags: []
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
skills: []
scope: []
created: 2026-06-26
updated: 2026-06-26
---
# Summary

Downstream runtime repos can now be handed a copy-ready migration brief for the
mdkg `MANIFEST.md` rename. The prerequisite is the mdkg compatibility release
that treats `MANIFEST.md` with `type: manifest` as canonical while retaining
`SPEC.md` with `type: spec` as a one-compatibility-release legacy alias with
deprecation warnings.

# Scope Covered

- `goal-37`
- `task-584`

## Changed Surfaces

- mdkg handoff/checkpoint graph state only.
- No downstream runtime repository files were changed.

## Boundaries

- in scope: migration guidance for downstream runtime agents, fixture suites,
  internal type names, and user-facing terminology.
- out of scope: direct downstream repo edits, package publication, tags, pushes,
  deploys, and removal of legacy compatibility behavior.
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded.

# Decisions Captured

- `dec-50`: `MANIFEST.md` is canonical and `SPEC.md` is a legacy alias.
- `edd-54`: canonical semantic surface and compatibility bridge design.

# Implementation Summary

Use this as the downstream agent brief:

1. Confirm the downstream repo consumes an mdkg build that supports canonical
   `MANIFEST.md` and the legacy `SPEC.md` compatibility bridge.
2. Update checked-in runtime fixtures and generated fixture expectations from
   `SPEC.md` to `MANIFEST.md` with `type: manifest`.
3. Keep targeted legacy `SPEC.md` / `type: spec` fixtures until the
   one-compatibility-release window intentionally closes.
4. Rename internal types gradually where the runtime owns the names:
   `RoomSpecRef` to `RoomManifestRef`, `SpecDocument` to `ManifestDocument`,
   `SpecLoader` to `ManifestLoader`, and `spec-driven startup` tests to
   `manifest-driven startup` tests.
5. Keep compatibility parsing separate from naming cleanup: first accept both
   canonical manifest refs and legacy spec refs, then migrate internals/docs,
   then remove legacy fixture dependence in a later closure task.
6. Update user-facing copy from `SPEC-driven startup` to
   `manifest-driven startup`.

# Handoff Summary

- Recipient/context: downstream runtime coding agent.
- Starting node or command: start from the downstream repo's current mdkg/runtime
  fixture tests, then search for `SPEC.md`, `type: spec`, `RoomSpecRef`,
  `SpecDocument`, `SpecLoader`, and `SPEC-driven startup`.
- Explicit boundaries: do not remove legacy SPEC coverage in the same pass that
  adopts MANIFEST terminology; do not mutate mdkg package compatibility from a
  downstream runtime repo.

# Verification / Testing

## Command Evidence

- command: `node dist/cli.js pack goal-37 --profile concise --dry-run --stats`
- result: passed; latest checkpoint `root:chk-277` was included.
- command: `node dist/cli.js handoff create goal-37 --json`
- result: passed; sanitized receipt hash
  `sha256:785ce223efa522924f6c25a74f85f02121141af8c4ffd8b36cafce0db3d62ab2`.

## Pass / Fail Status

- status: pass

## Known Warnings

- `node dist/cli.js validate --json` currently reports the intentional
  dogfood `root:spec.mdkg-cli` legacy `SPEC.md` compatibility warning. That
  warning is accepted for this compatibility release.

# Known Issues / Follow-ups

- Downstream repos still need their own implementation and validation pass.
- Legacy SPEC fixture coverage must remain until the compatibility window is
  intentionally closed by a later task.

## Follow-up Refs

- `task-584`
- `test-296`

# Links / Artifacts

- `chk-277`
- `dec-50`
- `edd-54`

# Raw Content Safety

- Summarize evidence and use refs, hashes, and artifact links instead of raw
  secrets, raw prompts, raw payloads, or bulky execution traces.
