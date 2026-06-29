# Demo Run Receipt

Run id: `demo-001`

Source template: `examples/website-demo-template/`

Target path: `examples/demo-runs/demo-001/`

## Fork Command

```bash
node dist/cli.js graph fork examples/website-demo-template --target examples/demo-runs/demo-001 --start-goal goal-1 --json
```

## Fork Evidence

- action: `graph.fork`
- result: `ok: true`
- preserved ids: `true`
- selected start goal: `root:goal-1`
- source tree hash:
  `sha256:fd50a8dd10dde457c8e1eb2e17966ac6457d6e0eaa82f3ca5efee8bd56ba9495`
- bundle hash:
  `sha256:9f284f06e210caf5e700ce343e832bccea023a3f8af832085a0c38bcf49c9af5`
- zip sha256:
  `sha256:8784de2959479baf1899e281bcc0d02a63ab11aef3b920fc44d85c83e39c02b3`

## Post-Fork Completion

`mdkg graph fork` copies authored graph state. This run also copies the
template's operator-facing handoff files so a coding agent can start without
hidden chat context:

- `AGENT_START.md`
- `AGENTS.md`
- `CLAUDE.md`
- `CLI_COMMAND_MATRIX.md`
- `README.md`
- `DESIGN.md`
- `WEBSITE_DEMO_TEMPLATE_BRIEF.md`
- `DEMO_HANDOFF_PROMPT.md`
- `CREATIVE_PRODUCTION_INTAKE.md`
- `llms.txt`

Skill mirrors were regenerated with:

```bash
node dist/cli.js --root examples/demo-runs/demo-001 skill sync --json
```

Result: `synced: 10`, `targets: 2`.

## Validation

Commands run from the parent repo:

```bash
node dist/cli.js --root examples/demo-runs/demo-001 index
node dist/cli.js --root examples/demo-runs/demo-001 validate --json
node dist/cli.js --root examples/demo-runs/demo-001 goal current --json
node dist/cli.js --root examples/demo-runs/demo-001 goal next goal-1 --json
node dist/cli.js --root examples/demo-runs/demo-001 pack spike-1 --profile concise --dry-run --stats
```

Results:

- validation: `ok: true`, `warning_count: 0`, `error_count: 0`
- current goal: `root:goal-1`
- next node: `root:spike-1`
- pack dry-run: `12` nodes, no files written
- pack includes: `spike-1`, `goal-1`, `epic-1`, `task-1`, `test-1`, `edd-1`,
  `dec-1`, `dec-2`, `chk-1`, and three mdkg skills

## Boundary

No website implementation, Vercel project, Vercel deployment, DNS change,
preview URL, production promotion, push, tag, npm publish, analytics activation,
or durable `demo-N.mdkg.dev` hosting happened in this run proof.
