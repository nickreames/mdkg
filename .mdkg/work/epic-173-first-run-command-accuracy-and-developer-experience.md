---
id: epic-173
type: epic
title: first-run command accuracy and developer experience
status: todo
priority: 1
tags: [mdkg-dev, dx, commands]
owners: []
links: []
artifacts: []
relates: [goal-34, task-535, task-537, test-259, test-261]
blocked_by: []
blocks: []
refs: [archive://archive.mdkg-dev-preview-audit-pass-4-2026-06-24, edd-43]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-24
updated: 2026-06-24
---
# Goal

Protect first-run developer trust by fixing agent-readable docs and validating public command examples.

# Scope

`llms.txt`, canonical agent path, command-example scan/check, placeholder conventions, copy-safe code blocks, and command-contract alignment.

# Milestones

- `llms.txt` preserves readable line breaks.
- Public commands are validated or marked illustrative.
- Command-check automation lands in docs gates.

# Out of Scope

Executing external-service commands or broad CLI surface redesign.

# Risks

- Over-validating illustrative examples.
- Running mutating commands while checking docs.

# Links / Artifacts

- `task-535`
- `task-537`
- `test-259`
- `test-261`
