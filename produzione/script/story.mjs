import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const [html,out]=process.argv.slice(2);
const b=await chromium.launch(); const p=await b.newPage({viewport:{width:1080,height:1920}});
await p.setContent(`<html><head><style>@import url('https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@500;700;800&family=JetBrains+Mono:wght@500&display=swap');
*{margin:0;box-sizing:border-box}body{width:1080px;height:1920px;background:#0b0a10;position:relative;overflow:hidden;font-family:Inter;color:#fff}
.grid{position:absolute;inset:0;background-image:linear-gradient(#ffffff08 1px,transparent 1px),linear-gradient(90deg,#ffffff08 1px,transparent 1px);background-size:60px 60px}
.glow{position:absolute;width:1400px;height:1400px;border-radius:50%;background:radial-gradient(#5b3fd666,transparent 62%);left:-160px;top:200px}
.tag{position:absolute;left:90px;top:260px;font-family:'JetBrains Mono';font-size:36px;color:#8b6dff;letter-spacing:3px}
h1{position:absolute;left:90px;right:90px;top:340px;font-family:Anton;font-weight:400;text-transform:uppercase;font-size:140px;line-height:1}
h1 em{font-style:normal;color:#8b6dff}
p{position:absolute;left:90px;right:90px;font-size:48px;line-height:1.3;color:#cfcbd9}
.box{position:absolute;left:90px;right:90px;border:3px dashed #5b3fd6;border-radius:30px;color:#8d8a98;font-family:'JetBrains Mono';font-size:30px;display:flex;align-items:center;justify-content:center}
.ms{position:absolute;left:90px;bottom:140px;font-family:'JetBrains Mono';font-size:30px;color:#7d7a88}.ms b{font-family:Anton;font-size:40px;color:#fff;letter-spacing:2px}
</style></head><body><div class=grid></div><div class=glow></div>${html}<div class=ms><b>MS</b>&nbsp;&nbsp;@cthe.trader</div></body></html>`,{waitUntil:'networkidle'});
await p.evaluate(()=>document.fonts.ready); await p.screenshot({path:out,type:'jpeg',quality:95}); await b.close();
