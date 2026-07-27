# Normative Live Sendoff Contract

> Continue until the specialized goal is achieved, the approved commit is non-force pushed to `origin/main`, both production deployments for that exact SHA are READY, and the public detail and output URLs pass verification. Do not stop at a local build or commit. Fix transient in-scope failures forward. Stop only for an enumerated hard blocker.

The child work chain is:

`positioning spike -> implementation task -> local test -> integration task -> canonical-site test -> publish task -> exact-SHA/live-URL test -> accepted checkpoint`

Authorized actions are:

- Edit only the frozen path-and-operation allowlist established by Goal 2 and the Demo 3 run directory.
- Run local validation and production-safe smoke tests.
- Create one or more bounded in-scope fix-forward commits.
- Non-force push the approved commits to `origin/main`.
- Inspect existing Vercel deployments and public URLs without mutating provider configuration.
- Have the root integration owner refresh and verify the program bundle.

Hard blockers are:

- Origin advances after the final preflight.
- Push would require force, history rewriting, or unrelated integration.
- Credentials or provider access are unavailable.
- A provider outage or unresolved production failure exceeds three complete fix-forward attempts or twenty minutes.
- Passing requires DNS, project configuration, manual redeploy, analytics, package publication, or out-of-scope source changes.

On a hard blocker, record precise evidence and reveal the sealed Demo 2 fallback transparently; do not claim Demo 3 succeeded.
