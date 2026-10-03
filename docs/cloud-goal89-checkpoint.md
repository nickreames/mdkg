# Goal89 0.6.2 bounded implementation checkpoint

PR12: https://github.com/nickreames/mdkg/pull/12 — draft stack base
cloud/goal88-minimal-init at ce53ea56629af23ecd10d6e58a393db1235fda79.
Pre-implementation head: dbbe797430dd10654dd0371fc367ec8a4d6fb4d9.
Cloud cwd: /workspace/mdkg-cloud-goal89, nickreames/mdkg origin verified.
Plan eb4 and main d9 remain untouched; PR10/11/12 stay unmerged.
Native Linux x86_64, Node24.19.0/npm11.9.0/Git2.52.0. Supported engine
>=24.18.0<25; installed minimum24.18 and floating24.21 used their actual binaries.

Contract: working-host-anchor-v1. Fresh init gets an independent legacy host
marker outside ignored working; explicit legacy opt-in avoids node migration,
v2 uses canonical graph ID. Selected entries remain separate from canonical
search/cache/pack/bundle/package output. Preview/hash-bound apply, source retention,
owner/pin/selected-work guards, indefinite quarantine, explicit recovery/confirmed
purge and sanitized private archive promotion are implemented. No automatic
cleanup, silent adoption or incoming-store host bootstrap.

## Exact evidence

See `.mdkg/artifacts/goal-89/implementation/checks.json`, product/built/installed
input manifests, inventory, logs and retained iterations. Frozen source features
28pass; shared regressions425pass/1platformskip; release/security contracts28pass;
exact installed suite28pass on each of24.18/24.19/24.21. Total565pass,
0finalfail,1platformskip. Each installed suite contains27 runtime controls and
one repository contract-document assertion, not28 installed-only runtime controls.
Build/test compilation, CLI matrix/contract, docs, graph/skills, security,
workflow generation, static publish inventory and both local site builds passed.
No frozen product or installed file drift. Working/private canaries absent in pack.

Tarball: mdkg-0.6.2.tgz, SHA256
545e03ec75a04207b8db7a73df2b0f6f9d569e48f9424f1245a3ddaa3d0f1bb5.
Packed with scripts disabled for draft inspection, then exact offline npm install
including postinstall; npm bin reports0.6.2. This is not a prepublish ladder pass.
All installed bytes match the sealed tar extraction; npm adds owner execution
only to dist/cli.js(0600→0700), with both exact inventories retained.
Public registry/current main are0.6.0;0.6.2 was absent when checked.

Default home-cache site/pack setup initially failed ENOENT. Only those steps were
rerun with explicit owned workspace caches; original failures remain. The artifact
runner paused before installed tests on a missing-variable error, then exact-mode
comparison. Retained successful pack/install were inspected and reused. No source
acceptance was weakened; no successful test or install was duplicated. One transient
executor disconnect occurred during a read-only status command; the live qualification
session completed and was resumed. Five-failure budget:1of5, environment usable.

## Remaining review/readiness

Task848/849/850/Test495 are review. Chk675 exact revised contract/patch review,
Chk676 owner/local machine acceptance and Chk677 full prepublication readiness
remain pending; Goal89 is not achieved and release is NOT_READY. Full repository
pre-merge/thresholded coverage, complete package ladder/smokes, required native
platform/security acceptance and exact hosted proof are NOT_RUN for these bytes.
No full gate is waived. Inherited unclassified CI failures remain historical;
focused passes are not rebound to old failing candidates or claims of root cause.

Initial pre-journal anchor/lock interruption and truncated/unknown journals preserve
custody and refuse takeover; separate explicit review is required. Portable pathname/
ACL limits remain. Purge cannot recover already lost bytes. Ignored persistence is
not backup; selected sanitized export/restore rehearsal demonstrates checkout loss.

No main/plan merge, human PR merge, force/history rewrite, release tag, publish,
deploy, provider/billing/auth, Mac/company/unrelated-repository writes or Goal90
implementation. Parent independent review precedes the next sequential goal.

## Superseding PR12 correction checkpoint — 2026-10-03

Independent review of4c55758/base ce53 was NO-GO for Goal90: a managed child
payload leaked through a legacy parent's poisoned cache/full pack; repeated init
hid legacy canonical working files; zero-byte ignore files blocked explicit opt-in.
These bounded regressions are corrected, with real0.6.1 fixtures and source/exact
installed controls. Current evidence and remaining gates are in
[the correction checkpoint](cloud-goal89-review-correction.md) and
.mdkg/artifacts/goal-89/review-correction/checks.json. Final672pass0fail/1skip
does not clear independent review or qualify publication. Original4c receipts
and a superseded intermediate candidate are retained. Goal90 remains held.
