// P2 trailer «Le prop firm sono una trappola?» (13/11/2026): YouTube 16:9, mini-film con il manichino low-poly + C conduttore.
// Copione intero: produzione/youtube/P2-prop-firm/COPIONE-v1.md. Trailer di prova: youtube/P2-prop-firm/trailer/.
// Stessa regia del P1 v2 (approvato da Marco): punch a ogni stacco, shake sugli impatti, testi che esplodono, musica a crescendo con stop.
// Tutti i tempi vengono dalle parole della voce (p2trailer-parole.ts).
import React from "react";
import { AbsoluteFill, Audio, Easing, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadPixel } from "@remotion/google-fonts/PressStart2P";
import { INTER, molla, NERO, ROSSO, VIOLA } from "./FormatC";
import { PAROLE_P2TRAILER as P, DURATA_P2TRAILER_S } from "./p2trailer-parole";

const { fontFamily: PIXEL } = loadPixel();
const C = "p2";
const FPS = 30;
const F = (s: number) => Math.round(s * FPS);
const CODA = 3.2;
export const DURATA_P2TRAILER = F(DURATA_P2TRAILER_S + CODA);
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
  centomila: T("centomila"), su: T("Su"), sette1: T("sette"), sette2: T("Sette", 2), sono: T("Sono"), primo: T("primo"),
  ti: T("Ti"), genio: T("genio"), secondo: T("secondo"), gira: T("gira"), meno: T("Meno"), conto: T("Conto", 1, T("Meno")), chiuso: T("chiuso"),
  e: T("E", 1, T("chiuso")), riprova: T("riprova"), sconto: T("sconto"), prima: T("Prima"), seconda: T("Seconda"), terza: T("Terza"),
  la: T("La", 1, T("Terza")), perda: T("perda"), ha: T("Ha", 1, T("perda")), riprovi: T("riprovi"), questa: T("Questa"), novantatre: T("novantatre"),
  alla: T("alla", 1, T("Questa")), sette3: T("sette", 1, T("alla")), fine: DURATA_P2TRAILER_S,
};

// ---------- inquadrature ----------
type Shot =
  | { a: number; tipo: "parla"; s: number; o?: string; spinta?: number }
  | { a: number; tipo: "clip"; file: string; da?: number; s?: number; s2?: number; o?: string }
  | { a: number; tipo: "omini" };
const MEDIO = 1.28, STRETTO = 1.5;
const O_VISO = "50% 6%";
const SHOT: Shot[] = [
  { a: 0, tipo: "clip", file: "s01", s: 1.0, s2: 1.25, o: "40% 45%" },          // notte: compra la challenge
  { a: t.su, tipo: "omini" },                                                     // 100 omini, 93 si spengono
  { a: t.sette2, tipo: "parla", s: STRETTO, o: O_VISO, spinta: 0.06 },           // C: «Sette.»
  { a: t.sono, tipo: "clip", file: "s02", s: 1.05, s2: 1.15, o: "60% 40%" },      // mattina, caffè, ore 9
  { a: t.primo, tipo: "clip", file: "s03", s: 1.1, s2: 1.3, o: "70% 30%" },       // +2%
  { a: t.ti, tipo: "clip", file: "s04", s: 1.0, s2: 1.12, o: "60% 50%" },         // si sente un genio
  { a: t.secondo, tipo: "clip", file: "s05", s: 1.05, s2: 1.3, o: "35% 40%" },    // la notizia, crollo
  { a: t.meno, tipo: "clip", file: "s06", s: 1.1, s2: 1.25, o: "50% 40%" },       // mani in testa
  { a: t.conto, tipo: "clip", file: "s07", s: 1.15, s2: 1.35, o: "30% 50%" },     // ACCOUNT BREACHED
  { a: t.e, tipo: "clip", file: "s08", s: 1.05, s2: 1.3, o: "45% 55%" },          // l'offerta sul telefono
  { a: t.prima, tipo: "clip", file: "s09", s: 1.0, s2: 1.15 },                    // dall'alto: le ricevute
  { a: t.seconda, tipo: "clip", file: "s10", s: 1.0, s2: 1.1, o: "60% 50%" },     // notte fonda
  { a: t.terza, tipo: "clip", file: "s07", da: 1.5, s: 1.4, s2: 1.5, o: "30% 50%" }, // di nuovo chiuso
  { a: t.la, tipo: "parla", s: MEDIO },                                           // C conduttore
  { a: t.ha, tipo: "parla", s: STRETTO, o: O_VISO, spinta: 0.05 },
  { a: t.questa, tipo: "clip", file: "s11", s: 1.0, s2: 1.2 },                    // gli altri 93
  { a: t.alla, tipo: "clip", file: "s12", s: 1.0, s2: 1.25, o: "50% 35%" },       // C davanti all'EXIT
];
const fineShot = (i: number) => (i + 1 < SHOT.length ? SHOT[i + 1].a : t.fine + CODA);
const SHAKE = [t.chiuso, t.terza, t.perda, t.sette2];
const SCURO = new Set(["s01", "s05", "s06", "s07", "s10", "s11", "s12"]);

const Punch: React.FC<{ a: number; children: React.ReactNode; base: number; o: string; fino?: number }> = ({ a, children, base, o, fino = 0 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fa = F(a);
  const m = molla(f, fps, fa, 14, 260);
  const s = base * (1 + 0.07 * (1 - m)) * (1 + fino);
  let x = 0, y = 0;
  for (const tt of SHAKE) {
    const d = f - F(tt);
    if (d >= 0 && d < 10) { const k = (1 - d / 10) * 16; x += Math.sin(d * 2.7) * k; y += Math.cos(d * 3.3) * k * 0.6; }
  }
  const blur = interpolate(f - fa, [0, 2], [3, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <AbsoluteFill style={{ transform: `translate(${x}px, ${y}px) scale(${s})`, transformOrigin: o, filter: blur > 0.2 ? `blur(${blur}px)` : undefined }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

const Inquadratura: React.FC<{ i: number }> = ({ i }) => {
  const f = useCurrentFrame();
  const sh = SHOT[i];
  const a = sh.a, b = fineShot(i);
  const p = cl((f / FPS - a) / Math.max(0.1, b - a));
  if (sh.tipo === "parla") {
    return (
      <Punch a={a} base={sh.s} o={sh.o ?? "50% 26%"} fino={(sh.spinta ?? 0.015) * Easing.inOut(Easing.quad)(p)}>
        <OffthreadVideo src={staticFile(`${C}/C-parla.mp4`)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </Punch>
    );
  }
  if (sh.tipo === "clip") {
    const s = (sh.s ?? 1) + ((sh.s2 ?? sh.s ?? 1) - (sh.s ?? 1)) * Easing.inOut(Easing.quad)(p);
    return (
      <Punch a={a} base={s} o={sh.o ?? "50% 50%"}>
        <Sequence from={F(a)} layout="none">
          <OffthreadVideo src={staticFile(`${C}/clip/${sh.file}.mp4`)} muted startFrom={F(sh.da ?? 0.2)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </Sequence>
      </Punch>
    );
  }
  return null;
};

// ---------- 100 omini: 93 si spengono, 7 restano viola ----------
const VIVI = new Set([7, 23, 38, 44, 61, 79, 92]);
const Omini: React.FC<{ a: number }> = ({ a }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const spenti: number[] = [];
  for (let k = 0; k < 100; k++) if (!VIVI.has(k)) spenti.push(k);
  const ordine = new Map(spenti.map((k, j) => [k, (j * 37) % 93]));  // ordine sparso
  const inizio = F(t.sette1 - 0.1), durata = F(1.3);
  const m = molla(f, fps, F(a), 14, 220);
  return (
    <AbsoluteFill style={{ background: "#fff", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontFamily: INTER, fontWeight: 900, fontSize: 64, letterSpacing: -2, color: INCHIOSTRO, marginBottom: 30, opacity: m }}>
        {f < inizio ? "100 TRADER" : <>SOLO <span style={{ background: VIOLA, color: "#fff", padding: "0 14px" }}>7</span> VEDONO UN PAGAMENTO</>}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(20, 64px)", gap: "18px 14px", transform: `scale(${0.85 + 0.15 * m})` }}>
        {Array.from({ length: 100 }, (_, k) => {
          const pop = molla(f, fps, F(a) + Math.floor(k / 4) * 0.4, 12, 260);
          const o = ordine.get(k);
          const spento = o !== undefined && f >= inizio + (o / 93) * durata;
          const col = VIVI.has(k) && f >= inizio ? VIOLA : spento ? "#d9d9de" : INCHIOSTRO;
          return (
            <svg key={k} width={64} height={90} viewBox="0 0 64 90" style={{ transform: `scale(${pop})` }}>
              <circle cx="32" cy="18" r="15" fill={col} />
              <path d="M8 88 Q8 40 32 40 Q56 40 56 88 Z" fill={col} />
            </svg>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- testi che esplodono ----------
const Botta: React.FC<{ a: number; b: number; righe: string[]; top?: number; size?: number; barra?: number; scuro?: boolean }> = ({ a, b, righe, top = 700, size = 118, barra, scuro }) => {
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
            const base = scuro ? "#fff" : INCHIOSTRO;
            return (
              <span key={wi} style={{ display: "inline-block", position: "relative", margin: "0 26px", transform: `scale(${m}) rotate(${(1 - m) * -8}deg)`, opacity: m > 0.02 ? 1 : 0,
                fontFamily: INTER, fontWeight: 900, fontSize: size, letterSpacing: -3, textTransform: "uppercase",
                color: viola ? "#fff" : rosso ? ROSSO : base, background: viola ? VIOLA : undefined, padding: viola ? "0 18px" : undefined,
                textShadow: viola ? undefined : scuro ? "0 0 24px #000, 0 4px 0 #000" : "0 0 18px #fff, 0 0 4px #fff, 0 4px 0 #fff" }}>
                {testo}
                {rosso && barrata && <span style={{ position: "absolute", left: -8, right: -8, top: "52%", height: 14, background: scuro ? "#fff" : INCHIOSTRO, transform: `scaleX(${lb}) rotate(-4deg)`, transformOrigin: "left" }} />}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

// ---------- finestra a 8 bit: «Riprovare?» ----------
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
    <div style={{ position: "absolute", left: "50%", top: 300, transform: `translateX(-50%) scale(${m})`, background: NERO, border: "8px solid #fff", boxShadow: "0 0 0 8px #000, 14px 14px 0 8px #000",
      padding: "40px 56px", fontFamily: PIXEL, fontSize: 34, color: "#fff", lineHeight: 1.6, minWidth: 820 }}>
      <div style={{ marginBottom: 28 }}>CHE FACCIAMO?</div>
      {voce("RESET -20%", sceglie)}
      {voce("SMETTI", !sceglie)}
    </div>
  );
};

// ---------- contatore challenge ----------
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

// ---------- flash ----------
const Flash: React.FC<{ a: number; col: string }> = ({ a, col }) => {
  const f = useCurrentFrame();
  const d = f - F(a);
  if (d < 0 || d > 8) return null;
  return <AbsoluteFill style={{ background: col, opacity: 0.75 * (1 - d / 8) }} />;
};

// ---------- sottopancia ----------
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

// ---------- coda: titolo su nero ----------
const Coda: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = F(t.fine + 0.1);
  if (f < a) return null;
  const m = molla(f, fps, a, 12, 200);
  const m2 = molla(f, fps, a + 18, 14, 200);
  return (
    <AbsoluteFill style={{ background: NERO, alignItems: "center", justifyContent: "center" }}>
      <div style={{ transform: `scale(${0.7 + 0.3 * m})`, opacity: m, textAlign: "center", fontFamily: INTER, fontWeight: 900, fontSize: 116, letterSpacing: -4, color: "#fff", lineHeight: 1.0 }}>
        LE PROP FIRM SONO<br />UNA <span style={{ background: VIOLA, padding: "0 20px" }}>TRAPPOLA?</span>
      </div>
      <div style={{ marginTop: 50, opacity: m2, fontFamily: PIXEL, fontSize: 26, color: "#c8c8d0", letterSpacing: 2 }}>IL FILM COMPLETO · PRESTO SU YOUTUBE</div>
    </AbsoluteFill>
  );
};

// ---------- effetti sonori ----------
type Fx = [number, string, number?];
const FX: Fx[] = [
  [0, "boom", 0.5], [t.centomila, "impact", 0.6],
  [t.su - 0.1, "whoosh", 0.8], [t.sette1 - 0.1, "riser", 0.5], [t.sette2, "boom", 0.9],
  [t.sono - 0.1, "whoosh", 0.6], [t.primo, "swish", 0.6], [t.primo + 0.6, "ding", 0.4], [t.ti, "swish", 0.5], [t.genio, "pop", 0.6],
  [t.secondo - 0.1, "whoosh", 0.7], [t.gira, "impact", 0.8], [t.meno, "swish", 0.6], [t.chiuso, "boom", 1.0],
  [t.e, "swish", 0.5], [t.riprova - 0.05, "pop", 0.7], [t.riprova + 1.0, "tick", 0.9], [t.sconto, "ding", 0.5],
  [t.prima, "impact", 0.7], [t.seconda, "impact", 0.8], [t.terza, "boom", 0.9],
  [t.la, "whoosh", 0.5], [t.perda, "impact", 0.6], [t.ha, "swish", 0.5], [t.riprovi, "impact", 0.8],
  [t.questa - 0.1, "whoosh", 0.7], [t.novantatre, "impact", 0.7], [t.alla, "swish", 0.5], [t.fine + 0.1, "boom", 1.0],
];

export const P2TRAILER: React.FC = () => {
  const f = useCurrentFrame();
  const sec = f / FPS;
  const i = SHOT.findIndex((s, k) => sec >= s.a && sec < fineShot(k));
  const sh = SHOT[Math.max(0, i)];
  const scuro = sh.tipo === "clip" && SCURO.has(sh.file);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {sh.tipo === "omini" ? <Omini a={sh.a} /> : <Inquadratura i={Math.max(0, i)} />}
      <Botta a={t.centomila - 0.1} b={t.su - 0.05} righe={["UN CONTO DA", "*100.000 $"]} top={640} scuro />
      <Botta a={t.sette2} b={t.sono - 0.05} righe={["*7 SU 100"]} top={780} size={150} />
      <Botta a={t.genio - 0.1} b={t.secondo - 0.25} righe={["UN *GENIO"]} top={800} />
      <Botta a={t.meno} b={t.conto - 0.05} righe={["!-5% IN UN GIORNO"]} top={790} scuro={scuro} />
      <Botta a={t.chiuso - 0.05} b={t.e - 0.05} righe={["CONTO !CHIUSO"]} top={800} size={140} barra={t.chiuso + 0.15} scuro />
      <OttoBit a={t.riprova - 0.05} b={t.prima - 0.05} />
      <Contatore />
      <Botta a={t.la + 0.1} b={t.ha - 0.05} righe={["NON HA BISOGNO", "CHE TU !PERDA"]} top={590} barra={t.perda + 0.3} />
      <Botta a={t.riprovi - 0.15} b={t.questa - 0.05} righe={["CHE TU *RIPROVI"]} top={790} size={140} />
      <Botta a={t.novantatre - 0.1} b={t.alla - 0.05} righe={["GLI ALTRI *93"]} top={790} size={140} scuro />
      <Botta a={t.sette3 - 0.3} b={t.fine} righe={["COSA FANNO I *7"]} top={800} scuro />
      <Nome a={t.la + 0.1} b={t.riprovi - 0.3} />
      <Flash a={t.chiuso} col={ROSSO} />
      <Flash a={t.terza} col={ROSSO} />
      <Flash a={t.sette2} col="#fff" />
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
