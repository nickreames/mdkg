# Prioritized test, CI, skill, and harness recommendations

Audit: `root:loop-7`
Inventory child: `root:spike-32` / `root:chk-541`
Execution child: `root:test-461` / `root:chk-542`
Captured: 2026-07-17

## Outcome

The audit evidence is complete, but the current release command surface is not
green. Coverage passed; both `ci:release` and `prepublishOnly` failed on the same
stale publish-readiness heading assertion after all reached tests, CLI/docs,
graph, and security checks passed. That failure is the first remediation item.

No audit evidence lane needs a waiver. The implementation nodes below are
residual work linked through loop outputs; they are deliberately not loop
children and do not block closing the read-only audit once its final checkpoint
is identity-bound.

## Ordered recommendations

| Order | Class | Recommendation | Evidence / risk | Payoff | Effort | Owner surface | Follow-up |
| ---: | --- | --- | --- | --- | --- | --- | --- |
| 1 | P0 release correctness | Replace the stale public-goal-skill heading assertion with a stable semantic lifecycle contract. | Both approved release ladders fail during local `npm pack`; presentation drift currently blocks CI and publication readiness. | Critical | Small | publish-readiness script and focused tests | `root:task-802`, `root:test-462` |
| 2 | P1 determinism/performance | Make nested dependency bootstrap explicit, reuse one package artifact, and bound root/docs/mdkg-dev builds. | Root install does not own nested packages; one smoke can run hidden `npm ci`; estimated full-ladder amplification is 87 root, 12 docs, and 17 mdkg-dev builds. | Very high | Large | package scripts, smoke utilities, dependency topology | `root:task-803`, `root:test-463` |
| 3 | P1 coverage | Gate all 676 tests with 89/77/96 minimums and durable V8 coverage evidence. | Current coverage passes 658 tests at 89.67/77.27/96.24, excludes 18 MJS tests, has no thresholds/artifact, and runs in no release gate. | High | Medium | package test scripts and workflow | `root:task-804`, `root:test-464` |
| 4 | P1 projection integrity | Declare public skill membership/currentness and enforce exact portable projections plus explicit repository-local exclusions. | Managed mirrors pass, but three public seeds diverge with no machine-readable exact-versus-reviewed-snapshot rule. | High | Medium | skill/init projection policy and tests | `root:task-805`, `root:test-465` |
| 5 | P1 CI architecture | Adopt staged risk-tier CI after build and coverage prerequisites: representative PR/push smokes plus sharded full release smokes, structured workflow tests, step timeouts, and tracked-drift proof. | Current CI covers 8 of 53 direct prepublish gates, only 2 of 47 smoke aliases, has one coarse timeout, no final diff assertion, and only substring workflow checks. | High | Medium-large | GitHub workflow and smoke inventory | `root:prop-9` |
| 6 | P2 harness clarity | Correct active-loop routing, tracked SQLite guidance, and stale test-family documentation. | Quickstarts omit `loop next`; contributor guidance contradicts tracked `.mdkg/index/mdkg.sqlite`; tests README says CLI tests are deferred despite 61 command files/496 identities. | Medium | Small | startup/contributor/test guidance and checks | `root:task-806`, `root:test-466` |

## Dependency order

1. Complete `root:task-802` and `root:test-462` first to restore a trustworthy
   local release gate.
2. Complete `root:task-803` and `root:test-463` before expanding provider smoke
   breadth; otherwise CI topology multiplies redundant work and hidden install
   state.
3. Coverage (`root:task-804` / `root:test-464`) and projection policy
   (`root:task-805` / `root:test-465`) can proceed independently after the P0
   repair.
4. Accept/revise `root:prop-9` using the optimized duration and build-count
   receipts; only then create its implementation task/test.
5. Harness guidance (`root:task-806` / `root:test-466`) is independent and can
   land whenever writer ownership is clear.

## Deduplication decisions

- Clean nested installs, caller-inherited offline policy, repeated `npm pack`,
  and build amplification share one release-execution root and are grouped in
  `root:task-803` rather than four competing fixes.
- CI smoke breadth, alias-aware inventory, step timeouts, final tracked-drift
  proof, and shallow workflow substring checks are one topology/contract choice
  in `root:prop-9`; implementation waits for an accepted proposal.
- Active-loop `loop next`, tracked-index language, and stale tests README are
  small audience-facing harness corrections grouped in `root:task-806`.
- Public-seed content drift is kept separate from harness wording because it
  needs a machine-readable projection ownership contract.

## Accepted intentional divergence and passes

- Pass: all eight canonical skills are byte-identical in both configured
  `.agents` and `.claude` mirrors; `mdkg skill validate` reports 0 warnings and
  0 errors.
- Intentional: `release-mdkg-package` remains absent from public defaults under
  `root:dec-85`.
- Repository-local pending policy: `service-boundary-ownership-check` remains
  absent from public defaults; `root:task-805` will make that explicit.
- Pass: `--pack-profile concise` succeeds; it is supported guidance, not a bug.
- False positive avoided: URL strings in smoke fixtures are assertions, not
  proof of a network call. The real hidden-network concern is conditional
  nested npm installation and caller-inherited npm policy.

## Evidence limitations

- No provider/API evidence was requested or authorized. The exact Ubuntu and
  Node 24.15.0 workflow rows remain source-inspected, not directly executed.
- `npm ci` was not executed because dependency replacement and registry access
  were outside this audit. Current tree inspection plus package/workspace source
  proves the topology gap; `root:test-463` owns future clean-install proof.
- `prepublishOnly` stopped at its first smoke on the P0 assertion, so it does not
  claim runtime proof for the remaining 45 direct smoke commands. Static
  inventory covers all 47 effective aliases and the future full-ladder test owns
  execution proof.
- These are explicit limitations, not waivers: the accepted evidence policy was
  local source plus current receipts, and all required audit lanes have evidence.

## Closure classification

- Definition-blocking audit gaps: none after the final checkpoint and clean
  graph/Git validation.
- Residual implementation: `task-802..806`, `test-462..466`, and `prop-9`.
- Accepted waivers: none.
- Provider/registry approvals: none requested and none used.
- Functional changes in this audit: none.
