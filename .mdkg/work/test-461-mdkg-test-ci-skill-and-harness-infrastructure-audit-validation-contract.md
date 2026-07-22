---
id: test-461
type: test
title: mdkg test CI skill and harness infrastructure audit validation contract
status: done
priority: 1
parent: loop-7
tags: [loop-template, audit, tests, ci, skills, loop-fork, loop-child, test]
owners: []
links: []
artifacts: [.mdkg/artifacts/loop-7/test-ci-skill-infrastructure/command-receipts.md]
relates: [loop-7]
blocked_by: []
blocks: [task-801]
refs: [loop-7, spike-32, dec-86, template://loops/test-ci-skill-infrastructure-audit]
context_refs: [root:dec-86, root:chk-426, root:chk-512, root:chk-531, root:chk-540, root:dec-85]
evidence_refs: []
aliases: []
skills: [pursue-mdkg-loop]
cases: []
created: 2026-07-17
updated: 2026-07-17
---
# Test Contract

Execute the accepted local-only verification contract after `spike-32` has
completed the static inventory. Produce current receipts without changing any
functional tracked surface or making an external call.

# Preconditions And Environment

- `root:dec-86` remains accepted and bound to all five loop questions.
- `spike-32` is done and its inventory artifacts identify the current command
  and projection surface.
- Capture baseline Git status and non-mdkg tracked diff before execution.
- Use:

  ```text
  PATH=/opt/homebrew/opt/node@24/bin:$PATH
  NPM_CONFIG_OFFLINE=true
  NPM_CONFIG_AUDIT=false
  NPM_CONFIG_FUND=false
  NPM_CONFIG_CACHE=/private/tmp/mdkg-test-ci-audit-loop-7/npm-cache
  TMPDIR=/private/tmp/mdkg-test-ci-audit-loop-7/tmp
  ```

- Record Node `24.16.0` and npm `11.13.0`. Fail rather than falling back to a
  network install or a different runtime.

# Cases

1. Offline dependency trees
   - Inspect root, docs, and mdkg-dev with npm offline.
   - Record missing/extraneous packages as findings; do not run `npm ci` or
     mutate dependencies.
2. Coverage
   - Run `npm run test:coverage` once with a 30-minute bound.
   - Record exit status, duration, experimental coverage summary, and absence
     or presence of an enforced threshold.
3. Local CI parity
   - Run `npm run ci:release` once with a 30-minute bound.
   - Map its receipt to the checked-in workflow and distinguish Node 24.16
     local proof from the exact unexecuted 24.15 workflow row.
4. Full prepublish ladder
   - Run `npm run prepublishOnly` once with a 60-minute bound.
   - Record every reached smoke family, failure/timeout, generated directory,
     and hidden network dependency.
5. Skill projection integrity
   - Run `mdkg skill list --json` and `mdkg skill validate --json`.
   - Compare canonical skills to both configured mirrors by byte/hash.
   - Classify public seeds using `dec-85`; do not report intentional
     repository-local exclusions as drift.
6. Graph and Git boundary
   - Run changed-only and bounded full mdkg validation plus `git diff --check`.
   - Compare before/after status and confirm no unauthorized tracked path
     changed.
7. Loop evidence integrity
   - Confirm the loop, decision, and children remain discoverable and valid.
   - Preserve failures as lane evidence and continue every unaffected case.

# Timeouts And Failure Policy

- Do not automatically rerun a whole ladder.
- A timeout, command failure, sandbox limitation, or offline/network failure is
  a result, not implementation authority.
- Stop only the affected case on unauthorized tracked drift; record exact paths
  and do not reset or restore user work.
- No provider or external call may be used to replace missing local evidence.

# Execution Results

- Runtime and policy matched the contract: Node 24.16.0, npm 11.13.0, forced
  offline, isolated cache/TMPDIR, and no `npm ci` or external call.
- Root and docs dependency-tree inspection exited zero without top-level
  problems. mdkg-dev exited zero but reported six extraneous WASM/runtime
  packages, confirming that its current install is not a clean-tree receipt.
- `npm run test:coverage` passed once in 120 seconds: 658 tests, zero failures,
  89.67% line, 77.27% branch, and 96.24% function coverage. It enforces no
  threshold, emits no durable artifact, and excludes the two root MJS suites.
- `npm run ci:release` failed once after 163 seconds. It passed all 676 package
  tests, CLI snapshot/contract, and docs checks before `smoke:git-materialize`
  invoked local `npm pack`; `prepack` then failed because
  `assert-publish-ready.js` still requires the removed literal heading `Skill
  Improvement Candidates` in the built public `pursue-mdkg-goal` skill.
- `npm run prepublishOnly` independently failed once after 157 seconds on the
  same assertion when its first smoke, `smoke:consumer`, invoked `npm pack`.
  Tests, CLI/docs checks, local graph validation, and security verification
  passed before that point; the remaining 45 direct smoke commands did not run.
- `mdkg skill list --json` found eight skills; `mdkg skill validate --json`
  checked all eight with zero warnings/errors. SHA-256 comparison proved both
  managed mirror sets byte-identical to canonical; public membership and drift
  are classified in the linked inventory without any sync.
- No command changed a tracked non-mdkg path. Failures were preserved as audit
  evidence and were not retried or repaired.
- Changed-only graph validation passed with zero warnings/errors; bounded full
  validation passed with zero errors and one expected stale-SQLite warning.
  Final closeout must refresh normal mdkg index metadata after all new nodes are
  written and prove a zero-warning full result. `git diff --check` passed,
  nothing is staged, selected achieved `root:goal-73` is unchanged, and stale
  `root:loop-3` remains unchanged and unlinked.

# Evidence

Write `.mdkg/artifacts/loop-7/test-ci-skill-infrastructure/command-receipts.md`
with command, runtime, environment policy, start/end time, duration, exit,
generated paths, concise result, and ephemeral raw-log location.

Current receipt: `.mdkg/artifacts/loop-7/test-ci-skill-infrastructure/command-receipts.md`.
Raw logs: `/private/tmp/mdkg-test-ci-audit-loop-7/logs/`.

Complete this child only when every case has a current receipt or a precise
lane-specific blocker. Its audit checkpoint becomes the execution candidate
for the loop's future `run_refs` and final evidence synthesis.

# References

- `root:loop-7`
- `root:spike-32`
- `root:dec-86`
- Template: `template://loops/test-ci-skill-infrastructure-audit`
