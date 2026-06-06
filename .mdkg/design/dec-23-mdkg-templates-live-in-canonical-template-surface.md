---
id: dec-23
type: dec
title: mdkg templates live in canonical template surface
status: accepted
tags: [templates, spec, skill, seeded-assets]
owners: []
links: []
artifacts: [.mdkg/templates/specs, .mdkg/templates/skills]
relates: [epic-41, edd-14]
refs: [dec-21]
aliases: [canonical-mdkg-templates]
created: 2026-06-04
updated: 2026-06-04
---
# Context

Root and child repos need a consistent way to author Omni capability specs
without each repo forking local template packs.

# Decision

Canonical SPEC/SKILL authoring templates live in the mdkg repo template surface
and can later be published, upgraded, and consumed by root/child repos through
mdkg-owned sync and capability mechanisms.

# Alternatives considered

- Mirror templates into root first. Rejected because root would become a forked
  template authority.

# Consequences

- Root does not own a forked template set.
- Template improvements start in mdkg, then flow outward through a staged
  upgrade/sync pass.
- Template files must remain Markdown-first and validation-oriented.

# Links / references

- `dec-21`
- `edd-14`
