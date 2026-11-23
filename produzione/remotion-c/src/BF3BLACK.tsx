// BF3 (23/11/2026, Marco): versione chiara della sponsorizzata Black Friday Higgsfield.
// Gancio «Guardate qui» → spot ufficiale Higgsfield MCP 2.0 → ponte di C → spiegazione della promo.
// Sfondo bianco, logo Higgsfield originale (simbolo dal sito higgsfield.ai), schede tra y 300 e 880 (zona sicura
// del telefono), C in un riquadro arrotondato sotto, clip ufficiali Higgsfield ritagliate esatte in 16:9 (1280x720).
import React from "react";
import { AbsoluteFill, Audio, Freeze, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ANTON, INTER, MONO, molla, NERO, VIOLA } from "./FormatC";
import { PAROLE_BF1BLACK } from "./bf1black-parole";
import { FINE_VOCE } from "./bf1black-schede";

const F = (s: number) => Math.round(s * 30);
const BIANCO = "#f7f6f3";
const G = F(1.4);
const M = F(12.2);
const P = F(4.25);
const CORPO = F(FINE_VOCE + 2.6);
export const DURATA_BF3BLACK = G + M + P + CORPO;

// ---------- logo Higgsfield (simbolo ufficiale + nome) ----------
const GLIFO = "M18.3498 9.83713L18.3339 9.65759C18.1831 7.93447 17.0963 4.69261 14.0816 4.69261C11.8445 4.69261 10.1545 6.97097 8.66311 8.97967C7.47302 10.5883 6.4419 11.9683 5.3073 11.9683C5.00574 11.9357 4.61708 11.7805 4.3792 11.4294C4.16497 11.1108 4.10948 10.7026 4.22046 10.2126C4.39489 9.43684 5.39463 8.7182 6.44963 7.95063C7.02864 7.54238 7.6238 7.10955 8.03634 6.69311C9.22643 5.5091 9.82932 4.65164 9.82932 3.2717C9.82932 1.89176 9.09157 1.20565 8.47276 0.911636C7.23514 0.323844 5.41851 0.666781 4.26026 1.69583C4.08583 1.85922 3.91117 2.01418 3.75243 2.16119C2.58622 3.23097 1.80094 3.95781 0 3.40232V5.63972C2.38791 6.72588 4.39512 4.65164 5.15675 3.69633C5.74372 3.06758 6.36253 2.70006 6.82283 2.70006H6.84671C7.05298 2.70825 7.22741 2.78995 7.35454 2.93696C7.56081 3.18204 7.64018 3.46786 7.60038 3.78622C7.51305 4.45594 6.83875 5.23967 5.60113 6.09713C4.14928 7.10159 1.7218 8.78374 1.53122 10.8987C1.3884 12.4177 2.15003 13.9365 3.34012 14.5243C6.11669 15.8798 7.80665 13.5444 9.5994 11.0783C10.9719 9.1756 12.273 7.37103 14.0818 7.37103C15.7081 7.37103 16.311 8.75916 16.311 9.63301V9.80459L16.1523 9.83713C12.2095 10.5558 10.0595 14.3611 10.0595 16.1167C10.0595 17.8724 11.5034 19.375 13.2804 19.375C15.359 19.375 17.9293 17.5458 18.3419 12.4013L18.3578 12.2136H20V9.83737H18.3498V9.83713ZM16.1998 12.4746C15.8826 15.5531 14.3513 16.9904 13.4232 16.9904C13.0027 16.9904 12.4158 16.631 12.4158 15.9615C12.4158 15.2104 13.5026 12.932 15.946 12.2543L16.2316 12.1808L16.1998 12.4748V12.4746Z";

const Logo: React.FC<{ top: number; h?: number; colore?: string; claude?: boolean }> = ({ top, h = 64, colore = NERO, claude = true }) => (
  <div style={{ position: "absolute", top, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: h * 0.25 }}>
    <svg viewBox="0 0 20 20" style={{ height: h, width: h }}><path d={GLIFO} fill={colore} /></svg>
    <span style={{ fontFamily: INTER, fontWeight: 700, fontSize: h * 0.82, color: colore, letterSpacing: -1 }}>Higgsfield</span>
    {claude ? <span style={{ fontFamily: INTER, fontWeight: 500, fontSize: h * 0.6, color: "#0b0a1088", marginLeft: h * 0.1 }}>× Claude</span> : null}
  </div>
);

// ---------- C nel riquadro ----------
const RIQ = { x: 40, y: 900, w: 1000, h: 940 };
const CRiquadro: React.FC<{ src: string; da?: number; zoom?: number }> = ({ src, da = 0, zoom = 1 }) => (
  <div style={{ position: "absolute", left: RIQ.x, top: RIQ.y, width: RIQ.w, height: RIQ.h, borderRadius: 40, overflow: "hidden", boxShadow: "0 20px 60px #0003", background: "#000" }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: 1000, height: 1000, transform: `scale(${zoom})`, transformOrigin: "50% 35%" }}>
      <OffthreadVideo src={staticFile(src)} startFrom={F(da)} muted style={{ width: 1000, height: 1000 }} />
    </div>
  </div>
);

// ---------- schede del corpo (tempi sulla voce di BF1) ----------
type Sch = { t: number; tipo: "tit" | "video" | "cta"; sopra?: string; righe?: string[]; src?: string; dur?: number; tag?: string };
const SCHEDE: Sch[] = [
  { t: 0.0, tipo: "tit", sopra: "SE NON L'HAI MAI PROVATO", righe: ["3 GIORNI", "*GRATIS"] },
  { t: 3.15, tipo: "video", src: "hf/trial.mp4", dur: 3.4, tag: "3 GIORNI DI PROVA · MCP" },
  { t: 6.35, tipo: "tit", sopra: "IN QUEI 3 GIORNI", righe: ["*4 COSE", "DA FARE"] },
  { t: 9.35, tipo: "tit", sopra: "01", righe: ["FATTI", "IL *SITO"] },
  { t: 10.95, tipo: "tit", sopra: "SCEGLI", righe: ["*5 SITI", "CHE TI PIACCIONO"] },
  { t: 12.85, tipo: "tit", sopra: "CLAUDE LO RIFÀ", righe: ["CON QUELLO", "*STILE"] },
  { t: 15.15, tipo: "video", src: "sito.mp4", dur: 6, tag: "IL MIO · FATTO CON CLAUDE" },
  { t: 18.15, tipo: "tit", sopra: "02", righe: ["IL TUO *REEL", "LO MONTA CLAUDE"] },
  { t: 19.85, tipo: "video", src: "hf/shorts.mp4", dur: 5.8, tag: "HIGGSFIELD SHORTS" },
  { t: 25.45, tipo: "tit", sopra: "TI BASTA SCRIVERE", righe: ["*/SHORTS"] },
  { t: 27.95, tipo: "tit", sopra: "03", righe: ["SCENA", "DA *FILM"] },
  { t: 30.45, tipo: "video", src: "hf/sd4k.mp4", dur: 3.2, tag: "SEEDANCE 2.5 · 4K" },
  { t: 33.35, tipo: "tit", sopra: "04", righe: ["UNO SPOT", "DA UNA *FOTO"] },
  { t: 35.0, tipo: "video", src: "hf/prod.mp4", dur: 3.0, tag: "SPOT DI PRODOTTO" },
  { t: 37.65, tipo: "video", src: "hf/cmd.mp4", dur: 2.0, tag: "I COMANDI IN CLAUDE" },
  { t: 39.35, tipo: "video", src: "hf/conn.mp4", dur: 3.0, tag: "HIGGSFIELD MCP 2.0" },
  { t: 42.15, tipo: "video", src: "hf/terms.mp4", dur: 3.8, tag: "PROVA GRATIS 3 GIORNI" },
  { t: 45.65, tipo: "video", src: "hf/sale.mp4", dur: 3.2, tag: "BLACK FRIDAY · FINO AL -60%" },
  { t: 48.6, tipo: "cta" },
];
const fineDi = (i: number) => (i + 1 < SCHEDE.length ? SCHEDE[i + 1].t : FINE_VOCE + 2.6);

const Riga: React.FC<{ testo: string; size: number }> = ({ testo, size }) => {
  const i = testo.indexOf("*");
  if (i < 0) return <span>{testo}</span>;
  return (
    <span>
      {testo.slice(0, i)}
      <span style={{ background: VIOLA, color: "#fff", padding: `0 ${size * 0.14}px`, borderRadius: size * 0.12, display: "inline-block", lineHeight: 1.0 }}>{testo.slice(i + 1)}</span>
    </span>
  );
};

const Sopra: React.FC<{ testo: string; d: number; top: number }> = ({ testo, d, top }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [d, d + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <div style={{ position: "absolute", left: 40, right: 40, top, textAlign: "center", fontFamily: MONO, fontSize: 36, letterSpacing: 5, color: VIOLA, fontWeight: 700, opacity: o }}>{testo}</div>;
};

const Tit: React.FC<{ s: Sch; d: number }> = ({ s, d }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const righe = s.righe || [];
  const max = Math.max(...righe.map((r) => r.replace("*", "").length));
  const size = Math.min(185, Math.floor(1650 / Math.max(1, max)));
  const h = righe.length * size * 1.08;
  const top = 420 + (440 - h) / 2;
  return (
    <>
      {s.sopra ? <Sopra testo={s.sopra} d={d} top={top - 62} /> : null}
      <div style={{ position: "absolute", left: 30, right: 30, top, textAlign: "center", fontFamily: ANTON, fontSize: size, lineHeight: 1.08, color: NERO, textTransform: "uppercase" }}>
        {righe.map((r, k) => {
          const a = molla(f, fps, d + k * 4, 12, 230);
          return (
            <div key={k} style={{ transform: `translateY(${(1 - a) * 80}px) scale(${0.75 + 0.25 * a})`, opacity: Math.min(1, a * 1.8) }}>
              <Riga testo={r} size={size} />
            </div>
          );
        })}
      </div>
    </>
  );
};

// clip 16:9 esatta: niente deformazioni né tagli storti
const VW = 960;
const VH = 540;
const Video: React.FC<{ s: Sch; d: number }> = ({ s, d }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = molla(f, fps, d, 13, 220);
  const dur = F(s.dur || 3) - 1;
  const v = <OffthreadVideo src={staticFile(`bf1black/${s.src}`)} muted style={{ width: VW, height: VH, display: "block" }} />;
  return (
    <div style={{ position: "absolute", left: (1080 - VW) / 2, top: 330, width: VW, height: VH, borderRadius: 28, overflow: "hidden", boxShadow: "0 24px 60px #0004", border: "3px solid #fff", transform: `scale(${0.9 + 0.1 * a})`, opacity: Math.min(1, a * 1.6), background: "#000" }}>
      <Sequence from={d} durationInFrames={dur} layout="none">{v}</Sequence>
      <Sequence from={d + dur} layout="none"><Freeze frame={dur - 1}>{v}</Freeze></Sequence>
      {s.tag ? <div style={{ position: "absolute", left: 16, top: 14, fontFamily: ANTON, fontSize: 40, color: "#fff", background: VIOLA, borderRadius: 10, padding: "2px 16px" }}>{s.tag}</div> : null}
    </div>
  );
};

const Cta: React.FC<{ d: number }> = ({ d }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = molla(f, fps, d, 12, 230);
  const scritto = "BLACK FRIDAY";
  const n = Math.max(0, Math.min(scritto.length, Math.floor((f - d - 10) / 2)));
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 430, opacity: Math.min(1, a * 1.6), transform: `scale(${0.85 + 0.15 * a})` }}>
      <div style={{ fontFamily: INTER, fontWeight: 700, fontSize: 46, color: "#0b0a1099", textAlign: "left", marginLeft: 90 }}>Commenta</div>
      <div style={{ margin: "18px 70px 0", height: 150, borderRadius: 75, background: "#fff", border: `4px solid ${NERO}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px 0 50px", boxShadow: "0 20px 50px #0002" }}>
        <span style={{ fontFamily: INTER, fontWeight: 900, fontSize: 76, color: NERO, letterSpacing: -2 }}>{scritto.slice(0, n)}<span style={{ opacity: f % 30 < 15 ? 1 : 0 }}>|</span></span>
        <div style={{ width: 110, height: 110, borderRadius: 55, background: VIOLA, color: "#fff", fontSize: 64, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900 }}>↑</div>
      </div>
      <div style={{ marginTop: 26, textAlign: "center", fontFamily: INTER, fontWeight: 700, fontSize: 40, color: NERO }}>ti mando il link in DM 📩</div>
      <div style={{ marginTop: 10, textAlign: "center", fontFamily: MONO, fontSize: 26, color: "#0b0a1088" }}>#ad · link affiliato Higgsfield</div>
    </div>
  );
};

const Sottotitoli: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / 30;
  if (t > FINE_VOCE + 0.3) return null;
  const P_ = PAROLE_BF1BLACK.filter(([, p]) => /[A-Za-zÀ-ü0-9]/.test(p));
  const viste = P_.filter(([a]) => t >= a);
  if (!viste.length) return null;
  const ult = viste[viste.length - 1];
  const gruppo = P_.filter((p) => p[2] === ult[2]);
  const i = gruppo.indexOf(ult);
  const blocco = gruppo.slice(Math.floor(i / 2) * 2, Math.floor(i / 2) * 2 + 2);
  const chiave = /^(GIORNI|GRATIS|SITO|REEL|FILM|FOTO|COMANDI|BLACK|FRIDAY|HIGGSFIELD|CLAUDE)$/;
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: 1400, textAlign: "center", fontFamily: INTER, fontWeight: 900, fontSize: 76, letterSpacing: -2, WebkitTextStroke: "10px #000", paintOrder: "stroke fill" }}>
      {blocco.map(([s0, p], k) => (
        <span key={k} style={{ color: chiave.test(p.toUpperCase().replace(/[^A-ZÀ-Ü]/g, "")) ? "#b9a6ff" : "#fff", opacity: t >= s0 ? 1 : 0 }}>{p.toLowerCase().replace(/[.,:;!?"…]+/g, "")}{k === 0 ? " " : ""}</span>
      ))}
    </div>
  );
};

const Corpo: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / 30;
  const i = SCHEDE.findIndex((s, k) => t >= s.t && t < fineDi(k));
  const s = i >= 0 ? SCHEDE[i] : null;
  const d = s ? F(s.t) : 0;
  return (
    <AbsoluteFill style={{ backgroundColor: BIANCO }}>
      <Logo top={240} h={52} />
      {s && s.tipo === "tit" ? <Tit key={i} s={s} d={d} /> : null}
      {s && s.tipo === "video" ? <Video key={i} s={s} d={d} /> : null}
      {s && s.tipo === "cta" ? <Cta d={d} /> : null}
      <CRiquadro src="bf1black/C-parla.mp4" zoom={1.0 + 0.04 * ((i + 2) % 2)} />
      <Sottotitoli />
      <Audio src={staticFile("bf1black/voce.wav")} />
      <Audio src={staticFile("bf1black/musica.wav")} volume={0.06} />
      <Audio src={staticFile("bf1black/sfx.wav")} volume={0.35} />
      {SCHEDE.map((x, k) => (x.tipo === "video" ? <Sequence key={k} from={F(x.t) - 4} durationInFrames={F(0.6)}><Audio src={staticFile("bf1black/whoosh.wav")} volume={0.45} /></Sequence> : null))}
    </AbsoluteFill>
  );
};

// ---------- parti iniziali ----------
const Gancio: React.FC = () => {
  const f = useCurrentFrame();
  const s = interpolate(f, [0, 6], [0.6, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ backgroundColor: NERO, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: -420, top: 0, width: 1920, height: 1920, transform: `scale(${1.0 + f * 0.003})`, transformOrigin: "50% 40%" }}>
        <OffthreadVideo src={staticFile("bf1black/gancio.mp4")} muted style={{ width: 1920, height: 1920 }} />
      </div>
      <div style={{ position: "absolute", top: 330, left: 0, right: 0, textAlign: "center", transform: `scale(${s})` }}>
        <span style={{ fontFamily: ANTON, fontSize: 150, color: "#fff", WebkitTextStroke: "10px #000", paintOrder: "stroke fill" }}>GUARDATE </span>
        <span style={{ fontFamily: ANTON, fontSize: 150, color: "#fff", background: VIOLA, borderRadius: 18, padding: "0 24px" }}>QUI</span>
      </div>
    </AbsoluteFill>
  );
};

const Spot: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = molla(f, fps, 0, 13, 220);
  return (
    <AbsoluteFill style={{ backgroundColor: BIANCO }}>
      <Logo top={300} h={78} />
      <div style={{ position: "absolute", top: 410, left: 0, right: 0, textAlign: "center", fontFamily: MONO, fontSize: 34, letterSpacing: 5, color: VIOLA, fontWeight: 700 }}>SPOT UFFICIALE</div>
      <div style={{ position: "absolute", left: 20, top: 520, width: 1040, height: 585, borderRadius: 30, overflow: "hidden", boxShadow: "0 30px 80px #0005", transform: `scale(${0.92 + 0.08 * a})` }}>
        <OffthreadVideo src={staticFile("bf1black/spot.mp4")} style={{ width: 1040, height: 585 }} />
      </div>
    </AbsoluteFill>
  );
};

const Ponte: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dopo = f > F(1.9);
  const a = molla(f, fps, dopo ? F(1.9) : 0, 12, 230);
  return (
    <AbsoluteFill style={{ backgroundColor: BIANCO }}>
      <Logo top={240} h={52} />
      <div style={{ position: "absolute", top: 440, left: 0, right: 0, textAlign: "center", transform: `scale(${0.8 + 0.2 * a})`, opacity: Math.min(1, a * 1.6) }}>
        <div style={{ fontFamily: MONO, fontSize: 36, color: VIOLA, letterSpacing: 5, fontWeight: 700 }}>{dopo ? "E ADESSO C'È IL" : "QUESTO È"}</div>
        <div style={{ marginTop: 24 }}>
          <span style={{ fontFamily: ANTON, fontSize: 170, color: dopo ? "#fff" : NERO, background: dopo ? VIOLA : "transparent", borderRadius: 18, padding: "0 30px" }}>{dopo ? "BLACK FRIDAY" : "HIGGSFIELD"}</span>
        </div>
        {!dopo ? <div style={{ fontFamily: ANTON, fontSize: 100, color: NERO, marginTop: 6 }}>DENTRO <span style={{ background: VIOLA, color: "#fff", borderRadius: 14, padding: "0 18px" }}>CLAUDE</span></div> : null}
      </div>
      <CRiquadro src="bf1black/ponte.mp4" />
    </AbsoluteFill>
  );
};

export const BF3BLACK: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: BIANCO }}>
    <Sequence durationInFrames={G}><Gancio /><Audio src={staticFile("bf1black/gancio.wav")} /></Sequence>
    <Sequence from={G} durationInFrames={M}><Spot /></Sequence>
    <Sequence from={G + M} durationInFrames={P}><Ponte /><Audio src={staticFile("bf1black/ponte.wav")} /></Sequence>
    <Sequence from={G + M + P} durationInFrames={CORPO}><Corpo /></Sequence>
    {/* suoni di transizione */}
    <Sequence durationInFrames={F(0.3)}><Audio src={staticFile("bf1black/pop.wav")} volume={0.7} /></Sequence>
    <Sequence from={G - F(0.45)} durationInFrames={F(0.6)}><Audio src={staticFile("bf1black/whoosh.wav")} volume={0.7} /></Sequence>
    <Sequence from={G} durationInFrames={F(1.6)}><Audio src={staticFile("bf1black/boom.wav")} volume={0.75} /></Sequence>
    <Sequence from={G + M - F(2)} durationInFrames={F(2)}><Audio src={staticFile("bf1black/riser.wav")} volume={0.55} /></Sequence>
    {/* fine spot: colpo forte + musica sotto il ponte, così non resta il silenzio (Marco 23/11) */}
    <Sequence from={G + M} durationInFrames={F(1.6)}><Audio src={staticFile("bf1black/boom.wav")} volume={0.9} /></Sequence>
    <Sequence from={G + M} durationInFrames={F(0.9)}><Audio src={staticFile("bf1black/impact.wav")} volume={0.7} /></Sequence>
    <Sequence from={G + M} durationInFrames={P + F(0.6)}>
      <Audio src={staticFile("bf1black/sponsor.wav")} volume={(fr) => interpolate(fr, [0, 6, P - 6, P + 18], [0, 0.3, 0.3, 0], { extrapolateRight: "clamp" })} />
    </Sequence>
    <Sequence from={G + M + F(1.9)} durationInFrames={F(0.7)}><Audio src={staticFile("bf1black/ding.wav")} volume={0.6} /></Sequence>
    <Sequence from={G + M + P - F(0.15)} durationInFrames={F(0.3)}><Audio src={staticFile("bf1black/swish.wav")} volume={0.7} /></Sequence>
  </AbsoluteFill>
);

export const CoverBF3BLACK: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: BIANCO }}>
    <Logo top={240} h={56} />
    <div style={{ position: "absolute", top: 420, left: 0, right: 0, textAlign: "center", fontFamily: ANTON, fontSize: 185, lineHeight: 1.08, color: NERO }}>
      <div>3 GIORNI</div>
      <div><span style={{ background: VIOLA, color: "#fff", borderRadius: 22, padding: "0 30px" }}>GRATIS</span></div>
    </div>
    <div style={{ position: "absolute", left: RIQ.x, top: RIQ.y, width: RIQ.w, height: RIQ.h, borderRadius: 40, overflow: "hidden" }}>
      <OffthreadVideo src={staticFile("bf1black/C-parla.mp4")} startFrom={F(9.6)} muted style={{ width: 1000, height: 1000 }} />
    </div>
  </AbsoluteFill>
);
