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
  const networkErrors = [];
  const apiCalls = {};

  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  page.on('requestfailed', req => {
    networkErrors.push(`${req.url()} failed with: ${req.failure()?.errorText}`);
  });
  
  page.on('response', async res => {
    if (res.status() === 404) {
      consoleErrors.push(`404 Not Found: ${res.url()}`);
    }
    const url = res.url();
    if (url.includes('/api/')) {
      const key = url.replace(/^https?:\/\/[^/]+/, ''); // strip origin
      const status = res.status();
      let body = null;
      try { body = await res.json(); } catch {}
      apiCalls[key] = { status, body: body ? JSON.stringify(body).substring(0, 300) : null };
    }
  });

  console.log('\n=== STEP 1: Loading page ===');
  try {
    await page.goto(SITE, { waitUntil: 'domcontentloaded', timeout: 30000 });
  } catch(e) { console.log('Goto warning:', e.message); }
  
  // Wait a bit for the page to initialize
  await sleep(10000);

  console.log('Title:', await page.title());
  
  console.log('\n=== STEP 2: All buttons ===');
  const buttons = await page.$$eval('button', els =>
    els.map(e => e.innerText.trim()).filter(Boolean)
  );
  console.log(buttons);

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

  console.log('\n=== STEP 4: API calls ===');
  for (const [path, data] of Object.entries(apiCalls)) {
    console.log(`${path} → HTTP ${data.status}`);
  }

  console.log('\n=== Console errors ===');
  consoleErrors.forEach(e => console.log('ERROR:', e));
  networkErrors.forEach(e => console.log('NETWORK ERROR:', e));

  await browser.close();
})();
