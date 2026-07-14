---
id: chk-514
type: checkpoint
title: Registry install and upgrade verification passed
checkpoint_kind: implementation
status: done
priority: 9
tags: []
owners: []
links: []
artifacts: [artifact://npm/mdkg/0.5.0]
relates: [goal-64, task-720, test-391]
blocked_by: []
blocks: []
refs: [chk-513, task-720, test-391]
context_refs: [goal-64, chk-513, task-720, test-391]
evidence_refs: [chk-513]
aliases: []
skills: []
scope: [task-720]
created: 2026-07-13
updated: 2026-07-13
---
# Summary

Registry-fetched `mdkg@0.5.0` passed independent package, fresh-install,
loop-command, SQLite, and `0.4.2` upgrade verification.

# Scope Covered

- Registry package installed under
  `/private/tmp/mdkg-v050-postpublish.BFXlsD/prefix-050`.
- Fresh consumer graph created under
  `/private/tmp/mdkg-v050-postpublish.BFXlsD/fresh-repo`.
- Upgrade fixture created under
  `/private/tmp/mdkg-v050-postpublish.BFXlsD/upgrade-repo`.

## Changed Surfaces

- Registry package bytes, bundled init assets, fresh graph, SQLite index, loop
  fork/readiness/routing/pack behavior, and upgrade migration behavior.

## Boundaries

- in scope: read-only registry verification and disposable consumer workspaces
- out of scope: global replacement, website activation, deployment, and tagging
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded

# Decisions Captured

- Registry and consumer verification consume the authorized release recorded in
  `chk-513`; website activation remains dormant.

# Implementation Summary

- Registry metadata matched version `0.5.0`, SHA-1
  `e2912a1069761b392fc9ed2c713ecb4bd690758e`, and integrity
  `sha512-n3k5Sjn7PcNk5gnEkGIVdeYyRBZ9A0UG6hkneEro1vRWTP3+XXy4HKVdbJ1AcnnJE6JGvQWdv8ayHmqEqxvYLQ==`.
- The installed package contained seven loop seeds, the default loop template,
  `pursue-mdkg-loop`, generated CLI docs, the command contract, and SQLite code.
- Fresh init/index/validate passed; loop list, fork dry-run, real fork, plan,
  next, and concise pack all executed through the installed absolute binary.
- Fork dry-run previewed `loop-1`; the immediate real fork created `loop-1`,
  proving the dry-run did not consume an ID.
- The `0.4.2` fixture preserved goal, loop, and canonical MANIFEST hashes. Upgrade
  dry-run reported no conflicts, apply migrated one legacy SPEC and added loop
  assets, and the second dry-run reported zero changes across 80 managed assets.
- A post-upgrade legacy `SPEC.md` remained discoverable through `mdkg spec show`
  with canonical manifest metadata and the intended deprecation warning.

# Verification / Testing

## Command Evidence

- commands: installed `mdkg init`, `index`, `validate`, `loop list/fork/plan/next`,
  `pack`, `upgrade --json`, `upgrade --apply --json`, `goal show`, `loop show`,
  `manifest list`, and `spec show`
- result: all required commands succeeded; upgrade apply was idempotent

## Pass / Fail Status

- status: passed

## Known Warnings

- Fresh fork validation emitted five recommended-heading warnings for generated
  `spike-1` and `task-1`; there were zero validation errors.
- Deliberately retained legacy `SPEC.md` emitted the required compatibility
  warning; there were zero validation errors.

# Known Issues / Follow-ups

- Consider improving seeded child headings in a future patch; this advisory does
  not block the published package or the remaining release activation sequence.

## Follow-up Refs

- `task-721`
- `test-392`

# Links / Artifacts

- artifact://npm/mdkg/0.5.0
- artifact://github-actions/run/29254216004

# Raw Content Safety

- This checkpoint stores the completion summary and artifact refs, not raw prompts, secrets, payloads, or bulky traces.
