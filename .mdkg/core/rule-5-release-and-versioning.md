---
id: rule-5
type: rule
title: mdkg release and versioning (semver, publish checklist)
tags: [mdkg, release, semver, npm]
created: 2026-01-06
updated: 2026-01-06
---

# Release and versioning

mdkg follows SemVer for CLI stability and long-term compatibility.

## SemVer policy

- MAJOR: breaking CLI contract changes (flags/outputs removed or changed)
- MINOR: new commands/features that are backwards compatible
- PATCH: bug fixes and internal refactors with no contract changes

Configuration and schema versioning:
- `.mdkg/config.json` contains a `schema_version`.
- mdkg MUST support migrating older schemas to the current schema in a deterministic way.
- Backwards compatibility matters more for config and docs than for internal index formats.

## Release artifacts

The npm package MUST include:
- `dist/` compiled output
- `README.md`
- `LICENSE`

It MUST NOT include:
- `.mdkg/` docs
- `.mdkg/index/`
- source code (optional; can be included later, but not required)

## Release checklist (v1)

1) Ensure clean working tree
- no uncommitted changes
- all `.mdkg/index/` ignored

2) Rebuild and validate
- run `mdkg index`
- run `mdkg validate`
- run a pack smoke test (example):
  - `mdkg pack task-1 --verbose --out /tmp/mdkg-pack.md`

3) Update version
- bump `package.json` version (semver)

4) Update changelog (recommended)
- add a short entry describing changes

5) Build
- run `npm run build` (or equivalent)
- confirm `dist/cli.js` exists and is executable as a node script

6) Confirm publish whitelist
- verify `package.json` `"files"` includes only expected files
- optionally run `npm pack` and inspect tarball contents

7) Publish
- `npm publish`

8) Tag and push
- create git tag matching version (example `v0.1.0`)
- push commits and tags

## Release notes guidance

Release notes should call out:
- new commands / flags
- changes to pack behavior
- changes to config schema (and how migration behaves)
- new node types or template changes