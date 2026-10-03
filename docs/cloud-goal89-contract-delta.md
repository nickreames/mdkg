# Goal89 contract delta: immediate fresh use — 2026-10-03

Revision: **working-host-anchor-v1**. This supersedes the proposed mandatory-v2
prerequisite, not the historical review receipts. Nick accepted immediate working
storage after fresh init and an explicit safe path for existing graphs. He also
accepted indefinite quarantine, explicit recovery/purge and no automatic deletion.
Those directions authorize implementation; exact patch review is still pending.

## Identity and compatibility delta

- Existing v2 graphs use the strict existing `.mdkg/graph.json` graph_id reader.
  No second canonical identity is created for them. Explicit working init may
  retain the same ID in the outside-store marker as an opt-in/privacy boundary;
  graph.json remains the v2 identity authority.
- Fresh legacy initialization creates an independently retained
  `.mdkg/working-host.json`: `{format:"mdkg-working-host", version:1, host_id:<UUID>}`.
  It lives outside ignored `.mdkg/working/`, contains no node IDs, and is eligible
  for deliberate Git tracking. It never changes canonical node identities.
- Existing legacy graphs do not acquire that marker during repeated init or
  upgrade. Explicit `working init` previews its creation and an empty owned store;
  hash-bound apply preserves canonical nodes, config and authored instructions.
  Custom/nonempty stores or existing malformed markers refuse without adoption.
  Existing legacy registered canonical paths named working remain usable until
  explicit managed opt-in, which refuses their overlap.
- Host identity is read independently and freshly for every operation, before
  trusting the store. The store binds `{kind:"canonical-v2"|"working-host-v1", id}`;
  its own store UUID is subordinate. Copying only A's store into B refuses.
  Missing/replaced host metadata or later canonical migration changes the binding
  and refuses; no auto-rebind or replacement of host metadata is performed.
- Retaining an anchor with a clone deliberately preserves the same logical host;
  a fresh independent host has a new UUID. V2 forks reuse existing new-graph-ID
  semantics. This is logical binding, not authentication or per-checkout proof.
  A local editor can rewrite both declarations. Legacy clone/transport retains
  the marker as identity metadata; unpromoted working payload remains excluded.
- Existing custom scratch is copied only through explicit selected-file adoption
  into an admitted empty/owned store; original bytes remain. Unmanaged content at
  the reserved store path is never renamed, deleted or silently seized. A changed
  host's old store is preserved and requires a separately explicit data-only path;
  this patch does not silently migrate it or trust incoming owners/work approvals.

## Small patch implementation boundary

Keep `.mdkg/working` and `working` as proposed. Commands preview by default;
JSON plans carry hashes and generated opaque IDs, never raw payloads. Apply reads
the saved plan with its exact hash, rechecks source/manifest/identity/protections
under the existing graph lock, and journals owned effects before publication.
Read-only list/show/search/verify never creates a store. Source add/adopt retains
originals; promotion accepts an explicitly selected sanitized summary and uses
supported private archive evidence via an explicit `--summary-file`. GC only quarantines selected inactive,
unpinned, unclaimed entries. Age or missing PID never releases custody.
Recover selects entry IDs and restores retained bytes; purge is separately previewed, explicit and
irreversible. Default quarantine is indefinite, with no scheduler/auto expiry.
Persistence across commands is not backup; checkout/host deletion can lose ignored
data. Explicit export/restore tests demonstrate the difference.

Focused acceptance includes fresh bootstrap/repeated init; existing legacy
preview/apply without node migration; existing v2 reuse; different-host copy,
missing/changed/malformed marker and migration refusal; same-host clone and
independent v2 fork; stale plans; custom files; mirror/instruction preservation;
source persistence, explicit promotion and export; ordinary graph/pack/capability/
bundle/package exclusion; active/pinned/selected-work guards; quarantine/recover/
purge; interrupted journal resume; symlink/hardlink/Git metadata and renamed-parent
refusal, each with an admitted positive control. Use synthetic source and exact
installed-package fixtures, with actual native runtime identities in receipts.

The compatibility choice is now explicit: a small separate legacy host marker
supports immediate use without full node migration. Losing or changing that
marker cannot be repaired by trusting an incoming store. No further owner choice
is inferred or requested before this bounded implementation. Independent review
may require corrections; it is not marked complete. Goal88 ce53 independent correction review is complete for the bounded
prerequisite; full release qualification remains separate. Goal90 remains excluded until the next sequential checkpoint.

Initial anchor publication precedes journal creation. Killed pre-journal custody
and truncated journals are preserved and refuse automatic recovery/takeover;
separate explicit review is required. No universal crash-recovery claim is made.
