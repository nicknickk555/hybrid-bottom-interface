import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the entry portal over exactly three screens", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Hybrid Bottom — Controlled Root Interface<\/title>/i);
  assert.match(html, /class="portal isOpen"/);
  assert.match(html, /Enter the system/i);
  assert.equal(html.match(/class="screen [^"]+"/g)?.length, 3);
  assert.ok(html.indexOf('class="portal isOpen"') < html.indexOf('id="concept"'));
});

test("keeps the portal outside page flow in both published versions", async () => {
  const [page, css, staticHtml, staticJs] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../github-pages-src/index.html", import.meta.url), "utf8"),
    readFile(new URL("../github-pages-src/app.js", import.meta.url), "utf8"),
  ]);

  assert.match(page, /const \[portalOpen, setPortalOpen\] = useState\(true\)/);
  assert.match(page, /const dismissPortal/);
  assert.match(css, /\.portal\{position:fixed/);
  assert.match(css, /\.portal\.isClosed\{/);
  assert.match(css, /\.portalLocked\{overflow:hidden\}/);
  assert.match(staticHtml, /<html lang="en" class="portalLocked">/);
  assert.match(staticHtml, /class="portal isOpen"/);
  assert.match(staticJs, /function dismissPortal\(\)/);
  assert.match(staticJs, /topbar\.classList\.add\("isVisible"\)/);
  assert.match(page, /Go to model/);
  assert.match(css, /\.architectureGrid>\*\{height:auto;min-height:440px;overflow:hidden\}/);
});
