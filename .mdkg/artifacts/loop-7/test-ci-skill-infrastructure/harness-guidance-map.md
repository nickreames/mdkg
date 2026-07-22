# Harness and startup guidance map

Audit: `root:loop-7`
Captured: 2026-07-17
Evidence kind: source inventory; no guidance files were changed.

## Ownership map

| Surface | Audience | Role | Observed contract |
| --- | --- | --- | --- |
| `AGENTS.md` | contributors and Codex in this repo | repository policy | Requires `AGENT_START.md`, canonical mdkg commands, validation, and normal work routing. |
| `AGENT_START.md` | agents operating this checkout | detailed repository startup | Describes goals, first-class loops, skills, index/SQLite behavior, and an active-loop quickstart. |
| `.mdkg/skills/pursue-mdkg-loop/SKILL.md` | loop executors | canonical operational procedure | Requires `loop plan`, `loop next`, concise pack, blocker recovery, evidence binding, and closeout gating. |
| `.agents/skills/**`, `.claude/skills/**` | configured clients | managed projections | Byte-identical to all eight canonical skills at audit time. |
| `assets/init/AGENTS.md` and `assets/init/AGENT_START.md` | initialized consumer repos | portable startup seed | Mirrors the portable workflow shape, with product-specific repository detail omitted. |
| `CONTRIBUTING.md` | human contributors | contribution and test guidance | Describes local tests and generated-output hygiene. |
| `CLI_COMMAND_MATRIX.md` | all operators | command source of truth | Canonical command reference required by repo policy. |

Root and public startup wrappers are intentionally audience-specific rather than byte-for-byte mirrors. The managed skill projections, by contrast, are configured copies and are byte-identical to canonical skill bodies.

## Findings

### P1: tracked SQLite index contradicts contributor guidance

`CONTRIBUTING.md:84` says: “Do not commit generated index or pack outputs. Keep `.mdkg/index/` and `.mdkg/pack/` ignored.” Current repository truth differs:

- `git ls-files .mdkg/index` returns `.mdkg/index/mdkg.sqlite`.
- `.gitignore` ignores JSON, temporary, lock, WAL, SHM, and journal index byproducts, but not the SQLite database itself.
- `AGENT_START.md` explicitly says `mdkg index` refreshes `.mdkg/index/mdkg.sqlite` when SQLite mode is enabled.

This can cause a contributor or agent to omit required graph state, misclassify an expected mdkg diff, or attempt an unsafe cleanup. The follow-up should document the tracked SQLite exception and enforce consistency between contribution guidance, `.gitignore`, and the tracked-path contract.

### P2: active-loop quickstart omits deterministic child routing

Both `AGENT_START.md` and `assets/init/AGENT_START.md` list `loop show`, the loop skill, `loop plan`, and concise packing under “If an active loop is known,” but neither lists `mdkg loop next <loop-id> --json`. The canonical `pursue-mdkg-loop` skill requires `loop next` and says its selected child should normally be preferred.

The fuller skill prevents a hard execution blocker, but the quickstart omission makes it easier to skip deterministic child ordering when an agent follows the startup checklist literally. The follow-up should add and test the routing step in both audience-appropriate startup surfaces.

### Pass: concise pack spelling is accepted

The startup and skill use `--pack-profile concise`. A live dry-run for `root:loop-7` succeeds with that spelling, so this is a supported compatibility form rather than a guidance defect.

### P2: test README describes command tests as deferred

`tests/README.md` says CLI tests are deferred. Current repository truth includes
61 command test files and 496 source-defined runtime command-test identities.
This can misroute contributors away from the largest test family and should be
replaced with current family and execution guidance.

### Related skill-projection gap

Public skill membership/currentness ambiguity is recorded separately in `skill-projection-inventory.json`; it should not be duplicated as a harness defect.

## Recommended follow-up boundaries

1. Clarify and test tracked `.mdkg/index/mdkg.sqlite` contributor policy without changing index behavior.
2. Add and test `loop next` in the active-loop startup quickstart without broadening loop authority.
3. Replace stale command-test deferral language with the current test-family contract.
4. Keep public seed currentness policy in the separate skill-projection follow-up.

No source, guidance, skill, mirror, or init-seed edit is authorized by this audit.
