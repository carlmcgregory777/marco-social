import { PAROLE } from "./r8-parole";
import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import { loadFont as loadAnton } from "@remotion/google-fonts/Anton";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";

const { fontFamily: ANTON } = loadAnton();
const { fontFamily: INTER } = loadInter();
const { fontFamily: MONO } = loadMono();

const VIOLA = "#5b3fd6";
const ACCENTO = "#8b6dff";
const NERO = "#0b0a10";
const ROSSO = "#ff4d5e";

const fmt = (n: number) =>
  n >= 1000 ? `${Math.floor(n / 1000)}.${String(n % 1000).padStart(3, "0")}` : String(n);

const CHIAVE = /^(4\.000|11|DATI|COSTI|DRAWDOWN|PROP|FIRM|INCUBAZIONE|DEMO|VERO|GUADAGNA|ZERO|FUORI|SPREAD|SLIPPAGE|DORMIVO)/;

// Zoom lento su un'immagine, con colpo di camera all'ingresso
const Foto: React.FC<{ src: string; from?: number; to?: number; y?: string }> = ({ src, from = 1.08, to = 1.18, y = "40%" }) => {
  const f = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  const pop = spring({ frame: f, fps, config: { damping: 14, stiffness: 180 } });
  const s = interpolate(f, [0, durationInFrames], [from, to]) * (1.12 - 0.12 * pop);
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: NERO }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${s})`, transformOrigin: `50% ${y}` }} />
    </AbsoluteFill>
  );
};

const Clip: React.FC<{ src: string; scale?: number; rate?: number }> = ({ src, scale = 1.06, rate = 1 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: f, fps, config: { damping: 14, stiffness: 180 } });
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: NERO }}>
      <OffthreadVideo src={staticFile(src)} muted playbackRate={rate} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${scale * (1.1 - 0.1 * pop)})` }} />
    </AbsoluteFill>
  );
};

// Contatore grande che scende/sale da a → b
const Contatore: React.FC<{ a: number; b: number; start: number; end: number; top: number; size?: number; color?: string }> = ({ a, b, start, end, top, size = 260, color = "#fff" }) => {
  const f = useCurrentFrame();
  const t = interpolate(f, [start, end], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const v = Math.round(a + (b - a) * t);
  const bump = f > end && f < end + 8 ? 1 + 0.08 * Math.sin(((f - end) / 8) * Math.PI) : 1;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top, textAlign: "center", fontFamily: ANTON, fontSize: size, lineHeight: 1, color, transform: `scale(${bump})`, textShadow: "0 10px 50px #000c, 0 0 2px #000" }}>
      {fmt(v)}
    </div>
  );
};

// Scritta tipo «timbro» in Anton
const Titolo: React.FC<{ children: React.ReactNode; top: number; size?: number; delay?: number; bg?: string }> = ({ children, top, size = 110, delay = 0, bg }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const k = spring({ frame: f - delay, fps, config: { damping: 11, stiffness: 200 } });
  return (
    <div style={{ position: "absolute", left: 80, right: 80, top, textAlign: "center", opacity: Math.min(1, k * 1.5), transform: `scale(${0.6 + 0.4 * k}) rotate(${(1 - k) * -6}deg)` }}>
      <span style={{ fontFamily: ANTON, fontSize: size, lineHeight: 1.02, textTransform: "uppercase", color: "#fff", background: bg, padding: bg ? "6px 26px" : 0, borderRadius: 16, textShadow: bg ? "none" : "0 8px 40px #000d", boxDecorationBreak: "clone", WebkitBoxDecorationBreak: "clone" }}>{children}</span>
    </div>
  );
};

// Etichetta del filtro (in alto)
const Filtro: React.FC<{ n: string; testo: string; color?: string }> = ({ n, testo, color = VIOLA }) => {
  const f = useCurrentFrame();
  const x = interpolate(f, [0, 10], [-900, 0], { extrapolateRight: "clamp", easing: Easing.out(Easing.back(1.4)) });
  return (
    <div style={{ position: "absolute", left: 80, top: 230, transform: `translateX(${x}px)`, display: "flex", alignItems: "center", gap: 22 }}>
      <div style={{ fontFamily: ANTON, fontSize: 84, background: color, color: "#fff", padding: "0 26px", borderRadius: 14 }}>{n}</div>
      <div style={{ fontFamily: ANTON, fontSize: 84, color: "#fff", textTransform: "uppercase", textShadow: "0 6px 30px #000" }}>{testo}</div>
    </div>
  );
};

// Scena 4: i costi che piovono sulla strategia
const Costi: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const voci = ["SPREAD", "COMMISSIONI", "SLIPPAGE"];
  return (
    <AbsoluteFill>
      <Foto src="r8/img3.png" from={1.25} to={1.3} y="55%" />
      <AbsoluteFill style={{ backgroundColor: "#0b0a10cc", backdropFilter: "blur(6px)" }} />
      <Filtro n="2" testo="Costi veri" />
      {voci.map((v, i) => {
        const d = [71, 90, 113][i]; // sulle parole della voce
        const k = spring({ frame: f - d, fps, config: { damping: 9, stiffness: 160 } });
        return (
          <div key={v} style={{ position: "absolute", left: 0, right: 0, top: 470 + i * 170, textAlign: "center", transform: `translateY(${(1 - k) * -600}px) rotate(${(i - 1) * 4 * k}deg)`, opacity: k > 0.01 ? 1 : 0 }}>
            <span style={{ fontFamily: ANTON, fontSize: 120, color: ROSSO, background: "#1a1018", border: `6px solid ${ROSSO}`, padding: "4px 34px", borderRadius: 18 }}>− {v}</span>
          </div>
        );
      })}
      <Contatore a={1240} b={310} start={125} end={175} top={1010} size={240} />
    </AbsoluteFill>
  );
};

// Scena 5: la curva che sfonda il limite di drawdown
const Drawdown: React.FC = () => {
  const f = useCurrentFrame();
  const W = 920, H = 560, LIM = 0.72;
  const pts: number[] = [];
  let v = 0.2;
  let s = 11;
  const rnd = () => ((s = (s * 16807) % 2147483647), s / 2147483647);
  for (let i = 0; i < 90; i++) { v += i < 45 ? -0.004 + (rnd() - 0.45) * 0.05 : 0.018 + (rnd() - 0.5) * 0.05; pts.push(Math.max(0.02, Math.min(0.95, v))); }
  const k = Math.floor(interpolate(f, [6, 90], [2, pts.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const rotto = pts.slice(0, k).some((p) => p > LIM);
  const path = pts.slice(0, k).map((p, i) => `${i ? "L" : "M"}${(i / (pts.length - 1)) * W},${p * H}`).join(" ");
  const shake = rotto && f < 100 ? Math.sin(f * 2.3) * 6 : 0;
  return (
    <AbsoluteFill style={{ backgroundColor: NERO }}>
      <AbsoluteFill style={{ backgroundImage: "linear-gradient(#ffffff0a 1px,transparent 1px),linear-gradient(90deg,#ffffff0a 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
      <Filtro n="3" testo="Drawdown" color={rotto ? ROSSO : VIOLA} />
      <svg width={W} height={H} style={{ position: "absolute", left: 80, top: 440, overflow: "visible", transform: `translateX(${shake}px)` }}>
        <rect x={0} y={LIM * H} width={W} height={H * (1 - LIM)} fill="#ff4d5e18" />
        <line x1={0} x2={W} y1={LIM * H} y2={LIM * H} stroke={ROSSO} strokeWidth={6} strokeDasharray="22 14" />
        <text x={W} y={LIM * H - 18} textAnchor="end" fill={ROSSO} style={{ fontFamily: MONO, fontSize: 34, fontWeight: 700 }}>LIMITE PROP FIRM</text>
        <path d={path} fill="none" stroke={rotto ? ROSSO : ACCENTO} strokeWidth={10} strokeLinejoin="round" strokeLinecap="round" style={{ filter: `drop-shadow(0 0 14px ${rotto ? ROSSO : ACCENTO})` }} />
      </svg>
      {rotto ? <Titolo top={1060} size={130} bg={ROSSO}>Fuori.</Titolo> : null}
      <Contatore a={310} b={38} start={20} end={90} top={1190} size={170} />
    </AbsoluteFill>
  );
};

// Sottotitoli parola per parola (stile Vox), sui tempi veri della voce
const Sottotitoli: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const viste = PAROLE.filter(([a]) => t >= a);
  if (!viste.length) return null;
  const g = viste[viste.length - 1][2];
  const ultime = viste.filter((p) => p[2] === g).slice(-4);
  return (
    <div style={{ position: "absolute", left: 70, right: 70, top: 1380, textAlign: "center", fontFamily: ANTON, fontSize: 92, lineHeight: 1.08, textTransform: "uppercase", WebkitTextStroke: "10px #000", paintOrder: "stroke fill" }}>
      {ultime.map(([a, p]) => {
        const k = spring({ frame: f - Math.round(a * fps), fps, config: { damping: 12, stiffness: 260 } });
        return (
          <span key={a} style={{ display: "inline-block", margin: "0 12px", color: CHIAVE.test(p.toUpperCase()) ? ACCENTO : "#fff", transform: `scale(${0.7 + 0.3 * k}) translateY(${(1 - k) * 30}px)` }}>{p}</span>
        );
      })}
    </div>
  );
};

const Cornice: React.FC = () => (
  <>
    <div style={{ position: "absolute", left: 80, top: 120, fontFamily: MONO, fontSize: 34, color: ACCENTO, letterSpacing: 2, textShadow: "0 2px 12px #000" }}>// DENTRO IL MIO SISTEMA</div>
    <div style={{ position: "absolute", left: 80, right: 80, bottom: 110, display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 30, color: "#cfcbd9", textShadow: "0 2px 12px #000" }}>
      <span><b style={{ fontFamily: ANTON, fontSize: 40, color: "#fff", letterSpacing: 2 }}>MS</b>&nbsp;&nbsp;@cthe.trader</span>
      <span>#8</span>
    </div>
  </>
);

export const R8: React.FC = () => {
  const f = useCurrentFrame();
  const flash = [114, 183, 363, 552, 693, 786, 855].some((c) => f >= c && f < c + 3);
  return (
    <AbsoluteFill style={{ backgroundColor: NERO, fontFamily: INTER }}>
      {/* 1 · gancio: carte che escono dal PC + contatore */}
      <Sequence name="Gancio" durationInFrames={114}>
        <Clip src="r8/anim1.mp4" scale={1.08} />
        <AbsoluteFill style={{ background: "linear-gradient(#0b0a1000 30%,#0b0a10cc 70%)" }} />
        <Contatore a={0} b={4000} start={4} end={72} top={820} size={300} />
        <Titolo top={1130} size={96} delay={10}>Strategie<br /><span style={{ color: ACCENTO }}>mentre dormivo</span></Titolo>
      </Sequence>
      {/* 2 · al mattino ne restano 11 */}
      <Sequence name="Mattina" from={114} durationInFrames={69}>
        <Foto src="r8/img2.png" />
        <Titolo top={1150} size={130} delay={18} bg={ROSSO}>Rimaste: 11</Titolo>
      </Sequence>
      {/* 3 · filtro 1: setacci */}
      <Sequence name="Filtro dati" from={183} durationInFrames={180}>
        <Sequence durationInFrames={66}><Clip src="r8/anim3.mp4" scale={1.1} /></Sequence>
        <Sequence from={66} durationInFrames={114}><Foto src="r8/img3.png" from={1.12} to={1.3} y="60%" /></Sequence>
        <AbsoluteFill style={{ background: "linear-gradient(#0b0a10aa 0%,#0b0a1000 35%,#0b0a1000 60%,#0b0a10cc 85%)" }} />
        <Filtro n="1" testo="Dati mai visti" />
        <Contatore a={4000} b={1240} start={30} end={100} top={1080} size={220} />
      </Sequence>
      {/* 4 · filtro 2: costi */}
      <Sequence name="Filtro costi" from={363} durationInFrames={189}><Costi /></Sequence>
      {/* 5 · filtro 3: drawdown */}
      <Sequence name="Filtro drawdown" from={552} durationInFrames={141}><Drawdown /></Sequence>
      {/* 6 · incubazione */}
      <Sequence name="Incubazione" from={693} durationInFrames={93}>
        <Foto src="r8/img4.png" from={1.05} to={1.22} y="70%" />
        <AbsoluteFill style={{ background: "linear-gradient(#0b0a1000 55%,#0b0a10cc 85%)" }} />
        <Titolo top={980} size={96} delay={6} bg={VIOLA}>Incubazione · demo</Titolo>
        <Contatore a={38} b={11} start={14} end={70} top={1110} size={200} color={ACCENTO} />
      </Sequence>
      {/* 7 · il conto vero si guadagna */}
      <Sequence name="Conto vero" from={786} durationInFrames={69}>
        <Clip src="r8/anim5.mp4" scale={1.04} />
        <AbsoluteFill style={{ background: "linear-gradient(#0b0a10cc 0%,#0b0a1000 30%)" }} />
        <Titolo top={230} size={120} delay={8}>Il conto vero</Titolo>
        <Titolo top={385} size={120} delay={22} bg={VIOLA}>si guadagna</Titolo>
      </Sequence>
      {/* 8 · loop: stanotte si ricomincia */}
      <Sequence name="Loop" from={855} durationInFrames={135}>
        <Foto src="r8/img1.png" from={1.3} to={1.08} y="45%" />
        <AbsoluteFill style={{ background: "linear-gradient(#0b0a1000 30%,#0b0a10cc 70%)" }} />
        <Contatore a={4000} b={0} start={24} end={112} top={820} size={300} />
        <Titolo top={1130} size={96} delay={4}>Stanotte<br /><span style={{ color: ACCENTO }}>si ricomincia</span></Titolo>
      </Sequence>
      {flash ? <AbsoluteFill style={{ backgroundColor: "#fff", opacity: 0.35 }} /> : null}
      <Sottotitoli />
      <Cornice />
      <Audio src={staticFile("r8/voce.wav")} volume={1} />
      <Audio src={staticFile("r8/musica.wav")} volume={0.22} />
      <Audio src={staticFile("r8/sfx.wav")} volume={0.5} />
    </AbsoluteFill>
  );
};
