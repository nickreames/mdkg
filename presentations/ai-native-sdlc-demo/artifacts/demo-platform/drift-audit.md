# Goal 2 demo-platform drift audit

Audit date: 2026-07-26 America/Denver
Accepted base commit: `0399f9dfc241a25d724cdcdf9704776dfdc10b45`
Owner: `codex:/root` acting as `program-orchestrator`
Work item: `root:spike-2`

## Boundary

This was a read-only inspection of the reusable template, historical Demo 1,
canonical mdkg.dev demo surfaces, claims, sitemap, and smoke scripts. Writes
were limited to the presentation program graph and
`presentations/ai-native-sdlc-demo/artifacts/demo-platform/`.

The following historical evidence remained immutable:

- `examples/demo-runs/demo-001/**`
- `mdkg-dev/public/demo-001/**`

No build, source mutation, package change, Git integration, push, deployment,
provider action, DNS change, analytics change, or publication occurred.

## Current-state matrix

| Surface | Current evidence | Drift against Goal 2 | Required owner/action |
|---|---|---|---|
| Canonical template | The template is graph/operator material only; it contains no website package or source tree. Its brief, design, decision, EDD, goal, spike, task, and test require Astro plus React Islands. | Goal 2 requires static Astro as the default and zero client directives/generated JavaScript. A fresh fork currently receives the opposite stack instruction. | Shared-source writer updates the template contract while preserving creative latitude and local-first safety. |
| Historical Demo 1 | `demo-001` is a completed Astro plus React run with `client:load`, React dependencies, preserved graph IDs, and a public-safe local receipt. | It cannot be the implementation baseline for the zero-JavaScript platform. Rewriting it would destroy historical evidence. | Keep it read-only; use its receipt and source/executed goal as evidence only. |
| Canonical demo data | `mdkg-dev/src/data/demoSnapshots.ts` is one monolithic Demo 1 record. | It has no `listed`, `noindex`, `sourceGoal`, `executedGoal`, Plan/Work/Evidence, or output-component key. | Split into typed per-demo records and a validated registry. |
| Gallery/navigation | `/demos/` renders every `demoSnapshots` entry and counts the raw array. | Unlisted runs cannot be retained for direct testing without public discovery. | Render and count only `listed: true` records. |
| Detail routes | `/demo/[id].astro` statically emits every record and always uses the same detail structure. | It cannot independently noindex an unreleased detail route and does not show reusable source specification versus executed specification. | Keep static routes, pass the record’s `noindex` policy to the layout, and add source/executed plus Plan -> Work -> Evidence surfaces. |
| Output routes | `/demo/[id]/output.astro` statically emits every record, always noindexes, and contains one monolithic composition. | Future runs cannot choose distinct bounded designs without changing the route. | Add a compile-time Astro component registry keyed by demo record. Keep the route shell and all output components zero-JavaScript. |
| Sitemap | `sitemap.xml.ts` hard-codes `/demo/1/`. | Visibility policy can drift from records and future unreleased runs could be exposed accidentally. | Derive demo detail URLs from records with `noindex: false`; never include output routes. |
| Claims | `mdkg-dev/CLAIMS.md` still says demo graphs are pending even though Demo 1 has an accepted local proof and canonical routes. | Public evidence status is stale and future Demo 2/3 state is not distinguished from Demo 1. | Update only the evidence matrix; do not claim Demo 2/3 execution or publication. |
| Graph/fork smoke | `scripts/smoke-demo-graph.js` hard-codes the template and historical Demo 1 and verifies the prior manual operator-copy flow. | No reusable executable bootstrap proves fork plus operator/skill materialization, repeat equality, or negative drift. | Add one manifest-driven bootstrap and extend the smoke with isolated absent-target, repeat, and failure cases. |
| Site smoke | `scripts/smoke-mdkg-dev.js` proves the overall marketing build emits no client JavaScript but has no demo-specific registry, route, evidence, or output-component assertions. | Broad green site output is insufficient proof of the Goal 2 contract. | Add demo-specific build and public-safety assertions. |
| SEO smoke | `scripts/smoke-mdkg-dev-seo.js` checks the fixed sitemap but not record-derived demo visibility or per-demo noindex. | `listed` and `noindex` can drift without failing. | Assert Demo 1 inclusion plus fixture-only Demo 2/3 exclusion and output-route exclusion. |
| Accessibility smoke | `scripts/smoke-mdkg-dev-a11y.js` does not include `/demos/`, `/demo/1/`, or `/demo/1/output/`. | Goal 2’s demo routes are outside the accessibility page inventory. | Add all three current demo surfaces and source-level responsive/reduced-motion assertions. |
| Performance smoke | `scripts/smoke-mdkg-dev-perf.js` enforces a strict overall marketing budget and zero/low JavaScript indirectly, but not the explicit per-demo 500 KiB transfer and 250 KiB raster limits. | Goal-specific budgets are not reported at route/asset grain. | Add route-level HTML/linked-local-asset accounting and raster checks for demo surfaces. |

## Material choices

### Option A — Static Astro is the canonical template contract

Update the reusable template graph and operator files so every new run starts
with static Astro, no `client:*` directives, no hydration metadata, and no
generated client JavaScript. Keep layout, visual metaphor, section order,
motion implemented with CSS, and marketing copy open to the agent.

Consequences:

- Lowest live-demo risk and simplest deterministic proof.
- Matches the canonical mdkg.dev host contract directly.
- Historical Demo 1 remains honest evidence of the earlier React-capable
  template rather than being rewritten.
- Interactive ideas must use semantic HTML/CSS or be deferred to an explicitly
  different future template.

### Option B — Retain React capability but add a static specialization switch

Keep the React-oriented source decision and require Demo 2/3 operators to apply
a separate static specialization contract.

Consequences:

- Preserves broader template capability.
- Adds a second source of truth and makes the live sendoff easier to
  misinterpret.
- Requires negative tests proving a fork cannot accidentally hydrate.
- Offers no material benefit for the fixed presentation output contract.

## Recommendation

Choose Option A. The reusable starting specification should directly express
the constraints the live agent must satisfy. Static Astro is a guardrail, while
composition and marketing direction remain creative choices.

Implementation should:

1. Supersede the template’s React decision with a static-Astro decision and
   update all current graph/operator instructions that drive a fresh run.
2. Keep historical Demo 1 and its public asset unchanged.
3. Split canonical demo records, add independent `listed` and `noindex`
   controls, add source/executed goal and Plan/Work/Evidence fields, and use a
   compile-time output-component registry.
4. Add a deterministic manifest-driven fork/bootstrap command.
5. Partition proof across build/accessibility/budget, public
   safety/visibility/zero-JavaScript, and fork/bootstrap/context-pack receipts.

## Readiness decision

`task-5` is technically ready only after all of the following occur:

- this spike and its three artifacts are accepted and committed locally;
- the program bundle and root read-only projection are refreshed from that
  clean spike commit by the root integration owner;
- `goal-2-activation-receipt.json` binds the refreshed graph, clean base,
  exact path rows, single shared-source writer, and quiet window;
- every expected source hash still matches.

Until that mutation receipt is accepted, all proposed shared-source paths remain
read-only.

## Evidence

- Explicit-edge concise pack: 19 nodes, 14,367 characters, approximately 3,599
  tokens.
- Explicit-edge standard pack included `spike-2`, `goal-2`, `epic-2`, `prd-1`,
  `edd-1`, decisions 1–6, `goal-1`, `chk-1`, `chk-2`, successor context, and
  the four required skill bodies.
- Nested validation before discovery: `ok: true`, 0 warnings, 0 errors.
- Root projection `ai_native_sdlc_demo`: private, read-only, verified, not
  stale, 0 warnings, 0 errors.
- Start worktree: clean at `0399f9dfc241a25d724cdcdf9704776dfdc10b45`.
