// Repository release policy, not a rule imposed on downstream mdkg projects.
const fs = require("node:fs");
const path = require("node:path");

function repositorySkillBodyDiagnostics(source) {
  return /\b(?:mdkg\.dev|Vercel|omni-chat-rooms)\b/i.test(source)
    ? ["named internal product or provider"] : [];
}

function assertRepositoryPublicSkills(publicRoot) {
  for (const entry of fs.readdirSync(publicRoot, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const source = fs.readFileSync(path.join(publicRoot, entry.name, "SKILL.md"), "utf8");
    const diagnostics = repositorySkillBodyDiagnostics(source);
    if (diagnostics.length) throw new Error(`${entry.name}: ${diagnostics.join(", ")}`);
  }
}

module.exports = { repositorySkillBodyDiagnostics, assertRepositoryPublicSkills };
