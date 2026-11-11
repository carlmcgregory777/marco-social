// YouTube L0 «presentazione» (04/11/2026): 16:9, ~11:40. Stile Mik Cosentino + storia vera di Marco raccontata da C.
// Base: labiale InfiniteTalk (media su [M] e [I], larga su [L]), clip di interazione Seedance, grafiche [G] a tutto schermo.
// Sopra: numero e titolo della lezione (solo a schermo), parole chiave in basso, schede ai lati (C è al centro).
// Tutti i tempi sono secondi di voce.wav (youtube/L0-presentazione/montaggio), dati in l0-dati.ts.
import React from "react";
import { AbsoluteFill, Audio, Easing, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ACCENTO, ANTON, INTER, MANO, MONO, molla, NERO, ROSSO, VERDE, VIOLA } from "./FormatC";
import { LAB, SEG, T } from "./l0-dati";

const C = "l0";
const F = (s: number) => Math.round(s * 30);
const GIALLO = "#ffd84d";
const FINE_VOCE = 686.0;
export const DURATA_L0 = F(FINE_VOCE + 12);
const CLIP_S = 6.5;
const cl = (x: number) => Math.max(0, Math.min(1, x));
const ramp = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

// ---------------- base: C che parla ----------------
const trova = (inq: string, t: number) => {
  for (const L of LAB) if (L.inq === inq) for (const p of L.pezzi) if (t >= p.a - 0.01 && t < p.b) return { file: L.file.replace("labiale/", "").replace(".wav", ".mp4"), off: p.off + (t - p.a) };
  return null;
};

// tagli alla Mik: dentro un segmento medio alterno inquadratura normale e stretta ogni ~7 s
const Parla: React.FC<{ inq: string; a: number; b: number; idx: number }> = ({ inq, a, b, idx }) => {
  const f = useCurrentFrame();
  const x = trova(inq, a);
  if (!x) return <AbsoluteFill style={{ background: NERO }} />;
  const dur = b - a;
  const pezzi = Math.max(1, Math.round(dur / 7));
  const k = Math.min(pezzi - 1, Math.floor((f / 30 / dur) * pezzi));
  const stretto = inq === "medio" ? (k + idx) % 2 === 1 : k % 2 === 1;
  const s = (inq === "medio" ? (stretto ? 1.32 : 1.04) : stretto ? 1.18 : 1.0) + 0.03 * (f / 30 / Math.max(1, dur));
  const o = inq === "medio" ? "50% 24%" : "50% 22%";
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: NERO }}>
      <OffthreadVideo src={staticFile(`${C}/${x.file}`)} startFrom={F(x.off)} muted style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${s})`, transformOrigin: o }} />
    </AbsoluteFill>
  );
};

// logo sul portatile coperto dal marchio MS (tempi e posizioni misurati sui fotogrammi del clip, 1280×704)
const MarchioPortatile: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / 30;
  if (t < 2.5) return null;
  const k: [number, number, number][] = [[2.5, 615, 482], [2.6, 615, 475], [2.8, 625, 400], [3.0, 630, 435], [3.2, 635, 445], [3.4, 645, 445], [3.6, 635, 445], [9, 637, 445]];
  const ts = k.map((q) => q[0]);
  const x = interpolate(t, ts, k.map((q) => q[1]), { extrapolateRight: "clamp" });
  const y = interpolate(t, ts, k.map((q) => q[2]), { extrapolateRight: "clamp" });
  const sc = 1920 / 1280 > 1080 / 704 ? 1920 / 1280 : 1080 / 704;
  const ox = (1920 - 1280 * sc) / 2;
  return <div style={{ position: "absolute", left: x * sc + ox - 48, top: y * sc - 48, width: 96, height: 96, borderRadius: 48, background: `radial-gradient(circle at 35% 30%, ${ACCENTO}, ${VIOLA})`, boxShadow: "0 2px 10px #0008", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: ANTON, fontSize: 40, color: "#fff" }}>MS</div>;
};

const Interazione: React.FC<{ nome: string; a: number; b: number; idx: number }> = ({ nome, a, b, idx }) => {
  const clip = Math.min(CLIP_S, b - a);
  return (
    <>
      <Sequence durationInFrames={F(clip)}>
        <AbsoluteFill style={{ overflow: "hidden" }}>
          <OffthreadVideo src={staticFile(`${C}/i-${nome}.mp4`)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          {nome === "portatile" && <MarchioPortatile />}
        </AbsoluteFill>
      </Sequence>
      {b - a > clip + 0.2 && (
        <Sequence from={F(clip)}>
          <Parla inq="medio" a={a + clip} b={b} idx={idx} />
        </Sequence>
      )}
    </>
  );
};

// ---------------- pezzi di grafica comuni ----------------
const Sfondo: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 30%, #1d1640 0%, ${NERO} 70%)`, overflow: "hidden" }}>
    <AbsoluteFill style={{ backgroundImage: "linear-gradient(#ffffff08 1px, transparent 1px), linear-gradient(90deg, #ffffff08 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
    {children}
  </AbsoluteFill>
);

// elemento che entra con la molla a un istante assoluto (secondi)
const Pop: React.FC<{ t: number; fino?: number; x: number; y: number; w?: number; children: React.ReactNode; rot?: number; da?: "su" | "giu" | "sx" | "dx" | "zoom" }> = ({ t, fino, x, y, w, children, rot = 0, da = "zoom" }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < F(t) || (fino !== undefined && f >= F(fino))) return null;
  const a = molla(f, fps, F(t), 13, 230);
  const uscita = fino === undefined ? 1 : 1 - ramp(f, F(fino) - 6, F(fino));
  const tr = { su: `translateY(${(1 - a) * 80}px)`, giu: `translateY(${(1 - a) * -80}px)`, sx: `translateX(${(1 - a) * -200}px)`, dx: `translateX(${(1 - a) * 200}px)`, zoom: `scale(${0.4 + 0.6 * a})` }[da];
  return <div style={{ position: "absolute", left: x, top: y, width: w, transform: `${tr} rotate(${rot}deg)`, opacity: Math.min(1, a * 1.8) * uscita, transformOrigin: "50% 50%" }}>{children}</div>;
};

const Scheda: React.FC<{ children: React.ReactNode; bordo?: string; bg?: string; pad?: string; style?: React.CSSProperties }> = ({ children, bordo = ACCENTO, bg = "#120f22ee", pad = "22px 30px", style }) => (
  <div style={{ background: bg, border: `3px solid ${bordo}`, borderRadius: 22, padding: pad, boxShadow: `0 20px 60px #000c, 0 0 30px ${bordo}33`, color: "#fff", fontFamily: INTER, ...style }}>{children}</div>
);

const Titolo: React.FC<{ children: React.ReactNode; size?: number; col?: string; style?: React.CSSProperties }> = ({ children, size = 90, col = "#fff", style }) => (
  <div style={{ fontFamily: ANTON, fontSize: size, color: col, lineHeight: 1.05, textTransform: "uppercase", textShadow: "0 6px 24px #000c", ...style }}>{children}</div>
);

const Timbro: React.FC<{ t: number; x: number; y: number; testo: string; col?: string; rot?: number; size?: number }> = ({ t, x, y, testo, col = ROSSO, rot = -12, size = 64 }) => {
  const f = useCurrentFrame();
  if (f < F(t)) return null;
  const a = interpolate(f, [F(t), F(t) + 6], [2.2, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  return <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${a})`, opacity: cl((f - F(t)) / 3), fontFamily: ANTON, fontSize: size, color: col, border: `7px solid ${col}`, borderRadius: 14, padding: "2px 24px", whiteSpace: "nowrap", textShadow: "0 0 1px #000", background: "#0b0a1088" }}>{testo}</div>;
};

const Barrato: React.FC<{ t: number; w: number }> = ({ t, w }) => {
  const f = useCurrentFrame();
  const p = ramp(f, F(t), F(t) + 8);
  return <div style={{ position: "absolute", left: -10, top: "50%", height: 8, width: (w + 20) * p, background: ROSSO, borderRadius: 4, transform: "rotate(-3deg)" }} />;
};

const Notifica: React.FC<{ icona: string; titolo: string; testo: string; col?: string }> = ({ icona, titolo, testo, col = VERDE }) => (
  <div style={{ display: "flex", gap: 22, alignItems: "center", background: "#f4f3f8", borderRadius: 30, padding: "22px 30px", boxShadow: "0 24px 70px #000c", width: 620 }}>
    <div style={{ width: 78, height: 78, borderRadius: 20, background: col, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44, flexShrink: 0 }}>{icona}</div>
    <div style={{ fontFamily: INTER }}>
      <div style={{ fontWeight: 800, fontSize: 32, color: "#111" }}>{titolo}</div>
      <div style={{ fontSize: 26, color: "#555", marginTop: 2 }}>{testo}</div>
    </div>
  </div>
);

// ---------------- lezioni: numero gigante che entra e poi resta nell'angolo ----------------
const BLOCCHI: Record<number, string> = { 1: "COME NON INIZIARE", 4: "QUANDO ARRIVANO LE PROP FIRM", 7: "LA SVOLTA", 10: "COME LAVORIAMO OGGI" };
const BLOCCO_DI = (n: number) => BLOCCHI[n - ((n - 1) % 3)];
const LEZ = (() => {
  const out: { n: number; titolo: string; a: number; b: number }[] = [];
  for (const s of SEG) if (s[2] && (!out.length || out[out.length - 1].n !== s[2])) out.push({ n: s[2], titolo: s[3], a: s[4], b: 0 });
  out.forEach((l, i) => (l.b = i + 1 < out.length ? out[i + 1].a : T.cPrimo));
  return out;
})();

const Lezione: React.FC<{ n: number; titolo: string; a: number; b: number }> = ({ n, titolo, a, b }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t0 = F(a), t1 = F(b);
  if (f < t0 || f >= t1) return null;
  const ent = molla(f, fps, t0, 14, 200);
  const rid = molla(f, fps, t0 + 75, 16, 160); // dopo 2,5 s va nell'angolo
  const big = 1 - rid;
  const nuovoBlocco = n % 3 === 1;
  const uscita = 1 - ramp(f, t1 - 8, t1);
  return (
    <>
      {big > 0.02 && <AbsoluteFill style={{ background: `linear-gradient(90deg, #0b0a10ee 0%, #0b0a10aa 45%, transparent 75%)`, opacity: big * Math.min(1, ent * 1.5) }} />}
      <div style={{ position: "absolute", left: interpolate(rid, [0, 1], [110, 40]), top: interpolate(rid, [0, 1], [230, 34]), transform: `scale(${interpolate(rid, [0, 1], [1, 0.3])})`, transformOrigin: "0 0", opacity: uscita }}>
        {nuovoBlocco && big > 0.05 && <div style={{ fontFamily: MONO, fontSize: 34, letterSpacing: 6, color: ACCENTO, opacity: big, marginBottom: 6 }}>BLOCCO {Math.ceil(n / 3)} · {BLOCCO_DI(n)}</div>}
        <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
          <div style={{ fontFamily: ANTON, fontSize: 300, lineHeight: 0.9, color: GIALLO, transform: `translateX(${(1 - ent) * -300}px)`, textShadow: "0 10px 40px #000c" }}>{n}</div>
          <div style={{ fontFamily: ANTON, fontSize: 92, lineHeight: 1.02, color: "#fff", maxWidth: 900, textTransform: "uppercase", opacity: ent, textShadow: "0 6px 24px #000c" }}>{titolo}</div>
        </div>
      </div>
    </>
  );
};

// ---------------- parole chiave in basso (stile Mik) ----------------
type KW = [number, string, string?, number?];
const K: KW[] = [
  [T.c500, "-500 €", ROSSO], [T.cDieci, "10 ANNI"], [T.cStress, "MENO STRESS"], [T.cGrafico, "NIENTE GRAFICO TUTTO IL GIORNO", undefined, 2.4],
  [T.cAI, "PERSONAGGIO AI"], [T.cMarco, "DIETRO C'È MARCO", GIALLO],
  [T.cAnche, "«ANCHE TU PUOI»"], [T.cGenio, "MI SENTIVO UN GENIO"], [T.cIngiust, "«È UN'INGIUSTIZIA»", ROSSO],
  [T.cChiuso, "MERCATO CHIUSO…"], [T.cMondo, "…IL MONDO NO", GIALLO], [T.cNonTutto, "IL GRAFICO NON È TUTTO", GIALLO, 2.6],
  [T.cMatem, "MATEMATICA, NON INDOVINARE", GIALLO, 2.6], [T.cRispettarle, "SAPERLE ≠ RISPETTARLE", GIALLO, 3.2],
  [T.cStringe, "«IL TEMPO STRINGE»", ROSSO], [T.cGratta, "UN GRATTA E VINCI", ROSSO, 2.6],
  [T.cIo, "IL PROBLEMA ERO IO", GIALLO, 3], [T.cNonVivere, "SOPRAVVIVERE ≠ VIVERE DI TRADING", undefined, 3],
  [T.cIoNo, "IO NO.", GIALLO, 2], [T.cOgg, "OGGETTIVO", GIALLO, 2.5], [T.cNiente, "NIENTE «SECONDO ME»"],
  [T.cMia, "UNA STRATEGIA MIA", GIALLO], [T.cMezzo, "POSSO TOGLIERMI DI MEZZO?", GIALLO, 3.2],
  [T.cAnniV, "ANNI", ROSSO], [T.cProgr, "ROBA DA PROGRAMMATORI"], [T.cFuori, "SE NON LO PASSA: FUORI", ROSSO, 2.5],
  [T.cSiPerde, "SI PERDE ANCHE COSÌ", ROSSO, 2.6], [T.cRegola, "UNA REGOLA, NON UN'EMOZIONE", GIALLO, 3],
  [T.cCommunity, "COMMUNITY", GIALLO], [T.cServono, "REGOLE CHE NON SI INTERPRETANO", GIALLO, 3.4], [T.cNonPiu, "OGGI NON PIÙ.", GIALLO, 3],
];
const ParolaChiave: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / 30;
  const k = [...K].reverse().find((x) => t >= x[0] && t < x[0] + (x[3] ?? 2.2));
  if (!k) return null;
  const a = molla(f, fps, F(k[0]), 11, 300);
  const fine = 1 - ramp(f, F(k[0] + (k[3] ?? 2.2)) - 5, F(k[0] + (k[3] ?? 2.2)));
  const col = k[2] ?? "#fff";
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 70, display: "flex", justifyContent: "center", opacity: fine }}>
      <div style={{ fontFamily: ANTON, fontSize: 88, color: col === "#fff" ? "#111" : "#111", background: col, padding: "4px 34px", borderRadius: 16, transform: `scale(${0.5 + 0.5 * a}) rotate(${(1 - a) * -6}deg)`, boxShadow: "0 16px 50px #000c", whiteSpace: "nowrap" }}>{k[1]}</div>
    </div>
  );
};

// ---------------- schede sopra C che parla (sempre ai lati: C sta al centro) ----------------
const SX = 70, DX = 1270;
const Chip: React.FC<{ t: number; fino?: number; x: number; y: number; testo: string; col?: string; sotto?: string }> = ({ t, fino, x, y, testo, col = ACCENTO, sotto }) => (
  <Pop t={t} fino={fino} x={x} y={y} da={x < 900 ? "sx" : "dx"}>
    <Scheda bordo={col} pad="12px 28px"><div style={{ fontFamily: ANTON, fontSize: 52, textTransform: "uppercase", whiteSpace: "nowrap" }}>{testo}</div>{sotto && <div style={{ fontFamily: MONO, fontSize: 22, color: "#ffffffaa" }}>{sotto}</div>}</Scheda>
  </Pop>
);

const Schede: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / 30;
  return (
    <>
      {/* gancio: i metodi provati */}
      {[["ANALISI TECNICA", T.cAT], ["VOLUMETRICA", T.cVol], ["ORDER FLOW", T.cOF], ["QUARTILI", T.cQuart], ["ALGO + INDUCEMENT", T.cInd]].map(([s, tt], i) => (
        <Chip key={i} t={tt as number} fino={T.cOggi} x={i % 2 ? DX : SX} y={190 + i * 130} testo={s as string} />
      ))}
      {t > T.cTutto && t < T.cOggi && <Timbro t={T.cTutto} x={960} y={520} testo="PROVATI TUTTI" col={GIALLO} size={80} />}
      {/* mappa del video */}
      <Pop t={T.cDodici} fino={T.cNonVera} x={SX} y={150} da="sx">
        <Scheda pad="26px 34px" style={{ width: 520 }}>
          <div style={{ fontFamily: MONO, fontSize: 24, color: ACCENTO, letterSpacing: 3 }}>IN QUESTO VIDEO</div>
          {["1-3 · COME NON INIZIARE", "4-6 · LE PROP FIRM", "7-9 · LA SVOLTA", "10-12 · COME LAVORO OGGI"].map((r, i) => (
            <div key={i} style={{ fontFamily: ANTON, fontSize: 46, marginTop: 10, opacity: cl((f - F(T.cDodici) - 8 * i) / 6) }}>{r}</div>
          ))}
        </Scheda>
      </Pop>
      {/* chi parla */}
      <Pop t={T.cMiChiamo} fino={T.cMarco} x={SX} y={720} da="sx">
        <Scheda pad="16px 30px"><div style={{ fontFamily: ANTON, fontSize: 70 }}>C</div><div style={{ fontFamily: MONO, fontSize: 24, color: "#ffffffbb" }}>personaggio AI · caschetto viola · baffi</div></Scheda>
      </Pop>
      <Pop t={T.cLoSo} fino={T.cMarco} x={DX + 80} y={300}><div style={{ fontFamily: MANO, fontSize: 80, color: GIALLO, transform: "rotate(6deg)", textShadow: "0 4px 14px #000" }}>lo so, lo so…</div></Pop>
      <Pop t={T.cQuinte} fino={T.c1} x={DX} y={690} da="dx">
        <Scheda bordo={GIALLO} pad="16px 30px"><div style={{ fontFamily: ANTON, fontSize: 60 }}>LA STORIA È DI MARCO</div><div style={{ fontFamily: MONO, fontSize: 24, color: "#ffffffbb" }}>100% vera · lui sta dietro le quinte</div></Scheda>
      </Pop>
      {/* N1: la pubblicità */}
      <Pop t={T.cPub} fino={T.cCasco + 0.3} x={DX} y={200} da="dx" rot={3}>
        <div style={{ width: 520, borderRadius: 26, overflow: "hidden", background: "#fff", boxShadow: "0 24px 70px #000c" }}>
          <div style={{ height: 300, background: "linear-gradient(135deg,#ff9a3c,#ff3c7a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 150 }}>🏎️🌴</div>
          <div style={{ padding: "18px 24px", fontFamily: INTER, fontWeight: 800, fontSize: 40, color: "#111" }}>Anche tu puoi! 💸</div>
          <div style={{ padding: "0 24px 20px", fontFamily: MONO, fontSize: 20, color: "#888" }}>Sponsorizzato</div>
        </div>
      </Pop>
      <Pop t={T.c80} fino={T.cPeggiore} x={DX - 60} y={140} da="giu"><Notifica icona="💶" titolo="+80,00 €" testo="in 1 ora · leva altissima" /></Pop>
      {/* N2 */}
      <Chip t={T.cVenerdi} fino={T.cChiuso} x={SX} y={220} testo="VENERDÌ SERA 🎬" col={GIALLO} />
      <Chip t={T.cPetrolio} fino={T.cChiuso} x={SX} y={360} testo="PETROLIO · APERTA" sotto="posizione lasciata aperta nel weekend" />
      <Pop t={T.cShock} fino={T.cNonTutto} x={DX + 40} y={250}><div style={{ fontFamily: MANO, fontSize: 96, color: "#fff", transform: "rotate(-5deg)", textShadow: "0 4px 14px #000" }}>shockato.</div></Pop>
      {/* N3: le basi */}
      <Chip t={T.cNoProp} fino={T.cMM} x={DX} y={220} testo="PROP FIRM?" sotto="non esistevano ancora" col={ROSSO} />
      {[["MONEY MANAGEMENT", T.cMM, "quanto rischi su ogni operazione"], ["RISCHIO / RENDIMENTO", T.cRR, "quanto rischi per quanto guadagni"], ["WIN RATE", T.cWR, "quante volte vinci su 100"], ["SESSIONI", T.cSess, "Londra · New York"]].map(([s, tt, sub], i) => (
        <Chip key={i} t={tt as number} fino={T.cRischi10} x={i % 2 ? DX : SX} y={200 + i * 150} testo={s as string} sotto={sub as string} />
      ))}
      {/* N3: il conto del 10 contro 20 */}
      <Pop t={T.cRischi10} fino={T.cMedie - 0.2} x={SX} y={170} da="sx">
        <Scheda pad="26px 34px" style={{ width: 560 }}>
          <div style={{ fontFamily: MONO, fontSize: 24, color: ACCENTO }}>OGNI OPERAZIONE</div>
          <div style={{ fontFamily: ANTON, fontSize: 64 }}>RISCHI <span style={{ color: ROSSO }}>10 €</span></div>
          <div style={{ fontFamily: ANTON, fontSize: 64, opacity: t >= T.cVenti ? 1 : 0 }}>PER GUADAGNARNE <span style={{ color: VERDE }}>20 €</span></div>
        </Scheda>
      </Pop>
      <Pop t={T.cUnaSuDue} fino={T.cMedie - 0.2} x={DX} y={170} da="dx">
        <Scheda pad="26px 34px" style={{ width: 560 }}>
          <div style={{ fontFamily: MONO, fontSize: 24, color: ACCENTO }}>SBAGLI 1 VOLTA SU 2</div>
          <div style={{ fontFamily: ANTON, fontSize: 64, color: ROSSO, opacity: t >= T.cPerdi10 ? 1 : 0 }}>-10 €</div>
          <div style={{ fontFamily: ANTON, fontSize: 64, color: VERDE, opacity: t >= T.cVinci20 ? 1 : 0 }}>+20 €</div>
          <div style={{ height: 4, background: "#ffffff55", margin: "8px 0", opacity: t >= T.cSopra ? 1 : 0 }} />
          <div style={{ fontFamily: ANTON, fontSize: 78, color: GIALLO, opacity: t >= T.cSopra ? 1 : 0 }}>+10 € ✓</div>
        </Scheda>
      </Pop>
      {/* N4: cos'è una prop firm */}
      <Chip t={T.c50k} fino={T.c30} x={SX} y={180} testo="50.000 $" sotto="conto della società" col={VERDE} />
      <Chip t={T.c100k} fino={T.c30} x={SX} y={330} testo="100.000 $" sotto="se passi l'esame" col={VERDE} />
      {[["1 · PAGHI L'ISCRIZIONE", T.cPaghi], ["2 · RISPETTI LE REGOLE", T.cRegole], ["3 · RAGGIUNGI L'OBIETTIVO", T.cObiettivo], ["4 · LAVORI COI SOLDI LORO", T.cLoro]].map(([s, tt], i) => (
        <Chip key={i} t={tt as number} fino={T.c30} x={DX - 60} y={180 + i * 130} testo={s as string} />
      ))}
      {/* N4: contatore che scende */}
      {t >= T.cContatore - 0.5 && t < T.cPagavo && <Contatore />}
      {/* N4: le challenge bruciate */}
      {[T.cBruciavo, T.cFilm, T.cDueGiorni, T.cRaddoppi, T.cVentiMin].map((tt, i) => (
        <Pop key={i} t={tt} fino={T.cGratta} x={i % 2 ? DX + 40 + i * 12 : SX + 30 + i * 14} y={170 + i * 70} rot={(i % 2 ? 6 : -6) + i}>
          <Scheda bordo={ROSSO} pad="14px 26px"><div style={{ fontFamily: MONO, fontSize: 22, color: "#ffffffaa" }}>CHALLENGE #{i + 1}</div><div style={{ fontFamily: ANTON, fontSize: 58, color: ROSSO }}>FAILED ✗</div></Scheda>
        </Pop>
      ))}
      {[["sposti lo stop…", T.cStop], ["«tanto torna»", T.cTorna2], ["raddoppi per recuperare", T.cRaddoppi]].map(([s, tt], i) => (
        <Pop key={i} t={tt as number} fino={T.cVentiMin + 2} x={SX + 20} y={620 + i * 90}><div style={{ fontFamily: MANO, fontSize: 70, color: GIALLO, textShadow: "0 4px 14px #000", whiteSpace: "nowrap" }}>{s}</div></Pop>
      ))}
      {/* N6: su e giù */}
      {t >= T.cConti && t < T.cPeggio && <Altalena />}
      <Pop t={T.cDomanda} fino={T.cMollano} x={SX} y={220} da="sx"><Scheda bordo={GIALLO} pad="24px 34px" style={{ width: 560 }}><div style={{ fontFamily: ANTON, fontSize: 76 }}>«MA CHI ME LO FA FARE?»</div></Scheda></Pop>
      <Pop t={T.cCommenti} fino={T.cMollano} x={DX} y={560} da="dx"><Commento testo="Ci sono passato anch'io…" /></Pop>
      {/* N7 / N8 / N9 */}
      <Pop t={T.cVaga} fino={T.cCopiato} x={SX} y={700} da="sx"><Scheda pad="16px 30px"><div style={{ fontFamily: ANTON, fontSize: 70 }}>VAGA FX</div><div style={{ fontFamily: MONO, fontSize: 24, color: "#ffffffbb" }}>metodo oggettivo · regole, non opinioni</div></Scheda></Pop>
      <Chip t={T.cCopiato} fino={T.cPassa - 0.3} x={SX} y={200} testo="COPIARE LE OPERAZIONI ✗" col={ROSSO} />
      <Chip t={T.cConcetti} fino={T.cPassa - 0.3} x={DX} y={340} testo="CAPIRE I CONCETTI ✓" col={VERDE} />
      <Chip t={T.cMia} fino={T.cPassa - 0.3} x={DX} y={480} testo="→ STRATEGIA MIA" col={GIALLO} sotto="orari, vita, carattere: i miei" />
      <Pop t={T.cStudenti} fino={T.cProgetto} x={SX} y={720} da="sx"><Scheda pad="16px 30px"><div style={{ fontFamily: ANTON, fontSize: 56 }}>STUDENTI DI VAGA FX</div><div style={{ fontFamily: MONO, fontSize: 24, color: "#ffffffbb" }}>seguiamo i suoi insegnamenti</div></Scheda></Pop>
      <Pop t={T.cAlgory1} fino={T.cVeterani} x={DX} y={220} da="dx"><Scheda pad="20px 30px"><div style={{ fontFamily: MONO, fontSize: 24, color: ACCENTO }}>PRIMA BOZZA</div><div style={{ fontFamily: ANTON, fontSize: 84 }}>ALGORY</div></Scheda></Pop>
      <Pop t={T.cBeta} fino={T.cDomandaN} x={DX} y={200} da="dx"><Scheda bordo={GIALLO} pad="18px 30px"><div style={{ fontFamily: ANTON, fontSize: 70, color: GIALLO }}>BETA TESTER</div><div style={{ fontFamily: MONO, fontSize: 24, color: "#ffffffbb" }}>aggiornamento dopo aggiornamento</div></Scheda></Pop>
      <Pop t={T.cDomandaN} fino={T.cPrima} x={SX} y={200} da="sx">
        <Scheda pad="24px 34px" style={{ width: 600 }}>
          <div style={{ position: "relative", fontFamily: ANTON, fontSize: 56, color: "#ffffffaa" }}>QUAL È IL METODO GIUSTO?<Barrato t={T.cMezzo - 0.2} w={560} /></div>
          <div style={{ fontFamily: ANTON, fontSize: 60, color: GIALLO, marginTop: 14, opacity: t >= T.cMezzo ? 1 : 0 }}>POSSO TOGLIERMI DI MEZZO?</div>
        </Scheda>
      </Pop>
      {/* N10: prima ci volevano anni */}
      {[["IDEA", T.cPrima], ["→ BOT", T.cBot], ["→ TEST", T.cBot + 0.8], ["→ FORTUNA?", T.cFortuna], ["→ DA CAPO", T.cFortuna + 1.0]].map(([s, tt], i) => (
        <Chip key={i} t={tt as number} fino={T.cDaSolo - 0.3} x={i % 2 ? DX : SX} y={170 + i * 120} testo={s as string} col={i === 3 ? ROSSO : ACCENTO} />
      ))}
      <Pop t={T.cStudente} fino={T.cGasa} x={SX} y={190} da="sx">
        <Scheda pad="24px 34px" style={{ width: 560 }}>
          <div style={{ fontFamily: MONO, fontSize: 24, color: ACCENTO }}>L'ESAME DELLA STRATEGIA</div>
          <div style={{ fontFamily: ANTON, fontSize: 56, marginTop: 6 }}>DOMANDE VECCHIE <span style={{ color: ROSSO }}>✗</span></div>
          <div style={{ fontFamily: ANTON, fontSize: 56, opacity: t >= T.cNuove ? 1 : 0 }}>DOMANDE NUOVE <span style={{ color: VERDE }}>✓</span></div>
        </Scheda>
      </Pop>
      {[["NON SI GASA", T.cGasa], ["NON VA AL CINEMA", T.cNoCinema], ["NON INTERPRETA", T.cNonInterp]].map(([s, tt], i) => (
        <Chip key={i} t={tt as number} fino={T.cOcchio} x={DX} y={220 + i * 140} testo={`✓ ${s}`} col={VERDE} />
      ))}
      {/* N11 */}
      <Pop t={T.cStampa} fino={T.cSiPerde} x={SX} y={240} da="sx"><Scheda bordo={ROSSO} pad="20px 30px"><div style={{ fontFamily: ANTON, fontSize: 64 }}>🖨️💵 STAMPA-SOLDI</div></Scheda></Pop>
      {t >= T.cNonEsiste && t < T.cSiPerde && <Timbro t={T.cNonEsiste} x={380} y={300} testo="NON ESISTE" size={80} />}
      {t >= T.cMesi && t < T.cVita && <Discesa />}
      {[["LAVORARE", T.cVita + 2.6], ["USCIRE", T.cVita + 3.2], ["DORMIRE", T.cDormire], ["CINEMA 🍿", T.cCinemaFin + 0.6]].map(([s, tt], i) => (
        <Chip key={i} t={tt as number} fino={T.cCorsi} x={DX} y={190 + i * 130} testo={`✓ ${s}`} col={VERDE} />
      ))}
      <Pop t={T.cSchermi} fino={T.cCorsi} x={SX} y={220} da="sx"><Scheda bordo={ROSSO} pad="14px 28px"><div style={{ position: "relative", fontFamily: ANTON, fontSize: 56 }}>10 SCHERMI ACCESI<Barrato t={T.cSchermi + 0.6} w={460} /></div></Scheda></Pop>
      {/* N12: prima */}
      {[["CORSI DA MIGLIAIA DI €", T.cCorsi], ["ABBONAMENTI AI SEGNALI", T.cSegnali], ["CHALLENGE A RAFFICA", T.cComprate]].map(([s, tt], i) => (
        <Pop key={i} t={tt as number} fino={T.cMetodo - 0.3} x={i % 2 ? DX - 80 : SX} y={200 + i * 150} da={i % 2 ? "dx" : "sx"}>
          <Scheda bordo={ROSSO} pad="14px 28px"><div style={{ position: "relative", fontFamily: ANTON, fontSize: 54, whiteSpace: "nowrap" }}>{s}<Barrato t={(tt as number) + 1.2} w={520} /></div></Scheda>
        </Pop>
      ))}
      {/* link affiliato: detto chiaro */}
      <Pop t={T.cLink} fino={T.cPrimo} x={SX} y={170} da="sx">
        <Scheda pad="24px 34px" style={{ width: 600 }}>
          <div style={{ fontFamily: MONO, fontSize: 24, color: ACCENTO }}>LINK IN DESCRIZIONE</div>
          <div style={{ fontFamily: ANTON, fontSize: 60 }}>ALGORY · PIANO GRATUITO</div>
          <div style={{ fontFamily: INTER, fontWeight: 700, fontSize: 28, color: GIALLO, marginTop: 8, opacity: t >= T.cAffil ? 1 : 0 }}>È un link affiliato: se passi a un piano a pagamento a noi arriva una parte, a te non costa di più.</div>
        </Scheda>
      </Pop>
      <Pop t={T.cCodice} fino={T.cPrimo} x={DX} y={560} da="dx">
        <Scheda bordo={GIALLO} pad="18px 32px"><div style={{ fontFamily: MONO, fontSize: 24, color: "#ffffffbb" }}>CODICE</div><div style={{ fontFamily: ANTON, fontSize: 96, color: GIALLO, letterSpacing: 2 }}>STANGA50</div><div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 30, opacity: t >= T.cMeta ? 1 : 0 }}>-50% sul primo pagamento</div></Scheda>
      </Pop>
      {/* prossimi video */}
      {[["COME PASSARE UNA CHALLENGE CON ALGORY", T.cChal], ["ALGORY SU UN CONTO PERSONALE", T.cPers], ["PERCHÉ HO ABBANDONATO IL TRADING A MANO", T.cMano]].map(([s, tt], i) => (
        <Pop key={i} t={tt as number} fino={T.cReel - 0.2} x={i === 1 ? DX : SX} y={170 + i * 230} da={i === 1 ? "dx" : "sx"}>
          <div style={{ width: 560, height: 200, borderRadius: 20, background: `linear-gradient(135deg, ${VIOLA}, #1a1433)`, border: `3px solid ${ACCENTO}`, boxShadow: "0 20px 60px #000c", padding: "20px 26px", boxSizing: "border-box", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div style={{ fontFamily: MONO, fontSize: 22, color: GIALLO }}>PROSSIMO VIDEO · {i + 1}</div>
            <div style={{ fontFamily: ANTON, fontSize: 46, color: "#fff", lineHeight: 1.05 }}>{s}</div>
          </div>
        </Pop>
      ))}
      <Pop t={T.cLeggo} fino={T.cLascio} x={DX} y={420} da="dx"><Commento testo="Io ho provato di tutto anche io…" /></Pop>
      {/* avviso di rischio */}
      <Pop t={T.cConsiglio} fino={T.cCiao + 0.2} x={460} y={150} da="giu">
        <Scheda bordo={GIALLO} pad="18px 30px" style={{ width: 1000, textAlign: "center" }}><div style={{ fontFamily: ANTON, fontSize: 50 }}>NON È UN CONSIGLIO FINANZIARIO</div><div style={{ fontFamily: INTER, fontWeight: 700, fontSize: 28, color: "#ffffffcc" }}>Il trading è rischioso: puoi perdere i tuoi soldi.</div></Scheda>
      </Pop>
    </>
  );
};

const Commento: React.FC<{ testo: string }> = ({ testo }) => (
  <div style={{ display: "flex", gap: 18, alignItems: "flex-start", background: "#fff", borderRadius: 26, padding: "20px 26px", width: 560, boxShadow: "0 24px 70px #000c" }}>
    <div style={{ width: 64, height: 64, borderRadius: 32, background: `linear-gradient(135deg, ${VIOLA}, ${ACCENTO})`, flexShrink: 0 }} />
    <div style={{ fontFamily: INTER }}>
      <div style={{ fontSize: 22, color: "#777", fontWeight: 700 }}>💬 scrivimelo nei commenti</div>
      <div style={{ fontSize: 34, color: "#111", fontWeight: 800 }}>{testo}</div>
    </div>
  </div>
);

// contatore della challenge (30 → 28 sulle parole)
const Contatore: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / 30;
  const n = t < T.c29 ? 30 : t < T.c28 ? 29 : t < T.cStringe - 0.8 ? 28 : Math.max(3, 28 - Math.floor((t - T.cStringe + 0.8) * 9));
  const rosso = n <= 28;
  return (
    <Pop t={T.cContatore - 0.5} x={DX + 60} y={170} da="dx">
      <Scheda bordo={rosso ? ROSSO : ACCENTO} pad="20px 40px" style={{ textAlign: "center", width: 380 }}>
        <div style={{ fontFamily: MONO, fontSize: 24, color: "#ffffffaa" }}>GIORNI RIMASTI</div>
        <div style={{ fontFamily: ANTON, fontSize: 180, lineHeight: 1, color: rosso ? ROSSO : "#fff" }}>{n}</div>
      </Scheda>
    </Pop>
  );
};

// conto su e giù per anni (linea che si disegna)
const Altalena: React.FC = () => {
  const f = useCurrentFrame();
  const p = ramp(f, F(T.cConti), F(T.cNonVivere));
  const pts = [[0, 70], [10, 40], [18, 85], [26, 30], [34, 60], [40, 92], [48, 45], [56, 25], [62, 88], [70, 50], [78, 35], [86, 80], [100, 55]];
  const d = pts.map((q, i) => `${i ? "L" : "M"} ${q[0] * 5.6} ${q[1] * 3.2}`).join(" ");
  return (
    <Pop t={T.cConti} x={DX - 120} y={180} da="dx">
      <Scheda pad="20px 26px">
        <div style={{ fontFamily: MONO, fontSize: 22, color: ACCENTO, marginBottom: 6 }}>IL MIO CONTO · ANNI DI SU E GIÙ</div>
        <svg width={560} height={320}><path d={d} fill="none" stroke={GIALLO} strokeWidth={7} strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
          {[[26, 30], [56, 25], [78, 35]].map((q, i) => p * 100 > q[0] + 2 && <text key={i} x={q[0] * 5.6 - 30} y={q[1] * 3.2 - 14} fill={VERDE} fontFamily={ANTON} fontSize={30}>PAYOUT</text>)}
          {[[40, 92], [62, 88]].map((q, i) => p * 100 > q[0] + 2 && <text key={i} x={q[0] * 5.6 - 50} y={q[1] * 3.2 + 2} fill={ROSSO} fontFamily={ANTON} fontSize={30}>BRUCIATO</text>)}
        </svg>
      </Scheda>
    </Pop>
  );
};

// quanto può scendere: banda normale e soglia per spegnere
const Discesa: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / 30;
  const p = ramp(f, F(T.cScendere), F(T.cSpegni) + 20);
  const pts = [[0, 30], [12, 26], [22, 44], [30, 38], [40, 58], [50, 50], [58, 64], [66, 56], [74, 80], [84, 96], [100, 112]];
  const d = pts.map((q, i) => `${i ? "L" : "M"} ${q[0] * 5.6} ${q[1] * 2.6}`).join(" ");
  return (
    <Pop t={T.cMesi} x={SX} y={170} da="sx">
      <Scheda pad="20px 26px">
        <div style={{ fontFamily: MONO, fontSize: 22, color: ACCENTO, marginBottom: 6 }}>DISCESA PREVISTA PRIMA DI ACCENDERLA</div>
        <svg width={560} height={320}>
          <rect x={0} y={0} width={560} height={175} fill={`${VERDE}22`} />
          <line x1={0} x2={560} y1={175} y2={175} stroke={ROSSO} strokeWidth={4} strokeDasharray="14 10" />
          <text x={10} y={36} fill={VERDE} fontFamily={ANTON} fontSize={30} opacity={t >= T.cNormale ? 1 : 0}>NORMALE → LASCIALA LAVORARE</text>
          <text x={10} y={215} fill={ROSSO} fontFamily={ANTON} fontSize={30} opacity={t >= T.cSpegni - 0.5 ? 1 : 0}>OLTRE LA LINEA → SPEGNI</text>
          <path d={d} fill="none" stroke="#fff" strokeWidth={7} strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
        </svg>
      </Scheda>
    </Pop>
  );
};

// ---------------- grafiche a tutto schermo [G] ----------------
const GConto: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / 30;
  const v = Math.round(interpolate(t, [T.cChallenge - 1, T.cUltimi + 1], [500, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const n = Math.min(9, Math.max(0, Math.floor((t - T.cChallenge) * 2.2)));
  return (
    <Sfondo>
      <div style={{ position: "absolute", left: 140, top: 200 }}>
        <div style={{ fontFamily: MONO, fontSize: 34, color: ACCENTO, letterSpacing: 4 }}>SALDO DEL CONTO</div>
        <div style={{ fontFamily: ANTON, fontSize: 260, color: v < 100 ? ROSSO : "#fff", lineHeight: 1 }}>{v} €</div>
        {t >= T.cSenzaLavoro && <Pop t={T.cSenzaLavoro} x={0} y={60}><Scheda bordo={ROSSO}><div style={{ fontFamily: ANTON, fontSize: 64 }}>SENZA LAVORO</div></Scheda></Pop>}
        {t >= T.cUltimi && <Pop t={T.cUltimi} x={0} y={200}><Scheda bordo={ROSSO}><div style={{ fontFamily: ANTON, fontSize: 64 }}>GLI ULTIMI RISPARMI</div></Scheda></Pop>}
      </div>
      {Array.from({ length: n }).map((_, i) => (
        <div key={i} style={{ position: "absolute", left: 1100 + (i % 3) * 230 - (i > 5 ? 60 : 0), top: 150 + Math.floor(i / 3) * 240, transform: `rotate(${((i * 37) % 21) - 10}deg)` }}>
          <Scheda bordo={ROSSO} pad="14px 22px"><div style={{ fontFamily: MONO, fontSize: 20, color: "#ffffffaa" }}>CHALLENGE</div><div style={{ fontFamily: ANTON, fontSize: 52, color: ROSSO }}>FAILED</div></Scheda>
        </div>
      ))}
    </Sfondo>
  );
};

const Candele: React.FC<{ dati: [number, number, number, number][]; x0: number; y0: number; w: number; sc: number; fino: number }> = ({ dati, x0, y0, w, sc, fino }) => (
  <>
    {dati.slice(0, fino).map(([o, h, l, c], i) => {
      const su = c >= o, col = su ? VERDE : ROSSO;
      return (
        <g key={i}>
          <line x1={x0 + i * w + w / 2} x2={x0 + i * w + w / 2} y1={y0 - h * sc} y2={y0 - l * sc} stroke={col} strokeWidth={4} />
          <rect x={x0 + i * w + 6} width={w - 12} y={y0 - Math.max(o, c) * sc} height={Math.max(4, Math.abs(c - o) * sc)} fill={col} rx={3} />
        </g>
      );
    })}
  </>
);

const GGap: React.FC<{ a: number }> = ({ a }) => {
  const f = useCurrentFrame();
  const vv: [number, number, number, number][] = [[60, 64, 58, 63], [63, 66, 61, 62], [62, 65, 60, 64], [64, 68, 63, 67], [67, 69, 64, 65], [65, 68, 64, 67]];
  const lun: [number, number, number, number][] = [[38, 41, 33, 35], [35, 37, 30, 31], [31, 36, 29, 34]];
  const k = Math.min(6, Math.floor((f - F(a)) / 3) + 1);
  const k2 = Math.max(0, Math.floor((f - F(a) - 50) / 6));
  return (
    <Sfondo>
      <div style={{ position: "absolute", left: 0, right: 0, top: 50, textAlign: "center", fontFamily: MONO, fontSize: 32, color: ACCENTO, letterSpacing: 4 }}>PETROLIO · GRAFICO</div>
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
        <Candele dati={vv} x0={200} y0={1000} w={90} sc={11} fino={k} />
        {k2 > 0 && <rect x={760} y={120} width={330} height={880} fill="#ffffff0d" />}
        {k2 > 0 && <text x={790} y={180} fill="#ffffff88" fontFamily={MONO} fontSize={28}>WEEKEND · mercato chiuso</text>}
        <Candele dati={lun} x0={1100} y0={1000} w={90} sc={11} fino={Math.min(3, k2)} />
        {k2 > 1 && <line x1={740} x2={1140} y1={1000 - 67 * 11} y2={1000 - 38 * 11} stroke={GIALLO} strokeWidth={6} strokeDasharray="18 12" />}
      </svg>
      {k2 > 1 && <Pop t={a + 2.2} x={830} y={380}><Titolo size={200} col={GIALLO}>GAP</Titolo></Pop>}
      {f >= F(T.c500b) && <Pop t={T.c500b} x={1380} y={250}><Titolo size={170} col={ROSSO}>-500 €</Titolo></Pop>}
      <Pop t={a + 0.3} x={200} y={150}><Scheda pad="10px 22px"><div style={{ fontFamily: ANTON, fontSize: 44 }}>VENERDÌ: CHIUDO? NO 🎬</div></Scheda></Pop>
      {k2 > 0 && <Pop t={a + 1.7} x={1100} y={120 + 60}><Scheda bordo={ROSSO} pad="10px 22px"><div style={{ fontFamily: ANTON, fontSize: 44 }}>LUNEDÌ</div></Scheda></Pop>}
    </Sfondo>
  );
};

const GAnalisi: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / 30;
  const prezzo = [[0, 700], [120, 640], [220, 690], [340, 560], [440, 610], [560, 470], [660, 520], [780, 400], [880, 450], [1000, 330], [1120, 380], [1240, 280], [1360, 330], [1480, 250], [1600, 300]];
  const d = (pts: number[][], dy = 0) => pts.map((q, i) => `${i ? "L" : "M"} ${q[0] + 160} ${q[1] + dy}`).join(" ");
  const media = prezzo.map((q, i, arr) => [q[0], arr.slice(Math.max(0, i - 2), i + 1).reduce((s, x) => s + x[1], 0) / Math.min(i + 1, 3) + 30]);
  const on = (x: number) => ramp(f, F(x), F(x) + 15);
  return (
    <Sfondo>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <path d={d(prezzo)} fill="none" stroke="#fff" strokeWidth={6} />
        <path d={d(media)} fill="none" stroke={ACCENTO} strokeWidth={6} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - on(T.cMedie)} />
        <line x1={160} y1={760} x2={160 + 1600 * on(T.cTrend)} y2={760 - 520 * on(T.cTrend)} stroke={GIALLO} strokeWidth={5} />
        <line x1={160} x2={160 + 1600 * on(T.cRotture)} y1={470} y2={470} stroke={VERDE} strokeWidth={5} strokeDasharray="20 12" />
        <line x1={160} x2={160 + 1600 * on(T.cRotture + 0.4)} y1={330} y2={330} stroke={ROSSO} strokeWidth={5} strokeDasharray="20 12" />
        <rect x={160} y={860} width={1600 * on(T.cIndic)} height={120} fill={`${ACCENTO}33`} />
        <path d={d(prezzo.map((q) => [q[0], 960 - (q[1] % 90)]))} fill="none" stroke={ACCENTO} strokeWidth={4} opacity={on(T.cIndic)} />
      </svg>
      {[["MEDIE MOBILI", T.cMedie, ACCENTO], ["TRENDLINE", T.cTrend, GIALLO], ["SUPPORTI E RESISTENZE", T.cRotture, VERDE], ["INDICATORI", T.cIndic, ACCENTO]].map(([s, tt, c], i) => (
        <Chip key={i} t={tt as number} x={1300} y={70} testo={s as string} col={c as string} fino={i < 3 ? [T.cTrend, T.cRotture, T.cIndic][i] : undefined} />
      ))}
      {t >= T.cGiusta && <Timbro t={T.cGiusta} x={1450} y={160} testo="TUTTO GIUSTO ✓" col={VERDE} rot={-6} />}
    </Sfondo>
  );
};

const GChallenge: React.FC<{ a: number }> = ({ a }) => {
  const f = useCurrentFrame();
  const t = f / 30;
  const giorni = t < T.c30 + 1.3 ? 30 : 30;
  return (
    <Sfondo>
      <Pop t={a + 0.1} x={560} y={130}>
        <div style={{ width: 800, borderRadius: 30, background: "#15122a", border: `4px solid ${ACCENTO}`, boxShadow: `0 30px 90px #000c`, padding: "36px 50px", boxSizing: "border-box", color: "#fff" }}>
          <div style={{ fontFamily: MONO, fontSize: 28, color: ACCENTO, letterSpacing: 4 }}>CHALLENGE · ESAME</div>
          <div style={{ fontFamily: ANTON, fontSize: 110, lineHeight: 1.1 }}>100.000 $</div>
          {[["OBIETTIVO", "+10%", VERDE], ["PERDITA MASSIMA", "-10%", ROSSO], ["PERDITA AL GIORNO", "-5%", ROSSO]].map(([k, v, c], i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", fontFamily: INTER, fontWeight: 800, fontSize: 40, borderTop: "2px solid #ffffff22", padding: "14px 0" }}><span>{k}</span><span style={{ color: c }}>{v}</span></div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: INTER, fontWeight: 800, fontSize: 40, borderTop: "2px solid #ffffff22", paddingTop: 14 }}>
            <span>TEMPO</span><span style={{ fontFamily: ANTON, fontSize: 90, color: GIALLO }}>{giorni} GIORNI</span>
          </div>
        </div>
      </Pop>
      {t >= T.cFantastico && <Pop t={T.cFantastico} x={1380} y={760}><div style={{ fontFamily: MANO, fontSize: 90, color: GIALLO, transform: "rotate(-6deg)" }}>fantastico, no?</div></Pop>}
      <div style={{ position: "absolute", left: 140, bottom: 70, fontFamily: MONO, fontSize: 24, color: "#ffffff77" }}>regole di esempio · com'erano allora</div>
    </Sfondo>
  );
};

const GCarosello: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / 30;
  const v = [["ANALISI VOLUMETRICA", "📊", T.cG5vol], ["ORDER FLOW", "🔍", T.cG5of], ["QUARTILI", "📐", T.cG5q], ["ALGO + INDUCEMENT", "🪤", T.cG5ind]] as const;
  return (
    <Sfondo>
      {v.map(([s, ic, tt], i) => {
        if (t < tt) return null;
        const vecchio = v[i + 1] && t >= v[i + 1][2];
        return (
          <Pop key={i} t={tt} x={140 + i * 420} y={vecchio ? 300 : 260} da="su">
            <div style={{ width: 380, height: 460, borderRadius: 28, background: vecchio ? "#15122a" : VIOLA, border: `4px solid ${vecchio ? "#ffffff33" : ACCENTO}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, opacity: vecchio ? 0.55 : 1, boxShadow: "0 30px 80px #000c", position: "relative" }}>
              <div style={{ fontSize: 140 }}>{ic}</div>
              <div style={{ fontFamily: ANTON, fontSize: 52, color: "#fff", textAlign: "center", lineHeight: 1.05, padding: "0 20px" }}>{s}</div>
              {vecchio && <div style={{ position: "absolute", top: 30, fontFamily: ANTON, fontSize: 40, color: ROSSO, transform: "rotate(-8deg)", border: `5px solid ${ROSSO}`, padding: "0 14px", borderRadius: 10 }}>NON BASTA</div>}
            </div>
          </Pop>
        );
      })}
      {t >= T.cG5buona && <Pop t={T.cG5buona} x={560} y={800}><Titolo size={110} col={GIALLO}>«LA VOLTA BUONA»</Titolo></Pop>}
    </Sfondo>
  );
};

const GGrammatica: React.FC<{ a: number }> = ({ a }) => {
  const f = useCurrentFrame();
  const t = f / 30;
  const parole = ["LA", "VECCHIA", "PORTA", "LA", "SBARRA"];
  const caos = 1 - ramp(f, F(T.cGramm) + 30, F(T.cGramm) + 55);
  return (
    <Sfondo>
      <div style={{ position: "absolute", left: 0, right: 0, top: 120, display: "flex", justifyContent: "center", gap: 36 }}>
        {parole.map((p, i) => (
          <div key={i} style={{ fontFamily: ANTON, fontSize: 130, color: "#fff", transform: `translate(${Math.sin(i * 2.1 + f / 9) * 70 * caos}px, ${Math.cos(i * 1.7 + f / 11) * 90 * caos}px) rotate(${Math.sin(i + f / 13) * 20 * caos}deg)` }}>{p}</div>
        ))}
      </div>
      {t >= T.cGramm + 2 && (
        <>
          <Pop t={T.cGramm + 2} x={180} y={420} da="sx"><Scheda pad="20px 30px" style={{ width: 700 }}><div style={{ fontFamily: MONO, fontSize: 24, color: ACCENTO }}>LETTURA 1</div><div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 40 }}>una signora anziana trasporta una sbarra</div></Scheda></Pop>
          <Pop t={T.cGramm + 3} x={1040} y={420} da="dx"><Scheda pad="20px 30px" style={{ width: 700 }}><div style={{ fontFamily: MONO, fontSize: 24, color: ACCENTO }}>LETTURA 2</div><div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 40 }}>la porta vecchia la blocca</div></Scheda></Pop>
        </>
      )}
      {t >= T.cConviene && <Pop t={T.cConviene} x={0} y={640} w={1920}><Titolo size={84} col={GIALLO} style={{ textAlign: "center" }}>TU LA LEGGI COME TI CONVIENE</Titolo></Pop>}
      {t >= T.cPerdita && <Pop t={T.cPerdita} x={220} y={790} da="sx"><Scheda bordo={ROSSO} pad="16px 30px"><div style={{ fontFamily: ANTON, fontSize: 52 }}>IN PERDITA → «ORA RIPARTE»</div></Scheda></Pop>}
      {t >= T.cGuadagno && <Pop t={T.cGuadagno} x={1000} y={790} da="dx"><Scheda bordo={VERDE} pad="16px 30px"><div style={{ fontFamily: ANTON, fontSize: 52 }}>IN GUADAGNO → «ORA GIRA»</div></Scheda></Pop>}
      <div style={{ position: "absolute", left: 0, right: 0, top: 50, textAlign: "center", fontFamily: MONO, fontSize: 28, color: ACCENTO, opacity: t > a ? 1 : 0 }}>UNA FRASE SENZA REGOLE DI GRAMMATICA</div>
    </Sfondo>
  );
};

const GNotifiche: React.FC<{ a: number }> = ({ a }) => (
  <Sfondo>
    <Pop t={T.cPassa - 0.2} x={650} y={260} da="giu"><Notifica icona="✅" titolo="Challenge superata" testo="Complimenti: hai raggiunto l'obiettivo" /></Pop>
    <Pop t={T.cArrivano} x={650} y={450} da="giu"><Notifica icona="💸" titolo="Payout ricevuto" testo="Il pagamento è stato inviato" /></Pop>
    <Pop t={T.cArrivano + 1.0} x={650} y={640} da="giu"><Notifica icona="💸" titolo="Payout ricevuto" testo="Il pagamento è stato inviato" /></Pop>
    <div style={{ position: "absolute", left: 0, right: 0, top: 120, textAlign: "center", fontFamily: MONO, fontSize: 30, color: ACCENTO, letterSpacing: 4 }}>{a ? "LA PRIMA VOLTA CHE GIRAVA DAVVERO" : ""}</div>
  </Sfondo>
);

const GAlgory: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / 30;
  const N = 48;
  const nati = Math.floor(interpolate(t, [T.cSacco, T.cSacco + 2.5], [0, N], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const test = t >= T.cMaiVisto;
  const via = t >= T.cButta;
  const buona = (i: number) => (i * 37) % 11 === 0;
  return (
    <Sfondo>
      <div style={{ position: "absolute", left: 0, right: 0, top: 80, textAlign: "center", fontFamily: MONO, fontSize: 30, color: ACCENTO, letterSpacing: 4 }}>ALGORY · I PARAMETRI LI DECIDI TU</div>
      <div style={{ position: "absolute", left: 120, top: 150, width: 1680, display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 16 }}>
        {Array.from({ length: N }).map((_, i) => {
          if (i >= nati) return <div key={i} style={{ height: 150 }} />;
          const ok = buona(i);
          const col = !test ? ACCENTO : ok ? VERDE : ROSSO;
          const sparita = via && !ok;
          return (
            <div key={i} style={{ height: 150, borderRadius: 14, background: "#15122a", border: `3px solid ${col}`, opacity: sparita ? 0.12 : 1, transform: `scale(${sparita ? 0.8 : ok && via ? 1.08 : 1})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: ANTON, fontSize: 40, color: col }}>
              {test ? (ok ? "✓" : "✗") : `#${i + 1}`}
            </div>
          );
        })}
      </div>
      {test && <Pop t={T.cMaiVisto} x={120} y={870} da="sx"><Scheda pad="12px 26px"><div style={{ fontFamily: ANTON, fontSize: 48 }}>TEST SU DATI MAI VISTI</div></Scheda></Pop>}
      {via && <Pop t={T.cButta} x={1060} y={870} da="dx"><Scheda bordo={ROSSO} pad="12px 26px"><div style={{ fontFamily: ANTON, fontSize: 48 }}>SOLO FORTUNA → BUTTATE</div></Scheda></Pop>}
    </Sfondo>
  );
};

const GEcosistema: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / 30;
  const v = [["IL METODO", "Vaga FX", T.cMetodo], ["LO STRUMENTO", "Algory", T.cStrum], ["IL CONTO", "100.000 $ di una prop firm", T.cConto], ["IL COMPUTER", "in cloud · acceso 24 ore su 24", T.cCloud]] as const;
  return (
    <Sfondo>
      <div style={{ position: "absolute", left: 0, right: 0, top: 90, textAlign: "center", fontFamily: MONO, fontSize: 32, color: ACCENTO, letterSpacing: 5 }}>COME LAVORO OGGI</div>
      {v.map(([k, s, tt], i) => (
        <React.Fragment key={i}>
          <Pop t={tt} x={110 + i * 440} y={330} da="su">
            <div style={{ width: 380, height: 330, borderRadius: 28, background: i === 1 ? VIOLA : "#15122a", border: `4px solid ${ACCENTO}`, boxShadow: "0 30px 80px #000c", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, boxSizing: "border-box", textAlign: "center" }}>
              <div style={{ fontFamily: MONO, fontSize: 26, color: GIALLO }}>{k}</div>
              <div style={{ fontFamily: ANTON, fontSize: 60, color: "#fff", lineHeight: 1.05, marginTop: 10 }}>{s}</div>
            </div>
          </Pop>
          {i > 0 && t >= tt && <div style={{ position: "absolute", left: 110 + i * 440 - 58, top: 470, fontFamily: ANTON, fontSize: 60, color: ACCENTO }}>→</div>}
        </React.Fragment>
      ))}
      {t >= T.cGratis && <Pop t={T.cGratis} x={0} y={760} w={1920}><Titolo size={90} col={GIALLO} style={{ textAlign: "center" }}>SI PARTE DAL PIANO GRATUITO</Titolo></Pop>}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 50, textAlign: "center", fontFamily: MONO, fontSize: 24, color: "#ffffff88" }}>link affiliato in descrizione · il trading è rischioso</div>
    </Sfondo>
  );
};

const GReel: React.FC<{ a: number }> = ({ a }) => (
  <Sfondo>
    <Pop t={a + 0.1} x={760} y={90} da="su">
      <div style={{ width: 400, height: 860, borderRadius: 50, border: "10px solid #222", background: `linear-gradient(180deg, #1a1433, ${NERO})`, boxShadow: "0 30px 90px #000c", overflow: "hidden", position: "relative" }}>
        <div style={{ position: "absolute", left: 28, right: 28, top: 120, fontFamily: ANTON, fontSize: 50, color: "#fff", lineHeight: 1.1 }}>LA NOTIZIA DI OGGI <span style={{ background: VIOLA, padding: "0 10px", borderRadius: 8 }}>E I TUOI SOLDI</span></div>
        <div style={{ position: "absolute", left: 28, bottom: 120, fontFamily: MONO, fontSize: 22, color: "#ffffffaa" }}>@cthe.trader · ogni giorno</div>
      </div>
    </Pop>
    <Pop t={T.cSenzaPanico} x={1220} y={420} da="dx"><div style={{ fontFamily: MANO, fontSize: 100, color: GIALLO, transform: "rotate(-6deg)" }}>senza panico</div></Pop>
    <Pop t={a + 0.4} x={260} y={420} da="sx"><Titolo size={80}>OGNI GIORNO<br />SUI REEL</Titolo></Pop>
  </Sfondo>
);

const GRAFICHE: Record<string, React.FC<{ a: number }>> = {
  "conto che scende a zero": GConto, "grafico del petrolio col buco del weeken": GGap, "medie mobili, trendline, supporti, resis": GAnalisi,
  "scheda di una challenge col contatore de": GChallenge, "carosello veloce: volumi, order flow, qu": GCarosello, "una frase senza punteggiatura con le par": GGrammatica,
  "notifiche una sopra l'altra: «Challenge ": GNotifiche, "Algory che genera strategie e i test che": GAlgory, "schema che si compone: METODO (Vaga FX) ": GEcosistema,
  "anteprime dei prossimi video": GReel,
};

// ---------------- finale: stanza vuota + spazi per le schermate finali di YouTube ----------------
const Finale: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = molla(f, fps, 10, 14, 160);
  return (
    <AbsoluteFill>
      <Sfondo />
      <div style={{ position: "absolute", left: 0, right: 0, top: 90, textAlign: "center", opacity: a }}>
        <Titolo size={96}>CI VEDIAMO NEL PROSSIMO VIDEO</Titolo>
        <div style={{ fontFamily: MONO, fontSize: 28, color: ACCENTO, marginTop: 10, letterSpacing: 3 }}>dentro Algory, passo per passo</div>
      </div>
      {/* riquadri vuoti: qui YouTube mette video consigliato e iscriviti */}
      <div style={{ position: "absolute", left: 180, top: 380, width: 800, height: 450, borderRadius: 24, border: `4px dashed ${ACCENTO}55`, opacity: a }} />
      <div style={{ position: "absolute", left: 1180, top: 455, width: 300, height: 300, borderRadius: 150, border: `4px dashed ${ACCENTO}55`, opacity: a }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 60, textAlign: "center", fontFamily: MONO, fontSize: 22, color: "#ffffff77" }}>Non è un consiglio finanziario · il trading è rischioso · link affiliato in descrizione</div>
    </AbsoluteFill>
  );
};

// ---------------- barra dei 4 blocchi in basso ----------------
const Barra: React.FC = () => {
  const f = useCurrentFrame();
  const p = f / F(FINE_VOCE);
  return <div style={{ position: "absolute", left: 0, bottom: 0, height: 7, width: `${Math.min(1, p) * 100}%`, background: `linear-gradient(90deg,${VIOLA},${ACCENTO})` }} />;
};

// musica: variante per blocco (rotazione, mai sempre la stessa), sotto la voce
const MUSICA: [number, number, string][] = [[0, 85.2, "m3"], [85.2, 240.6, "m0"], [240.6, 383, "m2"], [383, 489.6, "m1"], [489.6, FINE_VOCE + 12, "m3"]];

// le grafiche [G] lavorano coi tempi assoluti: niente Sequence, solo una finestra di visibilità
const Finestra: React.FC<{ a: number; b: number; children: React.ReactNode }> = ({ a, b, children }) => {
  const f = useCurrentFrame();
  return f >= F(a) && f < F(b) ? <AbsoluteFill>{children}</AbsoluteFill> : null;
};

export const L0: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: NERO, fontFamily: INTER }}>
    {SEG.map(([tipo, nota, , , a, b], i) => {
      return (
        <Sequence key={i} from={F(a)} durationInFrames={F(b) - F(a)}>
          {tipo === "M" && <Parla inq="medio" a={a} b={b} idx={i} />}
          {tipo === "L" && <Parla inq="largo" a={a} b={b} idx={i} />}
          {tipo === "I" && <Interazione nome={nota} a={a} b={b} idx={i} />}
        </Sequence>
      );
    })}
    {SEG.map(([tipo, nota, , , a, b], i) => {
      const G = GRAFICHE[nota];
      return tipo === "G" && G ? <Finestra key={`g${i}`} a={a} b={b}><G a={a} /></Finestra> : null;
    })}
    <Sequence from={F(FINE_VOCE)}><Finale /></Sequence>
    <AbsoluteFill style={{ pointerEvents: "none", background: "radial-gradient(ellipse at 50% 45%, transparent 62%, #0008 100%)" }} />
    <Schede />
    {LEZ.map((l) => <Lezione key={l.n} {...l} />)}
    <ParolaChiave />
    <Barra />
    <Audio src={staticFile(`${C}/voce.wav`)} />
    <Audio src={staticFile(`${C}/sfx.mp3`)} volume={0.28} />
    {MUSICA.map(([a, b, m], i) => (
      <Sequence key={i} from={F(a)} durationInFrames={F(b) - F(a)}>
        <Audio src={staticFile(`${C}/${m}.mp3`)} loop startFrom={m === "m3" ? F(a) : 0} volume={(f) => 0.075 * Math.min(1, f / 30, (F(b) - F(a) - f) / 30) * (a > 600 && f > F(FINE_VOCE - a) ? 2.2 : 1)} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
