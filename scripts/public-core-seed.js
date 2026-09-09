const fs = require("node:fs");
const path = require("node:path");

// Deliberate public inventory, not a projection of the maintainer's live graph.
// Keep historical filenames and aliases stable for managed upgrade provenance.
const CORE_IDS = Object.freeze({
  "COLLABORATION.md": "rule-7",
  "HUMAN.md": "rule-human",
  "SOUL.md": "rule-soul",
  "guide.md": "rule-guide",
  "rule-1-mdkg-conventions.md": "rule-1",
  "rule-2-context-pack-rules.md": "rule-2",
  "rule-3-cli-contract.md": "rule-3",
  "rule-4-repo-safety-and-ignores.md": "rule-4",
  "rule-5-release-and-versioning.md": "rule-5",
  "rule-6-templates-and-schemas.md": "rule-6",
});
const REQUIRED_ALIASES = Object.freeze({
  "COLLABORATION.md": ["collaboration", "operator-profile"],
  "HUMAN.md": ["human"],
  "SOUL.md": ["soul", "system-contract"],
});

function assertPublicCoreSeed({ publicRoot, builtRoot, runtimeRoot = path.resolve(__dirname, "../dist") }) {
  const { parseFrontmatter } = require(path.join(runtimeRoot, "graph/frontmatter.js"));
  const { parseNode } = require(path.join(runtimeRoot, "graph/node.js"));
  const { loadTemplateSchemas } = require(path.join(runtimeRoot, "graph/template_schema.js"));
  const { validateConfigSchema } = require(path.join(runtimeRoot, "core/config.js"));
  const { mapGraphReferenceFields } = require(path.join(runtimeRoot, "graph/identity_refs.js"));
  const repoRoot = path.resolve(__dirname, "..");
  const config = validateConfigSchema(JSON.parse(fs.readFileSync(path.join(repoRoot, "assets/init/config.json"), "utf8")));
  const templateSchemas = loadTemplateSchemas(repoRoot, config, ["rule"]);
  const expected = [...Object.keys(CORE_IDS), "core.md"].sort();
  function inventory(root) {
    if (!fs.lstatSync(root).isDirectory()) throw new Error(`public core seed must be a directory: ${root}`);
    const actual = fs.readdirSync(root).sort();
    if (JSON.stringify(actual) !== JSON.stringify(expected)) throw new Error(`public core seed inventory mismatch: ${root}`);
    for (const file of actual) {
      if (!fs.lstatSync(path.join(root, file)).isFile()) throw new Error(`public core seed must be a regular file: ${file}`);
    }
  }
  inventory(publicRoot);
  const nodes = new Map();
  const aliases = new Map();
  for (const [file, id] of Object.entries(CORE_IDS)) {
    const content = fs.readFileSync(path.join(publicRoot, file), "utf8");
    const { frontmatter } = parseFrontmatter(content, file);
    if (frontmatter.id !== id || frontmatter.type !== "rule") throw new Error(`public core seed identity mismatch: ${file}`);
    if ("graph_id" in frontmatter || "node_id" in frontmatter) throw new Error(`public core seed contains adopted identity: ${file}`);
    if (!Array.isArray(frontmatter.aliases) || frontmatter.aliases.some(alias => typeof alias !== "string" || !alias)) {
      throw new Error(`public core seed aliases must be a string list: ${file}`);
    }
    for (const alias of REQUIRED_ALIASES[file] || []) {
      if (!frontmatter.aliases.includes(alias)) throw new Error(`public core seed missing compatibility alias: ${file} ${alias}`);
    }
    for (const alias of [id, ...(frontmatter.aliases || [])]) {
      if (aliases.has(alias)) throw new Error(`public core seed duplicate alias: ${alias}`);
      aliases.set(alias, id);
    }
    // The reference mapper traverses more shapes than this node type accepts
    // (for example loop bindings). First enforce the actual rule schema and
    // reference syntax used by normal graph validation.
    parseNode(content, file, {
      workStatusEnum: config.work.status_enum,
      priorityMin: config.work.priority_min,
      priorityMax: config.work.priority_max,
      templateSchemas,
    });
    nodes.set(file, frontmatter);
  }
  for (const [file, frontmatter] of nodes) {
    mapGraphReferenceFields(frontmatter, (ref, field) => {
      const local = ref.startsWith("root:") ? ref.slice(5) : ref;
      // Free-form search aliases are metadata, not node IDs accepted by graph
      // reference resolution. Do not let a matching alias hide a dangling edge.
      if (!Object.values(CORE_IDS).includes(local)) throw new Error(`public core seed unbound reference: ${file} ${field} ${ref}`);
      return ref;
    });
  }
  const pins = fs.readFileSync(path.join(publicRoot, "core.md"), "utf8").split(/\r?\n/)
    .map(line => line.trim()).filter(line => line && !line.startsWith("#"));
  if (new Set(pins).size !== pins.length || JSON.stringify([...pins].sort()) !== JSON.stringify(Object.values(CORE_IDS).sort())) {
    throw new Error("public core seed pins must name each public node exactly once");
  }
  if (builtRoot) {
    inventory(builtRoot);
    for (const file of expected) {
      if (!fs.readFileSync(path.join(publicRoot, file)).equals(fs.readFileSync(path.join(builtRoot, file)))) {
        throw new Error(`public core seed built parity mismatch: ${file}`);
      }
    }
  }
  return { files: expected, node_count: nodes.size };
}

module.exports = { CORE_IDS, assertPublicCoreSeed };
