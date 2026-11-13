// P1 prototipo «stile Hormozi» (13/11/2026): YouTube 16:9, C in studio bianco alla scrivania.
// Analisi di riferimento: youtube/../studio-hormozi/ANALISI-HORMOZI.md
// Elementi: 3 «camere» finte (zoom a ogni frase), doodle a pennarello che si disegnano da soli ai lati,
// grafico-framework a tutto schermo che torna a ogni livello, scheda DEFINIZIONE, card «tweet» parola per parola,
// sottopancia nome. Tutti i tempi vengono dalle parole della voce (p1hormozi-parole.ts), mai scritti a mano.
import React from "react";
import { AbsoluteFill, Audio, Easing, Img, interpolate, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadPatrick } from "@remotion/google-fonts/PatrickHandSC";
import { INTER, molla, ROSSO, VIOLA } from "./FormatC";
import { PAROLE_P1HORMOZI as P, DURATA_P1HORMOZI_S } from "./p1hormozi-parole";
import { DOODLE } from "./p1-doodle";

const { fontFamily: PENNA } = loadPatrick();
const C = "p1";
const FPS = 30;
const F = (s: number) => Math.round(s * FPS);
export const DURATA_P1HORMOZI = F(DURATA_P1HORMOZI_S + 1.5);
const INCHIOSTRO = "#15131a";
const BLU = "#2a3fd6"; // «pennarello blu» delle etichette del grafico
const cl = (x: number) => Math.max(0, Math.min(1, x));
const ramp = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

// ---------- tempi dalle parole ----------
const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]/g, "");
/** secondo d'inizio della n-esima parola che comincia con `w` (dopo il secondo `dopo`) */
const T = (w: string, n = 1, dopo = 0): number => {
  let k = 0;
  for (const p of P) if (p[0] >= dopo && norm(p[1]).startsWith(norm(w)) && ++k === n) return p[0];
  throw new Error("parola non trovata: " + w);
};

const t = {
  grafici: T("grafici"), ore: T("ore"), conta3: T("Conta", 3),
  mappa: T("mappa"), vert: T("verticale"), oriz: T("orizzontale"),
  primo: T("Primo"), sentimento: T("sentimento"), apri: T("Apri"), tanta: T("Tanta"), casella: T("casella"),
  secondo: T("Secondo"), segnali: T("segnali"), poca: T("Poca"), chi: T("chi", 1, T("Secondo")),
  terzo: T("Terzo"), piano: T("piano"), entrata: T("Entrata"), prima: T("Prima", 1, T("Terzo")),
  quarto: T("Quarto"), sistema: T("sistema"), provato: T("provato"), backtest: T("backtest"), drawdown: T("drawdown"),
  quindi: T("Quindi"), fineVoce: DURATA_P1HORMOZI_S,
};

// ---------- base: C che parla, 3 camere finte ----------
const INQ = [
  { s: 1.0, o: "50% 30%" },   // totale
  { s: 1.32, o: "50% 26%" },  // mezzo busto
  { s: 1.55, o: "50% 6%" },   // primo piano
];
// a ogni nuova frase cambia camera; quando ci sono doodle ai lati si resta su totale/mezzo busto
const camera = (sec: number, doodle: boolean) => {
  const fr = P.filter((p) => p[0] <= sec).slice(-1)[0]?.[2] ?? 0;
  const seq = [0, 1, 2, 1, 0, 2, 1, 2, 0, 1];
  let i = seq[fr % seq.length];
  if (doodle && i === 2) i = 1;
  return INQ[i];
};

// intervalli in cui ci sono doodle ai lati (servono spazio)
const CON_DOODLE: [number, number][] = [];

const Parla: React.FC = () => {
  const f = useCurrentFrame();
  const sec = f / FPS;
  const d = CON_DOODLE.some(([a, b]) => sec >= a && sec < b);
  const c = camera(sec, d);
  const deriva = 1 + 0.012 * ((f % 150) / 150); // micro zoom lento dentro l'inquadratura
  return (
    <AbsoluteFill style={{ background: "#fff", overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(`${C}/C-parla.mp4`)} muted style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${c.s * deriva})`, transformOrigin: c.o }} />
    </AbsoluteFill>
  );
};

// ---------- doodle che si disegna ----------
const Doodle: React.FC<{ nome: string; a: number; b: number; x: number; y: number; h: number; etichetta?: string; col?: string; durata?: number }> = ({ nome, a, b, x, y, h, etichetta, col = INCHIOSTRO, durata = 0.9 }) => {
  const f = useCurrentFrame();
  const fa = F(a), fb = F(b);
  if (f < fa || f > fb + 8) return null;
  const D = DOODLE[nome];
  const sc = h / D.h;
  const w = D.w * sc;
  const tot = D.t.reduce((s, q) => s + q.l, 0);
  const p = ramp(f, fa, fa + F(durata)); // avanzamento del disegno
  const pe = Easing.inOut(Easing.quad)(p) * tot;
  const pieno = ramp(f, fa + F(durata) - 2, fa + F(durata) + 6); // poi compare l'icona vera (colori)
  const esci = ramp(f, fb, fb + 8);
  let acc = 0;
  return (
    <div style={{ position: "absolute", left: x - w / 2, top: y - h / 2, width: w, opacity: 1 - esci, transform: `scale(${1 - 0.15 * esci})` }}>
      <svg width={w} height={h} viewBox={`0 0 ${D.w} ${D.h}`} style={{ position: "absolute", opacity: 1 - pieno }}>
        {D.t.map((q, i) => {
          const da = acc; acc += q.l;
          const vis = cl((pe - da) / q.l);
          return vis <= 0 ? null : <path key={i} d={q.d} fill="none" stroke={INCHIOSTRO} strokeWidth={D.s} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={q.l} strokeDashoffset={q.l * (1 - vis)} />;
        })}
      </svg>
      <Img src={staticFile(`${C}/doodle/${nome}.png`)} style={{ position: "absolute", width: w, height: h, opacity: pieno }} />
      {etichetta && <Scritta testo={etichetta} a={a + durata * 0.7} top={h + 6} w={w} col={col} size={Math.max(40, h * 0.17)} />}
    </div>
  );
};

// testo «scritto a mano» che appare da sinistra a destra
const Scritta: React.FC<{ testo: string; a: number; top: number; w: number; col?: string; size?: number; durata?: number }> = ({ testo, a, top, w, col = INCHIOSTRO, size = 48, durata = 0.45 }) => {
  const f = useCurrentFrame();
  const p = ramp(f, F(a), F(a + durata));
  return (
    <div style={{ position: "absolute", left: -w, width: w * 3, top, textAlign: "center", fontFamily: PENNA, fontSize: size, color: col, lineHeight: 1, clipPath: `inset(0 ${(1 - p) * 100}% 0 0)` }}>
      <span style={{ display: "inline-block", clipPath: "none" }}>{testo}</span>
    </div>
  );
};

// ---------- grafico-framework a tutto schermo ----------
const X0 = 300, Y0 = 900, X1 = 1700, Y1 = 230; // assi
const CASELLE = [
  { n: 1, testo: ["TRADING A", "SENTIMENTO"], x: 520, y: 760, t: "sentimento" },
  { n: 2, testo: ["SEGNALI A", "PAGAMENTO"], x: 520, y: 360, t: "segnali" },
  { n: 3, testo: ["PIANO", "SCRITTO"], x: 1000, y: 560, t: "piano" },
  { n: 4, testo: ["SISTEMA CON", "REGOLE FISSE"], x: 1450, y: 400, t: "sistema" },
] as const;

const Tratto: React.FC<{ d: string; l: number; a: number; dur?: number; col?: string; w?: number }> = ({ d, l, a, dur = 0.5, col = INCHIOSTRO, w = 7 }) => {
  const f = useCurrentFrame();
  const p = Easing.out(Easing.quad)(ramp(f, F(a), F(a + dur)));
  return p <= 0 ? null : <path d={d} fill="none" stroke={col} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={l} strokeDashoffset={l * (1 - p)} />;
};

// ellisse «a mano» (leggermente storta e non chiusa del tutto) come path
const ovale = (cx: number, cy: number, rx: number, ry: number) => {
  const pts: string[] = [];
  for (let i = 0; i <= 64; i++) {
    const a = -2.6 + (i / 64) * Math.PI * 2.15;
    const k = 1 + 0.04 * Math.sin(i * 0.7);
    pts.push(`${(cx + Math.cos(a) * rx * k).toFixed(1)} ${(cy + Math.sin(a) * ry * k - 4 * Math.sin(a * 0.5)).toFixed(1)}`);
  }
  return { d: "M" + pts.join(" L"), l: Math.PI * (rx + ry) * 1.1 };
};

const Grafico: React.FC<{ vis: number; caselle: number; da: number; cerchio?: { n: number; a: number }; croce?: { n: number; a: number } }> = ({ vis, caselle, da, cerchio, croce }) => {
  const f = useCurrentFrame();
  // la prima volta (da = t.mappa) gli assi si disegnano; poi il grafico ricompare già pronto
  const prima = da === t.mappa;
  const aa = prima ? da : da - 5;
  return (
    <AbsoluteFill style={{ background: "#fff", opacity: vis }}>
      <div style={{ position: "absolute", top: 70, width: "100%", textAlign: "center" }}>
        <div style={{ position: "relative", display: "inline-block", fontFamily: PENNA, fontSize: 92, color: INCHIOSTRO, clipPath: `inset(0 ${(1 - ramp(f, F(aa), F(aa + 0.6))) * 100}% 0 0)` }}>
          LA MAPPA DEL TRADER
        </div>
      </div>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <Tratto d={`M${X0} ${Y0 + 10} L${X0} ${Y1}`} l={690} a={aa + 0.2} />
        <Tratto d={`M${X0 - 18} ${Y1 + 26} L${X0} ${Y1} L${X0 + 18} ${Y1 + 26}`} l={70} a={aa + 0.6} dur={0.2} />
        <Tratto d={`M${X0 - 10} ${Y0} L${X1} ${Y0}`} l={1420} a={aa + 0.2} />
        <Tratto d={`M${X1 - 26} ${Y0 - 18} L${X1} ${Y0} L${X1 - 26} ${Y0 + 18}`} l={70} a={aa + 0.6} dur={0.2} />
        {caselle >= 1 && cerchio && (() => { const c = CASELLE[cerchio.n - 1]; const o = ovale(c.x, c.y, 250, 105); return <Tratto d={o.d} l={o.l} a={cerchio.a} dur={0.6} col={VIOLA} w={9} />; })()}
        {croce && (() => { const c = CASELLE[croce.n - 1]; return <>
          <Tratto d={`M${c.x - 200} ${c.y - 70} L${c.x + 200} ${c.y + 70}`} l={430} a={croce.a} dur={0.3} col={ROSSO} w={12} />
          <Tratto d={`M${c.x + 200} ${c.y - 70} L${c.x - 200} ${c.y + 70}`} l={430} a={croce.a + 0.25} dur={0.3} col={ROSSO} w={12} />
        </>; })()}
      </svg>
      {/* etichette degli assi */}
      <Etichetta x={X0 - 150} y={(Y0 + Y1) / 2} a={prima ? t.vert : aa} rot={-90} testo="FATICA" />
      <Etichetta x={X0 - 70} y={Y1 + 10} a={prima ? t.vert + 0.3 : aa} testo="POCA" col={VIOLA} size={40} />
      <Etichetta x={X0 - 70} y={Y0 - 10} a={prima ? t.vert + 0.5 : aa} testo="TANTA" col={ROSSO} size={40} />
      <Etichetta x={(X0 + X1) / 2} y={Y0 + 70} a={prima ? t.oriz : aa} testo="SOLDI CHE PUOI FARE" />
      <Etichetta x={X0 + 60} y={Y0 + 70} a={prima ? t.oriz + 0.4 : aa} testo="POCHI €" col={ROSSO} size={44} />
      <Etichetta x={X1 - 60} y={Y0 + 70} a={prima ? t.oriz + 0.6 : aa} testo="TANTI €" col={VIOLA} size={44} />
      {CASELLE.slice(0, caselle).map((c) => {
        const ta = c.n === caselle ? (da > t.mappa || c.n === 1 ? T(c.t) : aa) : aa; // l'ultima casella si scrive sulla parola
        return <Casella key={c.n} n={c.n} righe={c.testo as unknown as string[]} x={c.x} y={c.y} a={ta} />;
      })}
    </AbsoluteFill>
  );
};

const Etichetta: React.FC<{ x: number; y: number; a: number; testo: string; rot?: number; col?: string; size?: number }> = ({ x, y, a, testo, rot = 0, col = INCHIOSTRO, size = 46 }) => {
  const f = useCurrentFrame();
  const p = ramp(f, F(a), F(a + 0.4));
  return <div style={{ position: "absolute", left: x - 400, top: y - size / 2, width: 800, textAlign: "center", transform: `rotate(${rot}deg)`, fontFamily: PENNA, fontSize: size, lineHeight: 1, color: col, clipPath: `inset(0 ${(1 - p) * 100}% 0 0)` }}>{testo}</div>;
};

const Casella: React.FC<{ n: number; righe: string[]; x: number; y: number; a: number }> = ({ n, righe, x, y, a }) => {
  const f = useCurrentFrame();
  const p = ramp(f, F(a), F(a + 0.55));
  const cerchio = ramp(f, F(a), F(a + 0.25));
  return (
    <div style={{ position: "absolute", left: x - 230, top: y - 60, width: 460, display: "flex", alignItems: "center", gap: 18 }}>
      <svg width={64} height={64} style={{ flex: "none" }}>
        <circle cx={32} cy={32} r={26} fill="none" stroke={BLU} strokeWidth={5} strokeDasharray={164} strokeDashoffset={164 * (1 - cerchio)} />
        <text x={32} y={44} textAnchor="middle" fontFamily={PENNA} fontSize={36} fill={BLU} opacity={cerchio}>{n}</text>
      </svg>
      <div style={{ fontFamily: PENNA, fontSize: 50, lineHeight: 1.0, color: BLU, clipPath: `inset(0 ${(1 - p) * 100}% 0 0)` }}>
        {righe.map((r) => <div key={r}>{r}</div>)}
      </div>
    </div>
  );
};

// ---------- scheda DEFINIZIONE ----------
const Definizione: React.FC<{ a: number; b: number; termine: string; testo: string }> = ({ a, b, termine, testo }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < F(a) || f > F(b) + 10) return null;
  const e = molla(f, fps, F(a), 18, 160);
  const u = ramp(f, F(b), F(b) + 8);
  const linea = ramp(f, F(a), F(a) + 10);
  return (
    <div style={{ position: "absolute", left: 90, bottom: 70, opacity: 1 - u, transform: `translateX(${(1 - e) * -60}px)` }}>
      <div style={{ position: "absolute", left: 14, top: 30, width: 2, height: 230 * linea, background: "#9a9aa8" }} />
      <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
        <div style={{ width: 30, height: 30, background: VIOLA }} />
        <div style={{ fontFamily: INTER, fontSize: 20, letterSpacing: 5, color: "#1c1c22", fontWeight: 500 }}>DEFINIZIONE</div>
      </div>
      <div style={{ marginLeft: 52, marginTop: 14, fontFamily: INTER, fontWeight: 300, fontSize: 40, letterSpacing: 1, color: "#16161b", clipPath: `inset(0 ${(1 - ramp(f, F(a) + 4, F(a) + 16)) * 100}% 0 0)` }}>{termine}</div>
      <div style={{ marginLeft: 48, marginTop: 14, width: 1300, padding: "26px 34px", background: "#f6f6f7", boxShadow: "0 8px 30px #0000002a", fontFamily: INTER, fontWeight: 600, fontSize: 34, lineHeight: 1.35, color: "#0e0e12", opacity: ramp(f, F(a) + 6, F(a) + 14) }}>{testo}</div>
    </div>
  );
};

// ---------- card «tweet» parola per parola ----------
const Tweet: React.FC<{ a: number }> = ({ a }) => {
  const f = useCurrentFrame();
  const sec = f / FPS;
  if (sec < a) return null;
  const parole = P.filter((p) => p[0] >= a);
  const e = ramp(f, F(a), F(a) + 8);
  const nero = ramp(f, F(a) + 4, F(a) + 12);
  return (
    <div style={{ position: "absolute", right: 120, top: 150, width: 640, padding: "36px 40px 44px", borderRadius: 26, background: `rgb(${interpolate(nero, [0, 1], [110, 12])},${interpolate(nero, [0, 1], [110, 12])},${interpolate(nero, [0, 1], [116, 16])})`, boxShadow: "0 18px 50px #0006", opacity: e, transform: `translateY(${(1 - e) * 20}px)` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <Img src={staticFile(`${C}/avatar.jpg`)} style={{ width: 76, height: 76, borderRadius: 38 }} />
        <div>
          <div style={{ fontFamily: INTER, fontWeight: 700, fontSize: 30, color: "#fff" }}>C · The Trader</div>
          <div style={{ fontFamily: INTER, fontSize: 24, color: "#8a8a96" }}>@cthe.trader</div>
        </div>
      </div>
      <div style={{ marginTop: 26, fontFamily: INTER, fontSize: 38, lineHeight: 1.35, color: "#fff" }}>
        {parole.map((p, i) => {
          const o = ramp(f, F(p[0]) - 2, F(p[0]) + 3);
          const acapo = i > 0 && p[2] !== parole[i - 1][2];
          return <React.Fragment key={i}>{acapo && <br />}<span style={{ opacity: 0.18 + 0.82 * o, color: o > 0.5 ? "#fff" : "#55555e" }}>{p[1]} </span></React.Fragment>;
        })}
      </div>
    </div>
  );
};

// ---------- sottopancia nome ----------
const Nome: React.FC<{ a: number; b: number }> = ({ a, b }) => {
  const f = useCurrentFrame();
  if (f < F(a) || f > F(b) + 8) return null;
  const e = Easing.out(Easing.cubic)(ramp(f, F(a), F(a) + 10));
  const u = ramp(f, F(b), F(b) + 8);
  return (
    <div style={{ position: "absolute", left: 0, bottom: 150, opacity: 1 - u, clipPath: `inset(0 ${(1 - e) * 100}% 0 0)` }}>
      <div style={{ background: "#0d0d10", padding: "18px 44px 18px 90px" }}>
        <div style={{ fontFamily: INTER, fontWeight: 900, fontSize: 54, color: "#fff", letterSpacing: -1 }}>C · THE TRADER</div>
        <div style={{ fontFamily: INTER, fontSize: 22, color: "#c8c8d0", marginTop: 2 }}>personaggio AI · dietro c'è Marco · @cthe.trader</div>
      </div>
    </div>
  );
};

// ---------- montaggio ----------
// finestre del grafico a tutto schermo: [inizio, fine, caselle visibili, extra]
type G = { a: number; b: number; caselle: number; cerchio?: { n: number; a: number }; croce?: { n: number; a: number } };
const GRAF: G[] = [
  { a: t.mappa, b: t.apri, caselle: 1 },
  { a: t.casella - 0.25, b: t.poca, caselle: 2, croce: { n: 1, a: t.casella } },
  { a: t.terzo, b: t.entrata, caselle: 3 },
  { a: t.quarto, b: t.provato, caselle: 4, cerchio: { n: 4, a: t.sistema + 0.5 } },
];

// doodle ai lati di C (C è al centro: x 330 e 1590)
const DOODLES = [
  { nome: "grafici", a: t.grafici - 0.15, b: t.conta3, x: 330, y: 380, h: 330, et: "GRAFICI" },
  { nome: "orologio", a: t.ore - 0.1, b: t.conta3, x: 1590, y: 380, h: 330, et: "ORE" },
  { nome: "montagne", a: t.apri, b: t.casella - 0.3, x: 1590, y: 400, h: 360, et: "A SENTIMENTO", col: ROSSO },
  { nome: "segnali", a: t.poca, b: t.terzo, x: 330, y: 400, h: 340, et: "SEGNALI" },
  { nome: "venditore", a: t.chi, b: t.terzo, x: 1590, y: 400, h: 360, et: "CHI VENDE €€€", col: VIOLA },
  { nome: "piano", a: t.entrata, b: t.quarto, x: 330, y: 400, h: 360, et: "PRIMA DI CLICCARE" },
  { nome: "robot", a: t.provato, b: t.quindi, x: 330, y: 380, h: 330, et: "REGOLE FISSE", col: VIOLA },
  { nome: "scudo", a: t.drawdown, b: t.quindi, x: 1590, y: 380, h: 330, et: "DRAWDOWN" },
];
for (const d of DOODLES) CON_DOODLE.push([d.a, d.b]);

export const P1HORMOZI: React.FC = () => {
  const f = useCurrentFrame();
  const sec = f / FPS;
  const g = GRAF.find((x) => sec >= x.a - 0.1 && sec < x.b + 0.1);
  // stacco netto come nel montaggio di Hormozi (2 frame di dissolvenza solo per non «scattare»)
  const visG = g ? ramp(f, F(g.a) - 1, F(g.a) + 1) * (1 - ramp(f, F(g.b) - 1, F(g.b) + 1)) : 0;
  return (
    <AbsoluteFill style={{ background: "#fff" }}>
      <Parla />
      {DOODLES.map((d) => <Doodle key={d.nome} nome={d.nome} a={d.a} b={d.b} x={d.x} y={d.y} h={d.h} etichetta={d.et} col={d.col} />)}
      <Nome a={1.3} b={t.grafici - 0.3} />
      <Definizione a={t.backtest} b={t.drawdown - 0.1} termine="BACKTEST" testo="Provare una strategia sui dati del passato, con le stesse regole, prima di usarla con soldi veri." />
      <Definizione a={t.drawdown} b={t.quindi - 0.2} termine="DRAWDOWN" testo="Quanto scende il conto dal suo punto più alto prima di tornare a salire." />
      <Tweet a={t.quindi} />
      {g && <Grafico vis={visG} caselle={g.caselle} da={g.a} cerchio={g.cerchio} croce={g.croce} />}
      <Audio src={staticFile(`${C}/voce.wav`)} />
      <Audio src={staticFile(`${C}/musica.wav`)} volume={0.1} />
    </AbsoluteFill>
  );
};
