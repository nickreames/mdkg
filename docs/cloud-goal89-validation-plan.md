# Goal89 validation and evidence plan

Current contract: **working-host-anchor-v1**. All fixtures are synthetic and owned.
The prior canonical-v2-host-binding-v1 design-oracle receipts remain historical;
they do not qualify current implementation bytes. Exact source/artifact manifests,
commands, runtime identities, elapsed times and counts belong in the implementation
receipt. No result is inferred from a test's existence or another candidate.

## Bounded draft checks

`tests/working-storage.test.mjs` runs the same source and extracted-package paths.
Acceptance covers fresh/repeated init and preserved instructions, explicit legacy
bootstrap without migration, v2 reuse, CLI restart persistence, host copy/change/
loss refusal, same-ID clone, new-ID binding refusal, stale payload/plans, owner/
pin/activity/selected-work protection, custom adoption, quarantine/recover/purge,
idempotence, sanitized promotion/archive verify, selected export/restore and
checkout-loss honesty. It exercises payload and journal effect interruption cuts,
actual killed writer recovery, forged journal/duplicate move/renamed parent,
pre-journal killed custody refusal, contained filesystem/Git metadata controls,
force-tracked bundle exclusion and forged stale node/capability cache refusal.
The host-contract tests exercise actual independent readers and marker admission.

The PR12 review correction adds ordinary full-pack disclosure controls using
matching generated frontmatter in managed children beneath an unmanaged parent,
including nested child paths, forged ancestor/capability caches and forbidden
workspace admission. Legacy canonical working pack/Git visibility remains a
positive control. Absent/zero-byte/authored ignore files exercise explicit CLI
preview/apply, stale-input refusal and journal resume. Qualification sets
`MDKG_WORKING_LEGACY_PACKAGE` to the independently built ce53 0.6.1 initializer;
standalone tests otherwise model its missing host marker/working ignore rule.

Changed shared adapters need focused existing init/upgrade/mirror, config/options,
cache/ownership/transport/bundle, archive, identity and lock regressions. Compile
once, verify every selected test path exists, then run a bounded selection with
owned clean TMPDIR and the retained owned-descendant subreaper. Keep original
failures; classify concrete regressions separately from inherited limitations.
No coverage floor, timeout, workflow or smoke partition changes.

Build, generated CLI snapshot/contract/matrix, docs/release notes, graph/skill
validation, security acceptance, workflow generation, static publish inventory
and diff checks are applicable. New command examples must pass the unchanged
docs checker. Necessary site projections/builds remain local only.

## Freeze and artifact custody

Freeze source, config, lockfile, generated assets and qualification harness before
checks. Record before/after hashes; no candidate edits during execution. Exact
npm tarball extraction and postinstall must run the same feature suite on native
Node24.18.0 minimum,24.19.0 and verified24.21.0 floating where available, with
artifact SHA256/inventory and installed package version. No working payload or
synthetic canary may occur in that tarball. Packing with scripts disabled is a
draft artifact check, not a passing prepublish ladder. No publication is attempted.

Copy receipts out of the per-command synthetic fixture namespace in that same
command. Never inspect another process namespace or infer quiescence from age/PID.
Checkpoint fields stay honest; numeric IDs are not allocated in the actual graph.
Supported task lifecycle can record review state; selection is left unchanged.

## Pending readiness obligations

Full pre-merge tests/coverage, the unchanged complete package ladder and smokes,
security/local owner acceptance, macOS/native platform matrix and exact hosted
qualification remain separately PASSED/FAILED/NOT_RUN in receipts. Do not rerun
large inherited CI loops merely to clear historical unclassified failures. A
concrete changed-behavior failure requires diagnosis. A focused draft checkpoint
can be reviewable while release remains **NOT_READY**; no readiness waiver or
professional-adoption claim follows.

Chk675 awaits independent review of the current contract/patch. Chk676 local
owner-machine acceptance and Chk677 final prepublication readiness remain open.
Goal89 is not achieved. Parent review precedes Goal90; merges/publication/tags/
deployments/provider or company-data writes are excluded.

Portable limitations remain: concurrent hostile pathname/ACL manipulation is not
fully prevented by visible checks/ancestry binding; no universal crash recovery
or authentication claim. Initial pre-journal anchor/lock and malformed journal
custody refuse and remain preserved for separate explicit review. Purge cannot
restore already lost bytes. Working persistence is not Git/artifact backup.
