// Attualità di C #7 «Guarda cosa ha detto questo giudice» (06/11/2026).
// FORMATO NUOVO «GUARDA QUESTO» (deciso da Marco il 06/11):
//   C in green screen apre → LA FONTE a tutto schermo (card con la citazione di Sabella) → C smonta.
// Immagine: A4-midterm/set/C-microfono.png. Labiale: InfiniteTalk con voce.wav (mai l'mp3 grezzo).
// Tempi in secondi della voce (attualita/A7-sabella/montaggio/voce.wav, pause tagliate, ×1,1).
import React from "react";
import { AbsoluteFill, Audio, Img, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ACCENTO, ANTON, INTER, MACCHINA, MANO, MONO, molla, NERO, ROSSO, Sticker, VERDE, VIOLA } from "./FormatC";
import { CHIAVE_A7SABELLA as CHIAVE_A7, PAROLE_A7SABELLA as PAROLE_A7 } from "./a7sabella-parole";

const CARTELLA = "a7sabella";
const F = (s: number) => Math.round(s * 30);

const ROSSO_R = "#e0494f";
const GIALLO = "#ffd84d";

// ---------- mattoni (gli stessi di A5/A4) ----------
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

const Spunta: React.FC<{ d: number; x: number; y: number; testo: string; via?: number }> = ({ d, x, y, testo, via }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < d) return null;
  const a = molla(f, fps, d, 11, 260);
  const tolto = via !== undefined && f >= via;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `scale(${a})`, fontFamily: ANTON, fontSize: 58, color: tolto ? ROSSO : "#fff", display: "flex", gap: 16, alignItems: "center" }}>
      <span style={{ color: tolto ? ROSSO : VERDE }}>{tolto ? "✗" : "✓"}</span>{testo}
    </div>
  );
};

// ---------- LA FONTE: il filmato vero di Sabella (formato «guarda questo») ----------
// Il filmato a tutto schermo, integrale e con l'audio originale: è la prova, non una
// card di testo. Estratto dal reel di Gandolfi (produzione/motion-transfer/ig-DcOWtVipMuV),
// 7,0→60,0 s = i 53 s in cui si vede Sabella. I sottotitoli azzurri sono già bruciati.
// muted: l'audio lo porta l'<Audio> dedicato più sotto. Senza muted l'OffthreadVideo
// suonerebbe anche il suo, in doppio (+6 dB).
const FonteSabella: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <OffthreadVideo src={staticFile(`${CARTELLA}/fonte-sabella.mp4`)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
  </AbsoluteFill>
);

// ---------- pannelli (tempi assoluti in secondi) ----------
// TAGLIO = 45,5 s: la citazione letta da C è uscita dalla voce (al suo posto parla Sabella
// col filmato vero). La voce.wav tagliata a 11,99 s riparte a 11,99+45,5 = 57,49 s.
// I numeri dentro i componenti restano quelli della voce intera: rel() ci somma TAGLIO.
// base arriva da ass(), cioè è GIÀ un frame: non va rimoltiplicato per 30.
type P = { base: number };
const TAGLIO = 45.5;
const rel = (base: number) => (s: number) => F(s + TAGLIO) - base;

// P1 (13.65-23.57) le tasse che paghi
const P1Tasse: React.FC<P> = ({ base }) => {
  const r = rel(base);
  return (
    <>
      <SfondoPannello />
      <Testata d={r(13.65)}>QUELLO CHE PAGHI OGNI GIORNO</Testata>
      <Sticker d={r(17.75)} top={420} size={70} bg={ROSSO} rot={-2}>esci di casa</Sticker>
      <Sticker d={r(19.25)} top={540} size={70} rot={2}>e paghi</Sticker>
      <Box d={r(20.13)} x={70} y={670} w={940} h={150} bordo={ROSSO_R}>
        <div style={{ fontSize: 58, lineHeight: 1.05 }}>IRPEF · IVA · BOLLO · TARI</div>
      </Box>
      <Segno d={r(21.2)} tipo="cerchio" x={40} y={645} w={1000} h={200} col={ROSSO} />
    </>
  );
};

// P2 (23.76-29.46) le tre promesse
const P2Promesse: React.FC<P> = ({ base }) => {
  const r = rel(base);
  return (
    <>
      <SfondoPannello />
      <Testata d={r(23.76)}>IN CAMBIO LO STATO TI HA PROMESSO</Testata>
      <Spunta d={r(26.16)} x={150} y={460} testo="SICUREZZA" />
      <Spunta d={r(26.16)} x={150} y={580} testo="SANITÀ" />
      <Spunta d={r(27.4)} x={150} y={700} testo="I TUOI SOLDI DOVE DICONO" />
    </>
  );
};

// P3 (29.46-35.09) ti aprono lo zaino
const P3Zaino: React.FC<P> = ({ base }) => {
  const r = rel(base);
  return (
    <>
      <SfondoPannello />
      <Box d={r(29.46)} x={80} y={420} w={920} h={180} bordo="#ffffff44">
        <div style={{ fontSize: 60, lineHeight: 1.05 }}>METROPOLITANA<br />ZAINO APERTO</div>
      </Box>
      <Segno d={r(30.4)} tipo="x" x={120} y={435} w={840} h={150} col={ROSSO} spessore={12} />
      <Box d={r(32.24)} x={110} y={650} w={860} h={170} bordo={ROSSO_R} bg="#3a1418">
        <div style={{ fontSize: 52, lineHeight: 1.1 }}>«QUELLA PERSONA VA CAPITA»</div>
      </Box>
      <Mano d={r(33.6)} x={200} y={850} size={58} col="#fff">te lo dice un giudice</Mano>
    </>
  );
};

// P4 (35.09-40.88) tu hai solo pagato
const P4Pagato: React.FC<P> = ({ base }) => {
  const r = rel(base);
  return (
    <>
      <SfondoPannello />
      <Sticker d={r(35.09)} top={390} size={92} bg={VIOLA} rot={-3}>Ma capito da chi?</Sticker>
      <Box d={r(36.01)} x={110} y={560} w={860} h={150} bordo="#ffffff44">
        <div style={{ fontSize: 54 }}>TU NON HAI RUBATO NIENTE</div>
      </Box>
      <Box d={r(37.69)} x={110} y={740} w={860} h={150} bordo={VERDE}>
        <div style={{ fontSize: 66, color: VERDE }}>TU HAI PAGATO</div>
      </Box>
      <Segno d={r(38.2)} tipo="cerchio" x={80} y={715} w={920} h={200} col={VERDE} />
    </>
  );
};

// P5 (40.88-46.74) chi le sfrutta?
const P5Sfrutta: React.FC<P> = ({ base }) => {
  const r = rel(base);
  return (
    <>
      <SfondoPannello />
      <Testata d={r(40.88)}>I CONTI NON LI FA NESSUNO</Testata>
      <Box d={r(44.24)} x={90} y={470} w={900} h={190} bordo={ROSSO_R}>
        <div style={{ fontSize: 58, lineHeight: 1.1 }}>SE SONO SFRUTTATE,<br />CHI LE SFRUTTA?</div>
      </Box>
      <Segno d={r(45.2)} tipo="sotto" x={130} y={680} w={820} h={40} col={ROSSO} />
    </>
  );
};

// P6 (46.74-52.24) lo sfruttatore ha un nome
const P6Nome: React.FC<P> = ({ base }) => {
  const r = rel(base);
  return (
    <>
      <SfondoPannello />
      <Box d={r(46.74)} x={80} y={400} w={920} h={170} bordo="#ffffff44">
        <div style={{ fontSize: 54 }}>UNO SFRUTTATORE HA</div>
      </Box>
      <Box d={r(47.8)} x={80} y={600} w={920} h={180}>
        <div style={{ fontSize: 58, lineHeight: 1.05 }}>NOME · COGNOME<br />CONTO IN BANCA</div>
      </Box>
      <Mano d={r(50.52)} x={160} y={830} size={62}>se lo Stato lo sa, lo vada a prendere</Mano>
    </>
  );
};

// P7 (52.43-57.69) non è colpa tua
const P7Colpa: React.FC<P> = ({ base }) => {
  const r = rel(base);
  return (
    <>
      <SfondoPannello />
      <Box d={r(52.43)} x={110} y={440} w={860} h={180} bordo={ROSSO_R}>
        <div style={{ fontSize: 56, lineHeight: 1.1 }}>SE NON LO SA,<br />È PERCHÉ NON VUOLE SAPERLO</div>
      </Box>
      <Segno d={r(53.4)} tipo="x" x={150} y={455} w={780} h={150} col={ROSSO} spessore={12} />
      <Box d={r(55.37)} x={200} y={690} w={680} h={170} bordo={VERDE}>
        <div style={{ fontSize: 72, color: VERDE }}>NON È COLPA TUA</div>
      </Box>
    </>
  );
};

// P8 (57.69-63.84) la sicurezza è un servizio
const P8Servizio: React.FC<P> = ({ base }) => {
  const r = rel(base);
  return (
    <>
      <SfondoPannello />
      <Testata d={r(57.69)}>LA PARTE CHE NESSUNO DICE</Testata>
      <Box d={r(59.54)} x={90} y={430} w={900} h={150} bordo="#ffffff44">
        <div style={{ fontSize: 50 }}>LE TASSE PAGANO I SERVIZI</div>
      </Box>
      <Box d={r(62.05)} x={230} y={620} w={620} h={150}>
        <div style={{ fontSize: 62, lineHeight: 1 }}>LA SICUREZZA<br />È UN SERVIZIO</div>
      </Box>
      <Segno d={r(62.8)} tipo="cerchio" x={200} y={595} w={680} h={200} />
    </>
  );
};

// P9 (63.84-70.41) contratto non rispettato
const P9Contratto: React.FC<P> = ({ base }) => {
  const r = rel(base);
  return (
    <>
      <SfondoPannello />
      <Box d={r(63.84)} x={80} y={420} w={920} h={180} bordo={ROSSO_R}>
        <div style={{ fontSize: 50, lineHeight: 1.1 }}>HAI PAGATO QUALCOSA<br />CHE NON TI È ARRIVATO</div>
      </Box>
      <Tra a={r(68.66)}>
        <Box d={r(68.66)} x={140} y={660} w={800} h={180} bordo={ROSSO} bg="#3a1418">
          <div style={{ fontSize: 62, color: ROSSO, lineHeight: 1 }}>CONTRATTO<br />NON RISPETTATO</div>
        </Box>
        <Segno d={r(69.3)} tipo="cerchio" x={110} y={635} w={860} h={230} col={ROSSO} />
      </Tra>
    </>
  );
};

// P10 (70.41-80.52) io ho pagato, tu hai incassato
const P10Incassato: React.FC<P> = ({ base }) => {
  const r = rel(base);
  return (
    <>
      <SfondoPannello />
      <Testata d={r(70.41)}>NON ACCETTO LA LEZIONE</Testata>
      <Box d={r(72.32)} x={90} y={440} w={900} h={170} bordo="#ffffff44">
        <div style={{ fontSize: 50, lineHeight: 1.1 }}>CHI PRENDE LO STIPENDIO<br />DA QUEI SOLDI</div>
      </Box>
      <Tra a={r(77.22)}>
        <Box d={r(77.22)} x={80} y={660} w={440} h={160} bordo={VERDE}>
          <div style={{ fontSize: 60, color: VERDE, lineHeight: 1 }}>IO HO<br />PAGATO</div>
        </Box>
        <Box d={r(78.30)} x={560} y={660} w={440} h={160} bordo={ROSSO_R}>
          <div style={{ fontSize: 60, color: ROSSO, lineHeight: 1 }}>TU HAI<br />INCASSATO</div>
        </Box>
      </Tra>
    </>
  );
};

// P11 (80.52-85.51) il servizio dov'è
const P11Dove: React.FC<P> = ({ base }) => {
  const r = rel(base);
  return (
    <>
      <SfondoPannello />
      <Sticker d={r(80.52)} top={380} size={104} bg={ROSSO} rot={-3}>IL SERVIZIO DOV'È?</Sticker>
      <Box d={r(84.48)} x={140} y={580} w={800} h={170} bordo="#ffffff44">
        <div style={{ fontSize: 54, lineHeight: 1.1 }}>QUANTO È COSTATO CAPIRLO</div>
      </Box>
      <Mano d={r(85.6)} x={330} y={790} size={66}>e chi l'ha pagato</Mano>
    </>
  );
};

// P12 (87.04-91.5) l'hai pagato tu
const P12Tu: React.FC<P> = ({ base }) => {
  const r = rel(base);
  return (
    <>
      <SfondoPannello />
      <Box d={r(87.04)} x={140} y={430} w={800} h={180} bordo="#ffffff44">
        <div style={{ fontSize: 52, lineHeight: 1.1 }}>LA RISPOSTA È SEMPRE LA STESSA</div>
      </Box>
      <Box d={r(89.08)} x={140} y={650} w={800} h={190} bordo={ROSSO} bg="#3a1418">
        <div style={{ fontSize: 84, color: ROSSO, lineHeight: 1 }}>L'HAI PAGATO TU</div>
      </Box>
      <Mano d={r(89.9)} x={230} y={870} size={56} col="#fff">e non ti hanno chiesto il permesso</Mano>
    </>
  );
};

// ---------- montaggio ----------
// Tre blocchi: A) C apre  B) il filmato VERO di Sabella, integrale e con l'audio suo
// C) C smonta. La voce.wav è tagliata agli stessi due punti della clip, così il labiale
// resta a tempo per costruzione (il bug del 06/11 era <Sequence from> che azzera il
// frame dell'OffthreadVideo: qui ogni troncone parte da 0 dentro la sua Sequence).
const FONTE_A = 4.48;            // fine dell'intro di C («...Ascolta bene»)
const FONTE_DUR = 53.01;         // durata del filmato di Sabella
const FONTE_B = FONTE_A + FONTE_DUR;  // 57.49: riparte C
const CODA = 79.72;              // durata di voce.wav tagliata (= voce-b.wav)
const OFF_CODA = 11.99;          // dove riparte la voce tagliata, nella scala intera

const PANNELLI: { a: number; b: number; el: React.FC<P> }[] = [
  { a: 13.65, b: 23.57, el: P1Tasse },
  { a: 23.57, b: 29.46, el: P2Promesse },
  { a: 29.46, b: 35.09, el: P3Zaino },
  { a: 35.09, b: 40.88, el: P4Pagato },
  { a: 40.88, b: 46.74, el: P5Sfrutta },
  { a: 46.74, b: 52.43, el: P6Nome },
  { a: 52.43, b: 57.69, el: P7Colpa },
  { a: 57.69, b: 63.84, el: P8Servizio },
  { a: 63.84, b: 70.41, el: P9Contratto },
  { a: 70.41, b: 77.22, el: P10Incassato },
  { a: 77.22, b: 85.51, el: P11Dove },
  { a: 85.51, b: 91.9, el: P12Tu },
];

export const DURATA_A7 = F(FONTE_B + CODA);
const SCHEDA_Y = 690;

// C che parla: jump cut a ogni frase. `off` = dove comincia il troncone nella scala
// intera della voce, così il jump cut resta continuo anche dopo il taglio.
const CParla: React.FC<{ clip: string; off: number }> = ({ clip, off }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = off + f / fps;
  const n = PAROLE_A7.filter((p, i) => (i === 0 || PAROLE_A7[i - 1][2] !== p[2]) && p[0] <= t).length;
  const stretto = n % 2 === 0 ? 0.16 : 0;
  const s = 1.02 + stretto + 0.02 * Math.sin(f / 90);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(`${CARTELLA}/${clip}`)} muted style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${s})`, transformOrigin: "50% 32%" }} />
    </AbsoluteFill>
  );
};

// Da un tempo della voce INTERA al frame assoluto del video (che ha il filmato in mezzo).
const ass = (s: number) => F(FONTE_B + s - OFF_CODA);

// Parole giganti: 2 alla volta, la chiave in giallo
const Parolone: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < F(FONTE_B)) return null; // durante il filmato di Sabella non si mostrano
  const t = OFF_CODA + (f - F(FONTE_B)) / fps; // tempo nella scala della voce intera
  const viste = PAROLE_A7.filter(([a]) => t >= a);
  if (!viste.length) return null;
  const ult = viste[viste.length - 1];
  const gruppo = PAROLE_A7.filter((p) => p[2] === ult[2]);
  const i = gruppo.indexOf(ult);
  const blocco = gruppo.slice(Math.floor(i / 2) * 2, Math.floor(i / 2) * 2 + 2);
  const a = molla(f, fps, ass(blocco[0][0]), 12, 320);
  return (
    <div key={`b${blocco[0][0]}`} style={{ position: "absolute", left: 30, right: 30, top: 150, textAlign: "center", fontFamily: INTER, fontWeight: 900, fontSize: 124, lineHeight: 1.0, letterSpacing: -3, transform: `scale(${0.85 + 0.15 * a})`, textShadow: "0 8px 30px #000c" }}>
      {blocco.map(([s0, p], k) => {
        const detta = t >= s0;
        const giallo = CHIAVE_A7.test(p.toUpperCase());
        return <div key={k} style={{ color: giallo ? GIALLO : "#fff", opacity: detta ? 1 : 0, WebkitTextStroke: "3px #0008", paintOrder: "stroke fill" }}>{p.toLowerCase()}</div>;
      })}
    </div>
  );
};

const Grana7: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none", background: "radial-gradient(ellipse at 50% 40%, transparent 60%, #000a 100%)" }} />
);
const Barra7: React.FC = () => {
  const f = useCurrentFrame();
  return <div style={{ position: "absolute", left: 0, bottom: 0, height: 8, width: `${(f / DURATA_A7) * 100}%`, background: `linear-gradient(90deg,${VIOLA},${ACCENTO})` }} />;
};
const Lampo: React.FC = () => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ backgroundColor: "#fff", opacity: interpolate(f, [0, 3], [0.35, 0], { extrapolateRight: "clamp" }), pointerEvents: "none" }} />;
};

export const A7SABELLA: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: NERO, fontFamily: INTER }}>
    {/* A) 0-4.48: C in camera che apre con «Guarda cosa ha detto questo giudice» */}
    <Sequence from={0} durationInFrames={F(FONTE_A)}>
      <CParla clip="C-parla-a.mp4" off={0} />
      <Sticker d={F(0.3)} top={1420} size={92} bg={ROSSO} rot={-3}>GUARDA QUESTO</Sticker>
    </Sequence>
    {/* B) 4.48-57.49: LA FONTE — il filmato VERO di Sabella, integrale, con il suo audio */}
    <Sequence from={F(FONTE_A)} durationInFrames={F(FONTE_DUR)}>
      <FonteSabella />
    </Sequence>
    {/* C) 57.49-fine: C a tutto schermo che smonta, con i pannelli */}
    <Sequence from={F(FONTE_B)}>
      <CParla clip="C-parla-b.mp4" off={OFF_CODA} />
    </Sequence>
    {PANNELLI.map((p, i) => (
      <Sequence key={i} from={ass(p.a)} durationInFrames={ass(p.b) - ass(p.a)}>
        <div style={{ position: "absolute", left: 0, right: 0, top: SCHEDA_Y, height: 1080 }}>
          <p.el base={ass(p.a)} />
        </div>
        <Lampo />
      </Sequence>
    ))}
    <Parolone />
    <div style={{ position: "absolute", left: 50, top: 70, fontFamily: MONO, fontSize: 26, color: "#ffffffbb", letterSpacing: 3, textShadow: "0 2px 8px #000" }}>ATTUALITÀ DI C · #7</div>
    <Grana7 />
    <Barra7 />
    {/* Audio: i due tronconi della voce di C al loro posto, il filmato di Sabella col SUO audio */}
    <Sequence from={0} durationInFrames={F(FONTE_A)}>
      <Audio src={staticFile(`${CARTELLA}/voce-a.wav`)} volume={1} />
    </Sequence>
    {/* Il gain è già cotto dentro fonte-sabella.mp4 (-16,4 LUFS come la voce di C): qui volume 1. */}
    <Sequence from={F(FONTE_A)} durationInFrames={F(FONTE_DUR)}>
      <Audio src={staticFile(`${CARTELLA}/fonte-sabella.mp4`)} volume={1} />
    </Sequence>
    <Sequence from={F(FONTE_B)}>
      <Audio src={staticFile(`${CARTELLA}/voce-b.wav`)} volume={1} />
      <Audio src={staticFile(`${CARTELLA}/musica.wav`)} volume={0.06} />
      <Audio src={staticFile(`${CARTELLA}/sfx.wav`)} volume={0.35} />
    </Sequence>
  </AbsoluteFill>
);

// Copertina
export const CoverA7SABELLA: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: NERO }}>
    <Img src={staticFile(`${CARTELLA}/cover-frame.png`)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 30%" }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #000000cc 0%, transparent 30%, transparent 55%, #000000ee 100%)" }} />
    <div style={{ position: "absolute", left: 60, right: 60, top: 1080, fontFamily: ANTON, fontSize: 118, lineHeight: 1.18, color: "#fff", textTransform: "uppercase", textShadow: "0 8px 30px #000" }}>
      Vi paghiamo<br />per essere <span style={{ background: ROSSO, padding: "0 18px", borderRadius: 14, lineHeight: 1.0, display: "inline-block" }}>derubati</span>
    </div>
    <div style={{ position: "absolute", left: 60, right: 60, top: 1440, fontFamily: MACCHINA, fontSize: 44, lineHeight: 1.2, color: GIALLO, textTransform: "uppercase" }}>un giudice dice<br />che vanno capite</div>
    <div style={{ position: "absolute", left: 60, top: 300, fontFamily: MONO, fontSize: 34, color: "#ffffffcc", letterSpacing: 4 }}>ATTUALITÀ DI C · #7</div>
  </AbsoluteFill>
);
