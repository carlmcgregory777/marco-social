// Attualità di C #27 «Il taglio delle tasse che non ti arriva» (22/11/2026). Fatti e fonti nel file FATTI dell'episodio.
import React from "react";
import { CoverSchedeC, durataEpisodio, EpisodioC, ReelSchedeC } from "./SchedeC";
import { CHIAVE_A27IRPEF, PAROLE_A27IRPEF } from "./a27irpef-parole";
import { FINE_VOCE, SCHEDE } from "./a27irpef-schede";

const EP: EpisodioC = {
  cartella: "a27irpef",
  numero: 27,
  parole: PAROLE_A27IRPEF,
  chiave: CHIAVE_A27IRPEF,
  schede: SCHEDE,
  fine: FINE_VOCE,
  finale: { righe: ["Sotto i 50.000 €?", "*0 €"], nota: "taglio IRPEF, manovra 2027" },
};

export const DURATA_A27IRPEF = durataEpisodio(EP);
export const A27IRPEF: React.FC = () => <ReelSchedeC e={EP} />;
export const CoverA27IRPEF: React.FC = () => <CoverSchedeC cartella="a27irpef" />;
