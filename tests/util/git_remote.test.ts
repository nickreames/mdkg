import { test } from "node:test";
import assert from "node:assert/strict";
const { redactRemoteRef } = require("../../util/git_remote");

test("remote provenance descriptors keep ordinary names and are idempotent", () => {
  const values = ["https://example.invalid/repo%3Fpart%23name", "git://example.invalid/repo",
    "ssh://example.invalid:2222/org/repo", "ftp://example.invalid/repo", "ftps://example.invalid/repo",
    "file:///tmp/repo", "file:///tmp/user:literal@name", "https://example.invalid/path@name",
    "https://example.invalid\\path@name", "git@example.invalid:org/repo", "host:repo", "../repo?name#part",
    "C:\\repos\\project", "\\\\server\\share\\project", "main@abcd1234", "project", ""];
  for (const value of values) assert.equal(redactRemoteRef(value), value);
  for (const value of [...values, "https://token@example.invalid/repo?q=secret#secret", "helper::opaque"]) {
    assert.equal(redactRemoteRef(redactRemoteRef(value)), redactRemoteRef(value));
  }
});

test("remote provenance discards userinfo and every query or fragment", () => {
  for (const scheme of ["https", "http", "ssh", "git", "ftp", "ftps", "HTTPS"]) {
    assert.equal(redactRemoteRef(`${scheme}://user:pass@example.invalid/repo?any=secret#fragment`),
      `${scheme}://<redacted>@example.invalid/repo`);
    assert.equal(redactRemoteRef(`${scheme}://token@example.invalid/repo`), `${scheme}://<redacted>@example.invalid/repo`);
  }
  assert.equal(redactRemoteRef("https://%74oken@example.invalid/path%3Ftoken?unknown=secret"),
    "https://<redacted>@example.invalid/path%3Ftoken");
});

test("remote provenance withholds implicit explicit and configured helper payloads", () => {
  for (const value of ["helper::opaque", "fixture_helper::https://user:pass@example.invalid/repo",
    "helper://example.invalid/opaque", "CUSTOM://opaque", "git+unknown://opaque"]) {
    assert.equal(redactRemoteRef(value), "<redacted remote helper descriptor>");
  }
  for (const value of ["opaque", "../ordinary", "https://example.invalid/repo", ""]) {
    assert.equal(redactRemoteRef(value, true), "<redacted remote helper descriptor>");
  }
});

test("remote provenance rejects malformed URL-like and control-bearing values", () => {
  for (const value of ["https://user:pass@[bad/repo", "https:///", "https:user:pass", "https:/host/repo",
    " https://user:pass@example.invalid/repo", "1bad://user:pass", "https://example.invalid/repo\nsecret",
    "https://example.invalid/repo\tsecret", "\0secret", "secret\x7f"]) {
    assert.equal(redactRemoteRef(value), "<redacted remote descriptor>");
  }
});

test("URL parser normalization cannot move credentials outside the redacted authority", () => {
  for (const scheme of ["http", "https", "ftp", "ftps", "ssh", "git"]) {
    for (const slashCount of [3, 4, 5]) {
      const value = scheme + ":" + "/".repeat(slashCount) + "user:secret@example.invalid/repo";
      assert.equal(redactRemoteRef(value), "<redacted remote descriptor>");
    }
  }
  assert.equal(redactRemoteRef("https://\\user:secret@example.invalid/repo"), "<redacted remote descriptor>");
});
