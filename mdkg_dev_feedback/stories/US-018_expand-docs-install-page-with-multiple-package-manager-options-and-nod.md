# US-018: Expand docs install page with multiple package-manager options and Node setup guidance


**Priority:** P1
**Theme:** Docs / DevEx
**Website URL / section to update:**
- https://mdkg-docs.vercel.app/start-here/install/

### Description
The docs install page currently promotes npm as the validated path and mentions one-off runners later. The user wants npm, pnpm, bun, and possibly more DevEx options. The page should support multiple paths while clearly marking the canonical validated path.

### Acceptance criteria
- [ ] Install docs include npm, pnpm, and bun global install commands if verified.
- [ ] One-off commands such as npx/pnpm dlx/bunx are documented only if verified.
- [ ] Node >=24.15.0 requirement is prominent.
- [ ] Page includes how to check Node version.
- [ ] Page includes troubleshooting for “node:sqlite unavailable” or too-old Node, if applicable.
- [ ] Canonical validated path remains clear.

### Suggested copy / implementation notes
Suggested layout:

### Recommended public-alpha path
```bash
npm install -g mdkg
mdkg --version
```

### Other package managers
```bash
pnpm add -g mdkg
bun add -g mdkg
```

### Runtime requirement
mdkg requires Node.js >= 24.15.0 because it uses modern Node capabilities, including built-in local SQLite support where useful.
