# Goal89 working storage design review

Status: proposed contract for Task848 / Chk675; feature implementation and
acceptance remain NOT_RUN. Target version is 0.6.2, unreleased. This document
does not record Nick's design approval.

The single [morning decision request](cloud-goal89-morning-decision.md) separates
Nick's existing instructions from the genuinely missing policy choices.

## Authority and custody

The parent reports corrected independent PR11 review GO for the Goal89
prerequisite at `1a3cf4f45621cd67b51aba482966927aeea17419`. Both preservation
findings are closed. Parent-reported native Mac ARM64 results are 45 source
cases and 26 installed controls passing on each Node24.18 and24.21; the cloud
worker did not access that machine. Release remains NOT_READY.

Only `nickreames/mdkg`, cloud worktree `/workspace/mdkg-cloud-goal89`, branch
`cloud/goal89-persistent-working` is owned for this step. It starts at exact
reviewed `1a3cf4f45621cd67b51aba482966927aeea17419`; the design-only draft PR base
is `cloud/goal88-minimal-init`. This remains the sole Goal89 stack slot; feature
changes may be added only after Chk675's human decision. PR10 and PR11 remain
open, draft and unmerged.
Planning remote head is `ddafe0836fdc790cd36ba203afbcfc1878bbddd8`.
The explicit sequential run authority supersedes the old plan-merge prerequisite
and permits this stack branch; it does not authorize other branches, publishing,
tags, deployments, external providers, CI policy changes or Goal90.

## Storage audit and proposed boundary

Existing `.mdkg/work` contains canonical work nodes and semantic work contracts;
the existing `work` CLI family must keep that meaning. `.mdkg/archive` has
supported canonical sidecars, retained sources and deterministic ZIP caches.
`.mdkg/artifacts` contains explicit evidence; `.mdkg/pack` is derived context;
`.mdkg/state` is checkout-local control state; `.mdkg/db` is application state
with separate sealed snapshot contracts. None is a disposable working store.
No pre-existing `.mdkg/working` was found in this owned checkout. This absence
is not permission to adopt similarly named contents in consumer projects.

Recommend `.mdkg/working` and the `working` CLI family. Scope is the current
root graph only in 0.6.2; reject workspace or sibling selection rather than
quietly switching graphs. Goal90 owns independent sibling selection.

Proposed tree:

```text
.mdkg/working/
  manifest.json
  entries/<work-uuid>/...           # explicitly imported mutable files
  quarantine/<operation-uuid>/<work-uuid>/...
  journals/<operation-uuid>.json
  receipts/<operation-uuid>.json
```

The versioned manifest binds one store UUID, graph format and graph identity
where supported. Format-v2 uses the verified canonical `graph_id`. Format-v1
uses a distinct `legacy-working:<store-uuid>` namespace, explicitly labelled
as a working-store namespace, never a synthetic canonical graph ID. No implicit
graph migration, numeric node allocation or selected-goal change occurs.
Entries use opaque `work-<uuid>` IDs, owner, timestamps, active/retained/retired
state, explicit pins/work references, inventory hashes and persistence policy.
Quarantined/purged placement is distinct from activity state. Unknown schema,
graph mismatch, duplicate IDs, malformed ownership or unknown journal content
refuses mutation. Files in entries may be edited deliberately; the current
inventory is inspected and bound afresh before any cleanup or promotion.

Proposed schema-v1 fields are `schema_version`, `store_id`, `graph`, `entries`
and `operations`. `graph` records `format_version`, `namespace` and v2-only
`graph_id`. An entry records `id`, `owner`, `created_at`, `updated_at`, `state`,
`pins`, `work_refs`, `inventory`, `persistence`, `placement` and `promotions`;
optional `expires_at` is advisory only. Each inventory record is a contained
relative payload `path`, `sha256`, `bytes` and `mode`; directory records are
separate so empty directories are not silently lost. Paths for metadata and
entry roots derive from validated UUIDs, never arbitrary manifest paths.
`placement` identifies live/quarantined/purged and the admitted operation UUID.
Operation records bind approved plan hash, selected entry IDs, retention policy,
quarantine time, completion state and receipt hash. A separate strict journal
holds the prepared before/after transition and progress. Reject unknown keys
and incompatible schema versions rather than silently discarding metadata.
Owner strings name local custody and do not claim authentication or remote
identity. Format-v1 `work_refs` are explicit root QIDs; v2 references require
immutable local identity. Persistence defaults to `local-ignored`; promoted
archive refs/digests are explicit evidence, never a claim that private raw scratch
is tracked or backed up.

## Proposed command and approval grammar

Read-only `working list/show/search/verify` never creates, adopts or cleans a
store. Ordinary graph search/index/capability/pack excludes working content.
Explicit `working search` searches only manifest-owned entries in this graph.

Mutating commands use explicit selections and existing graph writer admission:

- `working init`: preview storage creation and ignore changes; apply only the
  exact reviewed hash. Existing nonempty/custom storage refuses automatic init.
- `working add --file <contained-source> --owner <identity>`: preview copy into
  a new opaque entry; apply the reviewed source/inventory hash. Preserve source.
- `working adopt --file <existing-custom-path> --owner <identity>`: explicit
  previewed copy into owned entries; preserve the original custom path and bytes.
  Never recursively seize an unmanaged directory or reserved metadata path.
- `working retain/release/pin/unpin <id>`: preview owner/protection change and
  apply the exact hash. Only explicit release ends active custody. Releasing a
  foreign/stale owner requires its exact recorded identity plus explicit
  operator confirmation that the writer is stopped; age/PID absence never does.
- `working promote <id> --summary <file> --archive-id <id>`: preview the reviewed
  summary and source hash into the supported local private archive authoring
  surface. Require an explicit destination ID; refuse existing destination or
  repeated promotion rather than duplicating evidence silently. Record stable
  evidence/source links; retain the mutable original. Existing node authoring
  remains available separately for canonical summaries from retained evidence.
- `working gc <id...>`: preview only; refuse active, pinned, claimed-current-goal
  or still-active canonical-work references. Apply moves selected owned entries
  to quarantine, never final deletion.
- `working recover <operation-id>`: preview exact retained restoration; refuse
  target conflicts and unknown contents. Apply restores original bytes.
- `working purge <operation-id>`: a separate fresh preview after configured
  retention, followed by exact-hash apply. State that selected bytes cease to be
  recoverable through mdkg. Preserve a nonsecret receipt of the loss.
- `working policy <operation-id> --retention-hours <positive-duration>`: preview
  an explicit quarantine policy change; apply only its reviewed hash. A newly
  finite window starts when that policy is applied, never retroactively expires
  an indefinitely retained entry.
- `working resume <operation-id>`: inspect and explicitly resume an admitted
  incomplete journal; no automatic recovery during unrelated commands.

Recommend a default **indefinite quarantine retention**. A GC preview can
explicitly choose positive whole retention hours for its selected entries; the
window starts when quarantine completes. A
separate hash-bound policy change is needed to make an indefinite quarantine
eligible for purge. Expiry only permits a later explicit purge preview; it
never deletes or silently releases work. No cron, background cleanup or
automatic expiry behavior is added.

Plans bind graph/store identity, selected paths and file hashes, current manifest,
owner/pins/goal protections, policy, operation and destinations. Apply rechecks
all inputs under the writer lock. A stored plan and its explicit hash authorize
only that selection. Root-relative plan/output paths are admitted before effects.
Stale approval or newly active/pinned work refuses without moving entries.

## Transaction and filesystem contract

Use existing contained filesystem sinks, Git metadata admission and mutation
locks. Validate all selected source/destination trees before publishing intent;
reject absolute/traversal/case aliases, symlinks, hardlinks, special files and
native Git metadata. Recheck path custody at each sink, including renamed-parent
controls. Portable limits from Goal87 remain explicit; no new race/ACL claim.
The working layer must bind visible ancestor device/inode identities between
admission and each sink; the generic contained sink alone does not pin a prior
parent across separate calls. It still cannot provide a portable openat guarantee
against a noncooperating writer racing within a single call.

Before the first move/write, publish an exclusive versioned journal with the
approved plan and exact before/after inventories. Move one selected entry at a
time, updating durable journal progress; manifest transition and completion
receipt follow the admitted moves. Resume proves each expected before/after
location and digest; refuse duplicates, unknown files, mismatched identities or
ambiguous progress. Recovery needs exact retained bytes and explicit quiescence
when prior writer custody remains. Never infer stopped ownership from missing
PID. Fault fixtures must cover every journal/rename/manifest/receipt boundary,
including repeated resume/recover and retained purge policy.

## Exclusion and persistence contract

Generated Git ignore includes `.mdkg/working/`; preserve custom ignore policy and
preview changes for existing stores. npm/Docker already exclude `.mdkg`, but
package inventory must prove absence. Bundle/graph transport excludes working
independently of `.gitignore`, including explicitly tracked working bytes and
registered workspace roots. No ordinary export turns scratch into graph truth.
No private scratch is staged merely to keep it durable.

Deliberate persistence uses reviewed sanitized summary/evidence promotion to the
supported archive/artifact surface, with explicit local export and digest-bound
restore rehearsal. A separately authorized user may track selected sanitized
artifacts; the worker does not force-add scratch. External provider setup/upload
is outside this scope. Export/restore is explicit and excludes unrelated work.

Persistent means mdkg does not automatically delete accepted entries between
commands/processes. A saved cloud restart may retain files; that label does not
prove backup or replication. Worktree removal, checkout deletion, reprovisioning
or host loss can destroy ignored entries. Synthetic deletion/recreation tests
must demonstrate loss without the selected retained export, and restoration of
only explicitly exported bytes. Retention expiry is eligibility, not a backup.

## Review and validation still required

Chk675 needs Nick's review of names/schema/namespace, release and retention
policy, promotion scope, adoption, persistence and transaction boundaries.
Task849 feature implementation is dependent on that contract; this proposal
does not mark Chk675 complete or invent its approval.

The parent explicitly authorized committing/pushing checked audit/design
documentation and a clearly labelled design-only draft against the Goal88
branch while Nick is asleep. This changes only documentation publication
authority; Task849 feature writes remain blocked at the human design gate.

Test495 requires source and exact-installed-tarball controls for persistence,
idempotency, adoption, exclusion, explicit search/promotion, active protection,
stale plans/owners, interruption/resume/recovery/purge, boundary failures and
synthetic export/checkout-loss/restore. Task851 retains full appropriate checks,
unchanged coverage floors, all 37 package smoke definitions and declared platform
and security acceptance. Chk676/677 stay incomplete while required evidence is
missing. A Goal89 draft implementation checkpoint cannot imply publication or
professional adoption readiness.

Inherited baseline limitations remain separate: Goal88 hosted run36978309547 at
reviewed head1a completed/cancelled; both fast gates cancelled at895/893seconds,
setup/bootstrap/uploads passed. Timing matches the configured15minute budget
but neither timeout nor cancellation actor/root cause is established. Four full
jobs are expected PR-trigger skips. Existing artifact export is blocked by prior
403 and the32MiB tool limit for roughly480MB archives; no bypass/retry was made.
Owner needs small progress/receipt/logs/coverage.log and available summaries
before CI remediation. The unchanged demo fixture mode seal and site pass5
command-spelling failures, historical unclassified hosted failure and broader
platform gaps remain release NOT_READY; no gate is waived.
