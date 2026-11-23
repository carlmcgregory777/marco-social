// BF2 (23/11/2026, Marco): gancio «Guardate qui» → video sponsor Higgsfield (nostre clip) → ponte di C → BF1 che spiega la promo.
import React from "react";
import { AbsoluteFill, Audio, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { ANTON, MONO, NERO, VIOLA } from "./FormatC";

const F = (s: number) => Math.round(s * 30);
const G = F(1.4);
const CLIP = F(1.9);
const MONTAGGIO = [
  { src: "bf1black/sd1.mp4", da: 0.0, tag: "SCENA DA FILM · 4K" },
  { src: "bf1black/sd2.mp4", da: 0.5, tag: "SEEDANCE 2.5" },
  { src: "bf1black/gta.mp4", da: 0.3, tag: "SPOT STILE GTA" },
  { src: "bf1black/sd3.mp4", da: 1.0, tag: "IL MIO PERSONAGGIO" },
  { src: "bf1black/shorts.mp4", da: 4.0, tag: "REEL MONTATO DA CLAUDE" },
];
const M = CLIP * MONTAGGIO.length;
const P = F(5.85);
const BF1 = F(53.5);
export const DURATA_BF2BLACK = G + M + P + BF1;

const Pieno: React.FC<{ src: string; da?: number }> = ({ src, da = 0 }) => (
  <OffthreadVideo src={staticFile(src)} startFrom={F(da)} muted style={{ position: "absolute", width: 1080, height: 1920, objectFit: "cover" }} />
);

const Gancio: React.FC = () => {
  const f = useCurrentFrame();
  const z = 1.08 + f * 0.003;
  const s = interpolate(f, [0, 6], [0.6, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ backgroundColor: NERO, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${z})`, transformOrigin: "50% 40%" }}>
        <Pieno src="bf1black/gancio.mp4" />
      </div>
      <div style={{ position: "absolute", top: 150, left: 0, right: 0, textAlign: "center", transform: `scale(${s})` }}>
        <span style={{ fontFamily: ANTON, fontSize: 150, color: "#fff", WebkitTextStroke: "10px #000", paintOrder: "stroke fill" }}>GUARDATE </span>
        <span style={{ fontFamily: ANTON, fontSize: 150, color: "#fff", background: VIOLA, borderRadius: 18, padding: "0 24px" }}>QUI</span>
      </div>
    </AbsoluteFill>
  );
};

const Sponsor: React.FC = () => {
  const f = useCurrentFrame();
  const i = Math.min(MONTAGGIO.length - 1, Math.floor(f / CLIP));
  const c = MONTAGGIO[i];
  const loc = f - i * CLIP;
  const flash = interpolate(loc, [0, 4], [0.7, 0], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {MONTAGGIO.map((m, k) => (
        <Sequence key={k} from={k * CLIP} durationInFrames={CLIP} layout="none">
          <div style={{ position: "absolute", inset: 0, transform: `scale(${1.02 + (f - k * CLIP) * 0.002})` }}>
            <Pieno src={m.src} da={m.da} />
          </div>
        </Sequence>
      ))}
      <AbsoluteFill style={{ backgroundColor: "#fff", opacity: flash }} />
      <div style={{ position: "absolute", top: 150, left: 0, right: 0, textAlign: "center", fontFamily: MONO, fontSize: 40, color: "#fff", letterSpacing: 4, textShadow: "0 2px 12px #000" }}>FATTO CON</div>
      <div style={{ position: "absolute", top: 200, left: 0, right: 0, textAlign: "center" }}>
        <span style={{ fontFamily: ANTON, fontSize: 150, color: "#fff", background: VIOLA, borderRadius: 18, padding: "0 30px" }}>HIGGSFIELD</span>
      </div>
      <div style={{ position: "absolute", bottom: 380, left: 0, right: 0, textAlign: "center" }}>
        <span key={i} style={{ fontFamily: ANTON, fontSize: 84, color: "#fff", WebkitTextStroke: "8px #000", paintOrder: "stroke fill" }}>{c.tag}</span>
      </div>
    </AbsoluteFill>
  );
};

const Ponte: React.FC = () => {
  const f = useCurrentFrame();
  const a = interpolate(f, [0, 8], [0, 1], { extrapolateRight: "clamp" });
  const dopo = f > F(3.7);
  return (
    <AbsoluteFill style={{ backgroundColor: NERO }}>
      <div style={{ position: "absolute", left: 0, top: 840, width: 1080, height: 1080, overflow: "hidden" }}>
        <Pieno src="bf1black/ponte.mp4" />
      </div>
      <div style={{ position: "absolute", top: 260, left: 0, right: 0, textAlign: "center", opacity: a }}>
        <div style={{ fontFamily: MONO, fontSize: 40, color: "#fff", letterSpacing: 4 }}>{dopo ? "E ADESSO C'È IL" : "TUTTO FATTO CON"}</div>
        <div style={{ marginTop: 30 }}>
          <span style={{ fontFamily: ANTON, fontSize: dopo ? 170 : 180, color: "#fff", background: VIOLA, borderRadius: 18, padding: "0 30px" }}>{dopo ? "BLACK FRIDAY" : "HIGGSFIELD"}</span>
        </div>
        {!dopo ? <div style={{ fontFamily: ANTON, fontSize: 110, color: "#fff", marginTop: 20 }}>DENTRO CLAUDE</div> : null}
      </div>
    </AbsoluteFill>
  );
};

export const BF2BLACK: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: NERO }}>
    <Sequence durationInFrames={G}><Gancio /><Audio src={staticFile("bf1black/gancio.wav")} /></Sequence>
    <Sequence from={G} durationInFrames={M}>
      <Sponsor />
      <Audio src={staticFile("bf1black/sponsor.wav")} volume={0.55} />
      {MONTAGGIO.map((_, k) => (
        <Sequence key={k} from={k * CLIP} durationInFrames={F(0.8)}><Audio src={staticFile("bf1black/whoosh.wav")} volume={0.5} /></Sequence>
      ))}
    </Sequence>
    <Sequence from={G + M} durationInFrames={P}>
      <Ponte />
      <Audio src={staticFile("bf1black/ponte.wav")} />
      <Sequence durationInFrames={F(1)}><Audio src={staticFile("bf1black/impact.wav")} volume={0.6} /></Sequence>
    </Sequence>
    <Sequence from={G + M + P} durationInFrames={BF1}>
      <OffthreadVideo src={staticFile("bf1black/bf1.mp4")} style={{ width: 1080, height: 1920 }} />
    </Sequence>
  </AbsoluteFill>
);
