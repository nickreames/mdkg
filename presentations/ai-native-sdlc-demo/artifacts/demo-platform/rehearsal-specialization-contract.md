# Demo 2 Rehearsal Specialization Contract

Status: accepted reusable contract; not yet instantiated
Owner phase: Goal 4 for local candidate, Goal 5 for publication
Run root: `presentations/ai-native-sdlc-demo/runs/demo-002/`
Detail route: `/demo/2/`
Output route: `/demo/2/output/`

## Source identity

- Source root: `examples/website-demo-template`
- Source graph: `examples/website-demo-template/.mdkg`
- Source tree hash at Goal 2 acceptance:
  `sha256:729b2196df234787c388cf968874cb0008d0a8d32a186b0a61297e47242459b3`
- Preserved source goal: `root:goal-1`
- Bootstrap manifest:
  `artifacts/demo-platform/operator-materialization-manifest.json`
- Bootstrap command:

```text
node scripts/bootstrap-website-demo-run.js --source examples/website-demo-template --target presentations/ai-native-sdlc-demo/runs/demo-002 --start-goal goal-1 --manifest presentations/ai-native-sdlc-demo/artifacts/demo-platform/operator-materialization-manifest.json --receipt presentations/ai-native-sdlc-demo/runs/demo-002/BOOTSTRAP_RECEIPT.json
```

Goal 4 must reverify the source and manifest hashes immediately before creating
the absent target. Drift returns work to a source-interface review; it is not
silently accepted.

## Required specialization

Before implementation, Goal 4 must add or update public-safe child records for:

- a specialization of source `prd-2` defining Demo 2 audience, offer, required
  story, success criteria, non-goals, and the static-output/public-safety
  boundary;
- one Demo 2 EDD defining the selected composition, data flow, adapter
  integration, failure modes, observability, accessibility, and tests;
- accepted decisions for positioning, visual direction, static Astro,
  visibility/noindex, authority, claims, and candidate retention;
- a specialized `goal-1` that preserves its local id but records a new title,
  condition, requirements, authority, tests, source hash, active node, and
  checkpoint policy;
- the deterministic chain
  `positioning spike -> implementation task -> local test -> integration task -> canonical-site test -> publish task -> exact-SHA/live-URL test -> accepted checkpoint`.

The source goal and specialized goal must remain separately readable. Goal 4
may execute only through the accepted canonical-site local test. The publish and
live-URL nodes remain unauthorized until Goal 5 grants a separate publication
gate.

## Positioning and creative latitude

The positioning spike must choose and record:

- audience and visitor promise;
- problem/context frame;
- required Plan → Work → Evidence story;
- what completed, why it was done, and what comes next;
- source-versus-specialized specification contrast;
- quickstart and feedback CTA;
- visual metaphor, section order, typographic hierarchy, imagery, and CSS-only
  motion direction.

Ocean Flow, static Astro, zero client JavaScript, semantic HTML, keyboard
accessibility, reduced motion, WCAG AA contrast, claims evidence, no runtime
third parties, no remote fonts, no analytics/forms/trackers, and the 500 KiB /
250 KiB budgets are fixed.

## Candidate allowlist

Goal 4 must freeze exact operations and current base hashes for these rows:

| Path | Operation | Owner | Purpose |
|---|---|---|---|
| `presentations/ai-native-sdlc-demo/runs/demo-002/**` | create/update | Demo 2 child writer | child graph, operator files, implementation, and local evidence |
| `mdkg-dev/src/data/demos/demo-2.ts` | create | shared-source writer | accepted sanitized Demo 2 record |
| `mdkg-dev/src/data/demos/index.ts` | update | shared-source writer | register the accepted record |
| `mdkg-dev/src/components/demos/Demo2Output.astro` | create | shared-source writer | distinct agent-selected static composition |
| `mdkg-dev/src/components/demos/outputRegistry.ts` | update | shared-source writer | bind `demo-2` statically |
| `mdkg-dev/CLAIMS.md` | update | shared-source writer | bind candidate copy to accepted evidence |
| `scripts/fixtures/demo-registry-fixtures.json` | update | shared-source writer | move Demo 2 from reserved fixture to configured test shape |
| `scripts/smoke-mdkg-dev.js` | update | shared-source writer | configured route, component, evidence, safety, and zero-JS proof |
| `scripts/smoke-mdkg-dev-seo.js` | update | shared-source writer | noindex/unlisted and sitemap proof |
| `scripts/smoke-mdkg-dev-a11y.js` | update | shared-source writer | detail/output accessibility proof |
| `scripts/smoke-mdkg-dev-perf.js` | update | shared-source writer | route transfer and raster budgets |
| Goal 4 program artifacts | create/update | program orchestrator | public-safe candidate receipts and checkpoint |

No wildcard may broaden canonical-site source beyond the exact rows above.
Every existing file needs its then-current base SHA-256. Any additional path
requires a fresh authority decision.

## Local acceptance gate

Goal 4 completes only when:

- bootstrap creation and verify-only repeat pass;
- source and specialized `goal-1` are distinct, sanitized, and hash-bound;
- the child graph validates and routes cleanly;
- explicit-edge concise and standard packs are context-complete;
- the positioning, implementation, and local test nodes are done;
- `/demo/2/` and `/demo/2/output/` build locally;
- Demo 2 is unlisted and noindex;
- its output uses its own static Astro component;
- zero client JavaScript, claims, secrets, accessibility, asset, and route tests
  pass;
- an accepted candidate checkpoint and offline fallback capture exist.

Goal 4 authorizes no stage, commit, push, deployment, provider action, or live
URL claim.

## Goal 5 publication gate

Goal 5 must separately verify an exact path inventory, clean ownership, fetched
origin state, zero-behind status, and an approved commit set. Only then may the
integration owner stage and commit accepted surfaces, non-force push
`origin/main`, inspect existing deployments, and verify exact-SHA production
routes. Manual redeploy, project creation, DNS changes, analytics activation,
tagging, force push, and package publication remain forbidden.

After exact-SHA and desktop/mobile route proof, seal Demo 2 as the immutable
golden fallback. Later corrections require bounded fix-forward evidence and
must not rewrite the sealed fallback receipt.
