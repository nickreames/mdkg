# US-058: Add a “Try this on a small repo first” safety/onboarding note


**Priority:** P1
**Theme:** Trust / Onboarding
**Website URL / section to update:**
- https://mdkg-dev.vercel.app/quickstart/
- https://mdkg-docs.vercel.app/start-here/quickstart/

### Description
Because mdkg is public alpha and writes repo-local scaffold files, new users should be encouraged to try it in a test branch or small repo first. This builds trust and reduces fear.

### Acceptance criteria
- [ ] Quickstart recommends trying mdkg on a small repo or new branch first.
- [ ] Quickstart explains what files are created at a high level.
- [ ] Quickstart links to repository layout / what to commit.
- [ ] Tone is reassuring, not scary.

### Suggested copy / implementation notes
Suggested note:

> Public alpha tip: try mdkg on a small repo or a fresh branch first. `mdkg init --agent` writes repo-local Markdown scaffolding under `.mdkg/` and agent-facing skill mirrors; generated indexes are rebuildable.
