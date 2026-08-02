---
id: mdkg-demo3-closeout-prep-001
type: proposal
title: Prepare the Demo 3 durability closeout execution plan
version: 0.1.0
target_id: ai_native_sdlc_demo:goal-7
proposal_status: accepted
proposal_kind: work_update
tags: [demo-3, durability, closeout, private, planning]
owners: [omni-mdkg-agent]
links: []
artifacts: []
relates: [ai_native_sdlc_demo:goal-7]
refs: [ai_native_sdlc_demo:goal-7]
evidence_refs: []
aliases: []
created: 2026-07-31
updated: 2026-08-02
---
# Summary

Prepare, but do not execute, a bounded mdkg-only durability closeout for Demo 3.
The future closeout must make the established Goal 7 outcome successor-independent
without changing the already published Demo 3, inventing missing evidence, or
absorbing unrelated local or remote history.

Preparation result: `NOT_READY`. The plan is executable, but closeout remains
blocked on Nick accepting the bounded `chk-4` loss exception, assigning custody
for the pre-existing 42-path dirty baseline, selecting a history-integration
strategy, and granting a new scoped writer lease plus the applicable edit,
lifecycle, generated-state, commit, and push authorities.

## Goal, context, boundaries, done when, and evidence

- Goal: make exact recovery, loss handling, graph reconciliation, validation,
  and Git persistence steps explicit for a later authorized writer pass.
- Context: local Goal 7 is achieved, while the child/control/public snapshots,
  epic state, selection state, missing child closure files, generated surfaces,
  and divergent Git history do not yet form one coherent shared-reachable record.
- Owner: mdkg owns the generic Git-native project-memory closeout. The public
  Demo 3, canonical site copy, Git host, and deployment providers are consumers
  or evidence surfaces only.
- Forbidden now: every pre-existing dirty path, child/program/epic lifecycle or
  selection state, source and site copy, bundle and artifact bodies, indexes and
  projections, Git staging/history/remotes, provider/deployment/public-route
  inspection, and release/publication operations.
- Done when for the later closeout: the approved evidence recovery or accepted
  loss exception is durable; child/program/epic/selection state is reconciled or
  explicitly bounded; validation passes; only approved paths are staged; a
  separately approved commit becomes shared-reachable; and every writer lease is
  released.
- Evidence basis: current local files and hashes, cached Git refs and objects,
  root/program/child mdkg state, private bundle and root closeout events, and the
  original archived rollout for task `019f9c61-e01c-7800-9a0e-3a029821c378`.

## Authority used for this preparation

One root-private proposal, its automatic root event, and one transient project
DB writer lease were authorized. No existing Demo 3 path, lifecycle state,
selection, source, public content, bundle, index, cache, artifact body, Git index,
history, remote, provider, or deployment was changed.

# Evidence

## Frozen repository baseline

- Repository: `/Users/nick/omni-chat-rooms/projects/mdkg`
- Branch and HEAD: `main` at `0f1b98879da7ac44eded3d34645d022bbcc8b79f`
- Cached upstream: `origin/main` at
  `3955a769a439a415e4b86a0df1373009fcc95fed`
- Divergence: 4 behind and 18 ahead; merge base
  `f6af6410cf03ae222c4ee102844a678373b35d93`
- Dirty baseline: 42 paths, comprising 22 tracked modifications, 20 untracked
  files, and 0 staged files.
- Content-aware dirty-manifest SHA-256:
  `699751bfb4e7e04e356e0a53e6a0b032b91a01b8371e1d89b514ce05a48c39bd`
- Combined baseline SHA-256:
  `82a7287b9c65f342c95d35bb6a45cb154efb360598fc7b57187a8a75a2f0444e`
- Root generated index SHA-256:
  `71e3959c6a057360d1e843a2cb04f901d85f60749a1f951c7f472fe457ecf13f`
- Runtime/state DB pre-lease SHA-256:
  `b1d06d3b973ca329e621294d5fd5bd5ac7c461d751b0ac7c248d213f30ce71ad`
  and `22d30967b8b85c69e747baa9d663318b963adbbb6db1d96aa6d37521a9ea2a7f`.
- Locks/claims/queues: no Git or mdkg lock file, no active project DB writer
  lease, and no project queue or queue message existed at acquisition time.
- Worktrees: the canonical checkout plus a prunable registration for missing
  `/private/tmp/mdkg-demo3-preparation-20260728` at cached public SHA
  `3955a769...`; the missing worktree is evidence of loss, not a recovery source.
- Stash: none.

### Path-level custody inventory

Custody codes:

- `R-BUNDLE`: pre-existing root-owned private Demo 3 projection; preserve
  byte-for-byte now; rebuild only after graph acceptance under separate authority.
- `R-INDEX`: pre-existing generated root index of unresolved custody; preserve
  byte-for-byte; never stage it implicitly.
- `P-INDEX`: pre-existing generated program projection; preserve now; regenerate
  only from accepted source state under an explicit generated-state gate.
- `P-GRAPH`: pre-existing program graph/event state owned by the Demo 3
  predecessor closeout; preserve now; later edit only on an approved allowlist.
- `P-EVIDENCE`: pre-existing untracked Demo 3 checkpoint/receipt/screenshot
  evidence; preserve byte-for-byte and classify explicitly before staging.

| Status | Custody | Bytes | SHA-256 | Path |
|---|---|---:|---|---|
| M | R-BUNDLE | 480206 | `242189da1b0613b82074433a2aeed58a2ddc9868ede84c349d7c04e68e23b38c` | `.mdkg/bundles/private/presentations/ai-native-sdlc-demo.mdkg.zip` |
| M | R-INDEX | 4247552 | `71e3959c6a057360d1e843a2cb04f901d85f60749a1f951c7f472fe457ecf13f` | `.mdkg/index/mdkg.sqlite` |
| M | P-INDEX | 49089 | `d6e88c7a851e7fbadf024fe1f9197cb369405619f0156fdb04e237b6843fabe6` | `presentations/ai-native-sdlc-demo/.mdkg/index/capabilities.json` |
| M | P-INDEX | 333126 | `bb69bb07cd1950c305a15385043834dbd9ee37930040bf24e08ed1b171ca9203` | `presentations/ai-native-sdlc-demo/.mdkg/index/global.json` |
| M | P-INDEX | 569344 | `58c008c9e4c0a63c2683e134ad33ba25270e32a8ec610e55f958d438931664cd` | `presentations/ai-native-sdlc-demo/.mdkg/index/mdkg.sqlite` |
| M | P-INDEX | 7903 | `25bb654d86814521ca6c7ed8a0bc6b913f10e085aca483f1150e121197ccbf5a` | `presentations/ai-native-sdlc-demo/.mdkg/index/skills.json` |
| M | P-INDEX | 329 | `b26321685e5bd487ac3d210b961237f3b1660416680ab7e1930eb17c17430ffb` | `presentations/ai-native-sdlc-demo/.mdkg/index/subgraphs.json` |
| M | P-GRAPH | 2558 | `2339d5351059fd8a0b809e264395df80ce6363de5d9b98ab1c8c6902436cb79b` | `presentations/ai-native-sdlc-demo/.mdkg/work/epic-7-live-demo-3-execution-and-reveal.md` |
| M | P-GRAPH | 113424 | `24bf3eac847ee8552a28514b0511fea1c75b0f2c245e0c1c6f5f7d478a582f35` | `presentations/ai-native-sdlc-demo/.mdkg/work/events/events.jsonl` |
| M | P-GRAPH | 16240 | `dedc1ece48380458f32ae13e5bfa0da9d4ddc1d490234e463dd5f08145d982ae` | `presentations/ai-native-sdlc-demo/.mdkg/work/goal-7-execute-and-reveal-the-live-demo-3-goal.md` |
| M | P-GRAPH | 7396 | `cee57cd1b6c26fa7d367d051685539193e5a66e7ee81b21c536d11379420e09a` | `presentations/ai-native-sdlc-demo/.mdkg/work/task-34-kick-off-the-specialized-demo-3-child-goal.md` |
| M | P-GRAPH | 2967 | `bb38efddde3b0001bd80288cb9df98b20cbd7b4078b81a4f9414fabea0d966b0` | `presentations/ai-native-sdlc-demo/.mdkg/work/task-35-mirror-demo-3-integration-evidence-into-the-umbrella-goal.md` |
| M | P-GRAPH | 3123 | `91040ac761e0076b93bf8db97aceae817104ee173e9cda557b429512dad3f339` | `presentations/ai-native-sdlc-demo/.mdkg/work/task-36-review-canonical-site-and-public-safety-validation-evidence.md` |
| M | P-GRAPH | 3501 | `103a22699dbea03123694c1c764b431aa7493276bb88d50b3941c3248a979553` | `presentations/ai-native-sdlc-demo/.mdkg/work/task-37-review-demo-3-commit-and-non-force-push-evidence.md` |
| M | P-GRAPH | 3169 | `e4ed3c2b900a0a65d226db0e1ff299154807dd88ed27119d44b970c92a6af3d8` | `presentations/ai-native-sdlc-demo/.mdkg/work/task-38-independently-verify-exact-sha-ready-production-deployment-evidence.md` |
| M | P-GRAPH | 3624 | `a4ff9829c67f82885fc06dcd4e8187de824508252e749d17ba82ba096f31c39f` | `presentations/ai-native-sdlc-demo/.mdkg/work/task-39-independently-verify-demo-3-live-detail-and-output-route-evidence.md` |
| M | P-GRAPH | 4378 | `50caabe9e165e691359820efc13e9b0eb3d53ad5aae840e5357710d5e9910ba3` | `presentations/ai-native-sdlc-demo/.mdkg/work/task-40-refresh-the-program-bundle-and-prepare-the-reveal-receipt.md` |
| M | P-GRAPH | 9486 | `ecd550f6d4292b7b1b4c0a2465d2b10d3911859d8759e402ea4e6cf0aa0dd92d` | `presentations/ai-native-sdlc-demo/.mdkg/work/task-58-publish-the-demo-3-preparation-baseline-and-activate-timed-authority.md` |
| M | P-GRAPH | 2483 | `32909561e21d188b225464fcb077387b6c00384156c23f0da317294a81d35f77` | `presentations/ai-native-sdlc-demo/.mdkg/work/test-18-verify-the-demo-3-child-goal-is-achieved-with-complete-evidence.md` |
| M | P-GRAPH | 2666 | `e1d273bab73ab717d5228c4ee72c6fb84e4a51b251b5fd8202af013af8c5fef3` | `presentations/ai-native-sdlc-demo/.mdkg/work/test-19-verify-canonical-site-build-routes-claims-accessibility-and-zero-javascript.md` |
| M | P-GRAPH | 2747 | `75b1b1437099b175dd134ece8f903783af8b6221a268058971d39a24c3f2e5b7` | `presentations/ai-native-sdlc-demo/.mdkg/work/test-20-verify-exact-sha-production-and-live-url-evidence.md` |
| M | P-GRAPH | 2660 | `2193c424b50ebe4c98dbe6e84c5d9fc2737ae04a4aba8ecc741715a06e712b21` | `presentations/ai-native-sdlc-demo/.mdkg/work/test-21-verify-hard-blocker-handling-fallback-honesty-and-public-receipt.md` |
| ?? | P-EVIDENCE | 5355 | `83c968cb6a4833ed1f90dd84d497cdce90ee14c5a22a90d051ddd1706b8951d6` | `presentations/ai-native-sdlc-demo/.mdkg/work/chk-25-goal-7-clean-publication-worktree-execution-contract-accepted.md` |
| ?? | P-EVIDENCE | 2022 | `d15b2937269a2e2c0297bca3a4bf7a1f916e8cf17edc0aeb4bbab57a1a173228` | `presentations/ai-native-sdlc-demo/.mdkg/work/chk-26-demo-3-preparation-baseline-and-timed-authority-activated.md` |
| ?? | P-EVIDENCE | 1942 | `b586f1dc51fc54cc990220432f966e2614f1ebe96b92dc881f9d4e4616e27667` | `presentations/ai-native-sdlc-demo/.mdkg/work/chk-27-demo-3-reveal-gate-passed.md` |
| ?? | P-EVIDENCE | 2062 | `d0fbf88a1cb3ac55fac6758a263c257e1a450d1b861ce621b754feb82566386c` | `presentations/ai-native-sdlc-demo/.mdkg/work/chk-28-demo-3-dress-rehearsal-achieved-and-public-evidence-sealed.md` |
| ?? | P-EVIDENCE | 1916 | `9fb43bae443c65ebd920c2f1692a44c3c9719d6e5a4da9cc5a1abda8294dae46` | `presentations/ai-native-sdlc-demo/artifacts/demo-003/dispatch-receipt.json` |
| ?? | P-EVIDENCE | 2271 | `f3509540a0e45ca11a24ff381de46103a9e93279c717d02cf733344c88c50da6` | `presentations/ai-native-sdlc-demo/artifacts/demo-003/event-authority-activation.json` |
| ?? | P-EVIDENCE | 2729 | `9183bdd1803afa5e83429909c191abd553bde16b0c5a2f7ac35c61c40c890930` | `presentations/ai-native-sdlc-demo/artifacts/demo-003/preparation-baseline-publication.json` |
| ?? | P-EVIDENCE | 1101 | `36a675284dba03ed646ee5fe95e32642f0362123641637c954b647d10d179dcf` | `presentations/ai-native-sdlc-demo/artifacts/demo-003/program-bundle-receipt.json` |
| ?? | P-EVIDENCE | 2503 | `28b4f6bbaec1c13b68df89c7adf66d4c2c770b545e678406d33f82afde7e9cf6` | `presentations/ai-native-sdlc-demo/artifacts/demo-003/rehearsal-outcome-receipt.json` |
| ?? | P-EVIDENCE | 2118 | `264680b4eb3eb65c3ee0eb3441da3e780ad761deb0a5bea69dd9214bc1a971a8` | `presentations/ai-native-sdlc-demo/artifacts/demo-003/reveal-gate-receipt.json` |
| ?? | P-EVIDENCE | 495 | `b117a1793ba75b7bd91dbdeb75109f9121be31f401e1728955efae54fc7eead5` | `presentations/ai-native-sdlc-demo/artifacts/demo-003/reveal-gate-verification.json` |
| ?? | P-EVIDENCE | 85525 | `05c006ff4b630b563cefd295c7ff6d5716085697cf0b0cf02536771052139513` | `presentations/ai-native-sdlc-demo/artifacts/demo-003/screenshots/detail-desktop.png` |
| ?? | P-EVIDENCE | 37776 | `db57857faeb37bc440b42b727d3f5bef7c352a2738695de60075a10ee3faf085` | `presentations/ai-native-sdlc-demo/artifacts/demo-003/screenshots/detail-mobile.png` |
| ?? | P-EVIDENCE | 82213 | `84f3780a28042cbcaa7e734f3385a2f7d1b07fb09ffc5161336871480ac9e176` | `presentations/ai-native-sdlc-demo/artifacts/demo-003/screenshots/output-desktop.png` |
| ?? | P-EVIDENCE | 39344 | `3274594c8e263017f89293a9310270ac7046374288af51aa9df30406f7f765d8` | `presentations/ai-native-sdlc-demo/artifacts/demo-003/screenshots/output-mobile.png` |
| ?? | P-EVIDENCE | 1267 | `9a0f7de288e0901b9e0d7f0e52551b7f635b371bc4e92f936858c19997562fae` | `presentations/ai-native-sdlc-demo/artifacts/demo-003/timing-ledger.json` |
| ?? | P-EVIDENCE | 815 | `9fcb4ecdb6524629596b9216886c33cb60fdf9bf52bf29614e89d34084527564` | `presentations/ai-native-sdlc-demo/artifacts/demo-003/umbrella/canonical-site-test-receipt.json` |
| ?? | P-EVIDENCE | 981 | `cb5e6924195374d47984afcd651e1e7f3f5c49ecd9416ee8222049f5bd0f7da5` | `presentations/ai-native-sdlc-demo/artifacts/demo-003/umbrella/commit-push-receipt.json` |
| ?? | P-EVIDENCE | 755 | `81af93c55dfbb6affecae117d0f08eaa04386299e2a0f5ce751d60ad062da607` | `presentations/ai-native-sdlc-demo/artifacts/demo-003/umbrella/deployment-receipt.json` |
| ?? | P-EVIDENCE | 1652 | `1d1a48ff9ecb60f531b347804087c633e988be76cf814a099a5b57aa0a1b2b10` | `presentations/ai-native-sdlc-demo/artifacts/demo-003/umbrella/live-route-receipt.json` |

## Established outcome and state drift

- Program Goal 7 is `done` / `achieved`, with `task-40` as its last active
  node and `chk-28` as the final local checkpoint.
- The local evidence records Demo 3 selected at T+11:53, two prepublication
  repairs, zero production repairs, one normal non-force publication at exact
  SHA `3955a769a439a415e4b86a0df1373009fcc95fed`, both named deployments READY
  for that SHA, and both routes HTTP 200/noindex at the historical verification
  time. These are historical receipt facts in this preparation, not fresh
  provider or public-route verification.
- The final private bundle records bundle hash
  `5a3e2ef0960cec4138812288aec3bb6e3069b3de26fb12acc52360a6477a537c`
  and ZIP SHA-256
  `242189da1b0613b82074433a2aeed58a2ddc9868ede84c349d7c04e68e23b38c`.
  It is now stale relative to later working-tree state and must not be rebuilt
  during preparation.
- Program `epic-7` remains `backlog` despite achieved Goal 7. The program has
  no selected goal. The control child still selects `goal-1` as active at
  `spike-1`; cached public commit `3955a769...` progressed further but stops
  before the final child checkpoint/receipt closure. The public detail snapshot
  is intermediate.
- `chk-27` prose names T+14:33, while primary timing/outcome receipts select
  Demo 3 at T+11:53. Preserve T+11:53 as the outcome; treat the checkpoint prose
  as a secondary discrepancy requiring explicit reconciliation.
- Nick manually observed the public Demo 3 landing page reachable. This is an
  unverified Nick observation only, not provider, deployment, or fresh
  public-route proof.

## Missing child evidence assessment

Original rollout source:
`/Users/nick/.codex/archived_sessions/rollout-2026-07-25T21-04-47-019f9c61-e01c-7800-9a0e-3a029821c378.jsonl`.

| Missing path | Assessment | Exact evidence locator | Required future treatment |
|---|---|---|---|
| `presentations/ai-native-sdlc-demo/runs/demo-003/artifacts/publication-receipt.json` | Exact body recoverable | Patch call `call_cfa6FEPqXtcGRkSmBdxo0RAe` at `2026-07-28T14:15:57.378Z`; recorded hash `86dc9e044c2addc0d1d2d7f66787a70e2012b9752d9d1cdcb88625341f2705ff` | Extract the literal patch payload from that original JSONL, write it only under future child-evidence authority, and require an exact hash match. |
| `presentations/ai-native-sdlc-demo/runs/demo-003/artifacts/live-verification-receipt.json` | Exact body recoverable | Patch call `call_MkAo7XJ2nKvtNb22XoTa9TQ8` at `2026-07-28T14:17:09.600Z`; recorded hash output `call_8sbuUksUbQIaNFrFHoMIzETI`; expected `9e433dcd226570a329fd5377bdef6ce8c452d0376fb195039de7846a06efc2d0` | Extract the literal patch payload from that original JSONL, write it only under future child-evidence authority, and require an exact hash match. |
| `presentations/ai-native-sdlc-demo/runs/demo-003/.mdkg/work/chk-4-demo-3-exact-sha-public-result-accepted.md` | Exact body not recovered | Creation command/output `call_V1mfivsA7Eoo9Pii90IL0csz`; hash output `call_pDYzPHco9qqKqQmgB50EkxNh`; expected `68cbb8b49dadf08a749c67acb24edd6f92f63ff815e7ac0f7c5008099e4acb18` | Do not regenerate or infer the body. Continue only with exact bytes from original evidence, or—after Nick accepts—record the bounded loss exception below. |

The current filesystem, cached public commit, reachable/reflog/unreachable Git
objects, current private bundle, and full original rollout were searched. The
two JSON bodies survive literally in patch calls. No literal or base64 copy of
the `chk-4` body was found; only its creation command, identity, title, and hash
survive. A body generated from current templates or command replay would be a
synthesis and is prohibited even if it appears plausible.

# Proposed Change

## Required Nick decisions before a future closeout

1. Accept or reject the bounded `chk-4` loss-exception route. If rejected, the
   closeout stays blocked until exact original bytes are found.
2. Assign explicit custody and an allowlist for all 42 frozen baseline paths;
   generated paths must be distinguished from authored evidence.
3. Choose history integration. The preferred bounded route is a fresh isolated
   worktree/branch from a freshly authorized shared base, carrying only approved
   Demo 3 closure paths. Do not merge, rebase, reset, or push the current
   18-ahead/4-behind `main` implicitly.
4. Grant separate future gates as needed: writer lease; child/program mdkg edits;
   lifecycle and selection; generated index/bundle/subgraph refresh; staging;
   local commit; remote read/fetch; push. Public-copy, provider, deployment,
   release, tag, publication, and history-rewrite authority remain excluded
   unless separately and explicitly granted.

## Bounded `chk-4` loss exception

If Nick accepts loss handling after one fresh original-evidence search, create
exactly one durable record at:

`presentations/ai-native-sdlc-demo/artifacts/demo-003/child-closure-loss-exception.json`

It must record:

- missing path, `root:chk-4`, title, creation call, expected hash
  `68cbb8b49dadf08a749c67acb24edd6f92f63ff815e7ac0f7c5008099e4acb18`,
  and the failed search corpus;
- the two exactly recoverable receipt paths and verified hashes;
- corroborating Goal 7, `chk-28`, rehearsal, umbrella commit/push, deployment,
  and live-route evidence by path and hash;
- the distinction between historical provider/public proof and current proof;
- an explicit statement that the original `chk-4` bytes were not recovered,
  were not synthesized, and are not represented by the exception;
- Nick's acceptance identifier/date and the remaining uncertainty.

Do not create a substitute `chk-4` file. The exception accounts for loss; it
does not impersonate exact recovery.

## Future execution sequence

1. Re-read startup policy; freeze branch, HEAD, cached/freshly authorized
   upstream, divergence, worktrees, locks, queues, selections, graph states, and
   a content hash for every approved dirty path. Stop on movement or collision.
2. Acquire one new scoped lease bound to that snapshot. Do not reuse the
   preparation lease.
3. Apply Nick's path-custody decision. Preserve all baseline bytes until each
   path is explicitly classified as authored evidence, generated projection,
   superseded state, or excluded unrelated work.
4. Extract the two JSON receipt bodies literally from the original rollout call
   payloads. Write only the two exact child paths and verify the expected hashes
   before any graph update.
5. Search once more for exact `chk-4` bytes. If absent, stop unless Nick accepted
   the precise loss exception; then create only the exception described above.
6. Reconcile the child graph from original execution evidence rather than by
   blending control and cached-public snapshots. Update goal/task/test/event
   state and clear stale child selection only under explicit lifecycle and
   selection authority. Never claim an exact `chk-4` body when using the loss
   exception.
7. Reconcile program `epic-7` with achieved Goal 7 and resolve the T+11:53 versus
   T+14:33 discrepancy in durable prose/evidence. Preserve `chk-25..28` and the
   established final outcome unless exact source evidence disproves a field.
8. Record the intermediate public detail snapshot as a separate public-copy
   follow-up. Do not change site data or public copy in the mdkg closeout.
9. Validate source graphs before any generated refresh. If separately approved,
   regenerate only the enumerated program/child indexes, rebuild the private
   bundle, synchronize its root projection, and verify hashes/freshness. Treat
   every generated diff as reviewable output, never ambient cleanup.
10. Review the exact unstaged diff and compare all untouched baseline hashes.
    Stage only the approved closeout allowlist after separate staging authority.
11. Create one logical local commit only with separate commit authority. Push
    only after a fresh remote check and separate push authority; never force.
12. Release the future lease on success or failure and issue a closeout receipt
    distinguishing local, committed, pushed, deployed, public, and unverified
    states.

## Validation gates for the future closeout

- `mdkg --root presentations/ai-native-sdlc-demo/runs/demo-003 validate --json`
- `mdkg --root presentations/ai-native-sdlc-demo validate --json`
- root `mdkg validate --changed-only --json` plus a scoped show of every new
  record
- exact SHA-256 checks for both recovered JSON bodies and the loss-exception
  evidence matrix
- private bundle verification and root subgraph verification only after an
  authorized rebuild/synchronization
- `git diff --check`, staged-path allowlist review, original-baseline hash
  comparison, branch/upstream/divergence recheck, and zero active leases
- no provider, deployment, domain, public-route, npm, secret, tag, release, or
  publication validation unless separately authorized at action time

## Portability assessment

This proposal is repository-private and Demo 3-specific, but its ownership model
uses existing generic mdkg primitives: content-addressed evidence, explicit loss
exceptions, lifecycle reconciliation, leases, validation, generated-state
separation, and independent Git/publication authority gates. It adds no
Omni-specific policy or public mdkg capability. No loop, skill, schema, source,
or reusable product contract is proposed.

# Review

- Owner: `omni-mdkg-agent` for this preparation record; a later explicitly
  leased mdkg writer for execution.
- Consumer: a future Demo 3 durability closeout and its reviewers.
- Preparation authority: `MDKG-DEMO3-CLOSEOUT-PREP-001` only.
- Public Demo 3: unchanged.
- Skill coverage: `select-work-and-ground-context`,
  `service-boundary-ownership-check`, and `verify-close-and-checkpoint` cover
  the preparation. Existing skills were listed, searched, and shown read-only.
- Skill candidate: none; this one-off Demo 3 recovery is a planning/handoff
  record, not a repeatable generic procedure requiring a new skill.
- Final gate: `NOT_READY` until the four Nick decisions above and a new scoped
  writer lease are present.

## 2026-08-02 authorized disposition

Nick supplied the required custody, loss-exception, writer, lifecycle, local
edit, and one-local-commit decisions through
`MDKG-DEMO3-LOCAL-DURABILITY-CLOSEOUT-001` and its commit amendment. The
preparation-time `NOT_READY` result remains an accurate historical statement;
the proposal is now accepted and executed by the scoped closeout.

The amended `.mdkg`-only commit boundary superseded the proposed non-`.mdkg`
loss-exception path. The durable loss exception is instead a child mdkg receipt,
`receipt.demo3-chk4-loss-exception`. Exact recovered JSON receipts remain
local and uncommitted. Bundle, root index, remote, provider, public-copy,
deployment, tag, release, publication, and history-rewrite gates remain
withheld.
