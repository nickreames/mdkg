---
id: epic-24
type: epic
title: source and artifact archive sidecars
status: done
priority: 2
tags: [future, archive, artifacts, sources, sidecars, compression]
owners: []
links: []
artifacts: []
relates: [epic-22, epic-25, epic-26, epic-27]
blocked_by: []
blocks: [epic-20]
refs: [edd-3, edd-8, rule-4]
aliases: [archive-sidecars, source-artifact-sidecars]
skills: []
created: 2026-05-17
updated: 2026-05-18
---

# Goal

Define a committed source and artifact archive model under `.mdkg/archive`
using sidecar metadata and compressed raw caches.

# Scope

Archive files live beside their metadata:
- `.mdkg/archive/**/<file>`
- `.mdkg/archive/**/<file>.md`
- `.mdkg/archive/**/<file>.zip`

The `.md` sidecar is the mdkg-readable source of truth. The compressed raw cache
is the committed portable representation. The full live file can remain local or
policy-managed.

# Milestones

- Define sidecar fields for id, kind, title, source path, MIME type, byte size,
  sha256, visibility, provenance, refs, related work, and ingest status.
- Define default commit policy: sidecar plus compressed cache are committed;
  full live files can be local or policy-managed.
- Add validation guidance for missing sidecars, missing hashes, or uncompressed
  archive files.
- Include archive sidecars and eligible compressed caches in full `.mdkg`
  snapshot bundles.
- Keep public/private rules explicit so private archive records stay out of
  public bundles and user-facing output.

# Out of Scope

- No built-in office/PDF conversion engine in the first implementation wave.
- No secret store or canonical production artifact database.
- No implicit upload to external object storage.

# Risks

- Compressed raw caches can still contain sensitive content and need the same
  private-default posture as the sidecars.
- Large binaries can bloat git if size thresholds and warnings are too weak.
- Sidecar drift can make an archive entry look trusted when the raw file changed.

# Links / Artifacts

- `epic-22`
- `epic-27`
- `task-149`
- `task-150`
- `task-151`
- `npm run test` passed with 360 tests.
- `npm run cli:check` passed.
- `node dist/cli.js validate` passed.
- `npm run smoke:archive-work` passed.
- `npm run smoke:bundle` passed.
- `npm run smoke:bundle-import` passed.
- `npm run smoke:visibility` passed.
- `npm run smoke:init` passed.
- `npm run smoke:upgrade` passed.

# Closeout

Epic-24 is complete for the 0.1.4 line. mdkg now has first-class archive
sidecars, deterministic ZIP caches, strict ZIP payload validation, private-first
visibility, public-safe pack/bundle checks, large-cache doctor warnings, and
packed temp-repo smoke coverage. Future work can extend archive storage policy
or external object-store integrations, but those are not blockers for this
epic.
