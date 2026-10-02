# Goal89: one decision for Nick

Status: **PENDING_NICK_REVIEW**. This is a design-only proposal, not feature
implementation or a passing 0.6.2 candidate.

The plan reserves this choice for you. Task848 says:

> Choose quarantine, retention, purge/recovery and stale-owner policy with Nick; no default cleanup.

Chk675 says:

> Nick reviews unresolved names/grammar/compatibility/persistence policy, exact owned paths and accepted tests before feature work.

**Already instructed:** sequential cloud stack before PR10 merges; persistent
working storage separate from canonical graph; no silent expiry/deletion;
previewed, explicit cleanup; active/pinned/goal-work protection; retained
recovery; honest Git/artifact/cloud-loss boundaries. Implementation run authority
is already granted. These requirements and release/adoption gates are unchanged.

**Decision:** accept option A with the proposed working contract, or choose B
with a different stated retention duration and identify any contract changes?

| Option | Retention and purge eligibility | Recovery |
| --- | --- | --- |
| **A — recommended** | Quarantine remains indefinitely by default. You may explicitly choose positive whole hours for selected entries at GC, or later through a separate reviewed policy change. The window begins when quarantine completes or that new policy is applied. Expiry only enables a fresh preview and explicit purge; it never deletes. | No automatic replay. Explicit `resume` finishes an admitted interrupted operation; explicit `recover` restores verified retained entries before deletion. |
| **B — finite default proposal** | Default quarantine retention is 168 hours (7 days), overridable only through reviewed policy. Completion/application starts the window. The same fresh preview and explicit purge remain mandatory after expiry. Seven days is a proposal, not a duration you already chose. | The same explicit resume/recover contract as A; expiry does not remove recovery. |

Both preserve exact retained payload bytes while verified custody is intact and
refuse stale plans, active/pinned/claimed work, unknown journals/files, destination
conflicts, links/hardlinks and graph/path mismatches. Stale or foreign ownership
requires exact owner identification and explicit stopped-writer confirmation;
age or missing PID never releases it. A partial/final purge irreversibly loses
deleted bytes: mdkg cannot restore them without a separately retained copy and
must record that loss. Portable filesystem races, checkout deletion and host
loss remain limits; a cloud save is not a backup guarantee.

**Also genuinely pending in the proposed contract:** `.mdkg/working` / `working`
names, strict manifest-v1 schema, a distinct `legacy-working:<store-uuid>`
namespace without graph migration, explicit source-preserving adoption, and
reviewed private archive promotion of a sanitized summary with source hashes.
See [the exact contract](cloud-goal89-design.md) and
[acceptance/source audit](cloud-goal89-validation-plan.md).

Accepting A plus that contract satisfies the human design choice needed to
implement Task849/850, synthetic Test495 and Task851's qualification work in the
existing Goal89 stacked draft PR. It does not authorize a merge, publication,
tag, deployment, professional adoption, external storage provider action,
Goal90 implementation or a waiver of checks. Chk675 stays backlog until that
actual decision is recorded; it is not silently approved by this draft.
