// ALGORY #1 nel format «C in camera»: stessa voce di ALGORY1, spezzoni Dreamina in public/algory1c
import React from "react";
import { interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { PAROLE } from "./algory1-parole";
import { ACCENTO, ANTON, BoxCommento, Card3D, Conta, FormatC, MONO, MANO, Nota, ROSSO, Scena, SfondoSet, Sticker, VERDE, VIOLA, molla } from "./FormatC";

const CHIAVE = /^(19|100\.000|ALGORY|ALGO|0,25%|ROSSI|NIENTE|PERDITE|CADONO|SOFTWARE|MIGLIAIA|TEST)/;
const CARTELLA = "algory1c";

// Icona di un bot
const Bot: React.FC<{ x: number; y: number; s?: number; d: number; color?: string }> = ({ x, y, s = 70, d, color = ACCENTO }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = molla(f, fps, d, 9, 220);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: s, height: s, borderRadius: s * 0.24, background: color, boxShadow: `0 0 ${s * 0.4}px ${color}88`, transform: `scale(${a})`, display: "flex", alignItems: "center", justifyContent: "center", gap: s * 0.16 }}>
      <div style={{ width: s * 0.16, height: s * 0.22, borderRadius: 4, background: "#0b0a10" }} />
      <div style={{ width: s * 0.16, height: s * 0.22, borderRadius: 4, background: "#0b0a10" }} />
    </div>
  );
};

// Grafica 1 · dati mai visti: migliaia di strategie, quasi tutte cadono
const COL = 18, RIG = 14;
const vive = (i: number) => (i * 7919) % 31 === 0;
const Cadono: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const caduta = 78;
  const muro = molla(f, fps, 20, 14, 160);
  return (
    <>
      <SfondoSet img={`${CARTELLA}/setA.png`} />
      <Card3D d={0} x={60} y={230} w={960} h={1020}>
        <div style={{ position: "absolute", left: 40, top: 30, fontFamily: MONO, fontSize: 32, color: ACCENTO, letterSpacing: 3 }}>// DATI MAI VISTI</div>
        {Array.from({ length: COL * RIG }).map((_, i) => {
          const x = 60 + (i % COL) * 47, y0 = 110 + Math.floor(i / COL) * 47;
          const cade = !vive(i);
          const g = cade ? Math.max(0, f - caduta - (i % 9) * 2) : 0;
          const dopo = f > caduta;
          const c = cade && dopo ? ROSSO : vive(i) && dopo ? "#fff" : ACCENTO;
          return <div key={i} style={{ position: "absolute", left: x, top: y0 + g * g * 0.9, width: 30, height: 30, borderRadius: 15, background: c, opacity: cade ? Math.max(0, 1 - g / 28) : 1, boxShadow: vive(i) && dopo ? `0 0 22px ${ACCENTO}` : "none" }} />;
        })}
        <div style={{ position: "absolute", left: 40, right: 40, top: 790, height: 8, background: ACCENTO, transform: `scaleX(${muro})`, boxShadow: `0 0 30px ${ACCENTO}` }} />
        <div style={{ position: "absolute", left: 44, top: 820, fontFamily: MONO, fontSize: 30, fontWeight: 700, color: ACCENTO, opacity: muro }}>IL FUTURO NON SI PUÒ TRUCCARE</div>
      </Card3D>
      <Sticker d={94} top={620} size={110} bg={ROSSO}>Quasi tutte fuori</Sticker>
    </>
  );
};

// Grafica 2 · la scala del rischio: sale solo se dal vivo fa come nel test, altrimenti lo cambio
const Scala: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const st = f > 84 ? 2 : f > 20 ? 1 : 0;
  const salto = molla(f, fps, [0, 20, 84][st], 10, 160);
  const rosso = f > 112;
  const via = interpolate(f, [128, 142], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const gr = [{ p: "0,25%", t: "PARTENZA" }, { p: "0,5%", t: "PROVA" }, { p: "1%", t: "PIENO" }];
  const base = 1180;
  return (
    <>
      <SfondoSet img={`${CARTELLA}/setA.png`} />
      <Card3D d={0} x={60} y={230} w={960} h={1020}>
        <div style={{ position: "absolute", left: 40, top: 30, fontFamily: MONO, fontSize: 32, color: ACCENTO, letterSpacing: 3 }}>// IL RISCHIO SI GUADAGNA</div>
        {gr.map((g, i) => {
          const h = 220 + i * 180;
          return (
            <div key={g.p} style={{ position: "absolute", left: 40 + i * 300, bottom: 60, width: 280, height: h, background: i <= st ? `linear-gradient(${ACCENTO},${VIOLA})` : `${VIOLA}55`, border: `3px solid ${ACCENTO}`, borderRadius: "20px 20px 0 0" }}>
              <div style={{ position: "absolute", left: 0, right: 0, top: 18, textAlign: "center", fontFamily: ANTON, fontSize: 88, color: "#fff" }}>{g.p}</div>
              <div style={{ position: "absolute", left: 0, right: 0, top: 122, textAlign: "center", fontFamily: MONO, fontSize: 26, color: "#e9e6f5", letterSpacing: 2 }}>{g.t}</div>
            </div>
          );
        })}
        <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${via * 900}px, ${via * 300}px) rotate(${via * 90}deg)`, opacity: 1 - via }}>
          <Bot x={125 + st * 300} y={1020 - 60 - (220 + st * 180) - 125 - (1 - salto) * 60} s={110} d={-30} color={rosso ? ROSSO : ACCENTO} />
        </div>
        {f > 135 ? <Bot x={125} y={1020 - 60 - 220 - 125} s={110} d={135} /> : null}
        <Nota x={40} y={110} d={8} rot={-3} size={62} color="#fff">sale solo se dal vivo fa come nel test</Nota>
      </Card3D>
      <Sticker d={135} top={base - 120} size={110} bg={ROSSO}>Lo cambio</Sticker>
    </>
  );
};

// Promessa barrata (T4)
const Barrata: React.FC<{ d: number; top: number }> = ({ d, top }) => {
  const f = useCurrentFrame();
  if (f < d) return null;
  const w = interpolate(f, [d + 10, d + 20], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top, textAlign: "center" }}>
      <span style={{ position: "relative", fontFamily: ANTON, fontSize: 72, color: "#fff", WebkitTextStroke: "8px #000", paintOrder: "stroke fill", textTransform: "uppercase" }}>
        «+50% al mese garantito»
        <span style={{ position: "absolute", left: -10, top: "50%", height: 12, width: `calc(${w}% + 20px)`, background: ROSSO, borderRadius: 6, boxShadow: "0 4px 14px #000" }} />
      </span>
    </div>
  );
};

// Carta degli schermi (R2)
const Carta: React.FC<{ d: number; y: number; t: string; s: string; c: string }> = ({ d, y, t, s, c }) => (
  <Card3D d={d} x={90} y={y} w={900} h={190} colore={c}>
    <div style={{ position: "absolute", left: 40, top: 22, fontFamily: ANTON, fontSize: 100, lineHeight: 1, color: "#fff" }}>{t}</div>
    <div style={{ position: "absolute", left: 44, top: 126, fontFamily: MANO, fontSize: 52, fontWeight: 700, color: c }}>{s}</div>
  </Card3D>
);

// Ritardo del labiale negli spezzoni Dreamina (misurato sull'audio): si parte da lì
const SCENE: Scena[] = [
  { from: 0, dur: 138, clip: "T1.mp4", inizio: 15, sopra: (
    <>
      <Conta d={20} da={0} a={100000} durata={24} top={880} suffisso=" $" size={170} />
      <Sticker d={110} top={1165} size={110} bg={VIOLA}>19 bot</Sticker>
    </>
  ) },
  { from: 138, dur: 152, clip: "R1.mp4", sopra: (
    <>
      <Nota x={90} y={330} d={24} rot={-4} color="#fff" size={84}>non li scrivo io…</Nota>
      <Sticker d={121} top={960} size={190} bg={`linear-gradient(120deg,${VIOLA},${ACCENTO})` as string}>Algory</Sticker>
    </>
  ) },
  { from: 290, dur: 133, clip: "T2.mp4", inizio: 9, sopra: (
    <>
      <Conta d={47} da={0} a={4000} durata={30} top={960} size={170} />
      <Sticker d={58} top={1170} size={70} color={ACCENTO} fino={104}>strategie</Sticker>
      <Sticker d={105} top={1170} size={70} color={VERDE}>backtest sul passato</Sticker>
    </>
  ) },
  { from: 423, dur: 125, grafica: <Cadono /> },
  { from: 548, dur: 134, clip: "T3.mp4", inizio: 17, sopra: (
    <>
      <Sticker d={56} top={940} size={210} bg={VIOLA}>0,25%</Sticker>
      <Nota x={330} y={1190} d={80} rot={-4} color="#fff" size={80}>di rischio</Nota>
    </>
  ) },
  { from: 682, dur: 160, grafica: <Scala /> },
  { from: 842, dur: 160, clip: "T4.mp4", inizio: 8, sopra: (
    <>
      <Barrata d={8} top={930} />
      <Sticker d={32} top={1110} size={96} bg={VIOLA} fino={100}>Nessuna promessa</Sticker>
      <Sticker d={110} top={1080} size={120} color={ROSSO} rot={2}>−1,1% · −0,6%</Sticker>
    </>
  ) },
  { from: 1002, dur: 137, clip: "R2.mp4", sopra: (
    <>
      <Carta d={49} y={330} t="STRATEGIE" s="come le scelgo" c={ACCENTO} />
      <Carta d={76} y={560} t="CONTO" s="il saldo vero" c={ACCENTO} />
      <Carta d={98} y={790} t="PERDITE" s="comprese" c={ROSSO} />
    </>
  ) },
  { from: 1139, dur: 144, clip: "T5.mp4", inizio: 8, sopra: (
    <>
      <BoxCommento d={13} parola="ALGO" top={1520} />
      <Sticker d={114} top={1680} size={100} bg={VIOLA}>Seguimi</Sticker>
    </>
  ) },
];

export const ALGORY1C: React.FC = () => <FormatC scene={SCENE} parole={PAROLE} chiave={CHIAVE} cartella={CARTELLA} etichetta="ALGORY · EP. 1" />;

// Copertina del format: foto del set a tutto schermo, titolo in alto dentro la zona 4:5
export const CoverC: React.FC<{ titolo: string; sotto: string; numero: string; img: string }> = ({ titolo, sotto, numero, img }) => (
  <div style={{ position: "absolute", inset: 0, backgroundColor: "#0b0a10" }}>
    <img src={staticFile(img)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 30%", transform: "scale(1.0) translateY(330px)" }} />
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(#0b0a10f2 0%, #0b0a10cc 22%, transparent 42%, transparent 70%, #0b0a10cc 100%)" }} />
    <div style={{ position: "absolute", left: 70, right: 70, top: 330, fontFamily: ANTON, fontSize: 132, lineHeight: 1.02, color: "#fff", textTransform: "uppercase", textShadow: "0 8px 30px #000" }}>{titolo}</div>
    <div style={{ position: "absolute", right: 70, top: 300, fontFamily: ANTON, fontSize: 64, color: "#fff", background: VIOLA, padding: "0 20px", borderRadius: 14 }}>{numero}</div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1420, textAlign: "center" }}>
      <span style={{ fontFamily: ANTON, fontSize: 92, color: "#fff", background: VIOLA, padding: "4px 32px", borderRadius: 16, textTransform: "uppercase", boxShadow: `0 0 60px ${VIOLA}` }}>{sotto}</span>
    </div>
  </div>
);
export const CoverAlgory1: React.FC = () => <CoverC titolo="Il software dei miei bot" sotto="Si chiama Algory" numero="#1" img={`${CARTELLA}/setA.png`} />;
