import { cp, mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const out = resolve(root, "docs");
await mkdir(out, { recursive: true });
const css = (await readFile(resolve(root, "app/globals.css"), "utf8"))
  .replace(/^@import\s+"tailwindcss";\s*/m, "");
await writeFile(resolve(out, "styles.css"), css);
await cp(resolve(root, "github-pages-src/index.html"), resolve(out, "index.html"));
await cp(resolve(root, "github-pages-src/app.js"), resolve(out, "app.js"));
await cp(resolve(root, "public/favicon.svg"), resolve(out, "favicon.svg"));
await cp(resolve(root, "public/og.png"), resolve(out, "og.png"));
await writeFile(resolve(out, ".nojekyll"), "");
console.log("GitHub Pages build written to docs/");
