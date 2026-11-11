// Attualità di C #14 «La clip è vera. La notizia è falsa.» — v1 (10/11/2026). Spunto: reel Mik Cosentino Dfjft3gI_8S. Fatti: Facta, Lead Stories, IBTimes, Reuters.
import React from "react";
import { CoverSchedeC, durataEpisodio, EpisodioC, ReelSchedeC } from "./SchedeC";
import { CHIAVE_A14TAGLIO, PAROLE_A14TAGLIO } from "./a14taglio-parole";
import { FINE_VOCE, SCHEDE } from "./a14taglio-schede";

const EP: EpisodioC = {
  cartella: "a14taglio",
  numero: 14,
  parole: PAROLE_A14TAGLIO,
  chiave: CHIAVE_A14TAGLIO,
  schede: SCHEDE,
  fine: FINE_VOCE,
  finale: { righe: ["Clip vera,", "notizia", "*tagliata"], nota: "chiedi il video intero" },
};

export const DURATA_A14TAGLIO = durataEpisodio(EP);
export const A14TAGLIO: React.FC = () => <ReelSchedeC e={EP} />;
export const CoverA14TAGLIO: React.FC = () => <CoverSchedeC cartella="a14taglio" />;
