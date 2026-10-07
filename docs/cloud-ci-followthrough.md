# Cloud CI follow-through — 2026-10-03

Nick authorized tracking exact original heads PR10 eb4daec5, PR11 e788c351 and
PR12 d853df5 to terminal, plus narrowly repairing the interrupted-fixture upload
failure. No Goal89 feature/migration policy, merge, publication or deployment is
authorized. This qualification repair belongs to Goal88; Goal89 inherits it by
normal stack synchronization. PR10's original failed evidence remains intact.

Original terminal outcomes:

| Head / run | Outcome and available classification |
| --- | --- |
| eb4daec5 / 37091088780 | Cancelled: both fast gates cancelled, no ladder receipt. Minimum upload failed on a synthetic newline-path fixture; floating upload passed. |
| e788c351 / 37092989145 | Failure: floating job111117140765 coverage exit1, timed_out=false, duration561440ms for the ladder; 2412pass/1fail/1skip. Minimum job111117140678 cancelled without receipt; uploads passed. |
| d853df5 / 37093406701 | Cancelled: jobs111118344144/111118344253 cancelled without ladder receipts; both uploads passed. |

Four full-tier jobs are expected PR-trigger skips in each run. Cancellation
actor/root cause is not established by timing. The e788 floating stderr reached
the failing complete-test-summary check, after threshold validation in current
coverage-contract control flow: this indicates a failed test rather than a
reported threshold failure. Its failed name is absent from the bounded tail;
the underlying assertion remains unclassified. This inference does not classify
historical c13/0ff failures or create a passing coverage receipt.

## Narrow evidence repair

Keep the existing direct receipts/logs/coverage/raw exports. Exclude only
run-*/tmp/** from direct fast upload and preserve its visible fixture entries in
separate tar.gz snapshots. NUL-separated verbatim relative paths preserve
newlines/colon/quotes without renaming original files. Links are archived as
links, without reading targets; hidden entries retain the original uploader's
include-hidden-files=false policy, verified in the retained hosted step inputs.
Original source trees are never removed. Interrupted snapshots are diagnostics,
not atomic/quiescent-writer or qualification claims. Archive errors or observed
tree changes retain failure; no continue-on-error or acceptance override exists.

Before archiving, print a bounded failed-case summary from the entire admitted
coverage log, with its full hash/bytes and final summary. This can identify
failures outside the earlier tail without transferring a huge V8 archive. Missing,
oversized, linked or changing logs report diagnostic unavailability; they are
never treated as test success. Other full-tier upload paths remain unchanged.

Four synthetic collector cases prove exact unsafe-name roundtrip/source
preservation, independent repeated collection, hidden policy, link-target
preservation, overlapping/dangling-link refusal before effects and bounded
diagnostics before archive work. Existing output/smoke/topology/ladder controls
make77/77 passing on native Linux Node24.19 and24.18. Test compilation and
workflow/docs/plan checks pass. No unrelated root rebuild or new local full-suite
rerun was performed; new exact-head hosted qualification remains separate.

Coverage floors89/77/96, the15minute fast job/ladder budgets,13fast/37package/
46repository smoke definitions and unqualified platform stub are unchanged.
Product source, version0.6.1 and retained package bytes are unchanged. Previous
full/installed proof remains bound to its original qualification inputs.

Historical extracts still needed: logs/coverage.log plus progress.json and
coverage-event/summary if present from artifacts11217680715 and11211594942.
Prior CONNECT proxy403 and32MiB tool limit remain; no archive retry or bypass.
For original e788 failure, the minimal extract is its FAIL line(s) from the
coverage log; further assertion detail may require targeted reproduction.

## Intervention log

- Re-verified exact branch heads/custody and recorded original terminal jobs.
- Reused built runtime; compiled only the changed CI topology tests. Diagnosed
  and retained failures before applying bounded evidence-only correction.
- Kept original hosted logs/receipts and preserved coverage/smoke/time policies.
  Public documentation fetch was unavailable; retained actual uploader inputs
  establish the hidden-file policy used here.
- Normal commits/nonforce pushes and two-parent stack merge preserve history.
  No unrelated repository/Mac data, credentials, production or provider actions.
- Goal89 rationale review corrects the existing migration prerequisite: accepted
  ancestor/history is required when local Git HEAD exists. A fresh graph without
  HEAD may explicitly preview migration without an ancestor or first commit.
  No migration policy or working runtime is implemented.
