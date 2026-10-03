# Cloud Goal88 experiment

Goal88 now contains the preservation-first0.6.1 implementation, following its
retained baseline audit. Fresh init generates AGENTS.md only; existing legacy
instructions survive. Mirror admission is hardened. Qualification and review
remain in progress, and Goal88 is NOT_READY.

Latest checkpoint: the independent review's two stale test assumptions were
reproduced and corrected without changing runtime source or package bytes.
The corrected full thresholded suite passed2403/0 with1skip across185files;
coverage92.59/84.27/97.58 exceeded unchanged89/77/96 floors. Affected45/45 and
minimum-runtime26/26 passed. See
[the bounded comparison](../.mdkg/artifacts/goal-88/qualification-4/COMPARISON.md)
and [current receipts](../.mdkg/artifacts/goal-88/qualification-4/checks.json).
Complete release/platform readiness and corrected-candidate review remain pending.

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

## Requested safe stopping boundary

The parent requested a return after about an hour, even if Goal88 is unfinished.
This partial implementation checkpoint is NOT_READY. No tests remain active.
Source implementation commit006f487 is retained; later contract and fresh-init
harness corrections are saved normally, without history rewriting.

The first full package ladder was frozen on006f487 and guarded by an external
20-minute resource budget. It was explicitly cancelled before completion after
remaining fresh-CLAUDE assertions were found in compact-bootstrap/harness tests
and consumer/matrix smokes. Owned timeout process group24275 was checked before
TERM; real runner exit143 is retained. No coverage/test counts are invented.
The corrected compact-bootstrap/harness tests subsequently passed9/9. Build,
CLI contract/matrix, docs499/0, workflow and static readiness pass on the corrected
inputs. The contract no longer lists CLAUDE as a generated write destination.

The old548028-byte candidate is retained outside the checkout and explicitly
superseded; its input manifest and digest are saved. Replacement qualification
is required. The installed Goal88 CLI harness is written and syntax-checked but
NOT_RUN. npm view retrieved public0.6.0 metadata; a bounded direct download failed
with getaddrinfo EAI_AGAIN for registry.npmjs.org. No package bytes/integrity pass
is claimed. An initial npm config attempt incorrectly used /dev/null twice and
was refused; separate private config files succeeded.

One read of the running sandbox's /proc/.../root/dev/shm receipt location was
denied; no namespace access or denial bypass was attempted. The original run
had process-local temporary receipts which were not copied before cancellation.
Future runners must copy receipts to the owned workspace cache from inside the
same command before it exits. This limitation does not change source behavior
or imply that unclassified baseline failures are environmental.

Continue from [.mdkg/artifacts/goal-88/CONTINUATION.md](../.mdkg/artifacts/goal-88/CONTINUATION.md)
and [candidate-checks.json](../.mdkg/artifacts/goal-88/candidate-checks.json).
No full pre-merge/prepublication, local adoption, goal completion or migration
retirement approval is claimed. Goal89/90 remain untouched.

## Continued installed and package qualification

The parent authorized continuation from pinned PR11 headc13c7ad while the local
owner reviews it independently. Goal89 remains on hold. DNS lookup still did
not resolve directly, but the configured cloud HTTPS proxy returned200. One
bounded curl retry retrieved official0.6.0 bytes; SHA256 matched Nick's sealed
b5497c5f5e5f022e19f10c72512cd23d1dfbfa874e79e384112e293df7bff2bc and
SHA512 matched official metadata. No substitute bytes/executor or credentials.
The existing pinned0.5.2 baseline was also retrieved and verified for the
unchanged recovery smoke. Both artifacts remain read-only in the cloud cache.

Read-through found a copyVerifiedArtifact argument-order bug in the previously
unrun qualifier; it was corrected. One incomplete launch hash was refused before
effects; the corrected real launch passed18cases/51CLIinvocations. Current
548015-byte0.6.1 tarball SHA256 is479c2f92ac760e008d4e374aebc57243e3a07520c51b2f7e388353d109f78c9a.
Its237payload files include no root private graph, tests, node_modules or dotenv
paths and no dist/init/CLAUDE.md. This remains an unpublished candidate.

All37package smoke definitions executed in three bounded groups:36pass/1fail,
no skips. First six include consumer/Git-boundary/loop/matrix/upgrade/init; all
passed. Upgrade qualified stale-plan refusals and first/middle/last resume and
rollback with original/custom/Git bytes preserved. Every batch sealed the same
artifact and confirmed unchanged tracked source/head/status/lockfiles, package
inputs and qualification inputs. Logs/receipts were saved to the workspace
from inside each sandbox command before its process-local /dev/shm expired.

The single failure is demo-graph: source_release_input_drift. Its103semantic
inventory rows and unchanged verifier were compared with a pristine git archive
of ddafe083; both yieldf2b49d2d5d061f15f4145cbdf91d28537a0cf0a844a1e5e908b4b2ac905c2924
and fail the sealdfa6461bf076cf003aa0afbcc06928e9214f7e3f8230cf95fafffb306b817fe8.
The read-only diagnostic exports only existing pure functions rather than
materializing demo targets. It changes no verifier or seal. This establishes a
planning-base failure in this cloud checkout; do not infer its deeper cause or
claim the required smoke passed. Owner resolution is pending.

Hosted pinned-head run36972314303 floating Node24.21.0 failed coverage exit1
after876713ms, not timed out. The minimum job was cancelled and full jobs skipped.
Job logs identify the failed gate but do not expose raw coverage failures; those
are inside the482625436-byte uploaded evidence. Their cause stays UNCLASSIFIED.
No full suite rerun, coverage floor change or timeout change occurred here.

This bounded checkpoint remainsNOT_READY. Current receipts are in
.mdkg/artifacts/goal-88/qualification-2/checks.json; the earlier cancelled
candidate receipt stays historical. Runtime source remains the reviewedc13
payload; this follow-up corrects the qualifier and records evidence/partial
state. Full coverage/ladder, site/platform checks and owner review remain open.

The parent reported a cloud disconnect notification at the save boundary.
Fresh commands in the same executor succeeded: pwd matched the owned worktree,
git HEAD remainedc13c7ad and Node24.19.0 responded; graph/skill validators then
completed. No replacement executor, writer or Mac access was used.

## Continued qualification and review intervention log

| Event | Actual outcome |
| --- | --- |
| Exact hosted evidence request | Official connector obtained artifact11211594942; native signed-reference transfer failed curl56 CONNECT proxy403. No archive bytes or credentials committed; no alternate executor or denial bypass. Raw failures remain unclassified; small approved extracts are needed. |
| Site initial setup | Three scripts failed at Astro home config before assertions. Scoped XDG_CONFIG_HOME and ASTRO_TELEMETRY_DISABLED fixed setup; HOME/global config unchanged. All9 then ran,8passed/1failed. |
| Site baseline comparison | Pass5's forbidden `--pack-profile concise` predicate is identical on plan/candidate; offending quickstart line64 unchanged. No baseline example or assertion altered. |
| Demo deeper diagnosis | All103cloud rows mode0600; in-memory0644 projection matches exact accepted seal. Plan/candidate rows and verifier identical. No chmod, reseal, canonical source edit or acceptance waiver. Owner proposals are retained in the comparison. |
| Minimum Node runtime | Official24.18.0Linuxx64 archive verified with HTTPS SHASUMS256. Extracted to owned cache only. Initial prefix guard refused its legitimate top-level directory and was corrected without permitting traversal. Installed18cases/51CLIpassed, using bundlednpm11.16.0. Native default remains24.19.0/npm11.9.0. |
| Independent review steering | Parent returned NOT_READY with two P2 test findings; no Goal89. Cloud reproduced23pass/3fail in26cases. Only cli_onboarding and diagnostic_containment tests corrected, with stronger preservation/idempotency and mismatched-version controls. |
| Affected checks | Node24.19.0:45/45 in3716ms; pinned24.18.0:26/26 in4537ms. Build:test and CLI/docs499/0/workflow/security/static publish checks passed. |
| Full frozen run | One unchanged complete thresholded coverage run, external15minute bound, clean owned fixtures/subreaper.2403pass/0fail/1skip across185files;548470ms, no timeout, coverage92.59/84.27/97.58 above89/77/96. All tracked/package/qualification/artifact custody checks passed;366owned descendants reaped. No broader repeat or gate weakening. |
| Evidence durability | Raw13519V8files/3695750601bytes retained in owned saved cloud cache; compressed manifest, event, command log, summary and hashes committed. Raw cache persistence across executor loss is not guaranteed. |
| Checkpoint | Two test files plus evidence/graph narratives; runtime/package inputs unchanged fromc13. Open NOT_READY review checkpoint; complete ladder/platform/local review pending. PR10 remains unmerged; no Goal89/merge/publication/tag/deploy. |
