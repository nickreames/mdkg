---
id: chk-564
type: checkpoint
title: Close compact bootstrap and provenance-aware upgrade goal
checkpoint_kind: goal-closeout
status: done
priority: 9
tags: [goal-81, bootstrap, validated]
owners: [mdkg-project-agent]
links: []
artifacts: []
relates: [root:goal-81, root:task-816, root:task-817, root:task-818, root:test-474]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [goal-81, task-816, task-817, task-818, test-474]
created: 2026-09-05
updated: 2026-09-05
---

# Summary

Goal 81 implementation and acceptance are complete locally: compact default init,
hash-bound provenance-aware upgrade/recovery, and focused skill discovery.
AGENTS.md now states that explicitly running a fully planned goal authorizes its
declared implementation and validation, without repeated implementation approval.
Task-816, task-817, task-818 and test-474 are done. Goal evaluation confirmed
completion evidence; the explicit goal-done transition closes Goal 81. Goal 82
remains paused and unclaimed.

# Scope Covered

mdkg-only bootstrap and generic workflow guidance. No identity/reconciliation
implementation, consumer upgrade, fleet migration, public deployment or release.

## Changed Surfaces

Exact Goal 81-owned working-tree paths (not a staging or commit authorization):

```text
.agents/skills/author-mdkg-skill/SKILL.md
.agents/skills/build-pack-and-execute-task/SKILL.md
.agents/skills/pursue-mdkg-goal/SKILL.md
.agents/skills/pursue-mdkg-loop/SKILL.md
.agents/skills/select-work-and-ground-context/SKILL.md
.agents/skills/verify-close-and-checkpoint/SKILL.md
.claude/skills/author-mdkg-skill/SKILL.md
.claude/skills/build-pack-and-execute-task/SKILL.md
.claude/skills/pursue-mdkg-goal/SKILL.md
.claude/skills/pursue-mdkg-loop/SKILL.md
.claude/skills/select-work-and-ground-context/SKILL.md
.claude/skills/verify-close-and-checkpoint/SKILL.md
.mdkg/index/mdkg.sqlite
.mdkg/skills/author-mdkg-skill/SKILL.md
.mdkg/skills/build-pack-and-execute-task/SKILL.md
.mdkg/skills/pursue-mdkg-goal/SKILL.md
.mdkg/skills/pursue-mdkg-loop/SKILL.md
.mdkg/skills/select-work-and-ground-context/SKILL.md
.mdkg/skills/verify-close-and-checkpoint/SKILL.md
AGENTS.md
CLI_COMMAND_MATRIX.md
assets/init/AGENTS.md
assets/init/AGENT_START.md
assets/init/CLAUDE.md
assets/init/README.md
assets/init/llms.txt
assets/init/skills/default/author-mdkg-skill/SKILL.md
assets/init/skills/default/build-pack-and-execute-task/SKILL.md
assets/init/skills/default/pursue-mdkg-goal/SKILL.md
assets/init/skills/default/pursue-mdkg-loop/SKILL.md
assets/init/skills/default/select-work-and-ground-context/SKILL.md
assets/init/skills/default/verify-close-and-checkpoint/SKILL.md
docs/_generated/cli-reference.md
docs/_generated/command-contract-summary.json
scripts/assert-publish-ready.js
scripts/copy-init-assets.js
scripts/smoke-init.js
scripts/smoke-upgrade.js
src/cli.ts
src/commands/init.ts
src/commands/init_manifest.ts
src/commands/skill_support.ts
src/commands/upgrade.ts
src/core/filesystem_authority.ts
src/util/argparse.ts
tests/commands/cli.test.ts
tests/commands/cli_runtime.test.ts
tests/commands/init.test.ts
tests/commands/security_containment.test.ts
tests/commands/skills.test.ts
tests/commands/upgrade.test.ts
.mdkg/design/edd-80-compact-bootstrap-discovery-and-provenance-preserving-upgrades.md
.mdkg/work/chk-564-close-compact-bootstrap-and-provenance-aware-upgrade-goal.md
.mdkg/work/goal-81-simplify-default-initialization-and-focused-instruction-discovery.md
.mdkg/work/task-816-implement-compact-default-init-and-focused-instruction-router.md
.mdkg/work/task-817-implement-provenance-aware-bootstrap-upgrade-and-recovery.md
.mdkg/work/task-818-align-bootstrap-discovery-links-and-native-skill-projections.md
.mdkg/work/test-474-verify-compact-bootstrap-preservation-discovery-and-upgrade-recovery.md
assets/init/legacy/0.5.2-before-compact.json
src/commands/bootstrap_instructions.ts
src/commands/upgrade_projections.ts
src/commands/upgrade_transaction.ts
tests/commands/compact_bootstrap.test.ts
tests/commands/upgrade_safety.test.ts
```

The source/asset/test/skill manifest (ordered JSON path+SHA-256 entries, excluding
mdkg work/design/index records) has SHA-256 312b85d78d88051eaf46b5f9129a31b9b59ef5ae21c607a34fc4d1f4624f87bf.
Generated surfaces include configured skill mirrors, two docs/_generated
command-reference outputs, built ignored dist output, tracked SQLite and ignored
JSON indexes/events. No bundle or subgraph source refresh occurred.

## Boundaries

Preserved earlier planning paths, not modified by this execution pass:

```text
.mdkg/work/epic-83-future-mdkg-graph-update-and-compatibility-train.md
.mdkg/work/task-363-plan-future-mdkg-graph-update-release-train-for-0-3-5-plus.md
.mdkg/work/test-151-future-graph-upgrade-dry-run-no-mutation-contract.md
.mdkg/design/dec-93-adopt-compact-default-bootstrap-and-identity-backed-numeric-aliases.md
.mdkg/design/edd-81-versioned-graph-identity-and-branch-reconciliation-contract.md
.mdkg/work/chk-563-record-compact-bootstrap-and-branch-identity-planning-approval.md
.mdkg/work/goal-82-enable-branch-safe-graph-identity-and-reviewed-reconciliation.md
.mdkg/work/task-819-distinguish-same-node-conflicts-from-independent-alias-collisions.md
.mdkg/work/task-820-implement-versioned-graph-identity-and-legacy-migration-planning.md
.mdkg/work/task-821-resolve-identity-backed-nodes-across-ordinary-branch-local-commands.md
.mdkg/work/task-822-apply-reviewed-identity-reconciliation-with-durable-alias-receipts.md
.mdkg/work/test-475-verify-branch-identity-command-parity-and-legacy-compatibility.md
.mdkg/work/test-476-verify-semantic-reconciliation-replay-and-reference-safety.md
```

The checkout started with 20 attributable planning/index dirty paths. The final
review inventory has 77 paths, all unstaged. No unknown work was absorbed.
No root/sibling source, provider, deployment, publication, tag, history, commit,
push or canonical-checkout upgrade. Local package smoke installed only into
disposable prefixes; it did not publish a package.

# Decisions Captured

DEC-93 and EDD-80, plus the user's explicit Run/continuation instruction.
AGENT.md was interpreted as the existing AGENTS.md, not a new competing file.
Compact is default; --agent and --agent=false remain compatible; --graph-only is
the explicit opt-out. Existing graph-only workspaces do not silently adopt agents.
Requested conflicts block all writes; safe subsets need an exact reviewed
selection. No automatic rollback, mirror pruning, event-history reconstruction,
Git staging, or identity migration is implied by upgrade.

# Implementation Summary

One bounded router under .mdkg; root managed sections preserve surrounding bytes.
Init preserves previous installed provenance on repetition. Upgrade collects an
in-memory exact plan and hashes input/destination state before writes. Explicit
resume/recover uses verified original bytes, stops on later edits, and stores a
mode-0600 local journal. A narrow optional mode on the existing contained atomic
writer is required to keep journal temporary bytes private from creation.
Source and native skill projections remain distinct; no new skill was created.

# Goal Closeout

- Condition: implemented and proven locally.
- Closed scope: task-816, task-817, task-818, test-474.
- Deferred: Goal 82 branch-safe identity/reconciliation; no execution authorized
  by this goal's closure. Adoption in this or other checkouts and Git/release work
  remain separate gates.

# Verification / Testing

## Command Evidence

| Command | Result |
| --- | --- |
| npm run build | PASS |
| npm run test | PASS: 678 TypeScript tests + 26 public-release contract tests |
| Focused bootstrap/upgrade/CLI/containment run | PASS: 65/65 |
| npm run cli:check | PASS |
| npm run docs:check | PASS: generated docs/release data and 474 command examples |
| npm run smoke:upgrade | PASS: packaged local 0.5.2 fixture |
| npm_config_offline=true npm run smoke:init | PASS: packaged default/graph-only/compatibility/mirror fixtures |
| node dist/cli.js skill validate --json | PASS: 8 skills; zero errors/warnings |
| node dist/cli.js validate --changed-only --json | PASS: zero errors/warnings after index |
| node dist/cli.js validate --json | PASS: zero errors; baseline imported-bundle freshness warnings |
| git diff --check | PASS |

Safety fixtures cover stable no-write preview, stale-plan refusal, mixed CRLF
wrappers, malformed markers/manifests, legacy redirects, public-document
preservation, unknown native skills, interruption after every write of the
bounded three-write end-to-end operation, explicit resume/recovery, and rejection
of later user edits. Original bytes and sentinel Git index remain protected.

## Pass / Fail Status

All goal gates passed. Early old-layout assertions were updated to verify the
new compact contract, without removing detailed documentation requirements.
The complete final suite passed after those changes.

## Known Warnings

Three imported graph bundles are age-stale. They predate this work and were not
refreshed. The separately documented SQLite verifier fingerprint issue in
chk-563 remains outside scope; no claim is made that db index verify passed.
Final graph/index state is revalidated after goal lifecycle closure.

# Known Issues / Follow-ups

Git main and cached origin/main remain 9652b8558942041cbebe8f444fbc79e16b1a670d,
0/0 divergence. No remote verification or Git mutation occurred. No staged paths.
Selected Goal 73 remains achieved; selection SHA-256 remains
f996926a868b7c06fb29311fb69c48d862e9dc354404f777df93e1c5443b07ab.
Demo 3 bundle SHA-256 remains
741b4644da1d3d1ff3bbd4b9240e22870609f015e49e28170a91748ab024570b.
Runtime custody inspection found five released historical leases, no active
lease and zero queue/message rows. This run used supported goal/task ownership
and transient command locks, not an invented lease CLI or new runtime DB.
Final goal-done clears active_node; owner labels remain provenance, not a lease.

## Follow-up Refs

Goal-82, task-819..822, test-475..476 remain the approved planning package for
later explicit Run. No new skill candidates; detailed update receipts for six
existing skills are in task-818. Commit/push/release/adoption remain unapproved.

# Links / Artifacts

Transient local logs are not durable memory authority. Their SHA-256 values:

- final tests: 3c17e97b59974d6c331e10eeec5e13bd27088d06ff89ebba963ef67e21bc5b66
- focused tests: 9af0a2d0dd6e080a03f6c28b4d31c427610d1aee43ad3e793f5c68561cc530f0
- upgrade smoke: 569e6f50f813afbab7e1d9d87a669f2b6ada028a7dbf6cca7685c258a171bad9
- init smoke: f7f7833fdbcec63dd4f5978ad4c78249c350a720c426ffa455384e6ab96b8978

# Raw Content Safety

Only scoped outcomes, paths, hashes, generic command evidence and authority
boundaries are recorded. No secrets, provider payloads, raw prompts or raw task
history were copied. Package validation is not publication authority.
