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

test("publishes the three-screen GitHub Pages story with synchronized pruning animation", async () => {
  const [css, staticHtml, staticJs, crossSection] = await Promise.all([
    readFile(new URL("../github-pages-src/styles.css", import.meta.url), "utf8"),
    readFile(new URL("../github-pages-src/index.html", import.meta.url), "utf8"),
    readFile(new URL("../github-pages-src/app.js", import.meta.url), "utf8"),
    readFile(new URL("../github-pages-src/assets/hybrid-bottom-cross-section.svg", import.meta.url), "utf8"),
  ]);

  assert.equal(staticHtml.match(/data-screen=/g)?.length, 3);
  assert.equal(staticHtml.match(/data-process=/g)?.length, 5);
  assert.equal(staticHtml.match(/data-format=/g)?.length, 4);
  assert.match(staticHtml, /R51[\s\S]*R76[\s\S]*R108[\s\S]*R146/);
  assert.match(staticHtml, /id="bottom-area"/);
  assert.match(staticHtml, /id="typar-area"/);
  assert.match(staticHtml, /id="open-ring"/);
  assert.match(staticHtml, /assets\/hybrid-bottom-cross-section\.svg/);
  assert.match(staticHtml, /Apex pruning/);
  assert.match(staticHtml, /Lateral response/);
  assert.match(staticJs, /Local micro-drying/);
  assert.match(staticJs, /Apex pruning/);
  assert.match(staticJs, /Lateral branching/);
  assert.match(staticJs, /R51: \{ diameter: 102, height: 100/);
  assert.match(staticJs, /R146: \{ diameter: 292, height: 260/);
  assert.match(staticJs, /formatData\.openRing \/ formatData\.bottomArea/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(crossSection, /class="root main-root"/);
  assert.match(crossSection, /class="prune-burst"/);
  assert.match(crossSection, /class="root lateral"/);
  assert.doesNotMatch(crossSection, /<text\b/i);
});
