import { PAROLE } from "./algory1-parole";
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
const CHIAVE = /^(19|100.000|ALGORY|ALGO|0,25%|ROSSI|NIENTE|PERDITE|CADONO|SOFTWARE|MAI)/;

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

// Riga di tabella del pannello Algory: bot, mercato, risultato
const Riga: React.FC<{ y: number; d: number; nome: string; val: string; rosso?: boolean; acceso?: boolean }> = ({ y, d, nome, val, rosso, acceso }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = k(f, fps, d, 14, 200);
  const c = rosso ? ROSSO : "#2ecc71";
  return (
    <div style={{ position: "absolute", left: 50, right: 50, top: y, height: 74, borderRadius: 14, background: rosso && acceso ? `${ROSSO}33` : "#ffffff0d", border: `2px solid ${rosso && acceso ? ROSSO : "#ffffff14"}`, display: "flex", alignItems: "center", padding: "0 26px", gap: 24, opacity: a, transform: `translateX(${(1 - a) * 80}px)` }}>
      <div style={{ width: 40, height: 40, borderRadius: 10, background: rosso ? ROSSO : ACCENTO }} />
      <div style={{ flex: 1, fontFamily: MONO, fontSize: 32, color: "#e9e6f5" }}>{nome}</div>
      <div style={{ fontFamily: ANTON, fontSize: 44, color: c }}>{val}</div>
    </div>
  );
};

// 1 · gancio: il conto da 100.000 $ e 19 bot che premono i tasti
const Conto: React.FC = () => {
  const f = useCurrentFrame();
  const n = Math.round(interpolate(f, [4, 40], [0, 100000], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }));
  return (
    <Pannello titolo="// CONTO FUNDED">
      <div style={{ position: "absolute", left: 0, right: 0, top: 90, textAlign: "center", fontFamily: ANTON, fontSize: 210, lineHeight: 1, color: "#fff", textShadow: `0 0 70px ${VIOLA}` }}>{n.toLocaleString("it-IT")} $</div>
      <Nota x={210} y={320} d={48} rot={-3} color="#fff">non premo io i tasti…</Nota>
      {Array.from({ length: 19 }).map((_, i) => (
        <Bot key={i} x={70 + (i % 10) * 85} y={470 + Math.floor(i / 10) * 100} s={66} d={98 + i * 2} />
      ))}
      <Timbro top={690} d={110} size={100} bg={VIOLA}>19 bot</Timbro>
    </Pannello>
  );
};

// 2 · i bot non li scrivo io: li crea un software, Algory
const Software: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = k(f, fps, 106, 9, 160);
  const righe = ["genera(strategie)", "backtest(passato)", "test(dati_nuovi)", "incubazione(0.25%)", "deploy(MT5)"];
  return (
    <Pannello titolo="// CHI CREA I BOT?">
      {righe.map((r, i) => {
        const w = interpolate(f, [40 + i * 10, 52 + i * 10], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return <div key={r} style={{ position: "absolute", left: 60, top: 230 + i * 62, fontFamily: MONO, fontSize: 34, color: "#cfcbd9", clipPath: `inset(0 ${100 - w}% 0 0)` }}>&gt; {r}</div>;
      })}
      <Nota x={70} y={110} d={22} rot={-4}>non li scrivo io</Nota>
      {f >= 106 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 560, textAlign: "center", transform: `scale(${0.4 + 0.6 * a})`, opacity: Math.min(1, a * 1.5) }}>
          <span style={{ fontFamily: ANTON, fontSize: 170, color: "#fff", letterSpacing: 6, padding: "0 40px", borderRadius: 24, background: `linear-gradient(120deg,${VIOLA},${ACCENTO})`, boxShadow: `0 0 90px ${VIOLA}` }}>ALGORY</span>
        </div>
      ) : null}
    </Pannello>
  );
};

// 3-4 · migliaia di strategie, poi i dati mai visti: quasi tutte cadono
const COL = 22, RIG = 12;
const vive = (i: number) => (i * 7919) % 31 === 0;
const Strategie: React.FC<{ caduta?: number }> = ({ caduta }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tot = COL * RIG;
  const dopo = caduta !== undefined && f > caduta;
  const visti = caduta === undefined ? Math.floor(interpolate(f, [30, 70], [0, tot], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })) : tot;
  const conta = caduta === undefined ? Math.round(interpolate(f, [30, 100], [0, 4000], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })) : 4000;
  const linea = caduta === undefined ? interpolate(f, [70, 120], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  const muro = caduta === undefined ? 0 : k(f, fps, 30, 14, 160);
  return (
    <Pannello titolo={caduta === undefined ? "// MIGLIAIA DI STRATEGIE" : "// DATI MAI VISTI"}>
      <div style={{ position: "absolute", right: 50, top: 22, fontFamily: ANTON, fontSize: 56, color: "#fff" }}>{conta >= 1000 ? `${Math.floor(conta / 1000)}.${String(conta % 1000).padStart(3, "0")}` : conta}</div>
      {Array.from({ length: visti }).map((_, i) => {
        const x = 54 + (i % COL) * 39, y0 = 120 + Math.floor(i / COL) * 39;
        const cade = caduta !== undefined && !vive(i);
        const g = cade ? Math.max(0, f - caduta - (i % 9) * 2) : 0;
        const c = cade && dopo ? ROSSO : vive(i) && dopo ? "#fff" : ACCENTO;
        return <div key={i} style={{ position: "absolute", left: x, top: y0 + g * g * 0.9, width: 26, height: 26, borderRadius: 13, background: c, opacity: cade ? Math.max(0, 1 - g / 28) : 1, boxShadow: vive(i) && dopo ? `0 0 20px ${ACCENTO}` : "none" }} />;
      })}
      {caduta === undefined ? (
        <svg width={860} height={200} style={{ position: "absolute", left: 50, top: 600, overflow: "visible" }}>
          <path d="M0,170 L120,150 L240,155 L360,110 L480,120 L600,70 L720,60 L860,20" fill="none" stroke="#2ecc71" strokeWidth={8} strokeDasharray={1200} strokeDashoffset={1200 * (1 - linea)} style={{ filter: "drop-shadow(0 0 10px #2ecc71)" }} />
          <text x={0} y={200} fill="#2ecc71" style={{ fontFamily: MONO, fontSize: 30, fontWeight: 700 }} opacity={linea > 0 ? 1 : 0}>BACKTEST SUL PASSATO</text>
        </svg>
      ) : (
        <>
          <div style={{ position: "absolute", left: 40, right: 40, top: 610, height: 6, background: ACCENTO, transform: `scaleX(${muro})`, boxShadow: `0 0 30px ${ACCENTO}` }} />
          <div style={{ position: "absolute", left: 50, top: 640, fontFamily: MONO, fontSize: 32, fontWeight: 700, color: ACCENTO, opacity: muro }}>DATI CHE NON HANNO MAI VISTO</div>
          <Timbro top={690} d={94} size={96} bg={ROSSO}>Quasi tutte fuori</Timbro>
        </>
      )}
    </Pannello>
  );
};

// 5-6 · la scala: partono allo 0,25%, salgono solo se dal vivo fanno come nel test
const Scala: React.FC<{ cambio?: boolean }> = ({ cambio }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const gradini = [
    { p: "0,25%", t: "PARTENZA", d: cambio ? -30 : 50 },
    { p: "0,5%", t: "PROVA", d: cambio ? -30 : 999 },
    { p: "1%", t: "PIENO", d: cambio ? -30 : 999 },
  ];
  const st = cambio ? (f > 84 ? 2 : f > 20 ? 1 : 0) : 0;
  const salto = k(f, fps, cambio ? [0, 20, 84][st] : 56, 10, 160);
  const rosso = cambio && f > 112;
  const via = cambio ? interpolate(f, [128, 142], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  const hh = 190 + st * 140;
  return (
    <Pannello titolo={cambio ? "// DAL VIVO COME NEL TEST?" : "// SI PARTE PICCOLI"}>
      {gradini.map((g, i) => {
        const a = k(f, fps, g.d, 12, 180);
        const h = 190 + i * 140;
        return (
          <div key={g.p} style={{ position: "absolute", left: 50 + i * 300, bottom: 70, width: 280, height: h * a, background: i === 0 ? `linear-gradient(${ACCENTO},${VIOLA})` : `${VIOLA}66`, border: `3px solid ${ACCENTO}`, borderRadius: "20px 20px 0 0", overflow: "hidden" }}>
            <div style={{ position: "absolute", left: 0, right: 0, top: 18, textAlign: "center", fontFamily: ANTON, fontSize: 84, color: "#fff" }}>{g.p}</div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 118, textAlign: "center", fontFamily: MONO, fontSize: 26, color: "#e9e6f5", letterSpacing: 2 }}>{g.t}</div>
          </div>
        );
      })}
      {cambio || f >= 56 ? (
        <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${via * 900}px, ${via * 300}px) rotate(${via * 90}deg)`, opacity: 1 - via }}>
          <Bot x={135 + st * 300} y={820 - 70 - hh - 125 - (1 - salto) * 60} s={110} d={-30} color={rosso ? ROSSO : ACCENTO} />
        </div>
      ) : null}
      {cambio && f > 135 ? <Bot x={135} y={820 - 70 - 190 - 125} s={110} d={135} /> : null}
      {cambio ? (
        <>
          <Nota x={60} y={80} d={4} rot={-4}>il rischio si guadagna</Nota>
          <Timbro top={165} d={135} size={90} bg={ROSSO}>Lo cambio</Timbro>
        </>
      ) : (
        <Nota x={360} y={150} d={70} rot={-4}>nessuno parte al massimo</Nota>
      )}
    </Pannello>
  );
};

// 7 · perché Algory: niente promesse, numeri veri anche rossi
const Numeri: React.FC = () => {
  const f = useCurrentFrame();
  const barra = interpolate(f, [22, 34], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rossi = f > 133;
  return (
    <Pannello titolo="// PERCHÉ L'HO SCELTO">
      <div style={{ position: "absolute", left: 50, right: 50, top: 100, textAlign: "center", fontFamily: ANTON, fontSize: 58, color: "#ffffff88", textTransform: "uppercase", opacity: f > 4 ? 1 : 0 }}>
        <span style={{ position: "relative" }}>«+50% al mese garantito»
          <span style={{ position: "absolute", left: 0, top: "52%", height: 10, width: `${barra}%`, background: ROSSO, borderRadius: 5 }} />
        </span>
      </div>
      <Timbro top={205} d={40} size={80} bg={VIOLA}>Nessuna promessa</Timbro>
      <Riga y={350} d={92} nome="BOT XAUUSD · H2" val="+1,8%" />
      <Riga y={440} d={98} nome="BOT USDCAD · H2" val="−0,6%" rosso acceso={rossi} />
      <Riga y={530} d={104} nome="BOT EURGBP · H4" val="+0,9%" />
      <Riga y={620} d={110} nome="BOT GBPUSD · H1" val="−1,1%" rosso acceso={rossi} />
      <Nota x={200} y={712} d={120} rot={-4} color="#fff">anche quando sono rossi</Nota>
    </Pannello>
  );
};

// 8 · da oggi li vedi anche tu
const Vedi: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const carte = [
    { t: "STRATEGIE", s: "come le scelgo", d: 49, c: ACCENTO },
    { t: "CONTO", s: "il saldo vero", d: 76, c: ACCENTO },
    { t: "PERDITE", s: "comprese", d: 98, c: ROSSO },
  ];
  return (
    <Pannello titolo="// DA OGGI LO VEDI ANCHE TU">
      {carte.map((c, i) => {
        const a = k(f, fps, c.d, 10, 200);
        return (
          <div key={c.t} style={{ position: "absolute", left: 60, right: 60, top: 120 + i * 210, height: 180, borderRadius: 26, border: `3px solid ${c.c}`, background: `${c.c}22`, display: "flex", flexDirection: "column", justifyContent: "center", paddingLeft: 40, opacity: f >= c.d ? Math.min(1, a * 1.5) : 0, transform: `scale(${0.8 + 0.2 * a}) rotate(${(1 - a) * (i % 2 ? 4 : -4)}deg)` }}>
            <div style={{ fontFamily: ANTON, fontSize: 96, lineHeight: 1, color: "#fff" }}>{c.t}</div>
            <div style={{ fontFamily: MANO, fontSize: 52, fontWeight: 700, color: c.c }}>{c.s}</div>
          </div>
        );
      })}
    </Pannello>
  );
};

// 9 · finale: box commento con ALGO + seguimi
const Finale: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = k(f, fps, 0, 12, 200);
  const testo = "ALGO".slice(0, Math.max(0, Math.min(4, Math.floor((f - 10) / 4))));
  return (
    <Pannello titolo="// LA CHECKLIST È GRATIS">
      <div style={{ position: "absolute", left: 50, right: 50, top: 110, textAlign: "center", fontFamily: ANTON, fontSize: 110, lineHeight: 1.02, color: "#fff", textTransform: "uppercase" }}>Commenta<br /><span style={{ color: ACCENTO }}>ALGO</span></div>
      <div style={{ position: "absolute", left: 70, right: 70, top: 380, height: 110, borderRadius: 60, background: "#1d1a2b", border: "2px solid #ffffff22", display: "flex", alignItems: "center", padding: "0 30px", gap: 24, transform: `translateY(${(1 - a) * 60}px)`, opacity: a }}>
        <div style={{ width: 62, height: 62, borderRadius: 31, background: "#ffffff22" }} />
        <div style={{ flex: 1, fontFamily: INTER, fontSize: 44, fontWeight: 700, color: "#fff" }}>{testo}<span style={{ opacity: f % 20 < 10 ? 1 : 0 }}>|</span></div>
        <div style={{ width: 70, height: 70, borderRadius: 35, background: "#3b82f6", color: "#fff", fontSize: 44, display: "flex", alignItems: "center", justifyContent: "center" }}>↑</div>
      </div>
      <Nota x={120} y={530} d={42} rot={-4}>ti mando la checklist dei bot</Nota>
      <Timbro top={650} d={112} size={100} bg={VIOLA}>Seguimi</Timbro>
    </Pannello>
  );
};

// Meme sotto, sulle parole della voce: [file, frame d'inizio, durata]
const MEME: [string, number, number][] = [
  ["a_explain", 290, 45], ["j_math", 337, 53], ["h_pass", 501, 75], ["e_baby", 580, 70], ["b_getout", 794, 48], ["i_fine", 959, 60],
];
const MEME_DUR: Record<string, number> = { a_explain: 70, b_getout: 63, e_baby: 133, h_pass: 162, i_fine: 89, j_math: 88 };
const Meme: React.FC<{ nome: string }> = ({ nome }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = k(f, fps, 0, 11, 260);
  return (
    <AbsoluteFill style={{ backgroundColor: NERO, transform: `scale(${1.15 - 0.15 * a})`, opacity: Math.min(1, a * 2) }}>
      <Loop durationInFrames={MEME_DUR[nome]}>
        <OffthreadVideo src={staticFile(`algory1/meme/${nome}.mp4`)} muted style={{ width: "100%", height: "100%", objectFit: "contain" }} />
      </Loop>
    </AbsoluteFill>
  );
};

const DURATA = 1290;

// C in basso, come una «camera»: ritratto con zoom lento e piccolo colpo a ogni frase
const Camera: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const inizi = PAROLE.filter((p, i) => i === 0 || PAROLE[i - 1][2] !== p[2]).map((p) => p[0]);
  const ultimo = inizi.filter((a) => a <= t).pop() ?? 0;
  const colpo = k(f, fps, Math.round(ultimo * fps), 10, 240);
  const s = interpolate(f, [0, DURATA], [1.05, 1.25]) * (1.03 - 0.03 * colpo);
  return (
    <div style={{ position: "absolute", left: 80, right: 80, top: 1200, height: 620, borderRadius: 34, overflow: "hidden", border: `3px solid ${ACCENTO}66`, boxShadow: `0 0 70px ${VIOLA}55`, background: NERO }}>
      <Img src={staticFile("algory1/pers_C.png")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 22%", transform: `scale(${s})`, transformOrigin: "50% 35%" }} />
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
    <div style={{ position: "absolute", left: 80, top: 100, fontFamily: MONO, fontSize: 32, color: ACCENTO, letterSpacing: 2 }}>// IL MIO SISTEMA · ALGORY</div>
    <div style={{ position: "absolute", right: 80, top: 92, fontFamily: ANTON, fontSize: 44, color: "#fff", letterSpacing: 2 }}>MS <span style={{ fontFamily: MONO, fontSize: 30, color: "#cfcbd9" }}>#1</span></div>
  </>
);

export const ALGORY1: React.FC = () => {
  const f = useCurrentFrame();
  const tagli = [153, 290, 423, 548, 682, 842, 1002, 1139];
  const flash = tagli.some((c) => f >= c && f < c + 3);
  return (
    <AbsoluteFill style={{ backgroundColor: NERO, fontFamily: INTER }}>
      <AbsoluteFill style={{ backgroundImage: "linear-gradient(#ffffff08 1px,transparent 1px),linear-gradient(90deg,#ffffff08 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 30%, ${VIOLA}33, transparent 60%)` }} />
      <Sequence name="Conto" durationInFrames={153}><Conto /></Sequence>
      <Sequence name="Software" from={153} durationInFrames={137}><Software /></Sequence>
      <Sequence name="Migliaia" from={290} durationInFrames={133}><Strategie /></Sequence>
      <Sequence name="Dati mai visti" from={423} durationInFrames={125}><Strategie caduta={78} /></Sequence>
      <Sequence name="Piccole" from={548} durationInFrames={134}><Scala /></Sequence>
      <Sequence name="Crescono" from={682} durationInFrames={160}><Scala cambio /></Sequence>
      <Sequence name="Numeri" from={842} durationInFrames={160}><Numeri /></Sequence>
      <Sequence name="Vedi" from={1002} durationInFrames={137}><Vedi /></Sequence>
      <Sequence name="Finale" from={1139} durationInFrames={151}><Finale /></Sequence>
      <Camera />
      {flash ? <AbsoluteFill style={{ backgroundColor: "#fff", opacity: 0.3 }} /> : null}
      <Sottotitoli />
      <Cornice />
      <Audio src={staticFile("algory1/voce.wav")} volume={1} />
      <Audio src={staticFile("algory1/musica.wav")} volume={0.13} />
      <Audio src={staticFile("algory1/sfx.wav")} volume={0.45} />
    </AbsoluteFill>
  );
};
