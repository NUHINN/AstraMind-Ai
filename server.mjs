import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT || 5173);

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".jsx": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp"
};

createServer(async (request, response) => {
  try {
    const url = new URL(request.url || "/", `http://localhost:${port}`);
    const decodedPath = decodeURIComponent(url.pathname);
    const candidate = path.normalize(path.join(root, decodedPath));
    const isInsideRoot = candidate.startsWith(root);
    const filePath = isInsideRoot && existsSync(candidate) && !candidate.endsWith(path.sep)
      ? candidate
      : path.join(root, "index.html");
    const extension = path.extname(filePath);
    const body = await readFile(filePath);

    response.writeHead(200, {
      "Content-Type": mimeTypes[extension] || "application/octet-stream",
      "Cache-Control": "no-store"
    });
    response.end(body);
  } catch (error) {
    response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    response.end(`AstraMind local server error:\n${error.message}`);
  }
}).listen(port, () => {
  console.log(`AstraMind AI running at http://localhost:${port}`);
});
