---
tags: [mdkg-dev, docs, gitbook, command-contract]
owners: []
links: []
artifacts: []
relates: [goal-25, edd-24, edd-27]
blocked_by: [task-445]
blocks: [task-447, task-448, test-201]
refs: [archive://archive.mdkg-dev-planning-docs-2026-06-22]
context_refs: [prd-4, prd-5, edd-24, edd-27]
evidence_refs: []
aliases: []
skills: []
created: 2026-06-22
updated: 2026-06-22
id: epic-123
type: epic
title: GitBook docs source and generated command reference pipeline
status: todo
priority: 1
---
# Goal

Create repo-canonical GitBook docs source and generated command-reference drift checks.

# Scope

- Preserve or migrate existing `/docs` files deliberately.
- Add GitBook-ready docs navigation and source pages.
- Generate command-reference docs from the command contract.
- Add drift checks so CLI docs cannot silently diverge.

# Milestones

- `task-447`: docs source and GitBook ownership policy.
- `task-448`: generated command docs and drift checks.
- `test-201`: docs source and command-reference contract passes.

# Out of Scope

- No GitBook production configuration.
- No DNS or docs custom-domain claim.
- No manual full CLI reference duplication without generated drift protection.

# Risks

- Existing docs could be overwritten accidentally.
- Generated command docs could duplicate or conflict with `CLI_COMMAND_MATRIX.md`.
- Hosted-docs claims could outrun real GitBook configuration.

# Links / Artifacts

- archive://archive.mdkg-dev-planning-docs-2026-06-22
- parent: goal-25
