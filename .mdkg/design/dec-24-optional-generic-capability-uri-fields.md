---
id: dec-24
type: dec
title: optional generic capability URI fields
status: accepted
tags: [uri, capability, spec, protocol, generic-naming]
owners: []
links: []
artifacts: []
relates: [epic-41, edd-14]
refs: [dec-21]
aliases: [optional-capability-uri-fields, draft-uri-optional, generic-capability-uri]
created: 2026-06-04
updated: 2026-06-04
---
# Context

SPEC files should prepare for future workflow/runtime protocol resource and
capability language without pretending that any final registry or downstream
product protocol exists.

# Decision

SPEC templates may include optional generic capability or resource URI fields
such as `capability://repo.inspect`, `mdkg://capability/repo.inspect`, or
`resource://repository`. These fields are future-facing hints, not finalized
protocol semantics.

Public mdkg templates, decision records, and examples must not use downstream
product schemes or names as canonical mdkg naming. Downstream products may map
generic mdkg capability IDs into product-specific URIs in their own repos.

# Alternatives considered

- Require product-specific URIs in every SPEC immediately. Rejected because
  mdkg is generic open-source infrastructure and product protocols are
  downstream integrations.
- Require generic URI fields in every SPEC immediately. Rejected because simple
  mdkg-native capability IDs remain enough for many repos.

# Consequences

- Draft URI fields are encouraged where useful but not required.
- mdkg-native capability IDs remain valid without URI fields.
- Future protocol work can map from draft fields to finalized registry entries.
- Product-specific URI examples belong in downstream product repos, not the
  canonical mdkg template surface.

# Links / references

- `dec-21`
- `edd-14`
