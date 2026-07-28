---
id: dec-5
type: dec
title: Use exact-SHA publication gates bounded fix-forward and a sealed fallback
status: accepted
tags: [publication, exact-sha, fallback, vercel, git]
owners: [program-orchestrator]
links: []
artifacts: [artifact://ai-native-sdlc-demo/demo-002-fallback, artifact://ai-native-sdlc-demo/event-receipt]
relates: []
refs: [prd-1, edd-1]
aliases: [exact-sha-live-demo-authority]
created: 2026-07-26
updated: 2026-07-26
---

# Context

A live demo must continue beyond local implementation, but push and production proof are higher authority than coding. Provider drift must not lead to force, manual deployment, or false success.

# Decision

Goal 5 may perform explicitly authorized local preparation after its accepted
candidate checkpoint: repair stale validation expectations, create an exact
local integration allowlist, and create bounded logical commits without push.
It may publish Demo 2 only after those commits exist, origin is freshly fetched,
and a separate human-accepted receipt binds the actual complete
`origin/main..HEAD` commit/path range, local evidence-only dirty exception,
owner, validity window, and forbidden actions. Local Goal 4 authority, Goal 5
activation, commit authority, and this decision do not grant push or provider
read authority.

The approval receipt remains local evidence and is not silently added to the
approved range. Immediately before push the integration owner must re-fetch and
prove that origin, HEAD, the range manifest, lease, expiry, staged-empty state,
and local-evidence exception are unchanged. Drift invalidates approval.

Goal 6 uses the completed Demo 2 evidence to evaluate the reusable source
template and live sendoff. Only explicitly accepted refinements may be applied
before Demo 3 is forked, and a deterministic absent-target bootstrap must prove
the revised or unchanged source contract.

Goal 7 may commit and non-force push only its frozen allowlist after Goal 6
readiness. Goal 6 must first seal a separate human-accepted event-authority
receipt that pre-authorizes the entire frozen live workflow: allowlisted edits,
local and canonical validation, bounded fix-forward commits, non-force
`origin/main` push, read-only deployment inspection, live-route verification,
and the integration-owner bundle refresh. These actions require no additional
mid-run confirmation while the receipt, quiet window, base/origin state, and
allowlist remain valid. Demo 2 approval does not carry forward to Demo 3.

Success requires both existing production projects to report READY for the exact final pushed SHA and required routes to pass. A merely recent deployment is insufficient.

One fix-forward attempt is one bounded diagnosis, allowlisted edit, full local re-gate, logical commit, fetch and zero-behind check, non-force push, and exact-SHA/live recheck. Goal 7 permits at most three attempts and twenty minutes from the first production failure.

Hard blockers include origin advancement, force or unrelated integration, unavailable credentials or read access, provider outage at the bound, required provider/DNS mutation, out-of-scope source, and unrepaired safety gates. On a blocker, preserve evidence and show sealed Demo 2. That completes the presentation but does not achieve Demo 3.

# Alternatives Considered

- Stop at local commit: rejected because it does not prove the live outcome.
- Manual Vercel deployment: rejected because it crosses the authority boundary.
- Unlimited repair: rejected because it threatens timing and safety.

# Consequences

Demo 2 publication has an explicit human gate and is then sealed before the
event. The live run is pre-approved rather than interactively permissioned,
while drift still fails closed. Demo 3 success and presentation success remain
distinct and truthfully reportable.

# Links / references

- prd-1
- edd-1
