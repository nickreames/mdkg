---
id: receipt.demo3-chk4-loss-exception
type: receipt
title: Demo 3 chk-4 exact-body loss exception
version: 0.1.0
work_order_id: order.demo3-local-durability-closeout-001
receipt_status: verified
outcome: partial
cost_ref: cost.redacted
redaction_policy: refs_and_hashes_only
proof_refs: [goal-1, test-3]
attestation_refs: []
evidence_hashes: [sha256:68cbb8b49dadf08a749c67acb24edd6f92f63ff815e7ac0f7c5008099e4acb18, sha256:86dc9e044c2addc0d1d2d7f66787a70e2012b9752d9d1cdcb88625341f2705ff, sha256:9e433dcd226570a329fd5377bdef6ce8c452d0376fb195039de7846a06efc2d0, sha256:d0fbf88a1cb3ac55fac6758a263c257e1a450d1b861ce621b754feb82566386c, sha256:28b4f6bbaec1c13b68df89c7adf66d4c2c770b545e678406d33f82afde7e9cf6, sha256:cb5e6924195374d47984afcd651e1e7f3f5c49ecd9416ee8222049f5bd0f7da5, sha256:81af93c55dfbb6affecae117d0f08eaa04386299e2a0f5ce751d60ad062da607, sha256:1d1a48ff9ecb60f531b347804087c633e988be76cf814a099a5b57aa0a1b2b10, sha256:5a3e2ef0960cec4138812288aec3bb6e3069b3de26fb12acc52360a6477a537c]
input_hashes: [sha256:699751bfb4e7e04e356e0a53e6a0b032b91a01b8371e1d89b514ce05a48c39bd]
output_hashes: [sha256:86dc9e044c2addc0d1d2d7f66787a70e2012b9752d9d1cdcb88625341f2705ff, sha256:9e433dcd226570a329fd5377bdef6ce8c452d0376fb195039de7846a06efc2d0]
tags: [demo-3, durability, evidence-loss]
owners: [omni-mdkg-agent]
links: []
artifacts: [artifacts/publication-receipt.json, artifacts/live-verification-receipt.json]
relates: [goal-1, test-3]
refs: []
aliases: []
created: 2026-08-02
updated: 2026-08-02
---
# Outcome

The exact original body of
`.mdkg/work/chk-4-demo-3-exact-sha-public-result-accepted.md`
was not recovered. This receipt accounts for that loss; it is not `chk-4`, it
does not reproduce the checkpoint, and it does not claim the missing bytes were
recovered.

Known original identity:

- QID: `root:chk-4`
- title: `Demo 3 exact-SHA public result accepted`
- creation call: `call_V1mfivsA7Eoo9Pii90IL0csz`
- original creation timestamp: `2026-07-28T14:17:19.624Z`
- creation command: `mdkg ... task done test-3 --checkpoint "Demo 3 exact-SHA public result accepted" --json`
- expected SHA-256: `68cbb8b49dadf08a749c67acb24edd6f92f63ff815e7ac0f7c5008099e4acb18`

# Artifacts

- `artifacts/publication-receipt.json` was recovered only from original patch
  call `call_cfa6FEPqXtcGRkSmBdxo0RAe`; its SHA-256 is
  `86dc9e044c2addc0d1d2d7f66787a70e2012b9752d9d1cdcb88625341f2705ff`.
- `artifacts/live-verification-receipt.json` was recovered only from original
  patch call `call_MkAo7XJ2nKvtNb22XoTa9TQ8`; its SHA-256 is
  `9e433dcd226570a329fd5377bdef6ce8c452d0376fb195039de7846a06efc2d0`.
- Both bodies match the historical hashes exactly. They remain outside the
  authorized `.mdkg` commit allowlist.

# Proof

Search scope exhausted without finding the exact checkpoint bytes:

- current working tree and child graph;
- cached public commit `3955a769a439a415e4b86a0df1373009fcc95fed`;
- reachable, reflog, and unreachable local Git objects;
- current private program bundle;
- the full original archived rollout for task
  `019f9c61-e01c-7800-9a0e-3a029821c378`;
- the prunable registration for the missing preparation worktree, which had no
  remaining filesystem to inspect.

Surviving corroboration includes program `chk-28`, the rehearsal outcome,
umbrella commit/push, deployment, and live-route receipts, the exact two child
JSON receipts, and the final bundle content hash listed in `evidence_hashes`.
These prove the surrounding historical outcome but cannot prove the missing
checkpoint's exact body.

# Redaction

Only paths, public-safe identifiers, hashes, and historical result summaries are
retained. No credentials, provider payloads, or secrets are stored.

# Notes

Nick accepted this bounded loss-exception route through
`MDKG-DEMO3-LOCAL-DURABILITY-CLOSEOUT-001` on 2026-08-02. The graph
reconciliation is a new local evidence account. It does not manufacture the
historical checkpoint. Provider and public-route facts are historical receipt
facts only; no fresh provider or route inspection occurred. Nick's earlier
manual observation that the landing page was reachable remains an unverified
Nick observation, not provider or deployment proof.
