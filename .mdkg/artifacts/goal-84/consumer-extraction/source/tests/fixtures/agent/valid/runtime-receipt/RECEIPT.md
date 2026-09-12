---
id: receipt.runtime-render-1
type: receipt
title: Runtime Render Receipt
version: 1.0.0
work_order_id: order.runtime-render-1
receipt_status: superseded
outcome: success
cost_ref: cost.redacted
proof_refs: [tool.fixture-renderer, artifact://runtime/proof]
attestation_refs: [attestation://runtime/render-1]
input_hashes: [sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa]
output_hashes: [sha256:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb]
tags: [agent, fixture, runtime]
owners: []
links: []
artifacts: [artifact://runtime/output]
relates: [order.runtime-render-1, work.runtime-render]
refs: []
aliases: [runtime-render-receipt]
created: 2026-05-18
updated: 2026-05-18
---

# Outcome

success

# Artifacts

- `artifact://runtime/output`

# Proof

- input_hash: `sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`
- output_hash: `sha256:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb`

# Notes

The receipt mirrors committed semantic evidence only. Tool receipt evidence is
represented through optional proof refs.
