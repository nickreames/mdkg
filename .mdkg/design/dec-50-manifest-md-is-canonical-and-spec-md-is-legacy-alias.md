---
id: dec-50
type: dec
title: MANIFEST.md is canonical and SPEC.md is legacy alias
status: accepted
tags: [manifest, spec, compatibility, naming, omni]
owners: []
links: []
artifacts: []
relates: []
refs: [edd-54, dec-26, edd-14]
aliases: [manifest-canonical-spec-legacy, manifest-md-canonical, spec-md-legacy-alias, manifest.md, manifest.md-legacy-spec.md, spec.md-compatibility-alias]
created: 2026-06-25
updated: 2026-06-25
---
# Context

`SPEC.md` has become ambiguous for AI coding agents. The current mdkg
semantics are not passive specification prose; the file represents a
runtime-consumable declarative surface for Omni agents, rooms, capabilities,
work contracts, dependency refs, update policy, subagent topology, and startup
intent.

Prior decisions made `SPEC.md` optional and reusable-capability oriented
instead of generic documentation. That improved validation, but the filename
still invites misuse.

# Decision

`MANIFEST.md` is the canonical filename and public term for this Omni semantic
file family.

`SPEC.md` remains a supported legacy alias for one compatibility release after
the canonical manifest release. Legacy support is explicit:
validation, indexing, search, pack, graph refs, dependency validation, work
trigger behavior, templates, docs, and skills must either support the legacy
path or intentionally mark it as deprecated with a clear migration message.

Canonical forward policy:

- new scaffolds emit `MANIFEST.md`;
- new canonical files use `type: manifest`;
- `SPEC.md` with `type: spec` remains valid legacy input;
- `MANIFEST.md` with transitional `type: spec` remains valid for one
  compatibility release, emits a deprecation warning, and normalizes internally
  to manifest semantics;
- duplicate `MANIFEST.md` and `SPEC.md` in the same logical Omni unit fail
  validation;
- warning text should say that `SPEC.md` is legacy/deprecated and recommend
  `MANIFEST.md`.

# Alternatives considered

- Keep `SPEC.md`: rejected because repeated agent confusion shows that the
  name still reads as passive design or generic planning documentation.
- Use `RUN.md`: rejected because it implies shell execution.
- Use `INIT.md`: rejected because it implies one-time provisioning.
- Use `CONFIG.md`: rejected because it is too broad and would weaken the
  reusable capability/runtime identity contract.
- Remove `SPEC.md` immediately: rejected because it would break existing repos
  and fixture coverage during a pre-v1 compatibility release.

# Consequences

- Public docs and help should become manifest-first.
- Source code can preserve compatibility aliases internally, but new user-facing
  concepts should not introduce fresh SPEC-first terminology.
- Tests must prove legacy `SPEC.md` remains valid for one compatibility
  release.
- Downstream runtime repos can later rename `RoomSpecRef` to
  `RoomManifestRef`, `SpecDocument` to `ManifestDocument`, and `SPEC-driven`
  startup language to `manifest-driven` startup after mdkg ships the bridge.

# Links / references

- `edd-54`
- `dec-26`
- `edd-14`
- `goal-37`
