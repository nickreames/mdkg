---
id: epic-64
type: epic
title: 0.3.0 CLI UX polish and final temp-repo readiness
status: done
priority: 1
tags: [release, polish, cli, prepublish]
owners: []
links: []
artifacts: []
relates: [goal-10]
blocked_by: []
blocks: [task-305, task-306, task-307, task-308, task-309, test-119, test-120, test-121]
refs: []
aliases: []
skills: []
created: 2026-06-06
updated: 2026-06-06
---
# Goal

Deliver the final CLI UX polish and temp-repo proof required before publishing
`mdkg@0.3.0`.

# Scope

- Docs example cleanup for the new work invocation flow.
- CLI help text and command matrix polish for SPEC/work commands.
- Packed temp-repo smoke coverage using only the installed CLI.
- Final dry-run package evidence, without publishing.

# Milestones

- `task-305`
- `task-306`
- `task-307`
- `task-308`
- `task-309`
- `test-119`
- `test-120`
- `test-121`

# Out of Scope

- No real npm publish.
- No tag or push.
- No public worker execution or public event/reducer/lease/materializer CLI.

# Risks

- Sparse help text can make the new public commands feel incomplete.
- Docs examples that mix trigger-created and manual orders can mislead users.

# Links / Artifacts

- `goal-10`
- `task-306`
- `task-307`
- `task-308`
- `test-119`
- `test-120`
- `test-121`

# Closeout Evidence

- `task-306` and `test-119` closed docs/help parity with focused command
  tests, `cli:check`, and the packed UX smoke.
- `task-307` and `test-120` added and passed `npm run smoke:cli-ux-polish`
  against a packaged install in `/private/tmp/mdkg-cli-ux-polish.TZ03Kz`.
- `task-308` and `test-121` passed the full readiness ladder through
  `npm run prepublishOnly`, pack dry-run, publish dry-run, and
  `git diff --check`.
- No real `npm publish`, tag, or push happened in this epic.
