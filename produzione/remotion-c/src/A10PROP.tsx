// Attualità di C #10 «Lo screenshot lo fa chi vince» — v1 (08/11/2026), formato SchedeC.
// Spunto: reel Vaga FX DfaOoEEgLlp. Fatto verificato: Finance Magnates, 7% di ~300.000 conti prop pagati almeno una volta.
import React from "react";
import { CoverSchedeC, durataEpisodio, EpisodioC, ReelSchedeC } from "./SchedeC";
import { CHIAVE_A10PROP, PAROLE_A10PROP } from "./a10prop-parole";
import { FINE_VOCE, SCHEDE } from "./a10prop-schede";

const EP: EpisodioC = {
  cartella: "a10prop",
  numero: 10,
  parole: PAROLE_A10PROP,
  chiave: CHIAVE_A10PROP,
  schede: SCHEDE,
  fine: FINE_VOCE,
  finale: { righe: ["Lo screenshot", "lo fa", "chi *vince"], nota: "il conto lo pagano gli altri" },
};

export const DURATA_A10 = durataEpisodio(EP);
export const A10PROP: React.FC = () => <ReelSchedeC e={EP} />;
export const CoverA10PROP: React.FC = () => <CoverSchedeC cartella="a10prop" />;
