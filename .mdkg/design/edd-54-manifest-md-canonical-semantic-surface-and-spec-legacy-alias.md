---
id: edd-54
type: edd
title: MANIFEST.md canonical semantic surface and SPEC legacy alias
tags: [manifest, spec, compatibility, omni, semantic-files]
owners: []
links: []
artifacts: []
relates: []
refs: [edd-14, dec-26, task-276]
aliases: [manifest-md-spec-legacy-alias, manifest-semantic-file-rename, spec-md-compatibility-bridge, manifest.md, manifest.md-legacy-spec.md, spec.md-compatibility-alias]
created: 2026-06-25
updated: 2026-06-25
---
# Overview

Rename the Omni semantic file type currently represented by `SPEC.md` to
`MANIFEST.md`, while keeping `SPEC.md` as an explicit legacy alias for one
compatibility release.

The existing `SPEC.md` term is too easily interpreted as passive design prose.
The actual surface is a declarative runtime/capability manifest: role, runtime
mode, capabilities, requested dependencies, work contracts, update policy,
subagent topology, and startup intent. `MANIFEST.md` better communicates that
the document is runtime-consumable metadata without implying shell execution or
one-time provisioning.

# Architecture

The rename should be implemented as a compatibility bridge, not a broad
rewrite:

- parser/file-kind layer recognizes both `MANIFEST.md` and legacy `SPEC.md`;
- internal semantic model normalizes both names to the manifest concept;
- validation emits manifest-first diagnostics and legacy warnings;
- capability index/search records preserve source paths and expose bridge
  metadata;
- pack, graph refs, dependency validation, work trigger, bundles, subgraphs,
  and visibility use the normalized semantic kind;
- scaffolds/templates/docs/help/skills prefer `MANIFEST.md` going forward;
- legacy `SPEC.md` tests remain to prove existing repos are not broken.

# Data model

Canonical:

```text
room/MANIFEST.md
agents/<agent-id>/MANIFEST.md
work/<work-id>/WORK.md
orders/<order-id>/WORK_ORDER.md
receipts/<receipt-id>/RECEIPT.md
```

Recommended frontmatter:

- canonical manifest file: `MANIFEST.md` with `type: manifest`;
- legacy alias file: `SPEC.md` with `type: spec`;
- transitional bridge: `MANIFEST.md` with `type: spec` is accepted for one
  compatibility release, emits a deprecation warning, and normalizes internally
  to manifest semantics.

The normalized internal record should distinguish:

- `semantic_kind`: manifest;
- `source_basename`: `MANIFEST.md` or `SPEC.md`;
- `legacy`: true only for `SPEC.md` inputs or compatibility-only frontmatter;
- `deprecated`: true for user-facing legacy `SPEC.md` warnings;
- `compatibility_mode`: canonical, legacy, or transitional.

If both `MANIFEST.md` and `SPEC.md` exist in the same logical unit/directory,
validation must fail with an ambiguity error. The implementation must not choose
one silently.

# APIs / interfaces

Public/user-facing surfaces should prefer manifest language:

- generated docs and `CLI_COMMAND_MATRIX.md`;
- command help;
- README and docs site;
- `.mdkg/templates/default/*` and `.mdkg/templates/specs/*` successor names;
- `.mdkg/skills/author-mdkg-skill` and mirrors;
- capability search/show/list output.

Compatibility-facing surfaces keep aliases for one compatibility release:

- `mdkg manifest ...` is the canonical future command family;
- `mdkg spec ...` remains as a legacy command family for one compatibility
  release with manifest-first output and deprecation labeling;
- `kind: spec` output may remain as compatibility metadata if changing it would
  break consumers, but manifest-first output should be introduced alongside it;
- existing `SPEC.md` refs should resolve in graph refs, pack traversal,
  dependency validation, and work trigger behavior.

# Failure modes

- Existing repos with `SPEC.md` stop validating. Mitigation: preserve legacy
  fixtures and fail the release gate if they regress.
- New docs say `MANIFEST.md` but CLI still emits `SPEC.md`. Mitigation: source
  behavior tasks precede docs/tasks, and docs checks are phase-gated.
- Search discoverability regresses for punctuation-heavy queries. Mitigation:
  aliases include `manifest.md`, `legacy spec.md`, and `spec.md compatibility`.
- Duplicate `MANIFEST.md` and `SPEC.md` produce nondeterministic index records.
  Mitigation: explicit validation error before indexing is trusted.
- Work contracts or triggers still assume `SPEC.md`. Mitigation: dedicated work
  mirror and work trigger compatibility task/test.
- Generated example indexes drift. Mitigation: refresh derived indexes only
  after canonical behavior is tested.

# Observability

Implementation evidence should record:

- exact deprecation warning text;
- compatibility behavior matrix for file basename and `type`;
- source paths changed;
- focused test output for parser/index/pack/work trigger/scaffold behavior;
- full release gate output;
- capability search receipts for `MANIFEST.md legacy SPEC.md` and `spec.md`.

# Security / privacy

The rename must not change the trust boundary. Manifests remain declarative
metadata and contracts, not executable shell instructions. They must not store
raw secrets, provider credentials, private prompts, package-manager tokens,
ledger mutations, raw production payloads, or bulky runtime traces.

# Testing strategy

Test coverage is split across:

- canonical `MANIFEST.md` recognition and validation;
- legacy `SPEC.md` recognition and deprecation warning;
- duplicate canonical/legacy ambiguity;
- capability index/search/show/resolve compatibility;
- pack, graph refs, work trigger, bundle, subgraph, and visibility traversal;
- CLI scaffold/init/upgrade/template generation;
- docs/help/skill terminology;
- full regression and release gates.

# Rollout plan

1. Audit current source and generated surfaces.
2. Record compatibility warning and command-family policy.
3. Implement normalized parser/file-kind behavior.
4. Add validation diagnostics and duplicate ambiguity errors.
5. Preserve work mirror, pack, graph ref, subgraph, bundle, and visibility
   compatibility.
6. Switch new scaffolds/templates/docs/help/skills to manifest-first language.
7. Add canonical and legacy fixtures.
8. Run full local release gates and commit locally.
9. Write downstream runtime migration handoff for `RoomSpecRef` ->
   `RoomManifestRef`, `SpecDocument` -> `ManifestDocument`, and
   `SPEC-driven` -> `manifest-driven` language.
