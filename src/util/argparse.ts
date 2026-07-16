export type ParsedArgs = {
  root?: string;
  help: boolean;
  version: boolean;
  positionals: string[];
  flags: Record<string, string | boolean>;
  error?: string;
};

const NORMALIZE_VALUE_FLAGS = new Set(["--ws", "--type", "--status", "--template", "--epic"]);

const VALUE_FLAGS = new Set([
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
  "--pricing-model",
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
  "--remote",
  "--branch",
  "--message",
  "--max-stale-seconds",
  "--queue-policy",
  "--requires",
  "--target",
  "--request",
  "--snapshot",
  "--family",
  "--start-goal",
  "--id-prefix",
]);

const BOOLEAN_FLAGS = new Set([
  "--tolerant",
  "--blocked",
  "--verbose",
  "--quiet",
  "--no-cache",
  "--no-reindex",
  "--no-update-ignores",
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
  "--stage-all",
  "--stdio",
]);

const FLAG_ALIASES: Record<string, string> = {
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
};

function normalizeFlag(flag: string): string {
  return FLAG_ALIASES[flag] ?? flag;
}

function normalizeFlagToken(token: string): string | undefined {
  if (!token.startsWith("-")) {
    return undefined;
  }
  let normalized = token;
  if (!normalized.startsWith("--") && normalized.length === 2) {
    normalized = `--${normalized.slice(1)}`;
  }
  const eqIndex = normalized.indexOf("=");
  const flag = eqIndex === -1 ? normalized : normalized.slice(0, eqIndex);
  return normalizeFlag(flag);
}

function isFlagToken(token: string): boolean {
  const flag = normalizeFlagToken(token);
  if (!flag) {
    return false;
  }
  return VALUE_FLAGS.has(flag) || BOOLEAN_FLAGS.has(flag) || flag === "--help";
}

export function parseArgs(argv: string[]): ParsedArgs {
  const result: ParsedArgs = {
    help: false,
    version: false,
    positionals: [],
    flags: {},
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") {
      result.help = true;
      continue;
    }
    if (arg === "--version" || arg === "-V") {
      result.version = true;
      continue;
    }

    let normalizedArg = arg;
    if (normalizedArg.startsWith("-") && !normalizedArg.startsWith("--")) {
      if (normalizedArg.length === 2) {
        normalizedArg = `--${normalizedArg.slice(1)}`;
      }
    }

    if (normalizedArg.startsWith("--")) {
      const eqIndex = normalizedArg.indexOf("=");
      const flagRaw = eqIndex === -1 ? normalizedArg : normalizedArg.slice(0, eqIndex);
      const flag = normalizeFlag(flagRaw);
      const inlineValue = eqIndex === -1 ? undefined : normalizedArg.slice(eqIndex + 1);

      if (flag === "--root") {
        const value = inlineValue ?? argv[i + 1];
        if (!value || isFlagToken(value)) {
          result.error = "--root requires a path";
          return result;
        }
        if (inlineValue === undefined) {
          i += 1;
        }
        result.root = value;
        result.flags[flag] = value;
        continue;
      }

      const value = inlineValue ?? argv[i + 1];
      const supportsValue = VALUE_FLAGS.has(flag);
      const supportsBoolean = BOOLEAN_FLAGS.has(flag);

      if (supportsValue) {
        if (value === undefined || isFlagToken(value)) {
          if (supportsBoolean) {
            result.flags[flag] = true;
            continue;
          }
          result.flags[flag] = true;
          continue;
        }
        if (inlineValue === undefined) {
          i += 1;
        }
        result.flags[flag] = NORMALIZE_VALUE_FLAGS.has(flag) ? value.toLowerCase() : value;
        continue;
      }

      if (supportsBoolean) {
        result.flags[flag] = true;
        continue;
      }

      if (value === undefined || isFlagToken(value)) {
        result.flags[flag] = true;
        continue;
      }
      if (inlineValue === undefined) {
        i += 1;
      }
      result.flags[flag] = NORMALIZE_VALUE_FLAGS.has(flag) ? value.toLowerCase() : value;
      continue;
    }

    result.positionals.push(arg);
  }

  return result;
}
