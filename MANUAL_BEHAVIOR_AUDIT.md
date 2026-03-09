# Manual Behavior Audit

as_of: 2026-03-05
scope: epic-8 pre-hardening manual audit for the primary human + agent loop

## Scenarios run

### Generic bootstrap

Commands run:

```bash
mdkg init --llm
mdkg new task "audit baseline" --status todo --priority 1
mdkg show task-1
mdkg next
mdkg pack task-1 --profile concise --dry-run --stats
mdkg list --type skill
```

Baseline observations before this pass:
- `init` next-step guidance still taught `index` and `list`, not the intended `search/show/next/pack/validate` loop.
- `show <id>` returned only a card for nodes, while `show skill:<slug>` already returned full body content.
- `list --type skill` was silent on empty state.
- global help still exposed every command and cache-debug flags at the same level.

Actions taken in this pass:
- `init` next-step guidance now teaches the primary loop.
- `show <id>` now prints full body content by default; `--meta` remains for card-only output.
- `list --type skill` now emits a note on stderr when no skills are indexed.
- global help now separates primary commands from advanced / maintenance commands.

### Optional agent-ready bootstrap

Commands run:

```bash
mdkg init --omni
mdkg --help
mdkg show rule-human
```

Baseline observations before this pass:
- the OSS and Omni stories were both present, but the CLI surface did not clearly make `--omni` optional.
- `show rule-human` only returned the node card, which weakened the value of the scaffold.

Actions taken in this pass:
- README and help now keep `init --llm` primary and `init --omni` optional.
- `show rule-human` now returns the full strict-node body by default.

### Skills discovery

Commands run after adding internal skills:

```bash
mdkg list --type skill
mdkg search "stage:plan"
mdkg show skill:select-work-and-ground-context
mdkg pack task-64 --skills auto --skills-depth full --format json
```

Required expectations for this phase:
- internal skills are real repo assets, not placeholders
- skills are indexable, searchable, and pack-includable
- `SKILLS.md` compatibility remains read-tolerant but not canonical

## Findings that still matter after this pass

1. `pack` still has a large advanced shaping surface. The visible help is simplified, but the deeper option set still needs a v0.5 command-matrix review.
2. `new` still carries a broad metadata surface. The help is shorter, but the true flag inventory still needs deprecation and tiering decisions.
3. Coverage is still below the long-term target and needs its own deliberate hardening wave.

## Recommended next implementation order

1. finish root onboarding artifacts and help parity
2. complete internal skills indexing / search / pack verification in the real repo
3. harden coverage against the simplified loop
4. only then consider deeper top-level command removal
