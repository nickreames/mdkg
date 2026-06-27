---
id: test-304
type: test
title: collaboration human and spec compatibility bridge contract
status: done
priority: 1
epic: epic-200
parent: goal-41
tags: [0.3.9, collaboration, human, spec, compatibility, test]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-597]
blocks: []
refs: [task-597]
context_refs: []
evidence_refs: []
aliases: []
skills: []
cases: []
created: 2026-06-26
updated: 2026-06-27
---
# Overview

Validate the `COLLABORATION.md`/legacy `HUMAN.md` bridge alongside the
MANIFEST/SPEC compatibility bridge.

# Target / Scope

`task-597`, init assets, upgrade behavior, AGENT_START guidance, and existing
MANIFEST/SPEC compatibility.

# Preconditions / Environment

Use fresh init and legacy fixture repos.

# Test Cases

- Fresh init exposes `COLLABORATION.md` as canonical.
- Legacy `HUMAN.md` content survives upgrade and is treated as a one-release
  alias.
- Guidance prefers `COLLABORATION.md` while documenting the legacy alias.
- Existing `SPEC.md` compatibility behavior remains unchanged.

# Results / Evidence

- `node --test dist/tests/commands/init.test.js` passed: 9 tests.
- `node --test dist/tests/commands/upgrade.test.js` passed: 13 tests.
- Coverage includes fresh `mdkg init --agent` seeding `COLLABORATION.md`,
  `rule-soul` / `rule-7` / `rule-human` core pin order, HUMAN as one-release
  legacy alias, startup guidance preferring COLLABORATION, upgrade creation of
  missing COLLABORATION, preservation of customized HUMAN content, and accurate
  init-manifest hashes after managed pin insertion.
- Existing MANIFEST/SPEC compatibility tests in `upgrade.test.js` still pass:
  dry-run migration, apply rename to `MANIFEST.md` with `type: manifest`, and
  sibling `MANIFEST.md` conflict preservation.

# Notes / Follow-ups

- A later goal should remove/demote both legacy aliases after the compatibility
  window.
