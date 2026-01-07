---
id: dec-2
type: dec
title: root-only operation and registered workspaces (no discovery)
status: accepted
tags: [mdkg, workspaces, root, indexing]
created: 2026-01-06
updated: 2026-01-06
---

# Context

We want deterministic behavior and fast operation. Runtime “workspace discovery” adds complexity and uncertainty.

We also want support for multiple workspaces (subdirectories) with docs near code, indexed globally.

# Decision

- mdkg is run at the repo root by default (or via `--root`)
- `.mdkg/config.json` defines a workspace registry
- only registered workspaces are indexed and searched
- workspaces store docs near code at `<workspace>/.mdkg/...`
- the root index contains the authoritative global index across workspaces

# Alternatives considered

- Walk up directories from cwd to find nearest workspace (reject): nondeterministic for global operations
- Implicit discovery of workspaces by scanning for `.mdkg` folders (reject): surprises users and slows commands

# Consequences

- Users must add workspaces explicitly via config/CLI
- Indexing is predictable and bounded to known directories
- All commands can default to global behavior with easy filtering