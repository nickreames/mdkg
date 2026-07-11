export type LoopRefBinding = {
  identity: string;
  ref: string;
};

const LOOP_IDENTITY_RE = /^[a-z0-9][a-z0-9._-]*$/;

export function isLoopIdentity(value: string): boolean {
  return LOOP_IDENTITY_RE.test(value);
}

export function parseLoopRefBinding(value: string): LoopRefBinding | undefined {
  const separator = value.indexOf("=");
  if (separator <= 0 || separator === value.length - 1) {
    return undefined;
  }
  const identity = value.slice(0, separator).trim().toLowerCase();
  const ref = value.slice(separator + 1).trim();
  if (!isLoopIdentity(identity) || !ref) {
    return undefined;
  }
  return { identity, ref };
}

export function parseLoopRefBindings(values: string[]): LoopRefBinding[] {
  return values.flatMap((value) => {
    const binding = parseLoopRefBinding(value);
    return binding ? [binding] : [];
  });
}

export function groupLoopRefBindings(bindings: LoopRefBinding[]): Map<string, string[]> {
  const grouped = new Map<string, string[]>();
  for (const binding of bindings) {
    const refs = grouped.get(binding.identity) ?? [];
    if (!refs.includes(binding.ref)) {
      refs.push(binding.ref);
    }
    grouped.set(binding.identity, refs);
  }
  return grouped;
}
