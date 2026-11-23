// P2 film, TRAPPOLA 2/7 «IL MINUTO PEGGIORE» — v3 (22/11/2026 notte), prova dello stile unico alla Hormozi.
// Marco: «troppi stili mescolati, musichetta da AI». Regole (memoria feedback-stile-unico-hormozi):
// - C in camera la maggior parte del tempo (c/k.mp4, P-Video 1080p su Pruna), stacchi secchi con piccoli zoom alternati;
// - di fianco a C doodle a pennarello che si disegnano e schede bianche;
// - grafiche a tutto schermo SOLO bianche, Inter nero + una parola in riquadro viola (come le grafiche del film);
// - niente manichini, sfondi scuri, flash, scossoni, font pixel, musica: solo voce + pop/scribble leggeri.
// Tempi = secondi della voce v2 (t2nuova/voce/parole-v2.json). Copione: t2nuova/COPIONE-T2.md.
import React from "react";
import { AbsoluteFill, Audio, Easing, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadMarker } from "@remotion/google-fonts/PermanentMarker";
import { INTER, molla, ROSSO, VIOLA } from "./FormatC";

const { fontFamily: PENNA } = loadMarker();
const C = "p2t2";
const FPS = 30;
const F = (s: number) => Math.round(s * FPS);
const VERDE = "#16a34a";
const INK = "#15131a";
const GRIGIO = "#77738a";
const ramp = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

// ---------- pezzi comuni ----------
const Pop: React.FC<{ a: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ a, children, style }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < F(a)) return <div style={{ ...style, opacity: 0 }}>{children}</div>;
  const m = molla(f, fps, F(a), 13, 260);
  return <div style={{ ...style, transform: `${style?.transform ?? ""} scale(${0.85 + 0.15 * m})`, opacity: Math.min(1, m * 1.4) }}>{children}</div>;
};
const Vi: React.FC<{ children: React.ReactNode; col?: string }> = ({ children, col = VIOLA }) => (
  <span style={{ background: col, color: "#fff", padding: "0 14px" }}>{children}</span>
);
const Tit: React.FC<{ children: React.ReactNode; size?: number; style?: React.CSSProperties }> = ({ children, size = 72, style }) => (
  <div style={{ fontFamily: INTER, fontWeight: 900, fontSize: size, letterSpacing: -2, textTransform: "uppercase", color: INK, textAlign: "center", lineHeight: 1.05, ...style }}>{children}</div>
);
// foglio bianco a tutto schermo (stesso ingresso morbido delle grafiche del film)
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

// ---------- C in camera: stacco secco, zoom alternato (largo / stretto) come nei talking head ----------
const IDX = [2.4, 7.6, 18.0, 30.0, 32.8, 39.7, 48.2, 56.2, 63.4, 71.5, 77.8, 5.9, 26.8, 36.3, 68.6];
const Cam: React.FC<{ a: number; k: number; zoom?: number; o?: string; children?: React.ReactNode }> = ({ a, k, zoom = 1.0, o = "50% 30%", children }) => {
  const f = useCurrentFrame();
  const s = zoom * (1 + 0.012 * ramp(f, F(a), F(a + 4)));
  return (
    <AbsoluteFill style={{ background: "#fff", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${s})`, transformOrigin: o }}>
        <Sequence from={F(IDX[k])} layout="none">
          <OffthreadVideo src={staticFile(`${C}/c/${k}.mp4`)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </Sequence>
      </AbsoluteFill>
      {children}
    </AbsoluteFill>
  );
};

// ---------- doodle a pennarello che si disegnano (di fianco a C) ----------
const Tratto: React.FC<{ d: string; a: number; dur?: number; col?: string; w?: number }> = ({ d, a, dur = 0.5, col = INK, w = 7 }) => {
  const p = ramp(useCurrentFrame(), F(a), F(a + dur));
  return <path d={d} pathLength={1} fill="none" stroke={col} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={1} strokeDashoffset={1 - p} />;
};
const Scritta: React.FC<{ a: number; children: React.ReactNode; size?: number; col?: string; style?: React.CSSProperties }> = ({ a, children, size = 54, col = INK, style }) => (
  <Pop a={a} style={{ fontFamily: PENNA, fontSize: size, color: col, textAlign: "center", lineHeight: 1.05, ...style }}>{children}</Pop>
);
const Lato: React.FC<{ dx?: "sx" | "dx"; top?: number; children: React.ReactNode }> = ({ dx = "dx", top = 170, children }) => (
  // colonna laterale nello spazio bianco accanto a C (largo 470, a 30 px dal bordo)
  <div style={{ position: "absolute", top, width: 470, [dx === "dx" ? "right" : "left"]: 30, display: "flex", flexDirection: "column", alignItems: "center" } as React.CSSProperties}>{children}</div>
);
const DoodleCalo: React.FC<{ a: number }> = ({ a }) => (
  <Lato>
    <svg width={420} height={300} viewBox="0 0 420 300">
      <Tratto a={a} d="M20 20 L20 280 L400 280" w={6} />
      <Tratto a={a + 0.3} dur={0.6} col={ROSSO} d="M30 60 L120 90 L180 80 L260 190 L330 230" w={9} />
      <Tratto a={a + 0.9} dur={0.3} col={ROSSO} d="M300 200 L335 233 L292 240" w={9} />
      <Tratto a={a + 0.6} dur={0.5} col={GRIGIO} d="M20 230 L400 230" w={4} />
    </svg>
    <Scritta a={a + 0.8} size={58}>LIMITE DI PERDITA<br />AL GIORNO</Scritta>
  </Lato>
);
const DoodlePercento: React.FC<{ a: number }> = ({ a }) => (
  <Lato dx="sx" top={260}>
    <div style={{ position: "relative", width: 380, height: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Scritta a={a} size={170} col={ROSSO}>−5%</Scritta>
      <svg width={380} height={300} viewBox="0 0 380 300" style={{ position: "absolute" }}>
        <Tratto a={a + 0.2} dur={0.5} col={INK} d="M190 30 C 330 25, 370 140, 320 230 C 270 300, 90 300, 40 220 C 0 140, 60 30, 200 40" w={6} />
      </svg>
    </div>
    <Scritta a={a + 0.5} size={44} col={GRIGIO}>di solito</Scritta>
  </Lato>
);
const DoodleDomanda: React.FC<{ a: number }> = ({ a }) => (
  <Lato top={190}>
    <svg width={200} height={260} viewBox="0 0 200 260">
      <Tratto a={a} dur={0.5} d="M50 70 C 50 10, 160 10, 160 70 C 160 120, 100 120, 100 170" w={14} />
      <Tratto a={a + 0.5} dur={0.1} d="M100 220 L100 225" w={22} />
    </svg>
    <Scritta a={a + 0.3} size={60}>COME LO<br /><span style={{ color: VIOLA }}>CONTANO?</span></Scritta>
  </Lato>
);
const Definizione: React.FC<{ a: number; voce: string; testo: string }> = ({ a, voce, testo }) => {
  const f = useCurrentFrame();
  const e = Easing.out(Easing.cubic)(ramp(f, F(a), F(a + 0.4)));
  return (
    <div style={{ position: "absolute", left: 70, bottom: 70, width: 760, background: "#fff", border: "2px solid #e4e2ea", boxShadow: "0 12px 40px #0002",
      padding: "22px 30px", fontFamily: INTER, opacity: e, transform: `translateY(${(1 - e) * 30}px)` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 22, fontWeight: 800, color: GRIGIO, letterSpacing: 2 }}>
        <span style={{ width: 14, height: 14, background: VIOLA, display: "inline-block" }} />DEFINIZIONE
      </div>
      <div style={{ fontSize: 40, fontWeight: 900, color: INK, marginTop: 6 }}>{voce}</div>
      <div style={{ fontSize: 28, color: "#3b3846", marginTop: 6, lineHeight: 1.35 }}>{testo}</div>
    </div>
  );
};
const DoodleGuadagno: React.FC<{ a: number }> = ({ a }) => (
  <Lato top={200}>
    <svg width={420} height={260} viewBox="0 0 420 260">
      <Tratto a={a} d="M20 20 L20 240 L400 240" w={6} />
      <Tratto a={a + 0.3} dur={0.7} col={VERDE} d="M30 120 L90 150 L130 225 L170 150 L250 110 L330 70 L390 40" w={9} />
      <Tratto a={a + 1.0} dur={0.25} col={VERDE} d="M352 36 L392 38 L382 76" w={9} />
    </svg>
    <Scritta a={a + 0.9} size={60} col={VERDE}>IN GUADAGNO</Scritta>
  </Lato>
);
const DoodleCerchio: React.FC<{ a: number; testo: string; col?: string; sotto?: string }> = ({ a, testo, col = ROSSO, sotto }) => (
  <Lato top={230}>
    <div style={{ position: "relative", width: 440, height: 280, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Scritta a={a} size={testo.length > 4 ? 96 : 120} col={col}>{testo}</Scritta>
      <svg width={440} height={280} viewBox="0 0 460 300" style={{ position: "absolute" }}>
        <Tratto a={a + 0.15} dur={0.45} col={col} d="M230 25 C 420 20, 450 150, 390 235 C 320 300, 110 295, 50 220 C 0 140, 70 25, 245 35" w={7} />
      </svg>
    </div>
    {sotto && <Scritta a={a + 0.4} size={46} col={INK}>{sotto}</Scritta>}
  </Lato>
);
const Mail: React.FC<{ a: number }> = ({ a }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const m = molla(f, fps, F(a), 14, 220);
  return (
    <div style={{ position: "absolute", right: 60, top: 200, width: 540, background: "#fff", borderRadius: 22, boxShadow: "0 20px 60px #0003", border: "2px solid #ecebf0",
      padding: "26px 30px", fontFamily: INTER, transform: `translateX(${(1 - m) * 620}px)` }}>
      <div style={{ fontSize: 22, fontWeight: 700, color: GRIGIO }}>📩 PROP FIRM · 14:31</div>
      <div style={{ fontSize: 36, fontWeight: 900, color: INK, marginTop: 10 }}>Challenge non superata</div>
      <div style={{ fontSize: 26, color: "#3b3846", marginTop: 8, lineHeight: 1.35 }}>Hai violato il limite di perdita giornaliero. Il conto è stato chiuso.</div>
    </div>
  );
};
const DoodleDorme: React.FC<{ a: number }> = ({ a }) => (
  <Lato top={210}>
    <svg width={460} height={260} viewBox="0 0 460 260">
      <Tratto a={a} dur={0.4} d="M20 200 L440 200 M40 200 L40 240 M420 200 L420 240 M20 200 L20 120" w={7} />
      <Tratto a={a + 0.3} dur={0.3} d="M90 170 m -28 0 a 28 28 0 1 0 56 0 a 28 28 0 1 0 -56 0" w={7} />
      <Tratto a={a + 0.5} dur={0.4} d="M125 185 C 200 160, 330 160, 410 185" w={7} />
      <Tratto a={a + 0.8} dur={0.2} col={VIOLA} d="M250 40 L290 40 L250 80 L290 80" w={6} />
      <Tratto a={a + 1.0} dur={0.2} col={VIOLA} d="M310 10 L340 10 L310 40 L340 40" w={5} />
    </svg>
    <Scritta a={a + 0.6} size={60}>SEI ANDATO<br />A <span style={{ color: VIOLA }}>DORMIRE</span></Scritta>
  </Lato>
);
const DoodleBarrato: React.FC<{ a: number }> = ({ a }) => (
  <Lato dx="sx" top={300}>
    <div style={{ position: "relative" }}>
      <Scritta a={a} size={66}>QUANTO<br />CHIUDI</Scritta>
      <svg width={420} height={180} viewBox="0 0 420 180" style={{ position: "absolute", left: -40, top: 0 }}>
        <Tratto a={a + 0.4} dur={0.3} col={ROSSO} d="M20 160 L400 20" w={10} />
      </svg>
    </div>
  </Lato>
);
const DoodleOra: React.FC<{ a: number }> = ({ a }) => (
  <Lato top={190}>
    <svg width={260} height={260} viewBox="0 0 260 260">
      <Tratto a={a} dur={0.5} d="M130 20 C 210 20, 240 80, 240 130 C 240 200, 190 240, 130 240 C 60 240, 20 190, 20 130 C 20 70, 60 20, 135 22" w={8} />
      <Tratto a={a + 0.5} dur={0.3} col={VIOLA} d="M130 130 L130 60 M130 130 L180 150" w={10} />
    </svg>
    <Scritta a={a + 0.4} size={56}>LA <span style={{ color: VIOLA }}>LORO</span><br />GIORNATA</Scritta>
  </Lato>
);

// ---------- grafiche bianche a tutto schermo ----------
const Titolo: React.FC = () => (
  <Foglio a={0}>
    <Pop a={0} style={{ fontFamily: INTER, fontWeight: 800, fontSize: 40, color: VIOLA, letterSpacing: 6 }}>TRAPPOLA 2 DI 7</Pop>
    <Pop a={1.2} style={{ marginTop: 26 }}><Tit size={130}>IL MINUTO <Vi>PEGGIORE</Vi></Tit></Pop>
  </Foglio>
);
const Conta: React.FC<{ a: number }> = ({ a }) => {
  const f = useCurrentFrame();
  const barra = ramp(f, F(a + 1.4), F(a + 1.7));
  return (
    <Foglio a={a}>
      <Tit size={60} style={{ marginBottom: 60 }}>COSA CONTA PER IL LIMITE</Tit>
      <div style={{ display: "flex", gap: 70 }}>
        <Pop a={a} style={{ width: 620, padding: "50px 40px", border: `6px solid ${INK}`, position: "relative", opacity: 1 - 0.45 * barra }}>
          <Tit size={60}>Le operazioni<br />che chiudi</Tit>
          <div style={{ position: "absolute", left: 20, right: 20, top: "50%", height: 14, background: ROSSO, transform: `scaleX(${barra}) rotate(-6deg)`, transformOrigin: "left" }} />
        </Pop>
        <Pop a={a + 2.3} style={{ width: 620, padding: "50px 40px", background: VIOLA }}>
          <Tit size={60} style={{ color: "#fff" }}>Il momento<br />peggiore</Tit>
          <Pop a={a + 3.9} style={{ fontSize: 36, fontWeight: 800, color: "#fff", textAlign: "center", marginTop: 16 }}>della giornata</Pop>
        </Pop>
      </div>
    </Foglio>
  );
};
// grafico in stile editoriale: piatto, crollo fino a −5% su «scende di colpo», poi risale
const Grafico: React.FC<{ a: number }> = ({ a }) => {
  const f = useCurrentFrame();
  const t = f / FPS - a;
  const pts: [number, number][] = [[0, 0.5], [0.8, 0.3], [1.6, 0.6], [2.4, 0.2], [2.6, -1.0], [3.0, -5.0], [3.3, -3.2], [3.9, -1.2], [4.4, 0.3], [5.0, 1.4]];
  const W = 1300, H = 520, y = (v: number) => 40 + (2 - v) * (H - 80) / 7.4, tx = (s: number) => (s / 5.0) * W;
  const vis = pts.filter(([s]) => s <= t);
  if (vis.length && vis[vis.length - 1][0] < t && vis.length < pts.length) {
    const nx = pts[vis.length]; const [s0, v0] = vis[vis.length - 1]; const k = Math.min(1, (t - s0) / (nx[0] - s0));
    vis.push([s0 + (nx[0] - s0) * k, v0 + (nx[1] - v0) * k]);
  }
  const d = vis.map(([s, v], i) => `${i ? "L" : "M"}${tx(s)},${y(v)}`).join(" ");
  const tocco = t >= 3.0;
  const ult = vis[vis.length - 1]?.[1] ?? 0;
  return (
    <AbsoluteFill style={{ background: "#fff", fontFamily: INTER, color: INK, padding: "90px 150px" }}>
      <Tit size={64} style={{ textAlign: "left" }}>Ore 14:30, esce <Vi>un dato</Vi></Tit>
      <div style={{ position: "relative", marginTop: 40 }}>
        <svg width={W + 220} height={H} style={{ overflow: "visible" }}>
          <line x1={0} x2={W} y1={y(0)} y2={y(0)} stroke="#c9c6d6" strokeWidth={3} />
          <line x1={0} x2={W} y1={y(-5)} y2={y(-5)} stroke={ROSSO} strokeWidth={4} strokeDasharray="14 10" />
          <text x={W + 20} y={y(-5) + 12} fill={ROSSO} fontSize={34} fontWeight={800}>−5% limite</text>
          <text x={W + 20} y={y(0) + 12} fill={GRIGIO} fontSize={30} fontWeight={700}>apertura</text>
          <path d={d} fill="none" stroke={VIOLA} strokeWidth={8} strokeLinejoin="round" strokeLinecap="round" />
          {tocco && <circle cx={tx(3.0)} cy={y(-5)} r={26} fill="none" stroke={ROSSO} strokeWidth={6} />}
          {vis.length > 0 && <circle cx={tx(vis[vis.length - 1][0])} cy={y(ult)} r={11} fill={VIOLA} />}
        </svg>
        {tocco && <Pop a={a + 3.0} style={{ position: "absolute", left: tx(3.0) - 120, top: y(-5) + 40, fontSize: 32, fontWeight: 800, color: ROSSO }}>tocca il limite</Pop>}
      </div>
      <div style={{ position: "absolute", right: 150, top: 110, fontSize: 70, fontWeight: 900, color: ult >= 0 ? VERDE : ROSSO }}>{ult >= 0 ? "+" : "−"}{Math.abs(ult).toFixed(1).replace(".", ",")}%</div>
    </AbsoluteFill>
  );
};
const Chiuso: React.FC<{ a: number; children?: React.ReactNode }> = ({ a, children }) => (
  <Foglio a={a}>
    {children}
    <Pop a={a + 0.1} style={{ marginTop: children ? 40 : 0, transform: "rotate(-3deg)" }}>
      <span style={{ background: ROSSO, color: "#fff", fontFamily: INTER, fontWeight: 900, fontSize: children ? 96 : 140, padding: "6px 40px", letterSpacing: -3 }}>CONTO CHIUSO</span>
    </Pop>
  </Foglio>
);
const Citazione: React.FC<{ a: number }> = ({ a }) => {
  const f = useCurrentFrame();
  const ev = ramp(f, F(a + 1.4), F(a + 2.2));
  return (
    <AbsoluteFill style={{ background: "#e9e7ef", alignItems: "center", justifyContent: "center", fontFamily: INTER }}>
      <Pop a={a} style={{ background: "#fff", width: 1400, padding: "70px 90px", boxShadow: "0 30px 80px #0003", borderRadius: 12 }}>
        <div style={{ fontSize: 28, color: GRIGIO, fontWeight: 800, letterSpacing: 2 }}>REGOLAMENTO · MAXIMUM DAILY LOSS</div>
        <div style={{ fontSize: 60, fontWeight: 800, color: INK, lineHeight: 1.3, letterSpacing: -1, marginTop: 26 }}>
          «In qualsiasi momento della giornata, le posizioni chiuse{" "}
          <span style={{ backgroundImage: `linear-gradient(${VIOLA}, ${VIOLA})`, backgroundSize: `${ev * 100}% 100%`, backgroundRepeat: "no-repeat", color: ev > 0.5 ? "#fff" : INK, padding: "0 6px" }}>più quelle ancora aperte</span>{" "}
          non devono toccare il limite.»
        </div>
        <div style={{ fontSize: 28, color: GRIGIO, marginTop: 34 }}>— una delle prop firm più grandi d'Europa</div>
      </Pop>
    </AbsoluteFill>
  );
};
const Riga: React.FC<{ a: number; etich: string; val: string; col: string; barrata?: number; forte?: boolean }> = ({ a, etich, val, col, barrata, forte }) => {
  const f = useCurrentFrame();
  const b = barrata !== undefined ? ramp(f, F(barrata), F(barrata) + 6) : 0;
  return (
    <Pop a={a} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", width: 1300, padding: "20px 0", borderBottom: `3px solid ${forte ? INK : "#e4e2ea"}`, position: "relative", opacity: 1 - 0.55 * b }}>
      <span style={{ fontSize: 50, fontWeight: forte ? 900 : 700, color: INK }}>{etich}</span>
      <span style={{ fontSize: 70, fontWeight: 900, color: col }}>{val}</span>
      {b > 0 && <div style={{ position: "absolute", left: -10, right: -10, top: "50%", height: 10, background: ROSSO, transform: `scaleX(${b})`, transformOrigin: "left" }} />}
    </Pop>
  );
};
const Conti: React.FC<{ a: number; tutte?: boolean }> = ({ a, tutte }) => (
  <Foglio a={a}>
    <Tit size={54} style={{ marginBottom: 30 }}>CONTO DA <Vi>100.000 $</Vi> · OGGI</Tit>
    <Riga a={tutte ? a : a + 0.9} etich="Operazioni chiuse" val="+4.000 $" col={VERDE} />
    {tutte && <Riga a={a} etich="Posizione ancora aperta" val="−13.000 $" col={ROSSO} />}
    {tutte && <Riga a={a + 0.5} etich="Il conto adesso" val="−9.000 $" col={INK} forte />}
    {tutte && <Riga a={a + 2.2} etich="Limite del giorno (−10%)" val="−10.000 $" col={ROSSO} />}
  </Foglio>
);
const Orologio: React.FC<{ a: number }> = ({ a }) => {
  const t = useCurrentFrame() / FPS;
  const scatta = t >= a + 0.7;
  return (
    <Foglio a={a}>
      <div style={{ fontFamily: INTER, fontWeight: 900, fontSize: 260, letterSpacing: -10, color: scatta ? ROSSO : INK, fontVariantNumeric: "tabular-nums" }}>{scatta ? "00:00" : "23:59"}</div>
      <Pop a={a + 2.8}><Tit size={64}>L'ora del <Vi>loro</Vi> server</Tit></Pop>
      <Pop a={a + 3.4} style={{ fontSize: 40, fontWeight: 700, color: GRIGIO, marginTop: 20 }}>non la tua</Pop>
    </Foglio>
  );
};
const Ieri: React.FC<{ a: number; barra: number }> = ({ a, barra }) => (
  <>
    <Tit size={54} style={{ marginBottom: 30 }}>DOPO LA <Vi>MEZZANOTTE</Vi></Tit>
    <Riga a={a} etich="Guadagno di ieri" val="+4.000 $" col={VERDE} barrata={barra} />
    <Riga a={a} etich="Posizione ancora aperta" val="−13.000 $" col={ROSSO} />
    <Riga a={a} etich="Limite del giorno" val="−10.000 $" col={ROSSO} />
  </>
);
const Checklist: React.FC<{ a: number; fine?: boolean }> = ({ a, fine }) => {
  const voce = (k: number, at: number, ok: boolean, testo: React.ReactNode) => (
    <Pop key={k} a={at} style={{ display: "flex", alignItems: "center", gap: 28, width: 1450, margin: "14px 0" }}>
      <span style={{ fontSize: 70, fontWeight: 900, color: ok ? VERDE : ROSSO, width: 80 }}>{ok ? "✔" : "✘"}</span>
      <span style={{ fontSize: 58, fontWeight: 800, color: INK }}>{testo}</span>
    </Pop>
  );
  return (
    <Foglio a={a}>
      <Tit size={64} style={{ marginBottom: 40 }}>COSA <Vi>GUARDARE</Vi></Tit>
      {voce(0, fine ? a : a + 0.1, false, "Quanto chiudi")}
      {voce(1, fine ? a : a + 0.9, true, <>Il punto <Vi>più basso</Vi>, anche per 1 secondo</>)}
      {fine && voce(2, a, true, <>A che ora finisce la <Vi>loro</Vi> giornata</>)}
      {fine && voce(3, a + 1.4, true, "Se non lo sai: la sera niente aperto")}
    </Foglio>
  );
};

// ---------- contatore discreto in alto a destra ----------
const Contatore: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  if (t < 2.8) return null;
  return (
    <div style={{ position: "absolute", right: 50, top: 40, fontFamily: INTER, fontWeight: 800, fontSize: 24, color: INK, background: "#ffffffe6", padding: "10px 16px", display: "flex", gap: 12, alignItems: "center", border: "2px solid #ecebf0" }}>
      TRAPPOLA 2/7
      <span style={{ display: "flex", gap: 5 }}>{Array.from({ length: 7 }, (_, k) => <span key={k} style={{ width: 12, height: 12, borderRadius: 6, background: k < 2 ? VIOLA : "#d9d7e0" }} />)}</span>
    </div>
  );
};

// scene: [inizio, componente] · Z = inquadratura stretta (jump cut)
const Z = 1.14;
const SCENE: [number, React.ReactNode][] = [
  [0, <Titolo />],
  [2.8, <Cam a={2.8} k={0}><DoodleCalo a={4.4} /></Cam>],
  [6.3, <Cam a={6.3} k={11} zoom={Z}><DoodlePercento a={6.9} /></Cam>],
  [8.0, <Cam a={8.0} k={1}><DoodleDomanda a={11.7} /></Cam>],
  [13.2, <Conta a={13.2} />],
  [18.4, <Cam a={18.4} k={2}><Definizione a={18.8} voce="Perdita aperta" testo="Il rosso di un'operazione non ancora chiusa. Per il limite del giorno conta come se l'avessi già persa." /></Cam>],
  [22.2, <Grafico a={22.2} />],
  [27.2, <Cam a={27.2} k={12}><DoodleGuadagno a={28.6} /></Cam>],
  [30.4, <Cam a={30.4} k={3} />],
  [33.2, <Cam a={33.2} k={4}><DoodleCerchio a={33.3} testo="−5%" sotto="per 1 secondo" /></Cam>],
  [35.5, <Chiuso a={35.5} />],
  [36.7, <Cam a={36.7} k={13}><Mail a={36.9} /></Cam>],
  [40.1, <Cam a={40.1} k={5} />],
  [41.3, <Citazione a={41.3} />],
  [46.0, <Conti a={46.0} />],
  [48.6, <Cam a={48.6} k={6}><DoodleCerchio a={51.3} testo="−13.000" sotto="ancora aperti" /></Cam>],
  [52.8, <Conti a={52.8} tutte />],
  [56.6, <Cam a={56.6} k={7}><DoodleCerchio a={56.7} testo="✓" col={VERDE} sotto="sei dentro" /></Cam>],
  [57.5, <Orologio a={57.5} />],
  [61.7, <Foglio a={61.7}><Ieri a={61.7} barra={62.6} /></Foglio>],
  [63.8, <Cam a={63.8} k={8} />],
  [67.1, <Chiuso a={67.1}><Ieri a={67.1} barra={66} /></Chiuso>],
  [69.0, <Cam a={69.0} k={14}><DoodleDorme a={70.4} /></Cam>],
  [71.9, <Cam a={71.9} k={9}><DoodleBarrato a={72.4} /></Cam>],
  [73.7, <Checklist a={73.7} />],
  [78.2, <Cam a={78.2} k={10}><DoodleOra a={79.1} /></Cam>],
  [81.1, <Checklist a={81.1} fine />],
];
// suoni leggeri: scribble sui doodle, pop su schede e righe
const FX: [number, string, number][] = [
  [4.4, "scribble", 0.35], [6.9, "scribble", 0.35], [11.7, "scribble", 0.35], [28.6, "scribble", 0.35], [33.3, "scribble", 0.35], [51.3, "scribble", 0.35],
  [56.7, "scribble", 0.3], [70.4, "scribble", 0.35], [72.4, "scribble", 0.35], [79.1, "scribble", 0.35],
  [1.2, "pop", 0.4], [15.5, "pop", 0.35], [18.8, "pop", 0.3], [25.2, "pop", 0.4], [35.6, "pop", 0.5], [36.9, "swish", 0.3], [41.3, "pop", 0.3],
  [46.9, "pop", 0.3], [53.3, "pop", 0.3], [55.0, "pop", 0.3], [58.2, "tick", 0.5], [67.2, "pop", 0.5], [74.6, "pop", 0.3], [82.5, "pop", 0.3],
];
export const DURATA_P2T2 = F(85.4);

export const P2T2: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  let k = 0;
  for (let i = 0; i < SCENE.length; i++) if (t >= SCENE[i][0]) k = i;
  return (
    <AbsoluteFill style={{ background: "#fff" }}>
      <AbsoluteFill key={k}>{SCENE[k][1]}</AbsoluteFill>
      <Contatore />
      <Audio src={staticFile(`${C}/voce.wav`)} />
      {FX.map(([tt, nome, v], i) => (
        <Sequence key={i} from={Math.max(0, F(tt))} durationInFrames={F(2.2)}>
          <Audio src={staticFile(`${C}/sfx/${nome}.wav`)} volume={v * 0.5} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
