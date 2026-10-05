const fs = require('fs');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
(async () => {
 const browser = await chromium.launch({channel:'msedge',headless:true});
 const page = await browser.newPage({viewport:{width:800,height:800},deviceScaleFactor:1});
 const logo = fs.readFileSync('public/assets/ml-logo.png').toString('base64');
 await page.setContent(`<html><head><style>*{box-sizing:border-box}body{margin:0;width:800px;height:800px;background:#080b10;display:flex;align-items:center;justify-content:center}img{display:block;width:740px;height:auto}</style></head><body><img alt="ML Soluciones Web" src="data:image/png;base64,${logo}"></body></html>`);
 await page.locator('img').evaluate(img => img.decode());
 await page.screenshot({path:'public/assets/social-logo-square-v2.png'});
 await browser.close();
})();
