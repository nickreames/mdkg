---
id: goal-23
type: goal
title: Complete mdkg 0.3.8 warning-scale diagnostics and multi-repo UX hardening
status: done
priority: 1
goal_state: achieved
goal_condition: 0.3.8 is dry-run publish ready for warning-scale diagnostics and multi-repo UX hardening after bounded validation summaries, clean JSON receipts, strict-doctor/subgraph/handoff remediation guidance, safe multi-repo skills, and prepublish warning-scale automation are implemented and verified.
scope_refs: [epic-113, epic-114, epic-115, epic-116, epic-117, spike-12, task-427, task-428, task-429, task-430, task-431, task-432, task-433, task-434, task-435, task-436, test-190, test-191, test-192, test-193, test-194, test-195]
last_active_node: task-436
required_skills: [pursue-mdkg-goal, author-mdkg-skill, verify-close-and-checkpoint]
required_checks: [npm run build, npm run test, npm run cli:check, npm run cli:contract, node dist/cli.js validate --json, npm run smoke:warning-ux, npm run smoke:subgraph, npm run smoke:handoff, npm run prepublishOnly, node scripts/assert-publish-ready.js, NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json, NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run, git diff --check]
max_iterations: 25
blocked_after_attempts: 3
tags: [release, 0.3.8, warnings, diagnostics, multi-repo, prepublish]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: [pursue-mdkg-goal, author-mdkg-skill, verify-close-and-checkpoint]
created: 2026-06-21
updated: 2026-06-25
---
# Objective

Harden mdkg for large multi-repo orchestration runs where validation can produce hundreds or thousands of warnings, without weakening graph correctness or hiding full diagnostics from machines.

# End Condition

0.3.8 is dry-run publish ready after warning-heavy validation and heading-format previews produce bounded summary-first receipts, clean JSON receipt files remain available, doctor/subgraph/handoff remediation is actionable, repo-local skills describe safe multi-repo sequencing, stale release metadata is cleaned up, and `smoke:warning-ux` is wired into prepublish automation.

# Non-Goals

- No real npm publish, git tag, git push, global install, or child-repo mutation.
- Do not weaken validation to suppress real graph errors.
- Do not make heading formatter apply changes unless the operator explicitly passes `--apply`.
- Do not remove full diagnostics from existing JSON receipts.

# Recursive Algorithm

1. Claim one scoped task or test at a time, starting with `task-427`.
2. Keep output-shape changes backward-compatible unless the task explicitly records a breaking decision.
3. Verify each changed command with focused unit tests and a packed temp-repo smoke.
4. Update docs, command matrix, help snapshots, skills, and publish-readiness assertions in the same pass as command behavior.
5. Close the goal only after dry-run pack/publish evidence is recorded and no real publish has happened.

# Required Skills

- pursue-mdkg-goal
- author-mdkg-skill
- verify-close-and-checkpoint

# Required Checks

- npm run build
- npm run test
- npm run cli:check
- npm run cli:contract
- node dist/cli.js validate --json
- npm run smoke:warning-ux
- npm run smoke:subgraph
- npm run smoke:handoff
- npm run prepublishOnly
- node scripts/assert-publish-ready.js
- NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json
- NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run
- git diff --check

# Acceptance Criteria

- `goal-23` is active and routes cleanly to its scoped work.
- Stale `0.3.6` docs metadata is corrected and stale `goal-20` `0.3.7` wording is retargeted.
- Warning-heavy repos have bounded, summary-first output suitable for agent closeouts.
- Full diagnostics remain available for tooling through backward-compatible JSON and `--json-out`.
- Prepublish catches high-volume warning regressions through `smoke:warning-ux`.
- Strict doctor, subgraph, and handoff guidance is actionable and safe for multi-repo agents.
- Full release gates pass through pack/publish dry-run only; no real publish occurs.

# Definition Of Done

- Scoped tasks and tests are done or explicitly deferred into a follow-up goal.
- Required checks have pass/fail evidence.
- Changelog records `0.3.8 - Unreleased` notes for the implemented surfaces.
- Completion evidence is recorded on `task-436` and summarized here.

# Stop Conditions

- npm registry publish, global install, tag, push, or child-repo mutation would be required.
- A command-shape decision would break documented JSON compatibility without explicit approval.
- A high-volume warning fixture reveals unbounded output that cannot be fixed in this goal.

# Current State

Fresh active goal created after the 0.3.7 all-repo upgrade exposed warning-volume and remediation UX gaps. Source version remains `0.3.7`; this goal tracks `0.3.8 - Unreleased` hardening and stops at dry-run release readiness.

# Iteration Log

- 2026-06-21: Created as the active 0.3.8 warning-scale UX and prepublish automation lane.

# Skill Improvement Candidates

- None yet.

# Completion Evidence

- 2026-06-25: `task-436` closed with `chk-273` after all goal required checks passed through dry-run release proof.
- Version metadata is `0.3.8` in `package.json` and `package-lock.json`; `CHANGELOG.md` is dated `0.3.8 - 2026-06-25`.
- `npm run build`, `npm run test` (507/507 passing), `npm run cli:check`, `npm run cli:contract`, and `node dist/cli.js validate --json` passed.
- Focused goal checks passed: `npm run smoke:warning-ux`, `npm run smoke:subgraph`, and `npm run smoke:handoff`.
- Full `npm run prepublishOnly` passed after regenerating generated command docs caught by the first dry-run attempt.
- `node scripts/assert-publish-ready.js` passed.
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json` passed for `mdkg@0.3.8`, 163 files, package size about 327.6 kB.
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run` passed and printed `+ mdkg@0.3.8`.
- `git diff --check` passed.
- No real npm publish, tag, push, global install, child-repo mutation, DNS, Vercel, or public launch action was performed.
