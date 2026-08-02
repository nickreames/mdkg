---
id: order.demo3-local-durability-closeout-001
type: work_order
title: Demo 3 local durability closeout order
version: 0.1.0
work_id: work.demo3-local-durability-closeout-001
work_version: 0.1.0
requester: user.nick
order_status: completed
request_ref: delegation.mdkg-demo3-local-durability-closeout-001
trigger_ref: trigger.manual
payload_hash: sha256:7cff3de04cdd912a40a77fa25d362d3359856ed1291ad55fff557b94188abc2c
input_refs: [goal-1, test-3]
queue_refs: []
requested_outputs: [loss_exception_receipt:markdown:required, reconciled_graph:mdkg:required]
constraint_refs: [authority.local_mdkg_only, authority.no_provider_or_remote]
artifact_policy: commit_sidecar_and_zip
tags: [demo-3, durability, closeout]
owners: [omni-mdkg-agent]
links: []
artifacts: []
relates: [work.demo3-local-durability-closeout-001, goal-1, test-3]
refs: []
aliases: []
created: 2026-08-02
updated: 2026-08-02
---

# Request

Perform the source-grounded local Demo 3 durability closeout authorized by Nick
in source task 019fa622-70ad-7143-a17d-fb6f19f55fc7.

# Inputs

Use only current local source, cached Git objects, the original archived rollout,
and durable local receipts. Do not inspect providers or public routes.

# Requested Outputs

Recover exact receipt bytes where available, record the bounded chk-4 loss
exception, reconcile the child graph, and preserve all authority separations.

# Constraints

No synthesized evidence, source/public-copy mutation, remote action, provider
action, bundle refresh, tag, release, or history rewrite.
