const fs = require("fs");
const path = require("path");

const src = path.join("node_modules", "@fontsource", "manrope", "files");
const dest = path.join("public", "fonts");
fs.mkdirSync(dest, { recursive: true });

const weights = [400, 500, 600, 700];
const subsets = ["cyrillic", "latin", "latin-ext"];

for (const subset of subsets) {
  for (const weight of weights) {
    const name = `manrope-${subset}-${weight}-normal.woff2`;
    fs.copyFileSync(path.join(src, name), path.join(dest, name));
  }
}
