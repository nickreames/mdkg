# Changelog

All notable changes to mdkg are documented here.

This project follows a pragmatic changelog style inspired by Keep a Changelog. Versions use npm package versions.

## 0.0.9 - 2026-05-12

### Added

- Added generic agent workflow file support for `SPEC.md`, `WORK.md`, `WORK_ORDER.md`, `RECEIPT.md`, `FEEDBACK.md`, `DISPUTE.md`, and `PROPOSAL.md`.
- Added `mdkg new <agent-file-type> ... --id <portable-id>` for semantic ids such as `agent.image-worker` and `work.generate-image`.
- Added validation support for `pricing_model: included`.
- Added validation support for `proposal_kind: skill_update` targeting `skill.<slug>` refs.
- Added generic skill extension output under `extensions`, with `ochatr_*` metadata mapped to `extensions.ochatr`.
- Added a non-mutating npm `postinstall` hint that points users to `mdkg --help` and prints shell PATH guidance only when needed.
- Added `docs/agent-runtime-0.0.9-handoff.md` to document the runtime migration path from implementation-specific naming to generic agent workflow naming.
- Added `npm run smoke:matrix` to pack mdkg, install it into an isolated temporary npm prefix, and exercise the command matrix plus onboarding workflows from the packaged CLI.

### Changed

- Renamed the remaining public Omni file-type surface to generic agent workflow language.
- Kept `mdkg init --omni` only as hidden migration guidance to `mdkg init --agent`.
- Updated README and command matrix version references to `0.0.9`.
- Removed stale prepublish wording and absolute local README links.
- Removed `AGENT_PROMPT_SNIPPET.md` and distilled its startup rules into `AGENT_START.md`, making `AGENT_START.md` the single first-hop agent onboarding doc.
- Treated ochatr.ai metadata as a vendor extension pattern rather than the base mdkg schema name.
- Added npm `prepack` and `prepublishOnly` guards so release commands fail if the built CLI or init assets are missing.
- Included `CHANGELOG.md` and `CONTRIBUTING.md` in the npm package because README links to them.

### Fixed

- Fixed strict validation gaps for room-runtime-style skill proposals and included pricing.
- Fixed docs drift between published `0.0.8`, local source version, and the 0.0.9 release target.

### Verification Status

- Passed: `npm ci` with `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache`.
- Passed: `npm run build`.
- Passed: `npm run test` with 306 tests.
- Passed: `npm run cli:check`.
- Passed: `node dist/cli.js validate`.
- Passed: `npm run smoke:consumer`.
- Passed: `npm run smoke:matrix`.
- Passed: `npm pack --dry-run --json`; tarball includes `dist/cli.js`, compiled command/core/graph/pack/template/util files, `dist/init/`, `CHANGELOG.md`, `CONTRIBUTING.md`, `README.md`, `LICENSE`, package metadata, and `scripts/postinstall.js`.
- Passed: `npm publish --dry-run`; `prepublishOnly` and `prepack` both completed successfully.
- Confirmed before publish: npm registry latest remains `mdkg@0.0.8`.

## 0.0.8

- Published npm baseline before the 0.0.9 agent workflow release work.
- Does not include agent workflow file types, mutation JSON receipt expansion, workspace enable/disable, or postinstall guidance.

## 0.0.7 and earlier

- Historical local and published release line for mdkg's initial CLI, graph, pack, skill, and agent-bootstrap work.
