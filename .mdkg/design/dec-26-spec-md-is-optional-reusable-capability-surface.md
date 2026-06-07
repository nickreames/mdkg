---
id: dec-26
type: dec
title: SPEC.md is optional reusable capability surface
status: accepted
tags: [spec, capability, validation, optional, spec_kind]
owners: []
links: []
artifacts: [.mdkg/templates/default/spec.md, .mdkg/templates/specs]
relates: [goal-9, epic-54, epic-55]
refs: [edd-14, edd-15]
aliases: [spec-optional-capability-surface, optional-spec-contract, spec-kind-policy, spec_kind]
created: 2026-06-06
updated: 2026-06-06
---
# Context

Some downstream agents have used `SPEC.md` as a general planning or gap-register
document. That weakens the meaning of SPEC and makes capability discovery noisy.

# Decision

`SPEC.md` is optional. A repository with no SPEC files must still validate.

When present, `SPEC.md` must describe a reusable capability, API, CLI tool,
agent, runtime agent, tool, model, runtime image, integration, or project
service. It should be invocable, projectable, or executable by a runtime or
operator through a separate work contract or integration boundary.

Documentation-only artifacts belong in normal mdkg nodes such as EDDs, DECs,
checkpoints, tasks, tests, epics, or goals.

# Consequences

- 0.3.0 should add `spec_kind` for new SPEC files.
- Legacy agent-style SPECs remain compatible for 0.3.0 with diagnostics.
- Capability commands should surface concrete SPEC records when present.
- Validation should flag documentation-only SPEC misuse with actionable
  diagnostics rather than treating every markdown document as a SPEC.

# 0.3.0 SPEC Kind Contract

`spec_kind` is the explicit reusable capability family for new `SPEC.md`
records. The allowed 0.3.0 values are:

- `cli_tool`: a command-line tool or CLI command family.
- `api`: a service API or protocol surface.
- `agent`: an agent role or agent behavior contract.
- `runtime_agent`: an agent contract intended for projection into a runtime
  manifest or scheduler.
- `capability`: a named permission/capability boundary that can be requested,
  delegated, revoked, or audited.
- `tool`: a callable tool or integration operation surface.
- `model`: a model/provider capability contract.
- `runtime_image`: a runtime image, sandbox image, or execution environment
  contract.
- `integration`: a boundary between mdkg and another system, repo, service, or
  protocol.
- `project_service`: a repo or service capability contract for project-level
  orchestration.

Optional adoption remains part of the contract:

- A repo with no `SPEC.md` files is valid.
- Existing legacy SPEC records without `spec_kind` remain valid in 0.3.0 when
  they satisfy the older SPEC fields.
- New templates should include `spec_kind`; validation should provide a clear
  diagnostic when a SPEC looks like generic documentation instead of a reusable
  capability surface.

Documentation-only content must use normal mdkg node types instead of
`SPEC.md`:

- audits and current-state notes: `task`, `checkpoint`, or `edd`
- roadmaps and implementation plans: `epic`, `goal`, `edd`, or `prd`
- launch/go-no-go notes: `dec`, `task`, or `checkpoint`
- defect reports: `bug`
- validation contracts: `test`
- review loops: `feedback`, `dispute`, or `proposal`

Validation should route documentation-only misuse with actionable guidance, for
example: "This SPEC looks like a roadmap; use an EDD, epic, goal, or task unless
it defines an invocable reusable capability."

# Alternatives considered

- Require SPEC files in every repo. Rejected because mdkg should remain useful
  for small and legacy graphs.
- Treat SPEC as any durable documentation. Rejected because it would weaken
  capability discovery and projection.

# Links / references

- `edd-14`
- `edd-15`
- `goal-9`
