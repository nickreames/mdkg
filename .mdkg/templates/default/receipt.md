---
id: {{id}}
type: receipt
title: {{title}}
version: 0.1.0
work_order_id: order.example
receipt_status: recorded
outcome: success
cost_ref: cost.redacted
proof_refs: []
attestation_refs: []
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

Record non-secret proof, attestation, and hash references.

# Notes

Capture non-secret execution notes.
