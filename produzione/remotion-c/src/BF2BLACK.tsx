// BF2 (23/11/2026, Marco): gancio «Guardate qui» → spot ufficiale Higgsfield «MCP 2.0 for Claude» (YouTube kWiL-rGekoc, 1,8-14 s) → ponte di C → BF1 che spiega la promo.
import React from "react";
import { AbsoluteFill, Audio, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { ANTON, MONO, NERO, VIOLA } from "./FormatC";

const F = (s: number) => Math.round(s * 30);
const G = F(1.4);
const M = F(12.2);
const P = F(4.25);
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

// spot ufficiale 16:9 al centro, sfondo = lo stesso spot sfocato
const Sponsor: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <AbsoluteFill style={{ overflow: "hidden", filter: "blur(30px) brightness(0.5)" }}>
      <OffthreadVideo src={staticFile("bf1black/spot.mp4")} muted style={{ position: "absolute", width: 3413, height: 1920, left: -1166, objectFit: "cover" }} />
    </AbsoluteFill>
    <div style={{ position: "absolute", left: -160, top: 560, width: 1400, height: 788, overflow: "hidden", boxShadow: "0 0 90px #000" }}>
      <OffthreadVideo src={staticFile("bf1black/spot.mp4")} style={{ width: 1400, height: 788, objectFit: "cover" }} />
    </div>
    <div style={{ position: "absolute", top: 300, left: 0, right: 0, textAlign: "center", fontFamily: MONO, fontSize: 40, color: "#fff", letterSpacing: 4 }}>SPOT UFFICIALE</div>
    <div style={{ position: "absolute", top: 360, left: 0, right: 0, textAlign: "center" }}>
      <span style={{ fontFamily: ANTON, fontSize: 130, color: "#fff", background: VIOLA, borderRadius: 18, padding: "0 30px" }}>HIGGSFIELD</span>
    </div>
  </AbsoluteFill>
);

const Ponte: React.FC = () => {
  const f = useCurrentFrame();
  const a = interpolate(f, [0, 8], [0, 1], { extrapolateRight: "clamp" });
  const dopo = f > F(1.9);
  return (
    <AbsoluteFill style={{ backgroundColor: NERO }}>
      <div style={{ position: "absolute", left: 0, top: 840, width: 1080, height: 1080, overflow: "hidden" }}>
        <Pieno src="bf1black/ponte.mp4" />
      </div>
      <div style={{ position: "absolute", top: 260, left: 0, right: 0, textAlign: "center", opacity: a }}>
        <div style={{ fontFamily: MONO, fontSize: 40, color: "#fff", letterSpacing: 4 }}>{dopo ? "E ADESSO C'È IL" : "QUESTO È"}</div>
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
    </Sequence>
    <Sequence from={G + M} durationInFrames={P}>
      <Ponte />
      <Audio src={staticFile("bf1black/ponte.wav")} />
      <Sequence durationInFrames={F(1)}><Audio src={staticFile("bf1black/impact.wav")} volume={0.6} /></Sequence>
    </Sequence>
    {/* suoni di transizione (23/11, Marco): solo nei passaggi */}
    <Sequence durationInFrames={F(0.3)}><Audio src={staticFile("bf1black/pop.wav")} volume={0.7} /></Sequence>
    <Sequence from={G - F(0.45)} durationInFrames={F(0.6)}><Audio src={staticFile("bf1black/whoosh.wav")} volume={0.7} /></Sequence>
    <Sequence from={G} durationInFrames={F(1.6)}><Audio src={staticFile("bf1black/boom.wav")} volume={0.75} /></Sequence>
    <Sequence from={G + M - F(2)} durationInFrames={F(2)}><Audio src={staticFile("bf1black/riser.wav")} volume={0.55} /></Sequence>
    <Sequence from={G + M + F(1.9)} durationInFrames={F(0.7)}><Audio src={staticFile("bf1black/ding.wav")} volume={0.6} /></Sequence>
    <Sequence from={G + M + P - F(0.15)} durationInFrames={F(0.3)}><Audio src={staticFile("bf1black/swish.wav")} volume={0.7} /></Sequence>
    <Sequence from={G + M + P} durationInFrames={BF1}>
      <OffthreadVideo src={staticFile("bf1black/bf1.mp4")} style={{ width: 1080, height: 1920 }} />
    </Sequence>
  </AbsoluteFill>
);
