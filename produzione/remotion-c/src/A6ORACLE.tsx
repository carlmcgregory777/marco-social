// Attualità di C #6 «Vi stanno vendendo una favola» — v5 (07/11/2026), rifatto da zero.
// La v4 (JASHI4) è in attualita/A6-oracle/lavoro/A6ORACLE-jashi4.tsx.txt.
//
// Cosa cambia rispetto alla v4 (correzioni di Marco):
//  1. formato «Guarda questo»: C apre → LA FONTE VERA a tutto schermo col suo audio
//     (Bloomberg TV del 4/11/2026, «Oracle scraps $7B deal to lease chips to Tencent: FT»)
//     con i sottotitoli in italiano → C smonta.
//  2. C sempre intero, microfono sempre visibile: niente zoom che taglia, niente schede sopra.
//     Layout diviso: schede in ALTO (0-860), C in BASSO (860-1920). Due momenti a tutto schermo.
//  3. schede grandi, una ogni 2-4 s, agganciate alle parole (a6oracle-schede.ts, generato
//     da attualita/A6-oracle/montaggio/schede.py). Nessuna scheda vuota.
//  4. finale animato, non fermo.
// Fatti verificati il 07/11/2026: tabella in attualita/A6-oracle/copione.md.
//
// Tempi: la voce-c (A+B senza la fonte) è la scala di PAROLE_A6 e SCHEDE_A6.
//   A  = «Guarda questo.»  0 → A_DUR
//   FONTE (Bloomberg)      A_DUR → FONTE_B
//   B  = il resto          FONTE_B → fine  (tempo voce-c = t video - FONTE_B + A_DUR)
import React from "react";
import { AbsoluteFill, Audio, Img, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ACCENTO, ANTON, INTER, MANO, MONO, molla, NERO, Sticker, VERDE, VIOLA } from "./FormatC";
import { CHIAVE_A6ORACLE as CHIAVE_A6, PAROLE_A6ORACLE as PAROLE_A6 } from "./a6oracle-parole";
import { FINE_VOCE_A6, SCHEDE_A6 } from "./a6oracle-schede";

const CARTELLA = "a6oracle";
const F = (s: number) => Math.round(s * 30);
const ROSSO_R = "#e0494f";
const GIALLO = "#ffd84d";

const A_DUR = 0.75;            // «Guarda questo.»
const FONTE_DUR = 13.3;        // fonte-bbg.mp4
const FONTE_B = A_DUR + FONTE_DUR;
const OUTRO = 2.2;             // dopo l'ultima parola
export const DURATA_A6 = F(FONTE_B + FINE_VOCE_A6 - A_DUR + OUTRO);
const vt = (tc: number) => tc - A_DUR + FONTE_B; // tempo voce-c → tempo video (blocco B)

const ZONA_C = 860; // da qui in giù c'è C

type Scheda = { t: number; fino: number; tipo: string; [k: string]: any };
const SCHEDE = SCHEDE_A6 as Scheda[];

// ---------- C che parla ----------
// Un solo OffthreadVideo per tutto il blocco B (non si rimonta: il labiale non salta).
// Cambia solo la cornice: «diviso» (C in basso, testa e microfono interi) o «pieno».
const CParla: React.FC<{ clip: string; off: number; sempre?: "pieno" }> = ({ clip, off, sempre }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tc = off + f / fps;
  const s = SCHEDE.find((x) => tc >= x.t && tc < x.fino);
  const pieno = sempre === "pieno" || !s || s.tipo === "pieno";
  // jump cut leggero a ogni frase (1,00 ↔ 1,06), centrato sulla faccia: il microfono resta dentro
  const n = PAROLE_A6.filter((p, i) => (i === 0 || PAROLE_A6[i - 1][2] !== p[2]) && p[0] <= tc).length;
  const z = (n % 2 === 0 ? 1.0 : 1.06) + 0.01 * Math.sin(f / 70);
  // il video è 464×832 → largo 1080 = alto 1936. Nel diviso mostro la fascia 310→1370 (capelli → microfono).
  const stile: React.CSSProperties = pieno
    ? { position: "absolute", left: 0, top: -8, width: 1080, height: 1936 }
    : { position: "absolute", left: 0, top: ZONA_C - 310, width: 1080, height: 1936 };
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <div style={{ ...stile, transform: `scale(${z})`, transformOrigin: "50% 30%" }}>
        <OffthreadVideo src={staticFile(`${CARTELLA}/${clip}`)} muted style={{ width: "100%", height: "100%" }} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- sfondo della zona schede ----------
const ZonaAlta: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: ZONA_C + 90 }}>
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${NERO} 0%, #120f22 ${(ZONA_C / (ZONA_C + 90)) * 100 - 6}%, transparent 100%)` }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: ZONA_C, backgroundImage: "linear-gradient(#ffffff0b 2px, transparent 2px), linear-gradient(90deg, #ffffff0b 2px, transparent 2px)", backgroundSize: "60px 60px", backgroundPosition: `0 ${(f * 0.6) % 60}px`, maskImage: "linear-gradient(180deg, #000 70%, transparent)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: ZONA_C, background: `radial-gradient(circle at 50% 45%, ${VIOLA}40, transparent 65%)` }} />
    </div>
  );
};

// ---------- mattoni delle schede ----------
const entra = (f: number, fps: number, d: number, k = 0) => molla(f, fps, d + k * 4, 12, 230);

// riga con parole: "*parola" = riquadro viola, "!parola" = riquadro rosso (vale per il resto della riga)
const Riga: React.FC<{ testo: string; size: number }> = ({ testo, size }) => {
  const i = testo.search(/[*!]/);
  if (i < 0) return <span>{testo}</span>;
  const col = testo[i] === "*" ? VIOLA : ROSSO_R;
  return (
    <span>
      {testo.slice(0, i)}
      <span style={{ background: col, padding: `0 ${size * 0.14}px`, borderRadius: size * 0.12, boxShadow: `0 0 50px ${col}aa`, display: "inline-block", lineHeight: 1.0 }}>{testo.slice(i + 1)}</span>
    </span>
  );
};

const Sopra: React.FC<{ d: number; children: React.ReactNode; top?: number }> = ({ d, children, top = 150 }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [d, d + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <div style={{ position: "absolute", left: 40, right: 40, top, textAlign: "center", fontFamily: MONO, fontSize: 34, letterSpacing: 5, color: ACCENTO, opacity: o }}>{children}</div>;
};

const Tit: React.FC<{ s: Scheda; d: number }> = ({ s, d }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const righe: string[] = s.righe;
  const size = s.grande ? 200 : righe.length >= 3 ? 122 : 150;
  const h = righe.length * size * 1.08;
  const top = (s.sopra ? 215 : 150) + (560 - h) / 2 - 30;
  const respiro = 1 + 0.025 * interpolate(f, [d, F(s.fino) - F(s.t) + d], [0, 1], { extrapolateRight: "clamp" });
  return (
    <>
      {s.sopra ? <Sopra d={d}>{s.sopra}</Sopra> : null}
      <div style={{ position: "absolute", left: 30, right: 30, top, textAlign: "center", fontFamily: ANTON, fontSize: size, lineHeight: 1.08, color: "#fff", textTransform: "uppercase", transform: `scale(${respiro})` }}>
        {righe.map((r, k) => {
          const a = entra(f, fps, d, k);
          return (
            <div key={k} style={{ transform: `translateY(${(1 - a) * 90}px) scale(${0.7 + 0.3 * a})`, opacity: Math.min(1, a * 1.8), textShadow: "0 10px 30px #000c" }}>
              <Riga testo={r} size={size} />
            </div>
          );
        })}
      </div>
    </>
  );
};

const Tre: React.FC<{ s: Scheda; d: number }> = ({ s, d }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <>
      {(s.voci as [number, string, string][]).map(([t, num, lab], k) => {
        const dk = d + F(t) - F(s.t);
        if (f < dk) return null;
        const a = molla(f, fps, dk, 10, 260);
        return (
          <div key={k} style={{ position: "absolute", left: 60, right: 60, top: 140 + k * 200, height: 180, display: "flex", alignItems: "center", gap: 36, transform: `translateX(${(1 - a) * -300}px)`, opacity: Math.min(1, a * 1.6) }}>
            <div style={{ fontFamily: ANTON, fontSize: 150, color: k === 1 ? GIALLO : "#fff", lineHeight: 1, textShadow: "0 10px 30px #000c", minWidth: 560, textAlign: "right" }}>{num}</div>
            <div style={{ fontFamily: MONO, fontSize: 34, color: ACCENTO, letterSpacing: 3 }}>{lab}</div>
          </div>
        );
      })}
    </>
  );
};

const Riquadro: React.FC<{ d: number; x: number; w: number; titolo: string; sotto: string; esito?: "ok" | "ko"; da?: "sx" | "dx" }> = ({ d, x, w, titolo, sotto, esito, da = "sx" }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < d) return null;
  const a = molla(f, fps, d, 12, 230);
  const col = esito === "ko" ? ROSSO_R : esito === "ok" ? VERDE : ACCENTO;
  const timbro = esito ? molla(f, fps, d + 8, 9, 300) : 0;
  return (
    <div style={{ position: "absolute", left: x, top: 190, width: w, height: 420, borderRadius: 32, background: "#15122aee", border: `6px solid ${col}`, boxShadow: `0 24px 70px #000c, 0 0 60px ${col}55`, transform: `translateX(${(1 - a) * (da === "sx" ? -200 : 200)}px) scale(${0.8 + 0.2 * a})`, opacity: Math.min(1, a * 1.7), display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 20 }}>
      <div style={{ fontFamily: ANTON, fontSize: titolo.length > 11 ? 72 : titolo.length > 8 ? 84 : 104, color: "#fff", lineHeight: 1.05 }}>{titolo}</div>
      {sotto ? <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 52, color: "#ffffffdd", marginTop: 18, lineHeight: 1.12 }}>{sotto}</div> : null}
      {esito ? <div style={{ position: "absolute", top: -50, right: -26, width: 110, height: 110, borderRadius: 55, background: col, color: "#fff", fontFamily: INTER, fontWeight: 900, fontSize: 70, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${timbro}) rotate(${(1 - timbro) * 90}deg)`, boxShadow: "0 10px 30px #000a" }}>{esito === "ok" ? "✓" : "✗"}</div> : null}
    </div>
  );
};

const Vs: React.FC<{ s: Scheda; d: number }> = ({ s, d }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const db = d + F(s.t_b ?? s.t + 1.2) - F(s.t);
  const conEsito = s.ko_a || s.ko_b;
  const ea = s.ko_a ? "ko" : s.ko_b ? "ok" : undefined;
  const eb = s.ko_b ? "ko" : s.ko_a ? "ok" : undefined;
  const ne = s.diverso ? molla(f, fps, db + 6, 8, 300) : 0;
  return (
    <>
      <Riquadro d={d} x={40} w={480} titolo={s.a[0]} sotto={s.a[1]} esito={conEsito && f >= db ? ea : undefined} />
      <Riquadro d={db} x={560} w={480} titolo={s.b[0]} sotto={s.b[1]} esito={eb} da="dx" />
      {s.diverso && f >= db ? <div style={{ position: "absolute", left: 0, right: 0, top: 290, textAlign: "center", fontFamily: ANTON, fontSize: 220, color: GIALLO, transform: `scale(${ne})`, textShadow: "0 10px 40px #000" }}>≠</div> : null}
    </>
  );
};

const Via: React.FC<{ s: Scheda; d: number }> = ({ s, d }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = entra(f, fps, d);
  const riga = interpolate(f, [d + 10, d + 20], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const db = s.t_b !== undefined ? d + F(s.t_b) - F(s.t) : Infinity;
  const b = f >= db ? molla(f, fps, db, 9, 280) : 0;
  const size = s.testo.length > 14 ? 100 : 140;
  return (
    <>
      <div style={{ position: "absolute", left: 30, right: 30, top: s.nuovo ? 170 + b * -10 : 300, textAlign: "center", transform: `scale(${(0.7 + 0.3 * a) * (1 - 0.3 * b)})`, opacity: Math.min(1, a * 1.8) * (1 - 0.45 * b) }}>
        <span style={{ position: "relative", fontFamily: ANTON, fontSize: size, color: "#fff", textShadow: "0 10px 30px #000c" }}>
          {s.testo}
          <span style={{ position: "absolute", left: -20, top: "52%", height: size * 0.12, width: `calc(${riga}% + 40px)`, background: ROSSO_R, borderRadius: 10, transform: "rotate(-4deg)", boxShadow: "0 4px 14px #000a" }} />
        </span>
      </div>
      {s.nuovo && b > 0 ? (
        <div style={{ position: "absolute", left: 30, right: 30, top: 380, textAlign: "center", fontFamily: ANTON, fontSize: s.nuovo.length > 10 ? 130 : 210, color: GIALLO, transform: `scale(${0.4 + 0.6 * b}) rotate(${(1 - b) * -8}deg)`, textShadow: "0 12px 40px #000" }}>{s.nuovo}</div>
      ) : null}
    </>
  );
};

const Giornale: React.FC<{ s: Scheda; d: number }> = ({ s, d }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = molla(f, fps, d, 11, 200);
  const deriva = interpolate(f - d, [0, 150], [0, 1], { extrapolateRight: "clamp" });
  const w = interpolate(f, [d + 14, d + 30], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <>
      <div style={{ position: "absolute", left: 70, width: 940, top: 170, height: 400, background: "#f4f1ea", borderRadius: 10, boxShadow: "0 30px 80px #000e", transform: `translateY(${(1 - a) * 300}px) rotate(${-2.5 + deriva * 1.2}deg) scale(${1 + deriva * 0.03})`, padding: "34px 50px", color: "#111" }}>
        <div style={{ fontFamily: MONO, fontSize: 28, letterSpacing: 6, borderBottom: "3px solid #111", paddingBottom: 12 }}>{s.testata}</div>
        <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontWeight: 700, fontSize: 76, lineHeight: 1.08, marginTop: 26 }}>{s.titolo}</div>
      </div>
      <div style={{ position: "absolute", left: 120, top: 600, fontFamily: MANO, fontWeight: 700, fontSize: 60, color: GIALLO, transform: "rotate(-3deg)", clipPath: `inset(-20% ${100 - w}% -20% 0)`, whiteSpace: "nowrap", textShadow: "0 4px 16px #000" }}>{s.nota}</div>
    </>
  );
};

const Barra51: React.FC<{ s: Scheda; d: number }> = ({ s, d }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = entra(f, fps, d);
  const dp = d + F(s.t_pieno) - F(s.t);
  const df = d + F(s.t_fine) - F(s.t);
  const p = interpolate(f, [dp - 6, dp + 16], [0, 51], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fine = f >= df ? molla(f, fps, df, 9, 280) : 0;
  return (
    <div style={{ opacity: Math.min(1, a * 1.8) }}>
      <Sopra d={d}>{s.titolo}</Sopra>
      {p > 0 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 200, textAlign: "center", fontFamily: ANTON, fontSize: 210, color: VERDE, lineHeight: 1, textShadow: "0 10px 40px #000" }}>{Math.round(p)}%</div>
      ) : (
        <div style={{ position: "absolute", left: 0, right: 0, top: 200, textAlign: "center", fontFamily: ANTON, fontSize: 190, color: "#fff", lineHeight: 1, textShadow: "0 10px 40px #000", transform: `scale(${0.7 + 0.3 * a})` }}>
          <span style={{ background: "#76b900", padding: "0 30px", borderRadius: 20 }}>NVIDIA</span>
        </div>
      )}
      <div style={{ position: "absolute", left: 70, width: 940, top: 450, height: 90, borderRadius: 45, background: "#ffffff18", border: "4px solid #ffffff44", overflow: "hidden" }}>
        <div style={{ width: `${(p / 100) * 100}%`, height: "100%", background: `linear-gradient(90deg, ${VERDE}, #7dffb0)` }} />
        <div style={{ position: "absolute", left: "51%", top: -10, bottom: -10, width: 6, background: GIALLO }} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 570, textAlign: "center", fontFamily: ANTON, fontSize: 64, color: "#fff", transform: `scale(${fine})` }}>
        ALMENO <span style={{ background: VIOLA, padding: "0 14px", borderRadius: 10 }}>A CLIENTI NON CINESI</span>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 120, textAlign: "center", fontFamily: MONO, fontSize: 24, color: "#ffffff88", letterSpacing: 3, display: "none" }}>{s.fonte}</div>
    </div>
  );
};

const Timbro: React.FC<{ s: Scheda; d: number }> = ({ s, d }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const db = d + F(s.t_b) - F(s.t);
  const a = molla(f, fps, d, 10, 320);
  const b = f >= db ? molla(f, fps, db, 10, 320) : 0;
  const scossa = f >= db && f < db + 8 ? Math.sin(f * 3) * 14 : 0;
  const stampo = (testo: string, col: string, rot: number, k: number, top: number) => (
    <div style={{ position: "absolute", left: 0, right: 0, top, textAlign: "center", opacity: Math.min(1, k * 2) }}>
      <span style={{ display: "inline-block", fontFamily: ANTON, fontSize: 150, color: col, border: `12px solid ${col}`, borderRadius: 24, padding: "0 40px", transform: `rotate(${rot}deg) scale(${2.2 - 1.2 * k})`, textShadow: "0 0 30px #0008", background: "#0b0a10aa" }}>{testo}</span>
    </div>
  );
  return (
    <div style={{ transform: `translateX(${scossa}px)` }}>
      {stampo(s.primo, VERDE, -7, a, 170)}
      {b > 0 ? stampo(s.secondo, ROSSO_R, 5, b, 430) : null}
    </div>
  );
};

const DISEGNA: Record<string, React.FC<{ s: Scheda; d: number }>> = { tit: Tit, tre: Tre, vs: Vs, via: Via, giornale: Giornale, barra51: Barra51, timbro: Timbro };

// ---------- sottotitoli: 2 parole alla volta ----------
const Sottotitoli: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tc = f / fps - FONTE_B + A_DUR;
  if (tc < A_DUR || tc > FINE_VOCE_A6 + 0.3) return null;
  const s = SCHEDE.find((x) => tc >= x.t && tc < x.fino);
  const pieno = !s || s.tipo === "pieno";
  const viste = PAROLE_A6.filter(([a]) => tc >= a);
  if (!viste.length) return null;
  const ult = viste[viste.length - 1];
  const gruppo = PAROLE_A6.filter((p) => p[2] === ult[2]);
  const i = gruppo.indexOf(ult);
  const blocco = gruppo.slice(Math.floor(i / 2) * 2, Math.floor(i / 2) * 2 + 2);
  const a = molla(f, fps, F(vt(blocco[0][0])), 12, 320);
  return (
    <div style={{ position: "absolute", left: 30, right: 30, top: pieno ? 130 : 690, textAlign: "center", fontFamily: INTER, fontWeight: 900, fontSize: pieno ? 118 : 74, lineHeight: 1.0, letterSpacing: -2, transform: `scale(${0.85 + 0.15 * a})`, textShadow: "0 8px 30px #000c" }}>
      {pieno
        ? blocco.map(([s0, p], k) => <div key={k} style={{ color: CHIAVE_A6.test(p.toUpperCase()) ? GIALLO : "#fff", opacity: tc >= s0 ? 1 : 0, WebkitTextStroke: "3px #0009", paintOrder: "stroke fill" }}>{p.toLowerCase()}</div>)
        : <span>{blocco.map(([s0, p], k) => <span key={k} style={{ color: CHIAVE_A6.test(p.toUpperCase()) ? GIALLO : "#fff", opacity: tc >= s0 ? 1 : 0 }}>{p.toLowerCase()}{k === 0 ? " " : ""}</span>)}</span>}
    </div>
  );
};

// ---------- LA FONTE: Bloomberg TV, 4/11/2026 ----------
// fonte-bbg.mp4 = Bloomberg Surveillance 4/11/2026 (youtube jnL8qk_9Hxw) 1:48:13,45 → 1:48:26,75,
// audio già portato a -16 LUFS. Sottotitoli = traduzione fedele di quello che dice la conduttrice.
const SOTT_FONTE: [number, number, string][] = [
  [0.05, 4.85, "Il Financial Times: Oracle ha cancellato un contratto di chip da 7 miliardi con Tencent."],
  [5.15, 9.5, "Oracle doveva affittare 100.000 chip all'azienda cinese, per 5 anni."],
  [9.85, 13.3, "La mossa arriva dopo le preoccupazioni dei funzionari americani."],
];
const CHIAVI_FONTE = /^(cancellato|7|miliardi|tencent\.?|100\.000|chip|cinese,|americani\.)$/i;
const Fonte: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const z = interpolate(f, [0, F(FONTE_DUR)], [1, 1.1]);
  const riga = SOTT_FONTE.find(([a, b]) => t >= a && t < b);
  const ra = riga ? molla(f, fps, F(riga[0]), 12, 260) : 0;
  const ingresso = molla(f, fps, 0, 14, 200);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <OffthreadVideo src={staticFile(`${CARTELLA}/fonte-bbg.mp4`)} muted style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", filter: "blur(40px) brightness(0.35)", transform: "scale(1.2)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 250, textAlign: "center", fontFamily: MONO, fontSize: 34, letterSpacing: 5, color: "#fff", opacity: ingresso }}>
        <span style={{ background: ROSSO_R, padding: "8px 22px", borderRadius: 10 }}>BLOOMBERG TV · 4 NOVEMBRE 2026</span>
      </div>
      <div style={{ position: "absolute", left: 0, top: 380, width: 1080, height: 608, overflow: "hidden", boxShadow: "0 30px 90px #000", transform: `scale(${0.9 + 0.1 * ingresso})` }}>
        <div style={{ width: "100%", height: "100%", transform: `scale(${z})`, transformOrigin: "30% 45%" }}>
          <OffthreadVideo src={staticFile(`${CARTELLA}/fonte-bbg.mp4`)} muted style={{ width: "100%", height: "100%" }} />
        </div>
      </div>
      {riga ? (
        <div key={riga[0]} style={{ position: "absolute", left: 50, right: 50, top: 1060, textAlign: "center", fontFamily: INTER, fontWeight: 900, fontSize: 64, lineHeight: 1.18, color: "#fff", textShadow: "0 6px 24px #000", transform: `translateY(${(1 - ra) * 40}px)`, opacity: Math.min(1, ra * 1.8) }}>
          {riga[2].split(" ").map((p, k) => <span key={k} style={{ color: CHIAVI_FONTE.test(p) ? GIALLO : "#fff" }}>{p} </span>)}
        </div>
      ) : null}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1420, textAlign: "center", fontFamily: MANO, fontWeight: 700, fontSize: 58, color: GIALLO, opacity: interpolate(f, [F(2.5), F(3)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), transform: "rotate(-3deg)", textShadow: "0 4px 16px #000" }}>
        Oracle −4,75% prima dell'apertura
      </div>
    </AbsoluteFill>
  );
};

// ---------- il blocco B: schede + C ----------
const BloccoB: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tc = f / fps + A_DUR;
  const s = SCHEDE.find((x) => tc >= x.t && tc < x.fino);
  const diviso = s && s.tipo !== "pieno";
  const El = s ? DISEGNA[s.tipo] : undefined;
  const d = s ? F(s.t - A_DUR) : 0;
  const lampo = s ? interpolate(f - d, [0, 4], [0.28, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  return (
    <AbsoluteFill>
      <CParla clip="C-parla-b.mp4" off={A_DUR} />
      {diviso ? <ZonaAlta /> : <AbsoluteFill style={{ background: "linear-gradient(180deg, #000a 0%, transparent 30%)" }} />}
      {diviso && El ? <div key={s!.t} style={{ position: "absolute", inset: 0 }}><El s={s!} d={d} /></div> : null}
      <AbsoluteFill style={{ backgroundColor: "#fff", opacity: lampo, pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};

// ---------- finale che si muove ----------
const Finale: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = molla(f, fps, 0, 12, 200);
  const b = molla(f, fps, 10, 9, 300);
  const c = molla(f, fps, 24, 12, 220);
  const z = 1 + f * 0.0025;
  const pulsa = 1 + 0.04 * Math.sin(f / 3);
  return (
    <AbsoluteFill style={{ backgroundColor: NERO, backgroundImage: `radial-gradient(circle at 50% 45%, ${VIOLA}88, ${NERO} 70%)`, opacity: Math.min(1, a * 1.5) }}>
      <div style={{ position: "absolute", left: 40, right: 40, top: 560, textAlign: "center", fontFamily: ANTON, fontSize: 150, lineHeight: 1.12, color: "#fff", textTransform: "uppercase", transform: `scale(${z})`, textShadow: "0 10px 40px #000" }}>
        <div style={{ transform: `translateY(${(1 - a) * -120}px)` }}>Vi stanno</div>
        <div style={{ transform: `translateY(${(1 - a) * -60}px)` }}>vendendo</div>
        <div style={{ transform: `scale(${0.3 + 0.7 * b})` }}>una <span style={{ display: "inline-block", background: VIOLA, padding: "0 26px", borderRadius: 20, lineHeight: 1.0, transform: `scale(${pulsa}) rotate(-2deg)`, boxShadow: `0 0 80px ${ACCENTO}` }}>favola</span></div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1180, textAlign: "center", fontFamily: MANO, fontWeight: 700, fontSize: 70, color: GIALLO, transform: `scale(${c}) rotate(-3deg)` }}>firmato ≠ eseguibile</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1320, textAlign: "center", fontFamily: MONO, fontSize: 40, letterSpacing: 4, color: "#ffffffcc", opacity: c }}>@cthe.trader</div>
    </AbsoluteFill>
  );
};

const Barra: React.FC = () => {
  const f = useCurrentFrame();
  return <div style={{ position: "absolute", left: 0, bottom: 0, height: 8, width: `${(f / DURATA_A6) * 100}%`, background: `linear-gradient(90deg,${VIOLA},${ACCENTO})` }} />;
};
const Vignetta: React.FC = () => <AbsoluteFill style={{ pointerEvents: "none", background: "radial-gradient(ellipse at 50% 45%, transparent 62%, #0009 100%)" }} />;

export const A6ORACLE: React.FC = () => {
  const fineB = F(vt(FINE_VOCE_A6) + 0.35);
  return (
    <AbsoluteFill style={{ backgroundColor: NERO, fontFamily: INTER }}>
      {/* A) C apre: «Guarda questo.» */}
      <Sequence from={0} durationInFrames={F(A_DUR)}>
        <CParla clip="C-parla-a.mp4" off={0} sempre="pieno" />
        <Sticker d={1} top={1500} size={96} bg={ROSSO_R} rot={-3}>GUARDA QUESTO</Sticker>
      </Sequence>
      {/* FONTE) Bloomberg TV, col suo audio */}
      <Sequence from={F(A_DUR)} durationInFrames={F(FONTE_DUR)}>
        <Fonte />
      </Sequence>
      {/* B) C smonta */}
      <Sequence from={F(FONTE_B)}>
        <BloccoB />
      </Sequence>
      <Sottotitoli />
      <Sequence from={fineB}>
        <Finale />
      </Sequence>
      <div style={{ position: "absolute", left: 50, top: 70, fontFamily: MONO, fontSize: 26, color: "#ffffffbb", letterSpacing: 3, textShadow: "0 2px 8px #000" }}>ATTUALITÀ DI C · #6</div>
      <Vignetta />
      <Barra />
      {/* Audio */}
      <Sequence from={0} durationInFrames={F(A_DUR)}>
        <Audio src={staticFile(`${CARTELLA}/voce-a.wav`)} volume={1} />
      </Sequence>
      <Sequence from={F(A_DUR)} durationInFrames={F(FONTE_DUR)}>
        <Audio src={staticFile(`${CARTELLA}/fonte-bbg.mp4`)} volume={1} />
      </Sequence>
      <Sequence from={F(FONTE_B)}>
        <Audio src={staticFile(`${CARTELLA}/voce-b.wav`)} volume={1} />
        <Audio src={staticFile(`${CARTELLA}/musica-b.wav`)} volume={0.06} />
        <Audio src={staticFile(`${CARTELLA}/sfx-b.wav`)} volume={0.35} />
      </Sequence>
    </AbsoluteFill>
  );
};

// Copertina: quella vera è finale/A6-oracle-copertina.jpg (copertina_titolo.py). Questa resta per Root.
export const CoverA6ORACLE: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: NERO }}>
    <Img src={staticFile(`${CARTELLA}/cover-frame.png`)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 30%" }} />
  </AbsoluteFill>
);
