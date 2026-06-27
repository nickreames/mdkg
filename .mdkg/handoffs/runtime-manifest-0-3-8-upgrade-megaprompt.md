# Runtime MANIFEST Migration Megaprompt For mdkg 0.3.8

You are a repo-scoped runtime coding agent. Your expected target repo is:

- Runtime repo: `/Users/nick/omni-chat-rooms/projects/omni-room-runtime`
- Reference mdkg repo: `/Users/nick/omni-chat-rooms/projects/mdkg`

Adapt the runtime path only if the operator gives you a different target. Do
not edit the mdkg source repo during the runtime migration pass.

## Mission

Adopt mdkg's canonical `MANIFEST.md` capability surface in the runtime repo
after `mdkg@0.3.8` is published and installed. The runtime should use
`MANIFEST.md` with `type: manifest` for reusable runtime capabilities, agents,
tools, project manifests, and semantic mirrors.

The runtime migration must also verify that `mdkg upgrade --apply` safely
renames legacy `SPEC.md` files to `MANIFEST.md` before product fixtures depend
on the new canonical filename.

## Hard Stop

Do not start downstream runtime migration until all of these are true:

- `npm view mdkg version --registry=https://registry.npmjs.org/` returns
  `0.3.8` or newer.
- The runtime repo uses an installed mdkg binary that reports `0.3.8` or newer.
- `mdkg upgrade --dry-run --json` in a temp legacy fixture reports a planned
  `SPEC.md` to `MANIFEST.md` migration.
- `mdkg upgrade --apply --json` in that temp fixture actually removes or
  renames the legacy `SPEC.md`, creates `MANIFEST.md`, and changes frontmatter
  from `type: spec` to `type: manifest`.

If any of these fail, stop and report the blocker. Do not hand-rename runtime
fixtures as a substitute for proving the package upgrade path.

## Boundaries

- Do not mutate sibling repos.
- Do not publish npm packages, push, tag, or deploy from the runtime repo unless
  separately requested.
- Do not remove mdkg's one-release legacy `SPEC.md` compatibility coverage.
- Do not store raw prompts, model outputs, provider payloads, queue payloads,
  cookies, tokens, credentials, or bulky execution traces in mdkg graph files.
- Use refs, hashes, redacted summaries, commit ids, checkpoints, and bounded
  evidence instead of raw payloads.
- Keep backend-owned identity, billing, policy, ledger, and canonical runtime
  persistence outside mdkg.

## Preflight

Run these from the runtime repo and record concise evidence in runtime mdkg:

```bash
git status --short --branch
mdkg --version
mdkg status --json
mdkg doctor --strict --json
mdkg validate --json
mdkg goal current --json
mdkg goal next --json
npm view mdkg version --registry=https://registry.npmjs.org/
```

If the runtime repo has no active mdkg goal for this migration, create one
runtime-owned goal before editing files.

## Upgrade Proof In A Temp Fixture

Before touching runtime fixtures, prove the installed mdkg binary can migrate a
legacy capability:

```bash
ROOT=/private/tmp/runtime-mdkg-manifest-upgrade-proof
rm -rf "$ROOT"
mkdir -p "$ROOT"
mdkg init --agent --root "$ROOT" --json
mdkg new manifest "Legacy runtime capability" --id agent.legacy-runtime --root "$ROOT" --json
MANIFEST_PATH=$(find "$ROOT/.mdkg" -name MANIFEST.md | head -1)
LEGACY_DIR=$(dirname "$MANIFEST_PATH")
mv "$MANIFEST_PATH" "$LEGACY_DIR/SPEC.md"
sed -i '' 's/type: manifest/type: spec/' "$LEGACY_DIR/SPEC.md"
mdkg validate --root "$ROOT" --json
mdkg upgrade --root "$ROOT" --dry-run --json
mdkg upgrade --root "$ROOT" --apply --json
find "$ROOT/.mdkg" -name SPEC.md -print
find "$ROOT/.mdkg" -name MANIFEST.md -print
mdkg validate --root "$ROOT" --json
```

Expected result: after apply, the legacy capability has `MANIFEST.md` with
`type: manifest`, no sibling legacy `SPEC.md`, and validation is clean. A
fixture with both sibling files should produce a safe conflict, not overwrite.

## Runtime Migration Plan

1. Search the runtime repo for legacy naming:

```bash
rg -n "SPEC\\.md|type: spec|RoomSpecRef|SpecDocument|SpecLoader|SPEC-driven|spec-driven|manifest" .
```

2. Run `mdkg upgrade --dry-run --json` in the runtime repo and inspect planned
   writes. If it proposes safe `SPEC.md` to `MANIFEST.md` migrations, run
   `mdkg upgrade --apply --json`.

3. Migrate runtime-owned fixtures and docs:
   - `SPEC.md` to `MANIFEST.md`
   - `type: spec` to `type: manifest`
   - `SPEC-driven startup` to `manifest-driven startup`
   - product examples should prefer `MANIFEST.md`; only explicit legacy
     compatibility tests should keep `SPEC.md`.

4. Rename runtime-owned internal types where they exist:
   - `RoomSpecRef` to `RoomManifestRef`
   - `SpecDocument` to `ManifestDocument`
   - `SpecLoader` to `ManifestLoader`
   - `spec-driven` user-facing copy to `manifest-driven`

5. Keep compatibility separate from product migration. It is valid to retain a
   small explicit legacy `SPEC.md` test fixture if it is proving mdkg
   compatibility behavior, but runtime product fixtures should move to
   canonical `MANIFEST.md`.

6. Rebuild runtime indexes and verify capability discovery:

```bash
mdkg index
mdkg manifest list --json
mdkg manifest show <manifest-id-or-qid> --json
mdkg manifest validate <manifest-id-or-qid> --json
mdkg capability search "runtime manifest" --json
mdkg validate --json
mdkg validate --changed-only --json
```

7. Update runtime tests, snapshots, generated docs, and adapter expectations so
   canonical MANIFEST terminology is what users and agents see.

## Required Runtime Checks

Run the repo's normal build/test gates plus these mdkg checks:

```bash
git status --short --branch
mdkg --version
mdkg status --json
mdkg doctor --strict --json
mdkg index
mdkg validate --json
mdkg validate --changed-only --json
mdkg manifest list --json
mdkg work validate --json
git diff --check
```

If the runtime owns adapter tests around mdkg semantic files, add or update
tests that prove MANIFEST refs are accepted and legacy SPEC refs remain
compatible only where intentionally retained.

## Closeout

Record a runtime mdkg checkpoint with:

- mdkg installed version and source of installation.
- Upgrade dry-run/apply receipt summaries.
- Paths migrated from `SPEC.md` to `MANIFEST.md`.
- Any intentionally retained legacy SPEC compatibility fixtures.
- Manifest command and capability discovery evidence.
- Runtime build/test/validation results.
- Remaining follow-up work, if any.

Do not include raw secrets, raw prompts, raw provider payloads, raw queue
payloads, npm auth tokens, or bulky execution logs.
