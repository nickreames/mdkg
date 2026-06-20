---
id: epic-112
type: epic
title: goal-22 temp-repo proof and closeout
status: todo
priority: 1
tags: [e2e, prepublish, closeout]
owners: []
links: []
artifacts: []
relates: [goal-22]
blocked_by: [task-423]
blocks: [task-424, task-425, task-426, test-189]
refs: []
aliases: [integration-ux-e2e-closeout]
skills: []
created: 2026-06-17
updated: 2026-06-17
---
# Goal

Prove the full integration UX surface in a packed temp repo and close goal-22 with prepublish evidence.

# Scope

- Add packed temp-repo smokes for semantic refs, checkpoint templates, and handoff generation.
- Run the full goal required checks through pack and publish dry-run only.
- Write the external runtime integration handoff megaprompt after new surfaces are validated.

# Acceptance Criteria

- New smokes run from an installed package, not internal source imports.
- Final evidence records command outputs, warnings, temp paths, and dry-run package version.
- No real publish, tag, push, global install, or downstream repo mutation happens during closeout.

# Milestones

- Add packed temp-repo smokes.
- Run full prepublish and dry-run gates.
- Write external runtime handoff and close goal-22.

# Out of Scope

- Real npm publish, git tag, git push, global install, or downstream repo mutation.

# Risks

- Closeout must prove installed-package behavior, not only source-tree behavior.

# Related Work

- task-424
- task-425
- task-426
- test-189

# Links / Artifacts

- goal-22
