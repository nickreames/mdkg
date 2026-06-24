# US-026: Generate real command-level CLI reference pages


**Priority:** P1
**Theme:** Docs / Reference
**Website URL / section to update:**
- https://mdkg-docs.vercel.app/reference/command-contract/
- https://mdkg-docs.vercel.app/reference/generated-cli-reference/

### Description
The reference section currently describes the intended generated reference but does not render command-level content. mdkg has a large command surface; reference docs should be generated from command metadata to avoid drift.

### Acceptance criteria
- [ ] Generated CLI reference renders command families and individual commands in Starlight or linked generated Markdown.
- [ ] Each command page includes purpose, usage, flags, output formats, read-only/mutating status, examples, related commands, safety notes, and alpha label where relevant.
- [ ] Reference is generated from `dist/command-contract.json` or the closest validated metadata artifact.
- [ ] Docs build/check fails if generated reference is stale.
- [ ] Advanced commands are labeled advanced alpha.
