import { chromium } from "file:///C:/Users/stang/AppData/Roaming/npm/node_modules/playwright/index.mjs";
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await p.goto("file:///C:/Users/stang/code/marco-social/produzione/BF-blackfriday/cover/cover.html"); await p.waitForTimeout(800);
await p.screenshot({ path: "BF3-copertina-click.png" }); await b.close();
