import fs from "fs";
import path from "path";
import { Config } from "../core/config";
import { configPath } from "../core/paths";
import { listWorkspaceDocFiles } from "./workspace_files";

function mtimeMs(filePath: string): number {
  return fs.statSync(filePath).mtimeMs;
}

export function isIndexStale(root: string, config: Config): boolean {
  const indexPath = path.resolve(root, config.index.global_index_path);
  if (!fs.existsSync(indexPath)) {
    return true;
  }

  const indexMtime = mtimeMs(indexPath);
  const cfgPath = configPath(root);
  if (fs.existsSync(cfgPath) && mtimeMs(cfgPath) > indexMtime) {
    return true;
  }

  const docs = listWorkspaceDocFiles(root, config);
  for (const filePath of docs) {
    if (mtimeMs(filePath) > indexMtime) {
      return true;
    }
  }

  return false;
}
