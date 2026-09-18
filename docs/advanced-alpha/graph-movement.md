---
title: Graph Movement
description: Clone, fork, import, and repair mdkg graph state with explicit id policy.
---

Graph movement commands support reusable planning templates and project memory.
This page describes the unpublished 0.6.0 candidate; final platform/security
qualification is still required. Windows remains unqualified.

They are powerful enough to change graph shape, so treat them as planned operations with receipts.

Common surfaces include:

```bash
mdkg graph clone --help
mdkg graph fork --help
mdkg graph import-template --help
mdkg fix ids --help
```

## Id policy

- Preserve ids when moving a graph into a separate repository.
- Rewrite ids when importing a template into the same graph.
- Preserve links during rewrite.
- Prefer explicit `--dry-run` receipts before `--apply`.

## Versioned identity and explicit migration

A legacy graph has no `.mdkg/graph.json`. Format v2 separates numeric aliases
from immutable graph/node UUIDs and supports stable
`mdkg://<graph-id>/<node-id>` selectors. Indexes derive identities from authored
headers; reading or indexing never performs a migration.

Use `mdkg graph migrate --help` for the explicit migration contract. Preview
requires a reviewed graph namespace and distinct branch origin UUIDs. Git
graphs also require an accepted local ancestor. Common ancestor nodes share
identity; independently created aliases do not. Unproven legacy references or
rename/recreation histories block conversion instead of guessing.

Migration inspects the full local ancestor-to-HEAD history and merge boundary
parents, plus stage-0 index and working-tree nodes. A deletion followed by a
revert, equal body text, or a rename/alias change followed by restoration is not
automatic proof of one continuous entity. Ambiguity appears in
`continuity_reviews`, with observations, reasons and an exact `review_hash`.
Supply a repository-contained `--decisions <path>` JSON object keyed by legacy
QID. Each entry requires `take` (`restore-ancestor` or `new-identity`), a nonempty
`reason`, and that exact `review_hash`. Review current inbound references too:
the choice binds all current structured links to the selected identity, while
historical bodies and external receipt text remain unchanged. Preview again with
the decisions file before applying its new plan hash with the same file.

`restore-ancestor` retains the accepted ancestor identity; `new-identity` creates
a deterministic origin-scoped recreation identity. Unknown/unused decisions and
changed review inputs fail closed. Missing, shallow, grafted or partial/promisor
history requires a separate local history audit; no fetch is attempted. History
inspection uses the existing 2,048-commit/4,096-revision bounds and the configured
`index.limits.max_total_bytes` budget for retained compact lineage observations.
Unrecorded unlink/recreate operations leaving no committed or staged trace are
indistinguishable from ordinary edits; mdkg does not invent that provenance.

Application requires the exact reviewed plan hash and unchanged graph/control
inputs. Durable mappings live under `.mdkg/identity/migrations/`. Private
before/after journals live under `.mdkg/state/identity-transactions/` and are
excluded from bundles. `mdkg graph recover <plan-hash>` inspects metadata;
explicit `--resume` or `--rollback` refuses changed or unowned bytes. Successful
application/recovery strictly validates authored state before rebuilding caches.
None of these commands stages files or changes Git history.

Reviewed v2 migration also installs the schema2 configuration writer fence as
the first authored operation; rollback restores the exact old configuration last.
Upgrade every writer before adoption. Published0.5.2 clients that honor config
versions refuse, but old init/force-init cannot be controlled retroactively.
For pre-fence v2 graphs, preview `mdkg upgrade --only .mdkg/config.json --json`
and apply only the exact reviewed plan. Reads do not silently add this fence.

For a killed writer, `graph recover` inspection reports mode-specific
`recovery.resume` / `recovery.rollback` readiness and `lock_evidence` hashes.
Pass the requested mode's exact value as `--lock-evidence <sha256>` with explicit
resume/rollback. Approval binds checkout/OS owner proof, lock chain, journal
inventory and current authored/dependency bytes. Live, suspended, reused,
foreign or insufficient ownership refuses; PID absence/age alone is never enough.
Unknown/partial metadata also refuses. Do not manually delete evidence to bypass
recovery. Complete published transaction boundaries, not universal power-loss
recovery or hostile same-user pathname-race fencing, are the supported contract.

New Git-backed migration application/resume requires reviewed continuity
evidence. An older interrupted journal without it remains inspectable and can
roll back exact owned before-bytes, but cannot resume the unreviewed mapping.
Rollback still refuses changed or unowned files; it is not identity approval.

Migration and reconciliation share a versioned candidate-validation contract.
Before any journal or authored write, the complete proposed graph is validated
against exact template inputs, canonical skills, enabled local workspace skill
metadata, mounted source snapshots, archive payloads and durable event history.
Missing imported targets are errors; registering an alias does not prove a node
exists. Root skill resolution is unchanged: a child workspace skill does not
automatically satisfy a root node's skill requirement.

Plans bind dependency contents and discovery inventories, including relevant
absent files. Template body changes, skill additions/removals and event changes
invalidate approval. Resulting nodes, identity receipts and graph/event totals
must fit their configured limits. Recovery reconstructs the intended complete
candidate from reviewed operations before resuming, rather than treating a
partially migrated graph as valid. Older plans lacking this dependency contract
remain inspectable and may restore exact owned before-bytes, but cannot resume.

Authored writes may not overlap validation dependencies. Derived cache outputs
must be distinct from authored data, skills/templates, imported or disabled
owners, execution state, journals and SQLite sidecar paths. Dedicated custom
cache locations remain supported. Existing filesystem spelling and observed
case behavior participate in collision checks; mdkg does not create probe files
or silently case-fold distinct paths on a case-sensitive filesystem. Ambiguous
ownership requires separate resolution before migration or rollback. Terminal
authored/control/dependency checks also run after cache rebuilding.

This contract does not claim that old caches already represent the proposed
graph, that native skill mirrors are synchronized, or that all applicable
validation and qualification checks have passed. Those remain separate gates;
consumer-specific validation profiles are not implemented by mdkg.

V2 same-project clones retain identities. Independent forks allocate new
identities with lineage, preserving numeric aliases and historical bodies.
Template imports allocate target-owned identities with durable mappings and
rewrite only proven structured references. A v2 template requires a v2 target.
Read-only mounts preserve source identity without granting source write access.

### Branch-local commands and execution state

V2 node creation and lifecycle commands bind structured graph references to
persisted identities. Alias/QID inputs remain convenient selectors; JSON node
receipts also expose `identity` and `stable_ref`. Task/goal lifecycle events and
explicit graph-reference events use stable targets. Existing historical event
records and prose are not rewritten.

Loop materialization allocates fresh identities for the loop and every child
before binding their cross-links. A loop-fork dry run does not reserve identities
or write state: its identity values are explicitly provisional, not a reviewed
integration mapping. Applying a fork creates a fresh independent group.

V2 goal selection stores a stable reference in checkout-local state. Readers
follow that identity if its numeric alias changes; they never silently follow a
replacement node that reuses the old alias. Missing/ambiguous identity bindings,
including legacy selection files preserved by migration, require explicit
reselection. Reads do not update the selection file. Supplying an explicit goal
selector remains independent of saved selection.

Goal claims retain their existing durable graph meaning (`active_node` and
related lifecycle), rather than becoming distributed execution leases. Selection,
transient mutation locks and runtime delivery state are checkout-local controls;
they are not merged as project knowledge. Selection is not execution authority.


### Identity command applicability and safety

The working-tree graph is authoritative before and after Git staging. No command
uses Git's staged blobs as a second mutation target. These are applicability
boundaries, not a claim that every command accepts every node type:

| Surface | Identity behavior | Invalid/unresolved graph |
| --- | --- | --- |
| show/list/search, graph refs, pack, read-only MCP | Stable selectors and additive identity; read variants retain `alias_qid` | Alias variants remain inspectable with diagnostics; ambiguous aliases fail |
| new/checkpoint/task/goal/loop authoring | Fresh identities or immutable existing identity; structured links bind before writing | Strict loading blocks ambiguous mutation |
| goal current, status, doctor | Checkout-local selection follows identity, never a reused alias | Missing/unbound selection is diagnosed, not reassigned |
| manifest/capability discovery | Fresh authored identity, not cached capability authority | Explicit stable selectors inspect alias variants |
| archive show/list/targeted verify | Stable selectors and additive identity on sidecars | Target ambiguity fails; imported archives do not grant local filesystem access |
| work order status/receipt verify, work validate | Stable selectors and bound workflow links | Strict graph/typed validation required; no successful verification of an ambiguous graph |
| next and other execution routing | Ordinary stable resolution on a valid graph | Strict loading refuses an unresolved execution candidate |
| index/validate | Derive identities from authored fields; never allocate them | Strict validation fails; unresolved inspection indexes cannot be persisted |
| graph transport | Clone retains identity; fork/import maps target ownership | Foreign identity and incompatible formats fail before adoption |

Archive verification without a target remains a raw sidecar-integrity audit;
it is not graph identity/reconciliation proof. Lifecycle operations apply only
to their declared node types, and archive compression applies only to local
archive sidecars. Event records, artifact bodies and historical evidence hashes
are not rewritten merely because aliases change. `artifact://` and opaque runtime
policy/request labels remain external semantic references.

Manifest WORK-path compatibility is retained where it resolves uniquely. New
v2 workflow authoring binds those links to stable identity, and template/fork
transport preserves typed filenames such as WORK.md and MANIFEST.md. Default
new work-order payload hashes bind graph input identities, so alias spelling
does not change a newly computed invocation hash; historical/caller-supplied
payload hashes are preserved. New v2 internal archive links bind to the sidecar's
identity, including explicit archive URIs in artifact lists. External artifact
URLs and filesystem locators in those lists remain opaque and unchanged.

JSON/SQLite command fixtures compare exact stable targets and whole-fixture
read hashes in untracked, staged and unstaged-alias-change states. Alias-change
fixtures test ordinary resolution, not semantic reconciliation acceptance;
reviewed two-branch integration is a separate proof gate.

## Reviewed identity reconciliation

On a format-v2 branch, preview against an explicitly accepted local ancestor
and incoming commit. The target is the current authored checkout, including its
uncommitted nodes; an optional target ref must resolve to current HEAD.

```bash
mdkg graph reconcile --ancestor <ref> --incoming <ref> --json
mdkg graph reconcile --ancestor <ref> --incoming <ref> --decisions <path> --json
mdkg graph reconcile --ancestor <ref> --incoming <ref> --apply --plan-hash <sha256> --json
```

Review the classifications, exact path treatment, dependency hashes, alias maps,
excluded surfaces and plan hash. Decisions are a JSON object keyed by stable
`mdkg://<graph-uuid>/<node-uuid>` references; each value contains `take` (target,
incoming or delete) and a nonempty `reason`. Supply the same decisions file when
applying that preview. Conflicting lifecycle/evidence changes are never resolved
by timestamp or an automatic list union. Body text is preserved from the chosen
input; only proven structured reference fields are rebound.

Receipts under `.mdkg/identity/reconciliations/` record source revisions, semantic
bases and immutable alias/path mappings. A receipt's self-hash establishes byte
consistency, not target acceptance. Local application additionally creates a
target-owned binding under `.mdkg/identity/acceptances/`. Replay requires either
the exact generated receipt of a verified applied local transaction, or that
exact target-owned binding with target ancestry in the current checkout or local
Git history. Later authored edits, including edits before the first commit, do
not revoke acceptance or require retaining an intermediate output snapshot.
Incoming bindings are copied byte-for-byte
under `.mdkg/identity/transported/`, where they are inert evidence; importing
another branch's acceptance does not accept its choices on this target.

Repeated accepted
input is a no-op, including after a committed integration was reverted. A newer
incoming descendant uses its most recent uniquely proven accepted semantic base.
Cherry-picked/deleted identities without such a receipt require explicit review
before reintroduction. Missing source objects, shallow/grafted history, ambiguous
bases, malformed receipts or a bounded-history inspection limit stop planning;
mdkg does not fetch, rewrite history or guess the missing evidence.

Pre-binding v2 development receipts remain usable when their genuine applied
local journal survives. Without that proof, their bytes remain evidence but
cannot supply replay authority; re-plan from the accepted Git ancestor and
review any resulting conflicts. No identities or receipt bodies are rewritten
to invent historical acceptance. Independent forks retain old-graph receipts
as inert provenance. Ordinary Git commits and same-project clone selection are
explicit trust decisions over the target graph; these bindings are not signatures
and do not defend against an actor authorized to rewrite target-owned files.

Application requires the exact unchanged reviewed hash and preserves Git staging,
selection, queues and runtime state. It writes only reviewed authored nodes,
additive immutable identity evidence, a private recovery journal, and validated
local derived indexes. It does not transplant source/config/docs changes or copy,
rebuild or refresh bundles and archive payloads. Missing archive payloads need a
separately authorized exact transfer before a fresh preview can pass. Recovery
uses `graph recover` and refuses changed or unowned bytes. This command is not a
Git merge command; literal unresolved Git stages must be resolved separately.

### Native worktree integration protocol

Use separate native Git worktrees of one project repository, one writer per
checkout. Pin target HEAD, incoming revision and common ancestor before review.
Apply the accepted mdkg reconcile plan on the target before starting a Git merge;
validate and explicitly commit that reviewed graph result. Then use native Git
for an ancestry-preserving merge of the pinned incoming revision. Resolve each
graph path against the exact reviewed result and source/configuration separately.
Never use blanket `ours` treatment for `.mdkg`. Validate the combined tree before
the merge commit, verify both parent ancestries and recheck repeated integration.

Keep local selection, indexes, locks, journals and live runtime DBs out of the
shared graph merge. Stable identity is shared project knowledge, not shared
execution ownership. Submodule/gitdir-indirection and required platforms have
separate qualification gates; ordinary worktree tests do not prove those cases.

## Selected goal policy

When importing a template that should become active work, use an explicit start goal.

```bash
mdkg graph import-template ./template --start-goal goal-1 --select-goal --dry-run --json
mdkg graph import-template ./template --start-goal goal-1 --select-goal --apply --json
```

The selected imported goal should activate cleanly and competing local active root goals should pause. Import should not leave multiple active root goals.

## Branch repair

Numeric IDs are aliases, not proof of independent node creation. For an unresolved
legacy
Git merge, repair checks the common ancestor before proposing an add/add split.
It preserves positional stage 2 and remaps stage 3; those positions do not imply
that either branch is `main`. Same-node edits, rename/delete conflicts, and
unproven ancestry require an explicit semantic decision.

Use repair planning before apply:

```bash
mdkg fix plan --json
mdkg fix ids --json
mdkg fix ids --apply --json
```

Without `--apply`, `fix ids` is read-only. An optional `--base-ref` must match the
unique common ancestor during Git-stage repair. Repair leaves Git staging
unchanged: review the resulting graph and reference notes, explicitly stage the
resolution, and validate before committing. Do not use graph movement commands
to bypass review. Reviewed identity reconciliation is separate from legacy
numeric repair.
V2 graphs refuse `fix ids`; use reviewed `graph reconcile` before native Git
integration instead of changing immutable identities through numeric repair.
