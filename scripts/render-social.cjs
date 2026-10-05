// Render the share card from HTML using Playwright: node scripts/render-social.cjs
const fs = require('fs');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
(async () => {
 const browser = await chromium.launch({channel:'msedge',headless:true});
 const page=await browser.newPage({viewport:{width:1200,height:630},deviceScaleFactor:1});
 const logo=fs.readFileSync('public/assets/ml-icon.png').toString('base64');
 await page.setContent(`<html><head><meta charset="utf-8"><style>*{box-sizing:border-box}body{margin:0;background:#080b12;color:#f5f6fa;font-family:Arial,sans-serif;width:1200px;height:630px;padding:60px 68px;position:relative;overflow:hidden}.brand{display:flex;align-items:center;gap:18px;font-size:22px;font-weight:700;letter-spacing:1px}.mark{width:86px;height:52px;overflow:hidden;position:relative}.mark img{position:absolute;width:122px;max-width:none;left:-20px;top:-34px}h1{font-size:76px;line-height:1.09;letter-spacing:-3px;margin:55px 0 25px;position:relative}h1 span{color:#458aff}p{font-size:25px;line-height:1.5;color:#b4c0d3;margin:0}.bottom{position:absolute;bottom:44px;left:68px;right:68px;display:flex;justify-content:space-between;border-top:1px solid #2a3952;padding-top:24px;font-size:16px;color:#aabbcf}.accent{position:absolute;right:-100px;top:120px;width:390px;height:390px;border:1px solid #214c8a;border-radius:50%;box-shadow:0 0 0 55px #10213b,0 0 0 110px #0b1525}.accent:after{content:'';position:absolute;width:80px;height:80px;left:16px;top:35px;background:#0865ff;border-radius:50%}</style></head><body><div class="accent"></div><div class="brand"><div class="mark"><img src="data:image/png;base64,${logo}"></div> SOLUCIONES WEB</div><h1>Tu negocio.<br>Su mejor versión<br><span>en la web.</span></h1><p>Páginas web y tiendas online.<br>Diseño, desarrollo y atención personal.</p><div class="bottom"><span>ML SOLUCIONES WEB</span><span>Matías Lavoy</span></div></body></html>`);
 await page.screenshot({path:'public/assets/social-preview-v1.png'});
 await browser.close();
})();
