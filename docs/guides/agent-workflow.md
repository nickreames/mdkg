# Agent Workflow

Agents should start with repo-owned guidance instead of guessing.

```bash
mdkg status
mdkg goal current
mdkg goal next
mdkg pack <id>
mdkg goal claim <id>
```

Important rules:

- `goal next` is read-only.
- `goal claim` mutates active goal state.
- Required checks are guidance; agents must run them and record evidence.
- Subgraph qids are read-only planning context.
- Do not store raw secrets, unredacted prompt text, tokens, provider payloads, or bulky runtime traces in mdkg nodes.

Close work with evidence:

```bash
mdkg task done <id> --checkpoint "Meaningful milestone"
mdkg validate
```
