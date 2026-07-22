# Loop 7 command receipts

Audit: `root:loop-7`
Validation child: `root:test-461`
Local date: 2026-07-17 (America/Denver)
Raw log root: `/private/tmp/mdkg-test-ci-audit-loop-7/logs/`

## Authority and environment

- Runtime: Node `v24.16.0`; npm `11.13.0`.
- Environment: Node 24 path first, `NPM_CONFIG_OFFLINE=true`, npm audit and
  fund disabled, cache and `TMPDIR` isolated under
  `/private/tmp/mdkg-test-ci-audit-loop-7/`.
- Attempts: one each for coverage, `ci:release`, and `prepublishOnly`; no
  whole-ladder retry.
- `npm ci` was inspected but never executed. No external/provider/registry
  command was authorized or run.
- Bound runner: each command had an independent wall timeout and wrote a raw
  log. No timeout fired.

## Before-state receipt

- Git: `main...origin/main [ahead 1]`.
- Pre-existing/expected tracked diff: `.mdkg/index/mdkg.sqlite` only.
- Untracked audit scope: loop-7 decision, loop, children, checkpoints, and
  `.mdkg/artifacts/loop-7/`.
- No tracked non-mdkg path was modified.
- Selected goal: `root:goal-73`, status `done`, goal state `achieved`.
- Stale loop: `root:loop-3`, status `todo`; inspected only and not linked or
  changed.

## Dependency-tree inspection

| Surface | Command | Exit | Duration | Result | Raw log |
| --- | --- | ---: | ---: | --- | --- |
| root | `npm ls --all --json` | 0 | <1s | Complete current tree; no problem markers. Root has only package dev tooling. | `npm-ls-root.log` |
| docs | `npm --prefix docs ls --all --json` | 0 | <1s | Complete current tree; no top-level problem markers. | `npm-ls-docs.log` |
| mdkg-dev | `npm --prefix mdkg-dev ls --all --json` | 0 | <1s | Tree present, but npm reports six extraneous packages: `@emnapi/core`, `@emnapi/runtime`, `@emnapi/wasi-threads`, `@napi-rs/wasm-runtime`, `@tybys/wasm-util`, and `tslib`. | `npm-ls-mdkg-dev.log` |

Interpretation: the present checkout has enough nested dependency state to run
site builds, but that state is not proof of the clean root-install contract.
Root is not an npm workspace; root `npm ci` would not install docs or mdkg-dev.

## Approved command ladder

### Coverage

- Command: `npm run test:coverage`
- Bound: 30 minutes; one attempt.
- Started: `2026-07-18T00:12:05.358Z`.
- Ended: `2026-07-18T00:14:05.802Z`.
- Duration: 120 seconds wall time; TAP test duration 86.306 seconds.
- Exit: 0.
- Tests: 658 passed, 0 failed.
- Coverage: 89.67% lines, 77.27% branches, 96.24% functions.
- Enforcement: no threshold and no durable coverage artifact were configured.
- Scope gap: the two root MJS suites and their 18 tests are not in this
  command.
- Generated paths: ignored `dist/**`; isolated temp/cache paths only.
- Tracked boundary after command: unchanged; no tracked non-mdkg path.
- Raw log: `test-coverage.log`.

### Local CI command parity

- Command: `npm run ci:release`
- Bound: 30 minutes; one attempt.
- Started: `2026-07-18T00:14:23.308Z`.
- Ended: `2026-07-18T00:17:06.143Z`.
- Duration: 163 seconds.
- Exit: 1.
- Passed before failure: package build and compiled tests (658/658), root MJS
  tests (18/18), CLI snapshot, command contract, docs/reference checks (474
  command examples, zero failures), and the nested security verifier reached by
  `npm pack`/`prepack`.
- Failure point: `smoke:git-materialize` called local `npm pack`; the `prepack`
  readiness assertion rejected the built public goal skill.
- Exact failure: `publish readiness failed: dist/init pursue-mdkg-goal skill is
  missing goal pursuit guidance`.
- Source cause: `scripts/assert-publish-ready.js` requires the literal `Skill
  Improvement Candidates`, while the current byte-equal canonical/public goal
  skill now uses an `Open Questions` section and no longer contains that
  heading. `mdkg goal next` is present; the stale heading assertion is the
  failing conjunct.
- Not reached as direct CI steps: `smoke:loop`, the final direct
  `security:verify`, and the final direct `assert-publish-ready`.
- Parity limit: this is exact command evidence on local macOS/Node 24.16, not
  Ubuntu or exact Node 24.15.0 provider evidence.
- Tracked boundary after command: unchanged; no tracked non-mdkg path.
- Raw log: `ci-release.log`.

### Full prepublish ladder

- Command: `npm run prepublishOnly`
- Bound: 60 minutes; one attempt.
- Started: `2026-07-18T00:17:42.948Z`.
- Ended: `2026-07-18T00:20:19.581Z`.
- Duration: 157 seconds.
- Exit: 1.
- Passed before failure: package tests (676/676 total), CLI snapshot, command
  contract, docs/reference checks, local graph validation (with the expected
  stale-index warning), and direct security verification.
- Failure point: first smoke, `smoke:consumer`, called local `npm pack` and hit
  the same stale public-goal-skill heading assertion in `prepack`.
- Exact failure: `publish readiness failed: dist/init pursue-mdkg-goal skill is
  missing goal pursuit guidance`.
- Not reached: the remaining 45 direct smoke commands. Therefore this receipt
  does not claim runtime execution of those smoke families.
- Hidden dependency result: the ladder failed before docs/mdkg-dev site smokes,
  so current execution neither triggered nor disproved their clean-install and
  nested-registry dependency gap.
- Generated paths: ignored `dist/**` plus isolated consumer/pack fixtures under
  the audit `TMPDIR`.
- Tracked boundary after command: unchanged; no tracked non-mdkg path.
- Raw log: `prepublish-only.log`.

## Skill registry and projection receipts

| Command | Exit | Result | Raw log |
| --- | ---: | --- | --- |
| `mdkg skill list --json` | 0 | 8 canonical skills discovered. | `skill-list.log` |
| `mdkg skill validate --json` | 0 | `ok: true`; 8 checked; 0 warnings; 0 errors. | `skill-validate.log` |
| SHA-256 comparison script | 0 | All 8 canonical bodies equal both managed mirrors; public seeds: 3 equal, 3 divergent, 2 absent. | `skill-hashes.log` |

Public classification is governed by `skill-projection-inventory.json`:
`release-mdkg-package` is intentionally absent under `root:dec-85`; the three
divergent public bodies lack an explicit exact-versus-reviewed-snapshot
currentness rule and remain an audit finding. No skill sync or edit occurred.

## Validation and after-state

- `mdkg validate --changed-only --json`: exit 0, `ok: true`, zero warnings,
  zero errors. Raw log: `validate-changed-only.log`.
- `mdkg validate --summary --json --limit 20`: exit 0, `ok: true`, zero
  errors and one expected cache warning because new graph source is newer than
  the tracked SQLite index. Raw log: `validate-full.log`.
- Recovery: do not misclassify the warning as a source defect. Refresh normal
  mdkg index metadata after all follow-up/checkpoint nodes are written, then
  require a zero-warning final full validation before loop closeout.
- `git diff --check`: exit 0, no output.
- Staged paths: none.
- Tracked changed-path comparison: `.mdkg/index/mdkg.sqlite` only, matching the
  before state and authorized normal mdkg metadata. All other audit additions
  are new `.mdkg` nodes or artifacts.
- No tracked non-mdkg path changed during coverage, CI, or prepublish commands.
- Selected goal after execution remains `root:goal-73`, status `done`, goal
  state `achieved`.
- `root:loop-3` remains status `todo`, retains its prior stale template lineage,
  and is unchanged and unlinked from loop-7.
- Final closeout refresh after all children, follow-ups, checkpoint, and lane
  bindings: `mdkg index` completed; changed-only and bounded full validation
  both returned zero warnings/errors; `loop plan` reported closeout ready with
  no missing/invalid/pending state; concise pack dry-run succeeded with 25
  nodes and approximately 4,727 tokens.

## Result classification

- Passed: coverage execution, all reached tests, CLI/docs checks, graph
  validation reached inside prepublish, security verification, skill discovery,
  managed-mirror equality, and tracked-path hygiene.
- Failed and definition-relevant: both release ladders are currently red on the
  same stale publish-readiness assertion.
- Residual audit gaps: clean nested-install reproducibility, risk-tier CI smoke
  breadth, coverage enforcement, build amplification, public seed currentness,
  timeout/drift policy, and harness guidance.
- Waivers: none.
