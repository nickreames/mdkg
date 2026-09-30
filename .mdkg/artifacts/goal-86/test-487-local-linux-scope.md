# Test487 local Linux installed-candidate qualification

Status:49 selected scenario rows PASS; bounded ARM64 subset only.
Chk662 and the attached Linux qualification receipt record the results and
cleanup. Test487 remains progress, not final platform acceptance.

## Goal

Run the existing Test479 transport, sampled recovery, real runtime/selection,
and recovery-admission fixtures against the retained installed 0.6.0 tarball
on a disposable local Ubuntu ARM64 VM. Preserve existing macOS evidence.

## Context and authority

Nick clarified on 2026-09-28 that local Linux testing remains authorized and
required; the question about its value did not waive that release gate.
The canonical branch is main at
`6d23981e70bc68798def73c81b9cd5fa7bc9f3df`, 69 commits ahead and zero behind
cached origin/main (no remote verification), with 178 attributable dirty paths
before this turn, nothing staged, and no mutation lock. Goal86 owns Test487;
mdkg-project-agent is the single repository writer. The existing Lima instance
is unrelated and must remain stopped and untouched.

Candidate SHA256:
`6154e4ea920bfa09d57532171df808f3f406250b44b2b318f0bb48542f82cdca`.
Qualification input capture SHA256:
`29e0f1e2a62cb56160e58f8534ee1d96d6c512ab9bea12ffd50bb16af897496f`.

## Boundaries

Only owned disposable VM/configuration/download/capsule paths under
`/private/tmp/mdkg-linux-pOXG0u` and scoped mdkg evidence/projections.
Use isolated LIMA_HOME, no host directory mounts, no forwarded SSH agent or
host public keys, no container service, and no inherited proxy configuration.
Transfer only explicitly inventoried source/qualification inputs, the exact
candidate, and a verified official Node runtime. No canonical graph/runtime DB,
Git metadata, raw security report, credentials, or operational payload.
No product/native-helper changes, host installation/global configuration,
remote Git, push, publication, hosted execution, providers, or deployments.
No bundle/subgraph refresh, selected-goal change, or canonical worktree change.

## Done when

Record real guest image/kernel/architecture/filesystem and Node/npm/Git
identities; install the exact candidate offline; execute the selected existing
fixture families; verify candidate/source/driver bookends; retain sanitized
case results and failure diagnostics; remove only the owned VM and fixtures.
Keep Test487 open for all missing installed families/platforms and final gates.

## Evidence and selected validation

Use the existing immutable Test479 drivers, whose macOS proof is in Chk661.
Run the 34-case transport/recovery driver and the 15-case runtime/admission
supplement. Their installed-package inventory and source/candidate checks must
pass before and after execution. Record Linux-specific failures honestly;
earlier macOS passes are not Linux evidence. Validate affected graph/index and
diff after recording the milestone. Defer the full release ladder to Task829.
Bugs46/47 remain DEFERRED/UNRESOLVED under Goal87, regardless of these results.
Windows and any unexecuted x86_64 Linux matrix remain unqualified.

## Protected bookends

- Selected Goal73 file: `f996926a868b7c06fb29311fb69c48d862e9dc354404f777df93e1c5443b07ab`.
- Runtime DB: `b1f2bfb3c9ebd254d520eb7f47c12c2fa18daf691056fe97ba1890f94d013a81`.
- Demo3 private bundle: `741b4644da1d3d1ff3bbd4b9240e22870609f015e49e28170a91748ab024570b`.
- Draft release record: `cd4f252295112d4a509b6a47069ede60da5b215b3a22281ba4f4225b5c96bd91`.
