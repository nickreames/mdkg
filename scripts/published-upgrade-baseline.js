const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

// Registry provenance is recorded in goal-83/baseline.json. Never substitute a
// freshly packed development build merely because its metadata also says 0.5.2.
const PUBLISHED_052 = Object.freeze({
  version: "0.5.2",
  url: "https://registry.npmjs.org/mdkg/-/mdkg-0.5.2.tgz",
  bytes: 425431,
  sha256: "18b9bb3c474481155ad46c4ce9b06530d5bdcce0812052fc76f7bcc159799540",
  integrity: "sha512-a01iaKqgw3fv7YRi/0E1bWE0polds76ccGyOCMVzyBf35ySZHSjlTIA2DG5CgjZw2TqxKSgcVZxazrOjcB333g==",
});

function verifyBaseline(bytes, expected = PUBLISHED_052) {
  if (bytes.length !== expected.bytes || crypto.createHash("sha256").update(bytes).digest("hex") !== expected.sha256 ||
      "sha512-" + crypto.createHash("sha512").update(bytes).digest("base64") !== expected.integrity) {
    throw new Error("published upgrade baseline size/integrity mismatch; preserve evidence and refuse execution");
  }
}

async function boundedResponse(response, expected = PUBLISHED_052) {
  if (!response.ok || response.redirected || !response.body) throw new Error("published baseline download failed or redirected");
  const declared = response.headers.get("content-length");
  if (declared !== null && Number(declared) !== expected.bytes) throw new Error("published baseline content length mismatch");
  const chunks = []; let length = 0;
  for await (const chunk of response.body) {
    length += chunk.length;
    if (length > expected.bytes) throw new Error("published baseline download exceeds pinned byte length");
    chunks.push(chunk);
  }
  const bytes = Buffer.concat(chunks, length); verifyBaseline(bytes, expected); return bytes;
}

async function preparePublishedBaseline(ownedDirectory) {
  const local = process.env.MDKG_PUBLISHED_052_TARBALL;
  let bytes;
  if (local) {
    bytes = readLocalBaseline(local);
  } else {
    // Explicit unauthenticated, pinned public package download. No npm/user
    // registry configuration, credential headers or redirects are consumed.
    bytes = await boundedResponse(await fetch(PUBLISHED_052.url, { redirect: "error", signal: AbortSignal.timeout(30000) }));
  }
  const destination = path.join(ownedDirectory, "published-mdkg-0.5.2.tgz");
  fs.writeFileSync(destination, bytes, { flag: "wx", mode: 0o600 });
  return { path: destination, ...PUBLISHED_052, source: local ? "verified-local-artifact" : "unauthenticated-pinned-registry-download" };
}

function readLocalBaseline(file, expected = PUBLISHED_052) {
  const fd = fs.openSync(file, fs.constants.O_RDONLY | fs.constants.O_NOFOLLOW | fs.constants.O_NONBLOCK);
  try {
    const stat = fs.fstatSync(fd);
    if (!stat.isFile() || stat.size !== expected.bytes) throw new Error("published baseline local file size/type mismatch");
    // A writer growing the file after fstat must not make this an unbounded read.
    const buffer = Buffer.alloc(expected.bytes + 1);
    let length = 0, count;
    while (length < buffer.length && (count = fs.readSync(fd, buffer, length, buffer.length - length, null)) > 0) length += count;
    const bytes = buffer.subarray(0, length);
    verifyBaseline(bytes, expected);
    return bytes;
  } finally { fs.closeSync(fd); }
}

module.exports = { PUBLISHED_052, verifyBaseline, boundedResponse, readLocalBaseline, preparePublishedBaseline };
