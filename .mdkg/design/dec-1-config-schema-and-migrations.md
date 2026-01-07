---
id: dec-1
type: dec
title: config schema versioning and migrations
status: accepted
tags: [mdkg, config, schema, migrations]
created: 2026-01-06
updated: 2026-01-06
---

# Context

mdkg stores repo-wide settings in `.mdkg/config.json`. This file is “data” that must remain usable across versions of the CLI.

Without versioning, early changes would break existing repos and make upgrades painful.

# Decision

- `.mdkg/config.json` includes a required integer: `schema_version`
- mdkg includes deterministic migration functions to upgrade older schemas to the latest schema
- migration strategy is “stepwise”:
  - N → N+1 transforms only
  - repeat until latest
- migrations must be safe and transparent:
  - trivial renames may auto-migrate on load
  - behavior-changing migrations may require explicit `mdkg config migrate` in the future

# Alternatives considered

- No versioning (reject): breaks existing repos quickly
- “Loose” versioning without migrations (reject): pushes work to users and creates drift
- External migration frameworks (reject): violates zero runtime dependencies

# Consequences

- The CLI must maintain migration code for older versions
- Config shape becomes a stable contract and supports future tools (including life git ingestion)