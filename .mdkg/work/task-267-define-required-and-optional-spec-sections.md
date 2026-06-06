---
id: task-267
type: task
title: define required and optional SPEC sections
status: done
priority: 1
epic: epic-46
parent: goal-8
tags: [spec, sections, contract]
owners: []
links: []
artifacts: []
relates: [goal-8, epic-46, test-99]
blocked_by: [task-266]
blocks: [task-268, task-269]
refs: [edd-14]
aliases: [spec-section-contract]
skills: [author-mdkg-skill]
created: 2026-06-06
updated: 2026-06-06
---
# Overview

Define the semantics for required and optional SPEC sections.

# Acceptance Criteria

- Required sections cover identity, purpose, authority boundary, resource
  boundary, capabilities, validation, evidence, security/privacy, versioning,
  and change policy.
- Conditional sections cover queue/event semantics, single-writer policy,
  projection targets, API shape, runtime image, model, tool, and integration
  details.
- Missing required sections have a future diagnostic policy.

# Test Plan

- `mdkg capability search "SPEC section contract" --json`
- `mdkg validate`

# Files Affected

- mdkg planning nodes only.

# Implementation Notes

- Define semantics before changing templates or validators.
- This pass recorded body-section semantics only. Frontmatter compatibility,
  template layout, examples, and validator implementation remain in later
  goal-8 nodes.

# Section Contract

This node defines the design contract for canonical mdkg `SPEC.md` bodies. It
does not change parser, template, scaffold, or validator source behavior.

## Required Sections

Required sections are always present in a canonical full SPEC. If a section is
not applicable, the section should still say `None`, `Read-only`, or
`Deferred`, so future validators and projection tools can distinguish an
intentional absence from an omission.

- `Identity`: stable id, title, version, status, owners, and source mdkg nodes.
  Frontmatter carries the machine-readable card; this section explains the
  durable human-facing identity and traceability.
- `Purpose`: the durable capability, agent, tool, project, runtime, API, model,
  integration, or resource contract being defined.
- `Authority Boundary`: decisions, mutations, delegations, and evidence
  acceptance that are allowed under the SPEC, plus explicit non-authorities.
- `Resource Boundary`: in-scope paths, graph nodes, databases, queues, services,
  runtime resources, and data classes, plus explicit out-of-scope resources.
- `Capabilities`: provided or requested capabilities, stable capability ids,
  constraints, and optional generic URI hints.
- `Inputs`: required input context, files, graph nodes, events, payloads, or
  operator parameters.
- `Outputs`: expected outputs, state changes, artifacts, receipts, projections,
  or reviewable summaries.
- `Receipts / Evidence`: attempt evidence, validation evidence, final receipts,
  and checkpoint/aggregation policy needed before accepting the work.
- `Dependencies`: required skills, specs, tools, models, runtime images,
  services, libraries, or graph/project state. `None` is valid when explicit.
- `Security / Privacy`: authority, secret, credential, local-auth, production
  control, personal-data, and mutation boundaries.
- `Validation Checks`: commands, reviews, deterministic probes, or static
  checks that prove the SPEC or its implementation is acceptable.
- `Closeout Evidence`: the concrete artifacts or command results required for a
  future agent or reviewer to close related work.
- `Projection Targets`: projection surfaces such as `.codex/agents`, runtime
  manifests, package exports, APIs, or protocol resources. `None` or
  `Deferred` is valid when no projection is intended.
- `Versioning`: compatibility expectations for consumers, templates,
  projections, and future migrations.
- `Change Policy`: who can change the SPEC, what review is required, and what
  checks must run after changes.
- `Open Questions`: unresolved decisions that block implementation, adoption,
  projection, or validation hardening. `None` is valid only after review.

## Conditional Sections

Conditional sections are required when the SPEC kind, frontmatter, or stated
scope implies the behavior. They may be omitted only when the required sections
make the non-applicability explicit.

- `Queue / Event Semantics`: required for asynchronous agents, materializers,
  local delivery queues, event streams, retry flows, ack/fail/dead-letter
  behavior, or idempotency-sensitive workflows.
- `Single-Writer Policy`: required for any SPEC that writes graph files,
  project DB state, runtime state, generated projections, archive sidecars, or
  package artifacts. Read-only SPECs should state the read-only writer boundary.
- `Agent Operation`: required for agent SPECs; covers role, triggers, allowed
  resources, forbidden actions, escalation, failure handling, and final receipt
  expectations.
- `API Shape`: required for API, protocol, RPC, HTTP, CLI command, or exported
  module surfaces; covers inputs, outputs, errors, compatibility, and examples
  at the contract level.
- `Runtime Image`: required for runtime image or execution-environment SPECs;
  covers base image, packages, entrypoints, resources, trust boundary, and
  reproducibility checks.
- `Model Contract`: required for model SPECs; covers model identity,
  capabilities, input/output constraints, safety boundaries, evaluation checks,
  and fallback policy.
- `Tool Contract`: required for tool SPECs; covers invocation, flags/options,
  side effects, output formats, failure modes, and capability indexing.
- `Integration Details`: required for external service or repo integrations;
  covers ownership, auth boundary, data flow, rate/availability assumptions,
  rollback, and privacy limits without storing secrets.
- `Project / Graph Contract`: required for project, graph, or subgraph agents;
  covers workspace ownership, mutation boundary, bundle/subgraph policy, and
  cross-repo handoff evidence.

## Optional Sections

Optional sections may be used when they improve clarity, but they should not
become required until a later task or validator contract promotes them.

- `Optional Resource URIs`: generic resource hints such as `resource://...` or
  `mdkg://resource/...`; downstream product-specific schemes are not canonical
  mdkg examples.
- `Examples`: small non-secret examples that clarify input/output shape.
- `Fixtures`: references to future committed fixtures or smoke inputs.
- `Migration Notes`: temporary guidance for older scaffolds or consumers.
- `Adoption Notes`: downstream or repo-local rollout guidance, kept generic in
  canonical mdkg templates.

## Future Diagnostic Policy

Future validation should classify section diagnostics by author intent and
template generation:

- Missing required section in a canonical full SPEC: `error`.
- Required section present but blank, placeholder-only, or contradictory:
  `error`.
- Required section explicitly marked `None`, `Read-only`, or `Deferred` where
  that is coherent for the section: accepted, with `info` for deferred work
  when useful.
- Missing conditional section when the SPEC kind clearly implies it:
  `error`.
- Missing conditional section when implication is weak or only inferred from
  prose: `warning` with a repair suggestion.
- Legacy minimal `SPEC.md` scaffold missing richer canonical sections:
  compatibility `warning` until a future migration task changes the scaffold
  contract.
- Extra non-canonical section: `info` unless it conflicts with a required or
  conditional section.
- Downstream product names, product-specific URI schemes, raw secrets,
  credentials, local auth state, wallet/ledger state, or production controls in
  canonical mdkg templates or generic SPEC examples: `error`.

Diagnostic output should include the missing or suspect heading, severity,
reason, repair hint, and whether the finding is gated by template kind,
frontmatter, or body evidence. This node only defines the policy; `task-271`
and `task-276` decide the command surface and parser details.

# Links / Artifacts

- `goal-8`
- `epic-46`
