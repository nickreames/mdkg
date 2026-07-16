---
id: goal-71
type: goal
title: Release and verify mdkg v0.5.1 archive ownership fix
status: done
priority: 1
goal_state: achieved
goal_condition: mdkg v0.5.1 is published only after Goal 70 supplies a clean implementation commit and full prepublish proof, one explicit approval authorizes external mutations, npm and CI evidence pass, a clean install and the real global/root consumer workflow prove the ownership fix, public documentation is deployed and verified, and a final fix-forward receipt confirms no Git tag was created.
scope_refs: [epic-250, epic-251, epic-252, epic-253, task-783, task-784, task-785, task-786, task-787, task-788, test-444, test-445, test-446, test-447, test-448, test-449]
last_active_node: task-788
required_skills: [select-work-and-ground-context, service-boundary-ownership-check, build-pack-and-execute-task, verify-close-and-checkpoint]
required_checks: [git status --short --branch, git log --oneline origin/main..HEAD, npm ci, npm run build, npm run test, npm run smoke:archive-work, npm run smoke:subgraph, npm run smoke:bundle, npm run cli:check, npm run cli:contract, npm run docs:check, npm run prepublishOnly, node scripts/assert-publish-ready.js, NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json, NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run --registry=https://registry.npmjs.org/, npm view mdkg@0.5.1 version --registry=https://registry.npmjs.org/, npm --prefix mdkg-dev run build, npm --prefix docs run build, npm run smoke:mdkg-dev, npm run smoke:mdkg-dev-docs, npm run smoke:mdkg-dev-seo, node dist/cli.js validate --changed-only --json, node dist/cli.js validate --summary --json --limit 20, explicit single release approval, live desktop and mobile documentation verification, git diff --check]
max_iterations: 25
blocked_after_attempts: 3
tags: [release, npm, archive, documentation, v0.5.1]
owners: []
links: []
artifacts: []
relates: [goal-70, edd-77, dec-83, goal-64]
blocked_by: [goal-70]
blocks: []
refs: [goal-70, edd-77, dec-83, goal-64]
context_refs: [goal-70, edd-76, dec-82, edd-77, dec-83, goal-64]
evidence_refs: [chk-524]
aliases: []
skills: [select-work-and-ground-context, service-boundary-ownership-check, build-pack-and-execute-task, verify-close-and-checkpoint]
created: 2026-07-14
updated: 2026-07-15
---
# Objective

Finalize, publish, deploy documentation for, and independently verify the
v0.5.1 archive ownership fix after Goal 70 achieves its local readiness gate.

# End Condition

Registry metadata and integrity prove `mdkg@0.5.1`; temporary and real global
installs pass; the real root graph proves imported bundles and child repos are
untouched; public docs are current; and a final checkpoint records all approved
side effects and no-tag/fix-forward state.

# Non-Goals

- Do not start while Goal 70 is incomplete.
- Do not mutate externally before one explicit bounded approval.
- Do not create a Git tag by default or unpublish a released version.
- Do not delete, move, stage, or rewrite unrelated root-graph files.

# Recursive Algorithm

1. Consume Goal 70's immutable implementation/checkpoint evidence.
2. Finalize version, lockfile, changelog, package contents, and release commit.
3. Stop for one approval covering push, npm, global/root, and deploy mutations.
4. Push and require exact-SHA CI, then publish and verify npm.
5. Capture root no-touch hashes, upgrade globally, and run the real workflow.
6. Deploy docs, verify production, record the receipt, and evaluate the goal.

# Required Skills

- Skills listed in frontmatter; browser verification is required for live docs.

# Required Checks

- Run all frontmatter checks and preserve registry, CI, install, filesystem,
  browser, and Git receipts.

# Acceptance Criteria

- Goal 70 is achieved and package version remains `0.5.0` at handoff.
- Goal 71 alone changes package and lockfile versions to `0.5.1`.
- One approval enumerates push, publish, global install, root mutation, and docs
  deployment before those operations begin.
- Root before/after evidence proves imported bundles, child trees, gitlinks,
  materialized subgraphs, and raw archive Markdown are unchanged.
- Public docs match the shipped command and JSON contract.

# Definition Of Done

- Tasks `task-783` through `task-788` and tests `test-444` through `test-449`
  close with evidence.
- npm, global/root, documentation, no-tag, and fix-forward evidence is recorded
  in the final checkpoint.

# Stop Conditions

- Stop if Goal 70, approval, auth, CI, registry, package, no-touch, or production
  evidence fails.
- Before publication, repair locally and repeat gates. After publication, fix
  forward; never roll back or unpublish `0.5.1`.

# Current State

Release execution and independent verification are complete. `mdkg@0.5.1` is
the npm `latest` version, the published candidate passed exact-SHA CI, the real
global/root consumer workflow preserved imported subgraphs, production docs are
live and verified, and no local or remote `v0.5.1` Git tag exists.

# Iteration Log

- 2026-07-14: Fully scoped as Goal 70's release and consumer-verification
  successor; intentionally left paused.
- 2026-07-15: Operator approved push, npm publication, global replacement,
  real-root verification, production deployment, and merge to `main`.
- 2026-07-15: Published and verified `mdkg@0.5.1`, completed all consumer and
  production acceptance lanes, and recorded `chk-524` as the final fix-forward
  release receipt.

# Skill Improvement Candidates

- None yet.

# Completion Evidence

- `chk-519`: release candidate and exact-SHA CI proof.
- `chk-520`: npm registry, sealed tarball, clean install, and upgrade proof.
- `chk-521`: real-root no-touch baseline.
- `chk-522`: global v0.5.1 real-root archive ownership proof.
- `chk-523`: production documentation and live browser proof.
- `chk-524`: final publication, deployment, consumer, no-tag, and fix-forward
  receipt.
