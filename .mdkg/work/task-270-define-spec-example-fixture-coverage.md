---
id: task-270
type: task
title: define SPEC example fixture coverage
status: done
priority: 1
epic: epic-47
parent: goal-8
tags: [spec, examples, fixtures]
owners: []
links: []
artifacts: []
relates: [goal-8, epic-47, test-100]
blocked_by: [task-269]
blocks: [task-271]
refs: [edd-14]
aliases: [spec-example-fixtures]
skills: [author-mdkg-skill]
created: 2026-06-06
updated: 2026-06-06
---
# Overview

Define the example SPEC fixture set needed before implementation.

# Acceptance Criteria

- Example fixtures are required for project, agent, runtime-agent, API,
  capability, tool, model, runtime image, and integration specs.
- Fixtures include positive and negative examples.
- Fixtures are generic and safe to publish.

# Test Plan

- Future template coverage check includes fixture families.

# Files Affected

- mdkg planning nodes only.

# Implementation Notes

- Specify fixture coverage; do not add fixture files in this planning task.

# Fixture Coverage Contract

Future SPEC examples should live with the existing test fixture convention under
`tests/fixtures/`. This planning node does not add files, but it defines the
minimum corpus future implementation should create before validators or template
promotion rely on the richer SPEC family.

Preferred future layout:

- `tests/fixtures/specs/valid/<kind>/SPEC.md`
- `tests/fixtures/specs/invalid/<case>/SPEC.md`
- optional shared support files under `tests/fixtures/specs/support/`

The current `tests/fixtures/agent` corpus remains valid agent-workflow coverage.
New SPEC fixtures should not replace it; they should add focused coverage for
the richer SPEC template taxonomy.

## Positive Fixture Families

Each positive fixture must be generic, publish-safe, validation-clean, and
traceable to one template family from `task-269`.

- `project`: project/graph responsibility, canonical repo metadata, owned
  capabilities, project-agent boundary, single-writer policy, and validation
  checks.
- `agent`: durable agent role, trigger conditions, allowed resources,
  forbidden actions, input context, output contract, and final receipt
  expectations.
- `runtime-agent`: queue ownership, trigger kinds, sandbox requirements,
  opaque secret-grant refs, single-writer keys, receipt lifecycle, cancellation,
  retry, and telemetry policy.
- `api`: method shape, input/output payloads, idempotency, auth boundary,
  errors, versioning, and conformance checks.
- `capability`: stable capability id, optional generic URI hints, resource
  types, allowed principals, policy context, delegation, revocation, and audit
  events.
- `tool`: tool identity, invocation surface, allowed operations, policy context,
  failure modes, and audit events.
- `model`: model identity, capability boundaries, policy context, evaluation
  checks, and fallback notes.
- `runtime-image`: image identity, digest policy, resource profile, secrets and
  mounts boundary, and conformance checks.
- `integration`: integration boundary, data flow, failure/retry policy,
  security boundary, and conformance checks.

An optional `base` fixture may exist as a shared minimal canonical full-SPEC
example, but the required user-facing coverage is the nine specialized families
above.

## Negative Fixture Families

Negative fixtures should prove that future diagnostics catch unsafe, ambiguous,
or non-canonical shapes. The minimum negative set:

- missing required section;
- blank or placeholder-only required section;
- missing conditional section implied by template kind;
- invalid `role`, `runtime_mode`, or `update_policy`;
- unknown frontmatter key under canonical mdkg templates;
- product-specific frontmatter extension in canonical mdkg;
- product-specific URI scheme in a canonical template/example;
- raw secret, credential, local auth state, wallet/ledger state, production
  control, or host-specific user path;
- invalid filename or misplaced `SPEC.md`;
- invalid capability id or ref shape;
- runtime-agent fixture without queue/receipt/retry semantics;
- API fixture without error or idempotency policy;
- runtime-image fixture without digest or reproducibility policy;
- integration fixture without data-flow or auth boundary.

Compatibility fixtures may also cover the current minimal default `SPEC.md`
scaffold. Those should assert compatibility warnings, not hard failures, until
a later migration task changes the scaffold contract.

## Safety And Naming Rules

- Fixtures must be deterministic and small.
- Fixtures must use generic ids such as `project.example`, `agent.example`, or
  `capability.example-inspect`.
- Optional URI examples must use generic schemes such as `capability://...`,
  `resource://...`, `mdkg://capability/...`, or `mdkg://resource/...`.
- Fixture text must not include downstream product names, product-specific URI
  schemes, real credentials, live endpoints, raw tokens, personal data, or
  local-only user paths.
- Fixture failures should be single-purpose where possible so diagnostic tests
  can assert stable severity and repair hints.

## Future Validation Coverage

Future template coverage checks should prove:

- every required positive family exists;
- every required negative family exists;
- every positive fixture validates;
- every negative fixture fails or warns with the intended severity;
- capability search can discover generic SPEC concepts after indexing;
- fixture filenames and paths remain generic;
- fixture contents remain publish-safe.

# Links / Artifacts

- `goal-8`
- `epic-47`
