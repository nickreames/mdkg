---
title: Packs And Handoffs
description: Deterministic context transfer for humans and agents.
---

Use a pack when an agent needs deterministic context to work. Replace `WORK_ID` with the concrete task, spike, or goal id you are transferring.

```bash
mdkg pack WORK_ID
mdkg pack WORK_ID --profile concise
```

Use a handoff when transferring work between sessions, agents, or humans. Replace `WORK_ID` with the concrete id being handed off.

```bash
mdkg handoff create WORK_ID
```

Packs are context. Handoffs are sanitized, bounded next-action summaries with state, boundaries, required checks, checkpoint context, and safety warnings.

Handoff warnings are safety aids, not comprehensive secret scanning.

Use packs for execution context and handoffs for transfer. Do not paste raw provider payloads, private prompts, logs with tokens, or bulky runtime traces into either surface.

## Use a pack when working

Packs answer: "What context should I load before editing?"

Good pack uses:

- start a task or spike with bounded context
- inspect related decisions and evidence
- hand a concise context bundle to a coding agent
- review what would be included with `--dry-run --stats`

Use the same concrete `WORK_ID` for previewing and creating the pack:

```bash
mdkg pack WORK_ID --profile concise
mdkg pack WORK_ID --dry-run --stats
```

## Use a handoff when transferring

Handoffs answer: "What should the next human or agent do, and what boundaries matter?"

Use the same concrete `WORK_ID` for JSON or Markdown handoff output:

```bash
mdkg handoff create WORK_ID --json
mdkg handoff create WORK_ID --out .mdkg/handoffs/example.md
```

Good handoffs include:

- current goal or work node state
- latest relevant checkpoints
- explicit stop conditions and non-goals
- required validation commands
- known warnings and whether they are accepted
- next concrete action for the receiving human or agent

## What not to use them for

Do not use packs or handoffs as raw log storage, secret storage, prompt archives, telemetry dumps, or provider payload mirrors. Summarize evidence and use refs to artifacts instead.

## Common mistakes

- Packing a broad goal when the next agent only needs one task. Prefer `mdkg pack WORK_ID --profile concise`.
- Sharing a pack before reviewing visibility. Treat generated packs as transfer artifacts, not permanent source.
- Using handoffs as a substitute for validation. Run the required checks and record pass/fail state first.
- Copying raw prompts, tokens, provider payloads, or oversized traces into handoffs. Keep the handoff refs-only and sanitized.
