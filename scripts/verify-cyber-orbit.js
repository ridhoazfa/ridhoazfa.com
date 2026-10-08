const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const watchdog = setTimeout(() => {
  console.error('[Watchdog] Task exceeded execution budget. Forcing exit.');
  process.exit(1);
}, 55000);
watchdog.unref();

const ARTIFACTS_DIR = 'C:\\Users\\ridho\\.gemini\\antigravity\\brain\\1c550f68-9b36-4094-97b5-0e63d2cbedb4';

async function run() {
  const browser = await chromium.launch({
    headless: true,
    args: ['--enable-webgl', '--ignore-gpu-blocklist', '--use-gl=angle', '--enable-webgl-draft-extensions']
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  try {
    console.log('[Test] Navigating to http://localhost:8010/index.html...');
    await page.goto('http://localhost:8010/index.html', { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(2000);

    // Scroll down to Section 02 (#architecture)
    await page.evaluate(() => {
      const arch = document.getElementById('architecture');
      if (arch) arch.scrollIntoView({ behavior: 'instant', block: 'center' });
    });
    await page.waitForTimeout(1400);

    // 1. Detailed Inspection on Standard Desktop
    const verification = await page.evaluate(() => {
      const arch = document.getElementById('architecture');
      const canvasBack = document.getElementById('celestial-3d-canvas-back');
      const canvasFront = document.getElementById('celestial-3d-canvas-front');
      const robotAnchor = document.getElementById('orbit-robot-anchor');
      const bubble = document.getElementById('orbit-robot-bubble');
      const hud = document.getElementById('planet-inspector-hud');
      const calloutContainer = document.getElementById('planet-callouts-container');
      const calloutPills = Array.from(document.querySelectorAll('.planet-callout-pill'));

      const archRect = arch ? arch.getBoundingClientRect() : null;
      const robotRect = robotAnchor ? robotAnchor.getBoundingClientRect() : null;
      const bubbleStyle = bubble ? window.getComputedStyle(bubble) : null;

      const celestialApi = !!window.__CELESTIAL_3D__;
      const planets = window.__CELESTIAL_3D__ ? window.__CELESTIAL_3D__.planets : [];
      const asteroidBelt = window.__CELESTIAL_3D__ ? window.__CELESTIAL_3D__.asteroidBelt : null;
      const planetTrails = window.__CELESTIAL_3D__ ? window.__CELESTIAL_3D__.planetTrails : [];
      const solarCorona = window.__CELESTIAL_3D__ ? window.__CELESTIAL_3D__.solarCorona : null;

      const pillData = calloutPills.map(p => ({
        planetId: p.getAttribute('data-planet-id'),
        glyph: p.querySelector('.pill-glyph')?.textContent,
        opacity: window.getComputedStyle(p).opacity,
        transform: p.style.transform
      }));

      return {
        hasArch: !!arch,
        archWidth: archRect ? archRect.width : 0,
        hasCanvasBack: !!canvasBack,
        hasCanvasFront: !!canvasFront,
        hasRobotAnchor: !!robotAnchor,
        hasBubble: !!bubble,
        bubblePosition: bubbleStyle ? {
          top: bubbleStyle.top,
          right: bubbleStyle.right,
          left: bubbleStyle.left
        } : null,
        bubbleText: bubble ? bubble.querySelector('.bubble-text')?.textContent : '',
        bubbleKicker: bubble ? bubble.querySelector('#bubble-kicker')?.textContent : '',
        hasHud: !!hud,
        celestialApiAvailable: celestialApi,
        planetCount: planets.length,
        hasAsteroidBelt: !!asteroidBelt,
        asteroidCount: asteroidBelt ? asteroidBelt.count : 0,
        trailsCount: planetTrails ? planetTrails.length : 0,
        hasSolarCorona: !!solarCorona,
        hasCalloutContainer: !!calloutContainer,
        calloutPillsCount: calloutPills.length,
        pillSamples: pillData.slice(0, 5)
      };
    });

    console.log('[Test Desktop Verification]:', JSON.stringify(verification, null, 2));

    const desktopPath = path.join(ARTIFACTS_DIR, 'aditya-solar-orbit-desktop.png');
    await page.screenshot({ path: desktopPath, fullPage: false });
    console.log('[Test] Captured desktop resting screenshot:', desktopPath);

    // 2. Test Clicking a Projected Micro-Bubble (.planet-callout-pill)
    console.log('[Test] Testing click on Planet 01 Micro-Bubble (><)...');
    await page.evaluate(() => {
      const pill1 = document.querySelector('.planet-callout-pill[data-planet-id="1"]');
      if (pill1) pill1.click();
    });
    await page.waitForTimeout(600);

    const hudState = await page.evaluate(() => {
      const hud = document.getElementById('planet-inspector-hud');
      const title = document.getElementById('hud-planet-title')?.textContent;
      const kicker = document.getElementById('hud-planet-kicker')?.textContent;
      const badge = document.getElementById('hud-planet-badge')?.textContent;
      const desc = document.getElementById('hud-planet-desc')?.textContent;
      const pills = Array.from(document.querySelectorAll('.hud-tech-tag')).map(el => el.textContent);
      const isActive = hud ? hud.classList.contains('active') : false;

      return {
        isActive,
        title,
        kicker,
        badge,
        desc,
        pills
      };
    });
    console.log('[Test HUD Triggered from Micro-Bubble Click]:', JSON.stringify(hudState, null, 2));

    const hudPath = path.join(ARTIFACTS_DIR, 'aditya-solar-callout-click-hud.png');
    await page.screenshot({ path: hudPath, fullPage: false });
    console.log('[Test] Captured HUD open screenshot from pill click:', hudPath);

    // Close HUD
    await page.click('#hud-close-btn');
    await page.waitForTimeout(400);

    // 3. Test 4K Viewport (1920x1080)
    console.log('[Test] Testing 4K / 1080p Viewport (1920x1080)...');
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(600);
    await page.evaluate(() => {
      const arch = document.getElementById('architecture');
      if (arch) arch.scrollIntoView({ behavior: 'instant', block: 'center' });
    });
    await page.waitForTimeout(600);
    const fourKPath = path.join(ARTIFACTS_DIR, 'aditya-solar-orbit-4k.png');
    await page.screenshot({ path: fourKPath, fullPage: false });
    console.log('[Test] Captured 4K screenshot:', fourKPath);

    // 4. Test Laptop Viewport (1280x800)
    console.log('[Test] Testing Small Laptop Viewport (1280x800)...');
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.waitForTimeout(600);
    await page.evaluate(() => {
      const arch = document.getElementById('architecture');
      if (arch) arch.scrollIntoView({ behavior: 'instant', block: 'center' });
    });
    await page.waitForTimeout(600);
    const laptopPath = path.join(ARTIFACTS_DIR, 'aditya-solar-orbit-laptop.png');
    await page.screenshot({ path: laptopPath, fullPage: false });
    console.log('[Test] Captured laptop screenshot:', laptopPath);

    // 5. Test Tablet Viewport (820x1180)
    console.log('[Test] Testing Tablet Viewport (820x1180)...');
    await page.setViewportSize({ width: 820, height: 1180 });
    await page.waitForTimeout(600);
    await page.evaluate(() => {
      const arch = document.getElementById('architecture');
      if (arch) arch.scrollIntoView({ behavior: 'instant', block: 'center' });
    });
    await page.waitForTimeout(800);
    const tabletPath = path.join(ARTIFACTS_DIR, 'aditya-solar-orbit-tablet.png');
    await page.screenshot({ path: tabletPath, fullPage: false });
    console.log('[Test] Captured tablet screenshot:', tabletPath);

    // 6. Test Mobile Viewport (390x844)
    console.log('[Test] Testing Mobile Viewport (390x844)...');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(600);
    await page.evaluate(() => {
      const arch = document.getElementById('architecture');
      if (arch) arch.scrollIntoView({ behavior: 'instant', block: 'center' });
    });
    await page.waitForTimeout(800);
    const mobilePath = path.join(ARTIFACTS_DIR, 'aditya-solar-orbit-mobile.png');
    await page.screenshot({ path: mobilePath, fullPage: false });
    console.log('[Test] Captured mobile screenshot:', mobilePath);

    // 7. Test Indonesian Version (index-id.html)
    console.log('[Test] Testing Indonesian Version (index-id.html)...');
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('http://localhost:8010/index-id.html', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);
    await page.evaluate(() => {
      const arch = document.getElementById('architecture');
      if (arch) arch.scrollIntoView({ behavior: 'instant', block: 'center' });
    });
    await page.waitForTimeout(800);

    // Click micro-bubble for Planet 3 in Indonesian
    await page.evaluate(() => {
      const pill3 = document.querySelector('.planet-callout-pill[data-planet-id="3"]');
      if (pill3) pill3.click();
    });
    await page.waitForTimeout(600);

    const idVerification = await page.evaluate(() => {
      const bubble = document.getElementById('orbit-robot-bubble');
      const bubbleText = bubble ? bubble.querySelector('.bubble-text')?.textContent : '';
      const bubbleKicker = bubble ? bubble.querySelector('#bubble-kicker')?.textContent : '';
      const hud = document.getElementById('planet-inspector-hud');
      const hudTitle = document.getElementById('hud-planet-title')?.textContent;
      const hudKicker = document.getElementById('hud-planet-kicker')?.textContent;
      const hudDesc = document.getElementById('hud-planet-desc')?.textContent;
      const isActive = hud ? hud.classList.contains('active') : false;

      return {
        bubbleKicker,
        bubbleText,
        hudIsActive: isActive,
        hudTitle,
        hudKicker,
        hudDesc
      };
    });
    console.log('[Test Indonesian Verification]:', JSON.stringify(idVerification, null, 2));

    const idPath = path.join(ARTIFACTS_DIR, 'aditya-solar-orbit-id.png');
    await page.screenshot({ path: idPath, fullPage: false });
    console.log('[Test] Captured Indonesian screenshot:', idPath);

    console.log('[Test Summary] Console Errors Count:', consoleErrors.length);
    if (consoleErrors.length > 0) {
      console.warn('[Test Summary] Console Errors:', consoleErrors);
    }

  } finally {
    await browser.close();
  }
}

run()
  .then(() => {
    console.log('[Test] All multi-device tests completed successfully.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('[Test Error]:', err);
    process.exit(1);
  });
