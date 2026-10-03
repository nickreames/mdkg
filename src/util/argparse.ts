export type ParsedArgs = {
  root?: string;
  help: boolean;
  version: boolean;
  positionals: string[];
  flags: Record<string, string | boolean>;
  // Preserve every occurrence so a later valid value cannot hide malformed input.
  options?: Array<{ flag: string; value: string | boolean }>;
  error?: string;
};

const NORMALIZE_VALUE_FLAGS = new Set(["--ws", "--type", "--status", "--template", "--epic"]);

const VALUE_FLAGS = new Set([
  "--plan", "--owner", "--file", "--work-ref", "--summary-file", "--archive-id",
  "--root",
  "--id",
  "--ws",
  "--type",
  "--status",
  "--template",
  "--epic",
  "--priority",
  "--depth",
  "--edges",
  "--format",
  "--out",
  "--json-out",
  "--output",
  "--limit",
  "--relates",
  "--scope",
  "--blocked-by",
  "--blocks",
  "--prev",
  "--next",
  "--links",
  "--artifacts",
  "--refs",
  "--aliases",
  "--tags",
  "--owners",
  "--supersedes",
  "--cases",
  "--mdkg-dir",
  "--pack-profile",
  "--max-code-lines",
  "--max-chars",
  "--max-lines",
  "--max-tokens",
  "--stats-out",
  "--truncation-report",
  "--description",
  "--authors",
  "--links",
  "--tags-mode",
  "--run-id",
  "--note",
  "--add-artifacts",
  "--add-links",
  "--add-refs",
  "--add-skills",
  "--add-tags",
  "--add-blocked-by",
  "--checkpoint",
  "--kind",
  "--title",
  "--agent-id",
  "--inputs",
  "--outputs",
  "--required-capabilities",
  "--work-id",
  "--requester",
  "--request-ref",
  "--trigger-ref",
  "--payload-hash",
  "--input-refs",
  "--queue-refs",
  "--requested-outputs",
  "--constraint-refs",
  "--add-queue-refs",
  "--enqueue",
  "--receipt-status",
  "--work-order-id",
  "--outcome",
  "--cost-ref",
  "--redaction-policy",
  "--proof-refs",
  "--attestation-refs",
  "--evidence-hashes",
  "--input-hashes",
  "--output-hashes",
  "--add-input-refs",
  "--add-proof-refs",
  "--add-attestation-refs",
  "--add-evidence-hashes",
  "--notes",
  "--agent",
  "--skill",
  "--tool",
  "--visibility",
  "--source-path",
  "--source-repo",
  "--max-stale-seconds",
  "--queue-policy",
  "--requires",
  "--target",
  "--snapshot",
  "--family",
  "--start-goal",
  "--id-prefix",
  "--graph-id",
  "--origin",
  "--ancestor",
  "--incoming",
  "--decisions",
  "--plan-hash",
  "--lock-evidence",
  "--lease-owner", "--lease-ms", "--payload-json", "--payload-file", "--dedupe-key",
  "--available-at-ms", "--max-attempts", "--retry-after-ms", "--error", "--reason",
  "--contract-profile", "--validation-policy-ref", "--evidence-policy-ref",
  "--receipt-kind", "--redaction-class", "--materialization", "--checkpoint-kind",
  "--only", "--parent", "--skills", "--skills-depth", "--base-ref",
]);

const BOOLEAN_FLAGS = new Set([
  "--tolerant",
  "--blocked",
  "--verbose",
  "--quiet",
  "--no-cache",
  "--no-reindex",
  "--no-update-ignores",
  "--graph-only",
  "--resume",
  "--recover",
  "--rollback",
  "--confirm-quiescent",
  "--force",
  "--update-gitignore",
  "--update-npmignore",
  "--update-dockerignore",
  "--agent",
  "--agents",
  "--claude",
  "--llm",
  "--body",
  "--meta",
  "--strip-code",
  "--stats",
  "--concise",
  "--version",
  "--dry-run",
  "--apply",
  "--json",
  "--summary",
  "--xml",
  "--toon",
  "--md",
  "--list-profiles",
  "--with-scripts",
  "--clear-blocked-by",
  "--all",
  "--fresh-only",
  "--allow-dirty",
  "--clean",
  "--gitignore",
  "--select-goal",
  "--stdio",
  "--help",
  "--paused", "--planning-only", "--no-children", "--changed-only", "--headings", "--strict",
  "--confirm-stopped", "--confirm-loss",
]);

export const FLAG_ALIASES: Readonly<Record<string, string>> = {
  "--o": "--out",
  "-o": "--out",
  "--output": "--out",
  "--profile": "--pack-profile",
  "--f": "--format",
  "-f": "--format",
  "--v": "--verbose",
  "-v": "--verbose",
  "--d": "--depth",
  "-d": "--depth",
  "--e": "--edges",
  "-e": "--edges",
  "--w": "--ws",
  "-w": "--ws",
  "--r": "--root",
  "-r": "--root",
  "--q": "--quiet",
  "-q": "--quiet",
  "--V": "--version",
  "-V": "--version",
  "--h": "--help",
  "-h": "--help",
};

export function normalizeFlag(flag: string): string {
  return FLAG_ALIASES[flag] ?? flag;
}

function isFlagToken(token: string): boolean {
  // Unknown options must not become a preceding option's path/value. Negative
  // numbers and a lone dash remain ordinary values; option-looking text can use =.
  return token === "--" || (token.startsWith("-") && token !== "-" && !/^-\d/.test(token));
}

export function optionValueKind(flag: string): "value" | "boolean" | undefined {
  if (VALUE_FLAGS.has(flag)) return "value";
  if (BOOLEAN_FLAGS.has(flag)) return "boolean";
  return undefined;
}

function parseTokens(argv: string[], booleanAgent: boolean): ParsedArgs {
  const result: ParsedArgs = {
    help: false,
    version: false,
    positionals: [],
    flags: {},
    options: [],
  };

  const record = (flag: string, value: string | boolean): void => {
    result.flags[flag] = value;
    result.options!.push({ flag, value });
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--") {
      result.positionals.push(...argv.slice(i + 1));
      break;
    }
    if (arg === "--help" || arg === "-h") {
      result.help = true;
      record("--help", true);
      continue;
    }
    if (arg === "--version" || arg === "-V") {
      result.version = true;
      record("--version", true);
      continue;
    }

    let normalizedArg = arg;
    // Single-character aliases accept the same inline syntax as long options.
    if (/^-[^-](?:=|$)/.test(normalizedArg)) {
      normalizedArg = `--${normalizedArg.slice(1)}`;
    }

    if (isFlagToken(normalizedArg)) {
      const eqIndex = normalizedArg.indexOf("=");
      const flagRaw = eqIndex === -1 ? normalizedArg : normalizedArg.slice(0, eqIndex);
      const flag = normalizeFlag(flagRaw);
      const inlineValue = eqIndex === -1 ? undefined : normalizedArg.slice(eqIndex + 1);

      if (flag === "--help" || flag === "--version") {
        const enabled = inlineValue === undefined || inlineValue === "true";
        record(flag, inlineValue ?? true);
        if (flag === "--help") result.help = enabled;
        else result.version = enabled;
        continue;
      }

      if (flag === "--root") {
        const value = inlineValue ?? argv[i + 1];
        if (!value || (inlineValue === undefined && isFlagToken(value))) {
          result.error = "--root requires a path";
          return result;
        }
        if (inlineValue === undefined) {
          i += 1;
        }
        result.root = value;
        record(flag, value);
        continue;
      }

      const value = inlineValue ?? argv[i + 1];
      const supportsValue = VALUE_FLAGS.has(flag) && !(flag === "--agent" && booleanAgent);
      const supportsBoolean = BOOLEAN_FLAGS.has(flag) && (flag !== "--agent" || booleanAgent);

      if (supportsValue) {
        if (value === undefined || (inlineValue === undefined && isFlagToken(value)) || !value.trim()) {
          result.error = `${flag} requires a value`;
          return result;
        }
        if (inlineValue === undefined) {
          i += 1;
        }
        record(flag, NORMALIZE_VALUE_FLAGS.has(flag) ? value.toLowerCase() : value);
        continue;
      }

      if (supportsBoolean) {
        record(flag, inlineValue ?? true);
        continue;
      }

      // Retain the token for command-specific refusal, without swallowing a
      // command, title, or another option as an unknown option's guessed value.
      record(flag, inlineValue ?? true);
      continue;
    }

    result.positionals.push(arg);
  }

  return result;
}

export function parseArgs(argv: string[]): ParsedArgs {
  // --agent is boolean only for init and valued for event append. Probe without
  // effects so flags may precede the command, including an event agent named init.
  const booleanParse = parseTokens(argv, true);
  const commandPositionals = booleanParse.positionals[0]?.toLowerCase() === "help"
    ? booleanParse.positionals.slice(1) : booleanParse.positionals;
  if (commandPositionals[0]?.toLowerCase() === "init" && commandPositionals.length === 1) {
    return booleanParse;
  }
  if (!booleanParse.options?.some(option => option.flag === "--agent")) return booleanParse;
  return parseTokens(argv, false);
}
