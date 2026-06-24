---
id: dec-47
type: dec
title: GitHub repo metadata changes are handoff copy only
status: accepted
tags: [mdkg-dev, github, launch-boundary]
owners: []
links: []
artifacts: [archive://archive.mdkg-dev-preview-audit-pass-5-2026-06-24]
relates: []
refs: [archive://archive.mdkg-dev-preview-audit-pass-5-2026-06-24]
aliases: []
created: 2026-06-24
updated: 2026-06-24
---
# Context

The public repository metadata may need better copy before launch, but mutating GitHub settings is a public-side-effect action.

# Decision

Goal-35 may prepare copy-ready GitHub metadata handoff text, but it must not mutate GitHub repository settings.

# Alternatives considered

- Mutate GitHub settings during the implementation pass.
- Prepare handoff copy and leave public settings changes to an explicit launch action.

# Consequences

Final closeout should include metadata handoff copy if needed and confirm no GitHub settings changes occurred.

# Links / references

- `goal-35`
- `task-561`
