// Attualità di C #12 «Col senno di poi» — v1 (09/11/2026). Spunto: reel Amedeo Iasci Dfe8sZmqPe0. Prezzi Yahoo Finance 24/02/2022 → 06/11/2026.
import React from "react";
import { CoverSchedeC, durataEpisodio, EpisodioC, ReelSchedeC } from "./SchedeC";
import { CHIAVE_A12ARMI, PAROLE_A12ARMI } from "./a12armi-parole";
import { FINE_VOCE, SCHEDE } from "./a12armi-schede";

const EP: EpisodioC = {
  cartella: "a12armi",
  numero: 12,
  parole: PAROLE_A12ARMI,
  chiave: CHIAVE_A12ARMI,
  schede: SCHEDE,
  fine: FINE_VOCE,
  finale: { righe: ["Col senno", "di poi", "vincono *tutti"], nota: "il primo giorno no" },
};

export const DURATA_A12ARMI = durataEpisodio(EP);
export const A12ARMI: React.FC = () => <ReelSchedeC e={EP} />;
export const CoverA12ARMI: React.FC = () => <CoverSchedeC cartella="a12armi" />;
