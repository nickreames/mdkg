---
id: chk-615
type: checkpoint
title: Verify exact changed-only warning paths across native Git checkouts
checkpoint_kind: test-proof
status: done
priority: 9
tags: []
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-86/bug-43-local-verification.json]
relates: [bug-43]
blocked_by: []
blocks: []
refs: []
context_refs: [goal-86, goal-84, dec-96]
evidence_refs: []
aliases: []
skills: []
scope: [bug-43]
created: 2026-09-15
updated: 2026-09-15
---
# Summary

Bug43 is locally verified and done. Exact Git-to-project path conversion retains
literal POSIX filenames, both rename/copy paths and all global errors. All1,521
discovered tests pass; one unchanged intermediate tarball passes16 installed
cases per required runtime. This is current-intermediate evidence, not final
0.6.0/macOS/Linux qualification or security clearance. Goal86 remains NOT_READY.

# Scope Covered

- Completed node: bug-43 (Preserve exact changed-warning paths in nested Git checkouts and literal filenames)
- Node type: bug
- Checkpoint source: `mdkg task done --checkpoint`

## Changed Surfaces

- Completed work node: bug-43
- Attached artifacts are listed in checkpoint frontmatter and below.
- Owned functional paths: src/commands/validate.ts, src/util/git_observation.ts,
  tests/commands/validate.test.ts, tests/util/git_prefix.test.ts,
  tests/commands/changed_warning_paths.test.ts and tests/fixtures/changed-warnings.cjs.
- Prior Bug35/41 helper changes and all other owned dirty work are preserved.

## Boundaries

- in scope: structured task completion and checkpoint evidence
- out of scope: unrelated graph, runtime, provider, or release mutations
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded

# Decisions Captured

- See decision and approval refs on the completed node and checkpoint frontmatter.
- No policy change or waiver. Native Git supplies cwd-prefix provenance; shared
  status receipts keep their Git-root-relative semantics. Reindexing does not
  reinterpret arbitrary filename characters or become identity authority.

# Implementation Summary

- Completion of bug-43 was recorded through the structured task lifecycle.
- Detailed implementation or test evidence remains on the completed node and linked refs.
- Source-grounded prepatch/published0.5.2 fixtures lost18of42 root warnings and
  all42 nested warnings. The narrow conversion now preserves every expected
  changed path and warning across root/nested and four native Git topologies.

# Verification / Testing

## Command Evidence

- command: `mdkg task done --checkpoint`
- result: completed node and evidence checkpoint written
- Build/build:test and full manifest-backed test discovery:1,521passed,0failed,
  0skipped. Focused17/17 and broader observer13/13 pass.
- CLI/docs/contract/workflow parity pass;470documentation examples in63files.
- Installed Node24.15.0/24.18.0/26.0.0 each pass16cache/topology cases against
  identical226-file tarball SHA256
  fd927b699a8091922bba4c104c27b0a1ed150ea7790e5cca0882a00236880d06.
- Candidate review and follow-up found no blocking source/assertion defect;
  fixture expectation corrections and remaining coverage distinctions are in
  the receipt. Native helper traps and index-refresh controls stay separately
  covered by the broader suite; no new security scan was launched.

## Pass / Fail Status

- status: done

## Known Warnings

- Three preserved stale imported-bundle warnings; no refresh authorized.

# Known Issues / Follow-ups

- Inspect the completed node and linked refs for any explicitly recorded residual work.
- Next task835: explicit v2 writer-capability fence, then task836 recovery.
- Final metadata, installed/platform matrix, fresh Standard, full independent
  diff, coverage/release ladder and exact artifact seal remain incomplete.
- Package metadata remains0.5.2; Goal85 stays paused. No stage/commit, remote,
  provider, canonical migration or bundle refresh occurred. HEAD remains
  38205296208c23fcfcc6fc821a295040be05c0bb; cached upstream is not live proof.
- Selection, runtime DB, Demo3 bundle and Git index hashes remain protected.
  No standing runtime lease was acquired; supported Bug43 lifecycle is closed.
- Eleven owned synthetic fixture roots removed after inventory; recipes/logs,
  receipts/tarball and installed package bytes retained, unknown paths untouched.
- Skill coverage reused; candidates:none.

## Follow-up Refs

- task/test/goal refs: inspect the completed node and checkpoint frontmatter

# Links / Artifacts

- .mdkg/artifacts/goal-86/changed-warning-intake.json
- .mdkg/artifacts/goal-86/bug-43-local-verification.json

# Raw Content Safety

- This checkpoint stores the completion summary and artifact refs, not raw prompts, secrets, payloads, or bulky traces.
