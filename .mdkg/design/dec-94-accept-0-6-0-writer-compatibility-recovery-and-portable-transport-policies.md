---
id: dec-94
type: dec
title: Accept 0.6.0 writer compatibility recovery and portable transport policies
status: accepted
tags: []
owners: [mdkg-project-agent]
links: []
artifacts: []
relates: []
refs: [goal-83, goal-84, bug-7, bug-17, bug-35, task-827]
aliases: []
created: 2026-09-11
updated: 2026-09-11
---
# Context

Nick accepted the four recommended directions on 2026-09-11, then requested
mdkg-node alignment followed by a worktree/parallel-local-agent review. This
decision supersedes historical unanswered-policy statements in the linked work
nodes. Acceptance is not implementation, verification, or publication clearance.

# Decision

1. Observational Git helpers must suppress optional Git index writes. Narrow
   helper edits in src/commands/bundle.ts and src/commands/subgraph.ts are
   authorized within the existing Goal84 remedy, preserving the partial Bug17
   transport patch. This is no permission to overwrite unrelated changes.
2. V2 adoption remains explicit. All writers of an adopted graph must support
   its required capabilities; mixed unsupported-version writes are unsupported.
   Add the available configuration/capability guard and document old-init bypass
   limits. Installing a new client does not migrate the canonical graph.
3. Killed-writer recovery is explicit and bound to the exact lock, journal and
   owned file states. An authorized agent may call it when reliable local proof
   is sufficient. Live or ambiguous ownership requires refusal/human review;
   neither elapsed age nor PID alone authorizes takeover. Old weak lock metadata
   does not gain stronger provenance retroactively.
4. Historical public bundles without sufficient transport policy remain
   inspectable through bounded read-only paths. Materialization requires a fresh
   safe export carrying a validated portable-state contract. If original source
   is unavailable, inspect-only preservation is acceptable for0.6.0; no automatic
   guessed conversion. Hash integrity is not trust or execution authority.

Keep the prior accepted public omission of private DB payloads and explicit
exclusion receipts, private portable snapshot compatibility, and exclusion of
live runtime state/locks in both profiles. Git remains distilled project memory;
full operational/economic state remains consumer-owned.

# Alternatives considered

- Caller-only Git environment workarounds: insufficient for a portable CLI.
- Mixed old/new v2 writers: cannot be guaranteed by a new binary controlling an
  already-published old executable; requires a different compatibility design.
- Age-based lock deletion: can steal authority from a live suspended writer.
- Guessing custom DB paths or rejecting all old bundles: respectively unsafe or
  unnecessarily destructive of historical inspection value.

# Consequences

The policy and protected-helper approval blockers are resolved, but bugs7/17/35
remain open until implementation and independent verification. Required guards,
recovery receipts, installed runtime tests and final security review are not
waived. The current turn changes mdkg planning/evidence only; no source fix,
canonical worktree creation/migration, Git integration, push or publication.

Worktree compatibility is now an explicit qualification requirement in the
existing task826/test478 lane. Review first: one writer per checkout, parallel
writers only in distinct checkouts, one integration owner. Worktree lifecycle,
shared Git administration and runtime scheduling remain separately authorized.
Do not mistake a worktree branch of one graph for an independent graph fork.
Specific integration ordering and nested-submodule support remain to be proven,
not silently declared supported by this decision.

# Links / references

- goal83/84/85; bugs7/17/35; tasks826/827/828; test478.
- release/0.6.0-qualification-draft.md predates acceptance. Task827 must update
  its proposal wording and final guidance in the subsequent authorized pass.
