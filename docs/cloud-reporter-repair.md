# Cloud assertion-detail repair — 2026-10-03

Nick expressly authorized the existing CI diagnostic gap: the coverage reporter
discarded available assertion details. This repair changes CI output only, not
lineage behavior, product policy, version0.6.1, acceptance or readiness.

Keep original PASS/FAIL/SUMMARY events, coverage event persistence, test exit
codes and all floors/timeouts/smoke membership. Add FAIL_DETAIL schema1 with
policy `omit-payloads-v1`: allowlisted error classes/codes/operators, value
types/lengths, boolean comparison results and existing repository source
file/line locations. Omit error messages, compared contents, unknown codes,
private/outside/nonexistent paths, raw object keys and custom getters. Bound
each JSON record to4096bytes, four causes and four repository frames per cause.
Cycles and truncation are explicit. It is diagnostic data, not authentication.

The fast collector validates the exact safe schema before relaying detail lines;
forged/unknown payload fields are counted and omitted. Its aggregate detail tail
is bounded8192bytes with full admitted-stream bytes/hash and truncation marker,
alongside the existing failed-name stream. Report before fixture archive work.
Original logs remain unchanged; missing/unsafe logs never become test success.
Changing fixture trees still refuse unchanged-tree claims, retain evidence and
stay red. No orphan-process, cancellation or timeout cause is guessed or waived.

Three added synthetic cases exercise an actual Node coverage reporter with
intentional assertions/nested causes and a passing control; verify exit1 and
failed summary/coverage event remain; omit credential/message/private-path
sentinels; preserve source assertion locations; bound/cycle causes; avoid custom
getters and forged array lengths; reject forged detail lines and bound replay.

The first new regression failed6pass/1fail because its nested standalone runner
inherited NODE_TEST_CONTEXT=child-v8 and exited0. The corrected test explicitly
clears that context. Independent controlled invocations reproduce exit1 when
absent and exit0 when inherited. This fixes the test harness only; global worker
or coverage behavior was not changed. A missing-selector preflight stopped
before tests and was corrected to the existing test-execution-environment file.

Final94/94 controls pass on native Linux Node24.19.0, minimum24.18.0 and
floating24.21.0. Frozen package/qualification inputs show zero drift. Coverage
contract, output, smoke, worker-boundary, topology and ladder controls are
included. Workflow, cloud-plan,499doc-command examples and diff checks pass.
No unrelated build or local full-suite rerun. Exact-head automatic hosted runs
will qualify the new diagnostics separately from earlier product/package proof.

Interventions: re-inventoried remote heads/clean owned worktrees; applied this
bounded CI-only repair; retained the initial failure and correction; refused
payload-bearing diagnostic replay; ordinary commits/nonforce stack pushes only.
Git2.55 download403 and earlier e788 artifact extract remain unchanged blockers;
no retry/bypass. No 0.6.2 feature/migration policy, goal closure, merge, tag,
publication, deployment, Mac/company data or provider/billing/auth changes.
Independent PR11 review remains pinned to e788 and incomplete/NOT_RUN; later CI
bytes need separate review. Revised Goal89 contract approval remains pending.

Receipts: `.mdkg/artifacts/cloud-review/reporter-repair/checks.json`.
