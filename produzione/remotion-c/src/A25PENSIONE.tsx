// Attualità di C #25 «20 anni di contributi contro zero» (17/11/2026). Fatti e fonti nel file FATTI dell'episodio.
import React from "react";
import { CoverSchedeC, durataEpisodio, EpisodioC, ReelSchedeC } from "./SchedeC";
import { CHIAVE_A25PENSIONE, PAROLE_A25PENSIONE } from "./a25pensione-parole";
import { FINE_VOCE, SCHEDE } from "./a25pensione-schede";

const EP: EpisodioC = {
  cartella: "a25pensione",
  numero: 25,
  parole: PAROLE_A25PENSIONE,
  chiave: CHIAVE_A25PENSIONE,
  schede: SCHEDE,
  fine: FINE_VOCE,
  finale: { righe: ["20 anni di contributi", "*valgono 66 €"], nota: "minimo 611,85 € · assegno sociale 546,24 €" },
};

export const DURATA_A25PENSIONE = durataEpisodio(EP);
export const A25PENSIONE: React.FC = () => <ReelSchedeC e={EP} />;
export const CoverA25PENSIONE: React.FC = () => <CoverSchedeC cartella="a25pensione" />;
