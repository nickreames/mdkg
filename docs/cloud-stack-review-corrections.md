# Cloud stack independent-review corrections

Status: bounded corrections, not release readiness. The 2026-10-03 parent relay
supplies two P2 findings: PR10 could unlock a successor from a done checkpoint
whose result is NOT_READY; PR12's legacy working-store UUID was not independent
host-graph identity. Nick authorized the recommended next steps and indefinite
quarantine with explicit recovery/purge and no automatic deletion as policy
direction. Revised Goal89 identity/compatibility remains subject to review;
0.6.2/0.6.3 implementation is explicitly excluded from this turn.

## Custody and synchronization

Verified origin is nickreames/mdkg. Original immutable heads: planning PR10
ddafe0836fdc790cd36ba203afbcfc1878bbddd8; Goal88 PR11
1a3cf4f45621cd67b51aba482966927aeea17419; design-only Goal89 PR12
0ff7095a94a28e02397f16db5c10a66933030f2d. Original main/work checkout at
d9b74c3fa172688a99406fd908571c7e3f666395 stays untouched. Node24.19.0/npm11.9.0,
native Linux x86_64, saved cloud environment. No Mac review paths were opened.

PR10 corrections use a native isolated /workspace/mdkg-cloud-plan-review
worktree on its existing docs/cloud-three-release-plan branch. After normal
commit, merge that exact corrected planning commit into cloud/goal88-minimal-init
with a normal two-parent merge commit. After Goal88 correction, merge its exact
head into cloud/goal89-persistent-working in the same way. Preserve original
commits, draft PR bases and all evidence; never rebase, amend, force-push or merge
PR10/main. These internal stack synchronization merges are separately authorized
by Nick's current instruction and are not human PR merges.

## PR10 P2 contract

Three release checkpoints explicitly opt into verdict tags. NOT_RUN is non-done;
NOT_READY is blocked or review. Only an evidenced independently reviewed
READY_PENDING_APPROVAL assessment can become done for dependency purposes.
Completing a failed assessment never completes its prerequisite. Manual publication
and adoption authority are separate. Scoped owner prerequisite exceptions remain
narrative, not an invented READY/done verdict.

A bounded node-parser guard rejects invalid tagged statuses; goal-next also
checks verdicts on cached blocker nodes. Normal docs checks enforce required
markers for chk674/677/680 and retain task848/852 blocked_by edges. Other ordinary
checkpoints keep existing behavior. No working/sibling graph feature is added.
Regressions cover actual node parsing, cached done/NOT_READY routing, all three
gate contracts, unknown/duplicate/missing markers, removed dependency edges and
valid READY/ordinary-checkpoint controls.

## Checks and outstanding scope

Guidance/contract changes use focused parser/goal routing/plan regressions and
normal graph/skill/CLI/docs/workflow checks. Full exact-candidate/platform gates
remain necessary before pre-merge/prepublication assertions. Earlier independent
Mac evidence is reported by the parent, never execution by this cloud worker.
No old source/package evidence is silently rebound to changed bytes.

Site/CI and revised Goal89 details are recorded in their owning stacked branches.
All historical failed/cancelled/not-run receipts remain intact. Coverage floors,
time budgets and the 37 package / 46 repository smoke definitions are not reduced.
The current hosted portable-filesystem stub and Goal87 gaps remain unqualified.

## Intervention log

- Initial resumed inventory listed workspace filenames before re-verifying
  remotes. No unrelated file contents were opened; subsequent operations are
  restricted to the three verified mdkg worktrees, the new mdkg planning worktree
  and owned mdkg task caches. No unrelated repositories or Mac files were changed.
- Re-verified all remote/PR heads and clean worktrees before edits. Current
  parent-supplied P2 summaries were sufficient; exact Mac reports were not assumed
  available in cloud. Requested only missing small hosted coverage evidence.
- Original plan worktree was not retained after restart; recreated its local
  branch/worktree from the exact verified remote head without altering history.
- Added only opt-in checkpoint safety and planning-contract validation in PR10.
  Full working implementation and Goal90 remain excluded.
