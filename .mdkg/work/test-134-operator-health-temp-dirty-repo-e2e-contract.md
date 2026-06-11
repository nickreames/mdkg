---
id: test-134
type: test
title: operator health temp dirty repo e2e contract
status: done
priority: 1
epic: epic-74
parent: goal-13
tags: [smoke, temp-repo, dirty-repo, status, doctor, test, 0-3-2]
owners: []
links: []
artifacts: []
relates: [task-333]
blocked_by: [task-333]
blocks: []
refs: [edd-17]
aliases: []
skills: []
cases: []
created: 2026-06-09
updated: 2026-06-09
---
# Overview

Validate the packed/temp-repo E2E for operator health.

# Target / Scope

- `task-333`
- `edd-17`

# Preconditions / Environment

- Packed or built CLI installed into a temp prefix.

# Test Cases

- Fresh repo runs `status --json` and `doctor --strict --json`.
- Dirty repo reports Git state.
- DB initialized/migrated/verified state is reflected.
- Final `index` and `validate --json` remain clean.

# Results / Evidence

- Passed `npm run smoke:operator-health`.
- Smoke packed and installed `mdkg-0.3.0.tgz` into a temp prefix.
- Smoke temp root: `/private/tmp/mdkg-operator-health.mehEB0`.
- Covered:
  - clean git repo `status --json` level `ok`;
  - clean repo `doctor --strict --json` ok;
  - dirty repo `status --json` level `warn` with dirty git counts;
  - selected active goal reflected in `status --json`;
  - achieved selected goal rejected by `doctor --strict --json`;
  - DB init/migrate/verify reflected in `status --json`;
  - DB-enabled repo still passes `doctor --strict --json` after `mdkg index`;
  - final `mdkg validate --json` ok.
- Passed `node scripts/assert-publish-ready.js`.

# Notes / Follow-ups

- Full prepublish remains a later release gate; this node added and proved the
  specific operator-health smoke.
