# Demo 3 Event Specialization Contract

Status: accepted reusable contract; not yet instantiated
Owner phase: Goal 6 for frozen preparation, Goal 7 for live execution
Run root: `presentations/ai-native-sdlc-demo/runs/demo-003/`
Detail route: `/demo/3/`
Output route: `/demo/3/output/`

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
node scripts/bootstrap-website-demo-run.js --source examples/website-demo-template --target presentations/ai-native-sdlc-demo/runs/demo-003 --start-goal goal-1 --manifest presentations/ai-native-sdlc-demo/artifacts/demo-platform/operator-materialization-manifest.json --receipt presentations/ai-native-sdlc-demo/runs/demo-003/BOOTSTRAP_RECEIPT.json
```

Goal 6 must reverify source and manifest hashes, create the absent target, and
prove verify-only equality before specialization.

## Required frozen specialization

Goal 6 must specialize source `prd-2` and create public-safe Demo 3 EDD,
decisions, and a specialized `goal-1` that records:

- audience, offer, required story, and event positioning;
- source hash and reusable source-goal snapshot;
- specialized title, condition, requirements, authority, and tests;
- `/demo/3/` and `/demo/3/output/`;
- the chain
  `positioning spike -> implementation task -> local test -> integration task -> canonical-site test -> publish task -> exact-SHA/live-URL test -> accepted checkpoint`;
- accepted-base SHA, origin observation, exact path-and-operation allowlist,
  quiet-window owner and expiry, attempt/time bounds, hard blockers, and sealed
  Demo 2 fallback;
- checkpoint policy for success and transparent hard-blocker evidence.

The Goal 2 baseline normative live sendoff bytes are:

- source: task-10 `Normative Live Sendoff Contract`, normalized to one trailing LF
- materialized artifact: `artifacts/demo-platform/live-sendoff-contract.md`
- SHA-256:
  `63c3991d84b608eb6be0ee95cf5d7fa077e08758b598c5afa02dffaa2c461220`
- byte length: `1605`

After Goal 5, Goal 6 spike-6 may recommend an evidence-backed refinement.
Task-47 may either retain this baseline byte-for-byte or create a versioned
replacement under `artifacts/demo-003/`; test-25 must verify the selected
version. Task 31 consumes exactly the version and hash accepted by test-25.
Event-specific hashes, owners, paths, lease values, and authority belong in
separate allowlist/authority artifacts.

The positioning spike may be completed during Goal 6 only if it does not create
website implementation. The implementation task and every successor remain
unstarted. A dry rehearsal must stop before implementation, staging, commit,
push, deployment, or provider mutation.

## Frozen event allowlist shape

Task 31 binds then-current hashes and owners for these exact rows:

| Path | Operation | Owner | Purpose |
|---|---|---|---|
| `presentations/ai-native-sdlc-demo/runs/demo-003/**` | create/update | Demo 3 child writer | specialized graph, implementation, operator context, and evidence |
| `mdkg-dev/src/data/demos/demo-3.ts` | create | shared-source writer | sanitized event record |
| `mdkg-dev/src/data/demos/index.ts` | update | shared-source writer | register Demo 3 |
| `mdkg-dev/src/components/demos/Demo3Output.astro` | create | shared-source writer | distinct event composition |
| `mdkg-dev/src/components/demos/outputRegistry.ts` | update | shared-source writer | bind `demo-3` statically |
| `mdkg-dev/CLAIMS.md` | update | shared-source writer | bind event copy to evidence |
| `scripts/fixtures/demo-registry-fixtures.json` | update | shared-source writer | move Demo 3 from reserved fixture to configured test shape |
| `scripts/smoke-mdkg-dev.js` | update | shared-source writer | route, evidence, safety, and zero-JS proof |
| `scripts/smoke-mdkg-dev-seo.js` | update | shared-source writer | noindex/unlisted and sitemap proof |
| `scripts/smoke-mdkg-dev-a11y.js` | update | shared-source writer | desktop/mobile accessibility proof |
| `scripts/smoke-mdkg-dev-perf.js` | update | shared-source writer | transfer and raster budgets |
| Goal 7 program artifacts and bundle source | create/update | program/root integration owners | event receipts, checkpoint, and projection refresh |

No other canonical source, package, lockfile, deployment configuration, DNS,
analytics, or provider configuration is implied. Existing rows require exact
base SHA-256 values. Head, origin, content, owner, or lease drift invalidates
the frozen event allowlist.

## Event activation gate

Goal 7 may start only when:

- Goal 6 has an accepted readiness checkpoint;
- Demo 2 is still live and sealed as the fallback;
- the approved deck and reveal sequence are frozen;
- the branch is the intended branch, origin is fetched, and the checkout is
  zero behind;
- the quiet window excludes parallel root/Git writers;
- Git credentials, non-force push capability, Vercel read visibility, and both
  existing production project identities were preflighted without storing
  credentials;
- task-31 has copied the normative sendoff bytes and recorded the matching
  SHA-256;
- task-31 has recorded a separate human-accepted
  `artifacts/demo-003/event-authority.json` binding the sendoff, allowlist,
  lease, complete approved push range, authorized live actions, forbidden
  actions, validity window, and invalidation conditions;
- every allowlist row, source hash, target path, route, child node, and
  activation condition is inspectable from a fresh-agent pack.

## Live execution and reveal

The audience-facing program goal delegates to the specialized child
`goal-1`. The child continues through implementation, local proof, canonical
integration, publication, exact-SHA production verification, and accepted
checkpoint unless a normative hard blocker occurs.

The accepted event-authority receipt is the pre-approval for those exact live
actions. The running agent does not request another approval for an in-scope
edit, validation, bounded fix-forward commit, normal push, read-only provider
inspection, route verification, or integration-owner bundle refresh while all
frozen identities remain valid. Any drift invalidates the receipt and becomes a
hard blocker rather than an invitation to broaden authority.

The reveal shows:

- canonical source `goal-1`;
- specialized Demo 3 `goal-1`;
- the final landing page;
- Plan → Work → Evidence;
- what completed, why, and what comes next;
- exact-SHA deployment and live-route receipts.

Describe this as reusable starting specification versus specialized executed
specification. Do not teach graph-fork mechanics, loops, or subgraph internals.

On a hard blocker, seal precise evidence, stop further side effects, reveal the
golden Demo 2 fallback, and state that Demo 3 did not complete.

## Post-event boundary

Goal 7 does not authorize canonical-site adoption beyond the Demo 3 allowlist.
Goal 8 separately decides whether Demo 2 or Demo 3 is promoted, retained
unlisted, or archived and whether any copy, layout, Astro, SEO, or
LLM-discovery idea should be adopted.
