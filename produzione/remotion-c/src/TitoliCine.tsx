// Titoli «da After Effects» fatti col codice (14/11/2026), per trailer e video lunghi di YouTube.
// Marco: «alcune scritte non mi piacciono e sono fatte male». Ricerca: nessuno ha decodificato After Effects;
// la strada gratis è rifare gli effetti in React/CSS. Qui ci sono gli effetti tipici dei preset di AE:
//  - lettere che entrano una alla volta con sfocatura di movimento (blur + scia) e assestamento a molla
//  - rilievo 3D (estrusione) con strati di ombra viola che scuriscono in profondità
//  - lampo di luce che attraversa le lettere (luce che scorre, «light sweep»)
//  - aberrazione cromatica (rosso/ciano sfasati) solo nei primi frame, come un colpo
//  - etichette con linea che si disegna, puntino che pulsa, cifra in Anton e nota in JetBrains Mono
import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ANTON, MONO, VIOLA } from "./FormatC";

const FPS = 30;
const F = (s: number) => Math.round(s * FPS);
const cl = (x: number) => Math.max(0, Math.min(1, x));
const ramp = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

// estrusione: n strati di ombra verso il basso a destra, dal viola al quasi nero
const estrusione = (n: number, dx = 1.2, dy = 1.6) =>
  Array.from({ length: n }, (_, k) => {
    const t = k / n;
    const c = `rgb(${Math.round(70 - 55 * t)},${Math.round(45 - 35 * t)},${Math.round(160 - 140 * t)})`;
    return `${((k + 1) * dx).toFixed(1)}px ${((k + 1) * dy).toFixed(1)}px 0 ${c}`;
  }).join(", ");

// una lettera che entra: da sotto, sfocata e larga, con scia, poi si assesta
const Lettera: React.FC<{ ch: string; d: number; stile: React.CSSProperties; aberr?: boolean }> = ({ ch, d, stile, aberr }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const m = spring({ frame: f - d, fps, config: { damping: 13, stiffness: 170, mass: 0.7 } });
  const v = Math.abs(1 - m); // velocità approssimata: più è lontano, più è sfocato
  const blur = Math.min(14, v * 22);
  const y = (1 - m) * 70;
  const ab = aberr ? Math.max(0, 1 - (f - d) / 7) * 9 : 0;
  if (f < d) return <span style={{ ...stile, opacity: 0 }}>{ch === " " ? " " : ch}</span>;
  return (
    <span style={{ position: "relative", display: "inline-block", transform: `translateY(${y}px) scaleY(${1 + v * 0.25})`, filter: blur > 0.3 ? `blur(${blur.toFixed(1)}px)` : undefined, opacity: cl(m * 1.6) }}>
      {ab > 0.3 && <span style={{ ...stile, position: "absolute", left: -ab, top: 0, color: "rgba(255,40,80,0.75)", textShadow: "none", WebkitTextStroke: undefined, mixBlendMode: "screen" }}>{ch}</span>}
      {ab > 0.3 && <span style={{ ...stile, position: "absolute", left: ab, top: 0, color: "rgba(40,220,255,0.75)", textShadow: "none", WebkitTextStroke: undefined, mixBlendMode: "screen" }}>{ch}</span>}
      <span style={stile}>{ch === " " ? " " : ch}</span>
    </span>
  );
};

// luce che scorre sopra al testo (maschera = il testo stesso grazie a background-clip)
const Luce: React.FC<{ testo: string; stile: React.CSSProperties; p: number }> = ({ testo, stile, p }) => (
  <div aria-hidden style={{ ...stile, position: "absolute", inset: 0, color: "transparent", textShadow: "none", WebkitTextStroke: "0px transparent",
    backgroundImage: `linear-gradient(105deg, transparent ${p * 140 - 30}%, rgba(255,255,255,0.95) ${p * 140 - 20}%, transparent ${p * 140 - 10}%)`,
    WebkitBackgroundClip: "text", backgroundClip: "text", pointerEvents: "none" }}>{testo}</div>
);

// ---------- TITOLO 3D con orario (sostituisce il titolo a contorno sottile) ----------
export const Titolo3D: React.FC<{ a: number; b: number; testo: string; ora?: string; x: number; y: number; size?: number; vuoto?: boolean; centro?: boolean }> = ({ a, b, testo, ora, x, y, size = 180, vuoto = false, centro = false }) => {
  const f = useCurrentFrame();
  if (f < F(a) || f > F(b)) return null;
  const u = ramp(f, F(b) - 6, F(b));
  const deriva = (f - F(a)) * 0.22;
  const stile: React.CSSProperties = {
    fontFamily: ANTON, fontSize: size, lineHeight: 1, letterSpacing: 4, textTransform: "uppercase",
    color: vuoto ? "rgba(255,255,255,0.04)" : "#fff",
    WebkitTextStroke: vuoto ? "4px #fff" : undefined,
    textShadow: `${estrusione(vuoto ? 0 : 14)}${vuoto ? "" : ", "}0 0 40px rgba(139,109,255,0.55), 0 18px 40px rgba(0,0,0,0.6)`,
  };
  const lettere = testo.split("");
  const pLuce = ramp(f, F(a) + 2 * lettere.length + 4, F(a) + 2 * lettere.length + 22);
  const eOra = Easing.out(Easing.cubic)(ramp(f, F(a) + 10, F(a) + 20));
  return (
    <div style={{ position: "absolute", left: centro ? 0 : x - deriva, right: centro ? 0 : undefined, top: y, textAlign: centro ? "center" : undefined, opacity: 1 - u, transform: `scale(${1 + u * 0.06})` }}>
      <div style={{ position: "relative", display: "inline-block", whiteSpace: "nowrap" }}>
        {lettere.map((ch, k) => <Lettera key={k} ch={ch} d={F(a) + 2 * k} stile={stile} aberr />)}
        {pLuce > 0 && pLuce < 1 && <Luce testo={testo} stile={{ ...stile, letterSpacing: 4 }} p={pLuce} />}
        {ora && (
          <div style={{ position: "absolute", right: 0, top: -size * 0.28, display: "flex", alignItems: "center", gap: 12, opacity: eOra }}>
            <div style={{ width: 70 * eOra, height: 2, background: "#fff", opacity: 0.8 }} />
            <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: Math.round(size * 0.17), color: "#fff", letterSpacing: 3, textShadow: "0 2px 12px #000" }}>{ora}</span>
          </div>
        )}
      </div>
    </div>
  );
};

// ---------- ETICHETTA nella scena: linea che si disegna, puntino che pulsa, cifra + nota ----------
export const Etichetta: React.FC<{ a: number; b: number; testo: string; nota?: string; x: number; y: number; dx: number; dy: number; col?: string; size?: number }> = ({ a, b, testo, nota, x, y, dx, dy, col = "#fff", size = 92 }) => {
  const f = useCurrentFrame();
  if (f < F(a) || f > F(b)) return null;
  const l = Easing.out(Easing.cubic)(ramp(f, F(a), F(a) + 10));
  const u = ramp(f, F(b) - 5, F(b));
  const deriva = (f - F(a)) * 0.3;
  const len = Math.hypot(dx, dy), ang = (Math.atan2(dy, dx) * 180) / Math.PI;
  const pulsa = 1 + 0.6 * Math.max(0, Math.sin((f - F(a)) / 5));
  const destra = dx >= 0;
  return (
    <div style={{ position: "absolute", left: x - deriva, top: y, opacity: 1 - u }}>
      <div style={{ position: "absolute", left: -18 * pulsa, top: -18 * pulsa, width: 36 * pulsa, height: 36 * pulsa, borderRadius: 99, border: `2px solid ${col}`, opacity: 0.5 / pulsa }} />
      <div style={{ position: "absolute", left: -8, top: -8, width: 16, height: 16, borderRadius: 8, background: col, boxShadow: `0 0 16px ${col}` }} />
      <div style={{ position: "absolute", left: 0, top: -1.5, width: len * l, height: 3, background: col, transform: `rotate(${ang}deg)`, transformOrigin: "0 50%", boxShadow: "0 0 10px rgba(0,0,0,0.7)" }} />
      <div style={{ position: "absolute", left: dx + (destra ? 22 : -22), top: dy, transform: `translate(${destra ? 0 : -100}%, -55%)`, whiteSpace: "nowrap", textAlign: destra ? "left" : "right" }}>
        <div style={{ display: "inline-block", position: "relative" }}>
          {testo.split("").map((ch, k) => (
            <Lettera key={k} ch={ch} d={F(a) + 7 + k} stile={{ fontFamily: ANTON, fontSize: size, lineHeight: 1, color: col, letterSpacing: 1, textShadow: `${estrusione(6, 1, 1.3)}, 0 4px 24px rgba(0,0,0,0.8)` }} />
          ))}
        </div>
        {nota && <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 24, color: "#d8d4ea", letterSpacing: 4, marginTop: 4, opacity: ramp(f, F(a) + 14, F(a) + 22), textShadow: "0 2px 10px #000" }}>{nota}</div>}
      </div>
    </div>
  );
};

// ---------- FRASE piccola + PAROLA enorme in 3D (come «tu non sei come LORO») ----------
export const Frase3D: React.FC<{ a: number; b: number; piccolo: string; grande: string; x: number; y: number; size?: number; accento?: boolean; centro?: boolean }> = ({ a, b, piccolo, grande, x, y, size = 210, accento = false, centro = false }) => {
  const f = useCurrentFrame();
  if (f < F(a) || f > F(b)) return null;
  const u = ramp(f, F(b) - 5, F(b));
  const ePic = Easing.out(Easing.cubic)(ramp(f, F(a), F(a) + 8));
  const d0 = F(a) + 8;
  const stile: React.CSSProperties = { fontFamily: ANTON, fontSize: size, lineHeight: 0.95, color: "#fff", letterSpacing: 2, textTransform: "uppercase",
    textShadow: `${estrusione(16)}, 0 0 50px rgba(139,109,255,0.45), 0 20px 50px rgba(0,0,0,0.7)` };
  const nL = grande.length;
  const pSott = Easing.inOut(Easing.cubic)(ramp(f, d0 + 2 * nL, d0 + 2 * nL + 10));
  return (
    <div style={{ position: "absolute", left: centro ? 0 : x, right: centro ? 0 : undefined, textAlign: centro ? "center" : undefined, top: y, opacity: 1 - u }}>
      {piccolo && <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 34, color: "#fff", letterSpacing: 6, textTransform: "uppercase", opacity: ePic, transform: `translateX(${(1 - ePic) * -30}px)`, textShadow: "0 2px 14px #000", marginBottom: 10, marginLeft: 6 }}>{piccolo}</div>}
      <div style={{ position: "relative", display: "inline-block", whiteSpace: "nowrap" }}>
        {grande.split("").map((ch, k) => <Lettera key={k} ch={ch} d={d0 + 2 * k} stile={stile} aberr />)}
        {accento && <div style={{ position: "absolute", left: 4, bottom: -22, height: 16, width: `${pSott * 100}%`, background: VIOLA, boxShadow: `0 0 30px ${VIOLA}` }} />}
      </div>
    </div>
  );
};

// ---------- lampo di luce calda sugli stacchi (light leak finto, gratis) ----------
export const LampoLuce: React.FC<{ tempi: number[]; durata?: number }> = ({ tempi, durata = 10 }) => {
  const f = useCurrentFrame();
  const t = tempi.find((x) => f >= F(x) && f < F(x) + durata);
  if (t === undefined) return null;
  const p = (f - F(t)) / durata;
  const o = Math.sin(p * Math.PI) * 0.55;
  const x = 20 + p * 60;
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", mixBlendMode: "screen", opacity: o,
      background: `radial-gradient(ellipse 60% 90% at ${x}% 40%, rgba(255,170,90,0.95), rgba(255,80,140,0.45) 40%, rgba(0,0,0,0) 75%)` }} />
  );
};
