---
id: chk-566
type: checkpoint
title: Prove versioned identity migration recovery and ownership-safe transport
checkpoint_kind: implementation
status: done
priority: 1
tags: [goal-82, local-proof, identity-v2]
owners: [mdkg-project-agent]
links: []
artifacts: []
relates: [edd-81, test-151, test-475]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [task-820, goal-82]
created: 2026-09-06
updated: 2026-09-06
---
# Summary

Task-820's explicit format/identity/migration and transport foundation is
implemented and locally verified. This milestone does not complete Goal 82:
command-wide parity and reviewed semantic reconciliation remain required.

# Scope Covered

Goal 82 Run authority, owner mdkg-project-agent, main at
8f69773b653fd3fb409c4b473e4d39e288ee6e21, one ahead of cached origin/main.
No live remote verification. All current changes are attributable to this run.

## Changed Surfaces

- src/graph/identity.ts, identity_refs.ts, identity_snapshot.ts,
  identity_migration.ts, identity_transaction.ts, identity_transport.ts,
  identity_template.ts; parser/frontmatter/index/cache/validation consumers.
- src/commands/graph_identity.ts, graph.ts, new.ts, validate.ts, fix.ts,
  bundle.ts; subgraph identity verification; shared ID/QID/ref/lock/argparse.
- src/cli.ts, CLI_COMMAND_MATRIX.md, help targets/command contract generator,
  both graph-movement docs and generated CLI reference/contract summary.
- tests/graph/identity.test.ts, identity_migration.test.ts,
  tests/commands/graph.test.ts, tests/util/argparse.test.ts.
- Owned task/goal/design/checkpoint Markdown and required event/index projections.

## Boundaries

- In scope: generic mdkg source, tests, compatible CLI discovery, local evidence.
- Actual canonical graph migration, Git staging/commits/history/remotes,
  bundles/subgraph refresh, consumers, providers and deployments withheld.
- Disposable local Git fixtures only; no canonical .mdkg/graph.json created.
- No raw secrets, prompts, provider bodies or bulk rollout traces recorded.

# Decisions Captured

dec-93 and edd-81. Format version is separate from package/config/cache versions;
stable UUID identity is independent of numeric aliases. No hidden migration.

# Implementation Summary

Reviewed legacy conversion binds accepted ancestry, namespace/origin, authored
inventory, Git HEAD/branch/index, selected state, runtime DB and validation
contract. Preview is observational. Apply requires an exact plan hash; private
0600 journals support bounded resume/rollback over known before/after bytes.
Durable mapping receipts omit raw bodies. Strict authored validation precedes
derived-index rebuild. Other unfinished transactions, altered inputs, symlinks
and unowned additions fail closed. Git staging remains unchanged.

# Implementation Details

- New v2 nodes persist offline random identities; shared legacy ancestor nodes
  receive deterministic namespace-derived identities, branch additions use
  explicit distinct origins. Historical body bytes, including CRLF, survive.
- Same-project clones preserve identity; independent forks allocate new graph
  and node identities with lineage. Templates become target-owned, bind their
  structured references and preserve body bytes. Read-only mounts verify cached
  identity against authored manifest/headers and never grant source writes.
- Existing v1 fixture behavior stays compatible. V2 sources cannot be silently
  downgraded into v1 template targets. Private journals are excluded from bundles.
- Explicit false boolean flags retain false rather than becoming apply authority.

# Verification / Testing

## Command Evidence

- npm run test: PASS, 713 TypeScript tests plus 26 public-release/security
  contract tests; all local/provider-free. Includes build and focused suites.
- Focused graph/subgraph/migration run: PASS, 39 cases before the final boolean
  regression; the full run includes that added regression too.
- npm run cli:check:built: PASS using the freshly built CLI.
- npm run docs:check:built: PASS, 475 checked examples, zero failed.
- node dist/cli.js validate --changed-only --json: PASS, zero errors/warnings.
- node dist/cli.js validate --json: PASS, zero errors; generated-cache staleness
  before the evidence-boundary reindex and three inherited bundle-age warnings.
- git diff --check: PASS. Final checkpoint/index validation follows this record.

## Pass / Fail Status

PASS for task-820's bounded foundation; not full Goal 82 acceptance.

## Known Warnings

Three stale imported bundles remain deliberately unchanged. Legacy default seed
refs can name authoring-repository nodes absent from a new graph; migration
correctly blocks those unproven bindings. Fixtures explicitly remove those refs
instead of weakening migration or repairing unrelated bootstrap source.

# Known Issues / Follow-ups

- Task-821 must finish command-wide creation/mutation/output/SQLite/MCP parity,
  ambiguity inspection and explicit checkout-execution semantics.
- Task-822 must deliver complete ancestor-aware semantic reconciliation, durable
  alias maps, replay safety and reviewed recovery. Foundation alone is insufficient.
- Canonical adoption, commit/push and any release remain separate authority.

## Follow-up Refs

task-821, task-822, test-151, test-475, test-476, goal-82.

# Links / Artifacts

Task context: .mdkg/pack/pack_concise_task-820_20260906-165831614.md.
No commit created and no staging/push performed. Goal 73 selection remains
unchanged (SHA-256 f996926a868b7c06fb29311fb69c48d862e9dc354404f777df93e1c5443b07ab).
Runtime DB unchanged (b1f2bfb3c9ebd254d520eb7f47c12c2fa18daf691056fe97ba1890f94d013a81).
Demo bundle unchanged (741b4644da1d3d1ff3bbd4b9240e22870609f015e49e28170a91748ab024570b).

Skill coverage: goal pursuit, pack-first execution, verification/checkpointing,
source-grounded regression diagnosis. New skill candidates: none; these are
generic implementation/format contracts, not a procedural skill proposal.

# Raw Content Safety

- Summarize evidence and use refs, hashes, and artifact links instead of raw secrets, raw prompts, raw payloads, or bulky execution traces.
