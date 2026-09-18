Tests use Node's built-in test runner (`node --test`) and keep fixtures
minimal. TypeScript tests compile from `tests/` to `dist/tests/`; root `.mjs`
release-contract tests execute directly from source.

Current family map:

- `tests/commands/*.test.ts`: CLI dispatch, lifecycle, validation, mutation,
  init/upgrade, and end-to-end fixture-repository behavior.
- `tests/core/*.test.ts`: configuration, migration, path, and filesystem
  authority primitives.
- `tests/graph/*.test.ts`: graph parsing, indexing, edges, visibility,
  templates, validation, and goal routing.
- `tests/pack/*.test.ts`: pack selection, profiles, budgets, and exporters.
- `tests/util/*.test.ts`: argument, identity, filtering, output, QID, sorting,
  and ZIP helpers.
- `tests/*.test.ts`: cross-family release, coverage, dependency, skill,
  topology, and harness contracts.
- `tests/*.test.mjs`: root public-release, publication-readiness, and security
  contracts run by `npm run test:public-release`.

Execution:

```bash
npm run test
npm run build:test
node --test dist/tests/commands/<name>.test.js
npm run test:public-release
```

`npm run test` performs the source build and compiles the TypeScript test tree.
Its ordinary runner reuses the coverage contract's recursive discovery and
source/compiled parity check, then passes every compiled test (including root
and deeply nested files) and source MJS contract to Node exactly once. It does
not enable coverage; the separate coverage gate retains its existing policy.
Use the focused commands only after `npm run build` when validating a bounded change.
Derive current files from the family paths above rather than freezing transient
test counts in this guide.
