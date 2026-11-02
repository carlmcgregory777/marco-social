import { Composition } from "remotion";
import { R8 } from "./R8";
import { R9 } from "./R9";
import { ALGORY1 } from "./ALGORY1";
import { ALGORY1C, CoverAlgory1 } from "./ALGORY1C";
import { ALGORY1V5, CoverAlgory1V5, CoverAlgory1V5Impatto } from "./ALGORY1V5";
import { A1POLONIA, A1PoloniaGrafiche, CoverA1Polonia } from "./A1POLONIA";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="R8" component={R8} durationInFrames={990} fps={30} width={1080} height={1920} />
      <Composition id="R9" component={R9} durationInFrames={1843} fps={30} width={1080} height={1920} />
      <Composition id="ALGORY1" component={ALGORY1} durationInFrames={1290} fps={30} width={1080} height={1920} />
      <Composition id="ALGORY1C" component={ALGORY1C} durationInFrames={1283} fps={30} width={1080} height={1920} />
      <Composition id="ALGORY1V5" component={ALGORY1V5} durationInFrames={1337} fps={30} width={1080} height={1920} />
      <Composition id="A1POLONIA" component={A1POLONIA} durationInFrames={1371} fps={30} width={1080} height={1920} />
      <Composition id="CoverA1Polonia" component={CoverA1Polonia} durationInFrames={1} fps={30} width={1080} height={1920} />
      <Composition id="A1PoloniaGrafiche" component={A1PoloniaGrafiche} durationInFrames={1535} fps={30} width={1080} height={1920} />
      <Composition id="CoverAlgory1V5" component={CoverAlgory1V5} durationInFrames={1} fps={30} width={1080} height={1920} />
      <Composition id="CoverAlgory1V5Impatto" component={CoverAlgory1V5Impatto} durationInFrames={1} fps={30} width={1080} height={1920} />
      <Composition id="CoverAlgory1" component={CoverAlgory1} durationInFrames={1} fps={30} width={1080} height={1920} />
    </>
  );
};
