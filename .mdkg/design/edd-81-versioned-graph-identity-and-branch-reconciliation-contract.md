---
id: edd-81
type: edd
title: Versioned graph identity and branch reconciliation contract
tags: [alignment-002, execution-authorized]
owners: [mdkg-project-agent]
links: []
artifacts: []
relates: [goal-82, task-819, task-820, task-821, task-822, test-475, test-476]
refs: [dec-93, task-363, test-151, goal-17, goal-18]
aliases: []
created: 2026-09-05
updated: 2026-09-06
---

# Overview

Approved design/work boundary for a complete branch-safe identity slice.
Goal: normal mdkg work remains usable in separate offline developer branches,
then integrations reconcile identity and semantics with reviewable evidence.
Explicit Goal 82 Run now authorizes the bounded implementation. This design
record fixes contracts before command consumers are wired; it does not migrate
this checkout or authorize Git publication.

# Architecture

Separate three problems:
1. Different immutable identities sharing a human alias: allocate a new incoming
   alias without changing identity; preserve accepted target aliases.
2. Same identity with conflicting edits: compare accepted ancestor, target and
   incoming values. Never split one node merely because both Git stages share
   an alias, and never resolve lifecycle conflicts by newest timestamp/done wins.
3. Checkout-local selection, execution claims and locks: not canonical graph
   facts and not inputs to project knowledge union.

Existing numeric repair is a legacy compatibility path, not a durable identity
model. Separate draft/promotion node types are rejected: branch-local authored
nodes are ordinary nodes supported by all applicable graph-facing commands.
Single-writer-on-main remains valid and does not require a branch manager.

# Data model

Use immutable graph identity plus immutable node identity, with type-number
aliases retained for people and file names. Machine-resolved semantic links bind
to identity; readable aliases are labels that may change during integration.
A stable-reference selector must distinguish graph identity from workspace
mount alias. Normal alias input resolves in the current graph; ambiguity fails.

Design default: opaque UUID identities for new graphs/nodes using local secure
random allocation without a central service. The durable identity and mapping
live in authored graph data; JSON/SQLite indexes are rebuildable projections.
Content hashes are evidence, never mutable-content-derived node identities.

Introduce a versioned graph-format manifest separate from package version,
config schema and SQLite schema. It declares format version, graph identity,
reader/writer compatibility and migration provenance. Unknown incompatible
formats are not writable; read diagnostics explain the required capability.
Keep legacy v1 readable. Do not silently auto-migrate on read, new, index, pack,
repair, checkout, or upgrade.

Legacy migration uses one accepted ancestor identity map before independent
branch writes where possible. For already divergent branches, shared ancestor
nodes receive one reviewed common map; branch additions receive distinct
origin-grounded identities. Never derive identity from alias alone on both
branches. Preview must be repeatable without reserving identities or writing
caches: require explicit stable migration namespace/input where necessary,
then derive proposed mappings from accepted origin evidence. Exact serialization,
selector spelling and manifest compatibility rules must be fixed and fixture-
tested in task-820 before implementation consumers are enabled.

Persist integration mappings with graph identity, input revisions/tree hashes,
input node identities, old/new aliases and paths, reference decisions, exclusions,
output hashes and explicit unresolved conflicts. Re-indexing consumes these
authored decisions; it does not silently assign identities or reinterpret refs.

# APIs / interfaces

## Format-v2 serialization for task-820

- The owning checkout's `.mdkg/graph.json` declares `format: "mdkg-graph"`,
  `format_version: 2`, immutable `graph_id`, `reader_min: 2`, `writer_min: 2`,
  and `required_features: ["node-identity", "stable-references"]`.
  Optional `lineage` identifies an independent fork's source graph and input
  hash; optional `migration_receipt` names a contained authored receipt.
- Absence means legacy v1. Config/package/SQLite versions remain independent.
  Unknown versions, minimum capabilities, required features or malformed fields
  fail closed before writes. No index supplies missing identity. Existing init
  remains compatible; explicit graph migration is the v2 opt-in/adoption gate.
- Each v2 node stores `graph_id` and `node_id` as lowercase UUID strings beside
  its unchanged `id` alias. Both fields are required together. A foreign graph ID
  cannot become locally owned simply by copying a node file.
- Stable selectors are `mdkg://<graph-id>/<node-id>`. They contain no mount alias
  or filesystem path. Alias and QID outputs remain compatible; stable identity
  is additive. Duplicate aliases require explicit identity/variant inspection
  and block ambiguous mutations; no index may silently choose the first node.
- New identities use local random UUIDs. Deterministic migration proposals use
  domain-separated SHA-256 namespace/origin inputs rendered as UUID version 8;
  mutable body content is not an identity input or authority credential. Existing
  identities are never regenerated by indexing or ordinary commands.
- Legacy migration requires an explicit graph namespace and branch origin.
  An accepted Git ancestor grounds common-node mappings; distinct branch
  additions use distinct origin inputs. The reviewed receipt records input
  revisions/hashes, origin, old alias/path, stable identity and output hashes.
  Unproven rename/recreation mappings require explicit decisions, not alias-only
  unification. Stable structured references replace proven local graph refs;
  historical prose/external receipt bodies remain unchanged with provenance.
- Preview computes the complete plan without reserving identities, changing
  selection, creating locks/caches or touching Git metadata. Apply requires the
  exact reviewed plan hash and unchanged graph/Git inputs. Contained authored
  migration/mapping receipts live under `.mdkg/identity/`; a private operation
  journal under `.mdkg/state/identity-transactions/` supports bounded
  resume/rollback of only exact owned before/after bytes. Journal inspection
  omits raw bodies; journal files are private mode 0600, not portable receipts.
  Derived caches are rebuilt only after strict authored validation.
- The same-project branch shares graph identity; an independent fork receives a
  new graph identity plus lineage. Template nodes become target-owned identities.
  Read-only mounts retain source identity and never imply source write authority.

These choices implement the approved defaults; they are not canonical adoption,
release approval, or a new distributed execution policy.

## Reviewed integration

Extend existing repair planning/application and shared graph loading/resolution
rather than bypassing normal commands through a new reduced-function draft API.
Future preview accepts explicit ancestor, target and incoming revisions and
worktree/index fingerprints. A reviewed plan names all writes and generated
exclusions. Apply requires that exact plan and unchanged inputs; current fix
apply recomputing a plan is insufficient for reviewed-plan binding.

Normal reads and authorized mutations see staged, unstaged and untracked authored
nodes in the current branch working tree. Git's index is not a second writable
graph. An optional staged-view inspection remains read-only. Literal unresolved
conflict markers/identity ambiguities support diagnostics and explicit variants,
but mutations and successful strict validation fail until resolved.

Audit every graph consumer: new/show/list/search/pack, task/goal/loop/checkpoint,
refs, event mirrors, archive/work/manifest references, import/export, validation,
index and read-only MCP. Preserve existing outputs compatibly by adding stable
identity rather than replacing alias/QID fields without a version boundary.

Reconciliation never stages files implicitly. Git add/commit/merge/rebase/push
are separately authorized operations. ID remapping is not Git history rewriting.

# Failure modes

- Use stage 1/common ancestry to distinguish add/add from modify/modify;
  handle deletes, renames and missing ancestor explicitly.
- Same identity and same content is a no-op on repeat integration/cherry-pick.
  Same identity with divergent content is one conflicted node, not a duplicate.
- Alias allocation is deterministic for fixed target/incoming evidence and
  persisted mappings; repeated integration must not renumber again.
- Cross-linked incoming nodes use a complete mapping before any rewrite.
  Do not use unscoped substring replacement, including task-1 inside task-10.
- Bare legacy mentions lacking provenance are ambiguity, not permission to
  rewrite. Preserve immutable external receipt bodies; interpret historic alias
  refs using graph/revision mapping. Unknown provenance stays explicit.
- A revert restores historical identity. Intentional recreation uses a new
  identity; integration must not silently resurrect reverted work.
- Plan preflights all paths, reference ambiguity and generated exclusions;
  stale baseline, writer collision or unsafe containment blocks before writes.
  Fault-injection receipts must support bounded recovery without overwriting
  unrelated changes. A tolerant cache rebuild is not proof of graph integrity.

# Federation and ownership

Branches of one project share graph identity. An independent project fork gets
a distinct graph identity and source-lineage mapping; imported templates become
new target-owned nodes with mapped references. Read-only subgraph mounts preserve
source identity and use mount aliases only for display/resolution. A graph-ID
mismatch cannot be flattened into the same ownership domain by alias repair.
Transport format negotiation and legacy rejection must be explicit.

Full writable federation, distributed scheduling/leases, remote skills,
cross-project self-improvement and policy promotion are deferred. Generic mdkg
owns identity/contracts; runtimes own execution enforcement. This slice neither
rewrites children nor imports private orchestration policy.

# Observability

Report classification reason, ancestor evidence, maps, unresolved references,
exact authored writes, generated paths, validation results and receipt hashes.
A successful receipt requires strict authored graph validity, not merely parsed
output or a tolerant cache. Preserve existing historical events/receipts; add
new provenance without rewriting their bodies.

# Security / privacy

No credentials, provider actions, implicit remotes or automatic Git staging.
Reject unsupported formats and unsafe links/paths before writes. Never treat
imported evidence or runtime claims as authority to mutate an owning project.

# Testing strategy

test-475 covers identity/migration and ordinary-command parity.
test-476 covers two-branch integration and semantic/reference safety.
Extend test-151 for observational previews and write/recovery gates.
Goal 17 add/add tests and Goal 18 graph transport tests are historical foundations,
not substitutes for the new same-node and replay fixtures.

# Rollout plan

1. task-819: first correctness increment, ancestor-aware classifier and tests.
2. task-820 after task-819: format/identity contract, v1 reader and explicit
   migration preview/application in disposable fixtures; no canonical migration.
3. task-821 after task-820: shared resolver and all graph-command compatibility.
4. task-822 after task-821: reviewed reconcile/apply, receipts and recovery.
5. test-151, test-475 and test-476 prove the complete slice. First increment
   completion alone cannot achieve goal-82.
6. Actual repository migrations, adoption, commit/push or release each require
   fresh scope approval. Implementation is authorized by the explicit Goal 82 Run;
   later adoption/publication remains separately gated.
