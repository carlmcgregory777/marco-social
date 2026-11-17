// Attualità di C #23 «100 € di aumento: quanti ne vedi?» (17/11/2026). Fatti e fonti nel file FATTI dell'episodio.
import React from "react";
import { CoverSchedeC, durataEpisodio, EpisodioC, ReelSchedeC } from "./SchedeC";
import { CHIAVE_A23AUMENTO, PAROLE_A23AUMENTO } from "./a23aumento-parole";
import { FINE_VOCE, SCHEDE } from "./a23aumento-schede";

const EP: EpisodioC = {
  cartella: "a23aumento",
  numero: 23,
  parole: PAROLE_A23AUMENTO,
  chiave: CHIAVE_A23AUMENTO,
  schede: SCHEDE,
  fine: FINE_VOCE,
  finale: { righe: ["100 € lordi.", "*Ne vedi 56"], nota: "lordo e netto non sono uguali" },
};

export const DURATA_A23AUMENTO = durataEpisodio(EP);
export const A23AUMENTO: React.FC = () => <ReelSchedeC e={EP} />;
export const CoverA23AUMENTO: React.FC = () => <CoverSchedeC cartella="a23aumento" />;
