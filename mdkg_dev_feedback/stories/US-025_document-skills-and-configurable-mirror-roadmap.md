# US-025: Document skills and configurable mirror roadmap


**Priority:** P1
**Theme:** Docs / Agent skills
**Website URL / section to update:**
- https://mdkg-dev.vercel.app/ — Skills section
- https://mdkg-docs.vercel.app/guides/

### Description
Skill source/mirroring is important for Codex, Claude Code, and SKILL.md-style workflows. The docs should explain current behavior and explicitly mark configurable mirror destinations as a polish/roadmap item if not implemented yet.

### Acceptance criteria
- [ ] Docs explain canonical skill source: `.mdkg/skills/<slug>/SKILL.md`.
- [ ] Docs explain current mirrors: `.agents/skills/` and `.claude/skills/` if accurate.
- [ ] Docs explain that mdkg indexes/discovers skills but does not execute skill scripts.
- [ ] Docs include commands for `mdkg skill list/show/search/validate/sync` if accurate.
- [ ] Roadmap/TODO captures configurable mirror destinations and validation improvements.
