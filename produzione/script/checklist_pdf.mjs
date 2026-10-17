// Genera sito/link/checklist-4-test.pdf da sito/link/checklist.html (regalo della pagina link in bio).
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import path from 'path';
const dir = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../../sito/link');
const b = await chromium.launch(); const p = await b.newPage();
await p.goto(`file://${dir}/checklist.html`, { waitUntil: 'networkidle' });
await p.evaluate(() => document.fonts.ready);
await p.pdf({ path: `${dir}/checklist-4-test.pdf`, format: 'A4', printBackground: true });
await b.close();
