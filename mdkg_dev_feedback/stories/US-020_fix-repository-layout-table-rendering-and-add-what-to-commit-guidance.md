# US-020: Fix repository layout table rendering and add “what to commit” guidance


**Priority:** P1
**Theme:** Docs / Repo hygiene
**Website URL / section to update:**
- https://mdkg-docs.vercel.app/concepts/repository-layout/

### Description
The repository layout table appears collapsed in crawled text, making it hard to scan. This page is critical because users need to know which files are source, generated, ignored, or optional.

### Acceptance criteria
- [ ] Repository layout renders as a valid Markdown/HTML table in docs.
- [ ] Columns include path, purpose, commit policy, source/generated/runtime, and notes.
- [ ] Page explicitly answers “What should I commit?” and “What should I not commit?”
- [ ] Page distinguishes `.mdkg/index` rebuildable cache from `.mdkg/db` optional project application state.
- [ ] Page includes `.agents/skills` and `.claude/skills` as generated mirrors, not canonical source.
