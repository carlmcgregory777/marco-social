import { Composition } from "remotion";
import { R8 } from "./R8";
import { R9 } from "./R9";
import { ALGORY1 } from "./ALGORY1";
import { ALGORY1C, CoverAlgory1 } from "./ALGORY1C";
import { ALGORY1V5, CoverAlgory1V5, CoverAlgory1V5Impatto } from "./ALGORY1V5";
import { A1POLONIA, A1PoloniaGrafiche, CoverA1Polonia } from "./A1POLONIA";
import { A2ROMA, CoverA2Roma, DURATA_A2 } from "./A2ROMA";
import { A4MIDTERM, CoverA4, DURATA_A4 } from "./A4MIDTERM";
import { A5MILANO, CoverA5, DURATA_A5 } from "./A5MILANO";
import { A7SABELLA, CoverA7SABELLA, DURATA_A7 } from "./A7SABELLA";
import { A6ORACLE, CoverA6ORACLE, DURATA_A6 } from "./A6ORACLE";
import { A8MERCATO, CoverA8MERCATO, DURATA_A8 } from "./A8MERCATO";
import { A9MACHINE, CoverA9MACHINE, DURATA_A9 } from "./A9MACHINE";
import { A10PROP, CoverA10PROP, DURATA_A10 } from "./A10PROP";
import { A13QI, CoverA13QI, DURATA_A13QI } from "./A13QI";
import { A15BOLLETTE, CoverA15BOLLETTE, DURATA_A15BOLLETTE } from "./A15BOLLETTE";
import { A16BOMBA, CoverA16BOMBA, DURATA_A16BOMBA } from "./A16BOMBA";
import { A17LIBRO, CoverA17LIBRO, DURATA_A17LIBRO } from "./A17LIBRO";
import { A14TAGLIO, CoverA14TAGLIO, DURATA_A14TAGLIO } from "./A14TAGLIO";
import { A12ARMI, CoverA12ARMI, DURATA_A12ARMI } from "./A12ARMI";
import { A11PENS, CoverA11PENS, DURATA_A11PENS } from "./A11PENS";
import { ALGORY11, CoverA11, DURATA_A11 } from "./ALGORY11";
import { HFAFF, DURATA_HF, CoverHF, CoverHF2 } from "./HFAFF";
import { HF3, CoverHF3, DURATA_HF3 } from "./HF3";
import { SHORTSC, CoverSHORTSC, DURATA_SHORTSC } from "./SHORTSC";
import { L0, DURATA_L0 } from "./L0";
import { P1HORMOZI, DURATA_P1HORMOZI } from "./P1HORMOZI";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="L0" component={L0} durationInFrames={DURATA_L0} fps={30} width={1920} height={1080} />
      <Composition id="P1HORMOZI" component={P1HORMOZI} durationInFrames={DURATA_P1HORMOZI} fps={30} width={1920} height={1080} />
      <Composition id="A4MIDTERM" component={A4MIDTERM} durationInFrames={DURATA_A4} fps={30} width={1080} height={1920} />
      <Composition id="A5MILANO" component={A5MILANO} durationInFrames={DURATA_A5} fps={30} width={1080} height={1920} />
      <Composition id="CoverA5" component={CoverA5} durationInFrames={1} fps={30} width={1080} height={1920} />
      <Composition id="A7SABELLA" component={A7SABELLA} durationInFrames={DURATA_A7} fps={30} width={1080} height={1920} />
      <Composition id="CoverA7SABELLA" component={CoverA7SABELLA} durationInFrames={1} fps={30} width={1080} height={1920} />
      <Composition id="A6ORACLE" component={A6ORACLE} durationInFrames={DURATA_A6} fps={30} width={1080} height={1920} />
      <Composition id="CoverA6ORACLE" component={CoverA6ORACLE} durationInFrames={1} fps={30} width={1080} height={1920} />
      <Composition id="A8MERCATO" component={A8MERCATO} durationInFrames={DURATA_A8} fps={30} width={1080} height={1920} />
      <Composition id="CoverA8MERCATO" component={CoverA8MERCATO} durationInFrames={1} fps={30} width={1080} height={1920} />
      <Composition id="A9MACHINE" component={A9MACHINE} durationInFrames={DURATA_A9} fps={30} width={1080} height={1920} />
      <Composition id="CoverA9MACHINE" component={CoverA9MACHINE} durationInFrames={1} fps={30} width={1080} height={1920} />
      <Composition id="A10PROP" component={A10PROP} durationInFrames={DURATA_A10} fps={30} width={1080} height={1920} />
      <Composition id="CoverA10PROP" component={CoverA10PROP} durationInFrames={1} fps={30} width={1080} height={1920} />
      <Composition id="A13QI" component={A13QI} durationInFrames={DURATA_A13QI} fps={30} width={1080} height={1920} />
      <Composition id="A14TAGLIO" component={A14TAGLIO} durationInFrames={DURATA_A14TAGLIO} fps={30} width={1080} height={1920} />
      <Composition id="CoverA14TAGLIO" component={CoverA14TAGLIO} durationInFrames={1} fps={30} width={1080} height={1920} />
      <Composition id="A15BOLLETTE" component={A15BOLLETTE} durationInFrames={DURATA_A15BOLLETTE} fps={30} width={1080} height={1920} />
      <Composition id="CoverA15BOLLETTE" component={CoverA15BOLLETTE} durationInFrames={1} fps={30} width={1080} height={1920} />
      <Composition id="A16BOMBA" component={A16BOMBA} durationInFrames={DURATA_A16BOMBA} fps={30} width={1080} height={1920} />
      <Composition id="CoverA16BOMBA" component={CoverA16BOMBA} durationInFrames={1} fps={30} width={1080} height={1920} />
      <Composition id="A17LIBRO" component={A17LIBRO} durationInFrames={DURATA_A17LIBRO} fps={30} width={1080} height={1920} />
      <Composition id="CoverA17LIBRO" component={CoverA17LIBRO} durationInFrames={1} fps={30} width={1080} height={1920} />
      <Composition id="CoverA13QI" component={CoverA13QI} durationInFrames={1} fps={30} width={1080} height={1920} />
      <Composition id="A12ARMI" component={A12ARMI} durationInFrames={DURATA_A12ARMI} fps={30} width={1080} height={1920} />
      <Composition id="CoverA12ARMI" component={CoverA12ARMI} durationInFrames={1} fps={30} width={1080} height={1920} />
      <Composition id="A11PENS" component={A11PENS} durationInFrames={DURATA_A11PENS} fps={30} width={1080} height={1920} />
      <Composition id="CoverA11PENS" component={CoverA11PENS} durationInFrames={1} fps={30} width={1080} height={1920} />
      <Composition id="ALGORY11" component={ALGORY11} durationInFrames={DURATA_A11} fps={30} width={1080} height={1920} />
      <Composition id="CoverA11" component={CoverA11} durationInFrames={1} fps={30} width={1080} height={1920} />
      <Composition id="CoverA4" component={CoverA4} durationInFrames={1} fps={30} width={1080} height={1920} />
      <Composition id="SHORTSC" component={SHORTSC} durationInFrames={DURATA_SHORTSC} fps={30} width={1080} height={1920} />
      <Composition id="CoverSHORTSC" component={CoverSHORTSC} durationInFrames={1} fps={30} width={1080} height={1920} />
      <Composition id="HF3" component={HF3} durationInFrames={DURATA_HF3} fps={30} width={1080} height={1920} />
      <Composition id="CoverHF3" component={CoverHF3} durationInFrames={1} fps={30} width={1080} height={1920} />
      <Composition id="CoverHF2" component={CoverHF2} durationInFrames={1} fps={30} width={1080} height={1920} />
      <Composition id="CoverHF" component={CoverHF} durationInFrames={1} fps={30} width={1080} height={1920} />
      <Composition id="HFAFF" component={HFAFF} durationInFrames={DURATA_HF} fps={30} width={1080} height={1920} />
      <Composition id="R8" component={R8} durationInFrames={990} fps={30} width={1080} height={1920} />
      <Composition id="R9" component={R9} durationInFrames={1843} fps={30} width={1080} height={1920} />
      <Composition id="ALGORY1" component={ALGORY1} durationInFrames={1290} fps={30} width={1080} height={1920} />
      <Composition id="ALGORY1C" component={ALGORY1C} durationInFrames={1283} fps={30} width={1080} height={1920} />
      <Composition id="ALGORY1V5" component={ALGORY1V5} durationInFrames={1337} fps={30} width={1080} height={1920} />
      <Composition id="A1POLONIA" component={A1POLONIA} durationInFrames={1371} fps={30} width={1080} height={1920} />
      <Composition id="A2ROMA" component={A2ROMA} durationInFrames={DURATA_A2} fps={30} width={1080} height={1920} />
      <Composition id="CoverA2Roma" component={CoverA2Roma} durationInFrames={1} fps={30} width={1080} height={1920} />
      <Composition id="CoverA1Polonia" component={CoverA1Polonia} durationInFrames={1} fps={30} width={1080} height={1920} />
      <Composition id="A1PoloniaGrafiche" component={A1PoloniaGrafiche} durationInFrames={1535} fps={30} width={1080} height={1920} />
      <Composition id="CoverAlgory1V5" component={CoverAlgory1V5} durationInFrames={1} fps={30} width={1080} height={1920} />
      <Composition id="CoverAlgory1V5Impatto" component={CoverAlgory1V5Impatto} durationInFrames={1} fps={30} width={1080} height={1920} />
      <Composition id="CoverAlgory1" component={CoverAlgory1} durationInFrames={1} fps={30} width={1080} height={1920} />
    </>
  );
};
