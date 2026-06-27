---
id: dec-51
type: dec
title: config overlays are the official enterprise customization path
status: accepted
tags: [0.3.9, config-overlays, enterprise, customization]
owners: []
links: []
artifacts: [.mdkg/config.json, assets/init/config.json]
relates: []
refs: [edd-56]
aliases: []
created: 2026-06-26
updated: 2026-06-26
---
# Context

mdkg needs to be adoptable by companies that want their own standards,
initialization guidance, core docs, and skills while still receiving future mdkg
CLI/kernel upgrades. A forkable starter repository is useful as an example, but
making forks the primary customization path would make upgrades harder and
would blur ownership of mdkg-managed assets versus organization-owned policy.

# Decision

The official enterprise customization path is configuration overlays applied
after init through `.mdkg/config.json` and `mdkg upgrade --apply`.

The base mdkg CLI/kernel remains upgradable. Organization-owned standards,
core-doc overrides, skill mirror targets, and seeded skill choices must be
preserved across upgrade unless an operator explicitly accepts a replacement.

# Alternatives considered

- First-class forkable starter repo: useful as documentation or examples, but
  not the primary supported customization path because forks drift.
- Init-time profile selection only: simple for first install, but too rigid for
  teams that need to evolve standards after adoption.

# Consequences

- `goal-41` should add config-overlay behavior before public docs position
  enterprise customization.
- Upgrade tests must prove mdkg-managed kernel assets can update without
  overwriting local overlays.
- Public docs should describe overlays as primary and starter repos, if any, as
  optional examples.

# Links / references

- `goal-41`
- `task-595`
- `edd-56`
