import path from "path";

export function resolveRoot(rootArg?: string): string {
  return rootArg ? path.resolve(rootArg) : process.cwd();
}

export function configPath(root: string): string {
  return path.join(root, ".mdkg", "config.json");
}
