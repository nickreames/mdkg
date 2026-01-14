import fs from "fs";

export function readVerboseCoreList(listPath: string): string[] {
  if (!fs.existsSync(listPath)) {
    throw new Error(`verbose core list not found: ${listPath}`);
  }

  const raw = fs.readFileSync(listPath, "utf8");
  const lines = raw.split(/\r?\n/);
  const ids: string[] = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }
    ids.push(trimmed.toLowerCase());
  }
  return ids;
}
