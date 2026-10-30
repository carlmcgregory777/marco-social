const {chromium}=await import('file:///C:/Users/stang/AppData/Roaming/npm/node_modules/playwright/index.mjs');
import { pathToFileURL } from 'url';
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
await p.goto(pathToFileURL(process.argv[2]).href,{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);
for(const t of process.argv.slice(3)){await p.evaluate(t=>window.render(t),+t);await p.screenshot({path:`prova_${t}.jpg`,type:'jpeg',quality:70});}
await b.close();
