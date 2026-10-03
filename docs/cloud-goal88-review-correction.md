# Goal88 stack review correction — 2026-10-03

This correction inherits PR10's opt-in readiness dependency safety and preserves
Goal88's 0.6.1 scope. PR10 remains unmerged; this branch uses a normal merge,
not rewritten history. Original reviewed Goal88 head was
`1a3cf4f45621cd67b51aba482966927aeea17419`; corrected plan head is
`eb4daec5bc95c20bacddeb83f0b6eb7f95f0c1c8`. Synchronization merge
`242a2e081168e4f3f5bc63650b28ba0a874e7d4c` has those two parents. Its only
content conflict was Chk674's appended narratives; both historical qualification
and enforced readiness sections were preserved. Chk674 is blocked/NOT_READY.

## Bounded changes and validation

The inherited pass5 failure was a public quickstart spelling mismatch. Both
quickstart sources now use `--profile concise` and still document `--pack-profile`
as its equivalent alias; traversal/size semantics are unchanged. The original
pass5 assertion is untouched and passes against built site/docs output. The
complete first coverage run exposed one introduced stale bootstrap-doc assertion
that required the previous spelling. Ordinary targeted reproduction confirmed
it, then the assertion was corrected to require the canonical spelling, alias
and unchanged limits. This is recorded as an introduced-and-corrected test
failure, not an environmental failure.

The release ladder now includes bounded UTF8 terminal stdout/stderr excerpts and
full-stream hashes when a gate fails. It retains exact status/signal/error,
original full logs and existing acceptance/throw behavior. The excerpt is not
a complete failed-case list and cannot report after external process termination.
No coverage floors, timeouts, smoke definitions or workflow are weakened.

Current focused checks pass 81/81 on Node24.19.0 and24.18.0. Build/test compile,
docs499 examples, CLI parity/contract, workflow drift, security, eight skills and
graph validation pass; graph keeps one original stale-cache warning. Full
coverage results and frozen custody are in the accompanying receipt. Failed
attempt1 (2412pass/1fail/1skip) remains intact. No old qualification is rebound.

The corrected built 0.6.1 snapshot was packed into a fresh owned cache after
build/security/static readiness checks, with `--ignore-scripts` to avoid a rebuild
during frozen coverage. This is a retained package snapshot, not publication or
a full prepublish-ladder pass. Its SHA and current exact-installed controls are
recorded separately; the older tarball remains historical. Full 37 package,
46 repository definitions, required platform/portable filesystem, independent
owner review and actual complete prepublication ladder remain required.

## Hosted diagnosis and remaining blockers

Original design-only PR12 run36983980287 at0ff7095 ended failure. Minimum job
110764673629 (Node24.18.0) printed ladder ok=true: all9gates/13smokes exit0,
coverage2403pass/0fail/1skip,92.66/84.42/97.58 above89/77/96,894950ms. Its
terminal job state was cancelled, so that printed receipt is not terminal success.
Floating job110764673778 (Node24.21.0) failed coverage with exit1 in761515ms,
timed_out=false; later gates/smokes did not run. Its underlying assertion failures
are absent from the console and remain UNCLASSIFIED.

Corrected planning run37091088780 at eb4daec5 ended cancelled. Both fast gates
were cancelled with no printed ladder receipt. Minimum evidence upload failed
on an invalid newline-containing synthetic git-boundary fixture filename left
under the collection root. Floating upload succeeded. Cancellation actor/root
cause is not established by near-budget timing or that subsequent upload error.
Full jobs are expected PR-trigger skips, not platform passes.

Historical c13 coverage artifact11211594942 and 0ff floating artifact11217680715
are roughly483MB. Prior CONNECT proxy403 plus32MiB tool limit prevented transfer;
this turn made no archive retry or bypass. Requested small logs/coverage.log,
progress and coverage event/summary extracts remain pending. The new excerpt
improves future terminal diagnostics; it does not classify historical failures.

The inherited demo fixture mode-seal failure remains recorded. Parent-reported
Mac/local proofs remain separate from native cloud execution and do not qualify
new bytes automatically. Goal87/hosted full portable-filesystem gaps remain open.
Release is **NOT_READY**. No goal, release checkpoint or approval is completed.

## Intervention log

- Verified cloud remotes and original branch heads before edits; original
  `/workspace/mdkg` work/main snapshot stays untouched. Native Linux x86_64,
  Node24.19/npm11.9 and official pinned Node24.18 toolchain are supported.
- Recreated the missing planning worktree from its verified remote, corrected
  PR10, then used an authorized normal stack merge preserving both conflict
  narratives. No rebase/amend/force or GitHub PR merge.
- Kept source/test inputs frozen during each complete coverage run. Diagnosed
  the single introduced assertion before the one justified bounded repeat;
  retained failed and passed/not-run receipts independently.
- Used only owned clean synthetic fixture roots and the retained own-descendant
  Linux subreaper. No blanket attribution of failures to environment.
- No registry publication/tags, deployment, provider/billing/auth changes,
  Mac access, unrelated repositories, archive/bundle/subgraph refresh or Goal90
  implementation. Goal89's revised design is returned for review separately.
