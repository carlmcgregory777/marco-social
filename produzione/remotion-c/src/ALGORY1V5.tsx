// ALGORY #1 v5 (01/11/2026): gancio collaudato, parlato stile Cosentino, set A4/B4 rifatto.
// Montaggio che sottolinea le enfasi: titolo fisso nero in alto, jump cut tra le frasi,
// zoom di scatto + scossa + colpo sonoro sulle parole forti, sottotitoli piccoli con la chiave in viola.
// Voce: voce-v5-montata.wav (algory1/dreamina/sd25/v5/monta_voce.py) = audio delle clip nelle scene parlate.
import React from "react";
import { staticFile } from "remotion";
import { PAROLE5 } from "./algory1v5-parole";
import { Barrata, Cadono, Carta, CoverC, Diciannove, Scala } from "./ALGORY1C";
import { ACCENTO, ANTON, BoxCommento, Conta, FormatC, MACCHINA, Nota, ROSSO, Scena, SfondoSet, Sticker, TitoloFisso, VIOLA } from "./FormatC";

const CARTELLA = "algory1v5";
const SET = `${CARTELLA}/A4.png`;
const CHIAVE = /^(19|100\.000|ALGORY|ALGO|SOFTWARE|MIGLIAIA|SPECIALE|TRUCCO|CADONO|TUTTE|0,25%|PIÙ|FUORI|ROSSI|PERDITE|COMMENTA|SEGUIMI)$/;

// Parole forti (secondi sulla voce montata): qui scattano zoom, scossa e colpo sonoro (stessi tempi in algory1/sfx-v5.json)
export const ENFASI5 = [1.93, 8.07, 12.8, 13.97, 17.85, 19.19, 24.73, 29.2, 35.69, 38.92, 40.2];

// Scene parlate: la clip parte da `inizio` (silenzio iniziale tagliato), audio e labiale coincidono
const SCENE: Scena[] = [
  { from: 0, dur: 135, clip: "T1.mp4", inizio: 14 },
  { from: 135, dur: 129, grafica: <Diciannove img={SET} />, sopra: (
    <>
      <Nota x={90} y={470} d={29} rot={-4} color="#fff" size={84}>non li scrivo io…</Nota>
      <Sticker d={107} top={1000} size={190} bg={`linear-gradient(120deg,${VIOLA},${ACCENTO})` as string}>Algory</Sticker>
    </>
  ) },
  { from: 264, dur: 150, clip: "T2.mp4", sopra: (
    <>
      <Conta d={37} da={0} a={4000} durata={30} top={1170} size={120} />
      <Sticker d={78} top={1320} size={56} color={ACCENTO} fino={112}>backtest sul passato</Sticker>
      <Nota x={250} y={1300} d={120} rot={-3} color="#fff" size={70}>niente di speciale</Nota>
    </>
  ) },
  { from: 414, dur: 200, grafica: <Cadono img={SET} top={430} scala={0.9} caduta={122} scritta={162} testo="Quasi tutte" /> },
  { from: 614, dur: 145, clip: "T3.mp4", sopra: (
    <>
      <Sticker d={59} top={1530} size={100} bg={VIOLA} fino={125}>0,25%</Sticker>
      <Sticker d={128} top={1530} size={100} bg={ROSSO}>Non di più</Sticker>
    </>
  ) },
  { from: 759, dur: 149, grafica: <Scala img={SET} top={430} scala={0.9} passi={[35, 76]} rossoDa={97} viaDa={117} nuovo={134} />, sopra: (
    <Sticker d={117} top={700} size={130} bg={ROSSO} fino={133}>Fuori</Sticker>
  ) },
  { from: 908, dur: 178, clip: "T4.mp4", sopra: (
    <>
      <Barrata d={48} top={470} />
      <Sticker d={79} top={600} size={96} bg={VIOLA} fino={158}>Nessuna promessa</Sticker>
      <Sticker d={163} top={600} size={120} color={ROSSO} rot={2}>−1,1% · −0,6%</Sticker>
    </>
  ) },
  { from: 1086, dur: 108, grafica: <SfondoSet img={SET} />, sopra: (
    <>
      <Sticker d={28} top={640} size={130} bg={VIOLA} fino={47}>Anche tu</Sticker>
      <Carta d={49} y={470} t="STRATEGIE" s="come le scelgo" c={ACCENTO} />
      <Carta d={68} y={700} t="CONTO" s="il saldo vero" c={ACCENTO} />
      <Carta d={81} y={930} t="PERDITE" s="comprese" c={ROSSO} />
    </>
  ) },
  { from: 1194, dur: 143, clip: "T5.mp4", inizio: 9, sopra: (
    <>
      <BoxCommento d={4} parola="ALGO" top={1540} />
      <Sticker d={120} top={1680} size={100} bg={VIOLA}>Seguimi</Sticker>
    </>
  ) },
];

export const ALGORY1V5: React.FC = () => (
  <FormatC
    scene={SCENE}
    parole={PAROLE5}
    chiave={CHIAVE}
    cartella={CARTELLA}
    etichetta="ALGORY · EP. 1"
    titolo={<TitoloFisso righe={["Ho dato 100.000 $", "a 19 bot di trading"]} svolta="(ecco cosa fanno)" />}
    piccoli
    jump
    enfasi={ENFASI5}
    sottotitoliTop={1420}
    musicaVol={0.1}
  />
);

// Copertina v5: stesso gancio del video, C del set A4
export const CoverAlgory1V5: React.FC = () => <CoverC titolo={"Ho dato 100.000 $ a 19 bot"} sotto="Ecco cosa fanno" numero="#1" img={SET} sposta={0} destra={230} />;

// Copertina «a impatto» (02/11): faccia sorpresa di C in primissimo piano, numero gigante, 19 bot accesi sotto
export const CoverAlgory1V5Impatto: React.FC = () => (
  <div style={{ position: "absolute", inset: 0, backgroundColor: "#0b0a10", overflow: "hidden" }}>
    <img src={staticFile(`${CARTELLA}/cover-faccia.png`)} style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, objectFit: "cover", transform: "translateY(200px) scale(1.18)", transformOrigin: "50% 30%", filter: "contrast(1.12) saturate(1.15)" }} />
    <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 60% 38% at 50% 52%, transparent 55%, #0b0a10cc 100%)` }} />
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(#0b0a10 0%, #0b0a10f5 17%, #0b0a1088 27%, transparent 36%, transparent 72%, #0b0a10dd 86%, #0b0a10 100%)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center", fontFamily: MACCHINA, fontSize: 52, color: "#fff", letterSpacing: 2 }}>
      <span style={{ background: "#000", padding: "4px 18px" }}>HO DATO</span>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 360, textAlign: "center", fontFamily: ANTON, fontSize: 250, lineHeight: 1, color: "#fff", WebkitTextStroke: "14px #000", paintOrder: "stroke fill", textShadow: `0 0 70px ${VIOLA}, 0 0 140px ${ACCENTO}88` }}>100.000 $</div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 640, textAlign: "center" }}>
      <span style={{ display: "inline-block", fontFamily: ANTON, fontSize: 130, lineHeight: 1.05, color: "#fff", background: VIOLA, padding: "0 40px", borderRadius: 20, transform: "rotate(-4deg)", boxShadow: `0 20px 60px #000c, 0 0 80px ${VIOLA}` }}>A 19 BOT</span>
    </div>
    {Array.from({ length: 19 }).map((_, i) => {
      const s = 46;
      const x = 540 - (19 * (s + 8)) / 2 + i * (s + 8);
      return (
        <div key={i} style={{ position: "absolute", left: x, top: 1440, width: s, height: s, borderRadius: 11, background: ACCENTO, boxShadow: `0 0 22px ${ACCENTO}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
          <div style={{ width: 7, height: 11, borderRadius: 2, background: "#0b0a10" }} />
          <div style={{ width: 7, height: 11, borderRadius: 2, background: "#0b0a10" }} />
        </div>
      );
    })}
    <div style={{ position: "absolute", left: 0, right: 0, top: 1515, textAlign: "center", fontFamily: MACCHINA, fontSize: 50, color: "#ffd84d" }}>
      <span style={{ background: "#000", padding: "4px 18px" }}>(ECCO COSA FANNO)</span>
    </div>
    <div style={{ position: "absolute", right: 60, top: 298, fontFamily: ANTON, fontSize: 40, lineHeight: 1.3, color: "#fff", background: VIOLA, padding: "0 16px", borderRadius: 10 }}>#1</div>
  </div>
);
