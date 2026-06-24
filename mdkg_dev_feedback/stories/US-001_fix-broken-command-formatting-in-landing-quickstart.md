# US-001: Fix broken command formatting in landing quickstart


**Priority:** P0
**Theme:** First-run UX / DevEx
**Website URL / section to update:**
- https://mdkg-dev.vercel.app/ — Quickstart section
- https://mdkg-dev.vercel.app/quickstart/ — Install and first run

### Description
The landing page and product quickstart currently collapse multiple shell commands into one unreadable line. This is a high-priority fix because the first-run path is the highest-conversion section of the site and the primary proof that mdkg is practical.

### Acceptance criteria
- [ ] Each shell command renders on its own line in a code block.
- [ ] Commands can be copied without prompts if needed, or with prompts consistently if the UI supports it.
- [ ] The canonical sequence is visible above the fold or one scroll below hero: install, version check, init, index, status, validate.
- [ ] Mobile layout does not horizontally overflow for basic quickstart commands.
- [ ] The same command sequence is consistent between homepage, quickstart page, docs install page, docs quickstart page, README top section, and llms.txt.

### Suggested copy / implementation notes
```bash
npm install -g mdkg
mdkg --version
mdkg init --agent
mdkg index
mdkg status
mdkg validate
```
