// Storie per le «storie in evidenza» di @marco_stanga_trader (fase 1, prima del link: niente Algory).
// Uso: node evidenza_storie.mjs <pers_C.png> <cartella_out>
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';
const [img, out] = process.argv.slice(2);
const b64 = fs.readFileSync(img).toString('base64');
// Ogni storia = teaser di UN post del piano (docs/PIANO-30-GIORNI.md), da pubblicare lo stesso giorno del post
// dopo le 18:30, con lo sticker del post nel riquadro tratteggiato. Poi «Aggiungi in evidenza» nel gruppo indicato.
// Non anticipa i contenuti dei post futuri. File: <gruppo>/<data>_<post>.jpg
const S = {
  '1_INIZIA_QUI': [
    { f: 'oggi_1', tag: 'INIZIA QUI · 1/3', face: true, h: 'Ciao, sono <em>C.</em>', p: 'Personaggio AI. Dietro c\'è <b>Marco</b>, che fa trading con i bot su un conto prop reale.' },
    { f: 'oggi_2', tag: 'INIZIA QUI · 2/3', h: 'Cosa trovi <em>qui</em>', list: ['I test che faccio ai bot', 'Gli errori che ho pagato io', 'Il mio sistema, passo passo'], p: 'Niente segnali. Niente promesse di guadagno.' },
    { f: 'oggi_3', tag: 'INIZIA QUI · 3/3', h: 'Da dove <em>partire</em>', list: ['TEST → come scarto i bot finti', 'ERRORI → cosa non rifare', 'SISTEMA → come li gestisco'], p: 'Un post nuovo ogni giorno alle <b>18:30</b>.' },
  ],
  '2_TEST': [
    { f: '16-10_R1', tag: 'TEST · REEL', h: 'Il backtest <em>perfetto</em> è una trappola', p: 'Una curva che sale sempre di solito vuol dire una cosa sola: il bot ha imparato il passato a memoria.', post: true },
    { f: '17-10_C-4test', tag: 'TEST · CAROSELLO', big: '4', h: 'Test prima dei <em>miei soldi</em>', p: 'Se un bot ne fallisce anche uno solo, è fuori. Te li mostro tutti e quattro.', post: true },
  ],
  '3_ERRORI': [
    { f: '18-10_R2', tag: 'ERRORI · REEL', big: '6 → 1', h: '6 bot, <em>una sola</em> scommessa', p: 'Pensavo di essere diversificato. Il mercato mi ha fatto vedere che non lo ero.', post: true },
    { f: '22-10_R4', tag: 'ERRORI · REEL', big: '−245 $', red: true, h: 'Per un ordine <em>dimenticato</em>', p: 'Un errore stupido, che puoi evitare con un controllo di 10 secondi.', post: true },
    { f: '24-10_R5', tag: 'ERRORI · REEL', h: 'I costi che il backtest <em>non ti mostra</em>', p: 'Commissioni e swap: quanto mi sono costati davvero in 5 mesi.', post: true },
  ],
  '4_SISTEMA': [
    { f: '19-10_C-sistema1', tag: 'SISTEMA · #1', h: 'Dentro il mio <em>sistema</em>', p: 'Come scelgo, provo e gestisco i bot sul mio conto prop. Una regola alla volta.', post: true },
    { f: '20-10_R3', tag: 'SISTEMA · REEL', h: 'Ogni bot ha una <em>scadenza</em>', p: 'Nessun bot funziona per sempre. Ecco come capisco quando cambiarlo.', post: true },
  ],
  '5_FAQ': [
    { f: '15-10_C-6regole', tag: 'FAQ · CAROSELLO', big: '6', h: 'Regole di una <em>challenge</em>', p: 'Quelle che ti fanno saltare il conto anche se sei in profitto.', post: true },
    { f: 'oggi_domanda', tag: 'FAQ', h: 'Hai una <em>domanda?</em>', p: 'Scrivila qui sotto: le migliori diventano un reel.', box: 'sticker DOMANDA' },
  ],
};
const css = `@import url('https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@500;700;800&family=JetBrains+Mono:wght@500&display=swap');
*{margin:0;box-sizing:border-box}body{width:1080px;height:1920px;background:#0b0a10;position:relative;overflow:hidden;font-family:Inter;color:#fff}
.grid{position:absolute;inset:0;background-image:linear-gradient(#ffffff08 1px,transparent 1px),linear-gradient(90deg,#ffffff08 1px,transparent 1px);background-size:60px 60px}
.glow{position:absolute;width:1400px;height:1400px;border-radius:50%;left:-160px;top:300px;background:radial-gradient(#5b3fd655,transparent 62%)}
.wrap{position:absolute;left:90px;right:90px;top:330px;bottom:330px;display:flex;flex-direction:column;justify-content:center;gap:44px}
.tag{font-family:'JetBrains Mono';font-size:34px;color:#8b6dff;letter-spacing:3px}
h1{font-family:Anton;font-weight:400;text-transform:uppercase;font-size:128px;line-height:1}
h1 em{font-style:normal;color:#8b6dff}
.big{font-family:Anton;font-size:200px;line-height:1;color:#8b6dff}.big.red{color:#ff4d5e}
p{font-size:50px;line-height:1.35;color:#cfcbd9}p b{color:#fff}
ul{list-style:none;display:flex;flex-direction:column;gap:22px}
li{font-size:52px;font-weight:800;padding-left:56px;position:relative}li:before{content:"";position:absolute;left:0;top:18px;width:28px;height:28px;border-radius:8px;background:#5b3fd6}
.face{width:380px;height:380px;border-radius:50%;border:10px solid #5b3fd6;background:url(data:image/png;base64,${b64}) center 18%/150% no-repeat}
.box{border:none;visibility:hidden;border-radius:30px;height:220px;display:flex;align-items:center;justify-content:center;color:#8d8a98;font-family:'JetBrains Mono';font-size:32px}
.ms{position:absolute;left:90px;bottom:160px;font-family:'JetBrains Mono';font-size:30px;color:#7d7a88}.ms b{font-family:Anton;font-size:40px;color:#fff;letter-spacing:2px}`;
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
for (const [grp, list] of Object.entries(S)) {
  fs.mkdirSync(`${out}/${grp}`, { recursive: true });
  for (const s of list) {
    const html = `<div class=grid></div><div class=glow></div><div class=wrap>
      <div class=tag>// ${s.tag}</div>${s.face ? '<div class=face></div>' : ''}${s.big ? `<div class="big${s.red ? ' red' : ''}">${s.big}</div>` : ''}
      <h1>${s.h}</h1>${s.list ? `<ul>${s.list.map(x => `<li>${x}</li>`).join('')}</ul>` : ''}${s.p ? `<p>${s.p}</p>` : ''}${s.box ? `<div class=box>${s.box}</div>` : ''}${s.post ? '<div class=box>sticker del post · «guardalo ora»</div>' : ''}</div>
      <div class=ms><b>MS</b>&nbsp;&nbsp;@marco_stanga_trader</div>`;
    await p.setContent(`<html><head><style>${css}</style></head><body>${html}</body></html>`, { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: `${out}/${grp}/${s.f}.jpg`, type: 'jpeg', quality: 90 });
  }
}
await b.close();
