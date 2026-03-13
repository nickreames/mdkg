# AGENTS

Read `AGENT_START.md` first.

Codex/OpenAI conventions for this repo:
- use `.agents/skills/` when mirrored skills are present
- use `mdkg skill ...` as the canonical skill command family
- use `CLI_COMMAND_MATRIX.md` as the single command reference

Repo-specific quickstart:
- build: `npm run build`
- test: `npm run test`
- command parity: `npm run cli:check`
- graph validation: `node dist/cli.js validate`

Normal mdkg loop:
1. identify work with `mdkg search`, `mdkg show`, or `mdkg next`
2. build context with `mdkg pack <id>`
3. mutate structured work state with `mdkg task ...`
4. use `mdkg event enable` only if the JSONL file was deleted or is missing
5. validate before closing work
