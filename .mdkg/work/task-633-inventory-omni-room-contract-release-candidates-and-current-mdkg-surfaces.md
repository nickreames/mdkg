---
id: task-633
type: task
title: inventory Omni Room contract release candidates and current mdkg surfaces
status: done
priority: 1
tags: [goal-48, inventory, contracts]
owners: []
links: []
artifacts: [/Users/nick/omni-chat-rooms/.mdkg/pack/handoff_root_goal_41_mdkg_release.md, /Users/nick/omni-chat-rooms/.mdkg/pack/handoff_root_task_398_boundary.md, /Users/nick/omni-chat-rooms/.mdkg/work/task-405-classify-mdkg-release-candidates-for-contract-template-schema-support.md, /Users/nick/omni-chat-rooms/.mdkg/work/chk-88-goal-34-contract-profile-planning-closeout.md, src/graph/agent_file_types.ts, src/commands/validate.ts, src/commands/work.ts, src/commands/upgrade.ts, .mdkg/templates/default/manifest.md, .mdkg/templates/default/work.md, .mdkg/templates/default/work_order.md, .mdkg/templates/default/receipt.md, README.md, CLI_COMMAND_MATRIX.md]
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

Inventory the Omni Room contract release candidates from the root handoffs and
compare them with current mdkg source, templates, validators, CLI, docs, and
release/package surfaces.

This is the first executable node when `goal-48` resumes. It is read-only until
the inventory has a reviewed candidate matrix.

# Acceptance Criteria

- Root handoffs and root source nodes are summarized with file paths and
  relevant qids.
- Current mdkg support is inventoried for MANIFEST, WORK, WORK_ORDER, RECEIPT,
  `mdkg new`, `mdkg work`, focused workflow validation, raw-content warnings,
  `mdkg upgrade`, templates, init assets, docs, and package gates.
- Candidate fields from the root handoff are listed without treating them as
  accepted schema.
- Inventory separates generic mdkg candidates from runtime-only Omni Room
  policy and seed/default asset changes.
- No source, package, template, docs, skills, generated docs, or default asset
  files are modified by this inventory task.

# Files Affected

- Planning updates only under `.mdkg/work/**` unless a later explicit
  implementation goal authorizes source edits.
- Expected read-only inputs include current mdkg source/docs and root handoff
  files.

# Implementation Notes

- Required root inputs:
  - `/Users/nick/omni-chat-rooms/.mdkg/pack/handoff_root_goal_41_mdkg_release.md`
  - `/Users/nick/omni-chat-rooms/.mdkg/pack/handoff_root_task_398_boundary.md`
  - `/Users/nick/omni-chat-rooms/.mdkg/work/goal-41-plan-mdkg-cli-template-schema-release-for-omni-room-contract-support.md`
  - `/Users/nick/omni-chat-rooms/.mdkg/work/task-398-create-backend-mdkg-and-root-follow-up-boundary-handoff.md`
- Current child evidence to inspect includes `.mdkg/templates/default/*`,
  `src/graph/agent_file_types.ts`, `src/commands/validate.ts`,
  `src/commands/upgrade.ts`, `src/commands/work.ts`, `src/cli.ts`,
  `README.md`, and `CLI_COMMAND_MATRIX.md`.
- Treat `contract_profile`, `receipt_kind`, and `redaction_class` as candidate
  terms until an accepted decision or implementation task selects names and
  compatibility behavior.

# Test Plan

- `mdkg validate --changed-only --json`
- `mdkg validate --summary --limit 20 --json`
- Confirm the produced matrix names all required candidate categories and
  records non-goals.

# Inventory Result

## Source Evidence

| Evidence | What it contributes |
| --- | --- |
| `/Users/nick/omni-chat-rooms/.mdkg/pack/handoff_root_goal_41_mdkg_release.md` | Root release-planning target, boundary language, and required checks for mdkg-owned contract support. |
| `/Users/nick/omni-chat-rooms/.mdkg/pack/handoff_root_task_398_boundary.md` | Ownership boundary between mdkg, runtime, sandbox/vault, backend fixture policy, and root execution. |
| `/Users/nick/omni-chat-rooms/.mdkg/work/task-405-classify-mdkg-release-candidates-for-contract-template-schema-support.md` | Candidate matrix: `contract_profile` or `profile`, `receipt_kind`, `redaction_class`, policy refs, profile-aware validation, CLI/scaffold/docs/smoke candidates, and explicit non-candidates. |
| `/Users/nick/omni-chat-rooms/.mdkg/work/chk-88-goal-34-contract-profile-planning-closeout.md` | Goal-34 closeout classification of existing mdkg generic fields, Omni Room runtime profile fields, sandbox/vault refs, and mdkg release candidates. |
| `/Users/nick/omni-chat-rooms/.mdkg/design/dec-39-mdkg-owns-generic-contract-template-schema-releases-before-runtime-consumption.md` | Accepted boundary: generic contract template/schema/validator/scaffold/CLI changes belong upstream in `projects/mdkg` before stable runtime dependency. |
| `src/graph/agent_file_types.ts` | Current semantic file types, frontmatter attribute order, enum validation, ref/hash validation, and file-name compatibility rules. |
| `src/commands/validate.ts` | Current graph validation warnings, raw-content marker warnings, and MANIFEST/SPEC compatibility diagnostics. |
| `src/commands/work.ts` | Current `mdkg work` contract/order/receipt/trigger/status/verify behavior, generated fields, archive-ref checks, and queue bridge boundaries. |
| `src/commands/upgrade.ts` | Current upgrade receipt model, customization preservation, safe-to-apply semantics, and SPEC-to-MANIFEST migration behavior. |
| `.mdkg/templates/default/{manifest,work,work_order,receipt}.md` | Current default frontmatter and body guidance for the four workflow surfaces. |
| `README.md`, `CLI_COMMAND_MATRIX.md`, generated command docs | Public command/docs surfaces that future implementation must refresh after behavior is proven. |

## Current mdkg Generic Support

| Surface | Current generic behavior | Current gap for Omni Room planning |
| --- | --- | --- |
| MANIFEST | Canonical `MANIFEST.md`, legacy `SPEC.md` compatibility, `spec_kind`, `role`, `runtime_mode`, `work_contracts`, dependency refs, `resource_profile`, and `update_policy`. | No `contract_profile`, profile-aware validation entrypoint, or profile-specific warning/error policy. |
| WORK | `agent_id`, lowercase `kind`, `pricing_model`, capabilities/dependency refs, field descriptors, and `receipt_required`; validator requires an invocation anchor. | No profile coupling field; `kind` is capability kind and should not be overloaded as room/runtime profile. |
| WORK_ORDER | `work_id`, `work_version`, `requester`, status, request/trigger refs, payload hash, input/queue refs, requested outputs, constraints, and `artifact_policy`. | No generic profile marker and no runtime-room task semantics; queue refs are delivery pointers, not canonical runtime execution state. |
| RECEIPT | `work_order_id`, `receipt_status`, `outcome`, `cost_ref`, `redaction_policy`, proof/attestation refs, evidence/input/output hashes, and archive/artifact refs. | No `receipt_kind`; `redaction_policy` is a handling policy, not a profile/export redaction class. |
| Validation | File-name checks, required frontmatter, enums, portable refs, URI refs, sha256 refs, sibling MANIFEST/SPEC conflict, raw-content warnings, and focused `mdkg work validate`. | No profile-aware strictness or configurable severity for raw-content markers. |
| CLI/scaffold | `mdkg new manifest|work|work_order|receipt`; `mdkg work contract/order/receipt/trigger/status/verify/artifact/validate`; `mdkg upgrade` dry-run/apply receipts. | No flags for contract profile, receipt kind, redaction class, validation/evidence policy refs, or profile validation. |
| Upgrade/init assets | Safe managed-path upgrade, customization preservation, manifest migration, generated init manifest, and skill mirror sync. | Any seed/default template or `assets/init/skills/default` change has broad blast radius and must be explicitly authorized later. |
| Release gates | Build, unit tests, CLI checks, docs checks, smoke tests, npm pack/publish dry-run process already exists in repo practice. | Future release plan must add targeted profile fixtures and payload review only after implementation exists. |

## Candidate Terms From Root Evidence

These terms are release candidates, not accepted schema in this planning pass.

| Candidate | Current status | Planning classification |
| --- | --- | --- |
| `contract_profile` | Not present in mdkg source, templates, docs, or fixtures. | Preferred planning name over generic `profile`; optional additive candidate for all four workflow files or a smaller accepted subset. |
| `profile` | Mentioned by root as an alternative candidate. | Reject as too ambiguous for mdkg frontmatter; use `contract_profile` if a generic field is accepted later. |
| `receipt_kind` | Not present; current receipt separation relies on `receipt_status`, `outcome`, refs, and prose. | Generic additive candidate for receipt authority class; must not encode only Omni Room values. |
| `redaction_class` | Not present; current field is `redaction_policy`. | Optional classifier candidate that must not replace `redaction_policy`; use for export/review class only if validated distinctly. |
| `validation_policy_ref` / `evidence_policy_ref` | Not present; refs can already be represented generically in some lists, but not as named policy refs. | Additive optional ref candidates; likely useful on MANIFEST, WORK_ORDER, and RECEIPT after validation rules are selected. |
| Profile-aware raw-content severity | Current raw-content markers are warnings. | Generic release candidate; runtime may hard-fail independently until mdkg exposes profile-specific severity. |
| `mdkg work validate --profile <profile>` or successor | Not present. | Candidate CLI entrypoint; must be designed before implementation to avoid flag churn. |

## Explicit Non-Candidates For Generic mdkg

- Room lifecycle identifiers such as `room_id`, `room_template_recipe`, startup
  max-in-flight, Codex state roots, runtime queue drain semantics, and root
  refresh recommendation fields are Omni Room runtime profile behavior.
- Sandbox/vault semantics such as `sandbox_lease_ref`, `SecretGrantRef`,
  `vault_scope_ref`, cleanup proof authority, provider kind, and lease cleanup
  are external authority refs; mdkg may validate refs/hashes but should not own
  provider semantics.
- Backend tenant, billing, wallet, ledger, credit, marketplace, product receipt,
  admission, or provider policy remains outside generic mdkg semantic mirrors.
- Seed/default asset updates are possible future mdkg work, but not automatic
  output of this planning goal.

## Inventory Conclusion

The next release-planning lane should be additive and profile-aware. It should
start from current generic mdkg fields, choose explicit optional field names
only after compatibility review, keep runtime-only policy out of generic
validators, and add release fixtures/gates before public docs or package claims.

# Links / Artifacts

- `goal-48`
