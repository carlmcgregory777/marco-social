// Attualità di C #9 «L'etichetta non è la prova» — v2 (08/11/2026), formato SchedeC (come A6 v5).
// La v1 è in attualita/A9-machine-learning/lavoro/A9MACHINE-v1.tsx.txt.
// Fatto verificato: SEC 18/03/2024, prime azioni per «AI washing», due consulenti, 400.000 $ (sec.gov 2024-36).
import React from "react";
import { CoverSchedeC, durataEpisodio, EpisodioC, ReelSchedeC } from "./SchedeC";
import { CHIAVE_A9MACHINE, PAROLE_A9MACHINE } from "./a9machine-parole";
import { FINE_VOCE, SCHEDE } from "./a9machine-schede";

const EP: EpisodioC = {
  cartella: "a9machine",
  numero: 9,
  parole: PAROLE_A9MACHINE,
  chiave: CHIAVE_A9MACHINE,
  schede: SCHEDE,
  fine: FINE_VOCE,
  finale: { righe: ["L'etichetta", "non è", "la *prova"], nota: "su quali dati l'hai testato?" },
};

export const DURATA_A9 = durataEpisodio(EP);
export const A9MACHINE: React.FC = () => <ReelSchedeC e={EP} />;
export const CoverA9MACHINE: React.FC = () => <CoverSchedeC cartella="a9machine" />;
