# Goal89: revised host-binding decision for Nick

Status: **PENDING_REVISED_BINDING_REVIEW**. Contract revision:
**canonical-v2-host-binding-v1**. This is a design proposal, not implemented
0.6.2 behavior or a passing release candidate.

The 2026-10-03 parent relay says Nick accepted **indefinite quarantine with
explicit recovery/purge and no automatic deletion** as policy direction. That
choice is recorded; it is not requested again and does not approve the revised
identity/compatibility contract. Sequential implementation authority remains
granted, subject to the named Chk675 design review.

Independent review found that `legacy-working:<store-uuid>` is self-asserted
store identity. It cannot detect a foreign store copied into a different legacy
host. That proposal is superseded; retaining its UUID does not repair the defect.

| Choice for review | Compatibility and identity contract |
| --- | --- |
| **H1 — recommended revised contract** | Managed working storage requires the existing independently verified canonical v2 graph identity. Legacy graphs and custom scratch remain supported/preserved; managed storage refuses nonmutatingly until a separate reviewed hash-bound `mdkg graph migrate` adoption. Every operation compares the fresh host graph ID with the store binding. No new implicit identity or migration. |
| **H2 — request separate legacy binding design** | Keep Goal89 feature work blocked while a new independently retained legacy host anchor, its migration/clone/restore behavior and portable custody limits are designed and reviewed. No nonce/path/inode scheme is silently substituted or treated as approved. |

H1 is a material compatibility choice: legacy users need an explicit canonical
identity migration before managed storage. Existing `graph migrate` requires
reviewed graph namespace/origin and, for graphs with a local Git HEAD, an accepted
ancestor with complete local history. A fresh graph without HEAD can preview
explicit migration without an ancestor or first commit; no gates are waived.
It creates no numeric IDs or selected-goal changes through working commands.
Fresh default `mdkg init` currently creates a legacy graph and exposes no v2-init
option, so H1 also delays managed storage for those fresh users until migration
prerequisites are met. It does not add an implicit first commit, ancestor selection
or alternative bootstrap. This usability cost is explicitly part of the review.

Why H1: default init has no canonical host identity to compare with an incoming
store. V2 supplies an existing independent logical graph identity, strict reader,
stable work references and clone/fork rules. Reusing it avoids introducing a
second identity lifecycle. The cost is requiring explicit adoption before managed
storage, even for fresh default init. Scratch storage itself does not require
all canonical nodes to have stable identities; H1 is the proposed reuse choice.

H2 can also be sound: an independently retained marker outside working could
bind legacy stores without migrating every node. Its creation/adoption, tracking,
same-ID clone versus independent fork, replacement and retained restore contracts
would need review and tests. A path hash, inode or the store's own UUID is not
that independently retained logical identity. Another option is separately
reviewed explicit v2 bootstrap for fresh projects; it changes init/identity
authoring scope and still leaves existing legacy compatibility to decide.
None of these alternatives is accepted or implemented by this checkpoint.

Under H1, `store_id` remains subordinate. Copy A into independently identified
host B refuses without changing either manifest or payload; incoming IDs cannot
bootstrap the host. Same-ID clones are the same logical graph, while independent
forks have a new ID and reject the copied binding. This does not authenticate
owners or prove per-checkout origin; a local editor can rewrite declarations.

Adoption/foreign restore is selected **data-only copy** into an independently
identified destination with new store/entry IDs, exact preview hashes and
retained originals/provenance. It never replaces host identity or trusts incoming
approvals, work references or ownership. Active/pinned/foreign/stale custody
requires exact prior-owner and stopped-writer review or refuses. Explicit resume,
recovery and purge retain the accepted no-automatic-action policy and honest
checkout/host-loss limits. Unknown metadata and journals are preserved.

The [exact revised contract](cloud-goal89-design.md) and
[acceptance plan](cloud-goal89-validation-plan.md) also retain the proposed
`.mdkg/working` / `working` names, strict schema, promotion and transaction scope.
Their current content hashes are in
`../.mdkg/artifacts/goal-89/ci-followthrough/checks.json`; approval must
identify that revision and any requested changes. Synthetic test-only binding
controls are proposal evidence, not Test495 installed feature acceptance.
The original d853df5/65d20d7e review receipt stays historical. This follow-through
corrects the HEAD-dependent migration prerequisite and explains alternatives;
it grants no new identity/working behavior or design approval.

Chk675 stays backlog and Task848 stays review until that actual contract decision
is recorded. Task849/850, 0.6.2 implementation/versioning and Goal90 remain
excluded from this turn. Accepting the design would not authorize merging,
publishing, tags, deployments, professional adoption or waiving required checks.
