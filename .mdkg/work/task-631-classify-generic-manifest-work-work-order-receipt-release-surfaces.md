---
id: task-631
type: task
title: classify generic MANIFEST WORK WORK_ORDER RECEIPT release surfaces
status: done
priority: 1
tags: [goal-48, classification, workflow-files]
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

Classify release-candidate work across the generic agent workflow surfaces:
MANIFEST, WORK, WORK_ORDER, and RECEIPT.

The output should decide which candidate changes belong to generic mdkg
template/schema/validator/CLI/scaffold/docs behavior, which belong only to an
Omni Room profile, which are runtime consumer responsibilities, and which are
out of scope.

# Acceptance Criteria

- MANIFEST candidates are classified across current `spec_kind`, `role`,
  `runtime_mode`, `resource_profile`, `work_contracts`, capability refs, and
  any proposed `contract_profile` support.
- WORK candidates are classified across current `agent_id`, `kind`,
  capabilities, inputs/outputs, receipt requirements, and profile coupling.
- WORK_ORDER candidates are classified across `work_id`, `requester`,
  trigger/request refs, hashes, input/queue refs, requested outputs,
  constraints, and artifact policy.
- RECEIPT candidates are classified across `work_order_id`, receipt status,
  outcome, cost/proof/attestation refs, evidence hashes, redaction policy, and
  any proposed `receipt_kind` / `redaction_class` support.
- CLI, scaffold, docs, generated references, smoke tests, and release notes are
  classified as generic, profile-specific, or deferred.
- Seed/default template edits remain explicitly gated rather than assumed.

# Files Affected

- Planning updates under `.mdkg/work/**`.
- Future implementation, if approved separately, may touch source, tests,
  docs, generated references, templates, and init assets only after this
  classification is accepted.

# Implementation Notes

- Use a table or checklist that includes at least these columns: surface,
  current behavior, candidate change, owner, compatibility risk, validator
  impact, CLI/scaffold impact, docs impact, tests, and release gate.
- Classify `assets/init/skills/default` and seed/default templates as their own
  blast-radius row.

# Test Plan

- `mdkg validate --changed-only --json`
- Review the matrix against `task-633` inventory and the root boundary handoff.

# Classification Result

## Planning Decisions

- Use `contract_profile` as the planning name if a generic profile field is
  implemented; reject bare `profile` because it is too ambiguous beside
  `resource_profile`, WORK `kind`, and runtime-specific profiles.
- Treat `contract_profile`, `receipt_kind`, and `redaction_class` as optional
  additive release candidates, not required fields and not accepted source
  schema until a later implementation goal changes validators/templates/tests.
- Preserve existing generic fields. `resource_profile`, WORK `kind`,
  WORK_ORDER `artifact_policy`, and RECEIPT `redaction_policy` remain the
  canonical current fields.
- Keep Omni Room execution fields runtime-owned. Generic mdkg may validate
  portable refs, URI refs, hash refs, and profile markers, but must not own
  runtime queue drain, final receipt authority, sandbox/vault provider
  semantics, backend billing/tenant/credit authority, or root refresh policy.
- Keep seed/default asset edits gated. A future execution goal may propose them,
  but only after source behavior and upgrade preservation tests pass.

## Release Surface Matrix

| Surface | Current behavior | Candidate change | Owner | Compatibility risk | Validator impact | CLI/scaffold impact | Docs impact | Tests | Release gate |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| MANIFEST | `spec_kind`, `role`, `runtime_mode`, `work_contracts`, dependency refs, `resource_profile`, `update_policy`. | Optional `contract_profile`; optional `validation_policy_ref`; optional `evidence_policy_ref`. | Generic mdkg for field syntax; runtime owns Omni Room values. | Low if optional and lower-token/ref-only; medium if strict enum is global. | Add optional field validation and profile-aware warnings; no required-field change. | `mdkg new manifest` may support optional flags later; default template can stay generic until explicitly approved. | README, command matrix, generated docs, docs site, changelog. | Valid/invalid MANIFEST fixtures for optional profile/ref fields and unknown profile behavior. | Build, validator tests, CLI snapshot/check, docs check, pack dry-run. |
| WORK | `agent_id`, `kind`, pricing, capabilities, dependency refs, `inputs`, `outputs`, `receipt_required`. | Optional `contract_profile` only if cross-file profile coherence requires it. Do not overload `kind`. | Generic mdkg for optional field; runtime owns profile semantics. | Medium: WORK `kind` already carries capability meaning, so docs must prevent confusion. | Optional lower-token profile validation plus consistency checks only under profile mode. | `mdkg work contract new` may later accept `--contract-profile`; no change in this planning pass. | Explicit explanation that WORK describes invocable capability, not room objective authority. | WORK fixtures for profile marker and existing invocation-anchor checks. | Existing work lifecycle smoke plus new focused fixtures. |
| WORK_ORDER | `work_id`, `work_version`, requester, status, request/trigger refs, payload hash, input/queue refs, requested outputs, constraints, `artifact_policy`. | Optional `contract_profile`; optional policy refs; keep runtime task fields out. | Generic mdkg for mirror metadata; runtime owns queue/execution semantics. | Low to medium: optional metadata is safe, but runtime-only fields must not appear as generic examples. | Validate profile/ref shape and continue current hash/ref checks. | `mdkg work order new|update` may later accept profile/policy ref flags. | Explain queue refs are delivery pointers, not canonical runtime state. | WORK_ORDER fixtures for profile, policy refs, raw payload marker warnings. | Work validate and work trigger/order status smokes. |
| RECEIPT | `work_order_id`, `receipt_status`, `outcome`, `cost_ref`, `redaction_policy`, proof/attestation refs, evidence/input/output hashes. | Optional `receipt_kind`; optional `redaction_class`; optional policy refs. `redaction_class` must not replace `redaction_policy`. | Generic mdkg for metadata and evidence shape; runtime owns final authority semantics. | Medium: `receipt_kind` can imply authority if values are poorly named. Keep generic lower-token values and profile-specific severity. | Validate `receipt_kind`/`redaction_class` lower-token shape; profile mode may check allowed values and compatibility with status/outcome. | `mdkg work receipt new|update` may later accept `--receipt-kind`, `--redaction-class`, and policy refs. | Docs must distinguish status, outcome, kind, policy, and class. | RECEIPT fixtures for worker/final/cleanup-like examples without hardcoding Omni Room as generic. | Receipt verify, archive refs, hash checks, and pack evidence tests. |
| Raw-content warnings | Raw secret/prompt/payload markers warn for workflow files and checkpoints. | Profile-aware severity plan; generic default remains warning. | Generic mdkg owns warning ids/severity plumbing; runtime can hard-fail independently. | Low if default remains warning; medium if strict mode changes exit behavior. | Add diagnostics ids and profile severity path; strict doctor can escalate selected warnings. | `mdkg work validate --profile` or successor may control severity. | Document default warning vs strict/profile behavior. | Warnings fixtures and strict/profile expected status fixtures. | Warning UX and validate summary checks. |
| `mdkg new` scaffolds | Current workflow templates scaffold validation-clean MANIFEST/WORK; work_order/receipt require real refs. | Optional flags only after validators support fields. | Generic mdkg. | Low if flags are optional and output remains validation-clean where currently clean. | Source validator must accept new fields before scaffold emits them. | Potential flags: `--contract-profile`, `--receipt-kind`, `--redaction-class`, `--validation-policy-ref`, `--evidence-policy-ref`. | CLI help, command matrix, generated docs. | New command fixture tests and command contract snapshots. | CLI snapshot/check/contract and docs check. |
| `mdkg work` helpers | Contract/order/receipt helpers create semantic mirrors and verify linkage/evidence without executing work. | Add optional profile/kind/class/policy-ref flags after schema acceptance. | Generic mdkg. | Medium: helper receipts must not imply execution. | Focused work validation must cover helper-created fields. | Extend mutation receipt shapes only additively. | Work helper docs and examples. | Archive-work and work invocation smokes. | Package payload and consumer smoke. |
| Upgrade/scaffold assets | Dry-run by default, preserves customizations, migrates SPEC to MANIFEST, syncs mirrors. | Optional managed template additions only after explicit blast-radius approval. | Generic mdkg. | Medium to high for seed/default assets and init skills. | Upgrade tests must prove no mutation on dry-run and preservation on apply. | `mdkg upgrade` receipt must list will-write paths, preserved customizations, conflicts, side effects. | Upgrade guidance in README/docs/release notes. | Upgrade dry-run/apply temp-repo fixtures. | Smoke upgrade and publish-readiness checks. |
| Docs/release | README, command matrix, generated docs, docs site, changelog, release notes. | Update only after source behavior exists. | Generic mdkg docs. | Medium: docs cannot claim unreleased fields. | Docs checks should catch command drift. | Generated references after implementation. | Public and repo docs. | Docs check, command docs smoke, release note mapping. | Prepublish gate and npm pack dry-run. |

## Deferred Or Out Of Scope

- `room_id`, `target_agent_id`, allowed/forbidden path policy,
  runtime-final authority fields, root refresh recommendation refs, Codex state
  refs, and queue drain semantics stay runtime-owned.
- Sandbox lease, vault scope, cleanup authority, SecretGrantRef, and provider
  descriptors stay sandbox/vault-owned refs.
- Backend tenant, billing, ledger, wallet, credit, marketplace, and product
  receipt semantics stay backend/product-owned and out of generic mdkg.
- Public docs, package metadata, generated docs, source, templates, init assets,
  skills, and downstream repos remain untouched in this planning pass.

# Links / Artifacts

- `goal-48`
- `task-633`
