# Goal89 working storage contract

Revision: **working-host-anchor-v1** — 2026-10-03. Current 0.6.2 draft
implementation; independent exact-patch review remains pending at Chk675.
Nick accepted immediate use after fresh init, explicit safe legacy adoption,
indefinite quarantine, explicit recovery/purge and no automatic deletion. This
supersedes the unshipped mandatory-v2 prerequisite. Historical proposals and
receipts remain available at commit dbbe797430dd10654dd0371fc367ec8a4d6fb4d9;
they are not rebound to current bytes. The contract delta records this change.

## Host and compatibility

Fresh legacy init creates `.mdkg/working-host.json` outside ignored storage:
`{format:"mdkg-working-host",version:1,host_id:<UUID>}`. It is independently
retained logical host identity, with no canonical node ID changes. Repeated init
and upgrade of existing legacy graphs do not silently opt in. Explicit
`working init` previews creation of the marker and empty owned store, and apply
requires the exact saved plan/hash. Authored instructions and canonical nodes
remain unchanged. No canonical v2 migration is required.

V2 reads the existing strict `.mdkg/graph.json` independently on every operation.
Explicit working init may create the outside-store marker referencing that same
canonical ID as a persistent opt-in/privacy boundary; it creates no second v2
identity. Existing markers remain preserved. V2 host authority is graph.json,
not that marker. The owned manifest binds `{kind:"canonical-v2"|"working-host-v1",
id:<UUID>}`. Its `store_id` is subordinate store identity.

Foreign store copy, missing/changed host, malformed metadata and later legacy
canonical migration refuse without repair or rebind. Incoming store identity
never bootstraps the host. Same-ID clone retains one logical host; an independent
canonical graph ID rejects the copied store. This is not authentication,
owner verification or proof of per-checkout origin. An editor can rewrite local
declarations. Retaining host metadata in Git is deliberate; ignored payload is
excluded even when accidentally force-tracked.

Legacy explicitly registered canonical workspaces under a path named working
remain usable while no managed storage/marker exists. Opting in refuses overlap;
it never silently removes or reclassifies canonical records.
Repeated init leaves the unmanaged legacy working Gitignore rule unchanged;
explicit opt-in handles an absent, empty or authored ignore file distinctly.
Managed child boundaries are admitted relative to the outer containment root,
even when its parent is legacy and has no working host. Node/capability cache
aliases cannot authorize reads inside that child's private storage.
Unregistered scratch
is excluded from graph transport. Configured workspace, index, templates,
capability, skills and mirror paths cannot overlap managed working storage.
Fresh/default fixed graph discovery excludes it; stale node/capability cache
admission also refuses private paths. Skill cache containment remains enforced.

Custom/nonempty reserved storage and unknown files refuse. `adopt` is explicit
selected-file data-only copy from outside the reserved directory into a separately
admitted store, creating a new entry and retaining original/provenance. This
patch does not automatically relocate custom directories or import another
manifest's ownership, approvals or work references.

## Entry and command contract

Storage is `.mdkg/working`: manifest, UUID-named `entries/*.bin`, per-operation
`quarantine/<operation>/<entry>.bin`, and `operations/<operation>.json` journals.
Entry metadata binds ID, SHA256, bytes, original relative source, owner, active,
pinned, optional work reference, state, quarantine operation and promotion ref.
IDs are opaque UUIDs; no canonical numeric allocation happens during storage.
V2 associations require stable mdkg identity; legacy references are freshly
resolved before cleanup. Selected and last-active work remain protected even
when the selected goal is paused.

| Surface | Behavior |
| --- | --- |
| init | Explicit empty-store bootstrap; fresh host independently read |
| add / adopt | Selected `--file`, exact `--owner`, optional `--work-ref`; original retained |
| list / show / search / verify | Explicit working reads; no cache/store creation |
| retain / release / pin / unpin | Explicit entry IDs and owner; release additionally needs `--confirm-stopped` |
| promote | One entry, owner, new `--archive-id`, sanitized external `--summary-file`; private deterministic archive |
| gc | Selected inactive, unpinned, unclaimed live entries move to quarantine |
| recover | Selected eligible quarantined entry IDs return to live storage |
| purge | Separate selected quarantine plan with `--confirm-loss`; managed copy irrecoverable |
| resume | Original operation ID/hash; inspection first; apply requires original owner/stopped confirmation when applicable |

Mutation preview emits JSON metadata and hashes, never raw payload. Save the
plan explicitly outside working. Apply accepts only `--apply --plan <file>
--plan-hash <hash>`; selection/confirmations are bound in the plan. Sources,
configuration, canonical node bytes, independent identity, manifest and
protections are rechecked before and under the existing graph mutation lock.
Completed repeats are read-only and idempotent. Unknown/conflicting CLI flags
refuse. Read-only show explicitly reveals selected payload to its caller.

Quarantine is **indefinite until explicit purge**. There is no finite retention
policy, scheduler, automatic expiry or timestamp-based eligibility. Age and PID
absence never release active custody. Pin/activity/selected-work changes stale
an approved cleanup plan. Purge deletes only selected managed copies and retains
loss metadata; original sources and promoted evidence remain untouched.
Promotion requires the operator to supply sanitized bytes; it does not sanitize
raw scratch automatically. Private archive visibility is the default.

## Transaction and filesystem limits

Owned operation journals bind before manifest, approved plan, payload source
hashes, prepared generated metadata and existing graph lock epoch. Raw payload
is not duplicated inside journals. All effect states and store inventory are
preflighted before resume. Payload/move/delete effects publish before the final
manifest, then journal completion. Resume rederives the exact original operation,
refuses changed inputs, ambiguous duplicate moves and unknown outputs, and can
finish verified partial purge; it cannot restore bytes already deleted.

A killed writer retains the graph lock. Inspection returns a fresh evidence hash;
recovery apply requires exact `--lock-evidence`, `--confirm-quiescent` and applicable
owner/stopped confirmation through existing graph custody admission. Live or
ambiguous PID/custody refuses. The working family never treats a missing PID as
permission or clears a foreign lock.

Initial pre-journal host-anchor publication precedes journal creation. A kill in that small
window may leave a marker and retained lock without a journal. Truncated journal
publication similarly lacks admissible recovery evidence. These cases refuse,
preserve custody and need separate explicit review; no automatic takeover or
claim of universal crash recovery is made. No payload deletion occurs there.

Every selected/owned path is bounded, contained and exact; visible symlinks,
hardlinks, special files, case/Unicode aliases, traversal, nested Git/bare stores
and actual redirected Git metadata refuse. Parent device/inode identities bind
an admitted operation across effects. Existing portable filesystem helpers are
reused; this is not openat/ACL/authentication protection against a concurrent
hostile writer. One cooperative writer per access-controlled checkout is required.
Limits: 1 MiB per payload, 1024 manifest entries, 128 selected entries, 260 effects,
4096 inventoried objects and 8 MiB per saved plan/journal.

## Durability and checkpoint

Ignored storage survives normal CLI restarts, not checkout or host deletion.
Git tracking of the marker does not back up ignored entries. Deliberately retain
reviewed sanitized archive ZIPs or external artifact evidence with checksums and
explicit restore selections. Selected restore is data-only copy into a verified
host; it cannot replace identity or trust incoming custody. No provider upload,
company data, implicit migration, sibling registry or Goal90 behavior is included.

The validation plan distinguishes focused draft evidence from full pre-merge,
prepublication, owner/local and native platform qualification. Chk675 review,
Chk676 owner/local acceptance and Chk677 release readiness are not marked done.
Goal89 remains open and release NOT_READY. The prior Goal88 independent correction
review at ce53 is complete for its bounded prerequisite; it grants no merge or
publication authority. PR10/11/12 remain draft, open and unmerged.
