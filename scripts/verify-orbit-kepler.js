import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

// Native Ponytail Watchdog
const watchdog = setTimeout(() => {
  console.error('[Watchdog] Verification script exceeded execution budget. Forcing exit.');
  process.exit(1);
}, 35000);
watchdog.unref();

const PORT = 8055;
const DIR = path.resolve('c:/codaxiom/apps/custom-enterprise/ridhoazfa');
const ARTIFACT_DIR = path.resolve('C:/Users/ridho/.gemini/antigravity/brain/314defab-e161-4fd8-897c-cb26638f15ef');

const MIME_MAP = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.splinecode': 'application/octet-stream',
  '.pdf': 'application/pdf'
};

const server = http.createServer((req, res) => {
  try {
    let reqPath = decodeURI(req.url.split('?')[0]);
    if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
    const filePath = path.join(DIR, reqPath);

    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      res.statusCode = 404;
      res.end('Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const mime = MIME_MAP[ext] || 'application/octet-stream';
    res.setHeader('Content-Type', mime);
    res.setHeader('Access-Control-Allow-Origin', '*');
    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  } catch (err) {
    res.statusCode = 500;
    res.end(err.message);
  }
});

async function run() {
  await new Promise((resolve) => server.listen(PORT, resolve));
  console.log(`[Verify] Static server listening on port ${PORT}`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await context.addInitScript(() => {
    try { sessionStorage.setItem('ra_intro_seen', '1'); } catch (e) {}
  });

  try {
    const page = await context.newPage();
    
    page.on('console', msg => {
      console.log(`[Browser Console] ${msg.type()}: ${msg.text()}`);
    });
    page.on('pageerror', err => {
      console.error(`[Browser PageError] ${err.message}`);
    });

    console.log('[Verify] Navigating to http://localhost:8055/index.html...');
    await page.goto(`http://localhost:8055/index.html`, { waitUntil: 'domcontentloaded' });

    // Scroll to #architecture
    console.log('[Verify] Scrolling to #architecture...');
    await page.evaluate(() => {
      const sec = document.getElementById('architecture');
      if (sec) sec.scrollIntoView({ behavior: 'instant' });
    });

    // Wait for Spline or timeout up to 5s
    console.log('[Verify] Waiting for Spline app instance or timeout...');
    try {
      await page.waitForFunction(() => !!window.__SPLINE_APP__, { timeout: 5000 });
      console.log('[Verify] Spline app mounted successfully!');
    } catch (e) {
      console.log('[Verify] Spline app not mounted within 5s:', e.message);
    }

    // Wait 500ms for stable render
    await page.waitForTimeout(500);

    const archBox = await page.evaluate(() => {
      const el = document.getElementById('architecture');
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: r.x, y: r.y, width: r.width, height: r.height };
    });

    console.log('[Verify] Architecture bounding rect:', archBox);

    // Capture screenshot
    const ssPath = path.join(ARTIFACT_DIR, 'robot_and_kepler_orbits_final.png');
    await page.locator('#architecture').screenshot({ path: ssPath });
    console.log(`[Verify] Saved screenshot to ${ssPath}`);

    // Verify orbits and planets state in page
    const telemetry = await page.evaluate(() => {
      const cel = window.__CELESTIAL_3D__;
      const spl = window.__SPLINE_APP__;
      return {
        celestialLoaded: !!cel,
        planetsCount: cel?.planets?.length || 0,
        worldsDataCount: cel?.worldsData?.length || 0,
        sceneBackChildren: cel?.sceneBack?.children?.length || 0,
        sceneFrontChildren: cel?.sceneFront?.children?.length || 0,
        splineLoaded: !!spl,
        cameraPos: spl?._camera?.position ? [spl._camera.position.x, spl._camera.position.y, spl._camera.position.z] : null
      };
    });

    console.log('[Verify] Telemetry:', JSON.stringify(telemetry, null, 2));

    // Also take a full viewport screenshot to check seamless top/bottom transition
    const ssPathSeamless = path.join(ARTIFACT_DIR, 'architecture_seamless_viewport.png');
    await page.screenshot({ path: ssPathSeamless });
    console.log(`[Verify] Saved viewport screenshot to ${ssPathSeamless}`);

  } finally {
    await browser.close();
    server.close();
    console.log('[Verify] Test suite cleanly finalized.');
  }
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('[Verify] Error:', err);
    process.exit(1);
  });
