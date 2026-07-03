---
id: task-634
type: task
title: plan scaffold upgrade and documentation behavior for contract profiles
status: done
priority: 1
tags: [goal-48, upgrade, scaffold, docs]
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

Plan how mdkg should expose any accepted contract-profile behavior through
scaffolds, upgrade receipts, docs, and generated references.

This task is explicitly about future behavior. The current seeded goal does not
edit templates, init assets, public docs, generated docs, skills, or package
metadata.

# Acceptance Criteria

- `mdkg new manifest|work|work_order|receipt` behavior is classified for any
  accepted profile fields or examples.
- `mdkg work contract/order/receipt` helper behavior is classified for field
  support, validation, and JSON receipts.
- `mdkg upgrade` dry-run/apply behavior is planned with customization
  preservation, safe-to-apply receipts, and explicit seed/default blast-radius
  gates.
- Docs, README, command matrix, generated CLI reference, release notes, and
  examples are listed as future update surfaces only after source behavior is
  proven.
- `assets/init/skills/default` and seed/default templates are not changed unless
  a later explicit mdkg-owned goal authorizes them.

# Files Affected

- Planning updates under `.mdkg/work/**`.
- Future implementation candidates may include source/tests/docs/templates/init
  assets only after explicit authorization.

# Implementation Notes

- Preserve the current upgrade contract: preview first, apply only after
  reviewing `safe_to_apply`, `will_write_paths`, `preserved_customizations`,
  `blocking_conflicts`, and `apply_side_effects`.
- Plan generated reference refresh only after implementation tests pass.

# Test Plan

- `test-331`
- `mdkg upgrade --dry-run --json` in the later execution pass.
- `mdkg validate --changed-only --json`

# Scaffold, Upgrade, And Docs Plan

## Sequencing Rule

Future implementation must happen in this order:

1. Add validator/schema support and focused fixtures.
2. Add CLI helper flags only after validators accept the new fields.
3. Add scaffold/template output only after CLI helper behavior is tested.
4. Add docs/generated references only after source behavior is proven.
5. Consider seed/default init assets only under a separate explicit blast-radius
   approval.

## CLI And Scaffold Candidates

| Surface | Future behavior | Gate before implementation |
| --- | --- | --- |
| `mdkg new manifest` | Optional `--contract-profile`, `--validation-policy-ref`, and `--evidence-policy-ref` flags may write accepted fields. Default output can remain profile-neutral. | Validator fixtures for optional MANIFEST fields pass. |
| `mdkg new work` | Optional `--contract-profile` only if task-632's cross-file coherence rule is implemented. Do not change `kind` semantics. | WORK profile fixture does not weaken invocation-anchor validation. |
| `mdkg new work_order` | Optional `--contract-profile`, `--validation-policy-ref`, and `--evidence-policy-ref`; keep runtime-only room/task fields out. | WORK_ORDER focused validation and payload/hash tests pass. |
| `mdkg new receipt` | Optional `--contract-profile`, `--receipt-kind`, `--redaction-class`, `--validation-policy-ref`, and `--evidence-policy-ref`. | RECEIPT verify and redaction-policy compatibility tests pass. |
| `mdkg work contract new` | Optional `--contract-profile` only if WORK support is accepted. | Archive/work lifecycle smoke remains clean. |
| `mdkg work order new|update|trigger` | Optional profile and policy-ref flags; `trigger` must keep `executed: false` and no runtime execution semantics. | Work trigger/order status fixtures pass. |
| `mdkg work receipt new|update|verify` | Optional receipt-kind/redaction-class/policy-ref flags, with verify reporting them but not claiming runtime authority. | Receipt verify fixtures cover evidence, archive refs, status/outcome, redaction policy, and kind/class metadata. |
| `mdkg work validate` | Add `--profile <name>` or a successor explicit profile selector only after warning/error behavior is accepted. | Command matrix, CLI contract, and validate diagnostics shape tests pass. |

## Upgrade Behavior

Future `mdkg upgrade` support must preserve the current contract:

- default dry-run writes nothing;
- `--apply` is explicit;
- JSON receipt reports `safe_to_apply`, `will_write_paths`,
  `preserved_customizations`, `blocking_conflicts`, and `apply_side_effects`;
- customized docs, templates, skills, core files, and local config overlays are
  preserved;
- SPEC-to-MANIFEST migration remains independent from contract-profile fields;
- new optional template fields are added only to managed, unchanged templates or
  reported as preserved customizations/conflicts;
- `assets/init/skills/default` changes require a separate explicit mdkg-owned
  task because they affect generated agent skill behavior.

## Docs And Generated References

| Surface | Future update requirement |
| --- | --- |
| `README.md` | Explain optional profile fields, status/outcome/kind/policy/class distinctions, and runtime/downstream caveats. |
| `CLI_COMMAND_MATRIX.md` | Add new flags and JSON receipt fields only after live CLI help/source exposes them. |
| `docs/` and docs site source | Add MANIFEST/WORK/WORK_ORDER/RECEIPT profile guide and release notes only after implementation is proven. |
| Generated docs | Refresh through existing command-doc generation/checks, not by hand-editing generated files. |
| `CHANGELOG.md` / release notes | Map every publish-bound source/docs/template behavior change to the actual target release resolved later. |
| Examples/fixtures | Add valid/invalid profile fixtures after validator behavior exists; do not claim Omni Room stable support until package gates pass. |

## Seed/Default Asset Gate

Seed/default template edits are not approved by this planning goal. A later
execution goal may authorize them only if it states:

- exact files under `.mdkg/templates/default`, `dist/init`, `assets/init`, or
  default skills to change;
- upgrade preservation behavior for customized repos;
- before/after `mdkg upgrade --dry-run --json` and optional `--apply` receipts;
- smoke coverage for fresh init, existing customized repo, and agent-enabled
  skill mirror sync;
- no hardcoded target version in templates or docs.

# Links / Artifacts

- `goal-48`
- `test-331`
