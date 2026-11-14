// P1 in 9:16 per i reel (14/11/2026, richiesta di Marco). Parte dal P1 v2 finito (16:9, 1440p, approvato).
// Un ritaglio centrale fisso tagliava scritte, mappa, checklist e tweet: qui il video cambia inquadratura da solo:
//  - «stretto»: C a tutto schermo (ritaglio 9:16 sul centro) quando parla senza grafiche ai lati;
//  - «intero»: il 16:9 intero a tutta larghezza, sul bianco dello sfondo, quando ci sono grafiche larghe.
// Sopra: titolo fisso (gancio sempre leggibile). Sotto: sottotitoli grandi a 3 parole, parola detta in viola.
import React from "react";
import { AbsoluteFill, Easing, interpolate, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";
import { ANTON, INTER, VIOLA } from "./FormatC";
import { PAROLE_P1HORMOZI as P } from "./p1hormozi-parole";

const FPS = 30;
const F = (s: number) => Math.round(s * FPS);
export const DURATA_P1REEL = F(47.2);
const INCHIOSTRO = "#15131a";

// [da secondo, modo] — dal foglio dei fotogrammi secondo per secondo
const MODI: [number, "stretto" | "intero"][] = [
  [0, "intero"], [16.9, "stretto"], [18.9, "intero"],
];
const BUIO = 43.9; // da qui il video è il cartello nero finale

const modoA = (sec: number) => {
  let k = 0;
  for (let i = 0; i < MODI.length; i++) if (sec >= MODI[i][0]) k = i;
  return k;
};

// pezzi di sottotitolo: massimo 3 parole, mai a cavallo di due frasi
const PEZZI: { a: number; b: number; parole: [number, string][] }[] = (() => {
  const out: { a: number; b: number; parole: [number, string][] }[] = [];
  let cur: [number, string][] = [];
  let g = -1;
  P.forEach(([t, w, gr], i) => {
    if (cur.length === 3 || (gr !== g && cur.length)) { out.push({ a: cur[0][0], b: t, parole: cur }); cur = []; }
    g = gr;
    cur.push([t, w]);
    if (i === P.length - 1) out.push({ a: cur[0][0], b: t + 0.8, parole: cur });
  });
  return out;
})();

export const P1REEL: React.FC = () => {
  const f = useCurrentFrame();
  const sec = f / FPS;
  // quanto è «stretto» (0 = intero, 1 = stretto), con passaggio morbido di 8 frame
  const k = modoA(sec);
  const inizio = F(MODI[k][0]);
  const prima = k > 0 ? (MODI[k - 1][1] === "stretto" ? 1 : 0) : (MODI[0][1] === "stretto" ? 1 : 0);
  const ora = MODI[k][1] === "stretto" ? 1 : 0;
  const z = prima + (ora - prima) * Easing.inOut(Easing.cubic)(interpolate(f, [inizio, inizio + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const Wv = 1080 + (1920 * 16 / 9 - 1080) * z; // larghezza del video
  const Hv = (Wv * 9) / 16;
  const cy = 860 + (960 - 860) * z;
  const buio = sec >= BUIO;
  const fondo = buio ? "#000" : "#fff";

  const pezzo = PEZZI.find((p) => sec >= p.a - 0.05 && sec < p.b);
  const eTit = Easing.out(Easing.cubic)(interpolate(f, [0, 10], [0, 1], { extrapolateRight: "clamp" }));

  return (
    <AbsoluteFill style={{ background: fondo, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 540 - Wv / 2, top: cy - Hv / 2, width: Wv, height: Hv }}>
        <OffthreadVideo src={staticFile("p1/P1-v2.mp4")} style={{ width: "100%", height: "100%" }} />
      </div>
      {/* titolo fisso in alto: sparisce quando C è a tutto schermo, torna con il video intero */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 230, textAlign: "center", opacity: eTit * (1 - z) * (buio ? 0 : 1) }}>
        <div style={{ fontFamily: INTER, fontWeight: 700, fontSize: 30, letterSpacing: 6, color: "#6b6880", marginBottom: 14 }}>C · THE TRADER</div>
        <div style={{ fontFamily: ANTON, fontSize: 104, lineHeight: 1.05, color: INCHIOSTRO, textTransform: "uppercase" }}>
          FARE SOLDI<br />COL <span style={{ background: VIOLA, color: "#fff", padding: "0 22px" }}>TRADING?</span>
        </div>
      </div>
      {/* sottotitoli */}
      {pezzo && (
        <div style={{ position: "absolute", left: 40, right: 40, top: z > 0.5 ? 1380 : 1330, textAlign: "center" }}>
          {pezzo.parole.map(([t, w], i) => {
            const detta = sec >= t;
            const m = interpolate(f, [F(t), F(t) + 4], [0.85, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            return (
              <span key={i} style={{ display: "inline-block", margin: "0 14px", fontFamily: ANTON, fontSize: 112, lineHeight: 1.1, textTransform: "uppercase",
                transform: `scale(${detta ? m : 0.85})`, color: detta ? (buio ? "#fff" : "#fff") : "rgba(255,255,255,0.75)",
                background: detta && i === pezzo.parole.filter(([tt]) => sec >= tt).length - 1 ? VIOLA : "transparent",
                padding: "0 12px", WebkitTextStroke: "10px #000", paintOrder: "stroke fill" }}>{w}</span>
            );
          })}
        </div>
      )}
    </AbsoluteFill>
  );
};
