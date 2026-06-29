---
extends: base.MANIFEST.md
template_kind: project
spec_kind: project_service
---

# Project Role

Describe the repo/service responsibility and non-authorities.

# Canonical Repo

- Local path:
- Remote:
- Default branch:

# Owned Capabilities

- Capability ids and optional generic capability URIs.

# Project-Agent Boundary

- Graph writes owned by this project.
- Read-only surfaces exposed to parent or sibling orchestrators.
- Queue/event surfaces accepted from external orchestrators.

# Single-Writer Policy

- Project writer key.
- Branch or graph write policy.
- Accepted receipt before external refresh.

# Integration Boundaries

- Upstream/downstream repos and APIs.

# Validation Checks

- Build, test, mdkg, security, and release gates.
