// Dentro Algory #11 (04/11/2026): «Non hai paura del curve fitting?» — risposta alla domanda, schermate VERE di Algory.
// Format «C al microfono» (come A4MIDTERM): C parla tutto il video (InfiniteTalk su Runpod), parole giganti in alto,
// schede sopra la scrivania con le schermate della VPS (nome della prop firm già coperto nei PNG: ritagli.py).
// Tempi in secondi della voce (algory11-curve-fitting/montaggio/voce.wav, pause tagliate, ×1,12).
import React from "react";
import { AbsoluteFill, Audio, Easing, Img, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ACCENTO, ANTON, INTER, MACCHINA, MONO, molla, NERO, ROSSO, Sticker, VERDE, VIOLA } from "./FormatC";
import { Box, Lampo, Mano, Segno, Testata, Tra } from "./A4MIDTERM";
import { ENFASI_A11, PAROLE_A11 } from "./algory11-parole";

const CARTELLA = "algory11";
const F = (s: number) => Math.round(s * 30);
const BLU = "#38a8ff";
const ROSSO_ALG = "#ff2d55";

type P = { base: number };
const rel = (base: number) => (s: number) => F(s) - F(base);

// ---------- schermata con inquadratura animata ----------
// keyframe: [frame relativo, cx, cy, scala] = il punto (cx, cy) dell'immagine sta al centro del riquadro.
type K = [number, number, number, number];
const FX = 30, FY = 325, FW = 1020, FH = 620;

const Schermo: React.FC<{ src: string; iw: number; ih: number; k: K[]; d?: number; children?: React.ReactNode }> = ({ src, iw, ih, k, d = 0, children }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = molla(f, fps, d, 14, 220);
  const t = k.map((x) => x[0]);
  const v = (i: number) => (t.length === 1 ? k[0][i] : interpolate(f, t, k.map((x) => x[i]), { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) }));
  const cx = v(1), cy = v(2), s = v(3);
  return (
    <div style={{ position: "absolute", left: FX, top: FY, width: FW, height: FH, borderRadius: 34, overflow: "hidden", background: "#050307", border: `4px solid ${ACCENTO}`, boxShadow: `0 30px 80px #000d, 0 0 50px ${VIOLA}55`, transform: `translateY(${(1 - a) * 80}px) scale(${0.92 + 0.08 * a})`, opacity: Math.min(1, a * 1.5) }}>
      <div style={{ position: "absolute", left: FW / 2 - cx * s, top: FH / 2 - cy * s, width: iw, height: ih, transform: `scale(${s})`, transformOrigin: "0 0" }}>
        <Img src={staticFile(`${CARTELLA}/${src}`)} style={{ width: iw, height: ih, display: "block" }} />
        {children}
      </div>
      <div style={{ position: "absolute", right: 22, bottom: 14, fontFamily: MONO, fontSize: 18, color: "#ffffff88", letterSpacing: 2 }}>ALGORY · SCHERMATA REALE</div>
    </div>
  );
};

// Etichetta dentro l'immagine (coordinate dell'immagine)
const Tag: React.FC<{ d: number; x: number; y: number; col: string; children: React.ReactNode; size?: number }> = ({ d, x, y, col, children, size = 64 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < d) return null;
  const a = molla(f, fps, d, 11, 260);
  return <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${a})`, fontFamily: ANTON, fontSize: size, color: "#fff", background: col, padding: "4px 26px", borderRadius: 14, whiteSpace: "nowrap", boxShadow: `0 10px 40px #000c, 0 0 40px ${col}aa` }}>{children}</div>;
};

// Velo che nasconde i dati mai visti, poi si apre
const Velo: React.FC<{ x: number; y: number; w: number; h: number; apre: number }> = ({ x, y, w, h, apre }) => {
  const f = useCurrentFrame();
  const k = interpolate(f, [apre, apre + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  return (
    <div style={{ position: "absolute", left: x + w * k, top: y, width: w * (1 - k), height: h, background: "repeating-linear-gradient(45deg,#0d0a14,#0d0a14 18px,#15101f 18px,#15101f 36px)", borderLeft: `4px dashed ${ACCENTO}`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
      <div style={{ fontFamily: ANTON, fontSize: 70, color: "#ffffff55", opacity: 1 - k, whiteSpace: "nowrap" }}>🔒 NASCOSTO</div>
    </div>
  );
};

// ---------- immagini: misure ----------
const EQ = { src: "equity.png", iw: 1396, ih: 810 }; // linea allenamento / mai visti a x 966
const ES = { src: "esami.png", iw: 980, ih: 1600 }; // righe: random 982, bad-luck 1018, nearby 1054, edge fading 1196
const VA = { src: "vault.png", iw: 990, ih: 772 };
const CO = { src: "command.png", iw: 1920, ih: 1012 };
const RIGA = { random: 982, sfortuna: 1018, vicine: 1054, salute: 1196 };
// cerchio attorno al valore a destra di una riga del passaporto
const SuValore: React.FC<{ d: number; y: number; col?: string; x?: number; w?: number }> = ({ d, y, col, x = 600, w = 360 }) => <Segno d={d} tipo="cerchio" x={x} y={y - 34} w={w} h={68} col={col} spessore={7} />;

// ---------- pannelli ----------
const PVault: React.FC<P> = ({ base }) => {
  const r = rel(base);
  return (
    <>
      <Schermo {...VA} k={[[0, 495, 330, 1.05], [r(11.8), 495, 520, 1.05]]} />
      <Testata y={270}>IL MIO VAULT · 1.061 BOT</Testata>
    </>
  );
};

const P1Curva: React.FC<P> = ({ base }) => {
  const r = rel(base);
  return (
    <>
      <Testata y={270}>UN BOT SUI GRAFICI VECCHI</Testata>
      <Schermo {...EQ} k={[[0, 520, 470, 1.0], [r(19.0), 560, 420, 0.95], [r(26.0), 698, 405, 0.73]]}>
        <Velo x={966} y={40} w={430} h={720} apre={99999} />
        <Segno d={r(19.36)} tipo="cerchio" x={600} y={280} w={420} h={330} col="#ffd84d" spessore={8} />
        <Tag d={r(19.5)} x={520} y={180} col={VIOLA}>CURVA PERFETTA</Tag>
      </Schermo>
      <Mano d={r(15.24)} x={150} y={960} size={58}>ritocca qui… ritocca là…</Mano>
      <Tra a={r(24.16)}>
        <Sticker d={r(25.36)} top={760} size={66} bg={NERO} rot={-2}>conto vero?</Sticker>
        <Sticker d={r(26.79)} top={840} size={100} bg={ROSSO} rot={4}>Si sfascia 💥</Sticker>
      </Tra>
      <Box d={r(27.4)} x={240} y={430} w={600} h={150} bordo="#ffd84d" fino={r(29.15)}>
        <div style={{ fontSize: 92, color: "#ffd84d" }}>CURVE FITTING</div>
      </Box>
    </>
  );
};

const P2Colpevole: React.FC<P> = ({ base }) => {
  const r = rel(base);
  return (
    <>
      <Box d={0} x={90} y={360} w={900} h={170} bordo="#ffffff44">
        <div style={{ fontFamily: MONO, fontSize: 30, color: "#ffffff99" }}>parto al contrario</div>
        <div style={{ fontSize: 80 }}>OGNI BOT È…</div>
      </Box>
      <Sticker d={r(31.72)} top={590} size={130} bg={ROSSO} rot={-4}>Colpevole</Sticker>
      <Mano d={r(32.4)} x={150} y={800} size={60}>finché non dimostra il contrario</Mano>
    </>
  );
};

const P3Primo: React.FC<P> = ({ base }) => {
  const r = rel(base);
  return (
    <>
      <Testata y={270}>CONTROLLO 1 · DATI MAI VISTI</Testata>
      <Tra a={0} b={r(44.21)}>
        <Schermo {...EQ} k={[[0, 698, 405, 0.73], [r(37.9), 560, 430, 0.85], [r(40.7), 698, 405, 0.73]]}>
          <Velo x={966} y={40} w={430} h={720} apre={r(40.77)} />
          <Tag d={r(38.43)} x={500} y={160} col={ROSSO_ALG} size={70}>ALLENAMENTO · 70%</Tag>
          <Tag d={r(41.11)} x={1180} y={160} col="#1677c9" size={70}>MAI VISTI · 30%</Tag>
          <Segno d={r(43.0)} tipo="cerchio" x={950} y={40} w={450} h={740} col={BLU} spessore={8} />
        </Schermo>
      </Tra>
      <Tra a={r(44.21)}>
        <Schermo {...ES} d={r(44.21)} k={[[r(44.21), 490, 1020, 1.04], [r(51.2), 490, 982, 1.04]]}>
          <SuValore d={r(51.86)} y={RIGA.random} col={VERDE} />
        </Schermo>
        <Box d={r(45.46)} x={250} y={830} w={580} h={120} bordo="#ffd84d" fino={r(51.2)}>
          <div style={{ fontSize: 64 }}>BATTERE <span style={{ color: "#ffd84d" }}>75</span> BOT A CASO SU 100</div>
        </Box>
        <Sticker d={r(50.73)} fino={r(51.2)} top={560} size={120} bg={ROSSO} rot={-6}>Fuori ✗</Sticker>
        <Box d={r(51.86)} x={290} y={830} w={500} h={130} bordo={VERDE}>
          <div style={{ fontSize: 96, color: VERDE }}>98 / 100</div>
        </Box>
      </Tra>
    </>
  );
};

// Cursore che si sposta «di un pelo»
const Cursore: React.FC<{ d: number; y: number; nome: string; spinta: number }> = ({ d, y, nome, spinta }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < d) return null;
  const a = molla(f, fps, d, 13, 240);
  const dx = 46 * Math.sin(Math.max(0, f - spinta) / 5) * interpolate(f, [spinta, spinta + 40], [1, 0.4], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * (f >= spinta ? 1 : 0);
  return (
    <div style={{ position: "absolute", left: 90, top: y, width: 900, height: 120, opacity: a, transform: `translateX(${(1 - a) * -80}px)` }}>
      <div style={{ fontFamily: ANTON, fontSize: 56, color: "#fff", position: "absolute", left: 0, top: 26 }}>{nome}</div>
      <div style={{ position: "absolute", left: 300, right: 0, top: 56, height: 10, borderRadius: 5, background: "#ffffff30" }} />
      <div style={{ position: "absolute", left: 590 + dx, top: 34, width: 54, height: 54, borderRadius: 27, background: ACCENTO, boxShadow: `0 0 30px ${ACCENTO}` }} />
    </div>
  );
};

const P4Parametri: React.FC<P> = ({ base }) => {
  const r = rel(base);
  return (
    <>
      <Testata y={270}>CONTROLLO 2 · IMPOSTAZIONI SPOSTATE</Testata>
      <Tra a={0} b={r(64.88)}>
        <div style={{ position: "absolute", left: 30, top: 325, width: 1020, height: 620, borderRadius: 34, background: "#0b0a10e8", border: `3px solid ${ACCENTO}66` }} />
        <Cursore d={r(57.86)} y={370} nome="STOP" spinta={r(59.74)} />
        <Cursore d={r(58.4)} y={500} nome="TARGET" spinta={r(59.9)} />
        <Cursore d={r(59.07)} y={630} nome="FILTRI" spinta={r(60.06)} />
        <Mano d={r(60.3)} x={560} y={300} size={54}>di un pelo</Mano>
        <Mano d={r(61.6)} x={100} y={790} size={54} col="#fff">sta in piedi solo coi numeri precisi?</Mano>
        <Sticker d={r(64.25)} top={850} size={70} bg={ROSSO} rot={-3}>era un caso</Sticker>
      </Tra>
      <Tra a={r(64.88)}>
        <Schermo {...ES} d={r(64.88)} k={[[r(64.88), 490, 1054, 1.04]]}>
          <SuValore d={r(65.72)} y={RIGA.vicine} col={VERDE} />
        </Schermo>
        <Box d={r(65.72)} x={290} y={830} w={500} h={130} bordo={VERDE}>
          <div style={{ fontSize: 96, color: VERDE }}>7 SU 7</div>
        </Box>
      </Tra>
    </>
  );
};

// 12 trade (verdi su, rossi giù) che si rimescolano; poi le perdite tutte in fila
const TRADE = [3, -2, 4, 2, -3, 5, -1, 3, -2, 4, -3, 2];
const Rimescola: React.FC<{ d: number; fino: number; fila: number }> = ({ d, fino, fila }) => {
  const f = useCurrentFrame();
  if (f < d) return null;
  const giro = Math.floor((Math.min(f, fino) - d) / 3);
  const ordine = TRADE.map((_, i) => i).sort((a, b) => ((a * 7 + giro * 13) % 12) - ((b * 7 + giro * 13) % 12));
  const finale = f >= fila ? [...TRADE.map((_, i) => i)].sort((a, b) => TRADE[a] - TRADE[b]) : ordine;
  const n = Math.min(1000, Math.round(interpolate(f, [d, fino], [0, 1000], { extrapolateRight: "clamp" })));
  return (
    <>
      <div style={{ position: "absolute", left: 30, top: 325, width: 1020, height: 620, borderRadius: 34, background: "#0b0a10e8", border: `3px solid ${ACCENTO}66` }} />
      {finale.map((idx, pos) => {
        const v = TRADE[idx];
        const h = Math.abs(v) * 42;
        return <div key={idx} style={{ position: "absolute", left: 95 + pos * 76, top: v > 0 ? 640 - h : 640, width: 56, height: h, borderRadius: 8, background: v > 0 ? VERDE : ROSSO, boxShadow: `0 0 20px ${v > 0 ? VERDE : ROSSO}88`, transition: "none" }} />;
      })}
      <div style={{ position: "absolute", left: 60, right: 60, top: 640, height: 3, background: "#ffffff55" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 360, textAlign: "center", fontFamily: ANTON, fontSize: 80, color: "#fff" }}>{n.toLocaleString("it-IT")} <span style={{ fontFamily: MONO, fontSize: 30, color: "#ffffff99" }}>rimescolamenti</span></div>
    </>
  );
};

const P5Rimescola: React.FC<P> = ({ base }) => {
  const r = rel(base);
  return (
    <>
      <Testata y={270}>CONTROLLO 3 · 1.000 RIMESCOLAMENTI</Testata>
      <Tra a={0} b={r(75.61)}>
        <Rimescola d={r(68.0)} fino={r(71.0)} fila={r(74.67)} />
        <Mano d={r(72.02)} x={110} y={820} size={54}>le perdite mica arrivano in fila…</Mano>
        <Sticker d={r(74.67)} top={540} size={78} bg={ROSSO} rot={-3}>tutte insieme</Sticker>
      </Tra>
      <Tra a={r(75.61)}>
        <Schermo {...ES} d={r(75.61)} k={[[r(75.61), 490, 1018, 1.04]]}>
          <SuValore d={r(76.95)} y={RIGA.sfortuna} col={ROSSO} />
        </Schermo>
        <Box d={r(76.95)} x={190} y={830} w={700} h={130} bordo={ROSSO}>
          <div style={{ fontFamily: MONO, fontSize: 26, color: "#ffffff99" }}>drawdown nel caso sfortunato</div>
          <div style={{ fontSize: 60, color: ROSSO }}>TROPPO GROSSO? FUORI</div>
        </Box>
        <Sticker d={r(78.6)} top={760} size={110} bg={VIOLA} rot={-6}>Ciao 👋</Sticker>
      </Tra>
    </>
  );
};

const P6Onesta: React.FC<P> = ({ base }) => {
  const r = rel(base);
  return (
    <>
      <Tra a={0} b={r(85.47)}>
        <Testata y={270}>LA COSA ONESTA</Testata>
        <Box d={r(80.53)} x={90} y={360} w={900} h={190}>
          <div style={{ fontFamily: MONO, fontSize: 30, color: "#ffffff99" }}>anche i bot che passano tutto</div>
          <div style={{ fontSize: 80 }}>PRIMA O POI SI FERMANO</div>
        </Box>
        <Sticker d={r(84.45)} top={640} size={100} bg={ROSSO} rot={-3}>Il mercato cambia</Sticker>
      </Tra>
      <Tra a={r(85.47)}>
        <Testata y={270}>CONTROLLO SUI DATI NUOVI</Testata>
        <Schermo {...ES} d={r(85.47)} k={[[r(85.47), 490, 1170, 1.04], [r(88.8), 490, 1196, 1.04]]}>
          <SuValore d={r(86.13)} y={RIGA.salute} col={ROSSO} x={520} w={440} />
        </Schermo>
        <Box d={r(86.71)} x={90} y={830} w={900} h={130} bordo={ROSSO}>
          <div style={{ fontSize: 54 }}>EDGE FADING = <span style={{ color: ROSSO }}>SI STA SPEGNENDO</span></div>
        </Box>
        <Sticker d={r(93.5)} top={720} size={100} bg={VIOLA} rot={3}>Sostituito ↻</Sticker>
      </Tra>
    </>
  );
};

const P7Cta: React.FC<P> = ({ base }) => {
  const r = rel(base);
  return (
    <>
      <Schermo {...CO} k={[[0, 265, 37, 1.7], [r(95.6), 265, 37, 1.7], [r(96.6), 960, 506, 0.55]]} />
      <Tra a={r(96.61)}>
        <Sticker d={r(96.61)} top={340} size={96} bg={VIOLA} rot={-3}>Link in bio 👆</Sticker>
      </Tra>
      <Box d={r(97.6)} x={150} y={520} w={780} h={260} bordo="#ffd84d" bg="#1a1530">
        <div style={{ fontFamily: MONO, fontSize: 30, color: "#ffffffaa" }}>codice</div>
        <div style={{ fontSize: 130, color: "#ffd84d", lineHeight: 1 }}>STANGA50</div>
        <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 36 }}>−50% sul primo pagamento</div>
      </Box>
      <Mano d={r(101.16)} x={330} y={820} size={58}>e si parte anche gratis</Mano>
    </>
  );
};

const PANNELLI: { a: number; b: number; el: React.FC<P> }[] = [
  { a: 8.23, b: 11.81, el: PVault },
  { a: 11.81, b: 29.16, el: P1Curva },
  { a: 29.16, b: 34.36, el: P2Colpevole },
  { a: 34.36, b: 53.19, el: P3Primo },
  { a: 56.33, b: 67.2, el: P4Parametri },
  { a: 67.2, b: 79.16, el: P5Rimescola },
  { a: 79.16, b: 94.31, el: P6Onesta },
  { a: 94.31, b: 102.55, el: P7Cta },
];

export const DURATA_A11 = F(110.6);
const SCHEDA_Y = 690;

// ---------- C che parla ----------
const CParla: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inizi = PAROLE_A11.filter((p, i) => i === 0 || PAROLE_A11[i - 1][2] !== p[2]).map((p) => F(p[0]));
  const n = inizi.filter((x) => x <= f).length;
  const stretto = n % 2 === 0 ? 0.16 : 0;
  const e = ENFASI_A11.map(F).filter((p) => p <= f && f - p < 30).pop();
  const scatto = e === undefined ? 0 : 0.12 * molla(f, fps, e, 16, 420) * interpolate(f - e, [22, 30], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const s = 1.02 + stretto + scatto + 0.02 * Math.sin(f / 90);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(`${CARTELLA}/C-parla.mp4`)} muted style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${s})`, transformOrigin: "50% 32%" }} />
    </AbsoluteFill>
  );
};

const CHIAVE = /^(LA|PERFETTA|SFASCIA|FITTING|COLPEVOLE|INNOCENTE|ROSSA|BLU|70%|30|75|98|FUORI|NESSUNO|PELO|CASO|7|MILLE|INSIEME|CIAO|ONESTA|FADING|SOSTITUISCO|ALGORY|BIO|STANGA50|METÀ|GRATIS|VISTO)$/;

// Parole giganti: 1-2 alla volta, bianco, la chiave in giallo (chiavi React per indice: niente parole fantasma)
const Parolone: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const viste = PAROLE_A11.filter(([a]) => t >= a);
  if (!viste.length) return null;
  const ult = viste[viste.length - 1];
  const gruppo = PAROLE_A11.filter((p) => p[2] === ult[2]);
  const i = gruppo.indexOf(ult);
  const blocco = gruppo.slice(Math.floor(i / 2) * 2, Math.floor(i / 2) * 2 + 2);
  const a = molla(f, fps, F(blocco[0][0]), 12, 320);
  return (
    <div style={{ position: "absolute", left: 30, right: 30, top: 150, textAlign: "center", fontFamily: INTER, fontWeight: 900, fontSize: 128, lineHeight: 1.0, letterSpacing: -3, transform: `scale(${0.85 + 0.15 * a})`, textShadow: "0 8px 30px #000c" }}>
      {blocco.map(([s0, p], k) => {
        const giallo = CHIAVE.test(p.toUpperCase());
        const testo = /STANGA|ALGORY/i.test(p) ? p.toUpperCase() : p.toLowerCase();
        return <div key={k} style={{ color: giallo ? "#ffd84d" : "#fff", opacity: t >= s0 ? 1 : 0, WebkitTextStroke: "3px #0008", paintOrder: "stroke fill" }}>{testo}</div>;
      })}
    </div>
  );
};

// La domanda (nessun nome utente: non è un commento vero, è la domanda che arriva più spesso)
const Domanda: React.FC<{ d: number }> = ({ d }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < d) return null;
  const a = molla(f, fps, d, 12, 220);
  return (
    <div style={{ position: "absolute", left: 70, right: 70, top: 1180, transform: `scale(${0.6 + 0.4 * a}) rotate(${-2 * a}deg)`, opacity: Math.min(1, a * 1.5) }}>
      <div style={{ background: "#fff", borderRadius: 34, padding: "28px 36px", boxShadow: "0 24px 70px #000c", display: "flex", gap: 24, alignItems: "center" }}>
        <div style={{ width: 84, height: 84, borderRadius: 42, background: `linear-gradient(135deg, ${VIOLA}, ${ACCENTO})`, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: ANTON, fontSize: 52, color: "#fff" }}>?</div>
        <div>
          <div style={{ fontFamily: MONO, fontSize: 24, color: "#777", marginBottom: 6 }}>la domanda che mi fate di più</div>
          <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 46, color: "#111", lineHeight: 1.15 }}>«C, ma i tuoi bot non sono solo adattati al passato?»</div>
        </div>
      </div>
    </div>
  );
};

const Grana: React.FC = () => <AbsoluteFill style={{ pointerEvents: "none", background: "radial-gradient(ellipse at 50% 40%, transparent 60%, #000a 100%)" }} />;
const Barra: React.FC = () => {
  const f = useCurrentFrame();
  return <div style={{ position: "absolute", left: 0, bottom: 0, height: 8, width: `${(f / DURATA_A11) * 100}%`, background: `linear-gradient(90deg,${VIOLA},${ACCENTO})` }} />;
};

export const ALGORY11: React.FC = () => (
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
    <Sequence from={0} durationInFrames={F(8.23)}>
      <Domanda d={F(2.2)} />
      <Sticker d={F(5.38)} top={1560} size={84} bg={VIOLA} rot={3}>Domanda giustissima</Sticker>
    </Sequence>
    <Sequence from={F(53.19)} durationInFrames={F(56.33) - F(53.19)}>
      <Sticker d={0} top={1150} size={110} bg={VIOLA} rot={-3}>Secondo</Sticker>
      <Sticker d={F(54.86) - F(53.19)} top={1320} size={78} bg={NERO} rot={2}>la parte che nessuno ti dice</Sticker>
    </Sequence>
    <Sequence from={F(102.55)} durationInFrames={DURATA_A11 - F(102.55)}>
      <div style={{ position: "absolute", left: 70, right: 70, top: 1300, textAlign: "center", fontFamily: ANTON, fontSize: 54, color: "#fff", textShadow: "0 6px 20px #000" }}>
        Nessun test garantisce niente.<br /><span style={{ color: "#ffd84d" }}>Ti dice quanto ha retto su dati mai visti.</span>
      </div>
      <div style={{ position: "absolute", left: 60, right: 60, top: 1760, textAlign: "center", fontFamily: MONO, fontSize: 24, color: "#ffffffdd", textShadow: "0 2px 8px #000", lineHeight: 1.4 }}>
        #ad · link affiliato · Non è un consiglio finanziario.<br />Il trading comporta un alto rischio di perdita. I backtest non garantiscono risultati futuri.
      </div>
    </Sequence>
    <Parolone />
    <div style={{ position: "absolute", left: 50, top: 70, fontFamily: MONO, fontSize: 26, color: "#ffffffbb", letterSpacing: 3, textShadow: "0 2px 8px #000" }}>DENTRO ALGORY · #11 · #ad</div>
    <Grana />
    <Barra />
    <Audio src={staticFile(`${CARTELLA}/voce.wav`)} volume={1} />
    <Audio src={staticFile(`${CARTELLA}/sfx.wav`)} volume={0.35} />
  </AbsoluteFill>
);

// Copertina: fotogramma di C + titolo stile notizia
export const CoverA11: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: NERO }}>
    <Img src={staticFile(`${CARTELLA}/cover-frame.png`)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 30%" }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #000000cc 0%, transparent 30%, transparent 55%, #000000ee 100%)" }} />
    <div style={{ position: "absolute", left: 60, right: 60, top: 1100, fontFamily: ANTON, fontSize: 124, lineHeight: 1.18, color: "#fff", textTransform: "uppercase", textShadow: "0 8px 30px #000" }}>
      Il tuo bot è<br />solo <span style={{ background: VIOLA, padding: "0 18px", borderRadius: 14, lineHeight: 1.0, display: "inline-block" }}>fortuna?</span>
    </div>
    <div style={{ position: "absolute", left: 60, right: 60, top: 1430, fontFamily: MACCHINA, fontSize: 46, lineHeight: 1.2, color: "#ffd84d", textTransform: "uppercase" }}>i 3 test che faccio<br />prima del conto vero</div>
    <div style={{ position: "absolute", left: 60, top: 300, fontFamily: MONO, fontSize: 34, color: "#ffffffcc", letterSpacing: 4 }}>DENTRO ALGORY · #11</div>
  </AbsoluteFill>
);
