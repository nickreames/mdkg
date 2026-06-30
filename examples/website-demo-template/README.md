# Website Demo Template

This is the canonical mdkg website demo template for forked demo runs.

Start from one goal:

```bash
mdkg goal next goal-1 --json
mdkg pack spike-1 --profile concise --dry-run --stats
```

## Purpose

Use this graph to generate differentiated website ideas and local website
candidates from a repeatable mdkg starting point.

The template fixes the operating contract:

- Ocean Flow is the baseline design system.
- Astro plus React Islands is the implementation stack.
- Creative direction can vary by run.
- Local validation comes before any preview request.
- Vercel preview and durable `demo-N.mdkg.dev` hosting are parent-repo approval
  lanes, not default template behavior.

## First-Success Path

Run these commands from `examples/website-demo-template`:

```bash
mdkg validate --json
mdkg goal next goal-1 --json
mdkg show spike-1 --json
mdkg pack spike-1 --profile concise --dry-run --stats
mdkg show dec-1 --json
mdkg show dec-2 --json
mdkg show edd-1 --json
```

Expected results:

- Validation returns `ok: true`.
- Goal routing returns `spike-1` first.
- The pack includes `goal-1`, `epic-1`, `spike-1`, `task-1`, and `test-1`.
- `dec-1` records Astro plus React Islands as the stack.
- `dec-2` records preview-gated public-safety boundaries.
- `edd-1` records the Ocean Flow and Creative Production contract.

## Boundaries

Do not deploy, push, publish, change DNS, activate analytics, store secrets, or
promote durable hosting from this template. Close the run with a recommendation
to discard, polish, or request parent Vercel preview approval.
