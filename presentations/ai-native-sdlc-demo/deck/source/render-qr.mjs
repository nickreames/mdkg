import path from "node:path";
import process from "node:process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

if (process.argv.length !== 3) {
  process.stderr.write("usage: node render-qr.mjs <asset-directory>\n");
  process.exitCode = 2;
} else {
  const assetDirectory = path.resolve(process.argv[2]);
  for (const stem of ["quickstart", "issues"]) {
    await sharp(path.join(assetDirectory, `${stem}.svg`))
      .flatten({ background: "#FFFFFF" })
      .png({ compressionLevel: 9, palette: false })
      .toFile(path.join(assetDirectory, `${stem}.png`));
  }
}
