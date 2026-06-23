---
name: {{skill_slug}}
description: {{description}}
tags: [stage:plan, writer:orchestrator]
version: 0.1.0
authors: [{{owner}}]
links: []
---

# Purpose

Describe the repeatable workflow and the durable outcome this skill produces.

## When To Use

- Trigger condition.

## Inputs

- Required context or artifacts.

## Outputs

- Result, patch, artifact, report, or handoff.

## Required Capabilities

- Capability needed by the worker or orchestrator.

## Resources Touched

- Files, repos, services, or mdkg nodes the skill may inspect or mutate.

## Steps

1. Ground in source and mdkg truth.
2. Execute the smallest deterministic workflow.
3. Record evidence.

## Validation Checks

- Command or review gate.

## Closeout Evidence

- Evidence required before work can be considered done.

## Failure Modes

- Known blocker or ambiguity.

## Safety Rules

- No secrets or unrelated broad mutation.

## Related SPECs

- SPEC refs.

## Projection Targets

- Runtime or agent config projections, if any.

## Open Questions

- Question to resolve before implementation.
