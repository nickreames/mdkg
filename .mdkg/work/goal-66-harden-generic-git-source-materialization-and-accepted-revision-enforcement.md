---
id: goal-66
type: goal
title: harden generic Git source materialization and accepted revision enforcement
status: done
priority: 1
goal_state: achieved
goal_condition: A locally publish-ready generic mdkg Git materialization primitive accepts the strict v1 JSON request contract, verifies caller-selected commit and optional tree identity, enforces auth depth submodule containment and project-memory policies, atomically publishes only accepted destinations, emits bounded redacted receipts, preserves git clone compatibility, documents the capability for docs.mdkg.dev, and passes the complete local security package installed-consumer and prepublish ladder without bumping publishing pushing globally installing deploying or applying a real-root upgrade.
scope_refs: [task-746, task-747, task-748, task-749, task-750, test-411, test-412, test-413, test-414, test-415, bug-2, test-452, bug-3, test-453, task-791, test-454, test-450, task-751]
last_active_node: task-751
required_skills: [select-work-and-ground-context, service-boundary-ownership-check, build-pack-and-execute-task, verify-close-and-checkpoint]
required_checks: [git status --short --branch, node dist/cli.js git --help, npm ci, npm run build, npm run test, npm run smoke:git-materialize, npm run cli:check, npm run cli:contract, npm run docs:check, npm --prefix docs run build, node dist/cli.js validate --json, node dist/cli.js validate --changed-only --json, npm run security:verify, focused materialization security regressions, npm run prepublishOnly, node scripts/assert-publish-ready.js, NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json, NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run --registry=https://registry.npmjs.org/, clean temporary tarball install and materialization probes, git diff --check]
max_iterations: 30
blocked_after_attempts: 3
tags: [git, materialization, accepted-revision, implementation, generic-capability, 0.5.2, prepublish]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: [goal-67]
refs: [edd-73, dec-61, dec-63, dec-64, dec-75, dec-76, dec-77, dec-78]
context_refs: [goal-52, goal-60, goal-64, goal-65, edd-73, dec-61, dec-63, dec-64, dec-75, dec-76, dec-77, dec-78]
evidence_refs: [chk-530, chk-531, chk-532]
aliases: [generic-git-materialization-hardening]
skills: [select-work-and-ground-context, service-boundary-ownership-check, build-pack-and-execute-task, verify-close-and-checkpoint]
created: 2026-07-11
updated: 2026-07-15
---

# Objective

Implement and locally requalify the generic fail-closed Git source
materialization primitive required by downstream agent runtimes without
importing downstream product policy into mdkg.

# End Condition

The source checkout and packed package expose `mdkg git materialize --request
<file|-> [--json]`; all positive, negative, security, documentation, package,
and temporary installed-consumer gates pass; and a checkpoint gives `goal-67`
an explicit `0.5.2` publish-readiness recommendation or an exact gaps list.

# Public Contract

- Request schema is `mdkg.git.materialize.request.v1` and is JSON-only.
- Required fields identify stable source/access refs, a credential-free
  execution-time repository ref, declared auth capability, full target ref,
  expected commit, contained relative destination, clone depth, submodule
  policy, and project-memory policy. Expected tree and correlation/evidence
  refs are optional.
- Unknown fields, malformed or YAML input, control characters, option-shaped
  refs, unsafe/unsupported transports, embedded credentials, and escaping
  destinations fail before Git executes.
- Receipts contain bounded refs, request hash, expected/observed object
  identities, object format, policy results, auth availability, destination and
  cleanup state, reason codes, and warnings. They exclude secrets, environment
  values, helper output, socket paths, raw Git output, repository content, and
  absolute local paths.

# Recursive Algorithm

1. Reconcile the achieved published baseline and freeze the request/receipt
   schema in `task-746`.
2. Implement strict input and external-auth availability checks in `task-747`.
3. Implement the argv-only contained atomic Git state machine in `task-748`.
4. Implement non-executing project-memory discovery and bounded receipts in
   `task-749`.
5. Align help, generated contracts, package smokes, changelog `Unreleased`, and
   docs.mdkg.dev source documentation in `task-750` without editing mdkg.dev.
6. Close tests `test-411` through `test-415`.
7. Resolve the partial security-scan blockers in `bug-2`/`test-452` and
   `bug-3`/`test-453`, then correct generated command-contract flag parity
   in `task-791`/`test-454`.
8. Verify the remediated candidate families with focused regressions, run the
   built-in security verifier, and pass the full local prepublish contract in
   `test-450`. Codex Security is excluded because its scan runtime failed and
   the operator removed the plugin from this release lane.
9. Record the release handoff in `task-751`, evaluate this goal, and leave
   `goal-67` paused until this goal is achieved.

# Required Boundaries

- System Git is the executor and is invoked by argv, never through a shell.
- Disable interactive prompts and repository hooks; never push, run repository
  scripts/skills, or initialize recursive submodules.
- The caller owns timeouts and cancellation. Termination must stop the Git
  process group, clean bounded temporary state, and leave no accepted target.
- Validate discovered `.mdkg` memory without writing indexes or executing
  cloned content.
- Existing `mdkg git clone` syntax and behavior remain compatible.
- Public docs are added to docs.mdkg.dev source only. No `mdkg-dev` source or
  public homepage copy is edited.

# Definition Of Done

- Every scoped task and test is done with evidence.
- `test-450` records zero unresolved known findings from the completed local
  verification evidence and the complete local gate ladder.
- The handoff records the implementation commit, packed artifact identity,
  schema refs, validation, no-push status, and remaining risks.

# Stop Conditions

- Stop on any schema ambiguity, secret exposure, unsupported transport,
  containment gap, cleanup failure, clone regression, security finding,
  package/docs drift, or failed local gate.
- Do not bump versions, push, publish, replace the global install, deploy,
  create a tag, or apply a real-root upgrade in this goal.

# Current State

Implementation through `task-750` and focused tests `test-411` through
`test-415` is complete. Partial Codex Security scan
`4956a227-c1c0-4309-98d0-1e65687fab71` reviewed all 11 source-like rows and
dynamically validated two candidates, but its runtime failed before attack-path
analysis, final report sealing, and indexing. The scan is now terminally marked
failed. `chk-530` preserves the available partial evidence and hashes without
claiming a completed clean scan.

The candidate families and command-contract gap are now remediated:
`bug-2`, `test-452`, `bug-3`, `test-453`, `task-791`, and `test-454` are
done. The complete local test, docs, security-verifier, prepublish, pack,
publish-dry-run, and installed-consumer ladder passes under `test-450`.

The operator explicitly removed Codex Security from scope because the plugin is
broken for this workflow. The abandoned post-remediation setup session
`c764e7b3-4f91-4296-8b2e-08ac44695d4f` has no scan id or report and requires no
further action. Goal-66 readiness relies on the passing built-in security
verifier, focused regressions for both validated candidate families, full
source/package/docs tests, prepublish gates, dry-runs, and installed-consumer
proof. `test-450` is done with audit checkpoint `chk-531`; `task-751` is done
with release handoff `chk-532`. Every scoped work node is complete and the
implementation is committed locally as
`f657a1b3e82388050aeeef39a188d4eaca0a2bf9`.

# Completion Evidence

- Implementation checkpoints: `chk-525` through `chk-529`.
- Failed partial scan disposition and remediation handoff: `chk-530`.
- Local security and prepublish acceptance: `chk-531`.
- Final implementation and `0.5.2` release handoff: `chk-532`.
- Recommendation: `ready for goal-67 v0.5.2 release execution`.
