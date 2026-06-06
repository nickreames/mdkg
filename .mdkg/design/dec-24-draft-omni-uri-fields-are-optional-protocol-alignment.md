---
id: dec-24
type: dec
title: draft Omni URI fields are optional protocol alignment
status: accepted
tags: [omni, uri, capability, spec, protocol]
owners: []
links: []
artifacts: []
relates: [epic-41, edd-14]
refs: [dec-21]
aliases: [draft-omni-uri-optional]
created: 2026-06-04
updated: 2026-06-04
---
# Context

SPEC files should prepare for future OmniTx/OmniPL resource and capability
language without pretending that the final protocol registry exists.

# Decision

SPEC templates may include optional draft Omni URI fields such as
`omni://capability/repo.inspect` and `omni://resource/repository`. These fields
are future-facing hints, not finalized OmniTx semantics.

# Alternatives considered

- Require Omni URIs in every SPEC immediately. Rejected because the full
  OmniTx/OmniPL registry is not finalized.

# Consequences

- Draft URI fields are encouraged where useful but not required.
- mdkg-native capability IDs remain valid without Omni URI fields.
- Future protocol work can map from draft fields to finalized registry entries.

# Links / references

- `dec-21`
- `edd-14`
