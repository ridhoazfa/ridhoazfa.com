// Local Development Static Server for Ridho Azfa Enterprise Capsule
// Zero external dependencies (native Node.js stdlib)
// Usage: node dev-server.mjs [port]  (default 8010)

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.argv[2] || 8010);

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.splinecode': 'application/octet-stream',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.mp4': 'video/mp4'
};

const server = http.createServer((req, res) => {
  const start = Date.now();
  const parsedUrl = new URL(req.url, `http://localhost:${PORT}`);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  // Route aliases
  if (pathname === '/' || pathname === '') {
    pathname = '/index.html';
  } else if (pathname === '/id' || pathname === '/id/') {
    pathname = '/index-id.html';
  }

  // Prevent path traversal
  const safePath = path.normalize(path.join(__dirname, pathname));
  if (!safePath.startsWith(__dirname)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    return res.end('403 Forbidden');
  }

  // Check file existence
  fs.stat(safePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(`404 Not Found: ${pathname}`);
      console.log(`[404] ${req.method} ${pathname} (${Date.now() - start}ms)`);
      return;
    }

    const ext = path.extname(safePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    // Support HTTP Range Requests (for media/video)
    const range = req.headers.range;
    const fileSize = stats.size;

    const baseHeaders = {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'X-Content-Type-Options': 'nosniff'
    };

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const startByte = parseInt(parts[0], 10);
      const endByte = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = (endByte - startByte) + 1;

      res.writeHead(206, {
        ...baseHeaders,
        'Content-Range': `bytes ${startByte}-${endByte}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize
      });

      fs.createReadStream(safePath, { start: startByte, end: endByte }).pipe(res);
      console.log(`[206] ${req.method} ${pathname} (${Date.now() - start}ms)`);
    } else {
      res.writeHead(200, {
        ...baseHeaders,
        'Content-Length': fileSize,
        'Accept-Ranges': 'bytes'
      });

      fs.createReadStream(safePath).pipe(res);
      console.log(`[200] ${req.method} ${pathname} (${Date.now() - start}ms)`);
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n======================================================`);
  console.log(`  RIDHO AZFA // ENTERPRISE LOCAL DEV SERVER ONLINE    `);
  console.log(`======================================================`);
  console.log(`  -> English Master:     http://localhost:${PORT}/`);
  console.log(`  -> Indonesian Edition: http://localhost:${PORT}/index-id.html`);
  console.log(`  -> Root Directory:     ${__dirname}`);
  console.log(`======================================================\n`);
});

process.on('SIGINT', () => {
  console.log('\n[Dev Server] Shutting down gracefully...');
  server.close(() => process.exit(0));
});
