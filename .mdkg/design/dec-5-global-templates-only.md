---
id: dec-5
type: dec
title: global templates only (root templates)
status: accepted
tags: [mdkg, templates]
created: 2026-01-06
updated: 2026-01-06
---

# Context

Per-workspace template overrides add complexity. v1 should remain simple and consistent.

We still want strong templating to support agent workflows.

# Decision

- templates are global only and live at `.mdkg/templates/<set>/<type>.md`
- workspace template overrides are disabled in v1
- template sets are supported (default/minimal/verbose)
- templates are filled via token substitution only (no template engine dependencies)

# Alternatives considered

- workspace overrides (defer): revisit when v1 is stable
- external template engines (reject): violates zero dependency constraint

# Consequences

- consistent document structure across the repo
- easier implementation and validation
- specialization happens via fields/tags/workspace separation, not templates