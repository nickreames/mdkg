---
id: edd-83
type: edd
title: Cloud planning contract for three patch releases
tags: [cloud-planning, design-only]
owners: []
links: []
artifacts: [docs/cloud-planning-experiment.md]
relates: []
refs: [goal-41, goal-81, goal-82, goal-87, edd-56, edd-80, edd-81, dec-52, dec-93, dec-94, dec-98, dec-100, epic-257, goal-88, goal-89, goal-90, task-856]
aliases: []
created: 2026-10-02
updated: 2026-10-02
---

# Overview

Nick's first cloud-only planning PR defines exactly three new goals, delivered
sequentially as patch releases through pre-publication readiness. This is a
documentation/design proposal. Nick reviews and merges it before any feature implementation. A later
explicit Run instruction must authorize each implementation's owned scope.

| Order | Goal | Provisional patch release | Scope | Final checkpoint |
| --- | --- | --- | --- | --- |
| 1 | goal-88 | 0.6.1 | Minimal init; preserve configurable skill mirrors | chk-674 |
| 2 | goal-89 | 0.6.2 | Persistent working artifacts; explicit promotion and GC | chk-677 |
| 3 | goal-90 | 0.6.3 | Explicit selection of independent sibling graphs | chk-680 |

These versions are planning metadata, not package bumps or claims of shipped
features. At the verified base, package.json/package-lock.json and public npm
latest are 0.6.0. The supported engine is >=24.18.0 <25. GitHub releases returned
an empty list; the newest fetched tag was v0.3.9, so tags are not current release
authority. Recheck main, registry, release records and compatibility before each
implementation and candidate freeze; renumber targets if needed. A breaking
contract requires a separately reviewed SemVer decision under rule-5.

# Authority and boundaries

Allowed now: source/graph audit, synthetic disposable fixtures, supported CLI
node allocation, planning documents, checks, isolated cloud worktree/branch,
commits, push of this branch and one draft PR. Only nickreames/mdkg is in scope.
Repository identity was established from Git remotes before reading content.
No company graph/data access or upload is authorized.

The unfinished full-history git-gud completion gate is waived only for this
cloud documentation/design PR. All implementation and local history/cleanup
gates remain. Never access Nick's Mac, copy unpublished local changes, rewrite
history, amend shared commits, force-push, change main, merge, publish/tag,
deploy, touch production/resources/credentials, or refresh existing bundles and
subgraphs in this task. Successful checks do not grant those actions.

The sole planning writer uses native Git worktrees and mdkg's supported locked
numeric allocation. This checkout has no .mdkg/graph.json and remains legacy v1;
do not migrate it to create this plan. goal-82/edd-81/dec-94 already define stable
identity and reconciliation. Branches of one graph retain its identity; a
sibling graph is independent. Numeric aliases can collide with unpublished Mac
or concurrent branches: re-inventory the target at integration, review conflicts
using the existing identity/repair contract, and never overwrite by alias alone.
Cloud goal-current returned none; do not import or change Mac selected-goal state.

# Source-grounded audit and reuse

| Surface | Current evidence at base | Planning consequence |
| --- | --- | --- |
| Fresh init | src/commands/init.ts; assets/init; synthetic fresh/repeat audit: 94 files and unchanged path inventory | Defaults already compact; only root instruction policy is new |
| Root outputs | AGENTS.md, CLAUDE.md, .gitignore, .npmignore | Desired generated root instruction is AGENTS.md only; ignore policy remains |
| Canonical bootstrap | .mdkg/config.json, README.md, AGENT_START.md, CLI_COMMAND_MATRIX.md, llms.txt; core docs/pins; templates; skills/registry; init manifest; work/events/events.jsonl | Keep canonical content under .mdkg; classify every generated artifact, not just wrappers |
| Repeated init | Source preserves existing files/managed sections absent explicit force; synthetic repeat succeeds | Future tests must prove byte preservation, not merely equal file counts; audit force separately |
| Upgrade | src/commands/upgrade.ts; reviewed plan hash, backups/journal; known legacy root AGENT_START.md/CLI_COMMAND_MATRIX.md/llms.txt become redirects, unknown/custom bytes preserved | Extend provenance-aware migration; do not delete by filename |
| Skill mirrors | customization.skill_mirrors.targets; skill sync with internal audit/pruning; .mdkg-managed.json | Already configurable since goal-41/task-596/test-303/dec-52/edd-56; preserve BOTH .agents/skills and .claude/skills with extra destinations |
| Prior bootstrap | goal-81/task-816-818/test-474/chk-564/edd-80/dec-93 | New goal is an incremental root-policy change; do not reopen achieved work or duplicate it |
| Working storage | No scratch/working command found in source/matrix; canonical node scan uses core/design/work plus archive sidecars | Ad hoc .mdkg/working is not a supported lifecycle; define an excluded working surface |
| Related storage | Archive sidecars/source ZIPs, generated packs/index, upgrade journals, DB runtime/state, artifacts and handoffs already exist | Reuse explicit archive/promotion concepts where suitable; preserve their distinct semantics |
| Graph ownership | Config requires workspaces.root.mdkg_dir = .mdkg; registered workspaces share a root index; subgraphs are read-only snapshots | Neither mechanism is independent writable sibling graph selection |
| Identity | goal-82/edd-81 and graph clone/fork/migrate/reconcile/recover | Reuse stable identity; never invent merge-queue ID promotion or implicit federation |

The mdkg repository's maintained root AGENT_START.md/CLAUDE.md/command matrix
are source/reference inputs, not automatically removable consumer scaffold.
No root files are removed by this planning PR. Goal1 must inventory fresh,
repeat, --agent, --graph-only, invalid combinations, supported legacy upgrades,
custom overlays, missing/edited manifests and explicit force behavior. Audit
all created/skipped/updated paths, ignore edits, registry/pins, events, manifests,
mirror ownership and transactional outputs. Root README/LICENSE and authored
public discovery assets are user/project content, not cleanup candidates.

# Goal 1 design: minimal init and mirrors

Fresh default/--agent init generates AGENTS.md as the sole root instruction
file. AGENTS contains a small managed router into .mdkg/AGENT_START.md and
focused help/skills. Retain necessary startup guidance under .mdkg; evaluate
whether AGENT_START's body can shrink or merge, with link inventory and explicit
redirect policy. Do not add another root instruction file. Graph-only remains
explicit and does not gain wrappers or skill outputs accidentally.

Stop generating root CLAUDE.md in new installs. This is mdkg's policy choice;
no claim about Anthropic discontinuing CLAUDE.md is needed or made. Continue
syncing canonical .mdkg/skills to BOTH .agents/skills and .claude/skills.
Configured extras are additive in the new default profile. Preserve an existing
user-edited target list during upgrade and show an explicit reviewed change to
restore either missing required default; never silently replace custom policy.
Destination directories do not require new harness wrapper files.

Migration classifies provenance at managed-file/section level. Exact verified
generated legacy CLAUDE.md and unnecessary root startup redirects are candidates
for previewed removal/relocation only after reference inventory, canonical
destination verification and retained-original backup. Customized whole files,
unknown hashes, user instructions outside managed markers, authored CLAUDE.md,
malformed/duplicate markers, project AGENTS and operator overlays are preserved;
report conflicts and offer a scoped manual merge. Custom CLAUDE can remain even
though fresh generation stops. Treat an edited managed section as a conflict.

Use existing hash-bound preview/apply/recovery machinery and provenance
manifests, with exact paths, old/new hashes, backup refs and affected links.
Stale previews refuse. Recheck custody before every write. A reviewed --only
subset must remain link-complete. Set a documented compatibility window for
verified legacy links before dropping redirects; Nick reviews that window in
the design checkpoint. No silent deletion or destructive rollback. Explicit
force cannot become blanket consent to overwrite user content.

Mirror validation covers normalized repo-relative paths, traversal, absolute
paths, symlinks, native Git metadata, overlapping canonical/target directories,
case aliases, duplicate destinations and managed/unmanaged slug conflicts.
Sync must preserve unrelated user skills and instruction bytes; parity is
source-to-all-required-target bytes, including assets/scripts/references.

# Goal 2 design: persistent working artifacts

Working artifacts are mutable notes, investigations and intermediate outputs,
separate from canonical graph nodes and never truth merely because they exist.
`.mdkg/working` and a `working` or `scratch` CLI family are candidate names only.
The design checkpoint locks directory, command names and manifest schema after
auditing existing .mdkg/artifacts/archive/pack/state usage and custom directories.
Do not seize existing improvised .mdkg/working content or recursively parse it
as graph nodes. Import/adoption is explicit and previewed, preserving originals.

Proposed entries carry opaque stable work ID, graph ID where supported, owner,
created/updated time, state (active/retained/retired), artifact inventory/hashes,
optional expiry and persistence policy. Legacy graphs need a reviewed namespace
strategy before durable work IDs; do not implicitly migrate the graph. Active
work, goal claims and explicit pins protect entries. Age or missing local PID
alone never proves quiescence; stale/foreign ownership needs explicit release.

Exclude working content from ordinary node indexing/search, capability discovery,
packs and bundles/export by default. Offer deliberate selected-graph working
search without promoting or combining results with canonical facts. Promotion
requires an explicit reviewed summary into a supported new/updated node or
archive sidecar, source hashes and evidence link; retain source until the user's
retention policy permits retirement. Enforce privacy independently of Git ignore.

Default persistent means no automatic mdkg cleanup across commands/restarts;
it does not guarantee storage survives cloud checkout deletion/reprovisioning.
Default scratch is Git-ignored and excluded from npm/deploy/export. Persistence
options: explicitly track sanitized selected artifacts, register retained archive
evidence, or use an explicitly selected external artifact store with digest/ref
and access policy. External storage setup/upload is outside this PR. Never
commit private scratch just to make it durable. Document saved-environment
restart, worktree removal, host loss and retention-expiry boundaries, plus an
export/restore rehearsal with synthetic data. A cloud save label is not proof
of backed-up or replicated files.

GC is explicit, preview-first, scoped to manifest-owned entries in one graph.
No background cleanup or default expiry deletion. Receipt binds entry IDs,
paths/hashes, graph, protection state, proposed quarantine and retention window;
apply refuses stale inputs. Quarantine via controlled moves and an operation
journal before any final deletion. Resume interrupted operations idempotently;
recover retained originals by receipt, refuse unknown journal contents. Final
purge needs a new preview and explicit action after configured retention;
document bytes no longer recoverable after purge. Unknown/unrelated files,
active/pinned work, symlinks, path escapes, hardlink ambiguity and Git metadata
are preserved or refused, not followed. Recheck activity/custody under the
writer lock; admit unresolved portable filesystem limits honestly (goal-87).

# Goal 3 design: independent sibling graphs

Default remains .mdkg. Recommend a uniform global `--graph <alias-or-id>` option
resolved once into a graph context before configuration reads or side effects.
Numeric alias `2`, `mdkg 2` and directory `.mdkg2` are exploratory UX alternatives,
not accepted grammar. Review ambiguity with node selectors, --ws, subcommands
and scripts. Unknown/ambiguous selectors fail before writes, directory creation,
indexing or fallback; absent selector alone selects the default. Avoid sticky
global selection that silently changes unrelated invocations.

Evaluate a small explicit repo-local graph registry containing only opted-in
aliases, stable graph IDs and contained root paths. Stable graph identity follows
edd-81; aliases/paths can change only through reviewed mappings. Registration
never scans/open-indexes all sibling directories. Legacy v1 defaults remain usable without implicit migration. The design review
must distinguish registry aliases from canonical graph identity: stable-ID
selection requires proven identity, or explicit reviewed format adoption under
separate authority; never synthesize an identity from a path or alias.
A private graph may be manually
registered in a local ignored registry to avoid exposing names/paths in tracked
team config. No root instruction duplication or mirror target sharing: default
mirrors belong to the default graph; nondefault graphs must use isolated explicit
destinations or fail on overlap. Stable identity collisions and overlapping graph
roots are errors, including nested registrations and symlink/case aliases.

Pass selected context through every CLI command family, nested helper, formatter,
diagnostic, help/example, MCP request and receipt. Audit generated command
contract/matrix coverage; receipt/error identifies selected alias/ID without
opening or naming other private graphs. A repo-level registry operation must be
explicitly identified as such. Commands that cannot yet support a selected graph
must refuse before effects, never silently operate on default.

Isolate node allocation/reservations, graph/config/identity, workspaces, JSON and
SQLite index/cache, lock/recovery journals, events, selected-goal/claim/loop state,
DB schema/runtime/snapshot state, packs, scratch, mirrors and bundle outputs.
Future queue keys and leases include graph identity; this goal preserves local
queue isolation but does not build cross-graph routing or hosted execution.
No cross-graph references, federated search, implicit subgraph registration,
union index or auto publication. Existing explicit subgraph behavior stays
scoped to its selected owning graph.

Primary synthetic case: a small tracked team .mdkg next to a large ignored
private sibling with unique canary strings and independent same-number node
aliases. Default searches/validation/packs/publish inventory must not open,
write, index or disclose private canaries. Ignoring a directory is not an access
control or publication policy. Explicitly selecting the private graph remains
local/private unless a separate export authorization and policy permit output.
Package whitelist and bundle graph selection must be checked independently.
Measure bounded discovery/index time and bytes on synthetic large siblings;
default cost should depend on selected graph size, not private sibling contents.

# Sequential execution and checkpoints

Each goal owns four bounded tasks, one meaningful future test node and three
future checkpoints: design approval, installed local acceptance, final
pre-publication readiness. All remain backlog/paused and have NOT_RUN evidence.
The single completed planning receipt chk-681 certifies only
this design audit/checks. It does not satisfy implementation acceptance.

Goal 2 is blocked by Goal1's final readiness checkpoint; Goal 3 by Goal2's.
Completing a readiness assessment is distinct from satisfying its dependency.
Use exactly one checkpoint verdict tag: `readiness:not-run`,
`readiness:not-ready` or `readiness:ready-pending-approval`. NOT_RUN stays non-done;
NOT_READY must have `status: blocked` or `status: review`, never done. Retain its
failure receipt and downstream blocked_by edges. Only an evidenced, independently
reviewed READY_PENDING_APPROVAL assessment may be marked done to satisfy the
next-release prerequisite; publication/adoption approval remains separate.
The node parser and goal-next dependency guard reject invalid done/NOT_READY
states; docs:check also enforces the exact three gate markers and downstream
edges, including missing markers. A scoped explicit owner prerequisite exception
may authorize specified work while a release remains NOT_READY, but must be
recorded separately and never relabel that checkpoint done or READY.
Do not run these three implementation goals in parallel. Recheck each previous
checkpoint's exact inputs and compatibility before the next goal. Readiness
can permit the next planning/implementation step under separate Run authority;
it does not require or authorize publishing the previous package. Nick decides
professional adoption and any publication after reviewing local evidence.

# Testing and pre-publication obligations

Each goal must prove its specific acceptance cases in synthetic installed
fixtures, with negative and positive controls. Run relevant automated tests while
iterating, the full repository suite/integration checks before pre-merge claims,
and the package release ladder before pre-publication claims. Source imports and
cloud planning checks are not installed-artifact acceptance.

Freeze exact source commit, package inputs, harness inputs, tarball digest,
engine/runtime, platform/architecture, fixture isolation and commands. Preserve
pass/fail/not-run counts and current security/remediation review. Use existing
package-profile ladder and unchanged coverage ratchet (currently lines 89%,
branches 77%, functions 96%), packaged guidance/skill parity, CLI/docs/schema
checks, and all 37 package smokes. Preserve all 46 repository smokes: changed
website surfaces require their repository profile checks. Requalify affected
evidence after any candidate/input change. Pack inspection must exclude scratch,
private siblings and non-runtime planning artifacts.

Supported-platform acceptance needs local installed exact-byte evidence on the
declared Node minimum/current range and macOS/Linux ARM64/x86_64, explicitly
identifying native/emulated execution. No Mac access is authorized here; later
qualification must use separately authorized hosts. Windows is unqualified.
Do not weaken a gate when a host is unavailable: report NOT_READY and the exact
gap. bug-46/bug-47 and goal-87 remain deferred/unresolved. Current fast CI has 13
manifest smokes and Node 24.18.0/24.x; it is not full Linux portable qualification.
The full workflow's test-487 Linux installed-artifact job intentionally fails as
an unqualified stub under epic-257, despite local 0.6.0 evidence. Preserve that
distinction, and require fresh evidence for each future artifact.

Final checkpoints must either recommend ready pending Nick's explicit publication
approval, or record NOT_READY with retained failures/gaps. They stop before
publication/tagging/deployment or professional adoption. Future packaging
dry-runs are gated by their later accepted scope; no publish command, even a
dry-run, is needed for this documentation PR.

# Deferred backlog and remaining decisions

task-856 records merge-queue/permanent-ID integration only as deferred backlog.
It is outside all three scopes, has no release target and creates no fourth
goal. Existing permanent graph/node identity remains supported; no queue service,
central allocator or promotion mechanism is implemented or designed to readiness.

Nick's design checkpoints decide: root compatibility window and safe custom
section handling; working directory/CLI/schema and retention interval/persistence
choice; graph selector grammar/private registry placement and mirror ownership.
The recommended policies above are concrete review proposals, not released APIs.
Confirm cloud/Mac reconciliation and original implementation gates before work.
Record setup, checks, review findings, retries and human interventions in
docs/cloud-planning-experiment.md; exact executed results live beside the plan.

# Architecture

The three Goal design sections above define separate sequential increments over
existing bootstrap, storage and identity machinery; no runtime is changed here.

# Data model

Canonical nodes remain authored frontmatter; working manifests are separate;
independent graphs own stable IDs and selected context. Their proposed fields
and ownership rules are detailed above, pending design-checkpoint approval.

# APIs / interfaces

Existing init/upgrade/skill APIs are reused. Working CLI and graph-selector
grammar remain proposals with explicit review checkpoints before implementation.

# Failure modes

Unknown custody, stale receipts, path/identity overlap, active work or missing
qualification must refuse/retain data or return NOT_READY, never silently fall back.

# Observability

Preview receipts and checkpoints bind graph, exact inputs, paths, commands and
case outcomes. The experiment log records real retries and human interventions.

# Security / privacy

Synthetic-only qualification; no company data or credentials. Private scratch
and independent siblings must stay outside default indexing and export payloads.

# Testing strategy

Use the goal-specific future test nodes and pre-publication obligations above.
Executed planning evidence cannot be substituted for installed future cases.

# Rollout plan

Nick reviews/merges the planning PR, then separately runs each goal in order.
Version targets are provisional and publication/adoption require explicit approval.
