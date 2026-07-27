---
id: dec-91
type: dec
title: adopt the measured five-shard risk-tier CI topology
status: accepted
tags: [ci, release, smoke, exact-sha, local-proof]
owners: [root]
links: []
artifacts: [.mdkg/artifacts/goal-78/ci-topology-plan.json, .mdkg/artifacts/goal-78/ci-topology-measurements.json]
relates: [prop-9]
refs: [goal-78, spike-33, task-811, test-470, chk-549, chk-550, chk-551]
aliases: []
created: 2026-07-26
updated: 2026-07-26
---
# Context

Goal 77 established a deterministic local release ladder under Node `24.18.0`:
711 tests across 95 files, 105 publishable runtime files above the
`89/77/96` ratchet, 47 smoke aliases resolving to 46 canonical executions,
one immutable package SHA across 34 consumers, and bounded docs/mdkg-dev
profile builds. The optimized prepublish ladder passed in `291.843s`;
`ci:release` passed in `122.416s`; all canonical smoke work totaled
`161.690s`.

The checked-in workflow still runs one coarse `ci:release` job on both runtime
rows, covers only two canonical smokes, has no full exact-SHA release tier,
does not upload durable failure evidence, and is protected only by substring
assertions. Running the whole local prepublish ladder in every matrix row would
duplicate coverage, package, and site work without improving release
diagnostics.

# Decision

Adopt the source-owned topology in
`.mdkg/artifacts/goal-78/ci-topology-plan.json`.

## Source ownership

- Extend the existing `scripts/smoke-manifest.json`; do not introduce a second
  smoke catalog.
- Store exact fast membership and the five full-shard partitions in that
  manifest and validate that all 47 aliases still resolve to 46 canonical
  identities.
- Generate `.github/workflows/release-readiness.yml` deterministically from
  source-owned topology and fail a byte-for-byte check on drift.
- Add no YAML parser or other dependency. Do not implement a partial parser.

## Fast tier

- Run for pull requests, pushes to `main`, and manual `tier=fast` dispatches.
- Use a matrix with Node `24.15.0` and `24.x`.
- Set a 15-minute job timeout and cancel superseded runs per pull request or
  ref.
- Run explicit dependency bootstrap/preflight, publishable-runtime coverage,
  CLI snapshot/contract, docs, security, graph, publish-readiness, and final
  tracked-drift gates.
- Execute exactly these 13 canonical smokes, measured at `52.097s`:
  `consumer`, `git-materialize`, `loop`, `upgrade`, `init`, `db-queue-cli`,
  `db-snapshot`, `sqlite`, `bundle`, `subgraph`, `mdkg-dev-docs`,
  `mdkg-dev-seo`, and `goal`.
- Upload evidence with `if: always()`, fail on missing evidence, retain it for
  14 days, and name it `mdkg-fast-<runtime-id>-<run-id>`.

## Full exact-SHA tier

- Run only for manual `tier=full` dispatches with a required commit SHA.
- Accept only 40 lowercase hexadecimal characters. Checkout that exact ref,
  then verify `git rev-parse HEAD` equals the input and `HEAD` is detached
  before release work.
- Use Node `24.15.0` for preparation and every shard.
- A single `full_prepare` job runs shared static/coverage gates, creates one
  immutable package artifact plus SHA-256 context manifest, and uploads
  `mdkg-full-context-<commit-sha>` for 14 days.
- Five `full_smoke` matrix jobs bootstrap dependencies, download and verify the
  shared package SHA, then run one exact manifest shard:

| Shard | Canonical smokes | Measured smoke time |
| --- | ---: | ---: |
| `package-command` | 6 | 35.497s |
| `lifecycle-agent` | 10 | 37.247s |
| `db-work` | 9 | 26.411s |
| `graph-concurrency` | 8 | 39.356s |
| `sites-git-repair` | 13 | 23.179s |

- The five shards partition all 46 canonical identities exactly once. Keep all
  site/profile smokes together so four docs and five mdkg-dev normalized
  profiles can each build at most once within the shard cache.
- Preparation has a 30-minute timeout, shards have 20 minutes, the aggregate
  has 5 minutes, and full wall-clock target is 30 minutes.
- Each shard uploads `mdkg-full-<shard>-<commit-sha>` with `if: always()`,
  missing-file failure, and 30-day retention.
- One `full_release` aggregate depends on successful preparation and every
  shard. It is the only full-tier release-authority result.
- Group full runs by exact SHA and never automatically cancel an in-flight
  proof.

Node `24.15.0` is an exact source-owned workflow requirement. This spike proves
the checked-in decision and local measurements only; it does not claim local
or provider execution of that exact runtime.

# Alternatives considered

- Full prepublish on both fast matrix rows: strongest superficial parity, but
  needlessly duplicates a five-minute optimized ladder and profile builds.
- Existing two-smoke CI only: fast but leaves coverage and most release-risk
  domains outside ordinary feedback.
- One serial full job: simpler YAML but poorer failure isolation and a coarse
  timeout.
- Four duration-balanced mixed-domain shards: marginally fewer jobs, but
  weaker diagnostic ownership and less coherent profile/cache grouping.
- A YAML parser dependency: structurally direct, but adds dependency and
  registry authority when deterministic generation can prove the same source
  contract.

# Consequences

- `root:task-811` may now implement the manifest-backed runner, deterministic
  workflow generator/checker, and generated workflow.
- `root:test-470` must prove exact membership, shard partition/load, runtime,
  trigger, exact-SHA, DAG, timeout, artifact, failure-evidence, concurrency,
  aggregate, and tracked-drift semantics with positive and negative fixtures.
- Local workflow checks are source evidence only. Provider execution, branch
  protection, remote artifact retention administration, push, tag, publish,
  and deployment remain separate authority.
- Any future topology change requires updating this decision or a superseding
  one, the source manifest, generator output, and focused contract tests
  together.

# Links / references

- `root:prop-9`
- `root:goal-78`
- `root:spike-33`
- `root:task-811`
- `root:test-470`
- `root:chk-549`
- `root:chk-550`
- `root:chk-551`
- `.mdkg/artifacts/goal-78/ci-topology-measurements.json`
- `.mdkg/artifacts/goal-78/ci-topology-plan.json`
