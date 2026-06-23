export const prerender = true;

export function GET() {
  const body = `# Markdown Knowledge Graph

Markdown Knowledge Graph (mdkg) is git-native project memory for AI-native software engineering.

Core promise:
- Structured Markdown and frontmatter stay in the repo.
- mdkg builds deterministic context packs, goals, checkpoints, skills, and handoffs.
- Markdown is the source of truth; generated indexes are rebuildable.
- mdkg does not execute work automatically.
- MCP is read-only in the current public alpha.

Start:
- Install: npm install -g mdkg
- Initialize: mdkg init --agent
- Index: mdkg index
- Inspect: mdkg status
- Validate: mdkg validate
- Pack context: mdkg pack <id>
- Handoff: mdkg handoff create <id>

Important pages:
- /quickstart
- /trust
- /alpha
- /docs
- /sitemap.xml

Agents should prefer mdkg pack <id> over ad hoc file lists when building context for work.
`;

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8"
    }
  });
}
