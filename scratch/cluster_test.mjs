import puppeteer from 'puppeteer';

const SITE = 'https://chd-eta.vercel.app/';

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const consoleErrors = [];
  const apiCalls = {};

  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  page.on('response', async res => {
    const url = res.url();
    if (url.includes('/api/')) {
      const key = url.replace(/^https?:\/\/[^/]+/, ''); // strip origin
      const status = res.status();
      let body = null;
      try { body = await res.json(); } catch {}
      apiCalls[key] = { status, body: body ? JSON.stringify(body).substring(0, 300) : null };
    }
  });

  // ── STEP 1: Page load ──────────────────────────────────
  console.log('\n=== STEP 1: Loading page ===');
  try {
    await page.goto(SITE, { waitUntil: 'networkidle0', timeout: 30000 });
  } catch(e) { console.log('Goto warning:', e.message); }
  await sleep(6000);

  console.log('Title:', await page.title());
  console.log('API calls so far:', Object.keys(apiCalls));

  // ── STEP 2: Sidebar & controls ─────────────────────────
  console.log('\n=== STEP 2: All buttons ===');
  const buttons = await page.$$eval('button', els =>
    els.map(e => e.innerText.trim()).filter(Boolean)
  );
  console.log(buttons);

  console.log('\n=== Selects (dropdowns) ===');
  const selects = await page.$$eval('select', els =>
    els.map(e => ({
      id: e.id, name: e.name,
      opts: Array.from(e.options).map(o => o.text)
    }))
  );
  console.log(JSON.stringify(selects, null, 2));

  // ── STEP 3: Find and click Run Clustering ─────────────
  console.log('\n=== STEP 3: Finding cluster button ===');
  const clusterBtnText = await page.evaluate(() => {
    const btns = [...document.querySelectorAll('button')];
    const found = btns.find(b =>
      /run|cluster|analys|apply/i.test(b.innerText)
    );
    return found ? found.innerText.trim() : null;
  });
  console.log('Cluster button:', clusterBtnText);

  if (clusterBtnText) {
    await page.evaluate(() => {
      const btns = [...document.querySelectorAll('button')];
      const found = btns.find(b => /run|cluster|analys|apply/i.test(b.innerText));
      found?.click();
    });
    console.log('Clicked. Waiting 12s for API...');
    await sleep(12000);
  }

  // ── STEP 4: Check /api/clusters ───────────────────────
  console.log('\n=== STEP 4: API calls after clustering ===');
  for (const [path, data] of Object.entries(apiCalls)) {
    console.log(`${path} → HTTP ${data.status}`);
    if (data.body) console.log('  body:', data.body.substring(0, 200));
  }

  // ── STEP 5: Check if /api/clusters was called ─────────
  const clusterKey = Object.keys(apiCalls).find(k => k.includes('/clusters'));
  if (!clusterKey) {
    console.log('\n⚠️  /api/clusters was NEVER called — button click may not be wiring to fetch');
  } else {
    console.log('\n✅ /api/clusters called → HTTP', apiCalls[clusterKey].status);
  }

  // ── STEP 6: Dataset API ───────────────────────────────
  const dsKey = Object.keys(apiCalls).find(k => k.includes('/datasets'));
  console.log('\nDatasets API:', dsKey ? `HTTP ${apiCalls[dsKey].status}` : 'NOT called');
  if (dsKey && apiCalls[dsKey].body) console.log(apiCalls[dsKey].body.substring(0, 200));

  // ── STEP 7: Console errors ────────────────────────────
  console.log('\n=== Console errors ===');
  if (consoleErrors.length === 0) console.log('None');
  else consoleErrors.forEach(e => console.log('ERROR:', e));

  await browser.close();
})();
