---
id: {{id}}
type: receipt
title: {{title}}
version: 0.1.0
work_order_id: order.example
receipt_status: recorded
outcome: success
cost_ref: cost.redacted
redaction_policy: refs_and_hashes_only
contract_profile: generic
receipt_kind: worker
redaction_class: internal
validation_policy_ref: policy.validation.default
evidence_policy_ref: policy.evidence.default
proof_refs: []
attestation_refs: []
evidence_hashes: []
input_hashes: []
output_hashes: []
tags: []
owners: []
links: []
artifacts: []
relates: []
refs: []
aliases: []
created: {{created}}
updated: {{updated}}
---

# Outcome

Record the result and proof summary.

This file is a committed semantic mirror, not canonical payment, ledger,
marketplace, or execution state. Do not store raw secrets, credentials, live
payment state, ledger mutations, or bulky payloads here.

# Artifacts

List committed artifact references. Use `artifact://...` for external or
runtime-managed artifact identities and `archive://...` for committed mdkg
archive sidecars.

# Proof

Record non-secret proof, attestation, and hash references. `evidence_hashes`
can hash receipt evidence bundles or redacted proof summaries that are not
stored directly in this file.

# Redaction

`redaction_policy` records how this mirror avoids raw secrets and canonical
runtime state. Use refs, hashes, archive refs, artifact refs, and redacted
summaries instead of credentials, auth headers, live payment state, ledger
mutations, marketplace inventory, or production runtime state.

# Notes

Capture non-secret execution notes.
