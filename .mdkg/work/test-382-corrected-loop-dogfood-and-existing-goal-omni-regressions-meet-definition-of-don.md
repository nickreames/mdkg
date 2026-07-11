---
id: test-382
type: test
title: Corrected loop dogfood and existing goal Omni regressions meet definition of done
status: done
priority: 1
epic: epic-228
tags: [loop, dogfood, goal, omni]
owners: []
links: []
artifacts: [npm run ci:release passed 577 tests plus CLI contract docs installed loop smoke and publish readiness]
relates: [goal-61, task-709, loop-5, loop-6, task-726, task-727]
blocked_by: []
blocks: []
refs: [task-709, goal-58, goal-59, loop-1, loop-3, loop-4, loop-5, loop-6, task-726, test-397, task-727, test-398]
context_refs: [goal-61, epic-228, edd-70, dec-67]
evidence_refs: [chk-390, chk-408, chk-417, chk-419, chk-420, chk-421, chk-422, chk-423, chk-424]
aliases: []
skills: []
cases: []
created: 2026-07-10
updated: 2026-07-10
---
# Overview

Close the gap between short planning-only dogfood and the intended high-bar loop
workflow while guarding existing goals and Omni semantic files.

# Target / Scope

`task-709`; corrected audit loops, evidence repair, goal behavior, MANIFEST and
legacy SPEC plus WORK/ORDER/RECEIPT/FEEDBACK/DISPUTE/PROPOSAL behavior.

# Preconditions / Environment

Fresh corrected security and backend/API/CLI audit forks with answered pre-run
questions and explicit read-only authorization.

# Test Cases

- Exhaust required audit lanes and record evidence/findings/recommendations.
- Continue around gated children and use typed waivers only when approved.
- Preserve failed dogfood history while correcting false completion claims.
- Run full goal and Omni regression suites and graph validation.

# Results / Evidence

PASS on 2026-07-10.

- `loop-5` completed three child lanes, five local security evidence lanes, and
  one identity-scoped dependency-advisory waiver; no invalid bindings remained.
- `loop-6` completed three child lanes and all six backend/API/CLI evidence
  lanes; residual decomposition work is correctly owned by paused `goal-60`.
- Historical `goal-58` and `goal-59` records no longer contain done-but-pending
  tests or backlog checkpoint scaffolds. Failed dogfood remains discoverable.
- Graph-target symlink containment and bounded ZIP inflation are implemented
  and verified by `chk-417` and `chk-419`.
- `npm run ci:release` passed 577/577 tests, CLI parity, command-contract and
  docs checks, all seven installed SQLite loop-template smokes, and publish
  readiness.
- Existing goal behavior and MANIFEST, legacy SPEC, WORK, WORK_ORDER, RECEIPT,
  FEEDBACK, DISPUTE, and PROPOSAL regressions passed in the full suite.

# Notes / Follow-ups

- External dependency advisory/provider scans remain approval-gated in
  `task-688` under `goal-64`; they were not falsely included in this local loop
  completion.
- Package version/changelog finalization, publish, push, deploy, and global
  replacement remain exclusively owned by `goal-64`.
