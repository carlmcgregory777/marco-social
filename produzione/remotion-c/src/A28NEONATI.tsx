// Attualità di C #28 «1.800 € a tuo figlio (se nasce dal 2027)» (22/11/2026). Fatti e fonti nel file FATTI dell'episodio.
import React from "react";
import { CoverSchedeC, durataEpisodio, EpisodioC, ReelSchedeC } from "./SchedeC";
import { CHIAVE_A28NEONATI, PAROLE_A28NEONATI } from "./a28neonati-parole";
import { FINE_VOCE, SCHEDE } from "./a28neonati-schede";

const EP: EpisodioC = {
  cartella: "a28neonati",
  numero: 28,
  parole: PAROLE_A28NEONATI,
  chiave: CHIAVE_A28NEONATI,
  schede: SCHEDE,
  fine: FINE_VOCE,
  finale: { righe: ["Nato un giorno prima?", "*0 €"], nota: "fondo nuovi nati, manovra 2027" },
};

export const DURATA_A28NEONATI = durataEpisodio(EP);
export const A28NEONATI: React.FC = () => <ReelSchedeC e={EP} />;
export const CoverA28NEONATI: React.FC = () => <CoverSchedeC cartella="a28neonati" />;
