---
id: edd-15
type: edd
title: optional SPEC and work invocation foundation for mdkg 0.3.0
tags: [spec, spec_kind, work, work-order, receipt, invocation, capability-index, release, npm]
owners: []
links: []
artifacts: [.mdkg/templates/default/spec.md, .mdkg/templates/default/work.md, .mdkg/templates/default/work_order.md, .mdkg/templates/default/receipt.md]
relates: [goal-9, epic-53, epic-54, epic-55, epic-56, epic-57, epic-58, epic-59, epic-60, epic-61, epic-62]
refs: [edd-14, dec-26, dec-27, dec-28, epic-25, epic-26]
aliases: [optional-spec-work-invocation-foundation, spec-work-invocation-foundation, mdkg-0-3-0-foundation, executable-spec-foundation, work-trigger-foundation, spec_kind]
created: 2026-06-06
updated: 2026-06-06
---
# Overview

mdkg 0.3.0 should make `SPEC.md` optional but useful as a reusable capability
surface, then connect that surface to semantic work contracts, concrete work
orders, and final receipts.

The release should not make mdkg a runtime. mdkg remains deterministic project
memory, local graph tooling, project DB delivery infrastructure, and committed
semantic mirrors. External runtimes, agents, services, and humans execute the
work and report receipts.

# Architecture

The implementation should extend existing graph parsing, validation,
capability indexing, work lifecycle commands, and project DB queue helpers
rather than adding a separate runtime subsystem.

# Doctrine

- Repositories without `SPEC.md` remain valid.
- A present `SPEC.md` describes something reusable and invocable: a CLI tool,
  API, agent, runtime agent, capability, tool, model, runtime image,
  integration, or project service.
- Documentation-only artifacts such as gap registers, checkpoints, audits,
  roadmaps, go/no-go notes, planning notes, and launch checklists are not
  `SPEC.md` documents.
- `WORK.md` defines a reusable work contract for a capability.
- `WORK_ORDER.md` records one invocation request as a semantic mirror.
- `RECEIPT.md` records final outcome and evidence as a semantic mirror.
- Project DB queues can deliver local work-order triggers, but queue rows are
  delivery state, not canonical event history.

# Data model

`SPEC.md` records reusable capability metadata. `WORK.md` records reusable work
contracts. `WORK_ORDER.md` records one invocation request. `RECEIPT.md` records
final evidence. Project DB queue rows optionally deliver work-order refs.

New 0.3.0 SPEC records should include `spec_kind`. Allowed values are
`cli_tool`, `api`, `agent`, `runtime_agent`, `capability`, `tool`, `model`,
`runtime_image`, `integration`, and `project_service`. Legacy SPEC files
without `spec_kind` remain valid for compatibility when they satisfy existing
SPEC validation rules.

Documentation-only records are not SPECs. Audits, gap registers, go/no-go
notes, roadmaps, plans, and launch checklists belong in normal mdkg node types
such as task, test, epic, goal, checkpoint, EDD, PRD, or DEC.

# APIs / interfaces

Target interfaces are `mdkg spec list/show/validate`,
`mdkg work trigger`, `mdkg work order status`, and
`mdkg work receipt verify`.

# Target Flow

```text
SPEC.md
  -> WORK.md
  -> mdkg work trigger
  -> WORK_ORDER.md
  -> optional project DB queue enqueue
  -> external worker/runtime
  -> RECEIPT.md
  -> verification and graph closeout
```

# 0.3.0 Boundaries

`0.3.0` is justified only if the package ships concrete SPEC capability
indexing and work invocation helpers, not just template changes.

The package is publish-ready only after local validation, packed-package smoke,
`npm pack --dry-run --json`, and `npm publish --dry-run` pass. The actual npm
publish remains a separate explicit action.

# Security

SPEC, WORK, ORDER, and RECEIPT files must not contain secrets, credentials,
raw auth headers, live payment state, ledger mutations, marketplace inventory,
or canonical production runtime state.

Opaque refs, hashes, artifact refs, archive refs, and redacted cost/proof refs
are acceptable semantic-mirror content.

# Failure modes

- A documentation-only SPEC is accepted as a capability.
- A work order is mistaken for canonical execution state.
- A queue bridge enqueues work without stable payload hashing.
- A receipt stores secret or production state instead of refs.

# Observability

Commands should emit deterministic JSON receipts and capability index metadata
that make trigger/order/receipt state inspectable without loading full graph
bodies.

# Security / privacy

No raw secrets, credentials, raw auth headers, live payment state, ledger state,
marketplace state, or production runtime state may be stored in SPEC, WORK,
ORDER, or RECEIPT mirrors.

# Testing strategy

Use unit fixtures, command tests, packed temp-repo smoke, project DB queue smoke,
capability smoke, package dry-run, and publish dry-run gates.

# Rollout plan

Ship as 0.3.0 only after local prepublish and npm dry-run proof. Actual publish
is a separate explicit action.
