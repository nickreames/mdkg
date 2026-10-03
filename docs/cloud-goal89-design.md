# Goal89 working storage design review

Status: proposed contract for Task848 / Chk675; feature implementation and
acceptance remain NOT_RUN. Target version is 0.6.2, unreleased. This document
does not record Nick's design approval.

The [revised decision request](cloud-goal89-morning-decision.md) records Nick's
accepted indefinite-retention direction and the host-binding compatibility choice
still requiring review. Contract revision: **canonical-v2-host-binding-v1**.
The earlier legacy-working store namespace is superseded; its original receipts
remain historical evidence, not acceptance of the revised contract.

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
Original planning head was `ddafe0836fdc790cd36ba203afbcfc1878bbddd8`. The
2026-10-03 P2 correction is `eb4daec5bc95c20bacddeb83f0b6eb7f95f0c1c8`;
stack synchronization uses normal two-parent merges preserving original commits.
The corrected Goal88 head and merge parents are recorded in the current review
receipt. Historical prerequisite GO is not a new exact-candidate release pass.
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

Managed working storage requires an independently verified canonical format-v2
host graph. Read the actual `.mdkg/graph.json` through the existing strict
`readGraphFormat` admission before inspecting or trusting working metadata.
Bind every store to that canonical `graph_id`. Its separate opaque `store_id`
is subordinate store identity; it cannot establish, create or replace the host
identity. A copied store's own UUID or claimed graph ID proves nothing about
its destination. Path hashes and Git remote names are not graph identity.

**Legacy compatibility:** format-v1 graphs and their existing CLI behavior stay
supported, and custom scratch bytes remain untouched. Managed `working` commands
refuse nonmutatingly when canonical identity is absent, malformed or unsupported.
Before opting into managed storage, the operator must separately preview/review
and apply the existing hash-bound `mdkg graph migrate` identity adoption. No
working command implicitly migrates a graph, allocates numeric nodes, creates a
canonical graph ID or changes selected-goal state. Requiring that prior explicit
migration is a material compatibility change from the rejected legacy namespace
proposal and needs Nick's review before 0.6.2 implementation.

This also affects fresh default `mdkg init`: its current command surface creates
a legacy graph and has no v2-init option. Managed working storage would not be
available immediately after that default init. The operator must satisfy the
existing migration prerequisites first. A graph with a local Git HEAD requires
an explicit accepted ancestor and complete history; a fresh graph without HEAD
can preview explicit migration without an ancestor or first commit. There is no automatic initial commit,
ancestor selection or working-specific bootstrap in H1. That usability cost is
part of the pending compatibility decision, not an already accepted behavior.

Entries use opaque `work-<uuid>` IDs, owner, timestamps, active/retained/retired
state, explicit pins/work references, inventory hashes and persistence policy.
Quarantined/purged placement is distinct from activity state. Unknown schema,
graph mismatch, duplicate IDs, malformed ownership or unknown journal content
refuses mutation. Files in entries may be edited deliberately; the current
inventory is inspected and bound afresh before any cleanup or promotion.

Proposed schema-v1 fields are `schema_version`, `store_id`, `graph`, `entries`
and `operations`. `graph` records `format_version: 2` and the independently
verified canonical `graph_id`; a legacy namespace is not admitted. An entry
records `id`, `owner`, `created_at`, `updated_at`, `state`,
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
identity. Managed `work_refs` require immutable local v2 node identity, resolved
in the independently admitted host graph. Copied labels or root QIDs do not
implicitly remap to another graph. Persistence defaults to `local-ignored`;
promoted archive refs/digests are explicit evidence, never a claim that private raw scratch
is tracked or backed up.

## Host binding, copies, adoption and recovery

Before every managed read, write, search, promotion, cleanup, resume or recovery,
verify canonical host format/identity independently, then require exact equality
with the store's bound graph ID. Apply rechecks fresh host/store identity and
manifest bytes under existing writer admission; changing either after preview
invalidates approval. Missing/unknown identities refuse without initializing,
repairing or replacing any host/store metadata. Safe diagnostics may explain
refusal without treating foreign payload as admitted entries.

| Input or action | Required result |
| --- | --- |
| Valid v2 host A and store bound to A | Admit identity; other path, inventory, ownership and protection checks still apply. |
| Store bound to A copied into existing v2 host B | Refuse; preserve both the destination graph manifest and copied store bytes. Store UUID and claimed owner cannot authorize attachment. |
| Self-asserted legacy-working namespace or any store copied into a v1 host | Refuse; preserve absent host manifest, numeric IDs, custom data and selected state. No bootstrap from incoming metadata. |
| Same-ID v2 clone | Same logical graph identity; not a distinct independent graph or proof of per-checkout ownership. Writer custody and fresh inventory still matter. |
| Independently forked v2 graph with new graph ID | Foreign-copy refusal applies. Existing graph fork semantics supply the independent identity. |
| Host identity changes, manifest disappears or unsupported metadata appears after preview | Refuse apply/resume/recovery; preserve evidence and request explicit review. |

Explicit adoption is **data-only selected copy**, after the destination host has
an independently valid accepted v2 identity. Preview exact source files, hashes,
source/destination identities, new store/entry IDs and custody changes; apply
only the reviewed hash. Preserve source bytes, inventories and provenance. Do
not import source graph/store IDs as destination identity, or silently adopt
source owner approvals, work references, pins or active claims. Active/pinned or
foreign/stale custody cannot be released by adoption; require exact prior owner
and explicit stopped-writer confirmation or refuse. Unknown journals and custom
metadata remain evidence and are never recursively seized or purged. Adoption
cannot turn foreign metadata into an in-place repair or replace the canonical
host manifest. The earlier unbound store has no shipped compatibility guarantee;
its proposed schema is not accepted migration input.

Restart/resume uses the freshly reverified same host identity and admitted
journal. Checkout/host loss may destroy ignored bytes. A selected retained export
can be restored only to its verified same logical graph, or through the explicit
data-only adoption path into another independently identified graph. Restore
never replaces a target graph manifest to make identities match. Retained exact
payload, provenance, custody and protection checks remain required.

This is logical graph binding, not authentication, cryptographic origin proof or
per-checkout identity. An operator who can rewrite both canonical and store
metadata can falsify local declarations. Same-ID clones are intentionally the
same graph; copying their identity does not create a sibling. Cooperating writer
admission and Goal87's visible path/race/ACL limitations remain explicit. A new
legacy host nonce/device-inode identity schema would be a separate reviewed
design, not a silently substituted fix in this proposal.

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

Nick accepted default **indefinite quarantine retention**, explicit recovery/purge
and no automatic deletion as policy direction in the 2026-10-03 parent relay.
The revised host-binding contract remains unapproved. A GC preview can
explicitly choose positive whole retention hours for its selected entries; the
window starts when quarantine completes. A separate hash-bound policy change is needed to make an indefinite quarantine
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

Chk675 needs Nick's review of canonical-v2-host-binding-v1, including the
managed-storage v2 prerequisite and explicit legacy migration compatibility,
names/schema, release, promotion, adoption, persistence and transaction boundaries.
Indefinite retention with explicit recover/purge and no automatic deletion is
already accepted policy direction; it is not asked again or treated as full
design approval.
Task849 feature implementation is dependent on that contract; this proposal
does not mark Chk675 complete or invent its approval.

The parent explicitly authorized committing/pushing checked audit/design
documentation and a clearly labelled design-only draft against the Goal88
branch while Nick is asleep. The 2026-10-03 relay now permits the revised design
and synthetic test-only binding controls to be committed/pushed for review;
Task849 feature writes remain blocked at the human design gate.

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
before CI remediation. The inherited demo fixture mode seal remains a retained release failure. The
scoped pass5 spelling mismatch is fixed and its original assertion passes on
corrected Goal88 inputs, without weakening the smoke. Historical floating coverage
failures remain unclassified without the requested small extracts. The original
PR12 run36983980287 minimum job printed a passing ladder receipt before ending
cancelled; its floating job failed coverage (exit1, not timed out). Neither phase
result is a passing terminal run. See the inherited cloud review receipt for
exact job identities and current-candidate checks. Broader platform/full ladder
gaps keep release NOT_READY; no gate is waived.

Synthetic design-oracle tests exercise the existing strict canonical reader and
proposed equality/refusal contract. The oracle lives only in tests and is not a
working runtime implementation, installed acceptance or Test495 completion.
