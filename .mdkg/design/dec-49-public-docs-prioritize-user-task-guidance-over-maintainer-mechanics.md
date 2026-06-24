---
id: dec-49
type: dec
title: public docs prioritize user task guidance over maintainer mechanics
status: accepted
tags: [mdkg-dev, docs, information-architecture]
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

Earlier docs exposed command-contract and launch-process mechanics too prominently for first-time users.

# Decision

Public docs prioritize user tasks, quickstarts, troubleshooting, and examples. Maintainer-facing mechanics remain available but clearly labeled as maintainer or integration reference material.

# Alternatives considered

- Keep internal mechanics prominent in public docs.
- Split user guidance from maintainer/integration references.

# Consequences

The CLI Reference should start with user-facing command selection, Command Contract should be maintainer-facing, Roadmap should be product-oriented, and Changelog should read as release notes.

# Links / references

- `goal-35`
- `task-556`
