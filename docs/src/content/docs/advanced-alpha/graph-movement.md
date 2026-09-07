---
title: Graph Movement
description: Clone, fork, import, and repair mdkg graph state with explicit id policy.
---

Graph movement commands support reusable planning templates and multi-repo demos.

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

Application requires the exact reviewed plan hash and unchanged graph/control
inputs. Durable mappings live under `.mdkg/identity/migrations/`. Private
before/after journals live under `.mdkg/state/identity-transactions/` and are
excluded from bundles. `mdkg graph recover <plan-hash>` inspects metadata;
explicit `--resume` or `--rollback` refuses changed or unowned bytes. Successful
application/recovery strictly validates authored state before rebuilding caches.
None of these commands stages files or changes Git history.

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

Local acceptance receipts under `.mdkg/identity/reconciliations/` record source
revisions, semantic bases and immutable alias/path mappings. Repeated accepted
input is a no-op, including after a committed integration was reverted. A newer
incoming descendant uses its most recent uniquely proven accepted semantic base.
Cherry-picked/deleted identities without such a receipt require explicit review
before reintroduction. Missing source objects, shallow/grafted history, ambiguous
bases, malformed receipts or a bounded-history inspection limit stop planning;
mdkg does not fetch, rewrite history or guess the missing evidence.

Application requires the exact unchanged reviewed hash and preserves Git staging,
selection, queues and runtime state. It writes only reviewed authored nodes,
additive immutable identity evidence, a private recovery journal, and validated
local derived indexes. It does not transplant source/config/docs changes or copy,
rebuild or refresh bundles and archive payloads. Missing archive payloads need a
separately authorized exact transfer before a fresh preview can pass. Recovery
uses `graph recover` and refuses changed or unowned bytes. This command is not a
Git merge command; literal unresolved Git stages must be resolved separately.

## Selected goal policy

When importing a template that should become active work, use an explicit start goal.

```bash
mdkg graph import-template ./template --start-goal goal-1 --select-goal --dry-run --json
mdkg graph import-template ./template --start-goal goal-1 --select-goal --apply --json
```

The selected imported goal should activate cleanly and competing local active root goals should pause. Import should not leave multiple active root goals.

## Branch repair

Numeric IDs are aliases, not proof of independent node creation. For an unresolved
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
