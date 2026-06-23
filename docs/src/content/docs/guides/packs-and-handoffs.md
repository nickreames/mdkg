---
title: Packs And Handoffs
description: Deterministic context transfer for humans and agents.
---

Use a pack when an agent needs deterministic context to work.

```bash
mdkg pack <id>
mdkg pack <id> --pack-profile concise
```

Use a handoff when transferring work between sessions, agents, or humans.

```bash
mdkg handoff create <id>
```

Packs are context. Handoffs are bounded next-action summaries with state, boundaries, required checks, checkpoint context, and safety warnings.

Handoff warnings are safety aids, not comprehensive secret scanning.
