// Reel affiliato Higgsfield «Shorts Studio» con C (11/11/2026).
// Schema preso dal reel di Simone Massaro Dfknph9xASv (campagna #HiggsfieldCreator, parola SHORTS):
// presentatore alla scrivania ripreso da più inquadrature, sottotitoli cinetici,
// schermate e miniature che compaiono mentre parla, effetti sonori sui tagli.
// Qui: C in 4 inquadrature (higgsfield-aff/shorts/set), ognuna col labiale sull'INTERA voce: il taglio tra una
// camera e l'altra si può mettere dove si vuole e il labiale resta a tempo.
// v2 (11/11/2026, Marco: «la prima schermata è troppo arancione e il montaggio può essere fatto meglio»):
// niente bicromia arancione, stacchi solo a inizio frase (21 invece di 33) senza lampi bianchi, carrellate morbide,
// sottotitoli fermi nel terzo basso, scritte grandi in Inter pulito al posto dei timbri, schermata a tutto schermo,
// sovrimpressioni che escono in dissolvenza.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ANTON, INTER, MONO, molla, NERO, VIOLA } from "./FormatC";
import { FINE_SHORTS, PAROLE_SHORTS } from "./shorts-parole";

const CART = "shorts";
const LIME = "#D2FF1F";
const F = (s: number) => Math.round(s * 30);
const CODA = 1.3;
export const DURATA_SHORTSC = F(FINE_SHORTS + CODA);

// ---------- regia: [da (s), camera, zoom, fuoco x, fuoco y] ----------
type Taglio = [number, "A" | "B" | "C" | "D", number, number, number];
const REGIA: Taglio[] = [
  [0.0, "A", 1.0, 0.5, 0.3], // Fable 5.2 è appena uscito.
  [2.04, "C", 1.0, 0.5, 0.3], // E questo video l'ha montato lui.
  [3.96, "C", 1.18, 0.5, 0.26], // Tutto. Da solo.
  [5.14, "B", 1.0, 0.5, 0.3], // Niente After Effects. Niente Premiere. Niente.
  [7.46, "A", 1.0, 0.5, 0.3], // I sottotitoli, i tagli, gli effetti:
  [9.43, "A", 1.16, 0.5, 0.25], // tutto fatto da Claude.
  [10.45, "D", 1.0, 0.5, 0.3], // E il mio personaggio è nato su Higgsfield.
  [12.72, "C", 1.0, 0.5, 0.3], // E adesso Higgsfield regala ai nuovi utenti
  [15.15, "A", 1.0, 0.5, 0.3], // tre giorni di accesso illimitato a tutti i modelli.
  [17.86, "A", 1.2, 0.5, 0.24], // Gratis.
  [18.68, "B", 1.0, 0.5, 0.3], // Guarda: le schermate compaiono mentre te le spiego.
  [21.05, "D", 1.0, 0.5, 0.3], // E gli effetti sonori
  [22.26, "C", 1.08, 0.5, 0.3], // cadono (stacco dimostrativo)
  [22.95, "A", 1.0, 0.5, 0.3], // tagli. Dentro Claude c'è Shorts Studio, di Higgsfield.
  [26.21, "D", 1.0, 0.5, 0.3], // Gli carichi il tuo video che è andato meglio
  [28.48, "B", 1.0, 0.5, 0.3], // Oppure parti da un modello già collaudato.
  [30.86, "C", 1.0, 0.5, 0.3], // Scrivi barra shorts…
  [33.97, "A", 1.0, 0.5, 0.3], // E lui crea le immagini, i filmati di supporto,
  [36.99, "A", 1.15, 0.5, 0.25], // tutto costruito sulla tua storia.
  [38.91, "B", 1.0, 0.5, 0.3], // Montare un video così, a mano, costa ore. A volte giorni.
  [42.43, "D", 1.0, 0.5, 0.3], // E io questo video non l'ho nemmeno girato.
  [44.31, "D", 1.16, 0.5, 0.28], // Non esisto.
  [45.03, "C", 1.0, 0.5, 0.3], // Sono partito da una foto e da un copione.
  [47.0, "A", 1.0, 0.5, 0.3], // Niente male, no? Commenta SHORTS…
];
const taglioA = (t: number) => {
  let k = 0;
  for (let i = 0; i < REGIA.length; i++) if (REGIA[i][0] <= t + 1e-6) k = i;
  return k;
};

const Camera: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / 30;
  const k = taglioA(t);
  const [da, cam, zoom, fx, fy] = REGIA[k];
  const fino = k + 1 < REGIA.length ? REGIA[k + 1][0] : FINE_SHORTS + CODA;
  // carrellata morbida dentro ogni inquadratura: una volta avanti, una volta indietro
  const p = Math.min(1, (t - da) / Math.max(0.5, fino - da));
  const morbido = p * p * (3 - 2 * p);
  const z = zoom * (k % 2 === 0 ? 1 + 0.045 * morbido : 1.045 - 0.045 * morbido);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: -8, width: 1080, height: 1936, transform: `scale(${z})`, transformOrigin: `${fx * 100}% ${fy * 100}%`, filter: "contrast(1.05) saturate(1.08)" }}>
        <OffthreadVideo src={staticFile(`${CART}/${cam}.mp4`)} muted style={{ width: "100%", height: "100%" }} />
      </div>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, #0007 0%, transparent 20%, transparent 52%, #000c 100%)" }} />
    </AbsoluteFill>
  );
};

// ---------- sottotitoli: fermi nel terzo basso, 3 parole, quella detta in lime ----------
const GRANDI: [number, number][] = [[0, 2.04], [3.96, 5.14], [6.86, 7.46], [15.15, 18.6], [19.3, 21.05], [40.76, 41.23], [41.5, 42.43]]; // qui parlano le scritte grandi
const Sottotitoli: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  if (t > FINE_SHORTS + 0.25 || t >= 47.95) return null;
  if (GRANDI.some(([a, b]) => t >= a && t < b)) return null;
  const viste = PAROLE_SHORTS.filter(([a]) => t >= a);
  if (!viste.length) return null;
  const ult = viste[viste.length - 1];
  const gruppo = PAROLE_SHORTS.filter((q) => q[2] === ult[2]);
  const i = gruppo.indexOf(ult);
  const blocco = gruppo.slice(Math.floor(i / 3) * 3, Math.floor(i / 3) * 3 + 3);
  return (
    <div style={{ position: "absolute", left: 70, right: 70, top: 1250, display: "flex", flexWrap: "wrap", justifyContent: "center", columnGap: 22, rowGap: 0, fontFamily: INTER, fontWeight: 800, fontSize: 84, lineHeight: 1.08, letterSpacing: -2.5, textShadow: "0 4px 24px #000e, 0 0 6px #0008" }}>
      {blocco.map(([s0, q], k) => {
        const detta = blocco[k + 1] ? t >= s0 && t < blocco[k + 1][0] : t >= s0;
        const a = molla(f, fps, F(s0), 14, 320);
        return <span key={k} style={{ color: detta ? LIME : "#fff", opacity: t >= s0 ? 1 : 0, display: "inline-block", transform: `translateY(${(1 - a) * 22}px)` }}>{q.replace(/[.,:?!]+$/, "").toLowerCase()}</span>;
      })}
    </div>
  );
};

// ---------- piccoli mattoni per le sovrimpressioni ----------
const Dentro: React.FC<{ da: number; a: number; children: (k: number, f: number) => React.ReactNode }> = ({ da, a, children }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < F(da) || f >= F(a)) return null;
  const esce = interpolate(f, [F(a) - 5, F(a)], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ opacity: esce }}>{children(molla(f, fps, F(da), 14, 220), f - F(da))}</AbsoluteFill>;
};

const Icona: React.FC<{ testo: string; col: string; bordo: string; x: number; y: number; k: number; barrata: number }> = ({ testo, col, bordo, x, y, k, barrata }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 160, height: 152, borderRadius: 32, background: col, border: `7px solid ${bordo}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: INTER, fontWeight: 800, fontSize: 88, color: bordo, transform: `scale(${k})`, boxShadow: "0 20px 60px #000c" }}>
    {testo}
    <div style={{ position: "absolute", left: -30, right: -30, top: "46%", height: 16, background: "#ff3b4a", transform: `rotate(-38deg) scaleX(${barrata})`, borderRadius: 8 }} />
  </div>
);

const Parolona: React.FC<{ righe: string[]; k: number; top: number; size?: number; box?: boolean }> = ({ righe, k, top, size = 200, box }) => (
  <div style={{ position: "absolute", left: 40, right: 40, top: top + 40 + (1 - k) * 50, textAlign: "center", opacity: Math.min(1, k * 1.8) }}>
    {righe.map((r, i) => (
      <div key={i} style={{ fontFamily: INTER, fontWeight: 900, fontSize: size * 0.66, lineHeight: 1.02, letterSpacing: -4, color: box && i === righe.length - 1 ? LIME : "#fff", textShadow: "0 6px 36px #000e" }}>{r.toLowerCase()}</div>
    ))}
  </div>
);

const Glifo: React.FC<{ size: number }> = ({ size }) => <Img src={staticFile(`${CART}/hf-lime.svg`)} style={{ width: size, height: size }} />;

const Pillola: React.FC<{ children: React.ReactNode; x: number; y: number; k: number }> = ({ children, x, y, k }) => (
  <div style={{ position: "absolute", left: x, top: y, display: "flex", alignItems: "center", gap: 16, background: "#141318f5", border: "3px solid #ffffff33", borderRadius: 44, padding: "18px 34px", transform: `scale(${k})`, transformOrigin: "0 50%", boxShadow: "0 16px 50px #000c" }}>{children}</div>
);

const Mini: React.FC<{ src: string; x: number; y: number; rot: number; k: number; w?: number; bordo?: string }> = ({ src, x, y, rot, k, w = 250, bordo = "#fff" }) => (
  <Img src={staticFile(`${CART}/${src}`)} style={{ position: "absolute", left: x, top: y + (1 - k) * -300, width: w, height: w * 1.6, objectFit: "cover", borderRadius: 26, border: `6px solid ${bordo}`, transform: `rotate(${rot * k}deg) scale(${0.4 + 0.6 * k})`, opacity: Math.min(1, k * 2), boxShadow: "0 24px 60px #000d" }} />
);

// linea di montaggio finta (disegnata, non uno screenshot di un programma vero)
const LineaMontaggio: React.FC<{ k: number; f: number }> = ({ k, f }) => (
  <div style={{ position: "absolute", left: 60, top: 240, width: 470, height: 290, borderRadius: 24, background: "#101014f2", border: `4px solid ${LIME}`, transform: `scale(${k})`, transformOrigin: "50% 0", overflow: "hidden", boxShadow: "0 20px 60px #000d" }}>
    {[0, 1, 2, 3].map((r) => (
      <div key={r} style={{ position: "absolute", left: 14, right: 14, top: 22 + r * 66, height: 50 }}>
        {[0, 1, 2, 3, 4].map((c) => {
          const w = 60 + ((r * 37 + c * 53) % 70);
          const x = c * 108 + ((r * 23) % 30);
          const acceso = f > 4 + (r * 5 + c) * 2.2;
          return <div key={c} style={{ position: "absolute", left: x, width: w, top: 0, bottom: 0, borderRadius: 8, background: acceso ? [LIME, "#8b6dff", "#3ad1ff", "#ff7a1a"][r] : "#2a2933", opacity: acceso ? 0.95 : 0.6 }} />;
        })}
      </div>
    ))}
    <div style={{ position: "absolute", top: 0, bottom: 0, width: 5, background: "#fff", left: 20 + ((f * 9) % 520) }} />
  </div>
);

const Onda: React.FC<{ k: number; f: number }> = ({ k, f }) => (
  <div style={{ position: "absolute", left: 60, right: 60, top: 300, height: 200, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, opacity: k }}>
    {Array.from({ length: 34 }).map((_, i) => {
      const colpo = [36, 49, 57].some((c) => Math.abs(f - c) < 4) ? 2.2 : 1;
      const h = (30 + 70 * Math.abs(Math.sin(i * 0.9 + f * 0.5))) * colpo;
      return <div key={i} style={{ width: 16, height: Math.min(200, h), borderRadius: 8, background: LIME, boxShadow: `0 0 20px ${LIME}88` }} />;
    })}
  </div>
);

// ---------- tutte le sovrimpressioni, agganciate alle parole ----------
const Sopra: React.FC = () => (
  <>
    {/* apertura */}
    <Dentro da={0} a={2.04}>{(k, f) => (
      <div style={{ position: "absolute", left: 40, right: 40, top: 1110 + (1 - k) * 50, textAlign: "center", opacity: Math.min(1, k * 1.8), fontFamily: INTER, fontWeight: 900, letterSpacing: -5, textShadow: "0 6px 36px #000e" }}>
        <div style={{ fontSize: 190, lineHeight: 1, color: "#fff" }}>Fable <span style={{ color: LIME }}>5.2</span></div>
        <div style={{ fontSize: 96, lineHeight: 1.1, color: "#fff", opacity: f >= F(1.22) ? 1 : 0 }}>è appena <span style={{ color: f >= F(1.62) ? LIME : "#fff" }}>uscito</span></div>
      </div>
    )}</Dentro>

    {/* «questo video l'ha montato lui» */}
    <Dentro da={2.47} a={3.96}>{(k, f) => <LineaMontaggio k={k} f={f} />}</Dentro>
    <Dentro da={3.96} a={5.14}>{(k) => <Parolona righe={["tutto.", "da solo."]} k={k} top={1120} size={190} box />}</Dentro>

    {/* «niente After Effects, niente Premiere, niente» */}
    <Dentro da={5.3} a={7.46}>{(k, f) => <Icona testo="Ae" col="#00005b" bordo="#9999ff" x={70} y={250} k={k} barrata={interpolate(f, [8, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />}</Dentro>
    <Dentro da={6.25} a={7.46}>{(k, f) => <Icona testo="Pr" col="#00005b" bordo="#ea77ff" x={260} y={250} k={k} barrata={interpolate(f, [6, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />}</Dentro>
    <Dentro da={6.86} a={7.46}>{(k) => <Parolona righe={["niente"]} k={k} top={1150} size={240} box />}</Dentro>

    {/* «tutto fatto da Claude. E il mio personaggio è nato su Higgsfield» */}
    <Dentro da={9.6} a={12.72}>{(k) => <Pillola x={60} y={260} k={k}><span style={{ color: "#e8825a", fontSize: 70, lineHeight: 1 }}>✳</span><span style={{ fontFamily: INTER, fontWeight: 800, fontSize: 64, color: "#fff" }}>Claude</span><span style={{ fontFamily: MONO, fontSize: 40, color: "#ffffffaa" }}>Fable 5.2</span></Pillola>}</Dentro>
    <Dentro da={11.85} a={12.72}>{(k) => <Pillola x={60} y={400} k={k}><Glifo size={74} /><span style={{ fontFamily: INTER, fontWeight: 800, fontSize: 64, color: "#fff" }}>Higgsfield</span></Pillola>}</Dentro>
    <Dentro da={11.0} a={12.72}>{(k) => <Mini src="c-foto.jpg" x={760} y={250} rot={7} k={k} w={240} bordo={LIME} />}</Dentro>

    {/* «tre giorni di accesso illimitato a tutti i modelli. Gratis.» */}
    <Dentro da={13.17} a={15.15}>{(k) => <Pillola x={60} y={260} k={k}><Glifo size={64} /><span style={{ fontFamily: INTER, fontWeight: 800, fontSize: 52, color: "#fff" }}>per i nuovi utenti</span></Pillola>}</Dentro>
    <Dentro da={15.15} a={15.97}>{(k) => <div style={{ position: "absolute", left: 0, right: 0, top: 1090 + (1 - k) * 50, textAlign: "center", opacity: Math.min(1, k * 1.8), fontFamily: INTER, fontWeight: 900, letterSpacing: -6, textShadow: "0 6px 36px #000e" }}><span style={{ fontSize: 380, lineHeight: 1, color: LIME }}>3</span><span style={{ fontSize: 150, color: "#fff", marginLeft: 26 }}>giorni</span></div>}</Dentro>
    <Dentro da={15.97} a={16.95}>{(k) => <Parolona righe={["accesso", "illimitato"]} k={k} top={1120} size={190} box />}</Dentro>
    <Dentro da={16.95} a={17.86}>{(k) => <Parolona righe={["tutti", "i modelli"]} k={k} top={1120} size={200} />}</Dentro>
    <Dentro da={17.86} a={18.68}>{(k) => <Parolona righe={["gratis"]} k={k} top={1130} size={330} box />}</Dentro>

    {/* «le schermate compaiono mentre te le spiego»: schermata a tutto schermo */}
    <Dentro da={19.3} a={21.05}>{(k, f) => (
      <AbsoluteFill style={{ background: "#fff", transform: `translateY(${(1 - k) * 1920}px)` }}>
        <div style={{ position: "absolute", left: 60, top: 150, fontFamily: INTER, fontWeight: 700, fontSize: 44, color: "#111" }}>Claude · Impostazioni</div>
        <Img src={staticFile(`${CART}/connettori.png`)} style={{ position: "absolute", left: 0, top: 330, width: 1750, transform: `translateX(${-330 - f * 2.5}px) scale(${1 + f * 0.003})`, transformOrigin: "50% 20%" }} />
        <div style={{ position: "absolute", left: 60, right: 60, top: 1420, fontFamily: INTER, fontWeight: 900, fontSize: 92, lineHeight: 1.05, letterSpacing: -3, color: "#111", textAlign: "center" }}>le schermate <span style={{ color: VIOLA }}>compaiono</span><br />mentre te le spiego</div>
      </AbsoluteFill>
    )}</Dentro>

    {/* «gli effetti sonori cadono sui tagli» */}
    <Dentro da={21.05} a={23.47}>{(k, f) => <Onda k={k} f={f} />}</Dentro>

    {/* «dentro Claude c'è Shorts Studio, di Higgsfield» */}
    <Dentro da={24.3} a={26.21}>{(k) => (
      <div style={{ position: "absolute", left: 0, right: 0, top: 250, textAlign: "center", transform: `translateY(${(1 - k) * -60}px)`, opacity: Math.min(1, k * 2) }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 22, background: "#0d0d0ff2", border: `4px solid ${LIME}`, borderRadius: 40, padding: "22px 44px", boxShadow: `0 0 90px ${LIME}66` }}>
          <Glifo size={96} /><span style={{ fontFamily: INTER, fontWeight: 900, fontSize: 92, letterSpacing: -3, color: "#fff", lineHeight: 1 }}>Shorts Studio</span>
        </div>
      </div>
    )}</Dentro>

    {/* «gli carichi il tuo video che è andato meglio» */}
    <Dentro da={26.4} a={28.48}>{(k) => <><Mini src="mini-1.jpg" x={50} y={230} rot={-8} k={k} /><Mini src="mini-2.jpg" x={780} y={250} rot={7} k={k} /></>}</Dentro>
    {/* «oppure parti da un modello già collaudato» */}
    <Dentro da={29.0} a={30.86}>{(k) => <>{[0, 1, 2].map((i) => <Mini key={i} src={`mini-${i + 1}.jpg`} x={70 + i * 330} y={240} rot={(i - 1) * 5} k={Math.max(0, k - i * 0.12)} w={280} bordo={i === 1 ? LIME : "#fff"} />)}</>}</Dentro>

    {/* «scrivi barra shorts, gli dai un argomento e lo stile che vuoi» */}
    <Dentro da={30.86} a={33.97}>{(k, f) => {
      const testo = "/shorts  fammi un reel come questo";
      const n = Math.min(testo.length, Math.floor(Math.max(0, f - 8) / 1.6));
      return (
        <div style={{ position: "absolute", left: 50, right: 50, top: 250, background: "#fff", borderRadius: 34, padding: "34px 36px 30px", transform: `translateY(${(1 - k) * -400}px)`, boxShadow: "0 30px 80px #000d" }}>
          <div style={{ fontFamily: INTER, fontWeight: 600, fontSize: 54, color: "#111", minHeight: 70 }}><span style={{ color: "#5b3fd6", fontWeight: 800 }}>{testo.slice(0, Math.min(n, 7))}</span>{testo.slice(7, n)}<span style={{ opacity: f % 14 < 7 ? 1 : 0 }}>|</span></div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 22 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#0d0d0f", borderRadius: 18, padding: "8px 18px" }}><Glifo size={40} /><span style={{ fontFamily: INTER, fontWeight: 700, fontSize: 32, color: "#fff" }}>Higgsfield Shorts Studio</span></span>
            <span style={{ fontFamily: MONO, fontSize: 30, color: "#777" }}><span style={{ color: "#e8825a" }}>✳</span> Fable 5.2</span>
            <span style={{ marginLeft: "auto", width: 70, height: 70, borderRadius: 20, background: "#e8825a", color: "#fff", fontSize: 44, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>↑</span>
          </div>
        </div>
      );
    }}</Dentro>

    {/* «lui crea le immagini, i filmati di supporto» */}
    <Dentro da={34.9} a={38.91}>{(k, f) => <>{[0, 1, 2, 3].map((i) => {
      const kk = Math.max(0, Math.min(1, (f - i * 6) / 10));
      return <Img key={i} src={staticFile(`${CART}/mini-${(i % 3) + 1}.jpg`)} style={{ position: "absolute", left: 40 + i * 255, top: 250 + (1 - kk) * -200, width: 235, height: 150, objectFit: "cover", objectPosition: `50% ${20 + i * 15}%`, borderRadius: 18, border: `5px solid ${LIME}`, opacity: kk, boxShadow: `0 0 40px ${LIME}66` }} />;
    })}</>}</Dentro>

    {/* «montare un video così, a mano, costa ore. A volte giorni.» */}
    <Dentro da={39.0} a={42.43}>{(k, f) => (
      <div style={{ position: "absolute", left: 60, right: 60, top: 260, background: "#141318f5", border: "3px solid #ffffff33", borderRadius: 30, padding: "26px 30px", transform: `scale(${k})`, transformOrigin: "50% 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 36, color: "#fff" }}><span>Montaggio a mano…</span><span style={{ color: "#ff3b4a" }}>{f < F(2.2) ? "ore" : "giorni"}</span></div>
        <div style={{ marginTop: 18, height: 22, borderRadius: 11, background: "#2a2933", overflow: "hidden" }}><div style={{ width: `${Math.min(34, 6 + f * 0.28)}%`, height: "100%", background: "#ff3b4a" }} /></div>
      </div>
    )}</Dentro>
    <Dentro da={40.76} a={41.23}>{(k) => <Parolona righe={["ore"]} k={k} top={1130} size={320} />}</Dentro>
    <Dentro da={41.5} a={42.43}>{(k) => <Parolona righe={["giorni"]} k={k} top={1130} size={300} box />}</Dentro>

    {/* «non esisto. Sono partito da una foto e da un copione» */}
    <Dentro da={45.7} a={47.0}>{(k) => <Mini src="c-foto.jpg" x={90} y={240} rot={-6} k={k} w={260} bordo={LIME} />}</Dentro>
    <Dentro da={46.4} a={47.0}>{(k) => (
      <div style={{ position: "absolute", left: 640, top: 270, width: 330, height: 400, background: "#fff", borderRadius: 22, padding: 30, transform: `rotate(${6 * k}deg) scale(${k})`, boxShadow: "0 24px 60px #000d" }}>
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 34, color: "#111" }}>copione.txt</div>
        {[0, 1, 2, 3, 4, 5].map((i) => <div key={i} style={{ height: 16, borderRadius: 8, background: "#c9c9d2", marginTop: 26, width: `${[100, 86, 94, 70, 90, 55][i]}%` }} />)}
      </div>
    )}</Dentro>

    {/* CTA */}
    <Dentro da={47.95} a={99}>{(k, f) => (
      <div style={{ position: "absolute", left: 40, right: 40, top: 1120 + (1 - k) * 50, textAlign: "center", opacity: Math.min(1, k * 1.8), fontFamily: INTER, fontWeight: 900, letterSpacing: -4, textShadow: "0 6px 36px #000e" }}>
        <div style={{ fontSize: 120, lineHeight: 1.05, color: "#fff" }}>commenta</div>
        <div style={{ display: "inline-block", marginTop: 14, fontSize: 170, lineHeight: 1.12, color: "#0b0a10", background: LIME, padding: "0 46px", borderRadius: 34, textShadow: "none", transform: `scale(${1 + Math.max(0, Math.sin(f / 6)) * 0.035})`, boxShadow: `0 0 90px ${LIME}88` }}>SHORTS</div>
        <div style={{ fontSize: 60, lineHeight: 1.2, color: "#fff", marginTop: 30, letterSpacing: -2, opacity: Math.min(1, Math.max(0, (f - 14) / 8)) }}>e ti mando il link</div>
      </div>
    )}</Dentro>
  </>
);

export const SHORTSC: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: NERO }}>
      <Camera />
      <Sopra />
      <Sottotitoli />
      <div style={{ position: "absolute", right: 40, top: 150, fontFamily: MONO, fontSize: 24, color: "#ffffffaa", textShadow: "0 2px 8px #000" }}>#adv · link affiliato</div>
      <div style={{ position: "absolute", left: 0, bottom: 0, height: 8, width: `${(f / DURATA_SHORTSC) * 100}%`, background: `linear-gradient(90deg,${VIOLA},${LIME})` }} />
    </AbsoluteFill>
  );
};

// Copertina: primo piano di C + titolo
export const CoverSHORTSC: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: NERO }}>
    <Img src={staticFile(`${CART}/cover-foto.jpg`)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover" }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #0008 0%, transparent 30%, transparent 48%, #000e 82%)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 1040, textAlign: "center", fontFamily: ANTON, textTransform: "uppercase", color: "#fff", lineHeight: 1.08, textShadow: "0 8px 40px #000" }}>
      <div style={{ fontSize: 150 }}>Questo video</div>
      <div style={{ fontSize: 150 }}>l'ha montato</div>
      <div style={{ fontSize: 190, marginTop: 10 }}><span style={{ background: LIME, color: "#0b0a10", padding: "0 40px", borderRadius: 30, display: "inline-block", transform: "rotate(-3deg)", textShadow: "none", boxShadow: `0 0 110px ${LIME}aa` }}>Claude</span></div>
    </div>
  </AbsoluteFill>
);
