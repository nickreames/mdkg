# Goal88 qualification continuation

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
