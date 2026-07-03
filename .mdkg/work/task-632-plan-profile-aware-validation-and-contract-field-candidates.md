---
id: task-632
type: task
title: plan profile aware validation and contract field candidates
status: done
priority: 1
tags: [goal-48, validation, profiles]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [goal-48]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-07-02
updated: 2026-07-02
---
# Overview

Plan profile-aware validation for generic mdkg agent workflow files before any
schema or validator implementation starts.

Candidate terms include `contract_profile`, `receipt_kind`, and
`redaction_class`. This task must decide whether they become generic fields,
profile-only conventions, aliases for current fields, warning-only metadata, or
rejected names.

# Acceptance Criteria

- Candidate field names are evaluated against existing generic fields:
  `resource_profile`, WORK `kind`, WORK_ORDER `artifact_policy`, RECEIPT
  `redaction_policy`, and current ref/hash lists.
- Profile-aware validation behavior is specified for at least MANIFEST, WORK,
  WORK_ORDER, and RECEIPT.
- Warning-vs-error behavior is defined for unknown profiles, unknown receipt
  kinds, invalid redaction classes, missing required refs, raw-content markers,
  and runtime-only fields.
- Compatibility posture is explicit: optional additive field, strict error,
  warning-only, deprecated alias, or docs-only convention.
- Runtime-specific Omni Room policy is not accepted as generic mdkg behavior
  without a recorded decision.

# Files Affected

- Planning updates under `.mdkg/work/**`.
- Future implementation may require source/test/doc/template changes only after
  this plan is accepted in a later execution pass.

# Implementation Notes

- Start from the current validator enum sets and field descriptor rules in
  `src/graph/agent_file_types.ts`.
- Start from current raw-content warning behavior in `src/commands/validate.ts`
  and `mdkg work validate`.
- Avoid naming a future mdkg version; resolve the actual package version only
  during the later release execution pass.

# Test Plan

- `test-330`
- `mdkg validate --changed-only --json`

# Field And Validation Plan

## Candidate Field Decisions

| Candidate | Planning decision | Compatibility posture | Rationale |
| --- | --- | --- | --- |
| `contract_profile` | Accept as the preferred future field name for optional profile routing across MANIFEST/WORK/WORK_ORDER/RECEIPT, subject to later source implementation. | Optional additive field; unknown values warn in generic mode and can error in explicit profile/strict mode. | Avoids overloading `resource_profile` or WORK `kind`; avoids the ambiguity of bare `profile`. |
| `profile` | Reject as a generic mdkg field name. | Do not implement as alias in the first pass. | Too vague beside resource, runtime, validation, and org customization profiles. |
| `receipt_kind` | Accept as an optional future RECEIPT field for authority/evidence class. | Optional additive lower-token field; generic mode validates shape, profile mode validates allowed values. | Separates receipt authority class from `receipt_status` and `outcome`. |
| `redaction_class` | Accept only as an optional classifier distinct from `redaction_policy`. | Optional additive lower-token field; if present without `redaction_policy`, warn or error depending on profile strictness. | `redaction_policy` says how evidence is stored; `redaction_class` can say how sensitive/exportable the evidence is. |
| `validation_policy_ref` | Accept as an optional future portable/URI ref where policy source should be explicit. | Optional additive ref; validate shape generically. | Keeps policy content external/ref-based rather than embedded in workflow files. |
| `evidence_policy_ref` | Accept as an optional future portable/URI ref where evidence requirements should be explicit. | Optional additive ref; validate shape generically. | Supports refs-only evidence requirements without adding runtime-only schema. |

## Surface Placement

| Surface | Planned fields | Notes |
| --- | --- | --- |
| MANIFEST | `contract_profile`, `validation_policy_ref`, `evidence_policy_ref` | Profile router belongs naturally here because MANIFEST is the reusable capability or orchestration capability surface. |
| WORK | `contract_profile` only if the implementation decides cross-file profile coherence is needed. | WORK `kind` remains the capability category; do not require a profile marker for generic WORK files. |
| WORK_ORDER | `contract_profile`, `validation_policy_ref`, `evidence_policy_ref` as optional metadata. | Runtime task assignment, path rules, room ids, and queue semantics stay outside generic mdkg. |
| RECEIPT | `contract_profile`, `receipt_kind`, `redaction_class`, `validation_policy_ref`, `evidence_policy_ref` as optional metadata. | `redaction_policy` remains the required or strongly recommended handling field for receipt verification. |

## Generic Versus Profile-Aware Severity

| Condition | Generic `mdkg validate` / `mdkg work validate` | Future explicit profile mode or strict doctor | Runtime boundary |
| --- | --- | --- | --- |
| Unknown `contract_profile` | Warning if field shape is valid; no global enum lock. | Error when `--profile <name>` or config declares allowed profiles. | Runtime may hard-fail its own profile before mdkg release. |
| Bare `profile` field | Warning as unsupported/ambiguous if unknown-field diagnostics are added; otherwise docs-only rejection. | Error in strict profile mode. | Runtime should avoid relying on it. |
| Unknown `receipt_kind` | Warning if present and lower-token shaped. | Error when profile declares an allowed receipt-kind set. | Runtime final receipt validation remains runtime-owned. |
| Invalid `redaction_class` shape | Error for malformed value; warning for unknown value. | Error for unknown or incompatible class. | Runtime may apply stricter class policy. |
| `redaction_class` without `redaction_policy` | Warning. | Error. | Runtime can hard-fail final receipts. |
| Raw secret/prompt/payload markers | Preserve current warnings by default. | Profile/strict mode may escalate selected markers to errors. | Runtime should hard-fail raw secret/prompt/payload evidence independently until released behavior exists. |
| Missing required refs or invalid hashes | Preserve current errors. | Errors. | No runtime override. |
| Runtime-only fields in generic workflow files | Warning or docs-only guidance if unknown-field diagnostics exist. | Error for profile mode unless explicitly allowed. | Runtime owns the field definitions and parser semantics. |
| Missing receipt evidence | Current `work receipt verify` error when no artifact/proof/attestation/hash evidence exists. | Error. | Runtime final receipt may require additional evidence. |

## Validator Implementation Shape For Later Execution

1. Add optional field descriptors to `src/graph/agent_file_types.ts` without
   making existing files invalid.
2. Keep generic validation shape-based unless a profile allowlist is explicitly
   configured.
3. Add profile-aware diagnostics with stable ids so `validate --summary` and
   `work validate --json` can report warning categories without raw content.
4. Add focused fixtures for valid generic optional fields, unknown profile
   warnings, profile strict errors, raw marker escalation, receipt-kind
   compatibility, and redaction class policy.
5. Only after validators pass, add CLI/scaffold/docs behavior in a separate
   implementation task.

## Non-Accepted Behavior

- Do not make `contract_profile` required for generic MANIFEST/WORK/WORK_ORDER
  or RECEIPT files.
- Do not replace `resource_profile`, WORK `kind`, WORK_ORDER
  `artifact_policy`, or RECEIPT `redaction_policy`.
- Do not globalize Omni Room-specific values as mdkg defaults.
- Do not hardcode a future package version or publish target in validator code,
  fixtures, or docs.

# Links / Artifacts

- `goal-48`
- `test-330`
