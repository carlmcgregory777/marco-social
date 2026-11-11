// Attualità di C #4 (04/11/2026): «Trump ha perso il Congresso (e io sono contento, ecco perché)».
// Schermo diviso come Jashi/Filippo: sopra le grafiche con segni a mano animati, sotto C che respira.
// Tre pezzi col labiale (Dreamina Avatar Turbo): L1 gancio, L2 ri-aggancio, L3 chiusura, a tutto schermo.
// Tempi in secondi della voce (attualita/A4-midterm/montaggio/voce.wav, pause tagliate, ×1,1).
import React from "react";
import { AbsoluteFill, Audio, Img, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ACCENTO, ANTON, INTER, MACCHINA, MANO, MONO, molla, NERO, ROSSO, Sticker, VERDE, VIOLA } from "./FormatC";
import { ENFASI_A4, PAROLE_A4 } from "./a4midterm-parole";

const CARTELLA = "a4midterm";
const F = (s: number) => Math.round(s * 30);
const BLU = "#3b82f6";
const ROSSO_R = "#e0494f";

// ---------- mattoni ----------

// Segno fatto a mano che si disegna (cerchio, X, sottolineatura, freccia)
export const Segno: React.FC<{ d: number; tipo: "cerchio" | "x" | "sotto" | "freccia"; x: number; y: number; w: number; h: number; col?: string; spessore?: number }> = ({ d, tipo, x, y, w, h, col = "#ffd84d", spessore = 9 }) => {
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

// Riquadro che entra con la molla
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

// Scritta a mano che si scrive
export const Mano: React.FC<{ d: number; x: number; y: number; children: React.ReactNode; size?: number; col?: string; rot?: number }> = ({ d, x, y, children, size = 62, col = "#ffd84d", rot = -3 }) => {
  const f = useCurrentFrame();
  const w = interpolate(f, [d, d + 16], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <div style={{ position: "absolute", left: x, top: y, fontFamily: MANO, fontWeight: 700, fontSize: size, color: col, transform: `rotate(${rot}deg)`, clipPath: `inset(-20% ${100 - w}% -20% 0)`, whiteSpace: "nowrap", textShadow: "0 4px 16px #000, 0 0 2px #000" }}>{children}</div>;
};

// Etichetta da agenzia in alto nel pannello
export const Testata: React.FC<{ d?: number; children: React.ReactNode; y?: number }> = ({ d = 0, children, y = 350 }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [d, d + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <div style={{ position: "absolute", left: 0, right: 0, top: y, textAlign: "center", fontFamily: MONO, fontSize: 30, letterSpacing: 5, color: ACCENTO, opacity: o }}>{children}</div>;
};

// Mostra i figli solo tra due istanti (frame relativi al pannello)
export const Tra: React.FC<{ a: number; b?: number; children: React.ReactNode }> = ({ a, b, children }) => {
  const f = useCurrentFrame();
  return f >= a && (b === undefined || f < b) ? <>{children}</> : null;
};

// Sfondo del pannello alto: carta millimetrata scura con luce viola
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

const Fonti: React.FC<{ testo: string }> = ({ testo }) => <div style={{ position: "absolute", left: 50, right: 50, top: 905, fontFamily: MONO, fontSize: 19, color: "#ffffff70", textAlign: "center" }}>{testo}</div>;

// ---------- pannelli (tempo relativo: r(s) = frame dall'inizio del pannello) ----------
type P = { base: number };
const rel = (base: number) => (s: number) => F(s) - F(base);

const P1Spiego: React.FC<P> = ({ base }) => {
  const r = rel(base);
  return (
    <>
      <SfondoPannello />
      <Sticker d={r(8.14)} top={370} size={64} bg={VIOLA} rot={-2}>In Italia nessuno</Sticker>
      <Sticker d={r(9.2)} top={470} size={64} rot={2}>te lo spiega bene</Sticker>
      <Mano d={r(11.74)} x={170} y={590} size={66}>…è più facile di quanto sembra</Mano>
      <Box d={r(13.44)} x={290} y={700} w={500} h={130} bordo="#ffffff55">
        <div style={{ fontSize: 86 }}>POLITICA</div>
      </Box>
      <Segno d={r(13.93)} tipo="x" x={300} y={700} w={480} h={130} col={ROSSO} spessore={12} />
      <Mano d={r(14.53)} x={620} y={820} size={54} rot={-6}>non c'entra un tubo</Mano>
    </>
  );
};

const P2Midterm: React.FC<P> = ({ base }) => {
  const r = rel(base);
  return (
    <>
      <SfondoPannello />
      <Tra a={0} b={r(24.81)}>
        <Box d={r(17.25)} x={90} y={350} w={900} h={170}>
          <div style={{ fontSize: 92, color: "#fff", lineHeight: 1 }}>MIDTERM</div>
          <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 36, color: ACCENTO }}>elezioni di metà mandato</div>
        </Box>
        <Box d={r(19.88)} x={80} y={580} w={440} h={170} bordo="#ffffff44">
          <div style={{ fontFamily: MONO, fontSize: 26, color: "#ffffff99" }}>non si vota il</div>
          <div style={{ fontSize: 70 }}>PRESIDENTE</div>
        </Box>
        <Segno d={r(20.37)} tipo="x" x={110} y={590} w={380} h={150} col={ROSSO} spessore={12} />
        <Box d={r(21.19)} x={560} y={580} w={440} h={170}>
          <div style={{ fontFamily: MONO, fontSize: 26, color: "#ffffff99" }}>si vota il</div>
          <div style={{ fontSize: 70 }}>CONGRESSO</div>
        </Box>
        <Segno d={r(21.57)} tipo="cerchio" x={530} y={555} w={500} h={225} />
        <Mano d={r(23.09)} x={560} y={790} size={58}>= chi scrive le leggi</Mano>
      </Tra>
      <Tra a={r(24.81)}>
        <Testata d={r(24.81)}>IL CONGRESSO · DUE CAMERE</Testata>
        {(["CAMERA", "SENATO"] as const).map((n, i) => (
          <Colora key={n} d={r(i ? 26.24 : 25.56)} blu={r(27.34) + i * 4} x={i ? 560 : 80} nome={n} />
        ))}
        <Sticker d={r(27.34)} top={720} size={74} bg={BLU} rot={-2}>Democratici</Sticker>
        <Mano d={r(28.92)} x={330} y={830} size={60}>tutte e due!</Mano>
      </Tra>
      <Fonti testo="Proiezioni Fox News Decision Desk, CNN, CBS (04/11/2026)" />
    </>
  );
};

// Camera/Senato: grigio, poi diventa blu
const Colora: React.FC<{ d: number; blu: number; x: number; nome: string }> = ({ d, blu, x, nome }) => {
  const f = useCurrentFrame();
  const k = interpolate(f, [blu, blu + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Box d={d} x={x} y={430} w={440} h={240} bordo={k > 0.5 ? BLU : "#ffffff44"} bg={k > 0.5 ? "#1a2c5a" : "#15122a"}>
      <div style={{ fontSize: 88, transform: `scale(${1 + 0.15 * Math.sin(k * Math.PI)})` }}>{nome}</div>
    </Box>
  );
};

const P3Diviso: React.FC<P> = ({ base }) => {
  const r = rel(base);
  const f = useCurrentFrame();
  const tira = interpolate(f, [r(33.05), r(33.65)], [0, 40], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <>
      <SfondoPannello />
      <Testata>GOVERNO DIVISO</Testata>
      <div style={{ position: "absolute", left: 0, top: 0, transform: `translateX(${-tira}px)` }}>
        <Box d={r(30.17)} x={60} y={420} w={440} h={230} bordo={ROSSO_R} bg="#3a1418">
          <div style={{ fontFamily: MONO, fontSize: 26, color: "#ffffffaa" }}>presidente</div>
          <div style={{ fontSize: 66 }}>REPUBBLICANO</div>
        </Box>
      </div>
      <div style={{ position: "absolute", left: 0, top: 0, transform: `translateX(${tira}px)` }}>
        <Box d={r(31.51)} x={580} y={420} w={440} h={230} bordo={BLU} bg="#14224a">
          <div style={{ fontFamily: MONO, fontSize: 26, color: "#ffffffaa" }}>congresso</div>
          <div style={{ fontSize: 66 }}>DEMOCRATICO</div>
        </Box>
      </div>
      <Segno d={r(33.05)} tipo="freccia" x={-10} y={660} w={-0} h={0} />
      <div style={{ position: "absolute", left: 300, top: 670, width: 480, height: 80, transform: "scaleX(-1)" }}>
        <Segno d={r(33.05)} tipo="freccia" x={250} y={0} w={220} h={80} col={ROSSO_R} />
      </div>
      <Segno d={r(33.05)} tipo="freccia" x={560} y={670} w={220} h={80} col={BLU} />
      <Sticker d={r(34.42)} top={780} size={60} bg={VIOLA} rot={-2}>marito e moglie</Sticker>
      <Mano d={r(35.16)} x={300} y={860} size={52}>che non si parlano 🙃</Mano>
    </>
  );
};

// Riga da terminale: nome a sinistra, variazione a destra
const Riga: React.FC<{ d: number; y: number; nome: string; sotto: string; valore: string; col?: string }> = ({ d, y, nome, sotto, valore, col = ROSSO }) => (
  <Box d={d} x={80} y={y} w={920} h={150} bordo={col} bg="#140f1c">
    <div style={{ display: "flex", width: "100%", padding: "0 40px", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ textAlign: "left" }}>
        <div style={{ fontSize: 66, lineHeight: 1 }}>{nome}</div>
        <div style={{ fontFamily: MONO, fontSize: 24, color: "#ffffff99" }}>{sotto}</div>
      </div>
      <div style={{ fontSize: 96, color: col }}>{valore}</div>
    </div>
  </Box>
);

const P4Paura: React.FC<P> = ({ base }) => {
  const r = rel(base);
  return (
    <>
      <SfondoPannello />
      <Tra a={0} b={r(43.46)}>
        <Testata>FUTURES · NOTTE DEL 4/11</Testata>
        <Riga d={r(38.56)} y={420} nome="NASDAQ-100" sotto="le aziende tech" valore="−2,2%" />
        <Segno d={r(41.01)} tipo="cerchio" x={700} y={415} w={300} h={160} />
        <Riga d={r(42.36)} y={600} nome="NIKKEI" sotto="Tokyo" valore="−3%" />
        <Segno d={r(42.67)} tipo="cerchio" x={740} y={595} w={260} h={160} />
        <Mano d={r(36.99)} x={120} y={790} size={60}>il mercato se l'è fatta sotto</Mano>
      </Tra>
      <Tra a={r(43.46)}>
        <Sticker d={r(43.57)} top={350} size={90} rot={-2}>Perché?</Sticker>
        <Box d={r(44.49)} x={80} y={500} w={920} h={170} bordo={ROSSO_R}>
          <div style={{ fontFamily: MONO, fontSize: 26, color: "#ffffff99" }}>il piano di Trump</div>
          <div style={{ fontSize: 64 }}>PIÙ SOLDI NELL'ECONOMIA</div>
        </Box>
        <Segno d={r(48.44)} tipo="x" x={120} y={510} w={840} h={150} col={ROSSO} spessore={12} />
        <Sticker d={r(49.03)} top={540} size={110} bg={ROSSO} rot={-8}>Ciao 👋</Sticker>
        <Box d={r(50.52)} x={160} y={720} w={760} h={140} bordo={BLU}>
          <div style={{ fontSize: 56 }}>BIG TECH + IA NEL MIRINO</div>
        </Box>
        <Segno d={r(52.14)} tipo="sotto" x={200} y={850} w={680} h={40} />
      </Tra>
      <Fonti testo="Reuters via AOL, 04/11/2026 04:57 UTC (futures). Saxo, C. Chanana" />
    </>
  );
};

const P5Calma: React.FC<P> = ({ base }) => {
  const r = rel(base);
  return (
    <>
      <SfondoPannello />
      <Tra a={0} b={r(66.88)}>
        <Testata>PRESIDENTE ⚔ CONGRESSO</Testata>
        <Box d={r(60.69)} x={90} y={420} w={900} h={180}>
          <div style={{ fontSize: 100, lineHeight: 1 }}>2 ANNI</div>
          <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 38, color: ACCENTO }}>quasi nessuna legge grossa</div>
        </Box>
        <Box d={r(63.46)} x={90} y={640} w={430} h={150} bordo={VERDE}>
          <div style={{ fontSize: 80, color: VERDE, lineHeight: 1 }}>0</div>
          <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 30 }}>riforme a sorpresa</div>
        </Box>
        <Box d={r(64.91)} x={560} y={640} w={430} h={150} bordo={VERDE}>
          <div style={{ fontSize: 80, color: VERDE, lineHeight: 1 }}>0</div>
          <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 30 }}>tasse nuove in una notte</div>
        </Box>
      </Tra>
      <Tra a={r(66.88)}>
        <Testata d={r(66.88)}>IL MERCATO AMA UNA COSA SOLA</Testata>
        <Sticker d={r(69.47)} top={470} size={92} bg={VIOLA} rot={-2}>Sapere cosa</Sticker>
        <Sticker d={r(70.44)} top={600} size={92} rot={2}>succede domani</Sticker>
        <Segno d={r(70.94)} tipo="sotto" x={220} y={730} w={640} h={50} />
      </Tra>
    </>
  );
};

// Spunta che appare
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

// Barra del grafico che cresce
const Colonna: React.FC<{ d: number; x: number; anno: string; pct: number }> = ({ d, x, anno, pct }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < d) return null;
  const a = molla(f, fps, d, 14, 120);
  const h = pct * 14 * a;
  return (
    <>
      <div style={{ position: "absolute", left: x, top: 820 - h, width: 220, height: h, borderRadius: "16px 16px 0 0", background: `linear-gradient(${VERDE}, #1c7a45)`, boxShadow: `0 0 40px ${VERDE}66` }} />
      <div style={{ position: "absolute", left: x - 40, width: 300, top: 820 - h - 110, textAlign: "center", fontFamily: ANTON, fontSize: 90, color: VERDE, opacity: a, WebkitTextStroke: "6px #000", paintOrder: "stroke fill" }}>+{Math.round(pct * a)}%</div>
      <div style={{ position: "absolute", left: x, width: 220, top: 830, textAlign: "center", fontFamily: MONO, fontSize: 36, color: "#fff" }}>{anno}</div>
    </>
  );
};

const Soldi: React.FC<{ d: number; fine: number }> = ({ d, fine }) => {
  const f = useCurrentFrame();
  if (f < d) return null;
  const v = Math.round(interpolate(f, [d, fine], [10000, 15252], { extrapolateRight: "clamp" }) / 10) * 10;
  return <div style={{ position: "absolute", left: 0, right: 0, top: 520, textAlign: "center", fontFamily: ANTON, fontSize: 190, color: f >= fine ? VERDE : "#fff", WebkitTextStroke: "10px #000", paintOrder: "stroke fill", textShadow: `0 0 60px ${VIOLA}` }}>${v.toLocaleString("it-IT")}</div>;
};

const P6Storia: React.FC<P> = ({ base }) => {
  const r = rel(base);
  return (
    <>
      <SfondoPannello />
      <Tra a={0} b={r(81.79)}>
        <Testata d={r(72.93)}>LO DICE LA STORIA</Testata>
        <Sticker d={r(74.25)} top={410} size={96} bg={BLU} rot={-2}>Biden · 2022</Sticker>
        <Spunta d={r(76.95)} x={330} y={560} testo="PRESIDENZA" />
        <Spunta d={r(77.59)} x={330} y={650} testo="CAMERA" via={r(79.64)} />
        <Spunta d={r(78.06)} x={330} y={740} testo="SENATO" />
        <Segno d={r(79.64)} tipo="cerchio" x={290} y={640} w={380} h={110} col={ROSSO} />
        <Mano d={r(80.6)} x={640} y={830} size={60}>2 anni bloccati</Mano>
      </Tra>
      <Tra a={r(81.79)} b={r(86.88)}>
        <Testata d={r(81.79)}>S&P 500 · BORSA AMERICANA</Testata>
        <Colonna d={r(83.11)} x={220} anno="2023" pct={24} />
        <Colonna d={r(84.83)} x={640} anno="2024" pct={23} />
        <Segno d={r(86.2)} tipo="cerchio" x={140} y={380} w={800} h={540} />
      </Tra>
      <Tra a={r(86.88)}>
        <Testata d={r(86.88)}>SE AVEVI MESSO NELL'S&P 500…</Testata>
        <Soldi d={r(87.93)} fine={r(91.06)} />
        <Mano d={r(87.93)} x={170} y={440} size={52} rot={0}>inizio 2023</Mano>
        <Mano d={r(91.06)} x={560} y={760} size={58}>fine 2024 · così, eh</Mano>
      </Tra>
      <Fonti testo="Rendimenti annuali S&P 500 (prezzo): 2023 +24%, 2024 +23%. Non dividendi né cambio" />
    </>
  );
};

// 20 pallini = le midterm dal 1946 al 2022
const P7Sempre: React.FC<P> = ({ base }) => {
  const r = rel(base);
  const f = useCurrentFrame();
  const anni = Array.from({ length: 20 }, (_, i) => 1946 + i * 4);
  return (
    <>
      <SfondoPannello />
      <Sticker d={r(93.29)} top={360} size={96} bg={VIOLA} rot={-2}>Dal 1946</Sticker>
      {anni.map((a, i) => {
        const d = r(93.42) + i * 3;
        const k = interpolate(f, [d, d + 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <div key={a} style={{ position: "absolute", left: 95 + (i % 10) * 92, top: 540 + Math.floor(i / 10) * 130, width: 70, textAlign: "center", opacity: k, transform: `scale(${k})` }}>
            <div style={{ width: 54, height: 54, margin: "0 auto", borderRadius: 27, background: ACCENTO, boxShadow: `0 0 20px ${ACCENTO}` }} />
            <div style={{ fontFamily: MONO, fontSize: 20, color: "#ffffffaa", marginTop: 6 }}>{String(a).slice(2)}</div>
          </div>
        );
      })}
      <Mano d={r(95.28)} x={120} y={790} size={56} rot={-2}>un anno dopo: Borsa su</Mano>
      <Sticker d={r(98.13)} top={800} size={66} bg={VERDE} rot={4}>quasi sempre</Sticker>
      <Fonti testo="Stovall/CFRA, Deutsche Bank via Reuters; Dave Manuel 21/10/2026. Il passato non garantisce il futuro" />
    </>
  );
};

const P8Occhio: React.FC<P> = ({ base }) => {
  const r = rel(base);
  const f = useCurrentFrame();
  const pesa = interpolate(f, [r(104.73), r(105.5)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <>
      <SfondoPannello />
      <Tra a={0} b={r(103.34)}>
        <Sticker d={r(99.66)} top={380} size={110} bg={ROSSO} rot={-3}>Occhio</Sticker>
        <Mano d={r(100.11)} x={140} y={560} size={64}>non vuol dire che domani sale</Mano>
        <Mano d={r(101.52)} x={180} y={690} size={64} col="#fff">le prossime settimane? un casino</Mano>
      </Tra>
      <Tra a={r(103.34)}>
        <Box d={r(103.51)} x={80} y={440 + pesa * 60} w={420} h={200} bordo={ROSSO}>
          <div style={{ fontSize: 60, lineHeight: 1 }}>1 NOTTE</div>
          <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 34, color: ROSSO }}>di paura</div>
        </Box>
        <Box d={r(104.73)} x={580} y={500 - pesa * 60} w={420} h={260} bordo={VERDE}>
          <div style={{ fontSize: 84, lineHeight: 1 }}>2 ANNI</div>
          <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 40, color: VERDE }}>di calma</div>
        </Box>
        <Mano d={r(106.2)} x={330} y={800} size={62}>due cose diverse</Mano>
      </Tra>
    </>
  );
};

const P9Chi: React.FC<P> = ({ base }) => {
  const r = rel(base);
  return (
    <>
      <SfondoPannello />
      <Box d={r(108.21)} x={60} y={400} w={460} h={300} bordo="#ffffff44">
        <div style={{ fontFamily: MONO, fontSize: 30, color: "#ffffff99" }}>TUTTI</div>
        <div style={{ fontSize: 66, lineHeight: 1.05 }}>CHI HA VINTO?</div>
      </Box>
      <Box d={r(109.93)} x={560} y={400} w={460} h={300}>
        <div style={{ fontFamily: MONO, fontSize: 30, color: ACCENTO }}>IO</div>
        <div style={{ fontSize: 60, lineHeight: 1.05 }}>CHI NON PUÒ PIÙ FARE NIENTE?</div>
      </Box>
      <Segno d={r(110.45)} tipo="cerchio" x={530} y={370} w={520} h={360} />
    </>
  );
};

// ---------- montaggio: format «C al microfono» (Marco 04/11/2026) ----------
// C parla a tutto schermo per tutto il video (InfiniteTalk su Runpod, C-parla.mp4).
// Parole giganti in alto (1-2 alla volta), schede con i dati sopra la scrivania, inquadratura larga/stretta a ogni frase.
const PANNELLI: { a: number; b: number; el: React.FC<P> }[] = [
  { a: 6.85, b: 15.41, el: P1Spiego },
  { a: 15.41, b: 29.71, el: P2Midterm },
  { a: 29.71, b: 36.46, el: P3Diviso },
  { a: 36.46, b: 54.2, el: P4Paura },
  { a: 58.3, b: 71.56, el: P5Calma },
  { a: 71.56, b: 92.48, el: P6Storia },
  { a: 92.48, b: 99.26, el: P7Sempre },
  { a: 99.26, b: 107.06, el: P8Occhio },
  { a: 107.06, b: 110.95, el: P9Chi },
];

export const DURATA_A4 = F(118.72);
const SCHEDA_Y = 690; // i pannelli (disegnati tra y 330 e 960) scendono sopra la scrivania

// C che parla: jump cut a ogni frase (largo / stretto sul volto) e scatto sulle parole forti
const CParla: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inizi = PAROLE_A4.filter((p, i) => i === 0 || PAROLE_A4[i - 1][2] !== p[2]).map((p) => F(p[0]));
  const n = inizi.filter((x) => x <= f).length;
  const stretto = n % 2 === 0 ? 0.16 : 0;
  const e = ENFASI_A4.map(F).filter((p) => p <= f && f - p < 30).pop();
  const scatto = e === undefined ? 0 : 0.12 * molla(f, fps, e, 16, 420) * interpolate(f - e, [22, 30], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const s = 1.02 + stretto + scatto + 0.02 * Math.sin(f / 90);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(`${CARTELLA}/C-parla.mp4`)} muted style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${s})`, transformOrigin: "50% 32%" }} />
    </AbsoluteFill>
  );
};

// Parole giganti stile podcast: 1-2 parole, bianco, la chiave in giallo
const Parolone: React.FC<{ chiave: RegExp }> = ({ chiave }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const viste = PAROLE_A4.filter(([a]) => t >= a);
  if (!viste.length) return null;
  const ult = viste[viste.length - 1];
  const gruppo = PAROLE_A4.filter((p) => p[2] === ult[2]);
  const i = gruppo.indexOf(ult);
  const blocco = gruppo.slice(Math.floor(i / 2) * 2, Math.floor(i / 2) * 2 + 2);
  const a = molla(f, fps, F(blocco[0][0]), 12, 320);
  return (
    <div key={`b${blocco[0][0]}`} style={{ position: "absolute", left: 30, right: 30, top: 150, textAlign: "center", fontFamily: INTER, fontWeight: 900, fontSize: 128, lineHeight: 1.0, letterSpacing: -3, transform: `scale(${0.85 + 0.15 * a})`, textShadow: "0 8px 30px #000c" }}>
      {blocco.map(([s0, p], k) => {
        const detta = t >= s0;
        const giallo = chiave.test(p.toUpperCase());
        return <div key={k} style={{ color: giallo ? "#ffd84d" : "#fff", opacity: detta ? 1 : 0, WebkitTextStroke: "3px #0008", paintOrder: "stroke fill" }}>{p.toLowerCase()}</div>;
      })}
    </div>
  );
};

const Grana4: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none", background: "radial-gradient(ellipse at 50% 40%, transparent 60%, #000a 100%)" }} />
);
const Barra4: React.FC = () => {
  const f = useCurrentFrame();
  return <div style={{ position: "absolute", left: 0, bottom: 0, height: 8, width: `${(f / DURATA_A4) * 100}%`, background: `linear-gradient(90deg,${VIOLA},${ACCENTO})` }} />;
};

// Lampo breve quando entra una nuova scheda
export const Lampo: React.FC = () => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ backgroundColor: "#fff", opacity: interpolate(f, [0, 3], [0.35, 0], { extrapolateRight: "clamp" }), pointerEvents: "none" }} />;
};

const CHIAVE = /^(CONTENTISSIMO|TUBO|MIDTERM|CONGRESSO|DEMOCRATICI|NASDAQ|TOKYO|CIAO|INVECE|GUERRA|ZERO|DOMANI|BIDEN|BLOCCATI|24%|23|15\.000|1946|QUASI|PAURA|CALMA|NIENTE|STADIO|STORIA|NESSUNO)$/;

export const A4MIDTERM: React.FC = () => (
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
    <Sequence from={0} durationInFrames={F(6.85)}>
      <Sticker d={F(2.75)} fino={F(4.4)} top={1250} size={96} bg={ROSSO} rot={-3}>Wall Street ↓</Sticker>
      <Sticker d={F(4.94)} top={1250} size={96} bg={VIOLA} rot={2}>e io? contento</Sticker>
    </Sequence>
    <Sequence from={F(54.2)} durationInFrames={F(58.3) - F(54.2)}>
      <Sticker d={F(56.84) - F(54.2)} top={1250} size={80} bg={VIOLA} rot={-2}>La parte che nessuno ti dice</Sticker>
    </Sequence>
    <Sequence from={F(110.95)} durationInFrames={DURATA_A4 - F(110.95)}>
      <Sticker d={F(114.0) - F(110.95)} top={1250} size={80} bg={VIOLA} rot={-2}>Il tifo lascialo allo stadio</Sticker>
      <Sequence from={F(115.72) - F(110.95)}>
        <div style={{ position: "absolute", left: 60, right: 60, top: 1800, textAlign: "center", fontFamily: MONO, fontSize: 24, color: "#ffffffcc", textShadow: "0 2px 8px #000" }}>Non è un consiglio finanziario. Il passato non garantisce il futuro.</div>
      </Sequence>
    </Sequence>
    <Parolone chiave={CHIAVE} />
    <div style={{ position: "absolute", left: 50, top: 70, fontFamily: MONO, fontSize: 26, color: "#ffffffbb", letterSpacing: 3, textShadow: "0 2px 8px #000" }}>ATTUALITÀ DI C · #4</div>
    <Grana4 />
    <Barra4 />
    <Audio src={staticFile(`${CARTELLA}/voce.wav`)} volume={1} />
    <Audio src={staticFile(`${CARTELLA}/musica.wav`)} volume={0.06} />
    <Audio src={staticFile(`${CARTELLA}/sfx.wav`)} volume={0.35} />
  </AbsoluteFill>
);

// Copertina: C a tutto schermo + titolo stile notizia
export const CoverA4: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: NERO }}>
    <Img src={staticFile(`${CARTELLA}/cover-frame.png`)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 30%" }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #000000cc 0%, transparent 30%, transparent 55%, #000000ee 100%)" }} />
    <div style={{ position: "absolute", left: 60, right: 60, top: 1120, fontFamily: ANTON, fontSize: 124, lineHeight: 1.18, color: "#fff", textTransform: "uppercase", textShadow: "0 8px 30px #000" }}>
      Trump ha perso<br />il <span style={{ background: VIOLA, padding: "0 18px", borderRadius: 14, lineHeight: 1.0, display: "inline-block" }}>Congresso</span>
    </div>
    <div style={{ position: "absolute", left: 60, right: 60, top: 1450, fontFamily: MACCHINA, fontSize: 46, lineHeight: 1.2, color: "#ffd84d", textTransform: "uppercase" }}>e io sono contento:<br />midterm spiegate facili</div>
    <div style={{ position: "absolute", left: 60, top: 300, fontFamily: MONO, fontSize: 34, color: "#ffffffcc", letterSpacing: 4 }}>ATTUALITÀ DI C · #4</div>
  </AbsoluteFill>
);
