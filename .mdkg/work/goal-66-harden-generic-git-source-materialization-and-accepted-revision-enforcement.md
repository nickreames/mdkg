---
id: goal-66
type: goal
title: harden generic Git source materialization and accepted revision enforcement
status: todo
priority: 1
goal_state: paused
goal_condition: A published-package-ready generic mdkg Git materialization primitive accepts the versioned JSON request contract, verifies target commit and optional tree identity, enforces auth depth submodule containment and project-memory policies, atomically publishes only accepted destinations, emits bounded redacted success and failure receipts, preserves git clone compatibility, never pushes or executes repository-controlled code, and passes source package docs generated-contract and neutral-consumer gates.
scope_refs: [task-746, task-747, task-748, task-749, task-750, task-751, test-411, test-412, test-413, test-414, test-415]
required_skills: [select-work-and-ground-context, service-boundary-ownership-check, build-pack-and-execute-task, verify-close-and-checkpoint]
required_checks: [git status --short --branch, node dist/cli.js git --help, npm run build, npm run test, npm run cli:check, npm run cli:contract, npm run docs:check, node dist/cli.js validate --json, node dist/cli.js validate --changed-only --json, npm pack --dry-run --json, git diff --check]
max_iterations: 30
blocked_after_attempts: 3
tags: [git, materialization, accepted-revision, implementation, generic-capability]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [goal-64]
blocks: [goal-67]
refs: [edd-73, dec-61, dec-63, dec-64, dec-75, dec-76, dec-77, dec-78]
context_refs: [goal-52, goal-60, goal-64, goal-65, edd-73, dec-61, dec-63, dec-64, dec-75, dec-76, dec-77, dec-78]
evidence_refs: []
aliases: [generic-git-materialization-hardening]
skills: [select-work-and-ground-context, service-boundary-ownership-check, build-pack-and-execute-task, verify-close-and-checkpoint]
created: 2026-07-11
updated: 2026-07-11
---

# Objective

Implement the generic fail-closed Git source materialization primitive required
by downstream agent runtimes without importing downstream product policy into
mdkg.

# End Condition

The source checkout and packed package expose `mdkg git materialize --request
<file|->`, all policy and negative fixtures pass, receipts are safe to retain,
and the release handoff to `goal-67` is complete.

# Non-Goals

- No YAML request parsing or recursive submodule initialization.
- No downstream runtime, sandbox, root, or template-repository mutation.
- No implicit or explicit push from materialization.
- No package publication, global install replacement, or website deployment.

# Recursive Algorithm

1. Confirm `goal-64` is achieved and re-audit the published baseline.
2. Finalize the JSON schema and parser with credential-safe auth preflight.
3. Implement atomic materialization, identity, depth, and submodule policies.
4. Add project-memory discovery and bounded structured receipts.
5. Align help, generated command contract, docs, package, and neutral smokes.
6. Run the full release-candidate ladder and checkpoint the publication handoff.

# Required Skills

Use the required skills in frontmatter. The boundary check must reject any
downstream product term in public types, schemas, help, docs, or fixtures.

# Required Checks

Run the complete source, CLI, docs, graph, and packed-package ladder in
frontmatter plus targeted materialization and no-push smokes.

# Acceptance Criteria

- V1 request and receipt schemas are versioned, strict, and product-neutral.
- Expected commit is required; expected tree is optional and enforced when set.
- SHA-1 and SHA-256 object formats are reported from Git rather than inferred.
- Auth checks expose availability only and never values or socket paths.
- Destination acceptance is atomic and failure cleanup is deterministic.
- `deny` and `ignore` submodule policies and all discovery modes are proven.
- Existing `git clone` behavior and command contract remain compatible.

# Definition Of Done

- Goal condition is achieved.
- Every scoped task/test is done with evidence.
- A release-candidate checkpoint unblocks `goal-67`.

# Stop Conditions

- `goal-64` is not achieved or the published baseline is ambiguous.
- Implementation requires storing credentials or executing repository code.
- Public compatibility requires a breaking change not classified explicitly.

# Current State

Paused behind the current publication program. First node is `task-746`.

# Iteration Log

- 2026-07-11: Seeded from `goal-65` and `edd-73`.

# Skill Improvement Candidates

- None yet.

# Completion Evidence

- Pending.
