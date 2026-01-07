---
id: task-2
type: task
title: create typescript cli skeleton and build
status: done
priority: 1
epic: epic-1
tags: [typescript, cli, build]
links: [node:>=18, typescript]
artifacts: [dist-cli, bin-entry]
relates: [edd-1, rule-3, rule-5]
blocked_by: []
blocks: []
refs: []
aliases: []
created: 2026-01-06
updated: 2026-01-06
---

# Overview

Create the initial TypeScript CLI skeleton targeting Node 18+. Implement command routing and a build pipeline that produces `dist/cli.js`.

# Acceptance Criteria

- `src/cli.ts` exists and can be compiled to `dist/cli.js`
- `mdkg --help` prints help output and exits 0
- unknown command prints usage and exits 1
- root check behavior implemented (rule-3)
- CLI normalizes inputs to lowercase (rule-3)

# Files Affected

- src/cli.ts
- src/util/argparse.ts
- package.json
- tsconfig.json
- (optional) tsconfig.build.json

# Implementation Notes

- No runtime deps; implement minimal arg parsing in-house.
- Add a `bin` entry in package.json and ensure the compiled JS has a node shebang.
- Keep command routing simple: `commands/<name>.ts`.

# Test Plan

- `npm run build`
- `node dist/cli.js --help`
- `node dist/cli.js invalidcmd` exits non-zero

# Links / Artifacts

- edd-1 (architecture)
- rule-3 (cli contract)
- rule-5 (release guidance)
