import { PAROLE } from "./r9-parole";
import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  Loop,
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
import { loadFont as loadCaveat } from "@remotion/google-fonts/Caveat";

const { fontFamily: ANTON } = loadAnton();
const { fontFamily: INTER } = loadInter();
const { fontFamily: MONO } = loadMono();
const { fontFamily: MANO } = loadCaveat();

const VIOLA = "#5b3fd6";
const ACCENTO = "#8b6dff";
const NERO = "#0b0a10";
const ROSSO = "#ff4d5e";

// Schermo diviso: sopra la grafica (0-1000), al centro i sottotitoli, sotto C
const SOPRA = { left: 60, top: 170, width: 960, height: 820 };
const CHIAVE = /^(19|0,25%|1%|RISCHIO|TETTO|LIMITE|BACKTEST|QUARTO|TUTTI|INSIEME|DAVVERO|LENTO|STORTO)/;

const k = (f: number, fps: number, d = 0, damping = 12, stiffness = 200) => spring({ frame: f - d, fps, config: { damping, stiffness } });

// Pannello in vetro scuro con bordo viola (stile «framework»)
const Pannello: React.FC<{ titolo: string; children: React.ReactNode }> = ({ titolo, children }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = k(f, fps, 0, 16, 180);
  return (
    <div style={{ position: "absolute", ...SOPRA, borderRadius: 34, border: `3px solid ${ACCENTO}88`, background: "linear-gradient(160deg,#1a1430ee,#0b0a10f2)", boxShadow: `0 0 80px ${VIOLA}55, inset 0 0 60px ${VIOLA}22`, overflow: "hidden", opacity: a, transform: `scale(${0.92 + 0.08 * a})` }}>
      <div style={{ position: "absolute", left: 36, top: 26, fontFamily: MONO, fontSize: 28, color: ACCENTO, letterSpacing: 3 }}>{titolo}</div>
      {children}
    </div>
  );
};

// Nota scritta a mano
const Nota: React.FC<{ children: React.ReactNode; x: number; y: number; d: number; rot?: number; color?: string }> = ({ children, x, y, d, rot = -4, color = ACCENTO }) => {
  const f = useCurrentFrame();
  const w = interpolate(f, [d, d + 18], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: x, top: y, fontFamily: MANO, fontSize: 64, fontWeight: 700, color, transform: `rotate(${rot}deg)`, clipPath: `inset(0 ${100 - w}% 0 0)`, whiteSpace: "nowrap", textShadow: "0 4px 18px #000" }}>{children}</div>
  );
};

// Icona di un bot (testa quadrata con due occhi)
const Bot: React.FC<{ x: number; y: number; s?: number; d: number; color?: string }> = ({ x, y, s = 70, d, color = ACCENTO }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = k(f, fps, d, 9, 220);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: s, height: s, borderRadius: s * 0.24, background: color, boxShadow: `0 0 ${s * 0.4}px ${color}88`, transform: `scale(${a})`, display: "flex", alignItems: "center", justifyContent: "center", gap: s * 0.16 }}>
      <div style={{ width: s * 0.16, height: s * 0.22, borderRadius: 4, background: NERO }} />
      <div style={{ width: s * 0.16, height: s * 0.22, borderRadius: 4, background: NERO }} />
    </div>
  );
};

const Timbro: React.FC<{ children: React.ReactNode; top: number; d: number; size?: number; bg?: string }> = ({ children, top, d, size = 96, bg }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = k(f, fps, d, 10, 220);
  if (f < d) return null;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top, textAlign: "center", transform: `scale(${0.5 + 0.5 * a}) rotate(${(1 - a) * -8}deg)`, opacity: Math.min(1, a * 1.4) }}>
      <span style={{ fontFamily: ANTON, fontSize: size, color: "#fff", textTransform: "uppercase", background: bg, padding: bg ? "4px 28px" : 0, borderRadius: 14, textShadow: bg ? "none" : "0 8px 30px #000" }}>{children}</span>
    </div>
  );
};

// 1 · gancio: 19 bot che compongono il numero
const Gancio: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const n = k(f, fps, 120, 8, 200);
  return (
    <Pannello titolo="// QUANTI BOT SERVONO?">
      {Array.from({ length: 19 }).map((_, i) => (
        <Bot key={i} x={70 + (i % 7) * 122} y={110 + Math.floor(i / 7) * 122} s={86} d={6 + i * 4} />
      ))}
      <div style={{ position: "absolute", left: 0, right: 0, top: 360, textAlign: "center", fontFamily: ANTON, fontSize: 420, lineHeight: 1, color: "#fff", transform: `scale(${n})`, textShadow: `0 0 80px ${VIOLA}, 0 10px 40px #000` }}>19</div>
      <Nota x={520} y={700} d={150} rot={-6}>ti spiego perché</Nota>
    </Pannello>
  );
};

// 2 · la challenge: un obiettivo sopra, un limite sotto
const Challenge: React.FC = () => {
  const f = useCurrentFrame();
  const W = 860, H = 520, OB = 0.12, LIM = 0.82;
  const pts = [0.5, 0.47, 0.44, 0.46, 0.41, 0.38, 0.4, 0.35, 0.37, 0.42, 0.5, 0.63, 0.78, 0.9];
  const kk = Math.min(pts.length, Math.floor(interpolate(f, [10, 200], [2, pts.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })));
  const rotto = pts.slice(0, kk).some((p) => p > LIM);
  const path = pts.slice(0, kk).map((p, i) => `${i ? "L" : "M"}${(i / (pts.length - 1)) * W},${p * H}`).join(" ");
  return (
    <Pannello titolo="// COS'È UNA CHALLENGE">
      <svg width={W} height={H} style={{ position: "absolute", left: 50, top: 110, overflow: "visible", transform: `translateX(${rotto ? Math.sin(f * 2.3) * 6 : 0}px)` }}>
        <line x1={0} x2={W} y1={OB * H} y2={OB * H} stroke="#2ecc71" strokeWidth={6} strokeDasharray="22 14" opacity={f > 40 ? 1 : 0} />
        <text x={W} y={OB * H - 16} textAnchor="end" fill="#2ecc71" style={{ fontFamily: MONO, fontSize: 32, fontWeight: 700 }} opacity={f > 40 ? 1 : 0}>OBIETTIVO</text>
        <line x1={0} x2={W} y1={LIM * H} y2={LIM * H} stroke={ROSSO} strokeWidth={6} strokeDasharray="22 14" opacity={f > 105 ? 1 : 0} />
        <text x={W} y={LIM * H + 44} textAnchor="end" fill={ROSSO} style={{ fontFamily: MONO, fontSize: 32, fontWeight: 700 }} opacity={f > 105 ? 1 : 0}>LIMITE DI PERDITA DEL GIORNO</text>
        <path d={path} fill="none" stroke={rotto ? ROSSO : ACCENTO} strokeWidth={10} strokeLinejoin="round" strokeLinecap="round" style={{ filter: `drop-shadow(0 0 14px ${rotto ? ROSSO : ACCENTO})` }} />
      </svg>
      {rotto ? <Timbro top={660} d={0} size={120} bg={ROSSO}>Sei fuori</Timbro> : null}
    </Pannello>
  );
};

// 3 · un bot solo: un mese con 6 operazioni
const UnoSolo: React.FC = () => {
  const f = useCurrentFrame();
  const giorni = [3, 8, 13, 18, 23, 27];
  const rosso = f > 179;
  return (
    <Pannello titolo="// 1 BOT · 1 MESE">
      <Bot x={60} y={110} s={150} d={0} />
      <div style={{ position: "absolute", left: 250, top: 100, fontFamily: ANTON, fontSize: 92, lineHeight: 1.1, color: "#fff" }}>5-6 operazioni</div>
      <div style={{ position: "absolute", left: 252, top: 232, fontFamily: MONO, fontSize: 32, color: "#cfcbd9" }}>al mese, in media</div>
      {Array.from({ length: 30 }).map((_, i) => {
        const idx = giorni.indexOf(i);
        const on = idx >= 0 && f > 12 + idx * 10;
        const c = on ? (rosso && idx >= 3 ? ROSSO : ACCENTO) : "#ffffff14";
        return <div key={i} style={{ position: "absolute", left: 60 + (i % 10) * 88, top: 330 + Math.floor(i / 10) * 88, width: 72, height: 72, borderRadius: 14, background: c, boxShadow: on ? `0 0 24px ${c}` : "none" }} />;
      })}
      <Timbro top={640} d={120} size={110} bg={ROSSO}>Ci metti una vita</Timbro>
    </Pannello>
  );
};

// 3 · tanti bot: il rischio si somma fino al limite
const Tanti: React.FC = () => {
  const f = useCurrentFrame();
  const LIM = 260;
  const h = interpolate(f, [30, 195], [10, LIM + 30], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) });
  const rotto = h > LIM;
  const shake = rotto && f < 215 ? Math.sin(f * 2.4) * 8 : 0;
  return (
    <Pannello titolo="// TANTI BOT = RISCHIO SOMMATO">
      {Array.from({ length: 19 }).map((_, i) => (
        <Bot key={i} x={48 + i * 46} y={100} s={38} d={i * 2} color={rotto ? ROSSO : ACCENTO} />
      ))}
      <div style={{ position: "absolute", left: 340, bottom: 90, width: 280, height: h, background: rotto ? ROSSO : `linear-gradient(${ACCENTO},${VIOLA})`, borderRadius: "18px 18px 0 0", transform: `translateX(${shake}px)`, boxShadow: `0 0 50px ${rotto ? ROSSO : VIOLA}` }} />
      <div style={{ position: "absolute", left: 40, right: 40, bottom: 90 + LIM, borderTop: `6px dashed ${ROSSO}` }} />
      <div style={{ position: "absolute", right: 50, bottom: 104 + LIM, fontFamily: MONO, fontSize: 32, fontWeight: 700, color: ROSSO }}>LIMITE GIORNALIERO</div>
      <div style={{ position: "absolute", left: 40, right: 40, bottom: 86, borderTop: "3px solid #ffffff44" }} />
      <Nota x={60} y={600} d={30} rot={-3}>ogni bot aggiunge rischio</Nota>
    </Pannello>
  );
};

// 4 · la scala: 0,25% → 0,5% → 1%
const Scala: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const gradini = [
    { p: "0,25%", t: "INCUBAZIONE", d: 135 },
    { p: "0,5%", t: "PROVA", d: 290 },
    { p: "1%", t: "PIENO", d: 380 },
  ];
  return (
    <Pannello titolo="// IL RISCHIO SI GUADAGNA">
      {gradini.map((g, i) => {
        const a = k(f, fps, g.d, 12, 180);
        const w = 280, h = 190 + i * 140;
        return (
          <div key={g.p} style={{ position: "absolute", left: 50 + i * 300, bottom: 70, width: w, height: h * a, background: i === 0 ? `linear-gradient(${ACCENTO},${VIOLA})` : `${VIOLA}66`, border: `3px solid ${ACCENTO}`, borderRadius: "20px 20px 0 0", overflow: "hidden" }}>
            <div style={{ position: "absolute", left: 0, right: 0, top: 18, textAlign: "center", fontFamily: ANTON, fontSize: 84, color: "#fff" }}>{g.p}</div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 118, textAlign: "center", fontFamily: MONO, fontSize: 26, color: "#e9e6f5", letterSpacing: 2 }}>{g.t}</div>
          </div>
        );
      })}
      {(() => {
        const st = f > 389 ? 2 : f > 296 ? 1 : 0;
        const p = k(f, fps, [135, 296, 389][st], 10, 160);
        const hh = 190 + st * 140;
        return <Bot x={135 + st * 300} y={820 - 70 - hh - 125 - (1 - p) * 60} s={110} d={135} />;
      })()}
      <Nota x={300} y={110} d={46} rot={-4}>nessuno parte al massimo</Nota>
      <Nota x={330} y={190} d={250} rot={-4} color="#fff">se lo deve guadagnare</Nota>
    </Pannello>
  );
};

// 5 · operazioni vere dentro la fascia del backtest
const Backtest: React.FC = () => {
  const f = useCurrentFrame();
  const W = 860, H = 460;
  const banda = (x: number) => 0.62 - 0.45 * x;
  let s = 7;
  const rnd = () => ((s = (s * 16807) % 2147483647), s / 2147483647);
  const punti = Array.from({ length: 22 }).map((_, i) => { const x = (i + 0.5) / 22; const fuori = i >= 9; return { x, y: banda(x) + (fuori ? 0.22 + (i - 9) * 0.03 : 0) + (rnd() - 0.5) * 0.12, fuori }; });
  const visti = Math.floor(interpolate(f, [4, 120], [0, punti.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const sup = `M0,${banda(0) * H - 70} L${W},${banda(1) * H - 70} L${W},${banda(1) * H + 70} L0,${banda(0) * H + 70} Z`;
  return (
    <Pannello titolo="// E SE DAL VIVO FA PEGGIO?">
      <svg width={W} height={H} style={{ position: "absolute", left: 50, top: 110, overflow: "visible" }}>
        <path d={sup} fill={`${VIOLA}44`} stroke={ACCENTO} strokeWidth={3} strokeDasharray="14 10" />
        {punti.slice(0, visti).map((p, i) => (
          <circle key={i} cx={p.x * W} cy={p.y * H} r={16} fill={p.fuori ? ROSSO : "#fff"} style={{ filter: `drop-shadow(0 0 10px ${p.fuori ? ROSSO : ACCENTO})` }} />
        ))}
      </svg>
      <div style={{ position: "absolute", left: 60, top: 600, fontFamily: MONO, fontSize: 30, color: "#cfcbd9" }}>● operazioni vere &nbsp;&nbsp; ▒ fascia del backtest</div>
      <Timbro top={560} d={66} size={96} bg={ROSSO}>Non sale</Timbro>
      <Timbro top={680} d={131} size={96} bg={VIOLA}>Lo cambio</Timbro>
    </Pannello>
  );
};

// 6-7 · il tetto sul rischio aperto, anche quando sbagliano tutti
const Tetto: React.FC<{ crollo?: number }> = ({ crollo }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const TOP = 260;
  const lid = crollo === undefined ? interpolate(f, [40, 56], [-200, TOP], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.bounce) }) : TOP;
  const giu = crollo === undefined ? 0 : k(f, fps, crollo, 14, 120);
  return (
    <Pannello titolo={crollo === undefined ? "// IL TETTO SUL RISCHIO APERTO" : "// QUANDO SBAGLIANO TUTTI INSIEME"}>
      {Array.from({ length: 19 }).map((_, i) => {
        const alt = 140 + ((i * 37) % 11) * 32;
        const grow = interpolate(f, [i * 2, i * 2 + 30], [0, 1], { extrapolateRight: "clamp" });
        const max = 690 - lid - 10;
        const h = Math.min(alt * grow, Math.max(0, max)) * (1 - 0.75 * giu);
        const c = crollo !== undefined && giu > 0.05 ? ROSSO : ACCENTO;
        return <div key={i} style={{ position: "absolute", left: 52 + i * 46, bottom: 130, width: 34, height: h, background: c, borderRadius: "8px 8px 0 0", boxShadow: `0 0 18px ${c}88` }} />;
      })}
      <div style={{ position: "absolute", left: 30, right: 30, top: lid, height: 26, background: "#fff", borderRadius: 10, boxShadow: `0 0 40px ${ACCENTO}` }} />
      <div style={{ position: "absolute", right: 40, top: lid - 50, fontFamily: MONO, fontSize: 30, fontWeight: 700, color: "#fff" }}>TETTO</div>
      {crollo === undefined ? <Nota x={60} y={720} d={70}>non si supera, mai</Nota> : <Nota x={60} y={720} d={crollo + 12} color="#fff">la perdita resta sotto controllo</Nota>}
    </Pannello>
  );
};

// 8 · finale: domanda + finto box commento + segui
const Finale: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = k(f, fps, 18, 12, 200);
  return (
    <Pannello titolo="// E TU?">
      <div style={{ position: "absolute", left: 50, right: 50, top: 110, textAlign: "center", fontFamily: ANTON, fontSize: 120, lineHeight: 1.02, color: "#fff", textTransform: "uppercase" }}>Quanti bot<br /><span style={{ color: ACCENTO }}>servono davvero?</span></div>
      <div style={{ position: "absolute", left: 70, right: 70, top: 470, height: 110, borderRadius: 60, background: "#1d1a2b", border: "2px solid #ffffff22", display: "flex", alignItems: "center", padding: "0 30px", gap: 24, transform: `translateY(${(1 - a) * 60}px)`, opacity: a }}>
        <div style={{ width: 62, height: 62, borderRadius: 31, background: "#ffffff22" }} />
        <div style={{ flex: 1, fontFamily: INTER, fontSize: 40, color: "#fff" }}>Quanti bot usi tu?</div>
        <div style={{ width: 70, height: 70, borderRadius: 35, background: "#3b82f6", color: "#fff", fontSize: 44, display: "flex", alignItems: "center", justifyContent: "center" }}>↑</div>
      </div>
      <Timbro top={630} d={40} size={90} bg={VIOLA}>Seguimi</Timbro>
    </Pannello>
  );
};

// Meme sotto, sulle parole della voce: [file, frame d'inizio, durata]
const MEME: [string, number, number][] = [
  ["a_explain", 153, 55], ["b_getout", 405, 62], ["c_skeleton", 556, 80], ["d_escalated", 850, 80], ["e_baby", 986, 95],
  ["f_spider", 1143, 66], ["g_bye", 1418, 48], ["h_pass", 1500, 95], ["i_fine", 1717, 62], ["j_math", 1790, 53],
];
const MEME_DUR: Record<string, number> = { a_explain: 70, b_getout: 63, c_skeleton: 150, d_escalated: 101, e_baby: 133, f_spider: 76, g_bye: 34, h_pass: 162, i_fine: 89, j_math: 88 };
const Meme: React.FC<{ nome: string }> = ({ nome }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = k(f, fps, 0, 11, 260);
  return (
    <AbsoluteFill style={{ backgroundColor: NERO, transform: `scale(${1.15 - 0.15 * a})`, opacity: Math.min(1, a * 2) }}>
      <Loop durationInFrames={MEME_DUR[nome]}>
        <OffthreadVideo src={staticFile(`r9/meme/${nome}.mp4`)} muted style={{ width: "100%", height: "100%", objectFit: "contain" }} />
      </Loop>
    </AbsoluteFill>
  );
};

// C in basso, come una «camera»: ritratto con zoom lento e piccolo colpo a ogni frase
const Camera: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const inizi = PAROLE.filter((p, i) => i === 0 || PAROLE[i - 1][2] !== p[2]).map((p) => p[0]);
  const ultimo = inizi.filter((a) => a <= t).pop() ?? 0;
  const colpo = k(f, fps, Math.round(ultimo * fps), 10, 240);
  const s = interpolate(f, [0, 1843], [1.05, 1.25]) * (1.03 - 0.03 * colpo);
  return (
    <div style={{ position: "absolute", left: 80, right: 80, top: 1200, height: 620, borderRadius: 34, overflow: "hidden", border: `3px solid ${ACCENTO}66`, boxShadow: `0 0 70px ${VIOLA}55`, background: NERO }}>
      <Img src={staticFile("r9/pers_C.png")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 22%", transform: `scale(${s})`, transformOrigin: "50% 35%" }} />
      {MEME.map(([nome, da, dur]) => (
        <Sequence key={nome} from={da} durationInFrames={dur}>
          <Meme nome={nome} />
        </Sequence>
      ))}
    </div>
  );
};

// Sottotitoli al centro: al massimo 2 parole alla volta, grandi
const Sottotitoli: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const viste = PAROLE.filter(([a]) => t >= a);
  if (!viste.length) return null;
  const g = viste[viste.length - 1][2];
  const ultime = viste.filter((p) => p[2] === g).slice(-2);
  return (
    <div style={{ position: "absolute", left: 40, right: 40, top: 1032, textAlign: "center", fontFamily: ANTON, fontSize: 112, lineHeight: 1.05, textTransform: "uppercase", WebkitTextStroke: "10px #000", paintOrder: "stroke fill", whiteSpace: "nowrap" }}>
      {ultime.map(([a, p]) => {
        const s = k(f, fps, Math.round(a * fps), 12, 260);
        return <span key={a} style={{ display: "inline-block", margin: "0 14px", color: CHIAVE.test(p.toUpperCase()) ? ACCENTO : "#fff", transform: `scale(${0.7 + 0.3 * s}) translateY(${(1 - s) * 30}px)` }}>{p}</span>;
      })}
    </div>
  );
};

const Cornice: React.FC = () => (
  <>
    <div style={{ position: "absolute", left: 80, top: 100, fontFamily: MONO, fontSize: 32, color: ACCENTO, letterSpacing: 2 }}>// DENTRO IL MIO SISTEMA</div>
    <div style={{ position: "absolute", right: 80, top: 92, fontFamily: ANTON, fontSize: 44, color: "#fff", letterSpacing: 2 }}>MS <span style={{ fontFamily: MONO, fontSize: 30, color: "#cfcbd9" }}>#9</span></div>
  </>
);

export const R9: React.FC = () => {
  const f = useCurrentFrame();
  const tagli = [207, 437, 672, 881, 1288, 1446, 1601, 1756];
  const flash = tagli.some((c) => f >= c && f < c + 3);
  return (
    <AbsoluteFill style={{ backgroundColor: NERO, fontFamily: INTER }}>
      <AbsoluteFill style={{ backgroundImage: "linear-gradient(#ffffff08 1px,transparent 1px),linear-gradient(90deg,#ffffff08 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 30%, ${VIOLA}33, transparent 60%)` }} />
      <Sequence name="Gancio 19" durationInFrames={207}><Gancio /></Sequence>
      <Sequence name="Challenge" from={207} durationInFrames={230}><Challenge /></Sequence>
      <Sequence name="Uno solo" from={437} durationInFrames={235}><UnoSolo /></Sequence>
      <Sequence name="Tanti" from={672} durationInFrames={209}><Tanti /></Sequence>
      <Sequence name="Scala" from={881} durationInFrames={407}><Scala /></Sequence>
      <Sequence name="Backtest" from={1288} durationInFrames={158}><Backtest /></Sequence>
      <Sequence name="Tetto" from={1446} durationInFrames={155}><Tetto /></Sequence>
      <Sequence name="Tutti insieme" from={1601} durationInFrames={155}><Tetto crollo={116} /></Sequence>
      <Sequence name="Finale" from={1756} durationInFrames={87}><Finale /></Sequence>
      <Camera />
      {flash ? <AbsoluteFill style={{ backgroundColor: "#fff", opacity: 0.3 }} /> : null}
      <Sottotitoli />
      <Cornice />
      <Audio src={staticFile("r9/voce.wav")} volume={1} />
      <Audio src={staticFile("r9/musica.wav")} volume={0.13} />
      <Audio src={staticFile("r9/sfx.wav")} volume={0.45} />
    </AbsoluteFill>
  );
};
