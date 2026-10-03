# Goal89 validation plan and source audit

Status: proposed Task848 / Test495 contract. Feature cases listed here are
NOT_RUN; they are not passing tests or approvals. Only synthetic fixtures are
allowed. Final case IDs/counts and exact candidate digests must be recorded
after implementation, not copied from Goal88.

## Source audit

| Boundary | Current source | Goal89 obligation |
| --- | --- | --- |
| Canonical indexing | `src/graph/workspace_files.ts`, `indexer.ts` | Fixed core/design/work/archive discovery already excludes sibling working. Refuse nested workspace ownership inside any working store before graph parsing. Cache/import admission must reject working paths too. |
| Skills/capabilities | `skills_indexer.ts`, `capabilities_indexer.ts` and caches | Fixed skills root already separate. Test working-contained skill/canonical canaries, custom child document roots and stale/forged cache paths; no private body in results. |
| Transport/bundle/clone | `transport_state.ts`, `commands/bundle.ts`, identity clone/fork/import | Explicit working exclusion for all graph roots and undeclared conventional nested .mdkg roots, both profiles, independent of ignore. Reject overlap/aliases before generated index parsing. Keep existing state/schema compatibility. |
| Package/deploy payload | `.npmignore`, `.dockerignore`, init ignores and release inventory | Existing whole-.mdkg exclusions are necessary but installed payload inventory must prove no working manifest, entries or synthetic canaries. No deployment is performed. |
| Filesystem sinks | `core/filesystem_authority.ts` | Existing sinks reject visible links and traversal; read/copy/inventory must explicitly reject multi-link/special files and bound traversal. Bind ancestry across operations. Avoid recursive removal of unknown files. |
| Native Git | `util/git_metadata.ts` | Reuse natural/redirected/worktree/common-dir/object alternate admission for every affected tree, with bounded nested repository/bare-store inventory. Preserve metadata on failure. |
| Lock/writer | `util/lock.ts`, `lock_evidence.ts`, `writer_admission.ts` | Reuse compatibility admission and one graph lock; no ad hoc PID takeover. Failed journal evidence must survive. Explicit quiescence and exact custody evidence for recovery. |
| Identity | `graph/identity.ts`, `identity_authoring.ts` | Read actual canonical graph.json independently through the strict existing reader. Managed storage requires verified v2 graph_id equality; store_id is subordinate. Legacy refusal preserves existing behavior/data until separate reviewed graph migration. Opaque working IDs never bootstrap host identity. |
| Goal/work protection | `graph/selected_goal.ts`, `goal_scope.ts`, `commands/goal.ts` | Fresh nonpersisting local index and identity-aware selection. Refuse malformed/ambiguous selection; capture active_node and last_active_node for paused/suspended goals as protection. Never clear selection to permit GC. |
| Archive promotion | `commands/archive.ts`, `archive_integrity.ts` | Current add command writes raw source, deterministic zip and sidecar in sequence, and logs rather than returning a prepared plan. Extract/reuse a bounded prepared-authoring adapter for preview/journal integration; merely calling the current writer cannot supply previewed identity, exact bytes or crash-safe promotion. Preserve existing archive CLI behavior. |
| CLI/docs safety | `cli.ts`, `commands/option_contract.ts`, `scripts/cli_help_targets.js`, `generate-command-contract.js` | Register each concrete path and narrowly admitted flags; explicit safety classification, lock/receipt/write-path contract. Reject unknown selection/options before effects. Generate help/contract/matrix/docs consistently. |

Scope remains the root graph. Existing workspaces are inspected only to enforce
privacy/ownership boundaries; 0.6.2 does not create a sibling registry or silently
route working commands to another graph. No existing repo working data or company
data is used as a fixture.

## Case groups

1. **Store and persistence:** fresh preview makes no files; reviewed apply creates
   ignored private storage; repeated init/list/show/verify survives CLI restart
   with byte inventories intact. Legacy managed storage refuses without writing an
   absent graph manifest, numeric IDs, selected state or custom bytes; existing
   legacy CLI remains supported. Separate reviewed canonical migration enables
   opting in. Host identity is read independently before store metadata, for
   every operation. Copied store A into existing host B refuses while preserving
   both inventories; legacy-working UUID/claimed identity cannot bootstrap a
   missing host. Matching v2 host/store and same-ID clone are positive controls;
   new-ID fork, removed/changed host, malformed/unknown metadata and stale
   preview are negative controls. No per-checkout/authentication claim. Custom/unmanaged working content is preserved and refuses
   filename-only adoption. Data-only selected adoption into an independently
   identified host copies bytes into new destination store/entry IDs, retains
   original/provenance and never trusts incoming ownership/approvals/work refs or
   replaces host metadata. Active/pinned/stale custody remains protected.
2. **Write interruption:** preview/import source change refuses; interrupted
   manifest/payload publication keeps accepted entries intact; exact journal
   replay finishes once or restores retained before-images. Unknown/truncated
   metadata, extra journal keys/paths, duplicate entry IDs and unknown contents
   refuse. Each failure has an in-boundary positive control.
3. **Exclusion:** canonical frontmatter, MANIFEST/WORK/SKILL and private-text
   canaries in working do not enter ordinary index/search/capability/pack or any
   bundle/generated cache/export. Working search returns only explicitly selected
   owned results without writing caches. Tracked working bytes remain excluded;
   nested workspace/alias/config overlap refuses. npm tarball contains no canary.
4. **Promotion:** exact reviewed sanitized summary becomes supported private
   archive evidence, with selected source digest/ref and retained working bytes.
   Explicit destination collision, changed summary/source/config/identity,
   duplicate promotion and unknown partial archive output refuse or require
   admitted journal recovery. Canonical archive verify passes after recovery.
5. **Protection:** cleanup defaults to no action; selected preview is entirely
   nonmutating. Active, pinned, current/paused/suspended-goal-associated and
   active canonical-work entries refuse. Activity/pin/claim changes after preview
   invalidate apply. Old timestamps, missing PID and foreign/stale owner do not
   release custody; exact explicit stopped-owner release is tested separately.
6. **Quarantine:** explicit selected inactive GC retains exact bytes, unrelated
   entries/custom files/canonical nodes/sibling trees remain byte-identical.
   Fault injection covers journal publication, every rename, progress update,
   manifest transition and receipt completion. Repeated resume is idempotent;
   unknown files, both-before-and-after duplicates, moved ancestry, mismatched
   owners and stale lock custody refuse without deleting evidence.
7. **Recovery and purge:** indefinite policy blocks purge. Finite retention
   expiry does nothing automatically. Fresh explicit purge preview only becomes
   eligible after the approved window and binds current bytes/protections.
   Recovery before purge restores exact payload; destination conflict refuses.
   Test partial purge at every unlink and metadata boundary: it can explicitly
   resume verified remaining deletion, but cannot claim restoration of already
   lost bytes. A completed loss receipt is retained; repeated completed commands
   report completion without a second effect. Unknown files are never removed.
8. **Filesystem/Git:** absolute, traversal, separator/case/Unicode aliases,
   symbolic links at every parent/leaf, payload and metadata hardlinks, special
   files, nested/bare Git, external Git/common-dir/index/object stores and renamed
   parents refuse. Real regular-file roots and safe nested payloads pass. Assert
   exact bytes of protected/unrelated objects rather than only exit codes. Admit
   Goal87 portable race/ACL limits and unsupported-host gaps.
9. **Durability rehearsal:** synthetic reviewed archive/artifact export records
   digest and an explicit restore selection. Recreate a disposable checkout from
   tracked canonical input and selected retained evidence; ignored working entries
   are absent after deletion. Restore only selected sanitized evidence with verified
   hashes and independently verified target identity; different graph restoration
   requires explicit data-only adoption, never identity replacement. Neither
   cloud-save labels nor Git ignore imply backup. No external
   provider setup/upload or forced tracking of scratch.

## Execution and receipt discipline

During implementation, use focused regression and positive/negative controls;
expand only for the shared source adapters, privacy/index/transport and CLI effects.
Run affected existing archive, bundle/ownership/transport, identity, goal,
filesystem, lock and command-contract tests. All newly accepted feature cases
need source and exact-installed-artifact evidence, including fresh process runs.

At candidate freeze, capture base/head/worktree status, tracked/source/package/
qualification hashes, lockfiles, selected state, artifact digest/permissions and
runtime/OS/arch. Do not edit candidate inputs during checks. Use an owned clean
fixture TMPDIR and existing owned-descendant subreaper where the retained cloud
baseline requires them; retain their source/hash and exact commands. Never read
another process's /dev/shm namespace; copy receipts to owned workspace cache in
the same sandbox command before exit. No broad unbounded reruns.

Run unchanged thresholded full coverage once on frozen inputs, applicable
prepublication gates, all 37 package smokes and exact installed feature contracts.
Preserve all 46 repository smoke definitions; run affected site gates. Record
each passed/failed/not-run result with elapsed time and native/emulated platform.
Do not change coverage floors/timeouts or attribute all failures to environment.
Missing owner/local/platform/security or hosted proof keeps Chk676/677 incomplete
and release NOT_READY. Local owner validation before publication/adoption remains
required; no merge/publication/adoption is authorized by a draft checkpoint.

## Independent read-only planning available while the decision is pending

- Trace ordinary graph/index/capability/cache/pack/bundle entry points and
  existing child-workspace ownership. Produce a caller/path inventory of where
  any future private store must be excluded; do not choose or change its layout.
- Inspect existing archive authoring, graph mutation lock/recovery and identity
  fixtures. Map reusable prepared-authoring/journal contracts and missing crash
  controls; do not alter APIs or infer a stopped writer.
- Turn Test495's existing requirements into a case-to-evidence matrix with
  in-boundary positive controls and before/after byte-inventory assertions.
  Identify native platform evidence needed for the same contract; do not claim
  unexecuted cases pass or author feature fixtures that assume an accepted policy.
- Inspect the existing release manifest, package/ignore/export inventory and
  site checks. Map applicable unchanged gates and inherited failures without
  changing floors, timeouts, smoke definitions, locks or version metadata.
- Classify historical hosted cancellation/coverage failures from already
  available small evidence, or owner-provided small artifact extracts if they
  arrive. No archive bypass, workflow rerun or CI remedy is authorized here.

These are planning outputs only. Actual source work, policy/schema adoption,
cleanup, promotion and qualification of a 0.6.2 candidate wait for the recorded
human design decision. Goal90 feature implementation remains excluded.

## Revised binding review controls (design only)

`tests/cloud-working-host-contract.test.mjs` checks the actual canonical reader
with synthetic v1/v2/malformed inputs and a TEST-ONLY equality oracle. Cases
cover subordinate store UUID, foreign copy preserving both inventories, v1
nonmutating refusal/no bootstrap, same-ID clone versus new-ID fork, changed or
removed host and unknown formats. It also checks the reviewed document contract
keeps these material compatibility limits explicit.

These controls validate the proposal's identity premise, not a shipped working
command. Full store schema, adoption/ownership, journals, filesystem races,
installed artifact controls and Test495 groups1–9 remain NOT_RUN. No runtime
working helper, 0.6.2 version bump, new legacy identity schema or feature approval
is created by passing this oracle. Original design-audit receipts remain bound
to 0ff7095 and are superseded only for the rejected identity proposal.
