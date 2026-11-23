// P2 film v3 «Le 7 trappole delle prop firm» (23/11/2026): stile unico alla Hormozi (memoria feedback-stile-unico-hormozi).
// - C in camera quasi sempre: clip P-Video 1080p (p2f/cs/<shot>.mp4 del film v2 + p2f/v3/<nome>.mp4 nuove, look con pennarello,
//   tazza, cappello, tre quarti, largo), stacchi secchi con piccolo zoom alternato;
// - accanto a C note e doodle a pennarello che si disegnano; grafiche a tutto schermo solo bianche (Inter nero + parola viola);
// - curiosità: numeri e tabelle si scoprono poco alla volta (righe coperte da «?» finché la voce non ci arriva);
// - niente manichini, sfondi scuri, flash, scossoni, pixel font. Musica aggiunta dopo il render (traccia della Raccolta audio YouTube).
// Struttura: voce del film [0, 147,527) + trappola 2 nuova (P2T2, 85,4 s) + voce del film da 227,461 in poi (spostata di +5,466 s).
// Tempi interni (sh.a, K, OVER) = secondi della voce ORIGINALE del film (p2film-dati.ts).
import React from "react";
import { AbsoluteFill, Audio, Easing, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadMarker } from "@remotion/google-fonts/PermanentMarker";
import { INTER, molla, ROSSO, VIOLA } from "./FormatC";
import { FX as _FX, K, OVER, PEZZI, SHOT } from "./p2film-dati";
import { CS } from "./p2film-cs";
import { DURATA_P2T2, P2T2 } from "./P2T2";

const { fontFamily: PENNA } = loadMarker();
const C = "p2f";
const FPS = 30;
const F = (s: number) => Math.round(s * FPS);
const INK = "#15131a";
const GRIGIO = "#77738a";
const VERDE = "#16a34a";
const cl = (x: number) => Math.max(0, Math.min(1, x));
const ramp = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const fmt = (n: number) => Math.round(n).toLocaleString("it-IT");
void _FX; void PEZZI;

// innesto della trappola 2
const T2A = 147.527, T2OLD = 227.461, T2LEN = DURATA_P2T2 / FPS, SPOSTA = T2A + T2LEN - T2OLD;
const FILM_FINE = 738.502;
// v3b (23/11 mattina, Marco: «lento, senza intro, primi piani inquietanti»): intro di 23,8 s prima del film,
// sponsor di 28,4 s prima della trappola 4 (film 332,1 s), banner like/commenti/hype/iscriviti; velocità ×1,1 fatta in ffmpeg.
const INTRO = 23.8, SP_FILM = 332.1, SP_LEN = 28.4;
const OFF_A = INTRO, OFF_B = INTRO + SPOSTA, OFF_C = OFF_B + SP_LEN;
const SP_A = SP_FILM + OFF_B;
export const DURATA_P2V3 = F(FILM_FINE + OFF_C);

// ---------- pezzi comuni ----------
const Pop: React.FC<{ a: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ a, children, style }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < F(a)) return <div style={{ ...style, opacity: 0 }}>{children}</div>;
  const m = molla(f, fps, F(a), 13, 260);
  return <div style={{ ...style, transform: `${style?.transform ?? ""} scale(${0.85 + 0.15 * m})`, opacity: Math.min(1, m * 1.4) }}>{children}</div>;
};
const Vi: React.FC<{ children: React.ReactNode; rosso?: boolean }> = ({ children, rosso }) => (
  <span style={{ background: rosso ? ROSSO : VIOLA, color: "#fff", padding: "0 14px" }}>{children}</span>
);
const Tit: React.FC<{ children: React.ReactNode; size?: number; col?: string; style?: React.CSSProperties }> = ({ children, size = 64, col = INK, style }) => (
  <div style={{ fontFamily: INTER, fontWeight: 900, fontSize: size, letterSpacing: -2, textTransform: "uppercase", color: col, textAlign: "center", lineHeight: 1.05, ...style }}>{children}</div>
);
const Foglio: React.FC<{ a: number; children: React.ReactNode }> = ({ a, children }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const m = molla(f, fps, F(a), 14, 240);
  return (
    <AbsoluteFill style={{ background: "#fff", alignItems: "center", justifyContent: "center", fontFamily: INTER, color: INK }}>
      <div style={{ transform: `scale(${0.94 + 0.06 * m})`, opacity: Math.min(1, m * 1.3), display: "flex", flexDirection: "column", alignItems: "center" }}>{children}</div>
    </AbsoluteFill>
  );
};
// valore coperto da «?» finché non arriva il suo momento (tecnica della curiosità)
const Coperto: React.FC<{ a: number; children: React.ReactNode; w?: number }> = ({ a, children, w = 220 }) => {
  const f = useCurrentFrame();
  if (f >= F(a)) return <Pop a={a} style={{ display: "inline-block" }}>{children}</Pop>;
  return <span style={{ display: "inline-block", minWidth: w, textAlign: "center", background: "#ecebf0", color: "#b3b0bf", borderRadius: 10, padding: "0 18px" }}>?</span>;
};

// ---------- C in camera ----------
const Zoom: React.FC<{ a: number; z: number; o?: string; children: React.ReactNode }> = ({ a, z, o = "50% 32%", children }) => {
  const f = useCurrentFrame();
  const salto = Math.floor(Math.max(0, f / FPS - a) / 3.2) % 2 ? 1.08 : 1;
  const s = z * salto * (1 + 0.012 * ramp(f, F(a), F(a + 4)));
  return (
    <AbsoluteFill style={{ background: "#fff", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${s})`, transformOrigin: o }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};
const CamCS: React.FC<{ sh: any; idx: number; z: number }> = ({ sh, idx, z }) => (
  <Zoom a={sh.a} z={z}>
    <Sequence from={F(CS[String(idx)])} layout="none">
      <OffthreadVideo src={staticFile(`${C}/cs/${idx}.mp4`)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </Sequence>
  </Zoom>
);
// clip nuove: inizio = a - 0,4 (scene_v3.py)
const V3: Record<string, number> = {
  s0: 0, s3: 10.2, s9: 40.1, s11: 54.0, s16: 78.5, s20: 100.1, s24: 114.7, s42: 230.9, s46: 256.5, s50: 282.5, s54: 307.9, s58: 322.3,
  s60: 331.7, s67: 373.6, s71: 386.8, s74: 394.3, s80: 431.2, s91: 514.0, s96: 536.8, s108: 613.2, s111: 621.0, s115: 675.8,
  k1: 630.6, k2: 641.3, k3: 648.1, k4: 661.2,
};
const CamV3: React.FC<{ a: number; nome: string; z?: number }> = ({ a, nome, z = 1 }) => (
  <Zoom a={a} z={z}>
    <Sequence from={F(V3[nome])} layout="none">
      <OffthreadVideo src={staticFile(`${C}/v3/${nome}.mp4`)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </Sequence>
  </Zoom>
);

// ---------- doodle a pennarello ----------
const Tratto: React.FC<{ d: string; a: number; dur?: number; col?: string; w?: number }> = ({ d, a, dur = 0.5, col = INK, w = 7 }) => {
  const p = ramp(useCurrentFrame(), F(a), F(a + dur));
  return <path d={d} pathLength={1} fill="none" stroke={col} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={1} strokeDashoffset={1 - p} />;
};
const ICONE: Record<string, [string, string?][]> = {
  su: [["M20 20 L20 220 L380 220"], ["M30 170 L110 140 L160 160 L250 90 L360 40", VERDE], ["M322 36 L362 38 L352 76", VERDE]],
  giu: [["M20 20 L20 220 L380 220"], ["M30 50 L120 80 L180 70 L260 170 L340 200", ROSSO], ["M308 172 L344 202 L302 210", ROSSO]],
  doc: [["M120 20 L280 20 L280 230 L120 230 Z"], ["M150 70 L250 70 M150 110 L250 110 M150 150 L230 150 M150 190 L210 190", GRIGIO]],
  omino: [["M200 60 m -32 0 a 32 32 0 1 0 64 0 a 32 32 0 1 0 -64 0"], ["M200 92 L200 170 M200 170 L165 230 M200 170 L235 230 M150 120 L250 120"]],
  coppa: [["M140 30 L260 30 L250 110 C 240 150, 160 150, 150 110 Z"], ["M200 145 L200 190 M160 215 L240 215 L240 190 L160 190 Z"], ["M140 50 C 90 50, 100 100, 150 100 M260 50 C 310 50, 300 100, 250 100", VIOLA]],
  carrello: [["M60 50 L110 50 L150 170 L310 170 L340 80 L125 80"], ["M165 210 m -16 0 a 16 16 0 1 0 32 0 a 16 16 0 1 0 -32 0 M290 210 m -16 0 a 16 16 0 1 0 32 0 a 16 16 0 1 0 -32 0"]],
  cursore: [["M150 40 L150 200 L190 160 L220 225 L245 213 L215 150 L270 150 Z"], ["M100 40 L120 60 M95 100 L125 100 M110 150 L130 135", VIOLA]],
  clessidra: [["M130 25 L270 25 M130 225 L270 225 M145 25 C 145 100, 255 100, 255 125 C 255 150, 145 150, 145 225 M255 25 C 255 100, 145 100, 145 125 C 145 150, 255 150, 255 225"], ["M175 205 L225 205", VIOLA]],
  spina: [["M60 120 L150 120 M150 80 L150 160 L210 160 L210 80 Z M210 100 L240 100 M210 140 L240 140"], ["M290 100 L320 100 M290 140 L320 140 M320 80 L320 160 L380 160 L380 80 Z", ROSSO], ["M255 60 L275 90 M265 175 L250 205", ROSSO]],
  play: [["M80 40 L320 40 C 350 40, 360 60, 360 120 C 360 180, 350 200, 320 200 L80 200 C 50 200, 40 180, 40 120 C 40 60, 50 40, 80 40 Z", ROSSO], ["M170 85 L170 155 L240 120 Z"]],
  tacche: [["M60 60 L60 190 M100 60 L100 190 M140 60 L140 190 M180 60 L180 190 M40 160 L200 90"], ["M250 60 L250 190 M290 60 L290 190 M330 60 L330 190", GRIGIO]],
  dado: [["M120 50 L280 50 L280 210 L120 210 Z"], ["M160 90 m -9 0 a 9 9 0 1 0 18 0 a 9 9 0 1 0 -18 0 M240 170 m -9 0 a 9 9 0 1 0 18 0 a 9 9 0 1 0 -18 0 M200 130 m -9 0 a 9 9 0 1 0 18 0 a 9 9 0 1 0 -18 0", VIOLA]],
};
const Doodle: React.FC<{ n: any }> = ({ n }) => {
  const dx = n.lato === "sx";
  const col = n.col === "rosso" ? ROSSO : n.col === "verde" ? VERDE : n.col === "viola" ? VIOLA : INK;
  return (
    <div style={{ position: "absolute", top: n.top ?? 190, width: 480, [dx ? "left" : "right"]: 30, display: "flex", flexDirection: "column", alignItems: "center" } as React.CSSProperties}>
      {n.icona && (
        <svg width={360} height={225} viewBox="0 0 400 250">
          {ICONE[n.icona].map(([d, c], k) => <Tratto key={k} a={n.a + 0.12 * k} dur={0.45} d={d} col={c ?? INK} w={8} />)}
        </svg>
      )}
      {n.testo && (
        <div style={{ position: "relative", marginTop: n.icona ? 6 : 0 }}>
          <Pop a={n.a + (n.icona ? 0.4 : 0)} style={{ fontFamily: PENNA, fontSize: n.size ?? 58, color: col, textAlign: "center", lineHeight: 1.08, whiteSpace: "pre-line" }}>{n.testo}</Pop>
          {n.segno === "cerchio" && (
            <svg width={500} height={240} viewBox="0 0 460 300" style={{ position: "absolute", left: -10, top: -40 }} preserveAspectRatio="none">
              <Tratto a={n.a + 0.2} dur={0.45} col={col} d="M230 25 C 420 20, 450 150, 390 235 C 320 300, 110 295, 50 220 C 0 140, 70 25, 245 35" w={6} />
            </svg>
          )}
          {n.segno === "sotto" && (
            <svg width={460} height={40} viewBox="0 0 460 40" style={{ position: "absolute", left: 0, bottom: -26 }}>
              <Tratto a={n.a + 0.3} dur={0.3} col={col} d="M20 25 C 150 10, 300 35, 440 15" w={7} />
            </svg>
          )}
          {n.segno === "barra" && (
            <svg width={460} height={160} viewBox="0 0 460 160" style={{ position: "absolute", left: 0, top: 0 }}>
              <Tratto a={n.a + 0.5} dur={0.3} col={ROSSO} d="M30 140 L430 20" w={10} />
            </svg>
          )}
        </div>
      )}
    </div>
  );
};

// note e doodle accanto a C (tempi del film). Le «botte» del film v2 diventano note a pennarello in automatico.
const NOTE_EXTRA: any[] = [
  { a: 11.6, b: 16.2, icona: "su" },
  { a: 41.2, b: 46.3, icona: "doc", testo: "QUELLO CHE IN\nHOMEPAGE NON C'È", size: 46 },
  { a: 55.0, b: 59.2, icona: "omino", testo: "IL PROTAGONISTA\nSEI TU", col: "viola", size: 50 },
  { a: 77.9, b: 78.9, testo: "FACILE, NO?", size: 64, segno: "sotto" },
  { a: 79.6, b: 84.8, icona: "doc", testo: "LE CONDIZIONI\nCHE NON LEGGI", size: 50 },
  { a: 100.8, b: 103.8, icona: "doc", testo: "I NUMERI DEL 2025", size: 50 },
  { a: 115.4, b: 119.3, icona: "cursore", testo: "ENTRI AL PREZZO\nCHE VEDI", col: "verde", size: 48 },
  { a: 231.6, b: 235.4, icona: "giu" },
  { a: 257.2, b: 263.4, icona: "coppa" },
  { a: 283.2, b: 289.2, icona: "carrello" },
  { a: 308.6, b: 313.8, icona: "su", testo: "2 GIORNI PERFETTI", col: "verde", size: 50 },
  { a: 313.9, b: 317.8, icona: "giu", testo: "SPOSTI LO STOP\nRADDOPPI", col: "rosso", size: 48 },
  { a: 323.0, b: 326.3, icona: "tacche", testo: "HO SMESSO\nDI CONTARLE", size: 48 },
  { a: 374.04, b: 376.3, testo: "CHALLENGE #1", size: 56, col: "rosso" },
  { a: 387.4, b: 389.5, icona: "su", testo: "PASSI. E GUADAGNI", col: "verde", size: 48 },
  { a: 395.0, b: 397.6, testo: "«ECCESSIVO»\n«ANOMALO»", size: 60, col: "viola", segno: "sotto" },
  { a: 432.0, b: 438.9, icona: "clessidra", testo: "PAGAMENTI\nIN PAUSA", col: "rosso", size: 52 },
  { a: 514.8, b: 520.1, icona: "spina", testo: "PIATTAFORMA PERSA", col: "rosso", size: 48 },
  { a: 537.6, b: 540.4, icona: "play", testo: "CODICE SCONTO", size: 52 },
  { a: 613.7, b: 614.7, icona: "dado", testo: "COME AL CASINÒ", size: 48 },
  { a: 622.0, b: 627.4, testo: "OPINIONE\n+ MATEMATICA", size: 60, segno: "sotto" },
  { a: 631.4, b: 638.0, testo: "−0,5%\nA OPERAZIONE", col: "viola", size: 62, segno: "cerchio" },
  { a: 642.0, b: 644.8, testo: "PIÙ VICINO\n= MENO RISCHIO", size: 54, segno: "sotto" },
  { a: 648.8, b: 653.3, testo: "REGOLE SCRITTE\nPRIMA", col: "viola", size: 56, segno: "sotto" },
  { a: 661.9, b: 665.1, testo: "IL LIMITE\nLO DECIDI TU", size: 56, segno: "sotto" },
  { a: 676.6, b: 681.8, icona: "su", testo: "NUMERI VERI,\nANCHE IN ROSSO", size: 48 },
];
// «CHALLENGE #2/#3»: tre note in fila sullo stesso stacco
NOTE_EXTRA.push({ a: 374.67, b: 375.42, testo: "CHALLENGE #2", size: 56, col: "rosso" }, { a: 375.42, b: 376.3, testo: "CHALLENGE #3", size: 56, col: "rosso" });
NOTE_EXTRA[13].b = 374.67;
const NOTE: any[] = [
  ...OVER.filter((o: any) => o.tipo === "botta" && !(147.4 <= o.a && o.a < 227.5)).map((o: any) => {
    const testo = o.righe.join("\n").replace(/[*!]/g, "");
    const col = o.righe.join(" ").includes("!") ? "rosso" : o.righe.join(" ").includes("*") ? "viola" : "nero";
    return { a: o.a + (o.dopo ?? 0), b: o.b ?? o.a + 3, testo, col, size: testo.length > 16 ? 54 : 66, segno: "sotto", top: 300 };
  }),
  ...NOTE_EXTRA,
];

// ---------- grafiche bianche ----------
const Omino: React.FC<{ col: string; w?: number }> = ({ col, w = 64 }) => (
  <svg width={w} height={w * 1.4} viewBox="0 0 64 90"><circle cx="32" cy="18" r="15" fill={col} /><path d="M8 88 Q8 40 32 40 Q56 40 56 88 Z" fill={col} /></svg>
);
const VIVI = new Set([7, 23, 38, 44, 61, 79, 92]);
const Omini: React.FC<{ sh: any }> = ({ sh }) => {
  const f = useCurrentFrame();
  const inizio = F(K.o_sette), dur = F(2.2);
  let j = 0; const ord = new Map<number, number>();
  for (let k = 0; k < 100; k++) if (!VIVI.has(k)) ord.set(k, (j++ * 37) % 93);
  return (
    <Foglio a={sh.a}>
      <Tit>{f < inizio + dur ? "100 TRADER" : <>GLI ALTRI <Vi>93</Vi></>}</Tit>
      <div style={{ height: 30 }} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(20, 64px)", gap: "18px 14px" }}>
        {Array.from({ length: 100 }, (_, k) => {
          const o = ord.get(k);
          const spento = o !== undefined && f >= inizio + (o / 93) * dur;
          return <Omino key={k} col={VIVI.has(k) ? VIOLA : spento ? "#dcdce2" : INK} />;
        })}
      </div>
    </Foglio>
  );
};
const TitoloFilm: React.FC<{ sh: any }> = ({ sh }) => (
  <Foglio a={sh.a}>
    <Tit size={130} style={{ letterSpacing: -5 }}>LE <Vi>7</Vi> TRAPPOLE</Tit>
    <Tit size={130} style={{ letterSpacing: -5 }}>DELLE PROP FIRM</Tit>
  </Foglio>
);
const Regole: React.FC<{ sh: any }> = ({ sh }) => {
  const r: [number, string, boolean][] = [[K.reg1, "Obiettivo fase 1: +10%", false], [K.reg2, "Obiettivo fase 2: +5%", false], [K.reg3, "Perdita max in un giorno: −5%", true], [K.reg4, "Perdita max totale: −10%", true], [K.reg5, "Minimo 4 giorni di trading", false]];
  return (
    <Foglio a={sh.a}>
      <Tit>LE <Vi>5 REGOLE</Vi></Tit>
      <div style={{ height: 40 }} />
      {r.map(([t, s, rosso], k) => (
        <div key={k} style={{ fontSize: 62, margin: "10px 0", color: rosso ? ROSSO : INK, fontFamily: PENNA, minHeight: 80 }}>
          <span style={{ color: GRIGIO, marginRight: 24 }}>{k + 1}.</span><Coperto a={t} w={700}>{s}</Coperto>
        </div>
      ))}
    </Foglio>
  );
};
const Citazione: React.FC<{ sh: any }> = ({ sh }) => {
  const f = useCurrentFrame();
  const i = sh.testo.indexOf(sh.evid);
  const ev = ramp(f, F(sh.a + 1.0), F(sh.a + 1.8));
  return (
    <AbsoluteFill style={{ background: "#e9e7ef", alignItems: "center", justifyContent: "center", fontFamily: INTER }}>
      <Pop a={sh.a} style={{ background: "#fff", width: 1400, padding: "80px 90px", boxShadow: "0 30px 80px #0003", borderRadius: 12 }}>
        <div style={{ fontSize: 72, fontWeight: 800, color: INK, lineHeight: 1.25, letterSpacing: -1 }}>
          «{sh.testo.slice(0, i)}
          <span style={{ backgroundImage: `linear-gradient(${VIOLA}, ${VIOLA})`, backgroundSize: `${ev * 100}% 100%`, backgroundRepeat: "no-repeat", color: ev > 0.5 ? "#fff" : INK, padding: "0 6px" }}>{sh.evid}</span>
          {sh.testo.slice(i + sh.evid.length)}»
        </div>
        <div style={{ fontSize: 30, color: GRIGIO, marginTop: 40 }}>— {sh.fonte}</div>
      </Pop>
    </AbsoluteFill>
  );
};
const ZeroSet: React.FC<{ sh: any }> = ({ sh }) => {
  const f = useCurrentFrame();
  const R = 108.8;
  const acceso = f >= F(R + 1.4);
  return (
    <Foglio a={sh.a}>
      <div style={{ fontSize: 44, fontWeight: 800, color: GRIGIO }}>TRADER FINANZIATI PASSATI A UN CONTO VERO</div>
      <Tit size={200} style={{ margin: "10px 0 30px" }}><Coperto a={R} w={420}><Vi rosso>0,71%</Vi></Coperto></Tit>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(28, 34px)", gap: "8px 10px" }}>
        {Array.from({ length: 140 }, (_, k) => <Omino key={k} w={34} col={k === 61 && acceso ? VIOLA : "#d6d6dc"} />)}
      </div>
      {f >= F(110.6) && <Pop a={110.6} style={{ fontFamily: PENNA, fontSize: 60, color: VIOLA, marginTop: 24 }}>meno di 1 su 100</Pop>}
    </Foglio>
  );
};
const Secchio: React.FC<{ etich: string; liv: number; col: string; trabocca?: number }> = ({ etich, liv, col, trabocca = 0 }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "0 80px" }}>
    <div style={{ position: "relative", width: 360, height: 420, border: `12px solid ${INK}`, borderTop: "none", borderRadius: "0 0 40px 40px", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${liv * 100}%`, background: col }} />
      {trabocca > 0 && <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: `${trabocca * 100}%`, background: ROSSO, opacity: 0.85 }} />}
    </div>
    <div style={{ fontSize: 40, fontWeight: 900, marginTop: 24, textAlign: "center", width: 460 }}>{etich}</div>
  </div>
);
const Secchi: React.FC<{ sh: any }> = ({ sh }) => {
  const f = useCurrentFrame();
  if (sh.piena) {
    const usc = ramp(f, F(K.sec2), F(K.sec3 + 1));
    return (
      <Foglio a={sh.a}>
        <Tit>QUANDO VINCI TU…</Tit><div style={{ height: 40 }} />
        <div style={{ display: "flex" }}>
          <Secchio etich="QUOTE DEI CLIENTI" liv={0.85 - 0.6 * usc} col={VIOLA} />
          <Secchio etich="PAGAMENTI AI TRADER" liv={0.2 + 0.8 * usc} col={VERDE} trabocca={f > F(K.sec3) ? 0.15 : 0} />
        </div>
        {f > F(K.sec3) && <Pop a={K.sec3} style={{ fontSize: 56, fontWeight: 900, color: ROSSO, marginTop: 20 }}>NON SONO BASTATI</Pop>}
      </Foglio>
    );
  }
  return (
    <Foglio a={sh.a}>
      <Tit>DA DOVE ARRIVANO I SOLDI?</Tit><div style={{ height: 40 }} />
      <div style={{ display: "flex" }}>
        <Secchio etich="QUOTE DEI CLIENTI" liv={0.9 * ramp(f, F(K.sec_q), F(K.sec_p + 1.5))} col={VIOLA} />
        <Secchio etich="PROFITTI DI MERCATO" liv={0.08} col={VERDE} />
      </div>
    </Foglio>
  );
};
const Obiettivo: React.FC<{ sh: any }> = ({ sh }) => {
  const f = useCurrentFrame();
  const v = interpolate(f, [F(sh.a), F(sh.a + 1.2)], [0, 9], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const lamp = f > F(K.ob1) && Math.floor(f / 8) % 2 === 0;
  return (
    <Foglio a={sh.a}>
      <Tit size={170} col={VIOLA}>+{v.toFixed(1).replace(".", ",")}%</Tit>
      <div style={{ width: 1400, height: 90, border: `8px solid ${INK}`, marginTop: 40, position: "relative" }}>
        <div style={{ width: `${v * 10}%`, height: "100%", background: VIOLA }} />
        <div style={{ position: "absolute", right: -4, top: -40, bottom: -40, width: 10, background: lamp ? ROSSO : INK }} />
      </div>
      <div style={{ fontSize: 44, fontWeight: 800, marginTop: 30, color: GRIGIO }}>OBIETTIVO +10% · TI MANCA <span style={{ color: ROSSO }}>1%</span></div>
    </Foglio>
  );
};
const Fondi: React.FC<{ sh: any }> = ({ sh }) => {
  const f = useCurrentFrame();
  const p = ramp(f, F(K.fo1), F(K.fo2 + 1.5));
  const W = 1400, H = 460, n = 80;
  const a: string[] = [], b: string[] = [];
  for (let k = 0; k <= n * p; k++) {
    const x = (k / n) * W; const sec = k > n / 2;
    a.push(`${k ? "L" : "M"}${x},${H * 0.3 + Math.sin(k * 0.9) * (sec ? 14 : 12)}`);
    b.push(`${k ? "L" : "M"}${x},${H * 0.72 + Math.sin(k * 1.3) * (sec ? 95 : 14)}`);
  }
  return (
    <Foglio a={sh.a}>
      <Tit>334 FONDI · 1980-1991</Tit>
      <div style={{ fontSize: 34, color: GRIGIO, marginBottom: 30 }}>Brown, Harlow, Starks · Journal of Finance, 1996</div>
      <svg width={W} height={H} style={{ overflow: "visible" }}>
        <line x1={W / 2} x2={W / 2} y1={0} y2={H} stroke="#0002" strokeWidth={4} strokeDasharray="10 10" />
        <text x={W / 2 + 14} y={30} fontSize={28} fill={GRIGIO} fontWeight={700}>METÀ ANNO</text>
        <path d={a.join(" ")} stroke={VIOLA} strokeWidth={9} fill="none" />
        <path d={b.join(" ")} stroke={ROSSO} strokeWidth={9} fill="none" />
        <text x={0} y={H * 0.3 - 40} fontSize={36} fontWeight={900} fill={VIOLA}>IN VANTAGGIO</text>
        <text x={0} y={H * 0.72 - 50} fontSize={36} fontWeight={900} fill={ROSSO}>INDIETRO → RISCHIANO DI PIÙ</text>
      </svg>
    </Foglio>
  );
};
const Giorni: React.FC<{ sh: any }> = ({ sh }) => {
  const f = useCurrentFrame();
  const d = Math.max(20, 30 - Math.floor(Math.max(0, f - F(K.gg1 - 0.3)) / 14));
  return (
    <Foglio a={sh.a}>
      <div style={{ fontSize: 44, fontWeight: 800, color: GRIGIO, letterSpacing: 4 }}>CHALLENGE · GIORNI RIMASTI</div>
      <div style={{ fontFamily: INTER, fontWeight: 900, fontSize: 300, letterSpacing: -10, color: d < 27 ? ROSSO : INK, fontVariantNumeric: "tabular-nums" }}>{d}</div>
    </Foglio>
  );
};
// numero grande: prima coperto, poi conta su «t0» (sulla parola)
const Numero: React.FC<{ sh: any }> = ({ sh }) => {
  const f = useCurrentFrame();
  const t0 = sh.t0 ?? sh.a + 0.2;
  const p = Easing.out(Easing.cubic)(ramp(f, F(t0), F(t0 + 1.2)));
  const v = sh.n0 + (sh.n1 - sh.n0) * p;
  return (
    <Foglio a={sh.a}>
      <div style={{ fontSize: 50, fontWeight: 900, color: GRIGIO, letterSpacing: 2 }}>{sh.sopra}</div>
      <div style={{ fontSize: 240, fontWeight: 900, letterSpacing: -10, color: sh.scendi ? ROSSO : VIOLA, lineHeight: 1.1, minHeight: 264 }}>
        {f < F(t0) ? <span style={{ color: "#d6d4de" }}>?</span> : <>{sh.prima}{fmt(v)}{sh.dopo}</>}
      </div>
      {f >= F(sh.ts ?? t0 + 0.6) && <Pop a={sh.ts ?? t0 + 0.6} style={{ fontSize: 40, color: GRIGIO, marginTop: 10 }}>{sh.sotto}</Pop>}
    </Foglio>
  );
};
const Carrelli: React.FC<{ sh: any }> = ({ sh }) => {
  const f = useCurrentFrame();
  const on = f >= F(K.car1);
  return (
    <Foglio a={sh.a}>
      <Tit>OGNI 10 ACQUISTI…</Tit><div style={{ height: 50 }} />
      <div style={{ display: "flex", gap: 30 }}>
        {Array.from({ length: 10 }, (_, k) => (
          <Pop key={k} a={sh.a + 0.15 * k} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ fontSize: 120 }}>🛒</div>
            <div style={{ fontSize: 26, fontWeight: 900, color: "#fff", background: on && k < 8 ? VIOLA : "#c9c6d6", padding: "6px 10px", marginTop: 8 }}>{on && k < 8 ? "DI NUOVO" : "NUOVO"}</div>
          </Pop>
        ))}
      </div>
      {on && <Pop a={K.car1 + 0.3} style={{ fontSize: 64, fontWeight: 900, marginTop: 50 }}><Vi>8 SU 10</Vi> DA CHI AVEVA GIÀ COMPRATO</Pop>}
    </Foglio>
  );
};
const Studio: React.FC<{ sh: any }> = ({ sh }) => (
  <Foglio a={sh.a}>
    <div style={{ fontSize: 44, fontWeight: 900, color: VIOLA, letterSpacing: 6 }}>{sh.anno}</div>
    <Pop a={sh.a + 0.4} style={{ fontSize: 110, fontWeight: 900, marginTop: 30, letterSpacing: -3, textTransform: "uppercase" }}>{sh.cosa}</Pop>
    <Pop a={sh.a + 0.9} style={{ fontSize: 46, color: GRIGIO, marginTop: 20 }}>{sh.chi} · «{sh.frase}»</Pop>
  </Foglio>
);
const Pagina: React.FC<{ sh: any }> = ({ sh }) => {
  const f = useCurrentFrame();
  const righe: [string, number][] = [["overleveraging, overexposure", K.pg1], ["one-sided bets e account rolling", K.pg1 + 0.6], ["posizioni di dimensione anomala", K.pg2], ["perdita di eventuali ricompense", K.pg3]];
  const finto = "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua";
  return (
    <AbsoluteFill style={{ background: "#e9e7ef", alignItems: "center", justifyContent: "center", fontFamily: INTER }}>
      <Pop a={sh.a} style={{ background: "#fff", width: 1300, padding: "60px 80px", boxShadow: "0 30px 80px #0003", transform: "rotate(-1.5deg)" }}>
        <div style={{ fontSize: 46, fontWeight: 900, marginBottom: 30 }}>PRATICHE DI TRADING PROIBITE</div>
        {righe.map(([r, t], k) => {
          const ev = ramp(f, F(t), F(t + 0.5));
          return (
            <div key={k} style={{ marginBottom: 26 }}>
              <div style={{ fontSize: 24, color: "#b3b0bf", lineHeight: 1.4 }}>{finto}</div>
              <span style={{ fontSize: 50, fontWeight: 800, backgroundImage: `linear-gradient(${k === 3 ? ROSSO : VIOLA}, ${k === 3 ? ROSSO : VIOLA})`, backgroundSize: `${ev * 100}% 100%`, backgroundRepeat: "no-repeat", color: ev > 0.5 ? "#fff" : INK, padding: "0 8px" }}>{r}</span>
            </div>
          );
        })}
      </Pop>
    </AbsoluteFill>
  );
};
const Crollo: React.FC<{ sh: any }> = ({ sh }) => {
  const f = useCurrentFrame();
  const p = Easing.out(Easing.cubic)(ramp(f, F(sh.a + 0.5), F(sh.a + 1.6)));
  return (
    <Foglio a={sh.a}>
      <Tit>UTILE NETTO</Tit>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 120, height: 520, marginTop: 30 }}>
        <div style={{ textAlign: "center" }}><div style={{ width: 260, height: 480, background: VIOLA }} /><div style={{ fontSize: 44, fontWeight: 900, marginTop: 10 }}>2024</div></div>
        <div style={{ textAlign: "center" }}><div style={{ width: 260, height: 480 * (1 - 0.59 * p), background: ROSSO }} /><div style={{ fontSize: 44, fontWeight: 900, marginTop: 10 }}>2025</div></div>
        <div style={{ fontSize: 200, fontWeight: 900, color: ROSSO, letterSpacing: -8, opacity: p }}>−{Math.round(59 * p)}%</div>
      </div>
      <div style={{ fontSize: 34, color: GRIGIO, marginTop: 20 }}>margine netto: oltre 55% nel 2021 → 8,9% nel 2025 · bilancio 2025, stampa ceca</div>
    </Foglio>
  );
};
const Denominatore: React.FC<{ sh: any }> = ({ sh }) => (
  <Foglio a={sh.a}>
    <Tit>CHI PASSA? STESSI DATI, DUE CONTI</Tit>
    <div style={{ display: "flex", gap: 140, marginTop: 60 }}>
      <div style={{ textAlign: "center" }}><div style={{ fontSize: 220, fontWeight: 900, color: ROSSO }}><Coperto a={K.den1} w={380}>17%</Coperto></div><div style={{ fontSize: 44, fontWeight: 800 }}>PER TENTATIVO</div></div>
      <div style={{ textAlign: "center" }}><div style={{ fontSize: 220, fontWeight: 900, color: VIOLA }}><Coperto a={K.den2} w={380}>52%</Coperto></div><div style={{ fontSize: 44, fontWeight: 800 }}>PER PERSONA</div></div>
    </div>
    <div style={{ fontSize: 32, color: GRIGIO, marginTop: 30 }}>dati 2025 pubblicati da una firm americana</div>
  </Foglio>
);
const Carte: React.FC<{ sh: any }> = ({ sh }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const c = ["CODICE SCONTO", "CLASSIFICA", "★★★★★"];
  return (
    <AbsoluteFill style={{ background: "#fff", alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 60, fontFamily: INTER }}>
      {c.map((x, k) => {
        const m = molla(f, fps, F(sh.a + 0.5 * k), 13, 200);
        return (
          <div key={k} style={{ width: 460, height: 620, background: k === 0 ? VIOLA : "#fff", border: k ? `6px solid ${INK}` : undefined, color: k === 0 ? "#fff" : INK, borderRadius: 30, display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 60, fontWeight: 900, textAlign: "center", padding: 30, transform: `perspective(1000px) rotateY(${(1 - m) * 180}deg)`, backfaceVisibility: "hidden" }}>{x}</div>
        );
      })}
    </AbsoluteFill>
  );
};
// conto della serva su lavagna bianca: etichette subito, cifre coperte fino al momento giusto
const Lavagna: React.FC<{ sh: any }> = ({ sh }) => {
  const r: [number, string, string][] = [[K.lav1, "Spendi in media", "800 $"], [K.lav2, "Chi viene pagato", "7 su 100"], [K.lav3, "Pagamento medio", "4.000 $"], [K.lav4, "A testa", "≈ 280 $"]];
  return (
    <AbsoluteFill style={{ background: "#fff", alignItems: "center", justifyContent: "center", fontFamily: PENNA, color: INK }}>
      <div style={{ fontSize: 70, marginBottom: 40, color: VIOLA }}>il conto della serva</div>
      {r.map(([t, s, v], k) => (
        <div key={k} style={{ display: "flex", justifyContent: "space-between", width: 1300, fontSize: 74, margin: "12px 0", borderBottom: k === 2 ? `5px solid ${INK}` : undefined, paddingBottom: 8 }}>
          <span>{s}</span><span style={{ color: k === 3 ? ROSSO : INK }}><Coperto a={t} w={300}>{v}</Coperto></span>
        </div>
      ))}
    </AbsoluteFill>
  );
};
// i 5 punti: le righe non ancora dette restano sfocate (si vede che ci sono, non cosa dicono)
const Checklist: React.FC<{ sh: any }> = ({ sh }) => {
  const f = useCurrentFrame();
  const r: [number, string, string][] = [[K.cl1, "Rischio piccolo e fisso (0,5%)", "T2"], [K.cl2, "Più vicino al traguardo, meno rischio", "T3"], [K.cl3, "Regole scritte prima, provate sul passato", "T1"], [K.cl4, "Leggere gli aggettivi prima di comprare", "T5"], [K.cl5, "Budget dei tentativi deciso prima", "T4"]];
  return (
    <AbsoluteFill style={{ background: "#fff", alignItems: "center", justifyContent: "center", fontFamily: INTER, color: INK }}>
      <Tit>COSA FANNO <Vi>I 7</Vi></Tit><div style={{ height: 40 }} />
      {r.map(([t, s, tr], k) => {
        const on = f >= F(t);
        return (
          <div key={k} style={{ display: "flex", alignItems: "center", gap: 26, fontSize: 58, fontWeight: 800, margin: "12px 0", width: 1500, filter: on ? undefined : "blur(14px)", opacity: on ? 1 : 0.45 }}>
            <span style={{ color: VERDE, fontSize: 70 }}>{on ? "✔" : `${k + 1}`}</span><span style={{ flex: 1 }}>{s}</span>
            <span style={{ fontSize: 26, fontWeight: 900, background: INK, color: "#fff", padding: "10px 14px" }}>{tr}</span>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
const AB: React.FC<{ sh: any }> = ({ sh }) => (
  <AbsoluteFill style={{ background: "#fff", alignItems: "center", justifyContent: "center", fontFamily: INTER, color: INK }}>
    <Tit size={70}>IL PROSSIMO VIDEO LO DECIDI TU</Tit>
    <div style={{ display: "flex", gap: 60, marginTop: 60 }}>
      {[[K.ab1, "A", "Le regole di 3 prop firm a confronto"], [K.ab2, "B", "Un mese del nostro conto, giorno per giorno"]].map(([t, l, s], k) => (
        <Pop key={k} a={t as number} style={{ width: 700, height: 420, background: k ? "#fff" : VIOLA, border: k ? `6px solid ${INK}` : undefined, color: k ? INK : "#fff", borderRadius: 30, padding: 50, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ fontWeight: 900, fontSize: 130 }}>{l}</div>
          <div style={{ fontSize: 50, fontWeight: 800, marginTop: 20 }}>{s}</div>
        </Pop>
      ))}
    </div>
    <div style={{ fontSize: 34, fontWeight: 800, color: GRIGIO, marginTop: 50, letterSpacing: 3 }}>SCRIVI A O B NEI COMMENTI</div>
  </AbsoluteFill>
);
// nuove: i 100.000 $ che non esistono, simulatore vs mercato, la slot, le due strade
const NonEsistono: React.FC<{ sh: any }> = ({ sh }) => (
  <Foglio a={sh.a}>
    <div style={{ position: "relative" }}>
      <Tit size={230} col={VIOLA} style={{ letterSpacing: -8 }}>100.000 $</Tit>
      <svg width={1100} height={260} viewBox="0 0 1100 260" style={{ position: "absolute", left: 0, top: 0 }}>
        <Tratto a={86.3} dur={0.35} col={ROSSO} d="M30 220 L1070 40" w={16} />
      </svg>
    </div>
    {useCurrentFrame() >= F(86.3) && <Pop a={86.4} style={{ fontFamily: PENNA, fontSize: 90, color: ROSSO, marginTop: 20 }}>NON ESISTONO</Pop>}
  </Foglio>
);
const Confronto: React.FC<{ sh: any }> = ({ sh }) => {
  const f = useCurrentFrame();
  const col = (titolo: string, a: number, prezzo: React.ReactNode, nota: string, colore: string) => (
    <Pop a={a} style={{ width: 640, padding: "46px 40px", border: `6px solid ${colore}`, textAlign: "center" }}>
      <div style={{ fontSize: 44, fontWeight: 900, color: colore, letterSpacing: 2 }}>{titolo}</div>
      <div style={{ fontSize: 34, color: GRIGIO, marginTop: 20 }}>clicchi a 100,0</div>
      <div style={{ fontSize: 120, fontWeight: 900, color: INK, marginTop: 6 }}>{prezzo}</div>
      <div style={{ fontSize: 32, fontWeight: 700, color: colore }}>{nota}</div>
    </Pop>
  );
  return (
    <Foglio a={sh.a}>
      <Tit style={{ marginBottom: 50 }}>DOVE ENTRI <Vi>DAVVERO</Vi></Tit>
      <div style={{ display: "flex", gap: 70 }}>
        {col("SIMULATORE", sh.a, "100,0", "slippage zero", VERDE)}
        {col("MERCATO VERO", 119.8, <Coperto a={122.3} w={300}>100,8</Coperto>, f >= F(122.3) ? "il prezzo è corso" : " ", ROSSO)}
      </div>
      {f >= F(125.0) && <Pop a={125.0} style={{ fontFamily: PENNA, fontSize: 56, color: ROSSO, marginTop: 40 }}>una strategia che nel mondo reale non sta in piedi</Pop>}
    </Foglio>
  );
};
const Slot: React.FC<{ sh: any }> = ({ sh }) => {
  const f = useCurrentFrame();
  const s = ["🍒", "🍒", "❌"], ferma = [270.1, 270.71, 271.3];
  return (
    <Foglio a={sh.a}>
      <Tit style={{ marginBottom: 40 }}>Slot machine · studio <Vi>2009</Vi></Tit>
      <div style={{ display: "flex", gap: 30 }}>
        {s.map((x, k) => {
          const st = f >= F(ferma[k]);
          const gir = ["🍒", "💰", "❌", "7️⃣"][Math.floor(f / 2 + k) % 4];
          return <div key={k} style={{ width: 230, height: 250, border: `6px solid ${INK}`, borderRadius: 24, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 150, filter: st ? undefined : "blur(4px)" }}>{st ? x : gir}</div>;
        })}
      </div>
      <div style={{ display: "flex", gap: 60, marginTop: 40, minHeight: 80 }}>
        {f >= F(271.9) && <Pop a={271.9} style={{ fontFamily: PENNA, fontSize: 64, color: VIOLA }}>QUASI = IL CERVELLO SI ACCENDE</Pop>}
      </div>
      {f >= F(274.8) && <Pop a={274.8} style={{ fontFamily: PENNA, fontSize: 56, color: ROSSO }}>e ti viene più voglia di giocare</Pop>}
    </Foglio>
  );
};
const Strade: React.FC<{ sh: any }> = ({ sh }) => {
  const f = useCurrentFrame();
  const sx = f >= F(705.0), dx = f >= F(707.2);
  return (
    <AbsoluteFill style={{ background: "#fff", alignItems: "center", justifyContent: "center", fontFamily: INTER, color: INK }}>
      <Tit>STASERA HAI <Vi>2 STRADE</Vi></Tit>
      <svg width={1200} height={360} viewBox="0 0 1200 360" style={{ marginTop: 20 }}>
        <Tratto a={sh.a + 0.2} dur={0.5} d="M600 350 L600 220" w={12} />
        <Tratto a={sh.a + 0.6} dur={0.5} col={sx ? ROSSO : INK} d="M600 220 C 560 120, 380 80, 220 40" w={12} />
        <Tratto a={sh.a + 0.6} dur={0.5} col={dx ? VERDE : INK} d="M600 220 C 640 120, 820 80, 980 40" w={12} />
      </svg>
      <div style={{ display: "flex", justifyContent: "space-between", width: 1500 }}>
        <div style={{ width: 640, textAlign: "center", opacity: dx ? 0.35 : 1 }}>{sx && <Pop a={705.0} style={{ fontFamily: PENNA, fontSize: 62, color: ROSSO }}>Ne compri un'altra<br />a sentimento e speri</Pop>}</div>
        <div style={{ width: 640, textAlign: "center" }}>{dx && <Pop a={707.2} style={{ fontFamily: PENNA, fontSize: 62, color: VERDE }}>Prima di spendere<br />ti scrivi le regole</Pop>}</div>
      </div>
    </AbsoluteFill>
  );
};
// ---------- v3b: grafiche al posto dei primi piani troppo stretti ----------
const Cartello: React.FC<{ sh: any }> = ({ sh }) => (
  <AbsoluteFill style={{ background: "#fff", alignItems: "center", justifyContent: "center" }}>
    <svg width={560} height={350} viewBox="0 0 400 250">
      {ICONE[sh.icona].map(([d, c], k) => <Tratto key={k} a={sh.a + 0.1 + 0.12 * k} dur={0.45} d={d} col={c ?? INK} w={7} />)}
    </svg>
    <Pop a={sh.a + 0.4} style={{ fontFamily: INTER, fontWeight: 900, fontSize: 96, letterSpacing: -3, color: INK, marginTop: 10 }}>{sh.testo}</Pop>
    {sh.sotto && <Pop a={sh.a + 1.2} style={{ fontFamily: PENNA, fontSize: 54, color: VIOLA, marginTop: 10 }}>{sh.sotto}</Pop>}
  </AbsoluteFill>
);
// «sempre lo stesso film»: due giorni su, poi l'operazione storta e i tre errori
const Storia: React.FC<{ sh: any }> = ({ sh }) => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const pts: [number, number][] = [[308.3, 0], [309.4, 2.2], [310.6, 4.5], [311.6, 4.2], [312.4, 2.5], [313.8, 0.8], [315.0, -1.5], [316.4, -4.0], [317.8, -6.5]];
  const W = 1500, H = 560, y = (v: number) => 60 + (5 - v) * (H - 120) / 11.5, tx = (s: number) => ((s - 308.3) / 9.5) * W;
  const vis = pts.filter(([s]) => s <= t);
  if (vis.length && vis.length < pts.length) {
    const nx = pts[vis.length]; const [s0, v0] = vis[vis.length - 1]; const k = Math.min(1, (t - s0) / (nx[0] - s0));
    vis.push([s0 + (nx[0] - s0) * k, v0 + (nx[1] - v0) * k]);
  }
  const d = vis.map(([s, v], i) => `${i ? "L" : "M"}${tx(s)},${y(v)}`).join(" ");
  const nota = (a: number, x: number, v: number, testo: string, col: string) => t >= a && (
    <Pop a={a} style={{ position: "absolute", left: 210 + tx(x) - 160, top: 240 + y(v), width: 320, textAlign: "center", fontFamily: PENNA, fontSize: 44, color: col }}>{testo}</Pop>
  );
  return (
    <AbsoluteFill style={{ background: "#fff", fontFamily: INTER }}>
      <Tit size={60} style={{ marginTop: 80 }}>SEMPRE <Vi>LO STESSO FILM</Vi></Tit>
      <svg width={W} height={H} style={{ position: "absolute", left: 210, top: 240, overflow: "visible" }}>
        <line x1={0} x2={W} y1={y(0)} y2={y(0)} stroke="#c9c6d6" strokeWidth={3} strokeDasharray="12 10" />
        <path d={d} fill="none" stroke={vis.length && vis[vis.length - 1][1] < 0 ? ROSSO : VIOLA} strokeWidth={9} strokeLinejoin="round" strokeLinecap="round" />
      </svg>
      {nota(309.6, 1.3, 5.2, "2 giorni perfetti", VERDE)}
      {nota(312.0, 3.9, 4.6, "un'operazione va storta", ROSSO)}
      {nota(314.0, 6.0, -0.5, "sposti lo stop", ROSSO)}
      {nota(316.0, 8.4, -3.0, "raddoppi", ROSSO)}
    </AbsoluteFill>
  );
};
// «hai perso, e proprio in quel momento arriva l'offerta»
const Telefono: React.FC<{ sh: any }> = ({ sh }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#fff", alignItems: "center", justifyContent: "center", fontFamily: INTER }}>
      <svg width={420} height={760} viewBox="0 0 420 760" style={{ position: "absolute" }}>
        <Tratto a={sh.a + 2.4} dur={0.6} d="M60 20 L360 20 C 390 20, 400 30, 400 60 L400 700 C 400 730, 390 740, 360 740 L60 740 C 30 740, 20 730, 20 700 L20 60 C 20 30, 30 20, 60 20 Z" w={8} />
      </svg>
      {f >= F(sh.a + 2.6) && <Pop a={sh.a + 2.6} style={{ position: "absolute", top: 330, fontSize: 64, fontWeight: 900, color: ROSSO }}>CHALLENGE FALLITA</Pop>}
      {f >= F(334.4) && <div style={{ position: "absolute", top: 200, width: 1200, height: 300 }}><Notifica o={{ a: 334.4, b: 340 }} /></div>}
    </AbsoluteFill>
  );
};

// ---------- intro: anteprima di tutto il film sulla voce (tempi = secondi dell'intro) ----------
const Intro: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const scena = t < 4.9 ? 0 : t < 8.4 ? 1 : t < 12.4 ? 2 : t < 15.4 ? 3 : t < 19.3 ? 4 : 5;
  const Box: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <AbsoluteFill style={{ background: "#fff", alignItems: "center", justifyContent: "center", fontFamily: INTER, color: INK }}>{children}</AbsoluteFill>
  );
  if (scena === 0) return (
    <Box>
      <div style={{ position: "relative" }}>
        <Pop a={0.1}><Tit size={230} col={VIOLA} style={{ letterSpacing: -8 }}>100.000 $</Tit></Pop>
        <svg width={1100} height={260} viewBox="0 0 1100 260" style={{ position: "absolute", left: 0, top: 0 }}><Tratto a={3.6} dur={0.3} col={ROSSO} d="M30 220 L1070 40" w={16} /></svg>
      </div>
      {t >= 3.7 && <Pop a={3.7} style={{ fontFamily: PENNA, fontSize: 90, color: ROSSO }}>NON ESISTONO</Pop>}
    </Box>
  );
  if (scena === 1) return (
    <Box>
      <Pop a={4.9} style={{ fontSize: 46, fontWeight: 800, color: GRIGIO, letterSpacing: 3 }}>BASTA NON PERDERE PIÙ DEL</Pop>
      <Pop a={6.8}><Tit size={260} col={ROSSO} style={{ letterSpacing: -10 }}>−5%</Tit></Pop>
      {t >= 7.5 && <Pop a={7.5} style={{ fontFamily: PENNA, fontSize: 70 }}>al giorno?</Pop>}
    </Box>
  );
  if (scena === 2) return (
    <Box>
      <div style={{ fontWeight: 900, fontSize: 280, letterSpacing: -10, color: t >= 10.3 ? ROSSO : INK, fontVariantNumeric: "tabular-nums" }}>{t >= 10.3 ? "00:00" : "23:59"}</div>
      {t >= 11.0 && <Pop a={11.0} style={{ transform: "rotate(-3deg)" }}><span style={{ background: ROSSO, color: "#fff", fontWeight: 900, fontSize: 100, padding: "4px 36px" }}>CONTO CHIUSO</span></Pop>}
    </Box>
  );
  if (scena === 3) return (
    <Box>
      <Pop a={12.5} style={{ fontSize: 50, fontWeight: 800, color: GRIGIO, letterSpacing: 3 }}>QUANDO VINCI TU</Pop>
      <Pop a={13.3}><Tit size={150}>PER LORO È UN <Vi rosso>COSTO</Vi></Tit></Pop>
    </Box>
  );
  if (scena === 4) return (
    <Box>
      <Tit size={90} style={{ marginBottom: 50 }}>LE <Vi>7 TRAPPOLE</Vi></Tit>
      <div style={{ display: "flex", gap: 30 }}>
        {Array.from({ length: 7 }, (_, k) => (
          <Pop key={k} a={16.9 + 0.22 * k} style={{ width: 170, height: 200, border: `6px solid ${INK}`, borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 110, fontWeight: 900, color: k % 2 ? INK : VIOLA }}>{k + 1}</Pop>
        ))}
      </div>
    </Box>
  );
  return (
    <Box>
      <Tit size={80} style={{ marginBottom: 30 }}>COSA FANNO <Vi>QUELLI CHE CE LA FANNO</Vi></Tit>
      {["Rischio piccolo e fisso", "Più vicino al traguardo, meno rischio", "Regole scritte prima"].map((s, k) => (
        <div key={k} style={{ fontSize: 58, fontWeight: 800, margin: "10px 0", filter: "blur(13px)", opacity: 0.5 }}>✔ {s}</div>
      ))}
      {t >= 22.2 && <Pop a={22.2} style={{ fontFamily: PENNA, fontSize: 70, color: VIOLA, marginTop: 20 }}>con i numeri</Pop>}
    </Box>
  );
};

// ---------- sponsor: C + i link + barra che dice quando finisce (tempi = secondi dello sponsor; voce da 0,4) ----------
const SpCam: React.FC = () => (
  <Zoom a={0} z={1}>
    <OffthreadVideo src={staticFile(`${C}/extra/sponsor-c.mp4`)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
  </Zoom>
);
const Sponsor: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const link: [number, string, string, string][] = [
    [7.3, "ALGORY", "lo strumento con cui faccio trading", "codice STANGA50: −50% sul primo pagamento"],
    [15.9, "HIGGSFIELD", "il personaggio e le scene", ""],
    [17.8, "ELEVENLABS", "la voce", ""],
    [19.4, "RUNPOD", "il labiale", ""],
  ];
  const p = cl(t / SP_LEN);
  // dopo 19,2 s la seconda clip di P-Video era un primo piano troppo stretto: si passa alla schermata dei link
  const schermata = t >= 19.2;
  return (
    <AbsoluteFill style={{ background: "#fff" }}>
      {!schermata && <SpCam />}
      {schermata && <Pop a={19.2} style={{ position: "absolute", left: 0, right: 0, top: 110, textAlign: "center", fontFamily: INTER, fontWeight: 900, fontSize: 64, color: INK, letterSpacing: -2 }}>TUTTI I MIEI LINK SONO <span style={{ background: VIOLA, color: "#fff", padding: "0 14px" }}>IN DESCRIZIONE</span></Pop>}
      <div style={{ position: "absolute", left: 50, top: 40, fontFamily: INTER, fontWeight: 900, fontSize: 26, color: "#fff", background: VIOLA, padding: "10px 18px", letterSpacing: 2 }}>SPONSOR · I MIEI LINK</div>
      <div style={schermata ? { position: "absolute", left: 460, top: 230, width: 1000, display: "flex", flexDirection: "column", gap: 16, transform: "scale(1.05)" } : { position: "absolute", right: 40, top: 120, width: 560, display: "flex", flexDirection: "column", gap: 16 }}>
        {link.filter(([a]) => t >= a).map(([a, n, cosa, extra]) => (
          <Pop key={n} a={a} style={{ background: "#fff", border: "2px solid #e4e2ea", boxShadow: "0 12px 34px #0002", borderRadius: 18, padding: "16px 24px", fontFamily: INTER }}>
            <div style={{ fontSize: 40, fontWeight: 900, color: n === "ALGORY" ? VIOLA : INK }}>{n}</div>
            <div style={{ fontSize: 26, color: GRIGIO }}>{cosa}</div>
            {extra && t >= 10.4 && <div style={{ fontSize: 26, fontWeight: 800, color: VERDE, marginTop: 4 }}>{extra}</div>}
          </Pop>
        ))}
        {t >= 20.9 && <Pop a={20.9} style={{ fontFamily: PENNA, fontSize: 40, color: VIOLA, textAlign: "center" }}>link in descrizione ↓ a te non costa niente in più</Pop>}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 64, background: "#ffffffee", borderTop: "2px solid #e4e2ea", display: "flex", alignItems: "center", fontFamily: INTER }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${p * 100}%`, background: `${VIOLA}33` }} />
        <div style={{ position: "absolute", left: `${p * 100}%`, top: 0, bottom: 0, width: 6, background: VIOLA }} />
        <div style={{ position: "relative", marginLeft: 30, fontSize: 26, fontWeight: 900, color: INK }}>SPONSORIZZATA · finisce tra {Math.max(0, Math.ceil(SP_LEN - t))} s</div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- banner like / commenta / hype / iscriviti (quando C parla e non ci sono altre grafiche) ----------
const ENGAGE: number[] = [95.6, 252.0, 478.5, 676.6];
const Engage: React.FC<{ a: number }> = ({ a }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < F(a) || f > F(a + 5.2)) return null;
  const m = molla(f, fps, F(a), 14, 200);
  const u = ramp(f, F(a + 4.7), F(a + 5.2));
  const b: [string, number][] = [["👍 LIKE", 0.6], ["💬 COMMENTA", 1.4], ["🔥 HYPE", 2.2], ["ISCRIVITI", 3.0]];
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 60, display: "flex", justifyContent: "center", opacity: m * (1 - u), transform: `translateY(${(1 - m) * 100}px)` }}>
      <div style={{ display: "flex", gap: 14, background: "#fff", border: "2px solid #e4e2ea", boxShadow: "0 12px 40px #0002", borderRadius: 40, padding: "12px 16px", fontFamily: INTER }}>
        {b.map(([s, d]) => {
          const on = f >= F(a + d);
          const isc = s === "ISCRIVITI";
          return <div key={s} style={{ fontSize: 30, fontWeight: 900, padding: "12px 24px", borderRadius: 30, background: on ? (isc ? "#e62117" : VIOLA) : "#ecebf0", color: on ? "#fff" : INK, transform: `scale(${on && f < F(a + d) + 6 ? 1.12 : 1})` }}>{s}</div>;
        })}
      </div>
    </div>
  );
};

const GRAF: Record<string, React.FC<{ sh: any }>> = {
  omini: Omini, titolo: TitoloFilm, regole: Regole, citazione: Citazione, zeroset: ZeroSet, secchi: Secchi, obiettivo: Obiettivo, fondi: Fondi,
  giorni: Giorni, numero: Numero, carrelli: Carrelli, studio: Studio, pagina: Pagina, crollo: Crollo, denominatore: Denominatore, carte: Carte,
  lavagna: Lavagna, checklist: Checklist, ab: AB, nonesistono: NonEsistono, confronto: Confronto, slot: Slot, strade: Strade,
  cartello: (p) => <Cartello {...p} />, storia: (p) => <Storia {...p} />, telefono: (p) => <Telefono {...p} />,
};

// ---------- regia v3: cosa cambia rispetto al film v2 (indice dello shot → nuova scena) ----------
const cam = (nome: string) => ({ tipo: "cam3", nome });
const num = (o: any) => ({ tipo: "graf", nome: "numero", ...o });
const ZS = { tipo: "graf", nome: "zeroset", a: 103.8 };
const CF = { tipo: "graf", nome: "confronto", a: 115.1 };
const STO = { tipo: "graf", nome: "storia", a: 308.3 };
const SL = { tipo: "graf", nome: "slot", a: 263.4 };
const CH = { tipo: "graf", nome: "numero", a: 502.9, sopra: "PROP FIRM CHIUSE TRA 2024 E 2025", prima: "", n0: 0, n1: 100, dopo: "", sotto: "più o meno 1 su 7", t0: 511.9, ts: 513.6, scendi: true };
const ST = { tipo: "graf", nome: "strade", a: 701.8 };
const OVR: Record<number, any> = {
  0: cam("s0"), 3: cam("s3"), 9: { tipo: "graf", nome: "cartello", a: 40.5, icona: "doc", testo: "COME SONO COSTRUITE", sotto: "anche quello che in homepage non c'è" }, 11: cam("s11"),
  12: num({ a: 59.2, sopra: "ORE 9:00 · HAI APPENA SPESO", prima: "", n0: 0, n1: 540, dopo: " €", sotto: "e non hai ancora fatto un'operazione", t0: 61.2, ts: 62.6, scendi: true }),
  13: num({ a: 65.2, sopra: "IN CAMBIO HAI UN CONTO DA", prima: "", n0: 0, n1: 100000, dopo: " $", sotto: "", t0: 66.4 }),
  16: cam("s16"), 17: { tipo: "graf", nome: "nonesistono", a: 84.8 }, 20: cam("s20"), 21: ZS, 22: ZS, 24: CF, 25: CF,
  42: cam("s42"), 46: cam("s46"), 47: SL, 48: SL, 50: cam("s50"), 54: STO, 55: STO,
  56: num({ a: 317.8, sopra: "E IN", prima: "", n0: 0, n1: 20, dopo: " MINUTI", sotto: "l'esame è finito", t0: 317.9, ts: 318.9, scendi: true }),
  58: cam("s58"), 60: { tipo: "graf", nome: "telefono", a: 332.1 }, 67: cam("s67"),
  68: num({ a: 376.3, sopra: "300.000 CONTI · 10 PROP FIRM", prima: "", n0: 0, n1: 3, dopo: "", sotto: "challenge comprate in media, a testa", t0: 381.2, ts: 381.8 }),
  71: cam("s71"), 74: cam("s74"), 80: cam("s80"),
  81: num({ a: 438.9, sopra: "PAGAMENTI IN RITARDO", prima: "", n0: 0, n1: 3300, dopo: " persone", sotto: "alcune aspettavano da più di un anno", t0: 444.3, ts: 445.8, scendi: true }),
  89: CH, 90: CH, 91: cam("s91"), 96: cam("s96"),
  98: num({ a: 542.6, sopra: "A CHI METTE IL CODICE SCONTO", prima: "fino al ", n0: 0, n1: 20, dopo: "%", sotto: "di quello che paghi", t0: 547.0 }),
  108: { tipo: "graf", nome: "cartello", a: 613.6, icona: "dado", testo: "COME AL CASINÒ", sotto: "" }, 111: cam("s111"), 115: cam("s115"), 118: ST, 119: ST, 120: ST,
};
// la lista finale si alterna con C (inquadrature k1-k4) tra un punto e l'altro
const CHK_C: [number, number, string][] = [[641.7, 644.8, "k2"], [648.5, 653.3, "k3"]];

// ---------- sovrimpressioni ----------
const Trappola: React.FC<{ o: any }> = ({ o }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < F(o.a) || f > F(o.a + 2.6)) return null;
  const m = molla(f, fps, F(o.a), 12, 220);
  const u = ramp(f, F(o.a + 2.25), F(o.a + 2.6));
  return (
    <AbsoluteFill style={{ background: "#fff", alignItems: "center", justifyContent: "center", opacity: 1 - u }}>
      <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 40, color: VIOLA, letterSpacing: 6, transform: `scale(${0.9 + 0.1 * m})` }}>TRAPPOLA {o.n} DI 7</div>
      <div style={{ fontFamily: INTER, fontWeight: 900, fontSize: 100, color: INK, letterSpacing: -3, marginTop: 26, textAlign: "center", maxWidth: 1600, textTransform: "uppercase", opacity: m, transform: `translateY(${(1 - m) * 30}px)` }}>{o.titolo}</div>
    </AbsoluteFill>
  );
};
const Contatore: React.FC<{ t: number }> = ({ t }) => {
  const tr = OVER.filter((o: any) => o.tipo === "trappola" && o.a + 2.6 <= t);
  if (!tr.length || t > K.cl1) return null;
  const n = tr[tr.length - 1].n;
  return (
    <div style={{ position: "absolute", right: 50, top: 40, fontFamily: INTER, fontWeight: 800, fontSize: 24, color: INK, background: "#ffffffe6", padding: "10px 16px", display: "flex", gap: 12, alignItems: "center", border: "2px solid #ecebf0" }}>
      TRAPPOLA {n}/7
      <span style={{ display: "flex", gap: 5 }}>{Array.from({ length: 7 }, (_, k) => <span key={k} style={{ width: 12, height: 12, borderRadius: 6, background: k < n ? VIOLA : "#d9d7e0" }} />)}</span>
    </div>
  );
};
const Nome: React.FC<{ o: any }> = ({ o }) => {
  const f = useCurrentFrame();
  const fine = o.b ?? o.a + 3;
  if (f < F(o.a) || f > F(fine) + 8) return null;
  const e = Easing.out(Easing.cubic)(ramp(f, F(o.a), F(o.a) + 8));
  const u = ramp(f, F(fine), F(fine) + 6);
  return (
    <div style={{ position: "absolute", left: 70, bottom: 70, opacity: 1 - u, clipPath: `inset(0 ${(1 - e) * 100}% 0 0)`, background: "#fff", border: "2px solid #e4e2ea", boxShadow: "0 12px 40px #0002", padding: "18px 34px", fontFamily: INTER }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, fontWeight: 900, fontSize: 48, color: INK }}><span style={{ width: 16, height: 16, background: VIOLA }} />C · THE TRADER</div>
      <div style={{ fontSize: 24, color: GRIGIO, marginTop: 4 }}>personaggio AI · dietro c'è Marco · @cthe.trader</div>
    </div>
  );
};
const Campanella: React.FC<{ size: number; col: string }> = ({ size, col }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"><path fill={col} d="M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22zm7-6V11a7 7 0 0 0-5.5-6.84V3.5a1.5 1.5 0 0 0-3 0v.66A7 7 0 0 0 5 11v5l-2 2v1h18v-1z" /></svg>
);
const Iscriviti: React.FC<{ o: any }> = ({ o }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fine = o.b ?? o.a + 3;
  if (f < F(o.a) || f > F(fine) + 8) return null;
  const m = molla(f, fps, F(o.a), 14, 200);
  const u = ramp(f, F(fine), F(fine) + 8);
  const c1 = F(o.a + 1.8), c2 = F(o.a + 3.2), c3 = F(o.a + 6.0);
  const iscritto = f >= c1, camp = f >= c2, like = f >= c3;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 70, display: "flex", justifyContent: "center", opacity: m * (1 - u), transform: `translateY(${(1 - m) * 120}px)` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 26, background: "#fff", border: "2px solid #e4e2ea", boxShadow: "0 12px 40px #0002", borderRadius: 26, padding: "18px 30px", fontFamily: INTER }}>
        <img src={staticFile(`${C}/avatar.jpg`)} style={{ width: 90, height: 90, borderRadius: 45, border: `4px solid ${VIOLA}` }} />
        <div style={{ color: INK, fontSize: 36, fontWeight: 800 }}>C · The Trader</div>
        <div style={{ fontWeight: 800, fontSize: 32, padding: "16px 34px", borderRadius: 50, background: iscritto ? "#e4e2ea" : "#e62117", color: iscritto ? INK : "#fff" }}>{iscritto ? "ISCRITTO ✓" : "ISCRIVITI"}</div>
        <div style={{ width: 76, height: 76, borderRadius: 38, display: "flex", alignItems: "center", justifyContent: "center", background: camp ? VIOLA : "#ecebf0" }}><Campanella size={46} col={camp ? "#fff" : INK} /></div>
        <div style={{ fontSize: 46, padding: "6px 18px", borderRadius: 40, background: like ? VIOLA : "#ecebf0" }}>👍</div>
      </div>
    </div>
  );
};
const Notifica: React.FC<{ o: any }> = ({ o }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < F(o.a) || f > F(o.b ?? o.a + 3)) return null;
  const m = molla(f, fps, F(o.a), 13, 260);
  return (
    <div style={{ position: "absolute", right: 50, top: 180, width: 620, transform: `translateX(${(1 - m) * 700}px)`, background: "#fff", borderRadius: 26, border: "2px solid #ecebf0",
      boxShadow: "0 20px 60px #0003", padding: "26px 30px", display: "flex", alignItems: "center", gap: 24, fontFamily: INTER }}>
      <div style={{ width: 90, height: 90, borderRadius: 22, background: VIOLA, color: "#fff", fontWeight: 900, fontSize: 48, display: "flex", alignItems: "center", justifyContent: "center" }}>%</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 24, color: GRIGIO, fontWeight: 600 }}>PROP FIRM · adesso</div>
        <div style={{ fontSize: 38, color: INK, fontWeight: 900 }}>Riprova la tua challenge: −20%</div>
      </div>
    </div>
  );
};
const Avviso: React.FC<{ o: any }> = ({ o }) => {
  const f = useCurrentFrame();
  if (f < F(o.a) || f > F(o.b ?? o.a + 3)) return null;
  return (
    <div style={{ position: "absolute", left: 60, right: 60, bottom: 50, textAlign: "center", fontFamily: INTER, fontSize: 30, color: INK, background: "#ffffffee", border: "2px solid #e4e2ea", padding: "16px 24px", opacity: ramp(f, F(o.a), F(o.a) + 8) }}>
      ⚠️ Non è un consiglio finanziario. Il trading comporta un alto rischio: puoi perdere tutto il capitale.
    </div>
  );
};
const CheckGratis: React.FC<{ o: any }> = ({ o }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < F(o.a) || f > F(o.b ?? o.a + 3)) return null;
  const m = molla(f, fps, F(o.a), 13, 240);
  return (
    <div style={{ position: "absolute", right: 80, bottom: 90, transform: `scale(${m})`, background: VIOLA, color: "#fff", fontFamily: INTER, fontWeight: 900, fontSize: 46, padding: "22px 34px", borderRadius: 20, boxShadow: "0 16px 40px #0003" }}>
      CHECKLIST GRATIS <span style={{ display: "inline-block", transform: `translateY(${Math.sin(f / 5) * 10}px)` }}>↓</span>
      <div style={{ fontSize: 26, fontWeight: 600, marginTop: 4 }}>link in descrizione</div>
    </div>
  );
};
const OV: Record<string, React.FC<{ o: any }>> = { trappola: Trappola, nome: Nome, iscriviti: Iscriviti, avviso: Avviso, checkgratis: CheckGratis };

// ---------- il film (tempo = secondi della voce originale) ----------
const FilmLayer: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const i = Math.max(0, SHOT.findIndex((s: any) => t >= s.a && t < s.b));
  const sh0 = SHOT[i];
  const o = OVR[i];
  let scena: React.ReactNode = null;
  let suC = false;
  const kc = i === 112 ? CHK_C.find(([a, b]) => t >= a && t < b) : undefined;
  if (kc) { scena = <CamV3 a={kc[0]} nome={kc[2]} />; suC = true; }
  else if (o?.tipo === "cam3") { scena = <CamV3 a={sh0.a} nome={o.nome} z={o.nome === "s54" && t >= 313.8 ? 1.12 : 1} />; suC = true; }
  else if (o?.tipo === "graf") { const G = GRAF[o.nome]; scena = <G sh={{ ...sh0, ...o }} />; }
  else if (sh0.tipo === "parla") {
    // stacco a scatti: le inquadrature larghe si alternano tra normale e un po' più strette
    const z = sh0.z === "s" ? 1 : i % 2 ? 1.1 : 1;
    scena = <CamCS sh={sh0} idx={i} z={z} />; suC = true;
  } else if (sh0.tipo === "graf") { const G = GRAF[sh0.nome]; scena = G ? <G sh={sh0} /> : null; }
  const chiave = kc ? kc[2] : o?.a ?? i;
  return (
    <AbsoluteFill style={{ background: "#fff" }}>
      <AbsoluteFill key={String(chiave)}>{scena}</AbsoluteFill>
      {suC && NOTE.filter((n) => t >= n.a && t < n.b).slice(-1).map((n, k) => <Doodle key={k + "-" + n.a} n={n} />)}
      {suC && ENGAGE.map((a) => <Engage key={a} a={a} />)}
      {OVER.map((ov: any, k: number) => { const O = OV[ov.tipo]; return O ? <O key={k} o={ov} /> : null; })}
      <Contatore t={t} />
      {t >= K.fine + 1.0 && <AbsoluteFill style={{ background: "#fff" }} />}
    </AbsoluteFill>
  );
};

// suoni leggeri: pop sulle grafiche e scribble sulle note
const SUONI: [number, string][] = [
  ...SHOT.filter((s: any, i: number) => !(147.4 <= s.a && s.a < 227.5) && (s.tipo === "graf" || OVR[i]?.tipo === "graf")).map((s: any): [number, string] => [s.a, "pop"]),
  ...NOTE.map((n: any): [number, string] => [n.a, "scribble"]),
];

// montaggio: intro · film [0, T2A) · trappola 2 · film [T2OLD, SP_FILM) · sponsor · film [SP_FILM, fine)
export const P2V3: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const suono = (lista: [number, string][], sposta: number) => lista.map(([tt, nome], k) => (
    <Sequence key={nome + k + "-" + sposta} from={Math.max(0, F(tt + sposta))} durationInFrames={F(1.6)}>
      <Audio src={staticFile(`${C}/sfx/${nome}.wav`)} volume={nome === "pop" ? 0.12 : 0.14} />
    </Sequence>
  ));
  const voce = (da: number, a: number, off: number) => (
    <Sequence from={F(off + da)} durationInFrames={F(a - da)}><Audio src={staticFile(`${C}/voce.wav`)} startFrom={F(da)} endAt={F(a)} /></Sequence>
  );
  return (
    <AbsoluteFill style={{ background: "#fff" }}>
      <Sequence from={0} durationInFrames={F(INTRO)}><Intro /><Audio src={staticFile(`${C}/extra/intro-v2.wav`)} /></Sequence>
      <Sequence from={F(OFF_A)} layout="none">{t >= INTRO && t < INTRO + T2A && <FilmLayer />}</Sequence>
      <Sequence from={F(INTRO + T2A)} durationInFrames={F(T2LEN)}><P2T2 /></Sequence>
      <Sequence from={F(OFF_B)} layout="none">{t >= INTRO + T2A + T2LEN && t < SP_A && <FilmLayer />}</Sequence>
      <Sequence from={F(SP_A)} durationInFrames={F(SP_LEN)}><Sponsor /><Audio src={staticFile(`${C}/extra/sponsor-pv.wav`)} /></Sequence>
      <Sequence from={F(OFF_C)} layout="none">{t >= SP_A + SP_LEN && <FilmLayer />}</Sequence>
      {voce(0, T2A, OFF_A)}
      {voce(T2OLD, SP_FILM, OFF_B)}
      {voce(SP_FILM, FILM_FINE, OFF_C)}
      {suono(SUONI.filter(([tt]) => tt < T2A), OFF_A)}
      {suono(SUONI.filter(([tt]) => tt >= T2OLD && tt < SP_FILM), OFF_B)}
      {suono(SUONI.filter(([tt]) => tt >= SP_FILM), OFF_C)}
    </AbsoluteFill>
  );
};
