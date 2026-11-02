// Attualità di C #2 (02/11/2026): «Roma, notte di Halloween: 13enne molestata (davanti alla madre)».
// Tema virale fuori dai soldi, scelto da Marco per far conoscere il pensiero di C (vedi copione.md).
// Grafiche tra le scene parlate. I tempi `d` sono in frame dall'inizio della grafica,
// presi dalle parole della voce (attualita/A2-roma-halloween/voce/voce-parole.json, già a ×1,1).
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, Sequence } from "remotion";
import { ACCENTO, ANTON, FormatC, MACCHINA, MONO, molla, NERO, ROSSO, Scena, Sticker, TitoloFisso, VERDE, VIOLA } from "./FormatC";
import { CoverC } from "./ALGORY1C";
import { ENFASI_A2, PAROLE_A2, SCENE_A2 } from "./a2roma-parole";

const CARTELLA = "a2roma";

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

// G1 · la cronaca della notte (voce da 3,75 s: «Tredici anni. Era con sua madre. Trastevere…»)
const G = (s: number) => Math.round((s - 3.75) * 30);
export const G1Cronaca: React.FC = () => (
  <>
    <SfondoNotizia />
    <div style={{ position: "absolute", left: 0, right: 0, top: 470, textAlign: "center", fontFamily: MONO, fontSize: 34, color: ACCENTO, letterSpacing: 6 }}>ROMA · NOTTE DEL 31/10</div>
    <Lancio d={G(3.85)} y={540} ora="TRASTEVERE · ORE 2:30" testo="13 anni. Era con sua madre." />
    <Lancio d={G(8.6)} y={800} ora="UN'ORA E MEZZA DOPO · ORE 4:00" testo="Una donna di 31 anni, con le amiche" />
    <Sticker d={G(13.47)} top={1110} size={120} bg={VIOLA} rot={-3}>2 arresti</Sticker>
    <div style={{ position: "absolute", left: 70, right: 70, top: 1820, fontFamily: MONO, fontSize: 22, color: "#ffffff80" }}>Fonti: Abitare a Roma, Leggo (01/11/2026). Gli arrestati sono innocenti fino a sentenza definitiva.</div>
  </>
);

// Riga di un tg che scorre: il giorno dopo si parla d'altro
const Altro: React.FC<{ d: number }> = ({ d }) => {
  const f = useCurrentFrame();
  if (f < d) return null;
  const x = interpolate(f, [d, d + 120], [1080, -1400]);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 1130, height: 110, background: "#111", borderTop: `6px solid ${ACCENTO}`, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: x, top: 22, whiteSpace: "nowrap", fontFamily: ANTON, fontSize: 60, color: "#ffffff55", letterSpacing: 2 }}>
        METEO · CALCIO · GOSSIP · TRAFFICO · METEO · CALCIO · GOSSIP
      </div>
    </div>
  );
};

// G2 · i carabinieri c'erano; il giorno dopo si parla d'altro (voce da 14,8 s)
const G2t = (s: number) => Math.round((s - 14.8) * 30);
export const G2Giorno: React.FC = () => (
  <>
    <SfondoNotizia />
    <Sticker d={G2t(14.96)} top={560} size={84} bg={VERDE} rot={-2}>Carabinieri: subito lì</Sticker>
    <div style={{ position: "absolute", left: 0, right: 0, top: 900, textAlign: "center", fontFamily: MONO, fontSize: 40, color: ACCENTO, letterSpacing: 6, opacity: interpolate(useCurrentFrame(), [G2t(18.1), G2t(18.1) + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>IL GIORNO DOPO…</div>
    <Altro d={G2t(18.8)} />
  </>
);

// Schema da trader: regola → controllo → conseguenza (voce da 20,1 s)
const Blocco: React.FC<{ d: number; y: number; testo: string; colore: string; rotto?: number }> = ({ d, y, testo, colore, rotto }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < d) return null;
  const a = molla(f, fps, d, 11, 220);
  const r = rotto !== undefined && f >= rotto;
  return (
    <div style={{ position: "absolute", left: 190, right: 190, top: y, height: 150, transform: `scale(${0.5 + 0.5 * a})`, opacity: Math.min(1, a * 1.5), border: `5px ${r ? "dashed" : "solid"} ${r ? ROSSO : colore}`, borderRadius: 22, background: "#000", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: ANTON, fontSize: 70, color: r ? ROSSO : "#fff", textDecoration: r ? "line-through" : undefined }}>
      {testo}
    </div>
  );
};
const G3t = (s: number) => Math.round((s - 20.1) * 30);
export const G3Sistema: React.FC = () => (
  <>
    <SfondoNotizia />
    <div style={{ position: "absolute", left: 0, right: 0, top: 470, textAlign: "center", fontFamily: MONO, fontSize: 32, color: ACCENTO, letterSpacing: 4 }}>if regola_violata: stop()</div>
    <Blocco d={G3t(22.15)} y={560} testo="REGOLA" colore={ACCENTO} />
    <Blocco d={G3t(24.4)} y={760} testo="CONTROLLO" colore={ACCENTO} />
    <Blocco d={G3t(25.2)} y={960} testo="CONSEGUENZA" colore={ACCENTO} />
  </>
);

// Video finale: scene parlate (clip Seedance 2.5 su Lumina, audio della clip) e grafiche sulla voce Seed Audio.
const CHIAVE = /^(HALLOWEEN|TITOLO|TREDICI|MADRE|TRASTEVERE|ARRESTATI|SUBITO|D'ALTRO|SISTEMI|REGOLA|SUGGERIMENTO|PAGHI|PAURA)$/;
const F = (s: number) => Math.round(s * 30);
const GRAFICHE: Record<number, { base: number; el: React.ReactNode }> = {
  1: { base: 3.75, el: <G1Cronaca /> },
  2: { base: 14.8, el: <G2Giorno /> },
  3: { base: 20.1, el: <G3Sistema /> },
};
type Pezzo = { src: string; pezzo: number; from: number; dur: number; inizio: number };
const PEZZI = SCENE_A2 as Pezzo[];

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

const at = (parola: string, dopo = 0) => F(PAROLE_A2.find(([t, w]) => w.toLowerCase() === parola.toLowerCase() && t >= dopo)![0]);
const Da: React.FC<{ a: number; b: number; children: React.ReactNode }> = ({ a, b, children }) => <Sequence from={a} durationInFrames={b - a}>{children}</Sequence>;
const fine = (k: number) => { const p = PEZZI.filter((x) => x.pezzo === k).pop()!; return F(p.from + p.dur); };
const inizioPezzo = (k: number) => F(PEZZI.find((x) => x.pezzo === k)!.from);

// Scritte sopra le scene parlate, su tempo assoluto (restano sui jump cut)
const SOPRA = (
  <>
    <Da a={inizioPezzo(4)} b={fine(4)}><Sticker d={at("suggerimento") - inizioPezzo(4)} top={1250} size={110} bg={VIOLA}>È un suggerimento</Sticker></Da>
    <Da a={inizioPezzo(5)} b={fine(5)}><Sticker d={at("paghi") - inizioPezzo(5)} top={1250} size={120} bg={VIOLA}>Che paghi.</Sticker></Da>
  </>
);

export const DURATA_A2 = fine(5);

export const A2ROMA: React.FC = () => (
  <FormatC
    scene={SCENE}
    parole={PAROLE_A2}
    chiave={CHIAVE}
    cartella={CARTELLA}
    etichetta="ATTUALITÀ"
    titolo={<TitoloFisso righe={["Roma, notte di Halloween:", "13enne molestata"]} svolta="(davanti alla madre)" />}
    piccoli
    jump
    enfasi={ENFASI_A2}
    sottotitoliTop={1560}
    voce="voce-montata.wav"
    musicaVol={0.06}
    extra={SOPRA}
  />
);

export const CoverA2Roma: React.FC = () => <CoverC titolo="Roma, notte di Halloween" sotto="Una regola senza conseguenze" numero="13 anni" img={`${CARTELLA}/S1.png`} sposta={300} destra={260} />;
