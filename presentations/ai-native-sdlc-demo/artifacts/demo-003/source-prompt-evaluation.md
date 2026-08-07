# Demo 2 Source and Prompt Evaluation

Status: recommendation ready for explicit human acceptance
Owner: `ai-native-sdlc-demo:spike-6`
Decision requested: authorize or reject the exact Task 47 mutation allowlist

## Outcome

Demo 2 proved the static Astro, Ocean Flow, public-safety, source-versus-run,
Plan → Work → Evidence, and production-verification contracts. It did not prove
that a fresh run is a zero-edit specialization of the reusable graph.

The recommended change is a bounded source-release refinement:

1. promote the complete generic execution chain into the reusable source;
2. describe each run with a validated immutable binding instead of rewriting
   the child graph after the fork;
3. hash authored source separately from mutable mdkg runtime state;
4. materialize every operator prerequisite, including the source `README.md`
   and root `.gitignore`;
5. keep Git, provider, quiet-window, and event authority outside the child and
   bind them by hash only when the caller grants them.

This preserves creative latitude: the child positioning spike chooses the
audience promise and composition at runtime and records that decision as
child-local evidence. Demo 2's “Keep the plan when the agent changes” concept
is evidence of the pattern, not a source default.

## Evidence-Based Findings

| Rank | Finding | Evidence | Classification | Required response |
|---|---|---|---|---|
| 1 | Demo 2's source graph ended after local validation, so integration, canonical validation, publication, and live verification were hand-authored after the fork. | Source has `spike-1 → task-1 → test-1`; Demo 2 added `task-2 → test-2 → task-3 → test-3 → chk-3`. | reusable authored source | Put the complete generic topology and lifecycle boundaries in the source release. |
| 2 | The operator manifest omitted `README.md` and `.gitignore`, while the copied handoff prompt told the fresh agent to read `README.md`. | Source contains both files; Demo 2's root contains neither; an untracked `.mdkg/pack/` remains in the run. | source/operator defect | Materialize both files and verify their hashes and modes. |
| 3 | The handoff prompt used unqualified `mdkg` commands and described a local-only stopping point. | `DEMO_HANDOFF_PROMPT.md` lacks explicit `--root` on lifecycle commands and stops at a local candidate. | reusable prompt defect | Use target-root-explicit claim/start/update/done/evaluate instructions and state-neutral handoff language. |
| 4 | The bootstrap receipt hashes the entire `.mdkg` tree, including indexes, SQLite, events, and selected-goal state. | `source_tree_hash` and `cli_source_tree_hash` are different identities and include generated state. | source identity defect | Define an authored semantic release manifest and hash; record generated runtime state separately. |
| 5 | The bootstrap script hardcodes only the four-node local chain and `spike-1`. | `requiredQids` and routing assertions omit the later generic stages. | bootstrap/test defect | Derive expected chain and first actionable node from the accepted source release manifest. |
| 6 | Demo 2 required three build attempts because isolated dependency resolution and link shape were not prepared. | `runs/demo-002/artifacts/implementation-receipt.json`. | execution variance with reusable mitigation | Require warm dependencies, one portable output component, and one-attempt dependency preflight before the timed run. |
| 7 | Concurrent smoke commands raced on the shared `mdkg-dev/dist` tree. | Production route and smoke-contract receipts record a failed parallel attempt followed by a clean serial pass. | reusable validation defect | Build once and run shared-output checks serially. |
| 8 | Demo 2's achieved child graph has closure drift: its goal has no evidence refs and source scope invariants were not preserved consistently. | Child `goal-1`, `test-3`, and source-versus-child comparison. | reusable graph closure defect | Require final evidence refs, preserved epic scope, completed chain, accepted checkpoint, and achieved-goal evaluation consistency. |
| 9 | Comprehensive production verification consumed more time than the live window permits. | Historical timing ledger records 15:06 for the comprehensive route-verification segment. | timed-run boundary | Prepare a fast verifier for the reveal gate; defer screenshots, exhaustive audits, and bundle refresh until after the reveal decision. |
| 10 | Demo 2's result is strong evidence for a single harness, not evidence of harness equivalence or uninterrupted eight-hour execution. | Accepted Goal 5 receipts and `chk-18`. | claim boundary | Keep the live run single-harness and approximately 30 minutes; reject multi-harness and eight-hour claims from this demo contract. |

## Five-Way Classification

### 1. Reusable authored source release

- A complete generic chain:
  `positioning spike → implementation task → local test → integration task → canonical-site test → publication task → exact-SHA/live-route test → accepted checkpoint`.
- Fixed static Astro, zero-client-JavaScript, Ocean Flow, accessibility,
  public-safety, noindex/unlisted, transfer-budget, quickstart, and feedback
  requirements.
- One portable `DemoOutput.astro` artifact contract plus a thin canonical
  wrapper/registry binding.
- Explicit target-root commands and complete mdkg lifecycle instructions.
- Semantic authored-source release manifest that excludes indexes, SQLite,
  events, packs, selected state, receipts, and other mutable runtime files.
- Validated run-binding schema, deterministic materialization receipt,
  verify-only repeat, stable QIDs, cursor invariants, and closure consistency.
- Warm dependency preflight, build-once validation, serial shared-output
  checks, deterministic receipts, and a fast production verifier contract.
- Required skill and concise-pack coverage for every actionable node.

### 2. Immutable run-binding inputs

- Demo ID, target run root, detail route, output route, and component key.
- Bounded positioning brief, audience constraints, required story, designated
  harness, and timed-run profile.
- Source release ID/hash, binding schema version, materializer version, and
  expected authored child-contract seal.
- Child-local artifact paths and caller-owned integration/publication receipt
  paths.
- Explicit immutable and mutable field classes. The binding may specialize
  data values, but it may not rewrite authored graph topology or requirements.

### 3. Child-local runtime state and evidence

- Positioning decision, implementation and assets, status/cursor/events,
  generated indexes, packs, and local dependency links.
- Local validation, canonical integration, publication, deployment, route,
  screenshot, timing, attempt, and final checkpoint receipts.
- Commit SHAs, deployment IDs, URLs, and completion evidence.
- Any runtime choice made inside the creative latitude granted by the source.

### 4. External caller authority

- Human acceptance, exact path-and-operation allowlist, writer lease, quiet
  window, branch/origin baseline, non-force push policy, and validity window.
- Git credentials, provider visibility, project identity, repair limits, hard
  blockers, and fallback selection.
- Authority stays in a caller-owned receipt. The child may consume only the
  frozen receipt identity and must fail closed on drift; the source never
  grants publication authority to itself.

### 5. Rejected from the reusable source

- Demo 2's promise, navigation-chart metaphor, page composition, copy, and
  marketing angle.
- Demo-specific IDs, routes, SHAs, deployment IDs, URLs, screenshots,
  checkpoints, statuses, events, indexes, packs, and receipts.
- Credentials, raw provider payloads, a standing quiet window, or self-granted
  push/deployment authority.
- Multi-harness equivalence, an eight-hour live execution claim, remote
  research, image generation, remote assets, new dependencies, or new route
  architecture during the timed run.
- A whole mutable `.mdkg` tree hash as the immutable source-release identity.

## Recommended Source Release and Run-Binding Contract

The bootstrap should accept:

```text
source root + accepted semantic release manifest + immutable run binding
```

and produce:

```text
exact authored child graph + materialized operator files +
binding receipt + immutable child-contract seal
```

The absent-target creation path must be deterministic. Re-running the same
command against the created target must enter verify-only mode and prove the
same semantic release, binding, authored child content, operator inventory,
first actionable node, and pack coverage. Mutable runtime state is permitted
only after the child begins work and must not alter the authored-contract seal.

The source graph owns work topology and invariant requirements. The binding
owns run identity and bounded values. The child owns execution evidence. The
caller owns external authority. No post-fork graph editing is part of the
normal path.

## Exact Proposed Task 47 Mutation Allowlist

Task 47 may change only the following source and operator surfaces after
explicit human acceptance:

### Existing files

| Path | Before SHA-256 | Intended change |
|---|---|---|
| `examples/website-demo-template/README.md` | `a578f0249d5a84ccc5facf401053a14da15240c6976454de04d99386a87d41c9` | Explain semantic release, binding, zero-edit fork, lifecycle, and caller authority. |
| `examples/website-demo-template/.gitignore` | `b712e8e66857e638e5bea6d42a0cdbe9bcef45f8bc2103bc6d9287fab3d2201a` | Preserve run-local generated-state exclusions; change only if the fixture proves a missing generated path. |
| `examples/website-demo-template/DEMO_HANDOFF_PROMPT.md` | `d7e4e2c4c3ed03e25f47a385872f20feb35f2b40973111b4f14628301eb9a64d` | Make commands root-explicit and describe the full state-neutral lifecycle. |
| `examples/website-demo-template/.mdkg/design/prd-2-reusable-static-astro-website-demo-platform.md` | `a089216da42dae737becb1da714be3cab51e8c5f2c2a23ff9c3c11f3282accf9` | Define the complete generic outcome and run-binding boundary. |
| `examples/website-demo-template/.mdkg/design/edd-1-ocean-flow-website-demo-design-and-creative-production-contract.md` | `782d85d6dace67f9b2c7b9daac922053d91d62cbf67d596eeb595438c9120ea9` | Define portable output, thin adapter, build-once, and deterministic receipt interfaces. |
| `examples/website-demo-template/.mdkg/design/dec-1-static-astro-and-zero-client-javascript-is-the-demo-stack.md` | `537d9f716a8c566ac60e8e7bf9aaa9d4db5839963335ceb99f4421bf93b59dc0` | Preserve the stack; clarify portable output/wrapper ownership if required. |
| `examples/website-demo-template/.mdkg/design/dec-2-demo-template-remains-preview-gated-and-public-safe.md` | `4e2ba5cbcf0bee4c4ae8b81425295c857cab231ab34e012974c3b98c2da81417` | Preserve fail-closed authority; separate child contract from caller receipt. |
| `examples/website-demo-template/.mdkg/work/goal-1-build-a-complete-differentiated-website-demo-from-the-canonical-mdkg-template.md` | `06397e1a338bfb855c40fba65f8daaaf4f56f0a3aec669d3253886a7ed243c2c` | Scope the complete generic chain and closure evidence. |
| `examples/website-demo-template/.mdkg/work/epic-1-complete-creative-website-demo-build.md` | `b5cb93248bc7118ec801678eb308b5ebc8649d2cfd59f08392adbca04e065d37` | Own all complete-chain actionable nodes. |
| `examples/website-demo-template/.mdkg/work/spike-1-choose-audience-offer-structure-and-creative-direction.md` | `c662c047b9501fa1c3aacc6fab274177e745851fe21d21e2caae98d62f8188ec` | Preserve creative latitude while consuming bounded binding inputs. |
| `examples/website-demo-template/.mdkg/work/task-1-build-complete-static-astro-website-demo.md` | `f2e37afad5cbf5b30686c20be30c27cdf2259a0947f51fb623aa5b645323ec70` | Produce portable output and one-attempt local build evidence. |
| `examples/website-demo-template/.mdkg/work/test-1-complete-website-demo-validation-and-handoff-contract.md` | `1a6943e32cf0495f992ccab1bba07bcc0e5047dc78dd693a3a214f8ce229d014` | Validate local output and route to generic integration. |
| `scripts/bootstrap-website-demo-run.js` | `562e76bc2df7d7c5eba93617584df2663ce6ca4fe18a58d0b9166bc78d89a58f` | Consume release/binding inputs and seal deterministic authored child identity. |
| `scripts/smoke-demo-graph.js` | `9e6fa93ffb9f4ed7412ab65cca4e3a7876a1ded3f7827bcbb04bb00f0e52f2b4` | Test two distinct absent-target bindings, verify-only repeat, tamper failures, pack coverage, and source-index neutrality. |
| `presentations/ai-native-sdlc-demo/artifacts/demo-platform/operator-materialization-manifest.json` | `3ac248cb5f49bc65c1ec5fd73281b8a075d83710f1414ef82914c60db6f2963f` | Add source `README.md` and root `.gitignore`; retain public-safe operator inventory. |
| `presentations/ai-native-sdlc-demo/artifacts/demo-platform/event-specialization-contract.md` | `5bd9616ab9b63655f7297d0088fbdde9d414571d2fab76c8899a7703832ac3ec` | Replace post-fork editing with source-release/binding/seal semantics. |
| `presentations/ai-native-sdlc-demo/artifacts/demo-platform/live-sendoff-contract.md` | `63c3991d84b608eb6be0ee95cf5d7fa077e08758b598c5afa02dffaa2c461220` | Use generic child wording and the accepted two-prepublication/one-production-repair, T+29:15/T+29:30/T+30 boundaries. |

### New files and CLI-allocated nodes

- `presentations/ai-native-sdlc-demo/artifacts/demo-platform/source-release-manifest.json`
- `presentations/ai-native-sdlc-demo/artifacts/demo-platform/run-binding.schema.json`
- `presentations/ai-native-sdlc-demo/artifacts/demo-platform/timed-run-contract.json`
- Four new source work nodes, with IDs allocated by the mdkg CLI:
  generic integration task, canonical-site test, publication task, and
  exact-SHA/live-route test.
- The source goal's accepted closure checkpoint, allocated by the mdkg CLI.
- Generated source `.mdkg/index/**` and `.mdkg/work/events/events.jsonl` changes
  caused by those exact CLI mutations.
- Goal 6 Task 47/Test 25 evidence under
  `presentations/ai-native-sdlc-demo/artifacts/demo-003/**` and their nested
  program mdkg lifecycle/index/event updates.

### Explicitly forbidden in Task 47

- `mdkg-dev/**`, `src/**`, `tests/**`, `docs/**`, packages, lockfiles, deck
  files, deployment configuration, Git staging/commit/push, provider actions,
  and `runs/demo-003/**`.
- Any Demo 2 creative copy or live evidence promoted into source defaults.
- Any CLI/package API or external schema change.

## Required Regression Proof

Test 25 must prove:

1. full validation and zero warnings for the semantic source graph;
2. the full generic chain has deterministic `prev`/`next` routing and stable
   CLI-allocated IDs;
3. two distinct bindings create two absent targets without manual graph edits;
4. each repeat enters verify-only mode with identical release, binding,
   authored-child, operator, routing, and pack receipts;
5. missing/invalid binding, release drift, operator drift, target tampering,
   authored-child drift, and cursor drift fail closed with stable
   classifications;
6. source indexes are unchanged by fixture execution;
7. `README.md` and `.gitignore` are materialized exactly;
8. generated state is excluded from semantic identity and ignored locally;
9. concise first-node packs contain the goal, epic, PRD, EDD, decisions,
   binding contract, caller-authority boundary, predecessors, and required
   skills without truncation;
10. closure consistency requires complete evidence refs and an accepted
    checkpoint before achieved state;
11. fixture execution performs no canonical-site edit, Git mutation, network
    access, provider action, or publication.

## Acceptance Gate

No source file listed above may change until the user explicitly accepts this
recommendation and allowlist. Acceptance authorizes only local Task 47 source
and fixture work. It does not authorize Demo 3 materialization, Git staging,
commit, push, deployment, provider inspection, or event authority.
