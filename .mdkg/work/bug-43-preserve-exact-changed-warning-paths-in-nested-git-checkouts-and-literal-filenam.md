---
id: bug-43
type: bug
title: Preserve exact changed-warning paths in nested Git checkouts and literal filenames
status: done
priority: 1
tags: [release-0.6.0, validation-completeness]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-86/changed-warning-intake.json, .mdkg/artifacts/goal-86/bug-43-local-verification.json]
relates: [task-771, test-431, test-480]
blocked_by: [bug-41]
blocks: []
refs: [dec-96]
context_refs: [goal-86, goal-84]
evidence_refs: []
aliases: []
skills: []
created: 2026-09-15
updated: 2026-09-15
---
# Overview

Goal: make changed-only warning selection use exact project-relative paths.
Owner: mdkg-project-agent, under the bounded Goal86 execution contract. This is
a functional validation-completeness blocker, not a new security scan finding.
The current candidate and retained published0.5.2 both omit six task-heading
warnings for a modified node when the graph is nested beneath the Git root or
the POSIX filename contains a literal backslash. Ordinary root paths retain all
six warnings. Full validation still emits these warnings and graph errors are
not filtered; do not overstate the affected surface as all validation.

# Reproduction Steps

1. In an owned synthetic Git fixture, create a valid legacy graph and task.
   Test graph-at-Git-root and graph-in-a-nested-directory separately.
2. Keep the task frontmatter, remove its body headings, and run full validation
   and validate --changed-only --json. Repeat with a literal backslash filename.
3. Full validation reports six task warnings in every case. Changed-only emits
   six for the ordinary root case and zero for the other three cases.
4. Repeat against retained published0.5.2 and the current built candidate. No
   source import substitutes for the CLI invocation; no remote is involved.

# Expected vs Actual

- Expected: path-bound warnings for changed nodes survive exact Git-to-project
  path conversion; unchanged warnings stay excluded and all errors stay visible.
- Actual: porcelain paths are Git-root-relative, whereas warning paths are
  mdkg-root-relative. Backslashes are additionally replaced with separators,
  changing literal POSIX names into different paths.

# Suspected Cause

src/commands/validate.ts collectChangedPaths replaces backslashes and does not
remove the Git cwd prefix before comparing with warning.path. The new shared
readGitStatus correctly preserves raw porcelain bytes. This caller bug predates
Bug41 and also occurs in published0.5.2. Achieved task771/test431/chk506 addressed
different untracked-directory coverage and remain historical completed evidence.

# Fix Plan

Scope: src/commands/validate.ts and directly necessary existing Git path helpers,
regression and installed fixtures, sanitized evidence and required projections.
Reproduce before patching and obtain independent bounded read-only verification.
Use Git's own cwd-prefix identity and path semantics; do not rewrite arbitrary
backslashes or change shared status receipts silently. Preserve both sides of
rename/copy records, tracked/untracked paths, no-cache behavior, global errors,
read-only state and all Bug41 helper/failed-observation protections.

Run only after Bug41, before finalized package-input qualification. No canonical
Git operation, remote, provider, migration, bundle refresh, consumer change or
publication. Deduplicate against task771/test431 and current Bug41, rather than
reopening their completed history. A new confirmed prerequisite remains open
until source and installed acceptance plus final task828 review support closure.

# Test Plan

Root and nested graphs, root and linked-worktree checkouts, spaces/newlines and
literal backslashes, stage/unstaged/untracked and rename/copy paths. Assert exact
changed_paths and warning identities/counts, not just exit zero. Preserve all
graph errors, exclude unchanged warnings, trap unexpected Git/helper activity,
and compare full filesystem/Git-index bookends. Repeat relevant installed cases
on required runtimes and macOS/Linux through test480/487; no platform waiver.

# Links / Artifacts

## Local verification - 2026-09-15

The bounded remedy preserves Git's exact cwd prefix and translates porcelain
paths with POSIX semantics; no literal backslash substitution remains. Native
rename/copy, staged/unstaged/untracked and nested graphs pass in standalone,
linked-worktree, submodule and separate-gitdir fixtures. Present/absent caches
pair with caller optional-lock policy1/unset. All graph errors remain visible,
unchanged warnings stay excluded and complete fixture inventories stay equal.

All1,521 discovered source tests,17 focused and13 broader observation tests pass.
One unchanged226-file intermediate tarball passes16 installed cases per runtime
on Node24.15.0/24.18.0/26.0.0. Package metadata is still0.5.2; this is not a final
0.6.0 seal or Linux/platform clearance. Independent read-only candidate review
found no implementation defect; its three evidence distinctions were addressed
or explicitly retained. Fresh Standard/task828 and final test480/487 remain.

The fixture's initial missing-edge/exit-code and deleted-cache expectations were
corrected from observed behavior, without weakening assertions. Exact source,
package, runtime, review and log hashes plus cleanup are in
.mdkg/artifacts/goal-86/bug-43-local-verification.json. No staging/commit, remote,
provider, bundle refresh, canonical migration or publication occurred.

- .mdkg/artifacts/goal-86/changed-warning-intake.json
- Current scope: Goal86; blocker ledger: Goal84; prior evidence: task771/test431.
- Existing source-grounded and goal/checkpoint skills apply; new candidates:none.
