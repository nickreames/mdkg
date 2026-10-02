# Cloud Goal88 experiment

Goal88 now contains the preservation-first0.6.1 implementation, following its
retained baseline audit. Fresh init generates AGENTS.md only; existing legacy
instructions survive. Mirror admission is hardened. Qualification and review
remain in progress, and Goal88 is NOT_READY.

| Verified input | Observation |
| --- | --- |
| Environment/cwd | Saved cloud environment; original /workspace/mdkg identified from https://github.com/nickreames/mdkg.git |
| New worktree | /workspace/mdkg-cloud-goal88 |
| New branch | cloud/goal88-minimal-init |
| Base | docs/cloud-three-release-plan at ddafe0836fdc790cd36ba203afbcfc1878bbddd8; actual ls-remote/fetch and connected PR10 reader agree |
| Main | d9b74c3fa172688a99406fd908571c7e3f666395 |
| PR10 | Open, draft, unmerged; the old merge-before-implementation language is superseded by Nick's new explicit instruction |
| Runtime | Linux x86_64; Node24.19.0/npm11.9.0; engine >=24.18.0 <25 |
| Package | Source/lock/release candidate0.6.1, unpublished; public npm latest verified0.6.0 |
| Writer | mdkg-project-agent; explicit root:goal-88 and root:task-844; no selected-goal mutation |
| Graph | Legacy v1; no identity migration or new numeric IDs allocated |

The current user expressly authorized the sequential three-draft stack before
PR10 merge, with the narrow cloud implementation exception to unfinished local
git-gud. The supplied transcript includes Nick's instruction: “branch off the
PR 10 branch and work through each of the goals 1 by 1 sequentially in their own
PR stack with the docs/cloud-three-release-plan branch as the base”. Only
Goal88 is in this turn. Goal89/90, human merges and publication remain outside
this checkpoint. No implementation authority needs to be requested again.

The concrete decision awaiting review is in
[design-proposal.md](../.mdkg/artifacts/goal-88/design-proposal.md), supported by
[baseline-init.json](../.mdkg/artifacts/goal-88/baseline-init.json) and
[checks.json](../.mdkg/artifacts/goal-88/checks.json). Task844 reserves the legacy
compatibility duration and preservation behavior for Nick before task845.
Chk672 is a review checkpoint with actual audit evidence, not claimed approval.
No decision is inferred from elapsed time or the implementation authorization.

## Intervention and setup log

All entries below occurred in the 2026-10-02 UTC cloud turn.

| Event | Outcome |
| --- | --- |
| Environment startup | Became ready; no Mac fallback. |
| Checkout inventory | A filename-only inventory included unrelated checkout names; no unrelated file contents were read or changed. All subsequent content operations stayed within mdkg and its synthetic fixtures. |
| GitHub CLI PR read | gh pr view10 returned GraphQL Forbidden. Existing connected GitHub reader succeeded, confirmed exact refs/state, and supplied PR10's actual body. No credentials inspected or denial bypassed. |
| Branch | Created a new native worktree from the verified plan remote. Original work/main and planning branch were not changed. |
| Dependency retry | Default npm cache failed under missing/unwritable home cache. Repeated supported bootstrap with an isolated workspace cache passed all three dependency owners. No lock/source changes. |
| Grounding | Read AGENTS/startup/core docs, relevant .agents skills, EDD83, Chk681, all three goals' tasks/tests/checkpoints, retained planning experiment and source. Selected goal was none. |
| Owned work | Used explicit-QID goal claim/task start for task844; generated SQLite is excluded/restored to base bytes before commit. Missing event history was not recreated. |
| Design choice | Sent one asynchronous choice for the exact compatibility/removal policy. No answer had arrived at checkpoint preparation. Audit continued independently. |
| Baseline audit | 32 synthetic CLI invocations; fresh/repeat byte inventories, graph-only/invalid profile, authored root files and force control, four mirror destinations, malformed markers and path admission observations. Real Git fixtures prevent the invalid /tmp ancestor from impersonating non-Git fixture context. |
| Focused checks | 219 cases across ten init/upgrade/identity/mirror families; clean separately permitted /dev/shm/mdkg-goal88-fixtures; actual Node exit0, no synthetic Git wrapper or altered assertions. |
| Boundary findings | Nested mirror targets and case aliases admitted; canonical overlap non-force refused by slug ownership, not proven structurally safe. Preserve these acceptance gaps. |
| Broad checks | Build/test compilation, CLI matrix/contract, workflow drift, docs499/0, graph0errors and skill8/0 passed. Focused evidence does not claim final package readiness. |

The earlier planning runs' full-test/coverage failures, GitHub fast-job timeouts,
unclassified failures, hosted Test487 qualification gap, and deferred filesystem
limits remain open. This checkpoint did not rerun the entire failing ladder,
weaken coverage/timeouts, or attribute all failures to the environment.
At the initial audit boundary no0.6.1 artifact or feature acceptance was claimed.
That historical receipt remains intact. Later implementation and checks below
do not claim publication or professional adoption.

Next: complete the bounded frozen-candidate checks and update the same first
draft PR for parent review. Legacy retirement remains a separate design decision.
Goal88 remains open and NOT_READY; do not start Goal89 here.

## Draft checkpoint receipt

The authorized implementation-stack branch was pushed normally at
0a7ad4d87841adfe2c2decf8cec5e77fb096e87e. Connected GitHub creation returned
[PR11](https://github.com/nickreames/mdkg/pull/11) on 2026-10-02T05:27:19Z:
open, draft, unmerged; base docs/cloud-three-release-plan at ddafe083;
head cloud/goal88-minimal-init. Search confirmed no prior PR for this head.
Nine changed files are the three scoped Goal88/task844/chk672 nodes, five
audit/design/evidence files, and this log. Runtime/package inputs are unchanged.
This normal evidence-only follow-up records the actual PR receipt; no shared
history is amended or rewritten. The compatibility choice remains pending.

## Continued Goal88 implementation

The parent explicitly asked continued authorized Goal88 work while Nick sleeps,
followed by the local owner's full code review and pre-publish checks. This
continues the same goal. It does not approve the proposed removal policy. The
independent preservation-first alternative removes only the public generated
CLAUDE seed and fresh/missing-file creation; every existing CLAUDE file stays
byte-for-byte. Maintained repository root instructions remain. Existing
startup redirects, provenance and hash-bound recovery remain unchanged.

Both native skill mirrors remain defaults. Extras use the existing config. All
normalized destinations now refuse canonical/nested/case-alias overlaps before
effects, and sync/authoring preflight all destinations before a late unmanaged
collision can change earlier targets. Custom target lists stay intact; upgrade
reports missing native defaults for explicit config review.

| Intervention | Outcome |
| --- | --- |
| Parent continuation | Continued safe, independent Goal88 slices; no retirement approval inferred from sleep/time. |
| Owned lifecycle | Explicit task845/846/test494/task847 start; owner already declared in planning. One attempted unsupported task-start --owner was refused before effects, then corrected to supported --note. |
| First focused candidate | 234 cases,232 pass/2 fail/0 skip. Both failures were expected-diagnostic drift after structural early refusal, corrected and affected caller rerun passed. |
| Shared callers | 172 cases,170 pass/2 fail/0 skip. Failures were old static version markers/release-guidance expectation; corrected. Guidance recheck20/20 passed. |
| Security/static | Existing security matrix passed; static readiness initially failed2 stale version markers, then passed. Failure evidence retained, no independent security acceptance implied. |

Candidate source/asset/docs and version changes will be frozen before broad
checks. Full coverage floors, timeouts and required platform gates are retained.
No task/goal is marked done from focused passes.
