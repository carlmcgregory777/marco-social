// Banner YouTube 2560x1440 (zona sicura centrale 1546x423) e foto profilo 800x800 di C.
// Uso: node yt_banner.mjs <pers_C.png> <banner.jpg> <avatar.jpg>
import { chromium } from 'file:///C:/Users/stang/AppData/Roaming/npm/node_modules/playwright/index.mjs';
import fs from 'fs';
const [img, outBanner, outAvatar] = process.argv.slice(2);
const b64 = fs.readFileSync(img).toString('base64');
const font = `@import url('https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@500;700&family=JetBrains+Mono:wght@500&display=swap');*{margin:0}`;
const b = await chromium.launch();

const p = await b.newPage({ viewport: { width: 2560, height: 1440 } });
await p.setContent(`<html><head><style>${font}
body{width:2560px;height:1440px;background:#0b0a10;position:relative;overflow:hidden;font-family:Inter;color:#fff}
.grid{position:absolute;inset:0;background-image:linear-gradient(#ffffff08 1px,transparent 1px),linear-gradient(90deg,#ffffff08 1px,transparent 1px);background-size:80px 80px}
.chart{position:absolute;left:0;right:0;top:560px;height:420px;opacity:.35}
.glow{position:absolute;width:1400px;height:1400px;border-radius:50%;background:radial-gradient(#5b3fd688,transparent 60%);left:1250px;top:120px}
.pic{position:absolute;left:1530px;top:440px;width:540px;height:760px;background:url(data:image/png;base64,${b64}) center 8%/cover no-repeat;-webkit-mask-image:radial-gradient(ellipse 50% 50% at 50% 45%,#000 60%,transparent 100%)}
.tag{position:absolute;left:560px;top:560px;font-family:'JetBrains Mono';font-size:34px;color:#8b6dff;letter-spacing:4px}
h1{position:absolute;left:556px;top:600px;font-family:Anton;font-weight:400;font-size:160px;line-height:1;letter-spacing:2px}
h1 em{font-style:normal;color:#8b6dff}
.sub{position:absolute;left:560px;top:800px;font-size:42px;font-weight:700}
.sub span{color:#8b6dff}
.ms{position:absolute;left:560px;top:870px;font-family:'JetBrains Mono';font-size:28px;color:#8a879a;letter-spacing:2px}
</style></head><body><div class=grid></div>
<svg class=chart viewBox="0 0 2560 420" preserveAspectRatio="none"><polyline fill="none" stroke="#8b6dff" stroke-width="4" points="0,380 160,350 300,365 460,300 600,320 760,250 900,270 1060,200 1200,230 1360,160 1500,180 1660,120 1800,140 1960,80 2100,100 2260,40 2560,20"/></svg>
<div class=glow></div><div class=pic></div>
<div class=tag>// TRADING ALGORITMICO · PROP FIRM · BOT</div>
<h1>C <em>—</em> THE TRADER</h1>
<div class=sub>Numeri veri. <span>Faccia finta.</span> Nuovi video ogni settimana.</div>
<div class=ms>🤖 personaggio AI · dietro c'è Marco</div>
</body></html>`, { waitUntil: 'networkidle' });
await p.evaluate(() => document.fonts.ready);
await p.screenshot({ path: outBanner, type: 'jpeg', quality: 92 });

const a = await b.newPage({ viewport: { width: 800, height: 800 } });
await a.setContent(`<html><head><style>*{margin:0}body{width:800px;height:800px;background:radial-gradient(#5b3fd6 0,#2a1d66 45%,#0b0a10 75%)}
.pic{width:800px;height:800px;background:url(data:image/png;base64,${b64}) center 14%/112% no-repeat}</style></head><body><div class=pic></div></body></html>`);
await a.screenshot({ path: outAvatar, type: 'jpeg', quality: 93 });
await b.close();
