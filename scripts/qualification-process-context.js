// Loaded only by the qualification supervisor before a Node fixture entrypoint.
// A marker carries no PID or filesystem authority and cannot authorize cleanup.
// Nested supervised children stay in the owning outer process group.
globalThis[Symbol.for("mdkg.qualification.supervised-child")] = true;
