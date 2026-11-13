// P1 prototipo «stile Hormozi» v2 (13/11/2026): YouTube 16:9, C in studio bianco alla scrivania.
// Analisi di riferimento: produzione/studio-hormozi/ANALISI-HORMOZI.md
// v2 (richiesta di Marco: «più regia, tagli energici, riprese dall'alto, niente cantilena, crescendo di stimoli»):
//   - lista di inquadrature (SHOT): labiale a 3 distanze + 4 riprese vere generate (totale basso, 2 dall'alto, laterale)
//   - ogni stacco ha il «punch» (zoom che rimbalza), il grafico entra con whip-pan sfocato, flash sul drop, shake sugli impatti
//   - testi che esplodono (BOTTA) sulle frasi chiave, doodle che si disegnano, DEFINIZIONE, tweet, sottopancia
//   - musica a crescendo (script/musica_regia.py) che si ferma di colpo sulla domanda finale + effetti sonori su ogni evento
// Tutti i tempi vengono dalle parole della voce (p1hormozi-parole.ts), mai scritti a mano.
import React from "react";
import { AbsoluteFill, Audio, Easing, Img, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadPatrick } from "@remotion/google-fonts/PatrickHandSC";
import { INTER, molla, ROSSO, VIOLA } from "./FormatC";
import { PAROLE_P1HORMOZI as P, DURATA_P1HORMOZI_S } from "./p1hormozi-parole";
import { DOODLE } from "./p1-doodle";

const { fontFamily: PENNA } = loadPatrick();
const C = "p1";
const FPS = 30;
const F = (s: number) => Math.round(s * FPS);
const CODA = 2.2; // titolo finale su nero
export const DURATA_P1HORMOZI = F(DURATA_P1HORMOZI_S + CODA);
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
  soldi: T("soldi"), non1: T("non"), bravo: T("bravo"), non2: T("Non", 2), grafici: T("grafici"), ore: T("ore"),
  conta3: T("Conta", 3), gioco: T("gioco"), ti: T("Ti"), mappa: T("mappa"), vert: T("verticale"), oriz: T("orizzontale"),
  primo: T("Primo"), sentimento: T("sentimento"), apri: T("Apri"), chiudi: T("chiudi"), tanta: T("Tanta"), pochi: T("pochi"),
  casella: T("casella"), secondo: T("Secondo"), segnali: T("segnali"), poca: T("Poca"), chi: T("chi", 1, T("Secondo")),
  nonTu: T("non", 1, T("vende")), tu: T("tu", 1, T("vende")),
  terzo: T("Terzo"), piano: T("piano"), entrata: T("Entrata"), uscita: T("uscita"), perdere: T("perdere"), prima: T("Prima", 1, T("Terzo")),
  quarto: T("Quarto"), sistema: T("sistema"), provato: T("provato"), backtest: T("backtest"), rispetta: T("rispetta"),
  drawdown: T("drawdown"), anche: T("anche"), quindi: T("Quindi"), quale: T("quale"), la2: T("La", 1, T("oggi")),
  inChe: T("in", 1, T("oggi")), giocando: T("giocando", 2), fine: DURATA_P1HORMOZI_S,
};

// ---------- lista delle inquadrature ----------
// parla = labiale (s = zoom, o = punto di zoom); clip = ripresa vera (file in public-p1/p1/clip)
type Shot =
  | { a: number; tipo: "parla"; s: number; o?: string; spinta?: number }
  | { a: number; tipo: "clip"; file: string; da?: number; s?: number; s2?: number; o?: string; vel?: number }
  | { a: number; tipo: "grafico"; caselle: number; zoomSu?: number; zoomA?: number; cerchio?: { n: number; a: number }; croce?: { n: number; a: number }; flash?: boolean };
const LARGO = 1.0, MEDIO = 1.28, STRETTO = 1.5;
const O_VISO = "50% 6%";
const SHOT: Shot[] = [
  { a: 0, tipo: "clip", file: "largo", s: 1.0, s2: 1.35, o: "50% 40%" },                  // apertura: totale basso che stringe
  { a: t.non1, tipo: "parla", s: MEDIO },
  { a: t.non2, tipo: "parla", s: LARGO },                                                  // + doodle grafici/ore
  { a: t.conta3, tipo: "parla", s: STRETTO, o: O_VISO, spinta: 0.08 },
  { a: t.ti, tipo: "clip", file: "alto-mappa", s: 1.12, s2: 1.3, o: "62% 70%" },           // dall'alto: disegna gli assi
  { a: t.mappa, tipo: "grafico", caselle: 1, zoomSu: 1, zoomA: t.sentimento - 0.2 },
  { a: t.apri, tipo: "clip", file: "laterale", s: 1.05, s2: 1.15, o: "70% 40%" },          // laterale mentre scrive
  { a: t.chiudi, tipo: "parla", s: STRETTO, o: O_VISO },
  { a: t.tanta, tipo: "parla", s: MEDIO },
  { a: t.casella - 0.25, tipo: "grafico", caselle: 2, croce: { n: 1, a: t.casella }, zoomSu: 2, zoomA: t.segnali },
  { a: t.poca, tipo: "parla", s: LARGO },                                                  // + doodle segnali/venditore
  { a: t.nonTu, tipo: "parla", s: STRETTO, o: O_VISO, spinta: 0.06 },
  { a: t.terzo, tipo: "grafico", caselle: 3, zoomSu: 3, zoomA: t.piano },
  { a: t.entrata, tipo: "clip", file: "alto-lista", s: 1.05, s2: 1.25, o: "35% 45%" },     // dall'alto: spunta la checklist
  { a: t.prima, tipo: "parla", s: STRETTO, o: O_VISO, spinta: 0.05 },
  { a: t.quarto, tipo: "grafico", caselle: 4, cerchio: { n: 4, a: t.sistema + 0.45 }, zoomSu: 4, zoomA: t.sistema + 0.9, flash: true },
  { a: t.provato, tipo: "parla", s: LARGO },                                               // + robot, scudo, definizioni
  { a: t.anche, tipo: "parla", s: MEDIO },
  { a: t.quindi, tipo: "parla", s: MEDIO, spinta: 0.3 },                                   // la musica si ferma: spinta lenta verso il viso
  { a: t.fine, tipo: "parla", s: STRETTO },                                                // (coda: titolo su nero sopra)
];
const fineShot = (i: number) => (i + 1 < SHOT.length ? SHOT[i + 1].a : t.fine + CODA);

// stacchi «a impatto»: shake e flash
const SHAKE = [t.bravo, t.gioco, t.casella, t.tu, t.quarto];

const Punch: React.FC<{ a: number; children: React.ReactNode; base: number; o: string; fino?: number; whip?: boolean }> = ({ a, children, base, o, fino = 0, whip }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fa = F(a);
  const m = molla(f, fps, fa, 14, 260);           // rimbalzo d'ingresso
  const s = base * (1 + 0.07 * (1 - m)) * (1 + fino);
  let x = 0, y = 0;
  for (const tt of SHAKE) {                       // tremolio smorzato dopo gli impatti
    const d = f - F(tt);
    if (d >= 0 && d < 10) { const k = (1 - d / 10) * 14; x += Math.sin(d * 2.7) * k; y += Math.cos(d * 3.3) * k * 0.6; }
  }
  const wx = whip ? interpolate(f - fa, [0, 6], [1920, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }) : 0;
  const blur = whip ? interpolate(f - fa, [0, 6], [18, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : interpolate(f - fa, [0, 2], [3, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#fff" }}>
      <AbsoluteFill style={{ transform: `translate(${x + wx}px, ${y}px) scale(${s})`, transformOrigin: o, filter: blur > 0.2 ? `blur(${blur}px)` : undefined }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

const Inquadratura: React.FC<{ i: number }> = ({ i }) => {
  const f = useCurrentFrame();
  const sh = SHOT[i];
  const a = sh.a, b = fineShot(i);
  const p = cl((f / FPS - a) / Math.max(0.1, b - a));
  if (sh.tipo === "parla") {
    // labiale: nessun startFrom, il clip dura quanto la voce e segue il frame assoluto
    return (
      <Punch a={a} base={sh.s} o={sh.o ?? "50% 26%"} fino={(sh.spinta ?? 0.015) * Easing.inOut(Easing.quad)(p)}>
        <OffthreadVideo src={staticFile(`${C}/C-parla.mp4`)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </Punch>
    );
  }
  if (sh.tipo === "clip") {
    const s = (sh.s ?? 1) + ((sh.s2 ?? sh.s ?? 1) - (sh.s ?? 1)) * Easing.inOut(Easing.quad)(p);
    return (
      <Punch a={a} base={s} o={sh.o ?? "50% 50%"}>
        {/* Sequence solo attorno al video (il Punch usa frame assoluti): la ripresa parte dall'inizio a ogni stacco */}
        <Sequence from={F(a)} layout="none">
          <OffthreadVideo src={staticFile(`${C}/clip/${sh.file}.mp4`)} muted startFrom={F(sh.da ?? 0.3)} playbackRate={sh.vel ?? 1} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </Sequence>
      </Punch>
    );
  }
  return null;
};

// ---------- doodle che si disegna ----------
const Doodle: React.FC<{ nome: string; a: number; b: number; x: number; y: number; h: number; etichetta?: string; col?: string; durata?: number }> = ({ nome, a, b, x, y, h, etichetta, col = INCHIOSTRO, durata = 0.7 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fa = F(a), fb = F(b);
  if (f < fa || f > fb + 6) return null;
  const D = DOODLE[nome];
  const sc = h / D.h;
  const w = D.w * sc;
  const tot = D.t.reduce((s, q) => s + q.l, 0);
  const p = ramp(f, fa, fa + F(durata));
  const pe = Easing.out(Easing.quad)(p) * tot;
  const pieno = ramp(f, fa + F(durata) - 2, fa + F(durata) + 4);
  const esci = ramp(f, fb, fb + 6);
  const pop = 1 + 0.12 * (1 - molla(f, fps, fa, 10, 220)); // piccolo rimbalzo d'ingresso
  let acc = 0;
  return (
    <div style={{ position: "absolute", left: x - w / 2, top: y - h / 2, width: w, opacity: 1 - esci, transform: `scale(${pop * (1 - 0.2 * esci)}) rotate(${(1 - pieno) * -3}deg)` }}>
      <svg width={w} height={h} viewBox={`0 0 ${D.w} ${D.h}`} style={{ position: "absolute", opacity: 1 - pieno }}>
        {D.t.map((q, i) => {
          const da = acc; acc += q.l;
          const vis = cl((pe - da) / q.l);
          return vis <= 0 ? null : <path key={i} d={q.d} fill="none" stroke={INCHIOSTRO} strokeWidth={D.s} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={q.l} strokeDashoffset={q.l * (1 - vis)} />;
        })}
      </svg>
      <Img src={staticFile(`${C}/doodle/${nome}.png`)} style={{ position: "absolute", width: w, height: h, opacity: pieno }} />
      {etichetta && <Scritta testo={etichetta} a={a + durata * 0.7} top={h + 6} w={w} col={col} size={Math.max(44, h * 0.17)} />}
    </div>
  );
};

const Scritta: React.FC<{ testo: string; a: number; top: number; w: number; col?: string; size?: number; durata?: number }> = ({ testo, a, top, w, col = INCHIOSTRO, size = 48, durata = 0.4 }) => {
  const f = useCurrentFrame();
  const p = ramp(f, F(a), F(a + durata));
  return <div style={{ position: "absolute", left: -w, width: w * 3, top, textAlign: "center", fontFamily: PENNA, fontSize: size, color: col, lineHeight: 1, clipPath: `inset(0 ${(1 - p) * 100}% 0 0)` }}>{testo}</div>;
};

// ---------- testi che esplodono ----------
// righe: "*parola" = riquadro viola, "!parola" = rosso barrato all'impatto
const Botta: React.FC<{ a: number; b: number; righe: string[]; top?: number; size?: number; barra?: number }> = ({ a, b, righe, top = 640, size = 118, barra }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < F(a) || f > F(b) + 5) return null;
  const u = ramp(f, F(b), F(b) + 5);
  let k = 0;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top, textAlign: "center", opacity: 1 - u }}>
      {righe.map((r, ri) => (
        <div key={ri} style={{ lineHeight: 1.0, marginBottom: 10 }}>
          {r.split(" ").map((w, wi) => {
            const d = F(a) + 2 * k++;
            const m = molla(f, fps, d, 11, 240);
            const viola = w.startsWith("*"), rosso = w.startsWith("!");
            const testo = w.replace(/^[*!]/, "");
            const barrata = rosso && barra !== undefined && f >= F(barra);
            const lb = barra !== undefined ? ramp(f, F(barra), F(barra) + 4) : 0;
            return (
              <span key={wi} style={{ display: "inline-block", position: "relative", margin: "0 30px", transform: `scale(${m}) rotate(${(1 - m) * -8}deg)`, opacity: m > 0.02 ? 1 : 0,
                fontFamily: INTER, fontWeight: 900, fontSize: size, letterSpacing: -3, textTransform: "uppercase",
                color: viola ? "#fff" : rosso && barrata ? ROSSO : INCHIOSTRO, background: viola ? VIOLA : undefined, padding: viola ? "0 18px" : undefined,
                textShadow: viola ? undefined : "0 0 18px #fff, 0 0 4px #fff, 0 4px 0 #ffffff" }}>
                {testo}
                {rosso && barrata && <span style={{ position: "absolute", left: -8, right: -8, top: "52%", height: 14, background: ROSSO, transform: `scaleX(${lb}) rotate(-4deg)`, transformOrigin: "left" }} />}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

// ---------- grafico-framework a tutto schermo ----------
const X0 = 300, Y0 = 900, X1 = 1700, Y1 = 230;
const CASELLE = [
  { n: 1, testo: ["TRADING A", "SENTIMENTO"], x: 520, y: 760, t: "sentimento" },
  { n: 2, testo: ["SEGNALI A", "PAGAMENTO"], x: 520, y: 360, t: "segnali" },
  { n: 3, testo: ["PIANO", "SCRITTO"], x: 1000, y: 560, t: "piano" },
  { n: 4, testo: ["SISTEMA CON", "REGOLE FISSE"], x: 1450, y: 400, t: "sistema" },
] as const;

const Tratto: React.FC<{ d: string; l: number; a: number; dur?: number; col?: string; w?: number }> = ({ d, l, a, dur = 0.4, col = INCHIOSTRO, w = 7 }) => {
  const f = useCurrentFrame();
  const p = Easing.out(Easing.quad)(ramp(f, F(a), F(a + dur)));
  return p <= 0 ? null : <path d={d} fill="none" stroke={col} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={l} strokeDashoffset={l * (1 - p)} />;
};

const ovale = (cx: number, cy: number, rx: number, ry: number) => {
  const pts: string[] = [];
  for (let i = 0; i <= 64; i++) {
    const a = -2.6 + (i / 64) * Math.PI * 2.15;
    const k = 1 + 0.04 * Math.sin(i * 0.7);
    pts.push(`${(cx + Math.cos(a) * rx * k).toFixed(1)} ${(cy + Math.sin(a) * ry * k - 4 * Math.sin(a * 0.5)).toFixed(1)}`);
  }
  return { d: "M" + pts.join(" L"), l: Math.PI * (rx + ry) * 1.1 };
};

const Grafico: React.FC<{ sh: Extract<Shot, { tipo: "grafico" }>; b: number }> = ({ sh, b }) => {
  const f = useCurrentFrame();
  const da = sh.a;
  const prima = da === t.mappa;
  const aa = prima ? da : da - 5;
  // regia sul grafico: dopo che la casella nuova si scrive, la camera ci zooma sopra
  const z = sh.zoomSu ? Easing.inOut(Easing.cubic)(ramp(f, F(sh.zoomA ?? da), F((sh.zoomA ?? da) + 0.5))) : 0;
  const cz = sh.zoomSu ? CASELLE[sh.zoomSu - 1] : CASELLE[0];
  const deriva = 1 + 0.03 * ramp(f, F(da), F(b));
  const sc = (1 + 0.55 * z) * deriva;
  const flash = sh.flash ? 1 - ramp(f, F(da), F(da) + 7) : 0;
  return (
    <Punch a={da} base={1} o="50% 50%" whip>
      <AbsoluteFill style={{ background: "#fff", transform: `scale(${sc})`, transformOrigin: `${(cz.x / 1920) * 100}% ${(cz.y / 1080) * 100}%` }}>
        <div style={{ position: "absolute", top: 70, width: "100%", textAlign: "center" }}>
          <div style={{ display: "inline-block", fontFamily: PENNA, fontSize: 92, color: INCHIOSTRO, clipPath: `inset(0 ${(1 - ramp(f, F(aa), F(aa + 0.5))) * 100}% 0 0)` }}>LA MAPPA DEL TRADER</div>
        </div>
        <svg width={1920} height={1080} style={{ position: "absolute" }}>
          <Tratto d={`M${X0} ${Y0 + 10} L${X0} ${Y1}`} l={690} a={aa + 0.15} />
          <Tratto d={`M${X0 - 18} ${Y1 + 26} L${X0} ${Y1} L${X0 + 18} ${Y1 + 26}`} l={70} a={aa + 0.5} dur={0.15} />
          <Tratto d={`M${X0 - 10} ${Y0} L${X1} ${Y0}`} l={1420} a={aa + 0.15} />
          <Tratto d={`M${X1 - 26} ${Y0 - 18} L${X1} ${Y0} L${X1 - 26} ${Y0 + 18}`} l={70} a={aa + 0.5} dur={0.15} />
          {sh.cerchio && (() => { const c = CASELLE[sh.cerchio.n - 1]; const o = ovale(c.x, c.y, 250, 105); return <Tratto d={o.d} l={o.l} a={sh.cerchio.a} dur={0.5} col={VIOLA} w={10} />; })()}
          {sh.croce && (() => { const c = CASELLE[sh.croce.n - 1]; return <>
            <Tratto d={`M${c.x - 200} ${c.y - 70} L${c.x + 200} ${c.y + 70}`} l={430} a={sh.croce.a} dur={0.2} col={ROSSO} w={13} />
            <Tratto d={`M${c.x + 200} ${c.y - 70} L${c.x - 200} ${c.y + 70}`} l={430} a={sh.croce.a + 0.18} dur={0.2} col={ROSSO} w={13} />
          </>; })()}
        </svg>
        <Etichetta x={X0 - 150} y={(Y0 + Y1) / 2} a={prima ? t.vert : aa} rot={-90} testo="FATICA" />
        <Etichetta x={X0 - 70} y={Y1 + 10} a={prima ? t.vert + 0.3 : aa} testo="POCA" col={VIOLA} size={40} />
        <Etichetta x={X0 - 70} y={Y0 - 10} a={prima ? t.vert + 0.5 : aa} testo="TANTA" col={ROSSO} size={40} />
        <Etichetta x={(X0 + X1) / 2} y={Y0 + 70} a={prima ? t.oriz : aa} testo="SOLDI CHE PUOI FARE" />
        <Etichetta x={X0 + 60} y={Y0 + 70} a={prima ? t.oriz + 0.4 : aa} testo="POCHI €" col={ROSSO} size={44} />
        <Etichetta x={X1 - 60} y={Y0 + 70} a={prima ? t.oriz + 0.6 : aa} testo="TANTI €" col={VIOLA} size={44} />
        {CASELLE.slice(0, sh.caselle).map((c) => {
          const ta = c.n === sh.caselle ? T(c.t) : aa; // la casella nuova si scrive sulla sua parola
          return <Casella key={c.n} n={c.n} righe={c.testo as unknown as string[]} x={c.x} y={c.y} a={ta} />;
        })}
      </AbsoluteFill>
      {flash > 0 && <AbsoluteFill style={{ background: "#fff", opacity: flash }} />}
    </Punch>
  );
};

const Etichetta: React.FC<{ x: number; y: number; a: number; testo: string; rot?: number; col?: string; size?: number }> = ({ x, y, a, testo, rot = 0, col = INCHIOSTRO, size = 46 }) => {
  const f = useCurrentFrame();
  const p = ramp(f, F(a), F(a + 0.35));
  return <div style={{ position: "absolute", left: x - 400, top: y - size / 2, width: 800, textAlign: "center", transform: `rotate(${rot}deg)`, fontFamily: PENNA, fontSize: size, lineHeight: 1, color: col, clipPath: `inset(0 ${(1 - p) * 100}% 0 0)` }}>{testo}</div>;
};

const Casella: React.FC<{ n: number; righe: string[]; x: number; y: number; a: number }> = ({ n, righe, x, y, a }) => {
  const f = useCurrentFrame();
  const p = ramp(f, F(a), F(a + 0.45));
  const cerchio = ramp(f, F(a), F(a + 0.2));
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
  const e = molla(f, fps, F(a), 18, 200);
  const u = ramp(f, F(b), F(b) + 8);
  const linea = ramp(f, F(a), F(a) + 8);
  return (
    <div style={{ position: "absolute", left: 90, bottom: 70, opacity: 1 - u, transform: `translateX(${(1 - e) * -80}px)` }}>
      <div style={{ position: "absolute", left: 14, top: 30, width: 2, height: 230 * linea, background: "#9a9aa8" }} />
      <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
        <div style={{ width: 30, height: 30, background: VIOLA }} />
        <div style={{ fontFamily: INTER, fontSize: 20, letterSpacing: 5, color: "#1c1c22", fontWeight: 500 }}>DEFINIZIONE</div>
      </div>
      <div style={{ marginLeft: 52, marginTop: 14, fontFamily: INTER, fontWeight: 300, fontSize: 40, letterSpacing: 1, color: "#16161b", clipPath: `inset(0 ${(1 - ramp(f, F(a) + 3, F(a) + 12)) * 100}% 0 0)` }}>{termine}</div>
      <div style={{ marginLeft: 48, marginTop: 14, width: 1300, padding: "26px 34px", background: "#f6f6f7", boxShadow: "0 8px 30px #0000002a", fontFamily: INTER, fontWeight: 600, fontSize: 34, lineHeight: 1.35, color: "#0e0e12", opacity: ramp(f, F(a) + 5, F(a) + 12) }}>{testo}</div>
    </div>
  );
};

// ---------- card «tweet» parola per parola ----------
const Tweet: React.FC<{ a: number; b: number }> = ({ a, b }) => {
  const f = useCurrentFrame();
  const sec = f / FPS;
  if (sec < a || sec > b) return null;
  const parole = P.filter((p) => p[0] >= a);
  const e = ramp(f, F(a), F(a) + 8);
  const nero = ramp(f, F(a) + 4, F(a) + 12);
  const g = Math.round(interpolate(nero, [0, 1], [110, 12]));
  return (
    <div style={{ position: "absolute", right: 110, top: 150, width: 640, padding: "36px 40px 44px", borderRadius: 26, background: `rgb(${g},${g},${g + 4})`, boxShadow: "0 18px 50px #0006", opacity: e, transform: `translateY(${(1 - e) * 20}px)` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <Img src={staticFile(`${C}/avatar.jpg`)} style={{ width: 76, height: 76, borderRadius: 38 }} />
        <div>
          <div style={{ fontFamily: INTER, fontWeight: 700, fontSize: 30, color: "#fff" }}>C · The Trader</div>
          <div style={{ fontFamily: INTER, fontSize: 24, color: "#8a8a96" }}>@cthe.trader</div>
        </div>
      </div>
      <div style={{ marginTop: 26, fontFamily: INTER, fontSize: 40, lineHeight: 1.3, color: "#fff" }}>
        {parole.map((p, i) => {
          const o = ramp(f, F(p[0]) - 2, F(p[0]) + 3);
          const acapo = i > 0 && p[2] !== parole[i - 1][2] && /^(La)$/.test(p[1]);
          return <React.Fragment key={i}>{acapo && <><br /><br /></>}<span style={{ opacity: 0.15 + 0.85 * o, fontWeight: /gioco|giocando/i.test(p[1]) ? 800 : 400, color: /gioco|giocando/i.test(p[1]) && o > 0.5 ? "#b9a6ff" : "#fff" }}>{p[1]} </span></React.Fragment>;
        })}
      </div>
    </div>
  );
};

// ---------- sottopancia nome ----------
const Nome: React.FC<{ a: number; b: number }> = ({ a, b }) => {
  const f = useCurrentFrame();
  if (f < F(a) || f > F(b) + 8) return null;
  const e = Easing.out(Easing.cubic)(ramp(f, F(a), F(a) + 8));
  const u = ramp(f, F(b), F(b) + 6);
  return (
    <div style={{ position: "absolute", left: 0, bottom: 150, opacity: 1 - u, clipPath: `inset(0 ${(1 - e) * 100}% 0 0)` }}>
      <div style={{ background: "#0d0d10", padding: "18px 44px 18px 90px" }}>
        <div style={{ fontFamily: INTER, fontWeight: 900, fontSize: 54, color: "#fff", letterSpacing: -1 }}>C · THE TRADER</div>
        <div style={{ fontFamily: INTER, fontSize: 22, color: "#c8c8d0", marginTop: 2 }}>personaggio AI · dietro c'è Marco · @cthe.trader</div>
      </div>
    </div>
  );
};

// ---------- coda: domanda su nero ----------
const Coda: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = F(t.giocando + 0.35);
  if (f < a) return null;
  const m = molla(f, fps, a, 12, 200);
  return (
    <AbsoluteFill style={{ background: "#0b0a10", alignItems: "center", justifyContent: "center" }}>
      <div style={{ transform: `scale(${0.7 + 0.3 * m})`, opacity: m, textAlign: "center", fontFamily: INTER, fontWeight: 900, fontSize: 120, letterSpacing: -4, color: "#fff", lineHeight: 1.0 }}>
        IN CHE <span style={{ background: VIOLA, padding: "0 20px" }}>GIOCO</span><br />STAI GIOCANDO?
      </div>
    </AbsoluteFill>
  );
};

// ---------- doodle ai lati di C ----------
const DOODLES = [
  { nome: "grafici", a: t.grafici - 0.15, b: t.conta3, x: 330, y: 380, h: 330, et: "GRAFICI" },
  { nome: "orologio", a: t.ore - 0.1, b: t.conta3, x: 1590, y: 380, h: 330, et: "ORE" },
  { nome: "montagne", a: t.apri + 0.1, b: t.chiudi, x: 330, y: 380, h: 360, et: "A SENTIMENTO", col: ROSSO },
  { nome: "segnali", a: t.poca, b: t.nonTu, x: 330, y: 400, h: 340, et: "SEGNALI" },
  { nome: "venditore", a: t.chi, b: t.nonTu, x: 1590, y: 400, h: 360, et: "CHI VENDE €€€", col: VIOLA },
  { nome: "robot", a: t.provato, b: t.quindi, x: 330, y: 380, h: 330, et: "REGOLE FISSE", col: VIOLA },
  { nome: "scudo", a: t.drawdown, b: t.quindi, x: 1590, y: 380, h: 330, et: "DRAWDOWN" },
];

// ---------- effetti sonori ----------
type Fx = [number, string, number?];
const FX: Fx[] = [
  [0, "boom", 0.5],
  [t.non1, "swish", 0.6], [t.bravo, "impact", 0.8], [t.non2, "swish", 0.5], [t.conta3, "swish", 0.6], [t.gioco, "boom", 0.8],
  [t.ti - 0.15, "whoosh", 0.7], [t.mappa - 0.1, "whoosh", 0.9],
  [t.vert, "scribble", 0.5], [t.oriz, "scribble", 0.5], [t.sentimento, "scribble", 0.6], [t.sentimento + 0.5, "ding", 0.4],
  [t.apri - 0.1, "whoosh", 0.5], [t.chiudi, "swish", 0.6], [t.tanta, "impact", 0.7], [t.pochi, "impact", 0.7],
  [t.casella - 0.35, "whoosh", 0.8], [t.casella, "impact", 0.9], [t.segnali, "scribble", 0.6], [t.segnali + 0.45, "ding", 0.4],
  [t.poca, "swish", 0.5], [t.nonTu, "swish", 0.6], [t.tu, "boom", 0.9],
  [t.terzo - 0.1, "whoosh", 0.8], [t.piano, "scribble", 0.6], [t.piano + 0.45, "ding", 0.4],
  [t.entrata - 0.1, "whoosh", 0.6], [t.entrata, "tick", 0.9], [t.uscita, "tick", 0.9], [t.perdere, "tick", 0.9],
  [t.prima, "swish", 0.6],
  [t.quarto - 0.1, "whoosh", 0.9], [t.sistema, "scribble", 0.6], [t.sistema + 0.45, "scribble", 0.6], [t.sistema + 0.5, "ding", 0.5],
  [t.provato, "swish", 0.5], [t.backtest, "whoosh", 0.4], [t.drawdown, "whoosh", 0.4], [t.anche, "swish", 0.5],
  [t.quindi, "whoosh", 0.4], [t.giocando + 0.35, "boom", 1.0],
];
for (const d of DOODLES) FX.push([d.a, "pop", 0.55], [d.a + 0.05, "scribble", 0.35]);

export const P1HORMOZI: React.FC = () => {
  const f = useCurrentFrame();
  const sec = f / FPS;
  const i = SHOT.findIndex((s, k) => sec >= s.a && sec < fineShot(k));
  const sh = SHOT[Math.max(0, i)];
  return (
    <AbsoluteFill style={{ background: "#fff" }}>
      {sh.tipo === "grafico" ? <Grafico sh={sh} b={fineShot(i)} /> : <Inquadratura i={Math.max(0, i)} />}
      {sh.tipo !== "grafico" && DOODLES.map((d) => <Doodle key={d.nome} nome={d.nome} a={d.a} b={d.b} x={d.x} y={d.y} h={d.h} etichetta={d.et} col={d.col} />)}
      {/* testi che esplodono */}
      <Botta a={0.1} b={t.non1 - 0.05} righe={["FARE *SOLDI", "COL TRADING?"]} top={720} />
      <Botta a={t.non1} b={t.non2 - 0.1} righe={["NON CONTA QUANTO", "SEI !BRAVO"]} top={700} barra={t.bravo + 0.15} />
      <Botta a={t.gioco - 0.25} b={t.ti - 0.05} righe={["CONTA IL *GIOCO"]} top={790} size={140} />
      <Botta a={t.tanta} b={t.casella - 0.3} righe={["TANTA !FATICA"]} top={640} barra={t.tanta + 0.2} />
      <Botta a={t.pochi} b={t.casella - 0.3} righe={["POCHI *SOLDI"]} top={800} />
      <Botta a={t.tu - 0.05} b={t.terzo - 0.1} righe={["NON *TU."]} top={760} size={150} />
      <Botta a={t.prima} b={t.quarto - 0.05} righe={["PRIMA DI *CLICCARE"]} top={790} />
      <Nome a={t.non2 + 0.1} b={t.conta3 - 0.1} />
      <Definizione a={t.backtest} b={t.drawdown - 0.1} termine="BACKTEST" testo="Provare una strategia sui dati del passato, con le stesse regole, prima di usarla con soldi veri." />
      <Definizione a={t.drawdown} b={t.quindi - 0.2} termine="DRAWDOWN" testo="Quanto scende il conto dal suo punto più alto prima di tornare a salire." />
      <Tweet a={t.quindi} b={t.giocando + 0.35} />
      <Coda />
      {/* audio */}
      <Audio src={staticFile(`${C}/voce.wav`)} />
      <Audio src={staticFile(`${C}/musica2.wav`)} volume={0.32} />
      {FX.map(([tt, nome, v], k) => (
        <Sequence key={k} from={Math.max(0, F(tt))} durationInFrames={F(2.2)}>
          <Audio src={staticFile(`${C}/sfx/${nome}.wav`)} volume={(v ?? 0.6) * 0.55} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
