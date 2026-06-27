# Packs And Handoffs

Use a pack when an agent needs deterministic context to work.

```bash
mdkg pack WORK_ID
mdkg pack WORK_ID --profile concise
```

Use a handoff when transferring work between sessions, agents, or humans.

```bash
mdkg handoff create WORK_ID
```

Packs are context. Handoffs are sanitized, bounded next-action summaries with state, boundaries, required checks, checkpoint context, and safety warnings.

Handoff warnings are safety aids, not comprehensive secret scanning.

Use packs for execution context and handoffs for transfer. Do not paste raw provider payloads, private prompts, logs with tokens, or bulky runtime traces into either surface.

Good handoffs include:

- current goal or work node state
- latest relevant checkpoints
- explicit stop conditions and non-goals
- required validation commands
- known warnings and whether they are accepted
- next concrete action for the receiving human or agent
