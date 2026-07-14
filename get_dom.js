const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:8000');
  await page.waitForTimeout(5000); // wait for load
  const html = await page.content();
  const fs = require('fs');
  fs.writeFileSync('dom.html', html);
  await page.screenshot({ path: 'screenshot.png' });
  await browser.close();
})();
