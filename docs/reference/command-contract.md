# Command Contract

mdkg generates a command contract at:

```text
dist/command-contract.json
```

The public docs should derive command reference pages from that artifact where possible.

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

Task-448 owns generated docs and drift checks.

Generated outputs:

- [`docs/_generated/cli-reference.md`](../_generated/cli-reference.md)
- [`docs/_generated/command-contract-summary.json`](../_generated/command-contract-summary.json)

Regenerate and check:

```bash
npm run docs:generate
npm run docs:check
```
