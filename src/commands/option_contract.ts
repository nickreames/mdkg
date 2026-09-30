import type { ParsedArgs } from "../util/argparse";
import { optionValueKind } from "../util/argparse";
import { ALLOWED_TYPES, WORK_TYPES } from "../graph/node";
import { isAgentFileType } from "../graph/agent_file_types";

const QUERY = "json xml toon md";
const CACHE = "no-cache no-reindex";
const WORK = "ws json";
const TASK = `${WORK} run-id note`;
const POLICY = "contract-profile validation-policy-ref evidence-policy-ref receipt-kind redaction-class";
const read = `${QUERY} ${CACHE}`;

// Concrete dispatch paths, not family-wide unions. Parsing a shared options
// object does not make its unused fields supported by every downstream handler.
const definitions: Record<string, string> = {
  init: "force agent graph-only no-update-ignores update-gitignore update-npmignore update-dockerignore",
  upgrade: "dry-run apply resume recover plan-hash only json",
  guide: "",
  index: "tolerant",
  new: `id ws status priority epic parent prev next relates blocked-by blocks links artifacts refs aliases skills cases tags owners supersedes template ${POLICY} ${CACHE} run-id json`,
  show: `ws meta ${read}`,
  list: `ws type status epic priority blocked tags tags-mode ${read}`,
  search: `ws type status tags tags-mode limit ${read}`,
  pack: `ws depth edges verbose concise strip-code format pack-profile max-code-lines max-chars max-lines max-tokens skills skills-depth visibility dry-run stats stats-out truncation-report out list-profiles ${CACHE}`,
  "handoff create": "ws out depth json",
  next: `ws ${CACHE}`,
  "checkpoint new": `${TASK} relates scope kind status priority template`,
  validate: "out json-out quiet changed-only summary limit json",
  status: "json",
  "mcp serve": "stdio",
  "fix plan": "family target base-ref json",
  "fix apply": "family target base-ref json",
  "fix ids": "target base-ref apply json",
  format: "headings dry-run apply summary limit json",
  doctor: `strict json ${CACHE}`,
  "workspace ls": "json",
  "workspace add": "mdkg-dir visibility json",
  "workspace rm": "json",
  "workspace enable": "json",
  "workspace disable": "json",
  "db index rebuild": "tolerant json",
  "db index status": "tolerant json",
  "db index verify": "tolerant json",
  "db init": "json",
  "db migrate": "json",
  "db verify": "json",
  "db stats": "json",
  "db queue create": "paused reason json",
  "db queue contract": "json",
  "db queue pause": "reason json",
  "db queue resume": "json",
  "db queue enqueue": "payload-json payload-file dedupe-key available-at-ms max-attempts json",
  "db queue claim": "lease-owner lease-ms json",
  "db queue ack": "lease-owner json",
  "db queue fail": "lease-owner error retry-after-ms json",
  "db queue dead-letter": "lease-owner error json",
  "db queue release-expired": "json",
  "db queue stats": "json",
  "db queue list": "status limit json",
  "db queue show": "json",
  "db snapshot seal": "queue-policy json",
  "db snapshot verify": "json",
  "db snapshot status": "json",
  "db snapshot dump": "snapshot out json",
  "db snapshot diff": "json",
  "capability list": `kind visibility json ${CACHE}`,
  "capability search": `kind visibility json ${CACHE}`,
  "capability show": `json ${CACHE}`,
  "capability resolve": `kind visibility requires fresh-only json ${CACHE}`,
  "manifest list": `json ${CACHE}`,
  "manifest show": `json ${CACHE}`,
  "manifest validate": `json ${CACHE}`,
  "spec list": `json ${CACHE}`,
  "spec show": `json ${CACHE}`,
  "spec validate": `json ${CACHE}`,
  "archive add": "id ws kind title refs relates visibility json",
  "archive list": "ws kind visibility json",
  "archive show": WORK,
  "archive verify": WORK,
  "archive compress": `all ${WORK}`,
  "bundle create": "pack-profile ws out json",
  "bundle list": "json",
  "bundle show": "json",
  "bundle verify": "json",
  "graph migrate": "graph-id origin ancestor decisions apply plan-hash json",
  "graph reconcile": "ancestor incoming target decisions apply plan-hash json",
  "graph recover": "resume rollback lock-evidence confirm-quiescent json",
  "graph clone": "target json",
  "graph fork": "target start-goal json",
  "graph import-template": "start-goal id-prefix dry-run apply select-goal json",
  "graph refs": WORK,
  "git inspect": "json",
  "subgraph add": "visibility pack-profile source-path source-repo max-stale-seconds json",
  "subgraph list": "json",
  "subgraph show": "json",
  "subgraph rm": "json",
  "subgraph remove": "json",
  "subgraph enable": "json",
  "subgraph disable": "json",
  "subgraph verify": "all json",
  "subgraph refresh": "all json",
  "subgraph audit": "all target json",
  "subgraph upgrade-plan": "all json",
  "subgraph sync": "all dry-run allow-dirty json",
  "subgraph materialize": "all target clean gitignore json",
  "work trigger": `id title requester enqueue ${WORK}`,
  "work validate": `type ${WORK}`,
  "work contract new": `id agent-id kind inputs outputs required-capabilities contract-profile ${WORK}`,
  "work order new": `id work-id requester request-ref trigger-ref payload-hash input-refs queue-refs requested-outputs constraint-refs contract-profile validation-policy-ref evidence-policy-ref ${WORK}`,
  "work order update": `status add-input-refs add-queue-refs add-artifacts ${WORK}`,
  "work order status": WORK,
  "work receipt new": `id work-order-id outcome receipt-status cost-ref redaction-policy artifacts proof-refs attestation-refs evidence-hashes input-hashes output-hashes ${POLICY} ${WORK}`,
  "work receipt update": `receipt-status add-artifacts add-proof-refs add-attestation-refs add-evidence-hashes ${WORK}`,
  "work receipt verify": WORK,
  "work artifact add": `id kind ${WORK}`,
  "skill new": "description tags authors links with-scripts force run-id json",
  "skill list": `tags tags-mode ${read}`,
  "skill search": `tags tags-mode ${read}`,
  "skill show": `meta ${read}`,
  "skill validate": "json",
  "skill sync": "force json",
  "loop list": `${WORK} ${CACHE}`,
  "loop show": `meta ${WORK} ${CACHE}`,
  "loop fork": `scope title materialization planning-only no-children dry-run run-id ${WORK} ${CACHE}`,
  "loop plan": `${WORK} ${CACHE}`,
  "loop next": `${WORK} ${CACHE}`,
  "loop runs": `${WORK} ${CACHE}`,
  "goal show": WORK,
  "goal select": WORK,
  "goal activate": WORK,
  "goal current": WORK,
  "goal clear": "json",
  "goal next": WORK,
  "goal claim": WORK,
  "goal evaluate": WORK,
  "goal pause": WORK,
  "goal resume": WORK,
  "goal done": WORK,
  "goal archive": WORK,
  "task start": TASK,
  "task update": `status priority add-artifacts add-links add-refs add-skills add-tags add-blocked-by clear-blocked-by ${TASK}`,
  "task done": `add-artifacts add-links add-refs checkpoint checkpoint-kind ${TASK}`,
  "event enable": WORK,
  "event append": `kind status refs artifacts notes run-id agent skill tool ${WORK}`,
};

// Creation flags are a union in parent help, but the chosen node type narrows
// admission. These are the existing new-command restrictions, applied before
// configuration, mutation locks, cache hydration or numeric ID reservation.
for (const requestedType of ALLOWED_TYPES) {
  if (requestedType === "archive") continue; // archive add owns this surface.
  const type = requestedType === "spec" ? "manifest" : requestedType;
  const words = definitions.new.split(" ").filter(word => {
    if (word === "id") return isAgentFileType(type);
    if (word === "status") return WORK_TYPES.has(type) || type === "dec";
    if (["priority", "epic", "parent", "prev", "next", "blocked-by", "blocks", "skills"].includes(word)) return WORK_TYPES.has(type);
    if (word === "cases") return type === "test";
    if (word === "supersedes") return type === "dec";
    if (word === "contract-profile") return ["manifest", "work", "work_order", "receipt"].includes(type);
    if (["validation-policy-ref", "evidence-policy-ref"].includes(word)) return ["manifest", "work_order", "receipt"].includes(type);
    if (["receipt-kind", "redaction-class"].includes(word)) return type === "receipt";
    return true;
  });
  definitions[`new ${requestedType}`] = words.join(" ");
}

export const COMMAND_OPTIONS: Readonly<Record<string, readonly string[]>> = Object.freeze(
  Object.fromEntries(Object.entries(definitions).map(([key, words]) => [key,
    Object.freeze(["--root", "--help", "--version", ...words.split(" ").filter(Boolean).map(word => `--${word}`)])]))
);

const INTEGERS = new Set("priority depth limit max-code-lines max-chars max-lines max-tokens max-stale-seconds lease-ms available-at-ms max-attempts retry-after-ms"
  .split(" ").map(name => `--${name}`));

export function commandOptionKind(command: string, flag: string): "value" | "boolean" | "integer" | undefined {
  if (flag === "--agent") return command === "init" ? "boolean" : "value";
  if (INTEGERS.has(flag)) return "integer";
  return optionValueKind(flag);
}

export function resolveOptionCommand(positionals: readonly string[]): string | undefined {
  for (let length = Math.min(3, positionals.length); length > 0; length--) {
    const key = positionals.slice(0, length).join(" ").toLowerCase();
    if (Object.prototype.hasOwnProperty.call(COMMAND_OPTIONS, key)) return key;
  }
  return undefined;
}

export function optionCommandsForHelp(positionals: readonly string[]): Array<{ command: string; flags: readonly string[] }> {
  const key = positionals.join(" ").toLowerCase();
  if (!key || key === "global" || key === "help") return [];
  return Object.entries(COMMAND_OPTIONS).filter(([command]) => command === key || command.startsWith(`${key} `))
    .map(([command, flags]) => ({ command, flags }));
}

// Pure admission: called by BOTH entrypoints before cwd/config discovery, help,
// package-version reads, output creation, locks, or subprocesses.
export function commandOptionError(parsed: ParsedArgs): string | undefined {
  const help = parsed.help || parsed.positionals[0]?.toLowerCase() === "help";
  const positionals = parsed.positionals[0]?.toLowerCase() === "help"
    ? parsed.positionals.slice(1) : parsed.positionals;
  const key = resolveOptionCommand(positionals);
  const helpPrefix = positionals.join(" ").toLowerCase();
  const listProfiles = parsed.flags["--list-profiles"];
  const allowed = new Set(key === "pack" && !help && (listProfiles === true || listProfiles === "true")
    ? ["--root", "--help", "--version", "--list-profiles"] : key ? COMMAND_OPTIONS[key] : ["--root", "--help", "--version"]);
  if (help && !key) {
    for (const [command, flags] of Object.entries(COMMAND_OPTIONS)) {
      if (command.startsWith(`${helpPrefix} `)) for (const flag of flags) allowed.add(flag);
    }
  }
  for (const { flag, value } of parsed.options ?? Object.entries(parsed.flags).map(([flag, value]) => ({ flag, value }))) {
    if (!allowed.has(flag)) return `${key ?? (helpPrefix || "mdkg")} does not support ${flag}; no command effects attempted`;
    const kind = commandOptionKind(key ?? "", flag);
    if (kind === "boolean") {
      if (value !== true && value !== "true" && value !== "false") return `${flag} must be true or false`;
    } else {
      if (value === true || !String(value).trim()) return `${flag} requires a value`;
      if (kind === "integer" && (!/^[+-]?\d+$/.test(String(value)) || !Number.isSafeInteger(Number(value)))) {
        return `${flag} must be an integer`;
      }
    }
  }
  if (!help && !parsed.version && positionals.length && !key) {
    if (positionals[0].toLowerCase() === "git") return "git requires inspect";
    // Existing command handlers retain their specific missing/unknown-subcommand
    // diagnostics. No supported options are admitted for unknown command paths.
    return undefined;
  }
  if (!help && ["init", "index", "guide"].includes(key ?? "") && positionals.length > 1) {
    return `${key} does not accept positional arguments`;
  }
  return undefined;
}
