---
name: Publish Static Demo with Exact-SHA Proof
description: Prepare, authorize, non-force publish, and verify a static demo against exact Git and deployment SHAs when a goal crosses from accepted local evidence into public production.
tags: [stage:execute, writer:orchestrator, git, vercel, exact-sha, publication]
version: 0.1.0
authors: [mdkg]
links: [AGENT_START.md, .mdkg/design/dec-4-use-graph-only-writer-leases-with-one-root-integration-owner.md, .mdkg/design/dec-5-use-exact-sha-publication-gates-bounded-fix-forward-and-a-sealed-fallback.md]
---

# Purpose

Move an accepted static-demo candidate from local evidence to public production
without confusing local success, commit authority, push authority, provider
read access, or exact-SHA proof.

## When To Use

- Use when a selected mdkg node authorizes local publication preparation,
  an exact reviewed push range, a normal push, and read-only production proof.
- Use for static demo routes whose deployment must be tied to the final Git SHA.
- Do not use it to infer publication authority from an achieved local goal.

## Inputs

- Repository and writable mdkg root
- Selected goal/node and accepted predecessor checkpoint
- Sealed candidate and validation hashes
- Exact source, graph, artifact, and generated-projection allowlists
- Writer lease, remote, branch, validity window, and invalidation rules
- Fetched remote SHA and the complete local commit range
- Human publication approval bound to the actual commit/path manifest
- Existing production project identities and required public routes

## Outputs

- Local validation and bounded-commit receipts
- Exact push-range manifest and human publication-approval receipt
- Non-force push receipt
- Exact-SHA deployment and live-route receipts
- Immutable fallback manifest and recovery instructions

## Required Capabilities

- mdkg goal, pack, validation, checkpoint, and bundle verification
- Git status, diff, log, fetch, divergence, staging, commit, and normal push
- Repository build and static-site smoke checks
- Read-only deployment inspection with provider Git-SHA metadata
- Desktop/mobile route, asset, accessibility, privacy, and zero-JavaScript checks

## Resources Touched

- Only paths enumerated by the active goal's accepted local integration allowlist
- Local publication evidence paths explicitly exempted from staging
- Existing Git remote and branch through a normal non-force push
- Existing deployment and public-route APIs through read-only queries
- No DNS, project configuration, environment variables, analytics, aliases,
  package publication, tags, or manual deployment

## Steps

1. Inspect the current goal and selected node; do not trust selected-goal state
   or prior chat as proof.
2. Preview fresh-agent selection and size with
   `mdkg pack <node> --profile concise --edges context_refs,evidence_refs
   --skills auto --skills-depth full --depth <goal-declared-depth> --dry-run
   --stats`. Then build or preview the execution handoff with the same shaping
   flags and `--profile standard`. Concise intentionally summarizes bodies;
   only the standard receipt proves full skill bodies. Default to depth 2 when
   the goal does not declare a tighter bound. Require the selected node, goal,
   epic, PRD, EDD, decisions, accepted predecessor checkpoint, child
   publication nodes, and this full skill body without node truncation.
3. Verify the sealed candidate and reproduce every required local gate. If a
   stale test contract rejects an accepted route, repair only its separately
   scoped test/fixture paths and rerun the complete gate; do not weaken product,
   privacy, accessibility, or zero-JavaScript assertions.
4. Under the root integration-owner lease, stage only the accepted local
   integration allowlist, compare staged paths and hashes to the allowlist, and
   create bounded logical commits. Do not push.
5. Fetch the approved remote. Require a linear zero-behind state and enumerate
   every commit and changed path in the actual `<remote>/<branch>..HEAD` range.
   Hash the manifest. Do not use a planned future commit as an exact range.
6. Obtain explicit human approval that binds the actual commit/path manifest,
   candidate/checkpoint hashes, fetched remote SHA, HEAD, actor, expiry,
   allowed normal push and provider-read operations, forbidden operations, and
   invalidation conditions. Keep approval evidence local and never stage it
   unless a later authority gate explicitly includes it.
7. Immediately before push, re-fetch and verify the remote SHA, HEAD, range
   manifest, lease, approval, staged-empty state, and allowlisted local-evidence
   dirty exception. Any drift returns to step 5.
8. Push only with a normal non-force command. Never amend, rebase, force,
   rewrite, merge unrelated work, tag, publish a package, or mutate a provider.
9. Read the final pushed SHA from Git and inspect both existing production
   deployments. Require `READY` and provider Git-SHA equality for each project.
10. Verify every required public route on desktop and mobile, including HTTP
    status, exact deployment identity, noindex/unlisted behavior, static output,
    zero JavaScript, accessibility, content claims, privacy, and transfer budget.
11. Seal the production, route, rehearsal, and fallback receipts. Close the
    child and parent goals only when their complete evidence conditions pass.

## Validation Checks

- Nested and child `mdkg validate --json`
- Correctly shaped concise coverage preview and standard full-body execution
  pack with no required-node truncation
- Repository build plus all named static-site smoke families
- `git diff --check`, staged inventory equality, fetched zero-behind state,
  actual range-manifest equality, and normal-push receipt
- Both existing deployments `READY` for the exact pushed SHA
- Desktop/mobile live-route, noindex/unlisted, zero-JavaScript, accessibility,
  claim, privacy, and transfer-budget checks
- Fallback hash verification and recovery rehearsal

## Closeout Evidence

- Accepted checkpoint and candidate hashes
- Local gate and logical-commit receipts
- Exact approved range manifest and approval hash
- Pre/post remote SHAs and non-force push receipt
- Provider project/deployment IDs, states, and exact Git-SHA comparisons
- Route observations, screenshots, asset measurements, and fallback hashes

## Failure Modes

- Stale remote, non-linear history, force requirement, unapproved commit/path,
  changed HEAD, expired approval/lease, or unrelated dirty/staged work:
  stop and rebuild the approval boundary.
- Missing provider access, project identity, Git-SHA metadata, or a non-READY
  deployment: record the precise blocker; do not deploy manually.
- Failed smoke, safety, accessibility, privacy, or live-route gate: keep the
  goal open and use only explicitly authorized bounded fix-forward work.
- Provider or production failure beyond the goal's attempt/time bound: preserve
  evidence and use the sealed fallback without claiming success.

## Safety Rules

- Treat inspect, edit, stage, commit, push, provider read, deploy, DNS, tag, and
  package publication as separate authority levels.
- Only the named root integration owner may stage, commit, or push.
- Approval covers actual SHAs and paths, never a vague feature name.
- Never expose credentials, tokens, cookies, raw provider payloads, private
  prompts, or unrelated repository content in receipts.
- Never make provider mutations under this skill.

## Related Manifests

- None. Git and deployment providers remain external systems of record.

## Projection Targets

- `.agents/skills/publish-static-demo-with-exact-sha/SKILL.md`
- `.claude/skills/publish-static-demo-with-exact-sha/SKILL.md`

## Open Questions

- None for Goal 5; its goal and decision nodes provide the concrete authority
  bounds, project identities, routes, retry limits, and artifact paths.
