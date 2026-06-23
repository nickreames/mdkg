# Demo Agentic Coding Example

This example is a tiny mdkg graph for live demonstrations. The intended start instruction is:

```bash
mdkg goal next goal-1
mdkg pack goal-1 --profile concise
```

The graph should let an agent understand the demo audience, inspect the goal, research the proof path, build a small local-only artifact, validate it, and close with evidence. It must not deploy, publish, store secrets, or depend on private repo context.

