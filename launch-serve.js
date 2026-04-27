import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const port = Number(process.argv[2] || 8085);

if (process.env.AEQUITAS_STATIC_CHILD === "1") {
  const root = resolve("dist");
  const mimeTypes = {
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".ico": "image/x-icon"
  };

  createServer((request, response) => {
    const rawPath = decodeURIComponent((request.url || "/").split("?")[0]);
    const safePath = normalize(rawPath).replace(/^(\.\.[/\\])+/, "");
    let filePath = resolve(join(root, safePath === "/" ? "index.html" : safePath));

    if (!filePath.startsWith(root) || !existsSync(filePath)) {
      filePath = join(root, "index.html");
    }

    if (statSync(filePath).isDirectory()) {
      filePath = join(filePath, "index.html");
    }

    response.setHeader("Content-Type", mimeTypes[extname(filePath)] || "application/octet-stream");
    createReadStream(filePath)
      .on("error", () => {
        response.statusCode = 500;
        response.end("Unable to read asset");
      })
      .pipe(response);
  }).listen(port, "127.0.0.1");
} else {
  const child = spawn(process.execPath, [fileURLToPath(import.meta.url), String(port)], {
    detached: true,
    stdio: "ignore",
    env: {
      ...process.env,
      AEQUITAS_STATIC_CHILD: "1"
    }
  });

  child.unref();
  console.log(`Aequitas AI prototype server started on http://127.0.0.1:${port}`);
}
