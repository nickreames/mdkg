import { readContainedFileIfPresent } from "../core/filesystem_authority";
import { migrateConfig } from "../core/migrate";
import { readGraphFormat } from "../graph/identity";

/** Fresh authored admission, never authority borrowed from a prepared/cache Config.
 * Config-less bootstrap remains possible; neither parsing step writes anything.
 * This is compatibility admission, not a writer lease or a recovery decision.
 */
export function assertCompatibleWriter(root: string): void {
  readGraphFormat(root);
  const raw = readContainedFileIfPresent({ root, relativePath: ".mdkg/config.json" });
  if (raw !== null) migrateConfig(JSON.parse(raw));
}
