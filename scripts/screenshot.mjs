// Serves the built Storybook and saves a screenshot of the "All three" story.
// Used by CI so the README image always matches the deployed site.
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { chromium } from "playwright";

const root = "storybook-static";
const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".woff": "font/woff", ".png": "image/png" };

const server = createServer(async (req, res) => {
  const path = decodeURIComponent(new URL(req.url, "http://x").pathname);
  try {
    const body = await readFile(join(root, path.endsWith("/") ? path + "index.html" : path));
    res.writeHead(200, { "content-type": types[extname(path)] ?? "application/octet-stream" }).end(body);
  } catch {
    res.writeHead(404).end();
  }
}).listen(0);

const port = server.address().port;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 760 }, deviceScaleFactor: 1.5 });
await page.goto(`http://localhost:${port}/iframe.html?id=flow--all-three&viewMode=story`);
await page.waitForSelector(".aui-card");
await page.waitForTimeout(800);
await page.screenshot({ path: join(root, "screenshot.png") });
await browser.close();
server.close();
console.log("Saved storybook-static/screenshot.png");
