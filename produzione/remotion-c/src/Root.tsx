import { Composition } from "remotion";
import { R8 } from "./R8";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="R8" component={R8} durationInFrames={990} fps={30} width={1080} height={1920} />
    </>
  );
};
