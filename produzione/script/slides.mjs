import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';
// OFF=1 node slides.mjs ... → numerazione che conta anche la copertina (slide 1 = cover_c45).
const [spec,out]=process.argv.slice(2); const OFF=+(process.env.OFF||0); const S=JSON.parse(fs.readFileSync(spec,'utf8'));
const css=`@import url('https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@500;700&family=JetBrains+Mono:wght@500&display=swap');
*{margin:0;box-sizing:border-box}body{width:1080px;height:1350px;background:#0b0a10;color:#f4f3f7;font-family:'Inter',sans-serif;position:relative;overflow:hidden}
.grid{position:absolute;inset:0;background-image:linear-gradient(#ffffff08 1px,transparent 1px),linear-gradient(90deg,#ffffff08 1px,transparent 1px);background-size:54px 54px}
.glow{position:absolute;width:900px;height:900px;border-radius:50%;background:radial-gradient(#5b3fd655,transparent 65%);right:-300px;top:-300px}
.wrap{position:absolute;inset:120px 88px 150px;display:flex;flex-direction:column;justify-content:center}
.tag{font-family:'JetBrains Mono';font-size:30px;color:#8b6dff;letter-spacing:2px}
h1{font-family:'Anton';font-weight:400;text-transform:uppercase;font-size:118px;line-height:1.0;margin-top:36px;letter-spacing:1px}h1 em,h2 em{font-style:normal;color:#8b6dff}
h2{font-family:'Anton';font-weight:400;text-transform:uppercase;font-size:92px;line-height:1.02;margin-top:24px;letter-spacing:1px}
p{font-size:44px;line-height:1.32;margin-top:44px;color:#b3b0bd}p b{color:#ffffff}
.num{font-family:'Anton';font-size:240px;color:#8b6dff;line-height:1;opacity:.9}
.foot{position:absolute;left:88px;right:88px;bottom:70px;display:flex;justify-content:space-between;font-family:'JetBrains Mono';font-size:26px;color:#7d7a88}
.adv{position:absolute;top:40px;right:88px;font-family:'JetBrains Mono';font-size:24px;color:#7d7a88;border:2px solid #2c2838;padding:6px 14px;border-radius:8px}
.cta{margin-top:56px;display:inline-block;background:#5b3fd6;color:#ffffff;font-size:52px;font-weight:700;padding:22px 38px;border-radius:16px;align-self:flex-start}
.term{margin-top:56px;border:2px solid #2c2838;border-radius:18px;background:#13111b;padding:30px 36px;font-family:'JetBrains Mono';font-size:32px;line-height:1.9;color:#b3b0bd}.term .ok{color:#8b6dff}.term .ko{color:#ff4d5e}.risk{font-size:30px;color:#8d8a98;margin-top:36px}`;
const b=await chromium.launch(); const p=await b.newPage({viewport:{width:1080,height:1350}});
for(const [i,s] of S.entries()){
 await p.setContent(`<html><head><style>${css}</style></head><body><div class=grid></div><div class=glow></div>${s.adv?'<div class=adv>ADV</div>':''}<div class=wrap>${s.html}</div><div class=foot><span><b style="font-family:Anton;font-size:34px;color:#fff;letter-spacing:2px">MS</b>&nbsp;&nbsp;@marco_stanga_trader</span><span>${i+1+OFF}/${S.length+OFF}</span></div></body></html>`,{waitUntil:'networkidle'});
 await p.screenshot({path:`${out}/${String(i+1+OFF).padStart(2,'0')}.png`});
}
await b.close();
