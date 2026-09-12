---
id: chk-601
type: checkpoint
title: Record read-only mount preflight and Git index refresh blocker
checkpoint_kind: audit
status: done
priority: 9
tags: []
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-84/bug-35-readonly-git-index-reproduction.json]
relates: [root:bug-7]
blocked_by: []
blocks: []
refs: [bug-35, goal-83, goal-84, task-826, task-828, test-480]
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [bug-7, bug-35, test-480]
created: 2026-09-11
updated: 2026-09-11
---
# Summary

Read-only mount capability is proven on this host, but installed graph
qualification stopped at a newly reproduced observational Git index defect.
Bug35 is recorded as a publication blocker; no source remedy is applied.

# Scope Covered

Goal83/84 installed qualification, Bug7, test480 and new Bug35.
One empty synthetic HFS+ probe plus isolated legacy root/child Git fixtures.

## Changed Surfaces

New Bug35 and reproduction artifact; this checkpoint; additive Goal84 scope,
Bug7/test480 evidence and task828 blocker routing; required index projection.
No source, tests, instructions, skills, package inputs or protected state edits.

## Boundaries

Only owned /private/tmp images/fixtures and approved mdkg planning/evidence.
No existing disk, canonical migration, bundle refresh, remote Git, publication,
provider, deployment, root or sibling action.

# Decisions Captured

No existing compatibility decision accepted. Request narrow permission to edit
Git-read helpers in preserved src/commands/subgraph.ts and src/commands/bundle.ts
without changing the separate Bug17 transport patch or policy.

# Implementation Summary

The sandboxed image create returned Device not configured. A scoped approved
retry created an empty UDRO HFS+ image, mounted it read-only at its owned
temporary mountpoint, verified EROFS on file creation and detached it.
This is host capability proof, not a completed installed graph mount matrix.

The existing smoke-mcp helper builds synthetic root/child graphs. An initial
unqualified legacy alias correctly failed; the harness now qualifies root IDs.
Writable-copy snapshot validation then caught an unexpected child Git index
change. Independent CLI cases isolate missing optional-lock suppression.

# Test Proof

Seven installed command cases (status, show, validate, changed-only validate,
subgraph list, subgraph audit, git inspect) refresh root and/or child Git indexes.
The seven matching GIT_OPTIONAL_LOCKS=0 controls preserve both indexes.
All14commands exit zero; staged object/mode/path entries remain identical.
This proves index metadata mutation, not staged-content corruption.
Source and installed runtime hashes, exact before/after index hashes, commands
and controls are bound in the artifact. Node24.18.0/current candidate only.

# Verification / Testing

## Command Evidence

- Empty mounted probe: EROFS, no created file; exact mount detached.
- Final14case installed reproduction:7fail the observational invariant,
  7mitigation controls pass; no failed child processes.
- Independent read-only evidence review confirms paired inputs, hashes,
  staged-entry preservation and optional Git index refresh as the cause.
- Closing graph/SQLite/diff checks are recorded in the linked artifact.

## Pass / Fail Status

Audit intake complete; Bug35 blocked on protected-source custody permission.
Bug7/test480/full release qualification remain incomplete.

## Known Warnings

Actual graph mount runs were not attempted after the writable baseline failed.
No publication clearance, published0.5.2 regression proof, Windows claim or
active-hostile-writer race immunity is inferred.

# Known Issues / Follow-ups

Permit the two narrow protected-file helper edits, then reproduce/fix all
observational Git paths with regression and installed-package proof.
Rebuild the candidate and resume actual read-only graph qualification.
All earlier compatibility, final security, metadata, ladder and seal gates remain.

## Follow-up Refs

Bug35,bug7,test480,test483,task826,task828,goals83/84/85.

# Links / Artifacts

.mdkg/artifacts/goal-84/bug-35-readonly-git-index-reproduction.json
Private synthetic evidence:/private/tmp/mdkg-readonly-mount.r0wGNa.
Source baseline:dfafe500929a279eae8f958b71a3fe2ea8253351.

## Affected-Version Follow-Up

At source HEAD3e1d597a, a separate matrix completes the original version and
bundle-path investigation:96commands, two installed packages, three runtimes,
eight paths and two optional-lock policies. Published0.5.2 is affected along
with the candidate. All48 default-policy cases mutate Git index metadata;
all48 controls preserve it; staged entries remain unchanged in all96.
Only requested ZIP outputs and the known published show subgraph-cache write
appear outside the Git indexes. Candidate read paths preserve other file bytes.

Evidence:.mdkg/artifacts/goal-84/bug-35-affected-versions.json. Package tarball
comparisons cover all191published and223candidate files. Retained runner/raw
results/log hashes support reproduction; all96 case copies and both extracted
tarball trees were removed. Protected source and state hashes are unchanged.
This expands defect evidence, not security or release clearance. Earlier
single-runtime and static-only bundle limitations are superseded by this matrix;
actual mounted-graph qualification and source remediation remain incomplete.

# Raw Content Safety

Durable evidence contains synthetic summaries and hashes; raw logs remain in
owned temporary storage. No secrets or consumer payloads were inspected.

Skills: goal pursuit, pack grounding, source-grounded-diagnose-and-fix,
verification/checkpointing and safe Git preflight. New skill candidates:none.
