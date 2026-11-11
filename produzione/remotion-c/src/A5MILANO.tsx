// Attualità di C #5 «A Milano hanno scarcerato tutti» (05/11/2026).
// Stesso formato di A4MIDTERM (schermo diviso alla Jashi/Filippo): C che parla a tutto schermo,
// i pannelli entrano dal basso e restano sul petto/mani, MAI sulla faccia (verificato sul fotogramma).
// Immagine di partenza: A4-midterm/set/C-microfono.png (C in alto, microfono) — la stessa di A4.
// Tempi in secondi della voce (attualita/A5-milano/montaggio/voce.wav, pause tagliate, ×1,1).
import React from "react";
import { AbsoluteFill, Audio, Img, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ACCENTO, ANTON, INTER, MACCHINA, MANO, MONO, molla, NERO, ROSSO, Sticker, VERDE, VIOLA } from "./FormatC";
import { CHIAVE_A5, DURATA_A5_S, PAROLE_A5 } from "./a5milano-parole";

const CARTELLA = "a5milano";
const F = (s: number) => Math.round(s * 30);
const BLU = "#3b82f6";
const ROSSO_R = "#e0494f";
const GIALLO = "#ffd84d";

// ---------- mattoni ----------

export const Segno: React.FC<{ d: number; tipo: "cerchio" | "x" | "sotto" | "freccia"; x: number; y: number; w: number; h: number; col?: string; spessore?: number }> = ({ d, tipo, x, y, w, h, col = GIALLO, spessore = 9 }) => {
  const f = useCurrentFrame();
  if (f < d) return null;
  const p = (a: number) => interpolate(f, [d + a, d + a + 11], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const tracce: Record<string, string[]> = {
    cerchio: ["M 55 6 C 88 4 99 30 97 52 C 95 80 70 97 45 95 C 17 93 3 72 4 50 C 5 24 26 5 62 9"],
    x: ["M 8 8 L 92 92", "M 92 8 L 8 92"],
    sotto: ["M 2 62 Q 28 38 50 55 T 98 42"],
    freccia: ["M 4 50 Q 50 38 90 50", "M 68 28 L 92 50 L 68 72"],
  };
  return (
    <svg style={{ position: "absolute", left: x, top: y, width: w, height: h, overflow: "visible", filter: "drop-shadow(0 4px 10px #000a)" }} viewBox="0 0 100 100" preserveAspectRatio="none">
      {tracce[tipo].map((t, i) => (
        <path key={i} d={t} pathLength={1} fill="none" stroke={col} strokeWidth={spessore} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" strokeDasharray={1} strokeDashoffset={1 - p(i * 6)} />
      ))}
    </svg>
  );
};

export const Box: React.FC<{ d: number; x: number; y: number; w: number; h: number; children: React.ReactNode; bg?: string; bordo?: string; fino?: number }> = ({ d, x, y, w, h, children, bg = "#15122a", bordo = ACCENTO, fino }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < d || (fino !== undefined && f > fino)) return null;
  const a = molla(f, fps, d, 13, 220);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 24, background: bg, border: `4px solid ${bordo}`, boxShadow: `0 20px 60px #000c, 0 0 40px ${bordo}44`, transform: `scale(${0.6 + 0.4 * a}) translateY(${(1 - a) * 50}px)`, opacity: Math.min(1, a * 1.6), display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", color: "#fff", fontFamily: ANTON, overflow: "hidden" }}>
      {children}
    </div>
  );
};

export const Mano: React.FC<{ d: number; x: number; y: number; children: React.ReactNode; size?: number; col?: string; rot?: number }> = ({ d, x, y, children, size = 62, col = GIALLO, rot = -3 }) => {
  const f = useCurrentFrame();
  const w = interpolate(f, [d, d + 16], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <div style={{ position: "absolute", left: x, top: y, fontFamily: MANO, fontWeight: 700, fontSize: size, color: col, transform: `rotate(${rot}deg)`, clipPath: `inset(-20% ${100 - w}% -20% 0)`, whiteSpace: "nowrap", textShadow: "0 4px 16px #000, 0 0 2px #000" }}>{children}</div>;
};

export const Testata: React.FC<{ d?: number; children: React.ReactNode; y?: number }> = ({ d = 0, children, y = 350 }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [d, d + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <div style={{ position: "absolute", left: 0, right: 0, top: y, textAlign: "center", fontFamily: MONO, fontSize: 30, letterSpacing: 5, color: ACCENTO, opacity: o }}>{children}</div>;
};

export const Tra: React.FC<{ a: number; b?: number; children: React.ReactNode }> = ({ a, b, children }) => {
  const f = useCurrentFrame();
  return f >= a && (b === undefined || f < b) ? <>{children}</> : null;
};

const SfondoPannello: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = molla(f, fps, 0, 14, 240);
  return (
    <div style={{ position: "absolute", left: 30, right: 30, top: 325, height: 620, borderRadius: 40, overflow: "hidden", background: "#0b0a10e0", border: `3px solid ${ACCENTO}66`, boxShadow: "0 30px 80px #000c", transform: `translateY(${(1 - a) * 80}px)`, opacity: a }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(#ffffff0a 2px, transparent 2px), linear-gradient(90deg, #ffffff0a 2px, transparent 2px)", backgroundSize: "60px 60px" }} />
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 50% 60%, ${VIOLA}33, transparent 70%)` }} />
    </div>
  );
};

// Spunta che appare e poi si toglie
const Spunta: React.FC<{ d: number; x: number; y: number; testo: string; via?: number }> = ({ d, x, y, testo, via }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < d) return null;
  const a = molla(f, fps, d, 11, 260);
  const tolto = via !== undefined && f >= via;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `scale(${a})`, fontFamily: ANTON, fontSize: 60, color: tolto ? ROSSO : "#fff", display: "flex", gap: 16, alignItems: "center" }}>
      <span style={{ color: tolto ? ROSSO : VERDE }}>{tolto ? "✗" : "✓"}</span>{testo}
    </div>
  );
};

// Numero che conta fino al valore
const Conta: React.FC<{ d: number; fine: number; da: number; a: number; testo?: string; col?: string }> = ({ d, fine, da, a, testo, col = "#fff" }) => {
  const f = useCurrentFrame();
  if (f < d) return null;
  const v = Math.round(interpolate(f, [d, fine], [da, a], { extrapolateRight: "clamp" }));
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 500, textAlign: "center", fontFamily: ANTON, fontSize: 190, color: f >= fine ? col : "#fff", WebkitTextStroke: "10px #000", paintOrder: "stroke fill", textShadow: `0 0 60px ${VIOLA}` }}>
      {v.toLocaleString("it-IT")}
      {testo ? <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 44, color: ACCENTO }}>{testo}</div> : null}
    </div>
  );
};

// ---------- pannelli (tempo assoluto in secondi) ----------
type P = { base: number };
const rel = (base: number) => (s: number) => F(s) - F(base);

// P1 (7.16-13.55) «li hanno presi e li hanno lasciati andare?»
const P1Gancio: React.FC<P> = ({ base }) => {
  const r = rel(base);
  return (
    <>
      <SfondoPannello />
      <Sticker d={r(8.73)} top={380} size={70} bg={ROSSO} rot={-2}>li hanno presi</Sticker>
      <Sticker d={r(10.26)} top={490} size={70} rot={2}>e lasciati andare?</Sticker>
      <Mano d={r(10.74)} x={170} y={620} size={70}>Sì, e ti spiego perché</Mano>
      <Box d={r(13.55)} x={200} y={740} w={680} h={130} fino={r(16.75)}>
        <div style={{ fontSize: 72 }}>È NORMALE</div>
      </Box>
    </>
  );
};

// P2 (13.55-25.45) fermare ≠ condannare
const P2Fermare: React.FC<P> = ({ base }) => {
  const r = rel(base);
  return (
    <>
      <SfondoPannello />
      <Tra a={0} b={r(20.86)}>
        <Testata d={r(16.75)}>DUE COSE DIVERSE</Testata>
        <Box d={r(18.25)} x={80} y={440} w={440} h={230} bordo={BLU} bg="#14224a">
          <div style={{ fontFamily: MONO, fontSize: 26, color: "#ffffffaa" }}>la polizia</div>
          <div style={{ fontSize: 70 }}>FERMA</div>
        </Box>
        <Segno d={r(18.9)} tipo="cerchio" x={60} y={420} w={480} h={270} col={BLU} />
        <Mano d={r(19.75)} x={560} y={500} size={58} col="#fff">non condanna</Mano>
      </Tra>
      <Tra a={r(20.86)}>
        <Testata d={r(20.86)}>LA CONDANNA ARRIVA ALLA FINE</Testata>
        <Box d={r(20.86)} x={200} y={450} w={680} h={180} bordo={ROSSO_R}>
          <div style={{ fontFamily: MONO, fontSize: 26, color: "#ffffff99" }}>dopo</div>
          <div style={{ fontSize: 76 }}>IL PROCESSO</div>
        </Box>
        <Segno d={r(21.6)} tipo="sotto" x={240} y={650} w={600} h={40} />
        <Mano d={r(23.46)} x={150} y={730} size={62}>e non lo fai la sera stessa</Mano>
      </Tra>
    </>
  );
};

// P3 (25.45-35.40) la misura cautelare
const P3Cautelare: React.FC<P> = ({ base }) => {
  const r = rel(base);
  return (
    <>
      <SfondoPannello />
      <Tra a={0} b={r(32.07)}>
        <Testata d={r(25.45)}>IL GIUDICE DECIDE</Testata>
        <Box d={r(25.93)} x={90} y={450} w={900} h={190}>
          <div style={{ fontSize: 74, lineHeight: 1.1 }}>DENTRO O A CASA?</div>
        </Box>
        <Segno d={r(27.0)} tipo="sotto" x={130} y={650} w={820} h={40} />
        <Mano d={r(29.72)} x={200} y={740} size={62}>entra in gioco la…</Mano>
      </Tra>
      <Tra a={r(32.07)}>
        <Box d={r(32.07)} x={90} y={400} w={900} h={190}>
          <div style={{ fontSize: 78, lineHeight: 1 }}>MISURA CAUTELARE</div>
        </Box>
        <Segno d={r(32.8)} tipo="sotto" x={130} y={600} w={820} h={40} />
        <Tra a={r(32.95)}>
          <Box d={r(32.95)} x={80} y={680} w={440} h={150} bordo={ROSSO_R}>
            <div style={{ fontFamily: MONO, fontSize: 24, color: "#ffffff99" }}>non una</div>
            <div style={{ fontSize: 66 }}>PUNIZIONE</div>
          </Box>
          <Segno d={r(33.5)} tipo="x" x={110} y={690} w={380} h={130} col={ROSSO} spessore={12} />
        </Tra>
        <Tra a={r(34.23)}>
          <Box d={r(34.23)} x={560} y={680} w={440} h={150} bordo={VERDE}>
            <div style={{ fontFamily: MONO, fontSize: 24, color: "#ffffff99" }}>una</div>
            <div style={{ fontSize: 66, color: VERDE }}>PRECAUZIONE</div>
          </Box>
          <Segno d={r(34.7)} tipo="cerchio" x={530} y={655} w={500} h={200} col={VERDE} />
        </Tra>
      </Tra>
    </>
  );
};

// P4 (35.40-42.77) il carcere è l'eccezione
const P4Eccezione: React.FC<P> = ({ base }) => {
  const r = rel(base);
  return (
    <>
      <SfondoPannello />
      <Tra a={0} b={r(38.22)}>
        <Sticker d={r(35.40)} top={380} size={88} bg={ROSSO} rot={-3}>il carcere</Sticker>
        <Mano d={r(36.0)} x={180} y={510} size={68} col="#fff">è l'ULTIMA delle opzioni</Mano>
        <Mano d={r(37.50)} x={330} y={650} size={74}>non la prima</Mano>
      </Tra>
      <Tra a={r(38.22)}>
        <Testata d={r(38.22)}>È SCRITTO COSÌ, NON ME LO INVENTO</Testata>
        <Box d={r(38.22)} x={80} y={450} w={440} h={200} bordo={VERDE}>
          <div style={{ fontSize: 78, color: VERDE, lineHeight: 1 }}>LIBERTÀ</div>
          <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 38 }}>è la regola</div>
        </Box>
        <Box d={r(39.9)} x={560} y={450} w={440} h={200} bordo={ROSSO_R}>
          <div style={{ fontSize: 78, color: ROSSO, lineHeight: 1 }}>CARCERE</div>
          <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 38 }}>è l'eccezione</div>
        </Box>
        <Mano d={r(41.97)} x={150} y={720} size={58}>quindi se non c'è pericolo…</Mano>
      </Tra>
    </>
  );
};

// P5 (42.77-49.45) esce, con l'obbligo di firma
const P5Esce: React.FC<P> = ({ base }) => {
  const r = rel(base);
  return (
    <>
      <SfondoPannello />
      <Sticker d={r(42.77)} top={360} size={100} bg={VERDE} rot={-3}>ESCE</Sticker>
      <Mano d={r(45.66)} x={120} y={510} size={60} col="#fff">magari con l'obbligo di firma</Mano>
      <Box d={r(46.39)} x={230} y={630} w={620} h={150} bordo="#ffffff44">
        <div style={{ fontSize: 58 }}>2 VOLTE A SETTIMANA</div>
      </Box>
      <Segno d={r(47.4)} tipo="cerchio" x={210} y={610} w={660} h={190} />
      <Mano d={r(48.67)} x={400} y={830} size={64}>ma esce</Mano>
    </>
  );
};

// P6 (49.45-58.10) scarcerato ≠ assolto
const P6Assolto: React.FC<P> = ({ base }) => {
  const r = rel(base);
  return (
    <>
      <SfondoPannello />
      <Tra a={0} b={r(54.36)}>
        <Testata d={r(49.45)}>LA PARTE CHE NESSUNO TI DICE</Testata>
        <Box d={r(51.58)} x={200} y={420} w={680} h={170} bordo="#ffffff44">
          <div style={{ fontFamily: MONO, fontSize: 30, color: "#ffffff99" }}>quando leggi</div>
          <div style={{ fontSize: 84 }}>SCARCERATO</div>
        </Box>
        <Mano d={r(53.14)} x={280} y={640} size={70}>tu pensi «assolto»</Mano>
      </Tra>
      <Tra a={r(54.36)}>
        <Box d={r(54.36)} x={140} y={430} w={800} h={180} bordo={ROSSO_R} bg="#3a1418">
          <div style={{ fontSize: 94, color: ROSSO, lineHeight: 1 }}>NON È COSÌ</div>
        </Box>
        <Segno d={r(55.1)} tipo="x" x={170} y={440} w={740} h={160} col={ROSSO} spessore={14} />
        <Mano d={r(56.49)} x={160} y={660} size={58} col="#fff">il procedimento va avanti</Mano>
        <Tra a={r(58.10)}>
          <Box d={r(58.10)} x={200} y={760} w={680} h={140} bordo={VERDE}>
            <div style={{ fontSize: 60, color: VERDE }}>LIBERI FINO AL PROCESSO</div>
          </Box>
        </Tra>
      </Tra>
    </>
  );
};

// P7 (58.10-62.50) i tempi del processo
const P7Tempi: React.FC<P> = ({ base }) => {
  const r = rel(base);
  return (
    <>
      <SfondoPannello />
      <Box d={r(58.10)} x={200} y={400} w={680} h={150} bordo={VERDE}>
        <div style={{ fontSize: 58, color: VERDE }}>LIBERI FINO AL PROCESSO</div>
      </Box>
      <Tra a={r(59.76)}>
        <Box d={r(59.76)} x={80} y={620} w={440} h={150} bordo="#ffffff44">
          <div style={{ fontSize: 62 }}>TRA UN ANNO</div>
        </Box>
        <Box d={r(61.03)} x={560} y={620} w={440} h={150} bordo="#ffffff44">
          <div style={{ fontSize: 62 }}>TRA DUE</div>
        </Box>
        <Mano d={r(61.56)} x={180} y={820} size={60}>o mai: i processi hanno i loro tempi</Mano>
      </Tra>
    </>
  );
};

// P8 (62.50-68.03) chi decide
const P8ChiDecide: React.FC<P> = ({ base }) => {
  const r = rel(base);
  return (
    <>
      <SfondoPannello />
      <Testata d={r(62.50)}>LA DOMANDA VERA NON È «PERCHÉ»</Testata>
      <Box d={r(65.62)} x={90} y={470} w={900} h={190}>
        <div style={{ fontSize: 64, lineHeight: 1.15 }}>CHI DECIDE QUANTI<br />NE RESTANO DENTRO?</div>
      </Box>
      <Segno d={r(66.6)} tipo="sotto" x={130} y={670} w={820} h={40} />
    </>
  );
};

// P9 (68.03-74.98) la risposta scomoda
const P9Risposta: React.FC<P> = ({ base }) => {
  const r = rel(base);
  return (
    <>
      <SfondoPannello />
      <Testata d={r(68.03)}>E LA RISPOSTA È SCOMODA</Testata>
      <Spunta d={r(69.37)} x={130} y={440} testo="IL MINISTRO" via={r(70.71)} />
      <Spunta d={r(70.71)} x={130} y={550} testo="IL QUESTORE" via={r(71.64)} />
      <Spunta d={r(71.64)} x={130} y={660} testo="IL POLITICO" via={r(73.09)} />
      <Box d={r(73.09)} x={90} y={780} w={900} h={140} bordo={VERDE}>
        <div style={{ fontSize: 74, color: VERDE }}>UN GIUDICE</div>
      </Box>
    </>
  );
};

// P10 (74.98-78.84) criteri scritti in un codice
const P10Codice: React.FC<P> = ({ base }) => {
  const r = rel(base);
  return (
    <>
      <SfondoPannello />
      <Sticker d={r(74.98)} top={370} size={76} bg={BLU} rot={-2}>caso per caso</Sticker>
      <Box d={r(74.98)} x={90} y={500} w={900} h={180}>
        <div style={{ fontSize: 68, lineHeight: 1 }}>CRITERI IN UN CODICE</div>
      </Box>
      <Segno d={r(75.7)} tipo="cerchio" x={60} y={475} w={960} h={230} />
      <Tra a={r(76.68)}>
        <Mano d={r(76.68)} x={140} y={720} size={70}>NON È ROTTO</Mano>
        <Mano d={r(77.53)} x={520} y={810} size={70} col="#fff">FUNZIONA COSÌ</Mano>
      </Tra>
    </>
  );
};

// P11 (78.84-91.70) il ponte con il mercato + il sistema esegue
const P11Ponte: React.FC<P> = ({ base }) => {
  const r = rel(base);
  return (
    <>
      <SfondoPannello />
      <Tra a={0} b={r(85.51)}>
        <Testata d={r(78.84)}>PASSO LE GIORNATE A LITIGARE COI SISTEMI</Testata>
        <Box d={r(82.74)} x={90} y={490} w={900} h={180} bordo={BLU}>
          <div style={{ fontSize: 64, lineHeight: 1.1 }}>È IDENTICA AL MERCATO</div>
        </Box>
      </Tra>
      <Tra a={r(85.51)} b={r(89.71)}>
        <Box d={r(85.51)} x={80} y={440} w={440} h={200} bordo="#ffffff44">
          <div style={{ fontFamily: MONO, fontSize: 24, color: "#ffffff99" }}>conta poco</div>
          <div style={{ fontSize: 54, lineHeight: 1.05 }}>COSA DOVREBBE SUCCEDERE</div>
        </Box>
        <Box d={r(87.83)} x={560} y={440} w={440} h={200}>
          <div style={{ fontFamily: MONO, fontSize: 24, color: ACCENTO }}>conta</div>
          <div style={{ fontSize: 54, lineHeight: 1.05 }}>COSA C'È SCRITTO</div>
        </Box>
        <Segno d={r(88.5)} tipo="cerchio" x={530} y={415} w={500} h={250} />
      </Tra>
      <Tra a={r(89.71)}>
        <Box d={r(89.71)} x={90} y={450} w={900} h={170} bordo={ROSSO_R}>
          <div style={{ fontSize: 66 }}>NON HA OPINIONI</div>
        </Box>
        <Segno d={r(90.3)} tipo="x" x={120} y={460} w={840} h={150} col={ROSSO} spessore={12} />
        <Box d={r(91.28)} x={200} y={680} w={680} h={160} bordo={VERDE}>
          <div style={{ fontSize: 92, color: VERDE }}>ESEGUE</div>
        </Box>
      </Tra>
    </>
  );
};

// P12 (91.70-101.06) la notizia è il rumore
const P12Rumore: React.FC<P> = ({ base }) => {
  const r = rel(base);
  return (
    <>
      <SfondoPannello />
      <Testata d={r(91.70)}>NON TI STO DICENDO CHE VA TUTTO BENE</Testata>
      <Box d={r(96.70)} x={90} y={450} w={900} h={170} bordo={ROSSO_R}>
        <div style={{ fontSize: 62, lineHeight: 1 }}>SBAGLI BERSAGLIO</div>
      </Box>
      <Segno d={r(97.2)} tipo="x" x={120} y={460} w={840} h={150} col={ROSSO} spessore={12} />
      <Box d={r(97.71)} x={80} y={670} w={440} h={160} bordo="#ffffff44">
        <div style={{ fontFamily: MONO, fontSize: 24, color: "#ffffff99" }}>la notizia</div>
        <div style={{ fontSize: 68 }}>RUMORE</div>
      </Box>
      <Box d={r(99.16)} x={560} y={670} w={440} h={160}>
        <div style={{ fontFamily: MONO, fontSize: 24, color: ACCENTO }}>il meccanismo</div>
        <div style={{ fontSize: 68 }}>DA CAPIRE</div>
      </Box>
    </>
  );
};

// P13 (101.06-105.42) quindici giorni
const P13Quindici: React.FC<P> = ({ base }) => {
  const r = rel(base);
  return (
    <>
      <SfondoPannello />
      <Conta d={r(101.06)} fine={r(102.44)} da={90} a={15} testo="GIORNI" col={ROSSO} />
      <Mano d={r(102.44)} x={140} y={740} size={60} col="#fff">per dimenticare il 17 ottobre</Mano>
    </>
  );
};

// P14 (105.42-110.30) ha già vinto
const P14Vinto: React.FC<P> = ({ base }) => {
  const r = rel(base);
  return (
    <>
      <SfondoPannello />
      <Tra a={0} b={r(108.80)}>
        <Sticker d={r(105.42)} top={380} size={74} bg={VIOLA} rot={-2}>chi conta sul fatto</Sticker>
        <Sticker d={r(107.39)} top={490} size={74} rot={2}>che tu dimentichi</Sticker>
      </Tra>
      <Tra a={r(108.80)}>
        <Box d={r(108.80)} x={200} y={440} w={680} h={180} bordo={ROSSO_R} bg="#3a1418">
          <div style={{ fontSize: 86, color: ROSSO, lineHeight: 1 }}>HA GIÀ VINTO</div>
        </Box>
        <Mano d={r(109.6)} x={300} y={660} size={60} col="#fff">prima di giocare</Mano>
      </Tra>
    </>
  );
};

// P15 (110.30-119.80) la domanda finale
const P15Chiediti: React.FC<P> = ({ base }) => {
  const r = rel(base);
  return (
    <>
      <SfondoPannello />
      <Testata d={r(110.30)}>LA PROSSIMA VOLTA CHE LEGGI «SCARCERATO»</Testata>
      <Box d={r(113.43)} x={80} y={470} w={440} h={210} bordo={BLU}>
        <div style={{ fontFamily: MONO, fontSize: 24, color: "#ffffff99" }}>misura</div>
        <div style={{ fontSize: 66, lineHeight: 1 }}>CAUTELARE?</div>
      </Box>
      <Box d={r(114.30)} x={560} y={470} w={440} h={210} bordo="#ffffff44">
        <div style={{ fontFamily: MONO, fontSize: 24, color: "#ffffff99" }}>fine del</div>
        <div style={{ fontSize: 66, lineHeight: 1 }}>PROCESSO?</div>
      </Box>
      <Mano d={r(115.43)} x={170} y={750} size={62}>sono due cose diverse</Mano>
    </>
  );
};

// ---------- montaggio ----------
const PANNELLI: { a: number; b: number; el: React.FC<P> }[] = [
  { a: 7.16, b: 13.55, el: P1Gancio },
  { a: 13.55, b: 25.45, el: P2Fermare },
  { a: 25.45, b: 35.40, el: P3Cautelare },
  { a: 35.40, b: 42.77, el: P4Eccezione },
  { a: 42.77, b: 49.45, el: P5Esce },
  { a: 49.45, b: 58.10, el: P6Assolto },
  { a: 58.10, b: 62.50, el: P7Tempi },
  { a: 62.50, b: 68.03, el: P8ChiDecide },
  { a: 68.03, b: 74.98, el: P9Risposta },
  { a: 74.98, b: 78.84, el: P10Codice },
  { a: 78.84, b: 91.70, el: P11Ponte },
  { a: 91.70, b: 101.06, el: P12Rumore },
  { a: 101.06, b: 105.42, el: P13Quindici },
  { a: 105.42, b: 110.30, el: P14Vinto },
  { a: 110.30, b: 119.80, el: P15Chiediti },
];

export const DURATA_A5 = F(DURATA_A5_S);
const SCHEDA_Y = 690; // i pannelli scendono sul petto/mani, mai sulla faccia

// C che parla: jump cut a ogni frase (largo / stretto sul volto)
const CParla: React.FC = () => {
  const f = useCurrentFrame();
  const inizi = PAROLE_A5.filter((p, i) => i === 0 || PAROLE_A5[i - 1][2] !== p[2]).map((p) => F(p[0]));
  const n = inizi.filter((x) => x <= f).length;
  const stretto = n % 2 === 0 ? 0.16 : 0;
  const s = 1.02 + stretto + 0.02 * Math.sin(f / 90);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(`${CARTELLA}/C-parla.mp4`)} muted style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${s})`, transformOrigin: "50% 32%" }} />
    </AbsoluteFill>
  );
};

// Parole giganti: 2 alla volta, la chiave in giallo. Stanno a top 150, sopra la testa.
const Parolone: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const viste = PAROLE_A5.filter(([a]) => t >= a);
  if (!viste.length) return null;
  const ult = viste[viste.length - 1];
  const gruppo = PAROLE_A5.filter((p) => p[2] === ult[2]);
  const i = gruppo.indexOf(ult);
  const blocco = gruppo.slice(Math.floor(i / 2) * 2, Math.floor(i / 2) * 2 + 2);
  const a = molla(f, fps, F(blocco[0][0]), 12, 320);
  return (
    <div key={`b${blocco[0][0]}`} style={{ position: "absolute", left: 30, right: 30, top: 150, textAlign: "center", fontFamily: INTER, fontWeight: 900, fontSize: 128, lineHeight: 1.0, letterSpacing: -3, transform: `scale(${0.85 + 0.15 * a})`, textShadow: "0 8px 30px #000c" }}>
      {blocco.map(([s0, p], k) => {
        const detta = t >= s0;
        const giallo = CHIAVE_A5.test(p.toUpperCase());
        return <div key={k} style={{ color: giallo ? GIALLO : "#fff", opacity: detta ? 1 : 0, WebkitTextStroke: "3px #0008", paintOrder: "stroke fill" }}>{p.toLowerCase()}</div>;
      })}
    </div>
  );
};

const Grana5: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none", background: "radial-gradient(ellipse at 50% 40%, transparent 60%, #000a 100%)" }} />
);

const Barra5: React.FC = () => {
  const f = useCurrentFrame();
  return <div style={{ position: "absolute", left: 0, bottom: 0, height: 8, width: `${(f / DURATA_A5) * 100}%`, background: `linear-gradient(90deg,${VIOLA},${ACCENTO})` }} />;
};

export const Lampo: React.FC = () => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ backgroundColor: "#fff", opacity: interpolate(f, [0, 3], [0.35, 0], { extrapolateRight: "clamp" }), pointerEvents: "none" }} />;
};

export const A5MILANO: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: NERO, fontFamily: INTER }}>
    <CParla />
    {PANNELLI.map((p, i) => (
      <Sequence key={i} from={F(p.a)} durationInFrames={F(p.b) - F(p.a)}>
        <div style={{ position: "absolute", left: 0, right: 0, top: SCHEDA_Y, height: 1080 }}>
          <p.el base={p.a} />
        </div>
        <Lampo />
      </Sequence>
    ))}
    {/* gancio: i numeri forti, in basso, lontani dalla faccia */}
    <Sequence from={0} durationInFrames={F(7.16)}>
      <Sticker d={F(2.0)} fino={F(4.2)} top={1420} size={96} bg={ROSSO} rot={-3}>271 fermati</Sticker>
      <Sticker d={F(5.42)} top={1420} size={96} bg={VIOLA} rot={2}>e 21 già a casa</Sticker>
    </Sequence>
    <Sequence from={F(48.0)} durationInFrames={F(51.58) - F(48.0)}>
      <Sticker d={F(49.45) - F(48.0)} top={1420} size={80} bg={VIOLA} rot={-2}>La parte che nessuno ti dice</Sticker>
    </Sequence>
    <Sequence from={F(117.0)} durationInFrames={DURATA_A5 - F(117.0)}>
      <Sticker d={F(117.7) - F(117.0)} top={1420} size={80} bg={VIOLA} rot={-2}>Il sistema non ha opinioni</Sticker>
      <Sequence from={F(118.6) - F(117.0)}>
        <div style={{ position: "absolute", left: 60, right: 60, top: 1810, textAlign: "center", fontFamily: MONO, fontSize: 24, color: "#ffffffcc", textShadow: "0 2px 8px #000" }}>Non è un consiglio legale. È come la vedo io.</div>
      </Sequence>
    </Sequence>
    <Parolone />
    <div style={{ position: "absolute", left: 50, top: 70, fontFamily: MONO, fontSize: 26, color: "#ffffffbb", letterSpacing: 3, textShadow: "0 2px 8px #000" }}>ATTUALITÀ DI C · #5</div>
    <Grana5 />
    <Barra5 />
    <Audio src={staticFile(`${CARTELLA}/voce.wav`)} volume={1} />
    <Audio src={staticFile(`${CARTELLA}/musica.wav`)} volume={0.06} />
    <Audio src={staticFile(`${CARTELLA}/sfx.wav`)} volume={0.35} />
  </AbsoluteFill>
);

// Copertina: C a tutto schermo + titolo stile notizia
export const CoverA5: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: NERO }}>
    <Img src={staticFile(`${CARTELLA}/cover-frame.png`)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 30%" }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #000000cc 0%, transparent 30%, transparent 55%, #000000ee 100%)" }} />
    <div style={{ position: "absolute", left: 60, right: 60, top: 1120, fontFamily: ANTON, fontSize: 124, lineHeight: 1.18, color: "#fff", textTransform: "uppercase", textShadow: "0 8px 30px #000" }}>
      Scarcerati<br /><span style={{ background: VIOLA, padding: "0 18px", borderRadius: 14, lineHeight: 1.0, display: "inline-block" }}>tutti</span>
    </div>
    <div style={{ position: "absolute", left: 60, right: 60, top: 1450, fontFamily: MACCHINA, fontSize: 46, lineHeight: 1.2, color: GIALLO, textTransform: "uppercase" }}>e per la legge<br />è normale, ecco perché</div>
    <div style={{ position: "absolute", left: 60, top: 300, fontFamily: MONO, fontSize: 34, color: "#ffffffcc", letterSpacing: 4 }}>ATTUALITÀ DI C · #5</div>
  </AbsoluteFill>
);
