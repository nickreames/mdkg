---
id: {{id}}
type: work_order
title: {{title}}
version: 0.1.0
work_id: work.example
work_version: 0.1.0
requester: user.example
order_status: submitted
request_ref: request.example
input_refs: []
requested_outputs: [result:text:required]
constraint_refs: []
artifact_policy: commit_sidecar_and_zip
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

# Request

Capture the concrete request against a WORK.md version.

# Inputs

Record committed input references without secrets.

# Requested Outputs

Document the output descriptors requested from the work contract.

# Constraints

Capture relevant policy, budget, and artifact constraints.
