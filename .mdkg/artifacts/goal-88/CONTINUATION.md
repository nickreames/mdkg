# Goal88 qualification continuation

## Latest corrected review checkpoint

NOT_READY. Parent requested the two P2 review fixes; both are test-only and now
validated. Read `qualification-4/COMPARISON.md` and `qualification-4/checks.json`
first. Runtime source remains c13c7ad; the retained0.6.1 artifact/package input
identity is unchanged. Corrected qualification identity is
`525f55ac988953a836d5e855d998b15a4a2d65e219e0365475a012d330ff35c6`.

Fresh results: affected45/45 on Node24.19.0, affected26/26 on24.18.0, full
unchanged thresholded suite2403pass/0fail/1skip across185files, exit0 in548470ms.
Coverage92.59/84.27/97.58 exceeds89/77/96. Inputs/head/status/lockfiles/selected
state stayed frozen during the run. Raw coverage is retained in the owned cache;
compressed manifest/event/log plus summary and custody receipt are committed.
No active tests remain. CLI/docs499/0/workflow/security/static readiness passed.

Cloud package36/37 and site8/9 remain separate from the parent's reported local
37/37 package and27 installed passes. Demo is an inherited0600-versus0644 source
seal mismatch; pass5 has the same forbidden quickstart spelling on plan/candidate.
No demo reseal/mode change or public-example fix was made. Exact hostedc13 raw
coverage remains unclassified after native archive transfer failed proxyCONNECT403.
See qualification-3/checks.json for artifact11211594942 and required small extracts.

Next: parent review of this corrected candidate and bounded inherited/unresolved
comparison. Complete required platform/portable-filesystem proof and a passing
full prepublication ladder before readiness or closure. No Goal89 until parent
authorizes continuation after review; no new implementation permission is needed
solely for the already authorized sequence. Goal88/tasks/checkpoints remain open.
No merges or publication. The older receipt below is historical, not current
full-suite status. Read actual HEAD/remotes/PR11 before any further writes.

## Previous installed qualification checkpoint

NOT_READY. Installed Goal88 acceptance passed18cases/51CLIinvocations; all37
package smokes executed,36passed and demo-graph failed. No active tests.

Cloud cwd `/workspace/mdkg-cloud-goal88`, origin `nickreames/mdkg`, branch
`cloud/goal88-minimal-init`, base plan `ddafe0836fdc790cd36ba203afbcfc1878bbddd8`.
Node24.19.0/npm11.9.0, Linux x86_64. Runtime/package source is the independently
reviewedc13c7adba673b0de79ad55e87e0519e54cce5b95 payload. This follow-up fixes
only the installed qualifier's copy argument order and adds receipts/narrative.
Read actual HEAD/remotes/PR11 before continuing; PR10 stays unmerged.

## Current evidence

- `qualification-2/checks.json`: current complete smoke/installed receipt.
- Official0.6.0 cache: `/workspace/mdkg-cloud-goal88-cache/mdkg-0.6.0-published.tgz`,
 545431bytes, SHA256 `b5497c5f5e5f022e19f10c72512cd23d1dfbfa874e79e384112e293df7bff2bc`,
 verified against supplied provenance and metadata SHA512. Download blocker resolved
 with one curl retry through the existing cloud proxy; no executor substitution.
- Current retained0.6.1: `/workspace/mdkg-cloud-goal88-cache/candidate-2/mdkg-0.6.1.tgz`,
 548015bytes, SHA256 `479c2f92ac760e008d4e374aebc57243e3a07520c51b2f7e388353d109f78c9a`,0444.
 Inputs/custody files and all consumption logs are retained. First candidate
 in `/workspace/mdkg-cloud-goal88-cache/candidate` remains superseded/unqualified.
- Canonical package definitions unchanged:37executed in three bounded diagnostic
 groups. This is not a passing coverage-first release ladder.
- One failure: demo-graph source_release_input_drift. The same103semantic rows
 and exact unchanged verifier on candidate and pristine plan base both yield
 `f2b49d2d5d061f15f4145cbdf91d28537a0cf0a844a1e5e908b4b2ac905c2924`,
 failing seal `dfa6461bf076cf003aa0afbcc06928e9214f7e3f8230cf95fafffb306b817fe8`.
 Read `qualification-2/demo-classification.json` and diagnostic source; do not
 silently reseal or waive this required check. Deeper baseline cause unresolved.
- Hosted c13 run36972314303: floating Node24.21.0 coverage failed exit1 after
 876713ms, timed_out=false. Minimum cancelled, full jobs skipped. Underlying
 failures UNCLASSIFIED; raw evidence is in the uploaded482625436-byte artifact.
 Job log is retained. Do not attribute every failure to cloud/PID/tmp causes.

## Next bounded work

1. Verify same executor/checkout/custody, actual remote HEAD and incoming owner
 review. No replacement writer or Mac fallback; stop for real environment denial.
2. Diagnose demo source seal with its owner and coverage with raw failure evidence.
 The demo fix may require a separate owned decision; do not alter unrelated
 examples/presentations or its accepted seal merely to turn a required check green.
3. Plan one bounded full suite/coverage attempt after diagnosis and freeze
 package/harness/graph inputs. Keep floors, timeouts,37package/46repository
 definitions. Use existing release-ladder retained-candidate admission vars and
 supported commands. No npm publish, release tag, merge or deployment.
4. Use clean `/dev/shm/mdkg-goal88-fixtures/...` and the retained Linux subreaper
 `/workspace/mdkg-cloud-goal88-cache/subreaper.py` (SHA256
 `acf0d61ef262e11f3d0313b547cef2efe77c0da97f71148eacf20dcd2fa3f531`).
 /dev/shm is process-local: copy receipt/log/coverage evidence to the owned
 workspace cache from the same shell after the bounded child returns, including
 timeout/failure. Avoid /proc namespace access. Preserve raw failure evidence
 before sandbox exit; do not repeat the earlier cancellation evidence loss.
5. Complete affected site checks, required minimum/local runtime/platform matrix
 and owner review/prepublication acceptance. Source inputs changed since a check
 require requalification. Do not mark Goal88 done or claim READY prematurely.
6. Save useful bounded checkpoints on the same draft PR11 with new head/check
 deltas. Goal89/90 remain on hold until parent independent Goal88 review.

Keep `docs/cloud-goal88-experiment.md` intervention log. Restore only the known
SQLite cache to base bytes before committing. No new IDs/identity migration,
selected-goal changes, event-history recreation, merges or publication.
