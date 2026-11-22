// P2 film, nuova TRAPPOLA 2/7 «IL MINUTO PEGGIORE» (22/11/2026). Pezzo da innestare nel film al posto di 147,527–227,461 s.
// Copione: youtube/P2-prop-firm/film/t2nuova/COPIONE-T2.md. Voce ElevenLabs Julian v4 (t2.wav), clip Dreamina d1-d4 (manichino), grafiche qui sotto.
// Tempi = secondi dalla prima parola della voce (parole.json della voce t2).
import React from "react";
import { AbsoluteFill, Audio, Easing, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadPixel } from "@remotion/google-fonts/PressStart2P";
import { INTER, molla, NERO, ROSSO, VIOLA } from "./FormatC";

const { fontFamily: PIXEL } = loadPixel();
const C = "p2t2";
const FPS = 30;
const F = (s: number) => Math.round(s * FPS);
export const DURATA_P2T2 = F(93.5);
const VERDE = "#22c55e";
const INK = "#15131a";
const ramp = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const fmt = (n: number) => Math.round(n).toLocaleString("it-IT");

// ---------- pezzi comuni ----------
const Punch: React.FC<{ a: number; base?: number; fino?: number; children: React.ReactNode }> = ({ a, base = 1, fino = 0.08, children }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const m = molla(f, fps, F(a), 14, 260);
  const s = base * (1 + 0.06 * (1 - m)) + fino * ramp(f, F(a), F(a) + F(8));
  const blur = interpolate(f - F(a), [0, 2], [3, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${s})`, filter: blur > 0.2 ? `blur(${blur}px)` : undefined }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};
const Clip: React.FC<{ a: number; file: string; da?: number }> = ({ a, file, da = 0.2 }) => (
  // scala 1.06: taglia il marchio «AI» di Dreamina nell'angolo
  <Punch a={a} base={1.06}>
    <Sequence from={F(a)} layout="none">
      <OffthreadVideo src={staticFile(`${C}/${file}.mp4`)} muted startFrom={F(da)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </Sequence>
  </Punch>
);
const Pop: React.FC<{ a: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ a, children, style }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < F(a)) return <div style={{ ...style, opacity: 0 }}>{children}</div>;
  const m = molla(f, fps, F(a), 11, 240);
  return <div style={{ ...style, transform: `scale(${m}) rotate(${(1 - m) * -6}deg)` }}>{children}</div>;
};
const Fondo: React.FC<{ scuro?: boolean; children: React.ReactNode }> = ({ scuro, children }) => (
  <AbsoluteFill style={{ background: scuro ? NERO : "#f4f3f8", fontFamily: INTER, color: scuro ? "#fff" : INK, alignItems: "center", justifyContent: "center" }}>{children}</AbsoluteFill>
);
const Grosso: React.FC<{ children: React.ReactNode; size?: number; col?: string; style?: React.CSSProperties }> = ({ children, size = 96, col, style }) => (
  <div style={{ fontWeight: 900, fontSize: size, letterSpacing: -3, textTransform: "uppercase", color: col, textAlign: "center", lineHeight: 1.02, ...style }}>{children}</div>
);
const Timbro: React.FC<{ a: number; testo: string; col?: string; top?: number }> = ({ a, testo, col = ROSSO, top = 380 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < F(a)) return null;
  const m = molla(f, fps, F(a), 9, 320);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top, display: "flex", justifyContent: "center" }}>
      <div style={{ fontFamily: INTER, fontWeight: 900, fontSize: 150, letterSpacing: -4, color: col, border: `14px solid ${col}`, padding: "6px 40px", borderRadius: 18,
        transform: `scale(${2.2 - 1.2 * m}) rotate(-7deg)`, opacity: Math.min(1, m * 1.5), background: "#0b0a10cc" }}>{testo}</div>
    </div>
  );
};

// ---------- 1. titolo ----------
const Titolo: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const m = molla(f, fps, 0, 12, 220);
  const m2 = molla(f, fps, F(1.26), 12, 220);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ filter: "brightness(0.35) blur(4px)" }}>
        <OffthreadVideo src={staticFile(`${C}/d3.mp4`)} muted startFrom={F(5)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: PIXEL, fontSize: 44, color: ROSSO, transform: `scale(${m})` }}>TRAPPOLA 2/7</div>
        <div style={{ fontFamily: INTER, fontWeight: 900, fontSize: 112, color: "#fff", letterSpacing: -3, marginTop: 34, opacity: m2, transform: `translateY(${(1 - m2) * 40}px)` }}>IL MINUTO PEGGIORE</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- 2. il limite giornaliero ----------
const Limite: React.FC<{ a: number }> = ({ a }) => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const p = ramp(f, F(a + 0.3), F(a + 3.2));
  const scende = Easing.out(Easing.cubic)(p);
  return (
    <Fondo>
      <Grosso size={58} style={{ marginBottom: 30 }}>Limite di perdita <span style={{ background: VIOLA, color: "#fff", padding: "0 14px" }}>al giorno</span></Grosso>
      <div style={{ position: "relative", width: 1300, height: 560 }}>
        <div style={{ position: "absolute", left: 0, top: 40, fontWeight: 800, fontSize: 40 }}>CONTO 100.000 $</div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 110, height: 8, background: INK }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 470, height: 10, background: ROSSO, opacity: p }} />
        <div style={{ position: "absolute", right: 0, top: 490, fontWeight: 900, fontSize: 44, color: ROSSO, opacity: p }}>−5% = 95.000 $</div>
        <div style={{ position: "absolute", left: 560, top: 114, width: 180, height: 356 * scende, background: `linear-gradient(${ROSSO}33, ${ROSSO}aa)`, borderRadius: "0 0 12px 12px" }} />
        <div style={{ position: "absolute", left: 760, top: 100 + 340 * scende, fontWeight: 900, fontSize: 40, color: ROSSO }}>{p > 0.02 ? `−${fmt(5000 * scende)} $` : ""}</div>
      </div>
      {t >= a + 8.0 && <Pop a={a + 8.0} style={{ position: "absolute", bottom: 70 }}><Grosso size={84}>Ma come lo <span style={{ background: ROSSO, color: "#fff", padding: "0 16px" }}>contano?</span></Grosso></Pop>}
    </Fondo>
  );
};

// ---------- 3. chiuse vs momento peggiore ----------
const Conta: React.FC<{ a: number }> = ({ a }) => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const barra = ramp(f, F(a + 0.9), F(a + 1.3));
  return (
    <Fondo scuro>
      <div style={{ display: "flex", gap: 80 }}>
        <Pop a={a} style={{ width: 620, padding: 40, borderRadius: 24, background: "#1c1a26", position: "relative" }}>
          <Grosso size={54}>Le operazioni<br />che chiudi</Grosso>
          <div style={{ position: "absolute", left: 30, right: 30, top: "50%", height: 14, background: ROSSO, transform: `scaleX(${barra}) rotate(-6deg)`, transformOrigin: "left" }} />
        </Pop>
        <Pop a={a + 2.5} style={{ width: 620, padding: 40, borderRadius: 24, background: VIOLA }}>
          <Grosso size={54}>Il momento<br />peggiore</Grosso>
          <div style={{ fontSize: 34, fontWeight: 700, textAlign: "center", marginTop: 18, opacity: t >= a + 5.6 ? 1 : 0 }}>anche le perdite ancora aperte</div>
        </Pop>
      </div>
      {t >= a + 8.4 && <Pop a={a + 8.4} style={{ position: "absolute", bottom: 90 }}><Grosso size={150} col={ROSSO}>1 secondo</Grosso></Pop>}
    </Fondo>
  );
};

// ---------- 4. la candela che tocca −5% e torna su ----------
const Candela: React.FC<{ a: number }> = ({ a }) => {
  const f = useCurrentFrame();
  const t = f / FPS - a;
  // percorso del conto: 0 → -1,5 → giù a -5 (a 3,3 s) → risale a +1,2
  const pts: [number, number][] = [[0, 0.4], [1.5, -0.6], [2.6, -1.8], [3.25, -5.02], [3.5, -2.4], [5.0, -0.3], [6.4, 0.6], [8.0, 1.2], [9.5, 1.4]];
  const W = 1500, H = 640, x0 = 210, y = (v: number) => 120 + (1.6 - v) * (H - 160) / 7.0;
  const tx = (s: number) => x0 + (s / 9.5) * (W - 140);
  const vis = pts.filter(([s]) => s <= t);
  if (vis.length && vis[vis.length - 1][0] < t) {
    const i = vis.length; const nx = pts[Math.min(i, pts.length - 1)];
    const [s0, v0] = vis[vis.length - 1]; const k = Math.min(1, (t - s0) / Math.max(0.01, nx[0] - s0));
    vis.push([s0 + (nx[0] - s0) * k, v0 + (nx[1] - v0) * k]);
  }
  const d = vis.map(([s, v], i) => `${i ? "L" : "M"}${tx(s)},${y(v)}`).join(" ");
  const tocco = t >= 3.25;
  const flash = tocco && t < 3.6;
  const ult = vis[vis.length - 1]?.[1] ?? 0;
  const col = ult >= 0 ? VERDE : ROSSO;
  return (
    <Fondo scuro>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <line x1={x0} x2={W + 100} y1={y(0)} y2={y(0)} stroke="#ffffff33" strokeWidth={3} strokeDasharray="10 10" />
        <line x1={x0} x2={W + 100} y1={y(-5)} y2={y(-5)} stroke={ROSSO} strokeWidth={6} />
        <text x={x0 - 20} y={y(-5) + 14} fill={ROSSO} fontSize={40} fontWeight={900} textAnchor="end" fontFamily={INTER}>−5%</text>
        <text x={x0 - 20} y={y(0) + 14} fill="#ffffff88" fontSize={34} fontWeight={700} textAnchor="end" fontFamily={INTER}>0</text>
        <path d={d} fill="none" stroke={col} strokeWidth={9} strokeLinejoin="round" strokeLinecap="round" />
        {tocco && <circle cx={tx(3.25)} cy={y(-5.02)} r={flash ? 40 : 22} fill="none" stroke={ROSSO} strokeWidth={6} />}
      </svg>
      <div style={{ position: "absolute", left: x0, top: 60, fontWeight: 800, fontSize: 40, color: "#fff" }}>ORE 14:30 · ESCE UN DATO</div>
      <div style={{ position: "absolute", right: 120, top: 150, fontWeight: 900, fontSize: 80, color: col }}>{ult >= 0 ? "+" : "−"}{Math.abs(ult).toFixed(1).replace(".", ",")}%</div>
      {flash && <AbsoluteFill style={{ background: ROSSO, opacity: 0.45 * (1 - (t - 3.25) / 0.35) }} />}
      {t >= 7.2 && <Pop a={a + 7.2} style={{ position: "absolute", left: 0, right: 0, bottom: 70 }}><Grosso size={70}>Il trade chiude <span style={{ color: VERDE }}>in guadagno</span>…</Grosso></Pop>}
      <Timbro a={a + 9.04} testo="CONTO CHIUSO" top={330} />
    </Fondo>
  );
};

// ---------- 5. il regolamento: +4.000 chiusi, −13.000 aperti ----------
const Riga: React.FC<{ a: number; etich: string; val: string; col: string; barrata?: number }> = ({ a, etich, val, col, barrata }) => {
  const f = useCurrentFrame();
  const b = barrata !== undefined ? ramp(f, F(barrata), F(barrata) + 6) : 0;
  return (
    <Pop a={a} style={{ display: "flex", justifyContent: "space-between", width: 1240, padding: "18px 0", borderBottom: "3px solid #ffffff22", position: "relative", opacity: 1 - 0.55 * b }}>
      <span style={{ fontSize: 50, fontWeight: 700 }}>{etich}</span>
      <span style={{ fontSize: 64, fontWeight: 900, color: col }}>{val}</span>
      {b > 0 && <div style={{ position: "absolute", left: -10, right: -10, top: "50%", height: 12, background: ROSSO, transform: `scaleX(${b})`, transformOrigin: "left" }} />}
    </Pop>
  );
};
const Regolamento: React.FC<{ a: number }> = ({ a }) => {
  const f = useCurrentFrame();
  const t = f / FPS;
  return (
    <Fondo scuro>
      <Pop a={a} style={{ position: "absolute", top: 130, fontFamily: INTER, fontSize: 34, fontWeight: 700, color: "#c9c6d6", letterSpacing: 2 }}>DAL REGOLAMENTO DI UNA DELLE FIRM PIÙ GRANDI D'EUROPA · CONTO 100K</Pop>
      {t >= a + 1.4 && t < a + 6.4 && <Pop a={a + 1.4} style={{ position: "absolute", top: 300, width: 900, padding: "50px 60px", background: "#fff", color: INK, borderRadius: 18, transform: "rotate(-2deg)", boxShadow: "0 30px 80px #0008" }}>
        <div style={{ fontSize: 30, fontWeight: 800, color: "#8a8798", letterSpacing: 2 }}>REGOLAMENTO · MAXIMUM DAILY LOSS</div>
        <div style={{ fontSize: 38, fontWeight: 600, marginTop: 20, lineHeight: 1.35 }}>«…in qualsiasi momento della giornata, le posizioni chiuse <span style={{ background: "#ffe27a" }}>più quelle ancora aperte</span> non devono toccare il limite…»</div>
      </Pop>}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 40 }}>
        <Riga a={a + 6.5} etich="Oggi hai chiuso" val="+4.000 $" col={VERDE} />
        <Riga a={a + 9.3} etich="Posizione ancora aperta" val="−13.000 $" col={ROSSO} />
        <Riga a={a + 13.8} etich="Il conto oggi" val="−9.000 $" col="#fff" />
        <Riga a={a + 16.0} etich="Limite del giorno" val="−10.000 $" col={ROSSO} />
      </div>
      {t >= a + 17.9 && <Pop a={a + 17.9} style={{ position: "absolute", bottom: 70 }}><Grosso size={96} col={VERDE}>✓ sei dentro</Grosso></Pop>}
    </Fondo>
  );
};

// ---------- 6. la mezzanotte del loro server ----------
const Mezzanotte: React.FC<{ a: number }> = ({ a }) => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const scatta = t >= a + 0.4;
  return (
    <Fondo scuro>
      <div style={{ fontFamily: PIXEL, fontSize: 130, color: scatta ? ROSSO : "#fff", textShadow: `0 0 40px ${scatta ? ROSSO : "#fff"}88`, marginBottom: 18 }}>{scatta ? "00:00" : "23:59"}</div>
      <div style={{ fontSize: 36, fontWeight: 800, color: "#c9c6d6", letterSpacing: 3, marginBottom: 40 }}>ORA DEL LORO SERVER · NON LA TUA</div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Riga a={a} etich="Guadagno di ieri" val="+4.000 $" col={VERDE} barrata={a + 0.6} />
        <Riga a={a} etich="Posizione aperta" val="−13.000 $" col={ROSSO} />
        <Riga a={a} etich="Limite del giorno" val="−10.000 $" col={ROSSO} />
      </div>
      <Timbro a={a + 5.64} testo="CONTO CHIUSO" top={560} />
      {t >= a + 7.7 && <Pop a={a + 7.7} style={{ position: "absolute", bottom: 60 }}><Grosso size={64}>Non hai sbagliato un trade. <span style={{ background: VIOLA, padding: "0 14px" }}>Hai dormito.</span></Grosso></Pop>}
    </Fondo>
  );
};

// ---------- 7. cosa fare ----------
const Lista: React.FC<{ a: number }> = ({ a }) => {
  const voce = (k: number, at: number, segno: string, col: string, testo: React.ReactNode) => (
    <Pop key={k} a={a + at} style={{ display: "flex", alignItems: "center", gap: 30, width: 1400, marginBottom: 34 }}>
      <span style={{ fontSize: 84, fontWeight: 900, color: col, width: 90 }}>{segno}</span>
      <span style={{ fontSize: 60, fontWeight: 800 }}>{testo}</span>
    </Pop>
  );
  return (
    <Fondo scuro>
      {voce(0, 0, "✗", ROSSO, "Quanto chiudi")}
      {voce(1, 1.96, "✓", VERDE, <>Il punto <span style={{ background: VIOLA, padding: "0 12px" }}>più basso</span>, anche per 1 secondo</>)}
      {voce(2, 6.76, "✓", VERDE, <>A che ora finisce la <span style={{ background: VIOLA, padding: "0 12px" }}>loro</span> giornata</>)}
      {voce(3, 11.04, "✓", VERDE, "Se non lo sai: la sera niente aperto")}
    </Fondo>
  );
};

// ---------- contatore in alto a destra ----------
const Contatore: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  if (t < 2.6) return null;
  return (
    <div style={{ position: "absolute", right: 50, top: 44, fontFamily: PIXEL, fontSize: 22, color: "#fff", background: "#0b0a10cc", padding: "14px 18px", display: "flex", gap: 8, alignItems: "center" }}>
      TRAPPOLA 2/7
      <span style={{ display: "flex", gap: 5, marginLeft: 10 }}>{Array.from({ length: 7 }, (_, k) => <span key={k} style={{ width: 14, height: 14, background: k < 2 ? ROSSO : "#ffffff44" }} />)}</span>
    </div>
  );
};

// scene: [inizio, componente]
const SCENE: [number, React.ReactNode][] = [
  [0, <Titolo />],
  [3.1, <Limite a={3.1} />],
  [14.85, <Conta a={14.85} />],
  [24.9, <Clip a={24.9} file="d1" da={1.0} />],
  [30.35, <Candela a={30.35} />],
  [40.7, <Clip a={40.7} file="d2" da={0.6} />],
  [44.4, <Regolamento a={44.4} />],
  [62.35, <Clip a={62.35} file="d3" da={1.5} />],
  [68.4, <Mezzanotte a={68.4} />],
  [76.1, <Clip a={76.1} file="d4" da={4.0} />],
  [79.45, <Lista a={79.45} />],
];
const FX: [number, string, number][] = [
  [0.0, "impact", 0.7], [14.85, "ding", 0.5], [23.3, "impact", 0.8], [33.6, "boom", 0.8], [39.39, "impact", 0.9],
  [62.4, "ding", 0.6], [68.8, "impact", 0.7], [74.04, "boom", 0.9], [80.0, "ding", 0.4],
];

export const P2T2: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  let k = 0;
  for (let i = 0; i < SCENE.length; i++) if (t >= SCENE[i][0]) k = i;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill key={k}>{SCENE[k][1]}</AbsoluteFill>
      <Contatore />
      <Audio src={staticFile(`${C}/voce.wav`)} />
      <Audio src={staticFile(`${C}/musica.wav`)} volume={0.22} />
      {FX.map(([tt, nome, v], i) => (
        <Sequence key={i} from={F(tt)} durationInFrames={F(2.2)}>
          <Audio src={staticFile(`${C}/sfx/${nome}.wav`)} volume={v * 0.5} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
