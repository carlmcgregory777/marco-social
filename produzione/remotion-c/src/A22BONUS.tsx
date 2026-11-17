// Attualità di C #22 «L'euro in più che ti costa un bonus» (17/11/2026). Fatti e fonti nel file FATTI dell'episodio.
import React from "react";
import { CoverSchedeC, durataEpisodio, EpisodioC, ReelSchedeC } from "./SchedeC";
import { CHIAVE_A22BONUS, PAROLE_A22BONUS } from "./a22bonus-parole";
import { FINE_VOCE, SCHEDE } from "./a22bonus-schede";

const EP: EpisodioC = {
  cartella: "a22bonus",
  numero: 22,
  parole: PAROLE_A22BONUS,
  chiave: CHIAVE_A22BONUS,
  schede: SCHEDE,
  fine: FINE_VOCE,
  finale: { righe: ["Un euro in più.", "*Zero bonus"], nota: "i bonus dovrebbero scendere a scivolo" },
};

export const DURATA_A22BONUS = durataEpisodio(EP);
export const A22BONUS: React.FC = () => <ReelSchedeC e={EP} />;
export const CoverA22BONUS: React.FC = () => <CoverSchedeC cartella="a22bonus" />;
