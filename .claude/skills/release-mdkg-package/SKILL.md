---
name: release-mdkg-package
description: Release the mdkg package only under an explicit release goal and current publication approval while separating push tag deploy and upgrade authority.
tags: [stage:release, writer:orchestrator, mdkg, package, publication]
version: 0.1.0
authors: [mdkg]
links: [AGENT_START.md, CLI_COMMAND_MATRIX.md, .mdkg/design/edd-79-generic-goal-pursuit-and-package-release-authority.md, .mdkg/design/dec-85-package-publication-requires-a-dedicated-release-goal-and-current-approval.md]
---

# Purpose

Publish an accepted mdkg package only from an explicit release goal, under
fresh package publication approval, with deterministic validation and
independent authority boundaries for Git and downstream actions.

## When To Use

Use this skill only when all of these positive-trigger conditions are true:

- The user or orchestrator supplied an explicit `RELEASE_GOAL_QID`.
- `mdkg goal show "$RELEASE_GOAL_QID" --json` confirms that package publication
  is in the goal condition and current scope.
- A current user approval explicitly authorizes publishing the package now.
- Writer ownership is unambiguous for the release goal and release work item.

Do not use this skill for ordinary implementation, documentation, skill, graph,
checkpoint, local commit, release-readiness audit, or handoff closeout. A release
goal without current publication approval is also a negative trigger: leave it
paused and do not inspect registry credentials, publish, push, tag, or deploy.

## Inputs

- Explicit `RELEASE_GOAL_QID` and one explicitly owned release `WORK_QID`.
- Current package publication approval and its exact authorized action.
- Current source commit, branch, full Git dirtiness, upstream, and remote state.
- Package version, release notes, package metadata, required checks, and public
  registry state.
- Separate approval state for commit, push, tag, deploy, provider mutation, and
  downstream managed upgrades.

## Outputs

- A release gate receipt that records pass, fail, or paused state.
- When authorized and successful, the exact published package version,
  registry verification, source commit, and clean-install evidence.
- Separate receipts for any independently authorized Git or downstream action.
- A durable release checkpoint and explicit goal evaluation.

## Required Capabilities

- Current mdkg CLI and repository-required package validation commands.
- npm CLI with an isolated cache and temporary user configuration when needed.
- Git read commands, plus commit or publication commands only when separately
  authorized.
- Network access to the public package registry for the approved release lane.

## Resources Touched

- The explicit release goal and its owned scoped work nodes.
- Package and release metadata already owned by that goal.
- Temporary cache and user-config files outside the repository.
- The package registry only after the positive trigger and current approval
  pass.
- Git remote, tags, deployment providers, and consumer repositories only under
  separate explicit authority; none are implied by package publication.

## Steps

1. Enforce the trigger before registry or package action.
   - Record the supplied `RELEASE_GOAL_QID` exactly.
   - Run `mdkg goal show "$RELEASE_GOAL_QID" --json` and confirm package
     publication scope.
   - Confirm current approval says to publish the package now. Historical,
     inferred, readiness-only, local-commit, or goal-completion approval is not
     sufficient.
   - If either check fails, keep the goal paused and stop before credential,
     registry-authentication, package publication, push, tag, or deploy work.
2. Recheck ownership and the repository baseline.
   - Capture HEAD, branch, upstream, full dirty and staged paths, and remote
     identity.
   - Confirm one writer owns the release goal, release node, package metadata,
     and current checkout.
   - Stop on unrelated dirtiness, overlapping ownership, remote ambiguity, or
     baseline drift.
3. Record an authority matrix.
   - Distinguish local validation, package publication, local commit, Git push,
     tag creation, deployment or provider mutation, and downstream upgrade.
   - Mark each action authorized, denied, or pending from current evidence.
   - Never infer one authority level from another.
4. Claim the explicit owned release node.
   - Ensure `WORK_QID` has an explicit owner before claim.
   - Run
     `mdkg goal claim "$RELEASE_GOAL_QID" "$WORK_QID" --json`.
5. Run release validation required by the goal and current source.
   - Verify package version and release intent across package metadata, lock
     metadata, changelog, generated references, and public package contents.
   - Run the repository's build, test, command-parity, documentation, graph,
     and publish-readiness gates.
   - Use an isolated cache for pack and publish dry-runs.
   - Treat any mismatch, missing release note, generated drift, or failed test as
     a blocker. Do not publish.
6. Verify public registry preconditions.
   - Confirm the target version is not already published and the current
     dist-tag state matches the release plan.
   - Record public registry facts without printing or persisting credentials.
7. Reconfirm publication approval immediately before authentication and publish.
   - If approval is no longer current or its scope is ambiguous, stop.
   - Use only a temporary user configuration that references an environment
     variable; never expand or print a token into committed or logged content.
   - Verify authenticated write identity only inside the approved release lane.
8. Publish once, then verify independently.
   - Run the one approved package publication command for the exact target
     version.
   - Do not retry blindly after an uncertain response. Query registry state
     first and stop on ambiguity.
   - Verify version, dist-tags, package metadata, and a clean temporary install
     of the published package.
9. Keep post-publication actions separate.
   - Do not push, create a tag, deploy, mutate a provider, or upgrade consumers
     unless each action has its own current approval and passed preflight.
   - When an action is not authorized, record a refs-only handoff instead.
10. Record release evidence and evaluate the explicit goal.
    - Attach exact version, source commit, registry checks, validation, authority
      matrix, and any pending handoffs to a durable checkpoint.
    - Run `mdkg goal evaluate "$RELEASE_GOAL_QID" --json`.
    - Run goal done only when the full goal condition and evidence support it.

## Validation Checks

- Explicit release goal show receipt and current publication approval.
- Single-writer ownership and clean, expected baseline.
- Package version, release notes, metadata, and package-content consistency.
- Repository build, tests, docs, command parity, mdkg validation, and diff gate.
- Isolated-cache pack and publish dry-runs.
- Target version absence before publish and registry verification after publish.
- Clean temporary install of the released package.
- Separate approval receipts for any push, tag, deploy, provider, or upgrade
  action.

## Closeout Evidence

- `RELEASE_GOAL_QID`, `WORK_QID`, and explicit owner.
- Current package publication approval and action boundary.
- Source commit, branch, staged paths, and remote identity.
- Exact package version and validation receipts.
- Registry state before and after publication.
- Temporary credential-handling method without secret values.
- Published-package install verification.
- Release checkpoint and goal evaluation.
- Explicit list of actions not taken because authority was absent.

## Failure Modes

- Goal is not explicitly release-scoped: stop before registry or package action.
- Publication approval is missing, stale, or readiness-only: keep the goal
  paused.
- Checkout or ownership is ambiguous: stop before mutation.
- Target version already exists: do not overwrite or republish it.
- Build, tests, docs, package contents, or dry-run gates fail: do not publish.
- Authentication or policy rejects publication: fix authority or credential
  policy, then rerun validation; do not commit a false success state.
- Publication response is uncertain: query registry state before any retry.
- Push, tag, deploy, provider, or upgrade approval is absent: create a handoff
  and leave those actions undone.

## Safety Rules

- Never store or print npm tokens, passwords, one-time codes, session cookies,
  raw provider payloads, or other secrets.
- Never place expanded credentials in repository files, mdkg nodes, events,
  checkpoints, packs, or handoffs.
- Package publication approval does not authorize Git push, tag, deployment,
  provider mutation, history rewrite, or consumer changes.
- Do not force-push, rewrite history, replace an existing package version, or
  bypass failed release gates.
- Keep temporary registry configuration and install fixtures outside the
  repository and remove them after verification.

## Related Manifests

- None. The explicit release goal and current package source are authoritative.

## Projection Targets

- Canonical source: `.mdkg/skills/release-mdkg-package/SKILL.md`.
- Configured repository-local mirrors such as `.agents/skills/` and
  `.claude/skills/`.
- Forbidden projection: `assets/init/skills/default/` and every public default
  seed.

## Open Questions

- Resolve target version, release line, registry state, and post-publication
  authority from current source and approval each time the paused release goal
  is resumed.
