---
extends: base.MANIFEST.md
template_kind: capability
spec_kind: capability
---

# Capability Name

Stable mdkg capability id.

# Optional Capability URI

Optional generic URI: `capability://...`

Optional mdkg URI: `mdkg://capability/...`

# Resource Types

- Optional generic resource URI: `resource://...`
- Optional mdkg resource URI: `mdkg://resource/...`

# Allowed Principals

- Roles or agents allowed to use this capability.

# Required Policy Context

- Preconditions, policy refs, scopes, or approval state required before use.

# Delegation Rules

- Whether and how the capability can be delegated.

# Revocation Rules

- Conditions that revoke or disable the capability.

# Audit Events

- Receipts, summaries, or metrics created by use.

# Validation Checks

- Checks that prove capability use remains inside its authority and resource
  boundaries.
