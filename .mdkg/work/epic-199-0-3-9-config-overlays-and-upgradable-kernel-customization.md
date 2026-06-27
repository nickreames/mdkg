---
id: epic-199
type: epic
title: 0.3.9 config overlays and upgradable kernel customization
status: todo
priority: 1
tags: [0.3.9, config-overlays, upgrade, kernel]
owners: []
links: []
artifacts: [.mdkg/config.json, assets/init/config.json, src/core/config.ts, src/commands/init.ts, src/commands/upgrade.ts, src/commands/skill_mirror.ts]
relates: []
blocked_by: []
blocks: [task-594, task-595, task-596, test-302, test-303]
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-26
updated: 2026-06-26
---
# Goal

Deliver the upgradable customization foundation for `0.3.9`: config overlays,
upgrade preservation, and arbitrary skill mirror target paths.

# Scope

- Audit current hard-coded init/config/mirror behavior.
- Add overlay-aware config and upgrade behavior.
- Add arbitrary configured skill mirror targets while preserving `.agents` and
  `.claude` defaults.

# Milestones

- `task-594`: source-grounded audit.
- `task-595`: config overlay and upgrade preservation implementation.
- `task-596`: custom skill mirror target implementation.
- `test-302` and `test-303`: temp-repo contracts.

# Out of Scope

- Public website/docs polish.
- Forkable starter repo distribution as the primary enterprise path.

# Risks

- Upgrade logic could overwrite local standards unless ownership is explicit.
- Arbitrary mirror paths could become unsafe unless repo-local path validation
  fails closed.

# Links / Artifacts

- `goal-41`
- `dec-51`
- `dec-52`
- `edd-56`
