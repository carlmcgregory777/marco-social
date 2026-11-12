// Attualità di C #17 «Quanto paghi per non sapere» (12/11/2026). Spunto: reel di Mik Cosentino DfonBfKo__H. Fatti: ANSA, Il Giornale, Federconsumatori, Tg1/Antitrust.
import React from "react";
import { CoverSchedeC, durataEpisodio, EpisodioC, ReelSchedeC } from "./SchedeC";
import { CHIAVE_A17LIBRO, PAROLE_A17LIBRO } from "./a17libro-parole";
import { FINE_VOCE, SCHEDE } from "./a17libro-schede";

const EP: EpisodioC = {
  cartella: "a17libro",
  numero: 17,
  parole: PAROLE_A17LIBRO,
  chiave: CHIAVE_A17LIBRO,
  schede: SCHEDE,
  fine: FINE_VOCE,
  finale: { righe: ["Quanto paghi", "*per non sapere?"], nota: "805 € di libri, zero controlli" },
};

export const DURATA_A17LIBRO = durataEpisodio(EP);
export const A17LIBRO: React.FC = () => <ReelSchedeC e={EP} />;
export const CoverA17LIBRO: React.FC = () => <CoverSchedeC cartella="a17libro" />;
