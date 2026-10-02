# Goal88 saved continuation

Partial implementation, NOT_READY. No active tests.

- Cwd: `/workspace/mdkg-cloud-goal88`; origin `nickreames/mdkg`; branch
  `cloud/goal88-minimal-init`, base plan `ddafe0836fdc790cd36ba203afbcfc1878bbddd8`.
- Runtime implementation frozen first at `006f48790a174d4d3c2a10e84f9857af3173ec0e`.
  Later contract/harness corrections and this receipt are a normal follow-up.
- Existing draft PR11 uses plan branch as base. PR10 stays unmerged.
- Node24.19.0/npm11.9.0; original `/workspace/mdkg` work checkout untouched.
- Existing CLAUDE/root custom instructions preserved; retirement policy pending
  review. Both native mirrors retained; extra paths admitted before effects.
- Source target0.6.1, release draft/unpublished. Tasks progress/review; no done.

## Resume in order

1. Read current git status/head/remotes and actual PR11/PR10; do not assume this
   receipt's head is final. Preserve source and unrelated checkout state.
2. Review `candidate-checks.json`, failure/recheck logs, source and tests. The
   first234 run had two old diagnostics, shared172 had two old metadata checks;
   affected rechecks20 and9 passed. Existing baseline219 pass is independent.
3. Complete `qualify-installed.cjs` preparation: it needs the actual published
   0.6.0 tarball at the explicit supplied path plus `published-060.json` containing
   verified SHA256/bytes/integrity/url. `published-060-metadata.json` is metadata
   only. The attempted direct download failed DNS EAI_AGAIN; no bytes retained.
   Public URL must match metadata, be bounded and integrity-checked. Never fake
   released provenance with a newly packed source build.
4. Review the new installed harness (syntax checked, NOT_RUN), including all
   real CLI controls. Run it against a newly packed immutable0.6.1 candidate,
   not the superseded first artifact. Preserve failed receipts and clean only
   the exact fixture roots minted by existing qualification helpers.
5. Freeze source/package/harness/graph inputs. Normal `npm pack` is authorized
   local preparation; npm publish/tags/deploys/merges are excluded. Preserve
   first tarball and inputs in `/workspace/mdkg-cloud-goal88-cache/candidate`;
   create a distinct new candidate directory rather than replace its bytes.
   Reuse `candidateInputs`, `captureQualificationInputs`, and admission helpers.
6. Run one bounded package prepublish ladder with exact retained artifact vars.
   Use a clean permitted `/dev/shm/mdkg-goal88-fixtures/...` inside the same
   sandbox command and `/workspace/mdkg-cloud-goal88-cache/subreaper.py`, verified
   hash `acf0d61ef262e11f3d0313b547cef2efe77c0da97f71148eacf20dcd2fa3f531`.
   The ladder overrides TMPDIR to its receipt/tmp. `/dev/shm` is process-local
   in this sandbox: copy receipts/logs/coverage evidence to the workspace cache
   in a finally block BEFORE the command exits. Do not use /proc namespace
   access. Keep all37 package smoke definitions and coverage floors/timeouts.
   Diagnose failures before more full runs. Record cancellation/time budget
   honestly; the first cancelled run gives no coverage result.
7. Run affected docs/site checks; preserve all46 repository definitions. Fill
   chk673/chk674 with real partial receipts. Required minimum runtime, local
   macOS/Linux architecture matrix, independent review and owner prepublish
   acceptance remain pending. Do not mark Goal88 achieved from focused checks.
8. Update same draft PR11 with exact source/head/checks. Return for independent
   review before Goal89. No merge, publication or additional goal authority is
   inferred. Overall sequential stack is already authorized after review.

Keep intervention log in `docs/cloud-goal88-experiment.md`. Restore only the
known generated SQLite cache to base bytes before committing. Do not migrate
graph identity, allocate IDs, select a goal or restore deleted event history.
