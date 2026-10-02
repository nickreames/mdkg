/** Reviewed legacy alias repair, not identity migration or arbitrary text replacement.
 * Match standalone aliases and explicit graph references in the owning workspace.
 * Foreign qualifiers, longer IDs, opaque URLs and filename substrings stay intact.
 */
export function rewriteLegacyIdReferences(value: string, from: string, to: string, workspace: string): { text: string; count: number } {
  const escaped = from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`(^|[^\\p{L}\\p{N}_./:\\\\-])(?:(mdkg:\\/\\/|archive:\\/\\/))?(?:([A-Za-z0-9_.-]+):)?${escaped}(?![\\p{L}\\p{N}_:/\\\\-]|\\.[\\p{L}\\p{N}_])`, "giu");
  const uris = Array.from(value.matchAll(/[a-z][a-z0-9+.-]*:\/\/[^\s<>"']+/giu), match => ({ start: match.index!, end: match.index! + match[0].length }));
  let uriIndex = 0;
  let count = 0;
  const text = value.replace(pattern, (match, prefix: string, scheme: string | undefined, owner: string | undefined, offset: number) => {
    const start = offset + prefix.length;
    while (uriIndex < uris.length && uris[uriIndex].end <= start) uriIndex++;
    const uri = uris[uriIndex];
    if (uri && uri.start <= start && (!scheme || uri.start !== start)) return match;
    if (owner && owner.toLowerCase() !== workspace.toLowerCase()) return match;
    count++;
    return prefix + (scheme ?? "") + (owner ? owner + ":" : "") + to;
  });
  return { text, count };
}
