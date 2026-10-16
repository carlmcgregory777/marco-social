// Copertine storie in evidenza @marco_stanga_trader (1080×1920, icona dentro il cerchio centrale che Instagram ritaglia).
// Uso: node highlights.mjs <pers_C.png> <cartella_out>
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';
const [img, out] = process.argv.slice(2);
const b64 = fs.readFileSync(img).toString('base64');
const svg = {
  test: `<svg viewBox="0 0 200 200"><path d="M40 105l35 35 85-85" fill="none" stroke="#8b6dff" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  errori: `<svg viewBox="0 0 200 200"><path d="M100 22L185 172H15Z" fill="none" stroke="#8b6dff" stroke-width="16" stroke-linejoin="round"/><rect x="91" y="72" width="18" height="56" rx="9" fill="#fff"/><circle cx="100" cy="148" r="11" fill="#fff"/></svg>`,
  sistema: `<svg viewBox="0 0 200 200"><g fill="none" stroke="#8b6dff" stroke-width="16" stroke-linecap="round"><path d="M30 150 L75 100 L110 125 L170 50"/><path d="M135 50 H170 V85"/></g><g fill="#fff"><circle cx="30" cy="150" r="10"/><circle cx="75" cy="100" r="10"/><circle cx="110" cy="125" r="10"/></g></svg>`,
  faq: `<div class="t" style="font-size:330px">?</div>`,
  sconto: `<div class="t" style="font-size:200px">-20<span style="color:#fff">%</span></div>`,
  tool: `<div class="t" style="font-size:190px;letter-spacing:4px">BOT</div>`,
  prove: `<svg viewBox="0 0 200 200"><g fill="#8b6dff"><rect x="25" y="110" width="30" height="60" rx="6"/><rect x="70" y="80" width="30" height="90" rx="6"/><rect x="115" y="95" width="30" height="75" rx="6" fill="#ff4d5e"/><rect x="160" y="45" width="30" height="125" rx="6"/></g></svg>`,
};
const items = [
  ['01_INIZIA_QUI', `<div class="face"></div>`],
  ['02_TEST', svg.test], ['03_ERRORI', svg.errori], ['04_SISTEMA', svg.sistema], ['05_FAQ', svg.faq],
  ['06_SCONTO_20', svg.sconto], ['07_IL_TOOL', svg.tool], ['08_PROVE', svg.prove],
];
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
for (const [name, inner] of items) {
  await p.setContent(`<html><head><style>@import url('https://fonts.googleapis.com/css2?family=Anton&display=swap');
  *{margin:0}body{width:1080px;height:1920px;background:#0b0a10;position:relative;overflow:hidden}
  .glow{position:absolute;width:1100px;height:1100px;border-radius:50%;left:-10px;top:410px;background:radial-gradient(#5b3fd655,transparent 60%)}
  .ring{position:absolute;left:190px;top:610px;width:700px;height:700px;border-radius:50%;border:14px solid #5b3fd6;display:flex;align-items:center;justify-content:center;overflow:hidden;background:#0b0a10}
  .ring svg{width:380px;height:380px}
  .t{font-family:Anton,Impact,sans-serif;color:#8b6dff;line-height:1}
  .face{width:100%;height:100%;background:url(data:image/png;base64,${b64}) center 18%/150% no-repeat}
  </style></head><body><div class="glow"></div><div class="ring">${inner}</div></body></html>`, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: `${out}/${name}.jpg`, type: 'jpeg', quality: 92 });
}
await b.close();
