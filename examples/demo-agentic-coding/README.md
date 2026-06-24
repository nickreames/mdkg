# Demo Agentic Coding Example

This example is a tiny mdkg graph for live demonstrations. The intended start instruction is:

```bash
mdkg goal next goal-1
mdkg pack goal-1 --profile concise
```

The graph should let an agent understand the demo audience, inspect the goal, research the proof path, build a small local-only artifact, validate it, and close with evidence. It must not deploy, publish, store secrets, or depend on private repo context.

## First-success path

Run these commands from `examples/demo-agentic-coding`.

```bash
mdkg validate --json
mdkg goal next goal-1 --json
mdkg show spike-1 --json
mdkg pack spike-1 --profile concise --dry-run --stats
mdkg show dec-1 --json
mdkg show chk-1 --json
mdkg capability search "pack" --kind skill --json
```

Expected results:

- `mdkg validate --json` returns `"ok": true`.
- `mdkg goal next goal-1 --json` returns `spike-1` as the first actionable node.
- `mdkg show spike-1 --json` returns the research spike for the demo audience and proof path.
- `mdkg pack spike-1 --profile concise --dry-run --stats` includes `root:spike-1`, `root:task-1`, and `root:test-1` without writing a pack file.
- `mdkg show dec-1 --json` returns the no-production-promotion decision.
- `mdkg show chk-1 --json` returns the seed checkpoint evidence.
- `mdkg capability search "pack" --kind skill --json` returns the pack-first skill surface.

This path should take under 10 minutes on a machine with mdkg installed.
