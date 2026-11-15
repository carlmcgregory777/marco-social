// Attualità di C #19 «Chi guarda già i tuoi pagamenti» (15/11/2026). Fatti e fonti nel file FATTI dell'episodio.
import React from "react";
import { CoverSchedeC, durataEpisodio, EpisodioC, ReelSchedeC } from "./SchedeC";
import { CHIAVE_A19EURO, PAROLE_A19EURO } from "./a19euro-parole";
import { FINE_VOCE, SCHEDE } from "./a19euro-schede";

const EP: EpisodioC = {
  cartella: "a19euro",
  numero: 19,
  parole: PAROLE_A19EURO,
  chiave: CHIAVE_A19EURO,
  schede: SCHEDE,
  fine: FINE_VOCE,
  finale: { righe: ["Chi guarda già", "*i tuoi pagamenti?"], nota: "euro digitale: si tratta il 18 novembre" },
};

export const DURATA_A19EURO = durataEpisodio(EP);
export const A19EURO: React.FC = () => <ReelSchedeC e={EP} />;
export const CoverA19EURO: React.FC = () => <CoverSchedeC cartella="a19euro" />;
