---
id: spike-33
type: spike
title: Bind measured local release receipts to the risk-tier CI topology
status: backlog
priority: 1
parent: goal-78
next: task-811
tags: [ci, smoke, release, decision]
owners: []
links: []
artifacts: [.mdkg/artifacts/goal-78/ci-topology-measurements.json]
relates: [prop-9, loop-7]
blocked_by: [test-464]
blocks: [task-811]
refs: [goal-77, goal-78, prop-9, loop-7, test-463, test-464, dec-87, dec-88, chk-549, chk-550, chk-551]
context_refs: [goal-77, goal-78, prop-9, loop-7, test-463, test-464, dec-87, dec-88, chk-549, chk-550, chk-551]
evidence_refs: [chk-549, chk-550, chk-551]
aliases: []
skills: [select-work-and-ground-context, service-boundary-ownership-check]
created: 2026-07-25
updated: 2026-07-26
---
# Research Question

Which fast-matrix membership, full-release shards, timeouts, artifact retention,
and workflow validation approach preserve complete release risk coverage within
the measured latency and build budgets produced by Goal 1?

# Context And Constraints

- `root:test-463` must provide canonical smoke identities, profile builds,
  tarball reuse, duration, and process counters.
- `root:test-464` must provide the scoped coverage command, thresholds, and
  durable local evidence contract.
- The architecture defaults are already agreed: fast PR/push matrix plus
  manual exact-SHA full release.
- The spike must not edit workflows, package scripts, smoke code, provider
  settings, or branch protection.
- Checked-in source and local receipts are sufficient; no GitHub/provider API
  evidence is requested.

# Search Plan

- Review the Goal 1 test-proof checkpoints and the compact durable measurement
  artifact; use temporary receipts only as optional corroboration.
- Inspect and extend the existing source-owned `scripts/smoke-manifest.json`;
  do not create a second smoke catalog. Verify 47 aliases map to 46 canonical
  identities.
- Group identities by package consumer, init/upgrade, loop/goal, DB/SQLite,
  bundle/subgraph, docs/site, and remaining risk domains.
- Compare measured durations against the provisional 15-minute fast and
  30-minute full-release targets.
- Review current `.github/workflows/release-readiness.yml`, action/runtime
  versions, artifact behavior, and local workflow contract tests.
- Decide between a deliberate YAML parser dependency and deterministic workflow
  generation/checking; do not hand-roll a partial YAML parser.

# Findings

- Goal 77 passed an optimized prepublish ladder in `291.843s` and
  `ci:release` in `122.416s` under Node `24.18.0`.
- Coverage passed 711 tests across 95 files and measured 105 runtime files at
  `89.30/77.43/96.26` against `89/77/96` thresholds.
- The release ladder resolved 47 aliases to 46 canonical smokes in
  `161.690s`, reused one `428,186`-byte package SHA across 34 consumers, and
  bounded actual builds to two root builds plus one per four docs and five
  mdkg-dev profiles.
- The exact per-smoke timings, build/cache counts, receipt hashes, and
  provenance are preserved in
  `.mdkg/artifacts/goal-78/ci-topology-measurements.json`.
- These are local measurements, not provider execution proof. Node `24.15.0`
  is an exact source-owned workflow requirement and must not be described as a
  runtime executed by Goal 77.

# Options And Tradeoffs

- Curated fast matrix plus sharded full release: recommended architecture;
  balances feedback latency and complete release proof.
- Full ladder on both matrix rows: strongest runtime parity but likely exceeds
  ordinary PR time and provider budgets.
- One serial full job: simpler and cheaper to configure, but slow to diagnose
  and vulnerable to one coarse timeout.

# Recommendation

Accept a durable decision after measurements that binds all of:

- the exact fast-tier canonical identities and target budget;
- full-release shard count, exact membership, measured shard load, and target
  budget;
- the complete job dependency graph and one aggregate release authority job;
- one immutable tarball producer and SHA-verifying artifact consumers;
- docs and mdkg-dev profile/cache behavior;
- Node `24.15.0` and `24.x` fast rows plus Node `24.15.0` manual full release,
  while stating that the exact version is source-inspected rather than locally
  or remotely executed by this spike;
- pull-request, `main` push, and manual trigger semantics;
- exact-SHA input validation and verification of the detached checkout before
  release work;
- job and step timeouts, artifact names, retention, and `if: always()` failure
  evidence;
- concurrency groups and cancellation semantics;
- final tracked-drift proof; and
- the structured workflow parser or deterministic generator/checker strategy.

Default to no new dependency or registry access. Prefer deterministic
generation/checking; choosing a YAML parser dependency requires separate
dependency and registry authority.

If measurements exceed those targets, adjust shard membership or latency in the
decision with evidence rather than silently weakening smoke coverage.

# Follow-Up Nodes To Create

- Create one accepted CI-topology decision derived from `root:prop-9` and link
  it to this spike, `root:task-811`, and `root:test-470` before implementation.
- Use existing `root:task-811` and `root:test-470` for implementation/proof;
  do not create duplicate workflow work.

# Skill Candidates

- None expected. CI topology is repository infrastructure rather than a
  portable skill workflow.

# Data Structures And Algorithms Notes

- The smoke manifest needs stable alias and canonical-identity keys, deterministic
  expansion, cycle detection, per-domain grouping, profile prerequisites, and
  timeout metadata.
- Workflow validation should consume the same manifest rather than maintain a
  second list of smoke names.

# UX Notes

- CI job and artifact names should state runtime, tier, and shard so a failed
  gate is diagnosable without reading implementation internals.

# Security Notes

- No workflow secret values, raw provider payloads, or credentials belong in
  the decision, manifest, tests, or receipts.
- Provider permissions remain least-privilege and unchanged unless a later
  explicit task proves a need.

# mdkg.dev Launch Implications

- Site smoke membership is release correctness evidence, not automatic public
  positioning or launch-copy authority.

# Evidence And Sources

- `root:goal-77`
- `root:test-463`
- `root:test-464`
- `root:prop-9`
- `.mdkg/artifacts/loop-7/test-ci-skill-infrastructure/ci-parity-matrix.json`
- `.mdkg/artifacts/loop-7/test-ci-skill-infrastructure/smoke-coverage-map.json`
