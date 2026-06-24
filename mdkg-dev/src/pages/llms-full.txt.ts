export const prerender = true;

export function GET() {
  const body = `# Markdown Knowledge Graph agent primer

Markdown Knowledge Graph (mdkg) is git-native project memory for AI coding agents and AI-native software engineering.

## What mdkg is

- a local-first CLI
- a Markdown + frontmatter graph
- a deterministic context-pack builder
- a goal/task/spike/checkpoint lifecycle tool
- an agent handoff tool
- a validation and repair aid
- an advanced alpha substrate for subgraphs, bundles, workflow mirrors, read-only MCP, and local queue workflows

## What mdkg is not

- not an autonomous coding agent
- not an autonomous execution runtime
- not a hosted memory service
- not a vector database
- not a daemon
- not a comprehensive secret scanner
- not a production queue/event ledger

## Plan -> Work -> Evidence

1. Read repo instructions such as AGENT_START.md.
2. Run mdkg status.
3. Use mdkg goal current and mdkg goal next when a goal is selected.
4. Use mdkg show or mdkg search for inspection.
5. Use mdkg pack WORK_ID for deterministic context.
6. Use mdkg goal claim GOAL_ID WORK_ID or mdkg task start TASK_ID only when intentionally mutating lifecycle state.
7. Do work outside mdkg.
8. Run required checks yourself.
9. Record a checkpoint or handoff.
10. Run mdkg validate before closeout.

## Core commands

- mdkg init --agent
- mdkg index
- mdkg status
- mdkg validate
- mdkg search <query>
- mdkg show WORK_ID
- mdkg goal next
- mdkg pack WORK_ID
- mdkg handoff create WORK_ID
- mdkg task done TASK_ID --checkpoint "Meaningful milestone"

## Safety boundaries

Do not store raw secrets, tokens, private keys, provider payloads, unredacted prompt text, private graph dumps, or bulky runtime traces in mdkg nodes, packs, checkpoints, or handoffs.

Handoff raw-marker warnings and no-secret checks are safety aids, not comprehensive data-loss prevention.

## Public docs map

- /quickstart
- /trust
- /alpha
- https://docs.mdkg.dev/
- /llms.txt
- /sitemap.xml

Use the generated CLI reference from docs/_generated/cli-reference.md when working from the repository source.
`;

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8"
    }
  });
}
