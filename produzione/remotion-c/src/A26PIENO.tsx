// Attualità di C #26 «Il pieno da 50 €: quanti vanno allo Stato?» (17/11/2026). Fatti e fonti nel file FATTI dell'episodio.
import React from "react";
import { CoverSchedeC, durataEpisodio, EpisodioC, ReelSchedeC } from "./SchedeC";
import { CHIAVE_A26PIENO, PAROLE_A26PIENO } from "./a26pieno-parole";
import { FINE_VOCE, SCHEDE } from "./a26pieno-schede";

const EP: EpisodioC = {
  cartella: "a26pieno",
  numero: 26,
  parole: PAROLE_A26PIENO,
  chiave: CHIAVE_A26PIENO,
  schede: SCHEDE,
  fine: FINE_VOCE,
  finale: { righe: ["50 € di pieno.", "*26 di tasse"], nota: "accisa + IVA, anche sull'accisa" },
};

export const DURATA_A26PIENO = durataEpisodio(EP);
export const A26PIENO: React.FC = () => <ReelSchedeC e={EP} />;
export const CoverA26PIENO: React.FC = () => <CoverSchedeC cartella="a26pieno" />;
