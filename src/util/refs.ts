import { isPortableId } from "./id";

const URI_RE = /^[a-z][a-z0-9+.-]*:\/\/\S+$/i;
const ARCHIVE_URI_RE = /^archive:\/\/([a-z][a-z0-9_]*(?:[._-][a-z0-9_]+)*)$/;
const SHA256_RE = /^sha256:[a-f0-9]{64}$/;

export function isUriRef(value: string): boolean {
  return URI_RE.test(value);
}

export function archiveIdFromUri(value: string): string | undefined {
  const match = ARCHIVE_URI_RE.exec(value);
  if (!match) {
    return undefined;
  }
  return match[1];
}

export function isArchiveUri(value: string): boolean {
  return archiveIdFromUri(value) !== undefined;
}

export function isSha256Ref(value: string): boolean {
  return SHA256_RE.test(value);
}

export function isPortableOrUriRef(value: string): boolean {
  return isPortableId(value.toLowerCase()) || isUriRef(value);
}

export function validatePortableOrUriRef(value: string): boolean {
  if (isUriRef(value)) {
    if (value.startsWith("archive://")) {
      return archiveIdFromUri(value) !== undefined;
    }
    return true;
  }
  return value === value.toLowerCase() && isPortableId(value);
}
