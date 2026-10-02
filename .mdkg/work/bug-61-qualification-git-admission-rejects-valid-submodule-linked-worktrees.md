---
id: bug-61
type: bug
title: Qualification Git admission rejects valid submodule linked worktrees
status: done
priority: 1
tags: [release-0.6.0, qualification, git, worktrees]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-86/test-478-indirection-qualification.json, .mdkg/artifacts/goal-86/test-478-indirection-qualification.cjs, .mdkg/artifacts/goal-86/private/candidate-0.6.0-6154e4ea920bfa09.qualification-inputs-bug61.json]
relates: []
blocked_by: []
blocks: [test-478]
refs: [goal-86, goal-84, task-838, test-478, task-828]
context_refs: [goal-86, goal-84, task-838, test-478]
evidence_refs: []
aliases: []
skills: []
created: 2026-09-28
updated: 2026-09-28
---
# Overview

Goal: restore honest installed submodule-linked-worktree qualification without
weakening fixture filesystem/Git ownership admission. This is a validation
infrastructure correctness blocker, not an established shipped CLI vulnerability.

Context: Test478's retained6154e4ea candidate reaches the new submodule fixture,
but scripts/qualification-git.js rejects Git's valid linked checkout. Canonical
main remains6d23981e, with167 entry dirty paths, no staging or mutation lock and
unchanged protected hashes. Goal86 is the sole execution lane; Goal84 is a
paused blocker ledger. Reuse Task838's custody design, not a second Git wrapper.

Boundary: scripts/qualification-git.js, its direct regression/caller tests,
private installed qualification, mdkg evidence and required projections only.
No production CLI or package payload change, remote Git, canonical branch or
worktree, providers, publication, bundle refresh, blocked context or native code.

Done when: failing-before regression, preserved negative custody controls,
relevant shared-helper tests, exact installed submodule/separate-gitdir trials
and independent bounded source readback pass. Final security/platform/ladder
acceptance remains separate. Source/helper input changes require explicit
qualification-evidence revision, never silent reuse of the old capture.

# Reproduction Steps

1. Create a synthetic parent and source repository inside an owned fixture;
   add the source as a native local submodule and commit the parent's gitlink.
2. From that child, add a native linked worktree using the existing admitted
   fixture helper. Its post-create describe call throws:
   Git fixture core.worktree does not match its expected root.
3. The focused regression in tests/qualification-git.test.mjs reproduces1/1
   failure before the patch. Native read-only rev-parse resolves the new
   checkout and its independent index correctly; no CLI incompatibility follows
   from the harness error.

# Expected vs Actual

- Expected: inherit the submodule's common repository while binding the new
  checkout's reciprocal gitdir marker, HEAD and index independently.
- Actual: common config core.worktree is resolved against the linked gitdir
  and required to equal the linked checkout, although it names the original
  submodule checkout. A legitimate topology is rejected after creation.

# Suspected Cause

Confirmed in describe(): common and checkout-local config rows shared one
core.worktree check. Native Git's original submodule value is relative to the
common directory; the linked checkout is identified by its own reciprocal
gitdir marker. Existing separate submodule/worktree tests did not compose them.

Affected-version assessment: current repository qualification helper from the
Task838 lane; scripts/qualification-git.js and its test are outside npm's files
allowlist. No npm-runtime affected-version claim is made.

# Fix Plan

- Separate common versus checkout-local core.worktree admission.
- Require the linked gitdir backpointer to identify this exact checkout.
- For inherited common core.worktree, require an owned original checkout whose
  .git marker points back to this exact common directory. Outside/sibling
  metadata and checkout-local redirects still refuse without mutation.
- Retain the old source-input capture. Record a successor qualification-input
  capture showing the exact non-shipping helper/test delta against unchanged
  candidate bytes; requalify affected helper/topology families.

# Test Plan

- Focused failing-before/passing-after real submodule-linked fixture.
- Preserve parent and original child HEAD/index/gitlink state during linked
  commits; reject forged backlinks, outside/sibling common paths and local
  worktree redirects with complete unchanged inventories.
- Shared fixture Git suite and dependent qualification helpers.
- Installed ordinary, separate-gitdir and submodule-backed concurrent worktrees,
  recovery/merge assertions, graph/index/diff validation and independent review.

# Links / Artifacts

- Chk660 and the Test478 indirection receipt record the completed local fix.
  Chk659 is earlier evidence, not proof of this newly covered topology.
- Initial focused regression:1 failed/0 passed. The corrected Git-fixture suite
  passes31/31; the broader shared-helper selection passes124/124 including
  those31, not155 unique tests. Ordinary, separate-gitdir and submodule-backed
  linked-worktree installed trials all pass against the retained6154e4ea bytes.
- Independent bounded source readback found and corrected a private-fixture
  approval-token control issue; final review found no remaining concrete defect
  in this patch. This is not Task828 security or final platform acceptance.
- Source capture amendment29e0f1e2 preserves the original capture and binds the
  single non-shipping helper delta. No package input or tarball byte changed.
- All six newly owned fixture roots were removed after terminal/process checks;
  failed-attempt diagnostics and exact runnable sources are retained.
- Existing skill coverage reused; new skill candidates:none.
