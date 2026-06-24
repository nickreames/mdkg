export const prerender = true;

export function GET() {
  const body = [
    "# Markdown Knowledge Graph",
    "",
    "Markdown Knowledge Graph (mdkg) is git-native project memory for AI coding agents and AI-native software engineering.",
    "",
    "## Core promise",
    "",
    "- Structured Markdown and frontmatter stay in the repo.",
    "- mdkg builds deterministic context packs, goals, checkpoints, skills, and handoffs.",
    "- Markdown is the source of truth; generated indexes are rebuildable.",
    "- mdkg does not execute work automatically.",
    "- mdkg does not execute skill scripts.",
    "- MCP is read-only in the current public alpha.",
    "- Advanced graph, cache, bundle, and database contracts may change before v1.",
    "",
    "## Start",
    "",
    "- Install: npm install -g mdkg",
    "- Initialize: mdkg init --agent",
    "- Index: mdkg index",
    "- Inspect: mdkg status",
    "- Validate: mdkg validate",
    "- Pack context: mdkg pack WORK_ID",
    "- Handoff: mdkg handoff create WORK_ID",
    "",
    "## Agent path",
    "",
    "1. Read AGENT_START.md.",
    "2. Run mdkg status.",
    "3. Inspect the current goal with mdkg goal current.",
    "4. Run mdkg goal next.",
    "5. Show and pack one work node with mdkg show WORK_ID and mdkg pack WORK_ID.",
    "6. Do work outside mdkg.",
    "7. Record evidence with checkpoints, handoffs, or task updates.",
    "8. Validate with mdkg validate before closeout.",
    "",
    "## Agent-readable paths",
    "",
    "- https://mdkg.dev/",
    "- https://mdkg.dev/quickstart",
    "- https://mdkg.dev/trust",
    "- https://mdkg.dev/alpha",
    "- https://docs.mdkg.dev/",
    "- https://mdkg.dev/llms-full.txt",
    "",
    "## Agent guidance",
    "",
    "Prefer mdkg pack WORK_ID over ad hoc file lists when building context for bounded work.",
    "Use concrete ids from the repository, such as GOAL_ID, TASK_ID, SPIKE_ID, or CHECKPOINT_ID.",
    "Do not store raw secrets, tokens, private prompts, provider payloads, or bulky runtime traces in mdkg.",
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8"
    }
  });
}
