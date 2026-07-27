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

Goal 5 may publish Demo 2 only after its candidate checkpoint and an explicit publication window. Goal 7 may commit and non-force push only its frozen allowlist after Goal 6 readiness.

Success requires both existing production projects to report READY for the exact final pushed SHA and required routes to pass. A merely recent deployment is insufficient.

One fix-forward attempt is one bounded diagnosis, allowlisted edit, full local re-gate, logical commit, fetch and zero-behind check, non-force push, and exact-SHA/live recheck. Goal 7 permits at most three attempts and twenty minutes from the first production failure.

Hard blockers include origin advancement, force or unrelated integration, unavailable credentials or read access, provider outage at the bound, required provider/DNS mutation, out-of-scope source, and unrepaired safety gates. On a blocker, preserve evidence and show sealed Demo 2. That completes the presentation but does not achieve Demo 3.

# Alternatives Considered

- Stop at local commit: rejected because it does not prove the live outcome.
- Manual Vercel deployment: rejected because it crosses the authority boundary.
- Unlimited repair: rejected because it threatens timing and safety.

# Consequences

Demo 2 is sealed before the event. Demo 3 success and presentation success remain distinct and truthfully reportable.

# Links / references

- prd-1
- edd-1
