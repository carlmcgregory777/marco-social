import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b=await chromium.launch(); const p=await b.newPage({viewport:{width:1080,height:1920}});
await p.setContent(`<html><head><style>@import url('https://fonts.googleapis.com/css2?family=Anton&family=JetBrains+Mono:wght@500&display=swap');
body{margin:0;width:1080px;height:1920px;background:transparent;position:relative}
.sh{position:absolute;left:0;right:0;top:0;height:760px;background:linear-gradient(#000000cc,#00000000)}
.t{position:absolute;left:80px;right:80px;top:200px;font-family:Anton;text-transform:uppercase;font-size:132px;line-height:1;color:#fff;letter-spacing:1px;text-shadow:0 6px 30px #000}
.t span{color:#8b6dff}.tag{position:absolute;left:80px;top:120px;font-family:'JetBrains Mono';font-size:34px;color:#8b6dff;letter-spacing:2px}</style></head>
<body><div class=sh></div><div class=tag>// TRADING ALGORITMICO</div><div class=t>Questo backtest<br>è <span>perfetto.</span></div></body></html>`,{waitUntil:'networkidle'});
await p.evaluate(()=>document.fonts.ready);
await p.screenshot({path:'title.png',omitBackground:true}); await b.close();
