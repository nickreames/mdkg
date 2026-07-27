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
- Static Astro is the implementation stack.
- Demo pages emit semantic HTML and CSS with zero client-side JavaScript.
- Creative Production may shape the direction through
  `CREATIVE_PRODUCTION_INTAKE.md`.
- Creative direction can vary by run.
- Local validation comes before any integration or publication handoff.
- Integration, commit, push, hosting, and public verification remain
  caller-owned authority lanes, not default template behavior.

## First-Success Path

Run these commands from `examples/website-demo-template`:

```bash
mdkg validate --json
mdkg goal next goal-1 --json
mdkg show spike-1 --json
mdkg pack spike-1 --profile concise --dry-run --stats
mdkg show prd-2 --json
mdkg show dec-1 --json
mdkg show dec-2 --json
mdkg show edd-1 --json
```

Expected results:

- Validation returns `ok: true`.
- Goal routing returns `spike-1` first.
- The pack includes `goal-1`, `epic-1`, `spike-1`, `task-1`, `test-1`,
  `prd-2`, `edd-1`, `dec-1`, `dec-2`, and `chk-2`.
- `prd-2` records the reusable product, evidence, and authority requirements.
- `dec-1` records static Astro and zero client JavaScript as the stack.
- `dec-2` records caller-gated public-safety boundaries.
- `edd-1` records the Ocean Flow and Creative Production contract.
- `CREATIVE_PRODUCTION_INTAKE.md` explains optional ideation input and the
  summary that `spike-1` must retain before implementation.

## Boundaries

Do not integrate, commit, deploy, push, publish, change DNS, activate analytics,
store secrets, or promote durable hosting from this template. Close the run
with a recommendation to discard, rework, or hand the accepted local candidate
back to the caller for a separate integration decision.
