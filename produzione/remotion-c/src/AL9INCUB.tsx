// Dentro Algory #9 «Prima il 25%, poi tutto» (15/11/2026). Schermate di Algory a tutto schermo, voce di C.
import React from "react";
import { CoverSchedeC, durataEpisodio, EpisodioC, ReelSchedeC } from "./SchedeC";
import { CHIAVE_AL9INCUB, PAROLE_AL9INCUB } from "./al9incub-parole";
import { FINE_VOCE, SCHEDE } from "./al9incub-schede";

const EP: EpisodioC = {
  cartella: "al9incub",
  numero: 9,
  etichetta: "DENTRO ALGORY · #9",
  parole: PAROLE_AL9INCUB,
  chiave: CHIAVE_AL9INCUB,
  schede: SCHEDE,
  fine: FINE_VOCE,
  finale: {
    righe: ["Prima il 25%", "*poi tutto"],
    nota: "codice STANGA20 · link in bio",
    avviso: "#ad · link affiliato · Il trading comporta un alto rischio di perdita. I backtest non garantiscono risultati futuri.",
  },
};

export const DURATA_AL9INCUB = durataEpisodio(EP);
export const AL9INCUB: React.FC = () => <ReelSchedeC e={EP} />;
export const CoverAL9INCUB: React.FC = () => <CoverSchedeC cartella="al9incub" />;
