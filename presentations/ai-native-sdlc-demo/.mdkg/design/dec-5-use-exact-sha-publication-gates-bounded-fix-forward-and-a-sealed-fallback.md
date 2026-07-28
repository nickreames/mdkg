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
the revised or unchanged source contract. Demo 3 is the timed dress rehearsal;
Goal 9 later uses its measured evidence to prepare a fresh Demo 4 live run.

Goal 6 must seal a human-accepted prospective range-validation policy and a
preparation-baseline publication handoff for Demo 3. Goal 9 must do the same
independently for Demo 4. The corresponding timed goal publishes preparation
surfaces before `P0` and `T0`, proves the published base equals `origin/main`,
releases the root-integration writer lease, and only then dispatches one
designated harness. No nonexistent future push range is
pre-approved: the actual linear descendant range and stable range hash are
computed and checked against the policy immediately before the normal push.

The pre-event human authority binds the clean pre-publication origin plus the
expected preparation manifest/tree hash and an activation rule. The separate
baseline-publication approval authorizes that exact preparation transaction.
After its normal push, the timed goal derives the real published baseline SHA,
verifies the tree and origin, and writes an authority-activation receipt. Only
that receipt activates the timed workflow; no future baseline SHA is guessed.

While the policy, lease, quiet window, base/origin state, and allowlist remain
valid, it pre-authorizes allowlisted implementation, local and canonical
build-once validation, bounded fix-forward commits, non-force `origin/main`
push, read-only deployment inspection, and live-route verification without
another mid-run confirmation. Demo 2 approval does not carry forward to Demo 3,
and Demo 3 authority does not carry forward to Demo 4.

Success requires both existing production projects to report READY for the exact final pushed SHA and required routes to pass. A merely recent deployment is insufficient.

One fix-forward attempt is one bounded diagnosis, allowlisted edit, full local
re-gate, logical commit, fetch and zero-behind check, non-force push, and
exact-SHA/live recheck. A timed run permits at most two pre-publication repair
cycles and one production fix-forward cycle. Polling consumes the global
deadline. No production repair may begin after T+24.

`P0` records presentation/rehearsal kickoff. The orchestrator records immutable
`T0` immediately before invoking the exact child dispatch; `T0` must occur by
`P0+00:45`, and the child must acknowledge by T+00:45. Positioning is due by
T+02, implementation by T+13, local critical validation by T+16, mechanical
canonical integration by T+20, range proof and push by T+22, both exact-SHA
deployments READY by T+26, and live routes plus child checkpoint by T+28:30.
The consolidated reveal receipt is due by T+29:15, its independent selection
test by T+29:30, and all live actions stop at T+30. Demo 2 is selected if any
required state is incomplete. The global deadline always overrides remaining
retry allowance.

Hard blockers include origin advancement, force or unrelated integration,
unavailable credentials or read access, provider outage at the bound, required
provider/DNS mutation, out-of-scope source, unrepaired safety gates, and any
missed hard deadline. On a blocker, preserve evidence and show sealed Demo 2.
For the Demo 3 rehearsal, a truthful failed rehearsal may still produce a
complete evaluation outcome but does not mark the child successful. For Demo 4,
showing the fallback completes the presentation but does not make the live
child successful.

# Alternatives Considered

- Stop at local commit: rejected because it does not prove the live outcome.
- Manual Vercel deployment: rejected because it crosses the authority boundary.
- Unlimited repair: rejected because it threatens timing and safety.

# Consequences

Demo 2 publication has an explicit human gate and is then sealed before both
timed runs. Demo 3 measures the complete path; Demo 4 remains fresh for the
event. Timed actions are pre-approved rather than interactively permissioned,
while drift still fails closed. Child success, rehearsal completion, and
presentation success remain distinct and truthfully reportable.

# Links / references

- prd-1
- edd-1
