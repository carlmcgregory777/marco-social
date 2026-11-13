// P2 trailer v2 (13/11/2026), richiesta di Marco: «più cinematografico, come il video del casinò, copia anche le animazioni».
// Dal casinò (r8xOR7SX_34, studio in produzione/studio-hormozi/fogli3):
//   - camera sempre in movimento (clip Seedance con CAMERA_MOVE=1), angoli insoliti: drone, riflesso nel vetro, macro, dall'alto col faro,
//     dietro il monitor, dal basso, olandese; luce bassa blu/viola, grana e vignettatura su tutte le riprese
//   - titolo a contorno con l'orario piccolo accanto («CASINO' 21:00» → «PROP FIRM 23:47»), orari agganciati alla scena
//   - etichette nella scena: cifra + linea sottile che punta all'oggetto («1 REGOLA» → «540 €», «100.000 $»)
//   - frase piccola + parola enorme («tu non sei come LORO» → «la storia degli ALTRI 93»)
//   - stacco secco su nero dopo il colpo, finestra a 8 bit, etichetta «PROSSIMAMENTE» in basso a sinistra («TRA POCO»)
// Le parti di C in studio restano con la regia del P1 (punch, testi che esplodono), che Marco ha approvato.
import React from "react";
import { AbsoluteFill, Audio, Easing, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadPixel } from "@remotion/google-fonts/PressStart2P";
import { INTER, molla, NERO, ROSSO, VIOLA } from "./FormatC";
import { PAROLE_P2TRAILER as P, DURATA_P2TRAILER_S } from "./p2trailer-parole";

const { fontFamily: PIXEL } = loadPixel();
const C = "p2";
const FPS = 30;
const F = (s: number) => Math.round(s * FPS);
const CODA = 3.4;
export const DURATA_P2TRAILER2 = F(DURATA_P2TRAILER_S + CODA);
const INCHIOSTRO = "#15131a";
const cl = (x: number) => Math.max(0, Math.min(1, x));
const ramp = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]/g, "");
const T = (w: string, n = 1, dopo = 0): number => {
  let k = 0;
  for (const p of P) if (p[0] >= dopo && norm(p[1]).startsWith(norm(w)) && ++k === n) return p[0];
  throw new Error("parola non trovata: " + w);
};
const t = {
  qualche: T("qualche"), conto0: T("conto"), centomila: T("centomila"), su: T("Su"), sette1: T("sette"), sette2: T("Sette", 2), sono: T("Sono"),
  hai: T("Hai"), primo: T("primo"), ti: T("Ti"), genio: T("genio"), secondo: T("secondo"), il2: T("Il", 1, T("dato")), meno: T("Meno"),
  conto: T("Conto", 1, T("Meno")), chiuso: T("chiuso"), e: T("E", 1, T("chiuso")), riprova: T("riprova"), sconto: T("sconto"),
  prima: T("Prima"), seconda: T("Seconda"), terza: T("Terza"), la: T("La", 1, T("Terza")), perda: T("perda"), ha: T("Ha", 1, T("perda")),
  riprovi: T("riprovi"), questa: T("Questa"), novantatre: T("novantatre"), alla: T("alla", 1, T("Questa")), sette3: T("sette", 1, T("alla")),
  fine: DURATA_P2TRAILER_S,
};

// ---------- inquadrature ----------
type Shot =
  | { a: number; tipo: "parla"; s: number; o?: string; spinta?: number }
  | { a: number; tipo: "film"; file: string; da?: number; s?: number; s2?: number; o?: string; v?: number }
  | { a: number; tipo: "nero" };
const MEDIO = 1.28, STRETTO = 1.5;
const O_VISO = "50% 6%";
const SHOT: Shot[] = [
  { a: 0, tipo: "film", file: "v2/a", s: 1.0, s2: 1.08 },                       // drone: una sola finestra accesa
  { a: t.qualche, tipo: "film", file: "v2/b", s: 1.0, s2: 1.06 },                // macro: la carta di credito
  { a: t.conto0, tipo: "film", file: "v2/c", s: 1.0, s2: 1.05 },                 // riflesso nel vetro: CHALLENGE 100.000 $
  { a: t.su, tipo: "film", file: "v2/d", s: 1.0, s2: 1.12 },                     // dall'alto col faro: 100 scrivanie
  { a: t.sette2, tipo: "parla", s: STRETTO, o: O_VISO, spinta: 0.06 },          // C: «Sette.»
  { a: t.sono, tipo: "film", file: "v2/e", s: 1.0, s2: 1.05 },                   // orologio 9:00, fuoco che passa a lui
  { a: t.hai, tipo: "film", file: "v2/f", s: 1.0, s2: 1.06 },                    // da dietro il monitor
  { a: t.primo, tipo: "film", file: "v2/g", s: 1.0, s2: 1.14, o: "70% 30%" }, // macro schermo +2%: immagine fissa con spinta (nella clip il numero cambia dopo 0,4 s)
  { a: t.ti, tipo: "film", file: "v2/h", s: 1.0, s2: 1.05 },                     // dal basso, braccia aperte
  { a: t.secondo, tipo: "film", file: "v2/i", s: 1.0, s2: 1.08 },                // telefono: BREAKING
  { a: t.il2, tipo: "film", file: "v2/j", s: 1.0, s2: 1.06 },                    // profilo rosso
  { a: t.meno, tipo: "film", file: "v2/k", s: 1.0, s2: 1.08 },                   // olandese, mani in testa
  { a: t.conto, tipo: "film", file: "s07", da: 0.8, s: 1.15, s2: 1.3, o: "30% 50%" }, // ACCOUNT BREACHED
  { a: t.e - 0.28, tipo: "nero" },                                              // stacco su nero
  { a: t.e, tipo: "film", file: "v2/l", s: 1.0, s2: 1.08 },                      // pollice su RETRY -20%
  { a: t.prima, tipo: "film", file: "s09", s: 1.05, s2: 1.12 },                  // dall'alto: le ricevute
  { a: t.seconda, tipo: "film", file: "s10", s: 1.0, s2: 1.08, o: "60% 50%" },   // notte fonda
  { a: t.terza, tipo: "film", file: "s07", da: 2.0, s: 1.4, s2: 1.5, o: "30% 50%" },
  { a: t.la, tipo: "parla", s: MEDIO },                                           // C conduttore (regia P1)
  { a: t.ha, tipo: "parla", s: STRETTO, o: O_VISO, spinta: 0.05 },
  { a: t.questa, tipo: "film", file: "v2/o", s: 1.0, s2: 1.06 },                 // corridoio infinito
  { a: t.alla, tipo: "film", file: "s12", s: 1.0, s2: 1.2, o: "50% 35%" },       // C davanti all'EXIT
];
const fineShot = (i: number) => (i + 1 < SHOT.length ? SHOT[i + 1].a : t.fine + CODA);
const SHAKE = [t.perda, t.sette2];

// grana animata + vignettatura + grading, solo sulle riprese «film»
const Pellicola: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.16, mixBlendMode: "overlay" }}>
        <filter id="grana"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={f % 97} /><feColorMatrix type="saturate" values="0" /></filter>
        <rect width="100%" height="100%" filter="url(#grana)" />
      </svg>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)" }} />
    </AbsoluteFill>
  );
};

const Inquadratura: React.FC<{ i: number }> = ({ i }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sh = SHOT[i];
  const a = sh.a, b = fineShot(i);
  const p = cl((f / FPS - a) / Math.max(0.1, b - a));
  if (sh.tipo === "nero") return <AbsoluteFill style={{ background: "#000" }} />;
  if (sh.tipo === "parla") {
    const m = molla(f, fps, F(a), 14, 260);
    let x = 0, y = 0;
    for (const tt of SHAKE) {
      const d = f - F(tt);
      if (d >= 0 && d < 10) { const k = (1 - d / 10) * 16; x += Math.sin(d * 2.7) * k; y += Math.cos(d * 3.3) * k * 0.6; }
    }
    const s = sh.s * (1 + 0.07 * (1 - m)) * (1 + (sh.spinta ?? 0.015) * Easing.inOut(Easing.quad)(p));
    return (
      <AbsoluteFill style={{ overflow: "hidden", background: "#fff" }}>
        <AbsoluteFill style={{ transform: `translate(${x}px, ${y}px) scale(${s})`, transformOrigin: sh.o ?? "50% 26%" }}>
          <OffthreadVideo src={staticFile(`${C}/C-parla.mp4`)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </AbsoluteFill>
      </AbsoluteFill>
    );
  }
  // film: niente rimbalzo, solo una lenta spinta in più sopra il movimento di macchina, e un'entrata morbida di 3 frame
  const s = (sh.s ?? 1) + ((sh.s2 ?? sh.s ?? 1) - (sh.s ?? 1)) * Easing.inOut(Easing.sin)(p);
  const luce = interpolate(f - F(a), [0, 3], [0.55, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${s})`, transformOrigin: sh.o ?? "50% 50%", filter: `brightness(${luce}) contrast(1.08) saturate(0.92)` }}>
        <Sequence from={F(a)} layout="none">
          <OffthreadVideo src={staticFile(`${C}/clip/${sh.file}.mp4`)} muted startFrom={F(sh.da ?? 0.15)} playbackRate={sh.v ?? 1} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </Sequence>
      </AbsoluteFill>
      <Pellicola />
    </AbsoluteFill>
  );
};

// ---------- titolo a contorno con orario (come «CASINO' 21:00») ----------
const Contorno: React.FC<{ a: number; b: number; testo: string; ora?: string; x?: number; y?: number; size?: number }> = ({ a, b, testo, ora, x = 140, y = 120, size = 190 }) => {
  const f = useCurrentFrame();
  if (f < F(a) || f > F(b)) return null;
  const e = Easing.out(Easing.cubic)(ramp(f, F(a), F(a) + 14));
  const u = ramp(f, F(b) - 6, F(b));
  const deriva = (f - F(a)) * 0.25;  // segue lentamente la camera
  return (
    <div style={{ position: "absolute", left: x - deriva, top: y, opacity: 1 - u }}>
      <div style={{ fontFamily: INTER, fontWeight: 900, fontSize: size, letterSpacing: 8, lineHeight: 1, color: "transparent", WebkitTextStroke: "3px rgba(255,255,255,0.92)",
        clipPath: `inset(0 ${(1 - e) * 100}% 0 0)`, textShadow: "0 0 30px rgba(139,109,255,0.25)" }}>{testo}</div>
      {ora && <div style={{ position: "absolute", right: -10, top: -34, fontFamily: INTER, fontWeight: 600, fontSize: 30, color: "#fff", opacity: e, letterSpacing: 2 }}>{ora}</div>}
    </div>
  );
};

// ---------- etichetta nella scena: cifra + linea che punta all'oggetto (come «1 REGOLA») ----------
const Punta: React.FC<{ a: number; b: number; testo: string; x: number; y: number; dx: number; dy: number; col?: string; size?: number }> = ({ a, b, testo, x, y, dx, dy, col = "#fff", size = 58 }) => {
  const f = useCurrentFrame();
  if (f < F(a) || f > F(b)) return null;
  const l = Easing.out(Easing.cubic)(ramp(f, F(a), F(a) + 9));
  const tx = ramp(f, F(a) + 6, F(a) + 12);
  const u = ramp(f, F(b) - 5, F(b));
  const deriva = (f - F(a)) * 0.35;
  const len = Math.hypot(dx, dy), ang = (Math.atan2(dy, dx) * 180) / Math.PI;
  return (
    <div style={{ position: "absolute", left: x - deriva, top: y, opacity: 1 - u }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: len * l, height: 3, background: col, transform: `rotate(${ang}deg)`, transformOrigin: "0 50%", boxShadow: "0 0 8px rgba(0,0,0,0.6)" }} />
      <div style={{ position: "absolute", left: -7, top: -6, width: 14, height: 14, borderRadius: 7, background: col }} />
      <div style={{ position: "absolute", left: dx + (dx >= 0 ? 16 : -16), top: dy - size * 0.62, transform: dx >= 0 ? undefined : "translateX(-100%)", whiteSpace: "nowrap",
        fontFamily: INTER, fontWeight: 800, fontSize: size, color: col, letterSpacing: 1, opacity: tx, textShadow: "0 2px 18px rgba(0,0,0,0.8)" }}>{testo}</div>
    </div>
  );
};

// ---------- frase piccola + parola enorme (come «tu non sei come LORO») ----------
const PiccoloGrande: React.FC<{ a: number; b: number; piccolo: string[]; grande: string; x: number; y: number; col?: string }> = ({ a, b, piccolo, grande, x, y, col = "#fff" }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < F(a) || f > F(b)) return null;
  const u = ramp(f, F(b) - 5, F(b));
  const m = molla(f, fps, F(a) + 10, 11, 260);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: 1 - u, color: col, textShadow: "0 4px 24px rgba(0,0,0,0.8)" }}>
      {piccolo.map((r, k) => (
        <div key={k} style={{ fontFamily: INTER, fontWeight: 500, fontStyle: "italic", fontSize: 44, lineHeight: 1.05, opacity: ramp(f, F(a) + 3 * k, F(a) + 3 * k + 5), marginLeft: 120 }}>{r}</div>
      ))}
      <div style={{ fontFamily: INTER, fontWeight: 900, fontSize: 200, lineHeight: 0.95, letterSpacing: -6, transform: `scale(${m})`, transformOrigin: "0 50%", opacity: m > 0.02 ? 1 : 0 }}>{grande}</div>
    </div>
  );
};

// ---------- conteggio 100 → 7 sulla vista dall'alto ----------
const Conteggio: React.FC = () => {
  const f = useCurrentFrame();
  const a = F(t.su), b = F(t.sette2);
  if (f < a || f >= b) return null;
  const da = F(t.sette1 - 0.6), al = F(t.sette1 + 0.2);
  const n = Math.round(interpolate(f, [da, al], [100, 7], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) }));
  const e = ramp(f, a, a + 10);
  return (
    <div style={{ position: "absolute", left: 140, bottom: 120, opacity: e }}>
      <div style={{ fontFamily: INTER, fontWeight: 600, fontSize: 34, color: "#c8c8d0", letterSpacing: 4 }}>{f < da ? "CHI CI PROVA" : "CHI VIENE PAGATO"}</div>
      <div style={{ fontFamily: INTER, fontWeight: 900, fontSize: 230, lineHeight: 1, color: n <= 7 ? "#fff" : "transparent", WebkitTextStroke: n <= 7 ? undefined : "3px #fff",
        background: n <= 7 ? VIOLA : undefined, padding: n <= 7 ? "0 30px" : undefined, display: "inline-block" }}>{n}</div>
    </div>
  );
};

// ---------- testi che esplodono (solo sulle parti di C, regia P1) ----------
const Botta: React.FC<{ a: number; b: number; righe: string[]; top?: number; size?: number; barra?: number }> = ({ a, b, righe, top = 700, size = 118, barra }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < F(a) || f > F(b) + 5) return null;
  const u = ramp(f, F(b), F(b) + 5);
  let k = 0;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top, textAlign: "center", opacity: 1 - u }}>
      {righe.map((r, ri) => (
        <div key={ri} style={{ lineHeight: 1.0, marginBottom: 10 }}>
          {r.split(" ").map((w, wi) => {
            const d = F(a) + 2 * k++;
            const m = molla(f, fps, d, 11, 240);
            const viola = w.startsWith("*"), rosso = w.startsWith("!");
            const testo = w.replace(/^[*!]/, "");
            const barrata = rosso && barra !== undefined && f >= F(barra);
            const lb = barra !== undefined ? ramp(f, F(barra), F(barra) + 4) : 0;
            return (
              <span key={wi} style={{ display: "inline-block", position: "relative", margin: "0 26px", transform: `scale(${m}) rotate(${(1 - m) * -8}deg)`, opacity: m > 0.02 ? 1 : 0,
                fontFamily: INTER, fontWeight: 900, fontSize: size, letterSpacing: -3, textTransform: "uppercase",
                color: viola ? "#fff" : rosso ? ROSSO : INCHIOSTRO, background: viola ? VIOLA : undefined, padding: viola ? "0 18px" : undefined,
                textShadow: viola ? undefined : "0 0 18px #fff, 0 0 4px #fff, 0 4px 0 #fff" }}>
                {testo}
                {rosso && barrata && <span style={{ position: "absolute", left: -8, right: -8, top: "52%", height: 14, background: INCHIOSTRO, transform: `scaleX(${lb}) rotate(-4deg)`, transformOrigin: "left" }} />}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

// ---------- finestra a 8 bit ----------
const OttoBit: React.FC<{ a: number; b: number }> = ({ a, b }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < F(a) || f > F(b)) return null;
  const m = molla(f, fps, F(a), 13, 300);
  const sceglie = f >= F(a + 1.0);
  const lamp = Math.floor(f / 8) % 2 === 0;
  const voce = (txt: string, attiva: boolean) => (
    <div style={{ display: "flex", alignItems: "center", gap: 18, color: attiva ? "#fff" : "#9a98a8" }}>
      <span style={{ width: 30, opacity: attiva && lamp ? 1 : 0 }}>▶</span>
      <span style={{ background: attiva ? VIOLA : "transparent", padding: "10px 16px" }}>{txt}</span>
    </div>
  );
  return (
    <div style={{ position: "absolute", left: 120, top: 140, transform: `scale(${m})`, transformOrigin: "0 0", background: NERO, border: "8px solid #fff", boxShadow: "0 0 0 8px #000, 14px 14px 0 8px #000",
      padding: "36px 50px", fontFamily: PIXEL, fontSize: 32, color: "#fff", lineHeight: 1.6, minWidth: 700 }}>
      <div style={{ marginBottom: 24 }}>CHE FACCIAMO?</div>
      {voce("RESET -20%", sceglie)}
      {voce("SMETTI", !sceglie)}
    </div>
  );
};

const Contatore: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tappe = [t.prima, t.seconda, t.terza];
  if (f < F(t.prima) || f >= F(t.la)) return null;
  const n = tappe.filter((x) => f >= F(x)).length;
  const m = molla(f, fps, F(tappe[n - 1]), 10, 320);
  return (
    <div style={{ position: "absolute", right: 90, top: 80, fontFamily: PIXEL, fontSize: 46, color: "#fff", background: ROSSO, padding: "22px 30px", transform: `scale(${0.6 + 0.4 * m}) rotate(-3deg)`, boxShadow: "10px 10px 0 #000" }}>
      CHALLENGE #{n}
    </div>
  );
};

const Nome: React.FC<{ a: number; b: number }> = ({ a, b }) => {
  const f = useCurrentFrame();
  if (f < F(a) || f > F(b) + 8) return null;
  const e = Easing.out(Easing.cubic)(ramp(f, F(a), F(a) + 8));
  const u = ramp(f, F(b), F(b) + 6);
  return (
    <div style={{ position: "absolute", left: 0, bottom: 40, opacity: 1 - u, clipPath: `inset(0 ${(1 - e) * 100}% 0 0)` }}>
      <div style={{ background: "#0d0d10", padding: "18px 44px 18px 90px" }}>
        <div style={{ fontFamily: INTER, fontWeight: 900, fontSize: 54, color: "#fff", letterSpacing: -1 }}>C · THE TRADER</div>
        <div style={{ fontFamily: INTER, fontSize: 22, color: "#c8c8d0", marginTop: 2 }}>personaggio AI · dietro c'è Marco · @cthe.trader</div>
      </div>
    </div>
  );
};

// etichetta fissa in basso a sinistra (come «TRA POCO»)
const Prossimamente: React.FC = () => {
  const f = useCurrentFrame();
  if (f < F(t.sono) || f >= F(t.la)) return null;
  return <div style={{ position: "absolute", left: 60, bottom: 50, fontFamily: INTER, fontWeight: 600, fontSize: 26, color: "#fff", letterSpacing: 3, opacity: 0.85, textShadow: "0 2px 10px #000" }}>PROSSIMAMENTE</div>;
};

const Coda: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = F(t.fine + 0.1);
  if (f < a) return null;
  const e = Easing.out(Easing.cubic)(ramp(f, a, a + 18));
  const m2 = molla(f, fps, a + 22, 14, 200);
  return (
    <AbsoluteFill style={{ background: "#000", alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "relative", textAlign: "center" }}>
        <div style={{ fontFamily: INTER, fontWeight: 900, fontSize: 150, letterSpacing: 6, lineHeight: 1.0, color: "transparent", WebkitTextStroke: "3px #fff", clipPath: `inset(0 ${(1 - e) * 100}% 0 0)` }}>
          LE PROP FIRM
        </div>
        <div style={{ position: "absolute", right: 0, top: -40, fontFamily: INTER, fontWeight: 600, fontSize: 30, color: "#fff", opacity: e }}>08:00</div>
        <div style={{ marginTop: 18, transform: `scale(${m2})`, opacity: m2 > 0.02 ? 1 : 0, fontFamily: INTER, fontWeight: 900, fontSize: 110, letterSpacing: -3, color: "#fff" }}>
          SONO UNA <span style={{ background: VIOLA, padding: "0 20px" }}>TRAPPOLA?</span>
        </div>
      </div>
      <div style={{ position: "absolute", left: 60, bottom: 50, fontFamily: INTER, fontWeight: 600, fontSize: 26, color: "#fff", letterSpacing: 3, opacity: m2 }}>IL FILM COMPLETO · PRESTO SU YOUTUBE</div>
    </AbsoluteFill>
  );
};

type Fx = [number, string, number?];
const FX: Fx[] = [
  [0, "boom", 0.4], [t.qualche, "swish", 0.4], [t.centomila, "ding", 0.4], [t.su, "whoosh", 0.6],
  [t.sette1 - 0.6, "riser", 0.5], [t.sette2, "boom", 0.9],
  [t.sono, "tick", 0.8], [t.hai, "swish", 0.4], [t.primo, "swish", 0.5], [t.primo + 0.6, "ding", 0.35], [t.ti, "whoosh", 0.5],
  [t.secondo, "impact", 0.6], [t.il2, "whoosh", 0.5], [t.meno, "impact", 0.8], [t.chiuso, "boom", 1.0],
  [t.e, "swish", 0.4], [t.riprova - 0.05, "pop", 0.7], [t.riprova + 1.0, "tick", 0.9],
  [t.prima, "impact", 0.7], [t.seconda, "impact", 0.8], [t.terza, "boom", 0.9],
  [t.la, "whoosh", 0.5], [t.perda, "impact", 0.6], [t.ha, "swish", 0.5], [t.riprovi, "impact", 0.8],
  [t.questa - 0.1, "whoosh", 0.6], [t.novantatre, "impact", 0.8], [t.alla, "swish", 0.5], [t.fine + 0.1, "boom", 1.0],
];

export const P2TRAILER2: React.FC = () => {
  const f = useCurrentFrame();
  const sec = f / FPS;
  const i = Math.max(0, SHOT.findIndex((s, k) => sec >= s.a && sec < fineShot(k)));
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Inquadratura i={i} />
      <Contorno a={0.2} b={t.qualche - 0.05} testo="PROP FIRM" ora="23:47" x={150} y={150} />
      <Punta a={t.qualche + 0.3} b={t.conto0 - 0.05} testo="540 €" x={890} y={420} dx={260} dy={-150} />
      <Conteggio />
      <Contorno a={t.sono} b={t.hai - 0.05} testo="09:00" x={760} y={820} size={170} />
      <Contorno a={t.primo} b={t.ti - 0.05} testo="GIORNO 1" ora="09:12" x={140} y={820} size={150} />
      <PiccoloGrande a={t.ti} b={t.secondo - 0.05} piccolo={["ti senti"]} grande="UN GENIO" x={120} y={680} />
      <Contorno a={t.secondo} b={t.il2 - 0.05} testo="GIORNO 2" ora="14:30" x={140} y={130} size={150} />
      <Punta a={t.meno + 0.2} b={t.conto - 0.05} testo="−5%" x={1150} y={380} dx={260} dy={-160} col={ROSSO} size={80} />
      <OttoBit a={t.riprova - 0.05} b={t.prima - 0.05} />
      <Contatore />
      <Prossimamente />
      <Botta a={t.la + 0.1} b={t.ha - 0.05} righe={["NON HA BISOGNO", "CHE TU !PERDA"]} top={590} barra={t.perda + 0.3} />
      <Botta a={t.riprovi - 0.15} b={t.questa - 0.05} righe={["CHE TU *RIPROVI"]} top={790} size={140} />
      <Nome a={t.la + 0.1} b={t.riprovi - 0.3} />
      <PiccoloGrande a={t.questa + 0.2} b={t.alla - 0.05} piccolo={["questa è", "la storia degli"]} grande="ALTRI 93" x={120} y={600} />
      <PiccoloGrande a={t.sette3 - 0.6} b={t.fine} piccolo={["e cosa fanno"]} grande="I 7" x={1180} y={600} />
      <Coda />
      <Audio src={staticFile(`${C}/voce.wav`)} />
      <Audio src={staticFile(`${C}/musica.wav`)} volume={0.34} />
      {FX.map(([tt, nome, v], k) => (
        <Sequence key={k} from={Math.max(0, F(tt))} durationInFrames={F(2.2)}>
          <Audio src={staticFile(`${C}/sfx/${nome}.wav`)} volume={(v ?? 0.6) * 0.55} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
