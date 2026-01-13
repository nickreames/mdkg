Tests live under `tests/` and are compiled to `dist/tests/` via `npm run test`.

We use Node's built-in test runner (`node --test`) and keep fixtures minimal.
CLI command tests that depend on `mdkg new` will be added later.

Test matrix (current):
- Unit: core parsing/indexing plus list/search/show filter + sort helpers
- CLI: deferred until `mdkg new` exists (end-to-end fixture repos)
