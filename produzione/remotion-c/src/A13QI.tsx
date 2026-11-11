// Attualità di C #13 «Un titolo non è una prova» — v1 (09/11/2026). Spunto: reel Mik Cosentino DfZMOGkIpsc. Fatti: Korea Herald, Vice, SFI Finfluencers.
import React from "react";
import { CoverSchedeC, durataEpisodio, EpisodioC, ReelSchedeC } from "./SchedeC";
import { CHIAVE_A13QI, PAROLE_A13QI } from "./a13qi-parole";
import { FINE_VOCE, SCHEDE } from "./a13qi-schede";

const EP: EpisodioC = {
  cartella: "a13qi",
  numero: 13,
  parole: PAROLE_A13QI,
  chiave: CHIAVE_A13QI,
  schede: SCHEDE,
  fine: FINE_VOCE,
  finale: { righe: ["Un titolo", "non è", "una *prova"], nota: "chiedi i numeri" },
};

export const DURATA_A13QI = durataEpisodio(EP);
export const A13QI: React.FC = () => <ReelSchedeC e={EP} />;
export const CoverA13QI: React.FC = () => <CoverSchedeC cartella="a13qi" />;
