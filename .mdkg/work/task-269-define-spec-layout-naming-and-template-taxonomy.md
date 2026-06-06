---
id: task-269
type: task
title: define SPEC layout naming and template taxonomy
status: done
priority: 1
epic: epic-47
parent: goal-8
tags: [spec, layout, naming, templates]
owners: []
links: []
artifacts: [.mdkg/templates/specs]
relates: [goal-8, epic-47, test-100]
blocked_by: [task-267]
blocks: [task-270]
refs: [edd-14, dec-23, dec-24]
aliases: [spec-template-taxonomy]
skills: [author-mdkg-skill]
created: 2026-06-06
updated: 2026-06-06
---
# Overview

Define canonical template locations, filenames, headings, and naming rules.

# Acceptance Criteria

- Canonical mdkg templates remain under `.mdkg/templates/specs`.
- Default node template behavior is reconciled with specialized SPEC templates.
- Template names remain generic.
- Optional capability URI examples use generic schemes only.

# Test Plan

- `mdkg capability search "SPEC template taxonomy" --json`
- Product-name grep over template paths and contents.

# Files Affected

- mdkg planning nodes only.

# Implementation Notes

- Keep public template names generic and open-source friendly.
- This pass defines layout, naming, and taxonomy only. `task-270` owns the
  detailed positive/negative fixture matrix.

# Template Taxonomy

Canonical mdkg SPEC authoring templates remain under `.mdkg/templates/specs`.
The active `mdkg new spec` scaffold and current template schema remain under
`.mdkg/templates/default/spec.md` until a later implementation task promotes or
reconciles the richer family.

## Canonical Family

The initial canonical SPEC family is:

- `base.SPEC.md`: shared frontmatter and body-section contract.
- `project.SPEC.md`: repository, service, graph, or project responsibility.
- `agent.SPEC.md`: durable agent role and trigger contract.
- `runtime-agent.SPEC.md`: runtime-executed agent, queue, sandbox, lease,
  receipt, and retry contract.
- `api.SPEC.md`: API, RPC, protocol, or service surface contract.
- `capability.SPEC.md`: durable capability and policy contract.
- `tool.SPEC.md`: CLI, service, or callable tool contract.
- `model.SPEC.md`: model identity, capability, policy, and evaluation contract.
- `runtime-image.SPEC.md`: image, sandbox, resource, and reproducibility
  contract.
- `integration.SPEC.md`: external system, repo, service, or protocol
  integration boundary.

## Naming Rules

- Template filenames use lower-case generic names plus `.SPEC.md`.
- Multi-word filenames use kebab case, such as `runtime-agent.SPEC.md`.
- `template_kind` values use lower snake case where needed by metadata, such
  as `runtime_agent` and `runtime_image`.
- Canonical names must stay generic and product-neutral.
- Optional URI examples use generic schemes only, such as `capability://...`,
  `resource://...`, `mdkg://capability/...`, and `mdkg://resource/...`.
- Downstream product names, product-specific URI schemes, local user paths,
  auth state, provider credentials, wallet/ledger state, and production
  controls are not allowed in canonical mdkg templates or examples.

## Layout Rules

- `base.SPEC.md` owns the canonical frontmatter shape and full body-section
  order defined by `task-267` and `task-268`.
- Specialized templates extend the base contract with kind-specific sections;
  they should not replace required base sections.
- `runtime-agent.SPEC.md` may extend `agent.SPEC.md`; other first-family
  specialized templates extend `base.SPEC.md`.
- Specialized sections should map to the conditional contracts from
  `task-267`: agent operation, queue/event semantics, single-writer policy,
  API shape, runtime image, model contract, tool contract, integration details,
  and project/graph contract.
- Example and fixture references may appear in templates, but concrete fixture
  coverage belongs to `task-270`.

## Default Scaffold Reconciliation

Current behavior:

- `.mdkg/templates/default/spec.md` is the active scaffold used by
  `mdkg new spec`.
- The default scaffold also defines the current closed template schema for SPEC
  frontmatter validation.
- `.mdkg/templates/specs/*.SPEC.md` is a richer design/authoring family; it is
  not expanded by the current scaffold loader.

Future promotion rules:

- Do not make specialized templates active implicitly; add an explicit
  implementation path when ready.
- Reconcile `base.SPEC.md` to use the current scaffold placeholder `{{id}}`
  before promotion, unless a migration changes the replacement contract.
- Preserve current required frontmatter keys and enum values unless a migration
  task changes them deliberately.
- Keep the minimal default scaffold valid during the compatibility window.
- Seeded init assets should include promoted templates only after template
  coverage and validation diagnostics are decision-complete.

## Coverage Policy

The taxonomy is complete when every family member has:

- a generic filename and `template_kind`;
- a clear base or specialized extension relationship;
- required frontmatter compatibility;
- required and conditional body-section placement;
- no product-specific naming;
- a corresponding positive and negative fixture plan from `task-270`.

# Links / Artifacts

- `goal-8`
- `epic-47`
