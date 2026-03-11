---
id: dec-13
type: dec
title: 0.0.4 skill namespace only json discovery and command matrix
status: accepted
tags: [0_0_4, cli, skills, json, ux]
owners: []
links: []
artifacts: [CLI_COMMAND_MATRIX.md, src/cli.ts, src/commands/list.ts, src/commands/search.ts, src/commands/show.ts, src/commands/skill.ts]
relates: [dec-11, dec-12, dec-15, edd-5, edd-7, epic-10, epic-11, epic-12]
refs: []
aliases: [skill-namespace-only, json-discovery, command-matrix]
created: 2026-03-08
updated: 2026-03-08
---

# Context

After first-class skill authoring landed, mdkg still exposed overlapping discovery surfaces: dedicated `mdkg skill ...` commands and generic `list/show/search` access to skills. That overlap weakened onboarding and gave orchestrators a less stable machine-readable contract.

# Decision

- Make `mdkg skill ...` the only supported skill discovery and display surface.
- Add `--json` output to `list`, `search`, `show`, `skill list`, `skill search`, and `skill show` as the first structured-output wave.
- Keep stage-aware skill discovery tag-based (`stage:*`) rather than adding a dedicated stage field.
- Make `CLI_COMMAND_MATRIX.md` the canonical single-source command reference for humans and LLMs.
- Standardize empty-state and count messaging in text mode while keeping JSON output clean on stdout.
- Track future XML/TOON/Markdown discovery outputs separately.
- Track focused task lifecycle mutation separately, then implement it in the current `0.0.4` polish wave via `dec-15` and `epic-12`.

# Alternatives considered

- Keep generic skill access indefinitely: rejected because it leaves two teaching surfaces for the same capability.
- Add a dedicated stage field: rejected because tags remain more generic and already satisfy policy gating.
- Add multi-format structured output immediately: rejected because JSON is enough for the first machine-readable contract.

# Consequences

- Skills are simpler to teach and safer to script against.
- Orchestrators can use `mdkg skill ... --json` as the primary discovery surface.
- Generic `list/show/search` are node-only and easier to understand.

# Links / references

- `dec-12`
- `epic-10`
- `epic-11`
- `epic-12`
