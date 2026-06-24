---
title: Command Contract
description: Maintainer-facing metadata for generated command reference and integrations.
---

The command contract is a maintainer and integration surface. Most users should start with the generated CLI reference.

mdkg publishes command metadata in the repository build output:

```text
dist/command-contract.json
```

Reference pages should derive command coverage from that artifact where possible so user docs stay aligned with the CLI.

Reference pages should include:

- command name
- purpose
- usage
- flags
- output formats
- read-only or mutating status
- examples
- related commands
- safety notes
- alpha labels where relevant

Derived docs artifacts:

- `docs/_generated/cli-reference.md`
- `docs/_generated/command-contract-summary.json`

Refresh and check:

```bash
npm run docs:generate
npm run docs:check
```
