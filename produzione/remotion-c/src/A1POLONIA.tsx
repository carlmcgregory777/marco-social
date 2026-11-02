// Attualità di C #1 (02/11/2026): «Colpo di Stato in Polonia (e il mercato ha già votato)».
// Grafiche tra le scene parlate. I tempi `d` sono in frame dall'inizio della grafica,
// presi dalle parole della voce (attualita/A1-polonia/voce/voce-g1-parole.json).
import React from "react";
import { AbsoluteFill, interpolate, staticFile, useCurrentFrame, useVideoConfig, Audio, Sequence, Easing } from "remotion";
import { ACCENTO, ANTON, FormatC, INTER, MACCHINA, MONO, molla, NERO, Nota, Scena, Sticker, TitoloFisso, VIOLA } from "./FormatC";
import { CoverC } from "./ALGORY1C";
import EURPLN from "./a1polonia-eurpln.json";
import { ENFASI_A1, PAROLE_A1, SCENE_A1 } from "./a1polonia-parole";

const CARTELLA = "a1polonia";

// Sfondo da redazione: nero, vignetta viola e righe di scansione leggere
const SfondoNotizia: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: NERO }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 45%, ${VIOLA}38, transparent 68%)`, transform: `scale(${1 + f * 0.0008})` }} />
      <AbsoluteFill style={{ backgroundImage: "repeating-linear-gradient(0deg, #ffffff07 0 2px, transparent 2px 6px)" }} />
    </AbsoluteFill>
  );
};

// Lancio d'agenzia che si scrive a macchina
const Lancio: React.FC<{ d: number; y: number; testo: string; ora?: string }> = ({ d, y, testo, ora }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < d) return null;
  const a = molla(f, fps, d, 14, 220);
  const n = Math.floor(interpolate(f, [d, d + 16], [0, testo.length], { extrapolateRight: "clamp" }));
  return (
    <div style={{ position: "absolute", left: 70, right: 70, top: y, opacity: Math.min(1, a * 1.5), transform: `translateY(${(1 - a) * 40}px)`, background: "#f4f1ea", borderLeft: `14px solid ${VIOLA}`, padding: "22px 30px", boxShadow: "0 18px 50px #000c" }}>
      {ora ? <div style={{ fontFamily: MONO, fontSize: 26, color: "#555", letterSpacing: 2, marginBottom: 6 }}>{ora}</div> : null}
      <div style={{ fontFamily: MACCHINA, fontSize: 50, lineHeight: 1.15, color: "#111" }}>{testo.slice(0, n)}</div>
    </div>
  );
};

// G1 · la cronaca di venerdì
export const G1Cronaca: React.FC = () => (
  <>
    <SfondoNotizia />
    <div style={{ position: "absolute", left: 0, right: 0, top: 470, textAlign: "center", fontFamily: MONO, fontSize: 34, color: ACCENTO, letterSpacing: 6 }}>VARSAVIA · VENERDÌ 30/10</div>
    <Lancio d={30} y={540} ora="GOVERNO" testo="Sospeso il capo della Corte costituzionale" />
    <Lancio d={137} y={760} ora="PRESIDENTE" testo="Corre al tribunale" />
    <Lancio d={224} y={930} ora="IN AULA" testo="Faccia a faccia con i giudici" />
    <Sticker d={288} top={1140} size={110} bg="#000" rot={-3}>Fuori, la polizia</Sticker>
    <div style={{ position: "absolute", left: 70, top: 1820, fontFamily: MONO, fontSize: 22, color: "#ffffff80" }}>Fonti: Notes from Poland, CNN, Al Jazeera (31/10-01/11/2026)</div>
  </>
);

// Grafico EUR/PLN (cambi BCE da nov. 2023 + 4,41 di lunedì mattina) che si disegna
const Grafico: React.FC<{ d: number; top: number; h: number }> = ({ d, top, h }) => {
  const f = useCurrentFrame();
  const punti = [...(EURPLN as [string, number][]).filter(([g]) => g >= "2023-12-01"), ["2026-11-02", 4.41] as [string, number]];
  const v = punti.map((p) => p[1]);
  const lo = Math.min(...v) - 0.02, hi = Math.max(...v) + 0.02;
  const W = 940, x0 = 70;
  const xy = (i: number) => [x0 + (i / (punti.length - 1)) * W, top + h - ((v[i] - lo) / (hi - lo)) * h];
  const k = interpolate(f, [d, d + 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const n = Math.max(2, Math.ceil(k * punti.length));
  const path = punti.slice(0, n).map((_, i) => xy(i)).map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const [ex, ey] = xy(n - 1);
  const fine = k >= 1;
  const pulsa = fine ? 1 + 0.25 * Math.abs(Math.sin((f - d - 40) / 5)) : 1;
  return (
    <>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <path d={path} fill="none" stroke={ACCENTO} strokeWidth={7} strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 14px ${ACCENTO})` }} />
        <circle cx={ex} cy={ey} r={14 * pulsa} fill="#fff" />
      </svg>
      <div style={{ position: "absolute", left: x0, top: top + h + 14, fontFamily: MONO, fontSize: 24, color: "#ffffff90" }}>dic 2023</div>
      <div style={{ position: "absolute", right: 70, top: top + h + 14, fontFamily: MONO, fontSize: 24, color: "#ffffff90" }}>02/11 mattina</div>
      <div style={{ position: "absolute", left: x0, top: top - 70, fontFamily: ANTON, fontSize: 52, color: "#fff" }}>EURO / ZLOTY</div>
      {fine ? <div style={{ position: "absolute", left: ex - 230, top: ey - 120, fontFamily: ANTON, fontSize: 96, color: "#fff", WebkitTextStroke: "8px #000", paintOrder: "stroke fill" }}>4,41</div> : null}
    </>
  );
};

// Citazione che si contraddice con le altre
const Voce: React.FC<{ d: number; y: number; chi: string; dice: string; rot: number }> = ({ d, y, chi, dice, rot }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < d) return null;
  const a = molla(f, fps, d, 10, 230);
  return (
    <div style={{ position: "absolute", left: 70, right: 70, top: y, transform: `scale(${0.6 + 0.4 * a}) rotate(${rot}deg)`, opacity: Math.min(1, a * 1.6), background: "#000", border: `3px solid ${ACCENTO}`, borderRadius: 18, padding: "16px 28px" }}>
      <span style={{ fontFamily: ANTON, fontSize: 52, color: ACCENTO }}>{chi}: </span>
      <span style={{ fontFamily: INTER, fontWeight: 800, fontSize: 48, color: "#fff" }}>«{dice}»</span>
    </div>
  );
};

// G2 · il mercato ha già votato + tre versioni che si contraddicono
export const G2Grafico: React.FC = () => (
  <>
    <SfondoNotizia />
    <Grafico d={0} top={560} h={300} />
    <Sticker d={45} top={890} size={60} bg={VIOLA} rot={-2}>Massimo da 3 anni</Sticker>
    <Voce d={17} y={980} chi="GOVERNO" dice="ripristino la legalità" rot={-2} />
    <Voce d={110} y={1130} chi="PRESIDENTE" dice="è un golpe" rot={1.5} />
    <Voce d={181} y={1280} chi="BRUXELLES" dice="il Parlamento può nominarli" rot={-1} />
    <div style={{ position: "absolute", left: 70, top: 1820, fontFamily: MONO, fontSize: 22, color: "#ffffff80" }}>Cambi BCE; 4,41 = Bankier.pl e Parkiet, 02/11/2026</div>
  </>
);

// Moneta da 1 złoty che si incrina su «pagare»
const Moneta: React.FC<{ d: number; crepa: number }> = ({ d, crepa }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < d) return null;
  const a = molla(f, fps, d, 11, 200);
  const c = interpolate(f, [crepa, crepa + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const trema = f >= crepa && f < crepa + 10 ? Math.sin(f * 8) * 10 : 0;
  return (
    <div style={{ position: "absolute", left: 320, top: 930, width: 440, height: 440, transform: `scale(${a}) translateX(${trema}px)` }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #fff6c8, #d9b23f 45%, #8a6a12)", boxShadow: "0 30px 80px #000c, inset 0 0 0 18px #c49a2a" }} />
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: ANTON, fontSize: 200, color: "#6b4f0a" }}>zł</div>
      <svg width={440} height={440} viewBox="0 0 500 500" style={{ position: "absolute", inset: 0 }}>
        <path d="M250,10 L228,120 L272,190 L215,290 L262,380 L240,490" fill="none" stroke="#1a1204" strokeWidth={9} strokeDasharray={600} strokeDashoffset={600 * (1 - c)} />
      </svg>
    </div>
  );
};

// G3 · il prossimo fronte: la banca centrale
export const G3Banca: React.FC = () => (
  <>
    <SfondoNotizia />
    <Lancio d={0} y={500} ora="MERCOLEDÌ 04/11" testo="La banca centrale decide i tassi" />
    <Lancio d={22} y={680} ora="FINE NOVEMBRE" testo="Il governatore verso il Tribunale di Stato?" />
    <Moneta d={98} crepa={145} />
    <Sticker d={169} top={1390} size={96} bg={VIOLA}>Paga lo zloty</Sticker>
    <div style={{ position: "absolute", left: 70, top: 1820, fontFamily: MONO, fontSize: 22, color: "#ffffff80" }}>Fonti: Reuters (09/10), PAP, Bankier.pl (02/11/2026)</div>
  </>
);

// Video finale: scene parlate (clip Seedance, audio della clip) e grafiche sulla voce ElevenLabs.
// Ritmo Cosentino: le pause sono tagliate (attualita/A1-polonia/montaggio/monta.py → SCENE_A1).
// Nelle clip ogni taglio è un jump cut secco; nelle grafiche il tempo salta avanti della pausa tolta.
const CHIAVE = /^(POLONIA|STATO|POLIZIA|4,41|ZLOTY|TRE|ANNI|GOLPE|LEGALITÀ|BANCA|CENTRALE|TASSI|PROCESSO|L'INCERTEZZA|PRICED|IN)$/;
const F = (s: number) => Math.round(s * 30);
// Secondo di voce.wav a cui ogni grafica era tarata (frame 0 della grafica)
const GRAFICHE: Record<number, { base: number; el: React.ReactNode }> = {
  1: { base: 198 / 30, el: <G1Cronaca /> },
  3: { base: 695 / 30, el: <G2Grafico /> },
  5: { base: 1115 / 30, el: <G3Banca /> },
};
type Pezzo = { src: string; pezzo: number; from: number; dur: number; inizio: number };
const PEZZI = SCENE_A1 as Pezzo[];

// La grafica segue la voce tagliata: per ogni pezzo il suo tratto di animazione
const Salti: React.FC<{ parti: Pezzo[]; base: number; children: React.ReactNode }> = ({ parti, base, children }) => (
  <>
    {parti.map((p, i) => (
      <Sequence key={i} from={F(p.from) - F(parti[0].from)} durationInFrames={F(p.from + p.dur) - F(p.from)}>
        <Sequence from={-F(p.inizio - base)}>{children}</Sequence>
      </Sequence>
    ))}
  </>
);

const SCENE: Scena[] = [];
PEZZI.forEach((p, i) => {
  const primo = i === 0 || PEZZI[i - 1].pezzo !== p.pezzo;
  if (p.src === "voce") {
    if (!primo) return;
    const parti = PEZZI.filter((x) => x.pezzo === p.pezzo);
    const ult = parti[parti.length - 1];
    const g = GRAFICHE[p.pezzo];
    SCENE.push({ from: F(p.from), dur: F(ult.from + ult.dur) - F(p.from), grafica: <Salti parti={parti} base={g.base}>{g.el}</Salti> });
  } else {
    SCENE.push({ from: F(p.from), dur: F(p.from + p.dur) - F(p.from), clip: p.src, inizio: F(p.inizio), secco: !primo });
  }
});

// Frame assoluto della parola (dopo il secondo `dopo`)
const at = (parola: string, dopo = 0) => F(PAROLE_A1.find(([t, w]) => w.toLowerCase() === parola.toLowerCase() && t >= dopo)![0]);
const Da: React.FC<{ a: number; b: number; children: React.ReactNode }> = ({ a, b, children }) => <Sequence from={a} durationInFrames={b - a}>{children}</Sequence>;
const fine = (k: number) => { const p = PEZZI.filter((x) => x.pezzo === k).pop()!; return F(p.from + p.dur); };
const inizioPezzo = (k: number) => F(PEZZI.find((x) => x.pezzo === k)!.from);

// Scritte sopra le scene parlate, su tempo assoluto (restano sui jump cut)
const SOPRA = (
  <>
    <Da a={0} b={fine(0)}><Nota x={330} y={1180} d={at("chiamano") - 4} rot={-4} color="#fff" size={78}>…così lo chiamano</Nota></Da>
    <Da a={inizioPezzo(2)} b={fine(2)}>
      <Sticker d={at("4,41") - inizioPezzo(2)} top={1130} size={150} bg={VIOLA}>4,41 zł</Sticker>
      <Sticker d={at("tre", 15) - inizioPezzo(2)} top={1330} size={64} color={ACCENTO} rot={2}>massimo da 3 anni</Sticker>
    </Da>
    <Da a={inizioPezzo(4)} b={fine(4)}><Sticker d={at("Mercoledì") - inizioPezzo(4)} top={1250} size={90} bg={VIOLA}>Mercoledì · tassi</Sticker></Da>
    <Da a={inizioPezzo(6)} b={fine(6)}><Sticker d={at("priced") - inizioPezzo(6)} top={1250} size={130} bg={VIOLA}>Priced in.</Sticker></Da>
  </>
);

export const DURATA_A1 = fine(6);

export const A1POLONIA: React.FC = () => (
  <FormatC
    scene={SCENE}
    parole={PAROLE_A1}
    chiave={CHIAVE}
    cartella={CARTELLA}
    etichetta="ATTUALITÀ"
    titolo={<TitoloFisso righe={["Colpo di Stato in Polonia"]} svolta="(e il mercato ha già votato)" />}
    piccoli
    jump
    enfasi={ENFASI_A1}
    sottotitoliTop={1560}
    voce="voce-montata.wav"
    musicaVol={0.08}
    extra={SOPRA}
  />
);

export const CoverA1Polonia: React.FC = () => <CoverC titolo="Colpo di Stato in Polonia" sotto="Il mercato ha già votato" numero="4,41 zł" img={`${CARTELLA}/S1.png`} sposta={300} destra={260} />;

// Anteprima delle sole grafiche sulla voce (finché mancano le clip di Dreamina)
export const A1PoloniaGrafiche: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: NERO }}>
    <Sequence from={198} durationInFrames={342}><G1Cronaca /></Sequence>
    <Sequence from={695} durationInFrames={287}><G2Grafico /></Sequence>
    <Sequence from={1115} durationInFrames={255}><G3Banca /></Sequence>
    <TitoloFisso righe={["Colpo di Stato in Polonia"]} svolta="(e il mercato ha già votato)" />
    <Audio src={staticFile(`${CARTELLA}/voce.wav`)} />
  </AbsoluteFill>
);
