---
id: epic-18
type: epic
title: upgrade workflow enhancements
status: todo
priority: 3
tags: [upgrade, roadmap, scaffold, ux]
owners: []
links: []
artifacts: [src/commands/upgrade.ts, scripts/smoke-upgrade.js]
relates: [epic-14, epic-17]
blocked_by: []
blocks: []
refs: [rule-3, rule-5]
aliases: []
skills: []
created: 2026-05-12
updated: 2026-05-12
---
# Goal

Make `mdkg upgrade` easier to trust and operate after the conservative v0.1.0 baseline ships.

# Scope

Future enhancements should improve reviewability and operator control without weakening the core safety rule: mdkg must not silently overwrite local project memory.

# Milestones

- Add an upgrade diff preview that shows proposed file-level changes before `--apply`.
- Add selective upgrade scopes such as docs, templates, skills, config, or mirrors.
- Improve conflict reports with old hash, current hash, target hash, category, and suggested next action.
- Add fixtures for multiple historical init baselines so upgrade compatibility can be tested across release lines.
- Consider a follow-up command or report mode for adopting customized files into the managed manifest intentionally.

# Out of Scope

- Automatic conflict resolution.
- Rewriting user-created work nodes, design docs, custom skills, or customized core memory.
- Any network-based upgrade source; upgrade should continue to use installed package assets.

# Risks

- Diff output can become noisy unless it is grouped and filtered for humans and agents.
- Selective apply flags can create partial-upgrade states unless receipts are explicit.
- Richer conflict reporting must avoid leaking file contents or secrets into logs.

# Links / Artifacts

- `src/commands/upgrade.ts`
- `src/commands/init_manifest.ts`
- `scripts/smoke-upgrade.js`
- `CHANGELOG.md`
