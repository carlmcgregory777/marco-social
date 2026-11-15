// Dentro Algory #9 «stile Hormozi» (15/11/2026, Marco: «più stile Hormozi del reel di prima, ma non tralasciare
// v3 (15/11/2026 sera): gancio con labiale vero (Higgsfield Intone) e clip Kling 4.0 «Panda → Ferrari» sul neopatentato.
// le schermate Algory, esempi che intrattengano fino alla fine, curiosità da subito»).
// Modello: P1VERT.tsx (studio bianco, testi che esplodono, doodle, grafico-framework, DEFINIZIONE, tweet, coda).
// Novità: schermate VERE di Algory a tutto schermo (ritagli dal reel di Vaga in algory9-incubazione/fonte),
// grafico «crollo» (backtest bello → 4 perdite di fila), framework «LA SCALA DEL RISCHIO» ripreso 3 volte,
// lavagna con doodle grande. C parla in camera solo in 8 pezzi (montaggio/segmenti.json): la clip del labiale
// contiene solo quei pezzi, uno dopo l'altro, e SEG dice dove inizia ognuno.
import React from "react";
import { AbsoluteFill, Audio, Easing, Img, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadPatrick } from "@remotion/google-fonts/PatrickHandSC";
import { ANTON, INTER, MONO, molla, ROSSO, VIOLA } from "./FormatC";
import { PAROLE_AL9H as P, DURATA_AL9H_S } from "./al9h-parole";
import { DOODLE } from "./al9h-doodle";

const { fontFamily: PENNA } = loadPatrick();
const C = "al9h";
const FPS = 30;
const F = (s: number) => Math.round(s * FPS);
const CODA = 2.6;
export const DURATA_AL9H = F(DURATA_AL9H_S + 0.35 + CODA);
const W = 1080, H = 1920;
const VW = 3413, VH = 1920;
const DY = 470;
const BIANCO = "rgb(251,254,250)";
const INCHIOSTRO = "#15131a";
const BLU = "#2a3fd6";
const cl = (x: number) => Math.max(0, Math.min(1, x));
const ramp = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

// pezzi parlati in camera: da/a = secondi nel video, clip = secondo d'inizio nella clip del labiale
const SEG = [
  { da: 0, a: 3.78, clip: 0.3 }, { da: 14.54, a: 18.93, clip: 4.38 }, { da: 18.77, a: 23.45, clip: 9.07 },
  { da: 26.09, a: 27.78, clip: 14.04 }, { da: 34.37, a: 35.5, clip: 16.04 }, { da: 36.37, a: 38.08, clip: 17.47 },
  { da: 40.95, a: 45.91, clip: 19.49 }, { da: 45.56, a: 47.46, clip: 24.75 },
];
const segDi = (a: number) => { let s = SEG[0]; for (const x of SEG) if (x.da <= a + 0.001) s = x; return s; };

// ---------- tempi dalle parole ----------
const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]/g, "");
const T = (w: string, n = 1, dopo = 0): number => {
  let k = 0;
  for (const p of P) if (p[0] >= dopo && norm(p[1]) === norm(w) && ++k === n) return p[0];
  throw new Error("parola non trovata: " + w);
};
const t = {
  pericoloso: T("pericoloso"), e1: T("È"), col: T("col"), immagina: T("Immagina"), backtest: T("backtest", 2), trenta: T("trenta"),
  tu: T("Tu"), rischio: T("rischio"), settimana: T("settimana"), quattro: T("quattro"), meno: T("Meno"),
  e2: T("È", 1, T("Meno")), sfortuna: T("sfortuna"), nonSai: T("Non", 1, T("funziona") + 0.3), paghi: T("paghi"), quindi: T("Quindi"),
  neopatentato: T("neopatentato"), panda: T("Panda"), ferrari: T("Ferrari"),
  g1: T("Gradino"), venticinque: T("venticinque"), rischio2: T("rischio", 2), se1: T("Se"), poco: T("poco"),
  g2: T("Gradino", 2), due: T("due"), decina: T("decina"), trade: T("trade"), sale: T("Sale"), cinquanta: T("cinquanta"),
  g3: T("Gradino", 3), tre: T("tre"), trentina: T("trentina"), pieno2: T("pieno", 2), se2: T("Se", 2),
  e3: T("E", 1, T("guadagnato")), spegne: T("spegne"), non2: T("Non", 1, T("spegne")), sentimento: T("sentimento"), algory1: T("Algory"),
  dalla: T("dalla"), panchina: T("panchina"), nuovo: T("nuovo", 3), ecco: T("Ecco"), gradini: T("gradini"),
  il2: T("Il", 1, T("gradini")), algory2: T("Algory", 2), link: T("Link"), codice: T("codice"), venti2: T("venti", 2), e4: T("E", 1, T("sconto")),
  gratis: T("gratis"), fine: DURATA_AL9H_S,
};

// ---------- inquadrature ----------
type Shot =
  | { a: number; tipo: "parla"; s: number; o?: string; spinta?: number }
  | { a: number; tipo: "algo"; file: string; vel?: number; s?: number; s2?: number; op?: string }
  | { a: number; tipo: "film"; file: string; vel?: number }
  | { a: number; tipo: "crollo" }
  | { a: number; tipo: "scala"; n: 1 | 2 | 3 }
  | { a: number; tipo: "lavagna"; doodle: string; et: string };
const LARGO = 1.0, MEDIO = 1.1, STRETTO = 1.2;
const O_VISO = "50% 33%";
const SHOT: Shot[] = [
  { a: 0, tipo: "parla", s: MEDIO },
  { a: t.e1, tipo: "parla", s: STRETTO, o: O_VISO, spinta: 0.05 },
  { a: t.col - 0.03, tipo: "algo", file: "passaporto", vel: 0.49, s: 1.0, s2: 1.12 },
  { a: t.tu, tipo: "crollo" },
  { a: t.e2 - 0.15, tipo: "parla", s: MEDIO },
  { a: t.nonSai, tipo: "parla", s: STRETTO, o: O_VISO },
  { a: T("E", 1, t.nonSai), tipo: "parla", s: MEDIO },
  { a: t.quindi, tipo: "parla", s: LARGO },
  { a: t.neopatentato - 0.1, tipo: "film", file: "panda-ferrari", vel: 0.7 },
  { a: t.g1, tipo: "scala", n: 1 },
  { a: t.se1 - 0.15, tipo: "parla", s: STRETTO, o: O_VISO },
  { a: t.g2, tipo: "scala", n: 2 },
  { a: t.trade - 0.1, tipo: "algo", file: "radar10", vel: 0.8, s: 1.0, s2: 1.1 },
  { a: t.sale, tipo: "algo", file: "quarto", vel: 0.9, s: 1.05, s2: 1.15, op: "50% 38%" },
  { a: t.g3, tipo: "scala", n: 3 },
  { a: t.se2 - 0.15, tipo: "parla", s: STRETTO, o: O_VISO, spinta: 0.03 },
  { a: t.e3, tipo: "algo", file: "fades", vel: 1.0, s: 1.0, s2: 1.08 },
  { a: t.non2 - 0.15, tipo: "parla", s: MEDIO },
  { a: t.algory1, tipo: "algo", file: "ruota", vel: 1.0, s: 1.0, s2: 1.1 },
  { a: t.dalla - 0.1, tipo: "lavagna", doodle: "panchina", et: "IN PANCHINA" },
  { a: t.ecco - 0.15, tipo: "parla", s: MEDIO, spinta: 0.1 },
  { a: t.il2 - 0.15, tipo: "parla", s: STRETTO, o: O_VISO },
  { a: t.link, tipo: "algo", file: "radar", vel: 0.8, s: 1.0, s2: 1.08 },
  { a: t.venti2, tipo: "algo", file: "vault", vel: 0.9, s: 1.0, s2: 1.1 },
  { a: t.e4, tipo: "algo", file: "verdi", vel: 0.8, s: 1.0, s2: 1.1 },
];
const fineShot = (i: number) => (i + 1 < SHOT.length ? SHOT[i + 1].a : t.fine + 0.35 + CODA);
const SHAKE = [t.pericoloso, t.meno, t.nonSai, t.sentimento, t.pieno2, t.algory2];

const Punch: React.FC<{ a: number; children: React.ReactNode; base: number; o: string; fino?: number; whip?: boolean; bg?: string }> = ({ a, children, base, o, fino = 0, whip, bg = BIANCO }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fa = F(a);
  const m = molla(f, fps, fa, 14, 260);
  const s = base * (1 + 0.07 * (1 - m)) * (1 + fino);
  let x = 0, y = 0;
  for (const tt of SHAKE) {
    const d = f - F(tt);
    if (d >= 0 && d < 10) { const k = (1 - d / 10) * 14; x += Math.sin(d * 2.7) * k; y += Math.cos(d * 3.3) * k * 0.6; }
  }
  const wx = whip ? interpolate(f - fa, [0, 6], [W, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }) : 0;
  const blur = whip ? interpolate(f - fa, [0, 6], [18, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : interpolate(f - fa, [0, 2], [3, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: bg }}>
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
    const sg = segDi(a);
    return (
      <Punch a={a} base={sh.s} o={sh.o ?? "50% 32%"} fino={(sh.spinta ?? 0.015) * Easing.inOut(Easing.quad)(p)}>
        <div style={{ position: "absolute", left: (W - VW) / 2, top: DY, width: VW, height: VH }}>
          <Sequence from={F(sg.da)} layout="none">
            <OffthreadVideo src={staticFile(`${C}/C-parla.mp4`)} startFrom={F(sg.clip)} muted style={{ width: "100%", height: "100%" }} />
          </Sequence>
          <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 60, background: `linear-gradient(${BIANCO}, transparent)` }} />
        </div>
      </Punch>
    );
  }
  if (sh.tipo === "algo") {
    const s = (sh.s ?? 1) + ((sh.s2 ?? sh.s ?? 1) - (sh.s ?? 1)) * Easing.inOut(Easing.quad)(p);
    return (
      <Punch a={a} base={s} o="50% 50%" whip bg="#000">
        <Sequence from={F(a)} layout="none">
          <OffthreadVideo src={staticFile(`${C}/clip/${sh.file}.mp4`)} muted playbackRate={sh.vel ?? 1} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: sh.op ?? "50% 50%" }} />
        </Sequence>
        <AbsoluteFill style={{ background: "linear-gradient(180deg, #000c 0%, transparent 30%, transparent 62%, #000b 100%)" }} />
        <div style={{ position: "absolute", left: 40, bottom: 120, fontFamily: MONO, fontSize: 24, letterSpacing: 2, color: "#ffffff99" }}>ALGORY · SCHERMATA VERA</div>
      </Punch>
    );
  }
  if (sh.tipo === "film") {
    // clip generata (Kling 4.0, 15/11/2026): NON è una schermata di Algory, quindi niente etichetta
    return (
      <Punch a={a} base={1 + 0.05 * Easing.inOut(Easing.quad)(p)} o="50% 40%" whip bg="#000">
        <Sequence from={F(a)} layout="none">
          <OffthreadVideo src={staticFile(`${C}/clip/${sh.file}.mp4`)} muted playbackRate={sh.vel ?? 1} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </Sequence>
        <AbsoluteFill style={{ background: "linear-gradient(180deg, #000a 0%, transparent 28%, transparent 66%, #000a 100%)" }} />
      </Punch>
    );
  }
  if (sh.tipo === "crollo") return <Crollo a={a} b={b} />;
  if (sh.tipo === "scala") return <Scala a={a} b={b} n={sh.n} />;
  if (sh.tipo === "lavagna") {
    return (
      <Punch a={a} base={1 + 0.04 * p} o="50% 50%" whip>
        <AbsoluteFill style={{ background: "#fff" }}>
          <Doodle nome={sh.doodle} a={a + 0.1} b={b + 1} x={540} y={900} h={560} etichetta={sh.et} durata={0.9} />
        </AbsoluteFill>
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
  const pop = 1 + 0.12 * (1 - molla(f, fps, fa, 10, 220));
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
      {etichetta && <Scritta testo={etichetta} a={a + durata * 0.7} top={h + 6} w={w} col={col} size={52} />}
    </div>
  );
};

const Scritta: React.FC<{ testo: string; a: number; top: number; w: number; col?: string; size?: number; durata?: number }> = ({ testo, a, top, w, col = INCHIOSTRO, size = 48, durata = 0.4 }) => {
  const f = useCurrentFrame();
  const p = ramp(f, F(a), F(a + durata));
  return <div style={{ position: "absolute", left: -w, width: w * 3, top, textAlign: "center", fontFamily: PENNA, fontSize: size, color: col, lineHeight: 1, clipPath: `inset(0 ${(1 - p) * 100}% 0 0)` }}>{testo}</div>;
};

// ---------- testi che esplodono ("*" viola, "!" rosso barrato) ----------
const Botta: React.FC<{ a: number; b: number; righe: string[]; top?: number; size?: number; barra?: number; scuro?: boolean }> = ({ a, b, righe, top = 250, size = 104, barra, scuro }) => {
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
            const m = molla(f, fps, d, 15, 260);
            const viola = w.startsWith("*"), rosso = w.startsWith("!");
            const testo = w.replace(/^[*!]/, "");
            const barrata = rosso && barra !== undefined && f >= F(barra);
            const lb = barra !== undefined ? ramp(f, F(barra), F(barra) + 4) : 0;
            const colore = viola ? "#fff" : rosso && barrata ? ROSSO : scuro ? "#fff" : INCHIOSTRO;
            return (
              <span key={wi} style={{ display: "inline-block", position: "relative", margin: "0 22px", transform: `scale(${m}) rotate(${(1 - m) * -8}deg)`, opacity: m > 0.02 ? 1 : 0,
                fontFamily: INTER, fontWeight: 900, fontSize: size, letterSpacing: -3, textTransform: "uppercase",
                color: colore, background: viola ? VIOLA : undefined, padding: viola ? "0 18px" : undefined,
                textShadow: viola ? undefined : scuro ? "0 6px 24px #000, 0 0 8px #000" : "0 0 18px #fff, 0 0 4px #fff, 0 4px 0 #ffffff" }}>
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

const Tratto: React.FC<{ d: string; l: number; a: number; dur?: number; col?: string; w?: number; tratteggio?: boolean }> = ({ d, l, a, dur = 0.4, col = INCHIOSTRO, w = 7, tratteggio }) => {
  const f = useCurrentFrame();
  const p = Easing.out(Easing.quad)(ramp(f, F(a), F(a + dur)));
  if (p <= 0) return null;
  if (tratteggio) return <path d={d} fill="none" stroke={col} strokeWidth={w} strokeLinecap="round" strokeDasharray="4 18" style={{ clipPath: `inset(0 ${(1 - p) * 100}% 0 0)` }} />;
  return <path d={d} fill="none" stroke={col} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={l} strokeDashoffset={l * (1 - p)} />;
};

const Etichetta: React.FC<{ x: number; y: number; a: number; testo: string; rot?: number; col?: string; size?: number; dur?: number }> = ({ x, y, a, testo, rot = 0, col = INCHIOSTRO, size = 52, dur = 0.35 }) => {
  const f = useCurrentFrame();
  const p = ramp(f, F(a), F(a + dur));
  return <div style={{ position: "absolute", left: x - 450, top: y - size / 2, width: 900, textAlign: "center", transform: `rotate(${rot}deg)`, fontFamily: PENNA, fontSize: size, lineHeight: 1, color: col, clipPath: `inset(0 ${(1 - p) * 100}% 0 0)` }}>{testo}</div>;
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

// ---------- grafico «crollo»: backtest bellissimo, poi 4 perdite di fila ----------
const BT = (() => { // curva del backtest: sale con piccole discese (deterministica)
  const pts: [number, number][] = [];
  let y = 1060;
  for (let i = 0; i <= 26; i++) { const x = 120 + i * 20; y -= 17 + 9 * Math.sin(i * 1.7) - (i % 5 === 3 ? 30 : 0); pts.push([x, y]); }
  return pts;
})();
const X_LIVE = BT[BT.length - 1][0];
const Y_LIVE = BT[BT.length - 1][1];
const PERDITE = [0, 1, 2, 3].map((k) => [X_LIVE + 60 * (k + 1), Y_LIVE + 95 * (k + 1)] as [number, number]);

const Crollo: React.FC<{ a: number; b: number }> = ({ a, b }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dBT = "M" + BT.map(([x, y]) => `${x} ${y}`).join(" L");
  const tp = [t.quattro, t.quattro + 0.3, t.quattro + 0.6, t.quattro + 0.9];
  const meno = molla(f, fps, F(t.meno), 10, 240);
  const deriva = 1 + 0.04 * ramp(f, F(a), F(b));
  return (
    <Punch a={a} base={deriva} o="60% 45%" whip>
      <AbsoluteFill style={{ background: "#fff" }}>
        <div style={{ position: "absolute", top: 250, width: "100%", textAlign: "center", fontFamily: PENNA, fontSize: 80, color: INCHIOSTRO, clipPath: `inset(0 ${(1 - ramp(f, F(a), F(a + 0.5))) * 100}% 0 0)` }}>IL TUO BOT NUOVO</div>
        <svg width={W} height={H} style={{ position: "absolute" }}>
          <Tratto d={`M100 1120 L980 1120`} l={880} a={a + 0.05} w={5} />
          <Tratto d={dBT} l={900} a={a + 0.15} dur={0.8} col={VIOLA} w={10} />
          <Tratto d={`M${X_LIVE + 8} 470 L${X_LIVE + 8} 1130`} l={660} a={t.settimana - 0.1} dur={0.3} col="#9a9aa8" w={5} tratteggio />
          {PERDITE.map(([x, y], k) => {
            const [x0, y0] = k === 0 ? [X_LIVE, Y_LIVE] : PERDITE[k - 1];
            return <React.Fragment key={k}>
              <Tratto d={`M${x0} ${y0} L${x} ${y}`} l={120} a={tp[k]} dur={0.15} col={ROSSO} w={11} />
              <Tratto d={`M${x - 22} ${y - 22} L${x + 22} ${y + 22} M${x + 22} ${y - 22} L${x - 22} ${y + 22}`} l={130} a={tp[k] + 0.12} dur={0.12} col={ROSSO} w={9} />
            </React.Fragment>;
          })}
        </svg>
        <Etichetta x={330} y={560} a={t.trenta - 1.2} testo="BACKTEST: +30%" col={VIOLA} size={60} />
        <Etichetta x={330} y={630} a={t.trenta - 0.9} testo="quasi zero perdite" size={44} />
        {f >= F(t.rischio) && (
          <div style={{ position: "absolute", left: 560, top: 360, transform: `scale(${molla(f, fps, F(t.rischio), 12, 260)}) rotate(-4deg)`, background: ROSSO, color: "#fff", fontFamily: INTER, fontWeight: 900, fontSize: 54, padding: "6px 22px", letterSpacing: -1 }}>RISCHIO 100%</div>
        )}
        <Etichetta x={X_LIVE + 150} y={490} a={t.settimana} testo="1ª SETTIMANA LIVE" size={42} col="#6b6880" />
        {f >= F(t.meno) && (
          <div style={{ position: "absolute", left: 0, right: 0, top: 1150, textAlign: "center", transform: `scale(${0.4 + 0.6 * meno})`, fontFamily: INTER, fontWeight: 900, fontSize: 190, color: ROSSO, letterSpacing: -6 }}>−4%</div>
        )}
      </AbsoluteFill>
    </Punch>
  );
};

// ---------- framework «LA SCALA DEL RISCHIO» (ripreso a ogni gradino) ----------
const GR = [
  { x0: 110, x1: 400, y: 1110, pct: "25%", nota: "BOT NUOVO", tPct: () => t.venticinque, tNota: () => t.g1 + 0.3 },
  { x0: 400, x1: 690, y: 860, pct: "50%", nota: "dopo ~10 trade veri", tPct: () => t.due + 0.1, tNota: () => t.decina },
  { x0: 690, x1: 980, y: 610, pct: "100%", nota: "dopo ~30 trade", tPct: () => t.tre + 0.1, tNota: () => t.trentina },
];
const Scala: React.FC<{ a: number; b: number; n: 1 | 2 | 3 }> = ({ a, b, n }) => {
  const f = useCurrentFrame();
  const g = GR[n - 1];
  const prima = n === 1;
  const aa = prima ? a : a - 5; // le parti vecchie sono già disegnate
  const z = Easing.inOut(Easing.cubic)(ramp(f, F(a + 0.9), F(a + 1.4)));
  const deriva = 1 + 0.03 * ramp(f, F(a), F(b));
  const sc = (1 + 0.12 * z) * deriva;
  const flash = n === 3 ? 1 - ramp(f, F(a), F(a) + 7) : 0;
  const d = `M${GR[0].x0} ${GR[0].y} L${GR[0].x1} ${GR[0].y} L${GR[1].x0} ${GR[1].y} L${GR[1].x1} ${GR[1].y} L${GR[2].x0} ${GR[2].y} L${GR[2].x1} ${GR[2].y}`;
  const cerchio = n === 3 ? ovale((g.x0 + g.x1) / 2, g.y - 75, 170, 85) : null;
  return (
    <Punch a={a} base={1} o="50% 50%" whip>
      <AbsoluteFill style={{ background: "#fff", transform: `scale(${sc})`, transformOrigin: `${((g.x0 + g.x1) / 2 / W) * 100}% ${(g.y / H) * 100}%` }}>
        <div style={{ position: "absolute", top: 250, width: "100%", textAlign: "center" }}>
          <div style={{ display: "inline-block", fontFamily: PENNA, fontSize: 84, color: INCHIOSTRO, clipPath: `inset(0 ${(1 - ramp(f, F(aa), F(aa + 0.5))) * 100}% 0 0)` }}>LA SCALA DEL RISCHIO</div>
        </div>
        <svg width={W} height={H} style={{ position: "absolute" }}>
          <Tratto d={d} l={1600} a={aa + 0.1} dur={0.6} w={12} />
          {cerchio && <Tratto d={cerchio.d} l={cerchio.l} a={t.pieno2} dur={0.45} col={VIOLA} w={10} />}
        </svg>
        {GR.slice(0, n).map((q, k) => {
          const nuovo = k === n - 1;
          return <React.Fragment key={k}>
            <Etichetta x={(q.x0 + q.x1) / 2} y={q.y - 75} a={nuovo ? q.tPct() : aa} testo={q.pct} col={k === 2 ? VIOLA : BLU} size={110} />
            <Etichetta x={(q.x0 + q.x1) / 2} y={q.y + 55} a={nuovo ? q.tNota() : aa} testo={q.nota} size={40} col="#4a4858" />
          </React.Fragment>;
        })}
        <Etichetta x={250} y={1210} a={aa + 0.4} testo="rischio del bot" size={38} col="#8a8898" />
      </AbsoluteFill>
      {flash > 0 && <AbsoluteFill style={{ background: "#fff", opacity: flash }} />}
    </Punch>
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
    <div style={{ position: "absolute", left: 50, top: 1000, width: 980, boxSizing: "border-box", padding: "22px 26px 24px", background: "#fff", borderRadius: 22, boxShadow: "0 14px 40px #0000004a", opacity: 1 - u, transform: `translateX(${(1 - e) * -80}px)` }}>
      <div style={{ position: "absolute", left: 42, top: 60, width: 2, height: 200 * linea, background: "#9a9aa8" }} />
      <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
        <div style={{ width: 30, height: 30, background: VIOLA }} />
        <div style={{ fontFamily: INTER, fontSize: 24, letterSpacing: 6, color: "#1c1c22", fontWeight: 600 }}>DEFINIZIONE</div>
      </div>
      <div style={{ marginLeft: 52, marginTop: 8, fontFamily: INTER, fontWeight: 800, fontSize: 46, letterSpacing: 1, color: "#16161b", clipPath: `inset(0 ${(1 - ramp(f, F(a) + 3, F(a) + 12)) * 100}% 0 0)` }}>{termine}</div>
      <div style={{ marginLeft: 48, marginTop: 10, width: 860, boxSizing: "border-box", padding: "18px 24px", background: "#f1f0f6", fontFamily: INTER, fontWeight: 600, fontSize: 32, lineHeight: 1.35, color: "#0e0e12", opacity: ramp(f, F(a) + 5, F(a) + 12) }}>{testo}</div>
    </div>
  );
};

// ---------- card «tweet» parola per parola ----------
const Tweet: React.FC<{ a: number; b: number }> = ({ a, b }) => {
  const f = useCurrentFrame();
  const sec = f / FPS;
  if (sec < a || sec > b) return null;
  const parole = P.filter((p) => p[0] >= a && p[0] < b);
  const e = ramp(f, F(a), F(a) + 8);
  const nero = ramp(f, F(a) + 4, F(a) + 12);
  const g = Math.round(interpolate(nero, [0, 1], [110, 12]));
  return (
    <div style={{ position: "absolute", left: 50, top: 1010, width: 900, padding: "32px 44px 40px", borderRadius: 26, background: `rgb(${g},${g},${g + 4})`, boxShadow: "0 18px 50px #0006", opacity: e, transform: `translateY(${(1 - e) * 20}px)` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <Img src={staticFile(`${C}/avatar.jpg`)} style={{ width: 76, height: 76, borderRadius: 38 }} />
        <div>
          <div style={{ fontFamily: INTER, fontWeight: 700, fontSize: 34, color: "#fff" }}>C · The Trader</div>
          <div style={{ fontFamily: INTER, fontSize: 28, color: "#8a8a96" }}>@cthe.trader</div>
        </div>
      </div>
      <div style={{ marginTop: 26, fontFamily: INTER, fontSize: 46, lineHeight: 1.28, color: "#fff" }}>
        {parole.map((p, i) => {
          const o = ramp(f, F(p[0]) - 2, F(p[0]) + 3);
          const forte = /pericoloso|gradini|saltare/i.test(p[1]);
          return <span key={i} style={{ opacity: 0.15 + 0.85 * o, fontWeight: forte ? 800 : 400, color: forte && o > 0.5 ? "#b9a6ff" : "#fff" }}>{p[1]} </span>;
        })}
      </div>
    </div>
  );
};

// ---------- sottopancia ----------
const Nome: React.FC<{ a: number; b: number }> = ({ a, b }) => {
  const f = useCurrentFrame();
  if (f < F(a) || f > F(b) + 8) return null;
  const e = Easing.out(Easing.cubic)(ramp(f, F(a), F(a) + 8));
  const u = ramp(f, F(b), F(b) + 6);
  return (
    <div style={{ position: "absolute", left: 0, top: 1220, opacity: 1 - u, clipPath: `inset(0 ${(1 - e) * 100}% 0 0)` }}>
      <div style={{ background: "#0d0d10", padding: "16px 40px 16px 60px" }}>
        <div style={{ fontFamily: INTER, fontWeight: 900, fontSize: 54, color: "#fff", letterSpacing: -1 }}>C · THE TRADER</div>
        <div style={{ fontFamily: INTER, fontSize: 22, color: "#c8c8d0", marginTop: 2 }}>personaggio AI · dietro c'è Marco · 19 bot su Algory</div>
      </div>
    </div>
  );
};

// ---------- coda su nero ----------
const Coda: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = F(t.fine + 0.35);
  if (f < a) return null;
  const m = molla(f, fps, a, 12, 200);
  const m2 = molla(f, fps, a + 10, 10, 260);
  return (
    <AbsoluteFill style={{ background: "#0b0a10", alignItems: "center", justifyContent: "center" }}>
      <div style={{ transform: `scale(${0.7 + 0.3 * m})`, opacity: m, textAlign: "center", fontFamily: INTER, fontWeight: 900, fontSize: 110, letterSpacing: -4, color: "#fff", lineHeight: 1.05 }}>
        PRIMA IL 25%.<br /><span style={{ display: "inline-block", background: VIOLA, padding: "0 22px", transform: `scale(${m2})` }}>POI TUTTO.</span>
      </div>
      <div style={{ position: "absolute", top: 1240, width: "100%", textAlign: "center", fontFamily: ANTON, fontSize: 64, color: "#ffd84d", opacity: m2 }}>LINK IN BIO · STANGA20</div>
      <div style={{ position: "absolute", left: 70, right: 70, top: 1640, textAlign: "center", fontFamily: MONO, fontSize: 26, lineHeight: 1.4, color: "#ffffff99", opacity: m2 }}>#ad · link affiliato · Il trading comporta un alto rischio di perdita. I backtest non garantiscono risultati futuri. Non è un consiglio finanziario.</div>
    </AbsoluteFill>
  );
};

// ---------- doodle ai lati di C ----------
const DOODLES: { nome: string; a: number; b: number; x: number; y: number; h: number; et: string; col?: string }[] = [
  { nome: "dadi", a: t.sfortuna - 0.1, b: t.nonSai - 0.05, x: 540, y: 380, h: 250, et: "SFORTUNA?" },
];

// ---------- effetti sonori ----------
type Fx = [number, string, number?];
export const FX: Fx[] = [
  [0, "boom", 0.6], [t.pericoloso, "impact", 0.9], [t.e1, "swish", 0.6],
  [t.col - 0.15, "whoosh", 0.9], [t.immagina, "pop", 0.5], [t.trenta, "ding", 0.6],
  [t.tu - 0.15, "whoosh", 0.8], [t.tu, "scribble", 0.5], [t.rischio, "impact", 0.7], [t.settimana, "swish", 0.5],
  [t.quattro, "impact", 0.8], [t.quattro + 0.3, "impact", 0.8], [t.quattro + 0.6, "impact", 0.8], [t.quattro + 0.9, "impact", 0.9], [t.meno, "boom", 1.0],
  [t.e2 - 0.15, "swish", 0.6], [t.nonSai, "impact", 0.8], [t.paghi, "swish", 0.5],
  [t.quindi, "swish", 0.6], [t.neopatentato - 0.2, "whoosh", 0.9], [t.panda, "pop", 0.6], [t.ferrari - 0.1, "whoosh", 0.8], [t.ferrari + 0.05, "boom", 0.9],
  [t.g1 - 0.15, "whoosh", 0.9], [t.g1 + 0.1, "scribble", 0.6], [t.venticinque, "scribble", 0.6], [t.venticinque + 0.4, "ding", 0.5],
  [t.se1 - 0.15, "swish", 0.6],
  [t.g2 - 0.15, "whoosh", 0.8], [t.due + 0.1, "scribble", 0.6], [t.decina, "scribble", 0.5],
  [t.trade - 0.2, "whoosh", 0.7], [t.sale - 0.1, "whoosh", 0.7], [t.cinquanta, "ding", 0.6],
  [t.g3 - 0.15, "whoosh", 0.9], [t.tre + 0.1, "scribble", 0.6], [t.trentina, "scribble", 0.5], [t.pieno2, "boom", 0.9],
  [t.se2 - 0.15, "swish", 0.6], [t.e3 - 0.1, "whoosh", 0.7], [t.non2 - 0.15, "swish", 0.6], [t.sentimento + 0.2, "impact", 0.7],
  [t.algory1 - 0.1, "whoosh", 0.7], [t.dalla - 0.15, "whoosh", 0.7], [t.nuovo, "ding", 0.6],
  [t.ecco - 0.15, "swish", 0.5], [t.il2 - 0.15, "swish", 0.6], [t.algory2, "impact", 0.9],
  [t.link - 0.1, "whoosh", 0.8], [t.codice, "pop", 0.7], [t.venti2 - 0.1, "whoosh", 0.7], [t.e4 - 0.1, "whoosh", 0.6], [t.gratis, "ding", 0.6],
  [t.fine + 0.35, "boom", 1.0],
];
for (const d of DOODLES) FX.push([d.a, "pop", 0.55], [d.a + 0.05, "scribble", 0.35]);

// ---------- sottotitoli ----------
const PEZZI: { a: number; b: number; parole: [number, string][] }[] = (() => {
  const out: { a: number; b: number; parole: [number, string][] }[] = [];
  let cur: [number, string][] = [];
  let g = -1;
  P.forEach(([tt, w, gr], i) => {
    if (cur.length === 3 || (gr !== g && cur.length)) { out.push({ a: cur[0][0], b: tt, parole: cur }); cur = []; }
    g = gr;
    cur.push([tt, w]);
    if (i === P.length - 1) out.push({ a: cur[0][0], b: tt + 0.8, parole: cur });
  });
  return out;
})();

const Sottotitoli: React.FC = () => {
  const f = useCurrentFrame();
  const sec = f / FPS;
  if ((sec >= t.ecco && sec < t.il2) || sec > t.fine + 0.35) return null; // durante il tweet parla la card
  const pz = PEZZI.find((p) => sec >= p.a && sec < p.b);
  if (!pz) return null;
  const dette = pz.parole.filter(([tt]) => sec >= tt).length;
  return (
    <div style={{ position: "absolute", left: 50, right: 50, top: 1400, textAlign: "center" }}>
      {pz.parole.map(([tt, w], i) => {
        const fa = F(tt);
        const m = interpolate(f, [fa, fa + 3], [0.9, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const detta = sec >= tt;
        return (
          <span key={i} style={{ display: "inline-block", margin: "0 8px", padding: "2px 12px", fontFamily: ANTON, fontSize: 84, lineHeight: 1.15, textTransform: "uppercase",
            transform: `scale(${detta ? m : 0.9})`, color: detta ? "#fff" : "rgba(255,255,255,0.8)", background: detta && i === dette - 1 ? VIOLA : "transparent",
            WebkitTextStroke: "9px #000", paintOrder: "stroke fill" }}>{w}</span>
        );
      })}
    </div>
  );
};

export const AL9H: React.FC = () => {
  const f = useCurrentFrame();
  const sec = f / FPS;
  const i = SHOT.findIndex((s, k) => sec >= s.a && sec < fineShot(k));
  const sh = SHOT[Math.max(0, i)];
  return (
    <AbsoluteFill style={{ background: BIANCO }}>
      <Inquadratura i={Math.max(0, i)} />
      {sh.tipo === "parla" && DOODLES.map((d) => <Doodle key={d.nome} nome={d.nome} a={d.a} b={d.b} x={d.x} y={d.y} h={d.h} etichetta={d.et} col={d.col} />)}
      {/* gancio */}
      <Botta a={0.05} b={t.e1 - 0.05} righe={["IL BOT PIÙ", "*PERICOLOSO"]} top={250} size={100} />
      <Botta a={t.e1} b={t.col - 0.05} righe={["HA IL BACKTEST", "PIÙ *BELLO"]} top={250} size={90} />
      <Botta a={t.col} b={t.immagina - 0.1} righe={["HA IL BACKTEST", "PIÙ *BELLO"]} top={230} size={90} scuro />
      <Botta a={t.trenta - 0.1} b={t.tu - 0.1} righe={["BACKTEST", "*+30%"]} top={230} size={120} scuro />
      <Botta a={t.nonSai} b={T("E", 1, t.nonSai) - 0.05} righe={["NON LO *SAI."]} top={260} size={120} />
      <Botta a={t.paghi - 0.3} b={t.quindi - 0.05} righe={["E INTANTO", "PAGHI *TU"]} top={250} size={104} />
      <Botta a={t.quindi + 0.1} b={t.neopatentato - 0.15} righe={["OGNI BOT NUOVO", "È UN *NEOPATENTATO"]} top={250} size={76} />
      <Botta a={t.neopatentato - 0.05} b={t.panda - 0.1} righe={["UN *NEOPATENTATO"]} top={230} size={96} scuro />
      <Botta a={t.panda - 0.05} b={t.ferrari - 0.1} righe={["PRIMA LA", "*PANDA"]} top={230} size={120} scuro />
      <Botta a={t.ferrari - 0.05} b={t.g1 - 0.05} righe={["POI LA", "*FERRARI"]} top={230} size={120} scuro />
      <Botta a={t.se1} b={t.g2 - 0.1} righe={["SI FA MALE", "*POCO"]} top={250} size={110} />
      <Botta a={t.trade} b={t.sale - 0.1} righe={["~10 TRADE", "*VERI"]} top={230} size={110} scuro />
      <Botta a={t.sale} b={t.g3 - 0.1} righe={["SALE AL", "*50%"]} top={230} size={120} scuro />
      <Botta a={t.se2} b={t.e3 - 0.1} righe={["SE L'È", "*GUADAGNATO"]} top={250} size={96} />
      <Botta a={t.e3} b={t.non2 - 0.2} righe={["E SE SI", "*SPEGNE?"]} top={230} size={110} scuro />
      <Botta a={t.non2} b={t.algory1 - 0.1} righe={["NIENTE", "!SENTIMENTO"]} top={250} size={100} barra={t.sentimento + 0.2} />
      <Botta a={t.algory1} b={t.dalla - 0.15} righe={["ALGORY LO", "*SEGNALA"]} top={230} size={104} scuro />
      <Botta a={t.nuovo - 0.35} b={t.ecco - 0.2} righe={["ENTRA UN", "BOT *NUOVO"]} top={250} size={100} />
      <Botta a={t.il2} b={t.link - 0.05} righe={["IL SOFTWARE:", "*ALGORY"]} top={250} size={110} />
      <Botta a={t.link} b={t.codice - 0.05} righe={["LINK", "IN *BIO"]} top={230} size={120} scuro />
      <Botta a={t.codice} b={t.venti2 - 0.05} righe={["CODICE", "*STANGA20"]} top={230} size={110} scuro />
      <Botta a={t.venti2} b={t.e4 - 0.05} righe={["*−20%", "DI SCONTO"]} top={230} size={120} scuro />
      <Botta a={t.e4} b={t.fine + 0.3} righe={["SI PARTE", "*GRATIS"]} top={230} size={120} scuro />
      <Nome a={t.quindi + 0.1} b={t.neopatentato - 0.2} />
      <Definizione a={T("backtest", 2) + 0.1} b={t.tu - 0.15} termine="BACKTEST" testo="Il test di una strategia sui dati del passato, prima di usarla con soldi veri." />
      <Definizione a={t.trade + 0.2} b={t.sale - 0.15} termine="INCUBAZIONE (ALGORY)" testo="Il bot nuovo parte con un quarto del rischio e sale solo quando i suoi trade veri passano i controlli." />
      <Tweet a={t.ecco} b={t.il2 - 0.05} />
      <Sottotitoli />
      <Coda />
      {/* audio */}
      <Audio src={staticFile(`${C}/voce.wav`)} />
      <Audio src={staticFile(`${C}/musica.wav`)} volume={0.3} />
      {FX.map(([tt, nome, v], k) => (
        <Sequence key={k} from={Math.max(0, F(tt))} durationInFrames={F(2.2)}>
          <Audio src={staticFile(`${C}/sfx/${nome}.wav`)} volume={(v ?? 0.6) * 0.55} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
