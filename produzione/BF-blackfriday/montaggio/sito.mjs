import { chromium } from "file:///C:/Users/stang/AppData/Roaming/npm/node_modules/playwright/index.mjs";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1.5 });
await p.goto("https://c-thetrader.com/");
await p.waitForTimeout(1500);
await p.screenshot({ path: process.argv[2] });
await p.evaluate(() => window.scrollTo(0, 900)); await p.waitForTimeout(600);
await p.screenshot({ path: process.argv[3] });
await b.close();
