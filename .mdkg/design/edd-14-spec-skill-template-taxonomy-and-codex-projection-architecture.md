---
id: edd-14
type: edd
title: SPEC SKILL template taxonomy and agent projection architecture
tags: [spec, skill, templates, codex, projection, capability-authoring, agent-orchestration]
owners: []
links: []
artifacts: [.mdkg/templates/specs, .mdkg/templates/skills, .mdkg/skills/author-mdkg-skill/SKILL.md]
relates: [epic-39, epic-40, epic-41, epic-42, epic-43, epic-44, epic-45]
refs: [dec-21, dec-22, dec-23, dec-24, dec-25, edd-5, edd-7]
aliases: [spec-template-taxonomy, skill-template-taxonomy, spec-section-contract, spec-frontmatter-contract, spec-example-fixtures, spec-validation-diagnostics, spec-capability-index-discovery, projection-drift-policy, downstream-spec-adoption, agent-projection-architecture, codex-projection-architecture, runtime-agent-manifest, skill-factory-backlog]
created: 2026-06-04
updated: 2026-06-06
---
# Overview

mdkg should provide a Markdown-first authoring foundation for generic
capabilities, skills, specs, agent definitions, queue/event contracts, and
future projection surfaces.

# Architecture

The durable hierarchy is:

- mdkg graph/design nodes for project memory and decisions.
- `SPEC.md` for durable capability, agent, tool, project, runtime, API, model,
  and integration contracts.
- `SKILL.md` for reusable workflow procedures.
- mdkg goals/tasks/tests for planned and verified work.
- `.codex/agents` TOML as a Codex projection surface.
- future runtime agent manifest outputs and workflow/runtime protocol resources as
  later projection and protocol surfaces.
- downstream product integrations as consumers of mdkg-authored specs and
  skills, not as canonical mdkg naming.

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
- runtime agent SPEC.

Every template should include identity, purpose, authority boundary, resource
boundary, capabilities, queue/event semantics, single-writer policy,
receipts/evidence, projection targets, validation checks, security/privacy,
versioning, change policy, and open questions where applicable.

Optional capability URI fields may use generic schemes such as
`capability://repo.inspect` or `mdkg://capability/repo.inspect`. Product-specific
URI schemes are not canonical mdkg examples.

# Agent-Orchestration Vocabulary

An orchestrator agent is a coordinator that reads graph state, creates work
packs, routes queue events, watches partial receipts, and accepts final
receipts before durable closeout.

Subagents are scoped worker, reviewer, summarizer, project, or graph agents
with explicit authority boundaries. A subagent may only write inside its
declared single-writer boundary. Higher-level orchestrators may read lower
graphs for planning, but durable writes remain owned by the graph/project agent
for that graph.

The generic async lifecycle is:

```text
TriggerEvent -> AgentRun -> AttemptReceipt -> ValidationReceipt -> FinalReceipt
```

Partial receipts can inform progress, retries, and escalation. Final receipts
are required before committed checkpoint summaries, graph refresh decisions, or
accepted implementation closeout.

# Queue And Receipt Persistence

Live queue state belongs to mdkg project DB or local runtime state. Committed
mdkg graph state should store aggregate evidence, sealed checkpoints,
improvement proposals, and accepted graph evidence rather than every
operational queue row.

# SPEC Requirements

All durable SPEC templates should make these sections explicit:

- identity.
- purpose.
- authority boundary.
- resource boundary.
- capabilities.
- queue/event semantics.
- single-writer policy.
- receipts/evidence.
- projection targets.
- validation checks.
- security/privacy.
- versioning.
- change policy.

Agent-specific SPECs should additionally describe the role, trigger
conditions, allowed resources, forbidden actions, input context, output
contract, receipt/evidence contract, escalation behavior, failure modes, and
projection targets. The initial agent families are orchestrator agents, worker
agents, reviewer agents, summarizer agents, and graph/project agents.

# Generic Naming Requirements

mdkg is an open-source project. Public mdkg naming conventions, templates,
decision records, aliases, tags, and examples should avoid downstream product
names. Product-specific naming belongs in downstream consumer repos that adopt
mdkg templates.

# Data model

The durable data model is Markdown-first: graph nodes carry decisions and work
state, `SPEC.md` carries durable capability contracts, `SKILL.md` carries
procedural workflow memory, and projection artifacts carry runtime-specific
adaptations.

# APIs / interfaces

The first interface is authoring guidance and templates, not a code exporter.
Future interfaces may include SPEC validation, projection export, and template
sync commands after the template taxonomy stabilizes.

The next design lane should specify the SPEC validation diagnostics contract
before source implementation. Diagnostics should distinguish errors, warnings,
repair suggestions, and informational notes so authors know whether to fix,
defer, or intentionally accept a SPEC shape.

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

Projection drift policy belongs in the SPEC foundation before any exporter is
built. Durable behavior should be represented in mdkg/SPEC/SKILL source, while
projection files should be traceable, reviewable, and safe to regenerate or
repair.

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

Downstream SPEC adoption should remain a separate follow-up after mdkg accepts
or publishes the generic SPEC foundation. Parent/root repos may refresh to an
accepted local SHA or package release, but downstream product-specific SPECs
should not be canonical mdkg template content.
