export type ParsedArgs = {
  root?: string;
  help: boolean;
  positionals: string[];
  flags: Record<string, string | boolean>;
  error?: string;
};

const NORMALIZE_VALUE_FLAGS = new Set(["--ws", "--type", "--status", "--template", "--epic"]);

const FLAG_ALIASES: Record<string, string> = {
  "--o": "--out",
  "-o": "--out",
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
};

function normalizeFlag(flag: string): string {
  return FLAG_ALIASES[flag] ?? flag;
}

export function parseArgs(argv: string[]): ParsedArgs {
  const result: ParsedArgs = {
    help: false,
    positionals: [],
    flags: {},
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") {
      result.help = true;
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
      const inlineValue = eqIndex === -1 ? undefined : arg.slice(eqIndex + 1);

      if (flag === "--root") {
        const value = inlineValue ?? argv[i + 1];
        if (!value) {
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
      if (value === undefined || value.startsWith("--")) {
        result.flags[flag] = true;
        continue;
      }
      if (inlineValue === undefined) {
        i += 1;
      }
      result.flags[flag] = NORMALIZE_VALUE_FLAGS.has(flag) ? value.toLowerCase() : value;
      continue;
    }

    result.positionals.push(arg.toLowerCase());
  }

  return result;
}
