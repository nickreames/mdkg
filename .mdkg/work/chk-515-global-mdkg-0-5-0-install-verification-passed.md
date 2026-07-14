---
id: chk-515
type: checkpoint
title: Global mdkg 0.5.0 install verification passed
checkpoint_kind: implementation
status: done
priority: 9
tags: []
owners: []
links: []
artifacts: [artifact://npm/mdkg/0.5.0]
relates: [goal-64, task-721, test-392]
blocked_by: []
blocks: []
refs: [chk-513, chk-514, task-721, test-392]
context_refs: [goal-64, chk-513, chk-514, task-721, test-392]
evidence_refs: [chk-513, chk-514]
aliases: []
skills: []
scope: [task-721]
created: 2026-07-13
updated: 2026-07-13
---
# Summary

The real `/opt/homebrew` global installation was replaced with registry
`mdkg@0.5.0` and passed the required loop command and dry-run ID probes.

# Scope Covered

- Before: `/opt/homebrew/bin/mdkg` resolved to the global package and reported
  `0.4.2`.
- After: the same path resolves to
  `/opt/homebrew/lib/node_modules/mdkg/dist/cli.js`; CLI and package metadata
  both report `0.5.0`.
- Clean probe workspace: `/private/tmp/mdkg-v050-global.BNGiEe`.

## Changed Surfaces

- `/opt/homebrew` global npm package, disposable consumer graph, SQLite index,
  loop nodes, generated children, and command receipts.

## Boundaries

- in scope: approved global package replacement and disposable local probes
- out of scope: website activation, deployment, npm republish, and Git tags
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded

# Decisions Captured

- The bounded release approval in `task-718` authorized global replacement.
- No rollback was needed; if later required, the documented path is
  `npm install -g mdkg@0.4.2` against the public registry.

# Implementation Summary

- Global install changed one package and retained the expected Homebrew npm
  prefix and symlink layout.
- Fresh `init --agent`, SQLite `index`, and validation passed with zero warnings
  before user-created nodes.
- `new loop` created a raw loop and returned all seven suggested templates;
  `loop list` exposed the raw loop plus all seven seed templates.
- Security fork dry-run previewed `loop-2` and child `spike-1`, `task-1`, and
  `test-1`; the immediate real fork created those exact IDs.
- `loop plan`, `loop next`, and concise `pack` succeeded through the absolute
  global binary. `loop next` selected the unblocked grounding spike while
  preserving unanswered pre-run questions.

# Verification / Testing

## Command Evidence

- commands: `/opt/homebrew/bin/mdkg --version`, `init`, `index`, `validate`,
  `new loop`, `loop list`, `loop fork --dry-run`, `loop fork`, `loop plan`,
  `loop next`, and `pack`
- result: all required global-install probes passed

## Pass / Fail Status

- status: passed

## Known Warnings

- Post-fork validation emitted the same five generated-child recommended-heading
  advisories recorded in `chk-514`; there were zero errors.

# Known Issues / Follow-ups

- Website release activation remains dormant until `task-722`.

## Follow-up Refs

- `task-722`
- `test-393`

# Links / Artifacts

- artifact://npm/mdkg/0.5.0

# Raw Content Safety

- This checkpoint stores the completion summary and artifact refs, not raw prompts, secrets, payloads, or bulky traces.
