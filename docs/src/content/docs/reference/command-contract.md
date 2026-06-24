---
title: Command Contract
description: Maintainer-facing metadata for generated command reference and integrations.
---

The command contract is a maintainer and integration surface. Most users should start with the generated CLI reference.

mdkg generates command metadata at:

```text
dist/command-contract.json
```

Public reference pages should derive command coverage from that artifact where possible.

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

Generated outputs:

- `docs/_generated/cli-reference.md`
- `docs/_generated/command-contract-summary.json`

Regenerate and check:

```bash
npm run docs:generate
npm run docs:check
```
