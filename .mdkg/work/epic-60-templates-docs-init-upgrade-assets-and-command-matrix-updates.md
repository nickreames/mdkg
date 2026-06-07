---
id: epic-60
type: epic
title: templates docs init upgrade assets and command matrix updates
status: done
priority: 2
tags: [docs, templates, init, upgrade, command-matrix]
owners: []
links: []
artifacts: [README.md, CLI_COMMAND_MATRIX.md, AGENT_START.md, .mdkg/templates]
relates: [goal-9]
blocked_by: []
blocks: [task-287, task-298, task-299, test-116]
refs: [edd-15, dec-26, dec-27]
aliases: [0-3-0-docs-template-updates, command-matrix-spec-work-updates]
created: 2026-06-06
updated: 2026-06-06
---
# Goal

Keep user-facing docs, templates, init assets, upgrade assets, and help snapshots
aligned with the 0.3.0 command and file semantics.

# Acceptance Criteria

- Templates match validation behavior.
- Init and upgrade paths do not force SPEC adoption.
- Help snapshots and command matrix reflect new commands.

# Scope

Templates, docs, help snapshots, init assets, and upgrade assets.

# Milestones

- `task-287`
- `task-298`
- `task-299`
- `test-116`

# Out of Scope

- No downstream repo sync.

# Risks

- Docs can imply SPEC adoption is mandatory unless wording is precise.

# Links / Artifacts

- `goal-9`
- `CLI_COMMAND_MATRIX.md`

# Closeout

Completed by `task-287`, `task-298`, `task-299`, and `test-116`.

- README, command matrix, agent start docs, help snapshots, templates, init
  assets, and upgrade assets now describe optional SPEC, work trigger/order
  status/receipt verify, queue bridge, and capability linkage behavior.
- Init and upgrade smoke coverage proves `SPEC.md` adoption remains optional and
  existing repos without SPEC records stay compatible.
