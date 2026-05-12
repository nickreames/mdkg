# Coverage Hardening Matrix

as_of: 2026-05-08
phase: post-utility-helper-hardening coverage checkpoint

## Hardening order

1. remaining user-facing command modules below line target
2. remaining low-traffic command and utility unhappy paths

## Why this order

- `src/cli.ts` now exceeds the module line and branch targets; remaining
  uncovered branches are low-value task/event usage guards.
- `pack` is the core interoperability primitive; the command surface now meets
  command-level targets, and core traversal now clears the line/branch target;
  profile/export helpers still carry low-frequency branches.
- All user-facing command modules now clear the command-level line target;
  remaining coverage work should focus on low-traffic core/graph/util unhappy
  paths and the all-files line threshold.
- Focused utility/helper tests now clear the all-files line threshold; remaining
  coverage work is branch-hardening and low-value defensive paths.
- `format` now exceeds the command-level line and branch targets; remaining
  uncovered branches are low-value filesystem/schema-fallback paths.
- `new` and `workspace` are no longer the top priority; remaining work there is mostly low-value edge coverage.

## Target thresholds

- `src/` line coverage >= 95%
- `src/` branch coverage >= 85%
- no user-facing command module below 90% line coverage

## Coverage gates to add

- `npm run test:coverage`
- command-level smoke coverage for simplified help and error paths
- `mdkg validate` as a required post-change gate

## Test themes to add or expand

### CLI and help
- direct dispatch seam in `src/cli.ts`
- primary vs advanced command grouping
- simplified help text for `init`, `show`, `pack`
- command-specific usage and exit-code paths

### Skills and compliance
- indexing with canonical `SKILL.md`
- compatibility read path for `SKILLS.md`
- validation failure when both files exist
- compliance lock for internal dogfood skills:
  - canonical `SKILL.md`
  - required `name` and `description`
  - lowercase kebab-case names
  - concise bodies
  - procedural sections (`Goal`, `When To Use`, `Inputs`, `Steps`, `Outputs`, `Safety`)
- list/search/show behavior in the real repo with dogfooded skills

### New
- invalid flag combinations
- status / priority / supersedes error matrix
- reserved id and reference handling

### Pack
- auto skill inclusion and depth behavior
- stale cache warning paths
- dry-run ignored-output warnings
- truncation report auto-write behavior

### Format
- scalar/list mismatch matrix
- missing/invalid `type`
- early template-schema load failures
- non-work key-policy enforcement

## Baseline before this pass

- command used: `npm run test:coverage`
- all-files line coverage: `93.99%`
- all-files branch coverage: `82.92%`

## Current measured coverage

- command used: `npm run test:coverage`
- all-files line coverage: `95.10%`
- all-files branch coverage: `87.88%`
- tests passing: `269`

Note: Node's current experimental coverage report measures compiled `dist/`
files plus scripts/helpers, so the all-files number is not directly comparable
to the older `src/`-only target language. The target remains useful as a
release-quality signal, but the report must be read at the module level.

### Requested modules

- `src/cli.ts`: `99.67%` line / `93.96%` branch
- `src/commands/checkpoint.ts`: `98.61%` line / `94.83%` branch
- `src/commands/new.ts`: `94.95%` line / `93.06%` branch
- `src/commands/pack.ts`: `96.26%` line / `87.23%` branch
- `src/commands/format.ts`: `96.62%` line / `96.40%` branch
- `src/commands/workspace.ts`: `91.41%` line / `86.00%` branch
- `src/commands/doctor.ts`: `91.03%` line / `81.48%` branch
- `src/commands/event.ts`: `100.00%` line / `100.00%` branch
- `src/commands/event_support.ts`: `94.92%` line / `91.11%` branch
- `src/commands/guide.ts`: `100.00%` line / `85.71%` branch
- `src/commands/list.ts`: `91.43%` line / `95.24%` branch
- `src/commands/show.ts`: `100.00%` line / `96.43%` branch
- `src/commands/skill_mirror.ts`: `90.71%` line / `93.10%` branch
- `src/pack/pack.ts`: `95.85%` line / `88.57%` branch
- `src/pack/export_xml.ts`: `100.00%` line / `100.00%` branch
- `src/pack/profile.ts`: `96.85%` line / `93.51%` branch
- `src/core/config.ts`: `92.16%` line / `86.32%` branch
- `src/core/migrate.ts`: `93.75%` line / `91.67%` branch
- `src/core/paths.ts`: `100.00%` line / `85.71%` branch
- `src/graph/edges.ts`: `100.00%` line / `100.00%` branch
- `src/util/id.ts`: `100.00%` line / `77.27%` branch

## Current threshold status

- overall line threshold `95%`: met
- overall branch threshold `85%`: met
- user-facing command modules below `90%` line coverage remain: none

## Highest-value remaining gaps

1. remaining branch-only and defensive helper gaps
   - low-traffic init/search/task/skill branches, parser fallbacks, and private
     defensive guards remain below module branch targets
2. remaining low-value pack and utility guards
   - private impossible queue/default branches, metrics/order guards, and
     parse/normalization guards

## Residual branch clusters after this pass

- `src/cli.ts`
  - direct `runCli` coverage now exercises package-version fallback, inline
    empty flag values, valued booleans, structured output flags, skill
    dispatch, task/event mutation dispatch, and `new` dispatch
  - remaining uncovered lines are low-value task/event usage guards
- `src/commands/pack.ts`
  - not-found, profile-error, build-warning, and budget-error branches remain
    uncovered; command-level line and branch targets are now met
- `src/pack/pack.ts`
  - traversal edge branches, missing neighbor/file fallbacks, verbose-core
    ambiguous/missing warnings, and checkpoint tie-breakers are covered
  - remaining uncovered lines are private defensive guards that are difficult to
    reach through public `buildPack`
- `src/commands/format.ts`
  - unreadable-file and unreachable missing-schema fallbacks remain uncovered
  - malformed frontmatter/id/date/type-policy branches are covered
- `src/commands/show.ts`
  - stale-cache warnings, meta-only output, missing body-file errors, and
    optional graph metadata rendering are covered
- `src/commands/skill_mirror.ts`
  - missing-root, manifest, unmanaged, stale, prune, support-directory sync, and
    nested drift branches are covered
  - remaining uncovered lines are low-value private helper and redundant cleanup
    fallbacks
- `src/commands/doctor.ts`
  - missing config, invalid config, healthy text output, no-cache rebuild,
    stale-cache detail, and cached index read-failure branches are covered
  - remaining uncovered lines are low-value Node.js version defensive branches
- `src/commands/guide.ts`
  - normal output, missing guide, and empty guide output branches are covered
- `src/commands/list.ts`
  - workspace `all` normalization, missing-workspace diagnostics, empty-result
    output, and stale-cache warnings are covered
  - remaining uncovered lines are low-value load/normalization setup lines while
    the command-level line and branch targets are met
- `src/commands/event.ts` and `src/commands/event_support.ts`
  - repeated enable, blank kind, blank refs, invalid status, missing event log,
    `--ws all`, and missing-workspace diagnostics are covered
  - remaining uncovered event-support lines are low-value optional field and
    empty raw-list branches
- `src/commands/checkpoint.ts`
  - blank title, `--ws all`, missing workspace, invalid status, invalid
    priority, invalid scope, invalid relates, missing related nodes, slug
    fallback, and long-slug truncation branches are covered
  - remaining uncovered lines are low-value source-map residue while the
    command-level line and branch targets are met
- `src/core/migrate.ts`, `src/core/paths.ts`, `src/graph/edges.ts`, and
  `src/util/id.ts`
  - direct helper coverage now covers id/ref validation, root/config path
    helpers, migration defensive branches, and graph edge normalization/errors
  - `paths`, `edges`, and `id` now report full line coverage; `edges` reports
    full branch coverage
- `src/pack/export_xml.ts`
  - optional metadata, dropped-node, frontmatter list, attribute, and escaping
    branches are covered
- `src/pack/profile.ts`
  - invalid input, default/uppercase normalization, fallback summary, empty body,
    max-code-line truncation, and strip-code branches are covered

## Status

- Anthropic skills best-practice snapshot locked into tests and docs
- direct CLI dispatch seam added without intended behavior changes
- internal skills compliance regression added
- `new`, `workspace`, and `cli` improved materially
- config validation hardening added after the original coverage pass
- format malformed-frontmatter coverage added one regression case after the
  matrix refresh
- format id/date and policy coverage added two regression cases; `format` now
  exceeds the command-level target
- pack skills/dry-run coverage added two regression cases; `commands/pack` now
  exceeds the command-level target
- pack engine traversal coverage added four regression cases; `pack/pack` now
  exceeds the module line and branch targets
- CLI dispatch/parser coverage added four direct runtime regression cases;
  `cli` now exceeds the module line and branch targets
- show stale-cache and edge metadata coverage added two regression cases; `show`
  now exceeds the command-level line and branch targets
- skill mirror audit/prune coverage added six regression cases; `skill_mirror`
  now exceeds the module line and branch targets
- pack XML/profile coverage added four regression cases; `export_xml` now
  reports full coverage and `profile` exceeds module line and branch targets
- doctor config/index coverage added three regression cases; `doctor` now
  exceeds the command-level line target
- guide/list coverage added five regression cases; both commands now exceed the
  command-level line target
- event command coverage added three regression cases; `event` now reports full
  coverage and `event_support` exceeds the module line and branch targets
- checkpoint command coverage added two regression cases; `checkpoint` now
  exceeds the command-level line and branch targets
- utility helper coverage added eight direct regression cases across id, path,
  migrate, and graph edge helpers; the overall line and branch thresholds are
  now both met
