export type ParsedArgs = {
  root?: string;
  help: boolean;
  positionals: string[];
  flags: Record<string, string | boolean>;
  error?: string;
};

const NORMALIZE_VALUE_FLAGS = new Set(["--ws", "--type", "--status", "--template"]);

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

    if (arg.startsWith("--")) {
      const eqIndex = arg.indexOf("=");
      const flag = eqIndex === -1 ? arg : arg.slice(0, eqIndex);
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
