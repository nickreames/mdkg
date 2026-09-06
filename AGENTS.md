# AGENTS

Read `AGENT_START.md` first.

## Goal execution authority

Plan goals completely before running them: record the outcome, owned scope,
decisions, acceptance checks, allowed actions, exclusions, and stop conditions.
An explicit user instruction or UI action to run that planned goal authorizes
its scoped implementation, validation, task ownership/lifecycle, and required
evidence/projections. Do not ask for the same implementation approval again.
Planning-only labels describe the pre-run state; reconcile them when the user
runs the goal rather than treating them as a permanent prohibition.

A selected goal, historical graph state, automatic continuation, or green check
does not independently grant or expand authority. Continuations inherit the
accepted run scope. Re-inventory custody before writes and stop for a writer
collision, unknown work, material new decisions, or out-of-scope actions.

Goal-specific exclusions override generic skill defaults. Staging, commits,
pushes, releases, tags, history changes, bundle/subgraph refreshes, deployments,
provider actions, and cross-project writes are authorized only when explicitly
included in the user-approved goal contract or separately approved. Never infer
them from goal completion. Do not change selected-goal state merely to run an
explicitly supplied goal.

Codex/OpenAI conventions for this repo:
- use `.agents/skills/` when mirrored skills are present
- use `mdkg skill ...` as the canonical skill command family
- use `CLI_COMMAND_MATRIX.md` as the single command reference
- use `mdkg help <command>` or `CLI_COMMAND_MATRIX.md` for the full `--json|--xml|--toon|--md` discovery/show surface

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
