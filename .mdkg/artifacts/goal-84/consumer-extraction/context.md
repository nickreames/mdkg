# Consumer extraction context for mdkg 0.6.0

Status: LOCAL / UNDISPATCHED / CONSUMER ADOPTION UNVERIFIED.
Owner: mdkg-project-agent. Source revision: cd0eb6fcc3f5945cfa3c29fe0cb356d9805e518c.
Authority: local evidence capture only; this directory is not an installable
runtime, public skill, executable export, release, or receiving-project change.

## Read this package

The manifest hashes every copied source/fixture file and both handoff documents.
Source paths retain their original layout under source/. A differing
committed_sha256 identifies a working-copy dependency captured before removal;
the sha256 always names the actual exported bytes. All primary modules' static
relative TypeScript import/export dependencies are included. CLI/test files are
integration evidence, not a claim that this directory is a standalone build.
The original MIT license is at source/LICENSE. Retain it when reusing code.
The source contains historical synthetic fixtures and old command names by design.
It must remain excluded from npm payloads and active mdkg capability discovery.

## Ownership contract

- mdkg: distilled intent, project memory, graph identity/reference integrity,
  generic manifests, work mirrors, local evidence and revision descriptors.
- Runtime: agent/tool execution, native Git orchestration, authentication,
  repository materialization, consumer receipt policy, resource/role scheduling.
- Backend: full operational work receipts, credit/payment accounting, ratings,
  reputation, ledger and canonical marketplace state.
- Orchestrator: route receiving work to the owning individual project repository.
  A worktree is a checkout of one project graph, not an independently forked graph.

## Removed Git workflow capabilities

Source: commands/git.ts and commands/git_materialize.ts, relative to source/src/.
Tests: source/tests/commands/git.test.ts and git_materialize.test.ts; smoke source
and release checks are included as evidence, not instructions to run against a
real remote. The future mdkg CLI retains only git inspect from this family.

| Removed surface | Consumer replacement responsibility |
| --- | --- |
| git clone/fetch/push | Invoke native Git explicitly with receiving-task authority and external auth. No wrapper compatibility in mdkg. |
| push --stage-all/--message | Exact owned-path staging and reviewed commits must be a consumer workflow, never inferred from graph completion. |
| git materialize | Retain source request/receipt semantics only if the consumer needs them; implement native Git transport under its own boundary. |
| git closeout | Compose generic validation/receipt/snapshot calls explicitly; do not infer snapshot or Git authority. |
| git push-ready | A consumer readiness policy, not a guarantee of authorization or current remote state. |

Materialization request and receipt types, reason codes, exact revision/tree
checks, source/access/correlation references, project-memory/submodule policies,
depth and auth capabilities are preserved in git_materialize.ts. Preserve bounded
request/output handling, sanitized diagnostics, no embedded credentials, prompts
disabled, hooks disabled, explicit auth capability, contained absent destinations,
same-parent atomic publication, exact commit/tree verification, no recursive
submodule initialization, cancellation cleanup, and truthful cleanup failures.
Do not strip these constraints when moving behavior to a consumer. Actual
credentials, agent sockets and provider responses do not belong in receipts.

## Removed consumer validation and metadata

Source: commands/validate.ts, graph/agent_file_types.ts and graph/skills_indexer.ts.
Profile tests and generic receipt controls are in commands/agent_file_types.test.ts;
skill index/search/output tests are included under tests/graph and tests/commands.

The old omni-room profile was opt-in. It rejects ambiguous profile metadata,
requires a supplied contract_profile to match, restricts receipt_kind and
redaction_class to known enums, and requires redaction_policy when a class exists.
It does not prove execution or enforce a secure room. Runtime may adopt these
predicates as its own policy; mdkg will not rename or globalize them. The old
validate/work validate profile invocation has no alias or silent generic fallback.
Generic contract metadata shape, policy references and existing safety checks
remain useful; copying the named profile is not required to consume mdkg.

The old skill index extracts ochatr_* keys, projects an ochatr object and an
extensions.ochatr map, and includes those fields in search and rendered packs.
All special treatment is removed. Source skill files must not be rewritten
automatically. Consumers needing policy metadata must own its interpretation;
there is no replacement mdkg namespace framework in this pass.

## Generic successor versus extracted policy

- runtime_mode room_orchestrated becomes orchestrated: descriptive vocabulary,
  not runtime execution. No old-token alias; explicitly adapt owned inputs.
- pricing_model is no longer a first-class WORK requirement or quoted default.
  Pricing belongs in consumer commercial contracts. Generic work remains usable
  without commercial data; optional cost/evidence locators are not payment proof.
- Generic agent roles, skill/tool/model/image/subagent references and resource
  descriptors remain descriptive and portable.
- Work orders, receipts, feedback/dispute/proposal records remain semantic
  mirrors. Local verification establishes linkage and evidence consistency,
  not attestation authenticity, actual execution or settlement.
- Optional queues, SQLite snapshots and lease/CAS helpers remain generic local
  infrastructure. They coordinate clients of that database, not independent
  worktrees or distributed agents. Full operational records remain external.
- Product/provider-name lint rules move to repository-owned publication checks;
  generic CLI portability checks must not know consumer names.

## Receiving acceptance scenarios

1. A synthetic consumer requests an exact revision/tree using its native Git
   workflow and records refs-only evidence; mismatches and unsafe destinations
   fail without claiming success or leaving unreported partial state.
2. Consumer policy validates its own receipt classes/redaction requirements;
   mdkg separately validates generic linkage and structure. Neither substitutes
   for provider evidence or execution authority.
3. A noncommercial work contract and generic orchestrated manifest work without
   product vocabulary; legacy authored inputs are adapted explicitly, not silently.
4. Separate project worktrees retain one graph identity, distinct new node UUIDs,
   isolated local state and reviewed ancestry-preserving integration.
5. Runtime/backends keep full receipts and economics outside Git memory; mdkg
   retains small summaries, stable references, hashes and durable decisions.
6. Removed CLI commands have no fallback. Consumer adaptation must not depend on
   deep-importing removed mdkg modules or installing this evidence package.

## Limits and completion

This is source-grounded transfer context, not a current consumer compatibility
test or security clearance. No receiving repository, provider, registry or remote
was contacted. No copied payload was executed. Consumers must perform their own
scoped review and qualification before adoption. Final mdkg qualification needs
independent security diff review, installed tests and an exact artifact seal.

Reproduce the manifest/inventory check from the mdkg source checkout with
node scripts/export-consumer-context.js --verify. Manual content review is
required in addition to deterministic credential-shape screening.
