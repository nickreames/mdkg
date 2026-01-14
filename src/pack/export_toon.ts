import { PackResult } from "./types";
import { exportJson } from "./export_json";

export function exportToon(pack: PackResult): string {
  return exportJson(pack);
}
