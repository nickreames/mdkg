---
id: epic-70
type: epic
title: fix planning and repair receipts
status: done
priority: 1
tags: [fix, repair, receipts, 0-3-3]
owners: []
links: []
artifacts: []
relates: [goal-13]
blocked_by: []
blocks: [task-327, task-335, task-336, task-337, task-338, task-339, test-135, test-136, test-137]
refs: []
aliases: []
skills: []
created: 2026-06-09
updated: 2026-06-09
---
# Goal

Introduce dry-run-first fix planning and auditable repair receipts before mdkg
adds unsafe or magical repair commands.

# Scope

- Design `mdkg fix plan --json`.
- Define receipt-shaped outputs for index/cache, reference, and ID repair
  plans.
- Implement only plan-mode behavior at first: no file mutation, no apply
  command, and no automatic repairs.
- Add temp-repo proof that the command can inspect broken graph/index states
  without changing files.
- Keep apply behavior behind explicit later approval.

# Milestones

- `0.3.3`: fix planning foundation with dry-run receipts.

# Out of Scope

- Blind repair without a reviewable plan.

# Risks

- Repair output that is not deterministic enough for review.
- A repair command that feels safe because it is named `fix`, but mutates files
  before the plan contract is stable.
- Duplicate-id repair proposals that update ids without proving reference
  rewrites.

# Links / Artifacts

- `edd-19`
- `task-327`
- `task-335`
- `test-135`
- `task-336`
- `task-337`
- `task-338`
- `task-339`
- `test-136`
- `test-137`
- `chk-102`
- `chk-103`
- `chk-104`
- `chk-105`
- `chk-106`
- `chk-107`
- `chk-108`
- `chk-109`
- `chk-110`

# Closeout Evidence

- `mdkg fix plan --json` implemented as a read-only, receipt-shaped planning
  surface.
- Index/cache, graph-reference, and duplicate-id repair-family planners are
  covered by unit tests.
- `scripts/smoke-fix-plan.js` packs mdkg, installs it into a temp prefix, and
  proves the CLI can inspect broken temp-repo graph/index states without file
  mutation.
- `npm run prepublishOnly` passed with `smoke:fix-plan` included.
- No `fix apply` command is exposed.
