---
id: chk-563
type: checkpoint
title: Record compact bootstrap and branch identity planning approval
status: done
priority: 9
tags: [alignment-002, planning-only]
owners: [mdkg-project-agent]
links: []
artifacts: []
relates: [task-363, goal-81, goal-82]
blocked_by: []
blocks: []
refs: [task-363, goal-81, goal-82, edd-80, edd-81, dec-93, epic-83, test-151]
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: []
created: 2026-09-05
updated: 2026-09-05
checkpoint_kind: handoff
---

# Summary

MDKG-INTERACTIVE-ALIGNMENT-002 Phase 2 converts approved interactive alignment
into a local planning package. Planning is complete and validated;
source implementation remains withheld. No feature behavior is claimed.

# Scope Covered

Goal 81: compact default bootstrap, provenance-preserving upgrade and focused
skill/link discovery. Goal 82: complete branch-safe identity, versioned format,
ordinary command parity and reviewed semantic reconciliation.
Reuse task-363, epic-83 and test-151; preserve Goal 17/18 and prior decisions.

# Decisions Captured

dec-93 accepts direction for future implementation: compact init by default,
explicit graph-only and legacy --agent compatibility, numeric human aliases,
stable graph/node identities, reviewed mapping before index rebuild, ordinary
unmerged-node usability, and no implicit staging/history rewrite.
edd-80 and edd-81 define architecture and gates. Exact identity serialization
and selector syntax are bounded task-820 deliverables before consumers are enabled.

# Implementation Summary

No source implementation occurred. Seven implementation tasks (task-816 through
task-822) and four verification contracts (existing test-151 plus test-474 through
test-476) remain todo, owner-empty and unclaimed. Goals 81/82 are paused, unselected
and have no active_node. task-363 is the only planning work item executed.
First increments after fresh approval: task-816 bootstrap and task-819 classifier.
The complete identity slice, not just classifier success, is required for Goal 82.

# Verification / Testing

## Evidence freshness

Inspected locally on 2026-09-05 against HEAD
9652b8558942041cbebe8f444fbc79e16b1a670d, main, matching cached origin/main.
No fetch or live remote/auth/provider check. Baseline clean. mdkg 0.5.2, config
schema 1, SQLite backend, 2596 baseline nodes across four graph workspaces.
Read startup/core/matrix/local skills; inspect current source new/init/upgrade/
fix/goal/lock behavior and linked historical work. Source findings are static,
not newly executed runtime regression tests.

## Intake ownership

No active project_writer_lease rows, queue rows or mutation lock. Three stale
archived active_node references and one blocked viewer goal are unrelated and
unchanged; progress epics are not evidence of an overlapping active writer.
Supported planning ownership used task start/update/done and per-command locks;
no synthetic lease CLI, DB initialization or queue/goal claim was used.
The stale prunable worktree metadata entry remains untouched.

## Command Evidence

- Intake full mdkg validation: pass, zero errors, three imported-bundle age warnings.
- Planning changed-only validation: pass, zero errors and zero warnings.
- Pre-closeout full validation: zero errors; temporary cache staleness after body
  edits plus the three pre-existing imported-bundle age warnings.
- Exact path/paused-goal/unclaimed-task checks: pass, 19 authored paths,
  20 visible dirty paths including SQLite, two paused goals, seven unclaimed
  implementation tasks, four unclaimed tests, zero staged paths.
- git diff --check and owned untracked whitespace/conflict-marker checks: pass.
- Closeout index rebuild: pass. Changed-only validation: zero errors/warnings.
  Full validation: zero errors, only three inherited imported-bundle age warnings.
  The same gates are rerun after this receipt and task-363 closeout are indexed.
- No build, source test, upgrade, migration, repair application or bundle refresh.

## Scaffold exception

Current mdkg new goal defaults to progress/active. Goal 81 was created that way;
creating Goal 82 wrote its file, then failed on multiple-active-goal validation
before emitting its creation event. Subsequent design creation failed without
writes. Both owned goal files were corrected immediately to todo/paused; neither
was selected/claimed and no implementation executed. Explicit recovery event
records this exception rather than fabricating a successful creation receipt.
Keep the partial-write/default-active observation for a separately scoped source
decision; it does not authorize widening this planning pass.

# Changed Surfaces

## Authored path allowlist

- .mdkg/design/dec-93-adopt-compact-default-bootstrap-and-identity-backed-numeric-aliases.md
- .mdkg/design/edd-80-compact-bootstrap-discovery-and-provenance-preserving-upgrades.md
- .mdkg/design/edd-81-versioned-graph-identity-and-branch-reconciliation-contract.md
- .mdkg/work/chk-563-record-compact-bootstrap-and-branch-identity-planning-approval.md
- .mdkg/work/epic-83-future-mdkg-graph-update-and-compatibility-train.md
- .mdkg/work/goal-81-simplify-default-initialization-and-focused-instruction-discovery.md
- .mdkg/work/goal-82-enable-branch-safe-graph-identity-and-reviewed-reconciliation.md
- .mdkg/work/task-363-plan-future-mdkg-graph-update-release-train-for-0-3-5-plus.md
- .mdkg/work/task-816-implement-compact-default-init-and-focused-instruction-router.md
- .mdkg/work/task-817-implement-provenance-aware-bootstrap-upgrade-and-recovery.md
- .mdkg/work/task-818-align-bootstrap-discovery-links-and-native-skill-projections.md
- .mdkg/work/task-819-distinguish-same-node-conflicts-from-independent-alias-collisions.md
- .mdkg/work/task-820-implement-versioned-graph-identity-and-legacy-migration-planning.md
- .mdkg/work/task-821-resolve-identity-backed-nodes-across-ordinary-branch-local-commands.md
- .mdkg/work/task-822-apply-reviewed-identity-reconciliation-with-durable-alias-receipts.md
- .mdkg/work/test-151-future-graph-upgrade-dry-run-no-mutation-contract.md
- .mdkg/work/test-474-verify-compact-bootstrap-preservation-discovery-and-upgrade-recovery.md
- .mdkg/work/test-475-verify-branch-identity-command-parity-and-legacy-compatibility.md
- .mdkg/work/test-476-verify-semantic-reconciliation-replay-and-reference-safety.md

## Generated and episodic custody

- .mdkg/index/mdkg.sqlite: tracked derived graph projection, allowed and unstaged.
- .mdkg/index/global.json, skills.json, capabilities.json, subgraphs.json:
  ignored derived projections refreshed for the authored graph.
- .mdkg/work/events/events.jsonl: existing ignored episodic log appended by CLI
  mutations/recovery. Ignore policy unchanged; this is not a shared-Git receipt.
- No bundle, archive, skill/native mirror, config, source, docs, instructions,
  root/sibling, provider, release, or Git-history content was changed.

## Protected bookends

- Demo bundle .mdkg/bundles/private/presentations/ai-native-sdlc-demo.mdkg.zip
  SHA-256 unchanged: 741b4644da1d3d1ff3bbd4b9240e22870609f015e49e28170a91748ab024570b.
- Selected-goal file SHA-256 unchanged:
  f996926a868b7c06fb29311fb69c48d862e9dc354404f777df93e1c5443b07ab.
- Selected root:goal-73 remains achieved; HEAD/cached upstream unchanged.
- Intake tracked index SHA-256:
  0ec61466f069baa889f5fb4d14e808a4f98c5495f9a4a085e6d3300d0fca1751.
  Its final bytes intentionally differ as a required derived projection.

# Known Issues / Follow-ups

Three imported-bundle age warnings and stale achieved-goal selection are retained.
No bundle refresh is allowed; snapshots intentionally do not include this new plan.
No canonical migration, source implementation, commit/push or release is approved.
Remote skills, writable federation and self-improvement automation remain deferred.

## Additional cache verification exception

After rebuilding, node dist/cli.js db index verify --json exits 2 with SQLite
source fingerprint mismatch even though every JSON cache is fresh and authored
graph validation passes. Read-only diagnosis traced this to elapsed bundle-age
warning text included in src/graph/sqlite_index.ts buildSourceFingerprint via
subgraph records; only generated_at/indexed_at are stripped. The verifier in
src/commands/db.ts recomputes those age observations at the current time.

Observed proof before adding this note: stored and cached-input fingerprints
both sha256:db4fdb0a40fde43ebcc757d08cbe5905b1ffeae55cf8156c0aa44f6f538e5ca0.
Fresh inputs differ, but fresh graph/skills/capabilities with the cached subgraph
observation yield the exact stored hash. Normalizing only generated/indexed times
and elapsed bundle-age text makes the subgraph structures equal. These are
diagnostic observation hashes, not the final index hash after this receipt edit.

Disposition: authored planning package valid; cache-verifier gate not green.
Do not rebuild bundles, alter timestamps, or suppress warnings to manufacture a
pass. A source correction/test for volatile diagnostic hashing needs separate
implementation authority; no source fix or additional node was created here.

# Authority and Portability

authority_used: approved project-local mdkg planning and required projections.
Generic owner: mdkg; native discovery is an adapter; Runtime execution and private
orchestration remain outside this contract. No credentials or raw private payloads.
Scope derives from current user approval, not goal selection or historical nodes.
Writer disposition: task-363 completed and released scoped planning ownership;
no standing lease persists. Uncommitted package custody remains with this project
agent for the user's review; do not normalize or absorb it in unrelated work.

# Skill Coverage

select-work-and-ground-context, service-boundary-ownership-check and
verify-close-and-checkpoint guided grounding, boundaries and validation.
Existing skill list/search/show inspected; new skill candidates: none.
task-818 describes qualified future maintenance of existing skills, not a new
skill proposal or present authoring permission.

# Links / Artifacts

goal-81, goal-82, edd-80, edd-81, dec-93, task-363, epic-83, test-151.
