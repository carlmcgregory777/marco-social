// Genera sito/link/kit-di-c.pdf da sito/link/kit-di-c.html (regalo del reel affiliato Higgsfield, parola VIDEO).
const { chromium } = await import(process.platform === 'win32' ? 'file:///C:/Users/stang/AppData/Roaming/npm/node_modules/playwright/index.mjs' : '/opt/node22/lib/node_modules/playwright/index.mjs');
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
const dir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../sito/link');
const b = await chromium.launch(); const p = await b.newPage();
await p.goto(pathToFileURL(path.join(dir, 'kit-di-c.html')).href, { waitUntil: 'networkidle' });
await p.evaluate(() => document.fonts.ready);
await p.pdf({ path: path.join(dir, 'kit-di-c.pdf'), format: 'A4', printBackground: true });
await b.close();
