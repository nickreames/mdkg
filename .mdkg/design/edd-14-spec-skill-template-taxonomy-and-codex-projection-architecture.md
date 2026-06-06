---
id: edd-14
type: edd
title: SPEC SKILL template taxonomy and Codex projection architecture
tags: [spec, skill, templates, codex, projection, capability-authoring, omni]
owners: []
links: []
artifacts: [.mdkg/templates/specs, .mdkg/templates/skills, .mdkg/skills/author-mdkg-skill/SKILL.md]
relates: [epic-39, epic-40, epic-41, epic-42, epic-43, epic-44, epic-45]
refs: [dec-21, dec-22, dec-23, dec-24, dec-25, edd-5, edd-7]
aliases: [spec-template-taxonomy, skill-template-taxonomy, codex-projection-architecture, skill-factory-backlog]
created: 2026-06-04
updated: 2026-06-04
---
# Overview

mdkg should provide a Markdown-first authoring foundation for Omni capabilities,
skills, specs, and future projection surfaces.

# Architecture

The durable hierarchy is:

- mdkg graph/design nodes for project memory and decisions.
- `SPEC.md` for durable capability, agent, tool, project, runtime, API, model,
  and integration contracts.
- `SKILL.md` for reusable workflow procedures.
- mdkg goals/tasks/tests for planned and verified work.
- `.codex/agents` TOML as a Codex projection surface.
- future OmniRuntime manifests and OmniTx/OmniPL resources as later projection
  and protocol surfaces.

# Template Taxonomy

The first canonical template family is:

- base SPEC.
- base SKILL.
- project SPEC.
- agent SPEC.
- tool SPEC.
- model SPEC.
- runtime image SPEC.
- capability SPEC.
- integration SPEC.
- API SPEC.
- OmniRuntime agent SPEC.

Every template should include identity, purpose, scope, non-goals, owners,
source mdkg nodes, resource boundaries, capabilities, inputs, outputs,
dependencies, security boundaries, validation checks, closeout evidence,
projection targets, versioning, change policy, and open questions where
applicable.

# Data model

The durable data model is Markdown-first: graph nodes carry decisions and work
state, `SPEC.md` carries durable capability contracts, `SKILL.md` carries
procedural workflow memory, and projection artifacts carry runtime-specific
adaptations.

# APIs / interfaces

The first interface is authoring guidance and templates, not a code exporter.
Future interfaces may include SPEC validation, projection export, and template
sync commands after the template taxonomy stabilizes.

# Codex Projection Rules

Codex projection validation should check:

- valid TOML.
- one agent per file.
- required fields: `name`, `description`, and `developer_instructions`.
- unique names.
- intentional-only built-in name collisions.
- no secrets, provider credentials, or local-only user auth state.
- every durable capability represented in a SPEC or flagged as repair work.

# Failure modes

- Projection files become canonical by accident.
- Weak SPECs become README-like prose without capabilities or checks.
- Templates grow too many one-off fields before a stable taxonomy exists.
- A skill-factory-agent generates low-quality skills before the standard is
  stable.

# Observability

This lane is validated through mdkg capability discovery, skill validation,
template coverage checks, and projection validation reports rather than runtime
telemetry.

# Security / privacy

Projection and template outputs must not include raw secrets, provider
credentials, local auth state, wallet/ledger state, production controls, or
host-specific user credentials. Opaque refs and policy descriptions are allowed.

# Future Exporter Design

A real `.codex/agents` exporter is deferred. The eventual exporter must link
generated TOML to source SPECs, detect manual drift, avoid overwriting local
edits silently, and enforce a no-secret export policy.

# Future Skill Factory

The skill-factory-agent is backlog. It may later detect repeated workflows,
propose new skills, author SKILL/SPEC files, generate tests, generate
projection adapters, run validation, publish skill packs, and track skill
reputation. It must not be built until templates and authoring standards are
stable.

# Testing strategy

Use `mdkg validate`, `mdkg skill validate author-mdkg-skill --json`, capability
searches, and template coverage review.

# Rollout plan

1. Harden mdkg source templates and seeded skill.
2. Commit/publish mdkg assets.
3. Root consumes the updated mdkg subgraph/package.
4. Downstream repos adopt SPEC/SKILL templates in a later sync pass.
