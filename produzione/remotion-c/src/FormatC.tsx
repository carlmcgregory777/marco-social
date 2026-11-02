// Format «C in camera» (31/10/2026): C parla da più inquadrature nella sua stanza,
// spezzoni di copertura, grafiche a tutto schermo sopra lo sfondo sfocato del set,
// sottotitoli karaoke ed effetti in stile After Effects. Ogni episodio passa solo SCENE, PAROLE e le grafiche.
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
import { loadFont as loadCaveat } from "@remotion/google-fonts/Caveat";
import { loadFont as loadElite } from "@remotion/google-fonts/SpecialElite";

export const { fontFamily: ANTON } = loadAnton();
export const { fontFamily: INTER } = loadInter();
export const { fontFamily: MONO } = loadMono();
export const { fontFamily: MANO } = loadCaveat();
export const { fontFamily: MACCHINA } = loadElite();

export const VIOLA = "#5b3fd6";
export const ACCENTO = "#8b6dff";
export const NERO = "#0b0a10";
export const ROSSO = "#ff4d5e";
export const VERDE = "#2ecc71";

export type Parola = [number, string, number];
// zoom: ingrandimento di base dello spezzone (es. 1.4 = primissimo piano ritagliato dal frontale)
export type Scena = { from: number; dur: number; clip?: string; inizio?: number; zoom?: number; grafica?: React.ReactNode; sopra?: React.ReactNode; secco?: boolean };

export const molla = (f: number, fps: number, d = 0, damping = 12, stiffness = 200) => spring({ frame: f - d, fps, config: { damping, stiffness } });

// Spezzone video con push-in lento e «punch-in» sulle frasi indicate (frame relativi)
// jump: ogni nuova frase alterna inquadratura larga e stretta con un taglio secco (jump cut)
// enfasi: frame della parola forte, zoom di scatto che resta per ~1 s
const Clip: React.FC<{ src: string; inizio: number; punch: number[]; zoom?: number; jump?: boolean; enfasi?: number[] }> = ({ src, inizio, punch, zoom = 1, jump = false, enfasi = [] }) => {
  const f = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const passati = punch.filter((p) => p <= f);
  const ultimo = passati[passati.length - 1];
  const colpo = jump || ultimo === undefined ? 0 : 1 - molla(f, fps, ultimo, 14, 260);
  const stretto = jump && passati.length % 2 === 1 ? 0.12 : 0;
  const e = enfasi.filter((p) => p <= f && f - p < 34).pop();
  const scatto = e === undefined ? 0 : 0.2 * molla(f, fps, e, 18, 520) * interpolate(f - e, [26, 34], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const s = zoom * interpolate(f, [0, durationInFrames], [1.0, 1.06]) + 0.08 * Math.max(0, colpo) + stretto + scatto;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(src)} startFrom={inizio} muted style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${s})`, transformOrigin: "50% 38%" }} />
    </AbsoluteFill>
  );
};

// Sfondo delle grafiche: il set sfocato e scurito, così sembra sempre la stessa stanza
export const SfondoSet: React.FC<{ img: string }> = ({ img }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: NERO }}>
      <Img src={staticFile(img)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(28px) brightness(0.35) saturate(1.3)", transform: `scale(${1.15 + f * 0.0006})` }} />
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 40%, ${VIOLA}40, transparent 65%)` }} />
    </AbsoluteFill>
  );
};

// Entrata di scena: zoom con sfocatura di movimento (stile «zoom transition» di After Effects)
const Entrata: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  const t = interpolate(f, [0, 7], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  return <AbsoluteFill style={{ transform: `scale(${1 + 0.22 * t})`, filter: t > 0.01 ? `blur(${14 * t}px)` : undefined }}>{children}</AbsoluteFill>;
};

// Scossa breve dell'inquadratura sulle parole forti
const Scossa: React.FC<{ enfasi: number[]; children: React.ReactNode }> = ({ enfasi, children }) => {
  const f = useCurrentFrame();
  const e = enfasi.filter((p) => p <= f && f - p < 8).pop();
  const k = e === undefined ? 0 : (8 - (f - e)) / 8;
  return <AbsoluteFill style={{ transform: k ? `translate(${Math.sin(f * 9.1) * 14 * k}px, ${Math.cos(f * 7.3) * 10 * k}px)` : undefined }}>{children}</AbsoluteFill>;
};

// Titolo fisso in alto stile Cosentino: riquadro nero, maiuscolo da macchina da scrivere, svolta in giallo
export const TitoloFisso: React.FC<{ righe: string[]; svolta?: string; top?: number }> = ({ righe, svolta, top = 200 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = molla(f, fps, 0, 14, 220);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top, display: "flex", flexDirection: "column", alignItems: "center", transform: `translateY(${(1 - a) * -40}px)`, opacity: a }}>
      {[...righe, ...(svolta ? [svolta] : [])].map((r, i) => (
        <div key={i} style={{ fontFamily: MACCHINA, fontSize: i === righe.length ? 44 : 56, lineHeight: 1.15, color: i === righe.length ? "#ffd84d" : "#fff", background: "#000", padding: "6px 22px", textTransform: "uppercase", letterSpacing: 1 }}>{r}</div>
      ))}
    </div>
  );
};

// Lampo + luce viola che attraversa lo schermo sui tagli
const Taglio: React.FC = () => {
  const f = useCurrentFrame();
  const lampo = interpolate(f, [0, 3], [0.55, 0], { extrapolateRight: "clamp" });
  const x = interpolate(f, [0, 14], [-60, 160], { extrapolateRight: "clamp" });
  const a = interpolate(f, [0, 4, 14], [0, 0.7, 0], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ backgroundColor: "#fff", opacity: lampo }} />
      <AbsoluteFill style={{ background: `linear-gradient(105deg, transparent ${x - 30}%, ${ACCENTO}aa ${x}%, #ffd6ff66 ${x + 6}%, transparent ${x + 30}%)`, mixBlendMode: "screen", opacity: a }} />
    </AbsoluteFill>
  );
};

// Scritta che esplode in scena con rimbalzo e scia (motion blur finto)
export const Sticker: React.FC<{ d: number; top: number; children: React.ReactNode; size?: number; bg?: string; color?: string; rot?: number; fino?: number }> = ({ d, top, children, size = 120, bg, color = "#fff", rot = -3, fino }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < d || (fino !== undefined && f > fino)) return null;
  const a = molla(f, fps, d, 9, 240);
  const scia = Math.max(0, 1 - a);
  const esce = fino === undefined ? 1 : interpolate(f, [fino - 6, fino], [1, 0], { extrapolateLeft: "clamp" });
  const box = (o: number, dy: number) => (
    <div style={{ position: "absolute", left: 0, right: 0, top: top + dy, textAlign: "center", opacity: o * esce, transform: `scale(${0.3 + 0.7 * a}) rotate(${rot * a}deg)` }}>
      <span style={{ fontFamily: ANTON, fontSize: size, lineHeight: 1.05, color, textTransform: "uppercase", background: bg, padding: bg ? "6px 34px" : 0, borderRadius: 18, WebkitTextStroke: bg ? undefined : "8px #000", paintOrder: "stroke fill", boxShadow: bg ? `0 16px 50px #000a, 0 0 60px ${bg}88` : undefined }}>{children}</span>
    </div>
  );
  return (
    <>
      {scia > 0.05 ? box(0.25 * scia, 40 * scia) : null}
      {box(Math.min(1, a * 1.6), 0)}
    </>
  );
};

// Numero che conta
export const Conta: React.FC<{ d: number; da: number; a: number; durata?: number; top: number; suffisso?: string; size?: number; color?: string }> = ({ d, da, a, durata = 30, top, suffisso = "", size = 160, color = "#fff" }) => {
  const f = useCurrentFrame();
  if (f < d) return null;
  const v = Math.round(interpolate(f, [d, d + durata], [da, a], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }));
  const txt = v >= 1000 ? `${Math.floor(v / 1000)}.${String(v % 1000).padStart(3, "0")}` : String(v);
  return <div style={{ position: "absolute", left: 0, right: 0, top, textAlign: "center", fontFamily: ANTON, fontSize: size, color, WebkitTextStroke: "10px #000", paintOrder: "stroke fill", textShadow: `0 0 60px ${VIOLA}` }}>{txt}{suffisso}</div>;
};

// Nota scritta a mano che si disegna
export const Nota: React.FC<{ children: React.ReactNode; x: number; y: number; d: number; rot?: number; color?: string; size?: number }> = ({ children, x, y, d, rot = -4, color = ACCENTO, size = 68 }) => {
  const f = useCurrentFrame();
  const w = interpolate(f, [d, d + 18], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <div style={{ position: "absolute", left: x, top: y, fontFamily: MANO, fontSize: size, fontWeight: 700, color, transform: `rotate(${rot}deg)`, clipPath: `inset(0 ${100 - w}% 0 0)`, whiteSpace: "nowrap", textShadow: "0 4px 18px #000, 0 0 2px #000" }}>{children}</div>;
};

// Scheda in vetro inclinata in 3D che si raddrizza
export const Card3D: React.FC<{ d: number; x: number; y: number; w: number; h: number; children: React.ReactNode; colore?: string }> = ({ d, x, y, w, h, children, colore = ACCENTO }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < d) return null;
  const a = molla(f, fps, d, 13, 170);
  const luce = interpolate(f, [d + 6, d + 30], [-40, 140], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, perspective: 1400 }}>
      <div style={{ width: "100%", height: "100%", borderRadius: 30, border: `3px solid ${colore}`, background: `linear-gradient(160deg, #1d1636ee, #0b0a10f0)`, boxShadow: `0 30px 80px #000c, 0 0 70px ${colore}55`, transform: `rotateX(${(1 - a) * 35}deg) rotateY(${(1 - a) * -25}deg) translateY(${(1 - a) * 120}px)`, opacity: Math.min(1, a * 1.5), overflow: "hidden", position: "relative" }}>
        {children}
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(110deg, transparent ${luce - 20}%, #ffffff22 ${luce}%, transparent ${luce + 20}%)` }} />
      </div>
    </div>
  );
};

// Box commento finto (CTA)
export const BoxCommento: React.FC<{ d: number; parola: string; top: number }> = ({ d, parola, top }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < d) return null;
  const a = molla(f, fps, d, 12, 200);
  const testo = parola.slice(0, Math.max(0, Math.min(parola.length, Math.floor((f - d - 6) / 3))));
  return (
    <div style={{ position: "absolute", left: 90, right: 90, top, height: 116, borderRadius: 60, background: "#1d1a2bf2", border: "2px solid #ffffff33", display: "flex", alignItems: "center", padding: "0 30px", gap: 24, transform: `translateY(${(1 - a) * 80}px) scale(${0.9 + 0.1 * a})`, opacity: a, boxShadow: "0 20px 60px #000c" }}>
      <div style={{ width: 64, height: 64, borderRadius: 32, background: `linear-gradient(${ACCENTO},${VIOLA})` }} />
      <div style={{ flex: 1, fontFamily: INTER, fontSize: 48, fontWeight: 800, color: "#fff" }}>{testo}<span style={{ opacity: f % 20 < 10 ? 1 : 0 }}>|</span></div>
      <div style={{ width: 74, height: 74, borderRadius: 37, background: "#3b82f6", color: "#fff", fontSize: 46, display: "flex", alignItems: "center", justifyContent: "center" }}>↑</div>
    </div>
  );
};

// Sottotitoli karaoke: gruppo di max 3 parole, la parola detta si accende, le chiave in viola e rimbalzano
const Sottotitoli: React.FC<{ parole: Parola[]; chiave: RegExp; top: number }> = ({ parole, chiave, top }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const viste = parole.filter(([a]) => t >= a);
  if (!viste.length) return null;
  const ult = viste[viste.length - 1];
  const gruppo = parole.filter((p) => p[2] === ult[2]);
  const idx = gruppo.indexOf(ult);
  const inizio = Math.floor(idx / 3) * 3;
  const blocco = gruppo.slice(inizio, inizio + 3);
  return (
    <div style={{ position: "absolute", left: 30, right: 30, top, textAlign: "center", fontFamily: ANTON, fontSize: 100, lineHeight: 1.08, textTransform: "uppercase", WebkitTextStroke: "11px #000", paintOrder: "stroke fill", whiteSpace: "nowrap" }}>
      {blocco.map(([a, p]) => {
        const detta = t >= a;
        const s = molla(f, fps, Math.round(a * fps), 11, 280);
        const k = chiave.test(p.toUpperCase());
        const col = !detta ? "#ffffff66" : k ? ACCENTO : "#fff";
        return <span key={a} style={{ display: "inline-block", margin: "0 12px", color: col, transform: detta ? `scale(${(k ? 1.12 : 1) * (0.82 + 0.18 * s)}) translateY(${(1 - s) * 18}px)` : "scale(0.9)", textShadow: k && detta ? `0 0 40px ${VIOLA}` : "0 6px 20px #000a" }}>{p}</span>;
      })}
    </div>
  );
};

// Sottotitoli piccoli stile creator: max 3 parole, la parola chiave su fondo viola
const SottotitoliPiccoli: React.FC<{ parole: Parola[]; chiave: RegExp; top: number }> = ({ parole, chiave, top }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const viste = parole.filter(([a]) => t >= a);
  if (!viste.length) return null;
  const ult = viste[viste.length - 1];
  const gruppo = parole.filter((p) => p[2] === ult[2]);
  const idx = gruppo.indexOf(ult);
  const inizio = Math.floor(idx / 3) * 3;
  const blocco = gruppo.slice(inizio, inizio + 3);
  const entra = molla(f, fps, Math.round(blocco[0][0] * fps), 14, 300);
  return (
    <div style={{ position: "absolute", left: 40, right: 40, top, textAlign: "center", fontFamily: INTER, fontWeight: 900, fontSize: 64, lineHeight: 1.2, textTransform: "uppercase", whiteSpace: "nowrap", transform: `scale(${0.9 + 0.1 * entra})` }}>
      {blocco.map(([a, p]) => {
        const detta = t >= a;
        const k = chiave.test(p.toUpperCase());
        const s = molla(f, fps, Math.round(a * fps), 10, 320);
        return <span key={a} style={{ display: "inline-block", margin: "0 8px", padding: k ? "0 14px" : 0, borderRadius: 10, background: k && detta ? VIOLA : "transparent", color: detta ? "#fff" : "#ffffff55", WebkitTextStroke: k && detta ? undefined : "6px #000", paintOrder: "stroke fill", transform: k && detta ? `scale(${1.06 + 0.15 * (1 - s)}) rotate(-2deg)` : undefined, boxShadow: k && detta ? `0 8px 30px #000a, 0 0 40px ${VIOLA}` : undefined }}>{p}</span>;
      })}
    </div>
  );
};

// Grana e vignetta, per il look «girato con la camera»
const Grana: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 55%, #000a 100%)" }} />
      <svg width="100%" height="100%" style={{ position: "absolute", opacity: 0.07, mixBlendMode: "overlay" }}>
        <filter id="g"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={f % 8} /></filter>
        <rect width="100%" height="100%" filter="url(#g)" />
      </svg>
    </AbsoluteFill>
  );
};

const Barra: React.FC = () => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return <div style={{ position: "absolute", left: 0, bottom: 0, height: 8, width: `${(f / durationInFrames) * 100}%`, background: `linear-gradient(90deg,${VIOLA},${ACCENTO})`, boxShadow: `0 0 20px ${ACCENTO}` }} />;
};

// secco: jump cut dentro la stessa scena (pausa tagliata), senza entrata né lampo
const Contenitore: React.FC<{ secco?: boolean; children: React.ReactNode }> = ({ secco, children }) => (secco ? <AbsoluteFill>{children}</AbsoluteFill> : <Entrata>{children}</Entrata>);

export const FormatC: React.FC<{
  scene: Scena[];
  parole: Parola[];
  chiave: RegExp;
  cartella: string;
  etichetta: string;
  sottotitoliTop?: number;
  titolo?: React.ReactNode;
  piccoli?: boolean;
  jump?: boolean;
  enfasi?: number[];
  voce?: string;
  musicaVol?: number;
  extra?: React.ReactNode;
}> = ({ scene, parole, chiave, cartella, etichetta, sottotitoliTop = 1340, titolo, piccoli = false, jump = false, enfasi = [], voce = "voce.wav", musicaVol = 0.13, extra }) => {
  const { fps } = useVideoConfig();
  const punch = parole.filter((p, i) => i === 0 || parole[i - 1][2] !== p[2]).map((p) => Math.round(p[0] * fps));
  const enf = enfasi.map((e) => Math.round(e * fps));
  return (
    <AbsoluteFill style={{ backgroundColor: NERO, fontFamily: INTER }}>
      <Scossa enfasi={enf}>
        {scene.map((s, i) => (
          <Sequence key={i} from={s.from} durationInFrames={s.dur}>
            <Contenitore secco={s.secco}>
              {s.clip ? <Clip src={`${cartella}/${s.clip}`} inizio={s.inizio ?? 0} zoom={s.zoom} jump={jump} enfasi={enf.map((p) => p - s.from).filter((p) => p >= 0 && p < s.dur)} punch={punch.map((p) => p - s.from).filter((p) => p > 0 && p < s.dur)} /> : null}
              {s.grafica}
            </Contenitore>
            {s.sopra}
            {i > 0 && !s.secco ? <Taglio /> : null}
          </Sequence>
        ))}
        {extra}
      </Scossa>
      <Grana />
      {piccoli ? <SottotitoliPiccoli parole={parole} chiave={chiave} top={sottotitoliTop} /> : <Sottotitoli parole={parole} chiave={chiave} top={sottotitoliTop} />}
      {titolo ?? <div style={{ position: "absolute", left: 60, top: 70, fontFamily: MONO, fontSize: 28, color: "#ffffffcc", letterSpacing: 2, textShadow: "0 2px 10px #000" }}>{etichetta}</div>}
      <Barra />
      <Audio src={staticFile(`${cartella}/${voce}`)} volume={1} />
      <Audio src={staticFile(`${cartella}/musica.wav`)} volume={musicaVol} />
      <Audio src={staticFile(`${cartella}/sfx.wav`)} volume={0.4} />
    </AbsoluteFill>
  );
};
