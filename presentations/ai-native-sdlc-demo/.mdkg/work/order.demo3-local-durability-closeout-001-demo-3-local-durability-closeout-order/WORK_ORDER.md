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
input_refs: [goal-7, epic-7, chk-28]
queue_refs: []
requested_outputs: [closeout_receipt:markdown:required, reconciled_graph:mdkg:required]
constraint_refs: [authority.local_mdkg_only, authority.one_local_commit, authority.no_remote_provider_release]
artifact_policy: commit_sidecar_and_zip
tags: [demo-3, durability, closeout]
owners: [omni-mdkg-agent]
links: []
artifacts: []
relates: [work.demo3-local-durability-closeout-001, goal-7, epic-7, chk-28]
refs: []
aliases: []
created: 2026-08-02
updated: 2026-08-02
---

# Request

Perform the source-grounded local Demo 3 durability closeout authorized by Nick
in source task 019fa622-70ad-7143-a17d-fb6f19f55fc7 and create one bounded
local `.mdkg` commit after validation.

# Inputs

Use only local repository evidence. Preserve the accepted frozen 42-path
baseline without absorbing excluded or unrelated paths.

# Requested Outputs

Reconcile program/child/epic/selection drift, bind exact recovery and the
chk-4 loss exception, validate, and record local Git disposition.

# Constraints

No source, public-copy, bundle, provider, deployment, remote, tag, release,
publication, or history-rewrite action.
