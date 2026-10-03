# Goal90 design contract: named independent graph roots

Target: goal-90 / task-852–855 / test-496 / chk-678–680, proposed unpublished
0.6.3. Parent prerequisite GO is bound to PR12 head
`1e5b5981611b019c4ab0d14ec9d0bcccf3c171ef`. It permits this sequential cloud
implementation, not release readiness, merge, publication or adoption. Planning
PR10 remains unmerged. The owner is `mdkg-project-agent`; selected-goal state,
unrelated worktrees and existing graph data stay untouched.

## Selector and existing root model

Use the optional global `--graph <name>` alongside `--root <host-root>`.
Without it, every existing command still uses `<host-root>/.mdkg`. Names are
exact lowercase portable aliases, not node selectors, directory discovery,
numeric positional prefixes or a sticky selection. Repeated/conflicting
selectors refuse before effects. Help/version validate selector syntax but
remain graph-independent and perform no registry or graph reads.

Each named graph is an existing independent **project root containing `.mdkg`**,
the model already supported by `--root`. For example, a host team graph lives at
`.mdkg`, while a private graph lives at `memory/personal/.mdkg`. A name maps to
`memory/personal`, not directly to a bare `.mdkg` directory. Relative inputs,
outputs, workspaces and mirrors on named invocations are relative to that
selected project root. This deliberately preserves the handlers' existing root
contract rather than translating persisted graph paths or adopting graph data.

Initialize an empty independent root explicitly with existing `init --root`,
then explicitly register its name. `init --graph unknown` never creates or
registers anything. Existing graphs are never moved, migrated, copied, federated
or deleted by registration/selection. Bare sibling-directory formats and stable
UUID selectors are not added; canonical IDs and working-host IDs are preserved
and checked as binding evidence, never invented from a name or pathname.

## Explicit local registry

Add repo-level `graph register`, `graph unregister` and `graph registrations`.
Register/unregister preview exact metadata and ignore-file changes; apply needs
the exact current plan hash. Unregister removes only the mapping, never data.
Registration may read the selected root and default ownership metadata; listing
reads registry metadata only. These are explicit host-level operations and do
not accept a graph selector.

The bounded, ignored host-local registry `.mdkg-graphs.local.json` records only
opted-in names, contained root paths, visibility and proven existing binding:
canonical-v2 graph ID or legacy working-host-v1 ID. A legacy graph without an
existing binding is refused with guidance to separately use the reviewed
0.6.2 adoption flow. Selection checks the chosen binding every time. Copying
identity bytes does not create an independent graph: duplicate binding against
the default or registered entries refuses. Changed or missing bindings never
fall back or silently rebind. Explicit mapping removal/re-registration is a
reviewable metadata operation, not migration or working-store repair.
Unregister preserves the registry's prior default host binding, including when
the removed root is unavailable. It cannot approve a changed host identity for
remaining mappings; those remain refused. Registration with a changed host
binding also refuses pending explicit registry review.

Private registrations require no tracked graph files and an ignored graph root.
The effective positive Git exclusion must match the directory itself, not a
sampled config file or a trailing-slash query that can match a child wildcard.
Selection rechecks this boundary. A later authored exception refuses selected
operations. Registration can preview an additional final directory exclusion;
its exact hash-bound apply preserves the existing authored rules.
All registry mutations require a valid Git work tree so their ignored/untracked
policy can be verified before any ignore-file or registry mutation.
The preview includes any needed `.gitignore` additions. Registry metadata and
its host lock stay ignored for every visibility. Tracked team roots can use
internal/public registration deliberately. Ignoring is not access control.

Refuse malformed/oversized/unknown registry fields, names, IDs, duplicate or
case-equivalent paths, nested/overlapping roots, dot/parent components, absolute
paths, links, hard-linked metadata, nested Git stores and overlap with the host's
canonical workspaces/mirrors. Errors name only the requested graph, never other
private mappings. Preview is read-only. Apply rechecks all frozen inputs under
the host registry writer lock; busy/stale/changed inputs refuse without replacing
unknown work. Ignore changes precede atomic registry replacement, so interruption
cannot expose an unignored newly registered private graph; no automatic cleanup
of another owner's lock or data.

## Dispatch, storage and output policy

Resolve once to an immutable context before command config, indexes, locks, output or
subprocess effects, and pass its selected root through both synchronous and
asynchronous dispatch, including MCP. Existing helpers receive the same root
contract. All config/identity, allocation/reservations, JSON/SQLite indexes,
locks/journals, events, goals/claims/loops, DB/queues/snapshots, working storage,
archives, packs, bundles, skills and mirrors therefore stay under that root.
The selected context is identified on stderr without changing JSON stdout.
Default operations never load the registry or open/index other graph roots.
Named admission reads only the requested graph plus bounded host namespace/
ownership metadata (default binding/config and local Git ignore/index policy);
it never opens another registered sibling or default graph nodes/cache/scratch.
Read-only Git observations must remain scoped to the selected root's paths.

Preserve the 0.6.2 working-store host-binding/refusal rules, including copied,
foreign, missing and changed identities. Registration is not working adoption.
Mirrors and root instructions belong to their independent project root and do
not write the host's instructions or shared native mirrors. Existing containment
rules continue to govern explicitly configured paths. No union cache, cross-
graph references or hosted queue/routing feature is introduced.

Explicit private selection permits local/private inspection and output. Public
or internal pack/archive/capability output and public bundles must refuse while
the registration is private; graph-copy transport from a private registration
is unsupported and refuses before effects. Existing explicit subgraphs stay
within their selected owning root. npm package whitelist remains unchanged and
must exclude registry, graph/scratch fixtures and planning evidence. No export
authorization is inferred from selection or a public field inside private data.
The registration fence normalizes visibility and bundle-profile case exactly
as the downstream handlers do. Public/internal case variants cannot bypass a
private registration; local/private case variants retain their existing support.

## Test and stop boundary

Tests precede source edits. Use synthetic roots with intentionally reused node
numbers, different bindings, tracked small team data and large ignored private
canaries. Exercise every command family with selected-root controls plus unknown
selector refusal before any effects, help/version/options contract parity,
identity/path/mirror collisions, stale/concurrent registration, interrupted
metadata application, working-store foreign bindings, DB queue settlement and
same/separate graph writer behavior. Measure default discovery reads, bytes,
elapsed time and memory with the private root present; instrument against private
root reads/writes rather than relying on an absent canary in stdout.

Qualify source and the exact retained installed tar on native supported Node
minimum/current. Broaden to shared CLI/path/Git/identity/storage callers. Freeze
inputs during checks and retain failed controls as well as passes. New full CI
is evidence, not a waiver of unchanged floors/timeouts or full release gates.
Parent owns independent review and owner/platform/manual readiness checks.
Missing required checks means NOT_READY; do not mark goal-90 achieved.

Stop for unowned writes, identity/path collision, new material compatibility
choices, stale inputs, denied authority/access or five confirmed transient cloud
failures. Current confirmed count is 2/5; this startup connected successfully.
