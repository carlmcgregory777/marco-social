// P2 film «Le 7 trappole delle prop firm» (17/11/2026): YouTube 16:9, ~12:30.
// Copione: youtube/P2-prop-firm/COPIONE-v2.md. Regia (tempi, inquadrature, grafiche) generata da film/montaggio/regia.py in p2film-dati.ts.
// Stessa regia del P1 v2 / trailer P2: punch a ogni stacco, shake e flash sulle scritte forti, musica a crescendo.
import React from "react";
import { AbsoluteFill, Audio, Easing, interpolate, Loop, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadPixel } from "@remotion/google-fonts/PressStart2P";
import { loadFont as loadMarker } from "@remotion/google-fonts/PermanentMarker";
import { INTER, molla, NERO, ROSSO, VIOLA } from "./FormatC";
import { DURATA_P2FILM_S, FX, K, OVER, PEZZI, SHOT } from "./p2film-dati";

const { fontFamily: PIXEL } = loadPixel();
const { fontFamily: PENNA } = loadMarker();
const C = "p2f";
const FPS = 30;
const F = (s: number) => Math.round(s * FPS);
export const DURATA_P2FILM = F(DURATA_P2FILM_S);
const INK = "#15131a";
const VERDE = "#22c55e";
const cl = (x: number) => Math.max(0, Math.min(1, x));
const ramp = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const useT = () => useCurrentFrame() / FPS;
const fmt = (n: number) => Math.round(n).toLocaleString("it-IT");

// shake sulle scritte con flash
const SHAKE: number[] = OVER.filter((o) => o.tipo === "botta" && o.flash).map((o) => o.a + (o.dopo ?? 0));

// ---------- contenitore con punch-in ----------
const Punch: React.FC<{ a: number; base: number; o: string; fino?: number; children: React.ReactNode }> = ({ a, base, o, fino = 0, children }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const m = molla(f, fps, F(a), 14, 260);
  const s = base * (1 + 0.06 * (1 - m)) * (1 + fino);
  let x = 0, y = 0;
  for (const tt of SHAKE) {
    const d = f - F(tt);
    if (d >= 0 && d < 10) { const k = (1 - d / 10) * 16; x += Math.sin(d * 2.7) * k; y += Math.cos(d * 3.3) * k * 0.6; }
  }
  const blur = interpolate(f - F(a), [0, 2], [3, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <AbsoluteFill style={{ transform: `translate(${x}px, ${y}px) scale(${s})`, transformOrigin: o, filter: blur > 0.2 ? `blur(${blur}px)` : undefined }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- C che parla: sceglie il pezzo del labiale giusto ----------
const ZOOM: Record<string, [number, string]> = { l: [1.0, "50% 40%"], m: [1.3, "50% 24%"], s: [1.62, "50% 17%"] };
const Parla: React.FC<{ sh: any }> = ({ sh }) => {
  const f = useCurrentFrame();
  const p = cl((f / FPS - sh.a) / Math.max(0.1, sh.b - sh.a));
  const [z, o] = ZOOM[sh.z] ?? ZOOM.m;
  const ora = f / FPS;
  let i = PEZZI.findIndex((x) => ora >= x.a && ora < x.b);
  if (i < 0) i = PEZZI.length - 1;
  return (
    <Punch a={sh.a} base={z} o={o} fino={0.03 * Easing.inOut(Easing.quad)(p)}>
      {PEZZI.map((pz, k) => (
        <Sequence key={k} from={F(pz.a)} durationInFrames={F(pz.b - pz.a) + 2} layout="none">
          <OffthreadVideo src={staticFile(`${C}/labiale/p${k}.mp4`)} muted style={{ width: "100%", height: "100%", objectFit: "cover", display: k === i ? "block" : "none" }} />
        </Sequence>
      ))}
    </Punch>
  );
};

const Clip: React.FC<{ sh: any }> = ({ sh }) => {
  const f = useCurrentFrame();
  const p = cl((f / FPS - sh.a) / Math.max(0.1, sh.b - sh.a));
  const s = sh.s + (sh.s2 - sh.s) * Easing.inOut(Easing.quad)(p);
  const giro = F(4.6 / sh.vel);
  return (
    <Punch a={sh.a} base={s} o={sh.o}>
      <Sequence from={F(sh.a)} layout="none">
        <Loop durationInFrames={giro} layout="none">
          <OffthreadVideo src={staticFile(`${C}/clip/${sh.file}.mp4`)} muted playbackRate={sh.vel} startFrom={F(sh.da ?? 0.2)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </Loop>
      </Sequence>
    </Punch>
  );
};

// ---------- grafiche a tutto schermo ----------
const Foglio: React.FC<{ a: number; scuro?: boolean; children: React.ReactNode }> = ({ a, scuro, children }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const m = molla(f, fps, F(a), 14, 240);
  return (
    <AbsoluteFill style={{ background: scuro ? NERO : "#fff", alignItems: "center", justifyContent: "center", fontFamily: INTER, color: scuro ? "#fff" : INK }}>
      <div style={{ transform: `scale(${0.9 + 0.1 * m})`, opacity: m, display: "flex", flexDirection: "column", alignItems: "center" }}>{children}</div>
    </AbsoluteFill>
  );
};
const Tit: React.FC<{ children: React.ReactNode; size?: number; col?: string }> = ({ children, size = 64, col }) => (
  <div style={{ fontWeight: 900, fontSize: size, letterSpacing: -2, textTransform: "uppercase", color: col, textAlign: "center", lineHeight: 1.05 }}>{children}</div>
);
const Vi: React.FC<{ children: React.ReactNode; rosso?: boolean }> = ({ children, rosso }) => (
  <span style={{ background: rosso ? ROSSO : VIOLA, color: "#fff", padding: "0 14px" }}>{children}</span>
);
const Pop: React.FC<{ a: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ a, children, style }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < F(a)) return <div style={{ ...style, opacity: 0 }}>{children}</div>;
  const m = molla(f, fps, F(a), 11, 240);
  return <div style={{ ...style, transform: `scale(${m}) rotate(${(1 - m) * -6}deg)` }}>{children}</div>;
};
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

const Titolo: React.FC<{ sh: any }> = ({ sh }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const m = molla(f, fps, F(sh.a), 10, 160);
  return (
    <AbsoluteFill style={{ background: NERO, alignItems: "center", justifyContent: "center", fontFamily: INTER }}>
      <div style={{ transform: `perspective(1200px) rotateX(${(1 - m) * 50}deg) scale(${0.6 + 0.4 * m})`, textAlign: "center", color: "#fff", fontWeight: 900, letterSpacing: -5, lineHeight: 0.95 }}>
        <div style={{ fontSize: 120 }}>LE <span style={{ background: VIOLA, padding: "0 22px" }}>7</span> TRAPPOLE</div>
        <div style={{ fontSize: 120 }}>DELLE PROP FIRM</div>
      </div>
    </AbsoluteFill>
  );
};

const Regole: React.FC<{ sh: any }> = ({ sh }) => {
  const r: [number, string, boolean][] = [[K.reg1, "Obiettivo fase 1: +10%", false], [K.reg2, "Obiettivo fase 2: +5%", false], [K.reg3, "Perdita max in un giorno: −5%", true], [K.reg4, "Perdita max totale: −10%", true], [K.reg5, "Minimo 4 giorni di trading", false]];
  return (
    <Foglio a={sh.a}>
      <Tit>LE <Vi>5 REGOLE</Vi></Tit>
      <div style={{ height: 40 }} />
      {r.map(([t, s, rosso], k) => (
        <Pop key={k} a={t} style={{ fontSize: 62, fontWeight: 800, margin: "10px 0", color: rosso ? ROSSO : INK, fontFamily: PENNA }}>{s}</Pop>
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
        <div style={{ fontSize: 30, color: "#77738a", marginBottom: 30, fontWeight: 700 }}>“</div>
        <div style={{ fontSize: 72, fontWeight: 800, color: INK, lineHeight: 1.25, letterSpacing: -1 }}>
          {sh.testo.slice(0, i)}
          <span style={{ backgroundImage: `linear-gradient(${VIOLA}, ${VIOLA})`, backgroundSize: `${ev * 100}% 100%`, backgroundRepeat: "no-repeat", color: ev > 0.5 ? "#fff" : INK, padding: "0 6px" }}>{sh.evid}</span>
          {sh.testo.slice(i + sh.evid.length)}
        </div>
        <div style={{ fontSize: 30, color: "#77738a", marginTop: 40 }}>— {sh.fonte}</div>
      </Pop>
    </AbsoluteFill>
  );
};

const ZeroSet: React.FC<{ sh: any }> = ({ sh }) => {
  const f = useCurrentFrame();
  const acceso = f >= F(K.zs + 1.4);
  return (
    <Foglio a={sh.a}>
      <Tit size={200}><Vi rosso>0,71%</Vi></Tit>
      <div style={{ fontSize: 44, fontWeight: 700, margin: "20px 0 30px" }}>dei trader finanziati è passato a un conto vero</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(28, 34px)", gap: "8px 10px" }}>
        {Array.from({ length: 140 }, (_, k) => <Omino key={k} w={34} col={k === 61 && acceso ? VIOLA : "#d6d6dc"} />)}
      </div>
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

const Pavimento: React.FC<{ sh: any }> = ({ sh }) => {
  const f = useCurrentFrame();
  // conto: 100 -> 108 -> 102.6 ; pavimento: 95 -> 102.6
  const W = 1500, H = 640, y = (v: number) => H - ((v - 93) / 17) * H;
  const t1 = F(K.pav2), t2 = F(K.pav3), t3 = F(K.pav4), t4 = F(K.pav5);
  const n = 120;
  const pts: [number, number][] = []; const pav: [number, number][] = [];
  const fine = interpolate(f, [F(sh.a), t1, t2, t3, t4], [0, 0.2, 0.55, 0.75, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  let max = 100;
  for (let k = 0; k <= n * fine; k++) {
    const x = k / n;
    const v = x < 0.55 ? 100 + 8 * Math.sin((x / 0.55) * Math.PI / 2) + Math.sin(x * 40) * 0.4 : 108 - 5.4 * ((x - 0.55) / 0.45) + Math.sin(x * 37) * 0.3;
    max = Math.max(max, v);
    pts.push([x * W, y(v)]); pav.push([x * W, y(max - 5.4)]);
  }
  const path = (p: [number, number][]) => p.map((q, k) => `${k ? "L" : "M"}${q[0].toFixed(1)},${q[1].toFixed(1)}`).join(" ");
  const chiuso = f >= t4 + F(0.6);
  return (
    <AbsoluteFill style={{ background: VIOLA, alignItems: "center", justifyContent: "center", fontFamily: INTER, color: "#fff" }}>
      <div style={{ position: "relative" }}>
        <svg width={W} height={H} style={{ overflow: "visible" }}>
          <line x1={0} x2={W} y1={y(100)} y2={y(100)} stroke="#ffffff55" strokeDasharray="12 10" strokeWidth={3} />
          <text x={W + 10} y={y(100) + 10} fill="#fff" fontSize={34} fontWeight={800}>100.000</text>
          <path d={path(pav)} stroke={ROSSO} strokeWidth={10} fill="none" />
          <path d={path(pts)} stroke="#fff" strokeWidth={10} fill="none" strokeLinejoin="round" />
          {pav.length > 1 && <text x={Math.max(10, pav[pav.length - 1][0] - 300)} y={pav[pav.length - 1][1] + 50} fill="#ffd0d4" fontSize={36} fontWeight={900}>LIMITE {fmt(1000 * (pav[pav.length - 1] ? (93 + (H - pav[pav.length - 1][1]) / H * 17) : 95))}</text>}
        </svg>
        {chiuso && <Pop a={(t4 + F(0.6)) / FPS} style={{ position: "absolute", left: 0, right: 0, top: 220, textAlign: "center" }}><span style={{ background: ROSSO, fontSize: 110, fontWeight: 900, padding: "0 30px" }}>CONTO CHIUSO</span></Pop>}
      </div>
    </AbsoluteFill>
  );
};

const Obiettivo: React.FC<{ sh: any }> = ({ sh }) => {
  const f = useCurrentFrame();
  const v = interpolate(f, [F(sh.a), F(sh.a + 1.2)], [0, 9], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const lamp = f > F(K.ob1) && Math.floor(f / 6) % 2 === 0;
  return (
    <Foglio a={sh.a} scuro>
      <Tit size={150}>+{v.toFixed(1).replace(".", ",")}%</Tit>
      <div style={{ width: 1400, height: 90, border: "8px solid #fff", marginTop: 40, position: "relative" }}>
        <div style={{ width: `${v * 10}%`, height: "100%", background: VIOLA }} />
        <div style={{ position: "absolute", right: -4, top: -40, bottom: -40, width: 10, background: lamp ? ROSSO : "#fff" }} />
      </div>
      <div style={{ fontSize: 44, fontWeight: 800, marginTop: 30, color: "#c9c6d6" }}>OBIETTIVO +10% · TI MANCA <span style={{ color: ROSSO }}>1%</span></div>
    </Foglio>
  );
};

const Fondi: React.FC<{ sh: any }> = ({ sh }) => {
  const f = useCurrentFrame();
  const p = ramp(f, F(K.fo1), F(K.fo2 + 1.5));
  const W = 1400, H = 460, n = 80;
  const a: string[] = [], b: string[] = [];
  for (let k = 0; k <= n * p; k++) {
    const x = (k / n) * W;
    const sec = k > n / 2;
    a.push(`${k ? "L" : "M"}${x},${H * 0.3 + Math.sin(k * 0.9) * (sec ? 14 : 12)}`);
    b.push(`${k ? "L" : "M"}${x},${H * 0.72 + Math.sin(k * 1.3) * (sec ? 95 : 14)}`);
  }
  return (
    <Foglio a={sh.a}>
      <Tit>334 FONDI · 1980-1991</Tit>
      <div style={{ fontSize: 34, color: "#77738a", marginBottom: 30 }}>Brown, Harlow, Starks · Journal of Finance, 1996</div>
      <svg width={W} height={H} style={{ overflow: "visible" }}>
        <line x1={W / 2} x2={W / 2} y1={0} y2={H} stroke="#0002" strokeWidth={4} strokeDasharray="10 10" />
        <text x={W / 2 + 14} y={30} fontSize={28} fill="#77738a" fontWeight={700}>METÀ ANNO</text>
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
    <Foglio a={sh.a} scuro>
      <div style={{ fontFamily: PIXEL, fontSize: 40, color: "#c9c6d6" }}>CHALLENGE · GIORNI RIMASTI</div>
      <div style={{ fontFamily: PIXEL, fontSize: 260, color: d < 27 ? ROSSO : "#fff", marginTop: 40 }}>{d}</div>
    </Foglio>
  );
};

const Numero: React.FC<{ sh: any }> = ({ sh }) => {
  const f = useCurrentFrame();
  const p = Easing.out(Easing.cubic)(ramp(f, F(sh.a + 0.2), F(sh.a + 1.6)));
  const v = sh.n0 + (sh.n1 - sh.n0) * p;
  return (
    <Foglio a={sh.a}>
      <div style={{ fontSize: 50, fontWeight: 900, color: "#77738a", letterSpacing: 2 }}>{sh.sopra}</div>
      <div style={{ fontSize: 240, fontWeight: 900, letterSpacing: -10, color: sh.scendi ? ROSSO : VIOLA, lineHeight: 1.1 }}>{sh.prima}{fmt(v)}{sh.dopo}</div>
      <div style={{ fontSize: 36, color: "#77738a", marginTop: 10 }}>{sh.sotto}</div>
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
  <Foglio a={sh.a} scuro>
    <div style={{ fontFamily: PIXEL, fontSize: 44, color: VIOLA }}>{sh.anno}</div>
    <Pop a={sh.a + 0.4} style={{ fontSize: 110, fontWeight: 900, marginTop: 30, letterSpacing: -3 }}>{sh.cosa}</Pop>
    <Pop a={sh.a + 0.9} style={{ fontSize: 46, color: "#c9c6d6", marginTop: 20 }}>{sh.chi} · «{sh.frase}»</Pop>
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
      <div style={{ fontSize: 34, color: "#77738a", marginTop: 20 }}>margine netto: oltre 55% nel 2021 → 8,9% nel 2025 · bilancio 2025, stampa ceca</div>
    </Foglio>
  );
};

const Denominatore: React.FC<{ sh: any }> = ({ sh }) => {
  const f = useCurrentFrame();
  const due = f >= F(K.den2);
  return (
    <Foglio a={sh.a}>
      <Tit>CHI PASSA? STESSI DATI, DUE CONTI</Tit>
      <div style={{ display: "flex", gap: 140, marginTop: 60 }}>
        <Pop a={K.den1} style={{ textAlign: "center" }}><div style={{ fontSize: 220, fontWeight: 900, color: ROSSO }}>17%</div><div style={{ fontSize: 44, fontWeight: 800 }}>PER TENTATIVO</div></Pop>
        {due && <Pop a={K.den2} style={{ textAlign: "center" }}><div style={{ fontSize: 220, fontWeight: 900, color: VIOLA }}>52%</div><div style={{ fontSize: 44, fontWeight: 800 }}>PER PERSONA</div></Pop>}
      </div>
      <div style={{ fontSize: 32, color: "#77738a", marginTop: 30 }}>dati 2025 pubblicati da una firm americana</div>
    </Foglio>
  );
};

const Carte: React.FC<{ sh: any }> = ({ sh }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const c = ["CODICE SCONTO", "CLASSIFICA", "★★★★★"];
  return (
    <AbsoluteFill style={{ background: NERO, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 60, fontFamily: INTER }}>
      {c.map((x, k) => {
        const m = molla(f, fps, F(sh.a + 0.5 * k), 13, 200);
        return (
          <div key={k} style={{ width: 460, height: 620, background: k === 0 ? VIOLA : "#fff", color: k === 0 ? "#fff" : INK, borderRadius: 30, display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 60, fontWeight: 900, textAlign: "center", padding: 30, transform: `perspective(1000px) rotateY(${(1 - m) * 180}deg)`, backfaceVisibility: "hidden" }}>{x}</div>
        );
      })}
    </AbsoluteFill>
  );
};

const Lavagna: React.FC<{ sh: any }> = ({ sh }) => {
  const r: [number, string][] = [[K.lav1, "spendi in media ........ 800 $"], [K.lav2, "chi viene pagato ........ 7 su 100"], [K.lav3, "pagamento medio ........ 4.000 $"], [K.lav4, "a testa ........ ≈ 280 $"]];
  return (
    <AbsoluteFill style={{ background: "#1f2a24", alignItems: "flex-start", justifyContent: "center", padding: "0 220px", fontFamily: PENNA, color: "#f4f4ee" }}>
      <div style={{ fontSize: 64, marginBottom: 40, textDecoration: "underline" }}>il conto della serva</div>
      {r.map(([t, s], k) => <Pop key={k} a={t} style={{ fontSize: 70, margin: "14px 0", color: k === 3 ? "#ffd84d" : undefined }}>{s}</Pop>)}
    </AbsoluteFill>
  );
};

const Checklist: React.FC<{ sh: any }> = ({ sh }) => {
  const r: [number, string, string][] = [[K.cl1, "Rischio piccolo e fisso (0,5%)", "T2"], [K.cl2, "Più vicino al traguardo, meno rischio", "T3"], [K.cl3, "Regole scritte prima, provate sul passato", "T1"], [K.cl4, "Leggere gli aggettivi prima di comprare", "T5"], [K.cl5, "Budget dei tentativi deciso prima", "T4"]];
  return (
    <Foglio a={sh.a}>
      <Tit>COSA FANNO <Vi>I 7</Vi></Tit><div style={{ height: 40 }} />
      {r.map(([t, s, tr], k) => (
        <Pop key={k} a={t} style={{ display: "flex", alignItems: "center", gap: 26, fontSize: 58, fontWeight: 800, margin: "12px 0", width: 1500 }}>
          <span style={{ color: VERDE, fontSize: 70 }}>✔</span><span style={{ flex: 1 }}>{s}</span>
          <span style={{ fontFamily: PIXEL, fontSize: 24, background: INK, color: "#fff", padding: "10px 14px" }}>{tr}</span>
        </Pop>
      ))}
    </Foglio>
  );
};

const AB: React.FC<{ sh: any }> = ({ sh }) => (
  <AbsoluteFill style={{ background: NERO, alignItems: "center", justifyContent: "center", fontFamily: INTER, color: "#fff" }}>
    <Tit size={70}>IL PROSSIMO VIDEO LO DECIDI TU</Tit>
    <div style={{ display: "flex", gap: 60, marginTop: 60 }}>
      {[[K.ab1, "A", "Le regole di 3 prop firm a confronto"], [K.ab2, "B", "Un mese del nostro conto, giorno per giorno"]].map(([t, l, s], k) => (
        <Pop key={k} a={t as number} style={{ width: 700, height: 420, background: k ? "#2a2635" : VIOLA, borderRadius: 30, padding: 50, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ fontFamily: PIXEL, fontSize: 110 }}>{l}</div>
          <div style={{ fontSize: 50, fontWeight: 800, marginTop: 30 }}>{s}</div>
        </Pop>
      ))}
    </div>
    <div style={{ fontFamily: PIXEL, fontSize: 28, color: "#c9c6d6", marginTop: 50 }}>SCRIVI A O B NEI COMMENTI</div>
  </AbsoluteFill>
);

const GRAF: Record<string, React.FC<{ sh: any }>> = {
  omini: Omini, titolo: Titolo, regole: Regole, citazione: Citazione, zeroset: ZeroSet, secchi: Secchi, pavimento: Pavimento, obiettivo: Obiettivo,
  fondi: Fondi, giorni: Giorni, numero: Numero, carrelli: Carrelli, studio: Studio, pagina: Pagina, crollo: Crollo, denominatore: Denominatore,
  carte: Carte, lavagna: Lavagna, checklist: Checklist, ab: AB,
};

// ---------- sovrapposizioni ----------
const fineOv = (o: any) => (o.b ?? o.a + 3);
const Botta: React.FC<{ o: any }> = ({ o }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = o.a + (o.dopo ?? 0), b = fineOv(o) - 0.05;
  if (f < F(a) || f > F(b) + 5) return null;
  const u = ramp(f, F(b), F(b) + 5);
  let k = 0;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: o.top ?? 780, textAlign: "center", opacity: 1 - u }}>
      {o.righe.map((r: string, ri: number) => (
        <div key={ri} style={{ lineHeight: 1.0, marginBottom: 10 }}>
          {r.split(" ").map((w, wi) => {
            const m = molla(f, fps, F(a) + 2 * k++, 11, 240);
            const viola = w.startsWith("*"), rosso = w.startsWith("!");
            const testo = w.replace(/^[*!]/, "");
            const lb = o.barra !== undefined ? ramp(f, F(a + o.barra), F(a + o.barra) + 4) : 0;
            return (
              <span key={wi} style={{ display: "inline-block", position: "relative", margin: "0 22px", transform: `scale(${m}) rotate(${(1 - m) * -8}deg)`, opacity: m > 0.02 ? 1 : 0,
                fontFamily: INTER, fontWeight: 900, fontSize: o.size ?? 118, letterSpacing: -3, textTransform: "uppercase",
                color: viola ? "#fff" : rosso ? ROSSO : o.scuro ? "#fff" : INK, background: viola ? VIOLA : undefined, padding: viola ? "0 18px" : undefined,
                textShadow: viola ? undefined : o.scuro ? "0 0 24px #000, 0 4px 0 #000" : "0 0 18px #fff, 0 0 4px #fff, 0 4px 0 #fff" }}>
                {testo}
                {rosso && lb > 0 && <span style={{ position: "absolute", left: -8, right: -8, top: "52%", height: 14, background: "#fff", transform: `scaleX(${lb}) rotate(-4deg)`, transformOrigin: "left" }} />}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

const OttoBit: React.FC<{ o: any }> = ({ o }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = o.a + (o.dopo ?? 0);
  if (f < F(a) || f > F(fineOv(o))) return null;
  const m = molla(f, fps, F(a), 13, 300);
  const sel = f >= F(a + 1.2) ? o.scelta : 1 - o.scelta;
  const lamp = Math.floor(f / 8) % 2 === 0;
  return (
    <div style={{ position: "absolute", left: "50%", top: 280, transform: `translateX(-50%) scale(${m})`, background: NERO, border: "8px solid #fff", boxShadow: "0 0 0 8px #000, 14px 14px 0 8px #000",
      padding: "40px 56px", fontFamily: PIXEL, fontSize: 34, color: "#fff", lineHeight: 1.6, minWidth: 900 }}>
      <div style={{ marginBottom: 28 }}>{o.titolo}</div>
      {o.voci.map((v: string, k: number) => (
        <div key={k} style={{ display: "flex", alignItems: "center", gap: 18, color: sel === k ? "#fff" : "#9a98a8" }}>
          <span style={{ width: 30, opacity: sel === k && lamp ? 1 : 0 }}>▶</span>
          <span style={{ background: sel === k ? VIOLA : "transparent", padding: "10px 16px" }}>{v}</span>
        </div>
      ))}
    </div>
  );
};

const Nome: React.FC<{ o: any }> = ({ o }) => {
  const f = useCurrentFrame();
  if (f < F(o.a) || f > F(fineOv(o)) + 8) return null;
  const e = Easing.out(Easing.cubic)(ramp(f, F(o.a), F(o.a) + 8));
  const u = ramp(f, F(fineOv(o)), F(fineOv(o)) + 6);
  return (
    <div style={{ position: "absolute", left: 0, bottom: 60, opacity: 1 - u, clipPath: `inset(0 ${(1 - e) * 100}% 0 0)` }}>
      <div style={{ background: "#0d0d10", padding: "18px 44px 18px 90px" }}>
        <div style={{ fontFamily: INTER, fontWeight: 900, fontSize: 54, color: "#fff", letterSpacing: -1 }}>C · THE TRADER</div>
        <div style={{ fontFamily: INTER, fontSize: 24, color: "#c8c8d0", marginTop: 2 }}>personaggio AI · dietro c'è Marco · @cthe.trader</div>
      </div>
    </div>
  );
};

const Ologramma: React.FC<{ o: any }> = ({ o }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a0 = o.a + 2.4; // dopo il cartello «TRAPPOLA 1/7»
  if (f < F(a0) || f > F(fineOv(o))) return null;
  const m = molla(f, fps, F(a0), 12, 200);
  const sv = ramp(f, F(a0 + 1.6), F(a0 + 2.8));
  const g = Math.floor(f / 2) % 3;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontFamily: INTER, fontWeight: 900, fontSize: 230, letterSpacing: -8, color: "#bfe6ff", opacity: m * (1 - sv), transform: `translateX(${sv > 0 ? (g - 1) * 14 * sv : 0}px) skewX(${sv * 8}deg)`,
        textShadow: `0 0 40px #4fc3ff, ${sv * 20}px 0 0 #ff4d5e88, ${-sv * 20}px 0 0 #4fc3ff88`, filter: `blur(${sv * 6}px)` }}>100.000 $</div>
      {sv > 0.7 && <Pop a={a0 + 2.6} style={{ position: "absolute", top: 640, fontFamily: INTER, fontWeight: 900, fontSize: 90, color: "#fff", textShadow: "0 0 24px #000" }}>NON <span style={{ color: ROSSO }}>ESISTONO</span></Pop>}
    </AbsoluteFill>
  );
};

const Trappola: React.FC<{ o: any }> = ({ o }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < F(o.a) || f > F(o.a + 2.6)) return null;
  const m = molla(f, fps, F(o.a), 12, 220);
  const u = ramp(f, F(o.a + 2.2), F(o.a + 2.6));
  return (
    <AbsoluteFill style={{ background: `rgba(11,10,16,${0.82 * (1 - u)})`, alignItems: "center", justifyContent: "center", opacity: 1 - u }}>
      <div style={{ fontFamily: PIXEL, fontSize: 44, color: ROSSO, transform: `scale(${m})` }}>TRAPPOLA {o.n}/7</div>
      <div style={{ fontFamily: INTER, fontWeight: 900, fontSize: 96, color: "#fff", letterSpacing: -3, marginTop: 30, textAlign: "center", maxWidth: 1600, transform: `translateY(${(1 - m) * 40}px)` }}>{o.titolo}</div>
    </AbsoluteFill>
  );
};
const Contatore: React.FC = () => {
  const t = useT();
  const tr = OVER.filter((o) => o.tipo === "trappola" && o.a + 2.6 <= t);
  if (!tr.length || t > K.cl1) return null;
  const n = tr[tr.length - 1].n;
  return (
    <div style={{ position: "absolute", right: 50, top: 44, fontFamily: PIXEL, fontSize: 22, color: "#fff", background: "#0b0a10cc", padding: "14px 18px", display: "flex", gap: 8, alignItems: "center" }}>
      TRAPPOLA {n}/7
      <span style={{ display: "flex", gap: 5, marginLeft: 10 }}>{Array.from({ length: 7 }, (_, k) => <span key={k} style={{ width: 14, height: 14, background: k < n ? ROSSO : "#ffffff44" }} />)}</span>
    </div>
  );
};

const Campanella: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"><path fill="#fff" d="M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22zm7-6V11a7 7 0 0 0-5.5-6.84V3.5a1.5 1.5 0 0 0-3 0v.66A7 7 0 0 0 5 11v5l-2 2v1h18v-1z" /></svg>
);
const Iscriviti: React.FC<{ o: any }> = ({ o }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < F(o.a) || f > F(fineOv(o)) + 8) return null;
  const m = molla(f, fps, F(o.a), 14, 200);
  const u = ramp(f, F(fineOv(o)), F(fineOv(o)) + 8);
  const c1 = F(o.a + 1.8), c2 = F(o.a + 3.2), c3 = F(o.a + 6.0);
  const iscritto = f >= c1, camp = f >= c2, like = f >= c3;
  const suona = camp ? Math.sin((f - c2) * 1.3) * 22 * Math.max(0, 1 - (f - c2) / F(1.4)) : 0;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 70, display: "flex", justifyContent: "center", opacity: m * (1 - u), transform: `translateY(${(1 - m) * 120}px)` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 26, background: "#17151fee", border: "2px solid #2a2635", borderRadius: 26, padding: "18px 30px", fontFamily: INTER }}>
        <img src={staticFile(`${C}/avatar.jpg`)} style={{ width: 90, height: 90, borderRadius: 45, border: `4px solid ${VIOLA}` }} />
        <div style={{ color: "#fff", fontSize: 36, fontWeight: 800 }}>C · The Trader</div>
        <div style={{ fontWeight: 800, fontSize: 32, padding: "16px 34px", borderRadius: 50, background: iscritto ? "#3a3646" : "#e62117", color: "#fff", transform: `scale(${f >= c1 && f < c1 + 5 ? 0.9 : 1})` }}>{iscritto ? "ISCRITTO ✓" : "ISCRIVITI"}</div>
        <div style={{ width: 76, height: 76, borderRadius: 38, display: "flex", alignItems: "center", justifyContent: "center", background: camp ? VIOLA : "#2a2635", transform: `rotate(${suona}deg)` }}><Campanella size={46} /></div>
        <div style={{ fontSize: 46, padding: "6px 18px", borderRadius: 40, background: like ? VIOLA : "#2a2635", transform: `scale(${like && f < c3 + 6 ? 1.2 : 1})` }}>👍</div>
      </div>
    </div>
  );
};

const Slot: React.FC<{ o: any }> = ({ o }) => {
  const f = useCurrentFrame();
  if (f < F(o.a) || f > F(fineOv(o))) return null;
  const s = ["🍒", "🍒", "❌"];
  return (
    <div style={{ position: "absolute", left: "50%", top: 300, transform: "translateX(-50%)", display: "flex", gap: 24, background: "#0b0a10dd", padding: 30, borderRadius: 30, border: `6px solid ${VIOLA}` }}>
      {s.map((x, k) => {
        const ferma = f >= F(o.a + 0.4 + 0.5 * k);
        const gir = ["🍒", "💰", "❌", "7️⃣"][Math.floor(f / 2 + k) % 4];
        return <div key={k} style={{ width: 200, height: 220, background: "#fff", borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 140, filter: ferma ? undefined : "blur(3px)" }}>{ferma ? x : gir}</div>;
      })}
    </div>
  );
};

const Caldo: React.FC<{ o: any }> = ({ o }) => {
  const f = useCurrentFrame();
  const t = useT();
  const sh = SHOT.find((s) => t >= s.a && t < s.b);
  if (f < F(o.a) || f > F(fineOv(o)) || !sh || sh.tipo !== "parla") return null;
  return <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, #ffb34722, #ff7a1a33)", mixBlendMode: "multiply" }} />;
};

const Notifica: React.FC<{ o: any }> = ({ o }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < F(o.a) || f > F(fineOv(o))) return null;
  const m = molla(f, fps, F(o.a), 13, 260);
  return (
    <div style={{ position: "absolute", left: "50%", top: 70, width: 1180, transform: `translate(-50%, ${(1 - m) * -260}px)`, background: "#f4f3f8f2", borderRadius: 40,
      boxShadow: "0 30px 80px #000a", padding: "30px 40px", display: "flex", alignItems: "center", gap: 34, fontFamily: INTER }}>
      <div style={{ width: 110, height: 110, borderRadius: 26, background: VIOLA, color: "#fff", fontWeight: 900, fontSize: 56, display: "flex", alignItems: "center", justifyContent: "center" }}>%</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 30, color: "#6b6878", fontWeight: 600 }}>PROP FIRM · adesso</div>
        <div style={{ fontSize: 54, color: INK, fontWeight: 900, letterSpacing: -1 }}>Riprova la tua challenge: -20%</div>
      </div>
      <div style={{ background: VIOLA, color: "#fff", fontWeight: 900, fontSize: 40, padding: "18px 30px", borderRadius: 22 }}>RIPROVA</div>
    </div>
  );
};

const Challenge: React.FC<{ o: any }> = ({ o }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tappe = [K.ch1, K.ch2, K.ch3];
  if (f < F(K.ch1) || f > F(K.ch3 + 2.5)) return null;
  const n = tappe.filter((x) => f >= F(x)).length;
  const m = molla(f, fps, F(tappe[n - 1]), 10, 320);
  return (
    <div style={{ position: "absolute", left: 90, top: 120, fontFamily: PIXEL, fontSize: 46, color: "#fff", background: ROSSO, padding: "22px 30px", transform: `scale(${0.6 + 0.4 * m}) rotate(-3deg)`, boxShadow: "10px 10px 0 #000" }}>
      CHALLENGE #{n}
    </div>
  );
};

const Avviso: React.FC<{ o: any }> = ({ o }) => {
  const f = useCurrentFrame();
  if (f < F(o.a) || f > F(fineOv(o))) return null;
  return (
    <div style={{ position: "absolute", left: 60, right: 60, bottom: 50, textAlign: "center", fontFamily: INTER, fontSize: 30, color: "#fff", background: "#0b0a10cc", padding: "16px 24px", opacity: ramp(f, F(o.a), F(o.a) + 8) }}>
      ⚠️ Non è un consiglio finanziario. Il trading comporta un alto rischio: puoi perdere tutto il capitale.
    </div>
  );
};

const CheckGratis: React.FC<{ o: any }> = ({ o }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < F(o.a) || f > F(fineOv(o))) return null;
  const m = molla(f, fps, F(o.a), 13, 240);
  const giu = Math.sin(f / 5) * 10;
  return (
    <div style={{ position: "absolute", right: 80, bottom: 90, transform: `scale(${m})`, background: VIOLA, color: "#fff", fontFamily: INTER, fontWeight: 900, fontSize: 46, padding: "22px 34px", borderRadius: 20, boxShadow: "10px 10px 0 #000" }}>
      CHECKLIST GRATIS <span style={{ display: "inline-block", transform: `translateY(${giu}px)` }}>↓</span>
      <div style={{ fontSize: 26, fontWeight: 600, marginTop: 4 }}>link in descrizione</div>
    </div>
  );
};

const OV: Record<string, React.FC<{ o: any }>> = {
  botta: Botta, ottobit: OttoBit, nome: Nome, ologramma: Ologramma, trappola: Trappola, iscriviti: Iscriviti, slot: Slot, caldo: Caldo,
  notifica: Notifica, challenge: Challenge, avviso: Avviso, checkgratis: CheckGratis,
};

const Flash: React.FC = () => {
  const f = useCurrentFrame();
  for (const o of OVER) {
    if (o.tipo !== "botta" || !o.flash) continue;
    const d = f - F(o.a + (o.dopo ?? 0));
    if (d >= 0 && d <= 8) return <AbsoluteFill style={{ background: ROSSO, opacity: 0.7 * (1 - d / 8) }} />;
  }
  return null;
};

export const P2FILM: React.FC = () => {
  const t = useT();
  const i = Math.max(0, SHOT.findIndex((s) => t >= s.a && t < s.b));
  const sh = t < SHOT[0].a ? SHOT[0] : SHOT[i];
  const G = sh.tipo === "graf" ? GRAF[sh.nome] : null;
  const fine = t >= K.fine + 1.0;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {sh.tipo === "parla" && <Parla sh={sh} />}
      {sh.tipo === "clip" && <Clip sh={sh} />}
      {G && <G sh={sh} />}
      {OVER.map((o, k) => { const O = OV[o.tipo]; return O ? <O key={k} o={o} /> : null; })}
      <Contatore />
      <Flash />
      {fine && <AbsoluteFill style={{ background: "#000" }} />}
      <Audio src={staticFile(`${C}/voce.wav`)} />
      <Audio src={staticFile(`${C}/musica.wav`)} volume={0.22} />
      {FX.map(([tt, nome, v], k) => (
        <Sequence key={k} from={Math.max(0, F(tt))} durationInFrames={F(2.2)}>
          <Audio src={staticFile(`${C}/sfx/${nome}.wav`)} volume={(v ?? 0.6) * 0.5} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
