# Cloud planning experiment

This is Nick's first cloud-only mdkg documentation/design PR. It defines three
sequential implementation goals and stops before implementation or publication.
The detailed contract is [edd-83](../.mdkg/design/edd-83-cloud-three-release-planning-contract.md).
Executed results are in [checks.json](../.mdkg/artifacts/cloud-planning/checks.json).

## Setup and custody

| Item | Verified observation |
| --- | --- |
| Environment | Saved cloud environment named mdkg; selected environment became ready; Linux x86_64 |
| Checkout | /workspace/mdkg; remote https://github.com/nickreames/mdkg.git |
| Base | d9b74c3fa172688a99406fd908571c7e3f666395; fetch and ls-remote agreed; original clean work branch at same SHA |
| Worktree | /workspace/mdkg-cloud-plan |
| Branch | docs/cloud-three-release-plan; new native Git worktree from verified origin/main |
| Toolchain | Source-built mdkg 0.6.0; Node 24.19.0, npm 11.9.0, Git 2.52.0; engine >=24.18.0 <25 |
| Local comparison | Nick's reported local Node 24.18.0 differs; Mac files/state were not accessed; unpublished local changes are unknown |
| Git identity | Existing Nicholas Reames repository identity retained; no credential/config changes |
| Graph identity | Legacy v1: no .mdkg/graph.json; no migration; new IDs allocated by supported CLI under mutation lock |
| Selection | Cloud goal-current returned none; no goal activation/claim or imported Mac state |
| Dependency setup | Supported npm run deps:bootstrap installed root/docs/mdkg-dev lockfile owners; isolated npm cache under /tmp; no manifest/lock changes |

Only Git remotes were read to identify mdkg among available checkouts. All source,
graph and write work stayed in mdkg or its owned synthetic fixtures; no unrelated
private repository contents or company graphs were inspected.

Authorization: Nick explicitly approved latest-main cloud checkout, worktree and
branch creation, planning commits/push and draft PR creation. His full-history
git-gud gate waiver applies only to this cloud documentation/design PR. Original
implementation/local cleanup gates remain. No Mac copying, history rewrite,
force/amend, main edit, merge, tag, npm publication, deploy, provider/production
change or professional adoption is authorized. Existing tracked bundles and
SQLite cache bytes are preserved in the proposed commit; no bundle refresh.

## Plan inventory

| Goal / provisional minor | Tasks | Future test | Future design / acceptance / prepublication checkpoints |
| --- | --- | --- | --- |
| goal-88 / 0.7.0: minimal init and mirrors | task-844, task-845, task-846, task-847 | test-494 | chk-672, chk-673, chk-674 |
| goal-89 / 0.8.0: working storage | task-848, task-849, task-850, task-851 | test-495 | chk-675, chk-676, chk-677 |
| goal-90 / 0.9.0: independent sibling graphs | task-852, task-853, task-854, task-855 | test-496 | chk-678, chk-679, chk-680 |

Exactly three new goal nodes. Each is backlog/paused, with five executable scope
nodes (four tasks and a test); checkpoints are linked context and dependency
nodes because current goal scope_refs excludes checkpoint types. No claims or
future test results are fabricated. goal-89 blocks on chk-674, goal-90 on chk-677.
Implementations proceed sequentially after Nick reviews/merges the plan and
explicitly runs scoped work under the remaining original gates.

Planning-only review checkpoint: chk-681. Deferred concept: task-856, priority9,
no fourth goal, release target or implementation. Existing goal-41/81/82 and
edd-56/80/81 are reused unchanged. Source/package metadata stays 0.6.0.

## Human-readable run record

All entries are UTC on 2026-10-02. Tool receipts and retained cloud logs support
the concise observations below; /tmp logs alone are not durable backups.

| Stage | Observation / outcome |
| --- | --- |
| Startup | Selected saved environment initially starting; ready after27 s. No Mac fallback. |
| Checkout discovery | Actual mdkg identified by Git remote; clean work branch/base agreed with advertised remote main. |
| Rules | Read AGENTS, AGENT_START, SOUL/COLLABORATION/HUMAN, graph conventions/release guidance and relevant native planning/ownership/verification skills; release skill inspected for boundaries, not invoked. |
| Version audit | package.json/lock and public npm latest 0.6.0; engine range verified. GitHub releases list empty via connected read; fetched tags stop at v0.3.9. Targets remain provisional. |
| Setup retry1 | Shell gh releases read returned Forbidden; connected GitHub read succeeded. No credential inspection or bypass. |
| Setup retry2 | npm default cache path failed ENOENT under unwritable/missing home cache. Repeated read/bootstrap with isolated /tmp cache succeeded. |
| Build | Supported dependency bootstrap and source build passed; build output CLI reports0.6.0. |
| Baseline | Graph validates with0 errors and one stale-cache warning; canonical 8 skills validate with0 errors/warnings. |
| Synthetic init retry | First owned disposable init outside a Git repo failed its Git observation. Initialized that synthetic fixture as a Git repo; fresh/repeated init and upgrade preview then passed. |
| Artifact audit | Fresh/repeat path inventory94 files; root .gitignore/.npmignore/AGENTS/CLAUDE; startup guidance under .mdkg. Upgrade preview80 unchanged,0 writes/conflicts. Equal inventory alone does not prove byte idempotency. |
| Planning |30 new graph nodes allocated through source CLI; one writer. Two early authoring invocations overlapped and the supported lock serialized them; the remaining allocation batch was strictly sequential. |
| Review correction1 | Initial graph validation failed9 scope_refs type checks: checkpoints are unsupported goal scope types. Removed checkpoints from executable scope_refs; linked as context/dependencies. No source change. |
| Review correction2 |125 recommended-heading warnings were caused by custom body headings; aligned new nodes with supported templates. Rerun validates with0 errors and only the original stale-cache warning. |
| Review correction3 | Historical EDD wording suggested skill audit/prune CLI commands. Current help/source shows only skill sync with internal audit/pruning. Rejected audit attempts had no effects; corrected new plan, then direct byte parity and supported skill validation passed. |
| Current behavior controls | Synthetic graph-only/init invalid-combination/custom-instruction repeat and extra mirror destination controls passed; canonical 8 skills match both native mirrors. These are current 0.6.0 audit checks, not future0.7 acceptance. |
| Parent intervention | Parent requested a concrete setup checkpoint; reported exact checkout/base/worktree/branch, usable toolchain and no setup blocker, then continued. No new authority or scope change. |
| Automated checks | Fast CI failed its coverage/test gate after342021ms: reported1380passes/1008failures/2389total (one count unclassified). Lines79.87%, branches75.19%, functions87.11% fell below89/77/96 floors. Root causes remain undiagnosed; later gates and13smokes were not run. Future feature cases remain NOT_RUN. |
| Review correction4 | Documentation was edited/staged while CI ran, invalidating its custody boundary. No source, lockfile, main, HEAD or selection change occurred. Repeat the appropriate run only after freezing all proposed inputs; no complete CI/readiness claim. |
| Requested progress boundary | Parent asked to finish this turn with partial concrete evidence and continue the same task afterward. Work preserved:32staged paths, no commit/push/PR. CI finished with a failed coverage/test gate; /tmp/mdkg-cloud-fast-ci/run-O3tYBJ retains failure evidence. |
| Draft PR | NOT_CREATED; commit/push and connected draft creation remain. Final URL/head/remote-base verification will be recorded after success. |

## Check selection and interpretation

Changed surfaces are graph Markdown/design requirements plus this experiment log
and compact JSON evidence. Existing source, dependency contracts, skills/mirrors,
init assets, command snapshots and release metadata stay unchanged. Selected
checks cover graph references/types and uniqueness, goal sequencing/identity,
known skills/seed/mirror constraints, path/link scope, whitespace and the existing
manifest-backed fast CI ladder. That ladder includes ordinary test/coverage,
CLI/docs, graph/security gates and its13 smokes; record actual outcome, including
any failed or unrun gates, rather than assuming the complete ladder passed.

This is draft planning evidence, not a feature acceptance, pre-merge-complete or
prepublication-complete assertion. Full repository/platform qualification and
exact installed future candidates belong to the planned prepublication tasks.
The current fast CI does not qualify full Linux portable behavior. The full
workflow has an explicit failing test-487 Linux installed-artifact stub under
epic-257. Local0.6.0 qualification records and hosted gaps are distinct. goal-87
and bug-46/bug-47 remain deferred/unresolved. No full hosted dispatch is run here.

## Remaining review decisions

Nick reviews root compatibility/migration and custom managed sections; working
directory/CLI/schema, retention interval and selected persistence; graph selector
grammar/private registry and isolated mirror ownership. Synthetic-only tests
must prove private siblings remain unopened/unwritten/unpublished by default.
Cloud saved-workspace storage has not been proven to survive deletion/host loss.

Before implementation/integration, recheck remote main and version targets,
reconcile unknown unpublished Mac and concurrent branch changes, and reinstate
original implementation/git-gud gates. Alias collisions require the existing
reviewed reconciliation contract. Publication and professional adoption require
Nick's explicit approval after reviewed local validation.

## Diagnosis, continuation and observed resources

Nick/parent instructed continuation on the same preserved candidate, diagnosis
before expensive reruns, same-base comparison, frozen checks, and draft creation
with any verified remaining CI gaps. They also requested read-only resource and
continuity evidence. No feature source fixes or coverage changes were authorized.

The first candidate freeze (32 files) was
`e0b1cef909969125642a389dc7f08cb0e1b4b7c257eb4541ee372cacf2351b97`.
Those bytes remained unchanged during diagnosis and static/focused checks. A
pristine detached diagnostic worktree at /workspace/mdkg-cloud-baseline uses the
same exact base, toolchain and lockfile bootstrap. Source, scripts, tests and
init assets are byte-identical between candidate/base; original /workspace/mdkg
stays clean. No Mac or unrelated repository content was accessed.

The retained structured reporter resolves the first run's counts precisely:
2389 tests,1380passed,1008failed,1skipped. The original reporter printed names
without failure stacks, so representative TAP reruns supplied actual causes:

- Non-Git fixtures under /tmp see an invalid /tmp/.git ancestor marker. The
  source naturalGitContext regards it as Git context; Git rev-parse exits128,
  causing assertNoGitMetadataDestinations/mirror validation and init refusal.
  Agent workflow validation fails identically on candidate and pristine base.
  A clean permitted /dev/shm fixture root makes the same base test pass. The
  environment marker was left intact; no Git command or safety check was faked.
- Process supervision retains a fixture because an orphaned terminated
  descendant becomes a zombie owned by PID1. The actual observed group contained
  a Z-state process. The timeout-cleanup case fails on pristine base as well.
  A temporary Linux PR_SET_CHILD_SUBREAPER runner reaps only its own descendants
  and preserves the real command exit status; the same test passes. No project
  source, test assertions, safety rules or coverage floors were changed.
- An attempted /var/tmp alternative was read-only. The authorized extra
  filesystem grant for /dev/shm/mdkg-cloud-fixtures worked; create the owned root
  for each command. This temporary mount is not a persistence guarantee.

With those two runner corrections, all149selected cases in nine affected
families passed on both candidate and pristine base (184817ms/183965ms): Agent
workflow types, archive ownership, init identity, Git helper observations, public
skill projection, harness guidance, test-CI audit template, fixture supervision
and Git supervision. Each wrapper reaped38owned descendants. These are current
0.6.0 regression controls; the three planned future feature tests remain NOT_RUN.
The first full run is retained as failed/invalidated, not rewritten as passing.

Further docs review removed checkpoint parents and EDD goal-relates edges that
current compatibility scope traversal interpreted as unsupported executable
nodes. Goal prerequisites are enforced on each first task and subsequent chain;
checkpoints/design stay in context/refs. This is a docs-only constraint correction.
Final candidate checks must bind the subsequent reviewed freeze.

| Resource | Read-only observation on2026-10-02 |
| --- | --- |
| OS/kernel | Debian13.6, x86_64, Linux6.18.44 |
| CPU |5logical/affinity-visible CPUs; cpuset0-4; cpu.max400000/100000 equals4CPU quota |
| Memory | OS-visible17.6GiB; cgroup limit16GiB; current usage about4.8GiB at capture |
| Workspace | About31.5GiB capacity,28.3GiB free at capture |
| Temporary mounts | /tmp and /dev/shm about8.8GiB each; /tmp6.2GiB free at capture; ephemeral fixture mount starts empty per command |
| Runtimes | Node24.19.0/npm11.9.0/Git2.52.0/Python3.12.14; TypeScript installed from lockfile |
| Browser/test tools | Chromium151.0.7922.173; Python Playwright1.62.0; Node Playwright resolvable from environment; no browser E2E executed |

These observed resources are not guaranteed plan capacity, reserved physical
hardware or a performance SLA. Docker/unshare executables are present, but their
usable service/privilege capabilities were not exercised. No credentials were
enumerated. Files/checkouts and setup remained available across the turn boundary;
that proves current continuity, not VM replacement/restart durability or process
lifetime. Setup commands/lockfiles are reusable configuration. Committed PR
content is Git-persisted after push; uncommitted files, installed tools, generated
caches, /tmp logs and running processes have different unverified lifecycle
boundaries. No restart, migration or durability experiment was requested/run.
