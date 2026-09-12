---
id: edd-82
type: edd
title: Classify generic agent contracts and consumer-owned extraction boundaries
tags: []
owners: [mdkg-project-agent]
links: []
artifacts: []
relates: []
refs: [goal-83, goal-84]
aliases: []
created: 2026-09-11
updated: 2026-09-11
---
# Overview

Source-grounded design review for dec-95, not an implementation receipt.
Goal: remove product-specific semantics from mdkg0.6.0 while retaining useful
generic memory/contracts and preserving a source-bound consumer export.
Owner mdkg-project-agent. Reviewed canonical HEAD
cd0eb6fcc3f5945cfa3c29fe0cb356d9805e518c with preserved partial Bug17 source;
this turn changes planning only. One bounded independent read-only source scout
examined work/Git/agent-contract/DB modules; no source tests or consumer reads.

# Architecture

Native Git handles worktree/branch/merge/PR workflows. Mdkg reads Git evidence
and resolves graph identities/references; it does not own developer workflow.
One writer per project checkout; branches of one graph retain graph identity;
independent projects retain independent graph IDs. Runtime coordinates agents,
tools, auth and execution. Backend systems own full operational receipts,
accounting, credit payments and reputation. Root orchestration routes handoffs.

## Semantic classification

| Surface and source | Actual behavior | Recommendation |
| --- | --- | --- |
| validate.ts normalizeValidationProfile/collectContractProfileErrors | Product-named profile checks matching metadata, allowed receipt kinds/classes and redaction-policy presence | Remove/export profile predicates; retain generic shape/ref validation. Renaming the profile would retain the same consumer policy. Do not globalize optional checks silently. |
| skills_indexer.ts extractOchatr; skill.ts, pack.ts, query_output.ts | Extracts only ochatr-prefixed metadata into privileged API/search/render fields | Remove special paths and output adapter. A future general metadata namespace must apply equally to all consumers, not preserve an Omni exception. |
| agent_file_types.ts RUNTIME_MODE_VALUES | room_orchestrated is an enum token; no room execution | Recommend generic orchestrated token, no legacy alias; update owned active seeds/tests. Preserve historical receipt bytes and require explicit user-data conversion. |
| agent_file_types.ts roles, kinds and skill/tool/model/image/subagent/resource refs | Symbolic descriptors and reference validation | Retain generic capabilities. Consumers decide execution, scheduling and resource policy. |
| agent_file_types.ts work pricing_model; work.ts runWorkContractNewCommand | Mandatory pricing enum; new contracts default to quoted | Recommend remove first-class pricing requirement/default and export commercial meaning. A free personal task should not need marketplace metadata. |
| work.ts contract/order/receipt/feedback/dispute/proposal helpers | Committed semantic mirrors; local evidence/linkage checks | Retain generic intent/evidence records. Verification is structural, not attestation authenticity, paid work settlement or execution proof. |
| work.ts trigger enqueue option | Deterministic order mirror plus optional actual local queue delivery, reports executed:false | Generic but operational; keep boundary explicit. No reason to call it Omni-specific. Future simplification may separate delivery, not remove it by string matching. |
| project_db_migrations/events/queue_contract/materializer | Generic local SQLite queues/events/receipts/lease-CAS; internal project_meta.set reducer | Retain optional local substrate for now; not shared worktree/distributed enforcement. Full consumer operational stores remain external. Later extraction is a separate architectural choice. |
| commands/git.ts clone/fetch/push and stage-all | Native Git transport plus optional stage/commit | Remove under accepted decision; export source/receipt/safety contracts. |
| git_materialize.ts; git.ts closeout/push-ready | Auth probing, clone/fetch/checkout; DB seal/dump plus workflow gates | Recommend removing public orchestration wrappers too, not relocating them behind another mdkg alias. Export implementation context for Runtime/native Git integration. Retain independently useful read-only revision descriptors/validation evidence. |
| public_skill_projection.ts portableSkillBodyDiagnostics | Named product/provider denylist for repository publication hygiene | Move repository-specific vocabulary policy into repo-owned checking; retain generic portability safeguards without product-name knowledge in CLI behavior. |
| Historical graph, Demo3 evidence, websites and removed-flag diagnostics | Mixed documentation/history, not all executable policy | Classify individually. No erase-history or public-copy mutation. Unknown old flags can use normal CLI refusal; no special compatibility implementation is needed. |

Nick's subsequent explicit implementation instruction accepts all recommendations
above: remove materialize/closeout/push-ready, retain git inspect, use orchestrated
vocabulary and remove first-class pricing. This is scoped mdkg execution authority,
not consumer implementation/adoption approval. Task833 now preserves the exact
source context before removal; downstream rollout remains separately authorized.

# Data model

Retain stable graph/node identity, human aliases, reviewed mappings, generic
capability descriptors, semantic receipt/evidence refs and format contracts.
Never rename identity UUIDs or rewrite immutable historical receipts to remove
product vocabulary. Explicit future user-data migration differs from automatic
init/upgrade mutation. If retained unknown metadata is permitted, it has exactly
the same opaque treatment as other unknown keys, not an Omni compatibility API.

# APIs / interfaces

Task-833 export should contain: exact source/hash and license manifest; removed
policy predicates/field enums/diagnostics; sanitized code/fixture excerpts;
Git materialization, closeout and source-provenance receipt contracts; filesystem,
auth/redaction and cleanup safety invariants; retained mdkg CLI calls; native
Git equivalents; and before/after consumer acceptance scenarios.
Runtime is the proposed consumer owner, not an agent dispatched by this review.
Deliver a local context pack, not a public mdkg skill, graph bundle, executable
install or claim that Omni has integrated it. No secrets/provider evidence.

# Failure modes

- Cosmetic genericization keeps consumer policy hidden: classify predicates.
- Removing wrappers breaks identity Git reads: test retained observations.
- Removed explicit validation silently succeeds generically: fail clearly.
- Blind substring deletion damages history/user data: inventory owned surfaces.
- Export only names loses safety behavior: include contracts/source/test hashes.
- Concurrent worktree source/graph integration invalidates a preview: exact
  HEAD/index-bound plans, reviewable remapping and tested native Git sequencing.
- Generic DB leases mistaken for cross-checkout coordination: document local
  DB ownership and require consumer coordination outside mdkg.

# Observability

Current historical installed scale evidence: 2000 tasks,20000 events; ordinary
list/show/search/concise pack/validate134-376ms across three runtimes; migrations
252702-258383ms. One paired optimization329196->272214ms preserved custody checks.
Source identity_transaction.ts checkRecoveryCustody re-inventories/reads graph
before every write; the recorded profile attributes95.0391% inclusive samples to
that call (overlapping categories, not additive). This is source-backed repeated
work, not a new benchmark or universal SLA. See bug-7-nullable-read.json and
bug-7-scale-identity-verification.json under .mdkg/artifacts/goal-84/.

Proposed post0.6 goal: scalable safe graph transactions. Tasks: reproducible
size/phase benchmark, algorithm/custody design, bounded implementation, independent
fault-injection verification. Tests: apply/reconcile/resume/rollback, unknown files,
equal-size timestamp-preserving edits, symlinks, stale plans and unchanged indexes.
Choose latency budgets from real workloads; no arbitrary new graph/event limits.
Do not duplicate achieved Goals77/78 release-ladder/CI topology work. No new
performance goal allocated or activated during this boundary enhancement.

# Security / privacy

Keep refs/hashes/distilled summaries, no credentials/raw queues/economic ledgers.
Export source-only synthetic evidence; raw Security reports remain plugin-owned.
This pass does not launch a new Security scan or waive task-828. No remote Git,
provider/deployment/publication, root/sibling edits, source mutation, DB init,
canonical migration, bundle/subgraph refresh or worktree creation.

# Testing strategy

Test-484 covers removed surface refusal, retained generic controls, installed
seed/package/help/docs/MCP parity and export integrity. Task826/test478 prove
actual worktree and full source+graph integration. New blockers feed Goal84 and
task828, then Goal83 qualification and Goal85 publication gates. Full local
runtime/security/release checks occur after implementation, not in this review.

# Rollout plan

1. Record dec95 and this inventory; keep new implementation backlog/unclaimed.
2. Task833 freezes reviewed source and creates/validates local extraction context.
3. Review exact removal/retention inventory; bugs36/37 implement scoped changes.
4. Test484 and existing installed worktree/compatibility lanes independently verify.
5. Task827 updates breaking release guidance; task828 reviews final security diff;
   task829 runs unchanged-threshold ladder; task830 seals candidate.
6. Goal85 remains paused until fresh publication authority. Consumer adoption
   requires separate receiving-repo assignment; no cross-project dispatch here.
