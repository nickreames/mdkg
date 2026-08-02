---
id: receipt.demo3-local-durability-closeout-001
type: receipt
title: Demo 3 local durability closeout
version: 0.1.0
work_order_id: order.demo3-local-durability-closeout-001
receipt_status: verified
outcome: success
cost_ref: cost.redacted
redaction_policy: refs_and_hashes_only
proof_refs: [goal-7, epic-7, chk-28]
attestation_refs: []
evidence_hashes: [sha256:699751bfb4e7e04e356e0a53e6a0b032b91a01b8371e1d89b514ce05a48c39bd, sha256:86dc9e044c2addc0d1d2d7f66787a70e2012b9752d9d1cdcb88625341f2705ff, sha256:9e433dcd226570a329fd5377bdef6ce8c452d0376fb195039de7846a06efc2d0, sha256:68cbb8b49dadf08a749c67acb24edd6f92f63ff815e7ac0f7c5008099e4acb18, sha256:d0fbf88a1cb3ac55fac6758a263c257e1a450d1b861ce621b754feb82566386c, sha256:28b4f6bbaec1c13b68df89c7adf66d4c2c770b545e678406d33f82afde7e9cf6, sha256:cb5e6924195374d47984afcd651e1e7f3f5c49ecd9416ee8222049f5bd0f7da5, sha256:81af93c55dfbb6affecae117d0f08eaa04386299e2a0f5ce751d60ad062da607, sha256:1d1a48ff9ecb60f531b347804087c633e988be76cf814a099a5b57aa0a1b2b10, sha256:5a3e2ef0960cec4138812288aec3bb6e3069b3de26fb12acc52360a6477a537c]
input_hashes: [sha256:9f66eadddf270c03c9203131b2876873b0ea49fd40c83ad883d94c20cf7c9be5]
output_hashes: [sha256:710acd78a69c8ab419c0291f3992b71e131bf067fa6b14cd4c26f4577bce7448]
tags: [demo-3, durability, closeout]
owners: [omni-mdkg-agent]
links: []
artifacts: [artifacts/demo-003/rehearsal-outcome-receipt.json, artifacts/demo-003/umbrella/commit-push-receipt.json, artifacts/demo-003/umbrella/deployment-receipt.json, artifacts/demo-003/umbrella/live-route-receipt.json]
relates: [goal-7, epic-7, chk-28]
refs: []
aliases: []
created: 2026-08-02
updated: 2026-08-02
---

# Outcome

Demo 3 is locally graph-closed under the accepted exact-evidence/loss-exception
contract. Program Goal 7 remains `done/achieved`; program epic-7 and child
epic-1 are reconciled to `done`; the child Goal 1 and every authored
actionable node are `done`; and stale child selection is cleared.

The original `root:chk-4` body remains lost and was not synthesized. Its
precise child loss-exception receipt is
`receipt.demo3-chk4-loss-exception`. The absence is explicitly accounted for,
not silently waived or represented as exact recovery.

# Custody and path treatment

Nick accepted custody of the frozen 42-path baseline recorded by SHA-256
`699751bfb4e7e04e356e0a53e6a0b032b91a01b8371e1d89b514ce05a48c39bd`.
The root private bundle and root global index are excluded from the closeout
commit and were not rebuilt. Non-`.mdkg` artifacts and screenshots remain
byte-preserved and uncommitted. The exact two recovered child JSON receipts are
also intentionally uncommitted because the amended commit authority is
strictly `.mdkg`-only.

# Artifacts

The committed semantic evidence is the program and child mdkg graph, the
accepted checkpoints, the closeout work/order/receipt chain, and the precise
loss exception. Existing non-`.mdkg` evidence is referenced by path and hash;
it is not absorbed by this commit.

# Source and evidence relationship

The reusable semantic source remains
`examples/website-demo-template/.mdkg/:goal-1`. The executed specification is
`runs/demo-003/.mdkg/:goal-1`. No reusable source or authored child contract
was changed.

The cached public commit `3955a769a439a415e4b86a0df1373009fcc95fed`
preserved the exact original child event progression through task-3. Those
exact event lines and node states were restored before the final task-3,
test-3, and Goal 1 states were reconciled from the original rollout. The
published public detail snapshot remains an intermediate consumer surface and
was not changed by this closeout.

# Established historical outcome

Primary local receipts record Demo 3 selected at T+11:53, two prepublication
repairs, zero production repairs, one normal non-force publication at exact SHA
`3955a769a439a415e4b86a0df1373009fcc95fed`, two named READY production
deployments for that SHA, and both routes HTTP 200/noindex at the historical
verification time. Program checkpoint `chk-27` contains a secondary T+14:33
prose discrepancy; T+11:53 remains the primary receipt-backed selection time.
No fresh provider or public-route check was performed.

The final bundle content hash is
`5a3e2ef0960cec4138812288aec3bb6e3069b3de26fb12acc52360a6477a537c`.
The root ZIP projection is now stale relative to the reconciled graph and was
not rebuilt because bundle/subgraph refresh authority was withheld.

Nick's earlier manual observation that the Demo 3 landing page was reachable
is retained only as an unverified Nick observation. It is not provider,
deployment, or fresh public-proof evidence.

# Validation and Git disposition

Pre-commit validation passed:

- child full graph validation: 0 errors, 0 warnings;
- program full graph validation: 0 errors, 0 warnings;
- root changed-only validation: 0 errors, 0 warnings;
- root full validation: 0 errors and two expected generated-state warnings:
  stale root SQLite index and stale program subgraph bundle;
- built CLI command-matrix check: passed;
- exact recovered receipt hashes: matched;
- `git diff --check`: passed.

The two root full-validation warnings are not repaired because root indexing and
bundle/subgraph refresh authority is withheld. Final staged-path review, final
validation, and the clean staged index after the single local commit are
reported in the external closeout receipt. The commit SHA is likewise external
because a commit cannot contain its own SHA.

Baseline Git state before mutation was `main` at
`0f1b98879da7ac44eded3d34645d022bbcc8b79f`, with cached
`origin/main` at `3955a769a439a415e4b86a0df1373009fcc95fed`,
18 commits ahead and 4 behind. No fetch, pull, push, tag, release, provider,
deployment, public-route, public-copy, or history-rewrite action was taken.

# Remaining shared-history work

The local commit is not shared-reachable. Any integration with current remote
history requires a fresh remote read, an explicit history-integration plan, and
separate push authority. Bundle/subgraph regeneration, public-copy changes,
provider checks, deployment actions, tags, and releases remain separately
withheld.

# Notes

Skill coverage was provided by `select-work-and-ground-context`,
`service-boundary-ownership-check`, and `verify-close-and-checkpoint`.
Existing skill coverage was sufficient; no new skill or loop was created.
