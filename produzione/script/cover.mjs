import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const [title,sub,num,out]=process.argv.slice(2);
const b=await chromium.launch(); const p=await b.newPage({viewport:{width:1080,height:1920}});
await p.setContent(`<html><head><style>@import url('https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@500;700&family=JetBrains+Mono:wght@500&display=swap');
*{margin:0}body{width:1080px;height:1920px;background:#0b0a10;position:relative;overflow:hidden;font-family:Inter;color:#fff}
.grid{position:absolute;inset:0;background-image:linear-gradient(#ffffff08 1px,transparent 1px),linear-gradient(90deg,#ffffff08 1px,transparent 1px);background-size:60px 60px}
.glow{position:absolute;width:1400px;height:1400px;border-radius:50%;background:radial-gradient(#5b3fd666,transparent 62%);left:-160px;top:180px}
svg{position:absolute;left:0;top:1010px}
.tag{position:absolute;left:90px;top:330px;font-family:'JetBrains Mono';font-size:34px;color:#8b6dff;letter-spacing:3px}
h1{position:absolute;left:90px;right:90px;top:400px;font-family:Anton;font-weight:400;text-transform:uppercase;font-size:150px;line-height:.98;letter-spacing:1px}
h1 em{font-style:normal;color:#8b6dff}
.sub{position:absolute;left:90px;top:1460px;font-size:46px;color:#cfcbd9;font-weight:500}
.num{position:absolute;right:90px;top:316px;font-family:Anton;font-size:64px;color:#0b0a10;background:#8b6dff;padding:2px 22px;border-radius:12px}
.ms{position:absolute;left:90px;top:1560px;font-family:'JetBrains Mono';font-size:30px;color:#7d7a88}.ms b{font-family:Anton;font-size:40px;color:#fff;letter-spacing:2px}
</style></head><body><div class=grid></div><div class=glow></div>
<div class=tag>// TRADING ALGORITMICO</div><div class=num>${num}</div><h1>${title}</h1>
<svg width=1080 height=420 viewBox="0 0 1080 420"><defs><filter id=g><feGaussianBlur stdDeviation=8 result=b/><feMerge><feMergeNode in=b/><feMergeNode in=SourceGraphic/></feMerge></filter></defs>
<path d="M90 380 L200 340 L290 330 L380 280 L470 260 L560 200 L650 170 L720 110" stroke="#8b6dff" stroke-width=10 fill=none filter="url(#g)" stroke-linejoin="round"/>
<path d="M720 110 L790 190 L850 170 L920 290 L990 360" stroke="#ff4d5e" stroke-width=10 fill=none filter="url(#g)" stroke-linejoin="round"/>
<line x1=720 y1=40 x2=720 y2=420 stroke="#ff4d5e" stroke-width=3 stroke-dasharray="10 10"/></svg>
<div class=sub>${sub}</div><div class=ms><b>MS</b>&nbsp;&nbsp;@marco_stanga_trader</div></body></html>`,{waitUntil:'networkidle'});
await p.evaluate(()=>document.fonts.ready); await p.screenshot({path:out,type:'jpeg',quality:95}); await b.close();
