# Coverage Hardening Matrix

as_of: 2026-03-06
phase: agent skills compliance lock + coverage hardening pass

## Hardening order

1. `src/cli.ts`
2. `src/commands/pack.ts`
3. `src/commands/format.ts`
4. `src/commands/new.ts`
5. `src/commands/workspace.ts`
6. `src/commands/show.ts`
7. remaining low-traffic utility / export unhappy paths

## Why this order

- `src/cli.ts` controls the visible product surface, help routing, and exit-code policy.
- `pack` is the core interoperability primitive and still carries several low-frequency branches.
- `format` remains branch-heavy because schema normalization covers many key kinds and policy checks.
- `new` and `workspace` are now strong; remaining work there is mostly low-value edge coverage.

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
- all-files line coverage: `94.58%`
- all-files branch coverage: `84.05%`
- tests passing: `170`

### Requested modules

- `src/cli.ts`: `86.86%` line / `86.32%` branch
- `src/commands/new.ts`: `96.93%` line / `93.57%` branch
- `src/commands/pack.ts`: `90.16%` line / `81.48%` branch
- `src/commands/format.ts`: `81.42%` line / `77.32%` branch
- `src/commands/workspace.ts`: `100.00%` line / `94.44%` branch

## Current threshold status

- overall line threshold `95%`: not yet met
- overall branch threshold `85%`: not yet met
- all-files coverage improved beyond the locked pre-pass baseline

## Highest-value remaining gaps

1. `src/commands/format.ts`
   - remaining low-traffic normalization branches across list/scalar key kinds
   - boolean/schema mismatch branches that only appear in malformed content
2. `src/commands/pack.ts`
   - residual skill-metadata rendering branches
   - default path/export branches and missing-body fallback edges
3. `src/cli.ts`
   - low-frequency helper branches such as empty-string flag values and remaining dispatch branches not exercised by direct runtime tests
4. `src/commands/show.ts`
   - not part of this pass, but still the next best user-facing command to harden after format/pack

## Residual branch clusters after this pass

- `src/cli.ts`
  - `readPackageVersion` empty-version fallback path
  - remaining helper-parse branches for empty-string values
  - a subset of command success branches still covered only indirectly via subprocess tests
- `src/commands/pack.ts`
  - meta-body rendering branches for optional skill fields
  - node-count / truncation combinations not hit by the current fixtures
  - remaining export/path branches under uncommon option combinations
- `src/commands/format.ts`
  - frontmatter validation branches for rare malformed combinations
  - id-ref and type-policy branches that depend on template/schema interactions

## Status

- Anthropic skills best-practice snapshot locked into tests and docs
- direct CLI dispatch seam added without intended behavior changes
- internal skills compliance regression added
- `new`, `workspace`, and `cli` improved materially
- coverage thresholds remain unmet; hardening stays active under `implement-12`
