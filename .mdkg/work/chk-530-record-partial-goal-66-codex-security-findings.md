---
id: chk-530
type: checkpoint
title: record failed partial Goal-66 Codex Security evidence
checkpoint_kind: audit
status: done
priority: 9
tags: [goal-66, security, failed-scan, partial-evidence, remediation, 0.5.2]
owners: []
links: []
artifacts: []
relates: [bug-2, bug-3, task-791, test-450, goal-67]
blocked_by: []
blocks: []
refs: []
context_refs: [edd-73, dec-62, dec-64, dec-77]
evidence_refs: []
aliases: []
skills: []
scope: [goal-66, bug-2, test-452, bug-3, test-453, task-791, test-454, test-450]
created: 2026-07-15
updated: 2026-07-15
---
# Summary

Codex Security scan `4956a227-c1c0-4309-98d0-1e65687fab71`
completed repository threat modeling, deterministic diff worklist generation,
11/11 source-like full-file reviews, candidate reconciliation, and bounded
dynamic validation for two candidates.

The plugin did not complete. Worker runtime cybersecurity refusals interrupted
one discovery attempt and two stdin-validation attempts. The parent recovered
the discovery and validation evidence, but the scan stopped before attack-path
analysis, canonical findings/coverage manifests, final report sealing, and
workbench indexing. The operator later terminally marked scan
`4956a227-c1c0-4309-98d0-1e65687fab71` failed and removed Codex Security from
Goal 66 scope. Treat every artifact below as partial and unsealed.

# Scope Covered

- Goal: `goal-66`
- Snapshot base/head: `d78892a53c72c85f1c74489e5b057074f5a1b8bb`
- Working-tree snapshot digest:
  `codex-security-snapshot/v1:sha256:0bf7d576c249bb54b41dbf1988b42a65111e6985484a8c0359827c83be85bf19`
- Worklist closure: 11/11 changed source-like rows.
- Remediation refs: `bug-2`, `test-452`, `bug-3`, `test-453`,
  `task-791`, `test-454`, and `test-450`.

## Changed Surfaces

- Reviewed strict request parsing, external auth capability checks, Git argv
  controls, revision/tree checks, destination containment, cancellation and
  cleanup, project-memory discovery, receipts, CLI dispatch, package lifecycle,
  generated contracts, consumer smokes, and static docs routing.
- This checkpoint adds graph evidence only; it does not remediate source.

## Boundaries

- in scope: preserve partial scan facts, remediation provenance, and terminal
  failed disposition.
- out of scope: source fixes, version bump, release, push, publish, global
  install, deployment, and real-root upgrade.
- raw secrets, raw prompts, raw payloads, inert marker values, full CLI output,
  and bulky execution traces excluded.

# Decisions Captured

- `dec-62`: authentication is represented by opaque non-secret refs.
- `dec-64`: credential-shaped values must fail validation.
- `dec-77`: Git authentication remains external.
- `edd-73`: materialization inputs and receipts are bounded and redacted.

# Implementation Summary

- No implementation changed in this checkpoint.
- The two security candidates became explicit bug/test lanes.
- The generated command-contract fidelity gap became a task/test lane.
- `test-450` uses the built-in security verifier, focused regressions, complete
  local tests, and package-consumer proof. The failed partial scan cannot be
  reused as zero-finding evidence and is not a release gate.

# Audit Findings

- Reviewed surfaces: 11/11 worklist rows; see Scope Covered.
- Candidate 1: `git-materialize-stdin-prelimit-001`. The CLI remained active
  after 65,537 stdin bytes and rejected only after EOF. This proves the 64 KiB
  limit is applied after allocation. Follow-up: `bug-2` and `test-452`.
- Candidate 2: `git-materialize-receipt-ref-leak-002`. The real local CLI
  preserved an inert credential-shaped marker in all four generic receipt-ref
  fields; a sensitive URL-query control was rejected. Follow-up: `bug-3` and
  `test-453`.
- Non-security completeness gap: generated `git materialize` flags mark
  `--request` optional and omit bracketed `--json`. Follow-up:
  `task-791` and `test-454`.
- Scan limitation: no attack-path/severity phase, no canonical
  `findings.json`/`coverage.json`/`scan-manifest.json`, no sealed report,
  and no post-fix scan.

# Verification / Testing

## Command Evidence

- Final workbench disposition: failed, phase `validation`, 11/11 worklist rows,
  report unavailable.
- Failure was recorded through the Codex Security workbench on 2026-07-15 with
  operator message that the plugin/runtime is broken for this workflow and is
  removed from Goal 66 scope.
- Bounded stdin validation: candidate survived with high confidence.
- Local receipt marker validation and URL negative control: candidate survived
  with high confidence.
- JSONL reconciliation: 11 work-ledger rows, two raw candidates, two deduped
  candidates, and one discovery plus one validation receipt per candidate.

## Pass / Fail Status

- status: partial evidence accepted for remediation planning; release readiness
  failed.

## Known Warnings

- The workbench field `findingCount: 0` means no finalized/indexed findings;
  it must not be interpreted as zero discovered or validated candidates.
- The local temp artifact directory is not durable and may be removed by the
  host. Hashes below preserve artifact identities, not contents.
- The scan is terminally failed and unfinalized. Its `findingCount: 0` means no
  finalized/indexed findings and is not evidence of a clean scan.
- Codex Security is out of scope by explicit operator decision. No restart or
  replacement scan is required for Goal 66 or Goal 67.

# Known Issues / Follow-ups

- Bound streamed request bytes before allocation.
- Reject credential-shaped generic ref values before Git and receipt output.
- Correct generated command-contract required/optional flag fidelity.
- Preserve the passing built-in security, regression, package-consumer, and
  local prepublish ladder as the release authority.

## Follow-up Refs

- `bug-2`, `test-452`, `bug-3`, `test-453`, `task-791`,
  `test-454`, `test-450`, `goal-66`, and `goal-67`.

# Links / Artifacts

- Local temp scan suffix:
  `codex-security-scans-yzZJ92/mdkg/d78892a5_20260715T235633Z_nkhdajge`
- Threat model SHA-256:
  `c3281d4dbba20f7b8d31d95f19b230a9fed1b673eebbe2bc3fb8df97961b7f95`
- Work ledger SHA-256:
  `abb27fd5c767b0f03138f036a35809fb201ee069fe54ea9fbe98ea09e7102095`
- Discovery report SHA-256:
  `b433bbe2734375e725d8609f8cec34cbaa5c4e05206214901c34346b78c6c567`
- Deduped candidates SHA-256:
  `bb2a90ff310fb5cfb57eff63041d3ca375e50612b9e36015e58b9497e138d537`
- Validation summary SHA-256:
  `923e63a69cc8d30cb6f34117185e211442742db1291ad877583f0af10bf23f00`
- Candidate 1 validation report SHA-256:
  `e737d2a427d772da33962eae560c311613386856275bade2b8240522a0f85871`
- Candidate 2 validation report SHA-256:
  `46e60ccf78c04a9e100181b26e30beecb12701a4c41faf64b992898009052e9b`

# Raw Content Safety

- This checkpoint stores candidate ids, bounded observations, and hashes only.
  It excludes inert marker strings, raw request fixtures, CLI stdout, raw
  worker prompts, and all credential-like payloads.
