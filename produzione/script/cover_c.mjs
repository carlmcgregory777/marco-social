const {chromium}=await import(process.platform==='win32'?'file:///C:/Users/stang/AppData/Roaming/npm/node_modules/playwright/index.mjs':'/opt/node22/lib/node_modules/playwright/index.mjs');
import fs from 'fs';
const [title,sub,num,img,out]=process.argv.slice(2);
const b64=fs.readFileSync(img).toString('base64');
const b=await chromium.launch(); const p=await b.newPage({viewport:{width:1080,height:1920}});
await p.setContent(`<html><head><style>@import url('https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@500;700&family=JetBrains+Mono:wght@500&display=swap');
*{margin:0}body{width:1080px;height:1920px;background:#0b0a10;position:relative;overflow:hidden;font-family:Inter;color:#fff}
.glow{position:absolute;width:1300px;height:1300px;border-radius:50%;background:radial-gradient(#5b3fd677,transparent 62%);left:-110px;top:700px}
.pic{position:absolute;left:0;right:0;bottom:0;height:1150px;background:url(data:image/png;base64,${b64}) center top/cover no-repeat;-webkit-mask-image:linear-gradient(to bottom,transparent 0,#000 22%)}
.tag{position:absolute;left:90px;top:320px;font-family:'JetBrains Mono';font-size:34px;color:#8b6dff;letter-spacing:3px}
h1{position:absolute;left:90px;right:90px;top:405px;font-family:Anton;font-weight:400;text-transform:uppercase;font-size:138px;line-height:.98;text-shadow:0 8px 40px #000}
h1 em{font-style:normal;color:#8b6dff}
.num{position:absolute;right:90px;top:300px;font-family:Anton;font-size:60px;color:#fff;background:#5b3fd6;padding:2px 22px;border-radius:12px}
.sub{position:absolute;left:90px;right:90px;bottom:380px;font-size:46px;font-weight:700;text-shadow:0 4px 20px #000}
.sub span{background:#5b3fd6;padding:4px 14px;border-radius:10px}
</style></head><body><div class=glow></div><div class=pic></div><div class=tag>// TRADING ALGORITMICO</div><div class=num>${num}</div><h1>${title}</h1><div class=sub><span>${sub}</span></div></body></html>`,{waitUntil:'networkidle'});
await p.waitForTimeout(1500); await p.evaluate(async()=>{await Promise.all(['138px Anton','700 46px Inter',"34px 'JetBrains Mono'"].map(f=>document.fonts.load(f)));await document.fonts.ready}); await p.screenshot({path:out,type:'jpeg',quality:93}); await b.close();
