import fs from "fs";
import path from "path";

export function readPackageVersion(startDir = __dirname): string {
  let current = path.resolve(startDir);
  for (let i = 0; i < 5; i += 1) {
    const packagePath = path.join(current, "package.json");
    if (fs.existsSync(packagePath)) {
      try {
        const raw = JSON.parse(fs.readFileSync(packagePath, "utf8")) as { name?: unknown; version?: unknown };
        if (raw.name === "mdkg" && typeof raw.version === "string" && raw.version.trim().length > 0) {
          return raw.version;
        }
      } catch {
        return "unknown";
      }
    }
    const parent = path.dirname(current);
    if (parent === current) {
      break;
    }
    current = parent;
  }
  return "unknown";
}
