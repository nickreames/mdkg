---
title: Persistent Working Storage
description: Keep local drafts separate from canonical graph records with explicit cleanup and promotion.
---

The unpublished 0.6.2 candidate adds `mdkg working` for local drafts under ignored
`.mdkg/working/`. Fresh init retains a separate host marker. Existing legacy
graphs opt in explicitly, without canonical node migration; v2 uses its graph ID.
Custom scratch and unknown metadata are preserved and refuse implicit adoption.
Repeated init preserves existing legacy working paths and their Git visibility.
Explicit working opt-in accepts an absent, empty or authored `.gitignore` and
previews its exact update. Managed child payload stays private when read through
a legacy parent's ordinary graph commands.

Every mutation first previews JSON. Save that plan outside working, inspect its
entries/effects, then use its exact `plan_hash` in place of `PLAN_HASH`:

```bash
mdkg working init --json > working-init-plan.json
mdkg working init --apply --plan working-init-plan.json --plan-hash PLAN_HASH --json
mdkg working add --file draft.txt --owner alice --json > working-add-plan.json
mdkg working add --apply --plan working-add-plan.json --plan-hash PLAN_HASH --json
mdkg working list --json
mdkg working show ENTRY_ID --json
mdkg working search "finding" --json
mdkg working verify --json
```

`add` and `adopt` copy selected regular-file bytes and retain the source. Entry IDs
come from list/add output. Payload does not enter ordinary graph search, packs,
capabilities or bundles, including when force-tracked by mistake. Explicit working
show reveals selected payload; working search only returns matching entry metadata.
Do not place secrets in drafts or metadata.

Entries start active. Use exact recorded owner and `--confirm-stopped` only after
that writer has actually stopped. Pinning protects an entry. Active canonical or
selected/last-active goal work also protects associated entries. For every command
below, save/review the preview and apply its exact plan/hash as above:

```bash
mdkg working release ENTRY_ID --owner alice --confirm-stopped --json
mdkg working pin ENTRY_ID --owner alice --json
mdkg working unpin ENTRY_ID --owner alice --json
mdkg working gc ENTRY_ID --owner alice --json
mdkg working recover ENTRY_ID --owner alice --json
mdkg working purge ENTRY_ID --owner alice --confirm-loss --json
```

GC moves only selected inactive, unpinned and unclaimed entries to quarantine.
Quarantine is indefinite. Nothing expires or deletes automatically. Recover restores
retained bytes; separate purge deletes selected managed copies irreversibly while
preserving loss metadata and original sources. Age or missing PID never authorizes
release or cleanup. Changed inputs or protections invalidate plans.

Promotion uses an explicitly selected sanitized summary, a new archive ID and the
entry owner. It keeps original scratch and creates private deterministic evidence:

```bash
mdkg working promote ENTRY_ID --owner alice --summary-file reviewed-summary.md --archive-id archive.finding --json
mdkg archive verify archive.finding --json
```

Promotion does not sanitize automatically. Review the selected summary yourself.
Retain the resulting archive sidecar/ZIP or an external artifact with a checksum
and explicit restore selection. Ignored working files persist across commands;
they can disappear with the checkout or host. Tracking the host marker does not
back up the payload. Copying a store into a different/missing host refuses; a
same-ID clone represents the same logical graph, not authenticated checkout origin.

Inspect an interrupted operation using its original ID/hash:

```bash
mdkg working resume OPERATION_ID --plan-hash PLAN_HASH --json
```

Resume apply needs its original owner/stopped confirmation when applicable. If a
writer lock remains, first stop all checkout writers and inspect fresh evidence;
then supply that exact `lock_evidence` as `LOCK_EVIDENCE`:

```bash
mdkg working resume OPERATION_ID --apply --plan-hash PLAN_HASH --owner alice --confirm-stopped --lock-evidence LOCK_EVIDENCE --confirm-quiescent --json
```

Live, foreign, ambiguous or stale custody refuses. Pre-journal interrupted init
and malformed/truncated journals are preserved for separate explicit review;
there is no automatic takeover. A partially purged operation can finish verified
remaining deletion but cannot restore deleted bytes. Use one cooperative writer
per access-controlled checkout. This draft remains subject to independent review,
owner/local qualification and full prepublication gates.
